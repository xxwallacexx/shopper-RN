import { defaultConfig } from '@tamagui/config/v4';
import { createAnimations } from '@tamagui/animations-react-native';
import { createInterFont } from '@tamagui/font-inter';
import { shorthands } from '@tamagui/shorthands';
import { themes, tokens } from '@tamagui/themes';
import { GetThemeValueForKey, XStack } from 'tamagui';
import { createTamagui, styled, SizableText, H1, YStack, Button } from 'tamagui';
import { PRIMARY_COLOR, PRIMARY_8_COLOR, PRIMARY_9_COLOR } from '@env';

const primary = PRIMARY_COLOR ?? '#000';
const primary8 = PRIMARY_8_COLOR ?? '#000';
const primary9 = PRIMARY_9_COLOR ?? '#000';

const animations = createAnimations({
  bouncy: {
    damping: 10,
    mass: 0.9,
    stiffness: 100,
    type: 'spring',
  },
  lazy: {
    damping: 20,
    type: 'spring',
    stiffness: 60,
  },
  quick: {
    damping: 20,
    mass: 1.2,
    stiffness: 250,
    type: 'spring',
  },
  '100ms': {
    duration: 100,
    type: 'timing',
  },
});

const headingFont = createInterFont({});

const bodyFont = createInterFont();

export const Container = styled(YStack, {
  f: 1,
  px: 24,
  py: 12,
});

export const Main = styled(YStack, {
  f: 1,
  jc: 'space-between',
  maw: 960,
});

export const Title = styled(H1, {
  col: '#000',
  size: '$6',
});

export const Subtitle = styled(SizableText, {
  col: '#5f5f5f',
  size: '$1',
});

export const AnimatedYStack = styled(YStack, {
  variants: {
    isLeft: { true: { x: -25, o: 0 } },
    isRight: { true: { x: 25, o: 0 } },
    defaultFade: { true: { o: 0 } },
  } as const,
});

export const StyledButton = styled(Button, {
  variants: {
    disabled: {
      true: {
        bc: tokens.color.gray9Dark,
        pressStyle: {
          bc: tokens.color.gray9Dark,
          bw: 0,
        },
      },
    },
    destructive: {
      true: {
        bc: tokens.color.red11Light,
        pressStyle: {
          bc: tokens.color.red7Light,
          bw: 0,
        },
      },
    },
  } as const,
  hoverStyle: {
    bc: '$color.primary8',
  },
  pressStyle: {
    bc: '$color.primary8',
  },
  bc: primary as GetThemeValueForKey<'backgroundColor'>,
  color: '#FFFFFF',
  size: '$2',

  // Shaddows

  shac: '#000',
  shof: {
    height: 2,
    width: 0,
  },
  shop: 0.25,
  shar: 3.84,
});

export const Badge = styled(XStack, {
  dsp: 'flex',
  als: 'flex-start',
  px: 8,
  bc: '$color.primary',
  br: 4,
});

export const BottomAction = styled(XStack, {
  w: '100%',
  h: '$4',
  p: '$2',
  btw: 0.5,
  boc: 'lightslategrey',
  ai: 'center',
  gap: '$2',
});

const config = createTamagui({
  ...defaultConfig,
  light: {
    color: {
      background: 'gray',
      text: 'black',
    },
  },
  defaultFont: 'body',
  animations,
  shouldAddPrefersColorThemes: true,
  themeClassNameOnRoot: true,
  shorthands,
  fonts: {
    body: bodyFont,
    heading: headingFont,
  },
  themes,
  tokens: {
    ...tokens,
    color: {
      primary,
      primary8,
      primary9,
    },
  },
});

type AppConfig = typeof config;

// Enable auto-completion of props shorthand (ex: jc="center") for Tamagui templates.
// Docs: https://tamagui.dev/docs/core/configuration

declare module 'tamagui' {
  interface TamaguiCustomConfig extends AppConfig {}
}

export default config;
