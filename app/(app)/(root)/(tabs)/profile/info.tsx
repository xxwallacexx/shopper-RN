import { useQuery } from "@tanstack/react-query"
import { Link, useRouter } from "expo-router"
import { useLayoutEffect } from "react"
import { RefreshControl, SafeAreaView, SectionList, TouchableOpacity } from "react-native"
import { Image } from "tamagui"
import { XStack } from "tamagui"
import { H2, SizableText, YStack } from "tamagui"
import { getSelf } from "~/api"
import { useAuth, useLocale } from "~/hooks"


const Info = () => {
  const { t } = useLocale()
  const { token, signout } = useAuth()
  const router = useRouter()
  const { data: user } = useQuery({ queryKey: ['profile', token], queryFn: async () => { return await getSelf(token!) } })

  let address = ''
  if (user?.address) {
    let addressToken = []
    addressToken.push(user.address.room)
    addressToken.push(user.address.street)
    addressToken.push(user.address.district)
    address = addressToken.join(', ')
  }

  const editList = [
    { label: t("username"), value: user?.username, screen: 'editUsername' },
    { label: t("email"), value: user?.email, screen: 'editEmail' },
    { label: t("address"), value: address, screen: 'editAddress' },
    { label: t("changePassword"), value: null, screen: 'editPassword' },
  ]


  const onRefresh = () => {
    console.log('refresh')
  }

  const onSignout = async () => {
    await signout()
    router.replace('/auth')
  }

  const renderSectionItem = ({ section }) => {
    switch (section.key) {
      case "main":
        return (
          <YStack space="$2" p="$2" alignItems="center">
            <Image
              resizeMode="contain"
              aspectRatio={1}
              source={{ uri: user?.avatar }}
              width={"20%"}
            />
            <SizableText>
              {user?.username}
            </SizableText>
          </YStack>
        )
      case "list":
        return (
          <>
            {editList.map((l) => {
              return (
                <Link key={l.label} href={`/profile/${l.screen}`} asChild>
                  <TouchableOpacity >
                    <XStack justifyContent="space-between" p="$2" borderBottomWidth="0.5" borderColor={"lightslategrey"}>
                      <SizableText color={"lightslategrey"}>{l.label}</SizableText>
                      <SizableText color="lightslategrey">{l.value}</SizableText>
                    </XStack>
                  </TouchableOpacity>
                </Link>

              )
            })}
            <TouchableOpacity>
              <XStack justifyContent="space-between" p="$2" borderBottomWidth="0.5" borderColor={"lightslategrey"}>
                <SizableText color={"lightslategrey"}>{t("removeUser")}</SizableText>
              </XStack>
            </TouchableOpacity>
            <TouchableOpacity onPress={onSignout}>
              <XStack justifyContent="space-between" p="$2" borderBottomWidth="0.5" borderColor={"lightslategrey"}>
                <SizableText color={"lightslategrey"}>{t("signout")}</SizableText>
              </XStack>
            </TouchableOpacity>
          </>
        )
      default:
        return <></>
    }
  }

  const renderSectionHeader = ({ section }) => {
    switch (section.key) {
      case "list":
        return (
          <H2>{t('editInfo')}</H2>
        );

      default:
        return <></>
    }
  }


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <SectionList
        refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={onRefresh}
          />
        }
        renderItem={renderSectionItem}
        sections={[
          { key: "main", data: [""] },
          { key: "list", data: [""] },
        ]}
        renderSectionHeader={renderSectionHeader}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item, index) => item + index}
        contentContainerStyle={{ padding: 12 }}
      />
    </SafeAreaView>
  )
}

export default Info
