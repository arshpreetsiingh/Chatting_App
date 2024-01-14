// EditProfileScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const EditProfileScreen = ({ navigation }) => {
  const user = auth().currentUser;
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    const userRef = firestore().collection('users').doc(user.uid);

    const handleUserData = (snapshot) => {
      if (snapshot.exists) {
        const userData = snapshot.data();
        setUsername(userData.username);
        setBio(userData.bio || ''); // Set bio to empty string if not present
      }
    };

    const unsubscribe = userRef.onSnapshot(handleUserData);

    return () => {
      unsubscribe();
    };
  }, [user.uid]);

  const handleSave = async () => {
    try {
      setError(null); // Reset error state

      // Validate input
      if (!username.trim()) {
        setError('Username cannot be empty');
        return;
      }

      const userRef = firestore().collection('users').doc(user.uid);
      await userRef.update({
        username: username.trim(),
        bio: bio.trim(), // Trim the bio
      });

      alert('Profile updated successfully!');
      navigation.goBack(); // Navigate back to UserProfileScreen
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Profile</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.bioInput}
        placeholder="Bio"
        value={bio}
        onChangeText={setBio}
        multiline
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#ffffff', // White background
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#3498db', // Highlighted color
  },
  input: {
    height: 40,
    width: '80%',
    borderColor: '#3498db', // Highlighted color
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  bioInput: {
    height: 80,
    width: '80%',
    borderColor: '#3498db', // Highlighted color
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    borderRadius: 8,
    textAlignVertical: 'top',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  saveButton: {
    backgroundColor: '#3498db', // Highlighted color
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  saveButtonText: {
    color: '#ffffff', // White text
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default EditProfileScreen;
