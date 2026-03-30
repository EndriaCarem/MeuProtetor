/**
 * Rotas de autenticação — registro, login e dados do usuário
 */
import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '../middleware/auth';
import { logger } from '../utils/logger';

export const authRouter = Router();
const prisma = new PrismaClient();

const registerSchema = z.object({
  name:     z.string().min(2),
  email:    z.string().email(),
  phone:    z.string().optional(),
  password: z.string().min(8),
});

const loginSchema = z.object({
  email:    z.string().email(),
  password: z.string(),
});

function generateToken(userId: string, email: string): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET não configurado');

  return jwt.sign({ userId, email }, secret, { expiresIn: '30d' });
}

/**
 * POST /api/auth/register — cria novo usuário
 */
authRouter.post('/register', async (req: Request, res: Response): Promise<void> => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Dados inválidos', details: parsed.error.issues });
    return;
  }

  const { name, email, phone, password } = parsed.data;

  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      res.status(409).json({ error: 'Email já cadastrado' });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        phone,
        passwordHash,
        keywords: ['socorro', 'ajuda', 'meuprotetor'],
      },
      select: { id: true, name: true, email: true, phone: true, createdAt: true },
    });

    const token = generateToken(user.id, user.email);
    logger.info(`[Auth] Novo usuário registrado: ${email}`);

    res.status(201).json({ user, token });
  } catch (err) {
    logger.error('[Auth] Erro no registro:', err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

/**
 * POST /api/auth/login — autentica usuário e retorna JWT
 */
authRouter.post('/login', async (req: Request, res: Response): Promise<void> => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Dados inválidos' });
    return;
  }

  const { email, password } = parsed.data;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.isActive) {
      res.status(401).json({ error: 'Credenciais inválidas' });
      return;
    }

    const passwordValid = await bcrypt.compare(password, user.passwordHash);
    if (!passwordValid) {
      res.status(401).json({ error: 'Credenciais inválidas' });
      return;
    }

    const token = generateToken(user.id, user.email);
    logger.info(`[Auth] Login bem-sucedido: ${email}`);

    res.json({
      token,
      user: {
        id:              user.id,
        name:            user.name,
        email:           user.email,
        phone:           user.phone,
        keywords:        user.keywords,
        sensitivityLevel: user.sensitivityLevel,
      },
    });
  } catch (err) {
    logger.error('[Auth] Erro no login:', err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

/**
 * GET /api/auth/me — retorna dados do usuário autenticado
 */
authRouter.get('/me', authMiddleware, async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.userId },
      select: {
        id:               true,
        name:             true,
        email:            true,
        phone:            true,
        keywords:         true,
        sensitivityLevel: true,
        retentionDays:    true,
        createdAt:        true,
      },
    });

    if (!user) {
      res.status(404).json({ error: 'Usuário não encontrado' });
      return;
    }

    res.json(user);
  } catch (err) {
    logger.error('[Auth] Erro ao buscar usuário:', err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});
