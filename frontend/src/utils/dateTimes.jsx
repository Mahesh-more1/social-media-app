export function getTimeAgo(timestamp) {
  const now = new Date();
  const postDate = new Date(timestamp);
  const secondsAgo = Math.floor((now - postDate) / 1000);

  // Less than a minute
  if (secondsAgo < 60) {
    return "just now";
  }

  // Less than an hour
  const minutesAgo = Math.floor(secondsAgo / 60);
  if (minutesAgo < 60) {
    return `${minutesAgo} ${minutesAgo === 1 ? "minute" : "minutes"} ago`;
  }

  // Less than a day
  const hoursAgo = Math.floor(minutesAgo / 60);
  if (hoursAgo < 24) {
    return `${hoursAgo} ${hoursAgo === 1 ? "hour" : "hours"} ago`;
  }

  // Less than a month (30 days)
  const daysAgo = Math.floor(hoursAgo / 24);
  if (daysAgo < 30) {
    return `${daysAgo} ${daysAgo === 1 ? "day" : "days"} ago`;
  }

  // Less than a year (365 days)
  const monthsAgo = Math.floor(daysAgo / 30);
  if (monthsAgo < 12) {
    return `${monthsAgo} ${monthsAgo === 1 ? "month" : "months"} ago`;
  }

  // More than a year
  const yearsAgo = Math.floor(monthsAgo / 12);
  return `${yearsAgo} ${yearsAgo === 1 ? "year" : "years"} ago`;
}

export const formatDate = () => {
  // Get the current date
  const today = new Date();

  // Extract day, month, and year
  let day = today.getDate();
  let month = today.getMonth() + 1; // Months are zero-based (0-11), so add 1
  let year = today.getFullYear();

  // Add leading zero to day and month if needed
  day = day < 10 ? "0" + day : day;
  month = month < 10 ? "0" + month : month;

  // Format the date as dd/mm/yyyy
  const formattedDate = `${day}/${month}/${year}`;

  return formattedDate;
};
