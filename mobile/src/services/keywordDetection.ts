/**
 * Serviço de detecção de palavras-chave por voz
 * Utiliza @react-native-voice/voice para monitorar áudio em tempo real
 */
import Voice, { SpeechResultsEvent, SpeechErrorEvent } from '@react-native-voice/voice';

export class KeywordDetectionService {
  private keywords: string[];
  private isListening: boolean = false;
  private onKeywordDetected: () => void;

  constructor(keywords: string[], callback: () => void) {
    this.keywords = keywords.map(k => k.toLowerCase());
    this.onKeywordDetected = callback;
    this.setupVoiceListeners();
  }

  private setupVoiceListeners(): void {
    Voice.onSpeechResults = (event: SpeechResultsEvent) => {
      const spoken = event.value?.[0]?.toLowerCase() || '';
      const triggered = this.keywords.some(keyword => spoken.includes(keyword));
      if (triggered) {
        this.onKeywordDetected();
      }
    };

    Voice.onSpeechError = (_event: SpeechErrorEvent) => {
      console.error('[KeywordDetection] Speech error:', _event);
      // Reinicia a escuta automaticamente em caso de erro
      if (this.isListening) {
        setTimeout(() => this.startListening(), 1000);
      }
    };
  }

  async startListening(): Promise<void> {
    this.isListening = true;
    try {
      await Voice.start('pt-BR');
    } catch (err) {
      console.error('[KeywordDetection] Erro ao iniciar escuta:', err);
    }
  }

  async stopListening(): Promise<void> {
    this.isListening = false;
    try {
      await Voice.stop();
    } catch (err) {
      console.error('[KeywordDetection] Erro ao parar escuta:', err);
    }
  }

  updateKeywords(keywords: string[]): void {
    this.keywords = keywords.map(k => k.toLowerCase());
  }

  async destroy(): Promise<void> {
    this.isListening = false;
    try {
      await Voice.destroy();
    } catch (err) {
      console.error('[KeywordDetection] Erro ao destruir serviço:', err);
    }
  }
}
