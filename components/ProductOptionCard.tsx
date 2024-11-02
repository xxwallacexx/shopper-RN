import { useMemo } from 'react';
import { Label, YStack, XStack, RadioGroup } from 'tamagui';
import RadioGroupItem from './RadioGroupItem';
import { Option } from '~/types';

const ProductOptionCard = ({
  option,
  selectedChoice,
  onChoiceChange,
}: {
  option: Option;
  selectedChoice?: string;
  onChoiceChange: (optionId: string, choiceId: string) => void;
}) => {
  return (
    <YStack>
      <XStack ai="center" gap="$4">
        <Label f={1} miw={80}>
          {option.fieldName}
        </Label>
      </XStack>
      <RadioGroup
        value={selectedChoice}
        name={option.fieldName}
        onValueChange={(value) => onChoiceChange(option._id, value)}>
        <YStack width={300} alignItems="center" space="$2">
          {useMemo(() => {
            return option.choices.map((c) => {
              return (
                <RadioGroupItem
                  key={`radiogroup-${c._id}`}
                  value={c._id}
                  label={c.name}
                  onLabelPress={(value) => onChoiceChange(option._id, value)}
                />
              );
            });
          }, [option])}
        </YStack>
      </RadioGroup>
    </YStack>
  );
};

export default ProductOptionCard;
