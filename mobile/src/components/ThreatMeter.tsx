/**
 * ThreatMeter — barra horizontal com 5 segmentos indicando nível de ameaça
 */
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { GothicTheme } from '../theme/gothicTheme';
import { ThreatLevel } from '../services/threatAnalyzer';

interface ThreatMeterProps {
  level: ThreatLevel;
}

const SEGMENTS: { level: ThreatLevel; label: string; color: string }[] = [
  { level: 'none',     label: 'NENHUM',   color: GothicTheme.colors.status.safe },
  { level: 'low',      label: 'BAIXO',    color: '#88cc00' },
  { level: 'medium',   label: 'MÉDIO',    color: GothicTheme.colors.status.warning },
  { level: 'high',     label: 'ALTO',     color: '#ff6600' },
  { level: 'critical', label: 'CRÍTICO',  color: GothicTheme.colors.status.critical },
];

const LEVEL_INDEX: Record<ThreatLevel, number> = {
  none: 0, low: 1, medium: 2, high: 3, critical: 4,
};

export const ThreatMeter: React.FC<ThreatMeterProps> = ({ level }) => {
  const activeIndex = LEVEL_INDEX[level];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>NÍVEL DE AMEAÇA</Text>
      <View style={styles.segmentsRow}>
        {SEGMENTS.map((seg, i) => {
          const isActive = i <= activeIndex && level !== 'none';
          const isCurrent = i === activeIndex;
          return (
            <View
              key={seg.level}
              style={[
                styles.segment,
                { backgroundColor: isActive ? seg.color : GothicTheme.colors.bg.elevated },
                isCurrent && { borderWidth: 1, borderColor: seg.color },
              ]}
            />
          );
        })}
      </View>
      <View style={styles.labelsRow}>
        {SEGMENTS.map((seg, i) => (
          <Text
            key={seg.level}
            style={[
              styles.label,
              { color: i <= activeIndex && level !== 'none' ? seg.color : GothicTheme.colors.text.muted },
            ]}
          >
            {seg.label}
          </Text>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: GothicTheme.spacing.md,
  },
  title: {
    color: GothicTheme.colors.text.secondary,
    fontFamily: GothicTheme.typography.fonts.heading,
    fontSize: GothicTheme.typography.sizes.xs,
    letterSpacing: 3,
    marginBottom: GothicTheme.spacing.sm,
    textAlign: 'center',
  },
  segmentsRow: {
    flexDirection: 'row',
    gap: 4,
    height: 12,
  },
  segment: {
    flex: 1,
    borderRadius: GothicTheme.radius.sm,
  },
  labelsRow: {
    flexDirection: 'row',
    marginTop: 4,
  },
  label: {
    flex: 1,
    textAlign: 'center',
    fontFamily: GothicTheme.typography.fonts.body,
    fontSize: GothicTheme.typography.sizes.xs,
    letterSpacing: 1,
  },
});
