import { createReadStream } from 'fs'
import { join } from 'path'
import { createInterface } from 'readline'

const file = join(__dirname, './input.txt')

const reader = createInterface({
  input: createReadStream(file, {
    encoding: 'utf8',
  }),
  crlfDelay: Infinity,
})

const cardStrengthMapping: Record<string, number> = {
  A: 14,
  K: 13,
  Q: 12,
  J: 11,
  T: 10,
  9: 9,
  8: 8,
  7: 7,
  6: 6,
  5: 5,
  4: 4,
  3: 3,
  2: 2,
}

const enum SetStrength {
  HighCard = 0,
  OnePair = 1,
  TwoPair = 2,
  ThreeOfAKind = 3,
  FullHouse = 4,
  FourOfAKind = 5,
  FiveOfAKind = 6,
}

type Entry = {
  hand: string
  setStrength: SetStrength
  bid: number
}

const entries: Entry[] = []

let totalWinnings = 0

reader.on('line', parseLine)
reader.on('close', onEntriesRead)

function parseLine(line: string) {
  const [hand, bidText] = line.split(' ', 2)
  const bid = Number(bidText)

  const setStrength = getSetStrength(hand)

  entries.push({ hand, bid, setStrength })
}

function getSetStrength(hand: string): SetStrength {
  const kinds = new Map<string, number>()
  for (const c of hand) {
    const v = (kinds.get(c) ?? 0) + 1
    kinds.set(c, v)
  }
  if (kinds.size === 1) return SetStrength.FiveOfAKind
  if (kinds.size === 5) return SetStrength.HighCard
  if (kinds.size === 4) return SetStrength.OnePair
  const values = [...kinds.values()]
  if (values.includes(4)) return SetStrength.FourOfAKind
  if (values.includes(3)) {
    if (values.includes(2)) return SetStrength.FullHouse
    return SetStrength.ThreeOfAKind
  }
  return SetStrength.TwoPair
}

function onEntriesRead() {
  sortEntries()
  calculateWinnings()
  printResult()
}

function sortEntries() {
  entries.sort((a, b) => {
    if (a.setStrength !== b.setStrength) {
      return b.setStrength - a.setStrength
    }
    for (let i = 0; i < a.hand.length; i++) {
      if (a.hand[i] === b.hand[i]) continue
      return cardStrengthMapping[b.hand[i]] - cardStrengthMapping[a.hand[i]]
    }
    return 0
  })
}

function calculateWinnings() {
  entries.forEach(({ bid }, index) => {
    const rank = entries.length - index
    totalWinnings += rank * bid
  })
}

function printResult() {
  console.log('Total winnings:', totalWinnings)
}
