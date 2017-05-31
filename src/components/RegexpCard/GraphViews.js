import React from 'react'

export default function GraphViews ({ style, graphs }) {
  return (
    <div>
    {
      graphs.map(({ xml, name }) => <div key={name}>
        <text>{name}</text>
        <div dangerouslySetInnerHTML={{ __html: xml }} />
      </div>)
    }
    </div>
  )
}
