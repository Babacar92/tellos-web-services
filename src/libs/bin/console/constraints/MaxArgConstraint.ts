import { CommandArgConstraintInterface } from "../dto/interface/command.arg.constraint.interface";

export class MaxArgConstraint implements CommandArgConstraintInterface {

    public message: string = `The argument {arg}({value}) can't be greater than {max}`;

    public constructor(
        public readonly max: any,
    ) { }

    public validate(value: any): boolean {
        return value < this.max;
    }

}