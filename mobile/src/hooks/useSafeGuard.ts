/**
 * Hook principal que orquestra todos os serviços do MeuProtetor
 */
import { useState, useEffect, useCallback, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { KeywordDetectionService } from '../services/keywordDetection';
import { AudioRecorderService } from '../services/audioRecorder';
import { ThreatAnalyzerService, ThreatAnalysis, ThreatLevel } from '../services/threatAnalyzer';
import { EmergencyNotifierService } from '../services/emergencyNotifier';

// TODO: configure via react-native-config or environment variable for dev/staging/prod
const API_URL = 'https://api.meuprotetor.com.br';

export type SafeGuardStatus = 'idle' | 'listening' | 'active' | 'emergency';

interface SafeGuardState {
  status: SafeGuardStatus;
  threatLevel: ThreatLevel;
  isRecording: boolean;
  lastAnalysis: ThreatAnalysis | null;
}

interface SafeGuardActions {
  triggerManually: () => void;
  deactivate: () => void;
  resolveEmergency: () => void;
}

export type UseSafeGuardReturn = SafeGuardState & SafeGuardActions;

export function useSafeGuard(): UseSafeGuardReturn {
  const [status, setStatus] = useState<SafeGuardStatus>('idle');
  const [threatLevel, setThreatLevel] = useState<ThreatLevel>('none');
  const [isRecording, setIsRecording] = useState(false);
  const [lastAnalysis, setLastAnalysis] = useState<ThreatAnalysis | null>(null);

  const keywordService = useRef<KeywordDetectionService | null>(null);
  const recorderService = useRef<AudioRecorderService | null>(null);
  const analyzerService = useRef<ThreatAnalyzerService | null>(null);
  const notifierService = useRef<EmergencyNotifierService | null>(null);
  const lastAudioPath = useRef<string | null>(null);

  const handleKeywordDetected = useCallback(async () => {
    if (status === 'emergency') return;
    setStatus('active');
    setIsRecording(true);
    await recorderService.current?.startRecording();
  }, [status]);

  const handleChunkReady = useCallback(async (filePath: string, timestamp: number) => {
    lastAudioPath.current = filePath;
    await analyzerService.current?.analyzeChunk(filePath, timestamp);
  }, []);

  const handleThreatDetected = useCallback(async (analysis: ThreatAnalysis) => {
    setLastAnalysis(analysis);
    setThreatLevel(analysis.level);
    setStatus('emergency');

    try {
      await notifierService.current?.sendEmergencyAlert(analysis, lastAudioPath.current ?? undefined);
    } catch (err) {
      console.error('[useSafeGuard] Erro ao enviar emergência:', err);
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken') ?? '';
        const userId = await AsyncStorage.getItem('userId') ?? '';
        const keywordsRaw = await AsyncStorage.getItem('keywords');
        const keywords: string[] = keywordsRaw
          ? JSON.parse(keywordsRaw)
          : ['socorro', 'ajuda', 'meuprotetor'];

        if (!mounted) return;

        recorderService.current = new AudioRecorderService(handleChunkReady);
        analyzerService.current = new ThreatAnalyzerService(API_URL, token, handleThreatDetected);
        notifierService.current = new EmergencyNotifierService(API_URL, token, userId);
        keywordService.current = new KeywordDetectionService(keywords, handleKeywordDetected);

        await keywordService.current.startListening();
        setStatus('listening');
      } catch (err) {
        console.error('[useSafeGuard] Erro de inicialização:', err);
      }
    };

    init();

    return () => {
      mounted = false;
      keywordService.current?.destroy();
      recorderService.current?.stopRecording();
    };
  }, [handleChunkReady, handleThreatDetected, handleKeywordDetected]);

  const triggerManually = useCallback(async () => {
    if (status === 'emergency') return;
    setStatus('active');
    setIsRecording(true);
    await recorderService.current?.startRecording();
  }, [status]);

  const deactivate = useCallback(async () => {
    setStatus('listening');
    setIsRecording(false);
    setThreatLevel('none');
    await recorderService.current?.stopRecording();
  }, []);

  const resolveEmergency = useCallback(async () => {
    setStatus('listening');
    setThreatLevel('none');
    setLastAnalysis(null);
    setIsRecording(false);
    await recorderService.current?.stopRecording();
  }, []);

  return {
    status,
    threatLevel,
    isRecording,
    lastAnalysis,
    triggerManually,
    deactivate,
    resolveEmergency,
  };
}
