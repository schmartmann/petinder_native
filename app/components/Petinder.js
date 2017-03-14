import React, { Component } from 'react';
import {
  AppRegistry,
  Text,
  View
} from 'react-native';

// import Navbar from './Navbar';
import Pet from './Pet';
// import Icons from './Icons';

export default class Petinder extends Component {
  render() {
    return (
      <View>
        {/* <Navbar/> */}
        <View>
          <Pet/>
        </View>
        <View>
          {/* <Icons/> */}
        </View>
      </View>
    );
  }
}
