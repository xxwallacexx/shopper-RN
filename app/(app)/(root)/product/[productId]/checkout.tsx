import { useQuery } from "@tanstack/react-query"
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router"
import { RefreshControl, SafeAreaView, SectionList } from "react-native"
import { Card, Image, XStack } from "tamagui"
import { H2, SizableText } from "tamagui"
import { getProductCheckoutItemsDetail, getShop } from "~/api"
import { CartItemCard } from "~/components"
import { useAuth, useLocale } from "~/hooks"

const Checkout = () => {
  const { productId, orderContentStr, currentCouponId } = useLocalSearchParams<{ productId: string, orderContentStr: string, currentCouponId?: string }>()
  const orderContent = JSON.parse(orderContentStr)
  console.log(orderContent)
  const navigation = useNavigation()
  const router = useRouter()
  const { t } = useLocale()
  const { token } = useAuth()
  if (!token) return <></>


  const { data: shop, isLoading: isShopLoading } = useQuery({ queryKey: ['shop'], queryFn: getShop })
  const { data: itemDetail, isLoading: isItemDetailLoading } = useQuery({
    queryKey: ['itemDetail', productId, orderContent, currentCouponId],
    queryFn: async () => {
      return await getProductCheckoutItemsDetail(token, `${productId}`, orderContent, currentCouponId)
    }
  })

  if (isShopLoading || isItemDetailLoading || !shop || !itemDetail) return <></>

  const onRefresh = () => {
    console.log('on refresh')
  }

  const renderSectionHeader = ({ section }) => {
    switch (section.key) {
      case "cartItems":
        return (
          <H2 backgroundColor={"#fff"}>{t('orderDetail')}</H2>
        );

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
          { key: "cartItems", data: [''] }
        ]}
        keyExtractor={(item, index) => item + index}
      />
    </SafeAreaView>
  )
}

export default Checkout
