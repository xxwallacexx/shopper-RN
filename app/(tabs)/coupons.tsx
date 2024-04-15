import { useInfiniteQuery, useQuery } from "@tanstack/react-query"
import { Link } from "expo-router"
import { useState } from "react"
import { SectionList, RefreshControl, FlatList, TouchableOpacity } from "react-native"
import { Image, SizableText, Spinner, YStack } from "tamagui"
import { getCredit, getShop, listCoupons } from "~/api"
import { useAuth, useLocale } from "~/hooks"
import { Badge, Container, StyledButton } from "~/tamagui.config"

const Coupons = () => {
  const { t } = useLocale()
  const { token } = useAuth()

  const sortOptions = [
    { label: t('newToOld'), value: '-endDate' },
    { label: t('oldToNew'), value: 'endDate' },
    { label: t('creditHighToLow'), value: '-credit' },
    { label: t('creditLowToHigh'), value: 'credit' },
  ]
  const [selectedSortOption, setSelectedSortOption] = useState(sortOptions[0].value)
  const { data: shop } = useQuery({ queryKey: ['shop'], queryFn: getShop })
  const { data: credit } = useQuery({ queryKey: ['credit', token], queryFn: async () => { return await getCredit(token) } })
  const {
    data: coupons,
    isFetching: isCouponsFetching,
    isFetchingNextPage: isFetchingMoreCoupons,
    fetchNextPage: fetchMoreCoupons,
    hasNextPage: couponsHasNextPage
  } = useInfiniteQuery({
    queryKey: ['coupons', selectedSortOption],
    initialPageParam: 0,
    queryFn: ({ pageParam }: { pageParam: number }) => {
      return listCoupons(token, pageParam, selectedSortOption, undefined)
    },
    getNextPageParam: (lastPage, pages) => {
      if (!lastPage) return null
      if (!lastPage.length) return null
      return pages.flat().length
    },
  })
  const couponsData = coupons?.pages
    ? coupons.pages.flat()
    : []

  if (!shop || credit == undefined) {
    return <></>
  }
  const onRefresh = () => {
    console.log('refresh')
  }

  const onEndReached = () => {
    console.log('onEndReached')
  }

  const renderCoupons = ({ item }) => {
    return (
      <TouchableOpacity style={{ flex: 0.5 }} >
        <YStack flex={1} p="$4">
          <Image
            aspectRatio={1}
            source={{ uri: item.photo }}
            width={"100%"}
          />
        </YStack>
      </TouchableOpacity>
    )

  }
  const renderSectionItem = ({ item, index, section }) => {
    switch (section.key) {
      case 'cover':
        const cover = shop.couponCover
        return (
          <YStack>
            <Image
              aspectRatio={16 / 9}
              source={{ uri: cover }}
              width={"100%"}
            />
            <Badge position='absolute' bottom={22} left={22}>
              <SizableText size={8} color="#fff">
                {t('credit')}: {credit}
              </SizableText>
            </Badge>
          </YStack>
        )
      case 'menu':
        return (
          <YStack p={"$4"} flex={1} alignItems="flex-end" justifyContent="flex-end" >
            <StyledButton>{sortOptions.find((s) => { return s.value == selectedSortOption })?.label}</StyledButton>
          </YStack>
        )
      case 'coupons':
        return (
          <FlatList
            data={couponsData}
            renderItem={renderCoupons}
            numColumns={2}
            keyExtractor={(item, index) => index.toString()}
            style={{ flex: 1 }}
            columnWrapperStyle={{
              flex: 1,
              justifyContent: "space-between"
            }}
            ListFooterComponent={() => {
              if (!isCouponsFetching && !isFetchingMoreCoupons) {
                return null
              }
              return (
                <Spinner color="$color.primary" />
              )
            }}
            ListEmptyComponent={() => {
              if (isCouponsFetching || isFetchingMoreCoupons) {
                return null
              }
              return (
                <Container alignItems='center'>
                </Container>
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

  return (
    <YStack flex={1}>
      <SectionList
        refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={() => onRefresh()}
          />
        }
        renderItem={(item) => renderSectionItem(item)}
        onEndReached={() => onEndReached()}
        sections={[
          { key: 'cover', data: [''] },
          { key: 'menu', data: [''] },
          { key: 'coupons', data: [''] },
        ]}
        keyExtractor={(item, index) => item + index}
      />
    </YStack>
  )
}

export default Coupons
