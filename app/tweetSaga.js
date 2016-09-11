import 'babel-regenerator-runtime'

import { eventChannel, takeEvery } from 'redux-saga'
import { take, call, put, fork, cancel, cancelled } from 'redux-saga/effects'
import socket, { channel } from './socket'
import * as actionTypes from './constants'

export function socketEmitter(name) {
  return eventChannel(emitter => {
    socket.emit('track', name)
    const newChannel = channel(name)

    newChannel.on('tweets', emitter)

    return () => {
      newChannel.removeAllListeners('tweets')
      socket.emit('untrack', name)
    }
  })
}

export function* listen(name) {
  const chan = yield call(socketEmitter, name)

  try {
    while (true) {
      const tweets = yield take(chan)
      yield put({
        type: actionTypes.TWEETS_RECEIVED,
        tweets,
        name
      })
    }
  } finally {
    if (yield cancelled()) {
      chan.close()
    }
  }
}

function* subscribe(action) {
  const listenTask = yield fork(listen, action.name)
  let subscribed = true

  while (subscribed) {
    const unsubscribed = yield take(actionTypes.UNTRACK_SUBJECT)
    if (unsubscribed.name === action.name) {
      subscribed = false
      yield cancel(listenTask)
    }
  }
}

function* track() {
  yield* takeEvery(actionTypes.TRACK_SUBJECT, subscribe)
}

export default track
