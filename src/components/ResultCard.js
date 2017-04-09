import React from 'react'

import Markdown from 'react-markdown'

import '@blueprintjs/core/dist/blueprint.css'

import input from '../../knowledge_modules/programming-languages-and-compilers/build/main'

export class ResultCard extends React.Component {
  render () {
    return (
      <section className="pt-card pt-elevation-2 pt-interactive">
        <Markdown source={input.test.example} />
      </section>
    )
  }
}
