import React, { useState, useEffect } from 'react';
import { View, Text, Image, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import styled from 'styled-components/native';
import { useSelector } from 'react-redux';
import { RootState } from '../app/store';

interface FeedPost {
  _id: string;
  caption: string;
  media: { url: string }[];
  likes: string[];
  comments: any[];
  user: {
    profileImage: string;
    name: string;
  };
}

const ModalOverlay = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.8);
`;

const ModalCard = styled.View`
  width: 90%;
  height: 90%;
  background-color: #1a1a1a;
  border-radius: 8px;
  flex-direction: row;
`;

const MediaContainer = styled.View`
  flex: 1;
`;

const MediaImage = styled.Image`
  width: 100%;
  height: 100%;
  border-top-left-radius: 8px;
  border-bottom-left-radius: 8px;
`;

const ContentContainer = styled.View`
  flex: 1;
  padding: 20px;
`;

const Header = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 10px;
`;

const ProfileImage = styled.Image`
  width: 40px;
  height: 40px;
  border-radius: 20px;
`;

const CreatorName = styled.Text`
  color: #fff;
  font-size: 16px;
  margin-left: 10px;
`;

const Caption = styled.Text`
  color: #fff;
  margin-bottom: 20px;
`;

const CloseButton = styled.TouchableOpacity`
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 1;
`;

const CloseText = styled.Text`
  color: #fff;
  font-size: 24px;
`;

const FeedPostViewerModal = ({ post, visible, onClose }: { post: FeedPost | null; visible: boolean; onClose: () => void }) => {
  if (!post) {
    return null;
  }

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <ModalOverlay>
        <ModalCard>
          <MediaContainer>
            {post.media && post.media.length > 0 && (
              <MediaImage source={{ uri: post.media[0].url }} />
            )}
          </MediaContainer>
          <ContentContainer>
            <Header>
              <ProfileImage source={{ uri: post.user?.profileImage }} />
              <CreatorName>{post.user?.name}</CreatorName>
            </Header>
            <Caption>{post.caption}</Caption>
            {/* Comments and other actions can be added here */}
          </ContentContainer>
        </ModalCard>
        <CloseButton onPress={onClose}>
          <CloseText>X</CloseText>
        </CloseButton>
      </ModalOverlay>
    </Modal>
  );
};

export default FeedPostViewerModal;
