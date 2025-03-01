/**
 * Returns the number of days from the Unix epoch for a given Date.
 * Unix epoch: January 1, 1970.
 */
export function fromTime(t: Date): number {
    // In JavaScript, getMonth() returns a 0-indexed month so we add 1.
    return fromYMD(t.getFullYear(), t.getMonth() + 1, t.getDate());
}

/**
 * Given a year, month (1-12), and day (1–31), returns the number of days from the Unix epoch.
 * Uses an algorithm similar to the one in the Go code.
 */
export function fromYMD(year: number, month: number, day: number): number {
    // If month is January or February, adjust the year.
    if (month <= 2) {
        year -= 1;
    }

    let era: number;
    if (year < 0) {
        era = Math.trunc((year - 399) / 400);
    } else {
        era = Math.trunc(year / 400);
    }
    const yoe = year - era * 400; // year of era

    let adjustedMonth: number;
    if (month > 2) {
        adjustedMonth = month - 3;
    } else {
        adjustedMonth = month + 9;
    }

    // Calculate day-of-year (doy) using integer division
    const doy = Math.trunc((153 * adjustedMonth + 2) / 5) + day - 1;
    // Calculate day-of-era (doe)
    const doe = yoe * 365 + Math.trunc(yoe / 4) - Math.trunc(yoe / 100) + doy;

    return era * 146097 + doe - 719468;
}

/**
 * Given an integer representing the number of days from the Unix epoch (0 = 1970-01-01),
 * returns an object with the corresponding year, month, and day.
 */
export function toYMD(dayint: number): { year: number; month: number; day: number } {
    dayint += 719468;
    let era = Math.trunc(dayint / 146097);
    if (dayint < 0) {
        era = Math.trunc((dayint - 146096) / 146097);
    }
    const doe = dayint - era * 146097;
    const yoe = Math.trunc(
        (doe - Math.trunc(doe / 1460) + Math.trunc(doe / 36524) - Math.trunc(doe / 146096)) / 365
    );
    let y = yoe + era * 400;
    const doy = doe - (365 * yoe + Math.trunc(yoe / 4) - Math.trunc(yoe / 100));
    const mp = Math.trunc((5 * doy + 2) / 153);
    const d = doy - Math.trunc((153 * mp + 2) / 5) + 1;

    // Adjust month: if mp < 10, month is mp+3; otherwise, it's mp-9.
    let m: number;
    if (mp < 10) {
        m = mp + 3;
    } else {
        m = mp - 9;
    }

    // Adjust the year if month is January or February.
    const ay = m <= 2 ? 1 : 0;
    return { year: y + ay, month: m, day: d };
}

/**
 * Returns the day of the week as an integer (0 for Sunday to 6 for Saturday)
 * given the number of days from the Unix epoch.
 */
export function dayOfWeek(days: number): number {
    if (days >= -4) {
        return (days + 4) % 7;
    }
    return ((days + 5) % 7) + 6;
}

/**
 * Tests whether the given year is a leap year.
 */
export function isLeapYear(year: number): boolean {
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}

/**
 * Returns the last day of the month for a given year and month.
 */
export function lastDayOfMonth(year: number, month: number): number {
    if (month === 2) {
        return isLeapYear(year) ? 29 : 28;
    }
    if (month === 4 || month === 6 || month === 9 || month === 11) {
        return 30;
    }
    return 31;
}
