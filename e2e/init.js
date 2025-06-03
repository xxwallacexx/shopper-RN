const { device, element, by, expect, waitFor } = require('detox');

// Global timeout for waiting for elements
const TIMEOUT = 10000;

// Custom helper functions
const waitForElement = async (elementId, timeout = TIMEOUT) => {
  await waitFor(element(by.id(elementId)))
    .toBeVisible()
    .withTimeout(timeout);
};

const navigateToTab = async (tabName) => {
  await element(by.id(`${tabName}-tab`)).tap();
};

// Set up global helpers
global.waitForElement = waitForElement;
global.navigateToTab = navigateToTab;
global.TIMEOUT = TIMEOUT;

beforeAll(async () => {
  await device.launchApp();
});

beforeEach(async () => {
  await device.reloadReactNative();
}); 