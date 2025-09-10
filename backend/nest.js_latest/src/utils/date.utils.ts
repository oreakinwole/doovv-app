import Moment from 'moment';

const getDayMonthAndYear = (date) => {
  const check = Moment(date, 'date/utc format');
  return {
    day: check.format('dddd'), // => ('Monday' , 'Tuesday' ----)
    month: check.format('MMMM'), // => ('January','February.....)
    year: check.format('YYYY'), // => ('2012','2013' ...)
  };
};

const isTheSameMonthAndYear = (dateA, dateB) => {
  let formatDateA = Moment(new Date(dateA)).format('YYYY-MM-DD');
  let formatDateB = Moment(new Date(dateB)).format('YYYY-MM-DD');

  if (
    Moment(formatDateA).isSame(formatDateB, 'year') &&
    Moment(formatDateA).isSame(formatDateB, 'month')
  )
    return true;

  return false;
};

const isValidDate = (dateString) => {
  // Regular expression for the format dd-mm-yyyy
  var regex = /^(\d{2})[-/](\d{2})[-/](\d{4})$/;

  // Check if the string matches the regular expression
  if (!regex.test(dateString)) {
    return false; // Invalid format
  }

  // Extract day, month, and year from the string
  var separator = dateString.includes('-') ? '-' : '/'; // Detect the separator used
  var parts = dateString.split(separator);
  var day = parseInt(parts[0], 10);
  var month = parseInt(parts[1], 10);
  var year = parseInt(parts[2], 10);

  // Check if the month is between 1 and 12
  if (month < 1 || month > 12) {
    return false;
  }

  // Check if the day is valid for the given month
  var daysInMonth = new Date(year, month, 0).getDate();
  if (day < 1 || day > daysInMonth) {
    return false;
  }

  // Check if the year is a valid 4-digit number
  if (year < 1000 || year > 9999) {
    return false;
  }

  // If all checks pass, return true (valid date)
  return true;
};

function validateDateFormat(dateString) {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  return regex.test(dateString);
}
const formatDateTime = (date) => {
  // Create a new Date object
  const dateObj = new Date(date);

  // Format the date to a human-readable string in Nigerian time
  const options: any = {
    weekday: 'long', // Full name of the day
    year: 'numeric', // Full year
    month: 'long', // Full month name
    day: 'numeric', // Day of the month
    hour: 'numeric', // Hour (12-hour clock)
    minute: 'numeric', // Minute
    second: 'numeric', // Second
    hour12: true, // 12-hour clock format
    timeZone: 'Africa/Lagos', // Nigerian time zone
  };

  const formattedDate = dateObj.toLocaleString('en-NG', options);

  console.log(formattedDate);
};

function isMoreThanThreeDays(lastLoginDate: string | Date): boolean {
  // Convert the input to a Date object if it is a string
  const lastLogin =
    typeof lastLoginDate === 'string' ? new Date(lastLoginDate) : lastLoginDate;

  // Get the current date and time
  const currentDate = new Date();

  // Calculate the difference in milliseconds
  const differenceInMilliseconds = currentDate.getTime() - lastLogin.getTime();

  // Convert the difference to days
  const differenceInDays = differenceInMilliseconds / (1000 * 60 * 60 * 24);

  // Check if the difference is greater than 3 days
  return differenceInDays > 3;
}

function getCurrentTimeInMinutes() {
  const now = new Date(); // Current date and time

  // Extract hours, minutes, and seconds from the current time
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();

  // Convert the current time to total minutes
  const totalMinutes = hours * 60 + minutes + seconds / 60;

  return totalMinutes;
}

function getAccountAge(createdAt: Date | string | number): {
  milliseconds: number;
  seconds: number;
  minutes: number;
  hours: number;
  days: number;
  weeks: number;
  months: number;
  years: number;
  humanReadable: string;
} {
  const createdDate = new Date(createdAt);

  if (isNaN(createdDate.getTime())) {
    throw new Error('Invalid date provided');
  }

  const now = new Date();
  const ageInMilliseconds = now.getTime() - createdDate.getTime();

  const seconds = Math.floor(ageInMilliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  return {
    milliseconds: ageInMilliseconds,
    seconds,
    minutes,
    hours,
    days,
    weeks,
    months,
    years,
    humanReadable: getHumanReadableAge(
      years,
      months,
      weeks,
      days,
      hours,
      minutes,
      seconds,
    ),
  };
}

function getHumanReadableAge(
  years: number,
  months: number,
  weeks: number,
  days: number,
  hours: number,
  minutes: number,
  seconds: number,
): string {
  if (years > 0) return `${years} year${years > 1 ? 's' : ''}`;
  if (months > 0) return `${months} month${months > 1 ? 's' : ''}`;
  if (weeks > 0) return `${weeks} week${weeks > 1 ? 's' : ''}`;
  if (days > 0) return `${days} day${days > 1 ? 's' : ''}`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''}`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''}`;
  return `${seconds} second${seconds !== 1 ? 's' : ''}`;
}

export default {
  getDayMonthAndYear,
  isTheSameMonthAndYear,
  isValidDate,
  formatDateTime,
  validateDateFormat,
  isMoreThanThreeDays,
  getCurrentTimeInMinutes,
  getAccountAge,
};
