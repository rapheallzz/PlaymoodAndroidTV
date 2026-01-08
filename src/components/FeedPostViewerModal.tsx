import React from 'react';
import { View, Text, Image, Modal, TouchableOpacity, StyleSheet } from 'react-native';

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
      <View style={styles.modalOverlay}>
        <View style={styles.modalCard}>
          <View style={styles.mediaContainer}>
            {post.media && post.media.length > 0 && (
              <Image source={{ uri: post.media[0].url }} style={styles.mediaImage} />
            )}
          </View>
          <View style={styles.contentContainer}>
            <View style={styles.header}>
              <Image source={{ uri: post.user?.profileImage }} style={styles.profileImage} />
              <Text style={styles.creatorName}>{post.user?.name}</Text>
            </View>
            <Text style={styles.caption}>{post.caption}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeText}>X</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  modalCard: {
    width: '90%',
    height: '90%',
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    flexDirection: 'row',
  },
  mediaContainer: {
    flex: 1,
  },
  mediaImage: {
    width: '100%',
    height: '100%',
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
  contentContainer: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  creatorName: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 10,
  },
  caption: {
    color: '#fff',
    marginBottom: 20,
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 1,
  },
  closeText: {
    color: '#fff',
    fontSize: 24,
  },
});

export default FeedPostViewerModal;
