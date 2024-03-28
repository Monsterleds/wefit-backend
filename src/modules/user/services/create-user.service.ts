import { inject, injectable } from "tsyringe";
import { CreateDTO } from "../controllers/dtos/user.dto";
import { UserRepository } from "../infra/repositories/implementations/user.repository";
import { AddressRepository } from "../infra/repositories/implementations/address.repository";
import { sequelize } from "../../../../configs/databases/mysql";

@injectable()
export class CreateUserService {
  constructor(
    private userRepository: UserRepository,
    private addressRepository: AddressRepository,
  ) {}

  async execute({ user, address }: CreateDTO) {
    const transaction = await sequelize.transaction();

    console.log(user, address)

    try {
      const { id } = await this.userRepository.create(user, transaction);
      await this.addressRepository.create({
        userId: id,
        ...address,
      }, transaction);
  
      await transaction.commit()
  
      return user;
    } catch (error) {
      console.error(error)
      await transaction.rollback();
    }
  }
}
