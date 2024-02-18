export class DateDiff {

    private readonly diff: {
        instance?: Date,
        years: number,
        months: number,
        days: number,
        hours: number,
        minutes: number,
        seconds: number,
        milliseconds: number,
    } = {
            years: 0,
            months: 0,
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0,
            milliseconds: 0,
        };

    public constructor(
        private readonly date1: Date,
        private readonly date2: Date,
    ) {
        this._checkDates();
        this._setDiff();
    }

    public getDiff() {
        return this.diff;
    }

    private _checkDates(): void {
        if (!(this.date1 instanceof Date)) {
            throw new Error(`The first date must be an instance of Date`);
        } else if (!(this.date2 instanceof Date)) {
            throw new Error(`The second date must be an instance of Date`);
        } else if (this.date1 > this.date2) {
            throw new Error(`The first date cannot be greater than the second`);
        }
    }

    private _setDiff(): void {
        const diff = new Date(this.date2.getTime() - this.date1.getTime());
        this.diff.instance = diff;
        this.diff.years = diff.getUTCFullYear() - 1970;
        this.diff.months = diff.getUTCMonth();
        this.diff.days = diff.getUTCDate() - 1;
        this.diff.hours = diff.getUTCHours();
        this.diff.minutes = diff.getUTCMinutes();
        this.diff.seconds = diff.getUTCSeconds();
        this.diff.milliseconds = diff.getUTCMilliseconds();
    }

}