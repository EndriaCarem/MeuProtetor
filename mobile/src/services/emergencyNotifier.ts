/**
 * Serviço de notificação de emergência
 * Captura localização e notifica o servidor com áudio e dados do alerta
 */
import Geolocation from '@react-native-community/geolocation';
import { ThreatAnalysis } from './threatAnalyzer';

export interface EmergencyPayload {
  userId: string;
  latitude: number;
  longitude: number;
  threatLevel: string;
  confidence: number;
  transcript: string;
  threats: string[];
  timestamp: number;
}

export interface EmergencyResponse {
  success: boolean;
  alertId: string;
  notified: number;
  processingMs: number;
}

export class EmergencyNotifierService {
  private apiUrl: string;
  private authToken: string;
  private userId: string;

  constructor(apiUrl: string, authToken: string, userId: string) {
    this.apiUrl = apiUrl;
    this.authToken = authToken;
    this.userId = userId;
  }

  /**
   * Obtém a localização atual do dispositivo
   */
  private getCurrentPosition(): Promise<{ latitude: number; longitude: number }> {
    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(
        position => {
          resolve({
            latitude:  position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        error => reject(error),
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 5000 },
      );
    });
  }

  /**
   * Envia alerta de emergência com localização e áudio opcional
   */
  async sendEmergencyAlert(
    analysis: ThreatAnalysis,
    audioFilePath?: string,
  ): Promise<EmergencyResponse> {
    let latitude = 0;
    let longitude = 0;

    try {
      const position = await this.getCurrentPosition();
      latitude = position.latitude;
      longitude = position.longitude;
    } catch (err) {
      console.warn('[EmergencyNotifier] Não foi possível obter localização:', err);
    }

    const alert: EmergencyPayload = {
      userId:     this.userId,
      latitude,
      longitude,
      threatLevel: analysis.level,
      confidence:  analysis.confidence,
      transcript:  analysis.transcript,
      threats:     analysis.threats,
      timestamp:   Date.now(),
    };

    const formData = new FormData();
    formData.append('alert', JSON.stringify(alert));

    if (audioFilePath) {
      formData.append('audio', {
        uri:  `file://${audioFilePath}`,
        type: 'audio/mp4',
        name: 'emergency_audio.mp4',
      } as unknown as Blob);
    }

    const response = await fetch(`${this.apiUrl}/api/emergency`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.authToken}`,
        Accept: 'application/json',
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Falha ao enviar emergência: ${response.status}`);
    }

    return response.json() as Promise<EmergencyResponse>;
  }

  updateToken(token: string): void {
    this.authToken = token;
  }
}
