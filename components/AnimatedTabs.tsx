import { useEffect, useState } from 'react';
import type { StackProps, TabLayout, TabsTabProps } from 'tamagui';
import { AnimatePresence, Tabs, YStack } from 'tamagui';
import { Subtitle } from '~/tamagui.config';

const TabsRovingIndicator = ({ active, ...props }: { active?: boolean } & StackProps) => {
  return (
    <YStack
      pos="absolute"
      bc="$color.primary"
      o={0.7}
      animation="100ms"
      enterStyle={{
        o: 0,
      }}
      exitStyle={{
        o: 0,
      }}
      {...(active && {
        backgroundColor: '$color.primary',
        opacity: 0.6,
      })}
      {...props}
    />
  );
};

const AnimatedTabs = ({
  tabs,
  initialTab,
  onTabChanged,
}: {
  tabs: { label: string; value: string }[];
  initialTab: string;
  onTabChanged: (value: string) => void;
}) => {
  const [tabState, setTabState] = useState<{
    currentTab: string;
    /**
     * Layout of the Tab user might intend to select (hovering / focusing)
     */
    intentAt: TabLayout | null;
    /**
     * Layout of the Tab user selected
     */
    activeAt: TabLayout | null;
    /**
     * Used to get the direction of activation for animating the active indicator
     */
    prevActiveAt: TabLayout | null;
  }>({
    activeAt: null,
    currentTab: initialTab,
    intentAt: null,
    prevActiveAt: null,
  });

  const setCurrentTab = (currentTab: string) => setTabState({ ...tabState, currentTab });
  const setIntentIndicator = (intentAt: TabLayout | null) => setTabState({ ...tabState, intentAt });
  const setActiveIndicator = (activeAt: TabLayout | null) =>
    setTabState({ ...tabState, prevActiveAt: tabState.activeAt, activeAt });
  const { activeAt, intentAt, currentTab } = tabState;

  const handleOnInteraction: TabsTabProps['onInteraction'] = (type, layout) => {
    if (type === 'select') {
      setActiveIndicator(layout);
    } else {
      setIntentIndicator(layout);
    }
  };

  useEffect(() => {
    onTabChanged(tabState.currentTab);
  }, [tabState.currentTab]);

  return (
    <Tabs
      value={currentTab}
      onValueChange={setCurrentTab}
      orientation="horizontal"
      size="$4"
      p="$2"
      fd="column"
      activationMode="manual"
      br="$4"
      pos="relative"
      w={'100%'}
      bc={'#fff'}>
      <YStack>
        <AnimatePresence>
          {intentAt && <TabsRovingIndicator w={intentAt.width} h="$0.5" x={intentAt.x} b={0} />}
        </AnimatePresence>
        <AnimatePresence>
          {activeAt && (
            <TabsRovingIndicator
              theme="active"
              w={activeAt.width}
              h="$0.5"
              x={activeAt.x}
              zi={1}
              b={0}
            />
          )}
        </AnimatePresence>

        <Tabs.List
          disablePassBorderRadius
          loop={false}
          backgroundColor="transparent"
          borderBottomWidth={0.3}>
          {tabs.map((t) => {
            return (
              <Tabs.Tab
                key={t.value}
                bc={'$colorTransparent'}
                py="$2"
                px="$3"
                f={1}
                value={t.value}
                onInteraction={handleOnInteraction}>
                <Subtitle ta="center">{t.label}</Subtitle>
              </Tabs.Tab>
            );
          })}
        </Tabs.List>
      </YStack>
    </Tabs>
  );
};

export default AnimatedTabs;
