import { CommandArgConstraintInterface } from "../dto/interface/command.arg.constraint.interface";

export class MaxLengthArgConstraint implements CommandArgConstraintInterface {

    public message: string = `The length of argument {arg}({value}) can't be greater than {max}`;

    public constructor(
        public readonly max: number,
    ) { }

    public validate(value: any): boolean {
        return value.length < this.max;
    }

}