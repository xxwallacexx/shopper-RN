import '@testing-library/jest-native/extend-expect';

// Mock console.error to silence React JSX type errors during tests
const originalConsoleError = console.error;
console.error = (...args) => {
  // Don't log React JSX errors during tests
  if (
    typeof args[0] === 'string' &&
    (args[0].includes('React.jsx: type is invalid') ||
      args[0].includes('Invalid hook call') ||
      args[0].includes('Warning:') ||
      args[0].includes('Missing tamagui config'))
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
jest.mock(
  'react-native/Libraries/Animated/NativeAnimatedHelper',
  () => ({
    addListener: jest.fn(),
    removeListeners: jest.fn(),
    API: {},
  }),
  { virtual: true }
);

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
  withSpring: () => 0,
  Easing: {
    bezier: () => ({}),
  },
}));

// Create mock components
const createMockComponent = (name) => (props) => ({
  type: name,
  props: { ...props, testID: `tamagui-${name.toLowerCase()}` },
  children: props.children,
});

// Mock Tamagui components
jest.mock('tamagui', () => {
  // Don't use requireActual as it causes issues
  return {
    // Basic components
    Text: ({ children }) => children,
    View: ({ children }) => children,
    XStack: ({ children }) => children,
    YStack: ({ children }) => children,
    ZStack: ({ children }) => children,
    Stack: ({ children }) => children,
    Separator: ({ children }) => children,
    SizableText: ({ children }) => children,
    Spinner: ({ children }) => children,
    Input: ({ children }) => children,
    Label: ({ children }) => children,
    Button: ({ children }) => children,
    H1: ({ children }) => children,
    H2: ({ children }) => children,
    H3: ({ children }) => children,
    H4: ({ children }) => children,
    H5: ({ children }) => children,
    H6: ({ children }) => children,
    Paragraph: ({ children }) => children,

    // Hooks and functions
    createTamagui: () => ({
      config: {
        animations: {},
        fonts: {},
        tokens: {
          color: {
            primary: '#000000',
            primary8: '#222222',
            primary9: '#333333',
          },
        },
        themes: {
          light: {
            background: '#ffffff',
            color: '#000000',
          },
          dark: {
            background: '#000000',
            color: '#ffffff',
          },
        },
      },
    }),
    useTheme: () => ({
      background: '#ffffff',
      color: '#000000',
    }),
    useMedia: () => ({
      sm: false,
      md: true,
      lg: false,
      xl: false,
      short: false,
      tall: true,
      hoverNone: false,
      pointerCoarse: false,
    }),
    styled: () => {
      const StyledComponent = ({ children }) => children;
      StyledComponent.displayName = 'StyledComponent';
      return StyledComponent;
    },
    createStyledContext: () => ({}),
    createTheme: () => ({}),
    getTokens: () => ({}),
    getVariable: () => '',
    getVariableName: () => '',
    getVariableValue: () => '',
    createFont: () => ({}),
    createTamagui: () => ({}),
    createTokens: () => ({}),
    createVariables: () => ({}),
    isVariable: () => false,
    useIsomorphicLayoutEffect: () => {},
    withStaticProperties: () => ({}),
  };
});

// Mock tamagui.config.ts
jest.mock('./tamagui.config', () => {
  return {
    StyledButton: ({ children, ...props }) => children,
    Container: ({ children, ...props }) => children,
    Main: ({ children, ...props }) => children,
    Title: ({ children, ...props }) => children,
    Subtitle: ({ children, ...props }) => children,
    AnimatedYStack: ({ children, ...props }) => children,
    Badge: ({ children, ...props }) => children,
    BottomAction: ({ children, ...props }) => children,
    default: {
      animations: {},
      fonts: {},
      tokens: {
        color: {
          primary: '#000000',
          primary8: '#222222',
          primary9: '#333333',
        },
      },
      themes: {
        light: {
          background: '#ffffff',
          color: '#000000',
        },
        dark: {
          background: '#000000',
          color: '#ffffff',
        },
      },
    },
  };
});

// Mock react-native-toast-message
jest.mock('react-native-toast-message', () => ({
  show: jest.fn(),
}));

// Mock @tanstack/react-query hooks
jest.mock('@tanstack/react-query', () => ({
  useQuery: jest.fn(),
  useMutation: jest.fn(),
}));

// Mock @tamagui/themes
jest.mock('@tamagui/themes', () => ({
  tokens: {
    color: {
      white: '#ffffff',
      black: '#000000',
      gray: '#888888',
    },
    size: {
      $1: 4,
      $2: 8,
      $3: 12,
      $4: 16,
      $5: 20,
    },
    space: {
      $1: 4,
      $2: 8,
      $3: 12,
      $4: 16,
      $5: 20,
    },
    radius: {
      $1: 4,
      $2: 8,
      $3: 12,
    },
    zIndex: {
      $1: 1,
      $2: 2,
      $3: 3,
    },
  },
  themes: {
    light: {
      background: '#ffffff',
      color: '#000000',
    },
    dark: {
      background: '#000000',
      color: '#ffffff',
    },
  },
}));

// Mock custom hooks
jest.mock('~/hooks', () => ({
  useAuth: () => ({ token: 'test-token' }),
  useLocale: () => ({
    t: (key) => (key === 'loading' ? 'Loading...' : key),
  }),
}));

// Mock react-native-reanimated-carousel
jest.mock('react-native-reanimated-carousel', () => {
  return {
    __esModule: true,
    default: createMockComponent('Carousel'),
  };
});

// Mock @tamagui/web
jest.mock('@tamagui/web', () => {
  const mockConfig = {
    animations: {},
    defaultProps: {},
    tokens: {},
    themes: {},
    shorthands: {},
  };

  return {
    createTamagui: () => mockConfig,
    getConfig: () => mockConfig,
    setupDev: () => {},
    isWeb: false,
    isTouchable: true,
  };
});

// Mock expo-video
jest.mock('expo-video', () => ({
  useVideoPlayer: () => ({
    play: jest.fn(),
    pause: jest.fn(),
    seekTo: jest.fn(),
  }),
  VideoView: createMockComponent('VideoView'),
}));

// Mock moti/skeleton
jest.mock('moti/skeleton', () => ({
  Skeleton: createMockComponent('Skeleton'),
}));

// Mock @stripe/stripe-react-native
jest.mock('@stripe/stripe-react-native', () => ({
  CardField: createMockComponent('CardField'),
  PlatformPay: {
    isPlatformPaySupported: jest.fn().mockResolvedValue(true),
  },
  PlatformPayButton: createMockComponent('PlatformPayButton'),
  useStripe: () => ({
    createPaymentMethod: jest.fn().mockResolvedValue({ paymentMethod: { id: 'test-pm-id' } }),
    handleNextAction: jest.fn().mockResolvedValue({ paymentIntent: { status: 'Succeeded' } }),
  }),
}));

// Mock react-native-calendars
jest.mock('react-native-calendars', () => ({
  Calendar: ({ children }) => children,
}));

// Mock expo-image-picker
jest.mock('expo-image-picker', () => ({
  launchImageLibraryAsync: jest.fn().mockResolvedValue({
    canceled: false,
    assets: [{ uri: 'test-uri.jpg' }],
  }),
  launchCameraAsync: jest.fn().mockResolvedValue({
    canceled: false,
    assets: [{ uri: 'test-camera-uri.jpg' }],
  }),
  MediaTypeOptions: {
    Images: 'Images',
    Videos: 'Videos',
    All: 'All',
  },
  requestMediaLibraryPermissionsAsync: jest.fn().mockResolvedValue({ status: 'granted' }),
  requestCameraPermissionsAsync: jest.fn().mockResolvedValue({ status: 'granted' }),
}));

// Mock expo-camera
jest.mock('expo-camera', () => ({
  CameraView: createMockComponent('CameraView'),
  useCameraPermissions: jest.fn().mockReturnValue([{ granted: true }, jest.fn()]),
  CameraType: {
    front: 'front',
    back: 'back',
  },
  FlashMode: {
    on: 'on',
    off: 'off',
    auto: 'auto',
  },
}));

// Mock expo-linking
jest.mock('expo-linking', () => ({
  createURL: jest.fn(),
  openURL: jest.fn(),
  canOpenURL: jest.fn().mockResolvedValue(true),
  openSettings: jest.fn(),
  useURL: jest.fn(),
  useInitialURL: jest.fn(),
  parse: jest.fn(),
  parseInitialURLAsync: jest.fn(),
}));

// Mock expo-image-manipulator
jest.mock('expo-image-manipulator', () => ({
  manipulateAsync: jest.fn().mockResolvedValue({ uri: 'manipulated-image.jpg' }),
  SaveFormat: {
    JPEG: 'jpeg',
    PNG: 'png',
  },
  FlipType: {
    Horizontal: 'horizontal',
    Vertical: 'vertical',
  },
}));

// Mock react-native-htmlview
jest.mock('react-native-htmlview', () => ({
  __esModule: true,
  default: createMockComponent('HTMLView'),
}));
