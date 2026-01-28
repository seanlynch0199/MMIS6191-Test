'use client'

import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { RunnerCard } from '@/components/RunnerCard'
import { Button } from '@/components/ui/Button'
import { fetchAthletes } from '@/lib/api'

export default function RunnersPage() {
  const [search, setSearch] = useState('')
  const [grade, setGrade] = useState<number | 'all'>('all')

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
        Athletes
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Meet the athletes of Jones County Cross Country. Use the filters below to find specific runners
        or search by name.
      </p>

      {/* Filters */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Search */}
          <div>
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

        {/* Results count */}
        {athletes && (
          <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            Showing {filteredAthletes.length} of {athletes.length} athletes
          </div>
        )}
      </div>

      {/* Loading state */}
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

      {/* Error state */}
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

      {/* Athletes grid */}
      {athletes && filteredAthletes.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredAthletes.map((athlete) => (
            <RunnerCard key={athlete.id} athlete={athlete} />
          ))}
        </div>
      )}

      {athletes && filteredAthletes.length === 0 && (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          <p>No athletes match your filters.</p>
          <button
            onClick={() => {
              setSearch('')
              setGrade('all')
            }}
            className="mt-2 text-prBlue-600 dark:text-prBlue-400 hover:underline"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  )
}
