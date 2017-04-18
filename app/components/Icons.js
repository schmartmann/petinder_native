import React, { Component } from 'react';
import { bindActionCreators } from 'redux'; 
import { connect } from 'react-redux'; 
import { nextPet } from '../actions/index'; 
import Icon from 'react-native-vector-icons/Foundation';
import {
  Text,
  View,
  Image,
  TouchableOpacity, 
  Linking, 
  StyleSheet
} from 'react-native';

class Icons extends Component {
  constructor() {
    super(); 
    this.fetchNext = this.fetchNext.bind(this); 
    this.likePet = this.likePet.bind(this); 
  }
  handleTransformLeft(swipe){
    console.log(swipe); 
    if (swipe && swipe.direction === "lat"  && swipe.change < 0) {
      return (
        [
          {scale: 1 + (swipe.change < 1? swipe.change = (swipe.change * -1)/200 : swipe.change/200)}
        ]
      )
    } else {
      return ([{scale: 1}])
    }
  }
  handleTransformRight(swipe){
    if (swipe && swipe.direction === "lat" && swipe.change > 0) {
      return (
        [
          {scale: 1 + (swipe.change < 1? swipe.change = (swipe.change * -1)/200 : swipe.change/200)}
        ]
      )
    } else {
      return ([{scale: 1}])
    }
  }
  handleTransformBottom(swipe){
    if (swipe && swipe.direction === "vert" && swipe.change > 0) {
      return (
        [
          {scale: 1 + swipe.change/200}
        ]
      ) 
     } else {
        return ([{scale: 1}])
    }
  }
  likePet() {
    const url = `https://www.petfinder.com/adoption-inquiry/${this.props.pet.current_pet.pet_id}`
    Linking.canOpenURL(url).then(supported => {
      if (supported) {

        Linking.openURL(url);
        this.fetchNext(); 
      } else {
       console.log('Don\'t know how to open URI: ' + url);
      }
    })
  }
  fetchNext() { 
    this.props.nextPet(this.props.pet)
  }
  render() {
    return(
      <View style={ styles.iconBar }>
        <TouchableOpacity 
          onPress={this.fetchNext}
        >
          <Icon name="no-dogs" size={90} color="red" style={[styles.iconItem, {transform: this.handleTransformLeft(this.props.swipe)}]}/>
        </TouchableOpacity>
        <TouchableOpacity>
          <Icon name="refresh" size={45} color="blue" style={[styles.iconItem, {transform: this.handleTransformBottom(this.props.swipe)}]}/>
       </TouchableOpacity>
        <TouchableOpacity
          onPress={this.likePet}>
          <Icon name="guide-dog" size={90} color="green" style={[styles.iconItem, {transform: this.handleTransformRight(this.props.swipe)}]}/>
        </TouchableOpacity>
      </View>
    )
  }
}
const styles = StyleSheet.create({
  iconBar: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center', 
    backgroundColor: 'transparent', 
    alignItems: 'center',
  },
  iconItem: {
    paddingLeft: '5%',
    paddingRight: '5%',
  }
})

function mapStateToProps(state){
  return {
    pet: state.pet
  }
}

function mapDispatchToProps(dispatch){
  return bindActionCreators({
    nextPet: nextPet
  }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Icons);
