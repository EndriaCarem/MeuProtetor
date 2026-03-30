/**
 * DashboardScreen — tela principal do MeuProtetor
 * Header gótico, orbe de status, botão SOS, medidor de ameaças e contatos
 */
import React, { useState } from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GothicTheme } from '../theme/gothicTheme';
import { useSafeGuard } from '../hooks/useSafeGuard';
import { StatusOrb } from '../components/StatusOrb';
import { SOSButton } from '../components/SOSButton';
import { ThreatMeter } from '../components/ThreatMeter';
import { ContactsRing, EmergencyContact } from '../components/ContactsRing';
import { RecentAlerts, AlertItem } from '../components/RecentAlerts';

interface DashboardScreenProps {
  navigation: {
    navigate: (screen: string) => void;
  };
}

// Dados de exemplo para demonstração
const SAMPLE_CONTACTS: EmergencyContact[] = [
  { id: '1', name: 'Maria Silva', relationship: 'Mãe', phone: '+5511999999999' },
  { id: '2', name: 'João Santos', relationship: 'Irmão', phone: '+5511888888888' },
];

const SAMPLE_ALERTS: AlertItem[] = [
  {
    id: '1',
    threatLevel: 'high',
    timestamp: Date.now() - 3_600_000,
    transcript: 'Voz elevada detectada, possível situação de conflito...',
    threats: ['ameaça verbal', 'linguagem agressiva'],
  },
];

export const DashboardScreen: React.FC<DashboardScreenProps> = ({ navigation }) => {
  const { status, threatLevel, isRecording, triggerManually } = useSafeGuard();
  const [recordings] = useState(12);
  const [alerts] = useState(3);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={GothicTheme.colors.bg.void} />

      {/* Fundo com gradiente gótico */}
      <LinearGradient
        colors={['#050508', '#0a0212', '#05050f']}
        style={StyleSheet.absoluteFill}
      />

      {/* Blobs decorativos */}
      <View style={[styles.blob, styles.blobViolet]} />
      <View style={[styles.blob, styles.blobCrimson]} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.logo}>MEUPROTETOR</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('Settings')}
            style={styles.settingsBtn}
          >
            <Text style={styles.settingsIcon}>⚙️</Text>
          </TouchableOpacity>
        </View>

        {/* Orbe central */}
        <View style={styles.orbContainer}>
          <StatusOrb status={status} />
        </View>

        {/* Botão SOS */}
        <View style={styles.sosContainer}>
          <SOSButton onActivate={triggerManually} disabled={status === 'emergency'} />
        </View>

        {/* Medidor de ameaças */}
        <View style={styles.section}>
          <ThreatMeter level={threatLevel} />
        </View>

        {/* Info Cards */}
        <View style={styles.cardsRow}>
          <View style={styles.infoCard}>
            <Text style={styles.cardIcon}>🎙️</Text>
            <Text style={styles.cardValue}>{recordings}</Text>
            <Text style={styles.cardLabel}>GRAVAÇÕES</Text>
          </View>
          <View style={styles.infoCard}>
            <Text style={styles.cardIcon}>🚨</Text>
            <Text style={styles.cardValue}>{alerts}</Text>
            <Text style={styles.cardLabel}>ALERTAS</Text>
          </View>
          <View style={[styles.infoCard, isRecording && styles.infoCardActive]}>
            <Text style={styles.cardIcon}>{isRecording ? '🔴' : '🛡️'}</Text>
            <Text style={styles.cardValue}>{isRecording ? 'SIM' : 'NÃO'}</Text>
            <Text style={styles.cardLabel}>MONITORANDO</Text>
          </View>
        </View>

        {/* Contatos de emergência */}
        <View style={styles.section}>
          <ContactsRing
            contacts={SAMPLE_CONTACTS}
            onAddPress={() => navigation.navigate('Settings')}
          />
        </View>

        {/* Ocorrências recentes */}
        <View style={styles.section}>
          <RecentAlerts alerts={SAMPLE_ALERTS} />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Em caso de emergência ligue{' '}
            <Text style={styles.footerHighlight}>190</Text> (Polícia) ou{' '}
            <Text style={styles.footerHighlight}>180</Text> (Central da Mulher)
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: GothicTheme.colors.bg.void },
  scroll: { flex: 1 },
  content: { paddingBottom: GothicTheme.spacing.xxl },

  blob: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    opacity: 0.07,
  },
  blobViolet: {
    backgroundColor: GothicTheme.colors.violet.main,
    top: -60,
    right: -80,
  },
  blobCrimson: {
    backgroundColor: GothicTheme.colors.crimson.dark,
    bottom: 100,
    left: -100,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: GothicTheme.spacing.md,
    paddingTop: GothicTheme.spacing.md,
    paddingBottom: GothicTheme.spacing.lg,
  },
  logo: {
    color: GothicTheme.colors.text.primary,
    fontFamily: GothicTheme.typography.fonts.heading,
    fontSize: GothicTheme.typography.sizes.xl,
    letterSpacing: 4,
  },
  settingsBtn: { padding: 8 },
  settingsIcon: { fontSize: 22 },

  orbContainer: {
    alignItems: 'center',
    marginVertical: GothicTheme.spacing.lg,
  },

  sosContainer: {
    alignItems: 'center',
    marginVertical: GothicTheme.spacing.lg,
  },

  section: {
    marginVertical: GothicTheme.spacing.md,
  },

  cardsRow: {
    flexDirection: 'row',
    paddingHorizontal: GothicTheme.spacing.md,
    gap: 8,
    marginVertical: GothicTheme.spacing.md,
  },
  infoCard: {
    flex: 1,
    backgroundColor: GothicTheme.colors.bg.elevated,
    borderRadius: GothicTheme.radius.md,
    borderWidth: 1,
    borderColor: GothicTheme.colors.border.subtle,
    padding: GothicTheme.spacing.md,
    alignItems: 'center',
  },
  infoCardActive: {
    borderColor: GothicTheme.colors.crimson.main,
  },
  cardIcon: { fontSize: 20, marginBottom: 4 },
  cardValue: {
    color: GothicTheme.colors.text.primary,
    fontFamily: GothicTheme.typography.fonts.heading,
    fontSize: GothicTheme.typography.sizes.lg,
  },
  cardLabel: {
    color: GothicTheme.colors.text.muted,
    fontFamily: GothicTheme.typography.fonts.body,
    fontSize: GothicTheme.typography.sizes.xs,
    letterSpacing: 1,
    marginTop: 2,
  },

  footer: {
    marginTop: GothicTheme.spacing.xl,
    paddingHorizontal: GothicTheme.spacing.lg,
    alignItems: 'center',
  },
  footerText: {
    color: GothicTheme.colors.text.muted,
    fontFamily: GothicTheme.typography.fonts.body,
    fontSize: GothicTheme.typography.sizes.xs,
    textAlign: 'center',
    lineHeight: 18,
  },
  footerHighlight: {
    color: GothicTheme.colors.crimson.glow,
    fontFamily: GothicTheme.typography.fonts.heading,
  },
});
