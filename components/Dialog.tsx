import { ReactNode } from "react";
import { AlertDialog } from "tamagui"

const Dialog = ({
  isOpen = false,
  children
}: {
  isOpen: boolean;
  children: ReactNode;
}) => {
  return (
    <AlertDialog open={isOpen} >
      <AlertDialog.Portal >
        <AlertDialog.Overlay
          key="overlay"
          animation="quick"
          opacity={0.5}
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />
        <AlertDialog.Content
          bordered
          elevate
          key="content"
          animation={[
            'quick',
            {
              opacity: {
                overshootClamping: true,
              },
            },
          ]}
          enterStyle={{ x: 0, y: -20, opacity: 0, scale: 0.9 }}
          exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
          x={0}
          scale={1}
          opacity={1}
          y={0}
          minWidth={"70%"}
        >
          {children}
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog>
  )
}

export default Dialog
