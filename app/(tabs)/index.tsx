import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { FlatList, RefreshControl, SectionList } from 'react-native';
import { Button, Sheet } from 'tamagui';
import { YStack, Image, Text, SizableText, Spinner } from 'tamagui';
import { listAdsBanners } from '~/api/adsBanner';
import { listCategories, listProducts } from '~/api/product';
import { BannerCarousel } from '~/components';

import { useLocale } from '~/hooks/useLocale';
import { Badge } from '~/tamagui.config';

const Home = () => {
  const { t } = useLocale()
  const [selectedCategoryId, setSelectedCategoryId] = useState()

  const [categoriesOptions, setCategoriesOptions] = useState()
  const { data: adsBanners = [], isFetching: isAdsBannersFetching } = useQuery({ queryKey: ['adsBanners'], queryFn: listAdsBanners })
  const { data: categories = [], isFetching: isCategoriesFetching } = useQuery({ queryKey: ['categories'], queryFn: listCategories })

  const [isCategorySheetOpen, setIsCategorySheetOpen] = useState(false)
  const [sheetPosition, setSheetPosition] = useState(0)


  const { data: products,
    isFetching: isProductFetching,
    isFetchingNextPage: isFetchingMoreProducts,
    fetchNextPage: fetchMoreProducts
  } = useInfiniteQuery({
    queryKey: ['products', selectedCategoryId],
    initialPageParam: 0,
    queryFn: ({ pageParam }: { pageParam: number }) => {
      return listProducts(true, pageParam, undefined, undefined, undefined, undefined, undefined)
    },
    getNextPageParam: (lastPage, pages) => {
      if (!lastPage.length) return null
      return pages.flat().length
    },
  })

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
    const categoryName = selectedCategoryId ? categoriesOptions?.find((f) => { return f.value == selectedCategoryId }).name : t('all')
    const categoryLabel = selectedCategoryId ? categoriesOptions?.find((f) => { return f.value == selectedCategoryId }).label : t('hotItems')

    switch (section.key) {
      case 'photos':
        return (
          <BannerCarousel
            banners={adsBanners.map((b) => { return b.photo })}
          />
        )
      case 'menu':

        return (
          <Button onPress={() => setIsCategorySheetOpen(true)}>
            <Text>{categoryName}</Text>
          </Button>
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
            ListFooterComponent={() => {
              if (!isProductFetching && !isFetchingMoreProducts) {
                return null
              }
              return (
                <Spinner color="$color.primary" />
              )
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
    fetchMoreProducts()
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
      <Sheet
        forceRemoveScrollEnabled={isCategorySheetOpen}
        modal={true}
        open={isCategorySheetOpen}
        onOpenChange={setIsCategorySheetOpen}
        snapPointsMode={"percent"}
        snapPoints={[60]}
        dismissOnSnapToBottom
        position={sheetPosition}
        onPositionChange={setSheetPosition}
        zIndex={100_000}
        animation="quick"
      >
        <Sheet.Overlay
          style={{ opacity: 0.8, backgroundColor: "lightslategrey" }}
          animation="lazy"
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />
        <Sheet.Handle backgroundColor={"ghostwhite"} />

        <Sheet.Frame padding="$4" justifyContent="center" alignItems="center" space="$5" backgroundColor={"ghostwhite"} >
          <Text>hello world</Text>
        </Sheet.Frame>
      </Sheet>
    </YStack>
  );
}

export default Home
