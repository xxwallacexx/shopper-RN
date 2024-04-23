import { AntDesign } from "@expo/vector-icons"
import { Stack } from "expo-router"
import { TouchableOpacity } from "react-native"

const Layout = () => {
  return (
    <Stack
      screenOptions={({ navigation }) => ({
        title: "",
        headerShown: true,
        headerLeft: () => {
          return (
            <TouchableOpacity onPress={() => { return navigation.goBack() }}>
              <AntDesign name="arrowleft" size={24} color={"#fff"} />
            </TouchableOpacity>
          )
        },
        headerStyle: { backgroundColor: process.env.EXPO_PUBLIC_PRIMARY_COLOR ?? "#fff" }
      })}>
      <Stack.Screen
        name="editUsername"
      />
      <Stack.Screen
        name="editEmail"
      />
      <Stack.Screen
        name="editAddress"
      />
    </Stack>
  )
}

export default Layout
