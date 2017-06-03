import { concat } from 'lodash'
import { getEdge } from './state'

// 创建子 NFA，头部和尾部都是同一个编号，中间路径为空
const getEmptyNfa = head => ({ head, tail: head, path: [] })

const mergeSubNFAs = (subNFAs, head, tail, currentNFAPath) => subNFAs.map(aSubNFA => {
  // (current'sTail)-[ε]->(subNFA'sHead)
  currentNFAPath.push(getEdge(head, aSubNFA.head, 'ε'))
  // push full path into currentNFAPath
  Array.prototype.push.apply(currentNFAPath, aSubNFA.path)
  // (subNFA'sTail)-[ε]->(current'sTail)
  currentNFAPath.push(getEdge(aSubNFA.tail, tail, 'ε'))
})


const constructNfa = (state) => {
  const nfas = []
  let currentSubNFA = getEmptyNfa(state.stateCount++)
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
        if (currentSubNFA.path.length) { nfas.push(currentSubNFA) }
        currentSubNFA = getEmptyNfa(state.stateCount++)
        break
      case '(':
        // 1. 构造子 NFA
        subNFAs = constructNfa(state)
        currentStateID = state.stateCount
        // 2. 移动指针位置，以便看下一个是不是克林闭包
        state.stateCount++
        if (state.input[state.position] === '*') {
          // 3. 移动指针并开始构造一个返回 NFA 开头的环
          state.position++
          currentSubNFA.path.push(getEdge(currentSubNFA.tail, currentStateID, 'ε'))
          // 4. 把括号内的子 NFA 合并到当前 NFA 的路径里
          mergeSubNFAs(subNFAs, currentSubNFA.tail, currentSubNFA.tail, currentSubNFA.path)
        } else {
          mergeSubNFAs(subNFAs, currentSubNFA.tail, currentStateID, currentSubNFA.path)
        }
        currentSubNFA.tail = currentStateID
        break
      case ')':
      case undefined:
        nfas.push(currentSubNFA)
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
          currentSubNFA.path.push(getEdge(currentSubNFA.tail, currentStateID, 'ε'))
          currentSubNFA.path.push(getEdge(currentSubNFA.tail, currentSubNFA.tail, character))
        } else {
          currentSubNFA.path.push(getEdge(currentSubNFA.tail, currentStateID, character))
        }
        currentSubNFA.tail = currentStateID
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
    mergeSubNFAs(nfa, 0, state.stateCount, edges)
  } else {
    throw new Error('空的表达式，林东吴没在前端做好错误处理')
  }

  if (state.position - input.length !== 1) {
    throw new Error('有括号没闭合，请检查输入')
  }

  return { states: new Array(state.stateCount + 1).fill(0).map((_, i) => i), edges, terminals: [state.stateCount], dict: Object.keys(state.dict) }
}

export {regexp2nfa}
