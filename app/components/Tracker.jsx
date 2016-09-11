import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import Tweets from './Tweets'
import * as actionCreators from '../actions'

export class Tracker extends Component {
  static propTypes = {
    subject: PropTypes.shape({
      name: PropTypes.string.isRequired,
      visibleCount: PropTypes.number.isRequired,
      readTweets: PropTypes.arrayOf(PropTypes.shape()),
      unreadTweets: PropTypes.arrayOf(PropTypes.shape())
    }).isRequired,
    actions: PropTypes.shape({
      readAll: PropTypes.func.isRequired,
      untrack: PropTypes.func.isRequired,
      viewMore: PropTypes.func.isRequired
    }).isRequired
  }

  readAll() {
    const { subject, actions } = this.props
    actions.readAll(subject.name)
    this.scrollTop.scrollTop = 0
  }

  ignore() {
    const { subject, actions } = this.props
    actions.untrack(subject.name)
  }

  viewMore() {
    const { subject, actions } = this.props
    actions.viewMore(subject.name)
  }

  unreadTweets() {
    const { unreadTweets } = this.props.subject
    return (
      <button className="pure-button pure-button-primary" onClick={() => this.readAll()}>
        {`${unreadTweets.length} unread tweets (read more)`}
      </button>
    )
  }

  render() {
    const { name, readTweets, visibleCount } = this.props.subject
    const readMore = readTweets.length > visibleCount ? (
      <button onClick={() => this.viewMore()}>Read More...</button>
    ) : false

    return (
      <div className="tracker">
        <div className="subject-header">
          <h2>{name}</h2>
          {this.unreadTweets()}
          <button className="pure-button pure-button-warning" onClick={() => this.ignore()}>
            Untrack
          </button>
        </div>
        <div className="tweets" ref={(node) => { this.scrollTop = node }}>
          <Tweets tweets={readTweets.slice(0, visibleCount)} />
          {readMore}
        </div>
      </div>
    )
  }
}

export default connect(
  () => ({}),
  dispatch => ({
    actions: bindActionCreators({
      readAll: actionCreators.readAllTweets,
      untrack: actionCreators.untrackSubject,
      viewMore: actionCreators.viewMoreTweets
    }, dispatch)
  })
)(Tracker)
