import React from 'react';
import { StyleSheet } from 'react-native';
import Setting from '../components/Setting';


import { Text, View } from '../components/Themed';

export default function TabTwoScreen() {
  return (
    <View style={styles.container}>
      <View >
        <Setting style={styles.Notifications}/>
        <Setting style={styles.DarkMode}/>
      </View>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  Notifications: {
    
    top:"30%"
  },
  DarkMode: {
    bottom:"10%",left:"10%"
    
  },

});
