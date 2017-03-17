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
    return(
      <View style={ styles.petCard }>
        {/* {this.renderPhotos()} */}
          <Image
            style={{width: 50, height: 50}}
            source={{uri: this.props.pet.current_pet.photo[0]}}
            />
        <Text style={ styles.petName }>
            { this.props.pet.current_pet.name.toUpperCase() }
        </Text>
        <Text>
          { this.props.pet.current_pet.city }, { this.props.pet.current_pet.state }
        </Text>
        <Text>
            { this.props.pet.current_pet.description }
        </Text>
        <Text>
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
