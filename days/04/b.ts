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

const matchesPerGame: number[] = []
const instances: number[] = []

reader.on('line', parseLine)
reader.on('close', onGamesParseFinish)

function parseLine(line: string) {
  const [, data] = line.split(': ', 2)
  const [winning, mine] = data.split(' | ', 2)
  const test = new Set(winning.split(/\s+/))
  const candidates = mine.split(/\s+/)
  const matching = candidates.filter((c) => test.has(c))
  matchesPerGame.push(matching.length)
  instances.push(1)
}

function onGamesParseFinish() {
  copyInstances()
  printResult()
}

function copyInstances() {
  matchesPerGame.forEach((matches, index) => {
    for (let i = 1; i <= matches; i++) {
      instances[index + i] += instances[index]
    }
  })
}

function printResult() {
  const sum = [...instances.values()].reduce((acc, v) => acc + v, 0)
  console.log('Sum:', sum)
}
