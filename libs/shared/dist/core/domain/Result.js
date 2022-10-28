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
    exports.fromThrowable = exports.notOk = exports.ok = exports.NotOk = exports.Ok = void 0;
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
        expect(message) {
            return this.value;
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
        expect(message) {
            throw new Error(message ?? "Result.expect() failed");
        }
    }
    exports.NotOk = NotOk;
    const ok = (value) => new Ok(value);
    exports.ok = ok;
    const notOk = (value) => new NotOk(value);
    exports.notOk = notOk;
    const fromThrowable = (fn) => {
        try {
            return (0, exports.ok)(fn());
        }
        catch (err) {
            return (0, exports.notOk)(err instanceof Error ? err : new Error(String(err)));
        }
    };
    exports.fromThrowable = fromThrowable;
});
//# sourceMappingURL=Result.js.map