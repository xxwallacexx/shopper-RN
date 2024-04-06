import { useLocalSearchParams } from "expo-router"
import { Stack, Text } from "tamagui"

const ProductDetail = () => {
  const { productId } = useLocalSearchParams()
  console.log(productId)

  return (
    <Stack>
      <Text>{productId}</Text>
    </Stack>
  )
}

export default ProductDetail
