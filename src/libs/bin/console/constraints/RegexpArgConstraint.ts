import { CommandArgConstraintInterface } from "../dto/interface/command.arg.constraint.interface";

export class RegexpArgConstraint implements CommandArgConstraintInterface {

    public message: string = `The argument {arg}({value}) doesn't match with regex {regexp}`;

    public constructor(
        public readonly regexp: RegExp,
        public readonly match: boolean = true,
    ) { }

    public validate(value: any): boolean {
        return !!value.toString().match(this.regexp) === this.match;
    }

}