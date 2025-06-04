import React from 'react';

import BannerCarousel from '../BannerCarousel';

// Mock React hooks
jest.mock('react', () => {
  const originalReact = jest.requireActual('react');
  return {
    ...originalReact,
    useState: jest.fn(() => [0, jest.fn()]),
    useCallback: jest.fn((fn) => fn),
  };
});

// Mock dependencies
jest.mock('tamagui', () => ({
  YStack: jest.fn(() => null),
  Stack: jest.fn(() => null),
  XStack: jest.fn(() => null),
  Image: jest.fn(() => null),
  Circle: jest.fn(() => null),
}));

// Mock Carousel component
jest.mock('react-native-reanimated-carousel', () => ({
  __esModule: true,
  default: jest.fn(() => null),
}));

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => {
  const Reanimated = jest.requireActual('react-native').View;
  Reanimated.View = jest.requireActual('react-native').View;
  return {
    ...Reanimated,
    useAnimatedStyle: () => ({}),
    interpolate: jest.fn(),
    interpolateColor: jest.fn(),
    useSharedValue: jest.fn(),
  };
});

// Mock router
jest.mock('expo-router', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
  })),
}));

// Mock Video component
jest.mock('../Video', () => jest.fn(() => null));

describe('BannerCarousel', () => {
  const mockBanners = [
    {
      type: 'IMAGE' as const,
      uri: 'https://example.com/banner1.jpg',
    },
    {
      type: 'IMAGE' as const,
      uri: 'https://example.com/banner2.jpg',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render without errors', () => {
    expect(() => {
      BannerCarousel({
        banners: mockBanners,
      });
    }).not.toThrow();
  });

  it('should render with empty banners without errors', () => {
    expect(() => {
      BannerCarousel({
        banners: [],
      });
    }).not.toThrow();
  });
});
