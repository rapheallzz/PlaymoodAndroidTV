import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const AboutSection = ({ about }: { about: string }) => {
  return (
    <View style={styles.aboutContainer}>
      <Text style={styles.sectionTitle}>About</Text>
      <Text style={styles.aboutText}>{about}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  aboutContainer: {
    padding: 20,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  aboutText: {
    color: '#fff',
    fontSize: 16,
    lineHeight: 24,
  },
});

export default AboutSection;
