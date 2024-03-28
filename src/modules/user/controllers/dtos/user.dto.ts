import { IsEmail, IsIn, IsNotEmpty, IsNumberString, IsObject, IsOptional, IsPhoneNumber, IsString, Matches, MaxLength, Validate, ValidateIf, ValidateNested } from "class-validator";
import { Type } from 'class-transformer';
import { IsCpf } from "../../../../core/validations/is-cpf.validation";
import { IsCnpj } from "../../../../core/validations/is-cnpj.validation";

export class CreateUserAddressDTO {
  @IsString()
  @IsNotEmpty()
  cep: string;

  @IsString()
  @IsNotEmpty()
  address: string;
  
  @IsString()
  @IsNotEmpty()
  addressNumber: number;
  
  @IsString()
  @IsOptional()
  complement?: string;
  
  @IsString()
  @IsNotEmpty()
  neighborhood: string;
  
  @IsString()
  @IsNotEmpty()
  city: string;
  
  @MaxLength(2)
  @IsString()
  @IsNotEmpty()
  state: string;
}

export class CreateUserDTO {
  @IsIn(['PF', 'PJ'])
  type: 'PF' | 'PJ';

  @ValidateIf(o => o.type === 'PJ')
  @Validate(IsCnpj)
  @IsString()
  cnpj?: string;
  
  @Validate(IsCpf)
  @IsNotEmpty()
  cpf: string;

  @IsString()
  @IsNotEmpty()
  name: string;
  
  @IsString()
  @IsPhoneNumber('BR')
  @IsNotEmpty()
  phone: string;
  
  @IsString()
  @IsPhoneNumber('BR')
  @IsOptional()
  telephone?: string;
  
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;
}

export class CreateDTO {
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateUserDTO)
  user: CreateUserDTO;
  
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateUserAddressDTO)
  address: CreateUserAddressDTO;
}