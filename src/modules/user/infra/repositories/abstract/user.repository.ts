import { Transaction } from "sequelize";
import { User } from "../../schemas/user.schema";

export interface CreateUserDTO {
    name: string;
    type: "PF" | "PJ";
    cnpj?: string;
    cpf: string;
    phone: string;
    telephone?: string;
    email: string;
  }

export interface IUserRepository {
    create(user: CreateUserDTO, transaction?: Transaction): Promise<User>;
    findByEmail(email: string): Promise<User | null>;
    findByCpf(cpf: string): Promise<User | null>;
}