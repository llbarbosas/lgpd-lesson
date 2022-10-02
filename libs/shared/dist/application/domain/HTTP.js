(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./HTTP.errors"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Response = void 0;
    const HTTP_errors_1 = require("./HTTP.errors");
    class Response {
        status;
        body;
        headers;
        constructor(status, body, headers) {
            this.status = status;
            this.body = body;
            this.headers = headers;
        }
        static withHeaders(headers, response) {
            return new Response(response.status, response.body, headers);
        }
        static ok(body) {
            return statusResponse(200, body);
        }
        static created(body) {
            return statusResponse(201, body);
        }
        static notFound(message, errorCode) {
            return fromError(new HTTP_errors_1.NotFoundError(message, errorCode));
        }
        static serverError(message, errorCode) {
            return fromError(new HTTP_errors_1.InternalServerError(message, errorCode));
        }
    }
    exports.Response = Response;
    const statusResponse = (status, body) => new Response(status, body);
    const fromError = (error) => statusResponse(error.status, {
        error: error.name,
        message: error.message,
        error_code: error.errorCode,
    });
});
