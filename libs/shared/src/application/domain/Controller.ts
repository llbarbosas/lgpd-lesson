import { Method } from "./HTTP";

export const Controller =
  (path: string): ClassDecorator =>
  (target) => {};

const buildRouteDecorator =
  (method: Method) =>
  (path: string): MethodDecorator =>
  (target, propertyKey, descriptor) => {};

export const Get = buildRouteDecorator("GET");
export const Post = buildRouteDecorator("POST");
export const Put = buildRouteDecorator("PUT");
export const Patch = buildRouteDecorator("PATCH");
export const Delete = buildRouteDecorator("DELETE");
export const Options = buildRouteDecorator("OPTIONS");
