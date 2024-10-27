import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, RefreshControl, SafeAreaView, SectionList } from 'react-native';
import { H2, Label, RadioGroup, Input, YStack, XStack, Text, SizableText } from 'tamagui';
import {
  checkIsVerified,
  createProductOrder,
  getProductCheckoutItemsDetail,
  getSelf,
  getShop,
  getVerifyCode,
  verifyCode as verifySms,
  getProductTotalPrice,
  listProductAvailableCoupons,
  getProductPriceDetail,
} from '~/api';
import {
  AddressForm,
  CheckoutItemCard,
  PaymentSheetCard,
  RadioGroupItem,
  Spinner,
  StoreCard,
} from '~/components';
import { useAuth, useCountdown, useLocale } from '~/hooks';
import { BottomAction, Container, StyledButton, Title } from '~/tamagui.config';
import {
  DeliveryMethodEnum,
  Address,
  Contact,
  OrderContent,
  PaymentMethodEnum,
  UserCoupon,
} from '~/types';
import {
  createPlatformPayToken,
  createToken,
  isPlatformPaySupported,
  PlatformPay,
} from '@stripe/stripe-react-native';
import Toast from 'react-native-toast-message';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
import { tokens } from '@tamagui/themes';
import ActionSheet from '~/components/ActionSheet';
import { ScrollView } from 'tamagui';

const Checkout = () => {
  const { productId, orderContentStr } = useLocalSearchParams<{
    productId: string;
    orderContentStr: string;
  }>();
  const orderContent = JSON.parse(orderContentStr);
  const navigation = useNavigation();
  const router = useRouter();
  const { t } = useLocale();
  const { token } = useAuth();
  const [isCardCompleted, setIsCardCompleted] = useState(false);
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verifyCode, setVerifyCode] = useState('');
  const [isPaymenySheetOpen, setIsPaymentSheetOpen] = useState(false);
  const [paymentSheetPosition, setPaymentSheetPosition] = useState(0);

  const [isUserCouponSheetOpen, setIsUserCouponSheetOpen] = useState(false);
  const [userCouponSheetPosition, setUserCouponSheetPosition] = useState(0);

  const [selectedCoupon, setSelectedCoupon] = useState<UserCoupon>();
  const [selectedDeliveryMethod, setSelectedDeliveryMethod] =
    useState<keyof typeof DeliveryMethodEnum>();
  const [selectedStore, setSelectedStore] = useState<string>();
  const [address, setAddress] = useState<Address>();
  const [timer, setTimer] = useState(new Date());
  const [seconds] = useCountdown(timer);

  const { data: isPlatformPayAvailable, isLoading: isPlatformPaySupportedLoading } = useQuery({
    queryKey: ['platformPay'],
    queryFn: async () => {
      return await isPlatformPaySupported();
    },
  });
  if (!token) return <></>;

  const { isPending: isAvailabelCouponsFetching, data: availableCoupons = [] } = useQuery({
    queryKey: ['productAvailableCoupons', token, productId, orderContent],
    queryFn: async () => {
      return await listProductAvailableCoupons(token, productId, orderContent);
    },
  });

  const { data: user } = useQuery({
    queryKey: ['profile', token],
    queryFn: async () => {
      let response = await getSelf(token);
      setAddress(response.address);
      setName(response?.address?.name ?? '');
      setPhoneNumber(response?.address?.phoneNumber ?? '');
      return response;
    },
  });

  const { data: isVerified, refetch: refretchIsVerified } = useQuery({
    queryKey: ['isVerified', token],
    queryFn: async () => {
      return await checkIsVerified(token);
    },
  });

  const { data: shop, isLoading: isShopLoading } = useQuery({
    queryKey: ['shop'],
    queryFn: async () => {
      let response = await getShop();
      setSelectedDeliveryMethod(response.deliveryMethods[0]);
      setSelectedStore(response.stores[0]);
      return response;
    },
  });

  const {
    data: itemDetail,
    isPending: isItemDetailLoading,
    refetch: refetchItemDetail,
  } = useQuery({
    queryKey: ['itemDetail', productId, orderContent],
    queryFn: async () => {
      return await getProductCheckoutItemsDetail(
        token,
        `${productId}`,
        orderContent,
        selectedCoupon?._id
      );
    },
  });

  const {
    data: totalPrice,
    isPending: isTotalPriceLoading,
    refetch: refetchTotalPrice,
  } = useQuery({
    queryKey: ['productTotalPrice', productId, orderContent, selectedDeliveryMethod],
    queryFn: async () => {
      return await getProductTotalPrice(
        token,
        `${productId}`,
        orderContent,
        selectedDeliveryMethod ? selectedDeliveryMethod : 'SELF_PICK_UP',
        selectedCoupon?._id
      );
    },
  });

  const {
    data: priceDetail,
    isPending: isPriceDetailLoading,
    refetch: refetchPriceDetail,
  } = useQuery({
    queryKey: ['productPriceDetail', productId, orderContent],
    queryFn: async () => {
      return await getProductPriceDetail(token, `${productId}`, orderContent, selectedCoupon?._id);
    },
  });

  const { mutate: onGetVerifyCodeSubmit, isPending: isGetVerifyCodeSubmitting } = useMutation({
    mutationFn: async () => {
      return await getVerifyCode(token, phoneNumber);
    },
    onSuccess: (res) => {
      const duration = 30;
      const date = new Date();
      const targetDate = date.setSeconds(date.getSeconds() + duration);
      setTimer(new Date(targetDate));
    },
    onError: (e) => {
      Toast.show({
        position: 'top',
        type: 'error',
        text1: t('getVerifyCodeError'),
      });
    },
  });

  const { mutate: onVerifyCodeSubmit, isPending: isVerifyCodeSubmitting } = useMutation({
    mutationFn: async () => {
      return await verifySms(token, verifyCode);
    },
    onSuccess: (res) => {
      refretchIsVerified();
    },
    onError: (e) => {
      Toast.show({
        position: 'top',
        type: 'error',
        text1: t('verificationError'),
      });
    },
  });

  const { mutate: onCreateProductOrderSubmit, isPending: isCreateProductOrderSubmitting } =
    useMutation({
      mutationFn: async ({
        stripeTokenId,
        contact,
        orderContent,
        deliveryMethod,
        paymentMethod,
        selectedCouponId,
        pickUpStore,
      }: {
        stripeTokenId: string;
        contact: Contact;
        orderContent: OrderContent;
        deliveryMethod: keyof typeof DeliveryMethodEnum;
        paymentMethod: keyof typeof PaymentMethodEnum;
        selectedCouponId?: string;
        pickUpStore?: string;
      }) => {
        return await createProductOrder(
          token,
          productId,
          stripeTokenId,
          contact,
          orderContent,
          deliveryMethod,
          paymentMethod,
          selectedCouponId,
          pickUpStore
        );
      },
      onSuccess: (res) => {
        console.log('success!');
      },
      onError: (e) => {
        Toast.show({
          position: 'top',
          type: 'error',
          text1: t(e.message),
        });
      },
    });

  useEffect(() => {
    refetchItemDetail();
    refetchTotalPrice();
    refetchPriceDetail();
  }, [selectedCoupon]);

  if (
    isShopLoading ||
    isItemDetailLoading ||
    !shop ||
    !itemDetail ||
    !priceDetail ||
    !user ||
    isVerified == undefined ||
    isPlatformPayAvailable == undefined ||
    isPlatformPaySupportedLoading
  )
    return <></>;

  const onRefresh = () => {
    console.log('on refresh');
  };

  const onAddressChange = (field: keyof Address, value: string) => {
    setAddress((prevAddress) => {
      let address = { ...prevAddress };
      address[field] = value;
      return address;
    });
  };

  const renderSectionHeader = ({ section }: { section: { key: string } }) => {
    switch (section.key) {
      case 'cartItems':
        return <H2 backgroundColor={'#fff'}>{t('orderDetail')}</H2>;
      case 'deliveryMethod':
        return <H2 backgroundColor={'#fff'}>{t('deliveryMethod')}</H2>;
      case 'contact':
        return <H2 backgroundColor={'#fff'}>{t('contactInfo')}</H2>;
      case 'coupon':
        return <H2 backgroundColor={'#fff'}>{t('coupon')}</H2>;
      case 'address':
        switch (selectedDeliveryMethod) {
          case DeliveryMethodEnum.SFEXPRESS:
            return <H2 backgroundColor={'#fff'}>{t('address')}</H2>;
          case DeliveryMethodEnum.SELF_PICK_UP:
            return <H2 backgroundColor={'#fff'}>{t('store')}</H2>;
          default:
            return <></>;
        }
      case 'paymentMethod':
        return <H2 backgroundColor={'#fff'}>{t('paymentMethod')}</H2>;
      default:
        return <></>;
    }
  };

  const isSubmitting = false;

  const onGetVerifyCodePress = () => {
    if (phoneNumber.length !== 8 || isGetVerifyCodeSubmitting || seconds > 0) return;
    onGetVerifyCodeSubmit();
  };

  const onVerifyCodePress = () => {
    if (!verifyCode.length || isVerifyCodeSubmitting) return;
    onVerifyCodeSubmit();
  };

  const renderSectionItem = ({ section }: { section: { key: string } }) => {
    switch (section.key) {
      case 'store':
        return <StoreCard logo={shop.logo} name={shop.name} address={shop.address} />;
      case 'cartItems':
        return (
          <CheckoutItemCard
            quantity={orderContent.quantity}
            product={itemDetail.product}
            coupon={itemDetail.coupon}
          />
        );
      case 'coupon':
        return (
          <StyledButton
            bg={selectedCoupon ? '$primary' : 'slategrey'}
            onPress={() => setIsUserCouponSheetOpen(true)}>
            {selectedCoupon ? selectedCoupon.coupon.name : t('redeemCoupon')}
          </StyledButton>
        );
      case 'contact':
        return (
          <YStack space="$2" p="$2">
            <Label>{t('name')}</Label>
            <Input
              value={name}
              autoCapitalize="none"
              autoCorrect={false}
              disabled={isSubmitting}
              onChangeText={(value) => setName(value)}
            />
            <XStack space="$2" alignItems="center">
              <Label>{t('contactNumber')}</Label>
              {isVerified ? (
                <XStack space="$1" alignItems="center">
                  <AntDesign color={tokens.color.green9Light.val} name="checkcircleo" />
                  <Text color="$green9" fontSize={'$2'}>
                    {t('verified')}
                  </Text>
                </XStack>
              ) : null}
            </XStack>
            <XStack w="100%" alignItems="flex-start" space="$1">
              <Input
                flex={1}
                value={phoneNumber}
                keyboardType="number-pad"
                autoCapitalize="none"
                autoCorrect={false}
                disabled={isSubmitting || isVerified}
                onChangeText={(value) => setPhoneNumber(value)}
              />
              {isVerified ? null : (
                <StyledButton
                  disabled={phoneNumber.length !== 8 || seconds > 0 ? true : false}
                  w="35%"
                  size="$4"
                  onPress={onGetVerifyCodePress}>
                  {seconds > 0 ? `${t('verify')} (${seconds}s)` : t('getVerifyCode')}
                </StyledButton>
              )}
            </XStack>

            {isVerified ? null : (
              <>
                <Label>{t('verifyCode')}</Label>
                <XStack w="100%" alignItems="flex-start" space="$1">
                  <Input
                    flex={1}
                    value={verifyCode}
                    autoCapitalize="none"
                    autoCorrect={false}
                    disabled={isSubmitting || isVerified}
                    onChangeText={(value) => setVerifyCode(value)}
                  />
                  {isVerified ? null : (
                    <StyledButton
                      disabled={!verifyCode.length || isVerifyCodeSubmitting}
                      w="35%"
                      size="$4"
                      onPress={onVerifyCodePress}>
                      {t('verify')}
                    </StyledButton>
                  )}
                </XStack>
              </>
            )}
          </YStack>
        );

      case 'deliveryMethod':
        return (
          <RadioGroup
            value={selectedDeliveryMethod}
            name={'deliveryMethod'}
            onValueChange={(value) =>
              setSelectedDeliveryMethod(value as keyof typeof DeliveryMethodEnum)
            }>
            <YStack width={300} alignItems="center" space="$2">
              {shop.deliveryMethods.map((c) => {
                return (
                  <RadioGroupItem
                    key={`radiogroup-${c}`}
                    value={c}
                    label={t(c)}
                    onLabelPress={(value) =>
                      setSelectedDeliveryMethod(value as keyof typeof DeliveryMethodEnum)
                    }
                  />
                );
              })}
            </YStack>
          </RadioGroup>
        );
      case 'address':
        switch (selectedDeliveryMethod) {
          case DeliveryMethodEnum.SFEXPRESS:
            return <AddressForm address={address} onChange={onAddressChange} />;
          case DeliveryMethodEnum.SELF_PICK_UP:
            return (
              <RadioGroup
                value={selectedStore}
                name={'store'}
                onValueChange={(value) => setSelectedStore(value)}>
                <YStack width={300} alignItems="center" space="$2">
                  {shop.stores.map((s) => {
                    return (
                      <RadioGroupItem
                        key={`radiogroup-${s}`}
                        value={s}
                        label={s}
                        onLabelPress={(value) => setSelectedStore(value)}
                      />
                    );
                  })}
                </YStack>
              </RadioGroup>
            );
          default:
            return <></>;
        }
      case 'priceDetail':
        const { subtotal, freeShippingPrice, nonfreeShippingFee, couponDiscount } = priceDetail;

        switch (selectedDeliveryMethod) {
          case DeliveryMethodEnum.SELF_PICK_UP:
            return (
              <YStack p="$2" space="$1">
                <XStack justifyContent="space-between">
                  <SizableText>{t('subtotal')}</SizableText>
                  <SizableText
                    numberOfLines={1}
                    ellipsizeMode="tail">{`HK ${parseFloat(subtotal).toFixed(1)}`}</SizableText>
                </XStack>
                {couponDiscount ? (
                  <XStack justifyContent="space-between">
                    <SizableText>{t('redeemCoupon')}</SizableText>
                    <SizableText
                      numberOfLines={1}
                      ellipsizeMode="tail">{`-HK ${parseFloat(couponDiscount).toFixed(1)}`}</SizableText>
                  </XStack>
                ) : null}
                <XStack justifyContent="space-between">
                  <SizableText>{t('totalPrice')}</SizableText>
                  <SizableText
                    numberOfLines={1}
                    ellipsizeMode="tail">{`HK ${parseFloat(totalPrice).toFixed(1)}`}</SizableText>
                </XStack>
              </YStack>
            );

          case DeliveryMethodEnum.SFEXPRESS:
            const subtotalWithDiscount = subtotal - couponDiscount;
            const deliveryFee = freeShippingPrice > subtotalWithDiscount ? nonfreeShippingFee : 0;
            return (
              <YStack p="$2" space="$1">
                <XStack justifyContent="space-between">
                  <SizableText>{t('subtotal')}</SizableText>
                  <SizableText
                    numberOfLines={1}
                    ellipsizeMode="tail">{`HK ${parseFloat(subtotal).toFixed(1)}`}</SizableText>
                </XStack>
                {couponDiscount ? (
                  <XStack justifyContent="space-between">
                    <SizableText>{t('redeemCoupon')}</SizableText>
                    <SizableText
                      numberOfLines={1}
                      ellipsizeMode="tail">{`-HK ${parseFloat(couponDiscount).toFixed(1)}`}</SizableText>
                  </XStack>
                ) : null}
                <XStack justifyContent="space-between">
                  <SizableText>{t('deliveryFee')}</SizableText>
                  <SizableText
                    numberOfLines={1}
                    ellipsizeMode="tail">{`+HK ${parseFloat(deliveryFee).toFixed(1)}`}</SizableText>
                </XStack>
                <XStack justifyContent="space-between">
                  <SizableText>{t('totalPrice')}</SizableText>
                  <SizableText
                    numberOfLines={1}
                    ellipsizeMode="tail">{`HK ${parseFloat(totalPrice).toFixed(1)}`}</SizableText>
                </XStack>
              </YStack>
            );
          default:
            return <></>;
        }
      default:
        return <></>;
    }
  };

  const onCardPaymentPress = async () => {
    const { token: stripeToken, error } = await createToken({
      type: 'Card',
    });
    if (error) {
      return Toast.show({
        type: 'error',
        text1: t('creditCardInfoError'),
      });
    }
    let stripeTokenId = stripeToken.id;
    onCreateProductOrderSubmit({
      stripeTokenId,
      contact: { name, phoneNumber },
      orderContent,
      deliveryMethod: selectedDeliveryMethod ?? 'SELF_PICK_UP',
      paymentMethod: 'APPLE_PAY',
      selectedCouponId: selectedCoupon?._id,
      pickUpStore: selectedDeliveryMethod == 'SELF_PICK_UP' ? selectedStore : undefined,
    });
  };

  const onPlatformPayPress = async () => {
    const platformPayCartItems: PlatformPay.CartSummaryItem[] = [
      {
        label: shop.name,
        paymentType: PlatformPay.PaymentType.Immediate,
        amount: totalPrice.toString() ?? '0',
      },
    ];
    const { token } = await createPlatformPayToken({
      applePay: {
        merchantCountryCode: 'HK',
        currencyCode: 'HKD',
        cartItems: platformPayCartItems,
      },
    });

    if (!token) return;
    onCreateProductOrderSubmit({
      stripeTokenId: token.id,
      contact: { name, phoneNumber },
      orderContent,
      deliveryMethod: selectedDeliveryMethod ?? 'SELF_PICK_UP',
      paymentMethod: 'APPLE_PAY',
      selectedCouponId: selectedCoupon?._id,
      pickUpStore: selectedDeliveryMethod == 'SELF_PICK_UP' ? selectedStore : undefined,
    });
  };

  const onCouponPress = (coupon: UserCoupon) => {
    setIsUserCouponSheetOpen(false);
    let _selectedCoupon = selectedCoupon;
    if (!_selectedCoupon) return setSelectedCoupon(coupon);
    if (selectedCoupon?._id == coupon._id) {
      setSelectedCoupon(undefined);
    } else {
      setSelectedCoupon(coupon);
    }
  };

  const onPaymentPress = () => {
    setIsPaymentSheetOpen(true);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <YStack flex={1}>
        <KeyboardAwareScrollView extraHeight={140} style={{ flex: 1, width: '100%' }}>
          <SectionList
            refreshControl={<RefreshControl refreshing={false} onRefresh={() => onRefresh()} />}
            style={{
              backgroundColor: '#fff',
            }}
            contentContainerStyle={{ padding: 12, gap: 8 }}
            renderItem={renderSectionItem}
            renderSectionHeader={renderSectionHeader}
            sections={[
              { key: 'store', data: [''] },
              { key: 'cartItems', data: [''] },
              { key: 'coupon', data: [''] },
              { key: 'contact', data: [''] },
              { key: 'deliveryMethod', data: [''] },
              { key: 'address', data: [''] },
              { key: 'priceDetail', data: [''] },
            ]}
            keyExtractor={(item, index) => item + index}
          />
        </KeyboardAwareScrollView>
      </YStack>
      <BottomAction>
        <StyledButton onPress={onPaymentPress}>pay</StyledButton>
      </BottomAction>
      <ActionSheet
        isSheetOpen={isPaymenySheetOpen}
        setIsSheetOpen={setIsPaymentSheetOpen}
        sheetPosition={paymentSheetPosition}
        snapPoints={[80]}
        setSheetPosition={setPaymentSheetPosition}>
        <ScrollView space="$4">
          <PaymentSheetCard
            isLoading={false}
            cardPaymentDisabled={!isCardCompleted}
            isPlatformPayAvailable={isPlatformPayAvailable}
            onCardCompleted={setIsCardCompleted}
            onCardPaymentPress={onCardPaymentPress}
            onPlatformPayPress={onPlatformPayPress}
          />
        </ScrollView>
      </ActionSheet>
      <ActionSheet
        isSheetOpen={isUserCouponSheetOpen}
        setIsSheetOpen={setIsUserCouponSheetOpen}
        sheetPosition={userCouponSheetPosition}
        setSheetPosition={setUserCouponSheetPosition}>
        <FlatList
          data={availableCoupons}
          renderItem={({ item }) => {
            return (
              <StyledButton
                bg={selectedCoupon ? '$primary' : 'slategrey'}
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

export default Checkout;
