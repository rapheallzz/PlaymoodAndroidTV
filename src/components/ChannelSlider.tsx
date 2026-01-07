import React, { useState, useEffect } from 'react';
import { FlatList, TouchableOpacity, Text } from 'react-native';
import styled from 'styled-components/native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { EXPO_PUBLIC_API_URL } from '../config/apiConfig';

interface Creator {
  _id: string;
  name: string;
  profileImage: string;
}

const SliderContainer = styled.View`
  padding: 20px;
`;

const SectionTitle = styled.Text`
  color: #fff;
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 10px;
`;

const CreatorItemContainer = styled.View<{ isFocused: boolean }>`
  border-radius: 50px;
  border-width: 2px;
  border-color: ${(props) => (props.isFocused ? '#fff' : 'transparent')};
  margin-right: 15px;
  transform: ${(props) => (props.isFocused ? 'scale(1.1)' : 'scale(1)')};
`;

const CreatorImage = styled.Image`
  width: 100px;
  height: 100px;
  border-radius: 50px;
`;

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

const ChannelSlider = () => {
  const [creators, setCreators] = useState<Creator[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const navigation = useNavigation<NavigationProp>();

  useEffect(() => {
    const fetchCreators = async () => {
      try {
        const response = await axios.get(`${EXPO_PUBLIC_API_URL}/api/users/creators`);
        setCreators(response.data);
      } catch (err) {
        setError('Failed to load channels. Please try again later.');
        console.error('Error fetching creators:', err);
      }
    };

    fetchCreators();
  }, []);

  if (error) {
    return (
      <SliderContainer>
        <SectionTitle>Channels</SectionTitle>
        <Text style={{ color: 'red' }}>{error}</Text>
      </SliderContainer>
    );
  }

  const renderItem = ({ item, index }: { item: Creator; index: number }) => (
    <TouchableOpacity
      onFocus={() => setFocusedIndex(index)}
      onBlur={() => setFocusedIndex(-1)}
      onPress={() => navigation.navigate('Channel', { creatorId: item._id })}
      activeOpacity={0.8}
      hasTVPreferredFocus={index === 0}
    >
      <CreatorItemContainer isFocused={focusedIndex === index}>
        <CreatorImage source={{ uri: item.profileImage }} />
      </CreatorItemContainer>
    </TouchableOpacity>
  );

  return (
    <SliderContainer>
      <SectionTitle>Channels</SectionTitle>
      <FlatList
        data={creators}
        horizontal
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        showsHorizontalScrollIndicator={false}
      />
    </SliderContainer>
  );
};

export default ChannelSlider;
