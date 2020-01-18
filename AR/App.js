import React from 'react';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import AppNavigation from './navigation/AppNavigation';
import DataProvider from './hoc/DataProvider';
import { Provider } from 'react-redux';
import { useScreens } from 'react-native-screens';
import ReduxThunk from 'redux-thunk';
import planeReducer from './store/planes/planes-reducer';

useScreens();

const rootReducer = combineReducers({
  planes: planeReducer
})

const store = createStore(rootReducer, applyMiddleware(ReduxThunk));

export default function App() {
  

  return (
    <Provider store={store}>
      <DataProvider>
        <AppNavigation />
      </DataProvider>
    </Provider>
  );
}

