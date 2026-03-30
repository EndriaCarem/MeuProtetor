/**
 * StatusOrb — orbe central animado com ondas de sonar e anel rotacionando
 */
import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import { GothicTheme } from '../theme/gothicTheme';
import { SafeGuardStatus } from '../hooks/useSafeGuard';

interface StatusOrbProps {
  status: SafeGuardStatus;
}

const STATUS_COLORS: Record<SafeGuardStatus, string> = {
  idle:       GothicTheme.colors.text.muted,
  listening:  GothicTheme.colors.status.safe,
  active:     GothicTheme.colors.status.warning,
  emergency:  GothicTheme.colors.status.critical,
};

const STATUS_LABELS: Record<SafeGuardStatus, string> = {
  idle:       'INATIVO',
  listening:  'MONITORANDO',
  active:     'GRAVANDO',
  emergency:  'EMERGÊNCIA',
};

export const StatusOrb: React.FC<StatusOrbProps> = ({ status }) => {
  const rotation = useRef(new Animated.Value(0)).current;
  const sonar1 = useRef(new Animated.Value(0)).current;
  const sonar2 = useRef(new Animated.Value(0)).current;
  const sonar3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Anel rotacionando 360° em 8s
    Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 8000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start();

    // Ondas de sonar escalonadas
    const createSonar = (anim: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(anim, {
            toValue: 1,
            duration: 2000,
            easing: Easing.out(Easing.exp),
            useNativeDriver: true,
          }),
          Animated.timing(anim, { toValue: 0, duration: 0, useNativeDriver: true }),
        ]),
      );

    createSonar(sonar1, 0).start();
    createSonar(sonar2, 666).start();
    createSonar(sonar3, 1333).start();
  }, [rotation, sonar1, sonar2, sonar3]);

  const rotationDeg = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const orbColor = STATUS_COLORS[status];

  const makeSonarStyle = (anim: Animated.Value) => ({
    opacity: anim.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0.6, 0.3, 0] }),
    transform: [{ scale: anim.interpolate({ inputRange: [0, 1], outputRange: [1, 2.8] }) }],
  });

  return (
    <View style={styles.container}>
      {/* Ondas de sonar */}
      {[sonar1, sonar2, sonar3].map((anim, i) => (
        <Animated.View
          key={i}
          style={[styles.sonarRing, { borderColor: orbColor }, makeSonarStyle(anim)]}
        />
      ))}

      {/* Anel decorativo rotacionando */}
      <Animated.View
        style={[
          styles.decorRing,
          { borderColor: orbColor, transform: [{ rotate: rotationDeg }] },
        ]}
      />

      {/* Orbe central */}
      <View style={[styles.orb, { backgroundColor: orbColor + '33', borderColor: orbColor }]}>
        <Text style={[styles.emoji, { color: orbColor }]}>
          {status === 'emergency' ? '⚠️' : status === 'active' ? '🔴' : status === 'listening' ? '🛡️' : '○'}
        </Text>
      </View>

      {/* Label de status */}
      <View style={styles.statusRow}>
        <View style={[styles.dot, { backgroundColor: orbColor }]} />
        <Text style={[styles.statusText, { color: orbColor }]}>{STATUS_LABELS[status]}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 200,
    height: 200,
  },
  sonarRing: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 1.5,
  },
  decorRing: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 1,
    borderStyle: 'dashed',
  },
  orb: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 36,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: GothicTheme.spacing.md,
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontFamily: GothicTheme.typography.fonts.heading,
    fontSize: GothicTheme.typography.sizes.sm,
    letterSpacing: 3,
  },
});
