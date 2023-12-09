import { generateSequences, getHistoryFromLine } from './utils'

const extrapolate = (sequences: number[][]): number[][] => {
  for (let y = sequences.length - 1; y >= 0; y--) {
    const row = sequences[y]
    if (y === sequences.length - 1) {
      row.unshift(0)
      continue
    }
    const rowBelow = sequences[y + 1]
    const x = 0
    const below = rowBelow[x]
    const toTheRight = row[x]
    const cellValue = toTheRight - below
    row.unshift(cellValue)
  }
  return sequences
}

const getHistoryValue = (sequences: number[][]): number => sequences[0][0]

export const calculateHistoryValueForLine = (line: string): number => {
  const start = getHistoryFromLine(line)
  const sequences = generateSequences(start)
  const extrapolated = extrapolate(sequences)
  const historyValue = getHistoryValue(extrapolated)
  return historyValue
}
