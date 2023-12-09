import { createReadStream } from 'fs'
import { join } from 'path'
import { createInterface } from 'readline'

import { calculateHistoryValueForLine } from './a.utils'

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

function parseLine(line: string) {
  sum += calculateHistoryValueForLine(line)
}

function printResult() {
  console.log('Sum:', sum)
}
