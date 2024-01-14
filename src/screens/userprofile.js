import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ImageBackground } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import { launchImageLibrary } from 'react-native-image-picker';

const UserProfileScreen = ({ navigation }) => {
  const user = auth().currentUser;
  const [userData, setUserData] = useState(null);
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    const userRef = firestore().collection('users').doc(user?.uid);

    const unsubscribe = userRef.onSnapshot(async (doc) => {
      if (doc.exists) {
        setUserData(doc.data());
        const imageUrl = doc.data()?.profileImage || null;
        if (imageUrl) {
          setProfileImage(imageUrl);
        }
      }
    });

    return () => {
      unsubscribe();
    };
  }, [user?.uid]);

  const handleLogout = async () => {
    try {
      await auth().signOut();
      navigation.navigate('Check'); // Navigate to the login screen or wherever you want
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleNavigation = (screen) => {
    navigation.navigate(screen);
  };

  const handleUploadProfileImage = async () => {
    try {
      const imagePickerResponse = await launchImageLibrary({ mediaType: 'photo' });

      if (imagePickerResponse.didCancel || imagePickerResponse.error || !imagePickerResponse.assets[0]?.uri) {
        console.log('Image picker canceled or error occurred.');
        return;
      }

      const { uri } = imagePickerResponse.assets[0];
      const filename = `${user.uid}/profile.jpg`;

      await storage().ref(filename).putFile(uri);
      const downloadURL = await storage().ref(filename).getDownloadURL();

      await firestore().collection('users').doc(user.uid).update({
        profileImage: downloadURL,
      });

      const updatedUserDoc = await firestore().collection('users').doc(user.uid).get();
      setProfileImage(updatedUserDoc.data()?.profileImage);

      console.log('Profile image uploaded successfully.');
    } catch (error) {
      console.error('Error uploading profile image:', error);
    }
  };

  return (
    <ImageBackground source={require('../../components/images/ok.jpg')} style={styles.backgroundImage}>
      <View style={styles.container}>
        <View style={styles.profileContainer}>
          {profileImage && <Image source={{ uri: profileImage }} style={styles.profileImage} />}
          {userData ? (
            <>
              <Text style={styles.username}>{userData.username || 'No username available'}</Text>
              <Text style={styles.text}>Email: {userData.email || 'No email available'}</Text>
              <Text style={styles.text}>Bio: {userData.bio || 'No bio available'}</Text>
            </>
          ) : (
            <Text style={styles.loadingText}>Loading...</Text>
          )}
        </View>
        <TouchableOpacity style={styles.button} onPress={() => handleNavigation('EditProfile')}>
          <Text style={styles.buttonText}>Edit Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => handleNavigation('ChangePassword')}>
          <Text style={styles.buttonText}>Change Password</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.uploadButton} onPress={handleUploadProfileImage}>
          <Text style={styles.buttonText}>Upload Profile Image</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
    marginBottom: 15,
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#3498db',
  },
  text: {
    fontSize: 18,
    marginBottom: 10,
    color: '#2c3e50',
  },
  loadingText: {
    fontSize: 18,
    marginBottom: 10,
    color: '#2c3e50',
  },
  button: {
    backgroundColor: '#3498db',
    paddingVertical: 15,
    borderRadius: 10,
    marginVertical: 10,
    width: '80%',
    alignItems: 'center',
  },
  logoutButton: {
    backgroundColor: '#e74c3c',
    paddingVertical: 15,
    borderRadius: 10,
    marginVertical: 10,
    width: '80%',
    alignItems: 'center',
  },
  uploadButton: {
    backgroundColor: '#2ecc71',
    paddingVertical: 15,
    borderRadius: 10,
    marginVertical: 10,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default UserProfileScreen;
