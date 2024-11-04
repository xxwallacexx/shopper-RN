import {
  createPlatformPayToken,
  createToken,
  isPlatformPaySupported,
  PlatformPay,
} from '@stripe/stripe-react-native';
import { QueryClient, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { router, useLocalSearchParams } from 'expo-router';
import { Skeleton } from 'moti/skeleton';
import { useState } from 'react';
import { SafeAreaView, SectionList } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Toast from 'react-native-toast-message';
import {
  H2,
  ScrollView,
  Stack,
  AlertDialog,
  SizableText,
  Text,
  RadioGroup,
  XStack,
  YStack,
} from 'tamagui';
import {
  cartItemGetPriceDetail,
  cartItemGetTotalPrice,
  checkIsVerified,
  getSelf,
  getShop,
  getVerifyCode,
  listCartItems,
  createCartItemOrder,
  verifyCode as verifySms,
} from '~/api';
import {
  AddressForm,
  ContactForm,
  Dialog,
  PaymentSheetCard,
  RadioGroupItem,
  StoreCard,
} from '~/components';
import { TouchableOpacity } from 'react-native-gesture-handler';
import ActionSheet from '~/components/ActionSheet';
import { useAuth, useCountdown, useLocale } from '~/hooks';
import { BottomAction, StyledButton } from '~/tamagui.config';
import { Address, Contact, DeliveryMethodEnum, PaymentMethodEnum } from '~/types';

const CartCheckout = () => {
  const { selectedCouponIdsStr } = useLocalSearchParams<{ selectedCouponIdsStr: string }>();
  const selectedCouponIds = JSON.parse(selectedCouponIdsStr);
  const { token } = useAuth();
  const { t } = useLocale();

  const [isCardCompleted, setIsCardCompleted] = useState(false);
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verifyCode, setVerifyCode] = useState('');
  const [isPaymentSheetOpen, setIsPaymentSheetOpen] = useState(false);
  const [paymentSheetPosition, setPaymentSheetPosition] = useState(0);

  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);

  const [selectedDeliveryMethod, setSelectedDeliveryMethod] =
    useState<keyof typeof DeliveryMethodEnum>();
  const [selectedStore, setSelectedStore] = useState<string>();
  const [address, setAddress] = useState<Address>();
  const [timer, setTimer] = useState(new Date());
  const [seconds] = useCountdown(timer);
  const queryClient = useQueryClient();

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

  const { data: cartItems = [] } = useQuery({
    queryKey: [`cartItems`, token],
    queryFn: async () => {
      return await listCartItems(token);
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
  const { data: totalPrice, isFetching: isTotalPriceFetching } = useQuery({
    queryKey: [
      'cartItemGetTotalPrice',
      token,
      cartItems,
      selectedCouponIds,
      selectedDeliveryMethod,
    ],
    queryFn: async () => {
      return await cartItemGetTotalPrice(token, selectedCouponIds, selectedDeliveryMethod);
    },
  });

  const { data: priceDetail, isFetching: isPriceDetailFetching } = useQuery({
    queryKey: ['cartItemGetPriceDetail', token, selectedCouponIds],
    queryFn: async () => {
      return await cartItemGetPriceDetail(token, selectedCouponIds, selectedDeliveryMethod);
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

  const { mutate: onCreateCartItemOrderSubmit, isPending: isCreateCartItemOrderSubmitting } =
    useMutation({
      mutationFn: async ({
        stripeTokenId,
        contact,
        deliveryMethod,
        paymentMethod,
        selectedCouponIds,
        pickUpStore,
      }: {
        stripeTokenId: string;
        contact: Contact;
        deliveryMethod: keyof typeof DeliveryMethodEnum;
        paymentMethod: keyof typeof PaymentMethodEnum;
        selectedCouponIds: string[];
        pickUpStore?: string;
      }) => {
        return await createCartItemOrder(
          token,
          stripeTokenId,
          contact,
          deliveryMethod,
          paymentMethod,
          selectedCouponIds,
          pickUpStore
        );
      },
      onSuccess: (res) => {
        queryClient.invalidateQueries({
          queryKey: ['cartItems'],
        });
        queryClient.resetQueries({ queryKey: ['userCoupons'] });
        queryClient.resetQueries({ queryKey: ['orders'] });
        setIsPaymentSheetOpen(false);
        setIsSuccessDialogOpen(true);
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
    !shop ||
    !priceDetail ||
    !user ||
    isVerified == undefined ||
    isPlatformPayAvailable == undefined ||
    isPlatformPaySupportedLoading
  )
    return <></>;

  const onAddressChange = (field: keyof Address, value: string) => {
    setAddress((prevAddress) => {
      let address = { ...prevAddress };
      address[field] = value;
      return address;
    });
  };

  const renderSectionHeader = ({ section }: { section: { key: string } }) => {
    switch (section.key) {
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
      case 'contact':
        return (
          <ContactForm
            name={name}
            onNameChange={setName}
            phoneNumber={phoneNumber}
            onPhoneNumberChange={setPhoneNumber}
            verifyCode={verifyCode}
            seconds={seconds}
            disabled={isSubmitting}
            isVerifyCodeSubmitting={isVerifyCodeSubmitting}
            isVerified={isVerified}
            onVerifyCodePress={onVerifyCodePress}
            onGetVerifyCodePress={onGetVerifyCodePress}
            onVerifyCodeChange={setVerifyCode}
          />
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
        const { subtotal, freeShippingPrice, nonfreeShippingFee, couponsDiscount } = priceDetail;

        const subtotalWithDiscount = subtotal - couponsDiscount;
        const deliveryFee = freeShippingPrice > subtotalWithDiscount ? nonfreeShippingFee : 0;
        return (
          <YStack p="$2" space="$1">
            <XStack justifyContent="space-between">
              <SizableText>{t('subtotal')}</SizableText>
              {isPriceDetailFetching ? (
                <Skeleton colorMode="light" width={80} height={16} />
              ) : (
                <SizableText
                  numberOfLines={1}
                  ellipsizeMode="tail">{`HK ${subtotal.toFixed(1)}`}</SizableText>
              )}
            </XStack>
            {couponsDiscount ? (
              <XStack justifyContent="space-between">
                <SizableText>{t('redeemCoupon')}</SizableText>
                {isPriceDetailFetching ? (
                  <Skeleton colorMode="light" width={80} height={16} />
                ) : (
                  <SizableText
                    numberOfLines={1}
                    ellipsizeMode="tail">{`-HK ${couponsDiscount.toFixed(1)}`}</SizableText>
                )}
              </XStack>
            ) : null}
            {selectedDeliveryMethod == DeliveryMethodEnum.SFEXPRESS ? (
              <XStack justifyContent="space-between">
                <SizableText>{t('deliveryFee')}</SizableText>
                {isPriceDetailFetching ? (
                  <Skeleton colorMode="light" width={80} height={16} />
                ) : (
                  <SizableText
                    numberOfLines={1}
                    ellipsizeMode="tail">{`+HK ${deliveryFee.toFixed(1)}`}</SizableText>
                )}
              </XStack>
            ) : null}
            <XStack justifyContent="space-between">
              <SizableText>{t('totalPrice')}</SizableText>
              {isTotalPriceFetching ? (
                <Skeleton colorMode="light" width={80} height={16} />
              ) : (
                <SizableText
                  numberOfLines={1}
                  ellipsizeMode="tail">{`HK ${totalPrice?.toFixed(1)}`}</SizableText>
              )}
            </XStack>
          </YStack>
        );
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
    let contact: Contact = { name, phoneNumber };
    if (selectedDeliveryMethod == DeliveryMethodEnum.SFEXPRESS) {
      contact.district = address?.district;
      contact.street = address?.street;
      contact.room = address?.room;
    }
    onCreateCartItemOrderSubmit({
      stripeTokenId,
      contact: { name, phoneNumber },
      deliveryMethod: selectedDeliveryMethod ?? 'SELF_PICK_UP',
      paymentMethod: 'CREDIT_CARD',
      selectedCouponIds,
      pickUpStore: selectedDeliveryMethod == 'SELF_PICK_UP' ? selectedStore : undefined,
    });
  };

  const onPlatformPayPress = async () => {
    const platformPayCartItems: PlatformPay.CartSummaryItem[] = [
      {
        label: shop.name,
        paymentType: PlatformPay.PaymentType.Immediate,
        amount: totalPrice?.toString() ?? '0',
      },
    ];
    const { token } = await createPlatformPayToken({
      applePay: {
        merchantCountryCode: 'HK',
        currencyCode: 'HKD',
        cartItems: platformPayCartItems,
      },
    });

    let contact: Contact = { name, phoneNumber };
    if (selectedDeliveryMethod == DeliveryMethodEnum.SFEXPRESS) {
      contact.district = address?.district;
      contact.street = address?.street;
      contact.room = address?.room;
    }
    if (!token) return;
    onCreateCartItemOrderSubmit({
      stripeTokenId: token.id,
      contact,
      deliveryMethod: selectedDeliveryMethod ?? 'SELF_PICK_UP',
      paymentMethod: 'APPLE_PAY',
      selectedCouponIds,
      pickUpStore: selectedDeliveryMethod == 'SELF_PICK_UP' ? selectedStore : undefined,
    });
  };

  const onPaymentPress = () => {
    setIsPaymentSheetOpen(true);
  };

  const isPayDisabled = () => {
    if (phoneNumber == '' || name == '' || !isVerified) return true;
    if (selectedDeliveryMethod == DeliveryMethodEnum.SFEXPRESS) {
      if (!address?.room || !address?.street || !address?.district) {
        return true;
      }
      if (address?.room == '' || address?.street == '' || address?.district == '') {
        return true;
      }
    }
    return false;
  };

  const onPaymentSuccessConfirmPress = () => {
    setIsSuccessDialogOpen(false);
    router.back();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <YStack flex={1}>
        <KeyboardAwareScrollView extraHeight={140} style={{ flex: 1, width: '100%' }}>
          <SectionList
            style={{
              backgroundColor: '#fff',
            }}
            contentContainerStyle={{ padding: 12, gap: 8 }}
            renderItem={renderSectionItem}
            renderSectionHeader={renderSectionHeader}
            sections={[
              { key: 'store', data: [''] },
              { key: 'contact', data: [''] },
              { key: 'deliveryMethod', data: [''] },
              { key: 'address', data: [''] },
              { key: 'priceDetail', data: [''] },
            ]}
            keyExtractor={(item, index) => item + index}
          />
        </KeyboardAwareScrollView>
      </YStack>
      <BottomAction justifyContent="space-between">
        <>
          {isTotalPriceFetching || totalPrice == undefined ? (
            <Skeleton width={'30%'} height={12} colorMode="light" />
          ) : (
            <SizableText> {`HK$ ${totalPrice?.toFixed(1)}`}</SizableText>
          )}
        </>
        <TouchableOpacity disabled={isPayDisabled()} onPress={() => onPaymentPress()}>
          <StyledButton disabled={isPayDisabled()}>{t('pay')}</StyledButton>
        </TouchableOpacity>
      </BottomAction>
      <ActionSheet
        isSheetOpen={isPaymentSheetOpen}
        setIsSheetOpen={setIsPaymentSheetOpen}
        sheetPosition={paymentSheetPosition}
        snapPoints={[80]}
        setSheetPosition={setPaymentSheetPosition}>
        <ScrollView space="$4">
          <PaymentSheetCard
            isLoading={isCreateCartItemOrderSubmitting}
            cardPaymentDisabled={!isCardCompleted || isCreateCartItemOrderSubmitting}
            isPlatformPayAvailable={isPlatformPayAvailable}
            onCardCompleted={setIsCardCompleted}
            onCardPaymentPress={onCardPaymentPress}
            onPlatformPayPress={onPlatformPayPress}
          />
        </ScrollView>
      </ActionSheet>
      <Dialog isOpen={isSuccessDialogOpen}>
        <YStack space="$4">
          <SizableText fontSize={'$6'}>{t('paymentSuccess')}</SizableText>
          <Stack>
            <Text>{t('paymentSuccessContent')}</Text>
            <XStack>
              <Text>{t('pleaseGoTo')}</Text>
              <Text fontWeight={'700'}>{t('myOrders')}</Text>
              <Text>{t('toCheck')}</Text>
            </XStack>
          </Stack>

          <AlertDialog.Action asChild>
            <StyledButton onPress={onPaymentSuccessConfirmPress}>{t('confirm')}</StyledButton>
          </AlertDialog.Action>
        </YStack>
      </Dialog>
    </SafeAreaView>
  );
};

export default CartCheckout;
