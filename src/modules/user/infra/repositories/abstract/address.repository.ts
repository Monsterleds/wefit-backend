import { Transaction } from "sequelize";
import { Address } from "../../schemas/address.schema";

export interface IAddressRepository {
    create(address: Address, transaction?: Transaction): Promise<Address>;
}