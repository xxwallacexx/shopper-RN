import { useEffect } from 'react';
import { AnimatePresence, Tabs, YStack } from 'tamagui';
import { TabsTabProps } from 'tamagui';
import { AnimatedTabsProps } from '~/types/components';
import { TabsRovingIndicator } from './TabsRovingIndicator';
import { TabsList } from './TabsList';
import { useTabState } from './useTabState';

const AnimatedTabs = ({ tabs, initialTab, onTabChanged }: AnimatedTabsProps) => {
  const { tabState, setCurrentTab, setIntentIndicator, setActiveIndicator } = useTabState(initialTab);
  const { activeAt, intentAt, currentTab } = tabState;

  const handleOnInteraction: TabsTabProps['onInteraction'] = (type, layout) => {
    if (type === 'select') {
      setActiveIndicator(layout);
    } else {
      setIntentIndicator(layout);
    }
  };

  useEffect(() => {
    onTabChanged(currentTab);
  }, [currentTab, onTabChanged]);

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
              active
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