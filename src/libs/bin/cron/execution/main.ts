import { JobItemInterface } from "../dto/interfaces/job.item.interface";
import { COMMAND_REPONSE_CODE } from "../../console/dto/enum/command.response.code.enum";
import { parseExpression } from "cron-parser";
import * as dotenv from "dotenv";
import * as chalk from 'chalk';
import { CronJob } from "../dto/classes/CronJob";
import { getCurrentCronDate, isCronJobsExecution } from "src/utils/console.utils";
import { dateToTimestamp } from "src/utils/utils";

dotenv.config();

const {
    CONTAINER_TIMEZONE,
} = process.env;

/**
 * Run all jobs if it is their time
 * Go to this website to now how create a perfect schedule job
 * 
 * https://crontab.guru/
 * 
 * @param jobs 
 */
export const runCronJobs = async (jobs: JobItemInterface[]) => {
    try {
        // Check if is run by src/bin/cronjobs
        if (!isCronJobsExecution()) {
            throw new Error('Is not a process of src/bin/cronjobs');
        }

        // Set now
        const now = new Date(getCurrentCronDate());

        console.log(`[START]: CRONJOBS start at ${chalk.yellow(dateToTimestamp(null, 'H:i:s.ms d/m/Y'))}`);

        for (const i in jobs) {
            const job = jobs[i];

            // Check length schedule
            if (job.schedule.split(' ').length !== 5) {
                throw new Error(chalk.red(`The schedule (${chalk.yellow(job.schedule)}) of job ${chalk.yellow(job.title)} isn't valid`));
            }

            // Create schedule
            const schedule = parseExpression(job.schedule, {
                currentDate: now,
                tz: CONTAINER_TIMEZONE,
            });

            // Next Date
            const nextDate = new Date(schedule.next().toString());

            // Prev Date
            const prevDate = new Date(schedule.prev().toString());

            // Check if is time for this
            if (nextDate.getTime() === now.getTime() || prevDate.getTime() === now.getTime()) {
                // Get Instance
                const instance = new CronJob(job);

                // Get result
                const result = await instance.run();
            }
        }

        console.log(`\n[FINISH]: CRONJOBS finish at ${chalk.yellow(dateToTimestamp(null, 'H:i:s.ms d/m/Y'))}`);
        process.exit();
    } catch (e) {
        console.error(e);
        console.log(`\n[FINISH]: CRONJOBS finish at ${chalk.yellow(dateToTimestamp(null, 'H:i:s.ms d/m/Y'))}`);
        process.exit(COMMAND_REPONSE_CODE.ERROR);
    }
};