import { PRIMARY_COLOR } from '@env';
import { Stack } from 'expo-router';

const Layout = () => {
  return (
    <Stack
      screenOptions={({ navigation }) => ({
        title: '',
        headerStyle: { backgroundColor: PRIMARY_COLOR ?? '#fff' },
      })}>
      <Stack.Screen
        name="(tabs)"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="product"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="coupon"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="profile"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="cartCheckout"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="order"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="reservation"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="productComment"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="feed"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="feedComment"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="qrPayment"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="notification"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
};

export default Layout;
