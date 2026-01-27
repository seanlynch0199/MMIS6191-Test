import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { Season } from '@/data/types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format a time string for display (e.g., "16:45" or "1:56.2")
 */
export function formatTime(time: string): string {
  return time
}

/**
 * Parse a time string to seconds for comparison
 * Handles formats: "16:45", "1:56.2", "9:28.5"
 */
export function parseTimeToSeconds(time: string): number {
  const parts = time.split(':')
  if (parts.length === 2) {
    const [minutes, seconds] = parts
    return parseFloat(minutes) * 60 + parseFloat(seconds)
  }
  return parseFloat(time)
}

/**
 * Sort times from fastest to slowest
 */
export function sortByTime<T extends { time: string }>(items: T[], ascending = true): T[] {
  return [...items].sort((a, b) => {
    const diff = parseTimeToSeconds(a.time) - parseTimeToSeconds(b.time)
    return ascending ? diff : -diff
  })
}

/**
 * Create a URL-safe slug from a string
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

/**
 * Format a date string for display
 */
export function formatDate(dateString: string, options?: Intl.DateTimeFormatOptions): string {
  const date = new Date(dateString + 'T00:00:00')
  return date.toLocaleDateString('en-US', options ?? {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

/**
 * Format a date as short form (e.g., "Sep 7")
 */
export function formatDateShort(dateString: string): string {
  const date = new Date(dateString + 'T00:00:00')
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })
}

/**
 * Check if a date is in the future
 */
export function isFutureDate(dateString: string): boolean {
  const date = new Date(dateString + 'T23:59:59')
  return date > new Date()
}

/**
 * Get the current season from URL or localStorage
 */
export function getSeasonFromUrlOrStorage(searchParams?: URLSearchParams): Season {
  // Check URL first
  if (searchParams) {
    const urlSeason = searchParams.get('season')
    if (urlSeason === 'xc' || urlSeason === 'track') {
      return urlSeason
    }
  }

  // Check localStorage (client-side only)
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('selectedSeason')
    if (stored === 'xc' || stored === 'track') {
      return stored
    }
  }

  // Default based on current month
  const month = new Date().getMonth() + 1
  // XC season: Aug-Nov (8-11), Track: Feb-May (2-5)
  if (month >= 8 && month <= 11) return 'xc'
  if (month >= 2 && month <= 5) return 'track'
  return 'xc' // Default to XC
}

/**
 * Save selected season to localStorage
 */
export function saveSeasonToStorage(season: Season): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('selectedSeason', season)
  }
}

/**
 * Compute overall rankings based on best times
 * Rankings are based on best 5K times for XC and best 3200m for track
 */
export function computeOverallRankings<T extends { time: string; name?: string; runnerName?: string }>(
  times: T[]
): (T & { rank: number })[] {
  const sorted = sortByTime(times, true)
  return sorted.map((item, index) => ({
    ...item,
    rank: index + 1,
  }))
}

/**
 * Get grade suffix (e.g., "9th", "10th", "11th", "12th")
 */
export function getGradeSuffix(grade: number): string {
  if (grade === 11) return '11th'
  if (grade === 12) return '12th'
  if (grade === 13) return '13th'
  const lastDigit = grade % 10
  if (lastDigit === 1) return `${grade}st`
  if (lastDigit === 2) return `${grade}nd`
  if (lastDigit === 3) return `${grade}rd`
  return `${grade}th`
}

/**
 * Get team level display name
 */
export function getTeamLevelName(level: 'hs' | 'ms'): string {
  return level === 'hs' ? 'High School' : 'Middle School'
}

/**
 * Get season display name
 */
export function getSeasonName(season: Season): string {
  return season === 'xc' ? 'Cross Country' : 'Track & Field'
}

/**
 * Get initials from a name
 */
export function getInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}

/**
 * Format total seconds into a time string (e.g., 1005 → "16:45")
 */
export function formatSecondsToTime(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

/**
 * Get event focus display name
 */
export function getEventFocusName(focus: string): string {
  const names: Record<string, string> = {
    distance: 'Distance',
    'mid-distance': 'Mid-Distance',
    sprints: 'Sprints',
    relay: 'Relay Specialist',
  }
  return names[focus] || focus
}
