import { Athlete } from '@/data/types'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || ''

export async function fetchAthletes(): Promise<Athlete[]> {
  const res = await fetch(`${BASE_URL}/api/athletes`)

  if (!res.ok) {
    throw new Error(`Failed to fetch athletes: ${res.status}`)
  }

  return res.json()
}
