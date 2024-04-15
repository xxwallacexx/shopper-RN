import { Stack } from "expo-router"

const CouponLayout = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen
        name="[couponId]"
      />
    </Stack>
  )
}

export default CouponLayout
