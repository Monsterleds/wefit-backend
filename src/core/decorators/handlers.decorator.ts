import { ValidationError, validate, validateOrReject } from 'class-validator';
import { NextFunction, Request, Response } from 'express';

import { Methods } from '../enums/metadata.keys';
import { plainToClass, plainToInstance } from 'class-transformer';

export interface RouteDefinition {
  requestMethod: Methods;
  methodName: string;
  path: string;
  middlewares: any[];
}

export interface IRouter {
  method: Methods;
  path: string;
  handlerName: string | symbol;
}

function parseErrors(validationErrors: ValidationError[]): any {
  return validationErrors.map((validation) => {
    if (validation?.children && validation?.children?.length > 0) {
      const errors = parseErrors(validation.children)

      return errors
    }
    
    return Object.values(validation.constraints || {});
  })
}

const methodDecoratorFactory = (method: Methods) => {
  return (path: string, ...middlewaresDtos: any): any => {
    const middlewaresFunctions = middlewaresDtos.map((classesValidator: any) => {
      return async (req: Request, res: Response, next: NextFunction) => {
        try {
          const validator = new classesValidator();

          Object.keys(req.body).forEach((key) => {
            validator[key] = req.body[key];
          });

          const validatorObject = plainToInstance(classesValidator, req.body);
          const validationErrors = await validate(validatorObject);

          const errors = parseErrors(validationErrors).flat(Infinity)

          if (errors.length > 0) {
            return res.status(400).json(errors)
          }

          next();
        } catch (errors: any) {
          return res.status(500).send()
        }
      }
    });

    return (target: string, propertyKey: string): void => {
      if (!Reflect.hasMetadata('routes', target.constructor)) {
        Reflect.defineMetadata('routes', [], target.constructor);
      }
  
      const routes = Reflect.getMetadata('routes', target.constructor) as Array<RouteDefinition>;
  
      routes.push({
        requestMethod: method,
        path,
        methodName: propertyKey,
        middlewares: middlewaresFunctions,
      });
      Reflect.defineMetadata('routes', routes, target.constructor);
    };
  }
}
export const Get = methodDecoratorFactory(Methods.GET);
export const Post = methodDecoratorFactory(Methods.POST);
export const Put = methodDecoratorFactory(Methods.PUT);
export const Delete = methodDecoratorFactory(Methods.DELETE);
export const Patch = methodDecoratorFactory(Methods.PATCH);