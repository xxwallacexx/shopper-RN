import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useRef, useState } from 'react'
import { Form, Input, Label, YStack } from 'tamagui'
import { getSelf, updateSelf } from '~/api'
import { useAuth, useLocale } from '~/hooks'
import { StyledButton } from '~/tamagui.config'
import { Spinner } from '~/components'
import { SafeAreaView } from 'react-native'
import Toast from 'react-native-toast-message';
import { useNavigation } from 'expo-router'

const EditUsername = () => {
  const { t } = useLocale()
  const navigation = useNavigation()
  const queryClient = useQueryClient()
  const { token } = useAuth()
  const { data: user } = useQuery({ queryKey: ['profile', token], queryFn: async () => { return await getSelf(token) } })

  const { isPending: isSubmiting, mutate: updateSelfMutate } = useMutation({
    mutationFn: ({ token, username, email, address }: { token: string, username: string, email?: string, address?: Address }) => {
      return updateSelf(token, username, email, address)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] })
      navigation.goBack()
    },
    onError: (e) => {
      console.log(e)
      const error = e as Error
      Toast.show({
        type: 'error',
        text1: t(error.message),
      });
    }
  })

  const [username, setUsername] = useState<string>(user?.username ?? "")


  if (!user) {
    return <></>
  }

  const onChangeText = (value: string) => {
    setUsername(value)
  }

  const onSubmit = async () => {
    const { email, address } = user
    updateSelfMutate({ token, username, email, address })
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Form
        onSubmit={onSubmit}
      >
        <YStack space="$2" p="$2">
          <Label>
            {t('editUsername')}
          </Label>
          <Input
            autoCapitalize='none'
            disabled={isSubmiting}
            borderColor={"lightgrey"}
            backgroundColor={"whitesmoke"}
            defaultValue={user.username}
            onChangeText={onChangeText}
          />
          <Form.Trigger asChild disabled={isSubmiting}>
            <StyledButton
              disabled={username == "" || !username}
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

export default EditUsername
