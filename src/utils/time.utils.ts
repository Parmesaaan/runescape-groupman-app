import {Task, TaskType} from "../models";

export const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString)

  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date)
}

export function isTaskAvailable(task: Task, currentDate: Date = new Date()): boolean {
  if (!task.lastCompleted) {
    return true; // Task has never been completed, so it's available
  }

  const lastCompleted = new Date(task.lastCompleted);

  // Daily task: reset at 00:00 UTC
  if (task.taskType === TaskType.DAILY) {
    // Set the last completed date to midnight (00:00 UTC)
    const lastCompletedDateOnly = new Date(Date.UTC(lastCompleted.getUTCFullYear(), lastCompleted.getUTCMonth(), lastCompleted.getUTCDate()));
    const currentDateOnly = new Date(Date.UTC(currentDate.getUTCFullYear(), currentDate.getUTCMonth(), currentDate.getUTCDate()));

    // If the task was completed before today, it's available again
    return currentDateOnly > lastCompletedDateOnly;
  }

  // Weekly task: reset at 00:00 UTC on Wednesdays
  if (task.taskType === TaskType.WEEKLY) {
    // Get the last completed week's number (in UTC)
    const lastCompletedWeek = getWeekNumber(lastCompleted);
    const currentWeek = getWeekNumber(currentDate);

    // If the task was completed in a previous week, it's available again
    return lastCompletedWeek !== currentWeek;
  }

  // Monthly task: reset at 00:00 UTC on the 1st of the month
  if (task.taskType === TaskType.MONTHLY) {
    // If the task was completed in a previous month, it's available again
    return lastCompleted.getUTCMonth() !== currentDate.getUTCMonth();
  }

  return false;
}

function getWeekNumber(date: Date): number {
  const tempDate = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
  tempDate.setUTCDate(tempDate.getUTCDate() - tempDate.getUTCDay() + 1); // Set to Monday
  const firstMonday = new Date(tempDate.getUTCFullYear(), 0, 1); // First Monday of the year
  const daysSinceFirstMonday = Math.floor((tempDate.getTime() - firstMonday.getTime()) / (24 * 60 * 60 * 1000));

  return Math.ceil((daysSinceFirstMonday + 1) / 7); // Return the ISO week number
}