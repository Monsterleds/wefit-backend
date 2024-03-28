import { inject, injectable } from "tsyringe";
import { CreateDTO, CreateUserDTO } from "../controllers/dtos/user.dto";
import { IQueueProvider } from "../../../providers/queue/queue.provider.interface";
import { BadRequestException } from "../../../errors/exceptions/bad-request.exception";
import { CreateUserService } from "./create-user.service";
import { UserRepository } from "../infra/repositories/implementations/user.repository";

@injectable()
export class SendQueueCreateUserService {
  constructor(
    @inject('QueueProvider')
    private queueProvider: IQueueProvider,
    private createUserService: CreateUserService,
    private userRepository: UserRepository,
  ) {
    this.queueProvider.subscribe(process.env.QUEUE_CREATE_USER_NAME || 'fila-teste', (user) => this.createUserService.execute(user))
  }

  async execute({ user, address }: CreateDTO): Promise<void> {
    if (!process.env.QUEUE_CREATE_USER_NAME) {
      throw new BadRequestException('enviroment QUEUE_CREATE_USER_NAME is required')
    }
    
    const emailExists = await this.userRepository.findByEmail(user.email);
    
    if (emailExists) {
      throw new BadRequestException('Existe um usuário atrelado a esse email.')
    }
    
    const cpfExists = await this.userRepository.findByCpf(user.cpf);
    
    if (cpfExists) {
      throw new BadRequestException('Existe um usuário atrelado a esse cpf.')
    }
    
    await this.queueProvider.sendMessage(process.env.QUEUE_CREATE_USER_NAME, { user, address });
  }
}
