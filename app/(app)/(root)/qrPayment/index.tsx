import { SHOP } from '@env';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { QRCodeScanner } from '~/components';

const QRPayment = () => {
  const router = useRouter();

  const { isPending: isQRCodePending, mutate: qrcodeMutate } = useMutation({
    mutationFn: async ({ value }: { value: string }) => {
      if (isQRCodePending) return;
      if (value !== SHOP) return;
      return router.navigate({ pathname: '/qrPayment/checkout' });
    },
  });
  return (
    <QRCodeScanner
      onBack={() => router.back()}
      onScan={(value) => {
        qrcodeMutate({ value });
      }}
    />
  );
};

export default QRPayment;
