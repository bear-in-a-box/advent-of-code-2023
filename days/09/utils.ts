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
