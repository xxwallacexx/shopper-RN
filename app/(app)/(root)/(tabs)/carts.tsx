import { useMutation, useQuery } from '@tanstack/react-query';
import { FlatList, RefreshControl, SectionList, SafeAreaView } from 'react-native';
import { YStack, SizableText, Text, Stack, XStack } from 'tamagui';
import {
  cartItemGetTotalPrice,
  listCartItems,
  cartItemGetPriceDetail,
  getShop,
  updateCartItem,
  removeCartItem,
  cartItemListAvailableCoupons,
} from '~/api';
import { useAuth, useLocale } from '~/hooks';
import { BottomAction, Container, StyledButton, Title } from '~/tamagui.config';
import { OrderCartItemCard, Spinner, StoreCard } from '~/components';
import { AvailabelCoupon, CartItem, DeliveryMethodEnum, OrderContent } from '~/types';
import Toast from 'react-native-toast-message';
import ReservationCartItemCard from '~/components/ReservationCartItemCard';
import ActionSheet from '~/components/ActionSheet';
import { useEffect, useState } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { Skeleton } from 'moti/skeleton';

const Carts = () => {
  const { t } = useLocale();
  const { token } = useAuth();

  const [isCouponSheetOpen, setIsCouponSheetOpen] = useState(false);
  const [sheetPosition, setSheetPosition] = useState(0);
  const [selectedCoupons, setSelectedCoupons] = useState<
    { coupon: AvailabelCoupon; cartItemId: string }[]
  >([]);
  const [selectedCartItemId, setSelectedCartItemId] = useState<string>();

  if (!token) return <></>;

  const { data: cartItems = [], refetch: refetchCartItems } = useQuery({
    queryKey: [`cartItems`, token],
    queryFn: async () => {
      return await listCartItems(token);
    },
  });

  const { data: shop } = useQuery({
    queryKey: [`shop`],
    queryFn: async () => {
      return await getShop();
    },
  });

  const {
    data: totalPrice,
    isPending: isTotalPriceFetching,
    refetch: refetchTotalPrice,
  } = useQuery({
    queryKey: ['cartItemGetTotalPrice', token],
    queryFn: async () => {
      return await cartItemGetTotalPrice(
        token,
        selectedCoupons.map((c) => {
          return c.coupon._id;
        })
      );
    },
  });

  const {
    data: priceDetail,
    isPending: isPriceDetailFetching,
    refetch: refetchPriceDetail,
  } = useQuery({
    queryKey: ['cartItemGetPriceDetail', token],
    queryFn: async () => {
      return await cartItemGetPriceDetail(
        token,
        selectedCoupons.map((c) => {
          return c.coupon._id;
        })
      );
    },
  });

  const {
    isPending: isAvailabelCouponsFetching,
    data: availableCoupons = [],
    mutate: availableCouponsMutate,
  } = useMutation({
    mutationFn: async ({ cartItemId, quantity }: { cartItemId: string; quantity: number }) => {
      return await cartItemListAvailableCoupons(token, cartItemId, quantity);
    },
  });

  const { isPending: isCartItemUpdating, mutate: cartItemMutate } = useMutation({
    mutationFn: async ({
      cartItemId,
      orderContent,
    }: {
      cartItemId: string;
      orderContent: OrderContent;
    }) => {
      return await updateCartItem(token, cartItemId, orderContent);
    },
    onSuccess: async (res) => {
      refetchCartItems();
    },
    onError: (e) => {
      const error = e as Error;
      Toast.show({
        type: 'error',
        text1: t(error.message),
      });
    },
  });

  const { isPending: isCartItemRemoving, mutate: cartItemRemoveMutate } = useMutation({
    mutationFn: async ({ cartItemId }: { cartItemId: string }) => {
      return await removeCartItem(token, cartItemId);
    },
    onSuccess: async (res) => {
      refetchCartItems();
    },
    onError: (e) => {
      const error = e as Error;
      Toast.show({
        type: 'error',
        text1: t(error.message),
      });
    },
  });

  useEffect(() => {
    refetchTotalPrice();
    refetchPriceDetail();
  }, [selectedCoupons]);
  if (!shop) return <></>;

  const onDeductPress = (itemId: string) => {
    let cartItem = cartItems.find((c) => {
      return c._id == itemId;
    });
    if (!cartItem) return;
    const quantity = cartItem.orderContent.quantity ?? 0;
    const orderContent = {
      choices: cartItem.orderContent.choices.map((j) => {
        return j._id;
      }),
      quantity: quantity - 1,
    };
    cartItemMutate({ cartItemId: itemId, orderContent });
  };

  const onAddPress = (itemId: string) => {
    let cartItem = cartItems.find((c) => {
      return c._id == itemId;
    });
    if (!cartItem) return;
    const quantity = cartItem.orderContent.quantity ?? 0;
    const orderContent = {
      choices: cartItem.orderContent.choices.map((j) => {
        return j._id;
      }),
      quantity: quantity + 1,
    };
    cartItemMutate({ cartItemId: itemId, orderContent });
  };

  const onRemovePress = (itemId: string) => {
    cartItemRemoveMutate({ cartItemId: itemId });
  };

  const onAvailableCouponPress = (itemId: string) => {
    let cartItem = cartItems.find((c) => {
      return c._id == itemId;
    });
    if (!cartItem) return;
    let quantity = 0;
    switch (cartItem.type) {
      case 'RESERVATION':
        quantity = cartItem.reservationContent.quantity ?? 0;
        break;
      case 'ORDER':
      default:
        quantity = cartItem.orderContent.quantity ?? 0;
        break;
    }
    setSelectedCartItemId(itemId);
    availableCouponsMutate({ cartItemId: itemId, quantity });
    setIsCouponSheetOpen(true);
  };

  const renderOrder = ({ item }: { item: CartItem }) => {
    const { orderContent, product } = item;
    let totalPrice = 0;
    let singleItemPrice = 0;
    let photos = [];
    let stock = 0;
    if (orderContent.choices && orderContent.choices.length && orderContent.stock) {
      totalPrice = (product.price + orderContent.stock.priceAdjustment) * orderContent.quantity!;
      photos = item.orderContent.choices.map((f) => {
        return f.photo;
      });
      stock = orderContent.stock.stock;
      singleItemPrice = product.price + orderContent.stock.priceAdjustment;
    } else {
      totalPrice = product.price * orderContent.quantity!;
      photos = item.product.photos.map((f) => {
        return f.path;
      });
      stock = product.stock;
      singleItemPrice = product.price;
    }

    //to-do
    //coupon discount

    return (
      <Stack m={'$2'}>
        <OrderCartItemCard
          photoUri={photos[0]}
          totalPrice={totalPrice}
          stock={stock}
          singleItemPrice={singleItemPrice}
          product={product}
          orderContent={orderContent}
          onProductPress={() => console.log(product)}
          onDeductPress={() => onDeductPress(item._id)}
          onAddPress={() => onAddPress(item._id)}
          onAvailableCouponPress={() => onAvailableCouponPress(item._id)}
          onRemovePress={() => onRemovePress(item._id)}
          isCartItemUpdating={isCartItemUpdating}
          isCartItemRemoving={isCartItemRemoving}
        />
      </Stack>
    );
  };

  const renderReservation = ({ item }: { item: CartItem }) => {
    const { product, reservationContent } = item;
    const { reservation, option, quantity } = reservationContent;
    if (!reservation) return;
    let totalPrice = 0;
    let singleItemPrice = 0;
    let photos = item.product.photos.map((f) => {
      return f.path;
    });

    const reservationOption = reservation.options.find((f) => {
      return f._id == option;
    });
    singleItemPrice = reservationOption?.price ?? 0;
    totalPrice = singleItemPrice * quantity;

    //to-do
    //coupon discount
    return (
      <Stack m={'$2'}>
        <ReservationCartItemCard
          photoUri={photos[0]}
          totalPrice={totalPrice}
          stock={reservation.userCountMax}
          singleItemPrice={singleItemPrice}
          product={product}
          reservationContent={reservationContent}
          onProductPress={() => console.log(product)}
          onAvailableCouponPress={() => onAvailableCouponPress(item._id)}
          onRemovePress={() => onRemovePress(item._id)}
          isCartItemUpdating={isCartItemUpdating}
          isCartItemRemoving={isCartItemRemoving}
        />
      </Stack>
    );
  };

  const renderItem = ({ item, index, section }) => {
    switch (section.key) {
      case 'primary':
        return <Title>{t('shoppingCart')}</Title>;
      case 'cartItems':
        const reservations =
          cartItems.filter((f) => {
            return f.type === 'RESERVATION';
          }) ?? [];
        const orders =
          cartItems.filter((f) => {
            return f.type === 'ORDER';
          }) ?? [];
        const includeDelivery = shop.deliveryMethods.includes(DeliveryMethodEnum['SFEXPRESS']);
        const freeShippingPrice = priceDetail?.freeShippingPrice ?? 0;
        const subtotal = priceDetail?.subtotal ?? 0;
        const freeShippingDiff = freeShippingPrice - subtotal;
        const nonfreeShippingFee = priceDetail?.nonfreeShippingFee ?? 0;
        const shippingFeeHints =
          includeDelivery &&
          (freeShippingDiff > 0
            ? t('freeShippingDiff', {
                diff: freeShippingDiff.toFixed(1),
                fee: nonfreeShippingFee.toFixed(1),
              })
            : t('freeShippingHint'));

        return (
          <YStack space="$4" overflow="hidden">
            <StoreCard logo={shop.logo} name={shop.name} address={shop.address} />
            {orders.length ? (
              <YStack flex={1}>
                {isPriceDetailFetching ? (
                  <Skeleton height={36} colorMode="light" width={'100%'} />
                ) : (
                  <SizableText>{shippingFeeHints}</SizableText>
                )}
                <Text fontSize={'$7'}>{t('orders')}</Text>
                <FlatList
                  scrollEnabled={false}
                  key={'orderList'}
                  data={orders}
                  renderItem={renderOrder}
                  keyExtractor={(item, index) => item._id + index.toString()}
                />
              </YStack>
            ) : null}
            {reservations.length ? (
              <YStack flex={1}>
                <Text fontSize={'$7'}>{t('reservationOrders')}</Text>
                <FlatList
                  scrollEnabled={false}
                  key={'reservationList'}
                  data={reservations}
                  renderItem={renderReservation}
                  keyExtractor={(item, index) => item._id + index.toString()}
                />
              </YStack>
            ) : null}
          </YStack>
        );
      default:
        return <></>;
    }
  };

  const onCouponPress = (coupon: AvailabelCoupon) => {
    if (!selectedCartItemId) return;
    let _selectedCoupons = [...selectedCoupons];

    const index = _selectedCoupons.findIndex((c) => {
      return c.cartItemId == selectedCartItemId;
    });

    if (index !== -1) {
      // deslect
      if (_selectedCoupons[index].coupon._id == coupon._id) {
        _selectedCoupons.splice(index, 1);
      } else {
        _selectedCoupons[index] = {
          coupon,
          cartItemId: selectedCartItemId,
        };
      }
    } else {
      _selectedCoupons.push({ coupon, cartItemId: selectedCartItemId });
    }
    setSelectedCoupons(_selectedCoupons);
    setIsCouponSheetOpen(false);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <YStack flex={1}>
        <SectionList
          refreshControl={
            <RefreshControl refreshing={false} onRefresh={() => console.log('refresh')} />
          }
          renderItem={renderItem}
          sections={[
            { key: 'primary', data: [''] },
            { key: 'cartItems', data: [''] },
          ]}
          contentContainerStyle={{ gap: 4, padding: 12 }}
          keyExtractor={(item, index) => item + index.toString()}
        />
      </YStack>
      <BottomAction justifyContent="space-between">
        <SizableText>{`HK$ ${totalPrice?.toFixed(1)}`}</SizableText>
        <Link
          asChild
          href={{
            pathname: '/cartCheckout',
            params: {
              selectedCouponIds: selectedCoupons.map((c) => {
                return c.coupon._id;
              }),
            },
          }}>
          <StyledButton>{t('checkout')}</StyledButton>
        </Link>
      </BottomAction>
      <ActionSheet
        isSheetOpen={isCouponSheetOpen}
        setIsSheetOpen={setIsCouponSheetOpen}
        sheetPosition={sheetPosition}
        setSheetPosition={setSheetPosition}>
        <FlatList
          data={availableCoupons}
          renderItem={({ item }) => {
            const selectedCouponIds = selectedCoupons
              .filter((c) => {
                return c.cartItemId == selectedCartItemId;
              })
              .map((c) => {
                return c.coupon._id;
              });
            const selected = selectedCouponIds.includes(item._id);
            return (
              <StyledButton
                bg={selected ? '$primary' : 'slategrey'}
                onPress={() => onCouponPress(item)}>
                {item.coupon.name}
              </StyledButton>
            );
          }}
          ListFooterComponent={() => {
            if (isAvailabelCouponsFetching) {
              return (
                <XStack alignItems="center" justifyContent="center" space="$2">
                  <Spinner color="$slategrey" />
                  <SizableText>{t('couponLoading')}</SizableText>
                </XStack>
              );
            }
          }}
          ListEmptyComponent={() => {
            if (isAvailabelCouponsFetching) {
              return null;
            }
            return (
              <Container alignItems="center">
                <MaterialCommunityIcons
                  name="ticket-confirmation-outline"
                  size={120}
                  color={'#666'}
                />
                <Title>{t('noCoupon')}</Title>
              </Container>
            );
          }}
        />
      </ActionSheet>
    </SafeAreaView>
  );
};

export default Carts;
