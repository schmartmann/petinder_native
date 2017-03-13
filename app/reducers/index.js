import { combineReducers } from 'redux';
import PetsReducer from "./pets_reducer" ;

const rootReducer = combineReducers({
  pet: PetsReducer
});

export default rootReducer;
