import { AntDesign, MaterialIcons } from "@expo/vector-icons"
import { tokens } from "@tamagui/themes"
import { useQuery } from "@tanstack/react-query"
import { useLocalSearchParams } from "expo-router"
import moment from "moment"
import { RefreshControl, SectionList, SafeAreaView } from "react-native"
import HTMLView from "react-native-htmlview"
import { Image, Separator, SizableText, Text, XStack, YStack } from "tamagui"
import { getCoupon } from "~/api"
import { useAuth, useLocale } from "~/hooks"
import { BottomAction, Container, StyledButton, Title } from "~/tamagui.config"

const CouponDetail = () => {
  const { couponId } = useLocalSearchParams()
  const { t } = useLocale()
  const { token } = useAuth()

  if(!token)return <></>

  const { data: coupon } = useQuery({
    queryKey: ['coupon', couponId],
    queryFn: async () => { return await getCoupon(token, `${couponId}`) }
  })

  console.log(coupon)

  const onRefresh = () => {
    console.log('refresh')
  }

  if (!coupon) {
    return <></>
  }
  const renderSectionItem = ({ item, index, section }) => {
    const { photo, name, shop, endDate, detail, minPriceRequired, maxPurchase, discount, terms } = coupon

    switch (section.key) {
      case 'cover':
        return (
          <Image
            backgroundColor={"#fff"}
            resizeMode="contain"
            aspectRatio={16 / 9}
            source={{ uri: photo }}
            width={"100%"}
          />
        )
      case 'shop':
        return (
          <Container space="$2">
            <YStack space="$2">
              <XStack space="$2" alignItems="center">
                <AntDesign name="isv" color={tokens.color.gray10Dark.val} />
                <Text color={"lightslategray"}>{shop.name}</Text>
              </XStack>
              <XStack space="$2" alignItems="center">
                <MaterialIcons name="location-pin" color={tokens.color.gray10Dark.val} />
                <Text color="lightslategray">{shop.address}</Text>
              </XStack>
            </YStack>
            <XStack space={4} alignItems="center">
              <AntDesign name="clockcircleo" />
              <SizableText>{moment(endDate).format('YYYY-MM-DD HH:mm')}</SizableText>
            </XStack>
            <Text>{name}</Text>
          </Container>
        )
      case 'description':
        return (
          <Container space="$2">
            <Separator borderColor={"lightslategray"} />
            <YStack space="$4">
              <Title>{t('couponIntro')}</Title>
              <HTMLView value={detail} />
            </YStack>
          </Container>
        )
      case 'detail':
        return (
          <Container space="$2">
            <YStack space="$4">
              <Title>{t('userCouponDetail')}</Title>
              <Text>{t('minPriceRequired', { minPriceRequired })}</Text>
              <Text>{t('maxPurchase', { maxPurchase })}</Text>
              <Text>{t('discount', { discount })}</Text>
            </YStack>
          </Container>
        )
      case 'tnc':
        return (
          <Container space="$2">
            <Separator borderColor={"lightslategray"} />
            <YStack space="$4">
              <Title>{t('TnC')}</Title>
              <HTMLView value={terms} />
            </YStack>
          </Container>
        )
      default:
        return (
          <></>
        )
    }

  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <YStack flex={1}>
        <SectionList
          refreshControl={
            <RefreshControl
              refreshing={false}
              onRefresh={onRefresh}
            />
          }
          renderItem={renderSectionItem}
          sections={[
            { key: 'cover', data: [''] },
            { key: 'shop', data: [''] },
            { key: 'description', data: [''] },
            { key: 'detail', data: [''] },
            { key: 'tnc', data: [''] },
          ]}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, index) => item + index}
        />
        <BottomAction justifyContent="space-between">
          <SizableText>{t('creditRequired', { credit: coupon.credit })}</SizableText>
          <StyledButton onPress={() => console.log('press')}>
            {t('getCoupon')}
            <MaterialIcons name="discount" color="#fff" />
          </StyledButton>
        </BottomAction>
      </YStack>
    </SafeAreaView>
  )
}

export default CouponDetail
