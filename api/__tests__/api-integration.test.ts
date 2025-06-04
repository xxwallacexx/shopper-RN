import axios from 'axios';

import * as cartItemAPI from '../cartItem';
import * as orderAPI from '../order';
import * as productAPI from '../product';

// Mock axios
jest.mock('axios');

describe('API Integration Tests', () => {
  // Test data
  const mockToken = 'test-token';
  const mockProductId = 'product-123';
  const mockCartItemId = 'cart-item-123';

  // Mock API responses
  const mockProducts = [
    {
      id: mockProductId,
      name: 'Test Product',
      price: 99.99,
      categoryName: 'Test Category',
      introduction: 'This is a test product',
      imageUri: 'https://example.com/image.jpg',
    },
  ];

  const mockProductDetail = {
    id: mockProductId,
    name: 'Test Product',
    price: 99.99,
    categoryName: 'Test Category',
    introduction: 'This is a test product',
    description: 'Detailed description of the test product',
    imageUri: 'https://example.com/image.jpg',
    images: ['https://example.com/image1.jpg', 'https://example.com/image2.jpg'],
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

  const mockOrders = {
    orders: [
      {
        id: 'order-123',
        status: 'PENDING',
        totalAmount: 109.99,
      },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should test the product listing and detail flow', async () => {
    // Mock axios implementation for listProducts
    (axios as any).mockImplementationOnce(() =>
      Promise.resolve({ data: { products: mockProducts } })
    );

    // Step 1: List products
    const products = await productAPI.listProducts(0);
    expect(products).toEqual(mockProducts);
    expect(axios).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'get',
        url: expect.stringContaining('/product'),
      })
    );

    // Mock axios implementation for getProduct
    (axios as any).mockImplementationOnce(() => Promise.resolve({ data: mockProductDetail }));

    // Step 2: Get product details
    const product = await productAPI.getProduct(mockProductId);
    expect(product).toEqual(mockProductDetail);
    expect(axios).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'get',
        url: expect.stringContaining(`/product/${mockProductId}`),
      })
    );

    // Mock axios implementation for listOptions
    (axios as any).mockImplementationOnce(() => Promise.resolve({ data: mockOptions }));

    // Step 3: Get product options
    const options = await productAPI.listOptions(mockProductId);
    expect(options).toEqual(mockOptions);
    expect(axios).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'get',
        url: expect.stringContaining(`/product/${mockProductId}/options`),
      })
    );
  });

  it('should test the cart flow', async () => {
    // Mock axios implementation for listCartItems
    (axios as any).mockImplementationOnce(() => Promise.resolve({ data: mockCartItems }));

    // Step 1: List cart items
    const cartItems = await cartItemAPI.listCartItems(mockToken);
    expect(cartItems).toEqual(mockCartItems);
    expect(axios).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'get',
        url: expect.stringContaining('/cartItem'),
        headers: expect.objectContaining({
          Authorization: `JWT ${mockToken}`,
        }),
      })
    );

    // Mock axios implementation for productCreateCart
    (axios as any).mockImplementationOnce(() => Promise.resolve({ data: { success: true } }));

    // Step 2: Add product to cart
    await cartItemAPI.productCreateCart(mockToken, mockProductId, mockOrderContent);
    expect(axios).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'post',
        url: expect.stringContaining(`/product/${mockProductId}/cart`),
        headers: expect.objectContaining({
          Authorization: `JWT ${mockToken}`,
        }),
        data: expect.objectContaining({
          orderContent: mockOrderContent,
        }),
      })
    );
  });

  it('should test the order flow', async () => {
    // Mock axios implementation for listOrders
    (axios as any).mockImplementationOnce(() => Promise.resolve({ data: mockOrders }));

    // Step 1: List orders
    const orders = await orderAPI.listOrders(mockToken, 0);
    expect(orders).toEqual(mockOrders.orders);
    expect(axios).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'get',
        url: expect.stringContaining('/order'),
        headers: expect.objectContaining({
          Authorization: `JWT ${mockToken}`,
        }),
      })
    );
  });
});
