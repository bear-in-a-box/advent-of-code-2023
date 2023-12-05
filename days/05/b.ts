// Warning: very long execution time.

import { readFileSync } from 'fs'
import { join } from 'path'

const file = join(__dirname, './input.txt')

const input = readFileSync(file).toString('utf8')
const [seedsBlock, ...mappingBlocks] = input.split('\n\n')

type Category =
  | 'seed'
  | 'soil'
  | 'fertilizer'
  | 'water'
  | 'light'
  | 'temperature'
  | 'humidity'
  | 'location'
type Range = [number, number]
type Mapping = { sourceStart: number; destinationStart: number; range: number }

function isInRange(needle: number, { sourceStart, range }: Mapping): boolean {
  return sourceStart <= needle && needle < sourceStart + range
}

function doRangesOverlap(a: Range, b: Range): boolean {
  const x1 = a[0],
    x2 = a[0] + a[1] - 1
  const y1 = b[0],
    y2 = b[0] + b[1] - 1
  return (y2 - x1) * (x2 - y1) >= 0
}

function deoverlap(a: Range, b: Range): Range {
  const min = Math.min(a[0], b[0])
  const max = Math.max(a[0] + a[1], b[0] + b[1])
  return [min, max - min]
}

const seedsRaw = seedsBlock.split(': ', 2)[1].split(/\s+/).map(Number)
const seeds: Range[] = []
for (let i = 0; i < seedsRaw.length - 1; i += 2) {
  const range: Range = [seedsRaw[i], seedsRaw[i + 1]]

  const overlapping = seeds.find((other) => doRangesOverlap(range, other))

  if (!overlapping) {
    seeds.push(range)
    continue
  }

  const [start, length] = deoverlap(range, overlapping)

  overlapping[0] = start
  overlapping[1] = length
}

const path: Category[] = [
  'seed',
  'soil',
  'fertilizer',
  'water',
  'light',
  'temperature',
  'humidity',
  'location',
]

const mappings: Record<Category, Mapping[]> = {
  seed: [],
  soil: [],
  fertilizer: [],
  water: [],
  light: [],
  temperature: [],
  humidity: [],
  location: [],
}

for (const mappingBlock of mappingBlocks) {
  const [heading, ...mappingLines] = mappingBlock.split('\n')
  const { from } = heading.match(/^(?<from>\w+)/)!.groups! as {
    from: Category
  }
  for (const mapping of mappingLines) {
    const [destinationStart, sourceStart, range] = mapping
      .split(/\s+/, 3)
      .map(Number)
    mappings[from].push({ destinationStart, sourceStart, range })
  }
}

function getTarget(from: Category, source: number): number {
  const mapping = mappings[from].find((mapping) => isInRange(source, mapping))
  if (!mapping) {
    return source
  }
  const delta = source - mapping.sourceStart
  const target = mapping.destinationStart + delta
  return target
}

function go(source: number) {
  return path.reduce<number>((position, from) => {
    const target = getTarget(from, position)
    return target
  }, source)
}

const totalInputs = seeds.reduce((acc, [, length]) => acc + length, 0)

const { Presets, SingleBar } = require('cli-progress')
const progress = new SingleBar(
  {
    format: '{bar} {percentage}% | {value}/{total}',
    fps: 2,
  },
  Presets.shades_classic
)
progress.start(totalInputs, 0)

let min = Number.POSITIVE_INFINITY

for (const [from, length] of seeds) {
  for (let i = 0; i < length; i++) {
    const result = go(from + i)
    if (result < min) {
      min = result
    }
    progress.increment()
  }
}

progress.stop()

console.log('Result:', min)
