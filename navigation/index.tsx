/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import { FontAwesome, MaterialIcons,Feather,AntDesign,Entypo,MaterialCommunityIcons,EvilIcons,Ionicons} from '@expo/vector-icons';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, DefaultTheme, DarkTheme, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import { ColorSchemeName, Pressable,Text,View,Alert } from 'react-native';

import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import ModalScreen from '../screens/ModalScreen';
import NotFoundScreen from '../screens/NotFoundScreen';
import TabOneScreen from '../screens/TabOneScreen';
import TabTwoScreen from '../screens/TabTwoScreen';
import LoginScreen from '../screens/LoginScreen';
import SubmissionScreen from '../screens/SubmissionScreen';
import { RootStackParamList, RootTabParamList, RootTabScreenProps } from '../types';
import LinkingConfiguration from './LinkingConfiguration';

export default function Navigation({ colorScheme }: { colorScheme: ColorSchemeName }) {
  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <RootNavigator />
    </NavigationContainer>
  );
}

/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */
const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Root" component={BottomTabNavigator} options={{ headerShown: false }} />
      <Stack.Screen name="NotFound" component={NotFoundScreen} options={{ title: 'Oops!' }} />
      <Stack.Group screenOptions={{ presentation: 'modal' }}>
        <Stack.Screen name="AddEntry" component={ModalScreen} />
        <Stack.Screen name="Submissions" component={SubmissionScreen} />
        <Stack.Screen name="settings" component={TabTwoScreen} />
      </Stack.Group>
    </Stack.Navigator>
  );
}

/**
 * A bottom tab navigator displays tab buttons on the bottom of the display to switch screens.
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */
const BottomTab = createBottomTabNavigator<RootTabParamList>();


function BottomTabNavigator() {
  const colorScheme = useColorScheme();
  const navigation = useNavigation();
  const createTwoButtonAlert = () =>
      Alert.alert(
        "Sign Out",
        "Do you wish to sign out?",
        [
          {
            text: "Cancel",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel"
          },
          { text: "Yes", onPress: () =>  navigation.navigate('Login')}
        ]
      );
  

  return (
    <BottomTab.Navigator
    initialRouteName="Home"
    screenOptions={{
      tabBarStyle: {position: 'absolute',bottom: "6%", 
      left:"3%",right:"3%",elevation:0,backgroundColor:"#ffffff",borderRadius:15,height:"7%",borderWidth:1,borderTopColor:"black",borderTopWidth:1},
      tabBarShowLabel: false

    }}
    >

      <BottomTab.Screen name='Login'component={LoginScreen}
        options={() => ({
          tabBarStyle: {
            display: "none"
          },
          title: 'login',
          tabBarIcon: ({ color }) => (
          <View style={{alignItems: 'center',flex:1}}>
          <Pressable onPress={() => createTwoButtonAlert()}>
          <Feather name="log-out" size={29} color="black" />
          </Pressable>
          <Text style={{fontSize:12,top:"20%"}}>Sign Out</Text>
          </View>
          ),
         
        })}/>
      <BottomTab.Screen name='Home'component={TabOneScreen}
       options={({ navigation }: RootTabScreenProps<'Home'>) => ({
        title: 'Home',
        tabBarIcon: ({ color }) => (
        <View style={{alignItems: 'center',flex:1}}>
        <AntDesign name="home" size={29} color="black" />
        <Text style={{fontSize:12,top:"22%"}}>Home</Text>
        </View>),
       
      })}/>
      <BottomTab.Screen name='Add'component={ModalScreen}
       options={({ navigation }: RootTabScreenProps<'Add'>) => ({
        tabBarIcon: ({ color }) => (
        <View style={{alignItems: 'center',bottom:"50%", backgroundColor: '#f43f5e',borderRadius:30,borderWidth:2}}>
        <Pressable
        onPress={() => navigation.navigate('AddEntry')}>
       <FontAwesome style={{top:"6%" ,left:"17%"}} name="plus-square" size={35} color="black"  />
        <Text style={{fontSize:12,top:"25%"}}>Add Entry</Text>
       </Pressable>
        </View>),
      })}/>
        <BottomTab.Screen name='Submission'component={SubmissionScreen}
        options={({ navigation }: RootTabScreenProps<'Submission'>) => ({
          tabBarIcon: ({ color }) => (
          <View style={{alignItems: 'center',flex:1}}>
            <Pressable 
            onPress={() => navigation.navigate('Submissions')}>
          <Ionicons style={{top:"6%" ,right:"1%"}} name="document-attach-outline" size={30} color="black" />
          <Text style={{fontSize:12,top:"10%"}}>Leave</Text>
          </Pressable>
          </View>),
          
  
        })}/>
      <BottomTab.Screen name='TabTwo'component={TabTwoScreen}
      options={({ navigation }: RootTabScreenProps<'TabTwo'>) => ({
        tabBarIcon: ({ color }) =>(
          <View style={{alignItems: 'center',flex:1}}>
            <Pressable
             onPress={() => navigation.navigate('settings')}>
          <Feather  style={{top:"10%",left:"7%" }} name="settings" size={27} color="black"  />
          <Text style={{fontSize:12,top:"20%"}}>Settings</Text>
          </Pressable>
           </View>
           )
      })}/>

     </BottomTab.Navigator>
  );
}



