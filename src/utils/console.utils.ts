import { dateToTimestamp } from "./utils";

/**
 * Check if is console execution
 * @returns 
 */
export const isConsoleExecution = (): boolean => isCommandExecution() || isCronJobsExecution();

/**
 * Check if is console execution
 * @returns 
 */
export const isCommandExecution = (): boolean => !!process.argv[1]?.match(/console$/i);

/**
 * Check if is console execution
 * @returns 
 */
export const isCronJobsExecution = (): boolean => !!process.argv[1]?.match(/cronjobs$/i);

/**
 * Return current date for cron
 * @returns 
 */
export const getCurrentCronDate = (): string => {
    return dateToTimestamp(null, 'datetime');
};