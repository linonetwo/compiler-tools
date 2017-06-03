import { getEdge, StateSet } from './state'

const newState = (index, nfaStates, isTerminal) => ({index, nfaStates, isTerminal})

const procNfa = ({states, edges, terminals, dict}) => {
  const adjecent = characterInTheEdge => {
    const emptySets = states.reduce((prev, stateIndex) => {
      prev[stateIndex] = new StateSet()
      return prev
    }, {})
    return edges
      .filter(edge => edge.label === characterInTheEdge)
      .reduce((previous, current) => {
        previous[current.src].add(current.dest)
        return previous
      }, emptySets)
  }

  const εClosure = adjecent('ε')
  for (let index = 0, change = true; index < states.length && change; index++) {
    change = false
    states.map(st => {
      const s = εClosure[st]
      const size = s.size
      s.add(st)
      s.forEach(e => s.addSet(εClosure[e]))
      change = change || s.size > size
    })
  }

  const trans = dict
    .map(adjecent)
    .map(trans => {
      states.map(st => {
        const s = new StateSet()
        εClosure[st].forEach(ele => s.addSet(trans[ele]))
        s.forEach(ele => s.addSet(εClosure[ele]))
        trans[st] = s
      })
      return trans
    })

  const closure = dict.reduce((closureToBuild, characterInTheEdge, index) => {
    closureToBuild[characterInTheEdge] = trans[index]
    return closureToBuild
  }, {})
  closure['ε'] = εClosure

  return {closure, dict, terminals}
}

const nfa2dfa = (nfa, detail = false) => {
  const { closure, dict, terminals } = procNfa(nfa)
  const states = [closure['ε'][0]]
  const newState = [closure['ε'][0]]
  const edges = []

  while (newState.length) {
    const curState = newState.shift()
    const src = states.indexOf(curState)
    dict.map(characterInTheEdge => {
      let nxtState = new StateSet()
      curState.forEach(s => nxtState.addSet(closure[characterInTheEdge][s]))
      if (!nxtState.size) { return } // no feasible path
      let dest = states.findIndex(s => s.eq(nxtState))
      if (dest < 0) {
        newState.push(nxtState)
        dest = states.push(nxtState) - 1
      }
      edges.push(getEdge(src, dest, characterInTheEdge))
    })
  }

  // DOT label for node
  const nodeFmt = (s, i) => ({
    id: i,
    label: `${i}\n(${Array.from(s).join()})`,
    terminal: terminals.some(t => s.has(t))
  })

  return {
    edges,
    nodes: detail ? states.map(nodeFmt) : null,
    terminals: states.map((s, i) => ({s, i})).filter(({s}) => terminals.some(t => s.has(t))).map(({i}) => i),
    dict,
  }
}

export {nfa2dfa}
