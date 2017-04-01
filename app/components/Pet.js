import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { fetchMyPet, getPets } from '../actions/index';
import { connect } from 'react-redux';
import {
  PanResponder,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
  AppRegistry } from 'react-native';

const { width, height } = Dimensions.get('window');


const dragDirection = ({ moveX, moveY, dx, dy}) => {
  const draggedLeft = dx < -30;
  const draggedRight = dx > 30;
  let dragDirection = '';
  console.log(draggedLeft, draggedRight);
}

class Pet extends Component {
  constructor(props){
    super(props);
    this.state = {
      truncateDesc: true,
      zone: "Still touchable"
    };
    this.onPress = this.onPress.bind(this);
  };
  onPress() {
    this.setState({
      zone: "I got touched with a parent pan responder -- and not by my priest. Better luck next time, Catholic church."
    })
  }
  componentWillMount() {
    this._panResponder = PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => !!dragDirection(gestureState),
      onPanResponderMove: (evt, gestureState) => {
        const drag = getDirectionAndColor(gestureState);
        this.setState({
          zone: drag,
        })
      }
    });
  }
  componentDidMount() {
    let offset = this.props.pet.offset;
    this.props.fetchMyPet(offset);
  }
  render(){
    return(
      <View style={ styles.petCard } {...this._panResponder.panHandlers}>
        <TouchableOpacity onPress={ this.onPress }>
          <Text>
            { this.state.zone }
          </Text>
        </TouchableOpacity>
          <Image
            style={ styles.petImage }
            source={{uri: this.props.pet.current_pet.photo[0]}}
            />
        <Text style={ styles.petName }>
            { this.props.pet.current_pet.name.toUpperCase() }
        </Text>
        <Text style={ [styles.centerText, styles.zone1] }>
          { `${this.props.pet.current_pet.city } ${this.props.pet.current_pet.city? ',' : ''} ${ this.props.pet.current_pet.state }`}
        </Text>
        <Text style={ [styles.centerText, styles.zone2] }>
            { this.props.pet.current_pet.description }
        </Text>
        <Text style={ styles.centerText }>
          View Profile
          {/* <a href={this.props.pet.current_pet.link}>View Profile</a> */}
        </Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  petCard: {
    position: 'relative',
    marginTop: 100,
    marginLeft: '5%',
    marginRight: '5%',
    width: '90%',
    height: '70%',
    borderStyle: 'solid',
    borderColor: 'lightgrey',
    borderWidth: 1,
    borderRadius: 15
  },
  petName: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold'
  },
  petImage: {
    width: '80%',
    height: '60%',
    left: '10%',
    top: '5%'
  },
  centerText: {
    textAlign: 'center',
    marginTop: 10
  },
  zone1 : {
    // backgroundColor: 'red'
  },
  zone2 : {
    // backgroundColor: 'blue'
  }
})


function mapStateToProps(state){
  return {
    pet: state.pet
  }
}

function mapDispatchToProps(dispatch){
  return bindActionCreators({
    fetchMyPet: fetchMyPet,
    getPets: getPets
  }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Pet);
