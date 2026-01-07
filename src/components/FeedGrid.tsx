import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet } from 'react-native';
import styled from 'styled-components/native';
import axios from 'axios';
import { EXPO_PUBLIC_API_URL } from '../config/apiConfig';

interface FeedPost {
  _id: string;
  caption: string;
  media: { url: string }[];
  likes: string[];
  comments: any[];
}

const FeedContainer = styled.View`
  flex: 1;
  padding: 20px;
`;

const SectionTitle = styled.Text`
  color: #fff;
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 10px;
`;

const PostItemContainer = styled.View<{ isFocused: boolean }>`
  flex: 1;
  margin: 5px;
  border-width: 2px;
  border-color: ${(props) => (props.isFocused ? '#fff' : 'transparent')};
  transform: ${(props) => (props.isFocused ? 'scale(1.1)' : 'scale(1)')};
`;

const PostImage = styled.Image`
  width: 100%;
  aspect-ratio: 1;
`;

const NoPostsMessage = styled.Text`
  color: #fff;
  text-align: center;
  margin-top: 20px;
`;

const FeedGrid = ({ creatorId, onPostClick }: { creatorId: string; onPostClick: (post: FeedPost) => void }) => {
  const [feeds, setFeeds] = useState<FeedPost[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [focusedIndex, setFocusedIndex] = useState(-1);

  useEffect(() => {
    const fetchFeeds = async () => {
      if (!creatorId) return;
      try {
        const response = await axios.get(`${EXPO_PUBLIC_API_URL}/api/feed/user/${creatorId}`);
        setFeeds(response.data);
      } catch (err) {
        setError('Failed to load feeds.');
        console.error('Error fetching feeds:', err);
      }
    };

    fetchFeeds();
  }, [creatorId]);

  if (error) {
    return (
      <FeedContainer>
        <SectionTitle>Feeds</SectionTitle>
        <Text style={{ color: 'red' }}>{error}</Text>
      </FeedContainer>
    );
  }

  if (feeds.length === 0) {
    return <NoPostsMessage>No feed posts yet.</NoPostsMessage>;
  }

  const renderItem = ({ item, index }: { item: FeedPost; index: number }) => (
    <TouchableOpacity
      style={{ flex: 1 / 3, margin: 1 }}
      onFocus={() => setFocusedIndex(index)}
      onBlur={() => setFocusedIndex(-1)}
      onPress={() => onPostClick(item)}
      hasTVPreferredFocus={index === 0}
    >
      <PostItemContainer isFocused={focusedIndex === index}>
        {item.media && item.media.length > 0 && (
          <PostImage source={{ uri: item.media[0].url }} />
        )}
      </PostItemContainer>
    </TouchableOpacity>
  );

  return (
    <FeedContainer>
      <SectionTitle>Feeds</SectionTitle>
      <FlatList
        data={feeds}
        numColumns={3}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
      />
    </FeedContainer>
  );
};

export default FeedGrid;
