import expect, { spyOn } from 'expect'
import { call, take, put, cancelled } from 'redux-saga/effects'
import { socketEmitter, listen } from '../app/tweetSaga'
import * as actionTypes from '../app/constants'

const name = 'trending subject'
const task = listen(name)
const channel = socketEmitter(name)
const close = spyOn(channel, 'close')

describe('listen', () => {
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
