import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import axios from 'axios';
import React from 'react';

// Import the components we want to test
import ProductDetail from '../../product/[productId]/index';
import Home from '../index';

// Import the API functions to mock them
import { listProducts, getProduct, listOptions } from '~/api/product';

// Mock axios
jest.mock('axios');

// Mock the react-navigation hooks
jest.mock('expo-router', () => ({
  useRouter: () => ({
    navigate: jest.fn(),
    push: jest.fn(),
    back: jest.fn(),
  }),
  useLocalSearchParams: jest.fn(() => ({ productId: 'product-123' })),
}));

// Mock the API calls
jest.mock('~/api/product', () => ({
  listProducts: jest.fn(),
  getProduct: jest.fn(),
  listOptions: jest.fn(),
}));

describe('Product Flow Integration Tests', () => {
  // Create a new QueryClient for each test
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  // Sample data for our tests
  const mockProducts = [
    {
      id: 'product-123',
      name: 'Test Product 1',
      price: 99.99,
      imageUri: 'https://example.com/product1.jpg',
      categoryName: 'Test Category',
      introduction: 'This is test product 1',
    },
    {
      id: 'product-456',
      name: 'Test Product 2',
      price: 149.99,
      imageUri: 'https://example.com/product2.jpg',
      categoryName: 'Test Category',
      introduction: 'This is test product 2',
    },
  ];

  const mockProductDetail = {
    id: 'product-123',
    name: 'Test Product 1',
    price: 99.99,
    imageUri: 'https://example.com/product1.jpg',
    categoryName: 'Test Category',
    introduction: 'This is test product 1',
    description: 'Detailed description of test product 1',
    images: ['https://example.com/product1-1.jpg', 'https://example.com/product1-2.jpg'],
  };

  const mockOptions = [
    {
      id: 'option-1',
      name: 'Size',
      suboptions: [
        { id: 'suboption-1', name: 'Small', price: 0 },
        { id: 'suboption-2', name: 'Medium', price: 10 },
        { id: 'suboption-3', name: 'Large', price: 20 },
      ],
    },
    {
      id: 'option-2',
      name: 'Color',
      suboptions: [
        { id: 'suboption-4', name: 'Red', price: 0 },
        { id: 'suboption-5', name: 'Blue', price: 0 },
        { id: 'suboption-6', name: 'Green', price: 0 },
      ],
    },
  ];

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();

    // Mock the API responses
    (listProducts as jest.Mock).mockResolvedValue(mockProducts);
    (getProduct as jest.Mock).mockResolvedValue(mockProductDetail);
    (listOptions as jest.Mock).mockResolvedValue(mockOptions);
  });

  it('should load and display products on the home screen', async () => {
    // Render the Home component with QueryClientProvider
    render(
      <QueryClientProvider client={queryClient}>
        <Home />
      </QueryClientProvider>
    );

    // Wait for the products to load
    await waitFor(() => {
      expect(listProducts).toHaveBeenCalled();
    });

    // Check if products are displayed
    await waitFor(() => {
      expect(screen.getByText('Test Product 1')).toBeTruthy();
      expect(screen.getByText('Test Product 2')).toBeTruthy();
    });
  });

  it('should navigate to product detail when a product is selected', async () => {
    // Mock the router push function
    const mockPush = jest.fn();
    (require('expo-router').useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
      navigate: jest.fn(),
      back: jest.fn(),
    });

    // Render the Home component with QueryClientProvider
    render(
      <QueryClientProvider client={queryClient}>
        <Home />
      </QueryClientProvider>
    );

    // Wait for the products to load
    await waitFor(() => {
      expect(listProducts).toHaveBeenCalled();
    });

    // Find and click on the first product
    const productCard = screen.getByText('Test Product 1');
    fireEvent.press(productCard);

    // Check if navigation was called with the correct parameters
    expect(mockPush).toHaveBeenCalledWith('/product/product-123');
  });

  it('should display product details on the product detail screen', async () => {
    // Render the ProductDetail component with QueryClientProvider
    render(
      <QueryClientProvider client={queryClient}>
        <ProductDetail />
      </QueryClientProvider>
    );

    // Wait for the product details to load
    await waitFor(() => {
      expect(getProduct).toHaveBeenCalledWith('product-123');
      expect(listOptions).toHaveBeenCalledWith('product-123');
    });

    // Check if product details are displayed
    await waitFor(() => {
      expect(screen.getByText('Test Product 1')).toBeTruthy();
      expect(screen.getByText('$99.99')).toBeTruthy();
      expect(screen.getByText('Detailed description of test product 1')).toBeTruthy();
    });
  });

  it('should update price when product options are selected', async () => {
    // Render the ProductDetail component with QueryClientProvider
    render(
      <QueryClientProvider client={queryClient}>
        <ProductDetail />
      </QueryClientProvider>
    );

    // Wait for the product details and options to load
    await waitFor(() => {
      expect(getProduct).toHaveBeenCalledWith('product-123');
      expect(listOptions).toHaveBeenCalledWith('product-123');
    });

    // Find and select the "Medium" size option
    const mediumOption = screen.getByText('Medium');
    fireEvent.press(mediumOption);

    // Check if the price was updated
    await waitFor(() => {
      expect(screen.getByText('$109.99')).toBeTruthy(); // Base price + Medium option price
    });
  });

  it('should add product to cart when "Add to Cart" button is pressed', async () => {
    // Mock the productCreateCart function
    jest.mock('~/api/cartItem', () => ({
      productCreateCart: jest.fn(),
    }));

    // Mock the useCart hook
    const mockAddToCart = jest.fn();
    jest.mock('~/hooks', () => ({
      ...jest.requireActual('~/hooks'),
      useCart: () => ({
        addToCart: mockAddToCart,
      }),
    }));

    // Render the ProductDetail component with QueryClientProvider
    render(
      <QueryClientProvider client={queryClient}>
        <ProductDetail />
      </QueryClientProvider>
    );

    // Wait for the product details to load
    await waitFor(() => {
      expect(getProduct).toHaveBeenCalledWith('product-123');
    });

    // Find and press the "Add to Cart" button
    const addToCartButton = screen.getByText('Add to Cart');
    fireEvent.press(addToCartButton);

    // Check if addToCart was called with the correct parameters
    expect(mockAddToCart).toHaveBeenCalled();
  });
});
