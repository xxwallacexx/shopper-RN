import { Tabs } from 'tamagui';
import { Subtitle } from '~/tamagui.config';
import { TabsTabProps } from 'tamagui';

interface TabsListProps {
  tabs: Array<{
    label: string;
    value: string;
  }>;
  onInteraction: TabsTabProps['onInteraction'];
}

export const TabsList = ({ tabs, onInteraction }: TabsListProps) => (
  <Tabs.List disablePassBorderRadius loop={false} backgroundColor="transparent" borderBottomWidth={0.3}>
    {tabs.map((t) => (
      <Tabs.Tab
        key={t.value}
        bc="$colorTransparent"
        py="$2"
        px="$3"
        f={1}
        value={t.value}
        onInteraction={onInteraction}>
        <Subtitle ta="center">{t.label}</Subtitle>
      </Tabs.Tab>
    ))}
  </Tabs.List>
); 