import { useState } from 'react';
import { TabLayout } from 'tamagui';
import { TabState } from '~/types/components';

export const useTabState = (initialTab: string) => {
  const [tabState, setTabState] = useState<TabState>({
    activeAt: null,
    currentTab: initialTab,
    intentAt: null,
    prevActiveAt: null,
  });

  const setCurrentTab = (currentTab: string) => setTabState({ ...tabState, currentTab });
  
  const setIntentIndicator = (intentAt: TabLayout | null) => 
    setTabState({ ...tabState, intentAt });
  
  const setActiveIndicator = (activeAt: TabLayout | null) =>
    setTabState({ ...tabState, prevActiveAt: tabState.activeAt, activeAt });

  return {
    tabState,
    setCurrentTab,
    setIntentIndicator,
    setActiveIndicator,
  };
}; 