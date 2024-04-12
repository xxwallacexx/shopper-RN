import { useMemo } from "react"
import { Label, YStack, XStack, RadioGroup } from "tamagui"

const RadioGroupItem = ({
  value,
  label,
  onLabelPress
}: {
  value: string
  label: string
  onLabelPress: (value: string) => void
}) => {
  const id = `radiogroup-${value}`
  return (
    <XStack width={300} alignItems="center" space="$4">
      <RadioGroup.Item
        backgroundColor={"#fff"}
        value={value} id={id}
        size={"$size.1"}
      >
        <RadioGroup.Indicator backgroundColor={"$primary"} />
      </RadioGroup.Item>

      <Label size={"$size.1"} pressStyle={{ opacity: 0.5 }} onPress={() => onLabelPress(value)}>
        {label}
      </Label>
    </XStack>
  )
}
const ProductOptionCard = ({
  option,
  selectedChoice,
  onChoiceChange
}: {
  option: Option,
  selectedChoice?: string,
  onChoiceChange: (optionId: string, choiceId: string) => void
}) => {
  return (
    <YStack>
      <XStack ai="center" gap="$4">
        <Label f={1} miw={80}>
          {option.fieldName}
        </Label>
      </XStack>
      <RadioGroup value={selectedChoice} name={option.fieldName} onValueChange={(value) => onChoiceChange(option._id, value)}>
        <YStack width={300} alignItems="center" space="$2">
          {
            useMemo(() => {
              return (
                option.choices.map((c) => {
                  return <RadioGroupItem
                    key={`radiogroup-${c._id}`}
                    value={c._id}
                    label={c.name}
                    onLabelPress={(value) => onChoiceChange(option._id, value)}
                  />
                })
              )
            }, [option])
          }
        </YStack>
      </RadioGroup>
    </YStack>
  )
}

export default ProductOptionCard
