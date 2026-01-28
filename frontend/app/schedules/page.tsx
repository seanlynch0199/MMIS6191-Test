'use client'

import { Suspense } from 'react'
import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { Button } from '@/components/ui/Button'
import { fetchMeets } from '@/lib/api'

function ScheduleContent() {
  const { data: meets, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['meets'],
    queryFn: fetchMeets,
  })

  const sortedMeets = meets
    ? [...meets].sort((a, b) => a.meet_date.localeCompare(b.meet_date))
    : []

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs />

      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
          Schedule
        </h1>
        <Link
          href="/schedules/archive"
          className="text-sm text-prBlue-600 dark:text-prBlue-400 hover:underline"
        >
          View Archive
        </Link>
      </div>

      <p className="text-gray-600 dark:text-gray-400 mb-8">
        All scheduled meets pulled from the database. Check back for updates as the season progresses.
      </p>

      {meets && (
        <div className="mb-4 text-sm text-gray-500 dark:text-gray-400">
          {meets.length} meet{meets.length !== 1 ? 's' : ''} scheduled
        </div>
      )}

      {isLoading && (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Date</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Meet</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white hidden sm:table-cell">Location</th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4, 5].map((i) => (
                <tr key={i} className="border-b border-gray-100 dark:border-gray-800 animate-pulse">
                  <td className="py-3 px-4"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24" /></td>
                  <td className="py-3 px-4"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-40" /></td>
                  <td className="py-3 px-4 hidden sm:table-cell"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isError && (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <p className="text-gray-500 dark:text-gray-400 mb-1">Failed to load meets.</p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mb-4">
            {error instanceof Error ? error.message : 'An unexpected error occurred.'}
          </p>
          <Button variant="outline" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      )}

      {meets && sortedMeets.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Date</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Meet</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white hidden sm:table-cell">Location</th>
              </tr>
            </thead>
            <tbody>
              {sortedMeets.map((meet) => {
                const date = new Date(meet.meet_date + 'T00:00:00')
                const formatted = date.toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                })
                return (
                  <tr
                    key={meet.id}
                    className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  >
                    <td className="py-3 px-4">
                      <span className="text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">
                        {formatted}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-medium text-gray-900 dark:text-white">{meet.name}</span>
                    </td>
                    <td className="py-3 px-4 hidden sm:table-cell">
                      <span className="text-sm text-gray-600 dark:text-gray-400">{meet.location}</span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {meets && sortedMeets.length === 0 && (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          <p>No meets scheduled yet.</p>
          <p className="mt-2">Check back soon or view the archive for past seasons.</p>
        </div>
      )}

      <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-sm text-gray-600 dark:text-gray-400">
        <p className="font-medium text-gray-900 dark:text-white mb-2">Schedule Notes</p>
        <ul className="list-disc list-inside space-y-1">
          <li>All times are tentative and subject to change</li>
          <li>Check with coaches for bus departure times (typically 2 hours before race time)</li>
          <li>Home meets are highlighted - volunteers needed!</li>
          <li>Click on any meet for additional details and directions</li>
        </ul>
      </div>
    </div>
  )
}

export default function SchedulesPage() {
  return (
    <Suspense fallback={<div className="max-w-4xl mx-auto px-4 py-8">Loading schedule...</div>}>
      <ScheduleContent />
    </Suspense>
  )
}
