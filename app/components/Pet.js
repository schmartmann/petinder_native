import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { fetchMyPet, getPets } from '../actions/index';
import { connect } from 'react-redux';
import { StyleSheet, View, Text, Image, AppRegistry } from 'react-native';

class Pet extends Component {
  constructor(props){
    super(props);
    this.state = {
      truncateDesc: true
    }
    let offset = this.props.pet.offset;
    console.log(this.props);
    console.log("current offset: ", offset)
    this.props.fetchMyPet(offset);
    // this.untruncate = this.untruncate.bind(this);
    // this.truncate = this.truncate.bind(this);
  };
  truncate(){
    this.setState({truncateDesc: true})
  };
  untruncate(){
    this.setState({truncateDesc: false})
  };
  renderPhotos(){
    console.log("photos: ", this.props.pet.current_pet.photo)
    let photoComponents = [];
    for (let i = 0; i < this.props.pet.current_pet.photo.length; i ++){
      photoComponents.push(
        <a className="carousel-item" href="#one!">
          <img src={this.props.pet.current_pet.photo[i]}></img>
        </a>
      )
    };
    return(
      <div className="carousel">
        {photoComponents}
      </div>
    )
  };
  render(){
    console.log(this.props)
    return(
      <View className="pet-card">
        {/* {this.renderPhotos()} */}
          <Image
            style={{width: 50, height: 50}}
            source={{uri: this.props.pet.current_pet.photo[0]}}
            />
        <Text>
            {this.props.pet.current_pet.name}
        </Text>
        <Text>
          {this.props.pet.current_pet.city}, {this.props.pet.current_pet.state}
        </Text>
        <Text id="pet-description" className={this.state.truncateDesc? "flow-text truncate" : "flow-text"} onClick={this.state.truncateDesc? this.untruncate : this.truncate}>
            {this.props.pet.current_pet.description}
        </Text>
        <Text>
          View Profile
          {/* <a href={this.props.pet.current_pet.link}>View Profile</a> */}
        </Text>
      </View>
    )
  }
}


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
