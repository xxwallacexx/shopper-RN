import React from 'react';
import { Tabs } from 'tamagui';
import { Subtitle } from '~/tamagui.config';
import { TabsListProps } from '~/types/components/AnimatedTabs';

export const TabsList: React.FC<TabsListProps> = ({ tabs, onInteraction }) => (
  <Tabs.List
    disablePassBorderRadius
    loop={false}
    backgroundColor="transparent"
    borderBottomWidth={0.3}>
    {tabs.map((tab) => (
      <Tabs.Tab
        key={tab.value}
        bc="$colorTransparent"
        py="$2"
        px="$3"
        f={1}
        value={tab.value}
        onInteraction={onInteraction}>
        <Subtitle ta="center">{tab.label}</Subtitle>
      </Tabs.Tab>
    ))}
  </Tabs.List>
);
