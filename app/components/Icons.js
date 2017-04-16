import React, { Component } from 'react';
import Icon from 'react-native-vector-icons/Foundation';
import {
  Text,
  View,
  Image,
  StyleSheet
} from 'react-native';

export default class Icons extends Component {
  constructor(){
    super();
    this.state = {
      iconSize: 30
    };
  }
  render() {
    return(
      <View style={ styles.iconBar }>
        <Icon name="guide-dog" size={90} color="green"/>
        <Icon name="no-dogs" size={90} color="red"/>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  iconBar: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around', 
    backgroundColor: 'transparent', 
  },
})
