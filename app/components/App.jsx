import { List } from 'immutable'
import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'
import { track } from '../actions'
import Tracker from './Tracker'

export class App extends Component {
  static propTypes = {
    subjects: PropTypes.instanceOf(List),
    trackSubject: PropTypes.func.isRequired
  }

  state = {
    input: ''
  }

  handleSubmit(e) {
    e.preventDefault()
    this.props.trackSubject(this.state.input)
    this.setState({ input: '' })
  }

  subjects() {
    return (
      this.props.subjects.map((s, i) => {
        const key = `subjects=${i}`
        return (
          <div key={key} className="pure-u-1-5">
            <Tracker subject={s.toJS()} />
          </div>
        )
      })
    )
  }

  render() {
    return (
      <div>
        <div className="header">
          <h1>Twitter Topic Watch</h1>
          <form className="pure-form" onSubmit={(e) => this.handleSubmit(e)}>
            <input
              type="text"
              value={this.state.input}
              onChange={(e) => this.setState({ input: e.target.value })}
            />
            &nbsp;
            <button type="submit" className="pure-button pure-button-primary">Track!</button>
          </form>
        </div>
        <div className="content">
          <div className="pure-g">
            {this.subjects()}
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    subjects: state.get('subjects')
  }
}

export default connect(mapStateToProps, { trackSubject: track })(App)
