import Promise from 'bluebird'
import React from 'react'
import Measure from 'react-measure'
import Markdown from 'react-markdown'
import styled from 'styled-components'


import { regexp2nfa, nfa2dfa, dfa2mindfa, getGraph } from './algorithm'
import GraphViews from './GraphViews'

import '@blueprintjs/core/dist/blueprint.css'
import '../ResultCard.css'

const ControlWidthHeight = styled.div`
  width: ${props => props.width}px;
  height: calc(${props => props.height}px + 100px);
`



export class RegexpCard extends React.Component {
  static defaultProps = {
    tags: ['NFA', 'DFA', 'regexp', 'visualization'],
  }
  state = {
    working: false,
    graphs: [],
    regexpInput: '',
    dimensions: {
      width: -1,
      height: -1
    }
  }

  graphOption = {
    layout: {
      hierarchical: true
    },
    edges: {
      color: '#000000'
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
    if (this.state.working) return

    this.setState({ working: true, graphs: [] })

    if (event.charCode === 13) {
      const graphs = []
      // 为了在未来能进一步为客户提升算法效率，先延迟 100 毫秒
      await Promise.delay(100)
      const nfa = regexp2nfa(this.state.regexpInput)
      const nfaXml = getGraph(nfa)
      graphs.push({name: 'NFA', xml: nfaXml})
      this.setState({ graphs })
      // 将同步任务拆到不久的未来的事件循环，塑造出不卡的错觉
      await Promise.delay(10)
      const dfa = nfa2dfa(nfa)
      const dfaXml = getGraph(dfa)
      graphs.push({name: 'DFA', xml: dfaXml})
      this.setState({ graphs })
      // 异步加载最后一个图
      await Promise.delay(10)
      const mindfa = dfa2mindfa(dfa)
      const mindfaXml = getGraph(mindfa)
      graphs.push({name: 'minified DFA', xml: mindfaXml})
      this.setState({ graphs, working: false })
    }
  }

  giveExample = async () => {
    await this.handleInputChange({target: {value: '林(东*吴)*|(吴东)*林'}})
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
            onKeyPress={this.runAlgorithm}
            value={this.state.regexpInput}
            type="text"
            id="regexpInput"
            placeholder="在此输入正则表达式"
          />
          <button onClick={this.giveExample}>{this.state.working ? '等' : '例'}</button>
          <GraphViews
            style={{ height: 800 }}
            graphs={this.state.graphs}
          />
        </article>)}
        </section>
    </ControlWidthHeight>
    )
  }
}
