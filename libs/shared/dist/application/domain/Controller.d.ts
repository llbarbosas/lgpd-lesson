import "reflect-metadata";
import { Handler, Method } from "./HTTP";
export declare type ControllerMetadata = {
    path: string;
    handlers: Array<{
        path: string;
        name: string;
        method: Method;
        handler: (instance: Object) => Handler;
    }>;
};
export declare const Controller: (path: ControllerMetadata["path"]) => ClassDecorator;
export declare const Get: (path: string) => MethodDecorator;
export declare const Post: (path: string) => MethodDecorator;
export declare const Put: (path: string) => MethodDecorator;
export declare const Patch: (path: string) => MethodDecorator;
export declare const Delete: (path: string) => MethodDecorator;
export declare const Options: (path: string) => MethodDecorator;
export declare const getControllerMetadata: (target: Object) => ControllerMetadata;
