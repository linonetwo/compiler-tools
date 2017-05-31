import React from 'react'
import { forEach, size } from 'lodash'
import styled from 'styled-components'

const Result = styled.div`
  display: flex;
  flex-direction: column;
`

export default function RenderSet ({ set, name }) {
  const lines = []
  forEach(set, (value, key) => {
    const characters = value
      .map(character => character === null ? 'ε' : character)
      .map(character => character === '\u0000' ? '$' : character)
    lines.push(`${key}: { ${characters.join(', ')} }`)
  })
  return (
    <Result>
      <text>{size(set) > 0 ? name : ''}</text>
      {
        lines.map(aLine => <text key={aLine}>
          {aLine}
        </text>)
      }
    </Result>
  )
}
