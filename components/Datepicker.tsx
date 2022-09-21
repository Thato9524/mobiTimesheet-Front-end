
import React, { useState } from 'react';
import { Platform, View, Button,Text ,StyleSheet} from 'react-native';
import DatePicker from 'react-native-datepicker';

export default function DatePickerComponent () {
    const [date, setDate] = useState('21-9-2022');
    const [Enddate, setEndDate] = useState('22-9-2022');

    return (
      
        <View style={styles.container}>
          <Text style={styles.title}>
            Select leave start date :
          </Text>
          <DatePicker
            style={styles.datePickerStyle}
            date={date} //initial date from state
            mode="date" //The enum of date, datetime and time
            placeholder="select date"
            format="DD-MM-YYYY"
            minDate="01-01-2016"
            maxDate="01-01-2060"
            confirmBtnText="Confirm"
            cancelBtnText="Cancel"
            customStyles={{
              dateIcon: {
                //display: 'none',
                position: 'absolute',
                left: 0,
                top: 4,
                marginLeft: 0,
              },
              dateInput: {
                marginLeft: 36,
              },
            }}
            onDateChange={(date) => {
              setDate(date);
            }}
          />
          <Text style={styles.title}>
            Select leave end date :
          </Text>
          <DatePicker
            style={styles.datePickerStyle}
            date={Enddate} //initial date from state
            mode="date" //The enum of date, datetime and time
            placeholder="select date"
            format="DD-MM-YYYY"
            minDate="01-01-2016"
            maxDate="01-01-2060"
            confirmBtnText="Confirm"
            cancelBtnText="Cancel"
            customStyles={{
              dateIcon: {
                //display: 'none',
                position: 'absolute',
                left: 0,
                top: 4,
                marginLeft: 0,
              },
              dateInput: {
                marginLeft: 36,
              },
            }}
            onDateChange={(Enddate) => {
              setEndDate(Enddate);
            }}
          />
        </View>
    );
  };

  const styles = StyleSheet.create({
    container: {
      
      justifyContent: 'space-evenly',
      flexDirection: 'row',
      
      bottom:"40%"

    },
    title: {
      textAlign: 'center',
      fontSize: 13,
      fontWeight: 'bold',
      left:"130%",
      bottom:"5%",
      color:"#f43f5e"
      
    },
    datePickerStyle: {
      width: "29%",
      marginTop: 1,
      right:"210%"
    },
  });