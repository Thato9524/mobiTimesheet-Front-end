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

export default function TabOneScreen({ navigation }: RootTabScreenProps<'Home'>) {
  const colorScheme = useColorScheme();
  return (
    <View style={styles.container}>
      <View style={styles.calander}>
      < Calendar someDefaultValue={''}/>
      </View>
    <View style={styles.timesheetHistory}>
    <EditScreenInfo />
    </View>
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
    marginBottom:"65%",
    
},
  timesheetHistory:{
    borderWidth: 14,
    alignItems: 'center',
    justifyContent: 'center',
    bottom:"45%",
    width: '100%',
    
    
}
});
