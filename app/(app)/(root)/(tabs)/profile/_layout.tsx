import { AntDesign, MaterialIcons } from '@expo/vector-icons'
import { Drawer } from 'expo-router/drawer'
import { TouchableOpacity } from 'react-native'
import { useLocale } from '~/hooks'
import { PRIMARY_COLOR } from "@env";

export default function Layout() {
  const { t } = useLocale()
  return (
    <Drawer
      screenOptions={({ navigation }) => ({
        headerShown: true,
        headerStyle: { backgroundColor: PRIMARY_COLOR ?? "#fff" },
        drawerActiveTintColor: PRIMARY_COLOR ?? "#fff",
        headerTintColor: "#fff",
        drawerPosition: "right",
        headerLeft: () => { return null },
        headerRight: () => {
          return (
            <TouchableOpacity style={{ marginRight: 12 }} onPress={() => { return navigation.toggleDrawer() }}>
              <MaterialIcons name="menu" size={24} color={"#fff"} />
            </TouchableOpacity>
          )
        }
      })}>
      <Drawer.Screen
        name="index"
        options={{
          title: t('userInfo')
        }}
      />
      <Drawer.Screen
        name="info"
        options={{
          title: t('editInfo'),
        }}
      />
    </ Drawer >
  )
}
