import { readFileSync } from 'fs'
import { join } from 'path'

const file = join(__dirname, './input.txt')

const GALAXY = '#'
const EMPTY = '.'

const map = readFileSync(file)
  .toString('utf8')
  .split('\n')
  .filter(Boolean)
  .map((y) => y.split(''))

;(function expandRows() {
  const emptyRowIndexes: number[] = []
  for (let i = 0; i < map.length; i++) {
    if (!map[i].includes(GALAXY)) {
      emptyRowIndexes.unshift(i)
    }
  }
  for (const index of emptyRowIndexes) {
    map.splice(
      index,
      0,
      Array.from({ length: map[0].length }).map(() => EMPTY)
    )
  }
})()
;(function expandColumns() {
  const emptyColumnIndexes: number[] = []
  for (let i = 0; i < map[0].length; i++) {
    if (map.every((row) => row[i] === EMPTY)) {
      emptyColumnIndexes.unshift(i)
    }
  }
  for (const index of emptyColumnIndexes) {
    for (const row of map) {
      row.splice(index, 0, EMPTY)
    }
  }
})()

type Point = { x: number; y: number }

const galaxies: Point[] = (function findGalaxies() {
  return map.flatMap(
    (row, y) =>
      row
        .map((cell, x) => {
          if (cell === GALAXY) {
            return { x, y }
          }
        })
        .filter(Boolean) as Point[]
  )
})()

const manhattanDistance = (a: Point, b: Point): number =>
  Math.abs(a.x - b.x) + Math.abs(a.y - b.y)

function* getDistances(): Generator<number> {
  for (let i = 0; i < galaxies.length; i++) {
    for (let j = i + 1; j < galaxies.length; j++) {
      yield manhattanDistance(galaxies[i], galaxies[j])
    }
  }
}

const result = (function findSumOfDistances() {
  let sum = 0
  for (const distance of getDistances()) {
    sum += distance
  }
  return sum
})()

console.log('Result:', result)
