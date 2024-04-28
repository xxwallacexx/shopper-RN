import { useQuery } from "@tanstack/react-query"
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router"
import { useEffect, useMemo, useState } from "react"
import { RefreshControl, SafeAreaView, SectionList } from "react-native"
import { Image, RadioGroup, XStack, YStack } from "tamagui"
import { H2, SizableText } from "tamagui"
import { getProductCheckoutItemsDetail, getSelf, getShop } from "~/api"
import { AddressForm, CartItemCard, RadioGroupItem } from "~/components"
import { useAuth, useLocale } from "~/hooks"
import { DeliveryMethodEnum, Address } from "~/types"

const Checkout = () => {
  const { productId, orderContentStr, currentCouponId } = useLocalSearchParams<{ productId: string, orderContentStr: string, currentCouponId?: string }>()
  const orderContent = JSON.parse(orderContentStr)
  const navigation = useNavigation()
  const router = useRouter()
  const { t } = useLocale()
  const { token } = useAuth()
  if (!token) return <></>

  const { data: user } = useQuery({
    queryKey: ['profile', token],
    queryFn: async () => { return await getSelf(token) },

  })
  const { data: shop, isLoading: isShopLoading } = useQuery({ queryKey: ['shop'], queryFn: getShop })
  const { data: itemDetail, isLoading: isItemDetailLoading } = useQuery({
    queryKey: ['itemDetail', productId, orderContent, currentCouponId],
    queryFn: async () => {
      return await getProductCheckoutItemsDetail(token, `${productId}`, orderContent, currentCouponId)
    }
  })

  const [selectedDeliveryMethod, setSelectedDeliveryMethod] = useState<string>()
  const [selectedStore, setSelectedStore] = useState<string>()
  const [address, setAddress] = useState<Address>()


  useEffect(() => {
    if (!shop) return
    setSelectedDeliveryMethod(shop.deliveryMethods[0])
    setSelectedStore(shop.stores[0])
  }, [shop])

  useEffect(() => {
    if (!user) return
    setAddress(user.address)
  }, [user])


  if (isShopLoading || isItemDetailLoading || !shop || !itemDetail || !user) return <></>



  const onRefresh = () => {
    console.log('on refresh')
  }

  const onAddressChange = (field: keyof Address, value: string) => {
    setAddress((prevAddress) => {
      let address = { ...prevAddress }
      address[field] = value
      return address
    })
  }

  const renderSectionHeader = ({ section }) => {
    switch (section.key) {
      case "cartItems":
        return (
          <H2 backgroundColor={"#fff"}>{t('orderDetail')}</H2>
        )
      case "deliveryMethod":
        return (
          <H2 backgroundColor={"#fff"}>{t('deliveryMethod')}</H2>
        )
      case "address":
        switch (selectedDeliveryMethod) {
          case DeliveryMethodEnum.SFEXPRESS:
            return (
              <H2 backgroundColor={"#fff"}>{t("address")}</H2>
            )
          case DeliveryMethodEnum.SELF_PICK_UP:
            return (
              <H2 backgroundColor={"#fff"}>{t("store")}</H2>
            )
          default:
            return <></>
        }
      case "paymentMethod":
        return (
          <H2 backgroundColor={"#fff"}>{t('paymentMethod')}</H2>
        )
      default:
        return <></>
    }
  }


  const renderSectionItem = ({ section }) => {
    switch (section.key) {
      case "store":
        return (
          <XStack space="$2" alignItems="center">
            <Image
              resizeMode="contain"
              aspectRatio={1}
              source={{ uri: shop.logo }}
              width={"10%"}
            />
            <SizableText>{shop.name}</SizableText>
          </XStack>
        )
      case "cartItems":
        return (
          <CartItemCard
            quantity={orderContent.quantity}
            product={itemDetail.product}
            coupon={itemDetail.coupon}
          />
        )
      case "deliveryMethod":
        return (
          <RadioGroup value={selectedDeliveryMethod} name={"deliveryMethod"} onValueChange={(value) => setSelectedDeliveryMethod(value)}>
            <YStack width={300} alignItems="center" space="$2">
              {
                shop.deliveryMethods.map((c) => {
                  return <RadioGroupItem
                    key={`radiogroup-${c}`}
                    value={c}
                    label={t(c)}
                    onLabelPress={(value) => setSelectedDeliveryMethod(value)}
                  />
                })
              }
            </YStack>
          </RadioGroup>
        )
      case "address":
        switch (selectedDeliveryMethod) {
          case DeliveryMethodEnum.SFEXPRESS:
            return (
              <AddressForm
                address={address}
                onChange={onAddressChange}
              />
            )
          case DeliveryMethodEnum.SELF_PICK_UP:
            return (
              <RadioGroup value={selectedStore} name={"store"} onValueChange={(value) => setSelectedStore(value)}>
                <YStack width={300} alignItems="center" space="$2">
                  {
                    shop.stores.map((s) => {
                      return <RadioGroupItem
                        key={`radiogroup-${s}`}
                        value={s}
                        label={s}
                        onLabelPress={(value) => setSelectedStore(value)}
                      />
                    })
                  }
                </YStack>
              </RadioGroup>
            )
          default:
            return <></>
        }

      default:
        return <></>
    }
  }

  console.log(itemDetail)
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <SectionList
        refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={() => onRefresh()}
          />
        }
        style={{
          backgroundColor: "#fff"
        }}
        contentContainerStyle={{ padding: 12, gap: 8 }}
        renderItem={renderSectionItem}
        renderSectionHeader={renderSectionHeader}
        sections={[
          { key: 'store', data: [''] },
          { key: "cartItems", data: [''] },
          { key: "deliveryMethod", data: [''] },
          { key: "address", data: [''] },
          { key: "paymentMethod", data: [''] }
        ]}
        keyExtractor={(item, index) => item + index}
      />
    </SafeAreaView>
  )
}

export default Checkout
