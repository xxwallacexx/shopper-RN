import { AntDesign, MaterialIcons } from "@expo/vector-icons"
import { tokens } from "@tamagui/themes"
import { useQuery } from "@tanstack/react-query"
import { useLocalSearchParams } from "expo-router"
import { SectionList, RefreshControl, Dimensions, SafeAreaView } from "react-native"
import { Section, Separator, SizableText, Stack, Text, XStack, YStack } from "tamagui"
import { getProduct, listOptions } from "~/api/product"
import { BannerCarousel } from "~/components"
import { useLocale } from "~/hooks/useLocale"
import { Badge, BottomAction, Container, StyledButton, Subtitle, Title } from "~/tamagui.config"
import HTMLView from 'react-native-htmlview';

const ProductDetail = () => {
  const { productId } = useLocalSearchParams()
  const { t } = useLocale()
  const { data: product, isFetching: isProductFetching } = useQuery({
    queryKey: ['product', productId],
    queryFn: async () => { return await getProduct(`${productId}`) },
  })

  const { data: options = [], isFetching: isOptionsFetching } = useQuery({
    queryKey: ['productOption', productId],
    queryFn: async () => { return await listOptions(`${productId}`) }
  })
  console.log('options')
  console.log(options)
  if (!product || isProductFetching || isOptionsFetching) {
    return <></>
  }

  const onPurchasePress = () => {
    console.log('purchase')
  }

  const renderItem = ({ item, index, section }) => {
    const { price, photos, category, name, introduction, shop, description, logisticDescription } = product


    switch (section.key) {
      case 'photos':
        return (
          <BannerCarousel
            banners={photos.map((p) => { return p.path })}
          />
        )
      case 'primary':
        return (
          <Container space="$2">
            <YStack space="$2">
              <XStack justifyContent="space-between">
                <Subtitle size="$4">{category.name}</Subtitle>
                <StyledButton>
                  分享商品
                  <AntDesign name="link" color="#fff" />
                </StyledButton>
              </XStack>
              <Text>{name}</Text>
              <Text>{introduction}</Text>
              <Badge>
                <SizableText fontSize={8} color="#fff">
                  $ {price.toFixed(2)} {t('up')}
                </SizableText>
              </Badge>
              <XStack space="$2" alignItems="center">
                <AntDesign name="isv" color={tokens.color.gray10Dark.val} />
                <Text fontSize={10} color={"lightslategray"}>{shop.name}</Text>
              </XStack>
              <XStack space="$2" alignItems="center">
                <MaterialIcons name="location-pin" color={tokens.color.gray10Dark.val} />
                <Text fontSize={10} color="lightslategray">{shop.address}</Text>
              </XStack>
            </YStack>
          </Container>
        )
      case 'productRating':
        if (!product.productRating.count) {
          return (<></>)
        }
        const rating = Math.round(product.productRating.rating)
        return (
          <></>
        )
      case 'secondary':
        return (
          <Container space="$2">
            <Separator borderColor={"lightslategray"} />
            <YStack space="$4">
              <Title>{t('productDetail')}</Title>
              <HTMLView value={description} />
              <Title>{t('TnC')}</Title>
              <HTMLView value={logisticDescription} />
            </YStack>
          </Container>
        )
      default:
        return (
          <> </>
        )
    }
  }
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <YStack flex={1} alignItems="center">
        <SectionList
          refreshControl={
            <RefreshControl
              refreshing={false}
              onRefresh={() => { console.log('on refresh') }}
            />
          }
          renderItem={renderItem}
          sections={[
            { key: 'photos', data: [''] },
            { key: 'primary', data: [''] },
            { key: 'productRating', data: [''] },
            { key: 'secondary', data: [''] },
          ]}
          keyExtractor={(item, index) => item + index.toString()}
        />
        <BottomAction>
          <StyledButton onPress={onPurchasePress}>
            {t('addToCart')}
            <AntDesign name="shoppingcart" color="#fff" />
          </StyledButton>
        </BottomAction>
      </YStack>
    </SafeAreaView>
  )
}

export default ProductDetail
