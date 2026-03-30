/**
 * Serviço de notificações — SMS, WhatsApp e Email
 * Utiliza Twilio para SMS/WhatsApp e Nodemailer para email
 */
import twilio from 'twilio';
import nodemailer from 'nodemailer';
import { logger } from '../utils/logger';

const twilioClient = twilio(
  process.env.TWILIO_SID,
  process.env.TWILIO_TOKEN,
);

const emailTransporter = nodemailer.createTransport({
  host:   process.env.SMTP_HOST ?? 'smtp.gmail.com',
  port:   Number(process.env.SMTP_PORT ?? 465),
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

/**
 * Envia SMS via Twilio
 */
export async function sendSMS(to: string, message: string): Promise<void> {
  try {
    await twilioClient.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE ?? '',
      to,
    });
    logger.info(`[Notification] SMS enviado para ${to}`);
  } catch (err) {
    logger.error(`[Notification] Erro ao enviar SMS para ${to}:`, err);
    throw err;
  }
}

/**
 * Envia mensagem WhatsApp via Twilio
 */
export async function sendWhatsApp(
  to: string,
  message: string,
  locationUrl: string,
): Promise<void> {
  try {
    const fullMessage = `${message}\n\n📍 Localização: ${locationUrl}`;
    await twilioClient.messages.create({
      body: fullMessage,
      from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER ?? ''}`,
      to:   `whatsapp:${to}`,
    });
    logger.info(`[Notification] WhatsApp enviado para ${to}`);
  } catch (err) {
    logger.error(`[Notification] Erro ao enviar WhatsApp para ${to}:`, err);
    throw err;
  }
}

/**
 * Envia email HTML gótico com informações do alerta
 */
export async function sendEmail(
  to: string,
  subject: string,
  text: string,
  data: { audioUrl?: string; mapsUrl: string; transcript: string },
): Promise<void> {
  const html = buildEmailHtml(text, data);

  try {
    await emailTransporter.sendMail({
      from:    `"MeuProtetor" <${process.env.SMTP_USER}>`,
      to,
      subject,
      text,
      html,
    });
    logger.info(`[Notification] Email enviado para ${to}`);
  } catch (err) {
    logger.error(`[Notification] Erro ao enviar email para ${to}:`, err);
    throw err;
  }
}

function buildEmailHtml(
  text: string,
  data: { audioUrl?: string; mapsUrl: string; transcript: string },
): string {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Alerta MeuProtetor</title>
  <style>
    body { margin: 0; padding: 0; background-color: #050508; font-family: Arial, sans-serif; color: #f0e6ff; }
    .wrapper { max-width: 600px; margin: 0 auto; padding: 32px 16px; }
    .header { text-align: center; padding: 32px; border-bottom: 1px solid #2a1a3a; }
    .logo { color: #f0e6ff; font-size: 24px; letter-spacing: 4px; font-weight: bold; }
    .alert-badge { display: inline-block; background: #3d0010; border: 1px solid #ff003c; border-radius: 999px; color: #ff003c; padding: 4px 16px; font-size: 12px; letter-spacing: 2px; margin-top: 8px; }
    .card { background: #10101e; border-radius: 12px; border: 1px solid #2a1a3a; padding: 24px; margin: 24px 0; }
    .card-title { color: #9988bb; font-size: 11px; letter-spacing: 3px; margin-bottom: 8px; text-transform: uppercase; }
    .message { color: #f0e6ff; font-size: 16px; line-height: 24px; }
    .transcript-box { background: #16162a; border-left: 4px solid #ff003c; border-radius: 4px; padding: 16px; margin: 16px 0; }
    .transcript-text { color: #9988bb; font-size: 14px; line-height: 22px; font-style: italic; }
    .btn { display: inline-block; background: #8b0020; color: #f0e6ff; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-size: 14px; letter-spacing: 1px; margin-top: 16px; }
    .btn:hover { background: #c8002e; }
    .audio-link { color: #c97dff; font-size: 13px; display: block; margin-top: 12px; }
    .footer { text-align: center; padding: 24px; border-top: 1px solid #2a1a3a; color: #5a4d7a; font-size: 12px; }
    .emergency-num { color: #ff003c; font-weight: bold; font-size: 14px; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <div class="logo">🛡️ MEUPROTETOR</div>
      <span class="alert-badge">⚠️ ALERTA DE EMERGÊNCIA</span>
    </div>

    <div class="card">
      <div class="card-title">Mensagem</div>
      <p class="message">${text}</p>
    </div>

    ${data.transcript ? `
    <div class="card">
      <div class="card-title">Transcrição do Áudio</div>
      <div class="transcript-box">
        <p class="transcript-text">"${data.transcript}"</p>
      </div>
    </div>
    ` : ''}

    <div class="card">
      <div class="card-title">Ações</div>
      <a href="${data.mapsUrl}" class="btn">📍 Ver Localização no Mapa</a>
      ${data.audioUrl ? `<a href="${data.audioUrl}" class="audio-link">🎙️ Ouvir Gravação</a>` : ''}
    </div>

    <div class="footer">
      <p>Em caso de perigo imediato, ligue:</p>
      <p>
        <span class="emergency-num">190</span> Polícia •
        <span class="emergency-num">180</span> Central da Mulher •
        <span class="emergency-num">192</span> SAMU
      </p>
      <p style="margin-top: 16px; color: #2a1a3a;">
        Este alerta foi enviado automaticamente pelo sistema MeuProtetor.
      </p>
    </div>
  </div>
</body>
</html>`;
}
