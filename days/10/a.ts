import { readFileSync } from 'fs'
import { join } from 'path'

const file = join(__dirname, './input.txt')

const map = readFileSync(file)
  .toString('utf8')
  .split('\n')
  .filter(Boolean)
  .map((y) => y.split(''))

const distances: (number | null)[][] = Array.from({ length: map.length }).map(
  () => Array.from({ length: map[0].length }).map(() => null)
)

const startingPoint = (() => {
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[0].length; x++) {
      if (map[y][x] === 'S') return [x, y] as [number, number]
    }
  }
  throw new Error('No starting point')
})()

type Coord = [number, number]

/** [x, y] candidates */
const d = {
  up: [0, -1] as Coord,
  down: [0, 1] as Coord,
  left: [-1, 0] as Coord,
  right: [1, 0] as Coord,
}
const deltas: Record<string, Coord[]> = {
  S: [d.up, d.down, d.left, d.right],
  '|': [d.up, d.down],
  '-': [d.left, d.right],
  L: [d.up, d.right],
  J: [d.up, d.left],
  7: [d.down, d.left],
  F: [d.down, d.right],
  '.': [],
}

const getPoint = ([x, y]: Coord): string => map[y][x]
const getDistance = ([x, y]: Coord): number | null => distances[y][x]
const isVisited = (c: Coord): boolean => getDistance(c) !== null
const isMoveAllowed = (to: Coord, from: Coord): boolean => {
  const dx = to[0] - from[0]
  const dy = to[1] - from[1]
  const toPoint = getPoint(to)
  if (dy === -1) return ['|', '7', 'F'].includes(toPoint)
  if (dy === 1) return ['|', 'L', 'J'].includes(toPoint)
  if (dx === -1) return ['-', 'L', 'F'].includes(toPoint)
  if (dx === 1) return ['-', '7', 'J'].includes(toPoint)
  return false
}
const markDistance = ([x, y]: Coord, distance: number) =>
  (distances[y][x] = distance)
const move = ([dx, dy]: Coord, [x, y]: Coord): Coord => [x + dx, y + dy]
const canGo = (to: Coord, from: Coord): boolean => {
  const [x, y] = to
  if (y < 0 || y >= map.length || x < 0 || x >= map[0].length) return false
  if (!isMoveAllowed(to, from)) return false
  if (isVisited(to)) return false

  return true
}

const findTargets = (from: Coord): Coord[] => {
  const point = getPoint(from)
  const candidates = deltas[point] ?? []
  const possible = candidates
    .map((delta) => move(delta, from))
    .filter((to) => canGo(to, from))
  return possible
}

let max = 0
;(function go() {
  const queue: Coord[] = [startingPoint]
  markDistance(startingPoint, 0)
  while (queue.length) {
    const current = queue.shift()!
    const distance = getDistance(current)!
    const targets = findTargets(current)
    for (const target of targets) {
      markDistance(target, distance + 1)
      if (distance + 1 > max) max = distance + 1
      queue.push(target)
    }
  }
})()

console.log('Result:', max)
