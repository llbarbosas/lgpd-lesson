(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "reflect-metadata"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getControllerMetadata = exports.Options = exports.Delete = exports.Patch = exports.Put = exports.Post = exports.Get = exports.Controller = void 0;
    require("reflect-metadata");
    const CONTROLLER_METADATA_KEY = Symbol("Controller");
    const Controller = (path) => (target) => {
        const currentMetadata = Reflect.getMetadata(CONTROLLER_METADATA_KEY, target.prototype) ?? {};
        const newMetadata = {
            ...currentMetadata,
            path,
        };
        Reflect.metadata(CONTROLLER_METADATA_KEY, newMetadata)(target.prototype);
    };
    exports.Controller = Controller;
    const buildRouteDecorator = (method) => (path) => (target, propertyKey, descriptor) => {
        const currentMetadata = Reflect.getMetadata(CONTROLLER_METADATA_KEY, target) ?? { handlers: [] };
        const newMetadataHandler = {
            name: propertyKey,
            path,
            method,
            handler: (instance) => descriptor.value?.bind(instance),
        };
        Reflect.metadata(CONTROLLER_METADATA_KEY, {
            ...currentMetadata,
            handlers: [...currentMetadata.handlers, newMetadataHandler],
        })(target.constructor.prototype);
    };
    exports.Get = buildRouteDecorator("GET");
    exports.Post = buildRouteDecorator("POST");
    exports.Put = buildRouteDecorator("PUT");
    exports.Patch = buildRouteDecorator("PATCH");
    exports.Delete = buildRouteDecorator("DELETE");
    exports.Options = buildRouteDecorator("OPTIONS");
    const getControllerMetadata = (target) => Reflect.getMetadata(CONTROLLER_METADATA_KEY, target);
    exports.getControllerMetadata = getControllerMetadata;
});
//# sourceMappingURL=Controller.js.map