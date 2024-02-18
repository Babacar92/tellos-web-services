import { CommandArgConstraintInterface } from "../dto/interface/command.arg.constraint.interface";

export class MinLengthArgConstraint implements CommandArgConstraintInterface {

    public message: string = `The length of argument {arg}({value}) can't be lower than {min}`;

    public constructor(
        public readonly min: number,
    ) { }

    public validate(value: any): boolean {
        return value.length > this.min;
    }

}