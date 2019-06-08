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
   * A collection of shims that provide minimal functionality of the ES6 collections.
   *
   * These implementations are not meant to be used outside of the ResizeObserver
   * modules as they cover only a limited range of use cases.
   */
  /* eslint-disable require-jsdoc, valid-jsdoc */
  var MapShim = (function () {
      if (typeof Map !== 'undefined') {
          return Map;
      }
      /**
       * Returns index in provided array that matches the specified key.
       *
       * @param {Array<Array>} arr
       * @param {*} key
       * @returns {number}
       */
      function getIndex(arr, key) {
          var result = -1;
          arr.some(function (entry, index) {
              if (entry[0] === key) {
                  result = index;
                  return true;
              }
              return false;
          });
          return result;
      }
      return /** @class */ (function () {
          function class_1() {
              this.__entries__ = [];
          }
          Object.defineProperty(class_1.prototype, "size", {
              /**
               * @returns {boolean}
               */
              get: function () {
                  return this.__entries__.length;
              },
              enumerable: true,
              configurable: true
          });
          /**
           * @param {*} key
           * @returns {*}
           */
          class_1.prototype.get = function (key) {
              var index = getIndex(this.__entries__, key);
              var entry = this.__entries__[index];
              return entry && entry[1];
          };
          /**
           * @param {*} key
           * @param {*} value
           * @returns {void}
           */
          class_1.prototype.set = function (key, value) {
              var index = getIndex(this.__entries__, key);
              if (~index) {
                  this.__entries__[index][1] = value;
              }
              else {
                  this.__entries__.push([key, value]);
              }
          };
          /**
           * @param {*} key
           * @returns {void}
           */
          class_1.prototype.delete = function (key) {
              var entries = this.__entries__;
              var index = getIndex(entries, key);
              if (~index) {
                  entries.splice(index, 1);
              }
          };
          /**
           * @param {*} key
           * @returns {void}
           */
          class_1.prototype.has = function (key) {
              return !!~getIndex(this.__entries__, key);
          };
          /**
           * @returns {void}
           */
          class_1.prototype.clear = function () {
              this.__entries__.splice(0);
          };
          /**
           * @param {Function} callback
           * @param {*} [ctx=null]
           * @returns {void}
           */
          class_1.prototype.forEach = function (callback, ctx) {
              if (ctx === void 0) { ctx = null; }
              for (var _i = 0, _a = this.__entries__; _i < _a.length; _i++) {
                  var entry = _a[_i];
                  callback.call(ctx, entry[1], entry[0]);
              }
          };
          return class_1;
      }());
  })();

  /**
   * Detects whether window and document objects are available in current environment.
   */
  var isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined' && window.document === document;

  // Returns global object of a current environment.
  var global$1 = (function () {
      if (typeof global !== 'undefined' && global.Math === Math) {
          return global;
      }
      if (typeof self !== 'undefined' && self.Math === Math) {
          return self;
      }
      if (typeof window !== 'undefined' && window.Math === Math) {
          return window;
      }
      // eslint-disable-next-line no-new-func
      return Function('return this')();
  })();

  /**
   * A shim for the requestAnimationFrame which falls back to the setTimeout if
   * first one is not supported.
   *
   * @returns {number} Requests' identifier.
   */
  var requestAnimationFrame$1 = (function () {
      if (typeof requestAnimationFrame === 'function') {
          // It's required to use a bounded function because IE sometimes throws
          // an "Invalid calling object" error if rAF is invoked without the global
          // object on the left hand side.
          return requestAnimationFrame.bind(global$1);
      }
      return function (callback) { return setTimeout(function () { return callback(Date.now()); }, 1000 / 60); };
  })();

  // Defines minimum timeout before adding a trailing call.
  var trailingTimeout = 2;
  /**
   * Creates a wrapper function which ensures that provided callback will be
   * invoked only once during the specified delay period.
   *
   * @param {Function} callback - Function to be invoked after the delay period.
   * @param {number} delay - Delay after which to invoke callback.
   * @returns {Function}
   */
  function throttle (callback, delay) {
      var leadingCall = false, trailingCall = false, lastCallTime = 0;
      /**
       * Invokes the original callback function and schedules new invocation if
       * the "proxy" was called during current request.
       *
       * @returns {void}
       */
      function resolvePending() {
          if (leadingCall) {
              leadingCall = false;
              callback();
          }
          if (trailingCall) {
              proxy();
          }
      }
      /**
       * Callback invoked after the specified delay. It will further postpone
       * invocation of the original function delegating it to the
       * requestAnimationFrame.
       *
       * @returns {void}
       */
      function timeoutCallback() {
          requestAnimationFrame$1(resolvePending);
      }
      /**
       * Schedules invocation of the original function.
       *
       * @returns {void}
       */
      function proxy() {
          var timeStamp = Date.now();
          if (leadingCall) {
              // Reject immediately following calls.
              if (timeStamp - lastCallTime < trailingTimeout) {
                  return;
              }
              // Schedule new call to be in invoked when the pending one is resolved.
              // This is important for "transitions" which never actually start
              // immediately so there is a chance that we might miss one if change
              // happens amids the pending invocation.
              trailingCall = true;
          }
          else {
              leadingCall = true;
              trailingCall = false;
              setTimeout(timeoutCallback, delay);
          }
          lastCallTime = timeStamp;
      }
      return proxy;
  }

  // Minimum delay before invoking the update of observers.
  var REFRESH_DELAY = 20;
  // A list of substrings of CSS properties used to find transition events that
  // might affect dimensions of observed elements.
  var transitionKeys = ['top', 'right', 'bottom', 'left', 'width', 'height', 'size', 'weight'];
  // Check if MutationObserver is available.
  var mutationObserverSupported = typeof MutationObserver !== 'undefined';
  /**
   * Singleton controller class which handles updates of ResizeObserver instances.
   */
  var ResizeObserverController = /** @class */ (function () {
      /**
       * Creates a new instance of ResizeObserverController.
       *
       * @private
       */
      function ResizeObserverController() {
          /**
           * Indicates whether DOM listeners have been added.
           *
           * @private {boolean}
           */
          this.connected_ = false;
          /**
           * Tells that controller has subscribed for Mutation Events.
           *
           * @private {boolean}
           */
          this.mutationEventsAdded_ = false;
          /**
           * Keeps reference to the instance of MutationObserver.
           *
           * @private {MutationObserver}
           */
          this.mutationsObserver_ = null;
          /**
           * A list of connected observers.
           *
           * @private {Array<ResizeObserverSPI>}
           */
          this.observers_ = [];
          this.onTransitionEnd_ = this.onTransitionEnd_.bind(this);
          this.refresh = throttle(this.refresh.bind(this), REFRESH_DELAY);
      }
      /**
       * Adds observer to observers list.
       *
       * @param {ResizeObserverSPI} observer - Observer to be added.
       * @returns {void}
       */
      ResizeObserverController.prototype.addObserver = function (observer) {
          if (!~this.observers_.indexOf(observer)) {
              this.observers_.push(observer);
          }
          // Add listeners if they haven't been added yet.
          if (!this.connected_) {
              this.connect_();
          }
      };
      /**
       * Removes observer from observers list.
       *
       * @param {ResizeObserverSPI} observer - Observer to be removed.
       * @returns {void}
       */
      ResizeObserverController.prototype.removeObserver = function (observer) {
          var observers = this.observers_;
          var index = observers.indexOf(observer);
          // Remove observer if it's present in registry.
          if (~index) {
              observers.splice(index, 1);
          }
          // Remove listeners if controller has no connected observers.
          if (!observers.length && this.connected_) {
              this.disconnect_();
          }
      };
      /**
       * Invokes the update of observers. It will continue running updates insofar
       * it detects changes.
       *
       * @returns {void}
       */
      ResizeObserverController.prototype.refresh = function () {
          var changesDetected = this.updateObservers_();
          // Continue running updates if changes have been detected as there might
          // be future ones caused by CSS transitions.
          if (changesDetected) {
              this.refresh();
          }
      };
      /**
       * Updates every observer from observers list and notifies them of queued
       * entries.
       *
       * @private
       * @returns {boolean} Returns "true" if any observer has detected changes in
       *      dimensions of it's elements.
       */
      ResizeObserverController.prototype.updateObservers_ = function () {
          // Collect observers that have active observations.
          var activeObservers = this.observers_.filter(function (observer) {
              return observer.gatherActive(), observer.hasActive();
          });
          // Deliver notifications in a separate cycle in order to avoid any
          // collisions between observers, e.g. when multiple instances of
          // ResizeObserver are tracking the same element and the callback of one
          // of them changes content dimensions of the observed target. Sometimes
          // this may result in notifications being blocked for the rest of observers.
          activeObservers.forEach(function (observer) { return observer.broadcastActive(); });
          return activeObservers.length > 0;
      };
      /**
       * Initializes DOM listeners.
       *
       * @private
       * @returns {void}
       */
      ResizeObserverController.prototype.connect_ = function () {
          // Do nothing if running in a non-browser environment or if listeners
          // have been already added.
          if (!isBrowser || this.connected_) {
              return;
          }
          // Subscription to the "Transitionend" event is used as a workaround for
          // delayed transitions. This way it's possible to capture at least the
          // final state of an element.
          document.addEventListener('transitionend', this.onTransitionEnd_);
          window.addEventListener('resize', this.refresh);
          if (mutationObserverSupported) {
              this.mutationsObserver_ = new MutationObserver(this.refresh);
              this.mutationsObserver_.observe(document, {
                  attributes: true,
                  childList: true,
                  characterData: true,
                  subtree: true
              });
          }
          else {
              document.addEventListener('DOMSubtreeModified', this.refresh);
              this.mutationEventsAdded_ = true;
          }
          this.connected_ = true;
      };
      /**
       * Removes DOM listeners.
       *
       * @private
       * @returns {void}
       */
      ResizeObserverController.prototype.disconnect_ = function () {
          // Do nothing if running in a non-browser environment or if listeners
          // have been already removed.
          if (!isBrowser || !this.connected_) {
              return;
          }
          document.removeEventListener('transitionend', this.onTransitionEnd_);
          window.removeEventListener('resize', this.refresh);
          if (this.mutationsObserver_) {
              this.mutationsObserver_.disconnect();
          }
          if (this.mutationEventsAdded_) {
              document.removeEventListener('DOMSubtreeModified', this.refresh);
          }
          this.mutationsObserver_ = null;
          this.mutationEventsAdded_ = false;
          this.connected_ = false;
      };
      /**
       * "Transitionend" event handler.
       *
       * @private
       * @param {TransitionEvent} event
       * @returns {void}
       */
      ResizeObserverController.prototype.onTransitionEnd_ = function (_a) {
          var _b = _a.propertyName, propertyName = _b === void 0 ? '' : _b;
          // Detect whether transition may affect dimensions of an element.
          var isReflowProperty = transitionKeys.some(function (key) {
              return !!~propertyName.indexOf(key);
          });
          if (isReflowProperty) {
              this.refresh();
          }
      };
      /**
       * Returns instance of the ResizeObserverController.
       *
       * @returns {ResizeObserverController}
       */
      ResizeObserverController.getInstance = function () {
          if (!this.instance_) {
              this.instance_ = new ResizeObserverController();
          }
          return this.instance_;
      };
      /**
       * Holds reference to the controller's instance.
       *
       * @private {ResizeObserverController}
       */
      ResizeObserverController.instance_ = null;
      return ResizeObserverController;
  }());

  /**
   * Defines non-writable/enumerable properties of the provided target object.
   *
   * @param {Object} target - Object for which to define properties.
   * @param {Object} props - Properties to be defined.
   * @returns {Object} Target object.
   */
  var defineConfigurable = (function (target, props) {
      for (var _i = 0, _a = Object.keys(props); _i < _a.length; _i++) {
          var key = _a[_i];
          Object.defineProperty(target, key, {
              value: props[key],
              enumerable: false,
              writable: false,
              configurable: true
          });
      }
      return target;
  });

  /**
   * Returns the global object associated with provided element.
   *
   * @param {Object} target
   * @returns {Object}
   */
  var getWindowOf = (function (target) {
      // Assume that the element is an instance of Node, which means that it
      // has the "ownerDocument" property from which we can retrieve a
      // corresponding global object.
      var ownerGlobal = target && target.ownerDocument && target.ownerDocument.defaultView;
      // Return the local global object if it's not possible extract one from
      // provided element.
      return ownerGlobal || global$1;
  });

  // Placeholder of an empty content rectangle.
  var emptyRect = createRectInit(0, 0, 0, 0);
  /**
   * Converts provided string to a number.
   *
   * @param {number|string} value
   * @returns {number}
   */
  function toFloat(value) {
      return parseFloat(value) || 0;
  }
  /**
   * Extracts borders size from provided styles.
   *
   * @param {CSSStyleDeclaration} styles
   * @param {...string} positions - Borders positions (top, right, ...)
   * @returns {number}
   */
  function getBordersSize(styles) {
      var positions = [];
      for (var _i = 1; _i < arguments.length; _i++) {
          positions[_i - 1] = arguments[_i];
      }
      return positions.reduce(function (size, position) {
          var value = styles['border-' + position + '-width'];
          return size + toFloat(value);
      }, 0);
  }
  /**
   * Extracts paddings sizes from provided styles.
   *
   * @param {CSSStyleDeclaration} styles
   * @returns {Object} Paddings box.
   */
  function getPaddings(styles) {
      var positions = ['top', 'right', 'bottom', 'left'];
      var paddings = {};
      for (var _i = 0, positions_1 = positions; _i < positions_1.length; _i++) {
          var position = positions_1[_i];
          var value = styles['padding-' + position];
          paddings[position] = toFloat(value);
      }
      return paddings;
  }
  /**
   * Calculates content rectangle of provided SVG element.
   *
   * @param {SVGGraphicsElement} target - Element content rectangle of which needs
   *      to be calculated.
   * @returns {DOMRectInit}
   */
  function getSVGContentRect(target) {
      var bbox = target.getBBox();
      return createRectInit(0, 0, bbox.width, bbox.height);
  }
  /**
   * Calculates content rectangle of provided HTMLElement.
   *
   * @param {HTMLElement} target - Element for which to calculate the content rectangle.
   * @returns {DOMRectInit}
   */
  function getHTMLElementContentRect(target) {
      // Client width & height properties can't be
      // used exclusively as they provide rounded values.
      var clientWidth = target.clientWidth, clientHeight = target.clientHeight;
      // By this condition we can catch all non-replaced inline, hidden and
      // detached elements. Though elements with width & height properties less
      // than 0.5 will be discarded as well.
      //
      // Without it we would need to implement separate methods for each of
      // those cases and it's not possible to perform a precise and performance
      // effective test for hidden elements. E.g. even jQuery's ':visible' filter
      // gives wrong results for elements with width & height less than 0.5.
      if (!clientWidth && !clientHeight) {
          return emptyRect;
      }
      var styles = getWindowOf(target).getComputedStyle(target);
      var paddings = getPaddings(styles);
      var horizPad = paddings.left + paddings.right;
      var vertPad = paddings.top + paddings.bottom;
      // Computed styles of width & height are being used because they are the
      // only dimensions available to JS that contain non-rounded values. It could
      // be possible to utilize the getBoundingClientRect if only it's data wasn't
      // affected by CSS transformations let alone paddings, borders and scroll bars.
      var width = toFloat(styles.width), height = toFloat(styles.height);
      // Width & height include paddings and borders when the 'border-box' box
      // model is applied (except for IE).
      if (styles.boxSizing === 'border-box') {
          // Following conditions are required to handle Internet Explorer which
          // doesn't include paddings and borders to computed CSS dimensions.
          //
          // We can say that if CSS dimensions + paddings are equal to the "client"
          // properties then it's either IE, and thus we don't need to subtract
          // anything, or an element merely doesn't have paddings/borders styles.
          if (Math.round(width + horizPad) !== clientWidth) {
              width -= getBordersSize(styles, 'left', 'right') + horizPad;
          }
          if (Math.round(height + vertPad) !== clientHeight) {
              height -= getBordersSize(styles, 'top', 'bottom') + vertPad;
          }
      }
      // Following steps can't be applied to the document's root element as its
      // client[Width/Height] properties represent viewport area of the window.
      // Besides, it's as well not necessary as the <html> itself neither has
      // rendered scroll bars nor it can be clipped.
      if (!isDocumentElement(target)) {
          // In some browsers (only in Firefox, actually) CSS width & height
          // include scroll bars size which can be removed at this step as scroll
          // bars are the only difference between rounded dimensions + paddings
          // and "client" properties, though that is not always true in Chrome.
          var vertScrollbar = Math.round(width + horizPad) - clientWidth;
          var horizScrollbar = Math.round(height + vertPad) - clientHeight;
          // Chrome has a rather weird rounding of "client" properties.
          // E.g. for an element with content width of 314.2px it sometimes gives
          // the client width of 315px and for the width of 314.7px it may give
          // 314px. And it doesn't happen all the time. So just ignore this delta
          // as a non-relevant.
          if (Math.abs(vertScrollbar) !== 1) {
              width -= vertScrollbar;
          }
          if (Math.abs(horizScrollbar) !== 1) {
              height -= horizScrollbar;
          }
      }
      return createRectInit(paddings.left, paddings.top, width, height);
  }
  /**
   * Checks whether provided element is an instance of the SVGGraphicsElement.
   *
   * @param {Element} target - Element to be checked.
   * @returns {boolean}
   */
  var isSVGGraphicsElement = (function () {
      // Some browsers, namely IE and Edge, don't have the SVGGraphicsElement
      // interface.
      if (typeof SVGGraphicsElement !== 'undefined') {
          return function (target) { return target instanceof getWindowOf(target).SVGGraphicsElement; };
      }
      // If it's so, then check that element is at least an instance of the
      // SVGElement and that it has the "getBBox" method.
      // eslint-disable-next-line no-extra-parens
      return function (target) { return (target instanceof getWindowOf(target).SVGElement &&
          typeof target.getBBox === 'function'); };
  })();
  /**
   * Checks whether provided element is a document element (<html>).
   *
   * @param {Element} target - Element to be checked.
   * @returns {boolean}
   */
  function isDocumentElement(target) {
      return target === getWindowOf(target).document.documentElement;
  }
  /**
   * Calculates an appropriate content rectangle for provided html or svg element.
   *
   * @param {Element} target - Element content rectangle of which needs to be calculated.
   * @returns {DOMRectInit}
   */
  function getContentRect(target) {
      if (!isBrowser) {
          return emptyRect;
      }
      if (isSVGGraphicsElement(target)) {
          return getSVGContentRect(target);
      }
      return getHTMLElementContentRect(target);
  }
  /**
   * Creates rectangle with an interface of the DOMRectReadOnly.
   * Spec: https://drafts.fxtf.org/geometry/#domrectreadonly
   *
   * @param {DOMRectInit} rectInit - Object with rectangle's x/y coordinates and dimensions.
   * @returns {DOMRectReadOnly}
   */
  function createReadOnlyRect(_a) {
      var x = _a.x, y = _a.y, width = _a.width, height = _a.height;
      // If DOMRectReadOnly is available use it as a prototype for the rectangle.
      var Constr = typeof DOMRectReadOnly !== 'undefined' ? DOMRectReadOnly : Object;
      var rect = Object.create(Constr.prototype);
      // Rectangle's properties are not writable and non-enumerable.
      defineConfigurable(rect, {
          x: x, y: y, width: width, height: height,
          top: y,
          right: x + width,
          bottom: height + y,
          left: x
      });
      return rect;
  }
  /**
   * Creates DOMRectInit object based on the provided dimensions and the x/y coordinates.
   * Spec: https://drafts.fxtf.org/geometry/#dictdef-domrectinit
   *
   * @param {number} x - X coordinate.
   * @param {number} y - Y coordinate.
   * @param {number} width - Rectangle's width.
   * @param {number} height - Rectangle's height.
   * @returns {DOMRectInit}
   */
  function createRectInit(x, y, width, height) {
      return { x: x, y: y, width: width, height: height };
  }

  /**
   * Class that is responsible for computations of the content rectangle of
   * provided DOM element and for keeping track of it's changes.
   */
  var ResizeObservation = /** @class */ (function () {
      /**
       * Creates an instance of ResizeObservation.
       *
       * @param {Element} target - Element to be observed.
       */
      function ResizeObservation(target) {
          /**
           * Broadcasted width of content rectangle.
           *
           * @type {number}
           */
          this.broadcastWidth = 0;
          /**
           * Broadcasted height of content rectangle.
           *
           * @type {number}
           */
          this.broadcastHeight = 0;
          /**
           * Reference to the last observed content rectangle.
           *
           * @private {DOMRectInit}
           */
          this.contentRect_ = createRectInit(0, 0, 0, 0);
          this.target = target;
      }
      /**
       * Updates content rectangle and tells whether it's width or height properties
       * have changed since the last broadcast.
       *
       * @returns {boolean}
       */
      ResizeObservation.prototype.isActive = function () {
          var rect = getContentRect(this.target);
          this.contentRect_ = rect;
          return (rect.width !== this.broadcastWidth ||
              rect.height !== this.broadcastHeight);
      };
      /**
       * Updates 'broadcastWidth' and 'broadcastHeight' properties with a data
       * from the corresponding properties of the last observed content rectangle.
       *
       * @returns {DOMRectInit} Last observed content rectangle.
       */
      ResizeObservation.prototype.broadcastRect = function () {
          var rect = this.contentRect_;
          this.broadcastWidth = rect.width;
          this.broadcastHeight = rect.height;
          return rect;
      };
      return ResizeObservation;
  }());

  var ResizeObserverEntry = /** @class */ (function () {
      /**
       * Creates an instance of ResizeObserverEntry.
       *
       * @param {Element} target - Element that is being observed.
       * @param {DOMRectInit} rectInit - Data of the element's content rectangle.
       */
      function ResizeObserverEntry(target, rectInit) {
          var contentRect = createReadOnlyRect(rectInit);
          // According to the specification following properties are not writable
          // and are also not enumerable in the native implementation.
          //
          // Property accessors are not being used as they'd require to define a
          // private WeakMap storage which may cause memory leaks in browsers that
          // don't support this type of collections.
          defineConfigurable(this, { target: target, contentRect: contentRect });
      }
      return ResizeObserverEntry;
  }());

  var ResizeObserverSPI = /** @class */ (function () {
      /**
       * Creates a new instance of ResizeObserver.
       *
       * @param {ResizeObserverCallback} callback - Callback function that is invoked
       *      when one of the observed elements changes it's content dimensions.
       * @param {ResizeObserverController} controller - Controller instance which
       *      is responsible for the updates of observer.
       * @param {ResizeObserver} callbackCtx - Reference to the public
       *      ResizeObserver instance which will be passed to callback function.
       */
      function ResizeObserverSPI(callback, controller, callbackCtx) {
          /**
           * Collection of resize observations that have detected changes in dimensions
           * of elements.
           *
           * @private {Array<ResizeObservation>}
           */
          this.activeObservations_ = [];
          /**
           * Registry of the ResizeObservation instances.
           *
           * @private {Map<Element, ResizeObservation>}
           */
          this.observations_ = new MapShim();
          if (typeof callback !== 'function') {
              throw new TypeError('The callback provided as parameter 1 is not a function.');
          }
          this.callback_ = callback;
          this.controller_ = controller;
          this.callbackCtx_ = callbackCtx;
      }
      /**
       * Starts observing provided element.
       *
       * @param {Element} target - Element to be observed.
       * @returns {void}
       */
      ResizeObserverSPI.prototype.observe = function (target) {
          if (!arguments.length) {
              throw new TypeError('1 argument required, but only 0 present.');
          }
          // Do nothing if current environment doesn't have the Element interface.
          if (typeof Element === 'undefined' || !(Element instanceof Object)) {
              return;
          }
          if (!(target instanceof getWindowOf(target).Element)) {
              throw new TypeError('parameter 1 is not of type "Element".');
          }
          var observations = this.observations_;
          // Do nothing if element is already being observed.
          if (observations.has(target)) {
              return;
          }
          observations.set(target, new ResizeObservation(target));
          this.controller_.addObserver(this);
          // Force the update of observations.
          this.controller_.refresh();
      };
      /**
       * Stops observing provided element.
       *
       * @param {Element} target - Element to stop observing.
       * @returns {void}
       */
      ResizeObserverSPI.prototype.unobserve = function (target) {
          if (!arguments.length) {
              throw new TypeError('1 argument required, but only 0 present.');
          }
          // Do nothing if current environment doesn't have the Element interface.
          if (typeof Element === 'undefined' || !(Element instanceof Object)) {
              return;
          }
          if (!(target instanceof getWindowOf(target).Element)) {
              throw new TypeError('parameter 1 is not of type "Element".');
          }
          var observations = this.observations_;
          // Do nothing if element is not being observed.
          if (!observations.has(target)) {
              return;
          }
          observations.delete(target);
          if (!observations.size) {
              this.controller_.removeObserver(this);
          }
      };
      /**
       * Stops observing all elements.
       *
       * @returns {void}
       */
      ResizeObserverSPI.prototype.disconnect = function () {
          this.clearActive();
          this.observations_.clear();
          this.controller_.removeObserver(this);
      };
      /**
       * Collects observation instances the associated element of which has changed
       * it's content rectangle.
       *
       * @returns {void}
       */
      ResizeObserverSPI.prototype.gatherActive = function () {
          var _this = this;
          this.clearActive();
          this.observations_.forEach(function (observation) {
              if (observation.isActive()) {
                  _this.activeObservations_.push(observation);
              }
          });
      };
      /**
       * Invokes initial callback function with a list of ResizeObserverEntry
       * instances collected from active resize observations.
       *
       * @returns {void}
       */
      ResizeObserverSPI.prototype.broadcastActive = function () {
          // Do nothing if observer doesn't have active observations.
          if (!this.hasActive()) {
              return;
          }
          var ctx = this.callbackCtx_;
          // Create ResizeObserverEntry instance for every active observation.
          var entries = this.activeObservations_.map(function (observation) {
              return new ResizeObserverEntry(observation.target, observation.broadcastRect());
          });
          this.callback_.call(ctx, entries, ctx);
          this.clearActive();
      };
      /**
       * Clears the collection of active observations.
       *
       * @returns {void}
       */
      ResizeObserverSPI.prototype.clearActive = function () {
          this.activeObservations_.splice(0);
      };
      /**
       * Tells whether observer has active observations.
       *
       * @returns {boolean}
       */
      ResizeObserverSPI.prototype.hasActive = function () {
          return this.activeObservations_.length > 0;
      };
      return ResizeObserverSPI;
  }());

  // Registry of internal observers. If WeakMap is not available use current shim
  // for the Map collection as it has all required methods and because WeakMap
  // can't be fully polyfilled anyway.
  var observers = typeof WeakMap !== 'undefined' ? new WeakMap() : new MapShim();
  /**
   * ResizeObserver API. Encapsulates the ResizeObserver SPI implementation
   * exposing only those methods and properties that are defined in the spec.
   */
  var ResizeObserver = /** @class */ (function () {
      /**
       * Creates a new instance of ResizeObserver.
       *
       * @param {ResizeObserverCallback} callback - Callback that is invoked when
       *      dimensions of the observed elements change.
       */
      function ResizeObserver(callback) {
          if (!(this instanceof ResizeObserver)) {
              throw new TypeError('Cannot call a class as a function.');
          }
          if (!arguments.length) {
              throw new TypeError('1 argument required, but only 0 present.');
          }
          var controller = ResizeObserverController.getInstance();
          var observer = new ResizeObserverSPI(callback, controller, this);
          observers.set(this, observer);
      }
      return ResizeObserver;
  }());
  // Expose public methods of ResizeObserver.
  [
      'observe',
      'unobserve',
      'disconnect'
  ].forEach(function (method) {
      ResizeObserver.prototype[method] = function () {
          var _a;
          return (_a = observers.get(this))[method].apply(_a, arguments);
      };
  });

  var index = (function () {
      // Export existing implementation if available.
      if (typeof global$1.ResizeObserver !== 'undefined') {
          return global$1.ResizeObserver;
      }
      return ResizeObserver;
  })();

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

  Element.prototype.matches||(Element.prototype.matches=Element.prototype.msMatchesSelector||Element.prototype.webkitMatchesSelector),window.Element&&!Element.prototype.closest&&(Element.prototype.closest=function(e){var t=this;do{if(t.matches(e))return t;t=t.parentElement||t.parentNode;}while(null!==t&&1===t.nodeType);return null});

  var _css = ':host {  display: block; }  :host * {    box-sizing: border-box; }  :host .tab {    line-height: 0; }  :host .panel {    position: relative; }    :host .panel.us-none {      -webkit-user-select: none;         -moz-user-select: none;          -ms-user-select: none;              user-select: none; }  :host .panel ::slotted(*) {    position: absolute;    pointer-events: none; }  :host .horizon {    display: flex; }    :host .horizon ::slotted(*) {      position: static; }';

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

          _this2.resizeOb = new index(_this2.resizeRedraw);

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
