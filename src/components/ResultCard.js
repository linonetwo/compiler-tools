import Promise from 'bluebird'
import React from 'react'
import Measure from 'react-measure'
import Markdown from 'react-markdown'
import styled from 'styled-components'

import '@blueprintjs/core/dist/blueprint.css'
import './ResultCard.css'

const ControlWidthHeight = styled.div`
  width: ${props => props.width}px;
  height: calc(${props => props.height}px + 100px);
`

export class ResultCard extends React.Component {
  static defaultProps = {
    tags: [],
  }
  state = {
    showExample: false,
    dimensions: {
      width: -1,
      height: -1
    }
  }

  componentDidMount () {
    this.setState({ showExample: true })
  }

  measureHeight = (elem) =>
  <Measure
    onMeasure={(dimensions) => {
      if (dimensions.height <= this.state.dimensions.height) {
        return
      }
      this.setState({dimensions})
    }}
  >

      {elem}
  </Measure>

  render () {
    return (
      <ControlWidthHeight height={this.state.dimensions.height}>
        <section
          onClick={async () => { await Promise.delay(200); this.setState({ showExample: !this.state.showExample }) }}
          className="cardLayout pt-card pt-elevation-5 pt-interactive"
        >
        <nav className="tags">
          {[<span key="isExample" className="tag pt-tag pt-intent-primary pt-round">{this.state.showExample ? 'example' : 'principle'}</span>,
            ...this.props.tags.map(tag => <span key={tag} className="tag pt-tag pt-round">{tag}</span>)]}
        </nav>
          {
            this.state.showExample
            ? this.measureHeight(<Markdown className="example markdown upper" source={this.props.example} />)
            : this.measureHeight(<Markdown className="principle markdown lower" source={this.props.principle} />)
          }
        </section>
    </ControlWidthHeight>
    )
  }
}
