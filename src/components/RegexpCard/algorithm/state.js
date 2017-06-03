
export class StateSet extends Set {
  constructor (props) {
    super(props)
    return this
  }

  addSet = (set) => {
    for (const element of set) this.add(element)
    return this
  }

  equal = (set) => {
    if (!set || this.size !== set.size) { return false }
    for (const element of this) {
      if (!set.has(element)) { return false }
    }
    return true
  }

  diff = (set) => {
    for (const element of set) {
      if (this.has(element)) { this.delete(element) }
    }
    return this
  }

  subset = (pred) => {
    const set = new StateSet()
    for (const element of this) {
      if (pred(element)) { set.add(element) }
    }
    return set
  }

  subsetOf = (set) => {
    for (const element of this) {
      if (!set.has(element)) { return false }
    }
    return true
  }
}




export const getEdge = (src: number, dest: number, label) => ({ src, dest, label })
