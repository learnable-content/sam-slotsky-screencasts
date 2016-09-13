import React from 'react'
import TestUtils from 'react-addons-test-utils'
import expect, { createSpy } from 'expect'
import './specHelper'
import { Tracker } from '../app/components/Tracker'

function getProps() {
  return {
    subject: {
      name: 'Beer',
      visibleCount: 50,
      readTweets: [],
      unreadTweets: []
    },
    actions: {
      readAll: createSpy(),
      untrack: createSpy(),
      viewMore: createSpy()
    }
  }
}

describe('<Tracker />', () => {
  it('displays the correct structure', () => {
    const props = getProps()
    const output = TestUtils.createRenderer().render(
      <Tracker {...props} />
    )

    const [header] = output.props.children
    const [heading, unreadTweets, untrack] = header.props.children
    const buttonText = untrack.props.children
    const headingText = heading.props.children

    expect([
      heading.type,
      headingText,
      unreadTweets.type,
      untrack.type,
      buttonText
    ]).toEqual([
      'h2',
      props.subject.name,
      'button',
      'button',
      'Untrack'
    ])
  })

  context('when untrack button is clicked', () => {
    it('calls the untrack function', () => {
      const props = getProps()
      const output = TestUtils.renderIntoDocument(
        <Tracker {...props} />
     )

      const untrack = TestUtils.findRenderedDOMComponentWithClass(
       output,
       'pure-button-warning'
     )

      TestUtils.Simulate.click(untrack)
      expect(props.actions.untrack).toHaveBeenCalledWith(props.subject.name)
    })
  })
})
