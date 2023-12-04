import { createReadStream } from 'fs'
import { join } from 'path'
import { createInterface } from 'readline'

const file = join(__dirname, './input.txt')

const reader = createInterface({
  input: createReadStream(file, {
    encoding: 'utf8',
  }),
  crlfDelay: Infinity,
})

const instances = new Map<number, number>()

reader.on('line', parseLine)
reader.on('close', printResult)

let game = 0
function parseLine(line: string) {
  const matches = countMatches(line)
  addCurrentCard()
  copyCards(matches)
  game++
}

function countMatches(line: string): number {
  const [, data] = line.split(': ', 2)
  const [winning, mine] = data.split(' | ', 2)
  const test = new Set(winning.split(/\s+/))
  const candidates = mine.split(/\s+/)
  const matches = candidates.filter((c) => test.has(c)).length

  return matches
}

function addCurrentCard() {
  const v = instances.get(game) ?? 0
  instances.set(game, v + 1)
}

function copyCards(matches: number) {
  for (let i = 1; i <= matches; i++) {
    const v = instances.get(game + i) ?? 0
    instances.set(game + i, v + instances.get(game)!)
  }
}

function printResult() {
  const sum = [...instances.values()].reduce((acc, v) => acc + v, 0)
  console.log('Sum:', sum)
}
