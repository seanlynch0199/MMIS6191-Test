import Link from 'next/link'
import { Runner, Athlete } from '@/data/types'
import { cn, getGradeSuffix, getEventFocusName, formatSecondsToTime } from '@/lib/utils'
import { Button } from '@/components/ui/Button'

interface RunnerCardWithRunner {
  runner: Runner
  athlete?: never
  className?: string
}

interface RunnerCardWithAthlete {
  runner?: never
  athlete: Athlete
  className?: string
}

type RunnerCardProps = RunnerCardWithRunner | RunnerCardWithAthlete

export function RunnerCard({ runner, athlete, className }: RunnerCardProps) {
  if (runner) {
    const bestPR = runner.prs[0]

    return (
      <Link
        href={`/runners/${runner.slug}`}
        className={cn(
          'block bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200',
          className
        )}
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">
            {runner.firstName} {runner.lastName}
          </h3>
          {runner.isCaptain && (
            <span className="px-2 py-0.5 text-xs font-semibold uppercase tracking-wide bg-prGreen-100 dark:bg-prGreen-900 text-prGreen-700 dark:text-prGreen-300 rounded-full">
              Captain
            </span>
          )}
        </div>

        <p className="text-sm text-gray-400 dark:text-gray-500">
          {getGradeSuffix(runner.grade)} Grade &middot; {getEventFocusName(runner.eventFocus)}
        </p>

        {bestPR && (
          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
            <span className="text-xs font-medium uppercase tracking-wide text-gray-400 dark:text-gray-500">
              PR &middot; {bestPR.event}
            </span>
            <p className="text-lg font-bold text-prBlue-600 dark:text-prBlue-400 tabular-nums">
              {bestPR.time}
            </p>
          </div>
        )}

        <div className="mt-5">
          <Button variant="outline" className="w-full" tabIndex={-1}>
            View Profile
          </Button>
        </div>
      </Link>
    )
  }

  // Athlete from API
  return (
    <div
      className={cn(
        'bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200',
        className
      )}
    >
      <h3 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight mb-3">
        {athlete.name}
      </h3>

      <p className="text-sm text-gray-400 dark:text-gray-500">
        {getGradeSuffix(athlete.grade)} Grade
      </p>

      <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
        <span className="text-xs font-medium uppercase tracking-wide text-gray-400 dark:text-gray-500">
          Personal Record
        </span>
        <p className="text-lg font-bold text-prBlue-600 dark:text-prBlue-400 tabular-nums">
          {formatSecondsToTime(athlete.personal_record_seconds)}
        </p>
      </div>
    </div>
  )
}
