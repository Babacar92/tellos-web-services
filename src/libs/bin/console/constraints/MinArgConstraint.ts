import { CommandArgConstraintInterface } from "../dto/interface/command.arg.constraint.interface";

export class MinArgConstraint implements CommandArgConstraintInterface {

    public message: string = `The argument {arg}({value}) can't be under than {min}`;

    public constructor(
        public readonly min: any,
    ) { }

    public validate(value: any): boolean {
        return value > this.min;
    }

}