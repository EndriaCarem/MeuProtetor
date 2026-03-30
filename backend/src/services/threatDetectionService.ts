/**
 * Serviço de detecção de ameaças usando OpenAI Whisper + GPT-4o
 */
import OpenAI from 'openai';
import fs from 'fs';
import { logger } from '../utils/logger';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export type ThreatLevel = 'none' | 'low' | 'medium' | 'high' | 'critical';

export interface ThreatAnalysisResult {
  level: ThreatLevel;
  confidence: number;
  threats: string[];
  transcript: string;
  shouldAlert: boolean;
}

const THREAT_SYSTEM_PROMPT = `Você é um sistema especializado em análise de ameaças para proteção de mulheres.
Analise a transcrição de áudio fornecida e identifique sinais de perigo, ameaças, violência ou situações de risco.

Responda APENAS com JSON no seguinte formato:
{
  "level": "none" | "low" | "medium" | "high" | "critical",
  "confidence": 0-100,
  "threats": ["lista de ameaças identificadas"],
  "shouldAlert": true | false
}

Critérios de classificação:
- none: conversa normal, sem sinais de perigo
- low: tom levemente elevado, possível desentendimento
- medium: discussão acalorada, linguagem ofensiva
- high: ameaças verbais claras, intimidação
- critical: ameaças físicas, palavras de perigo imediato, pedidos de socorro

Considere o contexto brasileiro e linguagem coloquial.
shouldAlert = true para níveis medium, high e critical.`;

/**
 * Transcreve áudio usando OpenAI Whisper
 */
export async function transcribeAudio(audioFilePath: string): Promise<string> {
  try {
    const audioStream = fs.createReadStream(audioFilePath);

    const response = await openai.audio.transcriptions.create({
      file:     audioStream as unknown as File,
      model:    'whisper-1',
      language: 'pt',
    });

    return response.text;
  } catch (err) {
    logger.error('[ThreatDetection] Erro na transcrição:', err);
    return '';
  }
}

/**
 * Analisa ameaças em um texto de transcrição com GPT-4o
 */
export async function analyzeThreatFromTranscript(
  transcript: string,
): Promise<ThreatAnalysisResult> {
  if (!transcript.trim()) {
    return { level: 'none', confidence: 0, threats: [], transcript: '', shouldAlert: false };
  }

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: THREAT_SYSTEM_PROMPT },
        { role: 'user',   content: `Transcrição: "${transcript}"` },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.2,
    });

    const content = completion.choices[0]?.message?.content ?? '{}';
    const parsed = JSON.parse(content) as Omit<ThreatAnalysisResult, 'transcript'>;

    return { ...parsed, transcript };
  } catch (err) {
    logger.error('[ThreatDetection] Erro na análise GPT:', err);
    return { level: 'none', confidence: 0, threats: [], transcript, shouldAlert: false };
  }
}

/**
 * Pipeline completo: transcrição + análise de ameaças
 */
export async function analyzeAudioFile(audioFilePath: string): Promise<ThreatAnalysisResult> {
  const transcript = await transcribeAudio(audioFilePath);
  return analyzeThreatFromTranscript(transcript);
}
