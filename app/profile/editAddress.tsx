import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { Form, Input, Label, ScrollView, YStack } from 'tamagui'
import { getSelf, updateSelf } from '~/api'
import { useAuth, useLocale } from '~/hooks'
import { StyledButton } from '~/tamagui.config'
import { Spinner } from '~/components'
import { SafeAreaView } from 'react-native'
import Toast from 'react-native-toast-message';
import { useNavigation } from 'expo-router'

const EditAddress = () => {
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


  const [phoneNumber, setPhoneNumber] = useState(user?.address.phoneNumber)
  const [district, setDistrict] = useState(user?.address.district)
  const [street, setStreet] = useState(user?.address.street)
  const [room, setRoom] = useState(user?.address.room)
  if (!user) {
    return <></>
  }


  const onSubmit = async () => {
    const { username, email } = user
    const address = {
      phoneNumber: phoneNumber,
      room: room,
      street: street,
      district: district
    }
    updateSelfMutate({ token, username, email, address })
  }

  const disabled = phoneNumber == "" || !phoneNumber || district == "" || !district || street == "" || !street || room == "" || !room
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView>
        <Form
          onSubmit={onSubmit}
        >
          <YStack space="$2" p="$2">
            <Label>
              {t('contactNumber')}
            </Label>
            <Input
              autoCapitalize='none'
              disabled={isSubmiting}
              borderColor={"lightgrey"}
              backgroundColor={"whitesmoke"}
              defaultValue={user.address.phoneNumber}
              onChangeText={(value) => setPhoneNumber(value)}
            />
            <Label>
              {t('district')}
            </Label>
            <Input
              autoCapitalize='none'
              disabled={isSubmiting}
              borderColor={"lightgrey"}
              backgroundColor={"whitesmoke"}
              defaultValue={user.address.district}
              onChangeText={(value) => setDistrict(value)}
            />
            <Label>
              {t('streetName')}
            </Label>
            <Input
              autoCapitalize='none'
              disabled={isSubmiting}
              borderColor={"lightgrey"}
              backgroundColor={"whitesmoke"}
              defaultValue={user.address.street}
              onChangeText={(value) => setStreet(value)}
            />
            <Label>
              {t('room')}
            </Label>
            <Input
              autoCapitalize='none'
              disabled={isSubmiting}
              borderColor={"lightgrey"}
              backgroundColor={"whitesmoke"}
              defaultValue={user.address.room}
              onChangeText={(value) => setRoom(value)}
            />
            <Form.Trigger asChild disabled={isSubmiting}>
              <StyledButton
                disabled={disabled}
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
      </ScrollView>
    </SafeAreaView>
  )
}

export default EditAddress
