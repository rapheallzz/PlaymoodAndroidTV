import React, { useEffect, useState, useRef } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import styled from 'styled-components/native';
import axios from 'axios';
import { EXPO_PUBLIC_API_URL } from '../config/apiConfig';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../app/store';
import { likeContent, unlikeContent, addToWatchlist, removeFromWatchlist } from '../features/authSlice';
import FocusableTouchableOpacity from '../components/FocusableTouchableOpacity';
import { Video } from 'expo-av';

// --- Styled Components ---
const Container = styled.ScrollView`
  flex: 1;
  background-color: #000;
`;

const LoaderContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const VideoContainer = styled.View`
  width: 100%;
  aspect-ratio: 16 / 9;
`;

const StyledVideo = styled(Video)`
  width: 100%;
  height: 100%;
`;

const DetailsContainer = styled.View`
  padding: 20px;
`;

const Title = styled.Text`
  font-size: 28px;
  color: #fff;
  font-weight: bold;
`;

const Description = styled.Text`
  font-size: 16px;
  color: #ccc;
  margin-top: 10px;
`;

const ButtonContainer = styled.View`
  flex-direction: row;
  margin-top: 20px;
`;

const ButtonText = styled.Text`
  color: #fff;
  font-size: 16px;
  font-weight: bold;
`;

// --- Interfaces ---
interface Content {
  _id: string;
  title: string;
  description: string;
  video: string;
}

// --- Component ---
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
      <LoaderContainer>
        <ActivityIndicator size="large" color="#fff" />
      </LoaderContainer>
    );
  }

  if (!content) {
    return (
      <LoaderContainer>
        <Text style={{ color: '#fff' }}>Content not found.</Text>
      </LoaderContainer>
    );
  }

  const isLiked = user?.likes?.includes(content._id);
  const isInWatchlist = user?.watchlist?.includes(content._id);

  return (
    <Container>
      <VideoContainer>
        <StyledVideo
          ref={videoRef}
          source={{ uri: content.video }}
          shouldPlay
          resizeMode="cover"
          useNativeControls
        />
      </VideoContainer>
      <DetailsContainer>
        <Title>{content.title}</Title>
        <Description>{content.description}</Description>
        <ButtonContainer>
           <FocusableTouchableOpacity onPress={handleLike}>
              <View style={{ padding: 15, backgroundColor: 'rgba(128, 128, 128, 0.5)', borderRadius: 5, marginRight: 15 }}>
                <ButtonText>
                  {isLiked ? 'UNLIKE' : 'LIKE'}
                </ButtonText>
              </View>
            </FocusableTouchableOpacity>
            <FocusableTouchableOpacity onPress={handleWatchlist}>
               <View style={{ padding: 15, backgroundColor: 'rgba(128, 128, 128, 0.5)', borderRadius: 5 }}>
                <ButtonText>
                  {isInWatchlist ? 'REMOVE FROM WATCHLIST' : 'ADD TO WATCHLIST'}
                </ButtonText>
              </View>
            </FocusableTouchableOpacity>
        </ButtonContainer>
      </DetailsContainer>
    </Container>
  );
};

export default MovieScreen;
