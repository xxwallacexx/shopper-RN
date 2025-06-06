import { AntDesign } from '@expo/vector-icons';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import moment from 'moment';
import { FlatList, TouchableOpacity } from 'react-native';
import Toast from 'react-native-toast-message';
import { SizableText, YStack, XStack } from 'tamagui';

import { listNotifications, updateNotificationStatus } from '~/api';
import { Spinner } from '~/components';
import { useAuth, useLocale } from '~/hooks';
import { Badge, Container, Title } from '~/tamagui.config';
import { Notification as TNotification } from '~/types';

const Notification = () => {
  const { t } = useLocale();
  const { token } = useAuth();
  const queryClient = useQueryClient();

  if (!token) return <></>;

  const {
    data: notifications,
    isFetching: isNotificationsFetching,
    isFetchingNextPage: isFetchingMoreNotifications,
    fetchNextPage: fetchMoreNotifications,
  } = useInfiniteQuery({
    queryKey: ['notifications', token],
    initialPageParam: 0,
    queryFn: async ({ pageParam }: { pageParam: number }) => {
      return await listNotifications(token, pageParam);
    },
    getNextPageParam: (lastPage, pages) => {
      if (!lastPage) return null;
      if (!lastPage.length) return null;
      return pages.flat().length;
    },
  });

  const { isPending: isSubmitting, mutate: updateStatusMutate } = useMutation({
    mutationFn: ({ id }: { id: string }) => {
      return updateNotificationStatus(token, id, true);
    },
    onSuccess: async (res) => {
      queryClient.invalidateQueries({ queryKey: ['notificationCount'] });
      queryClient.resetQueries({ queryKey: ['notifications'] });
    },
    onError: (e) => {
      const error = e as Error;
      Toast.show({
        type: 'error',
        text1: t(error.message),
      });
    },
  });

  const notificationsData = notifications?.pages.flat() ?? [];

  const renderItem = ({ item }: { item: TNotification }) => {
    return (
      <TouchableOpacity
        disabled={item.read || isSubmitting}
        onPress={() => updateStatusMutate({ id: item._id })}>
        <YStack
          f={1}
          bc="white"
          p="$4"
          gap="$1"
          br="$radius.3"
          shac="black"
          shof={{
            height: 2,
            width: 0,
          }}
          shop={0.25}
          shar={3.84}>
          <XStack jc="space-between">
            <SizableText>
              {t('time')}: {moment(item.createdAt).format('YYYY-MM-DD HH:mm:ss')}
            </SizableText>
            <Badge bc={item.read ? 'slategrey' : '$primary'}>
              <SizableText col="white">{item.read ? t('read') : t('newest')}</SizableText>
            </Badge>
          </XStack>
          <SizableText>
            {t('notification')}: {item.notification.title}
          </SizableText>
          <SizableText col="slategrey">{item.notification.body}</SizableText>
        </YStack>
      </TouchableOpacity>
    );
  };
  return (
    <FlatList
      data={notificationsData}
      renderItem={renderItem}
      keyExtractor={(item, index) => index.toString()}
      style={{ flex: 1 }}
      contentContainerStyle={{ padding: 8 }}
      onEndReached={() => fetchMoreNotifications()}
      ListFooterComponent={() => {
        if (!isNotificationsFetching && !isFetchingMoreNotifications) {
          return null;
        }
        return (
          <XStack f={1} gap="$2" ai="center" jc="center">
            <Spinner color="$color.primary" />
            <SizableText col="slategrey">{t('loading')}</SizableText>
          </XStack>
        );
      }}
      ListEmptyComponent={() => {
        if (isNotificationsFetching || isFetchingMoreNotifications) {
          return null;
        }
        return (
          <Container ai="center">
            <AntDesign name="folderopen" size={120} color="$666" />
            <Title>{t('emptyContent')}</Title>
          </Container>
        );
      }}
    />
  );
};

export default Notification;
