/**
 * @license
 * rikaaa-tab.js
 *
 * Generated : 2019-07-21
 * Version : 1.0.3
 * Author : rikaaa.org | Yuki Hata
 * Url : http://rikaaa.org
 *
 *
 * The MIT License (MIT)
 *
 * Copyright 2019 rikaaa.org | Yuki Hata
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

(function () {
  'use strict';

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function");
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        writable: true,
        configurable: true
      }
    });
    if (superClass) _setPrototypeOf(subClass, superClass);
  }

  function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
      return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _getPrototypeOf(o);
  }

  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };

    return _setPrototypeOf(o, p);
  }

  function isNativeReflectConstruct() {
    if (typeof Reflect === "undefined" || !Reflect.construct) return false;
    if (Reflect.construct.sham) return false;
    if (typeof Proxy === "function") return true;

    try {
      Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));
      return true;
    } catch (e) {
      return false;
    }
  }

  function _construct(Parent, args, Class) {
    if (isNativeReflectConstruct()) {
      _construct = Reflect.construct;
    } else {
      _construct = function _construct(Parent, args, Class) {
        var a = [null];
        a.push.apply(a, args);
        var Constructor = Function.bind.apply(Parent, a);
        var instance = new Constructor();
        if (Class) _setPrototypeOf(instance, Class.prototype);
        return instance;
      };
    }

    return _construct.apply(null, arguments);
  }

  function _isNativeFunction(fn) {
    return Function.toString.call(fn).indexOf("[native code]") !== -1;
  }

  function _wrapNativeSuper(Class) {
    var _cache = typeof Map === "function" ? new Map() : undefined;

    _wrapNativeSuper = function _wrapNativeSuper(Class) {
      if (Class === null || !_isNativeFunction(Class)) return Class;

      if (typeof Class !== "function") {
        throw new TypeError("Super expression must either be null or a function");
      }

      if (typeof _cache !== "undefined") {
        if (_cache.has(Class)) return _cache.get(Class);

        _cache.set(Class, Wrapper);
      }

      function Wrapper() {
        return _construct(Class, arguments, _getPrototypeOf(this).constructor);
      }

      Wrapper.prototype = Object.create(Class.prototype, {
        constructor: {
          value: Wrapper,
          enumerable: false,
          writable: true,
          configurable: true
        }
      });
      return _setPrototypeOf(Wrapper, Class);
    };

    return _wrapNativeSuper(Class);
  }

  function _objectDestructuringEmpty(obj) {
    if (obj == null) throw new TypeError("Cannot destructure undefined");
  }

  function _assertThisInitialized(self) {
    if (self === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return self;
  }

  function _possibleConstructorReturn(self, call) {
    if (call && (typeof call === "object" || typeof call === "function")) {
      return call;
    }

    return _assertThisInitialized(self);
  }

  function _toArray(arr) {
    return _arrayWithHoles(arr) || _iterableToArray(arr) || _nonIterableRest();
  }

  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
  }

  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

      return arr2;
    }
  }

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _iterableToArray(iter) {
    if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
  }

  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance");
  }

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance");
  }

  var constrain = (function (value, min, max) {
    return Math.max(min, Math.min(max, value));
  });

  var map = (function (value, istart, istop, ostart, ostop) {
    return ostart + (ostop - ostart) * ((value - istart) / (istop - istart));
  });

  if (![].keys) {
    Array.prototype.keys = function () {
      var k,
          a = [],
          nextIndex = 0,
          ary = this;
      k = ary.length;

      while (k > 0) {
        a[--k] = k;
      }

      a.next = function () {
        return nextIndex < ary.length ? {
          value: nextIndex++,
          done: false
        } : {
          done: true
        };
      };

      return a;
    };
  }

  var MultiFade =
  /*#__PURE__*/
  function () {
    function MultiFade(length) {
      _classCallCheck(this, MultiFade);

      this._len = length && length > 1 ? length : 2; // this._result = new Array(this._len).fill(0);

      this._arrival = 1 / this._len;
    }

    _createClass(MultiFade, [{
      key: "get",
      value: function get(seed) {
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        var peakX = options.peakX >= 0 && options.peakX <= 1 ? options.peakX : 0.5;
        var smooth = options.smooth >= 0 && options.smooth <= 1 ? options.smooth : 0.3;
        var dissolve = options.dissolve >= 0 && options.dissolve <= 1 ? options.dissolve : 0.5;
        var edge = options.edge >= 0 && options.edge <= 1 ? options.edge : 1;
        return this.calcMult(constrain(seed, 0, 1), constrain(peakX, 0, 1), constrain(smooth, 0, 1), constrain(dissolve, 0, 1), constrain(edge, 0, 1));
      }
    }, {
      key: "calcMult",
      value: function calcMult(seed, peakX, smooth, dissolve, edge) {
        var _this = this;

        var _dissolve = constrain(dissolve, 0, 1);

        var __dissolve = 1.0 - _dissolve;

        var distance = map(seed, 0, 1, 0.5 * edge, __dissolve * (this._len - 1) + map(edge, 0, 1, 1, 0.5));
        return _toConsumableArray(Array(this._len).keys()).reduce(function (a, c) {
          var seedCalc = Math.max(Math.min(distance - __dissolve * c, 1), 0);
          return a.concat([_this.calc(seedCalc, peakX, smooth)]);
        }, []);
      }
    }, {
      key: "calc",
      value: function calc(seed, peakX, smooth) {
        var _seed = constrain(seed, 0, 1);

        var _peakX = constrain(peakX, 0, 1);

        var _smooth = smooth ? map(constrain(smooth, 0, 1), 0, 1, 0, 0.5) : 0;

        var x = this.method(_seed, _peakX);

        if (_smooth === 0) {
          return x;
        } else {
          return this.smoothstep(0 + _smooth, 1 - _smooth / 2, x);
        }
      }
    }, {
      key: "method",
      value: function method(x, a) {
        return Math.max(Math.min(Math.min(x / a, 1.0 - (x - a) / (1.0 - a)), 1), 0);
      }
    }, {
      key: "smoothstep",
      value: function smoothstep(edge0, edge1, x) {
        var t = constrain((x - edge0) / (edge1 - edge0), 0, 1);
        return Math.pow(t, 2) * (3 - 2 * t);
      }
    }]);

    return MultiFade;
  }();

  var Ease =
  /*#__PURE__*/
  function () {
    function Ease(typestr, duration) {
      _classCallCheck(this, Ease);

      this._type = typestr ? typestr : 'linear';
      this._t = 0;
      this._d = duration;
    }

    _createClass(Ease, [{
      key: "Convarsion",
      value: function Convarsion(val) {
        return val >= 1 ? 1.0 : val;
      }
    }, {
      key: "ease_in",
      value: function ease_in() {
        return this._t * this._t;
      }
    }, {
      key: "ease_out",
      value: function ease_out() {
        return this._t * (2 - this._t);
      }
    }, {
      key: "ease_in_out",
      value: function ease_in_out() {
        return this._t < .5 ? 2 * this._t * this._t : -1 + (4 - 2 * this._t) * this._t;
      }
    }, {
      key: "linear",
      value: function linear() {
        return this._t;
      }
    }, {
      key: "Start",
      value: function Start(func) {
        this._now = performance.now();
        var that = this;
        requestAnimationFrame(loop);

        function loop(timedamp) {
          that.requ = requestAnimationFrame(loop);
          that._t = that.Convarsion((timedamp - that._now) / that._d);

          switch (that._type.replace(/-/g, '_')) {
            case 'linear':
              func(that.linear());
              break;

            case 'ease_in':
              func(that.ease_in());
              break;

            case 'ease_out':
              func(that.ease_out());
              break;

            case 'ease_in_out':
              func(that.ease_in_out());
              break;

            default:
              break;
          }

          if (that._t >= 1.0) {
            cancelAnimationFrame(that.requ);
            if (typeof that._endFunc === 'function') that._endFunc();
          }
        }
        return this;
      }
    }, {
      key: "End",
      value: function End(func) {
        this._endFunc = func;
      }
    }, {
      key: "Stop",
      value: function Stop(func) {
        cancelAnimationFrame(this.requ);
        if (typeof func === 'function') func();
      }
    }, {
      key: "duration",
      set: function set(n) {
        this._d = n;
      },
      get: function get() {
        return this._d;
      }
    }, {
      key: "type",
      set: function set(n) {
        this._type = n;
      }
    }]);

    return Ease;
  }();

  var ready = (function (fn) {
    if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading") {
      setTimeout(function () {
        fn();
      }, 0);
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  });

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
  function unwrapExports(x) {
    return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
  }

  function createCommonjsModule(fn, module) {
    return module = {
      exports: {}
    }, fn(module, module.exports), module.exports;
  }

  var onbang = createCommonjsModule(function (module, exports) {
    Object.defineProperty(exports, "__esModule", {
      value: true
    });

    exports.default = function (func) {
      var _func,
          allow = true;

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
    };
  });
  unwrapExports(onbang);
  var debounce = createCommonjsModule(function (module, exports) {
    Object.defineProperty(exports, "__esModule", {
      value: true
    });

    exports.default = function (func, interval) {
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
    };
  });
  unwrapExports(debounce);
  var throttle = createCommonjsModule(function (module, exports) {
    Object.defineProperty(exports, "__esModule", {
      value: true
    });

    exports.default = function (func, interval) {
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
          if (startTime === null) startTime = timestamp;
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
    };
  });
  unwrapExports(throttle);
  var valueObserver = createCommonjsModule(function (module, exports) {
    Object.defineProperty(exports, "__esModule", {
      value: true
    });

    exports.default = function (firstVal, func, option) {
      if (option === void 0) {
        option = {
          observValKeyName: 'watch'
        };
      }

      var _func,
          _firstval = firstVal,
          _watchKeyName = option.observValKeyName;

      return function (_a) {
        _a = {};
        var originalArgument = [],
            watchVal = null;

        for (var i = 0; i < arguments.length; i++) {
          if (!arguments[i] || !(arguments[i].constructor == Object)) {
            originalArgument.push(arguments[i]);
          } else {
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
    };
  });
  unwrapExports(valueObserver);
  var isDisplay = createCommonjsModule(function (module, exports) {
    Object.defineProperty(exports, "__esModule", {
      value: true
    });

    exports.default = function (target) {
      var result = false;
      var style = target.currentStyle || getComputedStyle(target, '');
      result = style.display === 'none' ? false : true;
      return result;
    };
  });
  unwrapExports(isDisplay);
  var calculateContentRect = createCommonjsModule(function (module, exports) {
    Object.defineProperty(exports, "__esModule", {
      value: true
    });

    exports.default = function (target) {
      var style = getComputedStyle(target, '');
      var targetBounding = target.getBoundingClientRect();

      var parser = function parser(px) {
        return px === ' ' ? 0 : parseFloat(px || '0px');
      };

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
      var contentRect = isDisplay.default(target) ? {
        width: width,
        height: height,
        x: paddingLeft,
        y: paddingTop,
        top: paddingTop,
        left: paddingLeft,
        bottom: paddingTop + height,
        right: paddingLeft + width
      } : {
        width: 0,
        height: 0,
        x: 0,
        y: 0,
        top: 0,
        left: 0,
        bottom: 0,
        right: 0
      };
      return Object.freeze(contentRect);
    };
  });
  unwrapExports(calculateContentRect);

  if (!Array.prototype.includes) {
    Object.defineProperty(Array.prototype, 'includes', {
      value: function value(searchElement, fromIndex) {
        if (this == null) {
          throw new TypeError('"this" is null or not defined');
        } // 1. Let O be ? ToObject(this value).


        var o = Object(this); // 2. Let len be ? ToLength(? Get(O, "length")).

        var len = o.length >>> 0; // 3. If len is 0, return false.

        if (len === 0) {
          return false;
        } // 4. Let n be ? ToInteger(fromIndex).
        //    (If fromIndex is undefined, this step produces the value 0.)


        var n = fromIndex | 0; // 5. If n ≥ 0, then
        //  a. Let k be n.
        // 6. Else n < 0,
        //  a. Let k be len + n.
        //  b. If k < 0, let k be 0.

        var k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);

        function sameValueZero(x, y) {
          return x === y || typeof x === 'number' && typeof y === 'number' && isNaN(x) && isNaN(y);
        } // 7. Repeat, while k < len


        while (k < len) {
          // a. Let elementK be the result of ? Get(O, ! ToString(k)).
          // b. If SameValueZero(searchElement, elementK) is true, return true.
          if (sameValueZero(o[k], searchElement)) {
            return true;
          } // c. Increase k by 1. 


          k++;
        } // 8. Return false


        return false;
      }
    });
  }

  var Controller_1 = createCommonjsModule(function (module, exports) {
    Object.defineProperty(exports, "__esModule", {
      value: true
    });

    var Controller =
    /** @class */
    function () {
      function Controller() {
        this.instanceOfResizeWatcher = [];
        this.targetsAll = [];
        this.mutationObserverConfig = {
          childList: true,
          attributes: true,
          characterData: true,
          subtree: true
        };
        this.watcher_binded = throttle.default(Controller.watcher.bind(null, this), Controller.THROTTLE_INTERVAL);
        this.mo = new MutationObserver(this.watcher_binded);
        this.firstCallback = debounce.default(onbang.default(function (entriesContaner) {
          entriesContaner.forEach(function (entries) {
            var callbackArg = entries.entries.map(function (entry) {
              var isDisplay = Controller.isDisplay(entry.target);
              if (isDisplay) return Object.freeze({
                target: entry.target,
                contentRect: entry.contentRect
              });
            }).filter(function (entry) {
              return typeof entry !== 'undefined';
            });
            if (callbackArg.length !== 0) entries.callback(callbackArg);
          });
        }), Controller.THROTTLE_INTERVAL);
      }

      Controller.prototype.init = function (instance) {
        this.instanceOfResizeWatcher.push(instance);
      };

      Controller.prototype.observe = function () {
        this.targetsAll = Controller.updateTargetsAll(this);
        if (this.targetsAll.length !== 0) Controller.onWatcher(this);
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
            var isResized = entry.valueObserver({
              watch: Controller.contentRectWHToStr(currentContentRect)
            });
            if (isResized) entry.contentRect = currentContentRect;
            if (isResized) return Object.freeze({
              target: entry.target,
              contentRect: entry.contentRect
            });
          }).filter(function (entry) {
            return typeof entry !== 'undefined';
          });
          if (callbackArg.length !== 0) entries.callback(callbackArg);
        });
      };

      Controller.calculateEntriesContaner = function (instances) {
        return instances.map(function (instance) {
          var entries = instance.targets.map(function (target) {
            var contentRect = Controller.calculateContentRect(target);
            return {
              contentRect: contentRect,
              target: target,
              valueObserver: valueObserver.default(Controller.contentRectWHToStr(contentRect), function () {
                return true;
              })
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
        return instance.instanceOfResizeWatcher.map(function (instance) {
          return instance.targets;
        }).reduce(function (a, c) {
          return a.concat(c);
        }, []);
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
        get: function get() {
          return 33;
        },
        enumerable: true,
        configurable: true
      });
      return Controller;
    }();

    exports.default = Controller;
  });
  unwrapExports(Controller_1);
  var rikaaaResizeWatcher_1 = createCommonjsModule(function (module, exports) {
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var controller = new Controller_1.default();

    var rikaaaResizeWatcher =
    /** @class */
    function () {
      function rikaaaResizeWatcher(callback) {
        this.callback = callback;
        this.targets = [];
        this.entries = [];
        controller.init(this);
      }

      rikaaaResizeWatcher.prototype.observe = function (target) {
        var exist = this.targets.includes(target);
        if (!exist) this.targets.push(target);
        controller.observe();
      };

      rikaaaResizeWatcher.prototype.unobserve = function (target) {
        this.targets = this.targets.filter(function (existTarget) {
          return existTarget !== target;
        });
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
        get: function get() {
          return Controller_1.default.THROTTLE_INTERVAL;
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(rikaaaResizeWatcher, "CONTROLLER", {
        get: function get() {
          return controller;
        },
        enumerable: true,
        configurable: true
      });
      return rikaaaResizeWatcher;
    }();

    exports.default = rikaaaResizeWatcher;
  });
  var rikaaaResizeWatcher = unwrapExports(rikaaaResizeWatcher_1);

  var Onebang = (function (func) {
    var _func,
        allow = true;

    return function () {
      if (!allow) {
        func = null;
        return false;
      }

      _func = func.apply(this, arguments);
      allow = false;
      return _func;
    };
  });

  var ValueObserver = (function (firstVal, func) {
    var _ref = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
        observValKeyName = _ref.observValKeyName;

    var _func,
        _firstval = firstVal,
        _watchKeyName = observValKeyName ? observValKeyName : 'watch';

    return function () {
      var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      _objectDestructuringEmpty(_ref2);

      var originalArgument = [],
          watchVal = null;

      for (var i = 0; i < arguments.length; i++) {
        if (!arguments[i] || !(arguments[i].constructor == Object)) {
          originalArgument.push(arguments[i]);
        } else {
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

  if (!Element.prototype.matches) {
    Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
  }

  if (!Element.prototype.closest) {
    Element.prototype.closest = function (s) {
      var el = this;

      do {
        if (el.matches(s)) return el;
        el = el.parentElement || el.parentNode;
      } while (el !== null && el.nodeType === 1);

      return null;
    };
  }

  var _css = ':host {  display: block; }  :host * {    -webkit-box-sizing: border-box;            box-sizing: border-box; }  :host .tab {    line-height: 0; }  :host .panel {    position: relative; }    :host .panel.us-none {      -webkit-user-select: none;         -moz-user-select: none;          -ms-user-select: none;              user-select: none; }  :host .panel ::slotted(*) {    position: absolute;    pointer-events: none; }  :host .horizon {    display: -webkit-box;    display: -ms-flexbox;    display: flex; }    :host .horizon ::slotted(*) {      position: static; }';

  var _style = "<style>".concat(_css, "</style>");

  var _shadowdomHTML = "\n    ".concat(_style, "\n    <div class=\"wp\">\n        <div class=\"tab\">\n            <slot class=\"tab_slot\" name=\"tab\"></slot>\n        </div>\n        <slot class=\"seekbar_slot\" name=\"bar\"></slot>\n        <div class=\"panel\">\n            <slot class=\"panel_slot\"></slot>\n        </div>\n    </div>\n");

  var template = document.createElement('template');
  template.id = 'rikaaatab';
  template.innerHTML = _shadowdomHTML;
  if (window.ShadyCSS) ShadyCSS.prepareTemplate(template, 'rikaaa-tab');

  var rikaaatab =
  /*#__PURE__*/
  function (_HTMLElement) {
    _inherits(rikaaatab, _HTMLElement);

    function rikaaatab() {
      var _this;

      _classCallCheck(this, rikaaatab);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(rikaaatab).call(this));
      if (window.ShadyCSS) ShadyCSS.styleElement(_assertThisInitialized(_this));

      _this.attachShadow({
        mode: 'open'
      });

      _this.shadowRoot.appendChild(template.content.cloneNode(true));

      return _this;
    }

    _createClass(rikaaatab, [{
      key: "connectedCallback",
      value: function connectedCallback() {
        var _this2 = this;

        this.style.visibility = 'hidden';

        var init = function init() {
          _this2._ease = new Ease('ease_in_out');
          _this2._tab = _this2.shadowRoot.querySelector('.tab');
          _this2._panel = _this2.shadowRoot.querySelector('.panel');
          _this2._wp = _this2.shadowRoot.querySelector('.wp');
          _this2._tabslot = _this2.shadowRoot.querySelector('.tab_slot');
          _this2._panelslot = _this2.shadowRoot.querySelector('.panel_slot');
          _this2._seekbarslot = _this2.shadowRoot.querySelector('.seekbar_slot');

          if (!window.ResizeObserver && !window.WcRikaaaResizeObserver) {
            Object.defineProperty(window, 'WcRikaaaResizeObserver', {
              value: rikaaaResizeWatcher
            });
          }

          var resizeobserver = window.ResizeObserver || window.WcRikaaaResizeObserver;
          _this2._tabs = _this2._tabslot.assignedNodes({
            flattern: true
          }).filter(function (n) {
            return n.nodeType === n.ELEMENT_NODE;
          });
          _this2._panels = _this2._panelslot.assignedNodes({
            flatten: true
          }).filter(function (n) {
            return n.nodeType === n.ELEMENT_NODE;
          });
          _this2._bar = _this2._seekbarslot.assignedNodes({
            flatten: true
          }).filter(function (n) {
            return n.nodeType === n.ELEMENT_NODE;
          })[0];
          _this2._panelsH = Array.from(_this2._panels).reduce(function (a, c) {
            return a.concat(c.offsetHeight);
          }, []); // touch slide panel

          var m_x, prevSeed;

          var slide = function slide(e) {
            var x = e.pageX;
            var m_diff = _this2.horizon ? x - m_x : m_x - x;
            var node = _this2._panels;
            var step = 1 / node.length;
            var m_ratio = m_diff / _this2.offsetWidth;

            if (_this2.horizon) {
              _this2.seed = prevSeed + m_ratio;
            } else {
              _this2.seed = prevSeed + step * m_ratio * 2;
            }
          };

          _this2.attachslide = function (e) {
            _this2._panel.addEventListener('mousemove', slide);

            _this2._panel.addEventListener('touchmove', slide);

            m_x = e.pageX;
            prevSeed = _this2.seed;
            _this2.sliding = true;

            _this2._panel.classList.add('us-none');
          };

          _this2.releaseslide = function () {
            _this2._panel.removeEventListener('mousemove', slide);

            _this2._panel.removeEventListener('touchmove', slide);

            var nowIndex = _this2.index;
            var roundIndex = Math.round(nowIndex);
            var diff = roundIndex - nowIndex;

            if (diff !== 0) {
              _this2._ease.Start(function (e) {
                _this2.index = nowIndex + diff * e;
              }).End(function () {
                _this2.sliding = false;

                _this2._panel.classList.remove('us-none');
              });
            }
          };

          _this2._panel.addEventListener('mousedown', _this2.attachslide);

          _this2._panel.addEventListener('touchstart', _this2.attachslide);

          _this2._panel.addEventListener('mouseup', _this2.releaseslide);

          _this2._panel.addEventListener('touchend', _this2.releaseslide);

          _this2._panel.addEventListener('mouseleave', _this2.releaseslide);

          _this2._panel.addEventListener('touchleave', _this2.releaseslide); // touch slide bar 


          var m_x_b, prevSeed_b;

          var slide_b = function slide_b(e) {
            var x = e.pageX; // const m_diff = (this.horizon) ? m_x_b - x : x - m_x_b;

            var m_diff = x - m_x_b;
            var m_ratio = m_diff / _this2.offsetWidth;
            _this2.seed = prevSeed_b + m_ratio;
          };

          _this2.attachslide_b = function (e) {
            _this2._bar.addEventListener('mousemove', slide_b);

            _this2._bar.addEventListener('touchmove', slide_b);

            var attachseed = (e.pageX - _this2.offsetLeft) / _this2.offsetWidth - 1 / _this2._panels.length;
            _this2.seed = attachseed;
            prevSeed_b = attachseed;
            m_x_b = e.pageX;
            _this2.sliding = true;

            _this2._panel.classList.add('us-none');
          };

          _this2.releaseslide_b = function () {
            _this2._bar.removeEventListener('mousemove', slide_b);

            _this2._bar.removeEventListener('touchmove', slide_b);

            var nowIndex = _this2.index;
            var roundIndex = Math.round(nowIndex);
            var diff = roundIndex - nowIndex;

            if (diff !== 0) {
              _this2._ease.Start(function (e) {
                _this2.index = nowIndex + diff * e;
              }).End(function () {
                _this2.sliding = false;

                _this2._panel.classList.remove('us-none');
              });
            }
          };

          if (_this2._bar) {
            _this2._bar.addEventListener('mousedown', _this2.attachslide_b);

            _this2._bar.addEventListener('touchstart', _this2.attachslide_b);

            window.addEventListener('mouseup', _this2.releaseslide_b);
            window.addEventListener('touchend', _this2.releaseslide_b);
            window.addEventListener('mouseleave', _this2.releaseslide_b);
            window.addEventListener('touchleave', _this2.releaseslide_b);
          }

          if (_this2.seed === null) _this2.seed = 0;
          if (_this2.seekbarH === null) _this2.seekbarH = 3;
          if (_this2.tabChangeDuration === null) _this2.tabChangeDuration = 200;
          if (_this2.horizon === null) _this2.horizon = false;
          if (_this2.opmin === null) _this2.opmin = 0;
          _this2.tabChangeDuration = _this2.tabChangeDuration;
          _this2.seekbarH = _this2.seekbarH;
          _this2.horizon = _this2.horizon;
          _this2.seed = _this2.seed;
          _this2.opmin = _this2.opmin;
          Array.from(_this2._tabs).forEach(function (n) {
            return n.classList.add('tabs');
          });

          _this2.tabclick = function (e) {
            console.log('tabclick');
            var node = _this2._tabs;
            var index = node.indexOf(e.target.closest('.tabs'));
            var diff = index - _this2.index;
            var step = 1 / node.length;
            var now_seed = _this2.seed;
            _this2._ease.type = 'ease_out';

            _this2._ease.Start(function (e) {
              _this2.seed = now_seed + step * (diff * e);
            });
          };

          if (_this2._tabs.length) _this2._tabslot.addEventListener('click', _this2.tabclick);

          var createValuChangeObserver = function createValuChangeObserver() {
            _this2.seedchangeObserver = ValueObserver(_this2.seed, function (fn) {
              fn();
            });
          };

          var resizeOnce = Onebang(createValuChangeObserver);
          var resizeTimer = null;

          _this2.resizeRedraw = function () {
            resizeOnce();

            _this2.redraw();

            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function () {
              resizeOnce = Onebang(createValuChangeObserver);
            }, 1);
          };

          _this2.resizeOb = new resizeobserver(_this2.resizeRedraw);

          _this2.resizeOb.observe(_this2);
        };

        this.imgonload(function () {
          init();
          _this2.style.visibility = '';

          _this2.dispatchEvent(new CustomEvent('load'));
        });
      }
    }, {
      key: "disconnectedCallback",
      value: function disconnectedCallback() {
        var _this3 = this;

        var bar = this.shadowRoot.querySelector('.seekbar_slot').assignedNodes({
          flatten: true
        }).filter(function (n) {
          return n.nodeType === n.ELEMENT_NODE;
        })[0];
        var panel = this.shadowRoot.querySelector('.panel');
        var tabslot = this.shadowRoot.querySelector('.tab_slot');
        this.imgonload(function () {
          bar.removeEventListener('mousedown', _this3.attachslide_b);
          bar.removeEventListener('touchstart', _this3.attachslide_b);
          window.removeEventListener('mouseup', _this3.releaseslide_b);
          window.removeEventListener('touchend', _this3.releaseslide_b);
          window.removeEventListener('mouseleave', _this3.releaseslide_b);
          window.removeEventListener('touchleave', _this3.releaseslide_b);
          panel.removeEventListener('mousedown', _this3.attachslide);
          panel.removeEventListener('touchstart', _this3.attachslide);
          panel.removeEventListener('mouseup', _this3.releaseslide);
          panel.removeEventListener('touchend', _this3.releaseslide);
          panel.removeEventListener('mouseleave', _this3.releaseslide);
          panel.removeEventListener('touchleave', _this3.releaseslide);
          tabslot.removeEventListener('click', _this3.tabclick);

          _this3.resizeOb.disconnect(_this3);
        });
      }
    }, {
      key: "addtabproperty",
      value: function addtabproperty() {
        var _this4 = this;

        if (this._tabs.length) {
          this._farray.forEach(function (v, i) {
            if (map(v, _this4.opmin, 1, 0, 1) >= 0.5) _this4._tabs[i].classList.add('select');else _this4._tabs[i].classList.remove('select');
          });
        }
      }
    }, {
      key: "forLoopCalc",
      value: function forLoopCalc(seed, fadeArray, tabpanelLen) {
        var step = 1 / tabpanelLen;

        var fa_copy = _toConsumableArray(fadeArray);

        fa_copy.reverse();

        var _fa_copy = _toArray(fa_copy),
            rest = _fa_copy[0],
            fa_use = _fa_copy.slice(1);

        fa_use.reverse();
        if (seed >= step * (tabpanelLen - 1)) fa_use[0] = rest;
        return _toConsumableArray(fa_use);
      }
    }, {
      key: "fade",
      value: function fade(seed) {
        var _this5 = this;

        var s = seed - Math.floor(seed);
        var node = this._panels;
        var mf = new MultiFade(node.length + 1); //!!!

        var fa = mf.get(s);
        var fa_use = this.forLoopCalc(s, fa, node.length);
        var fa_use_ = fa_use.map(function (v) {
          return Math.max(Math.min(v + _this5.opmin, 1), 0);
        });
        node.forEach(function (elem, index) {
          return elem.style.opacity = fa_use_[index];
        });
        node.forEach(function (elem, index) {
          if (fa_use_[index] >= 0.5) elem.classList.add('select');else elem.classList.remove('select');
        });
        this._farray = fa_use_;

        if (typeof this.seedchangeObserver === 'function') {
          this.seedchangeObserver(function () {
            _this5.onfade(fa_use_);
          }, {
            watch: seed
          });
        }
      }
    }, {
      key: "onfade",
      value: function onfade(f) {
        var onfade = new CustomEvent('onfade', {
          detail: {
            seed: this.seed,
            fade: f
          }
        });
        this.dispatchEvent(onfade);
      }
    }, {
      key: "fadeH",
      value: function fadeH(seed) {
        var s = seed - Math.floor(seed);
        var node = this._panels;
        var H_arry = this._panelsH;
        var mf = new MultiFade(node.length + 1); //!!!

        var fa = mf.get(s, {
          smooth: 0
        });
        var fa_use = this.forLoopCalc(s, fa, node.length);
        var H_array_f = H_arry.map(function (h, index) {
          return h * fa_use[index];
        });
        var h = H_array_f.reduce(function (a, c) {
          return a + c;
        });
        if (this.horizon) this._panel.style.height = '';else this._panel.style.height = "".concat(h, "px");
      }
    }, {
      key: "seek",
      value: function seek(seed) {
        var node = this._panels;
        var s = seed;
        var step = 1 / node.length;
        var diff = step * (node.length - 1) + 0.00000000000001;
        var seek = s - diff - Math.floor(s - diff);
        if (this._bar) this._bar.querySelector('.bar').style.width = "".concat(100 * seek, "%");
      }
    }, {
      key: "redraw",
      value: function redraw() {
        this._panelsH = Array.from(this._panels).reduce(function (a, c) {
          return a.concat(c.offsetHeight);
        }, []);
        this.fade(this.seed);
        this.fadeH(this.seed);
      }
    }, {
      key: "next",
      value: function next() {
        var _this6 = this;

        var node = this._panels;
        var step = 1 / node.length;
        var nowSeed = this.seed;

        this._ease.Start(function (e) {
          if (!_this6.sliding) _this6.seed = nowSeed + step * e;
        });
      }
    }, {
      key: "prev",
      value: function prev() {
        var _this7 = this;

        var node = this._panels;
        var step = 1 / node.length;
        var nowSeed = this.seed;

        this._ease.Start(function (e) {
          if (!_this7.sliding) _this7.seed = nowSeed - step * e;
        });
      }
    }, {
      key: "imgonload",
      value: function imgonload(fn) {
        var _this8 = this;

        var readyAct = function readyAct() {
          var tab = _this8;
          var imgNode = Array.from(tab.querySelectorAll('img'));
          var imgloaded = Promise.all(imgNode.map(function (i) {
            return new Promise(function (resolve, reject) {
              if (i === null) {
                resolve();
              } else {
                var i_src = i.src;
                i.src = '';
                i.addEventListener('load', function () {
                  resolve();
                });
                i.src = i_src;
              }
            });
          }));
          imgloaded.then(function () {
            // this.redraw();
            fn();
          });
        };

        ready(function () {
          readyAct();
        });
      }
    }, {
      key: "seed",
      get: function get() {
        var attr = this.getAttribute('seed');
        return attr === null ? attr : Number(attr);
      },
      set: function set(n) {
        n = n - Math.floor(n);
        this.setAttribute('seed', n);
        this.fade(n);
        this.seek(n);
        this.fadeH(n);
        this.addtabproperty();
        var node = this._panels;
        var step = 1 / node.length;
        var index = n / step;
        if (index >= node.length + 1) index = 0;
        if (index <= -1) index = node.length - 1;
        this.setAttribute('index', index);
      }
    }, {
      key: "index",
      get: function get() {
        var attr = this.getAttribute('index');
        return attr === null ? attr : Number(attr);
      },
      set: function set(n) {
        var node = this._tabs;
        if (!node.length) node = this._panels;
        var step = 1 / node.length;
        this.seed = step * n;
      }
    }, {
      key: "tabChangeDuration",
      get: function get() {
        var attr = this.getAttribute('tabChangeDuration');
        return attr === null ? attr : Number(attr);
      },
      set: function set(n) {
        this.setAttribute('tabChangeDuration', n);
        this._ease.duration = n;
      }
    }, {
      key: "seekbarH",
      get: function get() {
        var attr = this.getAttribute('seekbarH');
        return attr === null ? attr : Number(attr);
      },
      set: function set(n) {
        this.setAttribute('seekbarH', n);
        if (this._bar) this._bar.querySelector('.bar').style.height = "".concat(n, "px");
      }
    }, {
      key: "horizon",
      get: function get() {
        var attr = this.getAttribute('horizon');
        return attr === null ? attr : attr.toLowerCase() === 'true';
      },
      set: function set(n) {
        if (typeof n !== 'boolean') throw new TypeError('need boolean');
        this.setAttribute('horizon', n);
        var node = this._panels;

        if (n) {
          this._panel.classList.add('horizon');

          Array.from(node).map(function (n) {
            return n.style.width = "".concat(100 * 1 / node.length, "%");
          });
        } else {
          this._panel.classList.remove('horizon');

          Array.from(node).map(function (n) {
            return n.style.width = '';
          });
        }

        this.redraw();
      }
    }, {
      key: "opmin",
      get: function get() {
        var attr = this.getAttribute('opmin');
        return attr === null ? attr : Number(attr);
      },
      set: function set(n) {
        this.setAttribute('opmin', n);
        this.fade(this.seed);
      }
    }]);

    return rikaaatab;
  }(_wrapNativeSuper(HTMLElement));

  customElements.define('rikaaa-tab', rikaaatab);

}());
