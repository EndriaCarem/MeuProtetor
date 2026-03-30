/**
 * RecentAlerts — lista das últimas ocorrências com badge de nível de ameaça
 */
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { GothicTheme } from '../theme/gothicTheme';
import { ThreatLevel } from '../services/threatAnalyzer';

export interface AlertItem {
  id: string;
  threatLevel: ThreatLevel;
  timestamp: number;
  transcript: string;
  threats: string[];
}

interface RecentAlertsProps {
  alerts: AlertItem[];
}

const LEVEL_COLORS: Record<ThreatLevel, string> = {
  none:     GothicTheme.colors.status.safe,
  low:      '#88cc00',
  medium:   GothicTheme.colors.status.warning,
  high:     '#ff6600',
  critical: GothicTheme.colors.status.critical,
};

const LEVEL_LABELS: Record<ThreatLevel, string> = {
  none:     'SEGURO',
  low:      'BAIXO',
  medium:   'MÉDIO',
  high:     'ALTO',
  critical: 'CRÍTICO',
};

function formatTime(ts: number): string {
  const d = new Date(ts);
  return d.toLocaleString('pt-BR', {
    day: '2-digit', month: '2-digit', year: '2-digit',
    hour: '2-digit', minute: '2-digit',
  });
}

function excerpt(text: string, max = 80): string {
  return text.length > max ? text.slice(0, max) + '…' : text;
}

export const RecentAlerts: React.FC<RecentAlertsProps> = ({ alerts }) => {
  const recentAlerts = alerts.slice(0, 5);

  if (recentAlerts.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>Nenhuma ocorrência registrada</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>OCORRÊNCIAS RECENTES</Text>
      {recentAlerts.map(alert => {
        const color = LEVEL_COLORS[alert.threatLevel];
        return (
          <View key={alert.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={[styles.badge, { backgroundColor: color + '22', borderColor: color }]}>
                <Text style={[styles.badgeText, { color }]}>{LEVEL_LABELS[alert.threatLevel]}</Text>
              </View>
              <Text style={styles.time}>{formatTime(alert.timestamp)}</Text>
            </View>
            {alert.transcript ? (
              <Text style={styles.transcript}>{excerpt(alert.transcript)}</Text>
            ) : null}
            {alert.threats.length > 0 && (
              <View style={styles.tagsRow}>
                {alert.threats.slice(0, 3).map((t, i) => (
                  <View key={i} style={styles.tag}>
                    <Text style={styles.tagText}>{t}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { width: '100%' },
  title: {
    color: GothicTheme.colors.text.secondary,
    fontFamily: GothicTheme.typography.fonts.heading,
    fontSize: GothicTheme.typography.sizes.xs,
    letterSpacing: 3,
    marginBottom: GothicTheme.spacing.sm,
    paddingHorizontal: GothicTheme.spacing.md,
  },
  card: {
    backgroundColor: GothicTheme.colors.bg.elevated,
    borderRadius: GothicTheme.radius.md,
    borderWidth: 1,
    borderColor: GothicTheme.colors.border.subtle,
    padding: GothicTheme.spacing.md,
    marginHorizontal: GothicTheme.spacing.md,
    marginBottom: GothicTheme.spacing.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: GothicTheme.spacing.xs,
  },
  badge: {
    borderRadius: GothicTheme.radius.pill,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  badgeText: {
    fontFamily: GothicTheme.typography.fonts.heading,
    fontSize: GothicTheme.typography.sizes.xs,
    letterSpacing: 1,
  },
  time: {
    color: GothicTheme.colors.text.muted,
    fontFamily: GothicTheme.typography.fonts.mono,
    fontSize: GothicTheme.typography.sizes.xs,
  },
  transcript: {
    color: GothicTheme.colors.text.secondary,
    fontFamily: GothicTheme.typography.fonts.body,
    fontSize: GothicTheme.typography.sizes.sm,
    lineHeight: 18,
    marginTop: 4,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginTop: GothicTheme.spacing.xs,
  },
  tag: {
    backgroundColor: GothicTheme.colors.crimson.dark,
    borderRadius: GothicTheme.radius.sm,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: GothicTheme.colors.crimson.main,
  },
  tagText: {
    color: GothicTheme.colors.crimson.glow,
    fontSize: GothicTheme.typography.sizes.xs,
    fontFamily: GothicTheme.typography.fonts.body,
  },
  empty: {
    alignItems: 'center',
    padding: GothicTheme.spacing.lg,
  },
  emptyText: {
    color: GothicTheme.colors.text.muted,
    fontFamily: GothicTheme.typography.fonts.body,
    fontSize: GothicTheme.typography.sizes.sm,
  },
});
