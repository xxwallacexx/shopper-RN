import { useLocalSearchParams } from "expo-router"

const CartCheckout = () => {
  const { selectedCouponIds } = useLocalSearchParams<{ selectedCouponIds: string[] }>()

  console.log(selectedCouponIds)
  return <></>
}

export default CartCheckout
