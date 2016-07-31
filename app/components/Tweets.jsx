import React, { PropTypes, Component } from 'react'

export default class extends Component {
  static propTypes = {
    tweets: PropTypes.array.isRequired
  }

  tweets() {
    return this.props.tweets.map((t, i) =>
      <div key={`${name}-tweets-${i}`}>
        <div className="pure-g">
          <div className="pure-1-4">
            <img alt="User profile" src={t.user.profile_image_url} />
          </div>
          <div className="pure-u-1-4">
            <strong>{t.user.name}</strong>
          </div>
        </div>
        <p>{t.text}</p>
        <p>{t.created_at}</p>
      </div>
    )
  }

  render() {
    return (
      <div>
        {this.tweets()}
      </div>
    )
  }
}

