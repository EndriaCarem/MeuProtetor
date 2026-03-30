/**
 * HistoryScreen — histórico completo de ocorrências com filtros por nível
 */
import React, { useState } from 'react';
import {
  Alert,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GothicTheme } from '../theme/gothicTheme';
import { ThreatLevel } from '../services/threatAnalyzer';

interface HistoryScreenProps {
  navigation: { goBack: () => void };
}

interface HistoryItem {
  id: string;
  threatLevel: ThreatLevel;
  createdAt: Date;
  transcript: string;
  threats: string[];
  audioUrl?: string;
  latitude?: number;
  longitude?: number;
}

const SAMPLE_HISTORY: HistoryItem[] = [
  {
    id: '1',
    threatLevel: 'high',
    createdAt: new Date(Date.now() - 86_400_000),
    transcript: 'Voz elevada detectada, possível situação de conflito com linguagem agressiva.',
    threats: ['ameaça verbal', 'linguagem agressiva'],
    audioUrl: 'https://example.com/audio1.mp4',
    latitude: -23.5505,
    longitude: -46.6333,
  },
  {
    id: '2',
    threatLevel: 'medium',
    createdAt: new Date(Date.now() - 2 * 86_400_000),
    transcript: 'Discussão acalorada identificada, sem ameaças físicas diretas.',
    threats: ['conflito verbal'],
    audioUrl: 'https://example.com/audio2.mp4',
  },
  {
    id: '3',
    threatLevel: 'critical',
    createdAt: new Date(Date.now() - 5 * 86_400_000),
    transcript: 'Ameaça física identificada, palavras de perigo imediato detectadas.',
    threats: ['ameaça física', 'palavrão', 'perigo imediato'],
    audioUrl: 'https://example.com/audio3.mp4',
    latitude: -23.5489,
    longitude: -46.6388,
  },
  {
    id: '4',
    threatLevel: 'low',
    createdAt: new Date(Date.now() - 7 * 86_400_000),
    transcript: 'Tom de voz elevado sem ameaças identificadas.',
    threats: [],
  },
];

const LEVEL_COLORS: Record<ThreatLevel, string> = {
  none:     GothicTheme.colors.status.safe,
  low:      '#88cc00',
  medium:   GothicTheme.colors.status.warning,
  high:     '#ff6600',
  critical: GothicTheme.colors.status.critical,
};

const LEVEL_LABELS: Record<ThreatLevel, string> = {
  none: 'SEGURO', low: 'BAIXO', medium: 'MÉDIO', high: 'ALTO', critical: 'CRÍTICO',
};

const FILTER_OPTIONS: Array<{ value: ThreatLevel | 'all'; label: string }> = [
  { value: 'all', label: 'TODOS' },
  { value: 'critical', label: 'CRÍTICO' },
  { value: 'high', label: 'ALTO' },
  { value: 'medium', label: 'MÉDIO' },
  { value: 'low', label: 'BAIXO' },
];

function formatDateTime(date: Date): string {
  return date.toLocaleString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

export const HistoryScreen: React.FC<HistoryScreenProps> = ({ navigation }) => {
  const [activeFilter, setActiveFilter] = useState<ThreatLevel | 'all'>('all');

  const filtered = activeFilter === 'all'
    ? SAMPLE_HISTORY
    : SAMPLE_HISTORY.filter(item => item.threatLevel === activeFilter);

  const openMap = (item: HistoryItem) => {
    if (!item.latitude || !item.longitude) {
      Alert.alert('Localização', 'Localização não disponível para esta ocorrência.');
      return;
    }
    Alert.alert(
      'Localização',
      `Lat: ${item.latitude.toFixed(6)}\nLng: ${item.longitude.toFixed(6)}`,
    );
  };

  const playAudio = (item: HistoryItem) => {
    if (!item.audioUrl) {
      Alert.alert('Áudio', 'Gravação não disponível.');
      return;
    }
    Alert.alert('Áudio', `Reproduzindo: ${item.audioUrl}`);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={GothicTheme.colors.bg.void} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>HISTÓRICO</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Filtros */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filtersRow}
        style={styles.filtersScroll}
      >
        {FILTER_OPTIONS.map(opt => {
          const isActive = activeFilter === opt.value;
          const color = opt.value === 'all'
            ? GothicTheme.colors.violet.glow
            : LEVEL_COLORS[opt.value as ThreatLevel];
          return (
            <TouchableOpacity
              key={opt.value}
              style={[
                styles.filterChip,
                { borderColor: isActive ? color : GothicTheme.colors.border.subtle },
                isActive && { backgroundColor: color + '22' },
              ]}
              onPress={() => setActiveFilter(opt.value)}
            >
              <Text style={[styles.filterChipText, { color: isActive ? color : GothicTheme.colors.text.muted }]}>
                {opt.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Lista de ocorrências */}
      <ScrollView style={styles.list} contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
        {filtered.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>Nenhuma ocorrência encontrada</Text>
          </View>
        ) : (
          filtered.map(item => {
            const color = LEVEL_COLORS[item.threatLevel];
            return (
              <View key={item.id} style={styles.card}>
                {/* Card header */}
                <View style={styles.cardHeader}>
                  <View style={[styles.levelBadge, { backgroundColor: color + '22', borderColor: color }]}>
                    <Text style={[styles.levelBadgeText, { color }]}>{LEVEL_LABELS[item.threatLevel]}</Text>
                  </View>
                  <Text style={styles.dateText}>{formatDateTime(item.createdAt)}</Text>
                </View>

                {/* Transcrição */}
                {item.transcript ? (
                  <Text style={styles.transcript} numberOfLines={3}>
                    {item.transcript}
                  </Text>
                ) : null}

                {/* Tags de ameaças */}
                {item.threats.length > 0 && (
                  <View style={styles.tagsRow}>
                    {item.threats.map((t, i) => (
                      <View key={i} style={styles.tag}>
                        <Text style={styles.tagText}>{t}</Text>
                      </View>
                    ))}
                  </View>
                )}

                {/* Ações */}
                <View style={styles.actionsRow}>
                  {item.audioUrl && (
                    <TouchableOpacity style={styles.actionBtn} onPress={() => playAudio(item)}>
                      <Text style={styles.actionBtnText}>▶ OUVIR</Text>
                    </TouchableOpacity>
                  )}
                  {(item.latitude && item.longitude) && (
                    <TouchableOpacity style={[styles.actionBtn, styles.mapBtn]} onPress={() => openMap(item)}>
                      <Text style={styles.actionBtnText}>📍 MAPA</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: GothicTheme.colors.bg.void },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: GothicTheme.spacing.md,
    paddingVertical: GothicTheme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: GothicTheme.colors.border.subtle,
  },
  backBtn: { width: 40, alignItems: 'flex-start' },
  backIcon: { color: GothicTheme.colors.violet.glow, fontSize: 22 },
  headerTitle: {
    color: GothicTheme.colors.text.primary,
    fontFamily: GothicTheme.typography.fonts.heading,
    fontSize: GothicTheme.typography.sizes.lg,
    letterSpacing: 4,
  },

  filtersScroll: { maxHeight: 52 },
  filtersRow: {
    paddingHorizontal: GothicTheme.spacing.md,
    paddingVertical: GothicTheme.spacing.sm,
    gap: 8,
  },
  filterChip: {
    borderRadius: GothicTheme.radius.pill,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 5,
  },
  filterChipText: {
    fontFamily: GothicTheme.typography.fonts.heading,
    fontSize: GothicTheme.typography.sizes.xs,
    letterSpacing: 1,
  },

  list: { flex: 1 },
  listContent: {
    padding: GothicTheme.spacing.md,
    paddingBottom: GothicTheme.spacing.xxl,
    gap: GothicTheme.spacing.md,
  },
  empty: {
    alignItems: 'center',
    paddingVertical: GothicTheme.spacing.xxl,
  },
  emptyText: {
    color: GothicTheme.colors.text.muted,
    fontFamily: GothicTheme.typography.fonts.body,
    fontSize: GothicTheme.typography.sizes.sm,
  },

  card: {
    backgroundColor: GothicTheme.colors.bg.elevated,
    borderRadius: GothicTheme.radius.lg,
    borderWidth: 1,
    borderColor: GothicTheme.colors.border.subtle,
    padding: GothicTheme.spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: GothicTheme.spacing.sm,
  },
  levelBadge: {
    borderRadius: GothicTheme.radius.pill,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  levelBadgeText: {
    fontFamily: GothicTheme.typography.fonts.heading,
    fontSize: GothicTheme.typography.sizes.xs,
    letterSpacing: 1,
  },
  dateText: {
    color: GothicTheme.colors.text.muted,
    fontFamily: GothicTheme.typography.fonts.mono,
    fontSize: GothicTheme.typography.sizes.xs,
  },
  transcript: {
    color: GothicTheme.colors.text.secondary,
    fontFamily: GothicTheme.typography.fonts.body,
    fontSize: GothicTheme.typography.sizes.sm,
    lineHeight: 20,
    marginBottom: GothicTheme.spacing.sm,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginBottom: GothicTheme.spacing.sm,
  },
  tag: {
    backgroundColor: GothicTheme.colors.crimson.dark,
    borderRadius: GothicTheme.radius.sm,
    borderWidth: 1,
    borderColor: GothicTheme.colors.crimson.main,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  tagText: {
    color: GothicTheme.colors.crimson.glow,
    fontFamily: GothicTheme.typography.fonts.body,
    fontSize: GothicTheme.typography.sizes.xs,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: GothicTheme.spacing.xs,
  },
  actionBtn: {
    borderWidth: 1,
    borderColor: GothicTheme.colors.violet.main,
    borderRadius: GothicTheme.radius.md,
    paddingHorizontal: GothicTheme.spacing.md,
    paddingVertical: GothicTheme.spacing.xs,
  },
  mapBtn: {
    borderColor: GothicTheme.colors.crimson.main,
  },
  actionBtnText: {
    color: GothicTheme.colors.text.secondary,
    fontFamily: GothicTheme.typography.fonts.heading,
    fontSize: GothicTheme.typography.sizes.xs,
    letterSpacing: 1,
  },
});
