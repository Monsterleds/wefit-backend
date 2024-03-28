import { inject, injectable } from "tsyringe";
import { Repository } from "sequelize-typescript";
import { IAddressRepository } from "../abstract/address.repository";
import { Address } from "../../schemas/address.schema";
import { Transaction } from "sequelize";

interface CreateAddressDTO {
  userId: string;
  cep: string;
  address: string;
  addressNumber: number;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
}

@injectable()
export class AddressRepository implements IAddressRepository {
  constructor(
    @inject("AddressModel")
    private addressModel: Repository<Address>
  ) {}

  async create(payload: CreateAddressDTO, transaction?: Transaction): Promise<Address> {
    return this.addressModel.create({
        ...payload,
    }, { transaction });
  }
}
