import { generateSequences, getHistoryFromLine } from './utils'

const extrapolate = (sequences: number[][]): number[][] => {
  for (let y = sequences.length - 1; y >= 0; y--) {
    const row = sequences[y]
    if (y === sequences.length - 1) {
      row.push(0)
      continue
    }
    const rowBelow = sequences[y + 1]
    const x = row.length - 1
    const below = rowBelow[x]
    const toTheLeft = row[x]
    const cellValue = below + toTheLeft
    row.push(cellValue)
  }
  return sequences
}

const getHistoryValue = (sequences: number[][]): number => sequences[0].at(-1)!

export const calculateHistoryValueForLine = (line: string): number => {
  const start = getHistoryFromLine(line)
  const sequences = generateSequences(start)
  const extrapolated = extrapolate(sequences)
  const historyValue = getHistoryValue(extrapolated)
  return historyValue
}
