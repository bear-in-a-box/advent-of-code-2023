import { createReadStream } from 'fs'
import { join } from 'path'
import { createInterface } from 'readline'

const file = join(__dirname, './example.txt')

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
  const digits = line.replaceAll(/\D/g, '').split('')
  const first = digits.at(0) || ''
  const last = digits.at(-1) || ''
  const number = first + last
  sum += Number(number)
}
