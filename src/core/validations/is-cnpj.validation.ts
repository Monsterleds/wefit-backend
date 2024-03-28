import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import { cnpj as validateCnpj } from 'cpf-cnpj-validator'; 

@ValidatorConstraint({ name: 'IsCnpj', async: false })
export class IsCnpj implements ValidatorConstraintInterface {
  validate(cnpj: string, args: ValidationArguments) {
    return validateCnpj.isValid(cnpj);
  }

  defaultMessage(args: ValidationArguments) {
    return "Invalid cnpj";
  }
}