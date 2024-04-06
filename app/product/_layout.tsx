import { Stack } from "expo-router"

const ProductLayout = () => {
  return (
    <Stack
      screenOptions={{
        headerShown:false,
      }}>
      <Stack.Screen
        name="[productId]"
        options={{
          headerTitle: ""
        }}
      />


    </Stack>
  )
}

export default ProductLayout
