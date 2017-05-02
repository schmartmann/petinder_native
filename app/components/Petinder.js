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
    this.checkFetch(this.props.pet.fetching);
  }
  componentWillReceiveProps(nextProps) {
    this.checkFetch(nextProps.pet.fetching); 
  }
  checkFetch(fetching) {
    if (fetching) {
      this.setState({
        fetching: true
      }) 
    } else {
      this.setState({
        fetching: false
      })
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
        <Pet
          fetchStatus={this.state.fetching}
          updateSwipePosition={this.updateSwipePosition.bind(this)}
        />
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
