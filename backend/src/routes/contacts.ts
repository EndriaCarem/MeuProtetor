/**
 * Rotas de contatos de emergência — CRUD completo
 */
import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '../middleware/auth';
import { logger } from '../utils/logger';

export const contactsRouter = Router();
const prisma = new PrismaClient();

contactsRouter.use(authMiddleware);

const contactSchema = z.object({
  name:         z.string().min(2),
  relationship: z.string().min(1),
  phone:        z.string().optional(),
  whatsapp:     z.string().optional(),
  email:        z.string().email().optional().or(z.literal('')),
  priority:     z.number().int().min(1).max(10).optional().default(1),
});

/**
 * GET /api/contacts — lista contatos do usuário autenticado
 */
contactsRouter.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const contacts = await prisma.emergencyContact.findMany({
      where:   { userId: req.user!.userId },
      orderBy: { priority: 'asc' },
    });
    res.json(contacts);
  } catch (err) {
    logger.error('[Contacts] Erro ao listar contatos:', err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

/**
 * POST /api/contacts — cria novo contato de emergência
 */
contactsRouter.post('/', async (req: Request, res: Response): Promise<void> => {
  const parsed = contactSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Dados inválidos', details: parsed.error.issues });
    return;
  }

  // Valida que pelo menos um método de contato foi fornecido
  const { phone, whatsapp, email, ...rest } = parsed.data;
  if (!phone && !whatsapp && !email) {
    res.status(400).json({ error: 'Informe pelo menos um método de contato (telefone, WhatsApp ou email)' });
    return;
  }

  try {
    const contact = await prisma.emergencyContact.create({
      data: {
        ...rest,
        phone,
        whatsapp,
        email: email || null,
        userId: req.user!.userId,
      },
    });
    logger.info(`[Contacts] Contato criado: ${contact.id}`);
    res.status(201).json(contact);
  } catch (err) {
    logger.error('[Contacts] Erro ao criar contato:', err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

/**
 * PUT /api/contacts/:id — atualiza contato de emergência
 */
contactsRouter.put('/:id', async (req: Request, res: Response): Promise<void> => {
  const parsed = contactSchema.partial().safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Dados inválidos', details: parsed.error.issues });
    return;
  }

  try {
    // Verifica que o contato pertence ao usuário
    const existing = await prisma.emergencyContact.findFirst({
      where: { id: req.params.id, userId: req.user!.userId },
    });

    if (!existing) {
      res.status(404).json({ error: 'Contato não encontrado' });
      return;
    }

    const updated = await prisma.emergencyContact.update({
      where: { id: req.params.id },
      data:  parsed.data,
    });
    res.json(updated);
  } catch (err) {
    logger.error('[Contacts] Erro ao atualizar contato:', err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

/**
 * DELETE /api/contacts/:id — remove contato de emergência
 */
contactsRouter.delete('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const existing = await prisma.emergencyContact.findFirst({
      where: { id: req.params.id, userId: req.user!.userId },
    });

    if (!existing) {
      res.status(404).json({ error: 'Contato não encontrado' });
      return;
    }

    await prisma.emergencyContact.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (err) {
    logger.error('[Contacts] Erro ao deletar contato:', err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});
