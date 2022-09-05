/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import { FontAwesome, MaterialIcons,Feather,AntDesign} from '@expo/vector-icons';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import { ColorSchemeName, Pressable,Text,View } from 'react-native';

import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import ModalScreen from '../screens/ModalScreen';
import NotFoundScreen from '../screens/NotFoundScreen';
import TabOneScreen from '../screens/TabOneScreen';
import TabTwoScreen from '../screens/TabTwoScreen';
import LoginScreen from '../screens/LoginScreen';
import MoreScreen from '../screens/MoreScreen';
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
        <Stack.Screen name="Modal" component={ModalScreen} />
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

  return (
    <BottomTab.Navigator
    initialRouteName="Login"
    screenOptions={{
      tabBarStyle: {position: 'absolute',bottom: "6%", 
      left:"3%",right:"3%",elevation:0,backgroundColor:"#ffffff",borderRadius:15,height:"7%"},
      tabBarShowLabel: false

    }}
    >

      <BottomTab.Screen name='Login'component={LoginScreen}
        options={({ navigation }: RootTabScreenProps<'Login'>) => ({
          title: 'logout',
          tabBarIcon: ({ color }) => (
          <View style={{alignItems: 'center',flex:1}}>
          <Feather name="log-out" size={29} color="black" />
          <Text style={{fontSize:10,top:"20%"}}>Sign Out</Text>
          </View>
          ),
         
        })}/>
      <BottomTab.Screen name='Home'component={TabOneScreen}
       options={({ navigation }: RootTabScreenProps<'Home'>) => ({
        title: 'Home',
        tabBarIcon: ({ color }) => (
        <View style={{alignItems: 'center',flex:1}}>
        <AntDesign name="home" size={29} color="black" />
        <Text style={{fontSize:10,top:"20%"}}>Home</Text>
        </View>),
       
      })}/>
      <BottomTab.Screen name='Add'component={ModalScreen}
       options={({ navigation }: RootTabScreenProps<'Add'>) => ({
        title: 'Add Entry',
        tabBarIcon: ({ color }) => (
        <View style={{alignItems: 'center'}}>
        <AntDesign name="pluscircle" size={40} color="tomato" />
        <Text style={{fontSize:12,}}>Add Entry</Text>
        </View>),
      })}/>
      <BottomTab.Screen name='TabTwo'component={TabTwoScreen}
      options={({ navigation }: RootTabScreenProps<'TabTwo'>) => ({
        tabBarIcon: ({ color }) =>(
          <View style={{alignItems: 'center',flex:1}}>
          <Feather name="settings" size={29} color="black" />
          <Text style={{fontSize:10,top:"20%"}}>Settings</Text>
           </View>)
      })}/>
      <BottomTab.Screen name='More'component={MoreScreen}
      options={({ navigation }: RootTabScreenProps<'More'>) => ({
        title: 'More',
        tabBarIcon: ({ color }) => (
        <View style={{alignItems: 'center',flex:1}}>
        <MaterialIcons name="menu" size={30} color={Colors[colorScheme].text} />
        <Text style={{fontSize:10,top:"20%"}}>More</Text>
        </View>),
        

      })}/>

     </BottomTab.Navigator>
    //   initialRouteName="TabOne"
    //   screenOptions={{
    //     tabBarActiveTintColor: Colors[colorScheme].tint,
    //   }}>
    //   <BottomTab.Screen
    //     name="TabOne"
    //     component={TabOneScreen}
    //     options={({ navigation }: RootTabScreenProps<'TabOne'>) => ({
    //       title: 'Home',
    //       tabBarIcon: ({ color }) => <MaterialIcons name="menu" size={24} color={Colors[colorScheme].text} />,
    //       headerRight: () => (
    //         <Pressable
    //           onPress={() => navigation.navigate('Modal')}
    //           style={({ pressed }) => ({
    //             opacity: pressed ? 0.5 : 1,
    //           })}>
    //           <FontAwesome
    //             name="info-circle"
    //             size={27}
    //             color={Colors[colorScheme].text}
    //             style={{ marginRight: 15 }}
    //           />
    //         </Pressable>
    //       ),
    //       headerLeft: () => (
    //         <Pressable
    //           onPress={() => navigation.navigate('Modal')}
    //           style={({ pressed }) => ({
    //             opacity: pressed ? 0.5 : 1,
    //             left:10
    //           })}>
    //             <MaterialIcons name="menu" size={24} color={Colors[colorScheme].text}
    //             style={{ marginRight: 15 }} />
    //         </Pressable>
    //       ),
         
    //     })}
    //   />
    //   <BottomTab.Screen
    //     name="TabTwo"
    //     component={TabTwoScreen}
    //     options={{
    //       title: 'Tab Two',
    //       tabBarIcon: ({ color }) => <TabBarIcon name="retweet" color={color} />,
          
    //     }}
    //   />
    //   <BottomTab.Screen
    //     name="TabThree"
    //     component={ModalScreen}
    //     options={({ navigation }: RootTabScreenProps<'TabThree'>) => ({
    //       title: 'Add',
    //       tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
    //       addicon: () => (
    //         <Pressable
    //           onPress={() => navigation.navigate('Modal')}
    //           style={({ pressed }) => ({
    //             opacity: pressed ? 0.5 : 1,
    //           })}>
    //           <FontAwesome
    //             name="info-circle"
    //             size={25}
    //             color={Colors[colorScheme].text}
    //             style={{ marginRight: 15 }}
    //           />
    //         </Pressable>
    //       ),
    //     })}
    //   />
      
    // </BottomTab.Navigator>
  );
}

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
// function TabBarIcon(props: {
//   name: React.ComponentProps<typeof FontAwesome>['name'];
//   color: string;
// }) {
//   return <FontAwesome size={30} style={{ marginBottom: -3 }} {...props} />;
// }
// function createModalNavigator<T>() {
//   throw new Error('Function not implemented.');
// }

