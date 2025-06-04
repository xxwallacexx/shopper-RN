import React from 'react';

import CouponCard from '../CouponCard';

// Mock dependencies
jest.mock('~/hooks', () => ({
  useLocale: jest.fn(() => ({
    t: jest.fn((key, params) => {
      if (key === 'couponCredit' && params?.credit) {
        return `${params.credit} credits`;
      }
      return key;
    }),
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

// Mock moment - simplified to avoid TypeScript errors
jest.mock('moment', () => () => ({
  format: () => '2023-12-31 23:59',
}));

describe('CouponCard', () => {
  const mockProps = {
    imageUri: 'https://example.com/coupon.jpg',
    name: 'Test Coupon',
    endDate: new Date('2023-12-31T23:59:59Z'),
    credit: 10,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render without errors', () => {
    expect(() => {
      CouponCard(mockProps);
    }).not.toThrow();
  });

  it('should render with zero credit without errors', () => {
    expect(() => {
      CouponCard({
        ...mockProps,
        credit: 0,
      });
    }).not.toThrow();
  });

  it('should render with past end date without errors', () => {
    expect(() => {
      CouponCard({
        ...mockProps,
        endDate: new Date('2022-01-01T00:00:00Z'),
      });
    }).not.toThrow();
  });
});
