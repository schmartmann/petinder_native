import React, { Component } from 'react';
import {
  Text,
  View,
  Image,
  StyleSheet
} from 'react-native';

export default class Icons extends Component {
  render() {
    return(
      <View style={ styles.iconBar }>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  iconBar: {
    height: 5,
    width: 100,
  },
  icon: {
    top: 30,
    left: 100,
    right: 100,
    bottom: 0,
    height: 55,
    width: 200,
  }
})
