/**
 * Componente SOSButton — botão circular com hold-to-activate (1500ms)
 * Exibe barra de progresso e dispara vibração ao ativar
 */
import React, { useRef, useCallback } from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  Vibration,
  View,
} from 'react-native';
import { GothicTheme } from '../theme/gothicTheme';

interface SOSButtonProps {
  onActivate: () => void;
  disabled?: boolean;
}

const HOLD_DURATION = 1500;

export const SOSButton: React.FC<SOSButtonProps> = ({ onActivate, disabled = false }) => {
  const progress = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(1)).current;
  const holdAnimation = useRef<Animated.CompositeAnimation | null>(null);
  const holdTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startPulse = useCallback(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.08, duration: 600, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 600, useNativeDriver: true }),
      ]),
    ).start();
  }, [pulse]);

  const stopPulse = useCallback(() => {
    pulse.stopAnimation();
    pulse.setValue(1);
  }, [pulse]);

  const handlePressIn = useCallback(() => {
    if (disabled) return;
    startPulse();

    holdAnimation.current = Animated.timing(progress, {
      toValue: 1,
      duration: HOLD_DURATION,
      useNativeDriver: false,
    });
    holdAnimation.current.start();

    holdTimer.current = setTimeout(() => {
      Vibration.vibrate([0, 200, 100, 200]);
      stopPulse();
      onActivate();
      progress.setValue(0);
    }, HOLD_DURATION);
  }, [disabled, onActivate, progress, startPulse, stopPulse]);

  const handlePressOut = useCallback(() => {
    if (holdTimer.current) {
      clearTimeout(holdTimer.current);
      holdTimer.current = null;
    }
    holdAnimation.current?.stop();
    stopPulse();
    Animated.timing(progress, { toValue: 0, duration: 300, useNativeDriver: false }).start();
  }, [progress, stopPulse]);

  const progressWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <TouchableWithoutFeedback onPressIn={handlePressIn} onPressOut={handlePressOut}>
      <Animated.View style={[styles.button, { transform: [{ scale: pulse }] }, disabled && styles.disabled]}>
        <View style={styles.innerRing}>
          <Text style={styles.label}>SOS</Text>
          <Text style={styles.hint}>SEGURE</Text>
        </View>
        {/* Barra de progresso na borda inferior */}
        <View style={styles.progressTrack}>
          <Animated.View style={[styles.progressBar, { width: progressWidth }]} />
        </View>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: GothicTheme.colors.crimson.dark,
    borderWidth: 3,
    borderColor: GothicTheme.colors.crimson.glow,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    ...GothicTheme.shadows.crimsonGlow,
  },
  disabled: {
    opacity: 0.4,
  },
  innerRing: {
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 1,
    borderColor: GothicTheme.colors.crimson.bright,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    color: GothicTheme.colors.text.primary,
    fontFamily: GothicTheme.typography.fonts.heading,
    fontSize: GothicTheme.typography.sizes.hero,
    letterSpacing: 4,
  },
  hint: {
    color: GothicTheme.colors.text.secondary,
    fontFamily: GothicTheme.typography.fonts.body,
    fontSize: GothicTheme.typography.sizes.xs,
    letterSpacing: 3,
    marginTop: 4,
  },
  progressTrack: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: GothicTheme.colors.crimson.dark,
  },
  progressBar: {
    height: 4,
    backgroundColor: GothicTheme.colors.crimson.glow,
  },
});
