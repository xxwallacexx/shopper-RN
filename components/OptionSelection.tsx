import { Label, ScrollView } from "tamagui";
import { StyledButton } from "~/tamagui.config";

const OptionSelection = ({
  title,
  options,
  selectedOption,
  onOptionChange
}: {
  title: string;
  options: { label: string, value: string }[];
  selectedOption?: string;
  onOptionChange: (value?: string) => void
}) => {
  const onPress = (value: string) => {
    if (value == selectedOption) {
      onOptionChange(undefined)
    } else {
      onOptionChange(value)
    }

  }
  return (
    <>
      <Label>
        {title}
      </Label>
      <ScrollView horizontal contentContainerStyle={{ gap: 6 }}>
        {options.map((o) => {
          const isSelected = o.value == selectedOption
          return (
            <StyledButton backgroundColor={isSelected ? "$color.primary" : "slategray"} key={o.value} onPress={() => onPress(o.value)}>
              {o.label}
            </StyledButton>
          )
        })}
      </ScrollView>
    </>
  )
}

export default OptionSelection
