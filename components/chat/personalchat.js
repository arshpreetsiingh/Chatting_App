import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { GiftedChat, Send } from 'react-native-gifted-chat';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import { useNavigation } from '@react-navigation/native';

const PersonalChatScreen = ({ route }) => {
  const navigation = useNavigation();
  const { userId, username } = route.params;
  const [messages, setMessages] = useState([]);
  const [otherUserProfile, setOtherUserProfile] = useState(null);
  const currentUser = auth().currentUser;

  useEffect(() => {
    const chatRoomId = [userId, currentUser.uid].sort().join('-');

    const messagesRef = firestore().collection('messages').doc(chatRoomId).collection('messages');

    const unsubscribeMessages = messagesRef.orderBy('timestamp').onSnapshot((querySnapshot) => {
      const loadedMessages = querySnapshot.docs.map((doc) => {
        const data = doc.data();

        return {
          _id: doc.id,
          text: data.text,
          createdAt: data.timestamp ? data.timestamp.toMillis() : 0,
          user: {
            _id: data.user,
            name: username,
            avatar: null,
          },
        };
      });

      setMessages(loadedMessages);
    });

    // Fetch other user's profile
    const fetchOtherUserProfile = async () => {
      try {
        const otherUserProfileSnapshot = await firestore().collection('users').doc(userId).get();
        const otherUserProfileData = otherUserProfileSnapshot.data();
        setOtherUserProfile(otherUserProfileData);
      } catch (error) {
        console.error('Error fetching other user profile:', error);
      }
    };

    fetchOtherUserProfile();

    return () => {
      unsubscribeMessages();
    };
  }, [userId, username, currentUser.uid]);

  const onSend = async (newMessages = []) => {
    const { text } = newMessages[0];

    if (text) {
      const chatRoomId = [userId, currentUser.uid].sort().join('-');

      const newMessage = {
        text,
        timestamp: firestore.FieldValue.serverTimestamp(),
        user: currentUser.uid,
        avatar: currentUser.photoURL,
      };

      await firestore().collection('messages').doc(chatRoomId).collection('messages').add(newMessage);
    }
  };


  const CustomSend = (props) => {
    return (
      <View style={styles.sendContainer}>
        <TouchableOpacity>
          <Image source={require('../images/imgselect.png')} style={styles.imgselect} />
        </TouchableOpacity>
        <Send {...props}>
          <Image source={require('../images/send.png')} style={styles.sendimg} />
        </Send>
      </View>
    );
  };
  return (
    <View style={styles.container}>
      {otherUserProfile && (
        <TouchableOpacity onPress={() => navigation.navigate('OtherUserProfile', { userId: userId, userName: username })}>
          <View style={styles.profileContainer}>
            {otherUserProfile.profileImage && (
              <Image source={{ uri: otherUserProfile.profileImage }} style={styles.profileImage} />
            )}
            {/* Display other user's profile information */}
            <Text>{otherUserProfile.username}</Text>
            {/* Add more profile information as needed */}
          </View>
        </TouchableOpacity>
      )}
      <GiftedChat
        messages={messages.slice().reverse()}
        onSend={(newMessages) => onSend(newMessages)}
        user={{
          _id: currentUser.uid,
        }}
        alwaysShowSend
        renderSend={(props) => (
          <CustomSend {...props} />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  profileContainer: {
    paddingTop: '10%',
    borderBottomWidth: 0.5,
    borderBottomColor: '#ccc',
    alignItems: 'center',
  },
  profileImage: {
    width: 70,
    height: 70,
    borderRadius: 100,
    marginBottom: 5,
  },
  sendContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  sendText: {
    color: '#007BFF', // Customize the color as needed
    fontWeight: 'bold',
  },
  sendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
    justifyContent: 'center',
  },
  sendimg: {
    width: 24,
    height: 24,
    marginBottom: 8,
    marginRight: 10,
    tintColor: '#00FFD8',
  },
  imgselect: {
    width: 24,
    height: 24,
    marginBottom: 8,
    marginRight: 10,
  },
});

export default PersonalChatScreen;
