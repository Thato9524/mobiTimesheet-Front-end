import React from "react";
//import react in our code.
import { Text, View, StyleSheet } from "react-native";
import SwitchSelector from "react-native-switch-selector";

const options = [
  { label: "01:00", value: "1" },
  { label: "01:30", value: "1.5" },
  { label: "02:00", value: "2" },
];
//import all the components we are going to use.
export default class App extends React.Component {
  //Initial state false for the switch. You can change it to true just to see.
  state = { switchValue: false };
  toggleSwitch = (value) => {
    //onValueChange of the switch this function will be called
    this.setState({ switchValue: value });
    //state changes according to switch
    //which will result in re-render the text
  };
  render() {
    return (
      <View style={styles.container}>
        <SwitchSelector
          initial={0}
          style={{ width: 115, height: "40%", left: "10%" }}
          onPress={(value) => console.log(this.setState({ value }))}
          textColor="#f43f5e"
          selectedColor="#f43f5e"
          buttonColor="#f43f5e"
          borderColor="#f43f5e"
          hasPadding
          options={[
            {
              label: "On",
              value: "On",
              imageIcon: require("../assets/switcher.svg"),
            }, //images.feminino = require('./path_to/assets/img/feminino.png')
            {
              label: "Off",
              value: "Off",
              imageIcon: require("../assets/switcher.svg"),
            }, //images.masculino = require('./path_to/assets/img/masculino.png')
          ]}
        />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
