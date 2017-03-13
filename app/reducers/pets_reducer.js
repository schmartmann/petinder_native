const INITIAL_STATE = {
    current_pet:
      {
        city: '',
        state: '',
        photo: '',
        id: '',
        link: '',
        name: '',
        description: '',
        animal: ''
      },
    pet_batch: [],
    offset: 0
}


const sortPhotos = function(arr){
  console.log("sortPhotos: ", arr);
  let photos = [];
  for (let index of arr){
    if (index["@size"] === "x"){
      photos.push(index["$t"])
    }
  }
  console.log("sorted photos:", photos)
  return photos;
}


export default function(state = INITIAL_STATE, action){
  switch(action.type){
    case 'LOAD_PET':
      console.log("LOAD_PET firing: ", action.payload)
      let current_pet = action.payload.current_pet;
      let pet_batch = action.payload.pet_batch;
      let new_current_pet_photos = sortPhotos(current_pet.photo);
      return {
        current_pet: {
          animal: current_pet.animal,
          city: current_pet.city,
          state: current_pet.state,
          description: current_pet.description,
          pet_id: current_pet.id,
          name: current_pet.name,
          photo: new_current_pet_photos,
          link: current_pet.link
        },
        pet_batch: pet_batch,
        offset: state.offset + 25
      };
    case 'NEXT_PET':
      console.log("NEXT_PET firing: ", action.payload);
      if (action.payload[0] === undefined){console.log("donezo")}
      let new_current_pet = action.payload[0];
      let new_pet_batch = action.payload[1];
      new_current_pet_photos = sortPhotos(new_current_pet.photo);
      return {
        current_pet: {
          animal: new_current_pet.animal,
          city: new_current_pet.city,
          state: new_current_pet.state,
          description: new_current_pet.description,
          pet_id: new_current_pet.id,
          name: new_current_pet.name,
          photo: new_current_pet_photos,
          link: new_current_pet.link
        },
        pet_batch: new_pet_batch,
        offset: state.offset
      };
    case 'SAVE_PET':
      console.log("SAVE_PET firing: ", action.payload);
      new_current_pet = action.payload.nextPet;
      new_pet_batch = action.payload.petsBatch;
      console.log("new current_pet: ", new_current_pet.photo)
      new_current_pet_photos = sortPhotos(new_current_pet.photo);
      return {
        current_pet: {
          animal: new_current_pet.animal,
          city: new_current_pet.city,
          state: new_current_pet.state,
          description: new_current_pet.description,
          pet_id: new_current_pet.id,
          name: new_current_pet.name,
          photo: new_current_pet_photos,
          link: new_current_pet.link
        },
        pet_batch: new_pet_batch,
        offset: state.offset
      }
    default:
      console.log("no pet loaded");
      return state;
  }
}
