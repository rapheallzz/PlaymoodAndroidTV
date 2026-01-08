import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet } from 'react-native';
import axios from 'axios';
import { EXPO_PUBLIC_API_URL } from '../config/apiConfig';

interface FeedPost {
  _id: string;
  caption: string;
  media: { url: string }[];
  likes: string[];
  comments: any[];
}

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
      <View style={styles.container}>
        <Text style={styles.sectionTitle}>Feeds</Text>
        <Text style={{ color: 'red' }}>{error}</Text>
      </View>
    );
  }

  if (feeds.length === 0) {
    return <Text style={styles.noPostsMessage}>No feed posts yet.</Text>;
  }

  const renderItem = ({ item, index }: { item: FeedPost; index: number }) => (
    <TouchableOpacity
      style={styles.postItem}
      onFocus={() => setFocusedIndex(index)}
      onBlur={() => setFocusedIndex(-1)}
      onPress={() => onPostClick(item)}
      hasTVPreferredFocus={index === 0}
    >
      <View style={[styles.postItemContainer, { borderColor: focusedIndex === index ? '#fff' : 'transparent', transform: [{ scale: focusedIndex === index ? 1.1 : 1 }] }]}>
        {item.media && item.media.length > 0 && (
          <Image source={{ uri: item.media[0].url }} style={styles.postImage} />
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Feeds</Text>
      <FlatList
        data={feeds}
        numColumns={3}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  postItem: {
    flex: 1 / 3,
    margin: 1,
  },
  postItemContainer: {
    flex: 1,
    margin: 5,
    borderWidth: 2,
  },
  postImage: {
    width: '100%',
    aspectRatio: 1,
  },
  noPostsMessage: {
    color: '#fff',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default FeedGrid;
