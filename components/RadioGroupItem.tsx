import { Label, XStack, RadioGroup } from "tamagui"

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
    <XStack width={300} alignItems="center" space="$2">
      <RadioGroup.Item
        backgroundColor={"#fff"}
        value={value} id={id}
        size={"$3"}
        borderColor={"$primary"}
      >
        <RadioGroup.Indicator backgroundColor={"$primary"} />
      </RadioGroup.Item>

      <Label size={"$size.1"} pressStyle={{ opacity: 0.5 }} onPress={() => onLabelPress(value)}>
        {label}
      </Label>
    </XStack>
  )
}

export default RadioGroupItem
