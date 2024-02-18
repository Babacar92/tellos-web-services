import { BadRequestException } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import * as dotenv from 'dotenv';
dotenv.config();

const {
    APP_ENV,
} = process.env;

// Type String
const GENERATED_UPPERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const GENERATED_LOWERS = "abcdefghijklmnopqrstuvwxyz";
const GENERATED_NUMBERS = "0123456789";
const GENERATED_SPEC_CHARS = "$&_-=+/%&@#~<>!?";
const SPECIAL_CHARS = [
    //        " ", ".", "'", "\"", "/", "$",
    //        "!", "(", ")", "#", "&", "?",
    "à", "â", "ä", "á", "ã", "å",
    "î", "ï", "ì", "í",
    "ô", "ö", "ò", "ó", "õ", "ø",
    "ù", "û", "ü", "ú",
    "é", "è", "ê", "ë",
    "ç", "ÿ", "ñ",
    "Â", "Ê", "Î", "Ô", "Û", "Ä", "Ë", "Ï", "Ö", "Ü",
    "À", "Æ", "æ", "Ç", "É", "È", "Œ", "œ", "Ù",
];
const REPLACE_CHARS = [
    //    "-", "-", "-", "-", "-", "-",
    //    "-", "-", "-", "-", "-", "-",
    "a", "a", "a", "a", "a", "a",
    "i", "i", "i", "i",
    "o", "o", "o", "o", "o", "o",
    "u", "u", "u", "u",
    "e", "e", "e", "e",
    "c", "y", "n",
    "A", "E", "I", "O", "U", "A", "E", "I", "O", "U",
    "A", "AE", "ae", "C", "E", "E", "OE", "oe", "U",
];

/**
 * Débug data variables
 * @param args 
 */
export const dump = (...args: any[]) => {
    if (APP_ENV === "prod") return;

    args.forEach(value => {
        console.log('\n::::::::::: DEBUGGING START :::::::::::');
        console.log(value);
        console.log(':::::::::::: DEBUGGING END ::::::::::::\n');
    });
}

/**
 * Concat string
 * @param values 
 * @returns 
 */
export const concat = (...values: string[]) => {
    return values.join('');
}

/**
 * Generate random string
 * @param length 
 * @param upperChar 
 * @param lowerChar 
 * @param intChar 
 * @param specChar 
 * @returns 
 */
export const gen = (
    length: number,
    upperChar: boolean = true,
    lowerChar: boolean = true,
    intChar: boolean = true,
    specChar: boolean = true
): string => {
    let
        value = "",
        characters = ""
        ;

    if (!!upperChar) characters += GENERATED_UPPERS;
    if (!!lowerChar) characters += GENERATED_LOWERS;
    if (!!intChar) characters += GENERATED_NUMBERS;
    if (!!specChar) characters += GENERATED_SPEC_CHARS;

    if (characters !== "") {
        if (!is_type(length, 'number')) length = 5;
        for (let i = 0; i < length; i++) {
            value += characters.charAt(Math.floor(Math.random() * characters.length))
        }
    }
    return value;
}

/**
 * Transform enum to array
 * @param data 
 * @returns 
 */
export const enumToArray = (data: any) => {
    const values = [];
    for (let _key in data) {
        values.push(data[_key]);
    }
    return values;
}

/**
 * Check le type de la value
 * @param value 
 * @param type 
 * @returns 
 */
export const is_type = (value: any, type: any) => {
    return typeof value === type || (typeof type === 'function' && value instanceof type);
}

/**
 * Repeat string
 * @param value 
 * @param length 
 * @returns 
 */
export const repeatString = (value: string, length: number): string => {
    if (value && length > 0) {
        if (value.length === length) return value;

        let returnedValue = value;
        for (let i = 1; i < length; i++) {
            returnedValue += value;
        }
        return returnedValue;
    }
    return value;
}

/**
 * Return perfect format number
 * @param num 
 * @param length 
 * @param replaceTo 
 * @returns 
 */
export const formatNumber = (num?: number, length: number = 2, replaceTo: string = '0'): string => {
    if (num > -1 && length > 0) {
        let numString = num.toString();
        if (numString.length < length) {
            return repeatString(replaceTo, (length - numString.length)) + numString;
        }
        return numString;
    }
    return num?.toString();
};

/**
 * Return timestamp
 * @param date 
 * @returns 
 */
export const dateToTimestamp = (
    date?: Date | string,
    format: 'time' | 'date' | 'datetime' | 'datetimes' | string = 'Y-m-d H:i:s'
): string => {
    if (!date) date = new Date();
    else if (!(date instanceof Date)) date = new Date(date);

    if (isNaN(<any>date)) return;

    // Set parts
    const parts = {
        Y: date.getFullYear(),
        m: formatNumber(date.getMonth() + 1),
        d: formatNumber(date.getDate()),
        H: formatNumber(date.getHours()),
        i: formatNumber(date.getMinutes()),
        s: formatNumber(date.getSeconds()),
        ms: formatNumber(date.getMilliseconds()),
    };

    if (!format) format = 'Y-m-d H:i:s';
    else if (format === 'time') format = 'H:i';
    else if (format === 'date') format = 'Y-m-d';
    else if (format === 'datetime') format = 'Y-m-d H:i';
    else if (format === 'datetimes') format = 'Y-m-d H:i:s';

    let value: string = '';

    // Split all value
    const partsFormat = format.split('');

    for (const i in partsFormat) {
        const partFormat = partsFormat[i];
        value += parts[partFormat] || partFormat;
    }

    return value;
}

/**
 * Return a slug of value
 * @param value 
 * @returns 
 */
export const slug = (value: any) => {
    if (value) {
        value = value.toLocaleLowerCase();
        value = value.replace(new RegExp(SPECIAL_CHARS.join('|'), 'g'), (str: string) => {
            return REPLACE_CHARS[SPECIAL_CHARS.indexOf(str)];
        });
        const match = value.match(/[a-z0-9]+/gi);
        if (match) {
            value = match.join(' ');
        }
        value = value.trim();
        return value.replace(/[ ]+/gi, '-');
    }
    return value;
};

/**
 * Handle the validation errors
 */
export const handleValidationErrors = (errors: ValidationError[]): BadRequestException => {
    const message: any = {};
    for (let _k in errors) {
        const _error = errors[_k];
        let errorMessage: any;

        for (let _cK in _error.constraints) {
            const cMessage = _error.constraints[_cK];
            if (!errorMessage) errorMessage = cMessage;
            else if (typeof errorMessage === 'string') {
                errorMessage = [errorMessage];
                errorMessage.push(cMessage);
            } else errorMessage.push(cMessage);
        }

        message[_error.property] = errorMessage;
    }

    return new BadRequestException({
        message,
        statusCode: 400,
        error: "Bad request",
    });
};

/**
 * @param {*} a
 * @param {*} b
 * @return {number}
 */
export const ascendingResult = (a: any, b: any) => {
    let unComparValue = ascOrDescResult(a, b);
    if (unComparValue) return unComparValue;
    return (a == b) ? 0 : ((a < b) ? -1 : 1);
}

/**
 * @param {*} a
 * @param {*} b
 * @return {number}
 */
export const descendingResult = (a: any, b: any) => {
    let unComparValue = ascOrDescResult(a, b);
    if (unComparValue) return unComparValue;
    return (a == b) ? 0 : ((a < b) ? 1 : -1);
}

/**
 * @param {*} a
 * @param {*} b
 * @return {number|undefined}
 */
export const ascOrDescResult = (a: any, b: any) => {
    if (!isSet(a) && isSet(b)) return 1;
    else if (isSet(a) && !isSet(b)) return -1;
    else if (!isSet(a) && !isSet(b)) return 0;
}

/**
 * Check if value is set
 * @param value 
 * @returns 
 */
export const isSet = (value: any): boolean => {
    return value !== null && value !== undefined;
}

/**
 * Remove accent of text
 * @param value 
 * @returns 
 */
export const removeAccent = (value?: string): string | undefined => {
    if (value) {
        return value.replace(new RegExp(SPECIAL_CHARS.join("|"), "g"), str => REPLACE_CHARS[SPECIAL_CHARS.indexOf(str)]);
    }
    return;
}

/**
 * Return age of date birthday
 */
export const getAge = (date?: Date | string): number | undefined => {
    if (date) {
        date = !(date instanceof Date) ? new Date(date) : date;

        if (!isNaN(<any>date)) {
            const today = new Date();
            const monthDiff = today.getMonth() - date.getMonth();
            let age = today.getFullYear() - date.getFullYear();

            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < date.getDate())) {
                age--;
            }

            return age;
        }
    }
}


/**
 * Return number days of Leave 
 */
export const getnumberDays = (startDate?: Date, endDate?: Date, startDay?: String, endDay?: String,) => {
    var sDate = new Date(startDate);
    var eDate = new Date(endDate);

    var numberDaysOneDays = 0;

    const _MS_PER_DAY = 1000 * 60 * 60 * 24;
    // Discard the time and time-zone information.
    const utc1 = Date.UTC(sDate.getFullYear(), sDate.getMonth(), sDate.getDate());
    const utc2 = Date.UTC(eDate.getFullYear(), eDate.getMonth(), eDate.getDate());

    //
    if (startDay === "startAllDay") {
        numberDaysOneDays = 1;
        const numberDays = numberDaysOneDays;
        return numberDays

    } else if (
        (startDay === "startHalfAmDay" || startDay === "startHalfPmDay")
    ) {
        numberDaysOneDays = 0.5;
        const numberDays = numberDaysOneDays;
        return numberDays;
    } else if (startDay === "startAllDay" && endDay === "endAllDay") {
        numberDaysOneDays = 1;
        const numberDays = Math.floor((utc2 - utc1) / _MS_PER_DAY) + numberDaysOneDays;
    }
    else {
        const numberDays = Math.floor((utc2 - utc1) / _MS_PER_DAY);

        return numberDays;
    }

}


/**
 * Return years of seniority
 */
export const getSeniorityYears = (firstDate?: Date, secondDate?: Date) => {
    var entryDate = new Date(firstDate);
    var senirityDate = new Date(secondDate);

    var ageDifMs = Date.now() - entryDate.getTime();
    var ageDifMs2 = Date.now() - senirityDate.getTime();

    var ageDate = new Date(ageDifMs);
    var ageDate2 = new Date(ageDifMs2);
    return Math.abs(ageDate.getUTCFullYear() - ageDate2.getUTCFullYear());
}

/**
 * Return year of leave
 */
export const getYear = (startDate?: Date) => {
    var startDate = new Date(startDate);
    var year = startDate.getFullYear();

    return year;
}

export const calculateBalance = (countAcquiredLeave?: number, countUsableLeave?: number) => {
    return countAcquiredLeave - countUsableLeave;
}







