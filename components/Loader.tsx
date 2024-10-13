import { ScrollView, SizableText, Spinner, Stack, XStack, YStack } from "tamagui"
import { useLocale } from "~/hooks/useLocale"

const Loader = ({ text }: { text?: string }) => {
  const { t } = useLocale()

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "transparent" }} contentContainerStyle={{ flex: 1, alignItems: "center" }} pt={"$8"}>
        <YStack alignItems="center">
          <Stack
            w={"$12"}
          >
          </Stack>
          <XStack justifyContent="center" w="100%" space={"$2"}>
            <Spinner />
            <SizableText>{text ? text : t('loading')}</SizableText>
          </XStack>
        </YStack>
    </ScrollView>
  )
}

export default Loader
