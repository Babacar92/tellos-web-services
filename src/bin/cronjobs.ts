import { runCronJobs } from "src/libs/bin/cron/execution/main";

runCronJobs([
    {
        title: 'Hello World',
        schedule: '* * * * *',
        command: `echo "Hello World!"`,
    },
    {
        title: 'Reset encryption',
        schedule: '0 2 */1 * *',
        command: `npm run console fetch:unexist:encryption`,
    },
]);