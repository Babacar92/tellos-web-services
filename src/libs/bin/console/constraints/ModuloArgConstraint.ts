import { CommandArgConstraintInterface } from "../dto/interface/command.arg.constraint.interface";

export class IntModuloArgConstraint implements CommandArgConstraintInterface {

    public message: string = `The argument {arg}({value}) does not have the result {moduloResult} with the modulo {modulo}`;

    public constructor(
        public readonly modulo: number,
        public readonly moduloResult: number = 0,
    ) { }

    public validate(value: number): boolean {
        return value % this.modulo === this.moduloResult;
    }

}