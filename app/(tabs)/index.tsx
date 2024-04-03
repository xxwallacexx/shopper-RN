import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { FlatList, RefreshControl, SectionList } from 'react-native';
import { YStack, Image, Text, SizableText } from 'tamagui';
import { listAdsBanners } from '~/api/adsBanner';
import { listCategories, listProducts } from '~/api/product';
import { BannerCarousel } from '~/components';

import { useLocale } from '~/hooks/useLocale';
import { Badge } from '~/tamagui.config';

const Home = () => {
  const { t } = useLocale()
  const [selectedCategoryId, setSelectedCategoryId] = useState()

  const { data: adsBanners = [], isFetching: isAdsBannersFetching } = useQuery({ queryKey: ['adsBanners'], queryFn: listAdsBanners })
  const { data: categories = [], isFetching: isCategoriesFetching } = useQuery({ queryKey: ['categories'], queryFn: listCategories })

  const { data: products, isFetching: isProductFetching, isFetchingNextPage: isFetchingProductsNextPage } = useInfiniteQuery({
    queryKey: ['products', selectedCategoryId],
    initialPageParam: 0,
    queryFn: (context) => {
      console.log(context)
      return listProducts(true, 0, undefined, undefined, undefined, undefined, undefined)
    },
    getNextPageParam: (lastPage, pages) => (
      lastPage.nextCursor
    ),
  })

  if (isProductFetching) {
    return <></>
  }

  const productsData = products?.pages
    ? products.pages.flat()
    : []

  const renderRecommendedProductsView = ({ item }) => {
    const { price, category, name, introduction } = item

    const uri = item.photos[0].path

    return (
      <YStack
        flex={0.5}
        p="$4"

      >
        <Image
          aspectRatio={1}
          source={{ uri }}
          width={"100%"}
          borderRadius={4}
        />
        <Badge position='absolute' top={22} right={22}>
          <SizableText fontSize={8} color="#fff">
            $ {price.toFixed(2)} 起
          </SizableText>
        </Badge>
        <SizableText size={"$1"} color="lightslategray">{category.name}</SizableText>
        <Text numberOfLines={1} ellipsizeMode='tail'>{name}</Text>
        <Text numberOfLines={1} ellipsizeMode='tail'>{introduction}</Text>
      </YStack>
    )
  }

  const renderItem = ({ item, index, section }) => {

    switch (section.key) {
      case 'photos':
        return (
          <BannerCarousel
            banners={adsBanners.map((b) => { return b.photo })}
          />
        )
      case 'menu':
        return (
          <></>
        )
      case 'recommendedProducts':
        return (
          <FlatList
            data={productsData}
            renderItem={renderRecommendedProductsView}
            numColumns={2}
            keyExtractor={(item, index) => index.toString()}
            style={{ flex: 1 }}
            columnWrapperStyle={{
              flex: 1,
              justifyContent: "space-between"
            }}
          />
        )
      default:
        return (
          <></>
        )
    }
  }

  const onEndReached = () => {
    console.log('end')
  }
  console.log(products)
  return (
    <YStack flex={1} alignItems="center" >
      <SectionList
        refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={() => { console.log('on refresh') }}
          />
        }
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

    </YStack>
  );
}

export default Home
