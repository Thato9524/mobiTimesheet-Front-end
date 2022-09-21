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
      <View style={styles.HistoryHeading}>
        <Text style={{color:"#f43f5e"}}> Timesheet History</Text>
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
    marginBottom:"32%",
    
    
},
HistoryHeading:{
    borderRadius:10,
    alignItems: 'center',
    justifyContent: 'center',
    bottom:"21%",
    width: '30%',
    height:"4%",
    borderColor:"#f43f5e",
    borderWidth: 2,
    
    
},
  timesheetHistory:{
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    bottom:"20%",
    width: '100%',
    height:"30%",
    borderRadius:30,
    borderColor:"#f43f5e"
    
    
}
});
