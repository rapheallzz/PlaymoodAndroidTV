import React from 'react';
import { FlatList, View } from 'react-native';
import styled from 'styled-components/native';
import FocusableTouchableOpacity from './FocusableTouchableOpacity';

// --- Interfaces ---
interface Content {
  _id: string;
  thumbnail: string;
}

interface ContentSliderProps {
  title: string;
  data: Content[];
  onPressItem: (item: Content) => void;
}

// --- Styled Components ---
const SliderContainer = styled.View`
  padding: 20px 0;
`;

const SliderTitle = styled.Text`
  font-size: 24px;
  color: #fff;
  font-weight: bold;
  margin-bottom: 15px;
  padding-left: 20px;
`;

const MovieCard = styled.View`
  width: 200px;
  height: 300px;
  margin-right: 15px;
`;

const MovieThumbnail = styled.Image`
  width: 100%;
  height: 100%;
  border-radius: 8px;
`;

// --- Component ---
const ContentSlider: React.FC<ContentSliderProps> = ({ title, data, onPressItem }) => {
  return (
    <SliderContainer>
      <SliderTitle>{title}</SliderTitle>
      <FlatList
        horizontal
        data={data}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <FocusableTouchableOpacity onPress={() => onPressItem(item)}>
            <MovieCard>
              <MovieThumbnail source={{ uri: item.thumbnail }} />
            </MovieCard>
          </FocusableTouchableOpacity>
        )}
        contentContainerStyle={{ paddingLeft: 20 }}
      />
    </SliderContainer>
  );
};

export default ContentSlider;
