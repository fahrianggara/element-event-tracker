export type ElementType = 'fire' | 'ice' | 'storm'

export interface EventRecord {
    date: string
    time: string
    element: ElementType
}

export const eventTimes = [
    '07:00',
    '10:00',
    '13:00',
    '17:00',
    '19:00',
    '22:00',
    '01:00',
    '04:00',
]

export const elements: ElementType[] = [
    'fire',
    'ice',
    'storm',
]

export const elementLabels: Record<ElementType, string> = {
    fire: 'Fire',
    ice: 'Ice',
    storm: 'Storm',
}