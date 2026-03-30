/**
 * OnboardingScreen — 3 slides de boas-vindas e configuração inicial
 */
import React, { useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GothicTheme } from '../theme/gothicTheme';

const { width } = Dimensions.get('window');

interface Slide {
  id: string;
  icon: string;
  title: string;
  subtitle: string;
  description: string;
}

const SLIDES: Slide[] = [
  {
    id: '1',
    icon: '🛡️',
    title: 'SUA PROTEÇÃO,',
    subtitle: 'SUA VOZ',
    description:
      'O MeuProtetor monitora continuamente o ambiente ao seu redor, detectando ameaças por inteligência artificial e enviando alertas imediatos para seus contatos de emergência.',
  },
  {
    id: '2',
    icon: '🎙️',
    title: 'ATIVAÇÃO POR',
    subtitle: 'PALAVRA-CHAVE',
    description:
      'Diga "socorro", "ajuda" ou qualquer palavra que você configurar. O sistema inicia automaticamente a gravação e análise de ameaças sem que ninguém perceba.',
  },
  {
    id: '3',
    icon: '👥',
    title: 'CONTATOS',
    subtitle: 'DE EMERGÊNCIA',
    description:
      'Cadastre seus contatos de confiança. Quando uma ameaça for detectada, eles receberão automaticamente sua localização, o áudio e uma transcrição do ocorrido.',
  },
];

interface OnboardingScreenProps {
  navigation: { navigate: (screen: string) => void };
}

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ navigation }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  const goToNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      const nextIndex = currentIndex + 1;
      flatListRef.current?.scrollToIndex({ index: nextIndex });
      setCurrentIndex(nextIndex);
    } else {
      navigation.navigate('Dashboard');
    }
  };

  const renderSlide = ({ item }: { item: Slide }) => (
    <View style={styles.slide}>
      <LinearGradient
        colors={['#050508', '#0a0212', '#05050f']}
        style={StyleSheet.absoluteFill}
      />

      {/* Ornamentos decorativos */}
      <View style={[styles.ornament, styles.ornamentTopRight]} />
      <View style={[styles.ornament, styles.ornamentBottomLeft]} />

      <View style={styles.slideContent}>
        {/* Ícone animado */}
        <View style={styles.iconWrapper}>
          <View style={styles.iconRing}>
            <Text style={styles.icon}>{item.icon}</Text>
          </View>
        </View>

        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.subtitle}>{item.subtitle}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <Animated.FlatList
        ref={flatListRef}
        data={SLIDES}
        renderItem={renderSlide}
        keyExtractor={item => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
          useNativeDriver: false,
        })}
        onMomentumScrollEnd={e => {
          const index = Math.round(e.nativeEvent.contentOffset.x / width);
          setCurrentIndex(index);
        }}
      />

      {/* Dots de navegação */}
      <View style={styles.dotsRow}>
        {SLIDES.map((_, i) => {
          const opacity = scrollX.interpolate({
            inputRange: [(i - 1) * width, i * width, (i + 1) * width],
            outputRange: [0.3, 1, 0.3],
            extrapolate: 'clamp',
          });
          const dotWidth = scrollX.interpolate({
            inputRange: [(i - 1) * width, i * width, (i + 1) * width],
            outputRange: [8, 24, 8],
            extrapolate: 'clamp',
          });
          return (
            <Animated.View key={i} style={[styles.dot, { opacity, width: dotWidth }]} />
          );
        })}
      </View>

      {/* Botões */}
      <View style={styles.footer}>
        <TouchableOpacity onPress={goToNext} style={styles.nextBtn}>
          <LinearGradient
            colors={[GothicTheme.colors.violet.main, GothicTheme.colors.violet.bright]}
            style={styles.nextBtnInner}
          >
            <Text style={styles.nextText}>
              {currentIndex === SLIDES.length - 1 ? 'COMEÇAR' : 'PRÓXIMO'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        {currentIndex < SLIDES.length - 1 && (
          <TouchableOpacity
            onPress={() => navigation.navigate('Dashboard')}
            style={styles.skipBtn}
          >
            <Text style={styles.skipText}>Pular</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: GothicTheme.colors.bg.void },
  slide: { width, flex: 1 },
  slideContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: GothicTheme.spacing.xl,
  },
  ornament: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    opacity: 0.06,
  },
  ornamentTopRight: {
    backgroundColor: GothicTheme.colors.violet.main,
    top: -60,
    right: -60,
  },
  ornamentBottomLeft: {
    backgroundColor: GothicTheme.colors.crimson.dark,
    bottom: 100,
    left: -80,
  },
  iconWrapper: {
    marginBottom: GothicTheme.spacing.xl,
  },
  iconRing: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: GothicTheme.colors.border.bright,
    backgroundColor: GothicTheme.colors.bg.elevated,
    alignItems: 'center',
    justifyContent: 'center',
    ...GothicTheme.shadows.violetGlow,
  },
  icon: { fontSize: 56 },
  title: {
    color: GothicTheme.colors.text.primary,
    fontFamily: GothicTheme.typography.fonts.heading,
    fontSize: GothicTheme.typography.sizes.xxl,
    letterSpacing: 3,
    textAlign: 'center',
  },
  subtitle: {
    color: GothicTheme.colors.violet.glow,
    fontFamily: GothicTheme.typography.fonts.heading,
    fontSize: GothicTheme.typography.sizes.xxl,
    letterSpacing: 3,
    textAlign: 'center',
    marginBottom: GothicTheme.spacing.lg,
  },
  description: {
    color: GothicTheme.colors.text.secondary,
    fontFamily: GothicTheme.typography.fonts.body,
    fontSize: GothicTheme.typography.sizes.md,
    textAlign: 'center',
    lineHeight: 24,
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: GothicTheme.spacing.lg,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    backgroundColor: GothicTheme.colors.violet.glow,
  },
  footer: {
    paddingHorizontal: GothicTheme.spacing.lg,
    paddingBottom: GothicTheme.spacing.xl,
    gap: GothicTheme.spacing.sm,
  },
  nextBtn: { borderRadius: GothicTheme.radius.md, overflow: 'hidden' },
  nextBtnInner: {
    paddingVertical: GothicTheme.spacing.md,
    alignItems: 'center',
  },
  nextText: {
    color: GothicTheme.colors.text.primary,
    fontFamily: GothicTheme.typography.fonts.heading,
    fontSize: GothicTheme.typography.sizes.md,
    letterSpacing: 3,
  },
  skipBtn: { alignItems: 'center', paddingVertical: GothicTheme.spacing.sm },
  skipText: {
    color: GothicTheme.colors.text.muted,
    fontFamily: GothicTheme.typography.fonts.body,
    fontSize: GothicTheme.typography.sizes.sm,
  },
});
