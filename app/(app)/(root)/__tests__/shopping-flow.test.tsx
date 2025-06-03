import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import axios from 'axios';

// Import the components we want to test
import Home from '../(tabs)/index';
import ProductDetail from '../product/[productId]/index';
import Cart from '../(tabs)/carts';
import Checkout from '../cartCheckout/index';

// Mock axios
jest.mock('axios');

// Mock the navigation hooks
jest.mock('expo-router', () => ({
  useRouter: jest.fn(() => ({
    navigate: jest.fn(),
    push: jest.fn(),
    back: jest.fn(),
  })),
  useLocalSearchParams: jest.fn(() => ({ productId: 'product-123' })),
}));

// Mock API functions
jest.mock('~/api/product', () => ({
  listProducts: jest.fn(),
  getProduct: jest.fn(),
  listOptions: jest.fn(),
  getProductPriceDetail: jest.fn(),
}));

jest.mock('~/api/cartItem', () => ({
  listCartItems: jest.fn(),
  productCreateCart: jest.fn(),
  updateCartItem: jest.fn(),
  removeCartItem: jest.fn(),
}));

jest.mock('~/api/coupon', () => ({
  listCoupons: jest.fn(),
  createUserCoupon: jest.fn(),
}));

jest.mock('~/api/order', () => ({
  listOrders: jest.fn(),
  getOrder: jest.fn(),
}));

// Import the API functions
import { listProducts, getProduct, listOptions, getProductPriceDetail } from '~/api/product';
import { listCartItems, productCreateCart, updateCartItem, removeCartItem } from '~/api/cartItem';
import { listCoupons, createUserCoupon } from '~/api/coupon';
import { listOrders, getOrder } from '~/api/order';

// Mock the auth hook
jest.mock('~/hooks', () => ({
  useAuth: jest.fn(() => ({
    token: 'test-token',
    user: {
      id: 'user-123',
      name: 'Test User',
      email: 'test@example.com',
    },
    isAuthenticated: true,
  })),
  useLocale: jest.fn(() => ({
    t: (key: string) => key,
  })),
  useCart: jest.fn(() => ({
    cartItems: [],
    addToCart: jest.fn(),
    updateCartItemQuantity: jest.fn(),
    removeCartItem: jest.fn(),
    clearCart: jest.fn(),
  })),
}));

describe('End-to-End Shopping Flow', () => {
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

  const mockCartItems = [
    {
      id: 'cart-item-1',
      productId: 'product-123',
      product: mockProductDetail,
      quantity: 1,
      options: [
        { optionId: 'option-1', suboption: { id: 'suboption-2', name: 'Medium', price: 10 } },
        { optionId: 'option-2', suboption: { id: 'suboption-4', name: 'Red', price: 0 } },
      ],
      totalPrice: 109.99,
    },
  ];

  const mockCoupons = [
    {
      id: 'coupon-1',
      code: 'TEST10',
      discount: 10,
      discountType: 'PERCENTAGE',
      description: '10% off your order',
    },
    {
      id: 'coupon-2',
      code: 'FREE5',
      discount: 5,
      discountType: 'FIXED',
      description: '$5 off your order',
    },
  ];

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    
    // Mock the API responses
    (listProducts as jest.Mock).mockResolvedValue(mockProducts);
    (getProduct as jest.Mock).mockResolvedValue(mockProductDetail);
    (listOptions as jest.Mock).mockResolvedValue(mockOptions);
    (listCartItems as jest.Mock).mockResolvedValue(mockCartItems);
    (listCoupons as jest.Mock).mockResolvedValue(mockCoupons);
    (getProductPriceDetail as jest.Mock).mockResolvedValue({
      basePrice: 99.99,
      optionsPrice: 10,
      totalPrice: 109.99,
    });
    (productCreateCart as jest.Mock).mockResolvedValue({ success: true });
    (updateCartItem as jest.Mock).mockResolvedValue({ success: true });
    (removeCartItem as jest.Mock).mockResolvedValue({ success: true });
    (createUserCoupon as jest.Mock).mockResolvedValue({ success: true });
    (listOrders as jest.Mock).mockResolvedValue({ 
      orders: [{
        id: 'order-123', 
        status: 'PENDING',
        totalAmount: 109.99,
      }]
    });
  });

  it('should complete the entire shopping flow from browsing to checkout', async () => {
    // Step 1: Browse products on the home screen
    const { unmount } = render(
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

    // Mock the router push function
    const mockPush = jest.fn();
    (require('expo-router').useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
      navigate: jest.fn(),
      back: jest.fn(),
    });

    // Find and click on the first product
    const productCard = screen.getByText('Test Product 1');
    fireEvent.press(productCard);

    // Check if navigation was called with the correct parameters
    expect(mockPush).toHaveBeenCalledWith('/product/product-123');

    // Clean up the component
    unmount();

    // Step 2: View product details and add to cart
    const { unmount: unmountDetail } = render(
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
    });

    // Select product options
    const mediumOption = screen.getByText('Medium');
    fireEvent.press(mediumOption);

    const redOption = screen.getByText('Red');
    fireEvent.press(redOption);

    // Mock the addToCart function
    const mockAddToCart = jest.fn();
    (require('~/hooks').useCart as jest.Mock).mockReturnValue({
      cartItems: [],
      addToCart: mockAddToCart,
      updateCartItemQuantity: jest.fn(),
      removeCartItem: jest.fn(),
      clearCart: jest.fn(),
    });

    // Find and press the "Add to Cart" button
    const addToCartButton = screen.getByText('Add to Cart');
    fireEvent.press(addToCartButton);

    // Check if addToCart was called
    expect(mockAddToCart).toHaveBeenCalled();
    expect(productCreateCart).toHaveBeenCalled();

    // Clean up the component
    unmountDetail();

    // Step 3: View cart and proceed to checkout
    const { unmount: unmountCart } = render(
      <QueryClientProvider client={queryClient}>
        <Cart />
      </QueryClientProvider>
    );

    // Wait for the cart items to load
    await waitFor(() => {
      expect(listCartItems).toHaveBeenCalled();
    });

    // Check if cart items are displayed
    await waitFor(() => {
      expect(screen.getByText('Test Product 1')).toBeTruthy();
      expect(screen.getByText('$109.99')).toBeTruthy();
    });

    // Find and press the "Checkout" button
    const checkoutButton = screen.getByText('Checkout');
    fireEvent.press(checkoutButton);

    // Check if navigation was called with the correct parameters
    expect(mockPush).toHaveBeenCalledWith('/cartCheckout');

    // Clean up the component
    unmountCart();

    // Step 4: Complete the checkout process
    const { unmount: unmountCheckout } = render(
      <QueryClientProvider client={queryClient}>
        <Checkout />
      </QueryClientProvider>
    );

    // Wait for the checkout page to load
    await waitFor(() => {
      expect(listCartItems).toHaveBeenCalled();
      expect(listCoupons).toHaveBeenCalled();
    });

    // Fill in shipping information
    const nameInput = screen.getByPlaceholderText('name');
    fireEvent.changeText(nameInput, 'John Doe');

    const emailInput = screen.getByPlaceholderText('email');
    fireEvent.changeText(emailInput, 'john@example.com');

    const phoneInput = screen.getByPlaceholderText('phone');
    fireEvent.changeText(phoneInput, '1234567890');

    const addressInput = screen.getByPlaceholderText('address');
    fireEvent.changeText(addressInput, '123 Main St');

    // Select delivery method
    const deliveryOption = screen.getByText('Delivery');
    fireEvent.press(deliveryOption);

    // Select payment method
    const creditCardOption = screen.getByText('Credit Card');
    fireEvent.press(creditCardOption);

    // Apply a coupon
    const couponInput = screen.getByPlaceholderText('coupon_code');
    fireEvent.changeText(couponInput, 'TEST10');

    const applyCouponButton = screen.getByText('Apply');
    fireEvent.press(applyCouponButton);

    await waitFor(() => {
      expect(createUserCoupon).toHaveBeenCalledWith('test-token', 'TEST10');
    });

    // Place the order
    const placeOrderButton = screen.getByText('Place Order');
    fireEvent.press(placeOrderButton);

    // Check if navigation was called to the order confirmation page
    expect(mockPush).toHaveBeenCalledWith('/order/order-123');

    // Clean up the component
    unmountCheckout();
  });
}); 