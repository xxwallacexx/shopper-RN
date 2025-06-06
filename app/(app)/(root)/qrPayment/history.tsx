import { AntDesign } from '@expo/vector-icons';
import { useInfiniteQuery } from '@tanstack/react-query';
import moment from 'moment';
import { FlatList } from 'react-native';
import { SizableText, YStack, XStack } from 'tamagui';

import { listQRPayment } from '~/api';
import { Spinner } from '~/components';
import { useAuth, useLocale } from '~/hooks';
import { Container, Title } from '~/tamagui.config';
import { QRPayment } from '~/types';

const QRPaymentHistory = () => {
  const { token } = useAuth();
  const { t } = useLocale();

  if (!token) return <></>;
  const {
    data: qrPayments,
    isFetching: isQRPaymentsFetching,
    isFetchingNextPage: isFetchingMoreQRPayments,
    fetchNextPage: fetchMoreQRPayments,
  } = useInfiniteQuery({
    queryKey: ['qrPayments', token],
    initialPageParam: 0,
    queryFn: async ({ pageParam }: { pageParam: number }) => {
      return await listQRPayment(token, pageParam);
    },
    getNextPageParam: (lastPage, pages) => {
      if (!lastPage) return null;
      if (!lastPage.length) return null;
      return pages.flat().length;
    },
  });

  const qrPaymentsData = qrPayments?.pages ? qrPayments.pages.flat() : [];

  const renderItem = ({ item }: { item: QRPayment }) => {
    return (
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
        <SizableText>
          {t('QRPaymentDate')}: {moment(item.createdAt).format('YYYY-MM-DD HH:mm:ss')}
        </SizableText>
        <SizableText>
          {t('totalPrice')}: HK$ {item.totalPrice}
        </SizableText>
        <SizableText>
          {t('TransactionId')}: {item.stripeTransactionId}
        </SizableText>
      </YStack>
    );
  };

  return (
    <FlatList
      data={qrPaymentsData}
      renderItem={renderItem}
      keyExtractor={(item, index) => index.toString()}
      style={{ flex: 1 }}
      contentContainerStyle={{ padding: 8 }}
      onEndReached={() => fetchMoreQRPayments()}
      ListFooterComponent={() => {
        if (!isQRPaymentsFetching && !isFetchingMoreQRPayments) {
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
        if (isQRPaymentsFetching || isFetchingMoreQRPayments) {
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

export default QRPaymentHistory;
