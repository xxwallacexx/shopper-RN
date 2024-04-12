import { ReactNode } from "react"
import { ScrollView, Sheet } from 'tamagui'

const ActionSheet = ({
  isSheetOpen = false,
  setIsSheetOpen,
  sheetPosition,
  setSheetPosition,
  children
}: {
  isSheetOpen?: boolean,
  setIsSheetOpen: (value: boolean) => void,
  sheetPosition: number,
  setSheetPosition: (value: number) => void,
  children: ReactNode
}
) => {
  return (
    <Sheet
      disableDrag={true}
      forceRemoveScrollEnabled={isSheetOpen}
      modal={true}
      open={isSheetOpen}
      onOpenChange={setIsSheetOpen}
      snapPointsMode={"percent"}
      snapPoints={[40]}
      dismissOnSnapToBottom
      position={sheetPosition}
      onPositionChange={setSheetPosition}
      zIndex={100_000}
      animation="quick"
    >
      <Sheet.Overlay
        style={{ opacity: 0.8, backgroundColor: "lightslategrey" }}
        animation="lazy"
        enterStyle={{ opacity: 0 }}
        exitStyle={{ opacity: 0 }}
      />
      <Sheet.Frame padding="$4" backgroundColor={"ghostwhite"} >
          {children}
      </Sheet.Frame>
    </Sheet>

  )
}


export default ActionSheet
