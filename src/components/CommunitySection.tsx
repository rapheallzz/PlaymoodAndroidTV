import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Image } from 'react-native';
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

const CommunitySection = ({ creatorId }: { creatorId: string }) => {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCommunityPosts = async () => {
      if (!creatorId) return;
      try {
        const response = await axios.get(`${EXPO_PUBLIC_API_URL}/api/community/${creatorId}`);
        setPosts(response.data);
      } catch (err: any) {
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
      <View style={styles.container}>
        <Text style={{ color: 'red' }}>{error}</Text>
      </View>
    );
  }

  if (posts.length === 0) {
    return <Text style={styles.noPostsMessage}>No community posts available.</Text>;
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.sectionTitle}>Community</Text>
      {posts.map((post) => (
        <View key={post._id} style={styles.postCard}>
          <View style={styles.postHeader}>
            <Image source={{ uri: post.user.profileImage }} style={styles.profileImage} />
            <View>
              <Text style={styles.postCreator}>{post.user.name}</Text>
              <Text style={styles.postTimestamp}>{new Date(post.timestamp).toLocaleDateString()}</Text>
            </View>
          </View>
          <Text style={styles.postContent}>{post.content}</Text>
          <View style={styles.commentsContainer}>
            {post.comments && post.comments.map((comment) => (
              <View key={comment._id} style={styles.commentCard}>
                <Text style={styles.commentUser}>{comment.user.name}</Text>
                <Text style={styles.commentText}>{comment.text}</Text>
              </View>
            ))}
          </View>
        </View>
      ))}
    </ScrollView>
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
  postCard: {
    backgroundColor: '#1a1a1a',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  postCreator: {
    color: '#fff',
    fontWeight: 'bold',
  },
  postTimestamp: {
    color: '#aaa',
    fontSize: 12,
  },
  postContent: {
    color: '#fff',
    marginBottom: 10,
  },
  commentsContainer: {
    marginTop: 10,
  },
  commentCard: {
    backgroundColor: '#2b2b2b',
    padding: 10,
    borderRadius: 5,
    marginTop: 5,
  },
  commentUser: {
    color: '#fff',
    fontWeight: 'bold',
  },
  commentText: {
    color: '#ddd',
  },
  noPostsMessage: {
    color: '#fff',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default CommunitySection;
