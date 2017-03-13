import axios from 'axios';

const ROOT_URL = "http://petinder_api.pet-tinder.com/"
export const FETCH_MY_PET  = "FETCH_MY_PET";
export const LOAD_PET = "LOAD_PET";
export const NEXT_PET = "NEXT_PET";
export const SAVE_PET = "SAVE_PET";

export function nextPetOptimistic(props){
  let nextPet = props.pet_batch.shift();
  let pets_batch = props.pet_batch;
  console.log("nextPet: ", nextPet);
  console.log("petsBatch: ", pets_batch);
  let payload = [nextPet, pets_batch];
  return {
    type: NEXT_PET,
    payload: payload
  }
}

export function nextPet(props){
  return function(dispatch){
    console.log("OKAY", props);
    dispatch(nextPetOptimistic(props))
    return null;
  }
}

export function savePet(props){
  let savedPet = props.saved_pet;
  console.log("NICE", savedPet)

  let strWindowFeatures = "location=yes,height=570,width=520,scrollbars=yes,status=yes";
  let petfinderUrl = "https://www.petfinder.com/adoption-inquiry/" + savedPet.pet_id;
  let petfinderWin = window.open(petfinderUrl, "_blank", strWindowFeatures);
  let nextPet = props.pets_batch.shift();
  let petsBatch = props.pets_batch;

  let payload = {
    nextPet: nextPet,
    petsBatch: petsBatch
  }
  return {
    type: SAVE_PET,
    payload: payload
  }
}

export function fetchMyPetOptimistic(props){
  console.log("fetchMyPetOptimistic:", props.data)
  let pets_batch = props.data.second;
  let current_pet = pets_batch.shift();
  let pet = {
    current_pet : current_pet,
    pet_batch: pets_batch
  };
  console.log(pet)
  return {
    type: LOAD_PET,
    payload: pet
  }
}

export function fetchMyPet(offset){
  let currentOffset = offset;
  console.log("currentOffset in actions/index", currentOffset)
  return function(dispatch){
    const positionRequest = axios.get('http://ip-api.com/json').then(response => {
      console.log(response)
      let user_location;
      if (response.data.country !== "United States"){
        let user_location = `${response.data.city}, ${response.data.regionName}`
        console.log(user_location)
      } else {
        user_location = response.data.zip
      }
      const url = `${ROOT_URL}api/v1/pets?location=${user_location}&offset=${currentOffset}`

      axios.get(url).then(response => {
          console.log("request from actions/index.js", response)
          dispatch(fetchMyPetOptimistic(response))
        });
    })
    return null
  }
}
