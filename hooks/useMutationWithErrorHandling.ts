import { useMutation, UseMutationOptions, UseMutationResult } from '@tanstack/react-query';
import { createErrorHandler } from '~/utils/errorHandling';

/**
 * Custom hook that wraps useMutation with standard error handling
 * @param options The useMutation options
 * @param t Translation function
 * @returns The useMutation result
 */
export function useMutationWithErrorHandling<
  TData = unknown,
  TError = unknown,
  TVariables = void,
  TContext = unknown
>(
  options: UseMutationOptions<TData, TError, TVariables, TContext>,
  t: (key: string, options?: any) => string
): UseMutationResult<TData, TError, TVariables, TContext> {
  return useMutation({
    ...options,
    onError: (error, variables, context) => {
      // Call the default error handler
      createErrorHandler(t)(error);
      
      // Call the provided onError if it exists
      if (options.onError) {
        options.onError(error, variables, context);
      }
    },
  });
} 