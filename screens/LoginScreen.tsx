import React from 'react';
import { Pressable, StyleSheet } from 'react-native';

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types';
import Calendar from '../components/Calander';
import { FontAwesome } from '@expo/vector-icons';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import useColorScheme from '../hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons';

export default function Login({ navigation }: RootTabScreenProps<'Login'>) {
  const colorScheme = useColorScheme();
  
  return (
    <View style={styles.container}>
      
      <Pressable onPress={() => navigation.navigate('Home')} >
      <Text style={{fontSize:10,top:"20%",color:"white"}}> Sign in</Text>
      </Pressable>
    
    </View>
   
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:'black',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    
  },
  separator: {

    marginVertical: 30,
    height: 3,
    width: '100%',
    margin:0,
    bottom: 200,
  },
  calander:{
    flex:1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:'black',
    bottom:90,
    marginBottom:90,
    
},
  timesheetHistory:{
    
    alignItems: 'center',
    justifyContent: 'center',
    bottom:"35%",
    width: '100%',
    
    
}
});
