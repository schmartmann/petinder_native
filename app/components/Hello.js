import React, { Component } from 'react';
import {
  AppRegistry,
  Text
} from 'react-native';

export default class Hello extends Component {
  render() {
    return (
        <Text>
          I think this is working!
          woah woah woah fuck-o
        </Text>
    );
  }
}

AppRegistry.registerComponent('Hello', () => Hello);
