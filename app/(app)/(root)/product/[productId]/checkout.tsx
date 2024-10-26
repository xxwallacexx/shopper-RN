import { useMutation, useQuery } from '@tanstack/react-query';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import { useState } from 'react';
import { RefreshControl, SafeAreaView, SectionList } from 'react-native';
import { H2, Label, RadioGroup, Input, YStack, XStack, Text } from 'tamagui';
import {
  checkIsVerified,
  createProductOrder,
  getProductCheckoutItemsDetail,
  getSelf,
  getShop,
  getVerifyCode,
  verifyCode as verifySms,
  getProductTotalPrice,
} from '~/api';
import {
  AddressForm,
  CheckoutItemCard,
  PaymentSheetCard,
  RadioGroupItem,
  StoreCard,
} from '~/components';
import { useAuth, useCountdown, useLocale } from '~/hooks';
import { BottomAction, StyledButton } from '~/tamagui.config';
import { DeliveryMethodEnum, Address, Contact, OrderContent, PaymentMethodEnum } from '~/types';
import {
  createPlatformPayToken,
  createToken,
  isPlatformPaySupported,
  PlatformPay,
} from '@stripe/stripe-react-native';
import Toast from 'react-native-toast-message';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { AntDesign } from '@expo/vector-icons';
import { tokens } from '@tamagui/themes';
import ActionSheet from '~/components/ActionSheet';
import { ScrollView } from 'tamagui';

const Checkout = () => {
  const { productId, orderContentStr, currentCouponId } = useLocalSearchParams<{
    productId: string;
    orderContentStr: string;
    currentCouponId?: string;
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

  const [selectedDeliveryMethod, setSelectedDeliveryMethod] =
    useState<keyof typeof DeliveryMethodEnum>();
  const [selectedStore, setSelectedStore] = useState<string>();
  const [address, setAddress] = useState<Address>();
  console.log(isPaymenySheetOpen);
  const [timer, setTimer] = useState(new Date());
  const [seconds] = useCountdown(timer);

  const { data: isPlatformPayAvailable, isLoading: isPlatformPaySupportedLoading } = useQuery({
    queryKey: ['platformPay'],
    queryFn: async () => {
      return await isPlatformPaySupported();
    },
  });
  if (!token) return <></>;

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

  const { data: itemDetail, isLoading: isItemDetailLoading } = useQuery({
    queryKey: ['itemDetail', productId, orderContent, currentCouponId],
    queryFn: async () => {
      return await getProductCheckoutItemsDetail(
        token,
        `${productId}`,
        orderContent,
        currentCouponId
      );
    },
  });

  const { data: totalPrice, isPending: isTotalPriceLoading } = useQuery({
    queryKey: [
      'productTotalPrice',
      productId,
      orderContent,
      selectedDeliveryMethod,
      currentCouponId,
    ],
    queryFn: async () => {
      return await getProductTotalPrice(
        token,
        `${productId}`,
        orderContent,
        selectedDeliveryMethod ? selectedDeliveryMethod : 'SELF_PICK_UP',
        currentCouponId
      );
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
        currentCouponId,
        pickUpStore,
      }: {
        stripeTokenId: string;
        contact: Contact;
        orderContent: OrderContent;
        deliveryMethod: keyof typeof DeliveryMethodEnum;
        paymentMethod: keyof typeof PaymentMethodEnum;
        currentCouponId?: string;
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
          currentCouponId,
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

  if (
    isShopLoading ||
    isItemDetailLoading ||
    !shop ||
    !itemDetail ||
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

  const renderSectionHeader = ({ section }) => {
    switch (section.key) {
      case 'cartItems':
        return <H2 backgroundColor={'#fff'}>{t('orderDetail')}</H2>;
      case 'deliveryMethod':
        return <H2 backgroundColor={'#fff'}>{t('deliveryMethod')}</H2>;
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

  const renderSectionItem = ({ section }) => {
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
      currentCouponId,
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

    console.log(token);
    if (!token) return;
    onCreateProductOrderSubmit({
      stripeTokenId: token.id,
      contact: { name, phoneNumber },
      orderContent,
      deliveryMethod: selectedDeliveryMethod ?? 'SELF_PICK_UP',
      paymentMethod: 'APPLE_PAY',
      currentCouponId,
      pickUpStore: selectedDeliveryMethod == 'SELF_PICK_UP' ? selectedStore : undefined,
    });
  };

  console.log(isPlatformPayAvailable);
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
              { key: 'contact', data: [''] },
              { key: 'deliveryMethod', data: [''] },
              { key: 'address', data: [''] },
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
    </SafeAreaView>
  );
};

export default Checkout;
