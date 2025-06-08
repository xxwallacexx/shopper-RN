import { MaterialIcons } from '@expo/vector-icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { RefreshControl, SectionList, SafeAreaView } from 'react-native';
import HTMLView from 'react-native-htmlview';
import Toast from 'react-native-toast-message';
import { AlertDialog, Image, Separator, SizableText, Text, XStack, YStack, Stack } from 'tamagui';

import { getCredit, getCoupon, createUserCoupon } from '~/api';
import { Dialog } from '~/components';
import { useAuth, useLocale } from '~/hooks';
import { BottomAction, Container, StyledButton, Title } from '~/tamagui.config';
import AddCartSuccessContent from '../product/[productId]/components/AddCartSuccessContent';
import CouponShopSection from './components/CouponShopSection';
import CouponDescriptionSection from './components/CouponDescriptionSection';
import CouponDetailSection from './components/CouponDetailSection';

const CouponDetail = () => {
  const { couponId } = useLocalSearchParams<{ couponId: string }>();
  const { t } = useLocale();
  const { token } = useAuth();
  const queryClient = useQueryClient();

  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);
  if (!token) return <></>;

  const { data: coupon, refetch: couponRefetch } = useQuery({
    queryKey: ['coupon', couponId],
    queryFn: async () => {
      return await getCoupon(token, `${couponId}`);
    },
  });

  const { data: credit = 0, refetch: creditRefetch } = useQuery({
    queryKey: ['credit', token],
    queryFn: async () => {
      return await getCredit(token);
    },
  });

  const { isPending: isCreateUserCouponSubmiting, mutate: createUserCouponMutate } = useMutation({
    mutationFn: () => {
      return createUserCoupon(token, couponId);
    },
    onSuccess: async (res) => {
      setIsSuccessDialogOpen(true);
      creditRefetch();
      queryClient.resetQueries({ queryKey: ['userCoupons'] });
    },
    onError: (e) => {
      Toast.show({
        type: 'error',
        text1: t(e.toString()),
      });
    },
  });

  const onRefresh = () => {
    couponRefetch();
    creditRefetch();
  };

  if (!coupon) {
    return <></>;
  }

  const renderSectionItem = ({ item, index, section }) => {
    const { photo, name, shop, endDate, detail, minPriceRequired, maxPurchase, discount, terms } =
      coupon;

    switch (section.key) {
      case 'cover':
        return (
          <Image
            bc="white"
            objectFit="contain"
            aspectRatio={16 / 9}
            source={{ uri: photo }}
            w="100%"
          />
        );
      case 'shop':
        return (
          <CouponShopSection
            name={shop.name}
            address={shop.address}
            couponName={name}
            endDate={endDate}
          />
        );
      case 'description':
        return <CouponDescriptionSection detail={detail} />;
      case 'detail':
        return (
          <CouponDetailSection
            minPriceRequired={minPriceRequired}
            maxPurchase={maxPurchase}
            discount={discount}
          />
        );
      case 'tnc':
        return (
          <Container gap="$2">
            <Separator boc="lightslategray" />
            <YStack gap="$4">
              <Title>{t('TnC')}</Title>
              <HTMLView value={terms} />
            </YStack>
          </Container>
        );
      default:
        return <></>;
    }
  };

  const onGetCouponPress = () => {
    if (credit < coupon.credit || isCreateUserCouponSubmiting) return;
    createUserCouponMutate();
  };

  const buttonDisabled = credit < coupon.credit || isCreateUserCouponSubmiting;
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <YStack f={1}>
        <SectionList
          refreshControl={<RefreshControl refreshing={false} onRefresh={onRefresh} />}
          renderItem={renderSectionItem}
          sections={[
            { key: 'cover', data: [''] },
            { key: 'shop', data: [''] },
            { key: 'description', data: [''] },
            { key: 'detail', data: [''] },
            { key: 'tnc', data: [''] },
          ]}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, index) => item + index}
        />
        <BottomAction jc="space-between">
          <SizableText>{t('creditRequired', { credit: coupon.credit })}</SizableText>
          <StyledButton disabled={buttonDisabled} onPress={onGetCouponPress}>
            {t('getCoupon')}
            <MaterialIcons name="discount" color="#fff" />
          </StyledButton>
        </BottomAction>
      </YStack>
      <Dialog isOpen={isSuccessDialogOpen}>
        <YStack gap="$4">
          <AddCartSuccessContent />
          <AlertDialog.Action asChild>
            <StyledButton onPress={() => setIsSuccessDialogOpen(false)}>
              {t('confirm')}
            </StyledButton>
          </AlertDialog.Action>
        </YStack>
      </Dialog>
    </SafeAreaView>
  );
};

export default CouponDetail;
