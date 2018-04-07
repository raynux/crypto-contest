import React from 'react';
import ReactDOM from 'react-dom';
import { Router } from 'react-router-dom'
import { LastLocationProvider } from 'react-router-last-location'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import createBrowserHistory from 'history/createBrowserHistory'
import rootReducer from './reducers'

import registerServiceWorker from './registerServiceWorker'

import './index.css';
import App from './App';

const history = createBrowserHistory()
const initStore = createStore(rootReducer)

registerServiceWorker()

ReactDOM.render(
  <Provider store={initStore}>
    <Router history={history}>
      <LastLocationProvider>
        <App />
      </LastLocationProvider>
    </Router>
  </Provider>,
  document.getElementById('root')
)
