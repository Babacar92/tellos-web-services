import { CommandArgItem } from "../arg/command.arg.item";
import { createInterface } from 'readline';
import * as chalk from 'chalk';
import { KeypressDataInterface } from "../interface/command.keypress.interface";
import { Writable } from "stream";
import { repeatString } from "../../../../../utils/utils";

/**
 * The input terminal
 */
export class Input {

    /**
     * List of argument
     */
    private args?: CommandArgItem[];

    /**
     * Set the args for input
     * @param args 
     */
    public setArgs(args?: CommandArgItem[]): Input {
        if (!this.args && args) this.args = args;
        return this;
    }

    /**
     * Return value of arg
     * @param name 
     * @param defaultValue 
     * @returns 
     */
    public getArg(name: string, defaultValue?: any): any {
        const value = this.args.find(a => a.name === name)?.value;
        if (value !== undefined) {
            return value;
        }
        return defaultValue;
    }

    /**
     * Return all arg
     * @returns 
     */
    public getArgs(): any[] {
        return this.args.map(a => a.value);
    }

    /**
     * Ask one question to user
     * @param message 
     * @param defaultValue 
     * @returns 
     */
    public async ask(
        message?: string,
        defaultValue?: any,
        suggestions?: string[] | { [key: string]: string | string }
    ): Promise<any> {
        return new Promise(async (resolve, reject) => {
            const rl = createInterface({
                input: process.stdin,
                output: process.stdout,
                terminal: true,
            });
            message = this._getMessage(message);

            let lastFound: string;

            rl.question(message, response => {
                resolve(lastFound || response || defaultValue || '');
                rl.close();
            });

            if (suggestions) {
                if (!(suggestions instanceof Array)) suggestions = [...Object.keys(suggestions), ...Object.values(suggestions)];
                const { stdout, stdin } = process;

                stdin.on('keypress', (c: string, k: KeypressDataInterface) => {
                    if (!k.name.match(/^(enter|return)$/i)) {

                        const found = (<string[]>suggestions).find((s: string) => {
                            if (rl.line) {
                                s = s.substring(0, rl.line.length);
                                return s === rl.line;
                            }
                            return false;
                        }) || "";

                        stdout.write('\r');

                        if (found.length && found !== rl.line) {
                            const shortFound = found.substring(rl.line.length, found.length);
                            stdout.write(`> ${rl.line}${chalk.bgWhite(shortFound)}`);
                            if (lastFound && lastFound.length > shortFound.length) {
                                const whiteSpaceLength = lastFound.length - shortFound.length;
                                stdout.write(repeatString(' ', whiteSpaceLength));
                                stdout.moveCursor(-(whiteSpaceLength + shortFound.length), 0);
                            } else {
                                stdout.moveCursor(-shortFound.length, 0);
                            }
                            lastFound = shortFound;
                        } else {
                            if (lastFound) {
                                stdout.write(`> ${rl.line}${repeatString(' ', lastFound.length)}`);
                                stdout.moveCursor(-lastFound.length, 0);
                                lastFound = "";
                            } else {
                                stdout.write(`> ${rl.line}`);
                            }
                        }

                        lastFound = found;
                    }
                });
            }
        });
    }

    /**
     * Ask one question to user
     * @param message 
     * @param defaultValue 
     * @returns 
     */
    public async secret(message?: string, defaultValue?: any): Promise<any> {
        return new Promise(async (resolve, reject) => {

            const stddd = new Writable({
                write(chunk, encoding, callback) {
                    if (!(<any>this).muted) process.stdout.write(chunk, encoding);
                    callback();
                },
            });

            (<any>stddd).muted = false;

            const rl = createInterface({
                input: process.stdin,
                output: process.stdout,
                terminal: true,
            });
            message = this._getMessage(message);

            let makeHidden = true;

            (<any>rl)._writeToOutput = (a: string) => {
                // if (makeHidden) {
                //     process.stdout.write(a);
                //     makeHidden = false;
                // } else {
                //     process.stdout.write('*');
                // }
                if (a.includes(message)) {
                    if (rl.line) {
                        if (a.includes(`> ${rl.line}`)) {
                            process.stdout.write(a.replace(`> ${rl.line}`, `> ${repeatString('*', rl.line.length)}`));
                        } else {
                            process.stdout.write(repeatString('*', rl.line.length));
                        }
                    } else {
                        process.stdout.write(a);
                    }
                } else {
                    process.stdout.write('*');
                }
            };

            rl.question(message, (response: string) => {
                console.log('');
                resolve(response || defaultValue || '');
                rl.close();
            });
        });
    }

    private _getMessage(message?: string): string {
        return message ? `${message}\n> ` : '> ';
    }

    private _isBackspace(k: KeypressDataInterface): boolean {
        return k.name === 'backspace';
    }

}