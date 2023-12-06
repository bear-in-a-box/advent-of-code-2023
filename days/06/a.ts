import { readFileSync } from 'fs'
import { join } from 'path'

const file = join(__dirname, './input.txt')

const races = (() => {
  const lines = readFileSync(file).toString('utf8').split('\n', 2)
  const [times, distances] = lines.map((line) => {
    const [, ...values] = line.split(/\s+/)
    return values.map(Number)
  })
  return times.map((time, index) => [time, distances[index]])
})()

let result = 1
for (const [time, distance] of races) {
  result *= getNumberOfWays(time, distance)
}

console.log('Result:', result)

function getNumberOfWays(time: number, distance: number): number {
  let ways = 0
  for (let t = 0; t <= time; t++) {
    if (tryHoldButtonFor(t, time, distance)) {
      ways++
    }
  }
  return ways
}

function tryHoldButtonFor(
  timeHold: number,
  timeLimit: number,
  distance: number
): boolean {
  const speed = timeHold
  const timeLeft = timeLimit - timeHold
  const distanceDriven = timeLeft * speed
  return distanceDriven > distance
}
