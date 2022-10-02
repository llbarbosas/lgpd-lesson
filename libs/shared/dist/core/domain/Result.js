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
    exports.NotOk = exports.Ok = void 0;
    class Ok {
        value;
        constructor(value) {
            this.value = value;
        }
        isNotOk() {
            return false;
        }
        isOk() {
            return true;
        }
    }
    exports.Ok = Ok;
    class NotOk {
        value;
        constructor(value) {
            this.value = value;
        }
        isNotOk() {
            return true;
        }
        isOk() {
            return false;
        }
    }
    exports.NotOk = NotOk;
});
