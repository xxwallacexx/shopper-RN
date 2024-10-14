import { useQuery } from "@tanstack/react-query"
import { RefreshControl, SectionList } from "react-native"
import { H1 } from "tamagui"
import { H2, Theme, YStack } from "tamagui"
import { cartItemGetTotalPrice, listCartItems, cartItemGetPriceDetail } from "~/api"
import { useAuth, useLocale } from "~/hooks"
import { BottomAction, Title } from "~/tamagui.config"
import Constants from 'expo-constants';
const statusBarHeight = Constants.statusBarHeight;

console.log(statusBarHeight)
const Carts = () => {
  const { t } = useLocale()
  const { token } = useAuth()

  if (!token) return <></>


  const {
    data: cartItems = [],
  } = useQuery({
    queryKey: [`cartItems`],
    queryFn: async () => {
      return await listCartItems(token)
    }
  })

  const {
    data: totalPrice,
    isPending: isTotalPriceFetching
  } = useQuery({
    queryKey: [`cartItemGetTotalPrice`],
    queryFn: async () => {
      //to do
      //couonIds
      return await cartItemGetTotalPrice(token, [])
    }
  })

  const {
    data: priceDetail,
    isPending: isPriceDetailFetching,
  } = useQuery({
    queryKey: [`cartItemGetPriceDetail`],
    queryFn: async () => {
      //to do
      //couonIds
      return await cartItemGetPriceDetail(token, [])
    }
  })


  const renderItem = ({ item, index, section }) => {
    switch (section.key) {
      case 'primary':
        return (
          <Title>{t("shoppingCart")}</Title>
        )
      case 'cartItems':
        const reservations = cartItems.filter((f) => { return f.type === 'RESERVATION' })
        const orders = cartItems.filter((f) => { return f.type === 'ORDER' })
        const shop = cartItems[0].shop
        return (
          <></>
        )
      default:
        return (<></>)
    }
  }

  return (
    <YStack flex={1} p="$4" pt={"$8"}>
      <SectionList
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={() => console.log('refresh')} />
        }
        renderItem={renderItem}
        sections={[
          { key: 'primary', data: [''] },
          { key: 'cartItems', data: [''] }
        ]}
        keyExtractor={(item, index) => item + index.toString()}
      >
        <BottomAction justifyContent="space-between">

        </BottomAction>
      </SectionList>
    </YStack >
  )
}

export default Carts
