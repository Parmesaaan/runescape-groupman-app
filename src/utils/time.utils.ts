export const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString)

  const formattedDate = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);

  return formattedDate
}