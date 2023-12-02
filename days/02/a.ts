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

const limit: Record<string, number> = {
  red: 12,
  green: 13,
  blue: 14,
}

reader.on('line', parseLine)
reader.on('close', printResult)

function printResult() {
  console.log('Sum:', sum)
}

function isSetPossible(set: string): boolean {
  const moves = set.split(', ')
  for (const move of moves) {
    const [amount, color] = move.split(' ', 2)
    if (Number(amount) > limit[color]) {
      return false
    }
  }
  return true
}

function parseLine(line: string) {
  const [title, game] = line.split(': ', 2)
  const id = Number(title.split(' ', 2)[1])

  const sets = game.split('; ')
  if (sets.every(isSetPossible)) {
    sum += id
  }
}
