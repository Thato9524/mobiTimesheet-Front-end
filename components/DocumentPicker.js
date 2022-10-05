// Example of File Picker in React Native
// https://aboutreact.com/file-picker-in-react-native/
// Import React
import React, { useState } from "react";
// Import required components
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  Button,
} from "react-native";

// Import Document Picker
import * as DocumentPicker from "expo-document-picker";

const UploadFile = () => {
  const pickDocument = async () => {
    let result = await DocumentPicker.getDocumentAsync({});
    console.log(result.uri);
    console.log(result.name);
  };

  return (
    <View style={styles.background}>
      <Text style={styles.file}> Documents:</Text>
      <View style={styles.button}>
        <TouchableOpacity>
          <Button
            title="upload your file"
            color="#F7F7F7"
            onPress={pickDocument}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    ...Platform.select({
      ios: {
        backgroundColor: "#F7F7F7",
      },
      android: {
        backgroundColor: "#F7F7F7",
      },
    }),
  },
  file: {
    ...Platform.select({
      ios: {
        color: "#D6153F",
        fontSize: 12,
        textAlign: "center",
        bottom: "370%",
      },
      android: {
        color: "#D6153F",
        fontSize: 12,
        textAlign: "center",
        bottom: "250%",
      },
    }),
  },
  button: {
    bottom: "230%",
    ...Platform.select({
      ios: {
        bottom: "350%",
        borderRadius: 17,
        borderColor: "black",
        borderWidth: 1,
        backgroundColor: "#D6153F",
      },
      android: {
        bottom: "230%",
      },
    }),
  },
});

export default UploadFile;
