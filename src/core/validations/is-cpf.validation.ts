import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import { cpf as validateCpf } from 'cpf-cnpj-validator'; 

@ValidatorConstraint({ name: 'IsCpf', async: false })
export class IsCpf implements ValidatorConstraintInterface {
  validate(cpf: string, args: ValidationArguments) {
    return validateCpf.isValid(cpf);
  }

  defaultMessage(args: ValidationArguments) {
    return "Invalid cpf";
  }
}