import { forEach } from 'lodash'
import React from 'react'
import Gun from 'gun'

import { ResultCard } from '../components/ResultCard'
import { RegexpCard } from '../components/RegexpCard'
import { FirstFollowCard } from '../components/FirstFollowCard'
import { SearchCard } from '../components/SearchCard'

import plcKnowledge from '../../knowledge_modules/compiler/build/main'

const gun = Gun()

window.localStorage.clear()

forEach(plcKnowledge, (item) => {
  // (a)
  const { example, principle, title, tags } = item
  const node = gun.get('Note').path(title).put({ example, principle, title, tags: tags.join(',') })
  // (:Note)->(a)
  for (const tag of tags) {
    // (:SomeTag)->(a)
    gun.get('tags').path(tag).set(node)
  }
})

export class CardFlow extends React.Component {
  state = {
    tags: [],
    results: [],
    selectedTags: [],
  }

  componentDidMount () {
    gun.get('Note').map().val(item => {
      this.setState(prevState => ({
        results: [...prevState.results, item]
      }))
    })

    gun.get('tags').map().val((notes, tag) => {
      this.setState(prevState => ({
        tags: [...prevState.tags, tag, 'app-regexp', 'app-firstfollow']
      }))
    })
  }

  selectTag = (tag) => {
    this.setState({
      selectedTag: tag,
      results: []
    }, () => {
      if (/^app-/.test(tag)) {
        return
      }
      gun.get('tags').path(tag).map().val((notes, tag) => {
        this.setState(prevState => ({
          results: [...prevState.results, notes]
        }))
      })
    })
  }

  render () {
    return (
      <article>
        <SearchCard selectTag={this.selectTag} selectedTags={this.state.selectedTag} tags={this.state.tags} />
          {this.state.selectedTag === 'app-regexp' ? <RegexpCard /> : ''}
          {this.state.selectedTag === 'app-firstfollow' ? <FirstFollowCard /> : ''}
          {this.state.results.map(({ title, tags, example, principle }) =>
            <ResultCard
              key={title}
              tags={tags.length > 0 ? tags.split(',') : []}
              example={example}
              principle={principle}
            />
          )}
      </article>
    )
  }
}
