import { StackProps, TabLayout } from 'tamagui';

export interface TabsRovingIndicatorProps extends StackProps {
  active?: boolean;
}

export interface TabState {
  currentTab: string;
  intentAt: TabLayout | null;
  activeAt: TabLayout | null;
  prevActiveAt: TabLayout | null;
}

export interface AnimatedTabsProps {
  tabs: Array<{
    label: string;
    value: string;
  }>;
  initialTab: string;
  onTabChanged: (value: string) => void;
} 