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
    // http://sist.shanghaitech.edu.cn/faculty/songfu/course/spring2017/cs131/ch3.pdf p71
    states.map(aState => {
      const closureOfState = εClosure[aState]
      const size = closureOfState.size
      closureOfState.add(aState)
      closureOfState.forEach(element => closureOfState.addSet(εClosure[element]))
      change = change || closureOfState.size > size
    })
  }

  const trans = dict
    .map(adjecent)
    .map(trans => {
      states.map(aState => {
        const stateSet = new StateSet()
        εClosure[aState].forEach(element => stateSet.addSet(trans[element]))
        stateSet.forEach(element => stateSet.addSet(εClosure[element]))
        trans[aState] = stateSet
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

export const nfa2dfa = (nfa, detail = false) => {
  const { closure, dict, terminals } = procNfa(nfa)
  const states = [closure['ε'][0]]
  const newState = [closure['ε'][0]]
  const edges = []

  while (newState.length) {
    const curState = newState.shift()
    const src = states.indexOf(curState)
    dict.map(characterInTheEdge => {
      let nextState = new StateSet()
      curState.forEach(s => nextState.addSet(closure[characterInTheEdge][s]))
      if (!nextState.size) { return } // no feasible path
      let dest = states.findIndex(s => s.equal(nextState))
      if (dest < 0) {
        newState.push(nextState)
        dest = states.push(nextState) - 1
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
