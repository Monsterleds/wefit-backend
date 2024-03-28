import { container } from "tsyringe";
import { CreateUserService } from './../../modules/user/services/create-user.service';
// import { SqsProvider } from './../../providers/queue/implementations/sqs.provider';
import { RabbiMqProvider } from "../../providers/queue/implementations/rabbitmq.provider";
import { IQueueProvider } from './../../providers/queue/queue.provider.interface';
import { IUserRepository } from "../../modules/user/infra/repositories/abstract/user.repository";
import { UserRepository } from "../../modules/user/infra/repositories/implementations/user.repository";
import { User } from "../../modules/user/infra/schemas/user.schema";
import { sequelize } from "../../../configs/databases/mysql";
import { IAddressRepository } from "../../modules/user/infra/repositories/abstract/address.repository";
import { AddressRepository } from "../../modules/user/infra/repositories/implementations/address.repository";
import { Address } from "../../modules/user/infra/schemas/address.schema";

container.register("UserModel", { useValue: sequelize.getRepository(User) });
container.register("AddressModel", { useValue: sequelize.getRepository(Address) });
container.registerSingleton<IUserRepository>("UserRepository", UserRepository);
container.registerSingleton<IAddressRepository>("AddressRepository", AddressRepository);
container.registerSingleton<CreateUserService>("CreateUserService", CreateUserService);
container.registerSingleton<IQueueProvider>("QueueProvider", RabbiMqProvider);
