export type ElementType = 'volcano' | 'blizzard' | 'storm'

export interface EventRecord {
    date: string
    time: string
    element: ElementType
}

export const eventTimes = [
    '01:00',
    '04:00',
    '07:00',
    '10:00',
    '13:00',
    '17:00',
    '19:00',
    '22:00',
]

export const elements: ElementType[] = [
    'volcano',
    'blizzard',
    'storm',
]

export const elementLabels: Record<ElementType, string> = {
    volcano: 'Volcano',
    blizzard: 'Blizzard',
    storm: 'Storm',
}