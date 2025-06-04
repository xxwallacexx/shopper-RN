import React from 'react';

import ProductCard from '../ProductCard';

// Mock dependencies
jest.mock('~/hooks', () => ({
  useLocale: jest.fn(() => ({
    t: jest.fn((key) => key),
  })),
}));

jest.mock('tamagui', () => ({
  Image: jest.fn(() => null),
  SizableText: jest.fn(() => null),
  Text: jest.fn(() => null),
  YStack: jest.fn(() => null),
}));

jest.mock('~/tamagui.config', () => ({
  Badge: jest.fn(({ children }) => children),
}));

describe('ProductCard', () => {
  const mockProps = {
    imageUri: 'https://example.com/product.jpg',
    price: 99.99,
    name: 'Test Product',
    categoryName: 'Test Category',
    introduction: 'This is a test product',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render without errors', () => {
    expect(() => {
      ProductCard(mockProps);
    }).not.toThrow();
  });

  it('should render with zero price without errors', () => {
    expect(() => {
      ProductCard({
        ...mockProps,
        price: 0,
      });
    }).not.toThrow();
  });
});
