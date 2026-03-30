/**
 * Serviço de armazenamento de áudio no AWS S3
 * Criptografia no lado do servidor com AES256
 */
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import fs from 'fs';
import path from 'path';
import { logger } from '../utils/logger';

const s3 = new S3Client({
  region: process.env.AWS_REGION ?? 'sa-east-1',
  credentials: {
    accessKeyId:     process.env.AWS_ACCESS_KEY_ID ?? '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? '',
  },
});

const BUCKET = process.env.S3_BUCKET ?? 'meuprotetor-audio-encrypted';

/**
 * Faz upload de um arquivo de áudio para o S3 com criptografia AES256
 */
export async function uploadAudioToS3(
  localFilePath: string,
  userId: string,
  alertId: string,
): Promise<string> {
  const ext = path.extname(localFilePath) || '.mp4';
  const key = `audio/${userId}/${alertId}${ext}`;

  const fileBuffer = fs.readFileSync(localFilePath);

  await s3.send(
    new PutObjectCommand({
      Bucket:                  BUCKET,
      Key:                     key,
      Body:                    fileBuffer,
      ContentType:             'audio/mp4',
      ServerSideEncryption:    'AES256',
    }),
  );

  logger.info(`[AudioStorage] Upload concluído: ${key}`);
  return key;
}

/**
 * Gera uma URL pré-assinada para download temporário (24 horas)
 */
export async function getAudioSignedUrl(key: string): Promise<string> {
  const command = new GetObjectCommand({ Bucket: BUCKET, Key: key });
  return getSignedUrl(s3, command, { expiresIn: 86_400 });
}

/**
 * Remove um arquivo do S3
 */
export async function deleteAudioFromS3(key: string): Promise<void> {
  await s3.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: key }));
  logger.info(`[AudioStorage] Arquivo deletado: ${key}`);
}
