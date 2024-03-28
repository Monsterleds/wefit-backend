import { container } from "tsyringe";
import { NextFunction, Request, Response, Router } from "express";
import { UserController } from "./modules/user/controllers/user.controller";
import { RouteDefinition } from "./core/decorators/handlers.decorator";

const router = Router();

const Controllers = [
    UserController,
];

// trata os injectables, repassa os middlewares de validação e cria as rotas
Controllers.forEach((controller) => {
  const instance: any = container.resolve(controller);
  const prefix = Reflect.getMetadata("prefix", controller);
  const routes: Array<RouteDefinition> = Reflect.getMetadata(
    "routes",
    controller
  );

  routes.forEach((route) => {
    router[route.requestMethod](
      prefix + route.path, ...route.middlewares,
      (req: Request, res: Response, next: NextFunction) => {
        return instance[route.methodName](req, res, next);
      }
    );
  });
});

export default router;
