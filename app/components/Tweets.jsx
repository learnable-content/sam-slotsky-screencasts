import React, { PropTypes, Component } from 'react'

export default class extends Component {
  static propTypes = {
    tweets: PropTypes.arrayOf(
      PropTypes.shape({
        user: PropTypes.shape({
          name: PropTypes.string,
          profile_image_url: PropTypes.string
        }).isRequired,
        text: PropTypes.string,
        created_at: PropTypes.string
      })
    ).isRequired
  }

  tweets() {
    return this.props.tweets.map((t, i) =>
      <div key={`${t.user.name}-tweets-${i}`}>
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

