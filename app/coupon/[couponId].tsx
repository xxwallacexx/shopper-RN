import { useLocalSearchParams } from "expo-router"
import { SizableText } from "tamagui"

const CouponDetail = () => {
  const {couponId}=useLocalSearchParams()
  return (
    <SizableText>
      {couponId}
    </SizableText>
  )
}

export default CouponDetail
