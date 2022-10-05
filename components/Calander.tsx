import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View
} from 'react-native';
import CalendarPicker from 'react-native-calendar-picker';

interface IMyComponentProps {
    someDefaultValue: string
}


export default class App extends React.Component<IMyComponentProps, any>  {
   
    constructor(props:IMyComponentProps){
    super(props);
    this.state = {
      selectedStartDate: new Date(),
     
    };
    this.onDateChange = this.onDateChange.bind(this);
  }

  onDateChange(date: any) {
    this.setState({
      selectedStartDate: date,
    });
  }
  render() {
    const { selectedStartDate, } = this.state;
    const startDate = selectedStartDate ? selectedStartDate.toString() : '';
  
    
    return (
      <View style={styles.container}>
        <CalendarPicker 
        selectedDayColor="#D6153F"
        height= {350}
         disabledDates={ [this.state.selected]}
          onDateChange={this.onDateChange}
        />
        


        {/* <View>
          <Text>SELECTED DATE:{ startDate }</Text>
        </View> */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    marginTop: 100,
    borderColor:"#D6153F",
    borderWidth: 0.5,
    
  },
});