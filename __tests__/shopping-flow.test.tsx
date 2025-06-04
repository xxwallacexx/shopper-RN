import axios from 'axios';
import React from 'react';

import * as cartItemAPI from '../api/cartItem';
import * as couponAPI from '../api/coupon';
import * as orderAPI from '../api/order';
import * as productAPI from '../api/product';

// Mock axios
jest.mock('axios');

// Mock the API calls
jest.mock('../api/product', () => ({
  listProducts: jest.fn(),
  getProduct: jest.fn(),
  listOptions: jest.fn(),
  getProductPriceDetail: jest.fn(),
}));

jest.mock('../api/cartItem', () => ({
  listCartItems: jest.fn(),
  productCreateCart: jest.fn(),
  updateCartItem: jest.fn(),
  removeCartItem: jest.fn(),
  createCartItemOrder: jest.fn(),
}));

jest.mock('../api/coupon', () => ({
  listCoupons: jest.fn(),
  createUserCoupon: jest.fn(),
}));

jest.mock('../api/order', () => ({
  listOrders: jest.fn(),
  getOrder: jest.fn(),
}));

describe('Shopping Flow Tests', () => {
  // Test data
  const mockToken = 'test-token';
  const mockProductId = 'product-123';
  const mockCartItemId = 'cart-item-123';
  const mockCouponId = 'coupon-123';

  // Mock API responses
  const mockProducts = [
    {
      id: mockProductId,
      name: 'Test Product 1',
      price: 99.99,
      categoryName: 'Test Category',
      introduction: 'This is test product 1',
      imageUri: 'https://example.com/product1.jpg',
    },
    {
      id: 'product-456',
      name: 'Test Product 2',
      price: 149.99,
      categoryName: 'Test Category',
      introduction: 'This is test product 2',
      imageUri: 'https://example.com/product2.jpg',
    },
  ];

  const mockProductDetail = {
    id: mockProductId,
    name: 'Test Product 1',
    price: 99.99,
    categoryName: 'Test Category',
    introduction: 'This is test product 1',
    description: 'Detailed description of test product 1',
    imageUri: 'https://example.com/product1.jpg',
    images: ['https://example.com/product1-1.jpg', 'https://example.com/product1-2.jpg'],
  };

  const mockOptions = [
    {
      id: 'option-1',
      name: 'Size',
      suboptions: [
        { id: 'suboption-1', name: 'Small', price: 0 },
        { id: 'suboption-2', name: 'Medium', price: 10 },
      ],
    },
  ];

  const mockOrderContent = {
    quantity: 1,
    choices: ['option-1:suboption-2'],
  };

  const mockCartItems = [
    {
      id: mockCartItemId,
      productId: mockProductId,
      product: mockProductDetail,
      quantity: 1,
      options: [
        { optionId: 'option-1', suboption: { id: 'suboption-2', name: 'Medium', price: 10 } },
      ],
      totalPrice: 109.99,
    },
  ];

  const mockCoupons = [
    {
      id: mockCouponId,
      code: 'TEST10',
      discount: 10,
      discountType: 'PERCENTAGE',
      description: '10% off your order',
    },
  ];

  const mockContact = {
    name: 'John Doe',
    email: 'john@example.com',
    phoneNumber: '1234567890',
    address: {
      room: '101',
      street: '123 Main St',
      district: 'Downtown',
    },
  };

  const mockOrder = {
    id: 'order-123',
    status: 'PENDING',
    totalAmount: 109.99,
  };

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock the API responses
    (productAPI.listProducts as jest.Mock).mockResolvedValue(mockProducts);
    (productAPI.getProduct as jest.Mock).mockResolvedValue(mockProductDetail);
    (productAPI.listOptions as jest.Mock).mockResolvedValue(mockOptions);
    (productAPI.getProductPriceDetail as jest.Mock).mockResolvedValue({
      basePrice: 99.99,
      optionsPrice: 10,
      totalPrice: 109.99,
    });

    (cartItemAPI.listCartItems as jest.Mock).mockResolvedValue(mockCartItems);
    (cartItemAPI.productCreateCart as jest.Mock).mockResolvedValue({ success: true });
    (cartItemAPI.updateCartItem as jest.Mock).mockResolvedValue({ success: true });
    (cartItemAPI.removeCartItem as jest.Mock).mockResolvedValue({ success: true });
    (cartItemAPI.createCartItemOrder as jest.Mock).mockResolvedValue(mockOrder);

    (couponAPI.listCoupons as jest.Mock).mockResolvedValue(mockCoupons);
    (couponAPI.createUserCoupon as jest.Mock).mockResolvedValue({ success: true });

    (orderAPI.listOrders as jest.Mock).mockResolvedValue({ orders: [mockOrder] });
    (orderAPI.getOrder as jest.Mock).mockResolvedValue(mockOrder);
  });

  it('should complete the product browsing flow', async () => {
    // Step 1: List products
    const products = await productAPI.listProducts(0);
    expect(products).toEqual(mockProducts);
    expect(productAPI.listProducts).toHaveBeenCalledWith(0);

    // Step 2: Get product details
    const product = await productAPI.getProduct(mockProductId);
    expect(product).toEqual(mockProductDetail);
    expect(productAPI.getProduct).toHaveBeenCalledWith(mockProductId);
  });

  it('should complete the cart and checkout flow', async () => {
    // Step 1: Add product to cart
    await cartItemAPI.productCreateCart(mockToken, mockProductId, mockOrderContent);
    expect(cartItemAPI.productCreateCart).toHaveBeenCalledWith(
      mockToken,
      mockProductId,
      mockOrderContent
    );

    // Step 2: List cart items
    const cartItems = await cartItemAPI.listCartItems(mockToken);
    expect(cartItems).toEqual(mockCartItems);
    expect(cartItemAPI.listCartItems).toHaveBeenCalledWith(mockToken);

    // Step 3: Create order from cart
    const order = await cartItemAPI.createCartItemOrder(
      mockToken,
      'stripe-token-123',
      mockContact,
      'SFEXPRESS',
      'CREDIT_CARD',
      [mockCouponId]
    );

    expect(order).toEqual(mockOrder);
    expect(cartItemAPI.createCartItemOrder).toHaveBeenCalledWith(
      mockToken,
      'stripe-token-123',
      mockContact,
      'SFEXPRESS',
      'CREDIT_CARD',
      [mockCouponId]
    );
  });
});
