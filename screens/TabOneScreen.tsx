import React from 'react';
import { Platform, Pressable, StyleSheet } from 'react-native';

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
        <Text style={{color:"#D6153F"}}> Timesheet History</Text>
      </View>
    <View style={styles.timesheetHistory}>
    <EditScreenInfo />
    </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...Platform.select({
      ios: {
        flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:'#F7F7F7',
      },
      android: {
        flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:'#F7F7F7',
      },
    })
  },
  title: {
    
    ...Platform.select({
      ios: {
        fontSize: 20,
        fontWeight: 'bold',
      },
      android: {
        fontSize: 20,
    fontWeight: 'bold',
      },
    })
    
  },
  separator: {

    marginVertical: 30,
    height: 3,
    width: '100%',
    margin:0,
    bottom: 200,
  },
  calander:{
    ...Platform.select({
      ios: {
        flex:1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:'#F7F7F7',
    bottom:"10%",
    marginBottom:"23%",
    height:"30%",
    borderWidth: 1,
      },
      android: {
    flex:1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:'#F7F7F7',
    bottom:"10%",
    marginBottom:"33%",
    height:"30%",
    borderWidth: 1,
    borderColor:"#f43f5e"
      },
    })
},
HistoryHeading:{
    
    ...Platform.select({
      ios: {
        borderRadius:10,
        alignItems: 'center',
        justifyContent: 'center',
        bottom:"21%",
        width: '30%',
        height:"4%",
        borderColor:"#D6153F",
        borderWidth: 1,
      },
      android: {
        borderRadius:10,
        alignItems: 'center',
        justifyContent: 'center',
        bottom:"21%",
        width: '35%',
        height:"5%",
        borderColor:"#D6153F",
        borderWidth: 1,
        backgroundColor:'#FAFAFA',
      },
      
    })
    
},
  timesheetHistory:{
   
    ...Platform.select({
      ios: {
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
        bottom:"20%",
        width: '90%',
        height:"30%",
        borderRadius:30,
        borderColor:"#D6153F",
        backgroundColor:'#F1EDEE',
      },
      android: {
        borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    bottom:"20%",
    width: '94%',
    height:"30%",
    borderRadius:30,
    borderColor:"#D6153F",
    backgroundColor:'#F1EDEE',
      },
      
    })
    
}
});
