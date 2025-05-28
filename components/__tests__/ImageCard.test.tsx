import React from 'react';
import ImageCard from '../ImageCard';

// Mock dependencies
jest.mock('react-native', () => ({
  TouchableOpacity: jest.fn(() => null),
}));

jest.mock('tamagui', () => ({
  YStack: jest.fn(() => null),
  Image: jest.fn(() => null),
}));

describe('ImageCard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render without errors', () => {
    // We're just testing that this doesn't throw an error
    expect(() => {
      ImageCard({
        imageUri: 'https://example.com/image.jpg',
        onPhotoPress: jest.fn()
      });
    }).not.toThrow();
  });
}); 