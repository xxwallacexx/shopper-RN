import { createAnimations } from '@tamagui/animations-react-native';
import { createInterFont } from '@tamagui/font-inter';
import { createMedia } from '@tamagui/react-native-media-driver';
import { shorthands } from '@tamagui/shorthands';
import { themes, tokens } from '@tamagui/themes';
import { XStack } from 'tamagui';
import { createTamagui, styled, SizableText, H1, YStack, Button } from 'tamagui';

const primary = process.env.EXPO_PUBLIC_PRIMARY_COLOR ?? "#000"
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
    type: "timing"
  }
});

const headingFont = createInterFont({});

const bodyFont = createInterFont();


export const Container = styled(YStack, {
  flex: 1,
  paddingHorizontal: 24,
  paddingVertical: 12
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
  color: '#8c8c8c',
  size: '$1',
});

export const AnimatedYStack = styled(YStack, {
  variants: {
    isLeft: { true: { x: -25, opacity: 0 } },
    isRight: { true: { x: 25, opacity: 0 } },
    defaultFade: { true: { opacity: 0 } },
  } as const,
})

export const StyledButton = styled(Button, {
  variants: {
    disabled: {
      true: {
        backgroundColor: "lightslategrey",
        pressStyle: { opacity: 1 }
      },
      false: {},
    }
  },
  backgroundColor: "$color.primary",
  color: "#fff",
  size: "$2",
  pressStyle: { opacity: 0.8 },
  elevation: 0.5
})

export const Badge = styled(XStack, {
  display: "flex",
  alignSelf: "flex-start",
  paddingHorizontal: 8,
  backgroundColor: "$color.primary",
  borderRadius: 4
})

export const BottomAction = styled(XStack, {
  w: "100%",
  h: "$4",
  p: "$2",
  btw: 0.5,
  borderColor: "lightslategrey",
  alignItems: "center",
  space: "$2"
})

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
  themes: {
    ...themes,
    primary: {
      background: primary,
      color: "#2d3f4f",
    },

  },
  tokens: {
    ...tokens,
    color: { primary }
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
  interface TamaguiCustomConfig extends AppConfig { }
}

export default config;
