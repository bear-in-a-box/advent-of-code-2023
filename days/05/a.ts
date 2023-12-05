import { readFileSync } from 'fs'
import { join } from 'path'

const file = join(__dirname, './example.txt')

const input = readFileSync(file).toString('utf8')
const [seedsBlock, ...mappingBlocks] = input.split('\n\n')

const seeds = seedsBlock.split(': ', 2)[1].split(/\s+/).map(Number)

type Category =
  | 'seed'
  | 'soil'
  | 'fertilizer'
  | 'water'
  | 'light'
  | 'temperature'
  | 'humidity'
  | 'location'

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

type Mapping = { sourceStart: number; destinationStart: number; range: number }

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

function isInRange(needle: number, { sourceStart, range }: Mapping): boolean {
  return sourceStart <= needle && needle <= sourceStart + range
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
const min = Math.min(...seeds.map(go))
console.log('Result:', min)
