import { View, Text } from 'react-native';

// Create non-JSX mock components to avoid ESLint parsing issues
const mockTamagui = {
  Spinner: function MockSpinner(props) {
    return View;
  },
  Stack: function MockStack(props) {
    return View;
  },
  XStack: function MockXStack(props) {
    return View;
  },
  YStack: function MockYStack(props) {
    return View;
  },
  SizableText: function MockSizableText(props) {
    return Text;
  },
};

export const { Spinner, Stack, XStack, YStack, SizableText } = mockTamagui;
