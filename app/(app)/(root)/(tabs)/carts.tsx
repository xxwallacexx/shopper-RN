import { useMutation, useQuery } from "@tanstack/react-query"
import { FlatList, RefreshControl, SectionList } from "react-native"
import { YStack, Card, SizableText, Text, Stack } from "tamagui"
import { cartItemGetTotalPrice, listCartItems, cartItemGetPriceDetail, getShop, updateCartItem, removeCartItem } from "~/api"
import { useAuth, useLocale } from "~/hooks"
import { BottomAction, Title } from "~/tamagui.config"
import Constants from 'expo-constants';
import { CartItemCard, StoreCard } from "~/components"
import { CartItem, DeliveryMethodEnum, OrderContent } from "~/types"
import { TouchableOpacity } from "react-native-gesture-handler"
import Toast from "react-native-toast-message"
const statusBarHeight = Constants.statusBarHeight;

console.log(statusBarHeight)
const Carts = () => {
  const { t } = useLocale()
  const { token } = useAuth()


  if (!token) return <></>


  const {
    data: cartItems = [],
    refetch: refetchCartItems
  } = useQuery({
    queryKey: [`cartItems`, token],
    queryFn: async () => {
      return await listCartItems(token)
    }
  })

  const {
    data: shop
  } = useQuery({
    queryKey: [`shop`],
    queryFn: async () => {
      return await getShop()
    }
  })

  const {
    data: totalPrice,
    isPending: isTotalPriceFetching
  } = useQuery({
    queryKey: [`cartItemGetTotalPrice`, token],
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
    queryKey: [`cartItemGetPriceDetail`, token],
    queryFn: async () => {
      //to do
      //couonIds
      return await cartItemGetPriceDetail(token, [])
    }
  })

  const { isPending: isCartItemUpdating, mutate: cartItemMutate } = useMutation({
    mutationFn: async ({ cartItemId, orderContent }: { cartItemId: string; orderContent: OrderContent }) => {
      return await updateCartItem(token, cartItemId, orderContent)
    },
    onSuccess: async (res) => {
      console.log('success')
      refetchCartItems()
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

  const { isPending: isCartItemRemoving, mutate: cartItemRemoveMutate } = useMutation({
    mutationFn: async ({ cartItemId }: { cartItemId: string }) => {
      return await removeCartItem(token, cartItemId)
    },
    onSuccess: async (res) => {
      console.log('success')
      refetchCartItems()
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


  if (!shop || !priceDetail) return <></>


  const onDeductPress = (itemId: string) => {
    let cartItem = cartItems.find((c) => { return c._id == itemId })
    if (!cartItem) return
    const quantity = cartItem.orderContent.quantity ?? 0
    const orderContent = {
      choices: cartItem.orderContent.choices.map((j) => { return j._id }),
      quantity: quantity - 1
    }
    cartItemMutate({ cartItemId: itemId, orderContent })
  }

  const onAddPress = (itemId: string) => {
    let cartItem = cartItems.find((c) => { return c._id == itemId })
    if (!cartItem) return
    const quantity = cartItem.orderContent.quantity ?? 0
    const orderContent = {
      choices: cartItem.orderContent.choices.map((j) => { return j._id }),
      quantity: quantity + 1
    }
    cartItemMutate({ cartItemId: itemId, orderContent })
  }

  const onRemovePress = (itemId: string) => {
    cartItemRemoveMutate({ cartItemId: itemId })
  }

  const renderOrder = ({ item }: { item: CartItem }) => {
    const { orderContent, product } = item
    let totalPrice = 0
    let singleItemPrice = 0
    let photos = []
    let stock = 0
    if (orderContent.choices && orderContent.choices.length && orderContent.stock) {
      totalPrice = (product.price + orderContent.stock.priceAdjustment) * orderContent.quantity!
      photos = item.orderContent.choices.map((f) => { return f.photo })
      stock = orderContent.stock.stock
      singleItemPrice = (product.price + orderContent.stock.priceAdjustment)
    } else {
      totalPrice = product.price * orderContent.quantity!
      photos = item.product.photos.map((f) => { return f.path })
      stock = product.stock
      singleItemPrice = product.price
    }

    //to-do
    //coupon discount

    return (
      <Stack m={"$2"}>
        <CartItemCard
          photoUri={photos[0]}
          totalPrice={totalPrice}
          stock={stock}
          singleItemPrice={singleItemPrice}
          product={product}
          orderContent={orderContent}
          onProductPress={() => console.log(product)}
          onDeductPress={() => onDeductPress(item._id)}
          onAddPress={() => onAddPress(item._id)}
          onRemovePress={() => onRemovePress(item._id)}
          isCartItemUpdating={isCartItemUpdating}
          isCartItemRemoving={isCartItemRemoving}
        />
      </Stack>

    )
  }

  const renderItem = ({ item, index, section }) => {
    switch (section.key) {
      case 'primary':
        return (
          <Title>{t("shoppingCart")}</Title>
        )
      case 'cartItems':

        const reservations = cartItems.filter((f) => { return f.type === 'RESERVATION' })
        const orders = cartItems.filter((f) => { return f.type === 'ORDER' })
        const includeDelivery = shop.deliveryMethods.includes(DeliveryMethodEnum["SFEXPRESS"])
        const freeShippingDiff = priceDetail.freeShippingPrice - priceDetail.subtotal
        const shippingFeeHints = includeDelivery && (freeShippingDiff > 0 ? t('freeShippingDiff', { diff: freeShippingDiff.toFixed(1), fee: priceDetail.nonfreeShippingFee.toFixed(1) }) : t('freeShippingHint'))

        return (
          <YStack space="$4" overflow="hidden">
            <StoreCard logo={shop.logo} name={shop.name} address={shop.address} />
            {
              orders.length ?
                <YStack flex={1}>
                  <SizableText>{shippingFeeHints}</SizableText>
                  <Text fontSize={"$7"}>{t("orders")}</Text>
                  <FlatList
                    scrollEnabled={false}
                    key={"orderList"}
                    data={orders}
                    renderItem={renderOrder}
                    keyExtractor={(item, index) => index.toString()}
                  />
                </YStack>
                : null
            }
          </YStack>
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
        contentContainerStyle={{ gap: 4 }}
        keyExtractor={(item, index) => item + index.toString()}
      >
        <BottomAction justifyContent="space-between">

        </BottomAction>
      </SectionList>
    </YStack >
  )
}

export default Carts
