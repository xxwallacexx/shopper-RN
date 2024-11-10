import { createAnimations } from '@tamagui/animations-react-native';
import { createInterFont } from '@tamagui/font-inter';
import { createMedia } from '@tamagui/react-native-media-driver';
import { shorthands } from '@tamagui/shorthands';
import { themes, tokens } from '@tamagui/themes';
import { XStack } from 'tamagui';
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
  flex: 1,
  paddingHorizontal: 24,
  paddingVertical: 12,
});

export const Main = styled(YStack, {
  flex: 1,
  justifyContent: 'space-between',
  maxWidth: 960,
});

export const Title = styled(H1, {
  color: '#000',
  size: '$6',
});

export const Subtitle = styled(SizableText, {
  color: '#5f5f5f',
  size: '$1',
});

export const AnimatedYStack = styled(YStack, {
  variants: {
    isLeft: { true: { x: -25, opacity: 0 } },
    isRight: { true: { x: 25, opacity: 0 } },
    defaultFade: { true: { opacity: 0 } },
  } as const,
});

export const StyledButton = styled(Button, {
  variants: {
    disabled: {
      true: {
        backgroundColor: tokens.color.gray9Dark,
        pressStyle: {
          backgroundColor: tokens.color.gray9Dark,
          borderWidth: 0,
        },
      },
    },
    destructive: {
      true: {
        backgroundColor: tokens.color.red11Light,
        pressStyle: {
          backgroundColor: tokens.color.red7Light,
          borderWidth: 0,
        },
      },
    },
  },
  hoverStyle: {
    backgroundColor: '$color.primary8',
  },
  pressStyle: {
    backgroundColor: '$color.primary8',
  },
  backgroundColor: primary,
  color: '#fff',
  size: '$2',

  // Shaddows
  shadowColor: '#000',
  shadowOffset: {
    height: 2,
    width: 0,
  },
  shadowOpacity: 0.25,
  shadowRadius: 3.84,
});

export const Badge = styled(XStack, {
  display: 'flex',
  alignSelf: 'flex-start',
  paddingHorizontal: 8,
  backgroundColor: '$color.primary',
  borderRadius: 4,
});

export const BottomAction = styled(XStack, {
  w: '100%',
  h: '$4',
  p: '$2',
  btw: 0.5,
  borderColor: 'lightslategrey',
  alignItems: 'center',
  space: '$2',
});

const config = createTamagui({
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
  media: createMedia({
    xs: { maxWidth: 660 },
    sm: { maxWidth: 800 },
    md: { maxWidth: 1020 },
    lg: { maxWidth: 1280 },
    xl: { maxWidth: 1420 },
    xxl: { maxWidth: 1600 },
    gtXs: { minWidth: 660 + 1 },
    gtSm: { minWidth: 800 + 1 },
    gtMd: { minWidth: 1020 + 1 },
    gtLg: { minWidth: 1280 + 1 },
    short: { maxHeight: 820 },
    tall: { minHeight: 820 },
    hoverNone: { hover: 'none' },
    pointerCoarse: { pointer: 'coarse' },
  }),
});

type AppConfig = typeof config;

// Enable auto-completion of props shorthand (ex: jc="center") for Tamagui templates.
// Docs: https://tamagui.dev/docs/core/configuration

declare module 'tamagui' {
  interface TamaguiCustomConfig extends AppConfig {}
}

export default config;
