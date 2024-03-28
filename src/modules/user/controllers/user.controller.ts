import { Request, Response } from "express";
import { injectable } from "tsyringe";

import Controller from "../../../core/decorators/controller.decorator";
import { Post } from "../../../core/decorators/handlers.decorator";

import { CreateDTO } from "./dtos/user.dto";
import { SendQueueCreateUserService } from "../services/send-queue-create-user.service";

@Controller("/user")
@injectable()
export class UserController {
  constructor(private sendQueueCreateUserService: SendQueueCreateUserService) {}

  @Post("", CreateDTO)
  async create(req: Request, res: Response) {
    const user = await this.sendQueueCreateUserService.execute(req.body);
    return res.send(user);
  }
}
