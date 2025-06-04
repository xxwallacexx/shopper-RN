import React from 'react';

import AddressForm from '../AddressForm';

import { useLocale } from '~/hooks';

// Mock dependencies
jest.mock('~/hooks', () => ({
  useLocale: jest.fn(() => ({
    t: jest.fn((key) => key),
  })),
}));

jest.mock('tamagui', () => ({
  Input: jest.fn(() => null),
  Label: jest.fn(() => null),
  YStack: jest.fn(() => null),
}));

describe('AddressForm', () => {
  const mockAddress = {
    room: '101',
    street: '123 Main St',
    district: 'Downtown',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render with address data without errors', () => {
    expect(() => {
      AddressForm({
        address: mockAddress,
        onChange: jest.fn(),
      });
    }).not.toThrow();
  });

  it('should render without address data without errors', () => {
    expect(() => {
      AddressForm({
        onChange: jest.fn(),
      });
    }).not.toThrow();
  });
});
