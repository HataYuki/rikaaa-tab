(function () {
  'use strict';

  // empty

  var ceil = Math.ceil;
  var floor = Math.floor;

  // `ToInteger` abstract operation
  // https://tc39.github.io/ecma262/#sec-tointeger
  var toInteger = function (argument) {
    return isNaN(argument = +argument) ? 0 : (argument > 0 ? floor : ceil)(argument);
  };

  // `RequireObjectCoercible` abstract operation
  // https://tc39.github.io/ecma262/#sec-requireobjectcoercible
  var requireObjectCoercible = function (it) {
    if (it == undefined) throw TypeError("Can't call method on " + it);
    return it;
  };

  // CONVERT_TO_STRING: true  -> String#at
  // CONVERT_TO_STRING: false -> String#codePointAt
  var stringAt = function (that, pos, CONVERT_TO_STRING) {
    var S = String(requireObjectCoercible(that));
    var position = toInteger(pos);
    var size = S.length;
    var first, second;
    if (position < 0 || position >= size) return CONVERT_TO_STRING ? '' : undefined;
    first = S.charCodeAt(position);
    return first < 0xD800 || first > 0xDBFF || position + 1 === size
      || (second = S.charCodeAt(position + 1)) < 0xDC00 || second > 0xDFFF
        ? CONVERT_TO_STRING ? S.charAt(position) : first
        : CONVERT_TO_STRING ? S.slice(position, position + 2) : (first - 0xD800 << 10) + (second - 0xDC00) + 0x10000;
  };

  var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

  function createCommonjsModule(fn, module) {
  	return module = { exports: {} }, fn(module, module.exports), module.exports;
  }

  // https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
  var global$1 = typeof window == 'object' && window && window.Math == Math ? window
    : typeof self == 'object' && self && self.Math == Math ? self
    // eslint-disable-next-line no-new-func
    : Function('return this')();

  var fails = function (exec) {
    try {
      return !!exec();
    } catch (error) {
      return true;
    }
  };

  // Thank's IE8 for his funny defineProperty
  var descriptors = !fails(function () {
    return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
  });

  var isObject = function (it) {
    return typeof it === 'object' ? it !== null : typeof it === 'function';
  };

  var document$1 = global$1.document;
  // typeof document.createElement is 'object' in old IE
  var exist = isObject(document$1) && isObject(document$1.createElement);

  var documentCreateElement = function (it) {
    return exist ? document$1.createElement(it) : {};
  };

  // Thank's IE8 for his funny defineProperty
  var ie8DomDefine = !descriptors && !fails(function () {
    return Object.defineProperty(documentCreateElement('div'), 'a', {
      get: function () { return 7; }
    }).a != 7;
  });

  var anObject = function (it) {
    if (!isObject(it)) {
      throw TypeError(String(it) + ' is not an object');
    } return it;
  };

  // 7.1.1 ToPrimitive(input [, PreferredType])

  // instead of the ES6 spec version, we didn't implement @@toPrimitive case
  // and the second argument - flag - preferred type is a string
  var toPrimitive = function (it, S) {
    if (!isObject(it)) return it;
    var fn, val;
    if (S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
    if (typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it))) return val;
    if (!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
    throw TypeError("Can't convert object to primitive value");
  };

  var nativeDefineProperty = Object.defineProperty;

  var f = descriptors ? nativeDefineProperty : function defineProperty(O, P, Attributes) {
    anObject(O);
    P = toPrimitive(P, true);
    anObject(Attributes);
    if (ie8DomDefine) try {
      return nativeDefineProperty(O, P, Attributes);
    } catch (error) { /* empty */ }
    if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported');
    if ('value' in Attributes) O[P] = Attributes.value;
    return O;
  };

  var objectDefineProperty = {
  	f: f
  };

  var createPropertyDescriptor = function (bitmap, value) {
    return {
      enumerable: !(bitmap & 1),
      configurable: !(bitmap & 2),
      writable: !(bitmap & 4),
      value: value
    };
  };

  var hide = descriptors ? function (object, key, value) {
    return objectDefineProperty.f(object, key, createPropertyDescriptor(1, value));
  } : function (object, key, value) {
    object[key] = value;
    return object;
  };

  var setGlobal = function (key, value) {
    try {
      hide(global$1, key, value);
    } catch (error) {
      global$1[key] = value;
    } return value;
  };

  var isPure = true;

  var shared = createCommonjsModule(function (module) {
  var SHARED = '__core-js_shared__';
  var store = global$1[SHARED] || setGlobal(SHARED, {});

  (module.exports = function (key, value) {
    return store[key] || (store[key] = value !== undefined ? value : {});
  })('versions', []).push({
    version: '3.0.1',
    mode: 'pure',
    copyright: '© 2019 Denis Pushkarev (zloirock.ru)'
  });
  });

  var functionToString = shared('native-function-to-string', Function.toString);

  var WeakMap$1 = global$1.WeakMap;

  var nativeWeakMap = typeof WeakMap$1 === 'function' && /native code/.test(functionToString.call(WeakMap$1));

  var hasOwnProperty = {}.hasOwnProperty;

  var has = function (it, key) {
    return hasOwnProperty.call(it, key);
  };

  var id = 0;
  var postfix = Math.random();

  var uid = function (key) {
    return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + postfix).toString(36));
  };

  var shared$1 = shared('keys');


  var sharedKey = function (key) {
    return shared$1[key] || (shared$1[key] = uid(key));
  };

  var hiddenKeys = {};

  var WeakMap$2 = global$1.WeakMap;
  var set, get, has$1;

  var enforce = function (it) {
    return has$1(it) ? get(it) : set(it, {});
  };

  var getterFor = function (TYPE) {
    return function (it) {
      var state;
      if (!isObject(it) || (state = get(it)).type !== TYPE) {
        throw TypeError('Incompatible receiver, ' + TYPE + ' required');
      } return state;
    };
  };

  if (nativeWeakMap) {
    var store = new WeakMap$2();
    var wmget = store.get;
    var wmhas = store.has;
    var wmset = store.set;
    set = function (it, metadata) {
      wmset.call(store, it, metadata);
      return metadata;
    };
    get = function (it) {
      return wmget.call(store, it) || {};
    };
    has$1 = function (it) {
      return wmhas.call(store, it);
    };
  } else {
    var STATE = sharedKey('state');
    hiddenKeys[STATE] = true;
    set = function (it, metadata) {
      hide(it, STATE, metadata);
      return metadata;
    };
    get = function (it) {
      return has(it, STATE) ? it[STATE] : {};
    };
    has$1 = function (it) {
      return has(it, STATE);
    };
  }

  var internalState = {
    set: set,
    get: get,
    has: has$1,
    enforce: enforce,
    getterFor: getterFor
  };

  var nativePropertyIsEnumerable = {}.propertyIsEnumerable;
  var nativeGetOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

  // Nashorn ~ JDK8 bug
  var NASHORN_BUG = nativeGetOwnPropertyDescriptor && !nativePropertyIsEnumerable.call({ 1: 2 }, 1);

  var f$1 = NASHORN_BUG ? function propertyIsEnumerable(V) {
    var descriptor = nativeGetOwnPropertyDescriptor(this, V);
    return !!descriptor && descriptor.enumerable;
  } : nativePropertyIsEnumerable;

  var objectPropertyIsEnumerable = {
  	f: f$1
  };

  var toString = {}.toString;

  var classofRaw = function (it) {
    return toString.call(it).slice(8, -1);
  };

  // fallback for non-array-like ES3 and non-enumerable old V8 strings


  var split = ''.split;

  var indexedObject = fails(function () {
    // throws an error in rhino, see https://github.com/mozilla/rhino/issues/346
    // eslint-disable-next-line no-prototype-builtins
    return !Object('z').propertyIsEnumerable(0);
  }) ? function (it) {
    return classofRaw(it) == 'String' ? split.call(it, '') : Object(it);
  } : Object;

  // toObject with fallback for non-array-like ES3 strings



  var toIndexedObject = function (it) {
    return indexedObject(requireObjectCoercible(it));
  };

  var nativeGetOwnPropertyDescriptor$1 = Object.getOwnPropertyDescriptor;

  var f$2 = descriptors ? nativeGetOwnPropertyDescriptor$1 : function getOwnPropertyDescriptor(O, P) {
    O = toIndexedObject(O);
    P = toPrimitive(P, true);
    if (ie8DomDefine) try {
      return nativeGetOwnPropertyDescriptor$1(O, P);
    } catch (error) { /* empty */ }
    if (has(O, P)) return createPropertyDescriptor(!objectPropertyIsEnumerable.f.call(O, P), O[P]);
  };

  var objectGetOwnPropertyDescriptor = {
  	f: f$2
  };

  var replacement = /#|\.prototype\./;

  var isForced = function (feature, detection) {
    var value = data[normalize(feature)];
    return value == POLYFILL ? true
      : value == NATIVE ? false
      : typeof detection == 'function' ? fails(detection)
      : !!detection;
  };

  var normalize = isForced.normalize = function (string) {
    return String(string).replace(replacement, '.').toLowerCase();
  };

  var data = isForced.data = {};
  var NATIVE = isForced.NATIVE = 'N';
  var POLYFILL = isForced.POLYFILL = 'P';

  var isForced_1 = isForced;

  var path = {};

  var aFunction = function (it) {
    if (typeof it != 'function') {
      throw TypeError(String(it) + ' is not a function');
    } return it;
  };

  // optional / simple context binding
  var bindContext = function (fn, that, length) {
    aFunction(fn);
    if (that === undefined) return fn;
    switch (length) {
      case 0: return function () {
        return fn.call(that);
      };
      case 1: return function (a) {
        return fn.call(that, a);
      };
      case 2: return function (a, b) {
        return fn.call(that, a, b);
      };
      case 3: return function (a, b, c) {
        return fn.call(that, a, b, c);
      };
    }
    return function (/* ...args */) {
      return fn.apply(that, arguments);
    };
  };

  var getOwnPropertyDescriptor = objectGetOwnPropertyDescriptor.f;






  var wrapConstructor = function (NativeConstructor) {
    var Wrapper = function (a, b, c) {
      if (this instanceof NativeConstructor) {
        switch (arguments.length) {
          case 0: return new NativeConstructor();
          case 1: return new NativeConstructor(a);
          case 2: return new NativeConstructor(a, b);
        } return new NativeConstructor(a, b, c);
      } return NativeConstructor.apply(this, arguments);
    };
    Wrapper.prototype = NativeConstructor.prototype;
    return Wrapper;
  };

  /*
    options.target      - name of the target object
    options.global      - target is the global object
    options.stat        - export as static methods of target
    options.proto       - export as prototype methods of target
    options.real        - real prototype method for the `pure` version
    options.forced      - export even if the native feature is available
    options.bind        - bind methods to the target, required for the `pure` version
    options.wrap        - wrap constructors to preventing global pollution, required for the `pure` version
    options.unsafe      - use the simple assignment of property instead of delete + defineProperty
    options.sham        - add a flag to not completely full polyfills
    options.enumerable  - export as enumerable property
    options.noTargetGet - prevent calling a getter on target
  */
  var _export = function (options, source) {
    var TARGET = options.target;
    var GLOBAL = options.global;
    var STATIC = options.stat;
    var PROTO = options.proto;

    var nativeSource = GLOBAL ? global$1 : STATIC ? global$1[TARGET] : (global$1[TARGET] || {}).prototype;

    var target = GLOBAL ? path : path[TARGET] || (path[TARGET] = {});
    var targetPrototype = target.prototype;

    var FORCED, USE_NATIVE, VIRTUAL_PROTOTYPE;
    var key, sourceProperty, targetProperty, nativeProperty, resultProperty, descriptor;

    for (key in source) {
      FORCED = isForced_1(GLOBAL ? key : TARGET + (STATIC ? '.' : '#') + key, options.forced);
      // contains in native
      USE_NATIVE = !FORCED && nativeSource && has(nativeSource, key);

      targetProperty = target[key];

      if (USE_NATIVE) if (options.noTargetGet) {
        descriptor = getOwnPropertyDescriptor(nativeSource, key);
        nativeProperty = descriptor && descriptor.value;
      } else nativeProperty = nativeSource[key];

      // export native or implementation
      sourceProperty = (USE_NATIVE && nativeProperty) ? nativeProperty : source[key];

      if (USE_NATIVE && typeof targetProperty === typeof sourceProperty) continue;

      // bind timers to global for call from export context
      if (options.bind && USE_NATIVE) resultProperty = bindContext(sourceProperty, global$1);
      // wrap global constructors for prevent changs in this version
      else if (options.wrap && USE_NATIVE) resultProperty = wrapConstructor(sourceProperty);
      // make static versions for prototype methods
      else if (PROTO && typeof sourceProperty == 'function') resultProperty = bindContext(Function.call, sourceProperty);
      // default case
      else resultProperty = sourceProperty;

      // add a flag to not completely full polyfills
      if (options.sham || (sourceProperty && sourceProperty.sham) || (targetProperty && targetProperty.sham)) {
        hide(resultProperty, 'sham', true);
      }

      target[key] = resultProperty;

      if (PROTO) {
        VIRTUAL_PROTOTYPE = TARGET + 'Prototype';
        if (!has(path, VIRTUAL_PROTOTYPE)) hide(path, VIRTUAL_PROTOTYPE, {});
        // export virtual prototype methods
        path[VIRTUAL_PROTOTYPE][key] = sourceProperty;
        // export real prototype methods
        if (options.real && targetPrototype && !targetPrototype[key]) hide(targetPrototype, key, sourceProperty);
      }
    }
  };

  // `ToObject` abstract operation
  // https://tc39.github.io/ecma262/#sec-toobject
  var toObject = function (argument) {
    return Object(requireObjectCoercible(argument));
  };

  var correctPrototypeGetter = !fails(function () {
    function F() { /* empty */ }
    F.prototype.constructor = null;
    return Object.getPrototypeOf(new F()) !== F.prototype;
  });

  // 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)


  var IE_PROTO = sharedKey('IE_PROTO');

  var ObjectPrototype = Object.prototype;

  var objectGetPrototypeOf = correctPrototypeGetter ? Object.getPrototypeOf : function (O) {
    O = toObject(O);
    if (has(O, IE_PROTO)) return O[IE_PROTO];
    if (typeof O.constructor == 'function' && O instanceof O.constructor) {
      return O.constructor.prototype;
    } return O instanceof Object ? ObjectPrototype : null;
  };

  // Chrome 38 Symbol has incorrect toString conversion
  var nativeSymbol = !fails(function () {
    // eslint-disable-next-line no-undef
    return !String(Symbol());
  });

  var store$1 = shared('wks');

  var Symbol$1 = global$1.Symbol;


  var wellKnownSymbol = function (name) {
    return store$1[name] || (store$1[name] = nativeSymbol && Symbol$1[name]
      || (nativeSymbol ? Symbol$1 : uid)('Symbol.' + name));
  };

  var ITERATOR = wellKnownSymbol('iterator');
  var BUGGY_SAFARI_ITERATORS = false;

  // `%IteratorPrototype%` object
  // https://tc39.github.io/ecma262/#sec-%iteratorprototype%-object
  var IteratorPrototype, PrototypeOfArrayIteratorPrototype, arrayIterator;

  if ([].keys) {
    arrayIterator = [].keys();
    // Safari 8 has buggy iterators w/o `next`
    if (!('next' in arrayIterator)) BUGGY_SAFARI_ITERATORS = true;
    else {
      PrototypeOfArrayIteratorPrototype = objectGetPrototypeOf(objectGetPrototypeOf(arrayIterator));
      if (PrototypeOfArrayIteratorPrototype !== Object.prototype) IteratorPrototype = PrototypeOfArrayIteratorPrototype;
    }
  }

  if (IteratorPrototype == undefined) IteratorPrototype = {};

  var iteratorsCore = {
    IteratorPrototype: IteratorPrototype,
    BUGGY_SAFARI_ITERATORS: BUGGY_SAFARI_ITERATORS
  };

  var min = Math.min;

  // `ToLength` abstract operation
  // https://tc39.github.io/ecma262/#sec-tolength
  var toLength = function (argument) {
    return argument > 0 ? min(toInteger(argument), 0x1FFFFFFFFFFFFF) : 0; // 2 ** 53 - 1 == 9007199254740991
  };

  var max = Math.max;
  var min$1 = Math.min;

  // Helper for a popular repeating case of the spec:
  // Let integer be ? ToInteger(index).
  // If integer < 0, let result be max((length + integer), 0); else let result be min(length, length).
  var toAbsoluteIndex = function (index, length) {
    var integer = toInteger(index);
    return integer < 0 ? max(integer + length, 0) : min$1(integer, length);
  };

  // `Array.prototype.{ indexOf, includes }` methods implementation
  // false -> Array#indexOf
  // https://tc39.github.io/ecma262/#sec-array.prototype.indexof
  // true  -> Array#includes
  // https://tc39.github.io/ecma262/#sec-array.prototype.includes
  var arrayIncludes = function (IS_INCLUDES) {
    return function ($this, el, fromIndex) {
      var O = toIndexedObject($this);
      var length = toLength(O.length);
      var index = toAbsoluteIndex(fromIndex, length);
      var value;
      // Array#includes uses SameValueZero equality algorithm
      // eslint-disable-next-line no-self-compare
      if (IS_INCLUDES && el != el) while (length > index) {
        value = O[index++];
        // eslint-disable-next-line no-self-compare
        if (value != value) return true;
      // Array#indexOf ignores holes, Array#includes - not
      } else for (;length > index; index++) if (IS_INCLUDES || index in O) {
        if (O[index] === el) return IS_INCLUDES || index || 0;
      } return !IS_INCLUDES && -1;
    };
  };

  var arrayIndexOf = arrayIncludes(false);


  var objectKeysInternal = function (object, names) {
    var O = toIndexedObject(object);
    var i = 0;
    var result = [];
    var key;
    for (key in O) !has(hiddenKeys, key) && has(O, key) && result.push(key);
    // Don't enum bug & hidden keys
    while (names.length > i) if (has(O, key = names[i++])) {
      ~arrayIndexOf(result, key) || result.push(key);
    }
    return result;
  };

  // IE8- don't enum bug keys
  var enumBugKeys = [
    'constructor',
    'hasOwnProperty',
    'isPrototypeOf',
    'propertyIsEnumerable',
    'toLocaleString',
    'toString',
    'valueOf'
  ];

  // 19.1.2.14 / 15.2.3.14 Object.keys(O)



  var objectKeys = Object.keys || function keys(O) {
    return objectKeysInternal(O, enumBugKeys);
  };

  var objectDefineProperties = descriptors ? Object.defineProperties : function defineProperties(O, Properties) {
    anObject(O);
    var keys = objectKeys(Properties);
    var length = keys.length;
    var i = 0;
    var key;
    while (length > i) objectDefineProperty.f(O, key = keys[i++], Properties[key]);
    return O;
  };

  var document$2 = global$1.document;

  var html = document$2 && document$2.documentElement;

  // 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])





  var IE_PROTO$1 = sharedKey('IE_PROTO');
  var PROTOTYPE = 'prototype';
  var Empty = function () { /* empty */ };

  // Create object with fake `null` prototype: use iframe Object with cleared prototype
  var createDict = function () {
    // Thrash, waste and sodomy: IE GC bug
    var iframe = documentCreateElement('iframe');
    var length = enumBugKeys.length;
    var lt = '<';
    var script = 'script';
    var gt = '>';
    var js = 'java' + script + ':';
    var iframeDocument;
    iframe.style.display = 'none';
    html.appendChild(iframe);
    iframe.src = String(js);
    iframeDocument = iframe.contentWindow.document;
    iframeDocument.open();
    iframeDocument.write(lt + script + gt + 'document.F=Object' + lt + '/' + script + gt);
    iframeDocument.close();
    createDict = iframeDocument.F;
    while (length--) delete createDict[PROTOTYPE][enumBugKeys[length]];
    return createDict();
  };

  var objectCreate = Object.create || function create(O, Properties) {
    var result;
    if (O !== null) {
      Empty[PROTOTYPE] = anObject(O);
      result = new Empty();
      Empty[PROTOTYPE] = null;
      // add "__proto__" for Object.getPrototypeOf polyfill
      result[IE_PROTO$1] = O;
    } else result = createDict();
    return Properties === undefined ? result : objectDefineProperties(result, Properties);
  };

  hiddenKeys[IE_PROTO$1] = true;

  var TO_STRING_TAG = wellKnownSymbol('toStringTag');
  // ES3 wrong here
  var CORRECT_ARGUMENTS = classofRaw(function () { return arguments; }()) == 'Arguments';

  // fallback for IE11 Script Access Denied error
  var tryGet = function (it, key) {
    try {
      return it[key];
    } catch (error) { /* empty */ }
  };

  // getting tag from ES6+ `Object.prototype.toString`
  var classof = function (it) {
    var O, tag, result;
    return it === undefined ? 'Undefined' : it === null ? 'Null'
      // @@toStringTag case
      : typeof (tag = tryGet(O = Object(it), TO_STRING_TAG)) == 'string' ? tag
      // builtinTag case
      : CORRECT_ARGUMENTS ? classofRaw(O)
      // ES3 arguments fallback
      : (result = classofRaw(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : result;
  };

  var TO_STRING_TAG$1 = wellKnownSymbol('toStringTag');
  var test = {};

  test[TO_STRING_TAG$1] = 'z';

  // `Object.prototype.toString` method implementation
  // https://tc39.github.io/ecma262/#sec-object.prototype.tostring
  var objectToString = String(test) !== '[object z]' ? function toString() {
    return '[object ' + classof(this) + ']';
  } : test.toString;

  var defineProperty = objectDefineProperty.f;


  var TO_STRING_TAG$2 = wellKnownSymbol('toStringTag');

  var METHOD_REQUIRED = objectToString !== ({}).toString;

  var setToStringTag = function (it, TAG, STATIC, SET_METHOD) {
    if (it) {
      var target = STATIC ? it : it.prototype;
      if (!has(target, TO_STRING_TAG$2)) {
        defineProperty(target, TO_STRING_TAG$2, { configurable: true, value: TAG });
      }
      if (SET_METHOD && METHOD_REQUIRED) hide(target, 'toString', objectToString);
    }
  };

  var iterators = {};

  var IteratorPrototype$1 = iteratorsCore.IteratorPrototype;





  var returnThis = function () { return this; };

  var createIteratorConstructor = function (IteratorConstructor, NAME, next) {
    var TO_STRING_TAG = NAME + ' Iterator';
    IteratorConstructor.prototype = objectCreate(IteratorPrototype$1, { next: createPropertyDescriptor(1, next) });
    setToStringTag(IteratorConstructor, TO_STRING_TAG, false, true);
    iterators[TO_STRING_TAG] = returnThis;
    return IteratorConstructor;
  };

  var validateSetPrototypeOfArguments = function (O, proto) {
    anObject(O);
    if (!isObject(proto) && proto !== null) {
      throw TypeError("Can't set " + String(proto) + ' as a prototype');
    }
  };

  // Works with __proto__ only. Old v8 can't work with null proto objects.
  /* eslint-disable no-proto */


  var objectSetPrototypeOf = Object.setPrototypeOf || ('__proto__' in {} ? function () {
    var correctSetter = false;
    var test = {};
    var setter;
    try {
      setter = Object.getOwnPropertyDescriptor(Object.prototype, '__proto__').set;
      setter.call(test, []);
      correctSetter = test instanceof Array;
    } catch (error) { /* empty */ }
    return function setPrototypeOf(O, proto) {
      validateSetPrototypeOfArguments(O, proto);
      if (correctSetter) setter.call(O, proto);
      else O.__proto__ = proto;
      return O;
    };
  }() : undefined);

  var redefine = function (target, key, value, options) {
    if (options && options.enumerable) target[key] = value;
    else hide(target, key, value);
  };

  var ITERATOR$1 = wellKnownSymbol('iterator');


  var IteratorPrototype$2 = iteratorsCore.IteratorPrototype;
  var BUGGY_SAFARI_ITERATORS$1 = iteratorsCore.BUGGY_SAFARI_ITERATORS;
  var KEYS = 'keys';
  var VALUES = 'values';
  var ENTRIES = 'entries';

  var returnThis$1 = function () { return this; };

  var defineIterator = function (Iterable, NAME, IteratorConstructor, next, DEFAULT, IS_SET, FORCED) {
    createIteratorConstructor(IteratorConstructor, NAME, next);

    var getIterationMethod = function (KIND) {
      if (KIND === DEFAULT && defaultIterator) return defaultIterator;
      if (!BUGGY_SAFARI_ITERATORS$1 && KIND in IterablePrototype) return IterablePrototype[KIND];
      switch (KIND) {
        case KEYS: return function keys() { return new IteratorConstructor(this, KIND); };
        case VALUES: return function values() { return new IteratorConstructor(this, KIND); };
        case ENTRIES: return function entries() { return new IteratorConstructor(this, KIND); };
      } return function () { return new IteratorConstructor(this); };
    };

    var TO_STRING_TAG = NAME + ' Iterator';
    var INCORRECT_VALUES_NAME = false;
    var IterablePrototype = Iterable.prototype;
    var nativeIterator = IterablePrototype[ITERATOR$1]
      || IterablePrototype['@@iterator']
      || DEFAULT && IterablePrototype[DEFAULT];
    var defaultIterator = !BUGGY_SAFARI_ITERATORS$1 && nativeIterator || getIterationMethod(DEFAULT);
    var anyNativeIterator = NAME == 'Array' ? IterablePrototype.entries || nativeIterator : nativeIterator;
    var CurrentIteratorPrototype, methods, KEY;

    // fix native
    if (anyNativeIterator) {
      CurrentIteratorPrototype = objectGetPrototypeOf(anyNativeIterator.call(new Iterable()));
      if (IteratorPrototype$2 !== Object.prototype && CurrentIteratorPrototype.next) {
        // Set @@toStringTag to native iterators
        setToStringTag(CurrentIteratorPrototype, TO_STRING_TAG, true, true);
        iterators[TO_STRING_TAG] = returnThis$1;
      }
    }

    // fix Array#{values, @@iterator}.name in V8 / FF
    if (DEFAULT == VALUES && nativeIterator && nativeIterator.name !== VALUES) {
      INCORRECT_VALUES_NAME = true;
      defaultIterator = function values() { return nativeIterator.call(this); };
    }

    // define iterator
    if ((FORCED) && IterablePrototype[ITERATOR$1] !== defaultIterator) {
      hide(IterablePrototype, ITERATOR$1, defaultIterator);
    }
    iterators[NAME] = defaultIterator;

    // export additional methods
    if (DEFAULT) {
      methods = {
        values: getIterationMethod(VALUES),
        keys: IS_SET ? defaultIterator : getIterationMethod(KEYS),
        entries: getIterationMethod(ENTRIES)
      };
      if (FORCED) for (KEY in methods) {
        if (BUGGY_SAFARI_ITERATORS$1 || INCORRECT_VALUES_NAME || !(KEY in IterablePrototype)) {
          redefine(IterablePrototype, KEY, methods[KEY]);
        }
      } else _export({ target: NAME, proto: true, forced: BUGGY_SAFARI_ITERATORS$1 || INCORRECT_VALUES_NAME }, methods);
    }

    return methods;
  };

  var STRING_ITERATOR = 'String Iterator';
  var setInternalState = internalState.set;
  var getInternalState = internalState.getterFor(STRING_ITERATOR);

  // `String.prototype[@@iterator]` method
  // https://tc39.github.io/ecma262/#sec-string.prototype-@@iterator
  defineIterator(String, 'String', function (iterated) {
    setInternalState(this, {
      type: STRING_ITERATOR,
      string: String(iterated),
      index: 0
    });
  // `%StringIteratorPrototype%.next` method
  // https://tc39.github.io/ecma262/#sec-%stringiteratorprototype%.next
  }, function next() {
    var state = getInternalState(this);
    var string = state.string;
    var index = state.index;
    var point;
    if (index >= string.length) return { value: undefined, done: true };
    point = stringAt(string, index, true);
    state.index += point.length;
    return { value: point, done: false };
  });

  var ARRAY_ITERATOR = 'Array Iterator';
  var setInternalState$1 = internalState.set;
  var getInternalState$1 = internalState.getterFor(ARRAY_ITERATOR);

  // `Array.prototype.entries` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.entries
  // `Array.prototype.keys` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.keys
  // `Array.prototype.values` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.values
  // `Array.prototype[@@iterator]` method
  // https://tc39.github.io/ecma262/#sec-array.prototype-@@iterator
  // `CreateArrayIterator` internal method
  // https://tc39.github.io/ecma262/#sec-createarrayiterator
  var es_array_iterator = defineIterator(Array, 'Array', function (iterated, kind) {
    setInternalState$1(this, {
      type: ARRAY_ITERATOR,
      target: toIndexedObject(iterated), // target
      index: 0,                          // next index
      kind: kind                         // kind
    });
  // `%ArrayIteratorPrototype%.next` method
  // https://tc39.github.io/ecma262/#sec-%arrayiteratorprototype%.next
  }, function () {
    var state = getInternalState$1(this);
    var target = state.target;
    var kind = state.kind;
    var index = state.index++;
    if (!target || index >= target.length) {
      state.target = undefined;
      return { value: undefined, done: true };
    }
    if (kind == 'keys') return { value: index, done: false };
    if (kind == 'values') return { value: target[index], done: false };
    return { value: [index, target[index]], done: false };
  }, 'values');

  // argumentsList[@@iterator] is %ArrayProto_values%
  // https://tc39.github.io/ecma262/#sec-createunmappedargumentsobject
  // https://tc39.github.io/ecma262/#sec-createmappedargumentsobject
  iterators.Arguments = iterators.Array;

  // iterable DOM collections
  // flag - `iterable` interface - 'entries', 'keys', 'values', 'forEach' methods
  var domIterables = {
    CSSRuleList: 0,
    CSSStyleDeclaration: 0,
    CSSValueList: 0,
    ClientRectList: 0,
    DOMRectList: 0,
    DOMStringList: 0,
    DOMTokenList: 1,
    DataTransferItemList: 0,
    FileList: 0,
    HTMLAllCollection: 0,
    HTMLCollection: 0,
    HTMLFormElement: 0,
    HTMLSelectElement: 0,
    MediaList: 0,
    MimeTypeArray: 0,
    NamedNodeMap: 0,
    NodeList: 1,
    PaintRequestList: 0,
    Plugin: 0,
    PluginArray: 0,
    SVGLengthList: 0,
    SVGNumberList: 0,
    SVGPathSegList: 0,
    SVGPointList: 0,
    SVGStringList: 0,
    SVGTransformList: 0,
    SourceBufferList: 0,
    StyleSheetList: 0,
    TextTrackCueList: 0,
    TextTrackList: 0,
    TouchList: 0
  };

  var TO_STRING_TAG$3 = wellKnownSymbol('toStringTag');

  for (var COLLECTION_NAME in domIterables) {
    var Collection = global$1[COLLECTION_NAME];
    var CollectionPrototype = Collection && Collection.prototype;
    if (CollectionPrototype && !CollectionPrototype[TO_STRING_TAG$3]) {
      hide(CollectionPrototype, TO_STRING_TAG$3, COLLECTION_NAME);
    }
    iterators[COLLECTION_NAME] = iterators.Array;
  }

  var anInstance = function (it, Constructor, name) {
    if (!(it instanceof Constructor)) {
      throw TypeError('Incorrect ' + (name ? name + ' ' : '') + 'invocation');
    } return it;
  };

  // check on default Array iterator

  var ITERATOR$2 = wellKnownSymbol('iterator');
  var ArrayPrototype = Array.prototype;

  var isArrayIteratorMethod = function (it) {
    return it !== undefined && (iterators.Array === it || ArrayPrototype[ITERATOR$2] === it);
  };

  var ITERATOR$3 = wellKnownSymbol('iterator');


  var getIteratorMethod = function (it) {
    if (it != undefined) return it[ITERATOR$3]
      || it['@@iterator']
      || iterators[classof(it)];
  };

  // call something on iterator step with safe closing on error
  var callWithSafeIterationClosing = function (iterator, fn, value, ENTRIES) {
    try {
      return ENTRIES ? fn(anObject(value)[0], value[1]) : fn(value);
    // 7.4.6 IteratorClose(iterator, completion)
    } catch (error) {
      var returnMethod = iterator['return'];
      if (returnMethod !== undefined) anObject(returnMethod.call(iterator));
      throw error;
    }
  };

  var iterate = createCommonjsModule(function (module) {
  var BREAK = {};

  var exports = module.exports = function (iterable, fn, that, ENTRIES, ITERATOR) {
    var boundFunction = bindContext(fn, that, ENTRIES ? 2 : 1);
    var iterator, iterFn, index, length, result, step;

    if (ITERATOR) {
      iterator = iterable;
    } else {
      iterFn = getIteratorMethod(iterable);
      if (typeof iterFn != 'function') throw TypeError('Target is not iterable');
      // optimisation for array iterators
      if (isArrayIteratorMethod(iterFn)) {
        for (index = 0, length = toLength(iterable.length); length > index; index++) {
          result = ENTRIES ? boundFunction(anObject(step = iterable[index])[0], step[1]) : boundFunction(iterable[index]);
          if (result === BREAK) return BREAK;
        } return;
      }
      iterator = iterFn.call(iterable);
    }

    while (!(step = iterator.next()).done) {
      if (callWithSafeIterationClosing(iterator, boundFunction, step.value, ENTRIES) === BREAK) return BREAK;
    }
  };

  exports.BREAK = BREAK;
  });

  var ITERATOR$4 = wellKnownSymbol('iterator');
  var SAFE_CLOSING = false;

  try {
    var called = 0;
    var iteratorWithReturn = {
      next: function () {
        return { done: !!called++ };
      },
      'return': function () {
        SAFE_CLOSING = true;
      }
    };
    iteratorWithReturn[ITERATOR$4] = function () {
      return this;
    };
  } catch (error) { /* empty */ }

  var checkCorrectnessOfIteration = function (exec, SKIP_CLOSING) {
    if (!SKIP_CLOSING && !SAFE_CLOSING) return false;
    var ITERATION_SUPPORT = false;
    try {
      var object = {};
      object[ITERATOR$4] = function () {
        return {
          next: function () {
            return { done: ITERATION_SUPPORT = true };
          }
        };
      };
      exec(object);
    } catch (error) { /* empty */ }
    return ITERATION_SUPPORT;
  };

  var SPECIES = wellKnownSymbol('species');

  // `SpeciesConstructor` abstract operation
  // https://tc39.github.io/ecma262/#sec-speciesconstructor
  var speciesConstructor = function (O, defaultConstructor) {
    var C = anObject(O).constructor;
    var S;
    return C === undefined || (S = anObject(C)[SPECIES]) == undefined ? defaultConstructor : aFunction(S);
  };

  var set$1 = global$1.setImmediate;
  var clear = global$1.clearImmediate;
  var process = global$1.process;
  var MessageChannel = global$1.MessageChannel;
  var Dispatch = global$1.Dispatch;
  var counter = 0;
  var queue = {};
  var ONREADYSTATECHANGE = 'onreadystatechange';
  var defer, channel, port;

  var run = function () {
    var id = +this;
    // eslint-disable-next-line no-prototype-builtins
    if (queue.hasOwnProperty(id)) {
      var fn = queue[id];
      delete queue[id];
      fn();
    }
  };

  var listener = function (event) {
    run.call(event.data);
  };

  // Node.js 0.9+ & IE10+ has setImmediate, otherwise:
  if (!set$1 || !clear) {
    set$1 = function setImmediate(fn) {
      var args = [];
      var i = 1;
      while (arguments.length > i) args.push(arguments[i++]);
      queue[++counter] = function () {
        // eslint-disable-next-line no-new-func
        (typeof fn == 'function' ? fn : Function(fn)).apply(undefined, args);
      };
      defer(counter);
      return counter;
    };
    clear = function clearImmediate(id) {
      delete queue[id];
    };
    // Node.js 0.8-
    if (classofRaw(process) == 'process') {
      defer = function (id) {
        process.nextTick(bindContext(run, id, 1));
      };
    // Sphere (JS game engine) Dispatch API
    } else if (Dispatch && Dispatch.now) {
      defer = function (id) {
        Dispatch.now(bindContext(run, id, 1));
      };
    // Browsers with MessageChannel, includes WebWorkers
    } else if (MessageChannel) {
      channel = new MessageChannel();
      port = channel.port2;
      channel.port1.onmessage = listener;
      defer = bindContext(port.postMessage, port, 1);
    // Browsers with postMessage, skip WebWorkers
    // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
    } else if (global$1.addEventListener && typeof postMessage == 'function' && !global$1.importScripts) {
      defer = function (id) {
        global$1.postMessage(id + '', '*');
      };
      global$1.addEventListener('message', listener, false);
    // IE8-
    } else if (ONREADYSTATECHANGE in documentCreateElement('script')) {
      defer = function (id) {
        html.appendChild(documentCreateElement('script'))[ONREADYSTATECHANGE] = function () {
          html.removeChild(this);
          run.call(id);
        };
      };
    // Rest old browsers
    } else {
      defer = function (id) {
        setTimeout(bindContext(run, id, 1), 0);
      };
    }
  }

  var task = {
    set: set$1,
    clear: clear
  };

  var navigator$1 = global$1.navigator;

  var userAgent = navigator$1 && navigator$1.userAgent || '';

  var getOwnPropertyDescriptor$1 = objectGetOwnPropertyDescriptor.f;

  var macrotask = task.set;

  var MutationObserver$1 = global$1.MutationObserver || global$1.WebKitMutationObserver;
  var process$1 = global$1.process;
  var Promise$1 = global$1.Promise;
  var IS_NODE = classofRaw(process$1) == 'process';
  // Node.js 11 shows ExperimentalWarning on getting `queueMicrotask`
  var queueMicrotaskDescriptor = getOwnPropertyDescriptor$1(global$1, 'queueMicrotask');
  var queueMicrotask = queueMicrotaskDescriptor && queueMicrotaskDescriptor.value;

  var flush, head, last, notify, toggle, node, promise;

  // modern engines have queueMicrotask method
  if (!queueMicrotask) {
    flush = function () {
      var parent, fn;
      if (IS_NODE && (parent = process$1.domain)) parent.exit();
      while (head) {
        fn = head.fn;
        head = head.next;
        try {
          fn();
        } catch (error) {
          if (head) notify();
          else last = undefined;
          throw error;
        }
      } last = undefined;
      if (parent) parent.enter();
    };

    // Node.js
    if (IS_NODE) {
      notify = function () {
        process$1.nextTick(flush);
      };
    // browsers with MutationObserver, except iOS - https://github.com/zloirock/core-js/issues/339
    } else if (MutationObserver$1 && !/(iPhone|iPod|iPad).*AppleWebKit/i.test(userAgent)) {
      toggle = true;
      node = document.createTextNode('');
      new MutationObserver$1(flush).observe(node, { characterData: true }); // eslint-disable-line no-new
      notify = function () {
        node.data = toggle = !toggle;
      };
    // environments with maybe non-completely correct, but existent Promise
    } else if (Promise$1 && Promise$1.resolve) {
      // Promise.resolve without an argument throws an error in LG WebOS 2
      promise = Promise$1.resolve(undefined);
      notify = function () {
        promise.then(flush);
      };
    // for other environments - macrotask based on:
    // - setImmediate
    // - MessageChannel
    // - window.postMessag
    // - onreadystatechange
    // - setTimeout
    } else {
      notify = function () {
        // strange IE + webpack dev server bug - use .call(global)
        macrotask.call(global$1, flush);
      };
    }
  }

  var microtask = queueMicrotask || function (fn) {
    var task = { fn: fn, next: undefined };
    if (last) last.next = task;
    if (!head) {
      head = task;
      notify();
    } last = task;
  };

  // 25.4.1.5 NewPromiseCapability(C)


  var PromiseCapability = function (C) {
    var resolve, reject;
    this.promise = new C(function ($$resolve, $$reject) {
      if (resolve !== undefined || reject !== undefined) throw TypeError('Bad Promise constructor');
      resolve = $$resolve;
      reject = $$reject;
    });
    this.resolve = aFunction(resolve);
    this.reject = aFunction(reject);
  };

  var f$3 = function (C) {
    return new PromiseCapability(C);
  };

  var newPromiseCapability = {
  	f: f$3
  };

  var promiseResolve = function (C, x) {
    anObject(C);
    if (isObject(x) && x.constructor === C) return x;
    var promiseCapability = newPromiseCapability.f(C);
    var resolve = promiseCapability.resolve;
    resolve(x);
    return promiseCapability.promise;
  };

  var hostReportErrors = function (a, b) {
    var console = global$1.console;
    if (console && console.error) {
      arguments.length === 1 ? console.error(a) : console.error(a, b);
    }
  };

  var perform = function (exec) {
    try {
      return { error: false, value: exec() };
    } catch (error) {
      return { error: true, value: error };
    }
  };

  var redefineAll = function (target, src, options) {
    for (var key in src) {
      if (options && options.unsafe && target[key]) target[key] = src[key];
      else redefine(target, key, src[key], options);
    } return target;
  };

  var aFunction$1 = function (variable) {
    return typeof variable == 'function' ? variable : undefined;
  };

  var getBuiltIn = function (namespace, method) {
    return arguments.length < 2 ? aFunction$1(path[namespace]) || aFunction$1(global$1[namespace])
      : path[namespace] && path[namespace][method] || global$1[namespace] && global$1[namespace][method];
  };

  var SPECIES$1 = wellKnownSymbol('species');

  var setSpecies = function (CONSTRUCTOR_NAME) {
    var C = getBuiltIn(CONSTRUCTOR_NAME);
    var defineProperty = objectDefineProperty.f;
    if (descriptors && C && !C[SPECIES$1]) defineProperty(C, SPECIES$1, {
      configurable: true,
      get: function () { return this; }
    });
  };

  var PROMISE = 'Promise';










  var task$1 = task.set;






  var SPECIES$2 = wellKnownSymbol('species');


  var getInternalState$2 = internalState.get;
  var setInternalState$2 = internalState.set;
  var getInternalPromiseState = internalState.getterFor(PROMISE);
  var PromiseConstructor = global$1[PROMISE];
  var TypeError$1 = global$1.TypeError;
  var document$3 = global$1.document;
  var process$2 = global$1.process;
  var $fetch = global$1.fetch;
  var versions = process$2 && process$2.versions;
  var v8 = versions && versions.v8 || '';
  var newPromiseCapability$1 = newPromiseCapability.f;
  var newGenericPromiseCapability = newPromiseCapability$1;
  var IS_NODE$1 = classofRaw(process$2) == 'process';
  var DISPATCH_EVENT = !!(document$3 && document$3.createEvent && global$1.dispatchEvent);
  var UNHANDLED_REJECTION = 'unhandledrejection';
  var REJECTION_HANDLED = 'rejectionhandled';
  var PENDING = 0;
  var FULFILLED = 1;
  var REJECTED = 2;
  var HANDLED = 1;
  var UNHANDLED = 2;
  var Internal, OwnPromiseCapability, PromiseWrapper;

  var FORCED = isForced_1(PROMISE, function () {
    // correct subclassing with @@species support
    var promise = PromiseConstructor.resolve(1);
    var empty = function () { /* empty */ };
    var FakePromise = (promise.constructor = {})[SPECIES$2] = function (exec) {
      exec(empty, empty);
    };
    // unhandled rejections tracking support, NodeJS Promise without it fails @@species test
    return !((IS_NODE$1 || typeof PromiseRejectionEvent == 'function')
      && (promise['finally'])
      && promise.then(empty) instanceof FakePromise
      // v8 6.6 (Node 10 and Chrome 66) have a bug with resolving custom thenables
      // https://bugs.chromium.org/p/chromium/issues/detail?id=830565
      // we can't detect it synchronously, so just check versions
      && v8.indexOf('6.6') !== 0
      && userAgent.indexOf('Chrome/66') === -1);
  });

  var INCORRECT_ITERATION = FORCED || !checkCorrectnessOfIteration(function (iterable) {
    PromiseConstructor.all(iterable)['catch'](function () { /* empty */ });
  });

  // helpers
  var isThenable = function (it) {
    var then;
    return isObject(it) && typeof (then = it.then) == 'function' ? then : false;
  };

  var notify$1 = function (promise, state, isReject) {
    if (state.notified) return;
    state.notified = true;
    var chain = state.reactions;
    microtask(function () {
      var value = state.value;
      var ok = state.state == FULFILLED;
      var i = 0;
      var run = function (reaction) {
        var handler = ok ? reaction.ok : reaction.fail;
        var resolve = reaction.resolve;
        var reject = reaction.reject;
        var domain = reaction.domain;
        var result, then, exited;
        try {
          if (handler) {
            if (!ok) {
              if (state.rejection === UNHANDLED) onHandleUnhandled(promise, state);
              state.rejection = HANDLED;
            }
            if (handler === true) result = value;
            else {
              if (domain) domain.enter();
              result = handler(value); // may throw
              if (domain) {
                domain.exit();
                exited = true;
              }
            }
            if (result === reaction.promise) {
              reject(TypeError$1('Promise-chain cycle'));
            } else if (then = isThenable(result)) {
              then.call(result, resolve, reject);
            } else resolve(result);
          } else reject(value);
        } catch (error) {
          if (domain && !exited) domain.exit();
          reject(error);
        }
      };
      while (chain.length > i) run(chain[i++]); // variable length - can't use forEach
      state.reactions = [];
      state.notified = false;
      if (isReject && !state.rejection) onUnhandled(promise, state);
    });
  };

  var dispatchEvent = function (name, promise, reason) {
    var event, handler;
    if (DISPATCH_EVENT) {
      event = document$3.createEvent('Event');
      event.promise = promise;
      event.reason = reason;
      event.initEvent(name, false, true);
      global$1.dispatchEvent(event);
    } else event = { promise: promise, reason: reason };
    if (handler = global$1['on' + name]) handler(event);
    else if (name === UNHANDLED_REJECTION) hostReportErrors('Unhandled promise rejection', reason);
  };

  var onUnhandled = function (promise, state) {
    task$1.call(global$1, function () {
      var value = state.value;
      var IS_UNHANDLED = isUnhandled(state);
      var result;
      if (IS_UNHANDLED) {
        result = perform(function () {
          if (IS_NODE$1) {
            process$2.emit('unhandledRejection', value, promise);
          } else dispatchEvent(UNHANDLED_REJECTION, promise, value);
        });
        // Browsers should not trigger `rejectionHandled` event if it was handled here, NodeJS - should
        state.rejection = IS_NODE$1 || isUnhandled(state) ? UNHANDLED : HANDLED;
        if (result.error) throw result.value;
      }
    });
  };

  var isUnhandled = function (state) {
    return state.rejection !== HANDLED && !state.parent;
  };

  var onHandleUnhandled = function (promise, state) {
    task$1.call(global$1, function () {
      if (IS_NODE$1) {
        process$2.emit('rejectionHandled', promise);
      } else dispatchEvent(REJECTION_HANDLED, promise, state.value);
    });
  };

  var bind = function (fn, promise, state, unwrap) {
    return function (value) {
      fn(promise, state, value, unwrap);
    };
  };

  var internalReject = function (promise, state, value, unwrap) {
    if (state.done) return;
    state.done = true;
    if (unwrap) state = unwrap;
    state.value = value;
    state.state = REJECTED;
    notify$1(promise, state, true);
  };

  var internalResolve = function (promise, state, value, unwrap) {
    if (state.done) return;
    state.done = true;
    if (unwrap) state = unwrap;
    try {
      if (promise === value) throw TypeError$1("Promise can't be resolved itself");
      var then = isThenable(value);
      if (then) {
        microtask(function () {
          var wrapper = { done: false };
          try {
            then.call(value,
              bind(internalResolve, promise, wrapper, state),
              bind(internalReject, promise, wrapper, state)
            );
          } catch (error) {
            internalReject(promise, wrapper, error, state);
          }
        });
      } else {
        state.value = value;
        state.state = FULFILLED;
        notify$1(promise, state, false);
      }
    } catch (error) {
      internalReject(promise, { done: false }, error, state);
    }
  };

  // constructor polyfill
  if (FORCED) {
    // 25.4.3.1 Promise(executor)
    PromiseConstructor = function Promise(executor) {
      anInstance(this, PromiseConstructor, PROMISE);
      aFunction(executor);
      Internal.call(this);
      var state = getInternalState$2(this);
      try {
        executor(bind(internalResolve, this, state), bind(internalReject, this, state));
      } catch (error) {
        internalReject(this, state, error);
      }
    };
    // eslint-disable-next-line no-unused-vars
    Internal = function Promise(executor) {
      setInternalState$2(this, {
        type: PROMISE,
        done: false,
        notified: false,
        parent: false,
        reactions: [],
        rejection: false,
        state: PENDING,
        value: undefined
      });
    };
    Internal.prototype = redefineAll(PromiseConstructor.prototype, {
      // `Promise.prototype.then` method
      // https://tc39.github.io/ecma262/#sec-promise.prototype.then
      then: function then(onFulfilled, onRejected) {
        var state = getInternalPromiseState(this);
        var reaction = newPromiseCapability$1(speciesConstructor(this, PromiseConstructor));
        reaction.ok = typeof onFulfilled == 'function' ? onFulfilled : true;
        reaction.fail = typeof onRejected == 'function' && onRejected;
        reaction.domain = IS_NODE$1 ? process$2.domain : undefined;
        state.parent = true;
        state.reactions.push(reaction);
        if (state.state != PENDING) notify$1(this, state, false);
        return reaction.promise;
      },
      // `Promise.prototype.catch` method
      // https://tc39.github.io/ecma262/#sec-promise.prototype.catch
      'catch': function (onRejected) {
        return this.then(undefined, onRejected);
      }
    });
    OwnPromiseCapability = function () {
      var promise = new Internal();
      var state = getInternalState$2(promise);
      this.promise = promise;
      this.resolve = bind(internalResolve, promise, state);
      this.reject = bind(internalReject, promise, state);
    };
    newPromiseCapability.f = newPromiseCapability$1 = function (C) {
      return C === PromiseConstructor || C === PromiseWrapper
        ? new OwnPromiseCapability(C)
        : newGenericPromiseCapability(C);
    };
  }

  _export({ global: true, wrap: true, forced: FORCED }, { Promise: PromiseConstructor });

  setToStringTag(PromiseConstructor, PROMISE, false, true);
  setSpecies(PROMISE);

  PromiseWrapper = path[PROMISE];

  // statics
  _export({ target: PROMISE, stat: true, forced: FORCED }, {
    // `Promise.reject` method
    // https://tc39.github.io/ecma262/#sec-promise.reject
    reject: function reject(r) {
      var capability = newPromiseCapability$1(this);
      capability.reject.call(undefined, r);
      return capability.promise;
    }
  });

  _export({ target: PROMISE, stat: true, forced: isPure }, {
    // `Promise.resolve` method
    // https://tc39.github.io/ecma262/#sec-promise.resolve
    resolve: function resolve(x) {
      return promiseResolve(this === PromiseWrapper ? PromiseConstructor : this, x);
    }
  });

  _export({ target: PROMISE, stat: true, forced: INCORRECT_ITERATION }, {
    // `Promise.all` method
    // https://tc39.github.io/ecma262/#sec-promise.all
    all: function all(iterable) {
      var C = this;
      var capability = newPromiseCapability$1(C);
      var resolve = capability.resolve;
      var reject = capability.reject;
      var result = perform(function () {
        var values = [];
        var counter = 0;
        var remaining = 1;
        iterate(iterable, function (promise) {
          var index = counter++;
          var alreadyCalled = false;
          values.push(undefined);
          remaining++;
          C.resolve(promise).then(function (value) {
            if (alreadyCalled) return;
            alreadyCalled = true;
            values[index] = value;
            --remaining || resolve(values);
          }, reject);
        });
        --remaining || resolve(values);
      });
      if (result.error) reject(result.value);
      return capability.promise;
    },
    // `Promise.race` method
    // https://tc39.github.io/ecma262/#sec-promise.race
    race: function race(iterable) {
      var C = this;
      var capability = newPromiseCapability$1(C);
      var reject = capability.reject;
      var result = perform(function () {
        iterate(iterable, function (promise) {
          C.resolve(promise).then(capability.resolve, reject);
        });
      });
      if (result.error) reject(result.value);
      return capability.promise;
    }
  });

  // `Promise.prototype.finally` method
  // https://tc39.github.io/ecma262/#sec-promise.prototype.finally
  _export({ target: 'Promise', proto: true, real: true }, {
    'finally': function (onFinally) {
      var C = speciesConstructor(this, getBuiltIn('Promise'));
      var isFunction = typeof onFinally == 'function';
      return this.then(
        isFunction ? function (x) {
          return promiseResolve(C, onFinally()).then(function () { return x; });
        } : onFinally,
        isFunction ? function (e) {
          return promiseResolve(C, onFinally()).then(function () { throw e; });
        } : onFinally
      );
    }
  });

  var promise$1 = path.Promise;

  var promise$2 = promise$1;

  var promise$3 = promise$2;

  // `IsArray` abstract operation
  // https://tc39.github.io/ecma262/#sec-isarray
  var isArray = Array.isArray || function isArray(arg) {
    return classofRaw(arg) == 'Array';
  };

  var SPECIES$3 = wellKnownSymbol('species');

  // `ArraySpeciesCreate` abstract operation
  // https://tc39.github.io/ecma262/#sec-arrayspeciescreate
  var arraySpeciesCreate = function (originalArray, length) {
    var C;
    if (isArray(originalArray)) {
      C = originalArray.constructor;
      // cross-realm fallback
      if (typeof C == 'function' && (C === Array || isArray(C.prototype))) C = undefined;
      else if (isObject(C)) {
        C = C[SPECIES$3];
        if (C === null) C = undefined;
      }
    } return new (C === undefined ? Array : C)(length === 0 ? 0 : length);
  };

  // `Array.prototype.{ forEach, map, filter, some, every, find, findIndex }` methods implementation
  // 0 -> Array#forEach
  // https://tc39.github.io/ecma262/#sec-array.prototype.foreach
  // 1 -> Array#map
  // https://tc39.github.io/ecma262/#sec-array.prototype.map
  // 2 -> Array#filter
  // https://tc39.github.io/ecma262/#sec-array.prototype.filter
  // 3 -> Array#some
  // https://tc39.github.io/ecma262/#sec-array.prototype.some
  // 4 -> Array#every
  // https://tc39.github.io/ecma262/#sec-array.prototype.every
  // 5 -> Array#find
  // https://tc39.github.io/ecma262/#sec-array.prototype.find
  // 6 -> Array#findIndex
  // https://tc39.github.io/ecma262/#sec-array.prototype.findIndex
  var arrayMethods = function (TYPE, specificCreate) {
    var IS_MAP = TYPE == 1;
    var IS_FILTER = TYPE == 2;
    var IS_SOME = TYPE == 3;
    var IS_EVERY = TYPE == 4;
    var IS_FIND_INDEX = TYPE == 6;
    var NO_HOLES = TYPE == 5 || IS_FIND_INDEX;
    var create = specificCreate || arraySpeciesCreate;
    return function ($this, callbackfn, that) {
      var O = toObject($this);
      var self = indexedObject(O);
      var boundFunction = bindContext(callbackfn, that, 3);
      var length = toLength(self.length);
      var index = 0;
      var target = IS_MAP ? create($this, length) : IS_FILTER ? create($this, 0) : undefined;
      var value, result;
      for (;length > index; index++) if (NO_HOLES || index in self) {
        value = self[index];
        result = boundFunction(value, index, O);
        if (TYPE) {
          if (IS_MAP) target[index] = result; // map
          else if (result) switch (TYPE) {
            case 3: return true;              // some
            case 5: return value;             // find
            case 6: return index;             // findIndex
            case 2: target.push(value);       // filter
          } else if (IS_EVERY) return false;  // every
        }
      }
      return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : target;
    };
  };

  var SPECIES$4 = wellKnownSymbol('species');

  var arrayMethodHasSpeciesSupport = function (METHOD_NAME) {
    return !fails(function () {
      var array = [];
      var constructor = array.constructor = {};
      constructor[SPECIES$4] = function () {
        return { foo: 1 };
      };
      return array[METHOD_NAME](Boolean).foo !== 1;
    });
  };

  var internalMap = arrayMethods(1);

  var SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('map');

  // `Array.prototype.map` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.map
  // with adding support of @@species
  _export({ target: 'Array', proto: true, forced: !SPECIES_SUPPORT }, {
    map: function map(callbackfn /* , thisArg */) {
      return internalMap(this, callbackfn, arguments[1]);
    }
  });

  var entryVirtual = function (CONSTRUCTOR) {
    return path[CONSTRUCTOR + 'Prototype'];
  };

  var map = entryVirtual('Array').map;

  var ArrayPrototype$1 = Array.prototype;

  var map_1 = function (it) {
    var own = it.map;
    return it === ArrayPrototype$1 || (it instanceof Array && own === ArrayPrototype$1.map) ? map : own;
  };

  var map$1 = map_1;

  var map$2 = map$1;

  var createProperty = function (object, key, value) {
    var propertyKey = toPrimitive(key);
    if (propertyKey in object) objectDefineProperty.f(object, propertyKey, createPropertyDescriptor(0, value));
    else object[propertyKey] = value;
  };

  var SPECIES$5 = wellKnownSymbol('species');
  var nativeSlice = [].slice;
  var max$1 = Math.max;

  var SPECIES_SUPPORT$1 = arrayMethodHasSpeciesSupport('slice');

  // `Array.prototype.slice` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.slice
  // fallback for not array-like ES3 strings and DOM objects
  _export({ target: 'Array', proto: true, forced: !SPECIES_SUPPORT$1 }, {
    slice: function slice(start, end) {
      var O = toIndexedObject(this);
      var length = toLength(O.length);
      var k = toAbsoluteIndex(start, length);
      var fin = toAbsoluteIndex(end === undefined ? length : end, length);
      // inline `ArraySpeciesCreate` for usage native `Array#slice` where it's possible
      var Constructor, result, n;
      if (isArray(O)) {
        Constructor = O.constructor;
        // cross-realm fallback
        if (typeof Constructor == 'function' && (Constructor === Array || isArray(Constructor.prototype))) {
          Constructor = undefined;
        } else if (isObject(Constructor)) {
          Constructor = Constructor[SPECIES$5];
          if (Constructor === null) Constructor = undefined;
        }
        if (Constructor === Array || Constructor === undefined) {
          return nativeSlice.call(O, k, fin);
        }
      }
      result = new (Constructor === undefined ? Array : Constructor)(max$1(fin - k, 0));
      for (n = 0; k < fin; k++, n++) if (k in O) createProperty(result, n, O[k]);
      result.length = n;
      return result;
    }
  });

  var slice = entryVirtual('Array').slice;

  var ArrayPrototype$2 = Array.prototype;

  var slice_1 = function (it) {
    var own = it.slice;
    return it === ArrayPrototype$2 || (it instanceof Array && own === ArrayPrototype$2.slice) ? slice : own;
  };

  var slice$1 = slice_1;

  var slice$2 = slice$1;

  // `Array.isArray` method
  // https://tc39.github.io/ecma262/#sec-array.isarray
  _export({ target: 'Array', stat: true }, { isArray: isArray });

  var isArray$1 = path.Array.isArray;

  var isArray$2 = isArray$1;

  var isArray$3 = isArray$2;

  function _arrayWithHoles(arr) {
    if (isArray$3(arr)) return arr;
  }

  var arrayWithHoles = _arrayWithHoles;

  // `Array.from` method
  // https://tc39.github.io/ecma262/#sec-array.from
  var arrayFrom = function from(arrayLike /* , mapfn = undefined, thisArg = undefined */) {
    var O = toObject(arrayLike);
    var C = typeof this == 'function' ? this : Array;
    var argumentsLength = arguments.length;
    var mapfn = argumentsLength > 1 ? arguments[1] : undefined;
    var mapping = mapfn !== undefined;
    var index = 0;
    var iteratorMethod = getIteratorMethod(O);
    var length, result, step, iterator;
    if (mapping) mapfn = bindContext(mapfn, argumentsLength > 2 ? arguments[2] : undefined, 2);
    // if the target is not iterable or it's an array with the default iterator - use a simple case
    if (iteratorMethod != undefined && !(C == Array && isArrayIteratorMethod(iteratorMethod))) {
      iterator = iteratorMethod.call(O);
      result = new C();
      for (;!(step = iterator.next()).done; index++) {
        createProperty(result, index, mapping
          ? callWithSafeIterationClosing(iterator, mapfn, [step.value, index], true)
          : step.value
        );
      }
    } else {
      length = toLength(O.length);
      result = new C(length);
      for (;length > index; index++) {
        createProperty(result, index, mapping ? mapfn(O[index], index) : O[index]);
      }
    }
    result.length = index;
    return result;
  };

  var INCORRECT_ITERATION$1 = !checkCorrectnessOfIteration(function (iterable) {
  });

  // `Array.from` method
  // https://tc39.github.io/ecma262/#sec-array.from
  _export({ target: 'Array', stat: true, forced: INCORRECT_ITERATION$1 }, {
    from: arrayFrom
  });

  var from_1 = path.Array.from;

  var from_1$1 = from_1;

  var from_1$2 = from_1$1;

  var ITERATOR$5 = wellKnownSymbol('iterator');


  var isIterable = function (it) {
    var O = Object(it);
    return O[ITERATOR$5] !== undefined
      || '@@iterator' in O
      // eslint-disable-next-line no-prototype-builtins
      || iterators.hasOwnProperty(classof(O));
  };

  var isIterable$1 = isIterable;

  var isIterable$2 = isIterable$1;

  function _iterableToArray(iter) {
    if (isIterable$2(Object(iter)) || Object.prototype.toString.call(iter) === "[object Arguments]") return from_1$2(iter);
  }

  var iterableToArray = _iterableToArray;

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance");
  }

  var nonIterableRest = _nonIterableRest;

  function _toArray(arr) {
    return arrayWithHoles(arr) || iterableToArray(arr) || nonIterableRest();
  }

  var toArray = _toArray;

  var nativeReverse = [].reverse;
  var test$1 = [1, 2];

  // `Array.prototype.reverse` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.reverse
  // fix for Safari 12.0 bug
  // https://bugs.webkit.org/show_bug.cgi?id=188794
  _export({ target: 'Array', proto: true, forced: String(test$1) === String(test$1.reverse()) }, {
    reverse: function reverse() {
      if (isArray(this)) this.length = this.length;
      return nativeReverse.call(this);
    }
  });

  var reverse = entryVirtual('Array').reverse;

  var ArrayPrototype$3 = Array.prototype;

  var reverse_1 = function (it) {
    var own = it.reverse;
    return it === ArrayPrototype$3 || (it instanceof Array && own === ArrayPrototype$3.reverse) ? reverse : own;
  };

  var reverse$1 = reverse_1;

  var reverse$2 = reverse$1;

  function _arrayWithoutHoles(arr) {
    if (isArray$3(arr)) {
      for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) {
        arr2[i] = arr[i];
      }

      return arr2;
    }
  }

  var arrayWithoutHoles = _arrayWithoutHoles;

  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance");
  }

  var nonIterableSpread = _nonIterableSpread;

  function _toConsumableArray(arr) {
    return arrayWithoutHoles(arr) || iterableToArray(arr) || nonIterableSpread();
  }

  var toConsumableArray = _toConsumableArray;

  var arraySlice = [].slice;
  var factories = {};

  var construct = function (C, argsLength, args) {
    if (!(argsLength in factories)) {
      for (var list = [], i = 0; i < argsLength; i++) list[i] = 'a[' + i + ']';
      // eslint-disable-next-line no-new-func
      factories[argsLength] = Function('C,a', 'return new C(' + list.join(',') + ')');
    } return factories[argsLength](C, args);
  };

  // `Function.prototype.bind` method implementation
  // https://tc39.github.io/ecma262/#sec-function.prototype.bind
  var functionBind = Function.bind || function bind(that /* , ...args */) {
    var fn = aFunction(this);
    var partArgs = arraySlice.call(arguments, 1);
    var boundFunction = function bound(/* args... */) {
      var args = partArgs.concat(arraySlice.call(arguments));
      return this instanceof boundFunction ? construct(fn, args.length, args) : fn.apply(that, args);
    };
    if (isObject(fn.prototype)) boundFunction.prototype = fn.prototype;
    return boundFunction;
  };

  // `Function.prototype.bind` method
  // https://tc39.github.io/ecma262/#sec-function.prototype.bind
  _export({ target: 'Function', proto: true }, {
    bind: functionBind
  });

  var bind$1 = entryVirtual('Function').bind;

  var FunctionPrototype = Function.prototype;

  var bind_1 = function (it) {
    var own = it.bind;
    return it === FunctionPrototype || (it instanceof Function && own === FunctionPrototype.bind) ? bind$1 : own;
  };

  var bind$2 = bind_1;

  var bind$3 = bind$2;

  var sloppyArrayMethod = function (METHOD_NAME, argument) {
    var method = [][METHOD_NAME];
    return !method || !fails(function () {
      // eslint-disable-next-line no-useless-call,no-throw-literal
      method.call(null, argument || function () { throw 1; }, 1);
    });
  };

  var internalIndexOf = arrayIncludes(false);
  var nativeIndexOf = [].indexOf;

  var NEGATIVE_ZERO = !!nativeIndexOf && 1 / [1].indexOf(1, -0) < 0;
  var SLOPPY_METHOD = sloppyArrayMethod('indexOf');

  // `Array.prototype.indexOf` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.indexof
  _export({ target: 'Array', proto: true, forced: NEGATIVE_ZERO || SLOPPY_METHOD }, {
    indexOf: function indexOf(searchElement /* , fromIndex = 0 */) {
      return NEGATIVE_ZERO
        // convert -0 to +0
        ? nativeIndexOf.apply(this, arguments) || 0
        : internalIndexOf(this, searchElement, arguments[1]);
    }
  });

  var indexOf = entryVirtual('Array').indexOf;

  var ArrayPrototype$4 = Array.prototype;

  var indexOf_1 = function (it) {
    var own = it.indexOf;
    return it === ArrayPrototype$4 || (it instanceof Array && own === ArrayPrototype$4.indexOf) ? indexOf : own;
  };

  var indexOf$1 = indexOf_1;

  var indexOf$2 = indexOf$1;

  var nativeForEach = [].forEach;
  var internalForEach = arrayMethods(0);

  var SLOPPY_METHOD$1 = sloppyArrayMethod('forEach');

  // `Array.prototype.forEach` method implementation
  // https://tc39.github.io/ecma262/#sec-array.prototype.foreach
  var arrayForEach = SLOPPY_METHOD$1 ? function forEach(callbackfn /* , thisArg */) {
    return internalForEach(this, callbackfn, arguments[1]);
  } : nativeForEach;

  // `Array.prototype.forEach` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.foreach
  _export({ target: 'Array', proto: true, forced: [].forEach != arrayForEach }, { forEach: arrayForEach });

  var forEach = entryVirtual('Array').forEach;

  var forEach$1 = forEach;

  var ArrayPrototype$5 = Array.prototype;

  var DOMIterables = {
    DOMTokenList: true,
    NodeList: true
  };

  var forEach_1 = function (it) {
    var own = it.forEach;
    return it === ArrayPrototype$5 || (it instanceof Array && own === ArrayPrototype$5.forEach)
      // eslint-disable-next-line no-prototype-builtins
      || DOMIterables.hasOwnProperty(classof(it)) ? forEach$1 : own;
  };

  var forEach$2 = forEach_1;

  var IS_CONCAT_SPREADABLE = wellKnownSymbol('isConcatSpreadable');
  var MAX_SAFE_INTEGER = 0x1FFFFFFFFFFFFF;
  var MAXIMUM_ALLOWED_INDEX_EXCEEDED = 'Maximum allowed index exceeded';

  var IS_CONCAT_SPREADABLE_SUPPORT = !fails(function () {
    var array = [];
    array[IS_CONCAT_SPREADABLE] = false;
    return array.concat()[0] !== array;
  });

  var SPECIES_SUPPORT$2 = arrayMethodHasSpeciesSupport('concat');

  var isConcatSpreadable = function (O) {
    if (!isObject(O)) return false;
    var spreadable = O[IS_CONCAT_SPREADABLE];
    return spreadable !== undefined ? !!spreadable : isArray(O);
  };

  var FORCED$1 = !IS_CONCAT_SPREADABLE_SUPPORT || !SPECIES_SUPPORT$2;

  // `Array.prototype.concat` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.concat
  // with adding support of @@isConcatSpreadable and @@species
  _export({ target: 'Array', proto: true, forced: FORCED$1 }, {
    concat: function concat(arg) { // eslint-disable-line no-unused-vars
      var O = toObject(this);
      var A = arraySpeciesCreate(O, 0);
      var n = 0;
      var i, k, length, len, E;
      for (i = -1, length = arguments.length; i < length; i++) {
        E = i === -1 ? O : arguments[i];
        if (isConcatSpreadable(E)) {
          len = toLength(E.length);
          if (n + len > MAX_SAFE_INTEGER) throw TypeError(MAXIMUM_ALLOWED_INDEX_EXCEEDED);
          for (k = 0; k < len; k++, n++) if (k in E) createProperty(A, n, E[k]);
        } else {
          if (n >= MAX_SAFE_INTEGER) throw TypeError(MAXIMUM_ALLOWED_INDEX_EXCEEDED);
          createProperty(A, n++, E);
        }
      }
      A.length = n;
      return A;
    }
  });

  var concat = entryVirtual('Array').concat;

  var ArrayPrototype$6 = Array.prototype;

  var concat_1 = function (it) {
    var own = it.concat;
    return it === ArrayPrototype$6 || (it instanceof Array && own === ArrayPrototype$6.concat) ? concat : own;
  };

  var concat$1 = concat_1;

  var concat$2 = concat$1;

  var from_1$3 = from_1;

  var from_1$4 = from_1$3;

  // `Array.prototype.{ reduce, reduceRight }` methods implementation
  // https://tc39.github.io/ecma262/#sec-array.prototype.reduce
  // https://tc39.github.io/ecma262/#sec-array.prototype.reduceright
  var arrayReduce = function (that, callbackfn, argumentsLength, memo, isRight) {
    aFunction(callbackfn);
    var O = toObject(that);
    var self = indexedObject(O);
    var length = toLength(O.length);
    var index = isRight ? length - 1 : 0;
    var i = isRight ? -1 : 1;
    if (argumentsLength < 2) while (true) {
      if (index in self) {
        memo = self[index];
        index += i;
        break;
      }
      index += i;
      if (isRight ? index < 0 : length <= index) {
        throw TypeError('Reduce of empty array with no initial value');
      }
    }
    for (;isRight ? index >= 0 : length > index; index += i) if (index in self) {
      memo = callbackfn(memo, self[index], index, O);
    }
    return memo;
  };

  var SLOPPY_METHOD$2 = sloppyArrayMethod('reduce');

  // `Array.prototype.reduce` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.reduce
  _export({ target: 'Array', proto: true, forced: SLOPPY_METHOD$2 }, {
    reduce: function reduce(callbackfn /* , initialValue */) {
      return arrayReduce(this, callbackfn, arguments.length, arguments[1], false);
    }
  });

  var reduce = entryVirtual('Array').reduce;

  var ArrayPrototype$7 = Array.prototype;

  var reduce_1 = function (it) {
    var own = it.reduce;
    return it === ArrayPrototype$7 || (it instanceof Array && own === ArrayPrototype$7.reduce) ? reduce : own;
  };

  var reduce$1 = reduce_1;

  var reduce$2 = reduce$1;

  var internalFilter = arrayMethods(2);

  var SPECIES_SUPPORT$3 = arrayMethodHasSpeciesSupport('filter');

  // `Array.prototype.filter` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.filter
  // with adding support of @@species
  _export({ target: 'Array', proto: true, forced: !SPECIES_SUPPORT$3 }, {
    filter: function filter(callbackfn /* , thisArg */) {
      return internalFilter(this, callbackfn, arguments[1]);
    }
  });

  var filter = entryVirtual('Array').filter;

  var ArrayPrototype$8 = Array.prototype;

  var filter_1 = function (it) {
    var own = it.filter;
    return it === ArrayPrototype$8 || (it instanceof Array && own === ArrayPrototype$8.filter) ? filter : own;
  };

  var filter$1 = filter_1;

  var filter$2 = filter$1;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var classCallCheck = _classCallCheck;

  // `Object.defineProperty` method
  // https://tc39.github.io/ecma262/#sec-object.defineproperty
  _export({ target: 'Object', stat: true, forced: !descriptors, sham: !descriptors }, {
    defineProperty: objectDefineProperty.f
  });

  var defineProperty_1 = createCommonjsModule(function (module) {
  var Object = path.Object;

  var defineProperty = module.exports = function defineProperty(it, key, desc) {
    return Object.defineProperty(it, key, desc);
  };

  if (Object.defineProperty.sham) defineProperty.sham = true;
  });

  var defineProperty$1 = defineProperty_1;

  var defineProperty$2 = defineProperty$1;

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;

      defineProperty$2(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  var createClass = _createClass;

  var f$4 = wellKnownSymbol;

  var wrappedWellKnownSymbol = {
  	f: f$4
  };

  var defineProperty$3 = objectDefineProperty.f;

  var defineWellKnownSymbol = function (NAME) {
    var Symbol = path.Symbol || (path.Symbol = {});
    if (!has(Symbol, NAME)) defineProperty$3(Symbol, NAME, {
      value: wrappedWellKnownSymbol.f(NAME)
    });
  };

  // `Symbol.iterator` well-known symbol
  // https://tc39.github.io/ecma262/#sec-symbol.iterator
  defineWellKnownSymbol('iterator');

  var iterator = wrappedWellKnownSymbol.f('iterator');

  var iterator$1 = iterator;

  var iterator$2 = iterator$1;

  var f$5 = Object.getOwnPropertySymbols;

  var objectGetOwnPropertySymbols = {
  	f: f$5
  };

  // all enumerable object keys, includes symbols
  var enumKeys = function (it) {
    var result = objectKeys(it);
    var getOwnPropertySymbols = objectGetOwnPropertySymbols.f;
    if (getOwnPropertySymbols) {
      var symbols = getOwnPropertySymbols(it);
      var propertyIsEnumerable = objectPropertyIsEnumerable.f;
      var i = 0;
      var key;
      while (symbols.length > i) if (propertyIsEnumerable.call(it, key = symbols[i++])) result.push(key);
    } return result;
  };

  // 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)

  var hiddenKeys$1 = enumBugKeys.concat('length', 'prototype');

  var f$6 = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
    return objectKeysInternal(O, hiddenKeys$1);
  };

  var objectGetOwnPropertyNames = {
  	f: f$6
  };

  // fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window

  var nativeGetOwnPropertyNames = objectGetOwnPropertyNames.f;
  var toString$1 = {}.toString;

  var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames
    ? Object.getOwnPropertyNames(window) : [];

  var getWindowNames = function (it) {
    try {
      return nativeGetOwnPropertyNames(it);
    } catch (error) {
      return windowNames.slice();
    }
  };

  var f$7 = function getOwnPropertyNames(it) {
    return windowNames && toString$1.call(it) == '[object Window]'
      ? getWindowNames(it)
      : nativeGetOwnPropertyNames(toIndexedObject(it));
  };

  var objectGetOwnPropertyNamesExternal = {
  	f: f$7
  };

  // ECMAScript 6 symbols shim




























  var HIDDEN = sharedKey('hidden');

  var SYMBOL = 'Symbol';
  var setInternalState$3 = internalState.set;
  var getInternalState$3 = internalState.getterFor(SYMBOL);
  var nativeGetOwnPropertyDescriptor$2 = objectGetOwnPropertyDescriptor.f;
  var nativeDefineProperty$1 = objectDefineProperty.f;
  var nativeGetOwnPropertyNames$1 = objectGetOwnPropertyNamesExternal.f;
  var $Symbol = global$1.Symbol;
  var JSON = global$1.JSON;
  var nativeJSONStringify = JSON && JSON.stringify;
  var PROTOTYPE$1 = 'prototype';
  var TO_PRIMITIVE = wellKnownSymbol('toPrimitive');
  var nativePropertyIsEnumerable$1 = objectPropertyIsEnumerable.f;
  var SymbolRegistry = shared('symbol-registry');
  var AllSymbols = shared('symbols');
  var ObjectPrototypeSymbols = shared('op-symbols');
  var WellKnownSymbolsStore = shared('wks');
  var ObjectPrototype$1 = Object[PROTOTYPE$1];
  var QObject = global$1.QObject;

  // Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
  var USE_SETTER = !QObject || !QObject[PROTOTYPE$1] || !QObject[PROTOTYPE$1].findChild;

  // fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
  var setSymbolDescriptor = descriptors && fails(function () {
    return objectCreate(nativeDefineProperty$1({}, 'a', {
      get: function () { return nativeDefineProperty$1(this, 'a', { value: 7 }).a; }
    })).a != 7;
  }) ? function (it, key, D) {
    var ObjectPrototypeDescriptor = nativeGetOwnPropertyDescriptor$2(ObjectPrototype$1, key);
    if (ObjectPrototypeDescriptor) delete ObjectPrototype$1[key];
    nativeDefineProperty$1(it, key, D);
    if (ObjectPrototypeDescriptor && it !== ObjectPrototype$1) {
      nativeDefineProperty$1(ObjectPrototype$1, key, ObjectPrototypeDescriptor);
    }
  } : nativeDefineProperty$1;

  var wrap = function (tag, description) {
    var symbol = AllSymbols[tag] = objectCreate($Symbol[PROTOTYPE$1]);
    setInternalState$3(symbol, {
      type: SYMBOL,
      tag: tag,
      description: description
    });
    if (!descriptors) symbol.description = description;
    return symbol;
  };

  var isSymbol = nativeSymbol && typeof $Symbol.iterator == 'symbol' ? function (it) {
    return typeof it == 'symbol';
  } : function (it) {
    return Object(it) instanceof $Symbol;
  };

  var $defineProperty = function defineProperty(it, key, D) {
    if (it === ObjectPrototype$1) $defineProperty(ObjectPrototypeSymbols, key, D);
    anObject(it);
    key = toPrimitive(key, true);
    anObject(D);
    if (has(AllSymbols, key)) {
      if (!D.enumerable) {
        if (!has(it, HIDDEN)) nativeDefineProperty$1(it, HIDDEN, createPropertyDescriptor(1, {}));
        it[HIDDEN][key] = true;
      } else {
        if (has(it, HIDDEN) && it[HIDDEN][key]) it[HIDDEN][key] = false;
        D = objectCreate(D, { enumerable: createPropertyDescriptor(0, false) });
      } return setSymbolDescriptor(it, key, D);
    } return nativeDefineProperty$1(it, key, D);
  };

  var $defineProperties = function defineProperties(it, P) {
    anObject(it);
    var keys = enumKeys(P = toIndexedObject(P));
    var i = 0;
    var l = keys.length;
    var key;
    while (l > i) $defineProperty(it, key = keys[i++], P[key]);
    return it;
  };

  var $create = function create(it, P) {
    return P === undefined ? objectCreate(it) : $defineProperties(objectCreate(it), P);
  };

  var $propertyIsEnumerable = function propertyIsEnumerable(key) {
    var E = nativePropertyIsEnumerable$1.call(this, key = toPrimitive(key, true));
    if (this === ObjectPrototype$1 && has(AllSymbols, key) && !has(ObjectPrototypeSymbols, key)) return false;
    return E || !has(this, key) || !has(AllSymbols, key) || has(this, HIDDEN) && this[HIDDEN][key] ? E : true;
  };

  var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key) {
    it = toIndexedObject(it);
    key = toPrimitive(key, true);
    if (it === ObjectPrototype$1 && has(AllSymbols, key) && !has(ObjectPrototypeSymbols, key)) return;
    var D = nativeGetOwnPropertyDescriptor$2(it, key);
    if (D && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key])) D.enumerable = true;
    return D;
  };

  var $getOwnPropertyNames = function getOwnPropertyNames(it) {
    var names = nativeGetOwnPropertyNames$1(toIndexedObject(it));
    var result = [];
    var i = 0;
    var key;
    while (names.length > i) {
      if (!has(AllSymbols, key = names[i++]) && !has(hiddenKeys, key)) result.push(key);
    } return result;
  };

  var $getOwnPropertySymbols = function getOwnPropertySymbols(it) {
    var IS_OP = it === ObjectPrototype$1;
    var names = nativeGetOwnPropertyNames$1(IS_OP ? ObjectPrototypeSymbols : toIndexedObject(it));
    var result = [];
    var i = 0;
    var key;
    while (names.length > i) {
      if (has(AllSymbols, key = names[i++]) && (IS_OP ? has(ObjectPrototype$1, key) : true)) result.push(AllSymbols[key]);
    } return result;
  };

  // `Symbol` constructor
  // https://tc39.github.io/ecma262/#sec-symbol-constructor
  if (!nativeSymbol) {
    $Symbol = function Symbol() {
      if (this instanceof $Symbol) throw TypeError('Symbol is not a constructor');
      var description = arguments[0] === undefined ? undefined : String(arguments[0]);
      var tag = uid(description);
      var setter = function (value) {
        if (this === ObjectPrototype$1) setter.call(ObjectPrototypeSymbols, value);
        if (has(this, HIDDEN) && has(this[HIDDEN], tag)) this[HIDDEN][tag] = false;
        setSymbolDescriptor(this, tag, createPropertyDescriptor(1, value));
      };
      if (descriptors && USE_SETTER) setSymbolDescriptor(ObjectPrototype$1, tag, { configurable: true, set: setter });
      return wrap(tag, description);
    };
    redefine($Symbol[PROTOTYPE$1], 'toString', function toString() {
      return getInternalState$3(this).tag;
    });

    objectPropertyIsEnumerable.f = $propertyIsEnumerable;
    objectDefineProperty.f = $defineProperty;
    objectGetOwnPropertyDescriptor.f = $getOwnPropertyDescriptor;
    objectGetOwnPropertyNames.f = objectGetOwnPropertyNamesExternal.f = $getOwnPropertyNames;
    objectGetOwnPropertySymbols.f = $getOwnPropertySymbols;

    if (descriptors) {
      // https://github.com/tc39/proposal-Symbol-description
      nativeDefineProperty$1($Symbol[PROTOTYPE$1], 'description', {
        configurable: true,
        get: function description() {
          return getInternalState$3(this).description;
        }
      });
    }

    wrappedWellKnownSymbol.f = function (name) {
      return wrap(wellKnownSymbol(name), name);
    };
  }

  _export({ global: true, wrap: true, forced: !nativeSymbol, sham: !nativeSymbol }, { Symbol: $Symbol });

  for (var wellKnownSymbols = objectKeys(WellKnownSymbolsStore), k = 0; wellKnownSymbols.length > k;) {
    defineWellKnownSymbol(wellKnownSymbols[k++]);
  }

  _export({ target: SYMBOL, stat: true, forced: !nativeSymbol }, {
    // `Symbol.for` method
    // https://tc39.github.io/ecma262/#sec-symbol.for
    'for': function (key) {
      return has(SymbolRegistry, key += '')
        ? SymbolRegistry[key]
        : SymbolRegistry[key] = $Symbol(key);
    },
    // `Symbol.keyFor` method
    // https://tc39.github.io/ecma262/#sec-symbol.keyfor
    keyFor: function keyFor(sym) {
      if (!isSymbol(sym)) throw TypeError(sym + ' is not a symbol');
      for (var key in SymbolRegistry) if (SymbolRegistry[key] === sym) return key;
    },
    useSetter: function () { USE_SETTER = true; },
    useSimple: function () { USE_SETTER = false; }
  });

  _export({ target: 'Object', stat: true, forced: !nativeSymbol, sham: !descriptors }, {
    // `Object.create` method
    // https://tc39.github.io/ecma262/#sec-object.create
    create: $create,
    // `Object.defineProperty` method
    // https://tc39.github.io/ecma262/#sec-object.defineproperty
    defineProperty: $defineProperty,
    // `Object.defineProperties` method
    // https://tc39.github.io/ecma262/#sec-object.defineproperties
    defineProperties: $defineProperties,
    // `Object.getOwnPropertyDescriptor` method
    // https://tc39.github.io/ecma262/#sec-object.getownpropertydescriptors
    getOwnPropertyDescriptor: $getOwnPropertyDescriptor
  });

  _export({ target: 'Object', stat: true, forced: !nativeSymbol }, {
    // `Object.getOwnPropertyNames` method
    // https://tc39.github.io/ecma262/#sec-object.getownpropertynames
    getOwnPropertyNames: $getOwnPropertyNames,
    // `Object.getOwnPropertySymbols` method
    // https://tc39.github.io/ecma262/#sec-object.getownpropertysymbols
    getOwnPropertySymbols: $getOwnPropertySymbols
  });

  // `JSON.stringify` method behavior with symbols
  // https://tc39.github.io/ecma262/#sec-json.stringify
  JSON && _export({ target: 'JSON', stat: true, forced: !nativeSymbol || fails(function () {
    var symbol = $Symbol();
    // MS Edge converts symbol values to JSON as {}
    return nativeJSONStringify([symbol]) != '[null]'
      // WebKit converts symbol values to JSON as null
      || nativeJSONStringify({ a: symbol }) != '{}'
      // V8 throws on boxed symbols
      || nativeJSONStringify(Object(symbol)) != '{}';
  }) }, {
    stringify: function stringify(it) {
      var args = [it];
      var i = 1;
      var replacer, $replacer;
      while (arguments.length > i) args.push(arguments[i++]);
      $replacer = replacer = args[1];
      if (!isObject(replacer) && it === undefined || isSymbol(it)) return; // IE8 returns string on undefined
      if (!isArray(replacer)) replacer = function (key, value) {
        if (typeof $replacer == 'function') value = $replacer.call(this, key, value);
        if (!isSymbol(value)) return value;
      };
      args[1] = replacer;
      return nativeJSONStringify.apply(JSON, args);
    }
  });

  // `Symbol.prototype[@@toPrimitive]` method
  // https://tc39.github.io/ecma262/#sec-symbol.prototype-@@toprimitive
  if (!$Symbol[PROTOTYPE$1][TO_PRIMITIVE]) hide($Symbol[PROTOTYPE$1], TO_PRIMITIVE, $Symbol[PROTOTYPE$1].valueOf);
  // `Symbol.prototype[@@toStringTag]` property
  // https://tc39.github.io/ecma262/#sec-symbol.prototype-@@tostringtag
  setToStringTag($Symbol, SYMBOL);

  hiddenKeys[HIDDEN] = true;

  // `Symbol.asyncIterator` well-known symbol
  // https://tc39.github.io/ecma262/#sec-symbol.asynciterator
  defineWellKnownSymbol('asyncIterator');

  // empty

  // `Symbol.hasInstance` well-known symbol
  // https://tc39.github.io/ecma262/#sec-symbol.hasinstance
  defineWellKnownSymbol('hasInstance');

  // `Symbol.isConcatSpreadable` well-known symbol
  // https://tc39.github.io/ecma262/#sec-symbol.isconcatspreadable
  defineWellKnownSymbol('isConcatSpreadable');

  // `Symbol.match` well-known symbol
  // https://tc39.github.io/ecma262/#sec-symbol.match
  defineWellKnownSymbol('match');

  // `Symbol.replace` well-known symbol
  // https://tc39.github.io/ecma262/#sec-symbol.replace
  defineWellKnownSymbol('replace');

  // `Symbol.search` well-known symbol
  // https://tc39.github.io/ecma262/#sec-symbol.search
  defineWellKnownSymbol('search');

  // `Symbol.species` well-known symbol
  // https://tc39.github.io/ecma262/#sec-symbol.species
  defineWellKnownSymbol('species');

  // `Symbol.split` well-known symbol
  // https://tc39.github.io/ecma262/#sec-symbol.split
  defineWellKnownSymbol('split');

  // `Symbol.toPrimitive` well-known symbol
  // https://tc39.github.io/ecma262/#sec-symbol.toprimitive
  defineWellKnownSymbol('toPrimitive');

  // `Symbol.toStringTag` well-known symbol
  // https://tc39.github.io/ecma262/#sec-symbol.tostringtag
  defineWellKnownSymbol('toStringTag');

  // `Symbol.unscopables` well-known symbol
  // https://tc39.github.io/ecma262/#sec-symbol.unscopables
  defineWellKnownSymbol('unscopables');

  // Math[@@toStringTag] property
  // https://tc39.github.io/ecma262/#sec-math-@@tostringtag
  setToStringTag(Math, 'Math', true);

  // JSON[@@toStringTag] property
  // https://tc39.github.io/ecma262/#sec-json-@@tostringtag
  setToStringTag(global$1.JSON, 'JSON', true);

  var symbol = path.Symbol;

  // `Symbol.patternMatch` well-known symbol
  // https://github.com/tc39/proposal-using-statement
  defineWellKnownSymbol('dispose');

  // https://github.com/tc39/proposal-observable
  defineWellKnownSymbol('observable');

  // `Symbol.patternMatch` well-known symbol
  // https://github.com/tc39/proposal-pattern-matching
  defineWellKnownSymbol('patternMatch');

  var symbol$1 = symbol;

  var symbol$2 = symbol$1;

  var _typeof_1 = createCommonjsModule(function (module) {
  function _typeof2(obj) { if (typeof symbol$2 === "function" && typeof iterator$2 === "symbol") { _typeof2 = function _typeof2(obj) { return typeof obj; }; } else { _typeof2 = function _typeof2(obj) { return obj && typeof symbol$2 === "function" && obj.constructor === symbol$2 && obj !== symbol$2.prototype ? "symbol" : typeof obj; }; } return _typeof2(obj); }

  function _typeof(obj) {
    if (typeof symbol$2 === "function" && _typeof2(iterator$2) === "symbol") {
      module.exports = _typeof = function _typeof(obj) {
        return _typeof2(obj);
      };
    } else {
      module.exports = _typeof = function _typeof(obj) {
        return obj && typeof symbol$2 === "function" && obj.constructor === symbol$2 && obj !== symbol$2.prototype ? "symbol" : _typeof2(obj);
      };
    }

    return _typeof(obj);
  }

  module.exports = _typeof;
  });

  function _assertThisInitialized(self) {
    if (self === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return self;
  }

  var assertThisInitialized = _assertThisInitialized;

  function _possibleConstructorReturn(self, call) {
    if (call && (_typeof_1(call) === "object" || typeof call === "function")) {
      return call;
    }

    return assertThisInitialized(self);
  }

  var possibleConstructorReturn = _possibleConstructorReturn;

  var FAILS_ON_PRIMITIVES = fails(function () { objectGetPrototypeOf(1); });

  // `Object.getPrototypeOf` method
  // https://tc39.github.io/ecma262/#sec-object.getprototypeof
  _export({
    target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES, sham: !correctPrototypeGetter
  }, {
    getPrototypeOf: function getPrototypeOf(it) {
      return objectGetPrototypeOf(toObject(it));
    }
  });

  var getPrototypeOf = path.Object.getPrototypeOf;

  var getPrototypeOf$1 = getPrototypeOf;

  var getPrototypeOf$2 = getPrototypeOf$1;

  // `Object.setPrototypeOf` method
  // https://tc39.github.io/ecma262/#sec-object.setprototypeof
  _export({ target: 'Object', stat: true }, {
    setPrototypeOf: objectSetPrototypeOf
  });

  var setPrototypeOf = path.Object.setPrototypeOf;

  var setPrototypeOf$1 = setPrototypeOf;

  var setPrototypeOf$2 = setPrototypeOf$1;

  var getPrototypeOf$3 = createCommonjsModule(function (module) {
  function _getPrototypeOf(o) {
    module.exports = _getPrototypeOf = setPrototypeOf$2 ? getPrototypeOf$2 : function _getPrototypeOf(o) {
      return o.__proto__ || getPrototypeOf$2(o);
    };
    return _getPrototypeOf(o);
  }

  module.exports = _getPrototypeOf;
  });

  // `Object.create` method
  // https://tc39.github.io/ecma262/#sec-object.create
  _export({
    target: 'Object', stat: true, sham: !descriptors
  }, { create: objectCreate });

  var Object$1 = path.Object;

  var create = function create(P, D) {
    return Object$1.create(P, D);
  };

  var create$1 = create;

  var create$2 = create$1;

  var setPrototypeOf$3 = createCommonjsModule(function (module) {
  function _setPrototypeOf(o, p) {
    module.exports = _setPrototypeOf = setPrototypeOf$2 || function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };

    return _setPrototypeOf(o, p);
  }

  module.exports = _setPrototypeOf;
  });

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function");
    }

    subClass.prototype = create$2(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        writable: true,
        configurable: true
      }
    });
    if (superClass) setPrototypeOf$3(subClass, superClass);
  }

  var inherits = _inherits;

  var freezing = !fails(function () {
    return Object.isExtensible(Object.preventExtensions({}));
  });

  var internalMetadata = createCommonjsModule(function (module) {
  var METADATA = uid('meta');



  var defineProperty = objectDefineProperty.f;
  var id = 0;

  var isExtensible = Object.isExtensible || function () {
    return true;
  };

  var setMetadata = function (it) {
    defineProperty(it, METADATA, { value: {
      objectID: 'O' + ++id, // object ID
      weakData: {}          // weak collections IDs
    } });
  };

  var fastKey = function (it, create) {
    // return a primitive with prefix
    if (!isObject(it)) return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
    if (!has(it, METADATA)) {
      // can't set metadata to uncaught frozen object
      if (!isExtensible(it)) return 'F';
      // not necessary to add metadata
      if (!create) return 'E';
      // add missing metadata
      setMetadata(it);
    // return object ID
    } return it[METADATA].objectID;
  };

  var getWeakData = function (it, create) {
    if (!has(it, METADATA)) {
      // can't set metadata to uncaught frozen object
      if (!isExtensible(it)) return true;
      // not necessary to add metadata
      if (!create) return false;
      // add missing metadata
      setMetadata(it);
    // return the store of weak collections IDs
    } return it[METADATA].weakData;
  };

  // add metadata on freeze-family methods calling
  var onFreeze = function (it) {
    if (freezing && meta.REQUIRED && isExtensible(it) && !has(it, METADATA)) setMetadata(it);
    return it;
  };

  var meta = module.exports = {
    REQUIRED: false,
    fastKey: fastKey,
    getWeakData: getWeakData,
    onFreeze: onFreeze
  };

  hiddenKeys[METADATA] = true;
  });
  var internalMetadata_1 = internalMetadata.REQUIRED;
  var internalMetadata_2 = internalMetadata.fastKey;
  var internalMetadata_3 = internalMetadata.getWeakData;
  var internalMetadata_4 = internalMetadata.onFreeze;

  var defineProperty$4 = objectDefineProperty.f;
  var each = arrayMethods(0);


  var setInternalState$4 = internalState.set;
  var internalStateGetterFor = internalState.getterFor;

  var collection = function (CONSTRUCTOR_NAME, wrapper, common, IS_MAP, IS_WEAK) {
    var NativeConstructor = global$1[CONSTRUCTOR_NAME];
    var NativePrototype = NativeConstructor && NativeConstructor.prototype;
    var ADDER = IS_MAP ? 'set' : 'add';
    var exported = {};
    var Constructor;

    if (!descriptors || typeof NativeConstructor != 'function'
      || !(IS_WEAK || NativePrototype.forEach && !fails(function () { new NativeConstructor().entries().next(); }))
    ) {
      // create collection constructor
      Constructor = common.getConstructor(wrapper, CONSTRUCTOR_NAME, IS_MAP, ADDER);
      internalMetadata.REQUIRED = true;
    } else {
      Constructor = wrapper(function (target, iterable) {
        setInternalState$4(anInstance(target, Constructor, CONSTRUCTOR_NAME), {
          type: CONSTRUCTOR_NAME,
          collection: new NativeConstructor()
        });
        if (iterable != undefined) iterate(iterable, target[ADDER], target, IS_MAP);
      });

      var getInternalState = internalStateGetterFor(CONSTRUCTOR_NAME);

      each(['add', 'clear', 'delete', 'forEach', 'get', 'has', 'set', 'keys', 'values', 'entries'], function (KEY) {
        var IS_ADDER = KEY == 'add' || KEY == 'set';
        if (KEY in NativePrototype && !(IS_WEAK && KEY == 'clear')) hide(Constructor.prototype, KEY, function (a, b) {
          var collection = getInternalState(this).collection;
          if (!IS_ADDER && IS_WEAK && !isObject(a)) return KEY == 'get' ? undefined : false;
          var result = collection[KEY](a === 0 ? 0 : a, b);
          return IS_ADDER ? this : result;
        });
      });

      IS_WEAK || defineProperty$4(Constructor.prototype, 'size', {
        get: function () {
          return getInternalState(this).collection.size;
        }
      });
    }

    setToStringTag(Constructor, CONSTRUCTOR_NAME, false, true);

    exported[CONSTRUCTOR_NAME] = Constructor;
    _export({ global: true, forced: true }, exported);

    if (!IS_WEAK) common.setStrong(Constructor, CONSTRUCTOR_NAME, IS_MAP);

    return Constructor;
  };

  var defineProperty$5 = objectDefineProperty.f;








  var fastKey = internalMetadata.fastKey;

  var setInternalState$5 = internalState.set;
  var internalStateGetterFor$1 = internalState.getterFor;

  var collectionStrong = {
    getConstructor: function (wrapper, CONSTRUCTOR_NAME, IS_MAP, ADDER) {
      var C = wrapper(function (that, iterable) {
        anInstance(that, C, CONSTRUCTOR_NAME);
        setInternalState$5(that, {
          type: CONSTRUCTOR_NAME,
          index: objectCreate(null),
          first: undefined,
          last: undefined,
          size: 0
        });
        if (!descriptors) that.size = 0;
        if (iterable != undefined) iterate(iterable, that[ADDER], that, IS_MAP);
      });

      var getInternalState = internalStateGetterFor$1(CONSTRUCTOR_NAME);

      var define = function (that, key, value) {
        var state = getInternalState(that);
        var entry = getEntry(that, key);
        var previous, index;
        // change existing entry
        if (entry) {
          entry.value = value;
        // create new entry
        } else {
          state.last = entry = {
            index: index = fastKey(key, true),
            key: key,
            value: value,
            previous: previous = state.last,
            next: undefined,
            removed: false
          };
          if (!state.first) state.first = entry;
          if (previous) previous.next = entry;
          if (descriptors) state.size++;
          else that.size++;
          // add to index
          if (index !== 'F') state.index[index] = entry;
        } return that;
      };

      var getEntry = function (that, key) {
        var state = getInternalState(that);
        // fast case
        var index = fastKey(key);
        var entry;
        if (index !== 'F') return state.index[index];
        // frozen object case
        for (entry = state.first; entry; entry = entry.next) {
          if (entry.key == key) return entry;
        }
      };

      redefineAll(C.prototype, {
        // 23.1.3.1 Map.prototype.clear()
        // 23.2.3.2 Set.prototype.clear()
        clear: function clear() {
          var that = this;
          var state = getInternalState(that);
          var data = state.index;
          var entry = state.first;
          while (entry) {
            entry.removed = true;
            if (entry.previous) entry.previous = entry.previous.next = undefined;
            delete data[entry.index];
            entry = entry.next;
          }
          state.first = state.last = undefined;
          if (descriptors) state.size = 0;
          else that.size = 0;
        },
        // 23.1.3.3 Map.prototype.delete(key)
        // 23.2.3.4 Set.prototype.delete(value)
        'delete': function (key) {
          var that = this;
          var state = getInternalState(that);
          var entry = getEntry(that, key);
          if (entry) {
            var next = entry.next;
            var prev = entry.previous;
            delete state.index[entry.index];
            entry.removed = true;
            if (prev) prev.next = next;
            if (next) next.previous = prev;
            if (state.first == entry) state.first = next;
            if (state.last == entry) state.last = prev;
            if (descriptors) state.size--;
            else that.size--;
          } return !!entry;
        },
        // 23.2.3.6 Set.prototype.forEach(callbackfn, thisArg = undefined)
        // 23.1.3.5 Map.prototype.forEach(callbackfn, thisArg = undefined)
        forEach: function forEach(callbackfn /* , that = undefined */) {
          var state = getInternalState(this);
          var boundFunction = bindContext(callbackfn, arguments.length > 1 ? arguments[1] : undefined, 3);
          var entry;
          while (entry = entry ? entry.next : state.first) {
            boundFunction(entry.value, entry.key, this);
            // revert to the last existing entry
            while (entry && entry.removed) entry = entry.previous;
          }
        },
        // 23.1.3.7 Map.prototype.has(key)
        // 23.2.3.7 Set.prototype.has(value)
        has: function has(key) {
          return !!getEntry(this, key);
        }
      });

      redefineAll(C.prototype, IS_MAP ? {
        // 23.1.3.6 Map.prototype.get(key)
        get: function get(key) {
          var entry = getEntry(this, key);
          return entry && entry.value;
        },
        // 23.1.3.9 Map.prototype.set(key, value)
        set: function set(key, value) {
          return define(this, key === 0 ? 0 : key, value);
        }
      } : {
        // 23.2.3.1 Set.prototype.add(value)
        add: function add(value) {
          return define(this, value = value === 0 ? 0 : value, value);
        }
      });
      if (descriptors) defineProperty$5(C.prototype, 'size', {
        get: function () {
          return getInternalState(this).size;
        }
      });
      return C;
    },
    setStrong: function (C, CONSTRUCTOR_NAME, IS_MAP) {
      var ITERATOR_NAME = CONSTRUCTOR_NAME + ' Iterator';
      var getInternalCollectionState = internalStateGetterFor$1(CONSTRUCTOR_NAME);
      var getInternalIteratorState = internalStateGetterFor$1(ITERATOR_NAME);
      // add .keys, .values, .entries, [@@iterator]
      // 23.1.3.4, 23.1.3.8, 23.1.3.11, 23.1.3.12, 23.2.3.5, 23.2.3.8, 23.2.3.10, 23.2.3.11
      defineIterator(C, CONSTRUCTOR_NAME, function (iterated, kind) {
        setInternalState$5(this, {
          type: ITERATOR_NAME,
          target: iterated,
          state: getInternalCollectionState(iterated),
          kind: kind,
          last: undefined
        });
      }, function () {
        var state = getInternalIteratorState(this);
        var kind = state.kind;
        var entry = state.last;
        // revert to the last existing entry
        while (entry && entry.removed) entry = entry.previous;
        // get next entry
        if (!state.target || !(state.last = entry = entry ? entry.next : state.state.first)) {
          // or finish the iteration
          state.target = undefined;
          return { value: undefined, done: true };
        }
        // return step by kind
        if (kind == 'keys') return { value: entry.key, done: false };
        if (kind == 'values') return { value: entry.value, done: false };
        return { value: [entry.key, entry.value], done: false };
      }, IS_MAP ? 'entries' : 'values', !IS_MAP, true);

      // add [@@species], 23.1.2.2, 23.2.2.2
      setSpecies(CONSTRUCTOR_NAME);
    }
  };

  // `Map` constructor
  // https://tc39.github.io/ecma262/#sec-map-objects
  var es_map = collection('Map', function (get) {
    return function Map() { return get(this, arguments.length > 0 ? arguments[0] : undefined); };
  }, collectionStrong, true);

  var map$3 = path.Map;

  // https://tc39.github.io/proposal-setmap-offrom/




  var collectionFrom = function from(source /* , mapFn, thisArg */) {
    var mapFn = arguments[1];
    var mapping, A, n, boundFunction;
    aFunction(this);
    mapping = mapFn !== undefined;
    if (mapping) aFunction(mapFn);
    if (source == undefined) return new this();
    A = [];
    if (mapping) {
      n = 0;
      boundFunction = bindContext(mapFn, arguments[2], 2);
      iterate(source, function (nextItem) {
        A.push(boundFunction(nextItem, n++));
      });
    } else {
      iterate(source, A.push, A);
    }
    return new this(A);
  };

  // `Map.from` method
  // https://tc39.github.io/proposal-setmap-offrom/#sec-map.from
  _export({ target: 'Map', stat: true }, {
    from: collectionFrom
  });

  // https://tc39.github.io/proposal-setmap-offrom/
  var collectionOf = function of() {
    var length = arguments.length;
    var A = new Array(length);
    while (length--) A[length] = arguments[length];
    return new this(A);
  };

  // `Map.of` method
  // https://tc39.github.io/proposal-setmap-offrom/#sec-map.of
  _export({ target: 'Map', stat: true }, {
    of: collectionOf
  });

  // https://github.com/tc39/collection-methods
  var collectionDeleteAll = function (/* ...elements */) {
    var collection = anObject(this);
    var remover = aFunction(collection['delete']);
    var allDeleted = true;
    for (var k = 0, len = arguments.length; k < len; k++) {
      allDeleted = allDeleted && remover.call(collection, arguments[k]);
    }
    return !!allDeleted;
  };

  // `Map.prototype.deleteAll` method
  // https://github.com/tc39/proposal-collection-methods
  _export({
    target: 'Map', proto: true, real: true, forced: isPure
  }, {
    deleteAll: function deleteAll(/* ...elements */) {
      return collectionDeleteAll.apply(this, arguments);
    }
  });

  var getIterator = function (it) {
    var iteratorMethod = getIteratorMethod(it);
    if (typeof iteratorMethod != 'function') {
      throw TypeError(String(it) + ' is not iterable');
    } return anObject(iteratorMethod.call(it));
  };

  var getMapIterator = getIterator;

  // `Map.prototype.every` method
  // https://github.com/tc39/proposal-collection-methods
  _export({ target: 'Map', proto: true, real: true, forced: isPure }, {
    every: function every(callbackfn /* , thisArg */) {
      var map = anObject(this);
      var iterator = getMapIterator(map);
      var boundFunction = bindContext(callbackfn, arguments.length > 1 ? arguments[1] : undefined, 3);
      var step, entry;
      while (!(step = iterator.next()).done) {
        entry = step.value;
        if (!boundFunction(entry[1], entry[0], map)) return false;
      } return true;
    }
  });

  // `Map.prototype.filter` method
  // https://github.com/tc39/proposal-collection-methods
  _export({ target: 'Map', proto: true, real: true, forced: isPure }, {
    filter: function filter(callbackfn /* , thisArg */) {
      var map = anObject(this);
      var iterator = getMapIterator(map);
      var boundFunction = bindContext(callbackfn, arguments.length > 1 ? arguments[1] : undefined, 3);
      var newMap = new (speciesConstructor(map, getBuiltIn('Map')))();
      var setter = aFunction(newMap.set);
      var step, entry, key, value;
      while (!(step = iterator.next()).done) {
        entry = step.value;
        if (boundFunction(value = entry[1], key = entry[0], map)) setter.call(newMap, key, value);
      }
      return newMap;
    }
  });

  // `Map.prototype.find` method
  // https://github.com/tc39/proposal-collection-methods
  _export({ target: 'Map', proto: true, real: true, forced: isPure }, {
    find: function find(callbackfn /* , thisArg */) {
      var map = anObject(this);
      var iterator = getMapIterator(map);
      var boundFunction = bindContext(callbackfn, arguments.length > 1 ? arguments[1] : undefined, 3);
      var step, entry, value;
      while (!(step = iterator.next()).done) {
        entry = step.value;
        if (boundFunction(value = entry[1], entry[0], map)) return value;
      }
    }
  });

  // `Map.prototype.findKey` method
  // https://github.com/tc39/proposal-collection-methods
  _export({ target: 'Map', proto: true, real: true, forced: isPure }, {
    findKey: function findKey(callbackfn /* , thisArg */) {
      var map = anObject(this);
      var iterator = getMapIterator(map);
      var boundFunction = bindContext(callbackfn, arguments.length > 1 ? arguments[1] : undefined, 3);
      var step, entry, key;
      while (!(step = iterator.next()).done) {
        entry = step.value;
        if (boundFunction(entry[1], key = entry[0], map)) return key;
      }
    }
  });

  // `Map.groupBy` method
  // https://github.com/tc39/proposal-collection-methods
  _export({ target: 'Map', stat: true, forced: isPure }, {
    groupBy: function groupBy(iterable, keyDerivative) {
      var newMap = new this();
      aFunction(keyDerivative);
      var has = aFunction(newMap.has);
      var get = aFunction(newMap.get);
      var set = aFunction(newMap.set);
      iterate(iterable, function (element) {
        var derivedKey = keyDerivative(element);
        if (!has.call(newMap, derivedKey)) set.call(newMap, derivedKey, [element]);
        else get.call(newMap, derivedKey).push(element);
      });
      return newMap;
    }
  });

  // `SameValueZero` abstract operation
  // https://tc39.github.io/ecma262/#sec-samevaluezero
  var sameValueZero = function (x, y) {
    // eslint-disable-next-line no-self-compare
    return x === y || x != x && y != y;
  };

  // `Map.prototype.includes` method
  // https://github.com/tc39/proposal-collection-methods
  _export({ target: 'Map', proto: true, real: true, forced: isPure }, {
    includes: function includes(searchElement) {
      var map = anObject(this);
      var iterator = getMapIterator(map);
      var step;
      while (!(step = iterator.next()).done) {
        if (sameValueZero(step.value[1], searchElement)) return true;
      }
      return false;
    }
  });

  // `Map.keyBy` method
  // https://github.com/tc39/proposal-collection-methods
  _export({ target: 'Map', stat: true, forced: isPure }, {
    keyBy: function keyBy(iterable, keyDerivative) {
      var newMap = new this();
      aFunction(keyDerivative);
      var setter = aFunction(newMap.set);
      iterate(iterable, function (element) {
        setter.call(newMap, keyDerivative(element), element);
      });
      return newMap;
    }
  });

  // `Map.prototype.includes` method
  // https://github.com/tc39/proposal-collection-methods
  _export({ target: 'Map', proto: true, real: true, forced: isPure }, {
    keyOf: function keyOf(searchElement) {
      var map = anObject(this);
      var iterator = getMapIterator(map);
      var step, entry;
      while (!(step = iterator.next()).done) {
        entry = step.value;
        if (entry[1] === searchElement) return entry[0];
      }
    }
  });

  // `Map.prototype.mapKeys` method
  // https://github.com/tc39/proposal-collection-methods
  _export({ target: 'Map', proto: true, real: true, forced: isPure }, {
    mapKeys: function mapKeys(callbackfn /* , thisArg */) {
      var map = anObject(this);
      var iterator = getMapIterator(map);
      var boundFunction = bindContext(callbackfn, arguments.length > 1 ? arguments[1] : undefined, 3);
      var newMap = new (speciesConstructor(map, getBuiltIn('Map')))();
      var setter = aFunction(newMap.set);
      var step, entry, value;
      while (!(step = iterator.next()).done) {
        entry = step.value;
        setter.call(newMap, boundFunction(value = entry[1], entry[0], map), value);
      }
      return newMap;
    }
  });

  // `Map.prototype.mapValues` method
  // https://github.com/tc39/proposal-collection-methods
  _export({ target: 'Map', proto: true, real: true, forced: isPure }, {
    mapValues: function mapValues(callbackfn /* , thisArg */) {
      var map = anObject(this);
      var iterator = getMapIterator(map);
      var boundFunction = bindContext(callbackfn, arguments.length > 1 ? arguments[1] : undefined, 3);
      var newMap = new (speciesConstructor(map, getBuiltIn('Map')))();
      var setter = aFunction(newMap.set);
      var step, entry, key;
      while (!(step = iterator.next()).done) {
        entry = step.value;
        setter.call(newMap, key = entry[0], boundFunction(entry[1], key, map));
      }
      return newMap;
    }
  });

  // `Map.prototype.merge` method
  // https://github.com/tc39/proposal-collection-methods
  _export({ target: 'Map', proto: true, real: true, forced: isPure }, {
    // eslint-disable-next-line no-unused-vars
    merge: function merge(iterable /* ...iterbles */) {
      var map = anObject(this);
      var setter = aFunction(map.set);
      var i = 0;
      while (i < arguments.length) {
        iterate(arguments[i++], setter, map, true);
      }
      return map;
    }
  });

  // `Map.prototype.reduce` method
  // https://github.com/tc39/proposal-collection-methods
  _export({ target: 'Map', proto: true, real: true, forced: isPure }, {
    reduce: function reduce(callbackfn /* , initialValue */) {
      var map = anObject(this);
      var iterator = getMapIterator(map);
      var accumulator, step, entry;
      aFunction(callbackfn);
      if (arguments.length > 1) accumulator = arguments[1];
      else {
        step = iterator.next();
        if (step.done) throw TypeError('Reduce of empty map with no initial value');
        accumulator = step.value[1];
      }
      while (!(step = iterator.next()).done) {
        entry = step.value;
        accumulator = callbackfn(accumulator, entry[1], entry[0], map);
      }
      return accumulator;
    }
  });

  // `Set.prototype.some` method
  // https://github.com/tc39/proposal-collection-methods
  _export({ target: 'Map', proto: true, real: true, forced: isPure }, {
    some: function some(callbackfn /* , thisArg */) {
      var map = anObject(this);
      var iterator = getMapIterator(map);
      var boundFunction = bindContext(callbackfn, arguments.length > 1 ? arguments[1] : undefined, 3);
      var step, entry;
      while (!(step = iterator.next()).done) {
        entry = step.value;
        if (boundFunction(entry[1], entry[0], map)) return true;
      } return false;
    }
  });

  // `Set.prototype.update` method
  // https://github.com/tc39/proposal-collection-methods
  _export({ target: 'Map', proto: true, real: true, forced: isPure }, {
    update: function update(key, callback /* , thunk */) {
      var map = anObject(this);
      aFunction(callback);
      var isPresentInMap = map.has(key);
      if (!isPresentInMap && arguments.length < 3) {
        throw TypeError('Updating absent value');
      }
      var value = isPresentInMap ? map.get(key) : aFunction(arguments[2])(key, map);
      map.set(key, callback(value, key, map));
      return map;
    }
  });

  var map$4 = map$3;

  var map$5 = map$4;

  var indexOf$3 = indexOf_1;

  var indexOf$4 = indexOf$3;

  function _isNativeFunction(fn) {
    var _context;

    return indexOf$4(_context = Function.toString.call(fn)).call(_context, "[native code]") !== -1;
  }

  var isNativeFunction = _isNativeFunction;

  var bind$4 = bind_1;

  var bind$5 = bind$4;

  var nativeConstruct = (global$1.Reflect || {}).construct;

  // `Reflect.construct` method
  // https://tc39.github.io/ecma262/#sec-reflect.construct
  // MS Edge supports only 2 arguments and argumentsList argument is optional
  // FF Nightly sets third argument as `new.target`, but does not create `this` from it
  var NEW_TARGET_BUG = fails(function () {
    function F() { /* empty */ }
    return !(nativeConstruct(function () { /* empty */ }, [], F) instanceof F);
  });
  var ARGS_BUG = !fails(function () {
    nativeConstruct(function () { /* empty */ });
  });
  var FORCED$2 = NEW_TARGET_BUG || ARGS_BUG;

  _export({ target: 'Reflect', stat: true, forced: FORCED$2, sham: FORCED$2 }, {
    construct: function construct(Target, args /* , newTarget */) {
      aFunction(Target);
      anObject(args);
      var newTarget = arguments.length < 3 ? Target : aFunction(arguments[2]);
      if (ARGS_BUG && !NEW_TARGET_BUG) return nativeConstruct(Target, args, newTarget);
      if (Target == newTarget) {
        // w/o altered newTarget, optimization for 0-4 arguments
        switch (args.length) {
          case 0: return new Target();
          case 1: return new Target(args[0]);
          case 2: return new Target(args[0], args[1]);
          case 3: return new Target(args[0], args[1], args[2]);
          case 4: return new Target(args[0], args[1], args[2], args[3]);
        }
        // w/o altered newTarget, lot of arguments case
        var $args = [null];
        $args.push.apply($args, args);
        return new (functionBind.apply(Target, $args))();
      }
      // with altered newTarget, not support built-in constructors
      var proto = newTarget.prototype;
      var instance = objectCreate(isObject(proto) ? proto : Object.prototype);
      var result = Function.apply.call(Target, instance, args);
      return isObject(result) ? result : instance;
    }
  });

  var construct$1 = path.Reflect.construct;

  var construct$2 = construct$1;

  var construct$3 = construct$2;

  var construct$4 = createCommonjsModule(function (module) {
  function isNativeReflectConstruct() {
    if (typeof Reflect === "undefined" || !construct$3) return false;
    if (construct$3.sham) return false;
    if (typeof Proxy === "function") return true;

    try {
      Date.prototype.toString.call(construct$3(Date, [], function () {}));
      return true;
    } catch (e) {
      return false;
    }
  }

  function _construct(Parent, args, Class) {
    if (isNativeReflectConstruct()) {
      module.exports = _construct = construct$3;
    } else {
      module.exports = _construct = function _construct(Parent, args, Class) {
        var a = [null];
        a.push.apply(a, args);

        var Constructor = bind$5(Function).apply(Parent, a);

        var instance = new Constructor();
        if (Class) setPrototypeOf$3(instance, Class.prototype);
        return instance;
      };
    }

    return _construct.apply(null, arguments);
  }

  module.exports = _construct;
  });

  var wrapNativeSuper = createCommonjsModule(function (module) {
  function _wrapNativeSuper(Class) {
    var _cache = typeof map$5 === "function" ? new map$5() : undefined;

    module.exports = _wrapNativeSuper = function _wrapNativeSuper(Class) {
      if (Class === null || !isNativeFunction(Class)) return Class;

      if (typeof Class !== "function") {
        throw new TypeError("Super expression must either be null or a function");
      }

      if (typeof _cache !== "undefined") {
        if (_cache.has(Class)) return _cache.get(Class);

        _cache.set(Class, Wrapper);
      }

      function Wrapper() {
        return construct$4(Class, arguments, getPrototypeOf$3(this).constructor);
      }

      Wrapper.prototype = create$2(Class.prototype, {
        constructor: {
          value: Wrapper,
          enumerable: false,
          writable: true,
          configurable: true
        }
      });
      return setPrototypeOf$3(Wrapper, Class);
    };

    return _wrapNativeSuper(Class);
  }

  module.exports = _wrapNativeSuper;
  });

  /**
  @license @nocompile
  Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
  This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
  The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
  The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
  Code distributed by Google as part of the polymer project is also
  subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
  */
  (function(){/*

   Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
   This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
   The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
   The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
   Code distributed by Google as part of the polymer project is also
   subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
  */
  var r,t="undefined"!=typeof window&&window===this?this:"undefined"!=typeof commonjsGlobal&&null!=commonjsGlobal?commonjsGlobal:this,ca="function"==typeof Object.defineProperties?Object.defineProperty:function(a,b,c){a!=Array.prototype&&a!=Object.prototype&&(a[b]=c.value);};function da(){da=function(){};t.Symbol||(t.Symbol=ea);}var ea=function(){var a=0;return function(b){return "jscomp_symbol_"+(b||"")+a++}}();
  function fa(){da();var a=t.Symbol.iterator;a||(a=t.Symbol.iterator=t.Symbol("iterator"));"function"!=typeof Array.prototype[a]&&ca(Array.prototype,a,{configurable:!0,writable:!0,value:function(){return ha(this)}});fa=function(){};}function ha(a){var b=0;return ia(function(){return b<a.length?{done:!1,value:a[b++]}:{done:!0}})}function ia(a){fa();a={next:a};a[t.Symbol.iterator]=function(){return this};return a}function ja(a){fa();var b=a[Symbol.iterator];return b?b.call(a):ha(a)}
  function ka(a){for(var b,c=[];!(b=a.next()).done;)c.push(b.value);return c}var la;if("function"==typeof Object.setPrototypeOf)la=Object.setPrototypeOf;else{var ma;a:{var na={Ga:!0},oa={};try{oa.__proto__=na;ma=oa.Ga;break a}catch(a){}ma=!1;}la=ma?function(a,b){a.__proto__=b;if(a.__proto__!==b)throw new TypeError(a+" is not extensible");return a}:null;}var pa=la;function qa(){this.f=!1;this.b=null;this.aa=void 0;this.a=1;this.F=0;this.c=null;}
  function ra(a){if(a.f)throw new TypeError("Generator is already running");a.f=!0;}qa.prototype.u=function(a){this.aa=a;};function sa(a,b){a.c={Ja:b,Na:!0};a.a=a.F;}qa.prototype.return=function(a){this.c={return:a};this.a=this.F;};function ta(a,b){a.a=3;return {value:b}}function ua(a){this.a=new qa;this.b=a;}function va(a,b){ra(a.a);var c=a.a.b;if(c)return wa(a,"return"in c?c["return"]:function(a){return {value:a,done:!0}},b,a.a.return);a.a.return(b);return xa(a)}
  function wa(a,b,c,d){try{var e=b.call(a.a.b,c);if(!(e instanceof Object))throw new TypeError("Iterator result "+e+" is not an object");if(!e.done)return a.a.f=!1,e;var f=e.value;}catch(g){return a.a.b=null,sa(a.a,g),xa(a)}a.a.b=null;d.call(a.a,f);return xa(a)}function xa(a){for(;a.a.a;)try{var b=a.b(a.a);if(b)return a.a.f=!1,{value:b.value,done:!1}}catch(c){a.a.aa=void 0,sa(a.a,c);}a.a.f=!1;if(a.a.c){b=a.a.c;a.a.c=null;if(b.Na)throw b.Ja;return {value:b.return,done:!0}}return {value:void 0,done:!0}}
  function ya(a){this.next=function(b){ra(a.a);a.a.b?b=wa(a,a.a.b.next,b,a.a.u):(a.a.u(b),b=xa(a));return b};this.throw=function(b){ra(a.a);a.a.b?b=wa(a,a.a.b["throw"],b,a.a.u):(sa(a.a,b),b=xa(a));return b};this.return=function(b){return va(a,b)};fa();this[Symbol.iterator]=function(){return this};}function Ba(a,b){b=new ya(new ua(b));pa&&pa(b,a.prototype);return b}
  (function(){if(!function(){var a=document.createEvent("Event");a.initEvent("foo",!0,!0);a.preventDefault();return a.defaultPrevented}()){var a=Event.prototype.preventDefault;Event.prototype.preventDefault=function(){this.cancelable&&(a.call(this),Object.defineProperty(this,"defaultPrevented",{get:function(){return !0},configurable:!0}));};}var b=/Trident/.test(navigator.userAgent);if(!window.Event||b&&"function"!==typeof window.Event){var c=window.Event;window.Event=function(a,b){b=b||{};var c=document.createEvent("Event");
  c.initEvent(a,!!b.bubbles,!!b.cancelable);return c};if(c){for(var d in c)window.Event[d]=c[d];window.Event.prototype=c.prototype;}}if(!window.CustomEvent||b&&"function"!==typeof window.CustomEvent)window.CustomEvent=function(a,b){b=b||{};var c=document.createEvent("CustomEvent");c.initCustomEvent(a,!!b.bubbles,!!b.cancelable,b.detail);return c},window.CustomEvent.prototype=window.Event.prototype;if(!window.MouseEvent||b&&"function"!==typeof window.MouseEvent){b=window.MouseEvent;window.MouseEvent=
  function(a,b){b=b||{};var c=document.createEvent("MouseEvent");c.initMouseEvent(a,!!b.bubbles,!!b.cancelable,b.view||window,b.detail,b.screenX,b.screenY,b.clientX,b.clientY,b.ctrlKey,b.altKey,b.shiftKey,b.metaKey,b.button,b.relatedTarget);return c};if(b)for(d in b)window.MouseEvent[d]=b[d];window.MouseEvent.prototype=b.prototype;}Array.from||(Array.from=function(a){return [].slice.call(a)});Object.assign||(Object.assign=function(a,b){for(var c=[].slice.call(arguments,1),d=0,e;d<c.length;d++)if(e=c[d])for(var f=
  a,n=e,q=Object.getOwnPropertyNames(n),I=0;I<q.length;I++)e=q[I],f[e]=n[e];return a});})();(function(){function a(){}function b(a,b){if(!a.childNodes.length)return [];switch(a.nodeType){case Node.DOCUMENT_NODE:return Q.call(a,b);case Node.DOCUMENT_FRAGMENT_NODE:return Eb.call(a,b);default:return x.call(a,b)}}var c="undefined"===typeof HTMLTemplateElement,d=!(document.createDocumentFragment().cloneNode()instanceof DocumentFragment),e=!1;/Trident/.test(navigator.userAgent)&&function(){function a(a,b){if(a instanceof DocumentFragment)for(var d;d=a.firstChild;)c.call(this,d,b);else c.call(this,
  a,b);return a}e=!0;var b=Node.prototype.cloneNode;Node.prototype.cloneNode=function(a){a=b.call(this,a);this instanceof DocumentFragment&&(a.__proto__=DocumentFragment.prototype);return a};DocumentFragment.prototype.querySelectorAll=HTMLElement.prototype.querySelectorAll;DocumentFragment.prototype.querySelector=HTMLElement.prototype.querySelector;Object.defineProperties(DocumentFragment.prototype,{nodeType:{get:function(){return Node.DOCUMENT_FRAGMENT_NODE},configurable:!0},localName:{get:function(){},
  configurable:!0},nodeName:{get:function(){return "#document-fragment"},configurable:!0}});var c=Node.prototype.insertBefore;Node.prototype.insertBefore=a;var d=Node.prototype.appendChild;Node.prototype.appendChild=function(b){b instanceof DocumentFragment?a.call(this,b,null):d.call(this,b);return b};var f=Node.prototype.removeChild,g=Node.prototype.replaceChild;Node.prototype.replaceChild=function(b,c){b instanceof DocumentFragment?(a.call(this,b,c),f.call(this,c)):g.call(this,b,c);return c};Document.prototype.createDocumentFragment=
  function(){var a=this.createElement("df");a.__proto__=DocumentFragment.prototype;return a};var h=Document.prototype.importNode;Document.prototype.importNode=function(a,b){b=h.call(this,a,b||!1);a instanceof DocumentFragment&&(b.__proto__=DocumentFragment.prototype);return b};}();var f=Node.prototype.cloneNode,g=Document.prototype.createElement,h=Document.prototype.importNode,k=Node.prototype.removeChild,l=Node.prototype.appendChild,n=Node.prototype.replaceChild,q=DOMParser.prototype.parseFromString,
  I=Object.getOwnPropertyDescriptor(window.HTMLElement.prototype,"innerHTML")||{get:function(){return this.innerHTML},set:function(a){this.innerHTML=a;}},v=Object.getOwnPropertyDescriptor(window.Node.prototype,"childNodes")||{get:function(){return this.childNodes}},x=Element.prototype.querySelectorAll,Q=Document.prototype.querySelectorAll,Eb=DocumentFragment.prototype.querySelectorAll,Fb=function(){if(!c){var a=document.createElement("template"),b=document.createElement("template");b.content.appendChild(document.createElement("div"));
  a.content.appendChild(b);a=a.cloneNode(!0);return 0===a.content.childNodes.length||0===a.content.firstChild.content.childNodes.length||d}}();if(c){var T=document.implementation.createHTMLDocument("template"),Ja=!0,p=document.createElement("style");p.textContent="template{display:none;}";var za=document.head;za.insertBefore(p,za.firstElementChild);a.prototype=Object.create(HTMLElement.prototype);var aa=!document.createElement("div").hasOwnProperty("innerHTML");a.S=function(b){if(!b.content&&b.namespaceURI===
  document.documentElement.namespaceURI){b.content=T.createDocumentFragment();for(var c;c=b.firstChild;)l.call(b.content,c);if(aa)b.__proto__=a.prototype;else if(b.cloneNode=function(b){return a.b(this,b)},Ja)try{m(b),y(b);}catch(vh){Ja=!1;}a.a(b.content);}};var X={option:["select"],thead:["table"],col:["colgroup","table"],tr:["tbody","table"],th:["tr","tbody","table"],td:["tr","tbody","table"]},m=function(b){Object.defineProperty(b,"innerHTML",{get:function(){return ba(this)},set:function(b){var c=X[(/<([a-z][^/\0>\x20\t\r\n\f]+)/i.exec(b)||
  ["",""])[1].toLowerCase()];if(c)for(var d=0;d<c.length;d++)b="<"+c[d]+">"+b+"</"+c[d]+">";T.body.innerHTML=b;for(a.a(T);this.content.firstChild;)k.call(this.content,this.content.firstChild);b=T.body;if(c)for(d=0;d<c.length;d++)b=b.lastChild;for(;b.firstChild;)l.call(this.content,b.firstChild);},configurable:!0});},y=function(a){Object.defineProperty(a,"outerHTML",{get:function(){return "<template>"+this.innerHTML+"</template>"},set:function(a){if(this.parentNode){T.body.innerHTML=a;for(a=this.ownerDocument.createDocumentFragment();T.body.firstChild;)l.call(a,
  T.body.firstChild);n.call(this.parentNode,a,this);}else throw Error("Failed to set the 'outerHTML' property on 'Element': This element has no parent node.");},configurable:!0});};m(a.prototype);y(a.prototype);a.a=function(c){c=b(c,"template");for(var d=0,e=c.length,f;d<e&&(f=c[d]);d++)a.S(f);};document.addEventListener("DOMContentLoaded",function(){a.a(document);});Document.prototype.createElement=function(){var b=g.apply(this,arguments);"template"===b.localName&&a.S(b);return b};DOMParser.prototype.parseFromString=
  function(){var b=q.apply(this,arguments);a.a(b);return b};Object.defineProperty(HTMLElement.prototype,"innerHTML",{get:function(){return ba(this)},set:function(b){I.set.call(this,b);a.a(this);},configurable:!0,enumerable:!0});var Y=/[&\u00A0"]/g,Gb=/[&\u00A0<>]/g,Ka=function(a){switch(a){case "&":return "&amp;";case "<":return "&lt;";case ">":return "&gt;";case '"':return "&quot;";case "\u00a0":return "&nbsp;"}};p=function(a){for(var b={},c=0;c<a.length;c++)b[a[c]]=!0;return b};var Aa=p("area base br col command embed hr img input keygen link meta param source track wbr".split(" ")),
  La=p("style script xmp iframe noembed noframes plaintext noscript".split(" ")),ba=function(a,b){"template"===a.localName&&(a=a.content);for(var c="",d=b?b(a):v.get.call(a),e=0,f=d.length,g;e<f&&(g=d[e]);e++){a:{var h=g;var k=a;var l=b;switch(h.nodeType){case Node.ELEMENT_NODE:for(var n=h.localName,m="<"+n,q=h.attributes,x=0;k=q[x];x++)m+=" "+k.name+'="'+k.value.replace(Y,Ka)+'"';m+=">";h=Aa[n]?m:m+ba(h,l)+"</"+n+">";break a;case Node.TEXT_NODE:h=h.data;h=k&&La[k.localName]?h:h.replace(Gb,Ka);break a;
  case Node.COMMENT_NODE:h="\x3c!--"+h.data+"--\x3e";break a;default:throw window.console.error(h),Error("not implemented");}}c+=h;}return c};}if(c||Fb){a.b=function(a,b){var c=f.call(a,!1);this.S&&this.S(c);b&&(l.call(c.content,f.call(a.content,!0)),Ma(c.content,a.content));return c};var Ma=function(c,d){if(d.querySelectorAll&&(d=b(d,"template"),0!==d.length)){c=b(c,"template");for(var e=0,f=c.length,g,h;e<f;e++)h=d[e],g=c[e],a&&a.S&&a.S(h),n.call(g.parentNode,sf.call(h,!0),g);}},sf=Node.prototype.cloneNode=
  function(b){if(!e&&d&&this instanceof DocumentFragment)if(b)var c=tf.call(this.ownerDocument,this,!0);else return this.ownerDocument.createDocumentFragment();else this.nodeType===Node.ELEMENT_NODE&&"template"===this.localName&&this.namespaceURI==document.documentElement.namespaceURI?c=a.b(this,b):c=f.call(this,b);b&&Ma(c,this);return c},tf=Document.prototype.importNode=function(c,d){d=d||!1;if("template"===c.localName)return a.b(c,d);var e=h.call(this,c,d);if(d){Ma(e,c);c=b(e,'script:not([type]),script[type="application/javascript"],script[type="text/javascript"]');
  for(var f,k=0;k<c.length;k++){f=c[k];d=g.call(document,"script");d.textContent=f.textContent;for(var l=f.attributes,m=0,q;m<l.length;m++)q=l[m],d.setAttribute(q.name,q.value);n.call(f.parentNode,d,f);}}return e};}c&&(window.HTMLTemplateElement=a);})();var Ca=setTimeout;function Da(){}function Ea(a,b){return function(){a.apply(b,arguments);}}function u(a){if(!(this instanceof u))throw new TypeError("Promises must be constructed via new");if("function"!==typeof a)throw new TypeError("not a function");this.I=0;this.oa=!1;this.w=void 0;this.U=[];Fa(a,this);}
  function Ga(a,b){for(;3===a.I;)a=a.w;0===a.I?a.U.push(b):(a.oa=!0,Ha(function(){var c=1===a.I?b.Pa:b.Qa;if(null===c)(1===a.I?Ia:Na)(b.ma,a.w);else{try{var d=c(a.w);}catch(e){Na(b.ma,e);return}Ia(b.ma,d);}}));}function Ia(a,b){try{if(b===a)throw new TypeError("A promise cannot be resolved with itself.");if(b&&("object"===typeof b||"function"===typeof b)){var c=b.then;if(b instanceof u){a.I=3;a.w=b;Oa(a);return}if("function"===typeof c){Fa(Ea(c,b),a);return}}a.I=1;a.w=b;Oa(a);}catch(d){Na(a,d);}}
  function Na(a,b){a.I=2;a.w=b;Oa(a);}function Oa(a){2===a.I&&0===a.U.length&&Ha(function(){a.oa||"undefined"!==typeof console&&console&&console.warn("Possible Unhandled Promise Rejection:",a.w);});for(var b=0,c=a.U.length;b<c;b++)Ga(a,a.U[b]);a.U=null;}function Pa(a,b,c){this.Pa="function"===typeof a?a:null;this.Qa="function"===typeof b?b:null;this.ma=c;}function Fa(a,b){var c=!1;try{a(function(a){c||(c=!0,Ia(b,a));},function(a){c||(c=!0,Na(b,a));});}catch(d){c||(c=!0,Na(b,d));}}
  u.prototype["catch"]=function(a){return this.then(null,a)};u.prototype.then=function(a,b){var c=new this.constructor(Da);Ga(this,new Pa(a,b,c));return c};u.prototype["finally"]=function(a){var b=this.constructor;return this.then(function(c){return b.resolve(a()).then(function(){return c})},function(c){return b.resolve(a()).then(function(){return b.reject(c)})})};
  function Qa(a){return new u(function(b,c){function d(a,g){try{if(g&&("object"===typeof g||"function"===typeof g)){var h=g.then;if("function"===typeof h){h.call(g,function(b){d(a,b);},c);return}}e[a]=g;0===--f&&b(e);}catch(n){c(n);}}if(!a||"undefined"===typeof a.length)throw new TypeError("Promise.all accepts an array");var e=Array.prototype.slice.call(a);if(0===e.length)return b([]);for(var f=e.length,g=0;g<e.length;g++)d(g,e[g]);})}
  function Ra(a){return a&&"object"===typeof a&&a.constructor===u?a:new u(function(b){b(a);})}function Sa(a){return new u(function(b,c){c(a);})}function Ta(a){return new u(function(b,c){for(var d=0,e=a.length;d<e;d++)a[d].then(b,c);})}var Ha="function"===typeof setImmediate&&function(a){setImmediate(a);}||function(a){Ca(a,0);};/*

  Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
  This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
  The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
  The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
  Code distributed by Google as part of the polymer project is also
  subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
  */
  if(!window.Promise){window.Promise=u;u.prototype.then=u.prototype.then;u.all=Qa;u.race=Ta;u.resolve=Ra;u.reject=Sa;var Ua=document.createTextNode(""),Va=[];(new MutationObserver(function(){for(var a=Va.length,b=0;b<a;b++)Va[b]();Va.splice(0,a);})).observe(Ua,{characterData:!0});Ha=function(a){Va.push(a);Ua.textContent=0<Ua.textContent.length?"":"a";};}(function(a,b){if(!(b in a)){var c=typeof commonjsGlobal===typeof c?window:commonjsGlobal,d=0,e=""+Math.random(),f="__\u0001symbol@@"+e,g=a.getOwnPropertyNames,h=a.getOwnPropertyDescriptor,k=a.create,l=a.keys,n=a.freeze||a,q=a.defineProperty,I=a.defineProperties,v=h(a,"getOwnPropertyNames"),x=a.prototype,Q=x.hasOwnProperty,Eb=x.propertyIsEnumerable,Fb=x.toString,T=function(a,b,c){Q.call(a,f)||q(a,f,{enumerable:!1,configurable:!1,writable:!1,value:{}});a[f]["@@"+b]=c;},Ja=function(a,b){var c=k(a);g(b).forEach(function(a){X.call(b,
  a)&&Aa(c,a,b[a]);});return c},p=function(){},za=function(a){return a!=f&&!Q.call(Y,a)},aa=function(a){return a!=f&&Q.call(Y,a)},X=function(a){var b=""+a;return aa(b)?Q.call(this,b)&&this[f]["@@"+b]:Eb.call(this,a)},m=function(b){q(x,b,{enumerable:!1,configurable:!0,get:p,set:function(a){ba(this,b,{enumerable:!1,configurable:!0,writable:!0,value:a});T(this,b,!0);}});return n(Y[b]=q(a(b),"constructor",Gb))},y=function(a){if(this&&this!==c)throw new TypeError("Symbol is not a constructor");return m("__\u0001symbol:".concat(a||
  "",e,++d))},Y=k(null),Gb={value:y},Ka=function(a){return Y[a]},Aa=function(a,b,c){var d=""+b;if(aa(d)){b=ba;if(c.enumerable){var e=k(c);e.enumerable=!1;}else e=c;b(a,d,e);T(a,d,!!c.enumerable);}else q(a,b,c);return a},La=function(a){return g(a).filter(aa).map(Ka)};v.value=Aa;q(a,"defineProperty",v);v.value=La;q(a,b,v);v.value=function(a){return g(a).filter(za)};q(a,"getOwnPropertyNames",v);v.value=function(a,b){var c=La(b);c.length?l(b).concat(c).forEach(function(c){X.call(b,c)&&Aa(a,c,b[c]);}):I(a,
  b);return a};q(a,"defineProperties",v);v.value=X;q(x,"propertyIsEnumerable",v);v.value=y;q(c,"Symbol",v);v.value=function(a){a="__\u0001symbol:".concat("__\u0001symbol:",a,e);return a in x?Y[a]:m(a)};q(y,"for",v);v.value=function(a){if(za(a))throw new TypeError(a+" is not a symbol");return Q.call(Y,a)?a.slice(20,-e.length):void 0};q(y,"keyFor",v);v.value=function(a,b){var c=h(a,b);c&&aa(b)&&(c.enumerable=X.call(a,b));return c};q(a,"getOwnPropertyDescriptor",v);v.value=function(a,b){return 1===arguments.length?
  k(a):Ja(a,b)};q(a,"create",v);v.value=function(){var a=Fb.call(this);return "[object String]"===a&&aa(this)?"[object Symbol]":a};q(x,"toString",v);try{var ba=k(q({},"__\u0001symbol:",{get:function(){return q(this,"__\u0001symbol:",{value:!1})["__\u0001symbol:"]}}))["__\u0001symbol:"]||q;}catch(Ma){ba=function(a,b,c){var d=h(x,b);delete x[b];q(a,b,c);q(x,b,d);};}}})(Object,"getOwnPropertySymbols");
  (function(a){var b=a.defineProperty,c=a.prototype,d=c.toString,e;"iterator match replace search split hasInstance isConcatSpreadable unscopables species toPrimitive toStringTag".split(" ").forEach(function(f){if(!(f in Symbol))switch(b(Symbol,f,{value:Symbol(f)}),f){case "toStringTag":e=a.getOwnPropertyDescriptor(c,"toString"),e.value=function(){var a=d.call(this),b=this[Symbol.toStringTag];return "undefined"===typeof b?a:"[object "+b+"]"},b(c,"toString",e);}});})(Object,Symbol);
  (function(a,b,c){function d(){return this}b[a]||(b[a]=function(){var b=0,c=this,g={next:function(){var a=c.length<=b;return a?{done:a}:{done:a,value:c[b++]}}};g[a]=d;return g});c[a]||(c[a]=function(){var b=String.fromCodePoint,c=this,g=0,h=c.length,k={next:function(){var a=h<=g,d=a?"":b(c.codePointAt(g));g+=d.length;return a?{done:a}:{done:a,value:d}}};k[a]=d;return k});})(Symbol.iterator,Array.prototype,String.prototype);/*

  Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
  This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
  The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
  The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
  Code distributed by Google as part of the polymer project is also
  subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
  */
  var Wa=Object.prototype.toString;Object.prototype.toString=function(){return void 0===this?"[object Undefined]":null===this?"[object Null]":Wa.call(this)};Object.keys=function(a){return Object.getOwnPropertyNames(a).filter(function(b){return (b=Object.getOwnPropertyDescriptor(a,b))&&b.enumerable})};var Xa=window.Symbol.iterator;
  String.prototype[Xa]&&String.prototype.codePointAt||(String.prototype[Xa]=function Ya(){var b,c=this;return Ba(Ya,function(d){1==d.a&&(b=0);if(3!=d.a)return b<c.length?d=ta(d,c[b]):(d.a=0,d=void 0),d;b++;d.a=2;})});Set.prototype[Xa]||(Set.prototype[Xa]=function Za(){var b,c=this,d;return Ba(Za,function(e){1==e.a&&(b=[],c.forEach(function(c){b.push(c);}),d=0);if(3!=e.a)return d<b.length?e=ta(e,b[d]):(e.a=0,e=void 0),e;d++;e.a=2;})});
  Map.prototype[Xa]||(Map.prototype[Xa]=function $a(){var b,c=this,d;return Ba($a,function(e){1==e.a&&(b=[],c.forEach(function(c,d){b.push([d,c]);}),d=0);if(3!=e.a)return d<b.length?e=ta(e,b[d]):(e.a=0,e=void 0),e;d++;e.a=2;})});/*

   Copyright (c) 2014 The Polymer Project Authors. All rights reserved.
   This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
   The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
   The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
   Code distributed by Google as part of the polymer project is also
   subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
  */
  window.WebComponents=window.WebComponents||{flags:{}};var ab=document.querySelector('script[src*="webcomponents-bundle"]'),bb=/wc-(.+)/,w={};if(!w.noOpts){location.search.slice(1).split("&").forEach(function(a){a=a.split("=");var b;a[0]&&(b=a[0].match(bb))&&(w[b[1]]=a[1]||!0);});if(ab)for(var cb=0,db=void 0;db=ab.attributes[cb];cb++)"src"!==db.name&&(w[db.name]=db.value||!0);if(w.log&&w.log.split){var eb=w.log.split(",");w.log={};eb.forEach(function(a){w.log[a]=!0;});}else w.log={};}
  window.WebComponents.flags=w;var fb=w.shadydom;fb&&(window.ShadyDOM=window.ShadyDOM||{},window.ShadyDOM.force=fb);var gb=w.register||w.ce;gb&&window.customElements&&(window.customElements.forcePolyfill=gb);/*

  Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
  This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
  The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
  The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
  Code distributed by Google as part of the polymer project is also
  subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
  */
  function hb(){}hb.prototype.toJSON=function(){return {}};function z(a){a.__shady||(a.__shady=new hb);return a.__shady}function A(a){return a&&a.__shady}var B=window.ShadyDOM||{};B.La=!(!Element.prototype.attachShadow||!Node.prototype.getRootNode);var ib=Object.getOwnPropertyDescriptor(Node.prototype,"firstChild");B.D=!!(ib&&ib.configurable&&ib.get);B.ka=B.force||!B.La;B.M=B.noPatch||!1;B.ta=B.preferPerformance;var jb=navigator.userAgent.match("Trident");B.ya=jb;function kb(a){return (a=A(a))&&void 0!==a.firstChild}function C(a){return "ShadyRoot"===a.Da}function lb(a){return (a=(a=A(a))&&a.root)&&mb(a)}
  var nb=Element.prototype,ob=nb.matches||nb.matchesSelector||nb.mozMatchesSelector||nb.msMatchesSelector||nb.oMatchesSelector||nb.webkitMatchesSelector,pb=document.createTextNode(""),qb=0,rb=[];(new MutationObserver(function(){for(;rb.length;)try{rb.shift()();}catch(a){throw pb.textContent=qb++,a;}})).observe(pb,{characterData:!0});function sb(a){rb.push(a);pb.textContent=qb++;}var tb=!!document.contains;function ub(a,b){for(;b;){if(b==a)return !0;b=b.__shady_parentNode;}return !1}
  function vb(a){for(var b=a.length-1;0<=b;b--){var c=a[b],d=c.getAttribute("id")||c.getAttribute("name");d&&"length"!==d&&isNaN(d)&&(a[d]=c);}a.item=function(b){return a[b]};a.namedItem=function(b){if("length"!==b&&isNaN(b)&&a[b])return a[b];for(var c=ja(a),d=c.next();!d.done;d=c.next())if(d=d.value,(d.getAttribute("id")||d.getAttribute("name"))==b)return d;return null};return a}function wb(a){var b=[];for(a=a.__shady_native_firstChild;a;a=a.__shady_native_nextSibling)b.push(a);return b}
  function xb(a){var b=[];for(a=a.__shady_firstChild;a;a=a.__shady_nextSibling)b.push(a);return b}function D(a,b,c,d){c=void 0===c?"":c;for(var e in b){var f=b[e];if(!(d&&0<=d.indexOf(e))){f.configurable=!0;var g=c+e;if(f.value)a[g]=f.value;else try{Object.defineProperty(a,g,f);}catch(h){}}}}function E(a){var b={};Object.getOwnPropertyNames(a).forEach(function(c){b[c]=Object.getOwnPropertyDescriptor(a,c);});return b}var yb=[],zb;function Ab(a){zb||(zb=!0,sb(Bb));yb.push(a);}function Bb(){zb=!1;for(var a=!!yb.length;yb.length;)yb.shift()();return a}Bb.list=yb;function Cb(){this.a=!1;this.addedNodes=[];this.removedNodes=[];this.$=new Set;}function Db(a){a.a||(a.a=!0,sb(function(){a.flush();}));}Cb.prototype.flush=function(){if(this.a){this.a=!1;var a=this.takeRecords();a.length&&this.$.forEach(function(b){b(a);});}};Cb.prototype.takeRecords=function(){if(this.addedNodes.length||this.removedNodes.length){var a=[{addedNodes:this.addedNodes,removedNodes:this.removedNodes}];this.addedNodes=[];this.removedNodes=[];return a}return []};
  function Hb(a,b){var c=z(a);c.V||(c.V=new Cb);c.V.$.add(b);var d=c.V;return {Ca:b,P:d,Ea:a,takeRecords:function(){return d.takeRecords()}}}function Ib(a){var b=a&&a.P;b&&(b.$.delete(a.Ca),b.$.size||(z(a.Ea).V=null));}
  function Jb(a,b){var c=b.getRootNode();return a.map(function(a){var b=c===a.target.getRootNode();if(b&&a.addedNodes){if(b=Array.from(a.addedNodes).filter(function(a){return c===a.getRootNode()}),b.length)return a=Object.create(a),Object.defineProperty(a,"addedNodes",{value:b,configurable:!0}),a}else if(b)return a}).filter(function(a){return a})}var Kb=/[&\u00A0"]/g,Lb=/[&\u00A0<>]/g;function Mb(a){switch(a){case "&":return "&amp;";case "<":return "&lt;";case ">":return "&gt;";case '"':return "&quot;";case "\u00a0":return "&nbsp;"}}function Nb(a){for(var b={},c=0;c<a.length;c++)b[a[c]]=!0;return b}var Ob=Nb("area base br col command embed hr img input keygen link meta param source track wbr".split(" ")),Pb=Nb("style script xmp iframe noembed noframes plaintext noscript".split(" "));
  function Qb(a,b){"template"===a.localName&&(a=a.content);for(var c="",d=b?b(a):a.childNodes,e=0,f=d.length,g=void 0;e<f&&(g=d[e]);e++){a:{var h=g;var k=a,l=b;switch(h.nodeType){case Node.ELEMENT_NODE:k=h.localName;for(var n="<"+k,q=h.attributes,I=0,v;v=q[I];I++)n+=" "+v.name+'="'+v.value.replace(Kb,Mb)+'"';n+=">";h=Ob[k]?n:n+Qb(h,l)+"</"+k+">";break a;case Node.TEXT_NODE:h=h.data;h=k&&Pb[k.localName]?h:h.replace(Lb,Mb);break a;case Node.COMMENT_NODE:h="\x3c!--"+h.data+"--\x3e";break a;default:throw window.console.error(h),
  Error("not implemented");}}c+=h;}return c}var Rb=B.D,Sb={querySelector:function(a){return this.__shady_native_querySelector(a)},querySelectorAll:function(a){return this.__shady_native_querySelectorAll(a)}},Tb={};function Ub(a){Tb[a]=function(b){return b["__shady_native_"+a]};}function Vb(a,b){D(a,b,"__shady_native_");for(var c in b)Ub(c);}function F(a,b){b=void 0===b?[]:b;for(var c=0;c<b.length;c++){var d=b[c],e=Object.getOwnPropertyDescriptor(a,d);e&&(Object.defineProperty(a,"__shady_native_"+d,e),e.value?Sb[d]||(Sb[d]=e.value):Ub(d));}}
  var G=document.createTreeWalker(document,NodeFilter.SHOW_ALL,null,!1),H=document.createTreeWalker(document,NodeFilter.SHOW_ELEMENT,null,!1),Wb=document.implementation.createHTMLDocument("inert");function Xb(a){for(var b;b=a.__shady_native_firstChild;)a.__shady_native_removeChild(b);}var Yb=["firstElementChild","lastElementChild","children","childElementCount"],Zb=["querySelector","querySelectorAll"];
  function $b(){var a=["dispatchEvent","addEventListener","removeEventListener"];window.EventTarget?F(window.EventTarget.prototype,a):(F(Node.prototype,a),F(Window.prototype,a));Rb?F(Node.prototype,"parentNode firstChild lastChild previousSibling nextSibling childNodes parentElement textContent".split(" ")):Vb(Node.prototype,{parentNode:{get:function(){G.currentNode=this;return G.parentNode()}},firstChild:{get:function(){G.currentNode=this;return G.firstChild()}},lastChild:{get:function(){G.currentNode=
  this;return G.lastChild()}},previousSibling:{get:function(){G.currentNode=this;return G.previousSibling()}},nextSibling:{get:function(){G.currentNode=this;return G.nextSibling()}},childNodes:{get:function(){var a=[];G.currentNode=this;for(var c=G.firstChild();c;)a.push(c),c=G.nextSibling();return a}},parentElement:{get:function(){H.currentNode=this;return H.parentNode()}},textContent:{get:function(){switch(this.nodeType){case Node.ELEMENT_NODE:case Node.DOCUMENT_FRAGMENT_NODE:for(var a=document.createTreeWalker(this,
  NodeFilter.SHOW_TEXT,null,!1),c="",d;d=a.nextNode();)c+=d.nodeValue;return c;default:return this.nodeValue}},set:function(a){if("undefined"===typeof a||null===a)a="";switch(this.nodeType){case Node.ELEMENT_NODE:case Node.DOCUMENT_FRAGMENT_NODE:Xb(this);(0<a.length||this.nodeType===Node.ELEMENT_NODE)&&this.__shady_native_insertBefore(document.createTextNode(a),void 0);break;default:this.nodeValue=a;}}}});F(Node.prototype,"appendChild insertBefore removeChild replaceChild cloneNode contains".split(" "));
  F(HTMLElement.prototype,["parentElement","contains"]);a={firstElementChild:{get:function(){H.currentNode=this;return H.firstChild()}},lastElementChild:{get:function(){H.currentNode=this;return H.lastChild()}},children:{get:function(){var a=[];H.currentNode=this;for(var c=H.firstChild();c;)a.push(c),c=H.nextSibling();return vb(a)}},childElementCount:{get:function(){return this.children?this.children.length:0}}};Rb?(F(Element.prototype,Yb),F(Element.prototype,["previousElementSibling","nextElementSibling",
  "innerHTML","className"]),F(HTMLElement.prototype,["children","innerHTML","className"])):(Vb(Element.prototype,a),Vb(Element.prototype,{previousElementSibling:{get:function(){H.currentNode=this;return H.previousSibling()}},nextElementSibling:{get:function(){H.currentNode=this;return H.nextSibling()}},innerHTML:{get:function(){return Qb(this,wb)},set:function(a){var b="template"===this.localName?this.content:this;Xb(b);var d=this.localName||"div";d=this.namespaceURI&&this.namespaceURI!==Wb.namespaceURI?
  Wb.createElementNS(this.namespaceURI,d):Wb.createElement(d);d.innerHTML=a;for(a="template"===this.localName?d.content:d;d=a.__shady_native_firstChild;)b.__shady_native_insertBefore(d,void 0);}},className:{get:function(){return this.getAttribute("class")||""},set:function(a){this.setAttribute("class",a);}}}));F(Element.prototype,"setAttribute getAttribute hasAttribute removeAttribute focus blur".split(" "));F(Element.prototype,Zb);F(HTMLElement.prototype,["focus","blur"]);window.HTMLTemplateElement&&
  F(window.HTMLTemplateElement.prototype,["innerHTML"]);Rb?F(DocumentFragment.prototype,Yb):Vb(DocumentFragment.prototype,a);F(DocumentFragment.prototype,Zb);Rb?(F(Document.prototype,Yb),F(Document.prototype,["activeElement"])):Vb(Document.prototype,a);F(Document.prototype,["importNode","getElementById"]);F(Document.prototype,Zb);}var ac=E({get childNodes(){return this.__shady_childNodes},get firstChild(){return this.__shady_firstChild},get lastChild(){return this.__shady_lastChild},get childElementCount(){return this.__shady_childElementCount},get children(){return this.__shady_children},get firstElementChild(){return this.__shady_firstElementChild},get lastElementChild(){return this.__shady_lastElementChild},get shadowRoot(){return this.__shady_shadowRoot}}),bc=E({get textContent(){return this.__shady_textContent},set textContent(a){this.__shady_textContent=
  a;},get innerHTML(){return this.__shady_innerHTML},set innerHTML(a){return this.__shady_innerHTML=a}}),cc=E({get parentElement(){return this.__shady_parentElement},get parentNode(){return this.__shady_parentNode},get nextSibling(){return this.__shady_nextSibling},get previousSibling(){return this.__shady_previousSibling},get nextElementSibling(){return this.__shady_nextElementSibling},get previousElementSibling(){return this.__shady_previousElementSibling},get className(){return this.__shady_className},
  set className(a){return this.__shady_className=a}}),dc;for(dc in ac)ac[dc].enumerable=!1;for(var ec in bc)bc[ec].enumerable=!1;for(var fc in cc)cc[fc].enumerable=!1;var gc=B.D||B.M,hc=gc?function(){}:function(a){var b=z(a);b.Aa||(b.Aa=!0,D(a,cc));},ic=gc?function(){}:function(a){var b=z(a);b.za||(b.za=!0,D(a,ac),window.customElements&&!B.M||D(a,bc));};var jc="__eventWrappers"+Date.now(),kc=function(){var a=Object.getOwnPropertyDescriptor(Event.prototype,"composed");return a?function(b){return a.get.call(b)}:null}(),lc=function(){function a(){}var b=!1,c={get capture(){b=!0;}};window.addEventListener("test",a,c);window.removeEventListener("test",a,c);return b}();function mc(a){if(a&&"object"===typeof a){var b=!!a.capture;var c=!!a.once;var d=!!a.passive;var e=a.O;}else b=!!a,d=c=!1;return {ua:e,capture:b,once:c,passive:d,sa:lc?a:b}}
  var nc={blur:!0,focus:!0,focusin:!0,focusout:!0,click:!0,dblclick:!0,mousedown:!0,mouseenter:!0,mouseleave:!0,mousemove:!0,mouseout:!0,mouseover:!0,mouseup:!0,wheel:!0,beforeinput:!0,input:!0,keydown:!0,keyup:!0,compositionstart:!0,compositionupdate:!0,compositionend:!0,touchstart:!0,touchend:!0,touchmove:!0,touchcancel:!0,pointerover:!0,pointerenter:!0,pointerdown:!0,pointermove:!0,pointerup:!0,pointercancel:!0,pointerout:!0,pointerleave:!0,gotpointercapture:!0,lostpointercapture:!0,dragstart:!0,
  drag:!0,dragenter:!0,dragleave:!0,dragover:!0,drop:!0,dragend:!0,DOMActivate:!0,DOMFocusIn:!0,DOMFocusOut:!0,keypress:!0},oc={DOMAttrModified:!0,DOMAttributeNameChanged:!0,DOMCharacterDataModified:!0,DOMElementNameChanged:!0,DOMNodeInserted:!0,DOMNodeInsertedIntoDocument:!0,DOMNodeRemoved:!0,DOMNodeRemovedFromDocument:!0,DOMSubtreeModified:!0};function pc(a){return a instanceof Node?a.__shady_getRootNode():a}
  function qc(a,b){var c=[],d=a;for(a=pc(a);d;)c.push(d),d.__shady_assignedSlot?d=d.__shady_assignedSlot:d.nodeType===Node.DOCUMENT_FRAGMENT_NODE&&d.host&&(b||d!==a)?d=d.host:d=d.__shady_parentNode;c[c.length-1]===document&&c.push(window);return c}function rc(a){a.__composedPath||(a.__composedPath=qc(a.target,!0));return a.__composedPath}function sc(a,b){if(!C)return a;a=qc(a,!0);for(var c=0,d,e=void 0,f,g=void 0;c<b.length;c++)if(d=b[c],f=pc(d),f!==e&&(g=a.indexOf(f),e=f),!C(f)||-1<g)return d}
  function tc(a){function b(b,d){b=new a(b,d);b.__composed=d&&!!d.composed;return b}b.__proto__=a;b.prototype=a.prototype;return b}var uc={focus:!0,blur:!0};function vc(a){return a.__target!==a.target||a.__relatedTarget!==a.relatedTarget}function wc(a,b,c){if(c=b.__handlers&&b.__handlers[a.type]&&b.__handlers[a.type][c])for(var d=0,e;(e=c[d])&&(!vc(a)||a.target!==a.relatedTarget)&&(e.call(b,a),!a.__immediatePropagationStopped);d++);}
  function xc(a){var b=a.composedPath();Object.defineProperty(a,"currentTarget",{get:function(){return d},configurable:!0});for(var c=b.length-1;0<=c;c--){var d=b[c];wc(a,d,"capture");if(a.ga)return}Object.defineProperty(a,"eventPhase",{get:function(){return Event.AT_TARGET}});var e;for(c=0;c<b.length;c++){d=b[c];var f=A(d);f=f&&f.root;if(0===c||f&&f===e)if(wc(a,d,"bubble"),d!==window&&(e=d.__shady_getRootNode()),a.ga)break}}
  function yc(a,b,c,d,e,f){for(var g=0;g<a.length;g++){var h=a[g],k=h.type,l=h.capture,n=h.once,q=h.passive;if(b===h.node&&c===k&&d===l&&e===n&&f===q)return g}return -1}
  function zc(a,b,c){var d=mc(c),e=d.capture,f=d.once,g=d.passive,h=d.ua;d=d.sa;if(b){var k=typeof b;if("function"===k||"object"===k)if("object"!==k||b.handleEvent&&"function"===typeof b.handleEvent){if(oc[a])return this.__shady_native_addEventListener(a,b,d);var l=h||this;if(h=b[jc]){if(-1<yc(h,l,a,e,f,g))return}else b[jc]=[];h=function(d){f&&this.__shady_removeEventListener(a,b,c);d.__target||Ac(d);if(l!==this){var e=Object.getOwnPropertyDescriptor(d,"currentTarget");Object.defineProperty(d,"currentTarget",
  {get:function(){return l},configurable:!0});}d.__previousCurrentTarget=d.currentTarget;if(!C(l)&&"slot"!==l.localName||-1!=d.composedPath().indexOf(l))if(d.composed||-1<d.composedPath().indexOf(l))if(vc(d)&&d.target===d.relatedTarget)d.eventPhase===Event.BUBBLING_PHASE&&d.stopImmediatePropagation();else if(d.eventPhase===Event.CAPTURING_PHASE||d.bubbles||d.target===l||l instanceof Window){var g="function"===k?b.call(l,d):b.handleEvent&&b.handleEvent(d);l!==this&&(e?(Object.defineProperty(d,"currentTarget",
  e),e=null):delete d.currentTarget);return g}};b[jc].push({node:l,type:a,capture:e,once:f,passive:g,ab:h});uc[a]?(this.__handlers=this.__handlers||{},this.__handlers[a]=this.__handlers[a]||{capture:[],bubble:[]},this.__handlers[a][e?"capture":"bubble"].push(h)):this.__shady_native_addEventListener(a,h,d);}}}
  function Bc(a,b,c){if(b){var d=mc(c);c=d.capture;var e=d.once,f=d.passive,g=d.ua;d=d.sa;if(oc[a])return this.__shady_native_removeEventListener(a,b,d);var h=g||this;g=void 0;var k=null;try{k=b[jc];}catch(l){}k&&(e=yc(k,h,a,c,e,f),-1<e&&(g=k.splice(e,1)[0].ab,k.length||(b[jc]=void 0)));this.__shady_native_removeEventListener(a,g||b,d);g&&uc[a]&&this.__handlers&&this.__handlers[a]&&(a=this.__handlers[a][c?"capture":"bubble"],b=a.indexOf(g),-1<b&&a.splice(b,1));}}
  function Cc(){for(var a in uc)window.__shady_native_addEventListener(a,function(a){a.__target||(Ac(a),xc(a));},!0);}
  var Dc=E({get composed(){void 0===this.__composed&&(kc?this.__composed="focusin"===this.type||"focusout"===this.type||kc(this):!1!==this.isTrusted&&(this.__composed=nc[this.type]));return this.__composed||!1},composedPath:function(){this.__composedPath||(this.__composedPath=qc(this.__target,this.composed));return this.__composedPath},get target(){return sc(this.currentTarget||this.__previousCurrentTarget,this.composedPath())},get relatedTarget(){if(!this.__relatedTarget)return null;this.__relatedTargetComposedPath||
  (this.__relatedTargetComposedPath=qc(this.__relatedTarget,!0));return sc(this.currentTarget||this.__previousCurrentTarget,this.__relatedTargetComposedPath)},stopPropagation:function(){Event.prototype.stopPropagation.call(this);this.ga=!0;},stopImmediatePropagation:function(){Event.prototype.stopImmediatePropagation.call(this);this.ga=this.__immediatePropagationStopped=!0;}});
  function Ac(a){a.__target=a.target;a.__relatedTarget=a.relatedTarget;if(B.D){var b=Object.getPrototypeOf(a);if(!Object.hasOwnProperty(b,"__shady_patchedProto")){var c=Object.create(b);c.__shady_sourceProto=b;D(c,Dc);b.__shady_patchedProto=c;}a.__proto__=b.__shady_patchedProto;}else D(a,Dc);}var Ec=tc(Event),Fc=tc(CustomEvent),Gc=tc(MouseEvent);
  function Hc(){if(!kc&&Object.getOwnPropertyDescriptor(Event.prototype,"isTrusted")){var a=function(){var a=new MouseEvent("click",{bubbles:!0,cancelable:!0,composed:!0});this.__shady_dispatchEvent(a);};Element.prototype.click?Element.prototype.click=a:HTMLElement.prototype.click&&(HTMLElement.prototype.click=a);}}var Ic=Object.getOwnPropertyNames(Document.prototype).filter(function(a){return "on"===a.substring(0,2)});function Jc(a,b){return {index:a,W:[],Z:b}}
  function Kc(a,b,c,d){var e=0,f=0,g=0,h=0,k=Math.min(b-e,d-f);if(0==e&&0==f)a:{for(g=0;g<k;g++)if(a[g]!==c[g])break a;g=k;}if(b==a.length&&d==c.length){h=a.length;for(var l=c.length,n=0;n<k-g&&Lc(a[--h],c[--l]);)n++;h=n;}e+=g;f+=g;b-=h;d-=h;if(0==b-e&&0==d-f)return [];if(e==b){for(b=Jc(e,0);f<d;)b.W.push(c[f++]);return [b]}if(f==d)return [Jc(e,b-e)];k=e;g=f;d=d-g+1;h=b-k+1;b=Array(d);for(l=0;l<d;l++)b[l]=Array(h),b[l][0]=l;for(l=0;l<h;l++)b[0][l]=l;for(l=1;l<d;l++)for(n=1;n<h;n++)if(a[k+n-1]===c[g+l-1])b[l][n]=
  b[l-1][n-1];else{var q=b[l-1][n]+1,I=b[l][n-1]+1;b[l][n]=q<I?q:I;}k=b.length-1;g=b[0].length-1;d=b[k][g];for(a=[];0<k||0<g;)0==k?(a.push(2),g--):0==g?(a.push(3),k--):(h=b[k-1][g-1],l=b[k-1][g],n=b[k][g-1],q=l<n?l<h?l:h:n<h?n:h,q==h?(h==d?a.push(0):(a.push(1),d=h),k--,g--):q==l?(a.push(3),k--,d=l):(a.push(2),g--,d=n));a.reverse();b=void 0;k=[];for(g=0;g<a.length;g++)switch(a[g]){case 0:b&&(k.push(b),b=void 0);e++;f++;break;case 1:b||(b=Jc(e,0));b.Z++;e++;b.W.push(c[f]);f++;break;case 2:b||(b=Jc(e,0));
  b.Z++;e++;break;case 3:b||(b=Jc(e,0)),b.W.push(c[f]),f++;}b&&k.push(b);return k}function Lc(a,b){return a===b}function Mc(a,b,c,d){hc(a);d=d||null;var e=z(a),f=d?z(d):null;e.previousSibling=d?f.previousSibling:b.__shady_lastChild;if(f=A(e.previousSibling))f.nextSibling=a;if(f=A(e.nextSibling=d))f.previousSibling=a;e.parentNode=b;d?d===c.firstChild&&(c.firstChild=a):(c.lastChild=a,c.firstChild||(c.firstChild=a));c.childNodes=null;}
  function Nc(a,b,c){ic(b);var d=z(b);void 0!==d.firstChild&&(d.childNodes=null);if(a.nodeType===Node.DOCUMENT_FRAGMENT_NODE)for(a=a.__shady_native_firstChild;a;a=a.__shady_native_nextSibling)Mc(a,b,d,c);else Mc(a,b,d,c);}
  function Oc(a,b){var c=z(a);b=z(b);a===b.firstChild&&(b.firstChild=c.nextSibling);a===b.lastChild&&(b.lastChild=c.previousSibling);a=c.previousSibling;var d=c.nextSibling;a&&(z(a).nextSibling=d);d&&(z(d).previousSibling=a);c.parentNode=c.previousSibling=c.nextSibling=void 0;void 0!==b.childNodes&&(b.childNodes=null);}
  function Pc(a,b){var c=z(a);if(b||void 0===c.firstChild){c.childNodes=null;var d=c.firstChild=a.__shady_native_firstChild;c.lastChild=a.__shady_native_lastChild;ic(a);c=d;for(d=void 0;c;c=c.__shady_native_nextSibling){var e=z(c);e.parentNode=b||a;e.nextSibling=c.__shady_native_nextSibling;e.previousSibling=d||null;d=c;hc(c);}}}var Qc=null;function Rc(){Qc||(Qc=window.ShadyCSS&&window.ShadyCSS.ScopingShim);return Qc||null}function Sc(a,b){var c=Rc();c&&c.unscopeNode(a,b);}function Tc(a,b){var c=Rc();if(!c)return !0;if(a.nodeType===Node.DOCUMENT_FRAGMENT_NODE){c=!0;for(a=a.__shady_firstChild;a;a=a.__shady_nextSibling)c=c&&Tc(a,b);return c}return a.nodeType!==Node.ELEMENT_NODE?!0:c.currentScopeForNode(a)===b}function Uc(a){if(a.nodeType!==Node.ELEMENT_NODE)return "";var b=Rc();return b?b.currentScopeForNode(a):""}
  function Vc(a,b){if(a)for(a.nodeType===Node.ELEMENT_NODE&&b(a),a=a.__shady_firstChild;a;a=a.__shady_nextSibling)a.nodeType===Node.ELEMENT_NODE&&Vc(a,b);}var Wc=window.document,Xc=B.ta,Yc=Object.getOwnPropertyDescriptor(Node.prototype,"isConnected"),Zc=Yc&&Yc.get;function $c(a){for(var b;b=a.__shady_firstChild;)a.__shady_removeChild(b);}function ad(a){var b=A(a);if(b&&void 0!==b.ca)for(b=a.__shady_firstChild;b;b=b.__shady_nextSibling)ad(b);if(a=A(a))a.ca=void 0;}function bd(a){var b=a;a&&"slot"===a.localName&&(b=(b=(b=A(a))&&b.T)&&b.length?b[0]:bd(a.__shady_nextSibling));return b}
  function cd(a,b,c){if(a=(a=A(a))&&a.V)b&&a.addedNodes.push(b),c&&a.removedNodes.push(c),Db(a);}
  var gd=E({get parentNode(){var a=A(this);a=a&&a.parentNode;return void 0!==a?a:this.__shady_native_parentNode},get firstChild(){var a=A(this);a=a&&a.firstChild;return void 0!==a?a:this.__shady_native_firstChild},get lastChild(){var a=A(this);a=a&&a.lastChild;return void 0!==a?a:this.__shady_native_lastChild},get nextSibling(){var a=A(this);a=a&&a.nextSibling;return void 0!==a?a:this.__shady_native_nextSibling},get previousSibling(){var a=A(this);a=a&&a.previousSibling;return void 0!==a?a:this.__shady_native_previousSibling},
  get childNodes(){if(kb(this)){var a=A(this);if(!a.childNodes){a.childNodes=[];for(var b=this.__shady_firstChild;b;b=b.__shady_nextSibling)a.childNodes.push(b);}var c=a.childNodes;}else c=this.__shady_native_childNodes;c.item=function(a){return c[a]};return c},get parentElement(){var a=A(this);(a=a&&a.parentNode)&&a.nodeType!==Node.ELEMENT_NODE&&(a=null);return void 0!==a?a:this.__shady_native_parentElement},get isConnected(){if(Zc&&Zc.call(this))return !0;if(this.nodeType==Node.DOCUMENT_FRAGMENT_NODE)return !1;
  var a=this.ownerDocument;if(tb){if(a.__shady_native_contains(this))return !0}else if(a.documentElement&&a.documentElement.__shady_native_contains(this))return !0;for(a=this;a&&!(a instanceof Document);)a=a.__shady_parentNode||(C(a)?a.host:void 0);return !!(a&&a instanceof Document)},get textContent(){if(kb(this)){for(var a=[],b=this.__shady_firstChild;b;b=b.__shady_nextSibling)b.nodeType!==Node.COMMENT_NODE&&a.push(b.__shady_textContent);return a.join("")}return this.__shady_native_textContent},set textContent(a){if("undefined"===
  typeof a||null===a)a="";switch(this.nodeType){case Node.ELEMENT_NODE:case Node.DOCUMENT_FRAGMENT_NODE:if(!kb(this)&&B.D){var b=this.__shady_firstChild;(b!=this.__shady_lastChild||b&&b.nodeType!=Node.TEXT_NODE)&&$c(this);this.__shady_native_textContent=a;}else $c(this),(0<a.length||this.nodeType===Node.ELEMENT_NODE)&&this.__shady_insertBefore(document.createTextNode(a));break;default:this.nodeValue=a;}},insertBefore:function(a,b){if(this.ownerDocument!==Wc&&a.ownerDocument!==Wc)return this.__shady_native_insertBefore(a,
  b),a;if(a===this)throw Error("Failed to execute 'appendChild' on 'Node': The new child element contains the parent.");if(b){var c=A(b);c=c&&c.parentNode;if(void 0!==c&&c!==this||void 0===c&&b.__shady_native_parentNode!==this)throw Error("Failed to execute 'insertBefore' on 'Node': The node before which the new node is to be inserted is not a child of this node.");}if(b===a)return a;var d=[],e=(c=dd(this))?c.host.localName:Uc(this),f=a.__shady_parentNode;if(f){var g=Uc(a);var h=!!c||!dd(a)||Xc&&void 0!==
  this.__noInsertionPoint;f.__shady_removeChild(a,h);}f=!0;var k=(!Xc||void 0===a.__noInsertionPoint&&void 0===this.__noInsertionPoint)&&!Tc(a,e),l=c&&!a.__noInsertionPoint&&(!Xc||a.nodeType===Node.DOCUMENT_FRAGMENT_NODE);if(l||k)k&&(g=g||Uc(a)),Vc(a,function(a){l&&"slot"===a.localName&&d.push(a);if(k){var b=g;Rc()&&(b&&Sc(a,b),(b=Rc())&&b.scopeNode(a,e));}});d.length&&(ed(c),c.c.push.apply(c.c,d instanceof Array?d:ka(ja(d))),J(c));kb(this)&&(Nc(a,this,b),c=A(this),lb(this)?(J(c.root),f=!1):c.root&&(f=
  !1));f?(c=C(this)?this.host:this,b?(b=bd(b),c.__shady_native_insertBefore(a,b)):c.__shady_native_appendChild(a)):a.ownerDocument!==this.ownerDocument&&this.ownerDocument.adoptNode(a);cd(this,a);return a},appendChild:function(a){if(this!=a||!C(a))return this.__shady_insertBefore(a)},removeChild:function(a,b){b=void 0===b?!1:b;if(this.ownerDocument!==Wc)return this.__shady_native_removeChild(a);if(a.__shady_parentNode!==this)throw Error("The node to be removed is not a child of this node: "+a);var c=
  dd(a),d=c&&fd(c,a),e=A(this);if(kb(this)&&(Oc(a,this),lb(this))){J(e.root);var f=!0;}if(Rc()&&!b&&c&&a.nodeType!==Node.TEXT_NODE){var g=Uc(a);Vc(a,function(a){Sc(a,g);});}ad(a);c&&((b=this&&"slot"===this.localName)&&(f=!0),(d||b)&&J(c));f||(f=C(this)?this.host:this,(!e.root&&"slot"!==a.localName||f===a.__shady_native_parentNode)&&f.__shady_native_removeChild(a));cd(this,null,a);return a},replaceChild:function(a,b){this.__shady_insertBefore(a,b);this.__shady_removeChild(b);return a},cloneNode:function(a){if("template"==
  this.localName)return this.__shady_native_cloneNode(a);var b=this.__shady_native_cloneNode(!1);if(a&&b.nodeType!==Node.ATTRIBUTE_NODE){a=this.__shady_firstChild;for(var c;a;a=a.__shady_nextSibling)c=a.__shady_cloneNode(!0),b.__shady_appendChild(c);}return b},getRootNode:function(a){if(this&&this.nodeType){var b=z(this),c=b.ca;void 0===c&&(C(this)?(c=this,b.ca=c):(c=(c=this.__shady_parentNode)?c.__shady_getRootNode(a):this,document.documentElement.__shady_native_contains(this)&&(b.ca=c)));return c}},
  contains:function(a){return ub(this,a)}});function hd(a,b,c){var d=[];id(a,b,c,d);return d}function id(a,b,c,d){for(a=a.__shady_firstChild;a;a=a.__shady_nextSibling){var e;if(e=a.nodeType===Node.ELEMENT_NODE){e=a;var f=b,g=c,h=d,k=f(e);k&&h.push(e);g&&g(k)?e=k:(id(e,f,g,h),e=void 0);}if(e)break}}
  var jd=E({get firstElementChild(){var a=A(this);if(a&&void 0!==a.firstChild){for(a=this.__shady_firstChild;a&&a.nodeType!==Node.ELEMENT_NODE;)a=a.__shady_nextSibling;return a}return this.__shady_native_firstElementChild},get lastElementChild(){var a=A(this);if(a&&void 0!==a.lastChild){for(a=this.__shady_lastChild;a&&a.nodeType!==Node.ELEMENT_NODE;)a=a.__shady_previousSibling;return a}return this.__shady_native_lastElementChild},get children(){return kb(this)?vb(Array.prototype.filter.call(xb(this),
  function(a){return a.nodeType===Node.ELEMENT_NODE})):this.__shady_native_children},get childElementCount(){var a=this.__shady_children;return a?a.length:0}}),kd=E({querySelector:function(a){return hd(this,function(b){return ob.call(b,a)},function(a){return !!a})[0]||null},querySelectorAll:function(a,b){if(b){b=Array.prototype.slice.call(this.__shady_native_querySelectorAll(a));var c=this.__shady_getRootNode();return b.filter(function(a){return a.__shady_getRootNode()==c})}return hd(this,function(b){return ob.call(b,
  a)})}}),ld=B.ta&&!B.M?Object.assign({},jd):jd;Object.assign(jd,kd);var md=E({getElementById:function(a){return ""===a?null:hd(this,function(b){return b.id==a},function(a){return !!a})[0]||null}});var nd=E({get activeElement(){var a=B.D?document.__shady_native_activeElement:document.activeElement;if(!a||!a.nodeType)return null;var b=!!C(this);if(!(this===document||b&&this.host!==a&&this.host.__shady_native_contains(a)))return null;for(b=dd(a);b&&b!==this;)a=b.host,b=dd(a);return this===document?b?null:a:b===this?a:null}});var od=document.implementation.createHTMLDocument("inert"),pd=E({get innerHTML(){return kb(this)?Qb("template"===this.localName?this.content:this,xb):this.__shady_native_innerHTML},set innerHTML(a){if("template"===this.localName)this.__shady_native_innerHTML=a;else{$c(this);var b=this.localName||"div";b=this.namespaceURI&&this.namespaceURI!==od.namespaceURI?od.createElementNS(this.namespaceURI,b):od.createElement(b);for(B.D?b.__shady_native_innerHTML=a:b.innerHTML=a;a=b.__shady_firstChild;)this.__shady_insertBefore(a);}}});var qd=E({addEventListener:function(a,b,c){"object"!==typeof c&&(c={capture:!!c});c.O=c.O||this;this.host.__shady_addEventListener(a,b,c);},removeEventListener:function(a,b,c){"object"!==typeof c&&(c={capture:!!c});c.O=c.O||this;this.host.__shady_removeEventListener(a,b,c);}});function rd(a,b){D(a,qd,b);D(a,nd,b);D(a,pd,b);D(a,jd,b);B.M&&!b?(D(a,gd,b),D(a,md,b)):B.D||(D(a,cc),D(a,ac),D(a,bc));}var sd={},td=B.deferConnectionCallbacks&&"loading"===document.readyState,ud;function vd(a){var b=[];do b.unshift(a);while(a=a.__shady_parentNode);return b}function wd(a,b,c){if(a!==sd)throw new TypeError("Illegal constructor");this.a=null;xd(this,b,c);}
  function xd(a,b,c){a.Da="ShadyRoot";a.host=b;a.mode=c&&c.mode;Pc(a.host);b=z(a.host);b.root=a;b.Ta="closed"!==a.mode?a:null;b=z(a);b.firstChild=b.lastChild=b.parentNode=b.nextSibling=b.previousSibling=null;if(B.preferPerformance)for(;b=a.host.__shady_native_firstChild;)a.host.__shady_native_removeChild(b);else J(a);}function J(a){a.R||(a.R=!0,Ab(function(){return yd(a)}));}
  function yd(a){var b;if(b=a.R){for(var c;a;)a:{a.R&&(c=a),b=a;a=b.host.__shady_getRootNode();if(C(a)&&(b=A(b.host))&&0<b.Y)break a;a=void 0;}b=c;}(c=b)&&c._renderSelf();}
  wd.prototype._renderSelf=function(){var a=td;td=!0;this.R=!1;if(this.a){zd(this);for(var b=0,c;b<this.a.length;b++){c=this.a[b];var d=A(c),e=d.assignedNodes;d.assignedNodes=[];d.T=[];if(d.qa=e)for(d=0;d<e.length;d++){var f=A(e[d]);f.ha=f.assignedSlot;f.assignedSlot===c&&(f.assignedSlot=null);}}for(b=this.host.__shady_firstChild;b;b=b.__shady_nextSibling)Ad(this,b);for(b=0;b<this.a.length;b++){c=this.a[b];e=A(c);if(!e.assignedNodes.length)for(d=c.__shady_firstChild;d;d=d.__shady_nextSibling)Ad(this,
  d,c);(d=(d=A(c.__shady_parentNode))&&d.root)&&(mb(d)||d.R)&&d._renderSelf();Bd(this,e.T,e.assignedNodes);if(d=e.qa){for(f=0;f<d.length;f++)A(d[f]).ha=null;e.qa=null;d.length>e.assignedNodes.length&&(e.ja=!0);}e.ja&&(e.ja=!1,Cd(this,c));}c=this.a;b=[];for(e=0;e<c.length;e++)d=c[e].__shady_parentNode,(f=A(d))&&f.root||!(0>b.indexOf(d))||b.push(d);for(c=0;c<b.length;c++){f=b[c];e=f===this?this.host:f;d=[];for(f=f.__shady_firstChild;f;f=f.__shady_nextSibling)if("slot"==f.localName)for(var g=A(f).T,h=0;h<
  g.length;h++)d.push(g[h]);else d.push(f);f=wb(e);g=Kc(d,d.length,f,f.length);for(var k=h=0,l=void 0;h<g.length&&(l=g[h]);h++){for(var n=0,q=void 0;n<l.W.length&&(q=l.W[n]);n++)q.__shady_native_parentNode===e&&e.__shady_native_removeChild(q),f.splice(l.index+k,1);k-=l.Z;}k=0;for(l=void 0;k<g.length&&(l=g[k]);k++)for(h=f[l.index],n=l.index;n<l.index+l.Z;n++)q=d[n],e.__shady_native_insertBefore(q,h),f.splice(n,0,q);}}if(!B.preferPerformance&&!this.pa)for(b=this.host.__shady_firstChild;b;b=b.__shady_nextSibling)c=
  A(b),b.__shady_native_parentNode!==this.host||"slot"!==b.localName&&c.assignedSlot||this.host.__shady_native_removeChild(b);this.pa=!0;td=a;ud&&ud();};function Ad(a,b,c){var d=z(b),e=d.ha;d.ha=null;c||(c=(a=a.b[b.__shady_slot||"__catchall"])&&a[0]);c?(z(c).assignedNodes.push(b),d.assignedSlot=c):d.assignedSlot=void 0;e!==d.assignedSlot&&d.assignedSlot&&(z(d.assignedSlot).ja=!0);}
  function Bd(a,b,c){for(var d=0,e=void 0;d<c.length&&(e=c[d]);d++)if("slot"==e.localName){var f=A(e).assignedNodes;f&&f.length&&Bd(a,b,f);}else b.push(c[d]);}function Cd(a,b){b.__shady_native_dispatchEvent(new Event("slotchange"));b=A(b);b.assignedSlot&&Cd(a,b.assignedSlot);}function ed(a){a.c=a.c||[];a.a=a.a||[];a.b=a.b||{};}
  function zd(a){if(a.c&&a.c.length){for(var b=a.c,c,d=0;d<b.length;d++){var e=b[d];Pc(e);var f=e.__shady_parentNode;Pc(f);f=A(f);f.Y=(f.Y||0)+1;f=Dd(e);a.b[f]?(c=c||{},c[f]=!0,a.b[f].push(e)):a.b[f]=[e];a.a.push(e);}if(c)for(var g in c)a.b[g]=Ed(a.b[g]);a.c=[];}}function Dd(a){var b=a.name||a.getAttribute("name")||"__catchall";return a.Ba=b}
  function Ed(a){return a.sort(function(a,c){a=vd(a);for(var b=vd(c),e=0;e<a.length;e++){c=a[e];var f=b[e];if(c!==f)return a=xb(c.__shady_parentNode),a.indexOf(c)-a.indexOf(f)}})}
  function fd(a,b){if(a.a){zd(a);var c=a.b,d;for(d in c)for(var e=c[d],f=0;f<e.length;f++){var g=e[f];if(ub(b,g)){e.splice(f,1);var h=a.a.indexOf(g);0<=h&&(a.a.splice(h,1),(h=A(g.__shady_parentNode))&&h.Y&&h.Y--);f--;g=A(g);if(h=g.T)for(var k=0;k<h.length;k++){var l=h[k],n=l.__shady_native_parentNode;n&&n.__shady_native_removeChild(l);}g.T=[];g.assignedNodes=[];h=!0;}}return h}}function mb(a){zd(a);return !(!a.a||!a.a.length)}
  (function(a){a.__proto__=DocumentFragment.prototype;rd(a,"__shady_");rd(a);Object.defineProperties(a,{nodeType:{value:Node.DOCUMENT_FRAGMENT_NODE,configurable:!0},nodeName:{value:"#document-fragment",configurable:!0},nodeValue:{value:null,configurable:!0}});["localName","namespaceURI","prefix"].forEach(function(b){Object.defineProperty(a,b,{value:void 0,configurable:!0});});["ownerDocument","baseURI","isConnected"].forEach(function(b){Object.defineProperty(a,b,{get:function(){return this.host[b]},
  configurable:!0});});})(wd.prototype);
  if(window.customElements&&B.ka&&!B.preferPerformance){var Fd=new Map;ud=function(){var a=[];Fd.forEach(function(b,c){a.push([c,b]);});Fd.clear();for(var b=0;b<a.length;b++){var c=a[b][0];a[b][1]?c.__shadydom_connectedCallback():c.__shadydom_disconnectedCallback();}};td&&document.addEventListener("readystatechange",function(){td=!1;ud();},{once:!0});var Gd=function(a,b,c){var d=0,e="__isConnected"+d++;if(b||c)a.prototype.connectedCallback=a.prototype.__shadydom_connectedCallback=function(){td?Fd.set(this,
  !0):this[e]||(this[e]=!0,b&&b.call(this));},a.prototype.disconnectedCallback=a.prototype.__shadydom_disconnectedCallback=function(){td?this.isConnected||Fd.set(this,!1):this[e]&&(this[e]=!1,c&&c.call(this));};return a},Hd=window.customElements.define,define=function(a,b){var c=b.prototype.connectedCallback,d=b.prototype.disconnectedCallback;Hd.call(window.customElements,a,Gd(b,c,d));b.prototype.connectedCallback=c;b.prototype.disconnectedCallback=d;};window.customElements.define=define;Object.defineProperty(window.CustomElementRegistry.prototype,
  "define",{value:define,configurable:!0});}function dd(a){a=a.__shady_getRootNode();if(C(a))return a}function Id(a){this.node=a;}r=Id.prototype;r.addEventListener=function(a,b,c){return this.node.__shady_addEventListener(a,b,c)};r.removeEventListener=function(a,b,c){return this.node.__shady_removeEventListener(a,b,c)};r.appendChild=function(a){return this.node.__shady_appendChild(a)};r.insertBefore=function(a,b){return this.node.__shady_insertBefore(a,b)};r.removeChild=function(a){return this.node.__shady_removeChild(a)};r.replaceChild=function(a,b){return this.node.__shady_replaceChild(a,b)};
  r.cloneNode=function(a){return this.node.__shady_cloneNode(a)};r.getRootNode=function(a){return this.node.__shady_getRootNode(a)};r.contains=function(a){return this.node.__shady_contains(a)};r.dispatchEvent=function(a){return this.node.__shady_dispatchEvent(a)};r.setAttribute=function(a,b){this.node.__shady_setAttribute(a,b);};r.getAttribute=function(a){return this.node.__shady_native_getAttribute(a)};r.hasAttribute=function(a){return this.node.__shady_native_hasAttribute(a)};r.removeAttribute=function(a){this.node.__shady_removeAttribute(a);};
  r.attachShadow=function(a){return this.node.__shady_attachShadow(a)};r.focus=function(){this.node.__shady_native_focus();};r.blur=function(){this.node.__shady_blur();};r.importNode=function(a,b){if(this.node.nodeType===Node.DOCUMENT_NODE)return this.node.__shady_importNode(a,b)};r.getElementById=function(a){if(this.node.nodeType===Node.DOCUMENT_NODE)return this.node.__shady_getElementById(a)};r.querySelector=function(a){return this.node.__shady_querySelector(a)};
  r.querySelectorAll=function(a,b){return this.node.__shady_querySelectorAll(a,b)};r.assignedNodes=function(a){if("slot"===this.node.localName)return this.node.__shady_assignedNodes(a)};
  t.Object.defineProperties(Id.prototype,{activeElement:{configurable:!0,enumerable:!0,get:function(){if(C(this.node)||this.node.nodeType===Node.DOCUMENT_NODE)return this.node.__shady_activeElement}},_activeElement:{configurable:!0,enumerable:!0,get:function(){return this.activeElement}},host:{configurable:!0,enumerable:!0,get:function(){if(C(this.node))return this.node.host}},parentNode:{configurable:!0,enumerable:!0,get:function(){return this.node.__shady_parentNode}},firstChild:{configurable:!0,
  enumerable:!0,get:function(){return this.node.__shady_firstChild}},lastChild:{configurable:!0,enumerable:!0,get:function(){return this.node.__shady_lastChild}},nextSibling:{configurable:!0,enumerable:!0,get:function(){return this.node.__shady_nextSibling}},previousSibling:{configurable:!0,enumerable:!0,get:function(){return this.node.__shady_previousSibling}},childNodes:{configurable:!0,enumerable:!0,get:function(){return this.node.__shady_childNodes}},parentElement:{configurable:!0,enumerable:!0,
  get:function(){return this.node.__shady_parentElement}},firstElementChild:{configurable:!0,enumerable:!0,get:function(){return this.node.__shady_firstElementChild}},lastElementChild:{configurable:!0,enumerable:!0,get:function(){return this.node.__shady_lastElementChild}},nextElementSibling:{configurable:!0,enumerable:!0,get:function(){return this.node.__shady_nextElementSibling}},previousElementSibling:{configurable:!0,enumerable:!0,get:function(){return this.node.__shady_previousElementSibling}},
  children:{configurable:!0,enumerable:!0,get:function(){return this.node.__shady_children}},childElementCount:{configurable:!0,enumerable:!0,get:function(){return this.node.__shady_childElementCount}},shadowRoot:{configurable:!0,enumerable:!0,get:function(){return this.node.__shady_shadowRoot}},assignedSlot:{configurable:!0,enumerable:!0,get:function(){return this.node.__shady_assignedSlot}},isConnected:{configurable:!0,enumerable:!0,get:function(){return this.node.__shady_isConnected}},innerHTML:{configurable:!0,
  enumerable:!0,get:function(){return this.node.__shady_innerHTML},set:function(a){this.node.__shady_innerHTML=a;}},textContent:{configurable:!0,enumerable:!0,get:function(){return this.node.__shady_textContent},set:function(a){this.node.__shady_textContent=a;}},slot:{configurable:!0,enumerable:!0,get:function(){return this.node.__shady_slot},set:function(a){this.node.__shady_slot=a;}},className:{configurable:!0,enumerable:!0,get:function(){return this.node.__shady_className},set:function(a){return this.node.__shady_className=
  a}}});Ic.forEach(function(a){Object.defineProperty(Id.prototype,a,{get:function(){return this.node["__shady_"+a]},set:function(b){this.node["__shady_"+a]=b;},configurable:!0});});var Jd=new WeakMap;function Kd(a){if(C(a)||a instanceof Id)return a;var b=Jd.get(a);b||(b=new Id(a),Jd.set(a,b));return b}var Ld=E({dispatchEvent:function(a){Bb();return this.__shady_native_dispatchEvent(a)},addEventListener:zc,removeEventListener:Bc});var Md=E({get assignedSlot(){var a=this.__shady_parentNode;(a=a&&a.__shady_shadowRoot)&&yd(a);return (a=A(this))&&a.assignedSlot||null}});var Nd=window.document;function Od(a,b){if("slot"===b)a=a.__shady_parentNode,lb(a)&&J(A(a).root);else if("slot"===a.localName&&"name"===b&&(b=dd(a))){if(b.a){zd(b);var c=a.Ba,d=Dd(a);if(d!==c){c=b.b[c];var e=c.indexOf(a);0<=e&&c.splice(e,1);c=b.b[d]||(b.b[d]=[]);c.push(a);1<c.length&&(b.b[d]=Ed(c));}}J(b);}}
  var Pd=E({get previousElementSibling(){var a=A(this);if(a&&void 0!==a.previousSibling){for(a=this.__shady_previousSibling;a&&a.nodeType!==Node.ELEMENT_NODE;)a=a.__shady_previousSibling;return a}return this.__shady_native_previousElementSibling},get nextElementSibling(){var a=A(this);if(a&&void 0!==a.nextSibling){for(a=this.__shady_nextSibling;a&&a.nodeType!==Node.ELEMENT_NODE;)a=a.__shady_nextSibling;return a}return this.__shady_native_nextElementSibling},get slot(){return this.getAttribute("slot")},
  set slot(a){this.__shady_setAttribute("slot",a);},get shadowRoot(){var a=A(this);return a&&a.Ta||null},get className(){return this.getAttribute("class")||""},set className(a){this.__shady_setAttribute("class",a);},setAttribute:function(a,b){if(this.ownerDocument!==Nd)this.__shady_native_setAttribute(a,b);else{var c;(c=Rc())&&"class"===a?(c.setElementClass(this,b),c=!0):c=!1;c||(this.__shady_native_setAttribute(a,b),Od(this,a));}},removeAttribute:function(a){this.__shady_native_removeAttribute(a);Od(this,
  a);},attachShadow:function(a){if(!this)throw Error("Must provide a host.");if(!a)throw Error("Not enough arguments.");if(a.shadyUpgradeFragment&&!B.ya){var b=a.shadyUpgradeFragment;b.__proto__=ShadowRoot.prototype;xd(b,this,a);Pc(b,b);a=b.__noInsertionPoint?null:b.querySelectorAll("slot");b.__noInsertionPoint=void 0;if(a&&a.length){var c=b;ed(c);c.c.push.apply(c.c,a instanceof Array?a:ka(ja(a)));J(b);}b.host.__shady_native_appendChild(b);}else b=new wd(sd,this,a);return b}});var Qd=E({blur:function(){var a=A(this);(a=(a=a&&a.root)&&a.activeElement)?a.__shady_blur():this.__shady_native_blur();}});Ic.forEach(function(a){Qd[a]={set:function(b){var c=z(this),d=a.substring(2);c.N||(c.N={});c.N[a]&&this.removeEventListener(d,c.N[a]);this.__shady_addEventListener(d,b);c.N[a]=b;},get:function(){var b=A(this);return b&&b.N&&b.N[a]},configurable:!0};});var Rd=E({assignedNodes:function(a){if("slot"===this.localName){var b=this.__shady_getRootNode();b&&C(b)&&yd(b);return (b=A(this))?(a&&a.flatten?b.T:b.assignedNodes)||[]:[]}},addEventListener:function(a,b,c){if("slot"!==this.localName||"slotchange"===a)zc.call(this,a,b,c);else{"object"!==typeof c&&(c={capture:!!c});var d=this.__shady_parentNode;if(!d)throw Error("ShadyDOM cannot attach event to slot unless it has a `parentNode`");c.O=this;d.__shady_addEventListener(a,b,c);}},removeEventListener:function(a,
  b,c){if("slot"!==this.localName||"slotchange"===a)Bc.call(this,a,b,c);else{"object"!==typeof c&&(c={capture:!!c});var d=this.__shady_parentNode;if(!d)throw Error("ShadyDOM cannot attach event to slot unless it has a `parentNode`");c.O=this;d.__shady_removeEventListener(a,b,c);}}});var Sd=window.document,Td=E({importNode:function(a,b){if(a.ownerDocument!==Sd||"template"===a.localName)return this.__shady_native_importNode(a,b);var c=this.__shady_native_importNode(a,!1);if(b)for(a=a.__shady_firstChild;a;a=a.__shady_nextSibling)b=this.__shady_importNode(a,!0),c.__shady_appendChild(b);return c}});var Ud=E({addEventListener:zc.bind(window),removeEventListener:Bc.bind(window)});var Vd={};Object.getOwnPropertyDescriptor(HTMLElement.prototype,"parentElement")&&(Vd.parentElement=gd.parentElement);Object.getOwnPropertyDescriptor(HTMLElement.prototype,"contains")&&(Vd.contains=gd.contains);Object.getOwnPropertyDescriptor(HTMLElement.prototype,"children")&&(Vd.children=jd.children);Object.getOwnPropertyDescriptor(HTMLElement.prototype,"innerHTML")&&(Vd.innerHTML=pd.innerHTML);Object.getOwnPropertyDescriptor(HTMLElement.prototype,"className")&&(Vd.className=Pd.className);
  var Wd={EventTarget:[Ld],Node:[gd,window.EventTarget?null:Ld],Text:[Md],Element:[Pd,jd,Md,!B.D||"innerHTML"in Element.prototype?pd:null,window.HTMLSlotElement?null:Rd],HTMLElement:[Qd,Vd],HTMLSlotElement:[Rd],DocumentFragment:[ld,md],Document:[Td,ld,md,nd],Window:[Ud]},Xd=B.D?null:["innerHTML","textContent"];function Yd(a){var b=a?null:Xd,c={},d;for(d in Wd)c.ea=window[d]&&window[d].prototype,Wd[d].forEach(function(c){return function(d){return c.ea&&d&&D(c.ea,d,a,b)}}(c)),c={ea:c.ea};}if(B.ka){var ShadyDOM={inUse:B.ka,patch:function(a){ic(a);hc(a);return a},isShadyRoot:C,enqueue:Ab,flush:Bb,flushInitial:function(a){!a.pa&&a.R&&yd(a);},settings:B,filterMutations:Jb,observeChildren:Hb,unobserveChildren:Ib,deferConnectionCallbacks:B.deferConnectionCallbacks,preferPerformance:B.preferPerformance,handlesDynamicScoping:!0,wrap:B.M?Kd:function(a){return a},Wrapper:Id,composedPath:rc,noPatch:B.M,nativeMethods:Sb,nativeTree:Tb};window.ShadyDOM=ShadyDOM;$b();Yd("__shady_");Object.defineProperty(document,
  "_activeElement",nd.activeElement);D(Window.prototype,Ud,"__shady_");B.M||(Yd(),Hc());Cc();window.Event=Ec;window.CustomEvent=Fc;window.MouseEvent=Gc;window.ShadowRoot=wd;}var Zd=new Set("annotation-xml color-profile font-face font-face-src font-face-uri font-face-format font-face-name missing-glyph".split(" "));function $d(a){var b=Zd.has(a);a=/^[a-z][.0-9_a-z]*-[\-.0-9_a-z]*$/.test(a);return !b&&a}function K(a){var b=a.isConnected;if(void 0!==b)return b;for(;a&&!(a.__CE_isImportDocument||a instanceof Document);)a=a.parentNode||(window.ShadowRoot&&a instanceof ShadowRoot?a.host:void 0);return !(!a||!(a.__CE_isImportDocument||a instanceof Document))}
  function ae(a,b){for(;b&&b!==a&&!b.nextSibling;)b=b.parentNode;return b&&b!==a?b.nextSibling:null}
  function be(a,b,c){c=void 0===c?new Set:c;for(var d=a;d;){if(d.nodeType===Node.ELEMENT_NODE){var e=d;b(e);var f=e.localName;if("link"===f&&"import"===e.getAttribute("rel")){d=e.import;if(d instanceof Node&&!c.has(d))for(c.add(d),d=d.firstChild;d;d=d.nextSibling)be(d,b,c);d=ae(a,e);continue}else if("template"===f){d=ae(a,e);continue}if(e=e.__CE_shadowRoot)for(e=e.firstChild;e;e=e.nextSibling)be(e,b,c);}d=d.firstChild?d.firstChild:ae(a,d);}}function L(a,b,c){a[b]=c;}function ce(){this.a=new Map;this.u=new Map;this.c=[];this.f=[];this.b=!1;}function de(a,b,c){a.a.set(b,c);a.u.set(c.constructorFunction,c);}function ee(a,b){a.b=!0;a.c.push(b);}function fe(a,b){a.b=!0;a.f.push(b);}function ge(a,b){a.b&&be(b,function(b){return he(a,b)});}function he(a,b){if(a.b&&!b.__CE_patched){b.__CE_patched=!0;for(var c=0;c<a.c.length;c++)a.c[c](b);for(c=0;c<a.f.length;c++)a.f[c](b);}}
  function M(a,b){var c=[];be(b,function(a){return c.push(a)});for(b=0;b<c.length;b++){var d=c[b];1===d.__CE_state?a.connectedCallback(d):ie(a,d);}}function N(a,b){var c=[];be(b,function(a){return c.push(a)});for(b=0;b<c.length;b++){var d=c[b];1===d.__CE_state&&a.disconnectedCallback(d);}}
  function O(a,b,c){c=void 0===c?{}:c;var d=c.$a||new Set,e=c.fa||function(b){return ie(a,b)},f=[];be(b,function(b){if("link"===b.localName&&"import"===b.getAttribute("rel")){var c=b.import;c instanceof Node&&(c.__CE_isImportDocument=!0,c.__CE_hasRegistry=!0);c&&"complete"===c.readyState?c.__CE_documentLoadHandled=!0:b.addEventListener("load",function(){var c=b.import;if(!c.__CE_documentLoadHandled){c.__CE_documentLoadHandled=!0;var f=new Set(d);f.delete(c);O(a,c,{$a:f,fa:e});}});}else f.push(b);},d);
  if(a.b)for(b=0;b<f.length;b++)he(a,f[b]);for(b=0;b<f.length;b++)e(f[b]);}
  function ie(a,b){if(void 0===b.__CE_state){var c=b.ownerDocument;if(c.defaultView||c.__CE_isImportDocument&&c.__CE_hasRegistry)if(c=a.a.get(b.localName)){c.constructionStack.push(b);var d=c.constructorFunction;try{try{if(new d!==b)throw Error("The custom element constructor did not produce the element being upgraded.");}finally{c.constructionStack.pop();}}catch(g){throw b.__CE_state=2,g;}b.__CE_state=1;b.__CE_definition=c;if(c.attributeChangedCallback)for(c=c.observedAttributes,d=0;d<c.length;d++){var e=
  c[d],f=b.getAttribute(e);null!==f&&a.attributeChangedCallback(b,e,null,f,null);}K(b)&&a.connectedCallback(b);}}}ce.prototype.connectedCallback=function(a){var b=a.__CE_definition;b.connectedCallback&&b.connectedCallback.call(a);};ce.prototype.disconnectedCallback=function(a){var b=a.__CE_definition;b.disconnectedCallback&&b.disconnectedCallback.call(a);};
  ce.prototype.attributeChangedCallback=function(a,b,c,d,e){var f=a.__CE_definition;f.attributeChangedCallback&&-1<f.observedAttributes.indexOf(b)&&f.attributeChangedCallback.call(a,b,c,d,e);};function je(a){var b=document;this.b=a;this.a=b;this.P=void 0;O(this.b,this.a);"loading"===this.a.readyState&&(this.P=new MutationObserver(this.c.bind(this)),this.P.observe(this.a,{childList:!0,subtree:!0}));}function ke(a){a.P&&a.P.disconnect();}je.prototype.c=function(a){var b=this.a.readyState;"interactive"!==b&&"complete"!==b||ke(this);for(b=0;b<a.length;b++)for(var c=a[b].addedNodes,d=0;d<c.length;d++)O(this.b,c[d]);};function le(){var a=this;this.a=this.w=void 0;this.b=new Promise(function(b){a.a=b;a.w&&b(a.w);});}le.prototype.resolve=function(a){if(this.w)throw Error("Already resolved.");this.w=a;this.a&&this.a(a);};function P(a){this.c=!1;this.a=a;this.F=new Map;this.f=function(a){return a()};this.b=!1;this.u=[];this.aa=new je(a);}r=P.prototype;
  r.wa=function(a,b){var c=this;if(!(b instanceof Function))throw new TypeError("Custom element constructors must be functions.");if(!$d(a))throw new SyntaxError("The element name '"+a+"' is not valid.");if(this.a.a.get(a))throw Error("A custom element with name '"+a+"' has already been defined.");if(this.c)throw Error("A custom element is already being defined.");this.c=!0;try{var d=function(a){var b=e[a];if(void 0!==b&&!(b instanceof Function))throw Error("The '"+a+"' callback must be a function.");
  return b},e=b.prototype;if(!(e instanceof Object))throw new TypeError("The custom element constructor's prototype is not an object.");var f=d("connectedCallback");var g=d("disconnectedCallback");var h=d("adoptedCallback");var k=d("attributeChangedCallback");var l=b.observedAttributes||[];}catch(n){return}finally{this.c=!1;}b={localName:a,constructorFunction:b,connectedCallback:f,disconnectedCallback:g,adoptedCallback:h,attributeChangedCallback:k,observedAttributes:l,constructionStack:[]};de(this.a,
  a,b);this.u.push(b);this.b||(this.b=!0,this.f(function(){return me(c)}));};r.fa=function(a){O(this.a,a);};
  function me(a){if(!1!==a.b){a.b=!1;for(var b=a.u,c=[],d=new Map,e=0;e<b.length;e++)d.set(b[e].localName,[]);O(a.a,document,{fa:function(b){if(void 0===b.__CE_state){var e=b.localName,f=d.get(e);f?f.push(b):a.a.a.get(e)&&c.push(b);}}});for(e=0;e<c.length;e++)ie(a.a,c[e]);for(;0<b.length;){var f=b.shift();e=f.localName;f=d.get(f.localName);for(var g=0;g<f.length;g++)ie(a.a,f[g]);(e=a.F.get(e))&&e.resolve(void 0);}}}r.get=function(a){if(a=this.a.a.get(a))return a.constructorFunction};
  r.xa=function(a){if(!$d(a))return Promise.reject(new SyntaxError("'"+a+"' is not a valid custom element name."));var b=this.F.get(a);if(b)return b.b;b=new le;this.F.set(a,b);this.a.a.get(a)&&!this.u.some(function(b){return b.localName===a})&&b.resolve(void 0);return b.b};r.Ra=function(a){ke(this.aa);var b=this.f;this.f=function(c){return a(function(){return b(c)})};};window.CustomElementRegistry=P;P.prototype.define=P.prototype.wa;P.prototype.upgrade=P.prototype.fa;P.prototype.get=P.prototype.get;
  P.prototype.whenDefined=P.prototype.xa;P.prototype.polyfillWrapFlushCallback=P.prototype.Ra;var ne=window.Document.prototype.createElement,oe=window.Document.prototype.createElementNS,pe=window.Document.prototype.importNode,qe=window.Document.prototype.prepend,re=window.Document.prototype.append,se=window.DocumentFragment.prototype.prepend,te=window.DocumentFragment.prototype.append,ue=window.Node.prototype.cloneNode,ve=window.Node.prototype.appendChild,we=window.Node.prototype.insertBefore,xe=window.Node.prototype.removeChild,ye=window.Node.prototype.replaceChild,ze=Object.getOwnPropertyDescriptor(window.Node.prototype,
  "textContent"),Ae=window.Element.prototype.attachShadow,Be=Object.getOwnPropertyDescriptor(window.Element.prototype,"innerHTML"),Ce=window.Element.prototype.getAttribute,De=window.Element.prototype.setAttribute,Ee=window.Element.prototype.removeAttribute,Fe=window.Element.prototype.getAttributeNS,Ge=window.Element.prototype.setAttributeNS,He=window.Element.prototype.removeAttributeNS,Ie=window.Element.prototype.insertAdjacentElement,Je=window.Element.prototype.insertAdjacentHTML,Ke=window.Element.prototype.prepend,
  Le=window.Element.prototype.append,Me=window.Element.prototype.before,Ne=window.Element.prototype.after,Oe=window.Element.prototype.replaceWith,Pe=window.Element.prototype.remove,Qe=window.HTMLElement,Re=Object.getOwnPropertyDescriptor(window.HTMLElement.prototype,"innerHTML"),Se=window.HTMLElement.prototype.insertAdjacentElement,Te=window.HTMLElement.prototype.insertAdjacentHTML;var Ue=new function(){};function Ve(){var a=We;window.HTMLElement=function(){function b(){var b=this.constructor,d=a.u.get(b);if(!d)throw Error("The custom element being constructed was not registered with `customElements`.");var e=d.constructionStack;if(0===e.length)return e=ne.call(document,d.localName),Object.setPrototypeOf(e,b.prototype),e.__CE_state=1,e.__CE_definition=d,he(a,e),e;d=e.length-1;var f=e[d];if(f===Ue)throw Error("The HTMLElement constructor was either called reentrantly for this constructor or called multiple times.");
  e[d]=Ue;Object.setPrototypeOf(f,b.prototype);he(a,f);return f}b.prototype=Qe.prototype;Object.defineProperty(b.prototype,"constructor",{writable:!0,configurable:!0,enumerable:!1,value:b});return b}();}function Xe(a,b,c){function d(b){return function(c){for(var d=[],e=0;e<arguments.length;++e)d[e]=arguments[e];e=[];for(var f=[],l=0;l<d.length;l++){var n=d[l];n instanceof Element&&K(n)&&f.push(n);if(n instanceof DocumentFragment)for(n=n.firstChild;n;n=n.nextSibling)e.push(n);else e.push(n);}b.apply(this,d);for(d=0;d<f.length;d++)N(a,f[d]);if(K(this))for(d=0;d<e.length;d++)f=e[d],f instanceof Element&&M(a,f);}}void 0!==c.da&&(b.prepend=d(c.da));void 0!==c.append&&(b.append=d(c.append));}function Ye(){var a=We;L(Document.prototype,"createElement",function(b){if(this.__CE_hasRegistry){var c=a.a.get(b);if(c)return new c.constructorFunction}b=ne.call(this,b);he(a,b);return b});L(Document.prototype,"importNode",function(b,c){b=pe.call(this,b,!!c);this.__CE_hasRegistry?O(a,b):ge(a,b);return b});L(Document.prototype,"createElementNS",function(b,c){if(this.__CE_hasRegistry&&(null===b||"http://www.w3.org/1999/xhtml"===b)){var d=a.a.get(c);if(d)return new d.constructorFunction}b=oe.call(this,
  b,c);he(a,b);return b});Xe(a,Document.prototype,{da:qe,append:re});}function Ze(){function a(a,d){Object.defineProperty(a,"textContent",{enumerable:d.enumerable,configurable:!0,get:d.get,set:function(a){if(this.nodeType===Node.TEXT_NODE)d.set.call(this,a);else{var c=void 0;if(this.firstChild){var e=this.childNodes,h=e.length;if(0<h&&K(this)){c=Array(h);for(var k=0;k<h;k++)c[k]=e[k];}}d.set.call(this,a);if(c)for(a=0;a<c.length;a++)N(b,c[a]);}}});}var b=We;L(Node.prototype,"insertBefore",function(a,d){if(a instanceof DocumentFragment){var c=Array.prototype.slice.apply(a.childNodes);
  a=we.call(this,a,d);if(K(this))for(d=0;d<c.length;d++)M(b,c[d]);return a}c=K(a);d=we.call(this,a,d);c&&N(b,a);K(this)&&M(b,a);return d});L(Node.prototype,"appendChild",function(a){if(a instanceof DocumentFragment){var c=Array.prototype.slice.apply(a.childNodes);a=ve.call(this,a);if(K(this))for(var e=0;e<c.length;e++)M(b,c[e]);return a}c=K(a);e=ve.call(this,a);c&&N(b,a);K(this)&&M(b,a);return e});L(Node.prototype,"cloneNode",function(a){a=ue.call(this,!!a);this.ownerDocument.__CE_hasRegistry?O(b,a):
  ge(b,a);return a});L(Node.prototype,"removeChild",function(a){var c=K(a),e=xe.call(this,a);c&&N(b,a);return e});L(Node.prototype,"replaceChild",function(a,d){if(a instanceof DocumentFragment){var c=Array.prototype.slice.apply(a.childNodes);a=ye.call(this,a,d);if(K(this))for(N(b,d),d=0;d<c.length;d++)M(b,c[d]);return a}c=K(a);var f=ye.call(this,a,d),g=K(this);g&&N(b,d);c&&N(b,a);g&&M(b,a);return f});ze&&ze.get?a(Node.prototype,ze):ee(b,function(b){a(b,{enumerable:!0,configurable:!0,get:function(){for(var a=
  [],b=0;b<this.childNodes.length;b++){var c=this.childNodes[b];c.nodeType!==Node.COMMENT_NODE&&a.push(c.textContent);}return a.join("")},set:function(a){for(;this.firstChild;)xe.call(this,this.firstChild);null!=a&&""!==a&&ve.call(this,document.createTextNode(a));}});});}function $e(a){function b(b){return function(c){for(var d=[],e=0;e<arguments.length;++e)d[e]=arguments[e];e=[];for(var h=[],k=0;k<d.length;k++){var l=d[k];l instanceof Element&&K(l)&&h.push(l);if(l instanceof DocumentFragment)for(l=l.firstChild;l;l=l.nextSibling)e.push(l);else e.push(l);}b.apply(this,d);for(d=0;d<h.length;d++)N(a,h[d]);if(K(this))for(d=0;d<e.length;d++)h=e[d],h instanceof Element&&M(a,h);}}var c=Element.prototype;void 0!==Me&&(c.before=b(Me));void 0!==Me&&(c.after=b(Ne));void 0!==Oe&&
  L(c,"replaceWith",function(b){for(var c=[],d=0;d<arguments.length;++d)c[d]=arguments[d];d=[];for(var g=[],h=0;h<c.length;h++){var k=c[h];k instanceof Element&&K(k)&&g.push(k);if(k instanceof DocumentFragment)for(k=k.firstChild;k;k=k.nextSibling)d.push(k);else d.push(k);}h=K(this);Oe.apply(this,c);for(c=0;c<g.length;c++)N(a,g[c]);if(h)for(N(a,this),c=0;c<d.length;c++)g=d[c],g instanceof Element&&M(a,g);});void 0!==Pe&&L(c,"remove",function(){var b=K(this);Pe.call(this);b&&N(a,this);});}function af(){function a(a,b){Object.defineProperty(a,"innerHTML",{enumerable:b.enumerable,configurable:!0,get:b.get,set:function(a){var c=this,e=void 0;K(this)&&(e=[],be(this,function(a){a!==c&&e.push(a);}));b.set.call(this,a);if(e)for(var f=0;f<e.length;f++){var g=e[f];1===g.__CE_state&&d.disconnectedCallback(g);}this.ownerDocument.__CE_hasRegistry?O(d,this):ge(d,this);return a}});}function b(a,b){L(a,"insertAdjacentElement",function(a,c){var e=K(c);a=b.call(this,a,c);e&&N(d,c);K(a)&&M(d,c);return a});}
  function c(a,b){function c(a,b){for(var c=[];a!==b;a=a.nextSibling)c.push(a);for(b=0;b<c.length;b++)O(d,c[b]);}L(a,"insertAdjacentHTML",function(a,d){a=a.toLowerCase();if("beforebegin"===a){var e=this.previousSibling;b.call(this,a,d);c(e||this.parentNode.firstChild,this);}else if("afterbegin"===a)e=this.firstChild,b.call(this,a,d),c(this.firstChild,e);else if("beforeend"===a)e=this.lastChild,b.call(this,a,d),c(e||this.firstChild,null);else if("afterend"===a)e=this.nextSibling,b.call(this,a,d),c(this.nextSibling,
  e);else throw new SyntaxError("The value provided ("+String(a)+") is not one of 'beforebegin', 'afterbegin', 'beforeend', or 'afterend'.");});}var d=We;Ae&&L(Element.prototype,"attachShadow",function(a){a=Ae.call(this,a);var b=d;if(b.b&&!a.__CE_patched){a.__CE_patched=!0;for(var c=0;c<b.c.length;c++)b.c[c](a);}return this.__CE_shadowRoot=a});Be&&Be.get?a(Element.prototype,Be):Re&&Re.get?a(HTMLElement.prototype,Re):fe(d,function(b){a(b,{enumerable:!0,configurable:!0,get:function(){return ue.call(this,
  !0).innerHTML},set:function(a){var b="template"===this.localName,c=b?this.content:this,d=oe.call(document,this.namespaceURI,this.localName);for(d.innerHTML=a;0<c.childNodes.length;)xe.call(c,c.childNodes[0]);for(a=b?d.content:d;0<a.childNodes.length;)ve.call(c,a.childNodes[0]);}});});L(Element.prototype,"setAttribute",function(a,b){if(1!==this.__CE_state)return De.call(this,a,b);var c=Ce.call(this,a);De.call(this,a,b);b=Ce.call(this,a);d.attributeChangedCallback(this,a,c,b,null);});L(Element.prototype,
  "setAttributeNS",function(a,b,c){if(1!==this.__CE_state)return Ge.call(this,a,b,c);var e=Fe.call(this,a,b);Ge.call(this,a,b,c);c=Fe.call(this,a,b);d.attributeChangedCallback(this,b,e,c,a);});L(Element.prototype,"removeAttribute",function(a){if(1!==this.__CE_state)return Ee.call(this,a);var b=Ce.call(this,a);Ee.call(this,a);null!==b&&d.attributeChangedCallback(this,a,b,null,null);});L(Element.prototype,"removeAttributeNS",function(a,b){if(1!==this.__CE_state)return He.call(this,a,b);var c=Fe.call(this,
  a,b);He.call(this,a,b);var e=Fe.call(this,a,b);c!==e&&d.attributeChangedCallback(this,b,c,e,a);});Se?b(HTMLElement.prototype,Se):Ie?b(Element.prototype,Ie):console.warn("Custom Elements: `Element#insertAdjacentElement` was not patched.");Te?c(HTMLElement.prototype,Te):Je?c(Element.prototype,Je):console.warn("Custom Elements: `Element#insertAdjacentHTML` was not patched.");Xe(d,Element.prototype,{da:Ke,append:Le});$e(d);}var bf=window.customElements;if(!bf||bf.forcePolyfill||"function"!=typeof bf.define||"function"!=typeof bf.get){var We=new ce;Ve();Ye();Xe(We,DocumentFragment.prototype,{da:se,append:te});Ze();af();document.__CE_hasRegistry=!0;var customElements=new P(We);Object.defineProperty(window,"customElements",{configurable:!0,enumerable:!0,value:customElements});}function cf(){this.end=this.start=0;this.rules=this.parent=this.previous=null;this.cssText=this.parsedCssText="";this.atRule=!1;this.type=0;this.parsedSelector=this.selector=this.keyframesName="";}
  function df(a){a=a.replace(ef,"").replace(ff,"");var b=gf,c=a,d=new cf;d.start=0;d.end=c.length;for(var e=d,f=0,g=c.length;f<g;f++)if("{"===c[f]){e.rules||(e.rules=[]);var h=e,k=h.rules[h.rules.length-1]||null;e=new cf;e.start=f+1;e.parent=h;e.previous=k;h.rules.push(e);}else"}"===c[f]&&(e.end=f+1,e=e.parent||d);return b(d,a)}
  function gf(a,b){var c=b.substring(a.start,a.end-1);a.parsedCssText=a.cssText=c.trim();a.parent&&(c=b.substring(a.previous?a.previous.end:a.parent.start,a.start-1),c=hf(c),c=c.replace(jf," "),c=c.substring(c.lastIndexOf(";")+1),c=a.parsedSelector=a.selector=c.trim(),a.atRule=0===c.indexOf("@"),a.atRule?0===c.indexOf("@media")?a.type=kf:c.match(lf)&&(a.type=mf,a.keyframesName=a.selector.split(jf).pop()):a.type=0===c.indexOf("--")?nf:of);if(c=a.rules)for(var d=0,e=c.length,f=void 0;d<e&&(f=c[d]);d++)gf(f,
  b);return a}function hf(a){return a.replace(/\\([0-9a-f]{1,6})\s/gi,function(a,c){a=c;for(c=6-a.length;c--;)a="0"+a;return "\\"+a})}
  function pf(a,b,c){c=void 0===c?"":c;var d="";if(a.cssText||a.rules){var e=a.rules,f;if(f=e)f=e[0],f=!(f&&f.selector&&0===f.selector.indexOf("--"));if(f){f=0;for(var g=e.length,h=void 0;f<g&&(h=e[f]);f++)d=pf(h,b,d);}else b?b=a.cssText:(b=a.cssText,b=b.replace(qf,"").replace(rf,""),b=b.replace(uf,"").replace(vf,"")),(d=b.trim())&&(d="  "+d+"\n");}d&&(a.selector&&(c+=a.selector+" {\n"),c+=d,a.selector&&(c+="}\n\n"));return c}
  var of=1,mf=7,kf=4,nf=1E3,ef=/\/\*[^*]*\*+([^/*][^*]*\*+)*\//gim,ff=/@import[^;]*;/gim,qf=/(?:^[^;\-\s}]+)?--[^;{}]*?:[^{};]*?(?:[;\n]|$)/gim,rf=/(?:^[^;\-\s}]+)?--[^;{}]*?:[^{};]*?{[^}]*?}(?:[;\n]|$)?/gim,uf=/@apply\s*\(?[^);]*\)?\s*(?:[;\n]|$)?/gim,vf=/[^;:]*?:[^;]*?var\([^;]*\)(?:[;\n]|$)?/gim,lf=/^@[^\s]*keyframes/,jf=/\s+/g;var R=!(window.ShadyDOM&&window.ShadyDOM.inUse),wf;function xf(a){wf=a&&a.shimcssproperties?!1:R||!(navigator.userAgent.match(/AppleWebKit\/601|Edge\/15/)||!window.CSS||!CSS.supports||!CSS.supports("box-shadow","0 0 0 var(--foo)"));}var yf;window.ShadyCSS&&void 0!==window.ShadyCSS.cssBuild&&(yf=window.ShadyCSS.cssBuild);var zf=!(!window.ShadyCSS||!window.ShadyCSS.disableRuntime);
  window.ShadyCSS&&void 0!==window.ShadyCSS.nativeCss?wf=window.ShadyCSS.nativeCss:window.ShadyCSS?(xf(window.ShadyCSS),window.ShadyCSS=void 0):xf(window.WebComponents&&window.WebComponents.flags);var S=wf,Af=yf;var Bf=/(?:^|[;\s{]\s*)(--[\w-]*?)\s*:\s*(?:((?:'(?:\\'|.)*?'|"(?:\\"|.)*?"|\([^)]*?\)|[^};{])+)|\{([^}]*)\}(?:(?=[;\s}])|$))/gi,Cf=/(?:^|\W+)@apply\s*\(?([^);\n]*)\)?/gi,Df=/(--[\w-]+)\s*([:,;)]|$)/gi,Ef=/(animation\s*:)|(animation-name\s*:)/,Ff=/@media\s(.*)/,Gf=/\{[^}]*\}/g;var Hf=new Set;function If(a,b){if(!a)return "";"string"===typeof a&&(a=df(a));b&&Jf(a,b);return pf(a,S)}function Kf(a){!a.__cssRules&&a.textContent&&(a.__cssRules=df(a.textContent));return a.__cssRules||null}function Lf(a){return !!a.parent&&a.parent.type===mf}function Jf(a,b,c,d){if(a){var e=!1,f=a.type;if(d&&f===kf){var g=a.selector.match(Ff);g&&(window.matchMedia(g[1]).matches||(e=!0));}f===of?b(a):c&&f===mf?c(a):f===nf&&(e=!0);if((a=a.rules)&&!e)for(e=0,f=a.length,g=void 0;e<f&&(g=a[e]);e++)Jf(g,b,c,d);}}
  function Mf(a,b,c,d){var e=document.createElement("style");b&&e.setAttribute("scope",b);e.textContent=a;Nf(e,c,d);return e}var Of=null;function Pf(a){a=document.createComment(" Shady DOM styles for "+a+" ");var b=document.head;b.insertBefore(a,(Of?Of.nextSibling:null)||b.firstChild);return Of=a}function Nf(a,b,c){b=b||document.head;b.insertBefore(a,c&&c.nextSibling||b.firstChild);Of?a.compareDocumentPosition(Of)===Node.DOCUMENT_POSITION_PRECEDING&&(Of=a):Of=a;}
  function Qf(a,b){for(var c=0,d=a.length;b<d;b++)if("("===a[b])c++;else if(")"===a[b]&&0===--c)return b;return -1}function Rf(a,b){var c=a.indexOf("var(");if(-1===c)return b(a,"","","");var d=Qf(a,c+3),e=a.substring(c+4,d);c=a.substring(0,c);a=Rf(a.substring(d+1),b);d=e.indexOf(",");return -1===d?b(c,e.trim(),"",a):b(c,e.substring(0,d).trim(),e.substring(d+1).trim(),a)}function Sf(a,b){R?a.setAttribute("class",b):window.ShadyDOM.nativeMethods.setAttribute.call(a,"class",b);}
  var Tf=window.ShadyDOM&&window.ShadyDOM.wrap||function(a){return a};function Uf(a){var b=a.localName,c="";b?-1<b.indexOf("-")||(c=b,b=a.getAttribute&&a.getAttribute("is")||""):(b=a.is,c=a.extends);return {is:b,X:c}}function Vf(a){for(var b=[],c="",d=0;0<=d&&d<a.length;d++)if("("===a[d]){var e=Qf(a,d);c+=a.slice(d,e+1);d=e;}else","===a[d]?(b.push(c),c=""):c+=a[d];c&&b.push(c);return b}
  function Wf(a){if(void 0!==Af)return Af;if(void 0===a.__cssBuild){var b=a.getAttribute("css-build");if(b)a.__cssBuild=b;else{a:{b="template"===a.localName?a.content.firstChild:a.firstChild;if(b instanceof Comment&&(b=b.textContent.trim().split(":"),"css-build"===b[0])){b=b[1];break a}b="";}if(""!==b){var c="template"===a.localName?a.content.firstChild:a.firstChild;c.parentNode.removeChild(c);}a.__cssBuild=b;}}return a.__cssBuild||""}
  function Xf(a){a=void 0===a?"":a;return ""!==a&&S?R?"shadow"===a:"shady"===a:!1}function Yf(){}function Zf(a,b){$f(U,a,function(a){ag(a,b||"");});}function $f(a,b,c){b.nodeType===Node.ELEMENT_NODE&&c(b);var d;"template"===b.localName?d=(b.content||b._content||b).childNodes:d=b.children||b.childNodes;if(d)for(b=0;b<d.length;b++)$f(a,d[b],c);}
  function ag(a,b,c){if(b)if(a.classList)c?(a.classList.remove("style-scope"),a.classList.remove(b)):(a.classList.add("style-scope"),a.classList.add(b));else if(a.getAttribute){var d=a.getAttribute("class");c?d&&(b=d.replace("style-scope","").replace(b,""),Sf(a,b)):Sf(a,(d?d+" ":"")+"style-scope "+b);}}function bg(a,b,c){$f(U,a,function(a){ag(a,b,!0);ag(a,c);});}function cg(a,b){$f(U,a,function(a){ag(a,b||"",!0);});}
  function dg(a,b,c,d,e){var f=U;e=void 0===e?"":e;""===e&&(R||"shady"===(void 0===d?"":d)?e=If(b,c):(a=Uf(a),e=eg(f,b,a.is,a.X,c)+"\n\n"));return e.trim()}function eg(a,b,c,d,e){var f=fg(c,d);c=c?"."+c:"";return If(b,function(b){b.c||(b.selector=b.C=gg(a,b,a.b,c,f),b.c=!0);e&&e(b,c,f);})}function fg(a,b){return b?"[is="+a+"]":a}
  function gg(a,b,c,d,e){var f=Vf(b.selector);if(!Lf(b)){b=0;for(var g=f.length,h=void 0;b<g&&(h=f[b]);b++)f[b]=c.call(a,h,d,e);}return f.filter(function(a){return !!a}).join(",")}function hg(a){return a.replace(ig,function(a,c,d){-1<d.indexOf("+")?d=d.replace(/\+/g,"___"):-1<d.indexOf("___")&&(d=d.replace(/___/g,"+"));return ":"+c+"("+d+")"})}
  function jg(a){for(var b=[],c;c=a.match(kg);){var d=c.index,e=Qf(a,d);if(-1===e)throw Error(c.input+" selector missing ')'");c=a.slice(d,e+1);a=a.replace(c,"\ue000");b.push(c);}return {na:a,matches:b}}function lg(a,b){var c=a.split("\ue000");return b.reduce(function(a,b,f){return a+b+c[f+1]},c[0])}
  Yf.prototype.b=function(a,b,c){var d=!1;a=a.trim();var e=ig.test(a);e&&(a=a.replace(ig,function(a,b,c){return ":"+b+"("+c.replace(/\s/g,"")+")"}),a=hg(a));var f=kg.test(a);if(f){var g=jg(a);a=g.na;g=g.matches;}a=a.replace(mg,":host $1");a=a.replace(ng,function(a,e,f){d||(a=og(f,e,b,c),d=d||a.stop,e=a.Ha,f=a.value);return e+f});f&&(a=lg(a,g));e&&(a=hg(a));return a=a.replace(pg,function(a,b,c,d){return '[dir="'+c+'"] '+b+d+", "+b+'[dir="'+c+'"]'+d})};
  function og(a,b,c,d){var e=a.indexOf("::slotted");0<=a.indexOf(":host")?a=qg(a,d):0!==e&&(a=c?rg(a,c):a);c=!1;0<=e&&(b="",c=!0);if(c){var f=!0;c&&(a=a.replace(sg,function(a,b){return " > "+b}));}return {value:a,Ha:b,stop:f}}function rg(a,b){a=a.split(/(\[.+?\])/);for(var c=[],d=0;d<a.length;d++)if(1===d%2)c.push(a[d]);else{var e=a[d];if(""!==e||d!==a.length-1)e=e.split(":"),e[0]+=b,c.push(e.join(":"));}return c.join("")}
  function qg(a,b){var c=a.match(tg);return (c=c&&c[2].trim()||"")?c[0].match(ug)?a.replace(tg,function(a,c,f){return b+f}):c.split(ug)[0]===b?c:"should_not_match":a.replace(":host",b)}function vg(a){":root"===a.selector&&(a.selector="html");}Yf.prototype.c=function(a){return a.match(":host")?"":a.match("::slotted")?this.b(a,":not(.style-scope)"):rg(a.trim(),":not(.style-scope)")};t.Object.defineProperties(Yf.prototype,{a:{configurable:!0,enumerable:!0,get:function(){return "style-scope"}}});
  var ig=/:(nth[-\w]+)\(([^)]+)\)/,ng=/(^|[\s>+~]+)((?:\[.+?\]|[^\s>+~=[])+)/g,ug=/[[.:#*]/,mg=/^(::slotted)/,tg=/(:host)(?:\(((?:\([^)(]*\)|[^)(]*)+?)\))/,sg=/(?:::slotted)(?:\(((?:\([^)(]*\)|[^)(]*)+?)\))/,pg=/(.*):dir\((?:(ltr|rtl))\)(.*)/,kg=/:(?:matches|any|-(?:webkit|moz)-any)/,U=new Yf;function wg(a,b,c,d,e){this.L=a||null;this.b=b||null;this.la=c||[];this.G=null;this.cssBuild=e||"";this.X=d||"";this.a=this.H=this.K=null;}function V(a){return a?a.__styleInfo:null}function xg(a,b){return a.__styleInfo=b}wg.prototype.c=function(){return this.L};wg.prototype._getStyleRules=wg.prototype.c;function yg(a){var b=this.matches||this.matchesSelector||this.mozMatchesSelector||this.msMatchesSelector||this.oMatchesSelector||this.webkitMatchesSelector;return b&&b.call(this,a)}var zg=navigator.userAgent.match("Trident");function Ag(){}function Bg(a){var b={},c=[],d=0;Jf(a,function(a){Cg(a);a.index=d++;a=a.A.cssText;for(var c;c=Df.exec(a);){var e=c[1];":"!==c[2]&&(b[e]=!0);}},function(a){c.push(a);});a.b=c;a=[];for(var e in b)a.push(e);return a}
  function Cg(a){if(!a.A){var b={},c={};Dg(a,c)&&(b.J=c,a.rules=null);b.cssText=a.parsedCssText.replace(Gf,"").replace(Bf,"");a.A=b;}}function Dg(a,b){var c=a.A;if(c){if(c.J)return Object.assign(b,c.J),!0}else{c=a.parsedCssText;for(var d;a=Bf.exec(c);){d=(a[2]||a[3]).trim();if("inherit"!==d||"unset"!==d)b[a[1].trim()]=d;d=!0;}return d}}
  function Eg(a,b,c){b&&(b=0<=b.indexOf(";")?Fg(a,b,c):Rf(b,function(b,e,f,g){if(!e)return b+g;(e=Eg(a,c[e],c))&&"initial"!==e?"apply-shim-inherit"===e&&(e="inherit"):e=Eg(a,c[f]||f,c)||f;return b+(e||"")+g}));return b&&b.trim()||""}
  function Fg(a,b,c){b=b.split(";");for(var d=0,e,f;d<b.length;d++)if(e=b[d]){Cf.lastIndex=0;if(f=Cf.exec(e))e=Eg(a,c[f[1]],c);else if(f=e.indexOf(":"),-1!==f){var g=e.substring(f);g=g.trim();g=Eg(a,g,c)||g;e=e.substring(0,f)+g;}b[d]=e&&e.lastIndexOf(";")===e.length-1?e.slice(0,-1):e||"";}return b.join(";")}
  function Gg(a,b){var c={},d=[];Jf(a,function(a){a.A||Cg(a);var e=a.C||a.parsedSelector;b&&a.A.J&&e&&yg.call(b,e)&&(Dg(a,c),a=a.index,e=parseInt(a/32,10),d[e]=(d[e]||0)|1<<a%32);},null,!0);return {J:c,key:d}}
  function Hg(a,b,c,d){b.A||Cg(b);if(b.A.J){var e=Uf(a);a=e.is;e=e.X;e=a?fg(a,e):"html";var f=b.parsedSelector,g=":host > *"===f||"html"===f,h=0===f.indexOf(":host")&&!g;"shady"===c&&(g=f===e+" > *."+e||-1!==f.indexOf("html"),h=!g&&0===f.indexOf(e));if(g||h)c=e,h&&(b.C||(b.C=gg(U,b,U.b,a?"."+a:"",e)),c=b.C||e),d({na:c,Oa:h,bb:g});}}function Ig(a,b,c){var d={},e={};Jf(b,function(b){Hg(a,b,c,function(c){yg.call(a._element||a,c.na)&&(c.Oa?Dg(b,d):Dg(b,e));});},null,!0);return {Ua:e,Ma:d}}
  function Jg(a,b,c,d){var e=Uf(b),f=fg(e.is,e.X),g=new RegExp("(?:^|[^.#[:])"+(b.extends?"\\"+f.slice(0,-1)+"\\]":f)+"($|[.:[\\s>+~])"),h=V(b);e=h.L;h=h.cssBuild;var k=Kg(e,d);return dg(b,e,function(b){var e="";b.A||Cg(b);b.A.cssText&&(e=Fg(a,b.A.cssText,c));b.cssText=e;if(!R&&!Lf(b)&&b.cssText){var h=e=b.cssText;null==b.ra&&(b.ra=Ef.test(e));if(b.ra)if(null==b.ba){b.ba=[];for(var l in k)h=k[l],h=h(e),e!==h&&(e=h,b.ba.push(l));}else{for(l=0;l<b.ba.length;++l)h=k[b.ba[l]],e=h(e);h=e;}b.cssText=h;b.C=
  b.C||b.selector;e="."+d;l=Vf(b.C);h=0;for(var v=l.length,x=void 0;h<v&&(x=l[h]);h++)l[h]=x.match(g)?x.replace(f,e):e+" "+x;b.selector=l.join(",");}},h)}function Kg(a,b){a=a.b;var c={};if(!R&&a)for(var d=0,e=a[d];d<a.length;e=a[++d]){var f=e,g=b;f.f=new RegExp("\\b"+f.keyframesName+"(?!\\B|-)","g");f.a=f.keyframesName+"-"+g;f.C=f.C||f.selector;f.selector=f.C.replace(f.keyframesName,f.a);c[e.keyframesName]=Lg(e);}return c}function Lg(a){return function(b){return b.replace(a.f,a.a)}}
  function Mg(a,b){var c=Ng,d=Kf(a);a.textContent=If(d,function(a){var d=a.cssText=a.parsedCssText;a.A&&a.A.cssText&&(d=d.replace(qf,"").replace(rf,""),a.cssText=Fg(c,d,b));});}t.Object.defineProperties(Ag.prototype,{a:{configurable:!0,enumerable:!0,get:function(){return "x-scope"}}});var Ng=new Ag;var Og={},Pg=window.customElements;if(Pg&&!R&&!zf){var Qg=Pg.define;Pg.define=function(a,b,c){Og[a]||(Og[a]=Pf(a));Qg.call(Pg,a,b,c);};}function Rg(){this.cache={};}Rg.prototype.store=function(a,b,c,d){var e=this.cache[a]||[];e.push({J:b,styleElement:c,H:d});100<e.length&&e.shift();this.cache[a]=e;};function Sg(){}var Tg=new RegExp(U.a+"\\s*([^\\s]*)");function Ug(a){return (a=(a.classList&&a.classList.value?a.classList.value:a.getAttribute("class")||"").match(Tg))?a[1]:""}function Vg(a){var b=Tf(a).getRootNode();return b===a||b===a.ownerDocument?"":(a=b.host)?Uf(a).is:""}
  function Wg(a){for(var b=0;b<a.length;b++){var c=a[b];if(c.target!==document.documentElement&&c.target!==document.head)for(var d=0;d<c.addedNodes.length;d++){var e=c.addedNodes[d];if(e.nodeType===Node.ELEMENT_NODE){var f=e.getRootNode(),g=Ug(e);if(g&&f===e.ownerDocument&&("style"!==e.localName&&"template"!==e.localName||""===Wf(e)))cg(e,g);else if(f instanceof ShadowRoot)for(f=Vg(e),f!==g&&bg(e,g,f),e=window.ShadyDOM.nativeMethods.querySelectorAll.call(e,":not(."+U.a+")"),g=0;g<e.length;g++){f=e[g];
  var h=Vg(f);h&&ag(f,h);}}}}}
  if(!(R||window.ShadyDOM&&window.ShadyDOM.handlesDynamicScoping)){var Xg=new MutationObserver(Wg),Yg=function(a){Xg.observe(a,{childList:!0,subtree:!0});};if(window.customElements&&!window.customElements.polyfillWrapFlushCallback)Yg(document);else{var Zg=function(){Yg(document.body);};window.HTMLImports?window.HTMLImports.whenReady(Zg):requestAnimationFrame(function(){if("loading"===document.readyState){var a=function(){Zg();document.removeEventListener("readystatechange",a);};document.addEventListener("readystatechange",
  a);}else Zg();});}Sg=function(){Wg(Xg.takeRecords());};}var $g=Sg;var ah={};var bh=Promise.resolve();function ch(a){if(a=ah[a])a._applyShimCurrentVersion=a._applyShimCurrentVersion||0,a._applyShimValidatingVersion=a._applyShimValidatingVersion||0,a._applyShimNextVersion=(a._applyShimNextVersion||0)+1;}function dh(a){return a._applyShimCurrentVersion===a._applyShimNextVersion}function eh(a){a._applyShimValidatingVersion=a._applyShimNextVersion;a._validating||(a._validating=!0,bh.then(function(){a._applyShimCurrentVersion=a._applyShimNextVersion;a._validating=!1;}));}var fh={},gh=new Rg;function W(){this.F={};this.c=document.documentElement;var a=new cf;a.rules=[];this.f=xg(this.c,new wg(a));this.u=!1;this.b=this.a=null;}r=W.prototype;r.flush=function(){$g();};r.Ka=function(a){return Kf(a)};r.Ya=function(a){return If(a)};r.prepareTemplate=function(a,b,c){this.prepareTemplateDom(a,b);this.prepareTemplateStyles(a,b,c);};
  r.prepareTemplateStyles=function(a,b,c){if(!a._prepared&&!zf){R||Og[b]||(Og[b]=Pf(b));a._prepared=!0;a.name=b;a.extends=c;ah[b]=a;var d=Wf(a),e=Xf(d);c={is:b,extends:c};for(var f=[],g=a.content.querySelectorAll("style"),h=0;h<g.length;h++){var k=g[h];if(k.hasAttribute("shady-unscoped")){if(!R){var l=k.textContent;Hf.has(l)||(Hf.add(l),l=k.cloneNode(!0),document.head.appendChild(l));k.parentNode.removeChild(k);}}else f.push(k.textContent),k.parentNode.removeChild(k);}f=f.join("").trim()+(fh[b]||"");
  hh(this);if(!e){if(g=!d)g=Cf.test(f)||Bf.test(f),Cf.lastIndex=0,Bf.lastIndex=0;h=df(f);g&&S&&this.a&&this.a.transformRules(h,b);a._styleAst=h;}g=[];S||(g=Bg(a._styleAst));if(!g.length||S)h=R?a.content:null,b=Og[b]||null,d=dg(c,a._styleAst,null,d,e?f:""),d=d.length?Mf(d,c.is,h,b):null,a._style=d;a.a=g;}};r.Sa=function(a,b){fh[b]=a.join(" ");};r.prepareTemplateDom=function(a,b){if(!zf){var c=Wf(a);R||"shady"===c||a._domPrepared||(a._domPrepared=!0,Zf(a.content,b));}};
  function ih(a){var b=Uf(a),c=b.is;b=b.X;var d=Og[c]||null,e=ah[c];if(e){c=e._styleAst;var f=e.a;e=Wf(e);b=new wg(c,d,f,b,e);xg(a,b);return b}}function jh(a){!a.b&&window.ShadyCSS&&window.ShadyCSS.CustomStyleInterface&&(a.b=window.ShadyCSS.CustomStyleInterface,a.b.transformCallback=function(b){a.va(b);},a.b.validateCallback=function(){requestAnimationFrame(function(){(a.b.enqueued||a.u)&&a.flushCustomStyles();});});}
  function hh(a){!a.a&&window.ShadyCSS&&window.ShadyCSS.ApplyShim&&(a.a=window.ShadyCSS.ApplyShim,a.a.invalidCallback=ch);jh(a);}
  r.flushCustomStyles=function(){if(!zf&&(hh(this),this.b)){var a=this.b.processStyles();if(this.b.enqueued&&!Xf(this.f.cssBuild)){if(S){if(!this.f.cssBuild)for(var b=0;b<a.length;b++){var c=this.b.getStyleForCustomStyle(a[b]);if(c&&S&&this.a){var d=Kf(c);hh(this);this.a.transformRules(d);c.textContent=If(d);}}}else{kh(this,this.c,this.f);for(b=0;b<a.length;b++)(c=this.b.getStyleForCustomStyle(a[b]))&&Mg(c,this.f.K);this.u&&this.styleDocument();}this.b.enqueued=!1;}}};
  r.styleElement=function(a,b){if(zf){if(b){V(a)||xg(a,new wg(null));var c=V(a);c.G=c.G||{};Object.assign(c.G,b);lh(this,a,c);}}else if(c=V(a)||ih(a))if(a!==this.c&&(this.u=!0),b&&(c.G=c.G||{},Object.assign(c.G,b)),S)lh(this,a,c);else if(this.flush(),kh(this,a,c),c.la&&c.la.length){b=Uf(a).is;var d;a:{if(d=gh.cache[b])for(var e=d.length-1;0<=e;e--){var f=d[e];b:{var g=c.la;for(var h=0;h<g.length;h++){var k=g[h];if(f.J[k]!==c.K[k]){g=!1;break b}}g=!0;}if(g){d=f;break a}}d=void 0;}g=d?d.styleElement:null;
  e=c.H;(f=d&&d.H)||(f=this.F[b]=(this.F[b]||0)+1,f=b+"-"+f);c.H=f;f=c.H;h=Ng;h=g?g.textContent||"":Jg(h,a,c.K,f);k=V(a);var l=k.a;l&&!R&&l!==g&&(l._useCount--,0>=l._useCount&&l.parentNode&&l.parentNode.removeChild(l));R?k.a?(k.a.textContent=h,g=k.a):h&&(g=Mf(h,f,a.shadowRoot,k.b)):g?g.parentNode||(zg&&-1<h.indexOf("@media")&&(g.textContent=h),Nf(g,null,k.b)):h&&(g=Mf(h,f,null,k.b));g&&(g._useCount=g._useCount||0,k.a!=g&&g._useCount++,k.a=g);f=g;R||(g=c.H,k=h=a.getAttribute("class")||"",e&&(k=h.replace(new RegExp("\\s*x-scope\\s*"+
  e+"\\s*","g")," ")),k+=(k?" ":"")+"x-scope "+g,h!==k&&Sf(a,k));d||gh.store(b,c.K,f,c.H);}};
  function lh(a,b,c){var d=Uf(b).is;if(c.G){var e=c.G,f;for(f in e)null===f?b.style.removeProperty(f):b.style.setProperty(f,e[f]);}e=ah[d];if(!(!e&&b!==a.c||e&&""!==Wf(e))&&e&&e._style&&!dh(e)){if(dh(e)||e._applyShimValidatingVersion!==e._applyShimNextVersion)hh(a),a.a&&a.a.transformRules(e._styleAst,d),e._style.textContent=dg(b,c.L),eh(e);R&&(a=b.shadowRoot)&&(a=a.querySelector("style"))&&(a.textContent=dg(b,c.L));c.L=e._styleAst;}}
  function mh(a,b){return (b=Tf(b).getRootNode().host)?V(b)||ih(b)?b:mh(a,b):a.c}function kh(a,b,c){var d=mh(a,b),e=V(d),f=e.K;d===a.c||f||(kh(a,d,e),f=e.K);a=Object.create(f||null);d=Ig(b,c.L,c.cssBuild);b=Gg(e.L,b).J;Object.assign(a,d.Ma,b,d.Ua);b=c.G;for(var g in b)if((e=b[g])||0===e)a[g]=e;g=Ng;b=Object.getOwnPropertyNames(a);for(e=0;e<b.length;e++)d=b[e],a[d]=Eg(g,a[d],a);c.K=a;}r.styleDocument=function(a){this.styleSubtree(this.c,a);};
  r.styleSubtree=function(a,b){var c=Tf(a),d=c.shadowRoot;(d||a===this.c)&&this.styleElement(a,b);if(a=d&&(d.children||d.childNodes))for(c=0;c<a.length;c++)this.styleSubtree(a[c]);else if(c=c.children||c.childNodes)for(a=0;a<c.length;a++)this.styleSubtree(c[a]);};
  r.va=function(a){var b=this,c=Wf(a);c!==this.f.cssBuild&&(this.f.cssBuild=c);if(!Xf(c)){var d=Kf(a);Jf(d,function(a){if(R)vg(a);else{var d=U;a.selector=a.parsedSelector;vg(a);a.selector=a.C=gg(d,a,d.c,void 0,void 0);}S&&""===c&&(hh(b),b.a&&b.a.transformRule(a));});S?a.textContent=If(d):this.f.L.rules.push(d);}};r.getComputedStyleValue=function(a,b){var c;S||(c=(V(a)||V(mh(this,a))).K[b]);return (c=c||window.getComputedStyle(a).getPropertyValue(b))?c.trim():""};
  r.Xa=function(a,b){var c=Tf(a).getRootNode();b=b?b.split(/\s/):[];c=c.host&&c.host.localName;if(!c){var d=a.getAttribute("class");if(d){d=d.split(/\s/);for(var e=0;e<d.length;e++)if(d[e]===U.a){c=d[e+1];break}}}c&&b.push(U.a,c);S||(c=V(a))&&c.H&&b.push(Ng.a,c.H);Sf(a,b.join(" "));};r.Fa=function(a){return V(a)};r.Wa=function(a,b){ag(a,b);};r.Za=function(a,b){ag(a,b,!0);};r.Va=function(a){return Vg(a)};r.Ia=function(a){return Ug(a)};W.prototype.flush=W.prototype.flush;W.prototype.prepareTemplate=W.prototype.prepareTemplate;
  W.prototype.styleElement=W.prototype.styleElement;W.prototype.styleDocument=W.prototype.styleDocument;W.prototype.styleSubtree=W.prototype.styleSubtree;W.prototype.getComputedStyleValue=W.prototype.getComputedStyleValue;W.prototype.setElementClass=W.prototype.Xa;W.prototype._styleInfoForNode=W.prototype.Fa;W.prototype.transformCustomStyleForDocument=W.prototype.va;W.prototype.getStyleAst=W.prototype.Ka;W.prototype.styleAstToString=W.prototype.Ya;W.prototype.flushCustomStyles=W.prototype.flushCustomStyles;
  W.prototype.scopeNode=W.prototype.Wa;W.prototype.unscopeNode=W.prototype.Za;W.prototype.scopeForNode=W.prototype.Va;W.prototype.currentScopeForNode=W.prototype.Ia;W.prototype.prepareAdoptedCssText=W.prototype.Sa;Object.defineProperties(W.prototype,{nativeShadow:{get:function(){return R}},nativeCss:{get:function(){return S}}});var Z=new W,nh,oh;window.ShadyCSS&&(nh=window.ShadyCSS.ApplyShim,oh=window.ShadyCSS.CustomStyleInterface);
  window.ShadyCSS={ScopingShim:Z,prepareTemplate:function(a,b,c){Z.flushCustomStyles();Z.prepareTemplate(a,b,c);},prepareTemplateDom:function(a,b){Z.prepareTemplateDom(a,b);},prepareTemplateStyles:function(a,b,c){Z.flushCustomStyles();Z.prepareTemplateStyles(a,b,c);},styleSubtree:function(a,b){Z.flushCustomStyles();Z.styleSubtree(a,b);},styleElement:function(a){Z.flushCustomStyles();Z.styleElement(a);},styleDocument:function(a){Z.flushCustomStyles();Z.styleDocument(a);},flushCustomStyles:function(){Z.flushCustomStyles();},
  getComputedStyleValue:function(a,b){return Z.getComputedStyleValue(a,b)},nativeCss:S,nativeShadow:R,cssBuild:Af,disableRuntime:zf};nh&&(window.ShadyCSS.ApplyShim=nh);oh&&(window.ShadyCSS.CustomStyleInterface=oh);(function(a){function b(a){""==a&&(f.call(this),this.i=!0);return a.toLowerCase()}function c(a){var b=a.charCodeAt(0);return 32<b&&127>b&&-1==[34,35,60,62,63,96].indexOf(b)?a:encodeURIComponent(a)}function d(a){var b=a.charCodeAt(0);return 32<b&&127>b&&-1==[34,35,60,62,96].indexOf(b)?a:encodeURIComponent(a)}function e(a,e,g){function h(a){}var k=e||"scheme start",x=0,p="",v=!1,Q=!1;a:for(;(void 0!=a[x-1]||0==x)&&!this.i;){var m=a[x];switch(k){case "scheme start":if(m&&q.test(m))p+=m.toLowerCase(),
  k="scheme";else if(e){break a}else{p="";k="no scheme";continue}break;case "scheme":if(m&&I.test(m))p+=m.toLowerCase();else if(":"==m){this.h=p;p="";if(e)break a;void 0!==l[this.h]&&(this.B=!0);k="file"==this.h?"relative":this.B&&g&&g.h==this.h?"relative or authority":this.B?"authority first slash":"scheme data";}else if(e){break a}else{p="";x=0;k="no scheme";continue}break;case "scheme data":"?"==m?(this.o="?",k="query"):"#"==
  m?(this.v="#",k="fragment"):void 0!=m&&"\t"!=m&&"\n"!=m&&"\r"!=m&&(this.ia+=c(m));break;case "no scheme":if(g&&void 0!==l[g.h]){k="relative";continue}else f.call(this),this.i=!0;break;case "relative or authority":if("/"==m&&"/"==a[x+1])k="authority ignore slashes";else{k="relative";continue}break;case "relative":this.B=!0;"file"!=this.h&&(this.h=g.h);if(void 0==m){this.j=g.j;this.m=g.m;this.l=g.l.slice();this.o=g.o;this.s=g.s;this.g=g.g;break a}else if("/"==
  m||"\\"==m)k="relative slash";else if("?"==m)this.j=g.j,this.m=g.m,this.l=g.l.slice(),this.o="?",this.s=g.s,this.g=g.g,k="query";else if("#"==m)this.j=g.j,this.m=g.m,this.l=g.l.slice(),this.o=g.o,this.v="#",this.s=g.s,this.g=g.g,k="fragment";else{k=a[x+1];var y=a[x+2];if("file"!=this.h||!q.test(m)||":"!=k&&"|"!=k||void 0!=y&&"/"!=y&&"\\"!=y&&"?"!=y&&"#"!=y)this.j=g.j,this.m=g.m,this.s=g.s,this.g=g.g,this.l=g.l.slice(),this.l.pop();k="relative path";continue}break;
  case "relative slash":if("/"==m||"\\"==m)k="file"==this.h?"file host":"authority ignore slashes";else{"file"!=this.h&&(this.j=g.j,this.m=g.m,this.s=g.s,this.g=g.g);k="relative path";continue}break;case "authority first slash":if("/"==m)k="authority second slash";else{k="authority ignore slashes";continue}break;case "authority second slash":k="authority ignore slashes";if("/"!=m){continue}break;case "authority ignore slashes":if("/"!=
  m&&"\\"!=m){k="authority";continue}break;case "authority":if("@"==m){v&&(p+="%40");v=!0;for(m=0;m<p.length;m++)y=p[m],"\t"==y||"\n"==y||"\r"==y?h("Invalid whitespace in authority."):":"==y&&null===this.g?this.g="":(y=c(y),null!==this.g?this.g+=y:this.s+=y);p="";}else if(void 0==m||"/"==m||"\\"==m||"?"==m||"#"==m){x-=p.length;p="";k="host";continue}else p+=m;break;case "file host":if(void 0==m||"/"==m||"\\"==m||"?"==m||"#"==m){2!=p.length||
  !q.test(p[0])||":"!=p[1]&&"|"!=p[1]?(0!=p.length&&(this.j=b.call(this,p),p=""),k="relative path start"):k="relative path";continue}else"\t"==m||"\n"==m||"\r"==m?h("Invalid whitespace in file host."):p+=m;break;case "host":case "hostname":if(":"!=m||Q)if(void 0==m||"/"==m||"\\"==m||"?"==m||"#"==m){this.j=b.call(this,p);p="";k="relative path start";if(e)break a;continue}else"\t"!=m&&"\n"!=m&&"\r"!=m?("["==m?Q=!0:"]"==m&&(Q=!1),p+=m):h("Invalid code point in host/hostname: "+m);else if(this.j=b.call(this,
  p),p="",k="port","hostname"==e)break a;break;case "port":if(/[0-9]/.test(m))p+=m;else if(void 0==m||"/"==m||"\\"==m||"?"==m||"#"==m||e){""!=p&&(p=parseInt(p,10),p!=l[this.h]&&(this.m=p+""),p="");if(e)break a;k="relative path start";continue}else"\t"==m||"\n"==m||"\r"==m?h("Invalid code point in port: "+m):(f.call(this),this.i=!0);break;case "relative path start":k="relative path";if("/"!=m&&"\\"!=m)continue;break;case "relative path":if(void 0!=m&&"/"!=m&&"\\"!=
  m&&(e||"?"!=m&&"#"!=m))"\t"!=m&&"\n"!=m&&"\r"!=m&&(p+=c(m));else{if(y=n[p.toLowerCase()])p=y;".."==p?(this.l.pop(),"/"!=m&&"\\"!=m&&this.l.push("")):"."==p&&"/"!=m&&"\\"!=m?this.l.push(""):"."!=p&&("file"==this.h&&0==this.l.length&&2==p.length&&q.test(p[0])&&"|"==p[1]&&(p=p[0]+":"),this.l.push(p));p="";"?"==m?(this.o="?",k="query"):"#"==m&&(this.v="#",k="fragment");}break;case "query":e||"#"!=m?void 0!=m&&"\t"!=m&&"\n"!=m&&"\r"!=m&&(this.o+=d(m)):(this.v=
  "#",k="fragment");break;case "fragment":void 0!=m&&"\t"!=m&&"\n"!=m&&"\r"!=m&&(this.v+=m);}x++;}}function f(){this.s=this.ia=this.h="";this.g=null;this.m=this.j="";this.l=[];this.v=this.o="";this.B=this.i=!1;}function g(a,b){void 0===b||b instanceof g||(b=new g(String(b)));this.a=a;f.call(this);a=this.a.replace(/^[ \t\r\n\f]+|[ \t\r\n\f]+$/g,"");e.call(this,a,null,b);}var h=!1;try{var k=new URL("b","http://a");k.pathname="c%20d";h="http://a/c%20d"===k.href;}catch(x){}if(!h){var l=Object.create(null);l.ftp=
  21;l.file=0;l.gopher=70;l.http=80;l.https=443;l.ws=80;l.wss=443;var n=Object.create(null);n["%2e"]=".";n[".%2e"]="..";n["%2e."]="..";n["%2e%2e"]="..";var q=/[a-zA-Z]/,I=/[a-zA-Z0-9\+\-\.]/;g.prototype={toString:function(){return this.href},get href(){if(this.i)return this.a;var a="";if(""!=this.s||null!=this.g)a=this.s+(null!=this.g?":"+this.g:"")+"@";return this.protocol+(this.B?"//"+a+this.host:"")+this.pathname+this.o+this.v},set href(a){f.call(this);e.call(this,a);},get protocol(){return this.h+
  ":"},set protocol(a){this.i||e.call(this,a+":","scheme start");},get host(){return this.i?"":this.m?this.j+":"+this.m:this.j},set host(a){!this.i&&this.B&&e.call(this,a,"host");},get hostname(){return this.j},set hostname(a){!this.i&&this.B&&e.call(this,a,"hostname");},get port(){return this.m},set port(a){!this.i&&this.B&&e.call(this,a,"port");},get pathname(){return this.i?"":this.B?"/"+this.l.join("/"):this.ia},set pathname(a){!this.i&&this.B&&(this.l=[],e.call(this,a,"relative path start"));},get search(){return this.i||
  !this.o||"?"==this.o?"":this.o},set search(a){!this.i&&this.B&&(this.o="?","?"==a[0]&&(a=a.slice(1)),e.call(this,a,"query"));},get hash(){return this.i||!this.v||"#"==this.v?"":this.v},set hash(a){this.i||(a?(this.v="#","#"==a[0]&&(a=a.slice(1)),e.call(this,a,"fragment")):this.v="");},get origin(){var a;if(this.i||!this.h)return "";switch(this.h){case "data":case "file":case "javascript":case "mailto":return "null"}return (a=this.host)?this.h+"://"+a:""}};var v=a.URL;v&&(g.createObjectURL=function(a){return v.createObjectURL.apply(v,
  arguments)},g.revokeObjectURL=function(a){v.revokeObjectURL(a);});a.URL=g;}})(window);Object.getOwnPropertyDescriptor(Node.prototype,"baseURI")||Object.defineProperty(Node.prototype,"baseURI",{get:function(){var a=(this.ownerDocument||this).querySelector("base[href]");return a&&a.href||window.location.href},configurable:!0,enumerable:!0});var ph=document.createElement("style");ph.textContent="body {transition: opacity ease-in 0.2s; } \nbody[unresolved] {opacity: 0; display: block; overflow: hidden; position: relative; } \n";var qh=document.querySelector("head");qh.insertBefore(ph,qh.firstChild);var rh=window.customElements,sh=!1,th=null;rh.polyfillWrapFlushCallback&&rh.polyfillWrapFlushCallback(function(a){th=a;sh&&a();});function uh(){window.HTMLTemplateElement.bootstrap&&window.HTMLTemplateElement.bootstrap(window.document);th&&th();sh=!0;window.WebComponents.ready=!0;document.dispatchEvent(new CustomEvent("WebComponentsReady",{bubbles:!0}));}
  "complete"!==document.readyState?(window.addEventListener("load",uh),window.addEventListener("DOMContentLoaded",function(){window.removeEventListener("load",uh);uh();})):uh();}).call(commonjsGlobal);

  (function(){/*

  Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
  This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
  The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
  The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
  Code distributed by Google as part of the polymer project is also
  subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
  */
  var k,aa="undefined"!=typeof window&&window===this?this:"undefined"!=typeof commonjsGlobal&&null!=commonjsGlobal?commonjsGlobal:this;function n(){this.end=this.start=0;this.rules=this.parent=this.previous=null;this.cssText=this.parsedCssText="";this.atRule=!1;this.type=0;this.parsedSelector=this.selector=this.keyframesName="";}
  function p(a){a=a.replace(ba,"").replace(ca,"");var b=da,c=a,e=new n;e.start=0;e.end=c.length;for(var d=e,f=0,g=c.length;f<g;f++)if("{"===c[f]){d.rules||(d.rules=[]);var h=d,l=h.rules[h.rules.length-1]||null;d=new n;d.start=f+1;d.parent=h;d.previous=l;h.rules.push(d);}else"}"===c[f]&&(d.end=f+1,d=d.parent||e);return b(e,a)}
  function da(a,b){var c=b.substring(a.start,a.end-1);a.parsedCssText=a.cssText=c.trim();a.parent&&(c=b.substring(a.previous?a.previous.end:a.parent.start,a.start-1),c=ea(c),c=c.replace(fa," "),c=c.substring(c.lastIndexOf(";")+1),c=a.parsedSelector=a.selector=c.trim(),a.atRule=0===c.indexOf("@"),a.atRule?0===c.indexOf("@media")?a.type=ha:c.match(ia)&&(a.type=q,a.keyframesName=a.selector.split(fa).pop()):a.type=0===c.indexOf("--")?ja:ka);if(c=a.rules)for(var e=0,d=c.length,f=void 0;e<d&&(f=c[e]);e++)da(f,
  b);return a}function ea(a){return a.replace(/\\([0-9a-f]{1,6})\s/gi,function(a,c){a=c;for(c=6-a.length;c--;)a="0"+a;return "\\"+a})}
  function la(a,b,c){c=void 0===c?"":c;var e="";if(a.cssText||a.rules){var d=a.rules,f;if(f=d)f=d[0],f=!(f&&f.selector&&0===f.selector.indexOf("--"));if(f){f=0;for(var g=d.length,h=void 0;f<g&&(h=d[f]);f++)e=la(h,b,e);}else b?b=a.cssText:(b=a.cssText,b=b.replace(ma,"").replace(na,""),b=b.replace(oa,"").replace(pa,"")),(e=b.trim())&&(e="  "+e+"\n");}e&&(a.selector&&(c+=a.selector+" {\n"),c+=e,a.selector&&(c+="}\n\n"));return c}
  var ka=1,q=7,ha=4,ja=1E3,ba=/\/\*[^*]*\*+([^/*][^*]*\*+)*\//gim,ca=/@import[^;]*;/gim,ma=/(?:^[^;\-\s}]+)?--[^;{}]*?:[^{};]*?(?:[;\n]|$)/gim,na=/(?:^[^;\-\s}]+)?--[^;{}]*?:[^{};]*?{[^}]*?}(?:[;\n]|$)?/gim,oa=/@apply\s*\(?[^);]*\)?\s*(?:[;\n]|$)?/gim,pa=/[^;:]*?:[^;]*?var\([^;]*\)(?:[;\n]|$)?/gim,ia=/^@[^\s]*keyframes/,fa=/\s+/g;var r=!(window.ShadyDOM&&window.ShadyDOM.inUse),t;function qa(a){t=a&&a.shimcssproperties?!1:r||!(navigator.userAgent.match(/AppleWebKit\/601|Edge\/15/)||!window.CSS||!CSS.supports||!CSS.supports("box-shadow","0 0 0 var(--foo)"));}var ra;window.ShadyCSS&&void 0!==window.ShadyCSS.cssBuild&&(ra=window.ShadyCSS.cssBuild);var u=!(!window.ShadyCSS||!window.ShadyCSS.disableRuntime);
  window.ShadyCSS&&void 0!==window.ShadyCSS.nativeCss?t=window.ShadyCSS.nativeCss:window.ShadyCSS?(qa(window.ShadyCSS),window.ShadyCSS=void 0):qa(window.WebComponents&&window.WebComponents.flags);var v=t,w=ra;var x=/(?:^|[;\s{]\s*)(--[\w-]*?)\s*:\s*(?:((?:'(?:\\'|.)*?'|"(?:\\"|.)*?"|\([^)]*?\)|[^};{])+)|\{([^}]*)\}(?:(?=[;\s}])|$))/gi,y=/(?:^|\W+)@apply\s*\(?([^);\n]*)\)?/gi,sa=/(--[\w-]+)\s*([:,;)]|$)/gi,ta=/(animation\s*:)|(animation-name\s*:)/,ua=/@media\s(.*)/,va=/\{[^}]*\}/g;var wa=new Set;function z(a,b){if(!a)return "";"string"===typeof a&&(a=p(a));b&&A(a,b);return la(a,v)}function B(a){!a.__cssRules&&a.textContent&&(a.__cssRules=p(a.textContent));return a.__cssRules||null}function xa(a){return !!a.parent&&a.parent.type===q}function A(a,b,c,e){if(a){var d=!1,f=a.type;if(e&&f===ha){var g=a.selector.match(ua);g&&(window.matchMedia(g[1]).matches||(d=!0));}f===ka?b(a):c&&f===q?c(a):f===ja&&(d=!0);if((a=a.rules)&&!d)for(d=0,f=a.length,g=void 0;d<f&&(g=a[d]);d++)A(g,b,c,e);}}
  function C(a,b,c,e){var d=document.createElement("style");b&&d.setAttribute("scope",b);d.textContent=a;ya(d,c,e);return d}var D=null;function za(a){a=document.createComment(" Shady DOM styles for "+a+" ");var b=document.head;b.insertBefore(a,(D?D.nextSibling:null)||b.firstChild);return D=a}function ya(a,b,c){b=b||document.head;b.insertBefore(a,c&&c.nextSibling||b.firstChild);D?a.compareDocumentPosition(D)===Node.DOCUMENT_POSITION_PRECEDING&&(D=a):D=a;}
  function Aa(a,b){for(var c=0,e=a.length;b<e;b++)if("("===a[b])c++;else if(")"===a[b]&&0===--c)return b;return -1}function Ba(a,b){var c=a.indexOf("var(");if(-1===c)return b(a,"","","");var e=Aa(a,c+3),d=a.substring(c+4,e);c=a.substring(0,c);a=Ba(a.substring(e+1),b);e=d.indexOf(",");return -1===e?b(c,d.trim(),"",a):b(c,d.substring(0,e).trim(),d.substring(e+1).trim(),a)}function E(a,b){r?a.setAttribute("class",b):window.ShadyDOM.nativeMethods.setAttribute.call(a,"class",b);}
  var F=window.ShadyDOM&&window.ShadyDOM.wrap||function(a){return a};function G(a){var b=a.localName,c="";b?-1<b.indexOf("-")||(c=b,b=a.getAttribute&&a.getAttribute("is")||""):(b=a.is,c=a.extends);return {is:b,s:c}}function Ca(a){for(var b=[],c="",e=0;0<=e&&e<a.length;e++)if("("===a[e]){var d=Aa(a,e);c+=a.slice(e,d+1);e=d;}else","===a[e]?(b.push(c),c=""):c+=a[e];c&&b.push(c);return b}
  function H(a){if(void 0!==w)return w;if(void 0===a.__cssBuild){var b=a.getAttribute("css-build");if(b)a.__cssBuild=b;else{a:{b="template"===a.localName?a.content.firstChild:a.firstChild;if(b instanceof Comment&&(b=b.textContent.trim().split(":"),"css-build"===b[0])){b=b[1];break a}b="";}if(""!==b){var c="template"===a.localName?a.content.firstChild:a.firstChild;c.parentNode.removeChild(c);}a.__cssBuild=b;}}return a.__cssBuild||""}
  function Da(a){a=void 0===a?"":a;return ""!==a&&v?r?"shadow"===a:"shady"===a:!1}function I(){}function Ea(a,b){J(K,a,function(a){L(a,b||"");});}function J(a,b,c){b.nodeType===Node.ELEMENT_NODE&&c(b);var e;"template"===b.localName?e=(b.content||b._content||b).childNodes:e=b.children||b.childNodes;if(e)for(b=0;b<e.length;b++)J(a,e[b],c);}
  function L(a,b,c){if(b)if(a.classList)c?(a.classList.remove("style-scope"),a.classList.remove(b)):(a.classList.add("style-scope"),a.classList.add(b));else if(a.getAttribute){var e=a.getAttribute("class");c?e&&(b=e.replace("style-scope","").replace(b,""),E(a,b)):E(a,(e?e+" ":"")+"style-scope "+b);}}function Fa(a,b,c){J(K,a,function(a){L(a,b,!0);L(a,c);});}function Ga(a,b){J(K,a,function(a){L(a,b||"",!0);});}
  function M(a,b,c,e,d){var f=K;d=void 0===d?"":d;""===d&&(r||"shady"===(void 0===e?"":e)?d=z(b,c):(a=G(a),d=Ha(f,b,a.is,a.s,c)+"\n\n"));return d.trim()}function Ha(a,b,c,e,d){var f=Ia(c,e);c=c?"."+c:"";return z(b,function(b){b.c||(b.selector=b.g=Ja(a,b,a.b,c,f),b.c=!0);d&&d(b,c,f);})}function Ia(a,b){return b?"[is="+a+"]":a}function Ja(a,b,c,e,d){var f=Ca(b.selector);if(!xa(b)){b=0;for(var g=f.length,h=void 0;b<g&&(h=f[b]);b++)f[b]=c.call(a,h,e,d);}return f.filter(function(a){return !!a}).join(",")}
  function Ka(a){return a.replace(La,function(a,c,e){-1<e.indexOf("+")?e=e.replace(/\+/g,"___"):-1<e.indexOf("___")&&(e=e.replace(/___/g,"+"));return ":"+c+"("+e+")"})}function Ma(a){for(var b=[],c;c=a.match(Na);){var e=c.index,d=Aa(a,e);if(-1===d)throw Error(c.input+" selector missing ')'");c=a.slice(e,d+1);a=a.replace(c,"\ue000");b.push(c);}return {A:a,matches:b}}function Oa(a,b){var c=a.split("\ue000");return b.reduce(function(a,b,f){return a+b+c[f+1]},c[0])}
  I.prototype.b=function(a,b,c){var e=!1;a=a.trim();var d=La.test(a);d&&(a=a.replace(La,function(a,b,c){return ":"+b+"("+c.replace(/\s/g,"")+")"}),a=Ka(a));var f=Na.test(a);if(f){var g=Ma(a);a=g.A;g=g.matches;}a=a.replace(Pa,":host $1");a=a.replace(Qa,function(a,d,f){e||(a=Ra(f,d,b,c),e=e||a.stop,d=a.G,f=a.value);return d+f});f&&(a=Oa(a,g));d&&(a=Ka(a));return a=a.replace(Sa,function(a,b,c,d){return '[dir="'+c+'"] '+b+d+", "+b+'[dir="'+c+'"]'+d})};
  function Ra(a,b,c,e){var d=a.indexOf("::slotted");0<=a.indexOf(":host")?a=Ta(a,e):0!==d&&(a=c?Ua(a,c):a);c=!1;0<=d&&(b="",c=!0);if(c){var f=!0;c&&(a=a.replace(Va,function(a,b){return " > "+b}));}return {value:a,G:b,stop:f}}function Ua(a,b){a=a.split(/(\[.+?\])/);for(var c=[],e=0;e<a.length;e++)if(1===e%2)c.push(a[e]);else{var d=a[e];if(""!==d||e!==a.length-1)d=d.split(":"),d[0]+=b,c.push(d.join(":"));}return c.join("")}
  function Ta(a,b){var c=a.match(Wa);return (c=c&&c[2].trim()||"")?c[0].match(Xa)?a.replace(Wa,function(a,c,f){return b+f}):c.split(Xa)[0]===b?c:"should_not_match":a.replace(":host",b)}function Ya(a){":root"===a.selector&&(a.selector="html");}I.prototype.c=function(a){return a.match(":host")?"":a.match("::slotted")?this.b(a,":not(.style-scope)"):Ua(a.trim(),":not(.style-scope)")};aa.Object.defineProperties(I.prototype,{a:{configurable:!0,enumerable:!0,get:function(){return "style-scope"}}});
  var La=/:(nth[-\w]+)\(([^)]+)\)/,Qa=/(^|[\s>+~]+)((?:\[.+?\]|[^\s>+~=[])+)/g,Xa=/[[.:#*]/,Pa=/^(::slotted)/,Wa=/(:host)(?:\(((?:\([^)(]*\)|[^)(]*)+?)\))/,Va=/(?:::slotted)(?:\(((?:\([^)(]*\)|[^)(]*)+?)\))/,Sa=/(.*):dir\((?:(ltr|rtl))\)(.*)/,Na=/:(?:matches|any|-(?:webkit|moz)-any)/,K=new I;function N(a,b,c,e,d){this.o=a||null;this.b=b||null;this.w=c||[];this.i=null;this.cssBuild=d||"";this.s=e||"";this.a=this.j=this.m=null;}function O(a){return a?a.__styleInfo:null}function Za(a,b){return a.__styleInfo=b}N.prototype.c=function(){return this.o};N.prototype._getStyleRules=N.prototype.c;function $a(a){var b=this.matches||this.matchesSelector||this.mozMatchesSelector||this.msMatchesSelector||this.oMatchesSelector||this.webkitMatchesSelector;return b&&b.call(this,a)}var ab=navigator.userAgent.match("Trident");function bb(){}function cb(a){var b={},c=[],e=0;A(a,function(a){P(a);a.index=e++;a=a.f.cssText;for(var c;c=sa.exec(a);){var d=c[1];":"!==c[2]&&(b[d]=!0);}},function(a){c.push(a);});a.b=c;a=[];for(var d in b)a.push(d);return a}
  function P(a){if(!a.f){var b={},c={};R(a,c)&&(b.l=c,a.rules=null);b.cssText=a.parsedCssText.replace(va,"").replace(x,"");a.f=b;}}function R(a,b){var c=a.f;if(c){if(c.l)return Object.assign(b,c.l),!0}else{c=a.parsedCssText;for(var e;a=x.exec(c);){e=(a[2]||a[3]).trim();if("inherit"!==e||"unset"!==e)b[a[1].trim()]=e;e=!0;}return e}}
  function S(a,b,c){b&&(b=0<=b.indexOf(";")?db(a,b,c):Ba(b,function(b,d,f,g){if(!d)return b+g;(d=S(a,c[d],c))&&"initial"!==d?"apply-shim-inherit"===d&&(d="inherit"):d=S(a,c[f]||f,c)||f;return b+(d||"")+g}));return b&&b.trim()||""}
  function db(a,b,c){b=b.split(";");for(var e=0,d,f;e<b.length;e++)if(d=b[e]){y.lastIndex=0;if(f=y.exec(d))d=S(a,c[f[1]],c);else if(f=d.indexOf(":"),-1!==f){var g=d.substring(f);g=g.trim();g=S(a,g,c)||g;d=d.substring(0,f)+g;}b[e]=d&&d.lastIndexOf(";")===d.length-1?d.slice(0,-1):d||"";}return b.join(";")}
  function eb(a,b){var c={},e=[];A(a,function(a){a.f||P(a);var d=a.g||a.parsedSelector;b&&a.f.l&&d&&$a.call(b,d)&&(R(a,c),a=a.index,d=parseInt(a/32,10),e[d]=(e[d]||0)|1<<a%32);},null,!0);return {l:c,key:e}}
  function fb(a,b,c,e){b.f||P(b);if(b.f.l){var d=G(a);a=d.is;d=d.s;d=a?Ia(a,d):"html";var f=b.parsedSelector,g=":host > *"===f||"html"===f,h=0===f.indexOf(":host")&&!g;"shady"===c&&(g=f===d+" > *."+d||-1!==f.indexOf("html"),h=!g&&0===f.indexOf(d));if(g||h)c=d,h&&(b.g||(b.g=Ja(K,b,K.b,a?"."+a:"",d)),c=b.g||d),e({A:c,K:h,T:g});}}function gb(a,b,c){var e={},d={};A(b,function(b){fb(a,b,c,function(c){$a.call(a._element||a,c.A)&&(c.K?R(b,e):R(b,d));});},null,!0);return {M:d,J:e}}
  function hb(a,b,c,e){var d=G(b),f=Ia(d.is,d.s),g=new RegExp("(?:^|[^.#[:])"+(b.extends?"\\"+f.slice(0,-1)+"\\]":f)+"($|[.:[\\s>+~])"),h=O(b);d=h.o;h=h.cssBuild;var l=ib(d,e);return M(b,d,function(b){var d="";b.f||P(b);b.f.cssText&&(d=db(a,b.f.cssText,c));b.cssText=d;if(!r&&!xa(b)&&b.cssText){var h=d=b.cssText;null==b.C&&(b.C=ta.test(d));if(b.C)if(null==b.u){b.u=[];for(var m in l)h=l[m],h=h(d),d!==h&&(d=h,b.u.push(m));}else{for(m=0;m<b.u.length;++m)h=l[b.u[m]],d=h(d);h=d;}b.cssText=h;b.g=b.g||b.selector;
  d="."+e;m=Ca(b.g);h=0;for(var Ab=m.length,Q=void 0;h<Ab&&(Q=m[h]);h++)m[h]=Q.match(g)?Q.replace(f,d):d+" "+Q;b.selector=m.join(",");}},h)}function ib(a,b){a=a.b;var c={};if(!r&&a)for(var e=0,d=a[e];e<a.length;d=a[++e]){var f=d,g=b;f.h=new RegExp("\\b"+f.keyframesName+"(?!\\B|-)","g");f.a=f.keyframesName+"-"+g;f.g=f.g||f.selector;f.selector=f.g.replace(f.keyframesName,f.a);c[d.keyframesName]=jb(d);}return c}function jb(a){return function(b){return b.replace(a.h,a.a)}}
  function kb(a,b){var c=T,e=B(a);a.textContent=z(e,function(a){var d=a.cssText=a.parsedCssText;a.f&&a.f.cssText&&(d=d.replace(ma,"").replace(na,""),a.cssText=db(c,d,b));});}aa.Object.defineProperties(bb.prototype,{a:{configurable:!0,enumerable:!0,get:function(){return "x-scope"}}});var T=new bb;var U={},V=window.customElements;if(V&&!r&&!u){var lb=V.define;V.define=function(a,b,c){U[a]||(U[a]=za(a));lb.call(V,a,b,c);};}function mb(){this.cache={};}mb.prototype.store=function(a,b,c,e){var d=this.cache[a]||[];d.push({l:b,styleElement:c,j:e});100<d.length&&d.shift();this.cache[a]=d;};function nb(){}var ob=new RegExp(K.a+"\\s*([^\\s]*)");function pb(a){return (a=(a.classList&&a.classList.value?a.classList.value:a.getAttribute("class")||"").match(ob))?a[1]:""}function qb(a){var b=F(a).getRootNode();return b===a||b===a.ownerDocument?"":(a=b.host)?G(a).is:""}
  function rb(a){for(var b=0;b<a.length;b++){var c=a[b];if(c.target!==document.documentElement&&c.target!==document.head)for(var e=0;e<c.addedNodes.length;e++){var d=c.addedNodes[e];if(d.nodeType===Node.ELEMENT_NODE){var f=d.getRootNode(),g=pb(d);if(g&&f===d.ownerDocument&&("style"!==d.localName&&"template"!==d.localName||""===H(d)))Ga(d,g);else if(f instanceof ShadowRoot)for(f=qb(d),f!==g&&Fa(d,g,f),d=window.ShadyDOM.nativeMethods.querySelectorAll.call(d,":not(."+K.a+")"),g=0;g<d.length;g++){f=d[g];
  var h=qb(f);h&&L(f,h);}}}}}
  if(!(r||window.ShadyDOM&&window.ShadyDOM.handlesDynamicScoping)){var sb=new MutationObserver(rb),tb=function(a){sb.observe(a,{childList:!0,subtree:!0});};if(window.customElements&&!window.customElements.polyfillWrapFlushCallback)tb(document);else{var ub=function(){tb(document.body);};window.HTMLImports?window.HTMLImports.whenReady(ub):requestAnimationFrame(function(){if("loading"===document.readyState){var a=function(){ub();document.removeEventListener("readystatechange",a);};document.addEventListener("readystatechange",
  a);}else ub();});}nb=function(){rb(sb.takeRecords());};}var vb=nb;var W={};var wb=Promise.resolve();function xb(a){if(a=W[a])a._applyShimCurrentVersion=a._applyShimCurrentVersion||0,a._applyShimValidatingVersion=a._applyShimValidatingVersion||0,a._applyShimNextVersion=(a._applyShimNextVersion||0)+1;}function yb(a){return a._applyShimCurrentVersion===a._applyShimNextVersion}function zb(a){a._applyShimValidatingVersion=a._applyShimNextVersion;a._validating||(a._validating=!0,wb.then(function(){a._applyShimCurrentVersion=a._applyShimNextVersion;a._validating=!1;}));}var Bb={},Cb=new mb;function X(){this.B={};this.c=document.documentElement;var a=new n;a.rules=[];this.h=Za(this.c,new N(a));this.v=!1;this.b=this.a=null;}k=X.prototype;k.flush=function(){vb();};k.I=function(a){return B(a)};k.R=function(a){return z(a)};k.prepareTemplate=function(a,b,c){this.prepareTemplateDom(a,b);this.prepareTemplateStyles(a,b,c);};
  k.prepareTemplateStyles=function(a,b,c){if(!a._prepared&&!u){r||U[b]||(U[b]=za(b));a._prepared=!0;a.name=b;a.extends=c;W[b]=a;var e=H(a),d=Da(e);c={is:b,extends:c};for(var f=[],g=a.content.querySelectorAll("style"),h=0;h<g.length;h++){var l=g[h];if(l.hasAttribute("shady-unscoped")){if(!r){var m=l.textContent;wa.has(m)||(wa.add(m),m=l.cloneNode(!0),document.head.appendChild(m));l.parentNode.removeChild(l);}}else f.push(l.textContent),l.parentNode.removeChild(l);}f=f.join("").trim()+(Bb[b]||"");Y(this);
  if(!d){if(g=!e)g=y.test(f)||x.test(f),y.lastIndex=0,x.lastIndex=0;h=p(f);g&&v&&this.a&&this.a.transformRules(h,b);a._styleAst=h;}g=[];v||(g=cb(a._styleAst));if(!g.length||v)h=r?a.content:null,b=U[b]||null,e=M(c,a._styleAst,null,e,d?f:""),e=e.length?C(e,c.is,h,b):null,a._style=e;a.a=g;}};k.L=function(a,b){Bb[b]=a.join(" ");};k.prepareTemplateDom=function(a,b){if(!u){var c=H(a);r||"shady"===c||a._domPrepared||(a._domPrepared=!0,Ea(a.content,b));}};
  function Db(a){var b=G(a),c=b.is;b=b.s;var e=U[c]||null,d=W[c];if(d){c=d._styleAst;var f=d.a;d=H(d);b=new N(c,e,f,b,d);Za(a,b);return b}}function Eb(a){!a.b&&window.ShadyCSS&&window.ShadyCSS.CustomStyleInterface&&(a.b=window.ShadyCSS.CustomStyleInterface,a.b.transformCallback=function(b){a.D(b);},a.b.validateCallback=function(){requestAnimationFrame(function(){(a.b.enqueued||a.v)&&a.flushCustomStyles();});});}
  function Y(a){!a.a&&window.ShadyCSS&&window.ShadyCSS.ApplyShim&&(a.a=window.ShadyCSS.ApplyShim,a.a.invalidCallback=xb);Eb(a);}
  k.flushCustomStyles=function(){if(!u&&(Y(this),this.b)){var a=this.b.processStyles();if(this.b.enqueued&&!Da(this.h.cssBuild)){if(v){if(!this.h.cssBuild)for(var b=0;b<a.length;b++){var c=this.b.getStyleForCustomStyle(a[b]);if(c&&v&&this.a){var e=B(c);Y(this);this.a.transformRules(e);c.textContent=z(e);}}}else{Fb(this,this.c,this.h);for(b=0;b<a.length;b++)(c=this.b.getStyleForCustomStyle(a[b]))&&kb(c,this.h.m);this.v&&this.styleDocument();}this.b.enqueued=!1;}}};
  k.styleElement=function(a,b){if(u){if(b){O(a)||Za(a,new N(null));var c=O(a);c.i=c.i||{};Object.assign(c.i,b);Gb(this,a,c);}}else if(c=O(a)||Db(a))if(a!==this.c&&(this.v=!0),b&&(c.i=c.i||{},Object.assign(c.i,b)),v)Gb(this,a,c);else if(this.flush(),Fb(this,a,c),c.w&&c.w.length){b=G(a).is;var e;a:{if(e=Cb.cache[b])for(var d=e.length-1;0<=d;d--){var f=e[d];b:{var g=c.w;for(var h=0;h<g.length;h++){var l=g[h];if(f.l[l]!==c.m[l]){g=!1;break b}}g=!0;}if(g){e=f;break a}}e=void 0;}g=e?e.styleElement:null;d=c.j;
  (f=e&&e.j)||(f=this.B[b]=(this.B[b]||0)+1,f=b+"-"+f);c.j=f;f=c.j;h=T;h=g?g.textContent||"":hb(h,a,c.m,f);l=O(a);var m=l.a;m&&!r&&m!==g&&(m._useCount--,0>=m._useCount&&m.parentNode&&m.parentNode.removeChild(m));r?l.a?(l.a.textContent=h,g=l.a):h&&(g=C(h,f,a.shadowRoot,l.b)):g?g.parentNode||(ab&&-1<h.indexOf("@media")&&(g.textContent=h),ya(g,null,l.b)):h&&(g=C(h,f,null,l.b));g&&(g._useCount=g._useCount||0,l.a!=g&&g._useCount++,l.a=g);f=g;r||(g=c.j,l=h=a.getAttribute("class")||"",d&&(l=h.replace(new RegExp("\\s*x-scope\\s*"+
  d+"\\s*","g")," ")),l+=(l?" ":"")+"x-scope "+g,h!==l&&E(a,l));e||Cb.store(b,c.m,f,c.j);}};
  function Gb(a,b,c){var e=G(b).is;if(c.i){var d=c.i,f;for(f in d)null===f?b.style.removeProperty(f):b.style.setProperty(f,d[f]);}d=W[e];if(!(!d&&b!==a.c||d&&""!==H(d))&&d&&d._style&&!yb(d)){if(yb(d)||d._applyShimValidatingVersion!==d._applyShimNextVersion)Y(a),a.a&&a.a.transformRules(d._styleAst,e),d._style.textContent=M(b,c.o),zb(d);r&&(a=b.shadowRoot)&&(a=a.querySelector("style"))&&(a.textContent=M(b,c.o));c.o=d._styleAst;}}
  function Hb(a,b){return (b=F(b).getRootNode().host)?O(b)||Db(b)?b:Hb(a,b):a.c}function Fb(a,b,c){var e=Hb(a,b),d=O(e),f=d.m;e===a.c||f||(Fb(a,e,d),f=d.m);a=Object.create(f||null);e=gb(b,c.o,c.cssBuild);b=eb(d.o,b).l;Object.assign(a,e.J,b,e.M);b=c.i;for(var g in b)if((d=b[g])||0===d)a[g]=d;g=T;b=Object.getOwnPropertyNames(a);for(d=0;d<b.length;d++)e=b[d],a[e]=S(g,a[e],a);c.m=a;}k.styleDocument=function(a){this.styleSubtree(this.c,a);};
  k.styleSubtree=function(a,b){var c=F(a),e=c.shadowRoot;(e||a===this.c)&&this.styleElement(a,b);if(a=e&&(e.children||e.childNodes))for(c=0;c<a.length;c++)this.styleSubtree(a[c]);else if(c=c.children||c.childNodes)for(a=0;a<c.length;a++)this.styleSubtree(c[a]);};
  k.D=function(a){var b=this,c=H(a);c!==this.h.cssBuild&&(this.h.cssBuild=c);if(!Da(c)){var e=B(a);A(e,function(a){if(r)Ya(a);else{var d=K;a.selector=a.parsedSelector;Ya(a);a.selector=a.g=Ja(d,a,d.c,void 0,void 0);}v&&""===c&&(Y(b),b.a&&b.a.transformRule(a));});v?a.textContent=z(e):this.h.o.rules.push(e);}};k.getComputedStyleValue=function(a,b){var c;v||(c=(O(a)||O(Hb(this,a))).m[b]);return (c=c||window.getComputedStyle(a).getPropertyValue(b))?c.trim():""};
  k.P=function(a,b){var c=F(a).getRootNode();b=b?b.split(/\s/):[];c=c.host&&c.host.localName;if(!c){var e=a.getAttribute("class");if(e){e=e.split(/\s/);for(var d=0;d<e.length;d++)if(e[d]===K.a){c=e[d+1];break}}}c&&b.push(K.a,c);v||(c=O(a))&&c.j&&b.push(T.a,c.j);E(a,b.join(" "));};k.F=function(a){return O(a)};k.O=function(a,b){L(a,b);};k.S=function(a,b){L(a,b,!0);};k.N=function(a){return qb(a)};k.H=function(a){return pb(a)};X.prototype.flush=X.prototype.flush;X.prototype.prepareTemplate=X.prototype.prepareTemplate;
  X.prototype.styleElement=X.prototype.styleElement;X.prototype.styleDocument=X.prototype.styleDocument;X.prototype.styleSubtree=X.prototype.styleSubtree;X.prototype.getComputedStyleValue=X.prototype.getComputedStyleValue;X.prototype.setElementClass=X.prototype.P;X.prototype._styleInfoForNode=X.prototype.F;X.prototype.transformCustomStyleForDocument=X.prototype.D;X.prototype.getStyleAst=X.prototype.I;X.prototype.styleAstToString=X.prototype.R;X.prototype.flushCustomStyles=X.prototype.flushCustomStyles;
  X.prototype.scopeNode=X.prototype.O;X.prototype.unscopeNode=X.prototype.S;X.prototype.scopeForNode=X.prototype.N;X.prototype.currentScopeForNode=X.prototype.H;X.prototype.prepareAdoptedCssText=X.prototype.L;Object.defineProperties(X.prototype,{nativeShadow:{get:function(){return r}},nativeCss:{get:function(){return v}}});var Z=new X,Ib,Jb;window.ShadyCSS&&(Ib=window.ShadyCSS.ApplyShim,Jb=window.ShadyCSS.CustomStyleInterface);
  window.ShadyCSS={ScopingShim:Z,prepareTemplate:function(a,b,c){Z.flushCustomStyles();Z.prepareTemplate(a,b,c);},prepareTemplateDom:function(a,b){Z.prepareTemplateDom(a,b);},prepareTemplateStyles:function(a,b,c){Z.flushCustomStyles();Z.prepareTemplateStyles(a,b,c);},styleSubtree:function(a,b){Z.flushCustomStyles();Z.styleSubtree(a,b);},styleElement:function(a){Z.flushCustomStyles();Z.styleElement(a);},styleDocument:function(a){Z.flushCustomStyles();Z.styleDocument(a);},flushCustomStyles:function(){Z.flushCustomStyles();},
  getComputedStyleValue:function(a,b){return Z.getComputedStyleValue(a,b)},nativeCss:v,nativeShadow:r,cssBuild:w,disableRuntime:u};Ib&&(window.ShadyCSS.ApplyShim=Ib);Jb&&(window.ShadyCSS.CustomStyleInterface=Jb);}).call(commonjsGlobal);

  var keys = entryVirtual('Array').keys;

  var keys$1 = keys;

  var ArrayPrototype$9 = Array.prototype;

  var DOMIterables$1 = {
    DOMTokenList: true,
    NodeList: true
  };

  var keys_1 = function (it) {
    var own = it.keys;
    return it === ArrayPrototype$9 || (it instanceof Array && own === ArrayPrototype$9.keys)
      // eslint-disable-next-line no-prototype-builtins
      || DOMIterables$1.hasOwnProperty(classof(it)) ? keys$1 : own;
  };

  var keys$2 = keys_1;

  var constrain = (function (value, min, max) {
    return Math.max(min, Math.min(max, value));
  });

  var map$6 = (function (value, istart, istop, ostart, ostop) {
    return ostart + (ostop - ostart) * ((value - istart) / (istop - istart));
  });

  var MultiFade =
  /*#__PURE__*/
  function () {
    function MultiFade(length) {
      classCallCheck(this, MultiFade);

      this._len = length && length > 1 ? length : 2; // this._result = new Array(this._len).fill(0);

      this._arrival = 1 / this._len;
    }

    createClass(MultiFade, [{
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
        var _context,
            _context2,
            _this = this;

        var _dissolve = constrain(dissolve, 0, 1);

        var __dissolve = 1.0 - _dissolve;

        var distance = map$6(seed, 0, 1, 0.5 * edge, __dissolve * (this._len - 1) + map$6(edge, 0, 1, 1, 0.5));
        return reduce$2(_context = toConsumableArray(keys$2(_context2 = Array(this._len)).call(_context2))).call(_context, function (a, c) {
          var seedCalc = Math.max(Math.min(distance - __dissolve * c, 1), 0);
          return concat$2(a).call(a, [_this.calc(seedCalc, peakX, smooth)]);
        }, []);
      }
    }, {
      key: "calc",
      value: function calc(seed, peakX, smooth) {
        var _seed = constrain(seed, 0, 1);

        var _peakX = constrain(peakX, 0, 1);

        var _smooth = smooth ? map$6(constrain(smooth, 0, 1), 0, 1, 0, 0.5) : 0;

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
      classCallCheck(this, Ease);

      this._type = typestr ? typestr : 'linear';
      this._t = 0;
      this._d = duration;
    }

    createClass(Ease, [{
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

  // ie9- setTimeout & setInterval additional parameters fix


  var slice$3 = [].slice;

  var MSIE = /MSIE .\./.test(userAgent); // <- dirty ie9- check

  var wrap$1 = function (set) {
    return function (fn, time /* , ...args */) {
      var boundArgs = arguments.length > 2;
      var args = boundArgs ? slice$3.call(arguments, 2) : false;
      return set(boundArgs ? function () {
        // eslint-disable-next-line no-new-func
        (typeof fn == 'function' ? fn : Function(fn)).apply(this, args);
      } : fn, time);
    };
  };

  _export({ global: true, bind: true, forced: MSIE }, {
    setTimeout: wrap$1(global$1.setTimeout),
    setInterval: wrap$1(global$1.setInterval)
  });

  var setTimeout$1 = path.setTimeout;

  var setTimeout$2 = setTimeout$1;

  var ready = (function (fn) {
    if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading") {
      setTimeout$2(function () {
        fn();
      }, 0);
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  });

  Element.prototype.matches||(Element.prototype.matches=Element.prototype.msMatchesSelector||Element.prototype.webkitMatchesSelector),window.Element&&!Element.prototype.closest&&(Element.prototype.closest=function(e){var t=this;if(!document.documentElement.contains(t))return null;do{if(t.matches(e))return t;t=t.parentElement||t.parentNode;}while(null!==t&&1===t.nodeType);return null});

  var _css = ':host {  display: block; }  :host * {    -webkit-box-sizing: border-box;            box-sizing: border-box; }  :host .tab {    line-height: 0; }  :host .panel {    position: relative; }.panel ::slotted(*) {  position: absolute;  pointer-events: none; }.horizon {  display: -webkit-box;  display: -ms-flexbox;  display: flex; }  .horizon ::slotted(*) {    position: static; }';

  var _style = "<style>".concat(_css, "</style>");

  var _shadowdomHTML = "\n    ".concat(_style, "\n    <div class=\"wp\">\n        <div class=\"tab\">\n            <slot class=\"tab_slot\" name=\"tab\"></slot>\n        </div>\n        <slot class=\"seekbar_slot\" name=\"bar\"></slot>\n        <div class=\"panel\">\n            <slot class=\"panel_slot\"></slot>\n        </div>\n    </div>\n");

  var template = document.createElement('template');
  template.id = 'rikaaatab';
  template.innerHTML = _shadowdomHTML;
  if (window.ShadyCSS) ShadyCSS.prepareTemplate(template, 'rikaaa-tab');

  var rikaaatab =
  /*#__PURE__*/
  function (_HTMLElement) {
    inherits(rikaaatab, _HTMLElement);

    function rikaaatab() {
      var _this;

      classCallCheck(this, rikaaatab);

      _this = possibleConstructorReturn(this, getPrototypeOf$3(rikaaatab).call(this));
      if (window.ShadyCSS) ShadyCSS.styleElement(assertThisInitialized(_this));

      _this.attachShadow({
        mode: 'open'
      });

      _this.shadowRoot.appendChild(template.content.cloneNode(true));

      return _this;
    }

    createClass(rikaaatab, [{
      key: "connectedCallback",
      value: function connectedCallback() {
        var _context,
            _context2,
            _context3,
            _context4,
            _this2 = this,
            _context5,
            _context6;

        this._ease = new Ease('ease_in_out');
        this._tab = this.shadowRoot.querySelector('.tab');
        this._panel = this.shadowRoot.querySelector('.panel');
        this._wp = this.shadowRoot.querySelector('.wp');
        this._tabslot = this.shadowRoot.querySelector('.tab_slot');
        this._panelslot = this.shadowRoot.querySelector('.panel_slot');
        this._seekbarslot = this.shadowRoot.querySelector('.seekbar_slot');
        this._tabs = filter$2(_context = this._tabslot.assignedNodes({
          flattern: true
        })).call(_context, function (n) {
          return n.nodeType === n.ELEMENT_NODE;
        });
        this._panels = filter$2(_context2 = this._panelslot.assignedNodes({
          flatten: true
        })).call(_context2, function (n) {
          return n.nodeType === n.ELEMENT_NODE;
        });
        this._bar = filter$2(_context3 = this._seekbarslot.assignedNodes({
          flatten: true
        })).call(_context3, function (n) {
          return n.nodeType === n.ELEMENT_NODE;
        })[0];
        this._panelsH = reduce$2(_context4 = from_1$4(this._panels)).call(_context4, function (a, c) {
          return concat$2(a).call(a, c.offsetHeight);
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

        var attachslide = function attachslide(e) {
          _this2._panel.addEventListener('mousemove', slide);

          _this2._panel.addEventListener('touchmove', slide);

          m_x = e.pageX;
          prevSeed = _this2.seed;
          _this2.sliding = true;
        };

        var releaseslide = function releaseslide() {
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
            });
          }
        };

        this._panel.addEventListener('mousedown', attachslide);

        this._panel.addEventListener('touchstart', attachslide);

        this._panel.addEventListener('mouseup', releaseslide);

        this._panel.addEventListener('touchend', releaseslide);

        this._panel.addEventListener('mouseleave', releaseslide);

        this._panel.addEventListener('touchleave', releaseslide); // touch slide bar 


        var m_x_b, prevSeed_b;

        var slide_b = function slide_b(e) {
          var x = e.pageX;
          var m_diff = _this2.horizon ? m_x_b - x : x - m_x_b;
          var m_ratio = m_diff / _this2.offsetWidth;
          _this2.seed = prevSeed_b + m_ratio;
        };

        var attachslide_b = function attachslide_b(e) {
          _this2._bar.addEventListener('mousemove', slide_b);

          _this2._bar.addEventListener('touchmove', slide_b);

          var attachseed = (e.pageX - _this2.offsetLeft) / _this2.offsetWidth - 1 / _this2._panels.length;
          _this2.seed = attachseed;
          prevSeed_b = attachseed;
          m_x_b = e.pageX;
          _this2.sliding = true;
        };

        var releaseslide_b = function releaseslide_b() {
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
            });
          }
        };

        if (this._bar) {
          this._bar.addEventListener('mousedown', attachslide_b);

          this._bar.addEventListener('touchstart', attachslide_b);

          this._bar.addEventListener('mouseup', releaseslide_b);

          this._bar.addEventListener('touchend', releaseslide_b);

          this._bar.addEventListener('mouseleave', releaseslide_b);

          this._bar.addEventListener('touchleave', releaseslide_b);
        }

        if (this.seed === null) this.seed = 0;
        if (this.seekbarH === null) this.seekbarH = 3;
        if (this.tabChangeDuration === null) this.tabChangeDuration = 200;
        if (this.horizon === null) this.horizon = false;
        if (this.opmin === null) this.opmin = 0;
        this.tabChangeDuration = this.tabChangeDuration;
        this.seekbarH = this.seekbarH;
        this.horizon = this.horizon;
        this.seed = this.seed;
        this.opmin = this.opmin;

        forEach$2(_context5 = from_1$4(this._tabs)).call(_context5, function (n) {
          return n.classList.add('tabs');
        });

        var tabclick = function tabclick(e) {
          var node = _this2._tabs;

          var index = indexOf$2(node).call(node, e.target.closest('.tabs'));

          var diff = index - _this2.index;
          var step = 1 / node.length;
          var now_seed = _this2.seed;
          _this2._ease.type = 'ease_out';

          _this2._ease.Start(function (e) {
            _this2.seed = now_seed + step * (diff * e);
          });
        };

        if (this._tabs.length) this._tabslot.addEventListener('click', tabclick);
        window.addEventListener('resize', bind$3(_context6 = this.redraw).call(_context6, this));
        this.imgonload();
      }
    }, {
      key: "addtabproperty",
      value: function addtabproperty() {
        var _this3 = this;

        if (this._tabs.length) {
          var _context7;

          forEach$2(_context7 = this._farray).call(_context7, function (v, i) {
            if (v >= 0.5) _this3._tabs[i].classList.add('select');else _this3._tabs[i].classList.remove('select');
          });
        }
      }
    }, {
      key: "forLoopCalc",
      value: function forLoopCalc(seed, fadeArray, tabpanelLen) {
        var step = 1 / tabpanelLen;

        var fa_copy = toConsumableArray(fadeArray);

        reverse$2(fa_copy).call(fa_copy);

        var _fa_copy = toArray(fa_copy),
            rest = _fa_copy[0],
            fa_use = slice$2(_fa_copy).call(_fa_copy, 1);

        reverse$2(fa_use).call(fa_use);

        if (seed >= step * (tabpanelLen - 1)) fa_use[0] = rest;
        return toConsumableArray(fa_use);
      }
    }, {
      key: "fade",
      value: function fade(seed) {
        var _this4 = this;

        var s = seed - Math.floor(seed);
        var node = this._panels;
        var mf = new MultiFade(node.length + 1); //!!!

        var fa = mf.get(s);
        var fa_use = this.forLoopCalc(s, fa, node.length);

        var fa_use_ = map$2(fa_use).call(fa_use, function (v) {
          return Math.max(Math.min(v + _this4.opmin, 1), 0);
        });

        forEach$2(node).call(node, function (elem, index) {
          return elem.style.opacity = fa_use_[index];
        });

        forEach$2(node).call(node, function (elem, index) {
          if (fa_use_[index] >= 0.5) elem.classList.add('select');else elem.classList.remove('select');
        });

        this._farray = fa_use_;
        this.onfade(fa_use_);
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

        var H_array_f = map$2(H_arry).call(H_arry, function (h, index) {
          return h * fa_use[index];
        });

        var h = reduce$2(H_array_f).call(H_array_f, function (a, c) {
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
        var _context8;

        this._panelsH = reduce$2(_context8 = from_1$4(this._panels)).call(_context8, function (a, c) {
          return concat$2(a).call(a, c.offsetHeight);
        }, []);
        this.fade(this.seed);
        this.fadeH(this.seed);
      }
    }, {
      key: "next",
      value: function next() {
        var _this5 = this;

        var node = this._panels;
        var step = 1 / node.length;
        var nowSeed = this.seed;

        this._ease.Start(function (e) {
          if (!_this5.sliding) _this5.seed = nowSeed + step * e;
        });
      }
    }, {
      key: "prev",
      value: function prev() {
        var _this6 = this;

        var node = this._panels;
        var step = 1 / node.length;
        var nowSeed = this.seed;

        this._ease.Start(function (e) {
          if (!_this6.sliding) _this6.seed = nowSeed - step * e;
        });
      }
    }, {
      key: "imgonload",
      value: function imgonload() {
        var _context9,
            _this7 = this;

        var tab = document.getElementsByTagName('rikaaa-tab');

        var imgNode = map$2(_context9 = from_1$4(tab)).call(_context9, function (node) {
          return from_1$4(node.querySelectorAll('img'));
        });

        var imgNode_flatten = reduce$2(imgNode).call(imgNode, function (a, c) {
          var _concatInstanceProper, _context10;

          return (_concatInstanceProper = concat$2(a)).call.apply(_concatInstanceProper, concat$2(_context10 = [a]).call(_context10, toConsumableArray(c)));
        }, []);

        var imgloaded = promise$3.all(map$2(imgNode_flatten).call(imgNode_flatten, function (i) {
          return new promise$3(function (resolve, reject) {
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
          _this7.redraw();
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
          var _context11;

          this._panel.classList.add('horizon');

          map$2(_context11 = from_1$4(node)).call(_context11, function (n) {
            return n.style.width = "".concat(100 * 1 / node.length, "%");
          });
        } else {
          var _context12;

          this._panel.classList.remove('horizon');

          map$2(_context12 = from_1$4(node)).call(_context12, function (n) {
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
  }(wrapNativeSuper(HTMLElement));

  ready(function () {
    customElements.define('rikaaa-tab', rikaaatab);
  });

}());
