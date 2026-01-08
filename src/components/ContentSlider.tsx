import React from 'react';
import { FlatList, View, Text, StyleSheet, Image } from 'react-native';
import FocusableTouchableOpacity from './FocusableTouchableOpacity';

interface Content {
  _id: string;
  thumbnail: string;
}

interface ContentSliderProps {
  title: string;
  data: Content[];
  onPressItem: (item: Content) => void;
}

const ContentSlider: React.FC<ContentSliderProps> = ({ title, data, onPressItem }) => {
  return (
    <View style={styles.sliderContainer}>
      <Text style={styles.sliderTitle}>{title}</Text>
      <FlatList
        horizontal
        data={data}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <FocusableTouchableOpacity onPress={() => onPressItem(item)}>
            <View style={styles.movieCard}>
              <Image source={{ uri: item.thumbnail }} style={styles.movieThumbnail} />
            </View>
          </FocusableTouchableOpacity>
        )}
        contentContainerStyle={{ paddingLeft: 20 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  sliderContainer: {
    paddingVertical: 20,
  },
  sliderTitle: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 15,
    paddingLeft: 20,
  },
  movieCard: {
    width: 200,
    height: 300,
    marginRight: 15,
  },
  movieThumbnail: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
});

export default ContentSlider;
