import { AntDesign, Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import * as VideoThumbnails from 'expo-video-thumbnails';
import { useEffect, useRef, useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { YStack } from 'tamagui';
import { Stack, Image } from 'tamagui';
import ActionSheet from './ActionSheet';
import { useVideoPlayer, VideoView } from 'expo-video';

const Video = ({ uri }: { uri: string }) => {
  const ref = useRef(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [sheetPosition, setSheetPosition] = useState(0);
  const player = useVideoPlayer(uri, (player) => {
    player.loop = false;
  });

  useEffect(() => {
    if (isSheetOpen) {
      player.replay();
      player.play();
    }
  }, [isSheetOpen]);

  return (
    <YStack>
      <TouchableOpacity onPress={() => setIsSheetOpen(true)}>
        <Stack bg="black" h="100%" w="100%" justifyContent="center" alignItems="center">
          <AntDesign color={'white'} name="playcircleo" size={24} />
        </Stack>
      </TouchableOpacity>
      <ActionSheet
        isSheetOpen={isSheetOpen}
        setIsSheetOpen={setIsSheetOpen}
        snapPoints={[100]}
        sheetPosition={sheetPosition}
        setSheetPosition={setSheetPosition}>
        <YStack bg="black" flex={1}>
          <VideoView allowsFullscreen={false} ref={ref} style={{ flex: 1 }} player={player} />
          <YStack position="absolute" l="$4" t="$10">
            <TouchableOpacity
              onPress={() => {
                setIsSheetOpen(false);
              }}>
              <Ionicons size={20} name="arrow-back" color="#fff" />
            </TouchableOpacity>
          </YStack>
        </YStack>
      </ActionSheet>
    </YStack>
  );
};

export default Video;
