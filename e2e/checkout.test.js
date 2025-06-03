const { device, element, by, expect, waitFor } = require('detox');

describe('Checkout Flow', () => {
  beforeAll(async () => {
    await device.launchApp();
    
    // Add a product to cart first
    await waitForElement('product-list');
    
    await element(by.id('product-item-0')).tap();
    await element(by.id('add-to-cart-button')).tap();
    
    // Go to cart
    await navigateToTab('cart');
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should navigate to checkout from cart', async () => {
    // Verify cart screen is visible
    await expect(element(by.id('cart-screen'))).toBeVisible();
    
    // Proceed to checkout
    await element(by.id('checkout-button')).tap();
    
    // Verify checkout screen is visible
    await expect(element(by.id('checkout-screen'))).toBeVisible();
  });

  it('should fill shipping information', async () => {
    // Navigate to checkout
    await navigateToTab('cart');
    await element(by.id('checkout-button')).tap();
    
    // Fill shipping information
    await element(by.id('full-name-input')).typeText('John Doe');
    await element(by.id('address-line1-input')).typeText('123 Main St');
    await element(by.id('city-input')).typeText('San Francisco');
    await element(by.id('state-input')).typeText('CA');
    await element(by.id('zip-input')).typeText('94105');
    await element(by.id('phone-input')).typeText('5551234567');
    
    // Continue to payment
    await element(by.id('continue-to-payment-button')).tap();
    
    // Verify payment screen is visible
    await expect(element(by.id('payment-screen'))).toBeVisible();
  });

  it('should complete payment and place order', async () => {
    // Navigate to checkout and fill shipping info
    await navigateToTab('cart');
    await element(by.id('checkout-button')).tap();
    
    await element(by.id('full-name-input')).typeText('John Doe');
    await element(by.id('address-line1-input')).typeText('123 Main St');
    await element(by.id('city-input')).typeText('San Francisco');
    await element(by.id('state-input')).typeText('CA');
    await element(by.id('zip-input')).typeText('94105');
    await element(by.id('phone-input')).typeText('5551234567');
    
    await element(by.id('continue-to-payment-button')).tap();
    
    // Fill payment information
    await element(by.id('card-number-input')).typeText('4111111111111111');
    await element(by.id('expiry-input')).typeText('1225');
    await element(by.id('cvv-input')).typeText('123');
    await element(by.id('card-name-input')).typeText('John Doe');
    
    // Place order
    await element(by.id('place-order-button')).tap();
    
    // Verify order confirmation
    await expect(element(by.id('order-confirmation-screen'))).toBeVisible();
    await expect(element(by.text('Thank you for your order!'))).toBeVisible();
  });
}); 