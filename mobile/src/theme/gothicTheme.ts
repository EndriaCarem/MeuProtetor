export const GothicTheme = {
  colors: {
    bg: {
      void:     '#050508',
      deep:     '#0a0a12',
      surface:  '#10101e',
      elevated: '#16162a',
      overlay:  '#1c1c30',
    },
    crimson: {
      dark:   '#3d0010',
      main:   '#8b0020',
      bright: '#c8002e',
      glow:   '#ff003c',
    },
    violet: {
      dark:   '#1a0030',
      main:   '#5c1a8a',
      bright: '#9b3dd6',
      glow:   '#c97dff',
    },
    text: {
      primary:   '#f0e6ff',
      secondary: '#9988bb',
      muted:     '#5a4d7a',
      danger:    '#ff003c',
    },
    status: {
      safe:     '#00c87a',
      warning:  '#ffaa00',
      danger:   '#ff003c',
      critical: '#ff0055',
    },
    border: {
      subtle: '#2a1a3a',
      medium: '#4a2a6a',
      bright: '#8b3dd6',
    },
  },
  typography: {
    fonts: {
      heading: 'Cinzel-Bold',
      body:    'Raleway-Regular',
      mono:    'JetBrainsMono',
    },
    sizes: { xs: 11, sm: 13, md: 15, lg: 18, xl: 22, xxl: 28, hero: 36, giant: 48 },
  },
  spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48 },
  radius:  { sm: 4, md: 8, lg: 16, xl: 24, pill: 999 },
  shadows: {
    crimsonGlow: { shadowColor: '#ff003c', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.6, shadowRadius: 20, elevation: 12 },
    violetGlow:  { shadowColor: '#c97dff', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.5, shadowRadius: 16, elevation: 10 },
    subtleGlow:  { shadowColor: '#5c1a8a', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 12, elevation: 8 },
  },
} as const;
