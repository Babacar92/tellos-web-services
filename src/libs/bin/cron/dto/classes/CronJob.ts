import { exec } from "child_process";
import { DateDiff } from "src/libs/classes/DateDiff";
import { JobItemInterface } from "../interfaces/job.item.interface";
import * as chalk from 'chalk';

/**
 * The cron job instance
 */
export class CronJob implements JobItemInterface {

    public readonly title: string;

    public readonly schedule: string;

    public readonly command: string;

    public readonly before?: string;

    public readonly after?: string;

    public constructor(
        data: JobItemInterface
    ) {
        Object.assign(this, data);
    }

    public run(): Promise<any> {
        console.log('\n========================================================\n');
        console.log(chalk.yellow(`Execution of the ${chalk.green(this.title)} job (${chalk.green(this.schedule)})\n`));

        return new Promise(async (resolve, reject) => {
            // Run before
            if (this.before) {
                const before = await this._runBefore();
            }

            // Run job
            const result = await this._execute();

            // Run after
            if (this.after) {
                const after = await this._runAfter();
            }

            // Return result
            resolve(this);
        });
    }

    private _runBefore(): Promise<any> {
        return this._execCommand(this.before, "BEFORE", "BEFORE RESPONSE");
    }

    private _runAfter(): Promise<any> {
        return this._execCommand(this.after, "AFTER", "AFTER RESPONSE");
    }

    private _execute(): Promise<any> {
        return this._execCommand(this.command, "JOB", "JOB RESPONSE");
    }

    private _execCommand(command: string, commandTitle: string, stdoutTitle: string): Promise<any> {
        return new Promise(async (resolve, reject) => {
            console.log(`${chalk.blue(`[${commandTitle} TASK]`)} > ${command}`);

            const start = new Date();
            exec(command, (error, stdout, stderr) => {
                const diff = new DateDiff(start, new Date());
                const {
                    hours, minutes, seconds, milliseconds,
                } = diff.getDiff();

                console.log(chalk.bgBlue(` [DURATION] H:${hours} M:${minutes} S:${seconds} MS:${milliseconds} `));

                // Catch error
                if (error) {
                    console.log(`\n${chalk.red('[ERROR]')}: ${error.message}`);
                }

                // Check stderr
                if (stderr) {
                    console.log(`\n${chalk.yellow('[WARNING]')}: ${stderr}`);
                }

                // Check out
                if (stdout) {
                    console.log(`\n${chalk.green(`[${stdoutTitle}]`)}:`);
                    console.log(stdout);
                }

                resolve(this);
            });
        });
    }

}