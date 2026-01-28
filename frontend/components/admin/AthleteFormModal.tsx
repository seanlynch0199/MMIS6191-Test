'use client'

import { useState, FormEvent } from 'react'
import { AdminAthlete, AdminAthleteCreate } from '@/data/types'

interface AthleteFormModalProps {
  athlete: AdminAthlete | null
  onSave: (data: AdminAthleteCreate) => Promise<void>
  onClose: () => void
}

export function AthleteFormModal({ athlete, onSave, onClose }: AthleteFormModalProps) {
  const [firstName, setFirstName] = useState(athlete?.firstName ?? '')
  const [lastName, setLastName] = useState(athlete?.lastName ?? '')
  const [grade, setGrade] = useState(athlete?.grade?.toString() ?? '')
  const [team, setTeam] = useState(athlete?.team ?? '')
  const [events, setEvents] = useState(athlete?.events?.join(', ') ?? '')
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')

  const isEditing = athlete !== null

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setIsSaving(true)

    const data: AdminAthleteCreate = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
    }

    if (grade) {
      const gradeNum = parseInt(grade, 10)
      if (!isNaN(gradeNum)) {
        data.grade = gradeNum
      }
    }

    if (team.trim()) {
      data.team = team.trim()
    }

    if (events.trim()) {
      data.events = events
        .split(',')
        .map((e) => e.trim())
        .filter((e) => e.length > 0)
    }

    try {
      await onSave(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save athlete')
      setIsSaving(false)
    }
  }

  function handleOverlayClick(e: React.MouseEvent) {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      onClick={handleOverlayClick}
    >
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-lg w-full overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {isEditing ? 'Edit Athlete' : 'Add Athlete'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-2xl leading-none"
            aria-label="Close"
          >
            &times;
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label
                htmlFor="firstName"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                First Name *
              </label>
              <input
                type="text"
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                disabled={isSaving}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-prBlue-500 focus:border-transparent disabled:opacity-50"
              />
            </div>

            <div>
              <label
                htmlFor="lastName"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Last Name *
              </label>
              <input
                type="text"
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                disabled={isSaving}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-prBlue-500 focus:border-transparent disabled:opacity-50"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label
                htmlFor="grade"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Grade
              </label>
              <input
                type="number"
                id="grade"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                min="1"
                max="12"
                disabled={isSaving}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-prBlue-500 focus:border-transparent disabled:opacity-50"
              />
            </div>

            <div>
              <label
                htmlFor="team"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Team
              </label>
              <input
                type="text"
                id="team"
                value={team}
                onChange={(e) => setTeam(e.target.value)}
                placeholder="e.g., Varsity, JV"
                disabled={isSaving}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-prBlue-500 focus:border-transparent disabled:opacity-50"
              />
            </div>
          </div>

          <div className="mb-4">
            <label
              htmlFor="events"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Events (comma separated)
            </label>
            <input
              type="text"
              id="events"
              value={events}
              onChange={(e) => setEvents(e.target.value)}
              placeholder="e.g., 5K, 3200m, 1600m"
              disabled={isSaving}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-prBlue-500 focus:border-transparent disabled:opacity-50"
            />
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300 text-sm">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-4 py-2 text-sm font-medium text-white bg-prBlue-600 hover:bg-prBlue-700 rounded-lg transition-colors disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : isEditing ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
