import React, { useEffect, useState, useRef } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, ScrollView } from 'react-native';
import axios from 'axios';
import { EXPO_PUBLIC_API_URL } from '../config/apiConfig';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../app/store';
import { likeContent, unlikeContent, addToWatchlist, removeFromWatchlist } from '../features/authSlice';
import FocusableTouchableOpacity from '../components/FocusableTouchableOpacity';
import { Video } from 'expo-av';
import ContentSlider from '../components/ContentSlider';
import ChannelSlider from '../components/ChannelSlider';

interface Content {
  _id: string;
  title: string;
  description: string;
  video: string;
  thumbnail: string;
  category: string;
}

const HomeScreen = ({ navigation }: { navigation: any }) => {
  const [featuredContent, setFeaturedContent] = useState<Content[]>([]);
  const [topTen, setTopTen] = useState<Content[]>([]);
  const [newContent, setNewContent] = useState<Content[]>([]);
  const [recommendedContent, setRecommendedContent] = useState<Content[]>([]);
  const [fashionContent, setFashionContent] = useState<Content[]>([]);
  const [documentariesContent, setDocumentariesContent] = useState<Content[]>([]);
  const [interviewsContent, setInterviewsContent] = useState<Content[]>([]);
  const [socialContent, setSocialContent] = useState<Content[]>([]);
  const [behindTheCamerasContent, setBehindTheCamerasContent] = useState<Content[]>([]);
  const [soonContent, setSoonContent] = useState<Content[]>([]);
  const [teensContent, setTeensContent] = useState<Content[]>([]);
  const [onlyOnPlaymoodContent, setOnlyOnPlaymoodContent] = useState<Content[]>([]);
  const [likedContent, setLikedContent] = useState<Content[]>([]);
  const [watchlistContent, setWatchlistContent] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();

  const videoRef = useRef<Video>(null);

  useEffect(() => {
    const fetchPublicContent = async () => {
      try {
        const [allRes, topTenRes] = await Promise.all([
          axios.get(`${EXPO_PUBLIC_API_URL}/api/content/`),
          axios.get(`${EXPO_PUBLIC_API_URL}/api/content/top-ten`)
        ]);

        const all: Content[] = allRes.data;

        setFeaturedContent(all.slice(0, 5));
        setNewContent(all.slice(0, 15));
        setTopTen(topTenRes.data);
        setRecommendedContent(all.filter(c => c.category === 'Teen').slice(0, 10));
        setFashionContent(all.filter(c => c.category === 'Fashion Show').slice(0, 10));
        setDocumentariesContent(all.filter(c => c.category === 'Documentarie').slice(0, 10));
        setInterviewsContent(all.filter(c => c.category === 'Interview').slice(0, 10));
        setSocialContent(all.filter(c => c.category === 'Social').slice(0, 10));
        setBehindTheCamerasContent(all.filter(c => c.category === 'Behind the camera').slice(0, 10));
        setSoonContent(all.filter(c => c.category === 'Soon').slice(0, 10));
        setTeensContent(all.filter(c => c.category === 'Teen').slice(0, 10));
        setOnlyOnPlaymoodContent(all.filter(c => c.category === 'Only on Playmood').slice(0, 10));

      } catch (error) {
        console.error('Failed to fetch public content:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPublicContent();
  }, []);

  useEffect(() => {
    const fetchUserContent = async () => {
      if (user?.token) {
        try {
          const [likedRes, watchlistRes] = await Promise.all([
            axios.get(`${EXPO_PUBLIC_API_URL}/api/users/likes`, {
              headers: { Authorization: `Bearer ${user.token}` }
            }),
            axios.get(`${EXPO_PUBLIC_API_URL}/api/content/watchlist/all`, {
              headers: { Authorization: `Bearer ${user.token}` }
            })
          ]);
          setLikedContent(likedRes.data);
          setWatchlistContent(watchlistRes.data);
        } catch (error) {
          console.error('Failed to fetch user-specific content:', error);
          setLikedContent([]);
          setWatchlistContent([]);
        }
      } else {
        setLikedContent([]);
        setWatchlistContent([]);
      }
    };

    fetchUserContent();
  }, [user]);

  useEffect(() => {
    if (featuredContent.length > 0) {
      const interval = setInterval(() => {
        setCurrentBannerIndex(prev => (prev + 1) % featuredContent.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [featuredContent]);

  const handleWatchNow = (content: Content) => {
    navigation.navigate('Movie', { contentId: content._id });
  };

  const handleLike = (contentId: string) => {
      const isLiked = user?.likes?.includes(contentId);
      if (isLiked) {
          dispatch(unlikeContent({ contentId }));
      } else {
          dispatch(likeContent({ contentId }));
      }
  }

  const handleWatchlist = (contentId: string) => {
      const isInWatchlist = user?.watchlist?.includes(contentId);
      if (isInWatchlist) {
          dispatch(removeFromWatchlist({ contentId }));
      } else {
          dispatch(addToWatchlist({ contentId }));
      }
  }

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  const currentBannerContent = featuredContent[currentBannerIndex];

  return (
    <ScrollView style={styles.container}>
      {currentBannerContent && (
        <View style={styles.bannerContainer}>
          <Video
            ref={videoRef}
            style={styles.bannerVideo}
            source={{ uri: currentBannerContent.video }}
            shouldPlay
            isMuted
            resizeMode="cover"
            isLooping
          />
          <View style={styles.bannerOverlay}>
            <Text style={styles.bannerTitle}>{currentBannerContent.title}</Text>
            <Text style={styles.bannerDescription} numberOfLines={3}>{currentBannerContent.description}</Text>
            <View style={styles.buttonContainer}>
              <FocusableTouchableOpacity onPress={() => handleWatchNow(currentBannerContent)}>
                <View style={[styles.button, styles.watchNowButton]}>
                  <Text style={styles.buttonText}>WATCH NOW</Text>
                </View>
              </FocusableTouchableOpacity>
              <FocusableTouchableOpacity onPress={() => handleWatchlist(currentBannerContent._id)}>
                 <View style={styles.button}>
                  <Text style={styles.buttonText}>
                    {user?.watchlist?.includes(currentBannerContent._id) ? 'REMOVE FROM WATCHLIST' : 'ADD TO WATCHLIST'}
                  </Text>
                </View>
              </FocusableTouchableOpacity>
            </View>
          </View>
        </View>
      )}

      <ChannelSlider />
      <ContentSlider title="Top 10" data={topTen} onPressItem={handleWatchNow} />
      <ContentSlider title="New on Playmood" data={newContent} onPressItem={handleWatchNow} />
      {user && <ContentSlider title="My Likes" data={likedContent} onPressItem={handleWatchNow} />}
      {user && <ContentSlider title="My Watchlist" data={watchlistContent} onPressItem={handleWatchNow} />}
      <ContentSlider title="Recommended for you" data={recommendedContent} onPressItem={handleWatchNow} />
      <ContentSlider title="Interviews" data={interviewsContent} onPressItem={handleWatchNow} />
      <ContentSlider title="Fashion Shows" data={fashionContent} onPressItem={handleWatchNow} />
      <ContentSlider title="Social" data={socialContent} onPressItem={handleWatchNow} />
      <ContentSlider title="Documentaries and Reports" data={documentariesContent} onPressItem={handleWatchNow} />
      <ContentSlider title="Behind the Cameras" data={behindTheCamerasContent} onPressItem={handleWatchNow} />
      <ContentSlider title="Soon in Playmood" data={soonContent} onPressItem={handleWatchNow} />
      <ContentSlider title="Teens" data={teensContent} onPressItem={handleWatchNow} />
      <ContentSlider title="Only in Playmood" data={onlyOnPlaymoodContent} onPressItem={handleWatchNow} />
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
  bannerContainer: {
    width: '100%',
    height: 500,
  },
  bannerVideo: {
    width: '100%',
    height: '100%',
  },
  bannerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
    padding: 40,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  bannerTitle: {
    fontSize: 36,
    color: '#fff',
    fontWeight: 'bold',
  },
  bannerDescription: {
    fontSize: 18,
    color: '#fff',
    marginTop: 10,
    maxWidth: '50%',
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
  watchNowButton: {
    backgroundColor: '#541011',
    marginRight: 15,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
