import React, { useState } from "react";
import {
  Dimensions,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
} from "react-native";
import Modal from "react-native-modal";
import ActionSheet from "./ActionSheet";

const App = () => {
  const actionItems = [
    {
      id: 1,
      label: "Leave",
      onPress: () => {},
    },
    {
      id: 2,
      label: "Maternity",
      onPress: () => {},
    },
    {
      id: 3,
      label: "Study",
      onPress: () => {},
    },
    {
      id: 4,
      label: "family",
      onPress: () => {},
    },
  ];
  const [actionSheet, setActionSheet] = useState(false);
  const closeActionSheet = () => setActionSheet(false);
  return (
    <>
      <StatusBar barStyle="dark-content" />

      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => setActionSheet(true)}
      >
        <View style={styles.buttonStyle}>
          <Text style={styles.buttonText}>Select</Text>
        </View>
      </TouchableOpacity>
      <Modal
        isVisible={actionSheet}
        style={{
          margin: 0,
          justifyContent: "flex-end",
        }}
      >
        <ActionSheet actionItems={actionItems} onCancel={closeActionSheet} />
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    ...Platform.select({
      ios: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      },
      android: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      },
    }),
  },
  buttonStyle: {
    ...Platform.select({
      ios: {
        height: "30%",
        backgroundColor: "rgb(0,98,255)",
        width: Dimensions.get("window").width - 300,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 10,
        margin: 10,
        bottom: "60%",
      },
      android: {
        height: "30%",
        backgroundColor: "rgb(0,98,255)",
        width: Dimensions.get("window").width - 300,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 10,
        margin: 10,
        top: "50%",
      },
    }),
  },
  buttonText: {
    ...Platform.select({
      ios: {
        fontSize: 17,
        color: "rgb(255,255,255)",
      },
      android: {
        fontSize: 17,
        color: "rgb(255,255,255)",
      },
    }),
  },
});

export default App;
