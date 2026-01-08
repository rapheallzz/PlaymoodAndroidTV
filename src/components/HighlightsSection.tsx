import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet } from 'react-native';
import axios from 'axios';
import { EXPO_PUBLIC_API_URL } from '../config/apiConfig';
import HighlightViewer from './HighlightViewer';

interface Highlight {
  _id: string;
  content: {
    _id: string;
    title: string;
    thumbnail: string;
  };
}

const HighlightsSection = ({ creatorId }: { creatorId: string }) => {
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [viewerVisible, setViewerVisible] = useState(false);
  const [selectedHighlightIndex, setSelectedHighlightIndex] = useState(0);

  useEffect(() => {
    const fetchHighlights = async () => {
      if (!creatorId) return;
      try {
        const response = await axios.get(`${EXPO_PUBLIC_API_URL}/api/highlights/creator/${creatorId}`);
        setHighlights(response.data);
      } catch (err) {
        setError('Failed to load highlights.');
        console.error('Error fetching highlights:', err);
      }
    };

    fetchHighlights();
  }, [creatorId]);

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.sectionTitle}>Highlights</Text>
        <Text style={{ color: 'red' }}>{error}</Text>
      </View>
    );
  }

  if (highlights.length === 0) {
    return null;
  }

  const openViewer = (index: number) => {
    setSelectedHighlightIndex(index);
    setViewerVisible(true);
  };

  const renderItem = ({ item, index }: { item: Highlight; index: number }) => (
    <TouchableOpacity
      onFocus={() => setFocusedIndex(index)}
      onBlur={() => setFocusedIndex(-1)}
      onPress={() => openViewer(index)}
      hasTVPreferredFocus={index === 0}
    >
      <View style={[styles.highlightItemContainer, { borderColor: focusedIndex === index ? '#fff' : 'transparent', transform: [{ scale: focusedIndex === index ? 1.1 : 1 }] }]}>
        <Image source={{ uri: item.content.thumbnail }} style={styles.highlightImage} />
      </View>
    </TouchableOpacity>
  );

  return (
    <>
      <View style={styles.container}>
        <Text style={styles.sectionTitle}>Highlights</Text>
        <FlatList
          data={highlights}
          horizontal
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          showsHorizontalScrollIndicator={false}
        />
      </View>
      {viewerVisible && (
        <HighlightViewer
          highlights={highlights}
          startIndex={selectedHighlightIndex}
          visible={viewerVisible}
          onClose={() => setViewerVisible(false)}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  highlightItemContainer: {
    borderRadius: 50,
    borderWidth: 2,
    marginRight: 15,
  },
  highlightImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
});

export default HighlightsSection;
