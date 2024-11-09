import { AntDesign } from '@expo/vector-icons';
import { useInfiniteQuery } from '@tanstack/react-query';
import moment from 'moment';
import { FlatList } from 'react-native';
import { SizableText, YStack } from 'tamagui';
import { XStack } from 'tamagui';
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
        flex={1}
        backgroundColor={'white'}
        p={'$4'}
        space="$1"
        borderRadius={'$radius.3'}
        shadowColor={'black'}
        shadowOffset={{
          height: 2,
          width: 0,
        }}
        shadowOpacity={0.25}
        shadowRadius={3.84}>
        <SizableText>
          {t('QRPaymentDate')}: {moment(item.createdAt).format('YYYY-MM-DD HH:mm:ss')}
        </SizableText>
        <SizableText>
          {t('totalPrice')}: {item.totalPrice}
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
          <XStack flex={1} space="$2" alignItems="center" justifyContent="center">
            <Spinner color="$color.primary" />
            <SizableText color="slategrey">{t('loading')}</SizableText>
          </XStack>
        );
      }}
      ListEmptyComponent={() => {
        if (isQRPaymentsFetching || isFetchingMoreQRPayments) {
          return null;
        }
        return (
          <Container alignItems="center">
            <AntDesign name="folderopen" size={120} color="$666" />
            <Title>{t('emptyContent')}</Title>
          </Container>
        );
      }}
    />
  );
};

export default QRPaymentHistory;
