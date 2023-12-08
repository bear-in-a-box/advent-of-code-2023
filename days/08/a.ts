import { readFileSync } from 'fs'
import { join } from 'path'

const file = join(__dirname, './input.txt')

const [moves, , ...connections] = readFileSync(file)
  .toString('utf8')
  .split('\n')

const nextNode: Record<string, number> = { L: 0, R: 1 }

const nodes = new Map<string, [string, string]>(connections.map(parseNodeEntry))

function parseNodeEntry(line: string): [string, [string, string]] {
  const { node, left, right } = line.match(
    /^(?<node>\w+) = \((?<left>\w+), (?<right>\w+)\)$/
  )!.groups!
  return [node, [left, right]]
}

/**
 * @returns Steps required to reach ZZZ
 */
function traverse(): number {
  let node = 'AAA'
  let moveIndex = 0
  let steps = 0
  while (node !== 'ZZZ') {
    steps++
    const nextMove = nextNode[moves[moveIndex]]
    const target = nodes.get(node)![nextMove]
    node = target
    moveIndex++
    moveIndex %= moves.length
  }
  return steps
}

const result = traverse()

console.log('Result:', result)
