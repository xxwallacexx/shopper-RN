import { AntDesign } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { FlatList, TouchableOpacity } from 'react-native';
import { Input, SizableText, Stack, XStack, YStack } from 'tamagui';
import { listProducts } from '~/api';
import { ProductCard, Spinner } from '~/components';
import { useDebounce, useLocale } from '~/hooks';
import { Container, Title } from '~/tamagui.config';
import { Product } from '~/types';

const Products = () => {
  const router = useRouter();
  const { t } = useLocale();
  const [search, setSearch] = useState('');
  const debounceSearch = useDebounce(search, 300);
  const {
    data: products,
    isFetching: isProductFetching,
    isFetchingNextPage: isFetchingMoreProducts,
    fetchNextPage: fetchMoreProducts,
  } = useInfiniteQuery({
    queryKey: ['products', debounceSearch],
    initialPageParam: 0,
    queryFn: async ({ pageParam }: { pageParam: number }) => {
      if (search == '') {
        const res = await AsyncStorage.getItem('searchHistory');
        return JSON.parse(res ?? '[]');
      }
      return await listProducts(
        pageParam,
        undefined,
        undefined,
        undefined,
        debounceSearch,
        undefined,
        undefined
      );
    },
    getNextPageParam: (lastPage, pages) => {
      if (search == '') return null;
      if (!lastPage) return null;
      if (!lastPage.length) return null;
      return pages.flat().length;
    },
  });

  const productsData = products?.pages ? products.pages.flat() : [];

  const onProductPress = async (item: Product) => {
    const storedSearchHistories = (await AsyncStorage.getItem('searchHistory')) ?? '[]';
    let searchHistories: Product[] = JSON.parse(storedSearchHistories);
    if (!searchHistories) {
      searchHistories = [];
    }
    if (searchHistories.length >= 10) {
      searchHistories.splice(9, searchHistories.length - 9);
    }
    searchHistories = searchHistories.filter((f) => {
      return f._id !== item._id;
    });
    searchHistories.unshift(item);
    await AsyncStorage.setItem('searchHistory', JSON.stringify(searchHistories));
    return router.navigate({ pathname: '/product/[productId]', params: { productId: item._id } });
  };

  const renderRecommendedProducts = ({ item }: { item: Product }) => {
    const { _id, price, category, name, introduction } = item;

    const uri = item.photos[0].path;

    return (
      <TouchableOpacity onPress={() => onProductPress(item)} style={{ width: '48%' }}>
        <ProductCard
          imageUri={uri}
          price={price}
          categoryName={category.name}
          name={name}
          introduction={introduction}
        />
      </TouchableOpacity>
    );
  };

  return (
    <YStack f={1} bg="white">
      <Stack w="100%" p="$2" pos="relative">
        <Input
          autoCorrect={false}
          autoFocus={true}
          autoCapitalize="none"
          value={search}
          placeholder={t('search')}
          onChangeText={setSearch}
        />
        {search == '' ? null : (
          <Stack pos="absolute" r="$4" t="$4">
            <TouchableOpacity onPress={() => setSearch('')}>
              <AntDesign size={24} name="closecircleo" />
            </TouchableOpacity>
          </Stack>
        )}
      </Stack>
      <FlatList
        data={productsData}
        renderItem={renderRecommendedProducts}
        numColumns={2}
        keyExtractor={(item, index) => index.toString()}
        style={{ flex: 1 }}
        onEndReached={() => fetchMoreProducts()}
        columnWrapperStyle={{
          flex: 1,
          padding: 12,
          justifyContent: 'space-between',
        }}
        ListFooterComponent={() => {
          if (!isProductFetching && !isFetchingMoreProducts) {
            return null;
          }
          return (
            <XStack f={1} gap="$2" ai="center" jc="center">
              <Spinner color="$color.primary" />
              <SizableText col="slategrey">{t('loading')}</SizableText>
            </XStack>
          );
        }}
        ListEmptyComponent={() => {
          if (isProductFetching || isFetchingMoreProducts) {
            return null;
          }
          return (
            <Container ai="center">
              <AntDesign name="folderopen" size={120} color={'#666'} />
              <Title>{t('emptyContent')}</Title>
            </Container>
          );
        }}
      />
    </YStack>
  );
};

export default Products;
