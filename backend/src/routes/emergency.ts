/**
 * Rotas de emergência — detecção, análise e notificação
 */
import { Router, Request, Response } from 'express';
import multer from 'multer';
import fs from 'fs';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '../middleware/auth';
import { uploadAudioToS3 } from '../services/audioStorageService';
import { analyzeAudioFile } from '../services/threatDetectionService';
import { sendSMS, sendWhatsApp, sendEmail } from '../services/notificationService';
import { alertSocket } from '../websocket/alertSocket';
import { logger } from '../utils/logger';

export const emergencyRouter = Router();
const prisma = new PrismaClient();

// Multer: armazena temporariamente em /tmp
const upload = multer({
  dest: '/tmp/meuprotetor/',
  limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB
});

emergencyRouter.use(authMiddleware);

/**
 * POST /api/emergency — recebe alerta com áudio e notifica contatos
 */
emergencyRouter.post(
  '/',
  upload.single('audio'),
  async (req: Request, res: Response): Promise<void> => {
    const startTime = Date.now();
    const audioFile = req.file;

    let alertData: {
      latitude: number;
      longitude: number;
      threatLevel: string;
      confidence: number;
      transcript: string;
      threats: string[];
      timestamp: number;
    };

    try {
      alertData = JSON.parse(req.body.alert as string);
    } catch {
      res.status(400).json({ error: 'Campo "alert" inválido ou ausente' });
      if (audioFile) fs.unlinkSync(audioFile.path);
      return;
    }

    try {
      const userId = req.user!.userId;

      // 1. Análise IA se o servidor tiver transcrição habilitada
      let analysis = {
        level:      alertData.threatLevel,
        confidence: alertData.confidence,
        threats:    alertData.threats,
        transcript: alertData.transcript,
      };

      if (process.env.ENABLE_SERVER_TRANSCRIPTION === 'true' && audioFile) {
        try {
          const serverAnalysis = await analyzeAudioFile(audioFile.path);
          analysis = {
            level:      serverAnalysis.level,
            confidence: serverAnalysis.confidence,
            threats:    serverAnalysis.threats,
            transcript: serverAnalysis.transcript || alertData.transcript,
          };
        } catch (err) {
          logger.warn('[Emergency] Análise IA falhou, usando dados do cliente:', err);
        }
      }

      // 2. Upload do áudio para S3
      let audioKey: string | undefined;
      if (audioFile) {
        try {
          audioKey = await uploadAudioToS3(audioFile.path, userId, `emergency_${Date.now()}`);
        } catch (err) {
          logger.warn('[Emergency] Upload S3 falhou:', err);
        } finally {
          // Remove arquivo temporário
          try { fs.unlinkSync(audioFile.path); } catch (cleanupErr) {
            logger.warn('[Emergency] Falha ao remover arquivo temporário:', cleanupErr);
          }
        }
      }

      // 3. Salva emergência no banco
      const mapsUrl = `https://www.google.com/maps?q=${alertData.latitude},${alertData.longitude}`;
      const emergency = await prisma.emergency.create({
        data: {
          userId,
          latitude:   alertData.latitude,
          longitude:  alertData.longitude,
          threatLevel: analysis.level,
          confidence: analysis.confidence,
          transcript: analysis.transcript,
          audioUrl:   audioKey,
          threats:    analysis.threats,
          status:     'active',
        },
      });

      // 4. Busca contatos de emergência
      const contacts = await prisma.emergencyContact.findMany({
        where:   { userId },
        orderBy: { priority: 'asc' },
      });

      const user = await prisma.user.findUnique({ where: { id: userId } });
      const userName = user?.name ?? 'Usuário';

      const message =
        `🚨 ALERTA: ${userName} pode estar em perigo!\n` +
        `Nível: ${analysis.level.toUpperCase()}\n` +
        `Localização: ${mapsUrl}`;

      // 5. Notifica contatos em paralelo
      const notificationResults = await Promise.allSettled(
        contacts.flatMap(contact => {
          const jobs: Promise<void>[] = [];

          if (contact.phone) {
            jobs.push(sendSMS(contact.phone, message));
          }
          if (contact.whatsapp) {
            jobs.push(sendWhatsApp(contact.whatsapp, message, mapsUrl));
          }
          if (contact.email) {
            jobs.push(
              sendEmail(
                contact.email,
                `🚨 Alerta MeuProtetor: ${userName} pode estar em perigo`,
                message,
                { mapsUrl, transcript: analysis.transcript, audioUrl: audioKey },
              ),
            );
          }

          return jobs;
        }),
      );

      const notifiedCount = notificationResults.filter(r => r.status === 'fulfilled').length;

      // 6. Emite evento WebSocket
      alertSocket.emitToUser(userId, 'emergency:confirmed', {
        alertId: emergency.id,
        level:   analysis.level,
      });
      alertSocket.broadcastEmergency({ emergency, userId });

      const processingMs = Date.now() - startTime;
      logger.info(`[Emergency] Alerta processado: ${emergency.id} (${processingMs}ms)`);

      res.status(201).json({
        success:      true,
        alertId:      emergency.id,
        notified:     notifiedCount,
        processingMs,
      });
    } catch (err) {
      logger.error('[Emergency] Erro ao processar alerta:', err);
      if (audioFile) {
        try { fs.unlinkSync(audioFile.path); } catch { /* ignorar */ }
      }
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },
);

/**
 * POST /api/emergency/:id/resolve — marca emergência como resolvida
 */
emergencyRouter.post('/:id/resolve', async (req: Request, res: Response): Promise<void> => {
  try {
    const existing = await prisma.emergency.findFirst({
      where: { id: req.params.id, userId: req.user!.userId },
    });

    if (!existing) {
      res.status(404).json({ error: 'Emergência não encontrada' });
      return;
    }

    const updated = await prisma.emergency.update({
      where: { id: req.params.id },
      data:  { status: 'resolved', resolvedAt: new Date() },
    });

    alertSocket.emitToUser(req.user!.userId, 'emergency:resolved', { alertId: updated.id });
    res.json({ success: true, emergency: updated });
  } catch (err) {
    logger.error('[Emergency] Erro ao resolver emergência:', err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

/**
 * GET /api/emergency/history — lista histórico paginado de emergências
 */
emergencyRouter.get('/history', async (req: Request, res: Response): Promise<void> => {
  const page  = Math.max(1, parseInt(String(req.query.page  ?? '1'), 10));
  const limit = Math.min(50, Math.max(1, parseInt(String(req.query.limit ?? '10'), 10)));

  try {
    const [items, total] = await Promise.all([
      prisma.emergency.findMany({
        where:   { userId: req.user!.userId },
        orderBy: { createdAt: 'desc' },
        skip:    (page - 1) * limit,
        take:    limit,
      }),
      prisma.emergency.count({ where: { userId: req.user!.userId } }),
    ]);

    res.json({
      data:       items,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    logger.error('[Emergency] Erro ao listar histórico:', err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

/**
 * POST /api/analyze — analisa áudio sem criar emergência (usado pelo app)
 */
emergencyRouter.post(
  '/analyze',
  upload.single('audio'),
  async (req: Request, res: Response): Promise<void> => {
    const audioFile = req.file;

    if (!audioFile) {
      res.status(400).json({ error: 'Arquivo de áudio não fornecido' });
      return;
    }

    try {
      const analysis = await analyzeAudioFile(audioFile.path);
      res.json(analysis);
    } catch (err) {
      logger.error('[Emergency] Erro na análise:', err);
      res.status(500).json({ error: 'Erro interno do servidor' });
    } finally {
      try { fs.unlinkSync(audioFile.path); } catch { /* ignorar */ }
    }
  },
);
