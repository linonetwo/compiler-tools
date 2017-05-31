import Viz from 'viz.js'

import { SPECIAL_TYPE, EMPTY_TYPE, SPECIAL_CHILD_SUBTYPE, SPECIAL_EDGE_TYPE, EMPTY_EDGE_TYPE } from '../GraphViews'

type edges = Array<{src: string, dest: string, label: string}>
type nodes = Array<{id: string, label: string, terminal: boolean}>
type terminals = Array<number>
type props = {edges: edges, nodes: nodes, terminals: terminals}

export function getGraphDescription ({ edges, terminals, nodes }: props) {
  const edgeDefination = edges
    .map(({ src, dest, label }) => `${src} -> ${dest} [ label="${label === 'ε' ? '&epsilon;' : label}" ];`)
    .join('')
  const nodeDefination = nodes
  ? nodes
      .map(({ id, label, terminal }) => `${id} [ label="${label}" shape="${terminal ? 'doublecircle' : 'circle'}" ];`)
      .join('')
  : terminals
      .map(t => `${t} [shape="doublecircle"];`)
      .join('')
  return `
    digraph G {
      rankdir="LR";
      node [shape="circle"];
      ${nodeDefination}
      ${edgeDefination}
    }
  `
}

export function getGraph ({ edges, terminals, nodes }: props) {
  const description = getGraphDescription({ edges, terminals, nodes })
  const graphXML = Viz(description)
  return graphXML
}

