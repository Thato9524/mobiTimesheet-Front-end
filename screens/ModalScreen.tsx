import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Button, Platform, Pressable, StyleSheet,TextInput } from 'react-native';

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';

export default function ModalScreen() {
  const [text, onChangeText] = React.useState("Useless Text");
  const [number, onChangeNumber] = React.useState("0");
  return (
    <View style={styles.container}>
      
      <Text style={styles.text}>Work Description</Text>
      <TextInput
        style={styles.input}
        onChangeText={onChangeText}
        value={text}
        placeholder="work done today"
        keyboardType="default"
        blurOnSubmit={true}
        
      />
      <Text style={styles.text}>total hours</Text>
      <TextInput
        style={styles.input}
        onChangeText={onChangeNumber}
        value={number}
        placeholder="number of hours worked"
        keyboardType="numeric"
        blurOnSubmit={true}
      />

      <View>
      <Pressable onPress={()=> alert('Submitted Succesfully')} style={styles.button}><Text>Submit</Text></Pressable>
      </View>
      

      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
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
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  input: {
    height: "6%",
    margin: 12,
    borderWidth: 1,
    padding: 10,
    borderRadius: 9,
    bottom:"10%",
    
  },
  text: {
    bottom:"10%"
  },
  button: {
      top:"10%",
  }
});
