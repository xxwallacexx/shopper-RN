// Set Jest timeout to be much longer for E2E tests
jest.setTimeout(120000);

// Add any global configuration or setup needed for tests
beforeAll(async () => {
  // Additional global setup can go here
  console.log('Setting up E2E test environment');
});
