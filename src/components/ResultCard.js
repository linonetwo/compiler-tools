import React from 'react'
import Measure from 'react-measure'
import Markdown from 'react-markdown'
import styled from 'styled-components'

import '@blueprintjs/core/dist/blueprint.css'
import './ResultCard.css'

const HoldWidthHeight = styled.div`
  width: ${props => props.width}px;
  height: ${props => props.height}px;
`

export class ResultCard extends React.Component {
  static defaultProps = {
    tags: [],
  }
  state = {
    showExample: true,
    dimensions: {
      width: -1,
      height: -1
    }
  }

  holdWidthHeight = (elem) =>
  <Measure
    onMeasure={(dimensions) => {
      if (dimensions.width <= this.state.dimensions.width || dimensions.height <= this.state.dimensions.height) {
        return
      }
      this.setState({dimensions})
    }}
  >
    <HoldWidthHeight height={this.state.dimensions.height} width={this.state.dimensions.width}>
      {elem}
    </HoldWidthHeight>
  </Measure>

  render () {
    return (
      <section
        onClick={() => this.setState({ showExample: !this.state.showExample })}
        className="cardLayout pt-card pt-elevation-2 pt-interactive"
      >
      <nav className="tags">
        {[<span key="isExample" className="tag pt-tag pt-intent-primary pt-round">{this.state.showExample ? 'example' : 'principle'}</span>,
          ...this.props.tags.map(tag => <span key={tag} className="tag pt-tag pt-round">{tag}</span>)]}
      </nav>
        {
          this.state.showExample
          ? this.holdWidthHeight(<Markdown className="example markdown-left upper" source={this.props.example} />)
          : this.holdWidthHeight(<Markdown className="principle lower" source={this.props.principle} />)
        }
      </section>
    )
  }
}
