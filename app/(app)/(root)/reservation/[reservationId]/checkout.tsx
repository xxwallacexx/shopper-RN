import { isPlatformPaySupported } from '@stripe/stripe-react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { useAuth, useCountdown, useLocale } from '~/hooks';
import { listReservationAvailableCoupons } from '~/api';
import { useQuery } from '@tanstack/react-query';
import { UserCoupon } from '~/types';

const Checkout = () => {
  const { reservationId, reservationContentStr } = useLocalSearchParams<{
    reservationId: string;
    reservationContentStr: string;
  }>();
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

  console.log(availableCoupons);
  return <></>;
};

export default Checkout;
