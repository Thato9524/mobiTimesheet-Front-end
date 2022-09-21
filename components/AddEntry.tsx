import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Button, Platform, Pressable, StyleSheet,TextInput } from 'react-native';

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';

export default function AddEntry() {
  const [text, onChangeText] = React.useState("");
  const [number, onChangeNumber] = React.useState("");
  return (
    <View style={styles.container}>
    
    <View style={styles.RecomendedHours}>
      <Text >Overall Hours: 0 </Text>
      </View>
      <View style={styles.TotalHours}>
      <Text >Recomended Hours: 176 </Text>
      </View>
      <Text style={styles.text}>Work Description</Text>
      <TextInput
        style={styles.input}
        onChangeText={onChangeText}
        value={text}
        placeholder="work done today"
        keyboardType="default"
        blurOnSubmit={true}
        
      />
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <Text style={styles.text}>Total Hours Worked:</Text>
      <TextInput
        style={styles.input}
        onChangeText={onChangeNumber}
        value={number}
        placeholder="0"
        keyboardType="numeric"
        blurOnSubmit={true}
      />
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />

      <View style={styles.SubmittButton}>
      <Pressable onPress={()=> alert('Submitted Succesfully')} style={styles.button}><Text style={styles.SubmitText}>Submit</Text></Pressable>
      </View>
      
      <View >
      <Text style={styles.NoteText}>Take note that past and current daily enteries are not editable after current monthly coompleted timesheet is submitted.</Text>
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
    height: "0.2%",
    width: '200%',
    bottom:"14%"
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
    bottom:"10%",
    color: '#f43f5e'
    
  },
  SubmitText: {
    color: 'white'
  },
  RecomendedHours: {
    color: 'black',
    left:"18%",
    bottom:"18.7%",
    borderRadius:5,
    borderWidth: 1,
    backgroundColor: "#CFDAC0"
    
    
  },
  TotalHours: {
    color: 'black',
    right:"19%",
    bottom:"21%",
    borderRadius:5,
    borderWidth: 1,
    
    backgroundColor: "#E68D99"
  },
  NoteText: {
    color: 'black',
    fontWeight:"bold",
    fontSize:12

  },
  button: {
      top:"25%",
      
      
  },
  SubmittButton: {
      borderRadius:15,
      backgroundColor:"#f43f5e",
      width: "30%",
      height: "5%",
      borderWidth: 2,
      alignItems: 'center',
      fontWeight: 'bold',
      bottom: "10%"
      
  }
});