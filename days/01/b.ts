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

const replacements: Record<string, string> = {
  zero: '0',
  one: '1',
  two: '2',
  three: '3',
  four: '4',
  five: '5',
  six: '6',
  seven: '7',
  eight: '8',
  nine: '9',
}

const mapDigit = (v: string) => replacements[v] || v

function parseLine(line: string) {
  const digits = [
    ...line.matchAll(
      /(?=(zero|one|two|three|four|five|six|seven|eight|nine|[0-9]))/g
    ),
  ].map(([, digit]) => mapDigit(digit))
  const first = digits.at(0) || ''
  const last = digits.at(-1) || ''
  const number = first + last
  sum += Number(number)
}
