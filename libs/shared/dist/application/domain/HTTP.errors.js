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
    exports.InternalServerError = exports.NotFoundError = void 0;
    class NotFoundError {
        message;
        errorCode;
        name = "NotFoundError";
        status = 404;
        constructor(message = "Data not found", errorCode) {
            this.message = message;
            this.errorCode = errorCode;
        }
    }
    exports.NotFoundError = NotFoundError;
    class InternalServerError {
        message;
        errorCode;
        name = "InternalServerError";
        status = 500;
        constructor(message = "Internal server", errorCode) {
            this.message = message;
            this.errorCode = errorCode;
        }
    }
    exports.InternalServerError = InternalServerError;
});
//# sourceMappingURL=HTTP.errors.js.map