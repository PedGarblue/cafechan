const SECONDS = 1000;
const MINUTES = 60 * SECONDS;
const HOURS = 60 * MINUTES;
const DAYS = 24 * HOURS;
const WEEKS = 7 * DAYS;
const MONTHS = 4 * WEEKS;
const YEARS = 12 * MONTHS;

const banTimes = {
  permaban: () => 0,
  fiveteenMinutes: () => Date.now() + 15 * MINUTES,
  hour: () => Date.now() + HOURS,
  day: () => Date.now() + DAYS,
  week: () => Date.now() + WEEKS,
  month: () => Date.now() + MONTHS,
  year: () => Date.now() + YEARS,
  custom: minutes => () => Date.now() + minutes,
};

module.exports = banTimes;
