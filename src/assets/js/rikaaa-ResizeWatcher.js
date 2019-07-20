/**
 * @license
 * rikaaa-ResizeWatcher.js
 *
 * Generated : 2019-07-14
 * Version : 0.5.0
 * Author : rikaaa.org | YUKI HATA
 * Url : http://rikaaa.org
 *
 *
 * The MIT License (MIT)
 *
 * Copyright 2019 rikaaa.org | YUKI HATA
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

function unwrapExports (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var onbang = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (function (func) {
    var _func, allow = true;
    return function () {
        var arg = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            arg[_i] = arguments[_i];
        }
        if (!allow) {
            func = null;
            return false;
        }
        _func = func.apply(this, arg);
        allow = false;
        return _func;
    };
});
});

unwrapExports(onbang);

var debounce = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (function (func, interval) {
    var timer = null;
    return function () {
        var arg = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            arg[_i] = arguments[_i];
        }
        clearTimeout(timer);
        timer = setTimeout(function () {
            return func.apply(this, arg);
        }, interval);
    };
});
});

unwrapExports(debounce);

var throttle = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });


exports.default = (function (func, interval) {
    var req = null;
    var startTime = null;
    var firstFunc = onbang.default(func);
    var lastFunc = debounce.default(func, interval);
    var clearFirstFunc = debounce.default(function () {
        firstFunc = onbang.default(func);
        startTime = null;
        cancelAnimationFrame(req);
    }, interval);
    return function () {
        var _this = this;
        var arg = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            arg[_i] = arguments[_i];
        }
        firstFunc.apply(this, arg);
        req = requestAnimationFrame(function (timestamp) {
            if (startTime === null)
                startTime = timestamp;
            var elapsedTime = timestamp - startTime;
            if (elapsedTime >= interval) {
                startTime = null;
                cancelAnimationFrame(req);
                return func.apply(_this, arg);
            }
        });
        clearFirstFunc();
        return lastFunc.apply(this, arg);
    };
});
});

unwrapExports(throttle);

var valueObserver = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (function (firstVal, func, option) {
    if (option === void 0) { option = { observValKeyName: 'watch' }; }
    var _func, _firstval = firstVal, _watchKeyName = option.observValKeyName;
    return function (_a) {
        _a = {};
        var originalArgument = [], watchVal = null;
        for (var i = 0; i < arguments.length; i++) {
            if (!(arguments[i]) || !(arguments[i].constructor == Object)) {
                originalArgument.push(arguments[i]);
            }
            else {
                watchVal = arguments[i][_watchKeyName];
                delete arguments[i][_watchKeyName];
                if (Object.keys(arguments[i]).length > 0) {
                    originalArgument.push(arguments[i]);
                }
            }
        }
        if (_firstval === watchVal) {
            return false;
        }
        _firstval = watchVal;
        _func = func.apply(this, originalArgument);
        return _func;
    };
});
});

unwrapExports(valueObserver);

var isDisplay = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (function (target) {
    var result = false;
    var style = target.currentStyle || getComputedStyle(target, '');
    result = (style.display === 'none') ? false : true;
    return result;
});
});

unwrapExports(isDisplay);

var calculateContentRect = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });

exports.default = (function (target) {
    var style = getComputedStyle(target, '');
    var targetBounding = target.getBoundingClientRect();
    var parser = function (px) { return (px === ' ') ? 0 : parseFloat(px || '0px'); };
    var paddingTop = parser(style.paddingTop);
    var paddingBottom = parser(style.paddingBottom);
    var paddingLeft = parser(style.paddingLeft);
    var paddingRight = parser(style.paddingRight);
    var borderTop = parser(style.borderTopWidth);
    var borderBottom = parser(style.borderBottomWidth);
    var borderLeft = parser(style.borderLeftWidth);
    var borderRight = parser(style.borderRightWidth);
    var paddingHorizon = paddingTop + paddingBottom;
    var paddingVertical = paddingLeft + paddingRight;
    var borderHorizon = borderTop + borderBottom;
    var borderVertical = borderLeft + borderRight;
    var width = targetBounding.width - paddingVertical - borderVertical;
    var height = targetBounding.height - paddingHorizon - borderHorizon;
    var contentRect = (isDisplay.default(target)) ?
        {
            width: width,
            height: height,
            x: paddingLeft,
            y: paddingTop,
            top: paddingTop,
            left: paddingLeft,
            bottom: paddingTop + height,
            right: paddingLeft + width,
        } :
        {
            width: 0,
            height: 0,
            x: 0,
            y: 0,
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
        };
    return Object.freeze(contentRect);
});
});

unwrapExports(calculateContentRect);

if (!Array.prototype.includes) {
    Object.defineProperty(Array.prototype, 'includes', {
        value: function (searchElement, fromIndex) {
            if (this == null) {
                throw new TypeError('"this" is null or not defined');
            }
            // 1. Let O be ? ToObject(this value).
            var o = Object(this);
            // 2. Let len be ? ToLength(? Get(O, "length")).
            var len = o.length >>> 0;
            // 3. If len is 0, return false.
            if (len === 0) {
                return false;
            }
            // 4. Let n be ? ToInteger(fromIndex).
            //    (If fromIndex is undefined, this step produces the value 0.)
            var n = fromIndex | 0;
            // 5. If n ≥ 0, then
            //  a. Let k be n.
            // 6. Else n < 0,
            //  a. Let k be len + n.
            //  b. If k < 0, let k be 0.
            var k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);
            function sameValueZero(x, y) {
                return x === y || (typeof x === 'number' && typeof y === 'number' && isNaN(x) && isNaN(y));
            }
            // 7. Repeat, while k < len
            while (k < len) {
                // a. Let elementK be the result of ? Get(O, ! ToString(k)).
                // b. If SameValueZero(searchElement, elementK) is true, return true.
                if (sameValueZero(o[k], searchElement)) {
                    return true;
                }
                // c. Increase k by 1. 
                k++;
            }
            // 8. Return false
            return false;
        }
    });
}

var Controller_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });







var Controller = /** @class */ (function () {
    function Controller() {
        this.instanceOfResizeWatcher = [];
        this.targetsAll = [];
        this.mutationObserverConfig = {
            childList: true,
            attributes: true,
            characterData: true,
            subtree: true,
        };
        this.watcher_binded = throttle.default(Controller.watcher.bind(null, this), Controller.THROTTLE_INTERVAL);
        this.mo = new MutationObserver(this.watcher_binded);
        this.firstCallback = debounce.default(onbang.default(function (entriesContaner) {
            entriesContaner.forEach(function (entries) {
                var callbackArg = entries.entries.map(function (entry) {
                    var isDisplay = Controller.isDisplay(entry.target);
                    if (isDisplay)
                        return Object.freeze({
                            target: entry.target,
                            contentRect: entry.contentRect,
                        });
                }).filter(function (entry) { return typeof entry !== 'undefined'; });
                if (callbackArg.length !== 0)
                    entries.callback(callbackArg);
            });
        }), Controller.THROTTLE_INTERVAL);
    }
    Controller.prototype.init = function (instance) {
        this.instanceOfResizeWatcher.push(instance);
    };
    Controller.prototype.observe = function () {
        this.targetsAll = Controller.updateTargetsAll(this);
        if (this.targetsAll.length !== 0)
            Controller.onWatcher(this);
        this.entriesContaner = Controller.calculateEntriesContaner(this.instanceOfResizeWatcher);
        this.firstCallback(this.entriesContaner);
    };
    Controller.prototype.unobserve = function () {
        this.targetsAll = Controller.updateTargetsAll(this);
        this.entriesContaner = Controller.calculateEntriesContaner(this.instanceOfResizeWatcher);
    };
    Controller.prototype.disconnect = function () {
        this.targetsAll = Controller.updateTargetsAll(this);
        this.entriesContaner = Controller.calculateEntriesContaner(this.instanceOfResizeWatcher);
        if (this.targetsAll.length === 0) {
            Controller.offWatcher(this);
        }
    };
    Controller.watcher = function (instances) {
        instances.entriesContaner.forEach(function (entries) {
            var callbackArg = entries.entries.map(function (entry) {
                var currentContentRect = Controller.calculateContentRect(entry.target);
                var isResized = entry.valueObserver({ watch: Controller.contentRectWHToStr(currentContentRect) });
                if (isResized)
                    entry.contentRect = currentContentRect;
                if (isResized)
                    return Object.freeze({
                        target: entry.target,
                        contentRect: entry.contentRect,
                    });
            }).filter(function (entry) { return typeof entry !== 'undefined'; });
            if (callbackArg.length !== 0)
                entries.callback(callbackArg);
        });
    };
    Controller.calculateEntriesContaner = function (instances) {
        return instances.map(function (instance) {
            var entries = instance.targets.map(function (target) {
                var contentRect = Controller.calculateContentRect(target);
                return {
                    contentRect: contentRect,
                    target: target,
                    valueObserver: valueObserver.default(Controller.contentRectWHToStr(contentRect), function () { return true; }),
                };
            });
            instance.entries = entries;
            return instance;
        });
    };
    Controller.contentRectWHToStr = function (contentRect) {
        return "" + contentRect.width + contentRect.height;
    };
    Controller.updateTargetsAll = function (instance) {
        return instance.instanceOfResizeWatcher.map(function (instance) { return instance.targets; }).reduce(function (a, c) { return a.concat(c); }, []);
    };
    Controller.onWatcher = function (instance) {
        instance.mo.disconnect();
        instance.mo.observe(document.getElementsByTagName('html')[0], instance.mutationObserverConfig);
        window.addEventListener('resize', instance.watcher_binded, false);
    };
    Controller.offWatcher = function (instance) {
        instance.mo.disconnect();
        window.removeEventListener('resize', instance.watcher_binded);
    };
    Controller.calculateContentRect = function (target) {
        return calculateContentRect.default(target);
    };
    Controller.isDisplay = function (target) {
        return isDisplay.default(target);
    };
    Object.defineProperty(Controller, "THROTTLE_INTERVAL", {
        get: function () {
            return 33;
        },
        enumerable: true,
        configurable: true
    });
    return Controller;
}());
exports.default = Controller;
});

unwrapExports(Controller_1);

var rikaaaResizeWatcher_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });

var controller = new Controller_1.default();
var rikaaaResizeWatcher = /** @class */ (function () {
    function rikaaaResizeWatcher(callback) {
        this.callback = callback;
        this.targets = [];
        this.entries = [];
        controller.init(this);
    }
    rikaaaResizeWatcher.prototype.observe = function (target) {
        var exist = this.targets.includes(target);
        if (!exist)
            this.targets.push(target);
        controller.observe();
    };
    rikaaaResizeWatcher.prototype.unobserve = function (target) {
        this.targets = this.targets.filter(function (existTarget) { return existTarget !== target; });
        controller.unobserve();
    };
    rikaaaResizeWatcher.prototype.disconnect = function () {
        this.targets = [];
        controller.disconnect();
    };
    rikaaaResizeWatcher.calculateContentRect = function (target) {
        return Controller_1.default.calculateContentRect(target);
    };
    rikaaaResizeWatcher.isDisplay = function (target) {
        return Controller_1.default.isDisplay(target);
    };
    Object.defineProperty(rikaaaResizeWatcher, "THROTTLE_INTERVAL", {
        get: function () {
            return Controller_1.default.THROTTLE_INTERVAL;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(rikaaaResizeWatcher, "CONTROLLER", {
        get: function () {
            return controller;
        },
        enumerable: true,
        configurable: true
    });
    return rikaaaResizeWatcher;
}());
exports.default = rikaaaResizeWatcher;
});

var rikaaaResizeWatcher = unwrapExports(rikaaaResizeWatcher_1);

export default rikaaaResizeWatcher;
