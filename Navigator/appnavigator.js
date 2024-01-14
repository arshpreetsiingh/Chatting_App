
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import userlist from '../src/screens/userlist';
import LoginScreen from '../components/Auth/login';
import RegisterScreen from '../components/Auth/regis';
import UserProfileScreen from '../src/screens/userprofile';
import Ionicons from 'react-native-vector-icons/Ionicons';
import EditProfileScreen from '../components/userprofile/editprofile';
import ChangePasswordScreen from '../components/userprofile/changepassword';
import list from '../src/screens/list';
// import PostApp from '../src/screens/post';
import Scanner from '../src/screens/scanner';
import news from '../src/screens/news';
// import Camera from '../src/screens/camera';
import check from '../components/Auth/check';
import personalchat from '../components/chat/personalchat';
import OtherUserProfileScreen from '../components/chat/otheruserprofile';
// import { createDrawerNavigator } from '@react-navigation/drawer';


const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="TabNavigator">
      <Stack.Screen name='Check' component={check}  options={{ headerShown: false }} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name='PersonalChat' component={personalchat} options={{ headerShown: false }} />
      <Stack.Screen name='TabNavigator' component={TabNavigator} options={{ headerShown: false }} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
      <Stack.Screen name='UserProfile' component={UserProfileScreen} />
      <Stack.Screen name='OtherUserProfile' component={OtherUserProfileScreen} options={{ headerShown: false }}/>

    </Stack.Navigator>
  );
};

export const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarLabelStyle: { marginBottom: 5, fontSize: 14, fontWeight: '700' },
        tabBarStyle: { marginBottom: 0, marginTop: 0 }, // Set marginTop to 0
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'UserProfile') {
            iconName = focused ? 'person' : 'person-outline';
          } else if (route.name === 'Userlist') {
            iconName = focused ? 'chatbubble' : 'chatbubble-outline';
          } else if (route.name === 'Camera') {
            iconName = focused ? 'camera' : 'camera-outline';
          } else if (route.name === 'List') {
            iconName = focused ? 'list' : 'list-outline';
          } else if (route.name === 'Post') {
            iconName = focused ? 'create' : 'create-outline';
          } else if (route.name === 'Scanner') {
            iconName = focused ? 'scan' : 'scan-outline';
          } else if (route.name === 'News') {
            iconName = focused ? 'newspaper' : 'newspaper-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
      })}
      initialRouteName='chat'
    >
      <Tab.Screen options={{ headerShown: false }} name='Userlist' component={userlist}></Tab.Screen>
      <Tab.Screen options={{ headerShown: false }} name='List' component={list}></Tab.Screen>
      {/* <Tab.Screen options={{ headerShown: false }} name='Camera' component={Camera}></Tab.Screen> */}
      {/* <Tab.Screen options={{ headerShown: false }} name='Post' component={PostApp}></Tab.Screen> */}
      <Tab.Screen options={{ headerShown: false }} name='Scanner' component={Scanner}></Tab.Screen>
      <Tab.Screen options={{ headerShown: false }} name='News' component={news}></Tab.Screen>
      <Tab.Screen options={{ headerShown: false }} name='UserProfile' component={UserProfileScreen}></Tab.Screen>
    </Tab.Navigator>
  );
};


export default AppNavigator;
