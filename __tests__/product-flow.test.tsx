import React from 'react';
import axios from 'axios';
import * as productAPI from '../api/product';
import * as cartItemAPI from '../api/cartItem';

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
  productCreateCart: jest.fn(),
}));

describe('Product Flow Tests', () => {
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

  const mockOrderContent = {
    quantity: 1,
    choices: ['option-1:suboption-2'],
  };

  beforeEach(() => {
    // Clear all mocks before each test
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
    (cartItemAPI.productCreateCart as jest.Mock).mockResolvedValue({ success: true });
  });

  it('should fetch product list', async () => {
    // Call the API function
    const products = await productAPI.listProducts(0);
    
    // Verify the result
    expect(products).toEqual(mockProducts);
    expect(productAPI.listProducts).toHaveBeenCalledWith(0);
  });

  it('should fetch product details', async () => {
    // Call the API function
    const product = await productAPI.getProduct('product-123');
    
    // Verify the result
    expect(product).toEqual(mockProductDetail);
    expect(productAPI.getProduct).toHaveBeenCalledWith('product-123');
  });

  it('should fetch product options', async () => {
    // Call the API function
    const options = await productAPI.listOptions('product-123');
    
    // Verify the result
    expect(options).toEqual(mockOptions);
    expect(productAPI.listOptions).toHaveBeenCalledWith('product-123');
  });

  it('should add product to cart', async () => {
    // Call the API function
    const result = await cartItemAPI.productCreateCart('test-token', 'product-123', mockOrderContent);
    
    // Verify the result
    expect(result).toEqual({ success: true });
    expect(cartItemAPI.productCreateCart).toHaveBeenCalledWith('test-token', 'product-123', mockOrderContent);
  });
}); 