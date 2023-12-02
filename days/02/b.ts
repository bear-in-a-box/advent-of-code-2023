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

function calculatePower(game: string): number {
  const max: Record<string, number> = {
    red: 0,
    green: 0,
    blue: 0,
  }
  const moves = game.split(/[,;] /g).map((move) => move.split(' ', 2))
  for (const [amount, color] of moves) {
    max[color] = Math.max(max[color], +amount)
  }
  return max.red * max.green * max.blue
}

function parseLine(line: string) {
  const [title, game] = line.split(': ', 2)
  const id = Number(title.split(' ', 2)[1])

  sum += calculatePower(game)
}
