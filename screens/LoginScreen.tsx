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
      <View style={styles.calander}>
      < Calendar someDefaultValue={''}/>
      </View>
     
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
     
    <View style={styles.timesheetHistory}>
    <EditScreenInfo />
    </View>
    {/* <View >
    
    <Pressable
              
              onPress={() => navigation.navigate('Modal')}
              style={({ pressed }) => ({
                width:20,
                opacity: pressed ? 0.5 : 1,
                top:16
              })}>
                <View style={{ width: 54 }}>
                <Ionicons name="add-circle-outline" size={54} color="black" />
                </View>
              {/* <FontAwesome
                name="plus-circle"
                size={55}
                color={Colors[colorScheme].text}
                style={{ margin:1 }}
                
              /> */}
            {/* </Pressable>
    </View> */} 
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
