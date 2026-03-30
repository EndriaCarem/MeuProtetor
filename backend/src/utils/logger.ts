/**
 * Logger com Winston — console colorido em dev, arquivos em prod
 */
import winston from 'winston';
import path from 'path';
import fs from 'fs';

const logsDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const { combine, timestamp, printf, colorize, errors } = winston.format;

const logFormat = printf(({ level, message, timestamp: ts, stack }) => {
  return `${ts} [${level}]: ${stack ?? message}`;
});

const transports: winston.transport[] = [
  new winston.transports.File({
    filename: path.join(logsDir, 'error.log'),
    level: 'error',
    format: combine(timestamp(), errors({ stack: true }), logFormat),
  }),
  new winston.transports.File({
    filename: path.join(logsDir, 'combined.log'),
    format: combine(timestamp(), errors({ stack: true }), logFormat),
  }),
];

if (process.env.NODE_ENV !== 'production') {
  transports.push(
    new winston.transports.Console({
      format: combine(
        colorize({ all: true }),
        timestamp({ format: 'HH:mm:ss' }),
        errors({ stack: true }),
        logFormat,
      ),
    }),
  );
}

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL ?? 'info',
  transports,
});
