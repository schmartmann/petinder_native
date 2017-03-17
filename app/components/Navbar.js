import React, { Component } from 'react';
import {
  Text,
  View,
  Image,
  StyleSheet
} from 'react-native';

export default class Navbar extends Component {
  render() {
    return (
      <View style={ styles.navBar }>
        <Image
          style={ styles.pawIcon }
          source={require('../public/icons/logo.png')}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  navBar: {
    height: 5,
    width: 100,
  },
  pawIcon: {
    top: 30,
    left: 100,
    right: 100,
    bottom: 0,
    height: 55,
    width: 200,
  }
})
