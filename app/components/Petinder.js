import React, { Component } from 'react';
import { connect } from 'react-redux'; 
import {
  AppRegistry,
  Text,
  View
} from 'react-native';

import Navbar from './Navbar';
import Pet from './Pet';
import Icons from './Icons';

class Petinder extends Component {
  constructor() {
    super(); 
    this.state = { display: true}
  }
  componentDidMount() { 
    this.checkRender(this.props.pet.pet_batch);
  }
  componentWillReceiveProps(nextProps) {
    this.checkRender(nextProps.pet.pet_batch); 
  }
  checkRender(pets_batch) {
    if (pets_batch.length < 1) {
      console.log("hide component")
      this.setState({
        display: false
      })
    } else {
      this.setState({
        display: true
      })
    }
  }
  render() {
    return (
      <View>
        <Navbar/>
        <Pet style={{display: this.state.display? '' : 'hidden'}}/>
        <Icons/>
      </View>
    );
  }
}

function mapStateToProps(state){
  return {
    pet: state.pet
  }
}

export default connect(mapStateToProps, null)(Petinder);
