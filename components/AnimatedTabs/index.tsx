import React, { useEffect } from 'react';
import { AnimatePresence, Tabs, YStack, TabsTabProps } from 'tamagui';
import { AnimatedTabsProps } from '~/types/components/AnimatedTabs';
import { TabsRovingIndicator } from './TabsRovingIndicator';
import { TabsList } from './TabsList';
import { useTabState } from './hooks';

const AnimatedTabs: React.FC<AnimatedTabsProps> = ({ tabs, initialTab, onTabChanged }) => {
  const { tabState, setCurrentTab, setIntentIndicator, setActiveIndicator } =
    useTabState(initialTab);
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
  }, [tabState.currentTab, onTabChanged]);

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
      w="100%"
      bc="#fff">
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

        <TabsList tabs={tabs} onInteraction={handleOnInteraction} />
      </YStack>
    </Tabs>
  );
};

export default AnimatedTabs;
