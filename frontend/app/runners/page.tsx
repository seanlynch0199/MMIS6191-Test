'use client'

import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { RunnerCard } from '@/components/RunnerCard'
import { Button } from '@/components/ui/Button'
import { fetchAthletes } from '@/lib/api'
import { runners } from '@/data/runners'
import { TeamLevel, Gender, EventFocus } from '@/data/types'

export default function RunnersPage() {
  const [search, setSearch] = useState('')
  const [teamLevel, setTeamLevel] = useState<TeamLevel | 'all'>('all')
  const [gender, setGender] = useState<Gender | 'all'>('all')
  const [grade, setGrade] = useState<number | 'all'>('all')
  const [eventFocus, setEventFocus] = useState<EventFocus | 'all'>('all')

  // Fetch athletes from backend API
  const {
    data: athletes,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['athletes'],
    queryFn: fetchAthletes,
  })

  // Filter local runner data (existing behavior)
  const filteredRunners = useMemo(() => {
    return runners.filter(runner => {
      if (search) {
        const searchLower = search.toLowerCase()
        const fullName = `${runner.firstName} ${runner.lastName}`.toLowerCase()
        if (!fullName.includes(searchLower)) return false
      }
      if (teamLevel !== 'all' && runner.teamLevel !== teamLevel) return false
      if (gender !== 'all' && runner.gender !== gender) return false
      if (grade !== 'all' && runner.grade !== grade) return false
      if (eventFocus !== 'all' && runner.eventFocus !== eventFocus) return false
      return true
    })
  }, [search, teamLevel, gender, grade, eventFocus])

  // Filter API athletes by search and grade
  const filteredAthletes = useMemo(() => {
    if (!athletes) return []
    return athletes.filter(athlete => {
      if (search && !athlete.name.toLowerCase().includes(search.toLowerCase())) return false
      if (grade !== 'all' && athlete.grade !== grade) return false
      return true
    })
  }, [athletes, search, grade])

  const grades = [6, 7, 8, 9, 10, 11, 12]

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs />

      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
        Runner Explorer
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Meet the athletes of Pine Ridge Running Club. Use the filters below to find specific runners
        or search by name.
      </p>

      {/* Filters */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Search */}
          <div className="lg:col-span-2">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Search
            </label>
            <input
              type="text"
              id="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-prBlue-500 focus:border-transparent"
            />
          </div>

          {/* Team Level */}
          <div>
            <label htmlFor="teamLevel" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Team
            </label>
            <select
              id="teamLevel"
              value={teamLevel}
              onChange={(e) => setTeamLevel(e.target.value as TeamLevel | 'all')}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-prBlue-500"
            >
              <option value="all">All Teams</option>
              <option value="hs">High School</option>
              <option value="ms">Middle School</option>
            </select>
          </div>

          {/* Gender */}
          <div>
            <label htmlFor="gender" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Gender
            </label>
            <select
              id="gender"
              value={gender}
              onChange={(e) => setGender(e.target.value as Gender | 'all')}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-prBlue-500"
            >
              <option value="all">All</option>
              <option value="boys">Boys</option>
              <option value="girls">Girls</option>
            </select>
          </div>

          {/* Grade */}
          <div>
            <label htmlFor="grade" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Grade
            </label>
            <select
              id="grade"
              value={grade}
              onChange={(e) => setGrade(e.target.value === 'all' ? 'all' : Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-prBlue-500"
            >
              <option value="all">All Grades</option>
              {grades.map(g => (
                <option key={g} value={g}>Grade {g}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Event Focus Filter */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Event Focus
          </label>
          <div className="flex flex-wrap gap-2">
            {(['all', 'distance', 'mid-distance', 'relay'] as const).map((focus) => (
              <button
                key={focus}
                onClick={() => setEventFocus(focus)}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                  eventFocus === focus
                    ? 'bg-prBlue-500 text-white'
                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600'
                }`}
              >
                {focus === 'all' ? 'All' : focus.charAt(0).toUpperCase() + focus.slice(1).replace('-', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Results count */}
        <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
          Showing {filteredRunners.length} of {runners.length} runners
        </div>
      </div>

      {/* Runner Grid (local data) */}
      {filteredRunners.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredRunners.map((runner) => (
            <RunnerCard key={runner.id} runner={runner} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          <p>No runners match your filters.</p>
          <button
            onClick={() => {
              setSearch('')
              setTeamLevel('all')
              setGender('all')
              setGrade('all')
              setEventFocus('all')
            }}
            className="mt-2 text-prBlue-600 dark:text-prBlue-400 hover:underline"
          >
            Clear all filters
          </button>
        </div>
      )}

      {/* Athletes from API */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Athletes (from database)
        </h2>

        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 animate-pulse"
              >
                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-3" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4" />
                <div className="border-t border-gray-100 dark:border-gray-700 pt-4 mt-4">
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-2" />
                  <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        )}

        {isError && (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl shadow-sm">
            <p className="text-gray-500 dark:text-gray-400 mb-1">
              Failed to load athletes.
            </p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mb-4">
              {error instanceof Error ? error.message : 'An unexpected error occurred.'}
            </p>
            <Button variant="outline" onClick={() => refetch()}>
              Retry
            </Button>
          </div>
        )}

        {athletes && filteredAthletes.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredAthletes.map((athlete) => (
              <RunnerCard key={athlete.id} athlete={athlete} />
            ))}
          </div>
        )}

        {athletes && filteredAthletes.length === 0 && (
          <p className="text-center py-8 text-gray-500 dark:text-gray-400">
            No athletes match your search.
          </p>
        )}
      </div>
    </div>
  )
}
