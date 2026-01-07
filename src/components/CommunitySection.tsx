import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import styled from 'styled-components/native';
import axios from 'axios';
import { EXPO_PUBLIC_API_URL } from '../config/apiConfig';

interface Comment {
  _id: string;
  text: string;
  user: {
    name: string;
  };
}

interface CommunityPost {
  _id: string;
  content: string;
  user: {
    name: string;
    profileImage: string;
  };
  comments: Comment[];
  likes: string[];
  timestamp: string;
}

const CommunityContainer = styled.ScrollView`
  padding: 20px;
`;

const SectionTitle = styled.Text`
  color: #fff;
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 10px;
`;

const PostCard = styled.View`
  background-color: #1a1a1a;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 15px;
`;

const PostHeader = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 10px;
`;

const ProfileImage = styled.Image`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  margin-right: 10px;
`;

const PostCreator = styled.Text`
  color: #fff;
  font-weight: bold;
`;

const PostTimestamp = styled.Text`
  color: #aaa;
  font-size: 12px;
`;

const PostContent = styled.Text`
  color: #fff;
  margin-bottom: 10px;
`;

const CommentsContainer = styled.View`
  margin-top: 10px;
`;

const CommentCard = styled.View`
  background-color: #2b2b2b;
  padding: 10px;
  border-radius: 5px;
  margin-top: 5px;
`;

const CommentUser = styled.Text`
  color: #fff;
  font-weight: bold;
`;

const CommentText = styled.Text`
  color: #ddd;
`;

const NoPostsMessage = styled.Text`
  color: #fff;
  text-align: center;
  margin-top: 20px;
`;


const CommunitySection = ({ creatorId }: { creatorId: string }) => {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCommunityPosts = async () => {
      if (!creatorId) return;
      try {
        const response = await axios.get(`${EXPO_PUBLIC_API_URL}/api/community/${creatorId}`);
        setPosts(response.data);
      } catch (err) {
        if (err.response?.status === 404) {
          setPosts([]);
        } else {
          setError('Failed to load community posts.');
        }
        console.error('Error fetching community posts:', err);
      }
    };

    fetchCommunityPosts();
  }, [creatorId]);

  if (error) {
    return (
      <CommunityContainer>
        <Text style={{ color: 'red' }}>{error}</Text>
      </CommunityContainer>
    );
  }

  if (posts.length === 0) {
    return <NoPostsMessage>No community posts available.</NoPostsMessage>;
  }

  return (
    <CommunityContainer>
      <SectionTitle>Community</SectionTitle>
      {posts.map((post) => (
        <PostCard key={post._id}>
          <PostHeader>
            <ProfileImage source={{ uri: post.user.profileImage }} />
            <View>
              <PostCreator>{post.user.name}</PostCreator>
              <PostTimestamp>{new Date(post.timestamp).toLocaleDateString()}</PostTimestamp>
            </View>
          </PostHeader>
          <PostContent>{post.content}</PostContent>
          <CommentsContainer>
            {post.comments && post.comments.map((comment) => (
              <CommentCard key={comment._id}>
                <CommentUser>{comment.user.name}</CommentUser>
                <CommentText>{comment.text}</CommentText>
              </CommentCard>
            ))}
          </CommentsContainer>
        </PostCard>
      ))}
    </CommunityContainer>
  );
};

export default CommunitySection;
