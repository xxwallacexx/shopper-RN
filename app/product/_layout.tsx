import { Stack } from "expo-router"

const ProductLayout = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen
        name="index"
      />
      <Stack.Screen
        name="[productId]"
      />


    </Stack>
  )
}

export default ProductLayout
