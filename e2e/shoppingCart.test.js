const { device, element, by, expect, waitFor } = require('detox');

describe('Shopping Cart Flow', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should add a product to cart', async () => {
    // Wait for the products to load
    await waitForElement('product-list');
    
    // Tap on the first product
    await element(by.id('product-item-0')).tap();
    
    // Verify we're on the product details screen
    await expect(element(by.id('product-detail-screen'))).toBeVisible();
    
    // Add to cart
    await element(by.id('add-to-cart-button')).tap();
    
    // Verify success message
    await expect(element(by.text('Added to cart'))).toBeVisible();
  });

  it('should navigate to cart and see added products', async () => {
    // Add a product to cart first
    await waitForElement('product-list');
    
    await element(by.id('product-item-0')).tap();
    await element(by.id('add-to-cart-button')).tap();
    
    // Go to cart
    await navigateToTab('cart');
    
    // Verify cart screen is visible
    await expect(element(by.id('cart-screen'))).toBeVisible();
    
    // Verify at least one cart item is visible
    await expect(element(by.id('cart-item-0'))).toBeVisible();
  });

  it('should update product quantity in cart', async () => {
    // Go to cart
    await navigateToTab('cart');
    
    // Verify cart screen is visible
    await expect(element(by.id('cart-screen'))).toBeVisible();
    
    // Increase quantity
    await element(by.id('increase-quantity-button-0')).tap();
    
    // Verify quantity is updated
    await expect(element(by.id('item-quantity-0'))).toHaveText('2');
  });

  it('should remove product from cart', async () => {
    // Go to cart
    await navigateToTab('cart');
    
    // Verify cart screen is visible
    await expect(element(by.id('cart-screen'))).toBeVisible();
    
    // Remove item
    await element(by.id('remove-item-button-0')).tap();
    
    // Verify cart is empty or shows empty state
    await expect(element(by.text('Your cart is empty'))).toBeVisible();
  });
}); 