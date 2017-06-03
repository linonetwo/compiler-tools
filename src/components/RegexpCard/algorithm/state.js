
export class StateSet extends Set {
  constructor (props) {
    super(props)
    return this
  }

  addSet = (s) => {
    for (let ele of s) this.add(ele)
    return this
  }

  eq = (s) => {
    if (!s || this.size !== s.size) { return false }
    for (let ele of this) {
      if (!s.has(ele)) { return false }
    }
    return true
  }

  diff = (s) => {
    for (let ele of s) {
      if (this.has(ele)) { this.delete(ele) }
    }
    return this
  }

  subset = (pred) => {
    const s = new StateSet()
    for (let ele of this) {
      if (pred(ele)) { s.add(ele) }
    }
    return s
  }

  subsetOf = (s) => {
    for (let ele of this) {
      if (!s.has(ele)) { return false }
    }
    return true
  }
}




export const getNode = (src, dest, label) => ({ src, dest, label })
