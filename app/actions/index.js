
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

export function fetchMyPetOptimistic(pets){
  console.log("fetchMyPetOptimistic:", pets)
  let pets_batch = pets.second;
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
  console.log("currentOffset in actions/index", offset)
  return function(dispatch){
    return fetch('http://ip-api.com/json')
    .then( response => response.json())
    .then( response => {
      console.log(response);
      // let loc;
      // if (response.country !== "United States"){
      //   let loc = `${response.city}, ${response.region}`
      // } else {
      //   let loc = response.zip;
      //   console.log(loc)
      // }
      const url = `${ROOT_URL}api/v1/pets?location=${response.zip}&offset=${offset}`
      fetch(url)
      .then( response => response.json())
      .then( data => {
        console.log(data);
        dispatch(fetchMyPetOptimistic(data))
      })
      .catch(message => console.log(message))
    })
    .catch( message => console.log(message))
  }
}
