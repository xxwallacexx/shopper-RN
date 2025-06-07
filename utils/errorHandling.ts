import Toast from 'react-native-toast-message';

/**
 * Standard error handler for API calls
 * @param error The error object
 * @param t Translation function
 */
export const handleApiError = (error: unknown, t: (key: string, options?: any) => string): void => {
  const errorMessage = error instanceof Error ? error.message : 'Unknown error';
  Toast.show({
    type: 'error',
    text1: t(errorMessage),
  });
};

/**
 * Creates a standard onError handler for mutations
 * @param t Translation function
 * @returns A function to be used in the onError property of useMutation
 */
export const createErrorHandler = (t: (key: string, options?: any) => string) => {
  return (error: unknown) => handleApiError(error, t);
}; 