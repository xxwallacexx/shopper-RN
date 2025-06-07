import React from 'react';
import { FlatList, FlatListProps, StyleSheet, View } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { EmptyState, ListFooterLoader } from '~/components';

interface InfiniteListProps<T>
  extends Omit<FlatListProps<T>, 'data' | 'renderItem' | 'onEndReached'> {
  data: T[];
  renderItem: ({ item, index }: { item: T; index: number }) => React.ReactElement;
  onLoadMore: () => void;
  isLoading: boolean;
  isFetchingMore: boolean;
  emptyStateMessage: string;
  emptyStateIcon?: React.ComponentProps<typeof AntDesign>['name'];
  loadingText?: string;
  hasNextPage?: boolean;
  numColumns?: number;
  contentContainerStyle?: object;
  isRefreshing?: boolean;
  onRefresh?: () => void;
  testID?: string;
}

function InfiniteList<T>({
  data,
  renderItem,
  onLoadMore,
  isLoading,
  isFetchingMore,
  emptyStateMessage,
  emptyStateIcon = 'folderopen',
  loadingText = 'Loading...',
  hasNextPage = true,
  numColumns = 1,
  contentContainerStyle,
  columnWrapperStyle,
  isRefreshing = false,
  onRefresh,
  testID,
  ...rest
}: InfiniteListProps<T>) {
  const handleEndReached = () => {
    if (!isLoading && !isFetchingMore && hasNextPage) {
      onLoadMore();
    }
  };

  const renderFooter = () => {
    return <ListFooterLoader isLoading={isLoading || isFetchingMore} loadingText={loadingText} />;
  };

  const renderEmpty = () => {
    if (isLoading || isFetchingMore) {
      return null;
    }
    return (
      <View style={styles.emptyContainer}>
        <EmptyState message={emptyStateMessage} iconName={emptyStateIcon} />
      </View>
    );
  };

  return (
    <FlatList
      testID={testID}
      data={data}
      renderItem={renderItem}
      keyExtractor={(_, index) => index.toString()}
      onEndReached={handleEndReached}
      onEndReachedThreshold={0.5}
      ListFooterComponent={renderFooter}
      ListEmptyComponent={renderEmpty}
      refreshing={isRefreshing}
      onRefresh={onRefresh}
      numColumns={numColumns}
      contentContainerStyle={[
        styles.contentContainer,
        !data.length && styles.emptyContentContainer,
        contentContainerStyle,
      ]}
      columnWrapperStyle={numColumns > 1 ? columnWrapperStyle : undefined}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    flexGrow: 1,
  },
  emptyContentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default InfiniteList;
