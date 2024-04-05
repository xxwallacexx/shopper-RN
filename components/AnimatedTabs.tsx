import { useState } from "react"
import { ScrollView } from "react-native"
import type { StackProps, TabLayout, TabsTabProps } from 'tamagui'
import {
  AnimatePresence,
  H5,
  Separator,
  Tabs,
  YStack,
  styled,
} from 'tamagui'
import { Subtitle } from "~/tamagui.config"

const TabsRovingIndicator = ({ active, ...props }: { active?: boolean } & StackProps) => {
  return (
    <YStack
      position="absolute"
      backgroundColor='$color.primary'
      opacity={0.7}
      animation="100ms"
      enterStyle={{
        opacity: 0,
      }
      }
      exitStyle={{
        opacity: 0,
      }}
      {...(active && {
        backgroundColor: '$color.primary',
        opacity: 0.6,
      })
      }
      {...props}
    />
  )
}

const AnimatedYStack = styled(YStack, {
  variants: {
    isLeft: { true: { x: -25, opacity: 0 } },
    isRight: { true: { x: 25, opacity: 0 } },
    defaultFade: { true: { opacity: 0 } },
  } as const,
})

const AnimatedTabs = ({
  tabs,
  selectedTab,
}: {
  tabs: { label: string, value: string }[]
  selectedTab: string
  onTabSelected: (value: string) => void
}) => {
  const [tabState, setTabState] = useState<{
    currentTab: string
    /**
     * Layout of the Tab user might intend to select (hovering / focusing)
     */
    intentAt: TabLayout | null
    /**
     * Layout of the Tab user selected
     */
    activeAt: TabLayout | null
    /**
     * Used to get the direction of activation for animating the active indicator
     */
    prevActiveAt: TabLayout | null
  }>({
    activeAt: null,
    currentTab: selectedTab,
    intentAt: null,
    prevActiveAt: null,
  })

  const setCurrentTab = (currentTab: string) => setTabState({ ...tabState, currentTab })
  const setIntentIndicator = (intentAt: TabLayout | null) => setTabState({ ...tabState, intentAt })
  const setActiveIndicator = (activeAt: TabLayout | null) =>
    setTabState({ ...tabState, prevActiveAt: tabState.activeAt, activeAt })
  const { activeAt, intentAt, prevActiveAt, currentTab } = tabState

  /**
   * -1: from left
   *  0: n/a
   *  1: from right
   */
  const direction = (() => {
    if (!activeAt || !prevActiveAt || activeAt.x === prevActiveAt.x) {
      return 0
    }
    return activeAt.x > prevActiveAt.x ? -1 : 1
  })()

  const enterVariant =
    direction === 1 ? 'isLeft' : direction === -1 ? 'isRight' : 'defaultFade'
  const exitVariant =
    direction === 1 ? 'isRight' : direction === -1 ? 'isLeft' : 'defaultFade'

  const handleOnInteraction: TabsTabProps['onInteraction'] = (type, layout) => {
    if (type === 'select') {
      setActiveIndicator(layout)
    } else {
      setIntentIndicator(layout)
    }
  }

  const onValueChange = (value: string) => {
    setCurrentTab(value)
  }

  
  return (
    <Tabs
      value={currentTab}
      onValueChange={onValueChange}
      orientation="horizontal"
      size="$4"
      padding="$2"
      flexDirection="column"
      activationMode="manual"
      borderRadius="$4"
      position="relative"
    >
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
        <AnimatePresence>
          {intentAt && (
            <TabsRovingIndicator
              width={intentAt.width}
              height="$0.5"
              x={intentAt.x}
              bottom={0}
            />
          )}
        </AnimatePresence>
        <AnimatePresence>
          {activeAt && (
            <TabsRovingIndicator
              theme="active"
              width={activeAt.width}
              height="$0.5"
              x={activeAt.x}
              bottom={0}
            />
          )}
        </AnimatePresence>

        <Tabs.List
          disablePassBorderRadius
          loop={false}
          backgroundColor="transparent"
          separator={<Separator vertical borderColor={"lightslategrey"} />}
          borderBottomWidth={0.3}
          borderColor={"lightslategrey"}
        >
          {
            tabs.map((t) => {
              return (
                <Tabs.Tab
                  key={t.value}
                  unstyled
                  paddingVertical="$2"
                  paddingHorizontal="$3"
                  flex={1}
                  value={t.value}
                  onInteraction={handleOnInteraction}
                >
                  <Subtitle>{t.label}</Subtitle>
                </Tabs.Tab>

              )
            })
          }
        </Tabs.List>
      </ScrollView>

      <AnimatePresence
        exitBeforeEnter
        enterVariant={enterVariant}
        exitVariant={exitVariant}
      >
        <AnimatedYStack key={currentTab} animation="100ms" x={0} opacity={1} flex={1}>
          <Tabs.Content value={currentTab} forceMount flex={1} justifyContent="center">
            <H5 textAlign="center">{currentTab}</H5>
          </Tabs.Content>
        </AnimatedYStack>
      </AnimatePresence>
    </Tabs>
  )
}

export default AnimatedTabs
