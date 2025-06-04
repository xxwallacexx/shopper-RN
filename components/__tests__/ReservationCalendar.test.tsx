import React from 'react';

import ReservationCalendar from '../ReservationCalendar';

import { Reservation } from '~/types';

// Mock dependencies - use a direct string instead of importing from @env
jest.mock(
  '@env',
  () => ({
    PRIMARY_COLOR: '#ff0000',
  }),
  { virtual: true }
);

jest.mock('react-native-calendars', () => ({
  Calendar: jest.fn(() => null),
}));

jest.mock('@expo/vector-icons', () => ({
  AntDesign: jest.fn(() => null),
}));

jest.mock('tamagui', () => ({
  Spinner: jest.fn(() => null),
}));

describe('ReservationCalendar', () => {
  // Create a simple mock reservation
  const mockReservation: Reservation = {
    _id: '1',
    product: {
      _id: 'p1',
      name: 'Test Product',
      category: { name: 'Test Category', status: 'ACTIVE' },
      shop: {
        address: '',
        deliveryMethods: [],
        feedCover: '',
        logo: '',
        name: '',
        stores: [],
        phoneNumber: '',
        searchCover: '',
        mallDomainName: '',
        couponCover: '',
        terms: '',
      },
      cost: 0,
      description: '',
      group: '',
      introduction: '',
      isRecommended: false,
      logisticDescription: '',
      options: [],
      photos: [],
      price: 0,
      priority: 0,
      productRating: { count: 0, rating: 0 },
      stock: 0,
      productType: 'RESERVATION',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    duration: 60,
    time: new Date('2023-06-01T10:00:00Z'),
    userCountMax: 10,
    userCountMin: 1,
    options: [],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render with reservations without errors', () => {
    expect(() => {
      ReservationCalendar({
        isLoading: false,
        reservations: [mockReservation],
        onDayChange: jest.fn(),
      });
    }).not.toThrow();
  });

  it('should render while loading without errors', () => {
    expect(() => {
      ReservationCalendar({
        isLoading: true,
        reservations: [],
        onDayChange: jest.fn(),
      });
    }).not.toThrow();
  });

  it('should render with selected date without errors', () => {
    expect(() => {
      ReservationCalendar({
        isLoading: false,
        reservations: [mockReservation],
        selectedDate: '2023-06-01',
        onDayChange: jest.fn(),
      });
    }).not.toThrow();
  });
});
