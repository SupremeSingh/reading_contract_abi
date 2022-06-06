"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var lockStore = new Map();
var SimpleLock = /** @class */ (function () {
    function SimpleLock() {
        this.waiting = [];
        this.taken = false;
    }
    SimpleLock.prototype.acquire = function () {
        var _this = this;
        return new Promise(function (resolve) {
            if (!_this.taken) {
                _this.taken = true;
                resolve("");
                return;
            }
            _this.waiting.push(resolve);
        });
    };
    SimpleLock.prototype.release = function () {
        if (!this.taken) {
            return;
        }
        if (this.waiting.length > 0) {
            var resolve = this.waiting.shift();
            resolve("");
        }
        else {
            this.taken = false;
        }
    };
    return SimpleLock;
}());
var createLock = function (name) {
    if (name) {
        var lock = lockStore.get(name);
        if (!lock) {
            lockStore.set(name, (lock = new SimpleLock()));
        }
        return lock;
    }
    return new SimpleLock();
};
exports.default = createLock;