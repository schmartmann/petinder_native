import React, {Component} from 'react';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';

import reducers from '../reducers';

import Petinder from './Petinder';

const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);

export default class App extends Component {
  render() {
    return(
      <Provider store={createStoreWithMiddleware(reducers, window.devToolsExtension && window.devToolsExtension())}>
        <Petinder />
      </Provider>
    )
  }
}
