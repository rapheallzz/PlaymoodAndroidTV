import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Modal, FlatList, TouchableOpacity, Image } from 'react-native';
import styled from 'styled-components/native';
import { Video } from 'expo-av';

interface Highlight {
  _id: string;
  content: {
    _id: string;
    title: string;
    video: string;
  };
}

const ViewerOverlay = styled.View`
  flex: 1;
  background-color: #000;
`;

const StoryContainer = styled.View`
  flex: 1;
  width: 100%;
  height: 100%;
`;

const VideoPlayer = styled(Video)`
  width: 100%;
  height: 100%;
`;

const CloseButton = styled.TouchableOpacity`
  position: absolute;
  top: 40px;
  right: 20px;
  z-index: 1;
`;

const CloseText = styled.Text`
  color: #fff;
  font-size: 24px;
`;

const HighlightViewer = ({ highlights, startIndex, visible, onClose }: { highlights: Highlight[]; startIndex: number; visible: boolean; onClose: () => void }) => {
  const [currentIndex, setCurrentIndex] = useState(startIndex);
  const videoRef = useRef<Video>(null);

  useEffect(() => {
    if (visible) {
      setCurrentIndex(startIndex);
    }
  }, [visible, startIndex]);

  const renderItem = ({ item }: { item: Highlight }) => (
    <StoryContainer>
      <VideoPlayer
        ref={videoRef}
        source={{ uri: item.content.video }}
        shouldPlay
        isLooping
        resizeMode="cover"
      />
    </StoryContainer>
  );

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={visible}
      onRequestClose={onClose}
    >
      <ViewerOverlay>
        <FlatList
          data={highlights}
          pagingEnabled
          horizontal={false}
          initialScrollIndex={startIndex}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
          onScrollToIndexFailed={() => {}}
        />
        <CloseButton onPress={onClose}>
          <CloseText>X</CloseText>
        </CloseButton>
      </ViewerOverlay>
    </Modal>
  );
};

export default HighlightViewer;
