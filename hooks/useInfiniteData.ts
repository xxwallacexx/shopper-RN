import { InfiniteData } from '@tanstack/react-query';

/**
 * Flattens data from an infinite query
 * @param data The data from useInfiniteQuery
 * @returns Flattened array of items
 */
export function flattenInfiniteData<T>(data: InfiniteData<T[]> | undefined): T[] {
  return data?.pages ? data.pages.flat() : [];
}

/**
 * Standard getNextPageParam function for infinite queries
 * @param lastPage The last page of data
 * @returns The next page param or undefined if no more pages
 */
export function standardGetNextPageParam<T>(
  lastPage: T[] | undefined,
  pages: T[][]
): number | undefined {
  if (!lastPage || lastPage.length === 0) {
    return undefined;
  }
  return pages.length;
}

/**
 * Helper to determine if there's a next page based on the last result
 * @param lastPage The last page of results
 * @param pageSize Expected page size
 * @returns Whether there should be a next page
 */
export function hasNextPage<T>(lastPage: T[] | undefined, pageSize: number = 10): boolean {
  if (!lastPage) return false;
  return lastPage.length >= pageSize;
}
