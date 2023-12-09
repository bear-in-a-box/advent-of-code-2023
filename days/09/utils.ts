const getHistoryFromLine = (line: string) => line.split(' ').map(Number)

const calculateDiff = (step: number[]): number[] =>
  step.slice(1).reduce<number[]>((acc, v, i) => {
    acc.push(v - step[i])
    return acc
  }, [])

const isFinalDiff = (step: number[]): boolean => step.every((v) => v === 0)

const generateSequences = (start: number[]): number[][] => {
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
