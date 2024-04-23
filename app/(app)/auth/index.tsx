import { useQuery } from "@tanstack/react-query"
import { Link } from "expo-router"
import { StatusBar } from "expo-status-bar"
import { Platform, SafeAreaView } from "react-native"
import HTMLView from "react-native-htmlview"
import { Button, H2, ScrollView } from "tamagui"
import { getShop } from "~/api"
import { useLocale } from "~/hooks"
import { Container, StyledButton } from "~/tamagui.config"

const Auth = () => {
  const { t } = useLocale()

  const { data: shop } = useQuery({ queryKey: ['shop'], queryFn: async () => { return await getShop() } })

  if (!shop) return <></>

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Container space="$2">
        <H2>{t('TnC')}</H2>
        <ScrollView maxHeight={"$20"}>
          <HTMLView value={shop.terms} />
        </ScrollView>
        <Link href="/auth/signin" asChild>
          <StyledButton>
            {t('signin')}
          </StyledButton>
        </Link>
        <Button variant="outlined" color={"$primary"}>
          {t('createVisitorAcc')}
        </Button>
      </Container>
    </SafeAreaView>

  )
}


export default Auth
