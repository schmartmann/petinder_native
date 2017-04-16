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
  TouchableHighlight,
  Image,
  Dimensions,
  Modal,
  AppRegistry } from 'react-native';

const { width } = Dimensions.get('window');
const rightWidth = width/2;
const leftWidth = 0 - rightWidth;  

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
      position: 0,
      modalVisible: false
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
      }, 
      onPanResponderRelease: (evt, gestureState) => {
        this.handleRelease(this.state.position)
      }
    });
  }
  componentDidMount() {
    let offset = this.props.pet.offset;
    this.props.fetchMyPet(offset);
  }
  setModalVisible(visible) { 
    this.setState({
      modalVisible: visible
    })
  }
  handleTransform(pos) {
    if (pos) {
      return (
        [
          {rotate: `${pos/10}deg`}, 
          // {scale: 1 + (pos < 1? pos = (pos * -1)/200 : pos/200)}
        ]
      )
    } else {
      return ([{rotate: "0deg"}])
    }
  }
  detectCollision(position) {
    position? position : 0;
    var collision;
    if ( (position >= (rightWidth/1.2)) || (position <= (leftWidth/1.2)) ){
      collision = true
    } else {
      collision = false
    }
    return collision
  }
  handleRelease(position) {
    var collision = this.detectCollision(position); 
    console.log(collision); 
    if (collision) {
      this.fetchNext(); 
    } else {
      this.setState({
        position: 0
      })
    }
  }
  fetchNext() {
    this.props.nextPet(this.props.pet)
    this.setState({
      position: 0
    })
  }
  render(){
    return(
      <View style={ [styles.petCard, {left: this.state.position}, {transform: this.handleTransform(this.state.position)}] } {...this._panResponder.panHandlers}>
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
          <TouchableHighlight onPress={ () => { this.setModalVisible(true)} }>
            <Text 
              style={ [styles.centerText, styles.description]} 
              numberOfLines={4} 
              ellipsizeMode="tail"
            >
            { this.props.pet.current_pet.description }
            </Text>
          </TouchableHighlight>
        <Text style={ styles.centerText }>
          View Profile
          {/* <a href={this.props.pet.current_pet.link}>View Profile</a> */}
        </Text>
        <View style={{marginTop: 22}}>
          <Modal
            animationType={"slide"}
            transparent={false}
            visible={this.state.modalVisible}
            onRequestClose={() => {alert("Modal closed")}}>
            <View style={{marginTop: 22}}>
              <View> 
                <Text>{ this.props.pet.current_pet.name }'s Profile:</Text>
                <Text>
                  { this.props.pet.current_pet.description }
                </Text>
                <TouchableHighlight onPress={ () => {
                  this.setModalVisible(!this.state.modalVisible)}}>
                  <Text>Back</Text>
                </TouchableHighlight>
              </View>
            </View>
          </Modal>
        </View>
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
    shadowOpacity: 1,
    shadowOffset: {'width': 2, 'height': 2}
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
    textShadowColor: "darkslategrey", 
    textShadowOffset: {'width': 2, 'height': 2}
  },
  petLocation: {
    position: 'relative', 
    top: '-4%', 
    right: '12%', 
    textAlign: 'right',
    backgroundColor: 'transparent', 
    color: "white", 
    shadowColor: 'darkslategrey', 
    shadowOffset: {'width': 10, 'height': 100}
  },
  petImage: {
    width: '80%',
    height: '60%',
    left: '10%',
    top: '5%', 
    borderRadius: 8, 
    borderColor: 'black',
    borderWidth: 1,
  },
  description: {
    fontSize: 12,
    width: "80%", 
    textAlign: 'left',
    marginLeft: '10%'
  },
  centerText: {
    textAlign: 'center',
    marginTop: 10,
    backgroundColor: "transparent", 
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
