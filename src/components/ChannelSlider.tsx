import React, { useState, useEffect } from 'react';
import { FlatList, TouchableOpacity, Text, View, Image, StyleSheet } from 'react-native';
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
      <View style={styles.container}>
        <Text style={styles.sectionTitle}>Channels</Text>
        <Text style={{ color: 'red' }}>{error}</Text>
      </View>
    );
  }

  const renderItem = ({ item, index }: { item: Creator; index: number }) => (
    <TouchableOpacity
      onFocus={() => setFocusedIndex(index)}
      onBlur={() => setFocusedIndex(-1)}
      onPress={() => navigation.navigate('Channel', { creatorId: item._id })}
      hasTVPreferredFocus={index === 0}
      activeOpacity={0.8}
    >
      <View style={[styles.creatorItemContainer, { borderColor: focusedIndex === index ? '#fff' : 'transparent', transform: [{ scale: focusedIndex === index ? 1.1 : 1 }] }]}>
        <Image source={{ uri: item.profileImage }} style={styles.creatorImage} />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Channels</Text>
      <FlatList
        data={creators}
        horizontal
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  creatorItemContainer: {
    borderRadius: 50,
    borderWidth: 2,
    marginRight: 15,
  },
  creatorImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
});

export default ChannelSlider;
