import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchMyPet, getPets } from '../actions/index';

class Pet extends Component{
  constructor(props){
    super(props);
    this.state = {
      truncateDesc: true
    }
    let offset = this.props.pet.offset
    console.log("current offset: ", offset)
    this.props.fetchMyPet(offset);
    this.untruncate = this.untruncate.bind(this);
    this.truncate = this.truncate.bind(this);
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
      <div className="pet-card">
        {/* {this.renderPhotos()} */}
            <img src={this.props.pet.current_pet.photo[0]}></img>
        <h3>
            {this.props.pet.current_pet.name}
        </h3>
        <h6>
          {this.props.pet.current_pet.city}, {this.props.pet.current_pet.state}
        </h6>
        <p id="pet-description" className={this.state.truncateDesc? "flow-text truncate" : "flow-text"} onClick={this.state.truncateDesc? this.untruncate : this.truncate}>
          <i>
            {this.props.pet.current_pet.description}
          </i>
        </p>
        <p>
          <a href={this.props.pet.current_pet.link}>View Profile</a>
        </p>
      </div>
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
