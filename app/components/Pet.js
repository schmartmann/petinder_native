import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { fetchMyPet, getPets, nextPet } from '../actions/index';
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
  let dragDirection = 0;

  if (draggedLeft || draggedRight) {
    dragDirection = dx
  };

  if (dragDirection) return dragDirection;
}

class Pet extends Component {
  constructor(props){
    super(props);
    this.state = {
      truncateDesc: true,
      position: 0,
    };
    this.onPress = this.onPress.bind(this);
  };
  onPress() {
    //some kind of animation here on the pet card
  }
  componentWillMount() {
    this._panResponder = PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => !!dragDirection(gestureState),
      onPanResponderMove: (evt, gestureState) => {
        const drag = dragDirection(gestureState);
        //drag returns the position change 
        this.setState({
          position: drag
        })
        this.detectCollision(drag)
      }
    });
  }
  componentDidMount() {
    let offset = this.props.pet.offset;
    this.props.fetchMyPet(offset);
  }
  calcRotate(pos) {
    console.log(pos)
  }
  detectCollision(position) {
    const rightWidth = (Dimensions.get('window').width)/2;
    const leftWidth = 0 - rightWidth;  
    position? position : 0;
    if ( (position >= (rightWidth/1.3)) || (position <= (leftWidth/1.3)) ){
      console.log("collision")
      this.fetchNext();
    }
  }
  fetchNext() {
    this.setState({
      position: 0      
    })
  }
  render(){
    return(
      <View style={ [styles.petCard, {left: this.state.position}, {transform: this.calcRotate(this.state.position)}] } {...this._panResponder.panHandlers}>
        <Image
          style={ styles.petImage }
          source={{uri: this.props.pet.current_pet.photo[0]}}
          />
        <Text style={ styles.petName }>
            { this.props.pet.current_pet.name.toUpperCase() }
        </Text>
        <Text style={ styles.petLocation }>
          { `${this.props.pet.current_pet.city.toUpperCase() }${this.props.pet.current_pet.city? ',' : ''} ${ this.props.pet.current_pet.state.toUpperCase() }`}
        </Text>
        <Text style={ styles.centerText }>
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
    height: '75%',
    borderStyle: 'solid',
    borderColor: 'lightgrey',
    borderWidth: 1,
    borderRadius: 15 ,
    shadowColor: 'darkslategrey', 
    // shadowOffset: {'width': 10, 'height': 100}
  },
  petName: {
    textAlign: 'left',
    fontSize: 20,
    fontWeight: 'bold', 
    position: 'relative', 
    top: '-0.25%', 
    left: '12%',
    backgroundColor: 'transparent', 
    color: "white", 
  },
  petLocation: {
    position: 'relative', 
    top: '-4%', 
    right: '12%', 
    textAlign: 'right',
    backgroundColor: 'transparent', 
    color: "white", 
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
})


function mapStateToProps(state){
  return {
    pet: state.pet
  }
}

function mapDispatchToProps(dispatch){
  return bindActionCreators({
    fetchMyPet: fetchMyPet,
    getPets: getPets,
    nextPet: nextPet
  }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Pet);
