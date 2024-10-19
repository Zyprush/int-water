import { formatDistanceToNow, parseISO } from "date-fns";

export const getRelativeTime = (timestamp: string): string => {
  try {
    // Parse the ISO 8601 timestamp into a Date object
    const parsedDate = parseISO(timestamp);

    // Get the relative time
    return formatDistanceToNow(parsedDate, { addSuffix: true });
  } catch (error) {
    console.error("Error parsing date:", error);
    return "Invalid date";
  }
};

export const currentTime = new Date().toISOString(); // Get current time in ISO format
// Function to format the date
export function formatIssueDate(dateString: string) {
  // Parse the date string to a Date object
  const date = new Date(dateString);

  // Define month names
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Get the day, month, and year
  const day = date.getDate();
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();

  // Function to get ordinal suffix for the day
  function getOrdinalSuffix(day:number) {
    if (day >= 11 && day <= 13) return "th";
    switch (day % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  }

  // Format the day with ordinal suffix
  const ordinalDay = `${day}${getOrdinalSuffix(day)}`;

  // Return the formatted date string
  return `${ordinalDay} day of ${month} ${year}`;
}
