import { AntDesign, Ionicons, MaterialIcons } from "@expo/vector-icons"
import { tokens } from "@tamagui/themes"
import { useQuery } from "@tanstack/react-query"
import { useLocalSearchParams, useNavigation } from "expo-router"
import { SectionList, RefreshControl, SafeAreaView, TouchableOpacity } from "react-native"
import { Label, ScrollView, Separator, SizableText, Spinner, Text, XStack, YStack } from "tamagui"
import { getProduct, listOptions, getProductPriceDetail, getProductIsBookmarked, removeBookmark, createBookmark } from "~/api"
import { BannerCarousel } from "~/components"
import { Badge, BottomAction, Container, StyledButton, Subtitle, Title } from "~/tamagui.config"
import HTMLView from 'react-native-htmlview';
import ActionSheet from "~/components/ActionSheet"
import { useLayoutEffect, useState } from "react"
import ProductOptionCard from "~/components/ProductOptionCard"
import { useAuth, useLocale } from "~/hooks"

const ProductDetail = () => {
  const { productId } = useLocalSearchParams()
  const navigation = useNavigation()
  const { t } = useLocale()
  const { token } = useAuth()
  const [isOptionSheetOpen, setIsOptionSheetOpen] = useState(false)
  const [sheetPosition, setSheetPosition] = useState(0)
  const [selectedChoices, setSelectedChoices] = useState<{ optionId: string, choiceId: string }[]>([])
  const [quantity, setQuantity] = useState(1)

  const { data: product, isFetching: isProductFetching } = useQuery({
    queryKey: ['product', productId],
    queryFn: async () => { return await getProduct(`${productId}`) },
  })

  const { data: options = [], isFetching: isOptionsFetching } = useQuery({
    queryKey: ['productOption', productId],
    queryFn: async () => { return await listOptions(`${productId}`) }
  })

  const { data: priceDetail, isFetching: isPriceDetailFetching } = useQuery({
    queryKey: ['priceDetail', productId, selectedChoices, quantity],
    queryFn: async () => {
      const orderContent = {
        choices: selectedChoices.map((c) => { return c.choiceId }),
        quantity
      }
      return await getProductPriceDetail(token, `${productId}`, orderContent, undefined)
    }
  })

  const { data: isBookmarked, refetch: refetchIsBookmarked } = useQuery({
    queryKey: ['productBookmark', productId],
    queryFn: async () => { return await getProductIsBookmarked(token, `${productId}`) }
  })


  const onBookmarkPress = async () => {
    if (isBookmarked) {
      await removeBookmark(token, `${productId}`)
    } else {
      await createBookmark(token, `${productId}`)
    }
    refetchIsBookmarked()
  }

  useLayoutEffect(() => {
    if (isBookmarked == undefined) return
    navigation.setOptions({
      headerRight: () => {
        return (
          <TouchableOpacity onPress={onBookmarkPress}>
            <Ionicons name="bookmark" size={24} color={isBookmarked ? tokens.color.yellow9Light.val : "#fff"} />
          </TouchableOpacity>
        )
      }
    })
  }, [navigation, isBookmarked])


  if (!product || isProductFetching || isOptionsFetching) {
    return <></>
  }

  let stock = product.stock

  const onChoiceChange = (optionId: string, choiceId: string) => {
    let aSelectedChoices = [...selectedChoices]
    aSelectedChoices = [...aSelectedChoices.filter((s) => { return s.optionId !== optionId }), { optionId, choiceId }]
    setSelectedChoices(aSelectedChoices)
  }

  const onQuantityChange = (value: number) => {
    if (value < 1) return
    setQuantity(value)
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
                  {t('shareProduct')}
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
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
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
        <BottomAction justifyContent="flex-end">
          <StyledButton onPress={() => setIsOptionSheetOpen(true)}>
            {t('addToCart')}
            <AntDesign name="shoppingcart" color="#fff" />
          </StyledButton>
        </BottomAction>
      </YStack>
      <ActionSheet
        isSheetOpen={isOptionSheetOpen}
        setIsSheetOpen={setIsOptionSheetOpen}
        sheetPosition={sheetPosition}
        setSheetPosition={setSheetPosition}
      >
        <YStack flex={1}>
          <ScrollView>
            <YStack space="$4">
              {
                options.map((option) => {
                  return (
                    <ProductOptionCard
                      key={option._id}
                      option={option}
                      selectedChoice={selectedChoices.find((s) => { return s.optionId == option._id })?.choiceId}
                      onChoiceChange={onChoiceChange}
                    />
                  )
                })
              }
            </YStack>
            <YStack>
              <Label>
                {t('quantity')}
              </Label>
              <XStack ml={2} space={"$2"} alignItems="center">
                <StyledButton disabled={quantity < 2} pressStyle={{ opacity: 0.5 }} size="$2" onPress={() => onQuantityChange(quantity - 1)} icon={<AntDesign name="minus" />} />
                <SizableText>{quantity}</SizableText>
                <StyledButton disabled={quantity >= stock} pressStyle={{ opacity: 0.5 }} size="$2" onPress={() => onQuantityChange(quantity + 1)} icon={<AntDesign name="plus" />} />
                {stock < 20 ? <SizableText>{t('stock')}: {stock}</SizableText> : null}
              </XStack>
            </YStack>
          </ScrollView>
          <Separator borderColor={"lightslategrey"} />
          <XStack minHeight={"$6"} >
            {
              isPriceDetailFetching ? <Spinner /> :
                <SizableText>
                  HK$ {priceDetail.subtotal}
                </SizableText>
            }
          </XStack>
        </YStack>
      </ActionSheet>
    </SafeAreaView>
  )
}

export default ProductDetail
