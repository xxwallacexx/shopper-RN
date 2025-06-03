import { useQuery } from '@tanstack/react-query';
import { useLocalSearchParams, useRouter } from 'expo-router';
import moment from 'moment';
import { useState } from 'react';
import { FlatList, TouchableOpacity } from 'react-native';
import { Separator, SizableText, XStack, ScrollView, YStack } from 'tamagui';
import { getOrder } from '~/api';
import { OrderProductCard, OrderReservationCard, ActionSheet, Loader } from '~/components';
import { useAuth, useLocale } from '~/hooks';
import { StyledButton } from '~/tamagui.config';
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
  const router = useRouter();
  const { t } = useLocale();
  const { token } = useAuth();
  if (!token) return <></>;

  const [selectedProductId, setSelectedProductId] = useState<string>();
  const [isActionSheetOpen, setIsActionSheetOpen] = useState(false);
  const [actionSheetPosition, setActionSheetPosition] = useState(0);

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

  const onOrderPress = (productId: string) => {
    setSelectedProductId(productId);
    setIsActionSheetOpen(true);
  };

  return (
    <ScrollView>
      <YStack
        f={1}
        bc={'white'}
        p={'$2'}
        m={'$2'}
        gap="$1"
        br={'$radius.3'}
        shac={'black'}
        shof={{
          height: 2,
          width: 0,
        }}
        shop={0.25}
        shar={3.84}>
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
        {order?.products.length || order?.reservations.length ? <Separator /> : null}
        <FlatList
          data={order?.products}
          renderItem={({ item }) => {
            return (
              <TouchableOpacity onPress={() => onOrderPress(item.product._id)}>
                <OrderProductCard
                  choices={item.choices}
                  quantity={item.quantity}
                  product={item.product}
                  price={item.price}
                />
              </TouchableOpacity>
            );
          }}
          scrollEnabled={false}
          ItemSeparatorComponent={() => {
            return <Separator />;
          }}
        />
        <FlatList
          data={order?.reservations}
          renderItem={({ item }) => {
            const option = item.reservation.options.find((o) => {
              return o._id == item.option;
            });
            return (
              <TouchableOpacity
                onPress={() => {
                  onOrderPress(item.reservation.product._id);
                }}>
                <OrderReservationCard
                  option={option}
                  time={item.reservation.time}
                  quantity={item.quantity}
                  product={item.reservation.product}
                  price={item.price}
                />
              </TouchableOpacity>
            );
          }}
          scrollEnabled={false}
          ItemSeparatorComponent={() => {
            return <Separator />;
          }}
        />
      </YStack>
      <ActionSheet
        isSheetOpen={isActionSheetOpen}
        setIsSheetOpen={setIsActionSheetOpen}
        sheetPosition={actionSheetPosition}
        snapPoints={[40]}
        setSheetPosition={setActionSheetPosition}>
        <ScrollView>
          <YStack gap="$4">
            <StyledButton
              onPress={() => {
                setIsActionSheetOpen(false);
                router.navigate({
                  pathname: '/product/[productId]',
                  params: { productId: selectedProductId },
                });
              }}>
              {t('productDetail')}
            </StyledButton>
            <StyledButton
              onPress={() => {
                setIsActionSheetOpen(false);
                router.navigate({
                  pathname: '/product/[productId]/createComment',
                  params: { productId: selectedProductId },
                });
              }}>
              {t('createProductReview')}
            </StyledButton>
          </YStack>
        </ScrollView>
      </ActionSheet>
    </ScrollView>
  );
};

export default OrderDetail;
