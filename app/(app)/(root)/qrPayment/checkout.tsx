import {
  createPlatformPayToken,
  createToken,
  isPlatformPaySupported,
  PlatformPay,
} from '@stripe/stripe-react-native';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Keyboard, Pressable, SafeAreaView } from 'react-native';
import Toast from 'react-native-toast-message';
import {
  Input,
  Label,
  SizableText,
  Stack,
  AlertDialog,
  XStack,
  Text,
  ScrollView,
  YStack,
} from 'tamagui';
import { Dialog, PaymentSheetCard, ActionSheet } from '~/components';
import { useAuth, useLocale } from '~/hooks';
import { BottomAction, StyledButton } from '~/tamagui.config';
import { PaymentMethodEnum } from '~/types';
import { createQRPayment, getShop } from '~/api';

const QRPaymentCheckout = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { t } = useLocale();
  const { token } = useAuth();

  const [isCardCompleted, setIsCardCompleted] = useState(false);
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);
  const [totalPrice, setTotalPrice] = useState<string>();
  const [isPaymentSheetOpen, setIsPaymentSheetOpen] = useState(false);
  const [paymentSheetPosition, setPaymentSheetPosition] = useState(0);

  const { data: shop } = useQuery({
    queryKey: ['shop'],
    queryFn: async () => {
      return await getShop();
    },
  });
  const { data: isPlatformPayAvailable } = useQuery({
    queryKey: ['platformPay'],
    queryFn: async () => {
      return await isPlatformPaySupported();
    },
  });

  const onPaymentPress = () => {
    setIsPaymentSheetOpen(true);
  };

  if (!token || !shop || isPlatformPayAvailable == undefined) return <></>;

  const { mutate: onCreateQRPaymentSubmit, isPending: isCreateQRPaymentSubmitting } = useMutation({
    mutationFn: async ({
      stripeTokenId,
      paymentMethod,
    }: {
      stripeTokenId: string;
      paymentMethod: keyof typeof PaymentMethodEnum;
    }) => {
      if (totalPrice == undefined) return;
      return await createQRPayment(token, Number(totalPrice), stripeTokenId, paymentMethod);
    },
    onSuccess: (res) => {
      queryClient.resetQueries({ queryKey: ['qrPayments'] });
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
    onCreateQRPaymentSubmit({
      stripeTokenId,
      paymentMethod: 'CREDIT_CARD',
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

    if (!token) return;
    onCreateQRPaymentSubmit({
      stripeTokenId: token.id,
      paymentMethod: 'APPLE_PAY',
    });
  };

  const onPaymentSuccessConfirmPress = () => {
    setIsSuccessDialogOpen(false);
    router.back();
  };

  const onTotalPriceChange = (value: string) => {
    setTotalPrice(value);
  };

  const disabled =
    isCreateQRPaymentSubmitting || totalPrice == undefined || isNaN(Number(totalPrice));
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <Pressable style={{ height: '100%' }} onPress={() => Keyboard.dismiss()}>
        <YStack f={1} p="$4">
          <Label>{t('price')}</Label>
          <Input
            value={totalPrice}
            keyboardType="numeric"
            disabled={isCreateQRPaymentSubmitting}
            onChangeText={onTotalPriceChange}
          />
        </YStack>

        <BottomAction jc="flex-end">
          <StyledButton onPress={() => onPaymentPress()} disabled={disabled}>
            {t('pay')}
          </StyledButton>
        </BottomAction>
      </Pressable>

      <ActionSheet
        isSheetOpen={isPaymentSheetOpen}
        setIsSheetOpen={setIsPaymentSheetOpen}
        sheetPosition={paymentSheetPosition}
        snapPoints={[80]}
        setSheetPosition={setPaymentSheetPosition}>
        <ScrollView space="$4">
          <PaymentSheetCard
            isLoading={isCreateQRPaymentSubmitting}
            cardPaymentDisabled={!isCardCompleted || isCreateQRPaymentSubmitting}
            isPlatformPayAvailable={isPlatformPayAvailable}
            onCardCompleted={setIsCardCompleted}
            onCardPaymentPress={onCardPaymentPress}
            onPlatformPayPress={onPlatformPayPress}
          />
        </ScrollView>
      </ActionSheet>
      <Dialog isOpen={isSuccessDialogOpen}>
        <YStack gap="$4">
          <SizableText fos={'$6'}>{t('paymentSuccess')}</SizableText>
          <Stack>
            <Text>{t('paymentSuccessContent')}</Text>
            <XStack>
              <Text>{t('pleaseGoTo')}</Text>
              <Text fow={'700'}>{t('QRPaymentHistory')}</Text>
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

export default QRPaymentCheckout;
