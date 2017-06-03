import { getEdge } from './state'

// 创建子 NFA，头部和尾部都是同一个编号，中间路径为空
const getEmptyNfa = head => ({ head, tail: head, path: [] })

const mergeSub = (subterms, head, tail, store) => subterms.map(subterm => {
  store.push(getEdge(head, subterm.head, 'ε'))
  store.push.apply(store, subterm.path)
  store.push(getEdge(subterm.tail, tail, 'ε'))
})


const constructNfa = (state) => {
  const nfas = []
  let subNFA = getEmptyNfa(state.stateCount++)
  let currentStateID
  let subNFAs
  // http://sist.shanghaitech.edu.cn/faculty/songfu/course/spring2017/cs131/ch3.pdf p89
  while (true) {
    // 1. 取得当前字符
    let character = state.input[state.position]
    // 2. 移动指针
    state.position++
    switch (character) {
      case '*':
        throw new Error(`第${state.position}个字符 * 意义不明，应该是打错了`)
      case '+':
        if (subNFA.path.length) { nfas.push(subNFA) }
        subNFA = getEmptyNfa(state.stateCount++)
        break
      case '(':
        subNFAs = constructNfa(state)
        currentStateID = state.stateCount++
        if (state.input[state.position] === '*') {
          state.position++
          subNFA.path.push(getEdge(subNFA.tail, currentStateID, 'ε'))
          mergeSub(subNFAs, subNFA.tail, subNFA.tail, subNFA.path)
        } else {
          mergeSub(subNFAs, subNFA.tail, currentStateID, subNFA.path)
        }
        subNFA.tail = currentStateID
        break
      case ')':
      case undefined:
        nfas.push(subNFA)
        return nfas
      default:
        // 1. 把这个字符放入 bloom filter
        state.dict[character] = true
        // 2. 获得状态编号
        currentStateID = state.stateCount
        state.stateCount++
        if (state.input[state.position] === '*') {
          // 3. 移动指针并开始构造一个返回 NFA 开头的环
          // http://sist.shanghaitech.edu.cn/faculty/songfu/course/spring2017/cs131/ch3.pdf p95
          state.position++
          subNFA.path.push(getEdge(subNFA.tail, currentStateID, 'ε'))
          subNFA.path.push(getEdge(subNFA.tail, subNFA.tail, character))
        } else {
          subNFA.path.push(getEdge(subNFA.tail, currentStateID, character))
        }
        subNFA.tail = currentStateID
    }
  }
}

const regexp2nfa = (input) => {
  const state = {
    input,
    dict: {},
    position: 0,
    stateCount: 1, // 0 is preserved for initiator
  }
  const edges = []
  const nfa = constructNfa(state)
  if (state.stateCount > 1) {
    mergeSub(nfa, 0, state.stateCount, edges)
  } else {
    throw new Error('空的表达式，林东吴没在前端做好错误处理')
  }

  if (state.position - input.length !== 1) {
    throw new Error('有括号没闭合，请检查输入')
  }

  return { states: new Array(state.stateCount + 1).fill(0).map((_, i) => i), edges, terminals: [state.stateCount], dict: Object.keys(state.dict) }
}

export {regexp2nfa}
