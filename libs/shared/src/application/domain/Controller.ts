import "reflect-metadata";
import { Handler, Method } from "./HTTP";

const CONTROLLER_METADATA_KEY = Symbol("Controller");

export type ControllerMetadata = {
  path: string;
  handlers: Array<{
    path: string;
    name: string;
    method: Method;
    handler: (instance: Object) => Handler;
  }>;
};

export const Controller =
  (path: ControllerMetadata["path"]): ClassDecorator =>
  (target) => {
    const currentMetadata =
      Reflect.getMetadata(CONTROLLER_METADATA_KEY, target.prototype) ?? {};

    const newMetadata: ControllerMetadata = {
      ...currentMetadata,
      path,
    };

    Reflect.metadata(CONTROLLER_METADATA_KEY, newMetadata)(target.prototype);
  };

const buildRouteDecorator =
  (method: Method) =>
  (path: string): MethodDecorator =>
  (target, propertyKey, descriptor) => {
    const currentMetadata = Reflect.getMetadata(
      CONTROLLER_METADATA_KEY,
      target
    ) ?? { handlers: [] };
    const newMetadataHandler = {
      name: propertyKey,
      path,
      method,
      handler: (instance: typeof target) =>
        (descriptor.value as any)?.bind(instance),
    };
    Reflect.metadata(CONTROLLER_METADATA_KEY, {
      ...currentMetadata,
      handlers: [...currentMetadata.handlers, newMetadataHandler],
    })(target.constructor.prototype);
  };

export const Get = buildRouteDecorator("GET");
export const Post = buildRouteDecorator("POST");
export const Put = buildRouteDecorator("PUT");
export const Patch = buildRouteDecorator("PATCH");
export const Delete = buildRouteDecorator("DELETE");
export const Options = buildRouteDecorator("OPTIONS");

export const getControllerMetadata = (target: Object): ControllerMetadata =>
  Reflect.getMetadata(CONTROLLER_METADATA_KEY, target);
