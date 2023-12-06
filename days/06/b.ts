import { readFileSync } from 'fs'
import { join } from 'path'

const file = join(__dirname, './input.txt')

const [time, distance] = (() => {
  const lines = readFileSync(file).toString('utf8').split('\n', 2)
  const [time, distance] = lines.map((line) =>
    Number(line.split(':', 2)[1].replaceAll(' ', ''))
  )
  return [time, distance]
})()

console.log('Time:', time)
console.log('Distance:', distance)

const result = getNumberOfWays(time, distance)

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
