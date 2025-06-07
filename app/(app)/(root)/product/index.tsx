import React, { useState, useEffect } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import { useInfiniteQuery } from '@tanstack/react-query';
import { Input, Stack, YStack } from 'tamagui';
import { useDebounce, useLocale } from '~/hooks';
import { flattenInfiniteData } from '~/hooks/useInfiniteData';
import { listProducts } from '~/api';
import { InfiniteList, ProductCard } from '~/components';
import { Product } from '~/types';
import { layout } from '~/utils/styles';

const Products = () => {
  const { t } = useLocale();
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);

  const {
    data: products,
    isFetching: isProductFetching,
    isFetchingNextPage: isFetchingMoreProducts,
    fetchNextPage: fetchMoreProducts,
    refetch: refetchProducts,
  } = useInfiniteQuery({
    queryKey: ['products', debouncedSearch],
    initialPageParam: 0,
    queryFn: ({ pageParam }: { pageParam: number }) => {
      return listProducts(
        pageParam,
        true,
        undefined,
        undefined,
        debouncedSearch,
        undefined,
        undefined
      );
    },
    getNextPageParam: (lastPage, pages) => {
      if (!lastPage || lastPage.length === 0) return undefined;
      return pages.length;
    },
  });

  // Refetch when search changes
  useEffect(() => {
    refetchProducts();
  }, [debouncedSearch, refetchProducts]);

  const productsData = flattenInfiniteData(products);

  const renderProductItem = ({ item, index }: { item: Product; index: number }) => {
    const { _id, price, category, name, introduction } = item;
    const uri = item.photos[0].path;

    return (
      <Link href={`/product/${_id}`} asChild>
        <TouchableOpacity testID={`product-item-${index}`} style={{ width: '48%' }}>
          <ProductCard
            testID={`product-card-${index}`}
            imageUri={uri}
            price={price}
            categoryName={category.name}
            name={name}
            introduction={introduction}
          />
        </TouchableOpacity>
      </Link>
    );
  };

  return (
    <YStack style={layout.container}>
      <Stack style={[layout.padding, { position: 'relative' }]}>
        <Input
          autoCorrect={false}
          autoCapitalize="none"
          value={search}
          placeholder={t('search')}
          onChangeText={setSearch}
        />
        {search !== '' && (
          <Stack style={{ position: 'absolute', right: 16, top: 16 }}>
            <TouchableOpacity onPress={() => setSearch('')}>
              <AntDesign size={24} name="closecircleo" />
            </TouchableOpacity>
          </Stack>
        )}
      </Stack>

      <InfiniteList
        data={productsData}
        renderItem={renderProductItem}
        onLoadMore={fetchMoreProducts}
        isLoading={isProductFetching}
        isFetchingMore={isFetchingMoreProducts}
        emptyStateMessage={t('emptyContent')}
        loadingText={t('loading')}
        numColumns={2}
        columnWrapperStyle={{
          flex: 1,
          padding: 12,
          justifyContent: 'space-between',
        }}
        testID="products-list"
      />
    </YStack>
  );
};

export default Products;
