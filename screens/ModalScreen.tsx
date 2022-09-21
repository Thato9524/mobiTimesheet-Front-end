import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Button, Platform, Pressable, StyleSheet,TextInput } from 'react-native';

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import AddEntry from '../components/AddEntry';

export default function ModalScreen() {
  const [text, onChangeText] = React.useState("Useless Text");
  const [number, onChangeNumber] = React.useState("0");
  return (
    <View style={styles.container}>
      <View>
     <AddEntry/>
     </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  }
});
