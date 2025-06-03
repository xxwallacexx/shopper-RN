import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Form, Input, Label, ScrollView, YStack } from 'tamagui';
import { getSelf, updateSelf } from '~/api';
import { useAuth, useLocale } from '~/hooks';
import { StyledButton } from '~/tamagui.config';
import { Spinner } from '~/components';
import { SafeAreaView } from 'react-native';
import Toast from 'react-native-toast-message';
import { useNavigation } from 'expo-router';
import { Address } from '~/types';

const EditAddress = () => {
  const { t } = useLocale();
  const navigation = useNavigation();
  const queryClient = useQueryClient();
  const { token } = useAuth();
  if (!token) return <></>;
  const { data: user } = useQuery({
    queryKey: ['profile', token],
    queryFn: async () => {
      return await getSelf(token);
    },
  });

  const { isPending: isSubmitting, mutate: updateSelfMutate } = useMutation({
    mutationFn: ({
      token,
      username,
      email,
      address,
    }: {
      token: string;
      username: string;
      email?: string;
      address?: Address;
    }) => {
      return updateSelf(token, username, email, address);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      navigation.goBack();
    },
    onError: (e) => {
      const error = e as Error;
      Toast.show({
        type: 'error',
        text1: t(error.message),
      });
    },
  });

  const [phoneNumber, setPhoneNumber] = useState(user?.address.phoneNumber);
  const [district, setDistrict] = useState(user?.address.district);
  const [street, setStreet] = useState(user?.address.street);
  const [room, setRoom] = useState(user?.address.room);
  if (!user) {
    return <></>;
  }

  const onSubmit = async () => {
    const { username, email } = user;
    const address = {
      phoneNumber: phoneNumber,
      room: room,
      street: street,
      district: district,
    };
    updateSelfMutate({ token, username, email, address });
  };

  const disabled =
    phoneNumber == '' ||
    !phoneNumber ||
    district == '' ||
    !district ||
    street == '' ||
    !street ||
    room == '' ||
    !room;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView>
        <Form onSubmit={onSubmit}>
          <YStack gap="$4" p="$2">
            <YStack w="100%" ai="flex-start" gap="$2">
              <Label>{t('contactNumber')}</Label>
              <Input
                w="100%"
                size="$4"
                autoCapitalize="none"
                disabled={isSubmitting}
                boc={'lightgrey'}
                bc={'whitesmoke'}
                defaultValue={user.address.phoneNumber}
                onChangeText={(value) => setPhoneNumber(value)}
              />
            </YStack>
            <YStack w="100%" ai="flex-start" space="$2">
              <Label>{t('district')}</Label>
              <Input
                w="100%"
                size="$4"
                autoCapitalize="none"
                disabled={isSubmitting}
                boc={'lightgrey'}
                bc={'whitesmoke'}
                defaultValue={user.address.district}
                onChangeText={(value) => setDistrict(value)}
              />
            </YStack>
            <YStack w="100%" alignItems="flex-start" space="$2">
              <Label>{t('streetName')}</Label>
              <Input
                w="100%"
                size="$4"
                autoCapitalize="none"
                disabled={isSubmitting}
                boc={'lightgrey'}
                bc={'whitesmoke'}
                defaultValue={user.address.street}
                onChangeText={(value) => setStreet(value)}
              />
            </YStack>
            <YStack w="100%" ai="flex-start" space="$2">
              <Label>{t('room')}</Label>
              <Input
                w="100%"
                size="$4"
                autoCapitalize="none"
                disabled={isSubmitting}
                boc={'lightgrey'}
                bc={'whitesmoke'}
                defaultValue={user.address.room}
                onChangeText={(value) => setRoom(value)}
              />
            </YStack>
            <Form.Trigger asChild disabled={isSubmitting}>
              <StyledButton disabled={disabled} w="100%">
                {t('confirm')}
              </StyledButton>
            </Form.Trigger>
            <Spinner />
          </YStack>
        </Form>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EditAddress;
