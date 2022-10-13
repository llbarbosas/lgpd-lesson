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
    exports.notOk = exports.ok = exports.NotOk = exports.Ok = void 0;
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
        mapOk(fn) {
            return new Ok(fn(this.value));
        }
        mapNotOk(_) {
            return this;
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
        mapOk(_) {
            return this;
        }
        mapNotOk(fn) {
            return new NotOk(fn(this.value));
        }
    }
    exports.NotOk = NotOk;
    const ok = (value) => new Ok(value);
    exports.ok = ok;
    const notOk = (value) => new NotOk(value);
    exports.notOk = notOk;
});
//# sourceMappingURL=Result.js.map