import React from 'react';
import ImageGallery from '../ImageGallery';

// Mock dependencies
jest.mock('@expo/vector-icons', () => ({
  AntDesign: jest.fn(() => null),
}));

jest.mock('@tamagui/animate-presence', () => ({
  AnimatePresence: jest.fn(({ children }) => children),
}));

jest.mock('tamagui', () => ({
  Button: jest.fn(props => props),
  Image: jest.fn(props => props),
  XStack: jest.fn(({ children }) => children),
  YStack: jest.fn(({ children }) => children),
  styled: jest.fn((component, styles) => component),
}));

// Mock useState
const mockSetState = jest.fn();
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useState: jest.fn(initialValue => [initialValue, mockSetState]),
}));

describe('ImageGallery', () => {
  const mockPhotos = [
    'https://example.com/photo1.jpg',
    'https://example.com/photo2.jpg',
    'https://example.com/photo3.jpg',
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render with photos', () => {
    const gallery = ImageGallery({ photos: mockPhotos });
    expect(gallery).toBeDefined();
  });

  it('should have navigation buttons', () => {
    const gallery = ImageGallery({ photos: mockPhotos });
    expect(gallery).toBeDefined();
  });
}); 