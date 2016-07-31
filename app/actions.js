import * as actionTypes from './constants'
import socket, { channel } from './socket'

export function track(name) {
  return {
    type: actionTypes.TRACK_SUBJECT,
    name
  }
}

export function listen(name) {
  return dispatch => {
    dispatch(track(name))

    socket.emit('track', name)
    channel(name).on('tweets', tweets => {
      dispatch({
        type: actionTypes.TWEETS_RECEIVED,
        tweets,
        name
      })
    })
  }
}

export function readAllTweets(name) {
  return {
    type: actionTypes.READ_ALL_TWEETS,
    name
  }
}

export function viewMoreTweets(name) {
  return {
    type: actionTypes.VIEW_MORE_TWEETS,
    name
  }
}

export function untrackSubject(name) {
  return {
    type: actionTypes.UNTRACK_SUBJECT,
    name
  }
}

export function ignore(name) {
  return dispatch => {
    dispatch(untrackSubject(name))
    channel(name).removeAllListeners('tweets')
    socket.emit('untrack', name)
  }
}
