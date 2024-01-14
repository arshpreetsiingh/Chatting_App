// ChatScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Icon from 'react-native-vector-icons/FontAwesome';

const ChatScreen = () => {
  const [users, setUsers] = useState([]);
  const navigation = useNavigation();
  const currentUser = auth().currentUser;

  useEffect(() => {
    let isMounted = true;
    const userRef = firestore().collection('users');

    const fetchUsers = async () => {
      try {
        const usersSnapshot = await userRef.get();
        const userList = usersSnapshot.docs
          .map((doc) => ({
            id: doc.id,
            username: doc.data().username,
            profileImage: doc.data().profileImage,
          }))
          .filter((user) => user.id !== currentUser.uid);
        if (isMounted) {
          setUsers(userList);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    const unsubscribeUsers = userRef.onSnapshot(() => fetchUsers());

    return () => {
      isMounted = false;
      unsubscribeUsers();
    };
  }, [currentUser.uid]);

  const onPressUser = (userId, username) => {
    navigation.navigate('PersonalChat', { userId, username });
  };

  const onPressUserProfile = (userId) => {
    navigation.navigate('OtherUserProfile', { userId });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>User List</Text>
      <FlatList
        data={users}
        keyExtractor={(item) => `${item.id}-${item.username}`}
        contentContainerStyle={styles.userListContainer}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.userContainer}
            onPress={() => onPressUser(item.id, item.username)}
          >
            <View style={styles.userInfoContainer}>
              <TouchableOpacity
                onPress={() => onPressUserProfile(item.id)}
                style={styles.imageContainer}
              >
                {item.profileImage ? (
                  <Image source={{ uri: item.profileImage }} style={styles.profileImage} />
                ) : (
                  <View style={styles.emptyImagePlaceholder} />
                )}
              </TouchableOpacity>
              <Text style={styles.username}>{item.username}</Text>
            </View>
            <TouchableOpacity
              style={styles.profileIcon}
              onPress={() => onPressUser(item.id, item.username)}
            >
              <Icon name="user" size={20} color="#333" />
            </TouchableOpacity>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    paddingTop: 50, // Adjust as needed for the status bar
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
    textAlign: 'center',
  },
  userListContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  userContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    alignItems: 'center',
  },
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageContainer: {
    marginRight: 12,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  emptyImagePlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#ddd',
  },
  username: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#555',
  },
  profileIcon: {
    padding: 8,
  },
});

export default ChatScreen;
