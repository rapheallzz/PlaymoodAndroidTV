import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Modal, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { Video } from 'expo-av';

interface Highlight {
  _id: string;
  content: {
    _id: string;
    title: string;
    video: string;
  };
}

const HighlightViewer = ({ highlights, startIndex, visible, onClose }: { highlights: Highlight[]; startIndex: number; visible: boolean; onClose: () => void }) => {
  const [currentIndex, setCurrentIndex] = useState(startIndex);
  const videoRef = useRef<Video>(null);

  useEffect(() => {
    if (visible) {
      setCurrentIndex(startIndex);
    }
  }, [visible, startIndex]);

  const renderItem = ({ item }: { item: Highlight }) => (
    <View style={styles.storyContainer}>
      <Video
        ref={videoRef}
        style={styles.videoPlayer}
        source={{ uri: item.content.video }}
        shouldPlay
        isLooping
        resizeMode="cover"
      />
    </View>
  );

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.viewerOverlay}>
        <FlatList
          data={highlights}
          pagingEnabled
          horizontal={false}
          initialScrollIndex={startIndex}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
          onScrollToIndexFailed={() => {}}
        />
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeText}>X</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  viewerOverlay: {
    flex: 1,
    backgroundColor: '#000',
  },
  storyContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  videoPlayer: {
    width: '100%',
    height: '100%',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 1,
  },
  closeText: {
    color: '#fff',
    fontSize: 24,
  },
});

export default HighlightViewer;
