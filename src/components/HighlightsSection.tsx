import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native';
import styled from 'styled-components/native';
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

const HighlightsContainer = styled.View`
  padding: 20px;
`;

const SectionTitle = styled.Text`
  color: #fff;
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 10px;
`;

const HighlightItemContainer = styled.View<{ isFocused: boolean }>`
  border-radius: 50px;
  border-width: 2px;
  border-color: ${(props) => (props.isFocused ? '#fff' : 'transparent')};
  margin-right: 15px;
  transform: ${(props) => (props.isFocused ? 'scale(1.1)' : 'scale(1)')};
`;

const HighlightImage = styled.Image`
  width: 100px;
  height: 100px;
  border-radius: 50px;
`;

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
      <HighlightsContainer>
        <SectionTitle>Highlights</SectionTitle>
        <Text style={{ color: 'red' }}>{error}</Text>
      </HighlightsContainer>
    );
  }

  if (highlights.length === 0) {
    return null; // Don't show the section if there are no highlights
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
      <HighlightItemContainer isFocused={focusedIndex === index}>
        <HighlightImage source={{ uri: item.content.thumbnail }} />
      </HighlightItemContainer>
    </TouchableOpacity>
  );

  return (
    <>
      <HighlightsContainer>
        <SectionTitle>Highlights</SectionTitle>
        <FlatList
          data={highlights}
          horizontal
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          showsHorizontalScrollIndicator={false}
        />
      </HighlightsContainer>
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

export default HighlightsSection;
