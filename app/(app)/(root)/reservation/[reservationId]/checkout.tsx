import {
  createPlatformPayToken,
  createToken,
  isPlatformPaySupported,
  PlatformPay,
} from '@stripe/stripe-react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { useAuth, useCountdown, useLocale } from '~/hooks';
import {
  checkIsVerified,
  getReservationTotalPrice,
  getSelf,
  getShop,
  getVerifyCode,
  verifyCode as verifySms,
  listReservationAvailableCoupons,
  getProduct,
  getReservation,
  createReservationOrder,
} from '~/api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Contact, PaymentMethodEnum, ReservationContent, UserCoupon } from '~/types';
import Toast from 'react-native-toast-message';
import { FlatList, Platform, SafeAreaView } from 'react-native';
import { H2, SizableText, YStack, XStack, ScrollView, Stack, Text, AlertDialog } from 'tamagui';
import {
  CheckoutReservationCard,
  StoreCard,
  Spinner,
  ContactForm,
  PaymentSheetCard,
  Dialog,
} from '~/components';
import { BottomAction, Container, StyledButton, Title } from '~/tamagui.config';
import ActionSheet from '~/components/ActionSheet';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Skeleton } from 'moti/skeleton';
import * as Calendar from 'expo-calendar';
import { PermissionStatus } from 'expo-calendar';
import moment from 'moment';

const Checkout = () => {
  const { productId, reservationId, reservationContentStr } = useLocalSearchParams<{
    productId: string;
    reservationId: string;
    reservationContentStr: string;
  }>();

  const queryClient = useQueryClient();
  const reservationContent = JSON.parse(reservationContentStr);
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
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);

  const [selectedCoupon, setSelectedCoupon] = useState<UserCoupon>();
  const [selectedStore, setSelectedStore] = useState<string>();
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
    queryKey: ['reservationAvailableCoupons', token, reservationId, reservationContent],
    queryFn: async () => {
      return await listReservationAvailableCoupons(token, reservationId, reservationContent);
    },
  });

  const { data: user } = useQuery({
    queryKey: ['profile', token],
    queryFn: async () => {
      let response = await getSelf(token);
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

  const {
    data: totalPrice,
    isFetching: isTotalPriceFetching,
    refetch: refetchTotalPrice,
  } = useQuery({
    queryKey: ['reservationTotalPrice', reservationId, reservationContent],
    queryFn: async () => {
      return await getReservationTotalPrice(
        token,
        reservationId,
        {
          reservation: reservationId,
          ...reservationContent,
        },
        selectedCoupon?._id
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

  const { data: shop, isFetching: isShopFetching } = useQuery({
    queryKey: ['shop'],
    queryFn: async () => {
      return await getShop();
    },
  });

  const { data: product, isFetching: isProductFetching } = useQuery({
    queryKey: ['product', productId],
    queryFn: async () => {
      return await getProduct(productId);
    },
  });

  const { data: reservation, isFetching: isReservationFetching } = useQuery({
    queryKey: ['reservation', reservationId],
    queryFn: async () => {
      return await getReservation(token, reservationId);
    },
  });

  const { mutate: onCreateReservationOrderSubmit, isPending: isCreateReservationOrderSubmitting } =
    useMutation({
      mutationFn: async ({
        stripeTokenId,
        contact,
        reservationContent,
        paymentMethod,
        selectedCouponId,
      }: {
        stripeTokenId: string;
        contact: Contact;
        reservationContent: ReservationContent;
        paymentMethod: keyof typeof PaymentMethodEnum;
        selectedCouponId?: string;
      }) => {
        return await createReservationOrder(
          token,
          reservationId,
          stripeTokenId,
          contact,
          reservationContent,
          paymentMethod,
          selectedCouponId
        );
      },
      onSuccess: async (res) => {
        const { status: calendarStatus } = await Calendar.requestCalendarPermissionsAsync();
        await Calendar.requestRemindersPermissionsAsync();
        if (calendarStatus == PermissionStatus.GRANTED) {
          let notesToken = [];
          for (const reservation of res.reservations) {
            const { time, duration, options, product } = reservation.reservation;
            const option = options.find((f) => {
              return f._id == reservation.option;
            });
            notesToken.push(`${option?.name}: ${reservation?.quantity}`);
            const startDate = moment(time).toDate();
            const endDate = moment(time).add(duration, 'minutes').toDate();
            const calendars = await Calendar.getCalendarsAsync();
            const [defaultCalendar] = calendars.filter((each) => each.source.name === 'Default');
            const calendarId = defaultCalendar.id;
            if (calendarId) {
              const event = {
                title: product.name,
                startDate: startDate,
                endDate: endDate,
                timeZone: Platform.OS === 'ios' ? undefined : 'GMT+8',
                notes: notesToken.join(),
              };
              await Calendar.createEventAsync(calendarId, event);
            }
          }
        }
        queryClient.resetQueries({ queryKey: ['userCoupons'] });
        queryClient.resetQueries({ queryKey: ['orders'] });
        setIsPaymentSheetOpen(false);
        setIsSuccessDialogOpen(true);
      },
      onError: (e) => {
        console.log(e);
        Toast.show({
          position: 'top',
          type: 'error',
          text1: t(e.message),
        });
      },
    });

  useEffect(() => {
    refetchTotalPrice();
  }, [selectedCoupon]);

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
  const isSubmitting = false;

  if (
    isShopFetching ||
    !shop ||
    !product ||
    !reservation ||
    !totalPrice ||
    !user ||
    isVerified == undefined ||
    isPlatformPayAvailable == undefined ||
    isPlatformPaySupportedLoading
  )
    return <></>;

  const onGetVerifyCodePress = () => {
    if (phoneNumber.length !== 8 || isGetVerifyCodeSubmitting || seconds > 0) return;
    onGetVerifyCodeSubmit();
  };

  const onVerifyCodePress = () => {
    if (!verifyCode.length || isVerifyCodeSubmitting) return;
    onVerifyCodeSubmit();
  };

  const isPayDisabled = () => {
    if (phoneNumber == '' || name == '' || !isVerified) return true;
    return false;
  };

  const onPaymentSuccessConfirmPress = () => {
    setIsSuccessDialogOpen(false);
    router.back();
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

    onCreateReservationOrderSubmit({
      stripeTokenId,
      contact,
      reservationContent: { reservation: reservationId, ...reservationContent },
      paymentMethod: 'CREDIT_CARD',
      selectedCouponId: selectedCoupon?._id,
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

    let contact: Contact = { name, phoneNumber };

    if (!token) return;
    onCreateReservationOrderSubmit({
      stripeTokenId: token.id,
      contact,
      reservationContent: { reservation: reservationId, ...reservationContent },
      paymentMethod: 'APPLE_PAY',
      selectedCouponId: selectedCoupon?._id,
    });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView flex={1} padding={'$3'} space="$2">
        <StoreCard logo={shop.logo} name={shop.name} address={shop.address} />
        <H2 backgroundColor={'#fff'}>{t('orderDetail')}</H2>
        <CheckoutReservationCard
          product={product}
          reservationContent={reservationContent}
          reservation={reservation}
          price={totalPrice}
          coupon={selectedCoupon}
        />
        <StyledButton
          bg={selectedCoupon ? '$primary' : 'slategrey'}
          onPress={() => setIsUserCouponSheetOpen(true)}>
          {selectedCoupon ? selectedCoupon.coupon.name : t('redeemCoupon')}
        </StyledButton>
        <H2 backgroundColor={'#fff'}>{t('contactInfo')}</H2>
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
        <YStack p="$2" space="$1">
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
      </ScrollView>
      <BottomAction justifyContent="space-between">
        <>
          {isTotalPriceFetching ? (
            <Skeleton width={'30%'} height={12} colorMode="light" />
          ) : (
            <SizableText> {`HK$ ${totalPrice?.toFixed(1)}`}</SizableText>
          )}
        </>
        <StyledButton onPress={() => setIsPaymentSheetOpen(true)} disabled={isPayDisabled()}>
          {t('pay')}
        </StyledButton>
      </BottomAction>
      <ActionSheet
        isSheetOpen={isPaymenySheetOpen}
        setIsSheetOpen={setIsPaymentSheetOpen}
        sheetPosition={paymentSheetPosition}
        snapPoints={[80]}
        setSheetPosition={setPaymentSheetPosition}>
        <ScrollView space="$4">
          <PaymentSheetCard
            isLoading={isCreateReservationOrderSubmitting}
            cardPaymentDisabled={!isCardCompleted || isCreateReservationOrderSubmitting}
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
                my={'$2'}
                bg={selectedCoupon?._id == item._id ? '$primary' : 'slategrey'}
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

export default Checkout;
