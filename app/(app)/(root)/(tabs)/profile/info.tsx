import { useMutation, useQuery } from '@tanstack/react-query';
import { Link, useRouter } from 'expo-router';
import { RefreshControl, SafeAreaView, SectionList, TouchableOpacity } from 'react-native';
import { H2, SizableText, YStack, Image, XStack } from 'tamagui';

import { getSelf, getShop, removeUser } from '~/api';
import { useAuth, useLocale } from '~/hooks';
import { DeliveryMethodEnum } from '~/types';

const Info = () => {
  const { t } = useLocale();
  const { token, signout } = useAuth();
  if (!token) return <></>;
  const router = useRouter();
  const { data: user, refetch: userRefetch } = useQuery({
    queryKey: ['profile', token],
    queryFn: async () => {
      return await getSelf(token!);
    },
  });
  const { data: shop } = useQuery({
    queryKey: ['shop'],
    queryFn: async () => {
      return await getShop();
    },
  });

  const includeDelivery = shop?.deliveryMethods.includes(DeliveryMethodEnum['SFEXPRESS']);

  let address = '';
  if (user?.address) {
    const addressToken = [];
    addressToken.push(user.address.room);
    addressToken.push(user.address.street);
    addressToken.push(user.address.district);
    address = addressToken.join(', ');
  }

  const editList = [
    { label: t('username'), value: user?.username, screen: 'editUsername' },
    { label: t('email'), value: user?.email, screen: 'editEmail' },
    { label: t('changePassword'), value: null, screen: 'editPassword' },
  ];

  if (includeDelivery) {
    editList.splice(2, 0, { label: t('address'), value: address, screen: 'editAddress' });
  }

  const onRefresh = () => {
    userRefetch();
  };

  const onSignout = async () => {
    await signout();
    router.replace('/auth');
  };

  const { mutate: removeUserMutate } = useMutation({
    mutationFn: () => {
      return removeUser(token);
    },
    onSuccess: async () => {
      await signout();
      router.replace('/auth');
    },
  });

  const renderSectionItem = ({ section }) => {
    switch (section.key) {
      case 'main':
        return (
          <YStack gap="$2" p="$2" ai="center">
            <Image objectFit="contain" aspectRatio={1} source={{ uri: user?.avatar }} w="20%" />
            <SizableText>{user?.username}</SizableText>
          </YStack>
        );
      case 'list':
        return (
          <>
            {editList.map((l) => {
              return (
                <Link key={l.label} href={`/profile/${l.screen}`} asChild>
                  <TouchableOpacity>
                    <XStack jc="space-between" p="$2" bbw="$0.5" boc="lightslategrey">
                      <SizableText col="lightslategrey">{l.label}</SizableText>
                      <SizableText col="lightslategrey">{l.value}</SizableText>
                    </XStack>
                  </TouchableOpacity>
                </Link>
              );
            })}
            <TouchableOpacity
              onPress={() => {
                return removeUserMutate();
              }}>
              <XStack jc="space-between" p="$2" bbw="$0.5" boc="lightslategrey">
                <SizableText col="lightslategrey">{t('removeUser')}</SizableText>
              </XStack>
            </TouchableOpacity>
            <TouchableOpacity onPress={onSignout}>
              <XStack jc="space-between" p="$2" bbw="$0.5" boc="lightslategrey">
                <SizableText col="lightslategrey">{t('signout')}</SizableText>
              </XStack>
            </TouchableOpacity>
          </>
        );
      default:
        return <></>;
    }
  };

  const renderSectionHeader = ({ section }) => {
    switch (section.key) {
      case 'list':
        return <H2>{t('editInfo')}</H2>;

      default:
        return <></>;
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <SectionList
        refreshControl={<RefreshControl refreshing={false} onRefresh={onRefresh} />}
        renderItem={renderSectionItem}
        sections={[
          { key: 'main', data: [''] },
          { key: 'list', data: [''] },
        ]}
        renderSectionHeader={renderSectionHeader}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item, index) => item + index}
        contentContainerStyle={{ padding: 12 }}
      />
    </SafeAreaView>
  );
};

export default Info;
