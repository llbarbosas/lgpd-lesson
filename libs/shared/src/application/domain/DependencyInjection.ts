import { ClassType } from "src/core";

export const Injectable =
  (name?: string): ClassDecorator =>
  (target) => {};

export const Inject =
  (name?: string): PropertyDecorator =>
  (target, propertyKey) => {};

export class Container {
  static get(target: ClassType) {}
}
