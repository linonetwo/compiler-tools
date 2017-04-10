import { forEach } from 'lodash'
import React from 'react'
import Gun from 'gun'

import { ResultCard } from '../components/ResultCard'

import plcKnowledge from '../../knowledge_modules/programming-languages-and-compilers/build/main'

const gun = Gun()

forEach(plcKnowledge, (item) => {
  // (a)
  const { example, principle, title, tags } = item
  const node = gun.get(title).put({ example, principle, title, tags: tags.join(',') })
  // (:Note)->(a)
  gun.get('note').set(node)
  for (const tag of tags) {
    // (:SomeTag)->(a)
    gun.get(tag).set(node)
  }
})

export class CardFlow extends React.Component {
  state = {
    results: []
  }

  componentDidMount () {
    gun.get('note').map().val(item => {
      this.setState(prevState => ({
        results: [...prevState.results, item]
      }))
    })
  }
  render () {
    return (
      <article>
        {this.state.results.map(({ title, tags, example, principle }) =>
          <ResultCard
            key={title}
            tags={tags.split(',')}
            example={example}
            principle={principle}
          />
        )}
      </article>
    )
  }
}
