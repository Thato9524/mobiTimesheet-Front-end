import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import { StyleSheet, TouchableOpacity ,FlatList} from 'react-native';

import Colors from '../constants/Colors';
import { MonoText } from './StyledText';
import { Text, View } from './Themed';
import TimesheetHistory from './TImesheethistory';



export default function EditScreenInfo() {

  return (
    <View >
      
      <Text style={styles.text}>
         No Entries
        </Text>  
      
    </View>
  );
}

// function handleHelpPress() {
//   WebBrowser.openBrowserAsync(
//     'https://docs.expo.io/get-started/create-a-new-app/#opening-the-app-on-your-phonetablet'
//   );
// }

const styles = StyleSheet.create({
 
  
  text: {
    backgroundColor:"#F1EDEE"
  },
});
