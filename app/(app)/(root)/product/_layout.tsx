import { AntDesign } from "@expo/vector-icons"
import { Stack } from "expo-router"
import { TouchableOpacity } from "react-native"

const Layout = () => {
  return (
    <Stack
      screenOptions={({ navigation }) => ({
        title: "",
        headerShown: false,
      })}>
      <Stack.Screen
        name="index"
      />
      <Stack.Screen
        name="[productId]"
      />
    </Stack>
  )
}

export default Layout
