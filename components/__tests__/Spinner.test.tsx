import React from 'react';
import { render, screen } from '@testing-library/react-native';
import Spinner from '../Spinner';

// Mock @expo/vector-icons
jest.mock('@expo/vector-icons', () => ({
  AntDesign: jest.fn(props => props),
}));

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => {
  const mockAnimated = {
    View: jest.fn(({ children }) => children),
  };
  
  return {
    ...mockAnimated,
    useSharedValue: jest.fn(() => ({ value: 0 })),
    useAnimatedStyle: jest.fn(() => ({})),
    withRepeat: jest.fn(() => 0),
    withTiming: jest.fn(() => 0),
    default: mockAnimated,
  };
});

describe('Spinner', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render with default props', () => {
    const spinner = Spinner({});
    expect(spinner).toBeDefined();
  });

  it('should render with custom size', () => {
    const size = 24;
    const spinner = Spinner({ size });
    expect(spinner).toBeDefined();
  });

  it('should render with custom color', () => {
    const color = 'red';
    const spinner = Spinner({ color });
    expect(spinner).toBeDefined();
  });
}); 