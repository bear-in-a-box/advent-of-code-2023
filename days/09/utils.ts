import { createReadStream } from 'fs'
import { join } from 'path'
import { createInterface } from 'readline'

export const getHistoryFromLine = (line: string) => line.split(' ').map(Number)

const calculateDiff = (step: number[]): number[] =>
  step.slice(1).reduce<number[]>((acc, v, i) => {
    acc.push(v - step[i])
    return acc
  }, [])

const isFinalDiff = (step: number[]): boolean => step.every((v) => v === 0)

export const generateSequences = (start: number[]): number[][] => {
  const steps = [start]
  while (true) {
    const last = steps.at(-1)!
    const diff = calculateDiff(last)
    steps.push(diff)
    if (isFinalDiff(diff)) {
      break
    }
  }
  return steps
}

export const runForFile = (
  fileName: string,
  calculator: (line: string) => number
): void => {
  const file = join(__dirname, `./${fileName}.txt`)

  const reader = createInterface({
    input: createReadStream(file, {
      encoding: 'utf8',
    }),
    crlfDelay: Infinity,
  })

  let sum = 0

  reader.on('line', (line) => {
    if (!line) return
    sum += calculator(line)
  })
  reader.on('close', () => {
    console.log('Sum:', sum)
  })
}
