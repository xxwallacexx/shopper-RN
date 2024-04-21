
import { useQuery } from '@tanstack/react-query'
import { useRef, useState } from 'react'
import { Form, Input, Label, YStack } from 'tamagui'
import { getSelf, updateSelf } from '~/api'
import { useAuth, useLocale } from '~/hooks'
import { StyledButton } from '~/tamagui.config'
import { Spinner } from '~/components'
import { SafeAreaView } from 'react-native'
import Toast from 'react-native-toast-message';
import { useNavigation } from 'expo-router'

const EditEmail = () => {
  const { t } = useLocale()
  const navigation = useNavigation()
  const [isSubmiting, setIsSubmiting] = useState(false)

  const { token } = useAuth()
  const { data: user } = useQuery({ queryKey: ['profile', token], queryFn: async () => { return await getSelf(token) } })
  const inputRef = useRef<string | undefined>(user?.email)
  if (!user) {
    return <></>
  }

  const onChangeText = (text: string) => {
    inputRef.current = text
  }


  const onSubmit = async () => {
    if (!inputRef.current) return
    const { username, address } = user
    setIsSubmiting(true)
    try {
      await updateSelf(token, username, inputRef.current, address)
    }
    catch (e) {
      const error = e as Error
      Toast.show({
        type: 'error',
        text1: t(error.message),
      });
      console.log(error.message)
      setIsSubmiting(false)
    }
    setIsSubmiting(false)
    navigation.goBack()

  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Form
        onSubmit={onSubmit}
      >
        <YStack space="$2" p="$2">
          <Label>
            {t('editEmail')}
          </Label>
          <Input
            disabled={isSubmiting}
            borderColor={"lightgrey"}
            backgroundColor={"whitesmoke"}
            defaultValue={user.email}
            onChangeText={onChangeText}
          />
          <Form.Trigger asChild disabled={isSubmiting}>
            <StyledButton
              alignSelf='center'
              m="$4"
              w="$20"
              style={{ opacity: isSubmiting ? 0.5 : 1 }}
              icon={isSubmiting ? <Spinner /> : null}
            >
              Submit
            </StyledButton>
          </Form.Trigger>
          <Spinner />
        </YStack>
      </Form>
    </SafeAreaView>
  )
}

export default EditEmail
