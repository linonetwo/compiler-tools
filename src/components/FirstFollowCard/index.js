import Promise from 'bluebird'
import React from 'react'
import Measure from 'react-measure'
import styled from 'styled-components'
import { EditableText, Button } from '@blueprintjs/core'

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
    const rulesInput = event.target.value
    return new Promise(resolve => this.setState({ rulesInput }, resolve))
  }

  runAlgorithm = async () => {
    if (this.state.working) return

    this.setState({ working: true, errorMessage: '' })
    try {
      const lines = this.state.rulesInput.split('\n').map(aLine => aLine.replace(/\s/g, '')).filter(line => !!line)
      console.log(lines)
      const grammarInput = lines.map(aLine => {
        const [left, rightString] = aLine.split('->')
        const right = rightString.split('').map(character => character === 'ε' ? null : character)
        return {
          left,
          right
        }
      })
      // 为了在未来能进一步为客户提升算法效率，先延迟 100 毫秒
      await Promise.delay(100)
      const grammar = new Grammar(grammarInput)

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
      console.warn(error)
    }
  }

  giveExample = async () => {
    // 如果输入框不为空，就直接运行输入框中的内容，防止误触
    if (!this.state.rulesInput) {
      await this.handleInputChange({target: {value: `S -> abA
A -> bc
A -> ε
      `}})
    }
    this.runAlgorithm()
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
          <EditableText
            multiline
            minLines={5}
            onChange={this.handleInputChange}
            value={this.state.rulesInput}
            id="rulesInput"
            placeholder="在此输入BNF并回车"
          />
          <Button onClick={this.giveExample} text={this.state.working ? '等' : '跑'}/>
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
