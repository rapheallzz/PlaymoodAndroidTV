import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet } from 'react-native';
import axios from 'axios';
import { EXPO_PUBLIC_API_URL } from '../config/apiConfig';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

interface Video {
  _id: string;
  title: string;
  thumbnail: string;
}

interface Playlist {
  _id: string;
  name: string;
  videos: Video[];
}

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Channel'>;

const PlaylistsSection = ({ creatorId }: { creatorId: string }) => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [focusedStates, setFocusedStates] = useState<{ [playlistId: string]: number }>({});
  const navigation = useNavigation<NavigationProp>();

  useEffect(() => {
    const fetchPlaylists = async () => {
      if (!creatorId) return;
      try {
        const response = await axios.get(`${EXPO_PUBLIC_API_URL}/api/playlists/user/${creatorId}/public`);
        setPlaylists(response.data.playlists || []);
      } catch (err) {
        setError('Failed to load playlists.');
        console.error('Error fetching playlists:', err);
      }
    };

    fetchPlaylists();
  }, [creatorId]);

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={{ color: 'red' }}>{error}</Text>
      </View>
    );
  }

  if (playlists.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={{ color: '#fff' }}>No public playlists available.</Text>
      </View>
    );
  }

  const handleFocus = (playlistId: string, index: number) => {
    setFocusedStates((prev) => ({ ...prev, [playlistId]: index }));
  };

  const renderVideo = (playlistId: string) => ({ item, index }: { item: Video; index: number }) => (
    <TouchableOpacity
      onFocus={() => handleFocus(playlistId, index)}
      onBlur={() => handleFocus(playlistId, -1)}
      onPress={() => navigation.navigate('Movie', { movieId: item._id })}
      hasTVPreferredFocus={index === 0}
    >
      <View style={[styles.videoCard, { borderColor: focusedStates[playlistId] === index ? '#fff' : 'transparent', transform: [{ scale: focusedStates[playlistId] === index ? 1.1 : 1 }] }]}>
        <Image source={{ uri: item.thumbnail }} style={styles.videoThumbnail} />
        <Text style={styles.videoTitle}>{item.title}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {playlists.map((playlist) => (
        <View key={playlist._id} style={styles.playlistContainer}>
          <Text style={styles.sectionTitle}>{playlist.name}</Text>
          <FlatList
            data={playlist.videos}
            horizontal
            keyExtractor={(item) => item._id}
            renderItem={renderVideo(playlist._id)}
            showsHorizontalScrollIndicator={false}
          />
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  playlistContainer: {
    marginBottom: 20,
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

export default PlaylistsSection;
