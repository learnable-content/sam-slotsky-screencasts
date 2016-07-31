import { Map, List } from 'immutable'
import * as actionTypes from './constants'
import resolve from './reduxResolver'

const initialState = Map({
  subjects: List()
})

function mapSubjects(state, action, mutate) {
  return state.get('subjects').map(s => {
    if (s.get('name') !== action.name) {
      return s
    }

    return mutate(s)
  })
}

function readAllTweets(state, action) {
  const subjects = mapSubjects(state, action, s =>
    s.merge({
      readTweets: s.get('unreadTweets').concat(s.get('readTweets')),
      unreadTweets: List()
    })
  )

  return state.merge({ subjects })
}

function viewMoreTweets(state, action) {
  const subjects = mapSubjects(state, action, s =>
    s.merge({
      visibleCount: s.get('visibleCount') + 50
    })
  )

  return state.merge({ subjects })
}

function untrackSubject(state, action) {
  const subjects = state.get('subjects').filter(s => s.get('name') !== action.name)
  return state.merge({ subjects })
}

function trackNewSubject(state, action) {
  const subjects = state.get('subjects')
  if (subjects.some(s => s.get('name') === action.name)) {
    return state
  }

  const subject = Map({
    name: action.name,
    readTweets: List(),
    unreadTweets: List(),
    visibleCount: 50
  })

  return state.merge({
    subjects: subjects.push(subject)
  })
}

function prependTweets(state, action) {
  const subjects = mapSubjects(state, action, s => {
    const tweets = action.tweets.map(t => Map(t))
    return s.merge({
      unreadTweets: List(tweets).concat(s.get('unreadTweets'))
    })
  })

  return state.merge({ subjects })
}

export default resolve(initialState, {
  [actionTypes.TRACK_SUBJECT]: trackNewSubject,
  [actionTypes.READ_ALL_TWEETS]: readAllTweets,
  [actionTypes.VIEW_MORE_TWEETS]: viewMoreTweets,
  [actionTypes.UNTRACK_SUBJECT]: untrackSubject,
  [actionTypes.TWEETS_RECEIVED]: prependTweets
})
