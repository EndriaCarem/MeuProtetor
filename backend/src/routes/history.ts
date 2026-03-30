/**
 * Rotas de histórico de ocorrências e gravações
 */
import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '../middleware/auth';
import { getAudioSignedUrl } from '../services/audioStorageService';
import { logger } from '../utils/logger';

export const historyRouter = Router();
const prisma = new PrismaClient();

historyRouter.use(authMiddleware);

type ThreatLevelFilter = 'none' | 'low' | 'medium' | 'high' | 'critical';

/**
 * GET /api/history — lista ocorrências com filtros
 * Query params: threatLevel, startDate, endDate, page, limit
 */
historyRouter.get('/', async (req: Request, res: Response): Promise<void> => {
  const {
    threatLevel,
    startDate,
    endDate,
    page = '1',
    limit = '20',
  } = req.query as Record<string, string>;

  const pageNum = Math.max(1, parseInt(page, 10));
  const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
  const skip = (pageNum - 1) * limitNum;

  const whereClause: Record<string, unknown> = { userId: req.user!.userId };

  const validLevels: ThreatLevelFilter[] = ['none', 'low', 'medium', 'high', 'critical'];
  if (threatLevel && validLevels.includes(threatLevel as ThreatLevelFilter)) {
    whereClause.threatLevel = threatLevel;
  }

  if (startDate || endDate) {
    whereClause.createdAt = {
      ...(startDate ? { gte: new Date(startDate) } : {}),
      ...(endDate   ? { lte: new Date(endDate)   } : {}),
    };
  }

  try {
    const [emergencies, recordings, total] = await Promise.all([
      prisma.emergency.findMany({
        where:   whereClause,
        orderBy: { createdAt: 'desc' },
        skip,
        take:    limitNum,
        select: {
          id: true, threatLevel: true, confidence: true,
          transcript: true, audioUrl: true, threats: true,
          latitude: true, longitude: true, status: true,
          createdAt: true, resolvedAt: true,
        },
      }),
      prisma.recording.findMany({
        where:   whereClause,
        orderBy: { analyzedAt: 'desc' },
        skip,
        take:    limitNum,
      }),
      prisma.emergency.count({ where: whereClause }),
    ]);

    res.json({
      data: emergencies,
      recordings,
      pagination: {
        page:    pageNum,
        limit:   limitNum,
        total,
        pages:   Math.ceil(total / limitNum),
      },
    });
  } catch (err) {
    logger.error('[History] Erro ao listar histórico:', err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

/**
 * GET /api/history/:id — detalhes de uma ocorrência com URL de áudio assinada
 */
historyRouter.get('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const emergency = await prisma.emergency.findFirst({
      where: { id: req.params.id, userId: req.user!.userId },
    });

    if (!emergency) {
      res.status(404).json({ error: 'Ocorrência não encontrada' });
      return;
    }

    // Gera URL pré-assinada se houver áudio
    let audioSignedUrl: string | undefined;
    if (emergency.audioUrl) {
      try {
        audioSignedUrl = await getAudioSignedUrl(emergency.audioUrl);
      } catch {
        logger.warn(`[History] Não foi possível gerar URL assinada: ${emergency.audioUrl}`);
      }
    }

    res.json({ ...emergency, audioSignedUrl });
  } catch (err) {
    logger.error('[History] Erro ao buscar ocorrência:', err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});
