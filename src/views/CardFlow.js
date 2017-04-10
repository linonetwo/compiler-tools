import React from 'react'

import { ResultCard } from '../components/ResultCard'

import plcKnowledge from '../../knowledge_modules/programming-languages-and-compilers/build/main'

export class CardFlow extends React.Component {
  render () {
    return (
      <article>
        <ResultCard example={plcKnowledge.tests.example} principle={plcKnowledge.tests.principle} />
      </article>
    )
  }
}
