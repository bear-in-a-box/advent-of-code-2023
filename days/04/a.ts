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

let sum = 0

reader.on('line', parseLine)
reader.on('close', printResult)

function printResult() {
  console.log('Sum:', sum)
}

function parseLine(line: string) {
  const [, data] = line.split(': ', 2)
  const [winning, mine] = data.split(' | ', 2)
  const test = new Set(winning.split(/\s+/))
  const candidates = mine.split(/\s+/)
  const matching = candidates.filter((c) => test.has(c))
  const score = matching.length ? Math.pow(2, matching.length - 1) : 0
  sum += score
}
