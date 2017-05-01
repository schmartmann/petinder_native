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
import Loader from './Loader'; 

class Petinder extends Component {
  constructor() {
    super(); 
    this.state = { 
      fetching: true,
      swipePosition:{direction:'', change:0} 
    }
  }
  componentDidMount() { 
    this.checkRender(this.props.pet.fetching);
  }
  componentWillReceiveProps(nextProps) {
    this.checkRender(nextProps.pet.fetching); 
  }
  checkRender(fetching) {
    // console.log("check render method", fetching);
    if (fetching) {
      return(
        <Loader/>
      )
    } else {
      return(
        <Pet 
          updateSwipePosition={this.updateSwipePosition.bind(this)}
        />
      )
    }
  }
  updateSwipePosition(position){
    this.setState({
      swipePosition: position
    })
  }
  render() {
    return (
      <View style={{flex: 1}}>
        <Navbar/>
        { this.checkRender() }
        <Icons swipe={this.state.swipePosition}/>
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
