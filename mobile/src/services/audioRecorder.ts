/**
 * Serviço de gravação de áudio em chunks de 30 segundos
 * Utiliza react-native-audio-recorder-player para captura contínua
 */
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import RNFS from 'react-native-fs';

export type ChunkCallback = (filePath: string, timestamp: number) => void;

const CHUNK_DURATION_MS = 30_000; // 30.000 ms (30 segundos) por chunk

export class AudioRecorderService {
  private recorder: AudioRecorderPlayer;
  private isRecording: boolean = false;
  private chunkIndex: number = 0;
  private chunkTimer: ReturnType<typeof setTimeout> | null = null;
  private onChunkReady: ChunkCallback;
  private currentFilePath: string | null = null;

  constructor(onChunkReady: ChunkCallback) {
    this.recorder = new AudioRecorderPlayer();
    this.onChunkReady = onChunkReady;
  }

  async startRecording(): Promise<void> {
    if (this.isRecording) return;
    this.isRecording = true;
    this.chunkIndex = 0;
    await this.recordChunk();
  }

  private async recordChunk(): Promise<void> {
    if (!this.isRecording) return;

    const timestamp = Date.now();
    const fileName = `meuprotetor_chunk_${this.chunkIndex}_${timestamp}.mp4`;
    const filePath = `${RNFS.CachesDirectoryPath}/${fileName}`;
    this.currentFilePath = filePath;

    try {
      await this.recorder.startRecorder(filePath);
    } catch (err) {
      console.error('[AudioRecorder] Erro ao iniciar chunk:', err);
      return;
    }

    // Agenda o fim do chunk
    this.chunkTimer = setTimeout(async () => {
      if (!this.isRecording) return;

      try {
        await this.recorder.stopRecorder();
        this.onChunkReady(filePath, timestamp);
      } catch (err) {
        console.error('[AudioRecorder] Erro ao finalizar chunk:', err);
      }

      this.chunkIndex += 1;
      // Inicia próximo chunk imediatamente
      await this.recordChunk();
    }, CHUNK_DURATION_MS);
  }

  async stopRecording(): Promise<void> {
    this.isRecording = false;

    if (this.chunkTimer) {
      clearTimeout(this.chunkTimer);
      this.chunkTimer = null;
    }

    try {
      await this.recorder.stopRecorder();
      if (this.currentFilePath) {
        this.onChunkReady(this.currentFilePath, Date.now());
      }
    } catch (err) {
      console.error('[AudioRecorder] Erro ao parar gravação:', err);
    }
  }

  isActive(): boolean {
    return this.isRecording;
  }

  /**
   * Remove um chunk do cache após processamento
   */
  async deleteChunk(filePath: string): Promise<void> {
    try {
      const exists = await RNFS.exists(filePath);
      if (exists) {
        await RNFS.unlink(filePath);
      }
    } catch (err) {
      console.error('[AudioRecorder] Erro ao deletar chunk:', err);
    }
  }
}
