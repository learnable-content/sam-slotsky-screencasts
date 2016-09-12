import expect, { spyOn } from 'expect'
import { takeEvery } from 'redux-saga'
import { call, take, put, cancel, cancelled, fork } from 'redux-saga/effects'
import { createMockTask } from 'redux-saga/utils'
import track, { socketEmitter, listen, subscribe } from '../app/tweetSaga'
import * as actionTypes from '../app/constants'

const name = 'trending subject'

describe('listen', () => {
  const task = listen(name)
  const channel = socketEmitter(name)
  const close = spyOn(channel, 'close')

  context('when the task begins', () => {
    it('opens a channel to the socketEmitter', () => {
      expect(task.next().value).toEqual(call(socketEmitter, name))
    })
  })

  context('when tweets are emitted', () => {
    it('takes the tweets from the channel', () => {
      expect(task.next(channel).value).toEqual(take(channel))
    })

    it('puts the tweet through to the redux store', () => {
      const tweets = [{ text: 'A comment about a trending topic' }]
      const action = {
        type: actionTypes.TWEETS_RECEIVED,
        tweets,
        name
      }

      expect(task.next(tweets).value).toEqual(put(action))
    })
  })

  context('when the task has been cancelled', () => {
    it('checks for cancellation', () => {
      expect(task.return().value).toEqual(cancelled())
    })

    it('closes the channel', () => {
      task.next(true)
      expect(close).toHaveBeenCalled()
    })
  })
})

describe('subscribe', () => {
  const task = subscribe({ type: actionTypes.TRACK_SUBJECT, name })
  const listenMock = createMockTask()

  context('when task begins', () => {
    it('forks the listen task', () => {
      expect(task.next().value).toEqual(fork(listen, name))
    })

    it('waits for an unsubscribe signal', () => {
      expect(task.next(listenMock).value).toEqual(take(actionTypes.UNTRACK_SUBJECT))
    })
  })

  context('when signal to unsubscribe is received', () => {
    const unsubscribe = {
      type: actionTypes.UNTRACK_SUBJECT,
      name
    }

    it('cancels the listen task', () => {
      expect(task.next(unsubscribe).value).toEqual(cancel(listenMock))
    })
  })
})

describe('track', () => {
  const task = track()
  it('sends every TRACK_SUBJECT action to the subscribe task', () => {
    expect(task.next().value).toEqual(call(takeEvery, actionTypes.TRACK_SUBJECT, subscribe))
  })
})
