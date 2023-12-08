import { readFileSync } from 'fs'
import { join } from 'path'
import { performance } from 'perf_hooks'

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
function traverse(start: string): number {
  let current = start
  let moveIndex = 0
  let steps = 0
  while (!current.endsWith('Z')) {
    steps++
    const nextMove = nextNode[moves[moveIndex]]
    const target = nodes.get(current)![nextMove]
    current = target
    moveIndex++
    moveIndex %= moves.length
  }
  return steps
}

function gcd(a: number, b: number): number {
  if (b === 0) return a
  return gcd(b, a % b)
}

function lcm(a: number, b: number): number {
  return (a * b) / gcd(a, b)
}

const start = performance.now()
const startNodes = [...nodes.keys()].filter((node) => node.endsWith('A'))
const result = startNodes.map(traverse).reduce((acc, v) => lcm(acc, v), 1)
const end = performance.now()

console.log('Result:', result)
console.log('Time spent:', (end - start).toFixed(2), 'ms')
