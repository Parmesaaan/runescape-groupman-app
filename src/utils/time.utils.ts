import {Task, TaskType} from "../models"
import {differenceInSeconds, formatDistanceToNowStrict} from "date-fns"
import { differenceInDays, differenceInHours, differenceInMinutes } from "date-fns";

export const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString)
  return formatDistanceToNowStrict(date, { addSuffix: true })
}

export function isTaskAvailable(task: Task): boolean {
  if (!task.lastCompleted) {
    return true; // Task has never been completed, so it's available
  }

  const currentDate: Date = new Date()
  const lastCompleted = new Date(task.lastCompleted)

  if (task.taskType === TaskType.DAILY) {
    const lastCompletedDateOnly = new Date(Date.UTC(lastCompleted.getUTCFullYear(), lastCompleted.getUTCMonth(), lastCompleted.getUTCDate()))
    const currentDateOnly = new Date(Date.UTC(currentDate.getUTCFullYear(), currentDate.getUTCMonth(), currentDate.getUTCDate()))

    // If the task was completed before today, it's available again
    return currentDateOnly > lastCompletedDateOnly
  }

  // Weekly task: reset at 00:00 UTC on Wednesdays
  if (task.taskType === TaskType.WEEKLY) {
    // Get the last completed week's number (in UTC)
    const lastCompletedWeek = getWeekNumber(lastCompleted)
    const currentWeek = getWeekNumber(currentDate)

    // If the task was completed in a previous week, it's available again
    return lastCompletedWeek !== currentWeek
  }

  // Monthly task: reset at 00:00 UTC on the 1st of the month
  if (task.taskType === TaskType.MONTHLY) {
    // If the task was completed in a previous month, it's available again
    return lastCompleted.getUTCMonth() !== currentDate.getUTCMonth()
  }

  return false
}

function getWeekNumber(date: Date): number {
  const tempDate = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
  tempDate.setUTCDate(tempDate.getUTCDate() - tempDate.getUTCDay() + 1)
  const firstMonday = new Date(tempDate.getUTCFullYear(), 0, 1)
  const daysSinceFirstMonday = Math.floor((tempDate.getTime() - firstMonday.getTime()) / (24 * 60 * 60 * 1000))

  return Math.ceil((daysSinceFirstMonday + 1) / 7)
}

export const getNextDailyReset = (): Date => {
  const now = new Date()
  const resetTime = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0))

  if (resetTime <= now) {
    resetTime.setUTCDate(resetTime.getUTCDate() + 1)
  }

  return resetTime
}

export const getNextWeeklyReset = (): Date => {
  const now = new Date()
  const resetTime = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0))
  const daysUntilReset = (3 + 7 - now.getUTCDay()) % 7 || 7 // 3 = Wednesday

  resetTime.setUTCDate(resetTime.getUTCDate() + daysUntilReset)
  return resetTime
}

export const getNextMonthlyReset = (): Date => {
  const now = new Date()
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1, 0, 0, 0))
}

export const formatCountdown = (targetDate: Date): string => {
  const now = new Date()
  const diffDays = differenceInDays(targetDate, now)
  const diffHours = differenceInHours(targetDate, now) % 24
  const diffMinutes = differenceInMinutes(targetDate, now) % 60
  const diffSeconds = differenceInSeconds(targetDate, now) % 60

  const formattedMinutes = String(diffMinutes).padStart(2, '0') // Pad minutes with leading zero if necessary
  const formattedSeconds = String(diffSeconds).padStart(2, '0') // Pad seconds with leading zero if necessary

  if (diffDays > 0) {
    return `${diffDays} days`
  } else if (diffHours > 0) {
    return `${diffHours}${diffMinutes > 0 ? `:${formattedMinutes}` : ''} hours`
  } else if (diffMinutes > 0) {
    return `${diffMinutes}:${formattedSeconds} minutes`
  } else {
    return `${diffSeconds} seconds`
  }
}

export const getDailyResetCountdown = (): string => {
  return formatCountdown(getNextDailyReset())
}

export const getWeeklyResetCountdown = (): string => {
  return formatCountdown(getNextWeeklyReset())
}

export const getMonthlyResetCountdown = (): string => {
  return formatCountdown(getNextMonthlyReset())
}