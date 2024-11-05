import { ReactNode } from 'react';
import { Sheet } from 'tamagui';

const ActionSheet = ({
  bg = 'ghostwhite',
  isSheetOpen = false,
  setIsSheetOpen,
  sheetPosition,
  snapPoints = [40],
  setSheetPosition,
  children,
}: {
  bg?: string;
  isSheetOpen?: boolean;
  setIsSheetOpen: (value: boolean) => void;
  sheetPosition: number;
  snapPoints?: [number];
  setSheetPosition: (value: number) => void;
  children: ReactNode;
}) => {
  return (
    <Sheet
      disableDrag={true}
      forceRemoveScrollEnabled={isSheetOpen}
      modal={true}
      open={isSheetOpen}
      onOpenChange={setIsSheetOpen}
      snapPointsMode={'percent'}
      snapPoints={snapPoints}
      dismissOnSnapToBottom
      position={sheetPosition}
      onPositionChange={setSheetPosition}
      zIndex={100_000}
      animation="quick">
      <Sheet.Overlay
        style={{ opacity: 0.5, backgroundColor: 'lightslategrey' }}
        animation="100ms"
        enterStyle={{ opacity: 0 }}
        exitStyle={{ opacity: 0 }}
      />
      <Sheet.Frame padding={snapPoints.includes(100) ? '$0' : '$4'} backgroundColor={bg}>
        {children}
      </Sheet.Frame>
    </Sheet>
  );
};

export default ActionSheet;
