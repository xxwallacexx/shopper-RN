import { AntDesign, Ionicons, MaterialIcons } from "@expo/vector-icons"
import { tokens } from "@tamagui/themes"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useLocalSearchParams, useNavigation, Link, useFocusEffect, router, useRouter } from "expo-router"
import { SectionList, RefreshControl, SafeAreaView, TouchableOpacity } from "react-native"
import { Label, ScrollView, Separator, SizableText, Spinner, Text, XStack, YStack } from "tamagui"
import { getProduct, listOptions, getProductPriceDetail, getProductIsBookmarked, removeBookmark, createBookmark, getShop, listReservations, reservationCreateCart, productCreateCart } from "~/api"
import { BannerCarousel, OptionSelection } from "~/components"
import { Badge, BottomAction, Container, StyledButton, Subtitle, Title } from "~/tamagui.config"
import HTMLView from 'react-native-htmlview';
import ActionSheet from "~/components/ActionSheet"
import { useCallback, useLayoutEffect, useMemo, useState } from "react"
import ProductOptionCard from "~/components/ProductOptionCard"
import { useAuth, useLocale } from "~/hooks"
import { PRIMARY_9_COLOR } from "@env"
import * as Sharing from 'expo-sharing';
import moment from "moment"
import ReservationCalendar from "~/components/ReservationCalendar"
import { OrderContent, ReservationContent, ReservationOption } from "~/types"
import Toast from "react-native-toast-message"

const ProductDetail = () => {
  const { productId } = useLocalSearchParams<{ productId: string }>()
  const navigation = useNavigation()
  const router = useRouter()
  const { t } = useLocale()
  const { token } = useAuth()
  if (!token) return <></>
  const [isOptionSheetOpen, setIsOptionSheetOpen] = useState(false)
  const [sheetPosition, setSheetPosition] = useState(0)
  const [selectedChoices, setSelectedChoices] = useState<{ optionId: string, choiceId: string }[]>([])
  const [quantity, setQuantity] = useState(1)
  const [selectedCouponId, setSelectedCouponId] = useState()
  const queryClient = useQueryClient()

  //reservations
  const [selectedDate, setSelectedDate] = useState<string>()
  const [availableTimes, setAvailableTimes] = useState<Date[]>([])
  const [selectedTime, setSeletedTime] = useState<Date>()
  const [availableReservationOptions, setAvailableReservationOptions] = useState<ReservationOption[]>([])
  const [selectedReservationOption, setSelectedReservationOption] = useState<string>()
  const [isReservationOptionSheetOpen, setIsReservationOptionSheetOpen] = useState(false)
  const [reservationOptionsSheetPosition, setReservationOptionsSheetPosition] = useState(0)

  const { isPending: isReservationCreateCartSubmiting, mutate: reservationCreateCartMutate } = useMutation({
    mutationFn: async ({ reservationId, reservationContent }: { reservationId: string; reservationContent: ReservationContent }) => {
      return await reservationCreateCart(token, reservationId, reservationContent)
    },
    onSuccess: async (res) => {
      queryClient.invalidateQueries({ queryKey: ['cartItems'] })
    },
    onError: (e) => {
      const error = e as Error
      Toast.show({
        type: 'error',
        text1: t(error.message),
      });
    }
  })

  const { isPending: isProductCreateCartSubmiting, mutate: productCreateCartMutate } = useMutation({
    mutationFn: async ({ orderContent }: { orderContent: OrderContent }) => {
      return await productCreateCart(token, productId, orderContent)
    },
    onSuccess: async (res) => {
      queryClient.invalidateQueries({ queryKey: ['cartItems'] })
    },
    onError: (e) => {
      console.log(e)
      const error = e as Error
      Toast.show({
        type: 'error',
        text1: t(error.message),
      });
    }
  })



  const orderContent = {
    choices: selectedChoices.map((c) => { return c.choiceId }),
    quantity
  }

  const { data: shop } = useQuery({ queryKey: ['shop'], queryFn: async () => { return await getShop() } })

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
      return await getProductPriceDetail(token, `${productId}`, orderContent, selectedCouponId)
    }
  })

  const { data: isBookmarked, refetch: refetchIsBookmarked } = useQuery({
    queryKey: ['productBookmark', productId],
    queryFn: async () => { return await getProductIsBookmarked(token, `${productId}`) }
  })

  const { mutate: updateBookmarked } = useMutation({
    mutationFn: async () => {
      if (isBookmarked) {
        return await removeBookmark(token, productId)
      } else {
        return await createBookmark(token, productId)
      }
    },
    onSuccess: () => {
      refetchIsBookmarked()
      queryClient.resetQueries({ queryKey: ['bookmarks'] })
    }
  })


  const { data: reservations = [], isFetching: isReservationsFetching } = useQuery({
    queryKey: ['reservations', productId],
    queryFn: async () => { return await listReservations(token, productId, moment().valueOf(), moment().endOf('month').valueOf(), 0) },
    enabled: product?.productType == "RESERVATION"
  })


  useLayoutEffect(() => {
    if (isBookmarked == undefined) return
    navigation.setOptions({
      headerRight: () => {
        return (
          <TouchableOpacity onPress={() => updateBookmarked()}>
            <Ionicons name="bookmark" size={24} color={isBookmarked ? PRIMARY_9_COLOR : "#fff"} />
          </TouchableOpacity>
        )
      }
    })
  }, [navigation, isBookmarked])

  useFocusEffect(
    useCallback(() => {
      const unsubscribe = () => {
        setIsOptionSheetOpen(false)
      }

      return () => unsubscribe();
    }, [navigation])
  );


  if (!product || isProductFetching || isOptionsFetching || !shop) {
    return <></>
  }

  const getStock = () => {
    switch (product.productType) {
      case "ORDER":
        return product.stock
      case "RESERVATION":
        if (!selectedTime || !selectedReservationOption) return 0
        const reservation = reservations.find((f) => { return moment(f.time).toISOString() == moment(selectedTime).toISOString() })
        const option = reservation?.options.find((f) => { return f._id == selectedReservationOption })
        if (!reservation || !option) return 0
        const { stock } = option
        const { userCountMax } = reservation
        return stock > userCountMax ? userCountMax : stock
    }
  }

  const getMinQuantity = () => {
    switch (product.productType) {
      case "ORDER":
        return 1
      case "RESERVATION":
        if (!selectedTime || !selectedReservationOption) return 0
        const reservation = reservations.find((f) => { return moment(f.time).toISOString() == moment(selectedTime).toISOString() })
        if (!reservation) return 1
        const { userCountMin } = reservation
        return userCountMin

    }
  }

  let stock = getStock()
  let minQuantity = getMinQuantity()
  const onChoiceChange = (optionId: string, choiceId: string) => {
    let aSelectedChoices = [...selectedChoices]
    aSelectedChoices = [...aSelectedChoices.filter((s) => { return s.optionId !== optionId }), { optionId, choiceId }]
    setSelectedChoices(aSelectedChoices)
  }

  const onQuantityChange = (value: number) => {
    if (value < minQuantity) return
    setQuantity(value)
  }

  const onCheckoutPress = () => {
    setIsOptionSheetOpen(false)
    let searchParams: { orderContentStr: string, currentCouponId?: string } = {
      orderContentStr: JSON.stringify(orderContent)
    }
    if (selectedCouponId) {
      searchParams['currentCouponId'] = selectedCouponId
    }
    router.navigate({ pathname: `/product/${productId}/checkout`, params: searchParams })

  }

  const onSharePress = async () => {
    await Sharing.shareAsync(
      `https://mall.${shop?.mallDomainName}/productDetail/${product._id}`,
      {
        dialogTitle: t('shareProductWithYou', { product: product.name, url: `https://mall.${shop?.mallDomainName}/productDetail/${product._id}` })
      })
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
                <StyledButton onPress={onSharePress}>
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

  const onDayChange = (value?: string) => {
    setSelectedDate(value)
    setSeletedTime(undefined)
    setSelectedReservationOption(undefined)
    setAvailableReservationOptions([])

    if (!value) {
      return setAvailableTimes([])
    }
    const availableTimes = reservations.map((r) => { return r.time }).filter((t) => { return moment(t).format('YYYY-MM-DD') == value }).sort((a, b) => { return moment(a).valueOf() - moment(b).valueOf() })
    setAvailableTimes(availableTimes)

  }

  const onTimeChange = (value?: string) => {
    setSelectedReservationOption(undefined)

    setSeletedTime(moment(value).toDate())
    if (!value) return
    const reservation = reservations.find((f) => { return moment(f.time).toISOString() == value })
    const availableOptions = reservation?.options ?? []
    setAvailableReservationOptions(availableOptions)
  }

  const onReservationOptionChange = (value: string) => {
    setIsReservationOptionSheetOpen(false)
    if (selectedReservationOption == value) {
      return setSelectedReservationOption(undefined)
    }
    setSelectedReservationOption(value)
  }

  const renderSheetContent = () => {
    switch (product.productType) {
      case "ORDER":
        return (
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
        )
      case "RESERVATION":
        return (
          <YStack space="$4">
            <Label>
              {t("pleaseSelectDate")}
            </Label>
            <ReservationCalendar
              isLoading={isReservationsFetching}
              reservations={reservations}
              selectedDate={selectedDate}
              onDayChange={onDayChange}
            />
            {availableTimes.length ?
              <OptionSelection
                title={t("pleaseSelectTime")}
                options={availableTimes.map((t) => { return { label: moment(t).format("HH:mm"), value: moment(t).toISOString() } })}
                selectedOption={selectedTime?.toISOString()}
                onOptionChange={onTimeChange}
              />
              : null}
            {
              availableReservationOptions.length ?
                <YStack>
                  <Label>
                    {t("pleaseSelectOption")}
                  </Label>
                  <StyledButton mx="$1" h="$3" backgroundColor={"#fff"} pressStyle={{ backgroundColor: "ghostwhite" }} color="#000" onPress={() => setIsReservationOptionSheetOpen(true)}>
                    {selectedReservationOption ? availableReservationOptions.find((o) => { return o._id == selectedReservationOption })?.name : t('pleaseSelect')}
                  </StyledButton>
                </YStack>
                : null
            }
            <ActionSheet
              isSheetOpen={isReservationOptionSheetOpen}
              setIsSheetOpen={setIsReservationOptionSheetOpen}
              sheetPosition={reservationOptionsSheetPosition}
              snapPoints={[40]}
              setSheetPosition={setReservationOptionsSheetPosition}
            >
              <ScrollView space="$4">
                {availableReservationOptions.map((o) => {
                  const selected = o._id == selectedReservationOption
                  return (
                    <StyledButton
                      backgroundColor={selected ? "$primary" : "slategray"}
                      key={o._id}
                      onPress={() => onReservationOptionChange(o._id)}
                    >
                      <SizableText
                        color="white"
                      >{o.name}</SizableText>
                    </StyledButton>
                  )
                })
                }
              </ScrollView>
            </ActionSheet>

          </YStack>
        )
      default:
        return <></>

    }
  }

  const quantitySelector = () => {
    return (
      <YStack>
        <Label>
          {t('quantity')}
        </Label>
        <XStack ml={2} space={"$2"} alignItems="center">
          <StyledButton disabled={quantity < minQuantity + 1 || quantity < 2} pressStyle={{ opacity: 0.5 }} size="$2" onPress={() => onQuantityChange(quantity - 1)} icon={<AntDesign name="minus" />} />
          <SizableText>{quantity}</SizableText>
          <StyledButton disabled={quantity >= stock} pressStyle={{ opacity: 0.5 }} size="$2" onPress={() => onQuantityChange(quantity + 1)} icon={<AntDesign name="plus" />} />
          {stock < 20 ? <SizableText>{t('stock')}: {stock}</SizableText> : null}
        </XStack>
      </YStack>
    )

  }

  const renderQuantitySelector = () => {
    switch (product.productType) {
      case 'ORDER':
        return quantitySelector()
      case 'RESERVATION':
        if (!selectedReservationOption) return <></>
        return (
          quantitySelector()
        )

    }
  }

  const onAddCartPress = () => {
    switch (product.productType) {
      case "ORDER":
        console.log(selectedChoices)
        console.log(quantity)
        const orderContent = {
          choices: selectedChoices.map((f) => { return f.choiceId }),
          quantity
        }
        productCreateCartMutate({ orderContent })
        break
      case "RESERVATION":
        const reservation = reservations.find((f) => { return moment(f.time).toISOString() == moment(selectedTime).toISOString() })
        if (!reservation) return
        const reservationContent = {
          reservation: reservation._id!,
          option: selectedReservationOption!,
          quantity: quantity!
        }
        reservationCreateCartMutate({ reservationId: reservation._id, reservationContent })
        break

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
        snapPoints={[80]}
        setSheetPosition={setSheetPosition}
      >
        <YStack flex={1} space="$2" justifyContent="space-between">
          <ScrollView>
            {renderSheetContent()}
            {renderQuantitySelector()}
          </ScrollView>
          <Separator borderColor={"lightslategrey"} />
          <XStack minHeight={"$6"} justifyContent="space-between" >
            {
              isPriceDetailFetching ? <Spinner /> :
                <SizableText>
                  HK$ {priceDetail.subtotal}
                </SizableText>
            }
            <XStack space="$2">
              <StyledButton onPress={onAddCartPress}>
                {t('addToCart')}
                <AntDesign name="shoppingcart" color="#fff" />
              </StyledButton>
              <StyledButton onPress={onCheckoutPress}>
                {t('checkout')}
                <AntDesign name="tag" color="#fff" />
              </StyledButton>
            </XStack>
          </XStack>
        </YStack>
      </ActionSheet>
    </SafeAreaView>
  )
}

export default ProductDetail
