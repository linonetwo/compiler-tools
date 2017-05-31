import { trans, EPS } from './state'

const createTerm = head => ({ h: head, t: head, p: [] })

const mergeSub = (subterms, h, t, store) => subterms.map(subterm => {
  store.push(trans(h, subterm.h, EPS))
  store.push.apply(store, subterm.p)
  store.push(trans(subterm.t, t, EPS))
})


const constructNfa = (state) => {
  const terms = []
  let term = createTerm(state.stateCount++)
  let i, subterms

  while (true) {
    let c = state.exp[state.position++]
    switch (c) {
      case '*':
        throw new Error(`在${state.position}位置有一个意义不明的 *`)
      case '|':
        if (term.p.length) { terms.push(term) }
        term = createTerm(state.stateCount++)
        break
      case '(':
        subterms = constructNfa(state)
        i = state.stateCount++
        if (state.exp[state.position] === '*') {
          state.position++
          term.p.push(trans(term.t, i, EPS))
          mergeSub(subterms, term.t, term.t, term.p)
        } else {
          mergeSub(subterms, term.t, i, term.p)
        }
        term.t = i
        break
      case ')':
      case undefined:
        terms.push(term)
        return terms
      default:
        state.dict[c] = true
        i = state.stateCount++
        if (state.exp[state.position] === '*') {
          state.position++
          term.p.push(trans(term.t, i, EPS))
          term.p.push(trans(term.t, term.t, c))
        } else {
          term.p.push(trans(term.t, i, c))
        }
        term.t = i
    }
  }
}

const regexp2nfa = (exp) => {
  const state = {
    exp,
    dict: {},
    position: 0,
    stateCount: 1, // 0 is preserved for initiator
  }
  const edges = []
  const nfa = constructNfa(state)
  if (state.stateCount > 1) {
    mergeSub(nfa, 0, state.stateCount, edges)
  } else {
    throw new Error('空的表达式')
  }

  if (state.position - exp.length !== 1) {
    throw new Error('有括号没闭合，请检查输入')
  }

  return { states: new Array(state.stateCount + 1).fill(0).map((_, i) => i), edges, terminals: [state.stateCount], dict: Object.keys(state.dict) }
}

export {regexp2nfa}
