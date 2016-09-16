import './specHelper'
import Immutable from 'immutable'
import React from 'react'
import expect, { createSpy } from 'expect'
import { shallow } from 'enzyme'
import { App } from '../app/components/App'
import Tracker from '../app/components/Tracker'

describe('<App />', () => {
  const subjects = [{
    name: 'react'
  }, {
    name: 'redux'
  }]

  const props = {
    subjects: Immutable.fromJS(subjects),
    trackSubject: createSpy()
  }

  const wrapper = shallow(
    <App {...props} />
  )

  it('renders one tracker per subject', () => {
    expect(wrapper.find(Tracker).length).toEqual(subjects.length)
  })

  context('when input is submitted', () => {
    const newSubject = 'single page apps'
    wrapper.find('form input').simulate('change', { target: { value: newSubject } })
    wrapper.find('form').simulate('submit', { preventDefault: () => {} })

    it('calls the trackSubject action', () => {
      expect(props.trackSubject).toHaveBeenCalledWith(newSubject)
    })
  })
})
