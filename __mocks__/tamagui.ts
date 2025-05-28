import { View, Text } from 'react-native';

const mockTamagui = {
  Spinner: function MockSpinner(props: any) {
    return <View testID="spinner" {...props} />;
  },
  Stack: function MockStack({ children, ...props }: any) {
    return <View {...props}>{children}</View>;
  },
  XStack: function MockXStack({ children, ...props }: any) {
    return <View {...props}>{children}</View>;
  },
  YStack: function MockYStack({ children, ...props }: any) {
    return <View {...props}>{children}</View>;
  },
  SizableText: function MockSizableText({ children, ...props }: any) {
    return <Text {...props}>{children}</Text>;
  },
};

export const {
  Spinner,
  Stack,
  XStack,
  YStack,
  SizableText,
} = mockTamagui; 