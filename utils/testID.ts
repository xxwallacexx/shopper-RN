/**
 * Helper utility for managing testIDs in the app
 * This makes it easier to keep testIDs consistent between components and tests
 */

export const TestID = {
  // Product List Screen
  productList: 'product-list',
  productItem: (index: number) => `product-item-${index}`,
  productCard: (index: number) => `product-card-${index}`,
  categoryFilter: 'category-filter',
  
  // Product Detail Screen
  productDetailScreen: 'product-detail-screen',
  backButton: 'back-button',
  addToCartButton: 'add-to-cart-button',
  
  // Cart Screen
  cartScreen: 'cart-screen',
  cartItem: (index: number) => `cart-item-${index}`,
  cartTotalPrice: 'cart-total-price',
  checkoutButton: 'checkout-button',
  increaseQuantityButton: (index: number) => `increase-quantity-button-${index}`,
  decreaseQuantityButton: (index: number) => `decrease-quantity-button-${index}`,
  itemQuantity: (index: number) => `item-quantity-${index}`,
  removeItemButton: (index: number) => `remove-item-button-${index}`,
  
  // Checkout Screen
  checkoutScreen: 'checkout-screen',
  fullNameInput: 'full-name-input',
  addressLine1Input: 'address-line1-input',
  cityInput: 'city-input',
  stateInput: 'state-input',
  zipInput: 'zip-input',
  phoneInput: 'phone-input',
  continueToPaymentButton: 'continue-to-payment-button',
  
  // Payment Screen
  paymentScreen: 'payment-screen',
  cardNumberInput: 'card-number-input',
  expiryInput: 'expiry-input',
  cvvInput: 'cvv-input',
  cardNameInput: 'card-name-input',
  placeOrderButton: 'place-order-button',
  
  // Order Confirmation Screen
  orderConfirmationScreen: 'order-confirmation-screen',
};

export default TestID; 