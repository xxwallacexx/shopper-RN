import { StackProps, TabLayout, TabsTabProps } from 'tamagui';

export interface TabsRovingIndicatorProps extends StackProps {
  active?: boolean;
}

export interface TabState {
  currentTab: string;
  intentAt: TabLayout | null;
  activeAt: TabLayout | null;
  prevActiveAt: TabLayout | null;
}

export interface Tab {
  label: string;
  value: string;
}

export interface TabsListProps {
  tabs: Tab[];
  onInteraction: TabsTabProps['onInteraction'];
}

export interface AnimatedTabsProps {
  tabs: Tab[];
  initialTab: string;
  onTabChanged: (value: string) => void;
}
