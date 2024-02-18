import { CommandArgOptions, CommandArgType } from "../interface/command.args.interface";
import * as chalk from 'chalk';

/**
 * The command arg item Class
 */
export class CommandArgItem {

    /**
     * The raw value
     */
    public rawValue: any;

    /**
     * Is required
     */
    public required: boolean = false;

    /**
     * The name of arg
     */
    public type: CommandArgType = 'string';

    /**
     * Check type
     */
    private checkTypesMap = new Map([
        ['string', (value: any) => typeof value === 'string'],
        ['integer', (value: string) => !!value.match(/^[0-9]+$/)],
        ['float', (value: string) => !!value.match(/^[0-9]+((\.|\,)[0-9]+)?$/)],
        ['json', function (value: any) {
            try {
                JSON.parse(value);
                return true;
            } catch (e) {
                return false;
            }
        }],
        ['date', (value: string) => !!value.match(/^([0-9]{4}\-[0-9]{2}\-[0-9]{2}|[0-9]{2}\/[0-9]{2}\/[0-9]{4})$/)],
        ['time', (value: string) => !!value.match(/^[0-9]{2}\:[0-9]{2}(\:[0-9]{2})?$/)],
        ['datetime', (value: string) => !!value.match(/^[0-9]{4}\-[0-9]{2}\-[0-9]{2} [0-9]{2}\:[0-9]{2}(\:[0-9]{2})?$/)],
        ['boolean', (value: string) => !!value.match(/^(true|false)$/i)],
    ]);

    /**
     * Check type
     */
    private transformTypesMap = new Map([
        ['string', (value: string) => value],
        ['integer', (value: string) => parseInt(value)],
        ['float', (value: string) => parseFloat(value)],
        ['json', (value: string) => JSON.parse(value)],
        ['date', (value: string) => value],
        ['time', (value: string) => value],
        ['datetime', (value: string) => value],
        ['boolean', (value: string) => value === 'true'],
    ]);

    /**
     * The constructor
     * @param name 
     * @param options 
     */
    public constructor(
        public name: string,
        public value: any,
        public requireHelp: boolean,
        options?: CommandArgOptions,
    ) {
        if (options) {
            this.required = !!options.require;
            this.type = options.type || 'string';
        }

        this._checkValue(options);
    }

    /**
     * Check the type
     */
    private _checkValue(
        options?: CommandArgOptions,
    ): void {
        if (!this.requireHelp) {
            if (this.required && !this.value) {
                throw new Error(`The argument of ${chalk.yellow(this.name)} is required`);
            }

            if (this.value !== undefined) {
                this.rawValue = this.value;

                if (!this.checkTypesMap.get(this.type)(this.value)) {
                    throw new Error(`The type of argument ${chalk.yellow(this.name)} (${chalk.yellow(this.value)}) is not type ${chalk.yellow(this.type)}`);
                }

                if (options && options.transform) this.value = options.transform(this.value);
                else this.value = this.transformTypesMap.get(this.type)(this.value);

                if (options?.constraints?.length) {
                    const messages: string[] = [];

                    for (const i in options.constraints) {
                        const constraint = options.constraints[i];

                        if (!constraint.validate(this.value)) {
                            let message = constraint.message;

                            message = message.replace(/\{arg\}/gi, chalk.yellow(this.name));
                            message = message.replace(/\{value\}/gi, chalk.yellow(this.rawValue));

                            const matched = message.match(/\{[a-z\_0-9]+\}/gi);

                            if (matched) {
                                for (const im in matched) {
                                    const match = matched[im];
                                    const property = match.substring(1, match.length - 1);
                                    const regex = new RegExp(`\\{${property}\\}`, 'gi');

                                    if (constraint[property] !== undefined) {
                                        message = message.replace(regex, chalk.yellow(constraint[property]));
                                    }
                                }
                            }

                            messages.push(message);
                        }
                    }

                    if (messages.length) throw new Error(messages.join('\n\t '));
                }
            }
        }
    }

}