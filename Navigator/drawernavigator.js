import 'react-native-gesture-handler';

import { createDrawerNavigator } from '@react-navigation/drawer';
import EditProfileScreen from '../components/userprofile/editprofile';


const drawer = createDrawerNavigator();


export default function DrawerNavigator()
{
    <drawer.Navigator>
        <drawer.Screen name='Edit profile' component={EditProfileScreen}/>
    </drawer.Navigator>
}