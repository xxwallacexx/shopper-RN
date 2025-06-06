import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { Link, useNavigation } from 'expo-router';
import { useLayoutEffect, useState } from 'react';
import { FlatList, SectionList, TouchableOpacity } from 'react-native';
import { YStack, XStack, ScrollView, SizableText, Circle } from 'tamagui';

import { listCategories, listProducts, listAdsBanners, getNotificationUnreadCount } from '~/api';
import { BannerCarousel, ProductCard, Spinner, ActionSheet } from '~/components';
import { useAuth, useLocale } from '~/hooks';
import { Container, StyledButton, Title } from '~/tamagui.config';
import { Product } from '~/types';

const Home = () => {
  const navigation = useNavigation();
  const { token } = useAuth();
  const { t } = useLocale();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>();
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState<string>();

  if (!token) return <></>;

  const { data: adsBanners = [] } = useQuery({ queryKey: ['adsBanners'], queryFn: listAdsBanners });
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const categories = await listCategories();
      return [
        {
          value: undefined,
          label: t('hotItems'),
          buttonText: t('all'),
          parent: undefined,
          children: [],
        },
        ...categories.map((c) => {
          return {
            value: c._id,
            label: c.name,
            buttonText: c.name,
            parent: c.parent,
            children: c.children,
          };
        }),
      ];
    },
  });

  const { data: notificationCount } = useQuery({
    queryKey: ['notificationCount', token],
    queryFn: async () => {
      return await getNotificationUnreadCount(token);
    },
  });

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => {
        return (
          <XStack mx="$4" gap="$2">
            <Link href="/product" asChild>
              <TouchableOpacity>
                <MaterialCommunityIcons name="magnify" size={24} color="#fff" />
              </TouchableOpacity>
            </Link>
            <Link href="/notification" asChild>
              <TouchableOpacity>
                <Ionicons name="notifications-outline" size={24} color="#fff" />
                {notificationCount ? (
                  <Circle size="$1" bg="$red6" pos="absolute" r={-10} t={-10}>
                    <SizableText size="$1">{notificationCount}</SizableText>
                  </Circle>
                ) : null}
              </TouchableOpacity>
            </Link>
          </XStack>
        );
      },
    });
  }, [navigation, notificationCount]);

  const [isCategorySheetOpen, setIsCategorySheetOpen] = useState(false);
  const [sheetPosition, setSheetPosition] = useState(0);

  const subCategories =
    categories.find((c) => {
      return c.value == selectedCategoryId;
    })?.children ?? [];

  const categoriesQuery = () => {
    let res = [];

    if (selectedSubCategoryId) {
      res.push(selectedSubCategoryId);
      const subSubCategories =
        categories
          .find((c) => {
            return c.value == selectedSubCategoryId;
          })
          ?.children.map((c) => {
            return c._id;
          }) || [];
      return [...res, ...subSubCategories];
    }
    if (selectedCategoryId) {
      res.push(selectedCategoryId);
    }

    const subCategories =
      categories
        .find((c) => {
          return c.value == selectedCategoryId;
        })
        ?.children.map((c) => {
          return c._id;
        }) || [];

    res = [...res, ...subCategories];
    return res;
  };

  const {
    data: products,
    isFetching: isProductFetching,
    isFetchingNextPage: isFetchingMoreProducts,
    fetchNextPage: fetchMoreProducts,
    hasNextPage: productsHasNextPage,
  } = useInfiniteQuery({
    queryKey: ['products', categoriesQuery()],
    initialPageParam: 0,
    queryFn: ({ pageParam }: { pageParam: number }) => {
      return listProducts(
        pageParam,
        true,
        categoriesQuery(),
        undefined,
        undefined,
        undefined,
        undefined
      );
    },
    getNextPageParam: (lastPage, pages) => {
      if (!lastPage) return null;
      if (!lastPage.length) return null;
      return pages.flat().length;
    },
  });

  const productsData = products?.pages ? products.pages.flat() : [];

  const renderRecommendedProducts = ({ item, index }: { item: Product; index: number }) => {
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

  const onSubCategoryPress = (value: string) => {
    if (selectedSubCategoryId == value) return setSelectedSubCategoryId(undefined);
    setSelectedSubCategoryId(value);
  };

  const renderItem = ({ item, index, section }) => {
    const categoryName = categories.find((f) => {
      return f.value == selectedCategoryId;
    })?.buttonText;
    const categoryLabel = categories.find((f) => {
      return f.value == selectedCategoryId;
    })?.label;

    switch (section.key) {
      case 'photos':
        return (
          <BannerCarousel
            banners={adsBanners.map((b) => {
              return { type: 'IMAGE', uri: b.photo };
            })}
          />
        );
      case 'menu':
        return (
          <YStack gap="$4" p="$2">
            <XStack jc="space-between">
              <Title maw="60%" numberOfLines={1} ellipsizeMode="tail">
                {categoryLabel}
              </Title>
              <StyledButton onPress={() => setIsCategorySheetOpen(true)} maw="$10">
                {categoryName}
              </StyledButton>
            </XStack>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} space="$space.2">
              {subCategories.map((sc) => {
                return (
                  <StyledButton
                    key={sc._id}
                    bc={selectedSubCategoryId == sc._id ? '$color.primary' : 'lightslategrey'}
                    onPress={() => onSubCategoryPress(sc._id)}>
                    {sc.name}
                  </StyledButton>
                );
              })}
            </ScrollView>
          </YStack>
        );
      case 'recommendedProducts':
        return (
          <FlatList
            testID="product-list"
            data={productsData}
            renderItem={renderRecommendedProducts}
            numColumns={2}
            keyExtractor={(item, index) => index.toString()}
            style={{ flex: 1 }}
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
                  <MaterialCommunityIcons name="cart-plus" size={120} color="#666" />
                  <Title>{t('emptyItems')}</Title>
                </Container>
              );
            }}
          />
        );
      default:
        return <></>;
    }
  };

  const onEndReached = () => {
    if (!productsHasNextPage) return;
    fetchMoreProducts();
  };

  const onCategoryPress = (value?: string) => {
    setIsCategorySheetOpen(false);
    setSelectedCategoryId(value);
    setSelectedSubCategoryId(undefined);
  };

  return (
    <YStack f={1} ai="center">
      <SectionList
        renderItem={renderItem}
        onEndReached={onEndReached}
        sections={[
          { key: 'photos', data: [''] },
          { key: 'menu', data: [''] },
          { key: 'recommendedProducts', data: [''] },
        ]}
        style={{ backgroundColor: '#fff' }}
        keyExtractor={(item, index) => item + index}
      />
      <ActionSheet
        isSheetOpen={isCategorySheetOpen}
        setIsSheetOpen={setIsCategorySheetOpen}
        sheetPosition={sheetPosition}
        setSheetPosition={setSheetPosition}>
        <ScrollView>
          <YStack gap="$4">
            {categories
              .filter((c) => {
                return !c.parent;
              })
              .map((category, index) => {
                const isSelected = category.value == selectedCategoryId;
                return (
                  <StyledButton
                    onPress={() => onCategoryPress(category.value)}
                    key={category.value + index.toString()}
                    w="100%"
                    bc={isSelected ? '$color.primary' : 'lightslategrey'}>
                    {category.buttonText}
                  </StyledButton>
                );
              })}
          </YStack>
        </ScrollView>
      </ActionSheet>
    </YStack>
  );
};

export default Home;
