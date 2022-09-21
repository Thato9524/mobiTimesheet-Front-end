import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Button, Platform, Pressable, StyleSheet,TextInput } from 'react-native';
import { Text, View } from '../components/Themed';
import SelectList from 'react-native-dropdown-select-list'
import { FontAwesome } from '@expo/vector-icons';
import DropDownPicker from 'react-native-dropdown-picker';


export default function LeaveSubmission(){

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    {label: 'Sick', value: 'sick'},
    {label: 'Paid', value: 'paid'},
    {label: 'Maternity', value: 'maternity'},
    {label: 'Study', value: 'study'},
    {label: 'Family', value: 'family'},
  ]);

  return (
    <DropDownPicker
    style={{
      borderColor:"black",
    }}
    textStyle={{
      color: "black"
    }}
    containerStyle={{
      
      width: "42%",
      bottom: "455%",
     
    }}
      open={open}
      value={value}
      items={items}
      setOpen={setOpen}
      setValue={setValue}
      setItems={setItems}
    />
    
    
  );

};

const styles = StyleSheet.create({
  DropDown: {
    alignItems: 'center',
    justifyContent: 'center',
  }
});