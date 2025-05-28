import '@testing-library/jest-native/extend-expect';

// Mock console.error to silence React JSX type errors during tests
const originalConsoleError = console.error;
console.error = (...args) => {
  // Don't log React JSX errors during tests
  if (
    typeof args[0] === 'string' && 
    (args[0].includes('React.jsx: type is invalid') || 
     args[0].includes('Invalid hook call') ||
     args[0].includes('Warning:'))
  ) {
    return;
  }
  originalConsoleError(...args);
};

// Mock FormData
global.FormData = class FormData {
  append() {}
};

// Mock fetch
global.fetch = jest.fn();

// Mock Expo modules
jest.mock('expo-router', () => ({
  useRouter: () => ({
    navigate: jest.fn(),
    push: jest.fn(),
    back: jest.fn(),
  }),
}));

jest.mock('expo-localization', () => ({
  locale: 'en',
}));

// Mock react-native Animated
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper', () => ({
  addListener: jest.fn(),
  removeListeners: jest.fn(),
  API: {},
}), { virtual: true });

// Mock @expo/vector-icons
jest.mock('@expo/vector-icons', () => ({
  AntDesign: ({ name, size, color }) => ({
    type: 'AntDesign',
    props: { name, size, color, testID: 'ant-design-icon' },
  }),
}));

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => ({
  createAnimatedComponent: (component) => component,
  useAnimatedStyle: () => ({}),
  useSharedValue: () => ({ value: 0 }),
  withRepeat: () => 0,
  withTiming: () => 0,
}));

// Create mock components
const createMockComponent = (name) => (props) => ({
  type: name,
  props: { ...props, testID: `tamagui-${name.toLowerCase()}` },
  children: props.children,
});

// Mock Tamagui components
jest.mock('tamagui', () => {
  const mockSheet = {
    Root: createMockComponent('Sheet.Root'),
    Overlay: createMockComponent('Sheet.Overlay'),
    Frame: createMockComponent('Sheet.Frame'),
  };

  const mockAlertDialog = {
    Root: ({ children, open, ...props }) => open ? {
      type: 'AlertDialog.Root',
      props: { ...props, testID: 'tamagui-alertdialog-root' },
      children,
    } : null,
    Portal: createMockComponent('AlertDialog.Portal'),
    Overlay: createMockComponent('AlertDialog.Overlay'),
    Content: createMockComponent('AlertDialog.Content'),
  };

  return {
    YStack: createMockComponent('YStack'),
    XStack: createMockComponent('XStack'),
    Stack: createMockComponent('Stack'),
    Spinner: createMockComponent('Spinner'),
    SizableText: createMockComponent('SizableText'),
    Input: createMockComponent('Input'),
    Button: createMockComponent('Button'),
    Image: createMockComponent('Image'),
    Sheet: mockSheet,
    AlertDialog: mockAlertDialog,
    styled: (component) => createMockComponent(component.name || 'StyledComponent'),
  };
});

// Mock tamagui.config
jest.mock('./tamagui.config', () => ({
  config: {},
  tokens: {},
  themes: {},
}));

// Mock react-native-toast-message
jest.mock('react-native-toast-message', () => ({
  show: jest.fn(),
}));

// Mock @tanstack/react-query hooks
jest.mock('@tanstack/react-query', () => ({
  useQuery: jest.fn(),
  useMutation: jest.fn(),
}));

// Mock custom hooks
jest.mock('~/hooks', () => ({
  useAuth: () => ({ token: 'test-token' }),
  useLocale: () => ({
    t: (key) => key === 'loading' ? 'Loading...' : key,
  }),
})); 