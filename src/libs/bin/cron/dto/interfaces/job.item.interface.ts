import { SCHEDULE_TYPES } from "../enum/schedule.types.enum";

/**
 * The job item interface
 */
export interface JobItemInterface {

    /**
     * Title of job
     */
    title: string;

    /**
     * The schedule of job
     */
    schedule: SCHEDULE_TYPES | string;

    /**
     * The command of Job
     */
    command: string;

    /**
     * Execution before command is running
     */
    before?: string;

    /**
     * Execution after command is finish to run
     */
    after?: string;

}