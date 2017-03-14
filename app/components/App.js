import React, {Component} from 'react';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import devToolsEnhancer from 'remote-redux-devtools';

import * as reducers from '../reducers';

import Petinder from './Petinder';

const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);
const reducer = combineReducers(reducers);
const store = createStoreWithMiddleware(reducer, devToolsEnhancer());


export default class App extends Component {
  render() {
    return(
      <Provider store={store}>
        <Petinder />
      </Provider>
    )
  }
}
