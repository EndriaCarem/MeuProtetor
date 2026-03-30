/**
 * ContactsRing — lista horizontal de avatares dos contatos de emergência
 */
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { GothicTheme } from '../theme/gothicTheme';

export interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phone?: string;
  whatsapp?: string;
  email?: string;
}

interface ContactsRingProps {
  contacts: EmergencyContact[];
  onContactPress?: (contact: EmergencyContact) => void;
  onAddPress?: () => void;
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map(w => w[0]?.toUpperCase() ?? '')
    .join('');
}

const AVATAR_COLORS = [
  GothicTheme.colors.violet.main,
  GothicTheme.colors.crimson.main,
  '#1a6a8a',
  '#2a8a2a',
  '#8a6a1a',
];

export const ContactsRing: React.FC<ContactsRingProps> = ({
  contacts,
  onContactPress,
  onAddPress,
}) => {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.title}>CONTATOS DE EMERGÊNCIA</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {contacts.map((contact, i) => (
          <TouchableOpacity
            key={contact.id}
            style={styles.item}
            onPress={() => onContactPress?.(contact)}
          >
            <View style={[styles.avatar, { backgroundColor: AVATAR_COLORS[i % AVATAR_COLORS.length] }]}>
              <Text style={styles.initials}>{getInitials(contact.name)}</Text>
            </View>
            <Text style={styles.name} numberOfLines={1}>
              {contact.name.split(' ')[0]}
            </Text>
            <Text style={styles.relationship} numberOfLines={1}>
              {contact.relationship}
            </Text>
          </TouchableOpacity>
        ))}

        {/* Botão para adicionar contato */}
        <TouchableOpacity style={styles.item} onPress={onAddPress}>
          <View style={[styles.avatar, styles.addAvatar]}>
            <Text style={styles.addIcon}>+</Text>
          </View>
          <Text style={styles.name}>Adicionar</Text>
          <Text style={styles.relationship} />
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
  },
  title: {
    color: GothicTheme.colors.text.secondary,
    fontFamily: GothicTheme.typography.fonts.heading,
    fontSize: GothicTheme.typography.sizes.xs,
    letterSpacing: 3,
    marginBottom: GothicTheme.spacing.sm,
    paddingHorizontal: GothicTheme.spacing.md,
  },
  scrollContent: {
    paddingHorizontal: GothicTheme.spacing.md,
    gap: 16,
  },
  item: {
    alignItems: 'center',
    width: 64,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: GothicTheme.colors.border.medium,
  },
  initials: {
    color: GothicTheme.colors.text.primary,
    fontFamily: GothicTheme.typography.fonts.heading,
    fontSize: GothicTheme.typography.sizes.md,
  },
  name: {
    color: GothicTheme.colors.text.primary,
    fontFamily: GothicTheme.typography.fonts.body,
    fontSize: GothicTheme.typography.sizes.xs,
    marginTop: 4,
    textAlign: 'center',
  },
  relationship: {
    color: GothicTheme.colors.text.muted,
    fontFamily: GothicTheme.typography.fonts.body,
    fontSize: GothicTheme.typography.sizes.xs,
    textAlign: 'center',
  },
  addAvatar: {
    backgroundColor: 'transparent',
    borderStyle: 'dashed',
    borderColor: GothicTheme.colors.border.bright,
  },
  addIcon: {
    color: GothicTheme.colors.violet.glow,
    fontSize: 24,
  },
});
