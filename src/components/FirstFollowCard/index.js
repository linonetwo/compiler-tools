import Promise from 'bluebird'
import React from 'react'
import Measure from 'react-measure'
import styled from 'styled-components'

import { Grammar } from 'first-follow'

import '@blueprintjs/core/dist/blueprint.css'
import '../ResultCard.css'

import RenderSet from './RenderSet'

const ControlWidthHeight = styled.div`
  width: ${props => props.width}px;
  height: calc(${props => props.height}px + 100px);
`

export class FirstFollowCard extends React.Component {
  static defaultProps = {
    tags: ['First', 'Follow'],
  }
  state = {
    errorMessage: '',
    rulesInput: '',
    firstSet: {},
    followSet: {},
    predictSet: {},
    dimensions: {
      width: -1,
      height: -1
    }
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

  handleInputChange = (event) => {
    const regexpInput = event.target.value.replace(/\s/g, '')
    return new Promise(resolve => this.setState({ regexpInput }, resolve))
  }

  runAlgorithm = async (event) => {
    if (event.charCode !== 13 || this.state.working) return

    if (event.charCode === 13) {
      this.setState({ working: true, errorMessage: '' })
      try {
      // 为了在未来能进一步为客户提升算法效率，先延迟 100 毫秒
        await Promise.delay(100)
        const grammar = new Grammar([
          {
            left: 'S',
            right: ['a', 'b', 'A']
          },
          {
            left: 'A',
            right: ['b', 'c']
          },
          {
            left: 'A',
            right: [null]
          }
        ])

        this.setState({
          firstSet: grammar.getFirstSetHash(),
          followSet: grammar.getFollowSetHash(),
          predictSet: grammar.getPredictSets(),
          working: false
        })
      } catch (error) {
        this.setState({
          errorMessage: error.toString(),
          firstSet: {},
          followSet: {},
          predictSet: {},
          working: false
        })
      }
    }
  }

  giveExample = async () => {
    // 如果输入框不为空，就直接运行输入框中的内容，防止误触
    if (!this.state.regexpInput) {
      await this.handleInputChange({target: {value: '林(东*吴)*|(吴东)*林'}})
    }
    this.runAlgorithm({charCode: 13})
  }

  render () {
    return (
      <ControlWidthHeight height={this.state.dimensions.height}>
        <section
          onClick={async () => { await Promise.delay(200); this.setState({ showExample: !this.state.showExample }) }}
          className="cardLayout pt-card pt-elevation-5 pt-interactive"
        >
        <nav className="tags">
          {this.props.tags.map(tag => <span key={tag} className="tag pt-tag pt-round">{tag}</span>)}
        </nav>
        {this.measureHeight(
        <article>
          <input
            onChange={this.handleInputChange}
            onKeyPress={this.runAlgorithm}
            value={this.state.regexpInput}
            type="text"
            id="regexpInput"
            placeholder="在此输入正则表达式并回车"
          />
          <button onClick={this.giveExample}>{this.state.working ? '等' : '例'}</button>
          <br/>
          {this.state.errorMessage || <div>
              <RenderSet name="first" set={this.state.firstSet}/>
              <RenderSet name="follow" set={this.state.followSet}/>
              <RenderSet name="predict" set={this.state.predictSet}/>
            </div>}
        </article>)}
        </section>
    </ControlWidthHeight>
    )
  }
}
