import React, { useState, useEffect } from 'react';
import { View, Text, Image, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { EXPO_PUBLIC_API_URL } from '../config/apiConfig';
import HighlightsSection from '../components/HighlightsSection';
import FeedGrid from '../components/FeedGrid';
import FeedPostViewerModal from '../components/FeedPostViewerModal';
import PlaylistsSection from '../components/PlaylistsSection';
import CommunitySection from '../components/CommunitySection';
import AboutSection from '../components/AboutSection';

type ChannelScreenRouteProp = RouteProp<RootStackParamList, 'Channel'>;

interface Creator {
  _id: string;
  name: string;
  profileImage: string;
  bannerImage: string;
  subscribers: number;
  content: any[];
  about: string;
}

type ChannelScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Channel'>;

const TABS = ['VIDEOS', 'FEEDS', 'PLAYLISTS', 'COMMUNITY', 'ABOUT'];

const ChannelScreen = ({ route }: { route: ChannelScreenRouteProp }) => {
  const { creatorId } = route.params;
  const [creator, setCreator] = useState<Creator | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [focusedVideoIndex, setFocusedVideoIndex] = useState(-1);
  const [activeTab, setActiveTab] = useState('VIDEOS');
  const [focusedTab, setFocusedTab] = useState('');
  const [selectedFeedPost, setSelectedFeedPost] = useState(null);
  const [isFeedModalVisible, setIsFeedModalVisible] = useState(false);
  const navigation = useNavigation<ChannelScreenNavigationProp>();

  useEffect(() => {
    const fetchCreator = async () => {
      try {
        const response = await axios.get(`${EXPO_PUBLIC_API_URL}/api/channel/${creatorId}`);
        setCreator(response.data);
      } catch (err) {
        setError('Failed to load creator data. Please try again later.');
        console.error('Error fetching creator:', err);
      }
    };

    fetchCreator();
  }, [creatorId]);

  if (error) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: 'red' }}>{error}</Text>
      </View>
    );
  }

  if (!creator) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: '#fff' }}>Loading...</Text>
      </View>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'VIDEOS':
        return (
          <View style={styles.videosContainer}>
            <Text style={styles.sectionTitle}>Videos</Text>
            <FlatList
              data={creator?.content}
              horizontal
              keyExtractor={(item) => item._id}
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  onFocus={() => setFocusedVideoIndex(index)}
                  onBlur={() => setFocusedVideoIndex(-1)}
                  onPress={() => navigation.navigate('Movie', { movieId: item._id })}
                  hasTVPreferredFocus={index === 0}
                >
                  <View style={[styles.videoCard, { borderColor: focusedVideoIndex === index ? '#fff' : 'transparent', transform: [{ scale: focusedVideoIndex === index ? 1.1 : 1 }] }]}>
                    <Image source={{ uri: item.thumbnail }} style={styles.videoThumbnail} />
                    <Text style={styles.videoTitle}>{item.title}</Text>
                  </View>
                </TouchableOpacity>
              )}
            />
          </View>
        );
      case 'FEEDS':
        return (
          <FeedGrid
            creatorId={creatorId}
            onPostClick={(post) => {
              setSelectedFeedPost(post);
              setIsFeedModalVisible(true);
            }}
          />
        );
      case 'PLAYLISTS':
        return <PlaylistsSection creatorId={creatorId} />;
      case 'COMMUNITY':
        return <CommunitySection creatorId={creatorId} />;
      case 'ABOUT':
        return <AboutSection about={creator?.about || ''} />;
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: creator.bannerImage }} style={styles.banner} />
      <View style={styles.profileContainer}>
        <Image source={{ uri: creator.profileImage }} style={styles.profileImage} />
        <View style={styles.profileInfo}>
          <Text style={styles.creatorName}>{creator.name}</Text>
          <Text style={styles.subscriberCount}>{creator.subscribers} subscribers</Text>
        </View>
      </View>
      <HighlightsSection creatorId={creatorId} />
      <View style={styles.tabsContainer}>
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab)}
            onFocus={() => setFocusedTab(tab)}
            onBlur={() => setFocusedTab('')}
            style={[styles.tabButton, { borderBottomColor: activeTab === tab ? '#fff' : 'transparent', backgroundColor: focusedTab === tab ? '#555' : 'transparent' }]}
          >
            <Text style={styles.tabText}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.contentContainer}>{renderContent()}</View>
      <FeedPostViewerModal
        post={selectedFeedPost}
        visible={isFeedModalVisible}
        onClose={() => setIsFeedModalVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  banner: {
    width: '100%',
    height: 200,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  profileInfo: {
    marginLeft: 20,
  },
  creatorName: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  subscriberCount: {
    color: '#fff',
    fontSize: 16,
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  tabButton: {
    padding: 10,
    borderBottomWidth: 2,
  },
  tabText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  contentContainer: {
    flex: 1,
  },
  videosContainer: {
    padding: 20,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  videoCard: {
    marginRight: 10,
    borderWidth: 2,
  },
  videoThumbnail: {
    width: 160,
    height: 90,
  },
  videoTitle: {
    color: '#fff',
    width: 160,
  },
});

export default ChannelScreen;
