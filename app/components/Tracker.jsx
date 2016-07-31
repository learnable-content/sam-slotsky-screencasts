import React, { PropTypes, Component } from 'react'
import Tweets from './Tweets'
import * as actionCreators from '../actions'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

export class Tracker extends Component {
  static propTypes = {
    subject: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired
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
      <a className="pure-button pure-button-primary" onClick={() => this.readAll()}>
        {`${unreadTweets.length} unread tweets (read more)`}
      </a>
    )
  }

  render() {
    const { name, readTweets, visibleCount } = this.props.subject
    const readMore = readTweets.length > visibleCount ? (
      <a onClick={() => this.viewMore()}>Read More...</a>
    ) : false

    return (
      <div className="tracker">
        <div className="subject-header">
          <h2>{name}</h2>
          {this.unreadTweets()}
          <a className="pure-button pure-button-warning" onClick={() => this.ignore()}>
            Untrack
          </a>
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
