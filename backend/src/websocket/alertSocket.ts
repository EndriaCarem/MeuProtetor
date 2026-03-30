/**
 * WebSocket service — gerencia conexões Socket.IO com autenticação JWT
 */
import http from 'http';
import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { logger } from '../utils/logger';
import { JwtPayload } from '../middleware/auth';

class AlertSocketService {
  private io: Server | null = null;

  /**
   * Configura o Socket.IO no servidor HTTP com autenticação JWT
   */
  setup(server: http.Server): void {
    this.io = new Server(server, {
      cors: {
        origin: process.env.ALLOWED_ORIGINS?.split(',') ?? [],
        methods: ['GET', 'POST'],
        credentials: true,
      },
    });

    // Middleware de autenticação
    this.io.use((socket: Socket, next) => {
      const token = socket.handshake.auth?.token as string | undefined;

      if (!token) {
        return next(new Error('Token de autenticação não fornecido'));
      }

      const secret = process.env.JWT_SECRET;
      if (!secret) {
        return next(new Error('Configuração inválida do servidor'));
      }

      try {
        const payload = jwt.verify(token, secret) as JwtPayload;
        socket.data.userId = payload.userId;
        socket.join(`user:${payload.userId}`);
        next();
      } catch {
        next(new Error('Token inválido ou expirado'));
      }
    });

    this.io.on('connection', (socket: Socket) => {
      const userId: string = socket.data.userId as string;
      logger.info(`[WebSocket] Usuário conectado: ${userId} (${socket.id})`);

      socket.on('disconnect', () => {
        logger.info(`[WebSocket] Usuário desconectado: ${userId} (${socket.id})`);
      });

      // Sala do admin para dashboard
      socket.on('join:admin', () => {
        socket.join('admin');
        logger.info(`[WebSocket] Admin conectado: ${socket.id}`);
      });
    });

    logger.info('[WebSocket] Socket.IO configurado');
  }

  /**
   * Emite um evento para um usuário específico
   */
  emitToUser(userId: string, event: string, data: unknown): void {
    if (!this.io) {
      logger.warn('[WebSocket] IO não inicializado');
      return;
    }
    this.io.to(`user:${userId}`).emit(event, data);
  }

  /**
   * Emite um evento de emergência para o dashboard admin
   */
  broadcastEmergency(data: unknown): void {
    if (!this.io) {
      logger.warn('[WebSocket] IO não inicializado');
      return;
    }
    this.io.to('admin').emit('emergency:new', data);
  }
}

export const alertSocket = new AlertSocketService();

export function websocketSetup(server: http.Server): void {
  alertSocket.setup(server);
}
