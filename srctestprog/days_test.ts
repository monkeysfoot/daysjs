// test.ts
import { fromYMD, toYMD, dayOfWeek, lastDayOfMonth } from '../src';

/**
 * Throws an error if the provided condition is false.
 * @param condition A boolean condition that must be true.
 * @param message Error message if the condition is false.
 */
function assert(condition: boolean, message: string): void {
    if (!condition) {
        throw new Error(message);
    }
}

/**
 * Test routine that iterates over a wide range of dates,
 * verifying the correctness and consistency of the date calculations.
 * @param numyrs The number of years (positive) for the test range. Iterates from -numyrs to +numyrs.
 * @returns An object with the time taken in seconds and the total days processed.
 */
function testRoutine(numyrs: number): { timeTaken: number; daysProcessed: number } {
    // Static asserts

    // Check that 1970-01-01 is day 0.
    const dfc = fromYMD(1970, 1, 1);
    assert(dfc === 0, `1970-01-01 should be day 0, got ${dfc}`);

    // Check that converting day 0 back yields 1970-01-01.
    const { year: y0, month: m0, day: d0 } = toYMD(0);
    assert(y0 === 1970 && m0 === 1 && d0 === 1, "1970-01-01 should correspond to day 0");

    // Check that 1970-01-01 is a Thursday (4).
    assert(dayOfWeek(fromYMD(1970, 1, 1)) === 4, "1970-01-01 should be a Thursday");

    // Set up the starting year and check initial conditions.
    const ystart = -numyrs;
    let prevZ = fromYMD(ystart, 1, 1) - 1;
    assert(prevZ < 0, "Previous day should be less than 0");
    let prevWd = dayOfWeek(prevZ);
    assert(prevWd >= 0 && prevWd <= 6, "Weekday should be in range 0-6");

    // Start the timer.
    const startTime = Date.now();

    // Iterate over years from -numyrs to +numyrs.
    for (let y = ystart; y <= -ystart; y++) {
        // For each month from 1 to 12.
        for (let m = 1; m <= 12; m++) {
            const e = lastDayOfMonth(y, m);
            // For each day in the month.
            for (let d = 1; d <= e; d++) {
                const z = fromYMD(y, m, d);

                // Verify that the day count increases consecutively.
                assert(prevZ < z, "Days should be in increasing order");
                assert(z === prevZ + 1, "Days should be consecutive");

                // Convert the day count back to a date and check consistency.
                const { year: yp, month: mp, day: dp } = toYMD(z);
                assert(y === yp, "Year should match");
                assert(m === mp, "Month should match");
                assert(d === dp, "Day should match");

                // Verify that the day of week is within the valid range (0-6).
                const wd = dayOfWeek(z);
                assert(wd >= 0 && wd <= 6, "Weekday should be in range 0-6");

                // Update previous day count and weekday.
                prevZ = z;
                prevWd = wd;
            }
        }
    }

    // Stop the timer.
    const endTime = Date.now();
    const timeTaken = (endTime - startTime) / 1000; // seconds

    // Calculate the total number of days processed.
    const daysProcessed = fromYMD(numyrs, 12, 31) - fromYMD(-numyrs, 1, 1);
    return { timeTaken, daysProcessed };
}

/**
 * The main function runs the test routine and prints the results.
 */
function main(): void {
    const numyrs = 1000000; // You can adjust this value if needed.
    const { timeTaken, daysProcessed } = testRoutine(numyrs);
    console.log(`Duration: ${timeTaken.toFixed(2)} seconds`);
    console.log(`Processed ${daysProcessed} days`);
}

// Run the main test program.
main();
