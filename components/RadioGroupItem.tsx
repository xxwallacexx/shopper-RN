import { Label, XStack, RadioGroup } from 'tamagui';

const RadioGroupItem = ({
  value,
  label,
  onLabelPress,
}: {
  value: string;
  label: string;
  onLabelPress: (value: string) => void;
}) => {
  const id = `radiogroup-${value}`;
  return (
    <XStack w={300} ai="center" gap="$2">
      <RadioGroup.Item bc="#fff" value={value} id={id} size="$3" boc="$primary">
        <RadioGroup.Indicator backgroundColor="$primary" />
      </RadioGroup.Item>

      <Label size="$size.1" pressStyle={{ o: 0.5 }} onPress={() => onLabelPress(value)}>
        {label}
      </Label>
    </XStack>
  );
};

export default RadioGroupItem;
