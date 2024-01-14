// OtherUserProfileScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, Image, StyleSheet } from 'react-native';
import firestore from '@react-native-firebase/firestore';

const OtherUserProfileScreen = ({ route }) => {
  const [userData, setUserData] = useState(null);
  const { userId, userName } = route.params;

  useEffect(() => {
    const userRef = firestore().collection('users').doc(userId);

    const unsubscribe = userRef.onSnapshot(
      (doc) => {
        if (doc.exists) {
          setUserData(doc.data());
        } else {
          console.error('User document does not exist for ID:', userId);
        }
      },
      (error) => {
        console.error('Error fetching user data:', error);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [userId]);

  console.log('userData:', userData);

  return (
    <View style={styles.container}>
      {userData ? (
        <>
          <View style={styles.imageContainer}>
            {userData.profileImage ? (
              <Image source={{ uri: userData.profileImage }} style={styles.profileImage} />
            ) : (
              <View style={styles.noImageContainer}>
                <Text style={styles.noImageText}>No Profile Image</Text>
              </View>
            )}
          </View>
          <Text style={styles.username}>{userName}</Text>
          <Text style={styles.text}>Email: {userData.email || 'No email available'}</Text>
          <Text style={styles.text}>Bio: {userData.bio || 'No bio available'}</Text>
        </>
      ) : (
        <ActivityIndicator size="large" color="#3498db" />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f0f0', // Light gray background
    padding: 20,
  },
  imageContainer: {
    marginBottom: 20,
    borderRadius: 75,
    overflow: 'hidden',
    elevation: 5,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  noImageContainer: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  noImageText: {
    color: '#555',
    fontSize: 16,
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#3498db',
  },
  text: {
    fontSize: 16,
    marginBottom: 10,
    color: '#666',
  },
});

export default OtherUserProfileScreen;
