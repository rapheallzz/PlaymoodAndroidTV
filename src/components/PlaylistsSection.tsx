import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native';
import styled from 'styled-components/native';
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

const PlaylistsContainer = styled.View`
  padding: 20px;
`;

const PlaylistContainer = styled.View`
  margin-bottom: 20px;
`;

const SectionTitle = styled.Text`
  color: #fff;
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 10px;
`;

const VideoCard = styled.View<{ isFocused: boolean }>`
  margin-right: 10px;
  border-width: 2px;
  border-color: ${(props) => (props.isFocused ? '#fff' : 'transparent')};
  transform: ${(props) => (props.isFocused ? 'scale(1.1)' : 'scale(1)')};
`;

const VideoThumbnail = styled.Image`
  width: 160px;
  height: 90px;
`;

const VideoTitle = styled.Text`
  color: #fff;
  width: 160px;
`;

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
      <PlaylistsContainer>
        <Text style={{ color: 'red' }}>{error}</Text>
      </PlaylistsContainer>
    );
  }

  if (playlists.length === 0) {
    return (
      <PlaylistsContainer>
        <Text style={{ color: '#fff' }}>No public playlists available.</Text>
      </PlaylistsContainer>
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
      <VideoCard isFocused={focusedStates[playlistId] === index}>
        <VideoThumbnail source={{ uri: item.thumbnail }} />
        <VideoTitle>{item.title}</VideoTitle>
      </VideoCard>
    </TouchableOpacity>
  );

  return (
    <PlaylistsContainer>
      {playlists.map((playlist) => (
        <PlaylistContainer key={playlist._id}>
          <SectionTitle>{playlist.name}</SectionTitle>
          <FlatList
            data={playlist.videos}
            horizontal
            keyExtractor={(item) => item._id}
            renderItem={renderVideo(playlist._id)}
            showsHorizontalScrollIndicator={false}
          />
        </PlaylistContainer>
      ))}
    </PlaylistsContainer>
  );
};

export default PlaylistsSection;
