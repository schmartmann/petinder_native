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

const { width, height } = Dimensions.get('window');
const rightWidth = width/2;
const leftWidth = 0 - rightWidth;  
const bottom = height/6;  

const dragDirection = ({ moveX, moveY, dx, dy}) => {
  var draggedLeft = dx < -10;
  var draggedRight = dx > 10;
  var draggedUp = dy < -30;
  var draggedDown = dy > 30; 

  var dragDirection = { 
    direction: '',
    change: undefined
  }

  if (draggedLeft || draggedRight) {
    draggedDown = false;
    draggedUp = false;
    dragDirection.direction = 'lat';
    dragDirection.change = dx;
  } else if (draggedUp || draggedDown){
    draggedLeft = false;
    draggedRight = false;
    dragDirection = {direction: 'vert', change: dy};
  };

 return dragDirection;
}

class Pet extends Component {
  constructor(props){
    super(props);
    this.state = {
      position: {},
      modalVisible: false
    };
    this.handleLink = this.handleLink.bind(this);
  };
  componentWillMount() {
    this._panResponder = PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => !!dragDirection(gestureState),
      onPanResponderMove: (evt, gestureState) => {
        if (!this.state.modalVisible){
          var drag = dragDirection(gestureState);
          //drag returns the position change 
          this.setState({
            position: drag
          });
          this.props.updateSwipePosition(drag);
        }
      }, 
      onPanResponderRelease: (evt, gestureState) => {
        var drag = dragDirection(gestureState);
        if (!this.state.modalVisible){
          this.handleRelease(drag);
        }
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
    if (pos && pos.direction != "vert") {
      return (
        [
          {rotate: `${pos.change/6}deg`}, 
          // {scale: 1 + (pos < 1? pos = (pos * -1)/200 : pos/200)}
        ]
      )
    } else {
      return ([{rotate: "0deg"}])
    }
  }
  detectCollision(position) {
    var collision;
    position.change? position.change : 0;
    if (position.direction === "lat"){
      if ( position.change >= (rightWidth/1.2) || (position.change <= (leftWidth/1.2)) ){
        collision = true
      } else {
        collision = false
      }
    } else if (position.direction === "vert"){
      if ( position.change >= bottom ){
        collision = true
      } else {
        collision = false
      }
    }
    return collision
  }
  handleRelease(position) {
    var collision = this.detectCollision(position); 
    if (collision) {
      if (position.change > 0 && position.direction === "lat") {
        this.likePet(); 
        this.fetchNext(); 
        this.props.updateSwipePosition({direction: '', change:0})
      } else if (position.change < 0 && position.direction === "lat"){
        this.fetchNext(); 
        this.props.updateSwipePosition({direction: '', change: 0})
      } else if (position.change > 0 && position.direction === "vert"){
        this.hardReload();
        this.props.updateSwipePosition({direction: '', change:0})     
      }
    } else {
      this.setState({
        position: {direction: '', change: 0} 
      })
      this.props.updateSwipePosition({direction: '', change:0})
    }
  }
  fetchNext() {
    this.props.nextPet(this.props.pet)
    this.setState({
      position: {direction: '', change: 0}
    })
  }
  hardReload() {
    this.props.fetchMyPet(0);
    this.setState({
      position: {direction: '', change: 0}
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
  handleLat(position) {
    var left = 0;
    if (position.direction === "lat"){
      left = position.change
    }    
    return left;
  }
  handleVert(position) {
    var top = 0;
    if (position.direction === "vert" && position.change > 0){
      top = position.change
    }
    return top;
  }
  checkRender(fetching) {
    if (fetching) {
      return 0.5
    } else {
      return 1 
    }
  } 
  loader(fetchStatus){
    if (fetchStatus) {
      return (
        <Text style={styles.loader}>
          Loading!
        </Text>
      )
    } else {
      return (<Text/>)
    }
  }
  render(){
    return(
      <View style={ [styles.petCard, {opacity: this.checkRender(this.props.fetchStatus)}, {zIndex: this.props.fetchStatus? -1 : 1 }, {top: this.handleVert(this.state.position)}, {left: this.handleLat(this.state.position) }, {transform: this.handleTransform(this.state.position)}] } {...this._panResponder.panHandlers}>
        {this.loader(this.props.fetchStatus)}
        <Image
          style={ styles.petImage }
          source={{uri: this.props.pet.current_pet.photo[0]}}
          />
        <Text style={ styles.petName } adjustsFontSizeToFit={true}>
            { this.props.pet.current_pet.name.toUpperCase() }
        </Text>
        <Text style={ styles.petLocation } adjustsFontSizeToFit={true}>
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
              <ScrollView style={ styles.button_view}> 
                <Text style={ styles.modalText }>{ this.props.pet.current_pet.name }'s Profile:</Text>
                <Text style={ [styles.modalBorder, styles.modalText] }>
                  { this.props.pet.current_pet.description }
                </Text>
                <TouchableHighlight onPress={ () => {
                  this.setModalVisible(!this.state.modalVisible)}}>
                  <View>
                    <Text style={ styles.button_text}>
                      Back
                    </Text>
                  </View>
                </TouchableHighlight>
              </ScrollView>
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
    height: '70%',
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
    // top: '-0.25%', 
    left: '12%',
    backgroundColor: 'transparent',
    color: "white", 
    textShadowColor: "darkslategrey", 
    textShadowOffset: {'width': 2, 'height': 2}
  },
  petLocation: {
    position: 'relative', 
    top: '-3%', 
    right: '12%', 
    textAlign: 'right',
    backgroundColor: 'transparent', 
    color: "white", 
    textShadowColor: "darkslategrey", 
    textShadowOffset: {'width': 2, 'height': 2},
    fontSize: 20,
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
  },
  loader: {
    zIndex: 1,
    color: "black",
    textShadowColor: "white", 
    textShadowOffset: {'width': 2, 'height': 2},
    backgroundColor: "transparent", 
    fontSize: 30,
    textAlign: "center",
    textAlignVertical: "center",
    position: "absolute", 
    top: "30%",
    left: "30%",
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
