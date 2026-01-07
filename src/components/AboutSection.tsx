import React from 'react';
import { View, Text } from 'react-native';
import styled from 'styled-components/native';

const AboutContainer = styled.View`
  padding: 20px;
`;

const SectionTitle = styled.Text`
  color: #fff;
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 10px;
`;

const AboutText = styled.Text`
  color: #fff;
  font-size: 16px;
  line-height: 24px;
`;

const AboutSection = ({ about }: { about: string }) => {
  return (
    <AboutContainer>
      <SectionTitle>About</SectionTitle>
      <AboutText>{about}</AboutText>
    </AboutContainer>
  );
};

export default AboutSection;
