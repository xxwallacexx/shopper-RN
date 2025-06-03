import { Input, Label, YStack } from 'tamagui';
import { useLocale } from '~/hooks';
import { Address } from '~/types';

const AddressForm = ({
  address,
  onChange,
}: {
  address?: Address;
  onChange: (field: keyof Address, value: string) => void;
}) => {
  const { t } = useLocale();
  return (
    <YStack gap="$2" p="$2">
      <Label>{t('room')}</Label>
      <Input
        autoCapitalize="none"
        brc={'lightgrey'}
        bc={'whitesmoke'}
        value={address?.room}
        onChangeText={(value) => onChange('room', value)}
      />
      <Label>{t('streetName')}</Label>
      <Input
        autoCapitalize="none"
        brc={'lightgrey'}
        bc={'whitesmoke'}
        value={address?.street}
        onChangeText={(value) => onChange('street', value)}
      />
      <Label>{t('district')}</Label>
      <Input
        autoCapitalize="none"
        brc={'lightgrey'}
        bc={'whitesmoke'}
        value={address?.district}
        onChangeText={(value) => onChange('district', value)}
      />
    </YStack>
  );
};

export default AddressForm;
