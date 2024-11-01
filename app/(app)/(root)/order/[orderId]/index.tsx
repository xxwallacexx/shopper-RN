import { useQuery } from '@tanstack/react-query';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import moment from 'moment';
import { FlatList } from 'react-native';
import { Separator, SizableText, XStack } from 'tamagui';
import { ScrollView, YStack } from 'tamagui';
import { getOrder } from '~/api';
import { CheckoutItemCard, OrderProductCard } from '~/components';
import Loader from '~/components/Loader';
import { useAuth, useLocale } from '~/hooks';
import { Contact, DeliveryMethodEnum } from '~/types';

const DeliveryMethod = ({
  deliveryMethod,
  contact,
  pickUpStore,
}: {
  deliveryMethod: DeliveryMethodEnum;
  contact?: Contact;
  pickUpStore?: string;
}) => {
  const { t } = useLocale();
  return (
    <YStack>
      <SizableText>{t(deliveryMethod)}</SizableText>
      {deliveryMethod == DeliveryMethodEnum['SELF_PICK_UP'] ? (
        <SizableText>
          {t('store')}: {pickUpStore}
        </SizableText>
      ) : (
        <SizableText>
          {t('address')}: {contact?.room}, {contact?.street}, {contact?.district}
        </SizableText>
      )}
    </YStack>
  );
};

const OrderDetail = () => {
  const { orderId } = useLocalSearchParams<{ orderId: string }>();
  const navigation = useNavigation();
  const router = useRouter();
  const { t } = useLocale();
  const { token } = useAuth();
  if (!token) return <></>;

  const { isPending: isOrderLoading, data: order } = useQuery({
    queryKey: ['order', orderId],
    queryFn: async () => {
      return await getOrder(token, orderId);
    },
  });

  if (isOrderLoading) return <Loader />;

  let totalProducts =
    order?.products.reduce((acc, f) => {
      return acc + f.quantity;
    }, 0) ?? 0;
  let totalReservations = order?.reservations.length;
  let price = order?.price ?? 0;
  let shippingFee = order?.shippingFee ?? 0;

  console.log(order?.userCoupons);
  let discount = order?.userCoupons.reduce((acc, f) => {
    return acc + f.discount;
  }, 0);

  const orderStatus = () => {
    switch (order?.status) {
      case 'COMPLETE':
        return 'orderComplete';
      case 'PENDING':
        return 'orderPending';
      case 'CONFIRMED':
      default:
        return 'orderConfirm';
    }
  };

  const status = orderStatus();

  return (
    <ScrollView>
      <YStack
        flex={1}
        backgroundColor={'white'}
        p={'$2'}
        m={'$2'}
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
          {t('orderCreatedAt', { date: moment(order?.createdAt).format('YYYY-MM-DD') })}
        </SizableText>
        <SizableText numberOfLines={1}>
          {t('orderSummary', {
            totalProducts,
            totalReservations,
            shippingFee,
            price,
          })}
        </SizableText>

        <SizableText>
          {t('name')}: {order?.contact.name}
        </SizableText>
        <SizableText>
          {t('contactNumber')}: {order?.contact.phoneNumber}
        </SizableText>
      </YStack>
      <YStack
        backgroundColor={'white'}
        p={'$2'}
        m={'$2'}
        space="$1"
        borderRadius={'$radius.3'}
        shadowColor={'black'}
        shadowOffset={{
          height: 2,
          width: 0,
        }}
        shadowOpacity={0.25}
        shadowRadius={3.84}>
        <SizableText>{t('orderNumber', { orderId: order?.orderId })}</SizableText>
        <XStack space="$2">
          <SizableText>{t('orderTotal', { amount: order?.price.toFixed(1) })}</SizableText>
          <SizableText>{t('orderDiscount', { discount })}</SizableText>
        </XStack>
        <SizableText>{t(status)}</SizableText>

        {order?.deliveryMethod ? (
          <DeliveryMethod
            deliveryMethod={order?.deliveryMethod}
            contact={order?.contact}
            pickUpStore={order?.pickUpStore}
          />
        ) : null}
        {order?.products.length ? <Separator /> : null}
        <FlatList
          data={order?.products}
          renderItem={({ item }) => {
            return (
              <OrderProductCard
                choices={item.choices}
                quantity={item.quantity}
                product={item.product}
                price={item.price}
              />
            );
          }}
          scrollEnabled={false}
          ItemSeparatorComponent={() => {
            return <Separator />;
          }}
        />
      </YStack>
    </ScrollView>
  );
};

export default OrderDetail;
