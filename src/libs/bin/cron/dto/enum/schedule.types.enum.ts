/**
 * Schedule types
 */
export enum SCHEDULE_TYPES {
    EVERYTIME = "* * * * *",
    EVERYHOUR = "0 */1 * * *",
    EVERYDAY = "0 0 */1 * *",
    EVERYMONTH = "0 0 1 */1 *",
    EVERYYEAR = "0 0 1 1-1 *",
}