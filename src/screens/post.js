import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, FlatList, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { firebase } from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';

const PostApp = () => {
  const [newPost, setNewPost] = useState('');
  const [posts, setPosts] = useState([]);
  const [newComment, setNewComment] = useState('');
  const user = firebase.auth().currentUser;

  useEffect(() => {
    if (user) {
      loadPosts();
    }
  }, [user]);

  const loadPosts = () => {
    const postsRef = database().ref('posts');

    const handleData = (snapshot) => {
      if (snapshot.val()) {
        const postsArray = Object.entries(snapshot.val()).map(([postId, post]) => ({
          id: postId,
          text: post.text,
          userId: post.userId,
          likes: post.likes || 0,
          comments: post.comments || [],
        }));
        setPosts(postsArray.reverse());
      }
    };

    postsRef.on('value', handleData);

    return () => {
      postsRef.off('value', handleData);
    };
  };

  const handleAddPost = () => {
    if (newPost.trim() !== '' && user) {
      const postsRef = database().ref('posts');
      const newPostRef = postsRef.push();

      newPostRef.set({
        text: newPost,
        userId: user.uid,
        likes: 0,
        comments: [],
      });

      setNewPost('');
    }
  };

  const handleToggleLike = (postId, currentLikes) => {
    if (user) {
      const postRef = database().ref(`posts/${postId}`);
      postRef.update({ likes: currentLikes + 1 });
    }
  };

  const handleAddComment = (postId) => {
    if (newComment.trim() !== '' && user) {
      const postRef = database().ref(`posts/${postId}/comments`);
      postRef.push({
        text: newComment,
        userId: user.uid,
      });

      setNewComment('');
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.postContainer}>
            <Text>{item.text}</Text>
            <TouchableOpacity onPress={() => handleToggleLike(item.id, item.likes)}>
              <Text>Likes: {item.likes}</Text>
            </TouchableOpacity>
            <Text>Comments: {item.comments.length}</Text>
            <TextInput
              placeholder="Write a comment"
              value={newComment}
              onChangeText={setNewComment}
              style={styles.commentInput}
            />
            <Button title="Add Comment" onPress={() => handleAddComment(item.id)} />
            <FlatList
              data={item.comments}
              keyExtractor={(comment) => comment.id}
              renderItem={({ item: comment }) => (
                <View style={styles.commentContainer}>
                  <Text>{comment.text}</Text>
                  <Text>By: {comment.userId}</Text>
                </View>
              )}
            />
          </View>
        )}
      />
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Write your post"
          value={newPost}
          onChangeText={setNewPost}
          style={styles.input}
        />
        <Button title="Add Post" onPress={handleAddPost} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 16,
  },
  postContainer: {
    padding: 12,
    marginBottom: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CCCCCC',
  },
  commentContainer: {
    padding: 8,
    marginBottom: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DDDDDD',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: '#CCCCCC',
    borderWidth: 1,
    paddingHorizontal: 8,
    marginRight: 8,
  },
  commentInput: {
    height: 40,
    borderColor: '#CCCCCC',
    borderWidth: 1,
    marginBottom: 8,
    paddingHorizontal: 8,
  },
});

export default PostApp;
