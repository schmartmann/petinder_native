import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { fetchMyPet, getPets, nextPet } from '../actions/index';
import { connect } from 'react-redux';
import {
  PanResponder,
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableHighlight,
  TouchableOpacity,
  Image,
  Dimensions,
  Modal,
  Linking, 
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
    this.handleLink = this.handleLink.bind(this);
  };
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
      if (this.state.position > 0) {
        this.likePet(); 
        this.fetchNext(); 
      } else {
        this.fetchNext(); 
      }
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
  handleLink() {
   Linking.canOpenURL(this.props.pet.current_pet.link).then(supported => {
     if (supported) {
       Linking.openURL(this.props.pet.current_pet.link);
     } else {
       console.log('Don\'t know how to open URI: ' + this.props.pet.current_pet.link);
     }
   });
  }
  likePet() {
    const url = `https://www.petfinder.com/adoption-inquiry/${this.props.pet.current_pet.pet_id}`
    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        Linking.openURL(url);
      } else {
       console.log('Don\'t know how to open URI: ' + url);
      }
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
              numberOfLines={3} 
              ellipsizeMode="tail"
            >
            { this.props.pet.current_pet.description }
            </Text>
          </TouchableHighlight>
        <TouchableOpacity
          onPress={this.handleLink}>
          <Text style={ [styles.profileButton] }>
            View Petfinder Profile
          </Text>
        </TouchableOpacity>
        <View style={{flex: 1}}>
          <Modal
            animationType={"slide"}
            transparent={false}
            visible={this.state.modalVisible}
            onRequestClose={() => {alert("Modal closed")}}>
            <View style={{marginTop: 22}}>
              <View> 
                <Text style={ styles.modalText }>{ this.props.pet.current_pet.name }'s Profile:</Text>
                <Text style={ [styles.modalBorder, styles.modalText] }>
                  { this.props.pet.current_pet.description }
                </Text>
                <TouchableHighlight onPress={ () => {
                  this.setModalVisible(!this.state.modalVisible)}}>
                  <ScrollView style={ styles.button_view}>
                    <Text style={ styles.button_text}>
                      Back
                    </Text>
                  </ScrollView>
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
    textShadowColor: "darkslategrey", 
    textShadowOffset: {'width': 2, 'height': 2}
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
    marginLeft: '10%',
  },
  centerText: {
    textAlign: 'center',
    marginTop: 10,
    backgroundColor: "transparent", 
  },
  modalBorder: {
    borderRadius: 8, 
    borderColor: 'black',
    borderWidth: 1,
    padding: 2,
  },
  modalText: {
    textAlign: "left",
    padding: 16,
    width: "90%", 
    marginLeft: "5%",
    fontSize: 22,
  },
  button_text: {
    backgroundColor: "black", 
    color: "white", 
    fontSize: 18,
    width: '50%',
    textAlign: "center",
    marginTop: "10%", 
    marginLeft: "20%",
  },
  button_view: {
    borderRadius: 18,
  },
  profileButton: {
    marginTop: "15%", 
    textAlign: "center",
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
    getPets: getPets,
    nextPet: nextPet
  }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Pet);
