(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Options = exports.Delete = exports.Patch = exports.Put = exports.Post = exports.Get = exports.Controller = void 0;
    const Controller = (path) => (target) => { };
    exports.Controller = Controller;
    const buildRouteDecorator = (method) => (path) => (target, propertyKey, descriptor) => { };
    exports.Get = buildRouteDecorator("GET");
    exports.Post = buildRouteDecorator("POST");
    exports.Put = buildRouteDecorator("PUT");
    exports.Patch = buildRouteDecorator("PATCH");
    exports.Delete = buildRouteDecorator("DELETE");
    exports.Options = buildRouteDecorator("OPTIONS");
});
//# sourceMappingURL=Controller.js.map