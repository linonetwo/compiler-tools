import { getEdge, StateSet } from './state'

const enumerateNodes = edges => {
  const s = new StateSet()
  edges.forEach(({src, dest}) => { s.add(src); s.add(dest) })
  return Array.from(s)
}

const procDfa = ({ dict, nodes, edges, terminals }) => {
  const states = nodes ? nodes.map(({ id }) => id) : enumerateNodes(edges)
  const closure = states
    .reduce((previous, id) => {
      previous[id] = dict.reduce((setToBuild, characterOnTheEdge) => {
        const sameDestinations = edges.filter(anEdge => anEdge.src === id && anEdge.label === characterOnTheEdge).map(({dest}) => dest)
        setToBuild[characterOnTheEdge] = new StateSet(sameDestinations)
        return setToBuild
      }, {})
      return previous
    }, {})
  return {dict, closure, states, terminals}
}



export const dfa2mindfa = (dfa, detail = false) => {
  const { dict, closure, states, terminals } = procDfa(dfa)
  const stateSet = new StateSet(states)

  // Init state sets and split to two sets
  const stateSets = [stateSet.subset(s => terminals.indexOf(s) >= 0)]

  // if all nodes are terminal, ignore the other set
  stateSets[0].size < stateSet.size && stateSets.unshift(stateSet.diff(stateSets[0]))

  for (let i = 0, change = true; i <= states.length && change; i++) {
    change = false
    dict.map(character => change || stateSets.map(stateSet => {
      if (change) return
      const s = new StateSet()
      let hasEmpty = false
      for (let element of stateSet) { closure[element][character].size === 0 ? hasEmpty = true : s.addSet(closure[element][character]) }

      if (!s.size) { return } else if (!hasEmpty) {
        for (let curSet of stateSets) {
          // no need to split
          if (s.subsetOf(curSet)) {
            return
          }
        }
      }
      // http://sist.shanghaitech.edu.cn/faculty/songfu/course/spring2017/cs131/ch3.pdf p116
      let splitSet
      for (let splitState of stateSet) {
        let aClosure = closure[splitState][character]
        if (!aClosure.size) continue

        let element = Array.from(aClosure)[0]

        for (let splitStateSet of stateSets) {
          if (splitStateSet.has(element)) { splitSet = splitStateSet }
        }
      }

      if (splitSet === undefined) {
        throw new Error('无法分成子集')
      }

      const newSubset = stateSet.subset(state => closure[state][character].size && closure[state][character].subsetOf(splitSet))
      stateSet.diff(newSubset)
      stateSets.push(newSubset)
      change = true
    }))
  }

  const newStates = stateSets.filter(s => s.size).map(s => Array.from(s)).sort((a, b) => {
    if (a.indexOf(0) >= 0) {
      return b.indexOf(0) >= 0 ? a.length - b.length : -1
    }
    if (b.indexOf(0) >= 0) {
      return 1
    }
    return a.reduce((s, i) => s + i, 0) / a.length - b.reduce((s, i) => s + i, 0) / b.length
  })

  const stateMap = newStates.reduce((map, newState, i) => {
    newState.forEach(p => { map[p] = i })
    return map
  }, {})

  const edgeComp = (a, b) => a.src - b.src || a.dest - b.dest || (a.label < b.label ? -1 : a.label > b.label ? 1 : 0)

  const edges = dfa.edges.map(e => getEdge(stateMap[e.src], stateMap[e.dest], e.label))
    .sort(edgeComp)
    .reduce((a, e, i, arr) => {
      if (!i || edgeComp(e, arr[i - 1])) a.push(e)
      return a
    }, [])

  const state2Node = (state, index) => ({
    id: index,
    label: `${index}\n(${state.join()})`,
    terminal: terminals.some(terminal => state.indexOf(terminal) >= 0)
  })

  return {
    edges,
    nodes: detail ? newStates.map(state2Node) : null,
    terminals: newStates.map((s, i) => ({s, i})).filter(({s}) => terminals.some(t => s.indexOf(t) >= 0)).map(({i}) => i),
    dict
  }
}
