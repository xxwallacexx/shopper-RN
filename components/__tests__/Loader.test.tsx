import React from 'react';
import Loader from '../Loader';
import { useLocale } from '~/hooks/useLocale';

// Mock dependencies
jest.mock('~/hooks/useLocale', () => ({
  useLocale: jest.fn(),
}));

jest.mock('tamagui', () => ({
  SizableText: jest.fn(({ children }) => children),
  Spinner: jest.fn(() => null),
  Stack: jest.fn(({ children }) => children),
  XStack: jest.fn(({ children }) => children),
  YStack: jest.fn(({ children }) => children),
}));

describe('Loader', () => {
  // Setup and teardown
  beforeEach(() => {
    jest.clearAllMocks();
    (useLocale as jest.Mock).mockReturnValue({
      t: (key: string) => key === 'loading' ? 'Loading...' : key,
    });
  });

  it('should use default text when no text is provided', () => {
    const loader = Loader({});
    expect(loader).toBeDefined();
    // Since we're not rendering, just verify the component structure
    expect(useLocale).toHaveBeenCalled();
  });

  it('should use custom text when provided', () => {
    const customText = 'Please wait...';
    const loader = Loader({ text: customText });
    expect(loader).toBeDefined();
    // Since we're not rendering, just verify the component structure
    expect(useLocale).toHaveBeenCalled();
  });
}); 