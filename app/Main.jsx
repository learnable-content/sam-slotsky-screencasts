import React from 'react'
import ReactDOM from 'react-dom'
import App from './components/App'
import '../styles.scss'

import reducer from './reducer'
import track from './tweetSaga'

import createSagaMiddleware from 'redux-saga'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'

const sagaMiddleware = createSagaMiddleware()
const store = createStore(reducer, applyMiddleware(sagaMiddleware))
sagaMiddleware.run(track)

ReactDOM.render((
  <Provider store={store}>
    <div>
      <App />
    </div>
  </Provider>
), document.getElementById('app'))

