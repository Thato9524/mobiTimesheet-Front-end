import React from 'react';
import { StyleSheet } from 'react-native';

import LeaveSubmission from "../components/LeaveSubmission";
import Datepicker from "../components/Datepicker";
import { Text, View } from '../components/Themed';

export default function SubmissionScreen() {
  return (
    <View style={styles.container}>
      
      <View >
        <LeaveSubmission/>
      </View>
      <View ><Text style={styles.title}>Leave Type:</Text></View>
      <View><Datepicker/></View>
    </View>
    
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 13,
    bottom:"1900%",
    color:"#f43f5e"
    
  },
  
});

