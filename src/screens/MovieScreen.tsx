import React, { useEffect, useState, useRef } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, ScrollView } from 'react-native';
import axios from 'axios';
import { EXPO_PUBLIC_API_URL } from '../config/apiConfig';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../app/store';
import { likeContent, unlikeContent, addToWatchlist, removeFromWatchlist } from '../features/authSlice';
import FocusableTouchableOpacity from '../components/FocusableTouchableOpacity';
import { Video } from 'expo-av';

interface Content {
  _id: string;
  title: string;
  description: string;
  video: string;
}

const MovieScreen = ({ route }: { route: any }) => {
  const { contentId } = route.params;
  const [content, setContent] = useState<Content | null>(null);
  const [loading, setLoading] = useState(true);

  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();

  const videoRef = useRef<Video>(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await axios.get(`${EXPO_PUBLIC_API_URL}/api/content/${contentId}`);
        setContent(response.data);
      } catch (error) {
        console.error('Failed to fetch content:', error);
      } finally {
        setLoading(false);
      }
    };

    if (contentId) {
      fetchContent();
    }
  }, [contentId]);

  const handleLike = () => {
      if (!content) return;
      const isLiked = user?.likes?.includes(content._id);
      if (isLiked) {
          dispatch(unlikeContent({ contentId: content._id }));
      } else {
          dispatch(likeContent({ contentId: content._id }));
      }
  }

  const handleWatchlist = () => {
      if (!content) return;
      const isInWatchlist = user?.watchlist?.includes(content._id);
      if (isInWatchlist) {
          dispatch(removeFromWatchlist({ contentId: content._id }));
      } else {
          dispatch(addToWatchlist({ contentId: content._id }));
      }
  }

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  if (!content) {
    return (
      <View style={styles.loaderContainer}>
        <Text style={{ color: '#fff' }}>Content not found.</Text>
      </View>
    );
  }

  const isLiked = user?.likes?.includes(content._id);
  const isInWatchlist = user?.watchlist?.includes(content._id);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.videoContainer}>
        <Video
          ref={videoRef}
          style={styles.video}
          source={{ uri: content.video }}
          shouldPlay
          resizeMode="cover"
          useNativeControls
        />
      </View>
      <View style={styles.detailsContainer}>
        <Text style={styles.title}>{content.title}</Text>
        <Text style={styles.description}>{content.description}</Text>
        <View style={styles.buttonContainer}>
           <FocusableTouchableOpacity onPress={handleLike}>
              <View style={[styles.button, { marginRight: 15 }]}>
                <Text style={styles.buttonText}>
                  {isLiked ? 'UNLIKE' : 'LIKE'}
                </Text>
              </View>
            </FocusableTouchableOpacity>
            <FocusableTouchableOpacity onPress={handleWatchlist}>
               <View style={styles.button}>
                <Text style={styles.buttonText}>
                  {isInWatchlist ? 'REMOVE FROM WATCHLIST' : 'ADD TO WATCHLIST'}
                </Text>
              </View>
            </FocusableTouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoContainer: {
    width: '100%',
    aspectRatio: 16 / 9,
  },
  video: {
    width: '100%',
    height: '100%',
  },
  detailsContainer: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    color: '#fff',
    fontWeight: 'bold',
  },
  description: {
    fontSize: 16,
    color: '#ccc',
    marginTop: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  button: {
    padding: 15,
    backgroundColor: 'rgba(128, 128, 128, 0.5)',
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default MovieScreen;
