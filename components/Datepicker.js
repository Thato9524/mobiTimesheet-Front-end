import React, { useState } from "react";

import {
  Button,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import DateTimePicker from "@react-native-community/datetimepicker";

export default function App() {
  const [datePicker, setDatePicker] = useState(false);
  const [endDatePicker, setEndDatePicker] = useState(false);

  const [date, setDate] = useState(new Date());
  const [Enddate, setEndDate] = useState(new Date());

  function showDatePicker() {
    setDatePicker(true);
  }
  function showEndDatePicker() {
    setEndDatePicker(true);
  }

  function onDateSelected(event, value) {
    setDate(value);
    setDatePicker(false);
  }
  function onEndDateSelected(event, value) {
    setEndDate(value);
    setEndDatePicker(false);
  }

  return (
    <View>
      <Text style={styleSheet.text}>Leave Dates:</Text>
      <View style={styleSheet.MainContainer}>
        {datePicker && (
          <DateTimePicker
            value={date}
            mode={"date"}
            display={Platform.OS === "ios" ? "spinner" : "default"}
            is24Hour={true}
            onChange={onDateSelected}
            style={styleSheet.datePicker}
          />
        )}

        {!datePicker && (
          <View style={styleSheet.startDate}>
            <Button
              title="Select start date"
              color="green"
              onPress={showDatePicker}
            />
          </View>
        )}

        {endDatePicker && (
          <DateTimePicker
            value={Enddate}
            mode={"date"}
            display={Platform.OS === "ios" ? "spinner" : "default"}
            is24Hour={true}
            onChange={onEndDateSelected}
            style={styleSheet.datePicker}
          />
        )}

        {!endDatePicker && (
          <View style={styleSheet.endDate}>
            <Button
              title="Select end date "
              color="#D6153F"
              onPress={showEndDatePicker}
            />
          </View>
        )}
      </View>
    </View>
  );
}

const styleSheet = StyleSheet.create({
  MainContainer: {
    ...Platform.select({
      ios: {
        flexDirection: "row",
        justifyContent: "space-evenly",
        padding: 6,
        alignItems: "center",
        backgroundColor: "#F7F7F7",
        bottom: "73%",
      },
      android: {
        flexDirection: "row",
        padding: 6,
        alignItems: "center",
        backgroundColor: "#F7F7F7",
        bottom: "45%",
      },
    }),
  },
  startDate: {
    margin: 1,
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 16,

    ...Platform.select({
      ios: {
        margin: 1,
        borderColor: "black",
        borderWidth: 1,
        borderRadius: 16,
      },
      android: {
        margin: 1,
        borderColor: "black",
        borderWidth: 1,
        borderRadius: 16,
      },
    }),
  },
  endDate: {
    margin: 1,
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 16,

    ...Platform.select({
      ios: {
        margin: 1,
        borderColor: "black",
        borderWidth: 1,
        borderRadius: 16,
      },
      android: {
        margin: 1,
        borderColor: "black",
        borderWidth: 1,
        borderRadius: 16,
      },
    }),
  },

  text: {
    ...Platform.select({
      ios: {
        fontSize: 12,
        color: "#D6153F",
        textAlign: "center",
        bottom: "340%",
      },
      android: {
        fontSize: 12,
        color: "#D6153F",
        textAlign: "center",
        bottom: "183%",
      },
    }),
  },

  datePicker: {
    ...Platform.select({
      ios: {
        justifyContent: "center",
        alignItems: "flex-start",
        width: "20%",
        height: "20%",
        display: "flex",
      },
      android: {
        justifyContent: "center",
        alignItems: "flex-start",
        width: "20%",
        height: "20%",
        display: "flex",
      },
    }),
  },
});
