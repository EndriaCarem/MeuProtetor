/**
 * EmergencyScreen — modal de emergência com countdown e botões de ação
 */
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  Vibration,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { GothicTheme } from '../theme/gothicTheme';
import { ThreatAnalysis } from '../services/threatAnalyzer';

interface EmergencyScreenProps {
  visible: boolean;
  analysis: ThreatAnalysis | null;
  onCancel: () => void;
  onConfirm: () => void;
}

const COUNTDOWN_SECONDS = 10;

export const EmergencyScreen: React.FC<EmergencyScreenProps> = ({
  visible,
  analysis,
  onCancel,
  onConfirm,
}) => {
  const [countdown, setCountdown] = useState(COUNTDOWN_SECONDS);
  const overlayAnim = useRef(new Animated.Value(0)).current;
  const sheetAnim = useRef(new Animated.Value(300)).current;
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (visible) {
      // Vibração de alerta
      Vibration.vibrate([0, 300, 100, 300, 100, 600]);

      // Animação de overlay pulsando
      Animated.loop(
        Animated.sequence([
          Animated.timing(overlayAnim, { toValue: 1, duration: 400, useNativeDriver: false }),
          Animated.timing(overlayAnim, { toValue: 0, duration: 400, useNativeDriver: false }),
        ]),
      ).start();

      // Bottom sheet subindo com spring
      Animated.spring(sheetAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 80,
        friction: 10,
      }).start();

      // Countdown regressivo
      setCountdown(COUNTDOWN_SECONDS);
      countdownRef.current = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(countdownRef.current!);
            onConfirm();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      overlayAnim.stopAnimation();
      overlayAnim.setValue(0);
      sheetAnim.setValue(300);
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
      }
    }

    return () => {
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, [visible, onConfirm, overlayAnim, sheetAnim]);

  const overlayColor = overlayAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(61,0,16,0.85)', 'rgba(140,0,35,0.85)'],
  });

  if (!visible || !analysis) return null;

  return (
    <Modal transparent animationType="fade" visible={visible} onRequestClose={onCancel}>
      <Animated.View style={[StyleSheet.absoluteFill, { backgroundColor: overlayColor }]}>
        <Animated.View style={[styles.sheet, { transform: [{ translateY: sheetAnim }] }]}>
          <LinearGradient colors={['#120008', '#0a0005']} style={styles.sheetInner}>
            {/* Ícone e título */}
            <Text style={styles.warningIcon}>⚠️</Text>
            <Text style={styles.title}>AMEAÇA DETECTADA</Text>

            {/* Transcrição */}
            {analysis.transcript ? (
              <View style={styles.transcriptBox}>
                <Text style={styles.transcriptLabel}>TRANSCRIÇÃO:</Text>
                <Text style={styles.transcriptText}>{analysis.transcript}</Text>
              </View>
            ) : null}

            {/* Tags de ameaças */}
            {analysis.threats.length > 0 && (
              <View style={styles.tagsRow}>
                {analysis.threats.map((threat, i) => (
                  <View key={i} style={styles.tag}>
                    <Text style={styles.tagText}>{threat}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Countdown */}
            <View style={styles.countdownRow}>
              <Text style={styles.countdownLabel}>AUTO-ENVIO EM</Text>
              <Text style={styles.countdown}>{countdown}s</Text>
            </View>

            {/* Botões */}
            <View style={styles.buttonsRow}>
              <TouchableOpacity style={styles.cancelBtn} onPress={onCancel}>
                <Text style={styles.cancelText}>CANCELAR</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={onConfirm} style={styles.confirmBtnWrapper}>
                <LinearGradient
                  colors={[GothicTheme.colors.crimson.main, GothicTheme.colors.crimson.bright]}
                  style={styles.confirmBtn}
                >
                  <Text style={styles.confirmText}>🚨 ENVIAR AGORA</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>

            {/* Números de emergência */}
            <Text style={styles.emergencyNumbers}>
              <Text style={styles.emergencyHighlight}>190</Text> Polícia •{' '}
              <Text style={styles.emergencyHighlight}>180</Text> Central da Mulher •{' '}
              <Text style={styles.emergencyHighlight}>192</Text> SAMU
            </Text>
          </LinearGradient>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: GothicTheme.radius.xl,
    borderTopRightRadius: GothicTheme.radius.xl,
    overflow: 'hidden',
  },
  sheetInner: {
    padding: GothicTheme.spacing.lg,
    paddingBottom: GothicTheme.spacing.xxl,
    alignItems: 'center',
  },
  warningIcon: {
    fontSize: 48,
    marginBottom: GothicTheme.spacing.sm,
  },
  title: {
    color: GothicTheme.colors.crimson.glow,
    fontFamily: GothicTheme.typography.fonts.heading,
    fontSize: GothicTheme.typography.sizes.xl,
    letterSpacing: 4,
    marginBottom: GothicTheme.spacing.md,
  },
  transcriptBox: {
    width: '100%',
    backgroundColor: GothicTheme.colors.bg.elevated,
    borderRadius: GothicTheme.radius.md,
    borderLeftWidth: 4,
    borderLeftColor: GothicTheme.colors.crimson.glow,
    padding: GothicTheme.spacing.md,
    marginBottom: GothicTheme.spacing.md,
  },
  transcriptLabel: {
    color: GothicTheme.colors.text.muted,
    fontFamily: GothicTheme.typography.fonts.heading,
    fontSize: GothicTheme.typography.sizes.xs,
    letterSpacing: 2,
    marginBottom: 4,
  },
  transcriptText: {
    color: GothicTheme.colors.text.secondary,
    fontFamily: GothicTheme.typography.fonts.body,
    fontSize: GothicTheme.typography.sizes.sm,
    lineHeight: 20,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: GothicTheme.spacing.md,
    justifyContent: 'center',
  },
  tag: {
    backgroundColor: '#2a0008',
    borderRadius: GothicTheme.radius.sm,
    borderWidth: 1,
    borderColor: GothicTheme.colors.crimson.main,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  tagText: {
    color: GothicTheme.colors.crimson.glow,
    fontFamily: GothicTheme.typography.fonts.body,
    fontSize: GothicTheme.typography.sizes.xs,
  },
  countdownRow: {
    alignItems: 'center',
    marginBottom: GothicTheme.spacing.lg,
  },
  countdownLabel: {
    color: GothicTheme.colors.text.muted,
    fontFamily: GothicTheme.typography.fonts.body,
    fontSize: GothicTheme.typography.sizes.xs,
    letterSpacing: 2,
  },
  countdown: {
    color: GothicTheme.colors.status.warning,
    fontFamily: GothicTheme.typography.fonts.heading,
    fontSize: GothicTheme.typography.sizes.hero,
  },
  buttonsRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
    marginBottom: GothicTheme.spacing.md,
  },
  cancelBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: GothicTheme.colors.border.medium,
    borderRadius: GothicTheme.radius.md,
    paddingVertical: GothicTheme.spacing.md,
    alignItems: 'center',
  },
  cancelText: {
    color: GothicTheme.colors.text.secondary,
    fontFamily: GothicTheme.typography.fonts.heading,
    fontSize: GothicTheme.typography.sizes.sm,
    letterSpacing: 2,
  },
  confirmBtnWrapper: { flex: 1 },
  confirmBtn: {
    borderRadius: GothicTheme.radius.md,
    paddingVertical: GothicTheme.spacing.md,
    alignItems: 'center',
  },
  confirmText: {
    color: GothicTheme.colors.text.primary,
    fontFamily: GothicTheme.typography.fonts.heading,
    fontSize: GothicTheme.typography.sizes.sm,
    letterSpacing: 1,
  },
  emergencyNumbers: {
    color: GothicTheme.colors.text.muted,
    fontFamily: GothicTheme.typography.fonts.body,
    fontSize: GothicTheme.typography.sizes.xs,
    textAlign: 'center',
  },
  emergencyHighlight: {
    color: GothicTheme.colors.crimson.glow,
    fontFamily: GothicTheme.typography.fonts.heading,
  },
});
