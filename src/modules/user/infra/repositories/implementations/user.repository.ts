import { inject, injectable } from "tsyringe";
import { IUserRepository } from "../abstract/user.repository";
import { User } from "../../schemas/user.schema";
import { Repository } from "sequelize-typescript";
import { Transaction } from "sequelize";
import { CreateUserDTO } from "../../../controllers/dtos/user.dto";

@injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @inject("UserModel")
    private userModel: Repository<User>
  ) {}

  async create(payload: CreateUserDTO, transaction?: Transaction): Promise<User> {
    return this.userModel.create({
        ...payload,
    }, { transaction });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ where: { email } });
  }

  async findByCpf(cpf: string): Promise<User | null> {
    return this.userModel.findOne({ where: { cpf } });
  }
}
