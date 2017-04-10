import React from 'react'

import '@blueprintjs/core/dist/blueprint.css'
import './SearchCard.css'


export class SearchCard extends React.Component {

  static defaultProps = {
    tags: [],
  }

  render () {
    return (
      <div className="cardLayout pt-card pt-elevation-4">
        <nav className="tags">
          {this.props.tags.map(tag => <span key={tag} className="tag pt-tag pt-round pt-large">{tag}</span>)}
        </nav>
        <input className="pt-input inputLayout" placeholder="Search files..." type="text" />
      </div>
    )
  }
}
