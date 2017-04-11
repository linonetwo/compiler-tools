import React from 'react'

import '@blueprintjs/core/dist/blueprint.css'
import './SearchCard.css'


export class SearchCard extends React.Component {
  static defaultProps = {
    tags: [],
    selectedTags: [],
  }

  render () {
    return (
      <div className="cardLayout pt-card pt-elevation-2">
        <nav className="tags">
          {this.props.tags.map(tag =>
            <span
              key={tag}
              onClick={() => this.props.selectTag(tag)}
              className={`tag pt-tag pt-round pt-large ${this.props.selectedTags === tag ? 'pt-intent-primary' : ''}`}
            >
              {tag}
            </span>)}
        </nav>
        <input className="pt-input inputLayout" placeholder="Search files..." type="text" />
      </div>
    )
  }
}
