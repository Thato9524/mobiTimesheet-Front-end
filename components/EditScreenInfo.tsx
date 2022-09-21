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
      
      <Text>
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
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightContainer: {
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  noinfoalert: {
    fontSize: 17,
    lineHeight: 24,
    textAlign: 'center',
    top:30
  },
  getStartedText: {
    fontSize: 17,
    lineHeight: 24,
    textAlign: 'center',
    
  },
  historyBox: {
    fontSize: 17,
    textAlign: 'center',
    borderWidth:2,
    top:"10%",
    height:"9%",
    
  },
  helpContainer: {
    marginTop: 15,
    marginHorizontal: 20,
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    textAlign: 'center',
  },
});
