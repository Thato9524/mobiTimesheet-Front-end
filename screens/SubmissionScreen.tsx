import React from 'react';
import { Platform, StyleSheet } from 'react-native';

import LeaveSubmission from "../components/LeaveSubmission";
import Datepicker from "../components/Datepicker";
import { Text, View } from '../components/Themed';
import DocumentPicker from '../components/DocumentPicker';

export default function SubmissionScreen() {
  return (
    <View style={styles.container}>
      
      <View >
        <LeaveSubmission/>
      </View>
      <View ><Text style={styles.title}>Leave Type:</Text></View>
      <View><Datepicker/></View>
      <View><DocumentPicker/></View>
    </View>
    
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:'#F7F7F7'
  },
  title: {
    
    ...Platform.select({
      ios: {
        fontSize: 13,
        bottom:"2200%",
        color:"#D6153F"
      },
      android: {
         fontSize: 13,
         bottom:"1150%",
         color:"#D6153F"
      },
    }),
    
  },
  
});

