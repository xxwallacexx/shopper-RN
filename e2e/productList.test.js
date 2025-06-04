const { device, element, by, expect, waitFor } = require('detox');

describe('Product List Screen', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should display product list screen', async () => {
    // Wait for the products to load
    await waitForElement('product-list');

    // Check if at least one product is visible
    await expect(element(by.id('product-item-0'))).toBeVisible();
  });

  it('should navigate to product details when tapping on a product', async () => {
    // Wait for the products to load
    await waitForElement('product-list');

    // Tap on the first product
    await element(by.id('product-item-0')).tap();

    // Verify we're on the product details screen
    await expect(element(by.id('product-detail-screen'))).toBeVisible();

    // Go back to the product list
    await element(by.id('back-button')).tap();
  });

  it('should filter products by category', async () => {
    // Wait for the products to load
    await waitForElement('product-list');

    // Tap on the category filter
    await element(by.id('category-filter')).tap();

    // Select a category (e.g., "Electronics")
    await element(by.text('Electronics')).tap();

    // Verify filtered results are shown
    await expect(element(by.id('product-list'))).toBeVisible();
  });
});
