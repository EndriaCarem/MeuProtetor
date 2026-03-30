/**
 * Serviço de análise de ameaças
 * Envia áudio para a API do servidor e processa a resposta
 */

export type ThreatLevel = 'none' | 'low' | 'medium' | 'high' | 'critical';

export interface ThreatAnalysis {
  level: ThreatLevel;
  confidence: number;
  threats: string[];
  transcript: string;
  shouldAlert: boolean;
}

export type ThreatCallback = (analysis: ThreatAnalysis) => void;

export class ThreatAnalyzerService {
  private apiUrl: string;
  private onThreatDetected: ThreatCallback;
  private authToken: string;

  constructor(apiUrl: string, authToken: string, onThreatDetected: ThreatCallback) {
    this.apiUrl = apiUrl;
    this.authToken = authToken;
    this.onThreatDetected = onThreatDetected;
  }

  /**
   * Analisa um chunk de áudio e retorna resultado de ameaça
   */
  async analyzeChunk(filePath: string, timestamp: number): Promise<ThreatAnalysis | null> {
    try {
      const formData = new FormData();
      formData.append('audio', {
        uri: `file://${filePath}`,
        type: 'audio/mp4',
        name: `chunk_${timestamp}.mp4`,
      } as unknown as Blob);
      formData.append('timestamp', String(timestamp));

      const response = await fetch(`${this.apiUrl}/api/analyze`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.authToken}`,
          Accept: 'application/json',
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Servidor retornou ${response.status}`);
      }

      const analysis: ThreatAnalysis = await response.json();

      if (analysis.shouldAlert) {
        this.onThreatDetected(analysis);
      }

      return analysis;
    } catch (err) {
      console.error('[ThreatAnalyzer] Erro ao analisar chunk:', err);
      return null;
    }
  }

  updateToken(token: string): void {
    this.authToken = token;
  }
}
