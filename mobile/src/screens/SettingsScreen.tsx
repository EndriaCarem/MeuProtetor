/**
 * SettingsScreen — configurações completas: palavras-chave, sensibilidade,
 * contatos de emergência, privacidade e teste de alerta
 */
import React, { useState } from 'react';
import {
  Alert,
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GothicTheme } from '../theme/gothicTheme';
import { EmergencyContact } from '../components/ContactsRing';

interface SettingsScreenProps {
  navigation: { goBack: () => void };
}

const RETENTION_OPTIONS = [
  { label: '7 dias', value: 7 },
  { label: '30 dias', value: 30 },
  { label: '90 dias', value: 90 },
  { label: 'Nunca', value: -1 },
];

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ navigation }) => {
  const [keywords, setKeywords] = useState(['socorro', 'ajuda', 'meuprotetor']);
  const [newKeyword, setNewKeyword] = useState('');
  const [sensitivity, setSensitivity] = useState(3);
  const [retentionDays, setRetentionDays] = useState(30);
  const [serverAnalysis, setServerAnalysis] = useState(true);
  const [contacts, setContacts] = useState<EmergencyContact[]>([
    { id: '1', name: 'Maria Silva', relationship: 'Mãe', phone: '+5511999999999' },
  ]);

  // Estado para novo contato
  const [newContact, setNewContact] = useState<Omit<EmergencyContact, 'id'>>({
    name: '', relationship: '', phone: '', whatsapp: '', email: '',
  });
  const [showAddContact, setShowAddContact] = useState(false);

  const addKeyword = () => {
    const kw = newKeyword.trim().toLowerCase();
    if (kw && !keywords.includes(kw)) {
      setKeywords(prev => [...prev, kw]);
      setNewKeyword('');
    }
  };

  const removeKeyword = (kw: string) => {
    setKeywords(prev => prev.filter(k => k !== kw));
  };

  const addContact = () => {
    if (!newContact.name.trim()) {
      Alert.alert('Erro', 'O nome do contato é obrigatório.');
      return;
    }
    const contact: EmergencyContact = {
      ...newContact,
      id: String(Date.now()),
    };
    setContacts(prev => [...prev, contact]);
    setNewContact({ name: '', relationship: '', phone: '', whatsapp: '', email: '' });
    setShowAddContact(false);
  };

  const removeContact = (id: string) => {
    Alert.alert('Remover Contato', 'Tem certeza que deseja remover este contato?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Remover', style: 'destructive', onPress: () => setContacts(prev => prev.filter(c => c.id !== id)) },
    ]);
  };

  const testAlert = () => {
    Alert.alert('Teste de Alerta', 'Alerta de teste enviado para seus contatos de emergência!');
  };

  const SENSITIVITY_LABELS = ['', 'Conservador', 'Moderado', 'Equilibrado', 'Sensível', 'Agressivo'];

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={GothicTheme.colors.bg.void} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>CONFIGURAÇÕES</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* Palavras-chave */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>PALAVRAS-CHAVE</Text>
          <Text style={styles.sectionDesc}>Palavras que ativam o sistema automaticamente</Text>

          <View style={styles.chipsRow}>
            {keywords.map(kw => (
              <TouchableOpacity key={kw} style={styles.chip} onPress={() => removeKeyword(kw)}>
                <Text style={styles.chipText}>{kw}</Text>
                <Text style={styles.chipRemove}>✕</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              value={newKeyword}
              onChangeText={setNewKeyword}
              placeholder="Nova palavra-chave..."
              placeholderTextColor={GothicTheme.colors.text.muted}
              onSubmitEditing={addKeyword}
            />
            <TouchableOpacity style={styles.addBtn} onPress={addKeyword}>
              <Text style={styles.addBtnText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Sensibilidade da IA */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>SENSIBILIDADE DA IA</Text>
          <Text style={styles.sectionDesc}>
            {SENSITIVITY_LABELS[sensitivity]} — Nível {sensitivity}/5
          </Text>
          <View style={styles.sliderRow}>
            {[1, 2, 3, 4, 5].map(n => (
              <TouchableOpacity
                key={n}
                style={[styles.sliderDot, sensitivity >= n && styles.sliderDotActive]}
                onPress={() => setSensitivity(n)}
              />
            ))}
          </View>
          <View style={styles.sliderLabels}>
            <Text style={styles.sliderLabel}>Conservador</Text>
            <Text style={styles.sliderLabel}>Agressivo</Text>
          </View>
        </View>

        {/* Contatos de emergência */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>CONTATOS DE EMERGÊNCIA</Text>

          {contacts.map(contact => (
            <View key={contact.id} style={styles.contactCard}>
              <View style={styles.contactInfo}>
                <Text style={styles.contactName}>{contact.name}</Text>
                <Text style={styles.contactRelationship}>{contact.relationship}</Text>
                {contact.phone ? <Text style={styles.contactDetail}>📞 {contact.phone}</Text> : null}
                {contact.whatsapp ? <Text style={styles.contactDetail}>💬 {contact.whatsapp}</Text> : null}
                {contact.email ? <Text style={styles.contactDetail}>✉️ {contact.email}</Text> : null}
              </View>
              <TouchableOpacity style={styles.removeBtn} onPress={() => removeContact(contact.id)}>
                <Text style={styles.removeBtnText}>🗑️</Text>
              </TouchableOpacity>
            </View>
          ))}

          {showAddContact ? (
            <View style={styles.addContactForm}>
              {(['name', 'relationship', 'phone', 'whatsapp', 'email'] as const).map(field => (
                <TextInput
                  key={field}
                  style={styles.input}
                  value={newContact[field]}
                  onChangeText={val => setNewContact(prev => ({ ...prev, [field]: val }))}
                  placeholder={
                    field === 'name' ? 'Nome *' :
                    field === 'relationship' ? 'Relação (ex: Mãe)' :
                    field === 'phone' ? 'Telefone' :
                    field === 'whatsapp' ? 'WhatsApp' : 'Email'
                  }
                  placeholderTextColor={GothicTheme.colors.text.muted}
                  keyboardType={field === 'email' ? 'email-address' : field === 'phone' || field === 'whatsapp' ? 'phone-pad' : 'default'}
                />
              ))}
              <View style={styles.formButtons}>
                <TouchableOpacity style={styles.cancelFormBtn} onPress={() => setShowAddContact(false)}>
                  <Text style={styles.cancelFormText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.saveFormBtn} onPress={addContact}>
                  <Text style={styles.saveFormText}>Salvar</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <TouchableOpacity style={styles.addContactBtn} onPress={() => setShowAddContact(true)}>
              <Text style={styles.addContactBtnText}>+ Adicionar Contato</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Privacidade */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>PRIVACIDADE</Text>

          <Text style={styles.fieldLabel}>Deletar gravações após:</Text>
          <View style={styles.retentionRow}>
            {RETENTION_OPTIONS.map(opt => (
              <TouchableOpacity
                key={opt.value}
                style={[styles.retentionChip, retentionDays === opt.value && styles.retentionChipActive]}
                onPress={() => setRetentionDays(opt.value)}
              >
                <Text style={[
                  styles.retentionChipText,
                  retentionDays === opt.value && styles.retentionChipTextActive,
                ]}>
                  {opt.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.toggleRow}>
            <View>
              <Text style={styles.toggleLabel}>Análise no servidor</Text>
              <Text style={styles.toggleDesc}>Usa IA avançada (OpenAI)</Text>
            </View>
            <Switch
              value={serverAnalysis}
              onValueChange={setServerAnalysis}
              trackColor={{ false: GothicTheme.colors.bg.elevated, true: GothicTheme.colors.violet.main }}
              thumbColor={serverAnalysis ? GothicTheme.colors.violet.glow : GothicTheme.colors.text.muted}
            />
          </View>
        </View>

        {/* Botão de teste */}
        <TouchableOpacity style={styles.testBtn} onPress={testAlert}>
          <Text style={styles.testBtnText}>🔔 TESTAR ALERTA</Text>
        </TouchableOpacity>

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
  scroll: { flex: 1 },
  content: { padding: GothicTheme.spacing.md, paddingBottom: GothicTheme.spacing.xxl },

  section: {
    backgroundColor: GothicTheme.colors.bg.surface,
    borderRadius: GothicTheme.radius.lg,
    borderWidth: 1,
    borderColor: GothicTheme.colors.border.subtle,
    padding: GothicTheme.spacing.md,
    marginBottom: GothicTheme.spacing.md,
  },
  sectionTitle: {
    color: GothicTheme.colors.text.primary,
    fontFamily: GothicTheme.typography.fonts.heading,
    fontSize: GothicTheme.typography.sizes.sm,
    letterSpacing: 3,
    marginBottom: 4,
  },
  sectionDesc: {
    color: GothicTheme.colors.text.muted,
    fontFamily: GothicTheme.typography.fonts.body,
    fontSize: GothicTheme.typography.sizes.xs,
    marginBottom: GothicTheme.spacing.md,
  },

  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: GothicTheme.spacing.sm },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: GothicTheme.colors.violet.dark,
    borderRadius: GothicTheme.radius.pill,
    borderWidth: 1,
    borderColor: GothicTheme.colors.violet.main,
    paddingHorizontal: 10,
    paddingVertical: 4,
    gap: 6,
  },
  chipText: {
    color: GothicTheme.colors.violet.glow,
    fontFamily: GothicTheme.typography.fonts.body,
    fontSize: GothicTheme.typography.sizes.sm,
  },
  chipRemove: { color: GothicTheme.colors.text.muted, fontSize: 10 },

  inputRow: { flexDirection: 'row', gap: 8 },
  input: {
    flex: 1,
    backgroundColor: GothicTheme.colors.bg.elevated,
    borderRadius: GothicTheme.radius.md,
    borderWidth: 1,
    borderColor: GothicTheme.colors.border.medium,
    color: GothicTheme.colors.text.primary,
    fontFamily: GothicTheme.typography.fonts.body,
    fontSize: GothicTheme.typography.sizes.sm,
    paddingHorizontal: GothicTheme.spacing.md,
    paddingVertical: GothicTheme.spacing.sm,
    marginBottom: GothicTheme.spacing.sm,
  },
  addBtn: {
    backgroundColor: GothicTheme.colors.violet.main,
    borderRadius: GothicTheme.radius.md,
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtnText: { color: GothicTheme.colors.text.primary, fontSize: 22 },

  sliderRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    marginVertical: GothicTheme.spacing.md,
  },
  sliderDot: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    backgroundColor: GothicTheme.colors.bg.elevated,
    borderWidth: 1,
    borderColor: GothicTheme.colors.border.medium,
  },
  sliderDotActive: { backgroundColor: GothicTheme.colors.violet.main, borderColor: GothicTheme.colors.violet.bright },
  sliderLabels: { flexDirection: 'row', justifyContent: 'space-between' },
  sliderLabel: {
    color: GothicTheme.colors.text.muted,
    fontFamily: GothicTheme.typography.fonts.body,
    fontSize: GothicTheme.typography.sizes.xs,
  },

  contactCard: {
    flexDirection: 'row',
    backgroundColor: GothicTheme.colors.bg.elevated,
    borderRadius: GothicTheme.radius.md,
    borderWidth: 1,
    borderColor: GothicTheme.colors.border.subtle,
    padding: GothicTheme.spacing.md,
    marginBottom: GothicTheme.spacing.sm,
  },
  contactInfo: { flex: 1 },
  contactName: {
    color: GothicTheme.colors.text.primary,
    fontFamily: GothicTheme.typography.fonts.heading,
    fontSize: GothicTheme.typography.sizes.md,
  },
  contactRelationship: {
    color: GothicTheme.colors.violet.glow,
    fontFamily: GothicTheme.typography.fonts.body,
    fontSize: GothicTheme.typography.sizes.sm,
  },
  contactDetail: {
    color: GothicTheme.colors.text.secondary,
    fontFamily: GothicTheme.typography.fonts.body,
    fontSize: GothicTheme.typography.sizes.xs,
    marginTop: 2,
  },
  removeBtn: { padding: 4 },
  removeBtnText: { fontSize: 18 },

  addContactForm: { gap: 8 },
  formButtons: { flexDirection: 'row', gap: 8, marginTop: 4 },
  cancelFormBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: GothicTheme.colors.border.medium,
    borderRadius: GothicTheme.radius.md,
    paddingVertical: GothicTheme.spacing.sm,
    alignItems: 'center',
  },
  cancelFormText: { color: GothicTheme.colors.text.secondary, fontFamily: GothicTheme.typography.fonts.body, fontSize: GothicTheme.typography.sizes.sm },
  saveFormBtn: {
    flex: 1,
    backgroundColor: GothicTheme.colors.violet.main,
    borderRadius: GothicTheme.radius.md,
    paddingVertical: GothicTheme.spacing.sm,
    alignItems: 'center',
  },
  saveFormText: { color: GothicTheme.colors.text.primary, fontFamily: GothicTheme.typography.fonts.heading, fontSize: GothicTheme.typography.sizes.sm },
  addContactBtn: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: GothicTheme.colors.border.bright,
    borderRadius: GothicTheme.radius.md,
    paddingVertical: GothicTheme.spacing.md,
    alignItems: 'center',
  },
  addContactBtnText: { color: GothicTheme.colors.violet.glow, fontFamily: GothicTheme.typography.fonts.body, fontSize: GothicTheme.typography.sizes.sm },

  fieldLabel: {
    color: GothicTheme.colors.text.secondary,
    fontFamily: GothicTheme.typography.fonts.body,
    fontSize: GothicTheme.typography.sizes.sm,
    marginBottom: GothicTheme.spacing.sm,
  },
  retentionRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap', marginBottom: GothicTheme.spacing.md },
  retentionChip: {
    borderRadius: GothicTheme.radius.pill,
    borderWidth: 1,
    borderColor: GothicTheme.colors.border.medium,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  retentionChipActive: { backgroundColor: GothicTheme.colors.violet.dark, borderColor: GothicTheme.colors.violet.bright },
  retentionChipText: { color: GothicTheme.colors.text.muted, fontFamily: GothicTheme.typography.fonts.body, fontSize: GothicTheme.typography.sizes.sm },
  retentionChipTextActive: { color: GothicTheme.colors.violet.glow },

  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: GothicTheme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: GothicTheme.colors.border.subtle,
  },
  toggleLabel: { color: GothicTheme.colors.text.primary, fontFamily: GothicTheme.typography.fonts.body, fontSize: GothicTheme.typography.sizes.sm },
  toggleDesc: { color: GothicTheme.colors.text.muted, fontFamily: GothicTheme.typography.fonts.body, fontSize: GothicTheme.typography.sizes.xs },

  testBtn: {
    backgroundColor: GothicTheme.colors.crimson.dark,
    borderRadius: GothicTheme.radius.md,
    borderWidth: 1,
    borderColor: GothicTheme.colors.crimson.main,
    paddingVertical: GothicTheme.spacing.md,
    alignItems: 'center',
    marginTop: GothicTheme.spacing.sm,
  },
  testBtnText: {
    color: GothicTheme.colors.crimson.glow,
    fontFamily: GothicTheme.typography.fonts.heading,
    fontSize: GothicTheme.typography.sizes.md,
    letterSpacing: 2,
  },
});
