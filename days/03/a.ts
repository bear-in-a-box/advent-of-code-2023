import { readFileSync } from 'fs'
import { join } from 'path'

const file = join(__dirname, './input.txt')

const input = readFileSync(file).toString('utf8')
const lines = input.split('\n')

let sum = 0

type Entry = { x: number; y: number; value: number; length: number }

for (let i = 0; i < lines.length; i++) {
  const candidates: Entry[] = [...lines[i].matchAll(/\d+/g)].map((v) => ({
    value: +v[0],
    length: v[0].length,
    x: v['index']!,
    y: i,
  }))
  for (const candidate of candidates) {
    if (isPartNumber(candidate)) {
      sum += candidate.value
    }
  }
}

console.log('Sum:', sum)

function isPartNumber(entry: Entry): boolean {
  const minY = Math.max(0, entry.y - 1)
  const maxY = Math.min(lines.length - 1, entry.y + 1)
  const minX = Math.max(0, entry.x - 1)
  const maxX = Math.min(lines[0].length - 1, entry.x + entry.length)

  for (let y = minY; y <= maxY; y++) {
    for (let x = minX; x <= maxX; x++) {
      if (/[^0-9.]/.test(lines[y][x])) {
        return true
      }
    }
  }

  return false
}
