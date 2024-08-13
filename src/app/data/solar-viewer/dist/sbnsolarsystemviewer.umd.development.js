(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('three')) :
  typeof define === 'function' && define.amd ? define(['exports', 'three'], factory) :
  (global = global || self, factory(global.SbnSolarSystemViewer = {}, global.THREE));
}(this, (function (exports, THREE) { 'use strict';

  function _regeneratorRuntime() {
    _regeneratorRuntime = function () {
      return e;
    };
    var t,
      e = {},
      r = Object.prototype,
      n = r.hasOwnProperty,
      o = Object.defineProperty || function (t, e, r) {
        t[e] = r.value;
      },
      i = "function" == typeof Symbol ? Symbol : {},
      a = i.iterator || "@@iterator",
      c = i.asyncIterator || "@@asyncIterator",
      u = i.toStringTag || "@@toStringTag";
    function define(t, e, r) {
      return Object.defineProperty(t, e, {
        value: r,
        enumerable: !0,
        configurable: !0,
        writable: !0
      }), t[e];
    }
    try {
      define({}, "");
    } catch (t) {
      define = function (t, e, r) {
        return t[e] = r;
      };
    }
    function wrap(t, e, r, n) {
      var i = e && e.prototype instanceof Generator ? e : Generator,
        a = Object.create(i.prototype),
        c = new Context(n || []);
      return o(a, "_invoke", {
        value: makeInvokeMethod(t, r, c)
      }), a;
    }
    function tryCatch(t, e, r) {
      try {
        return {
          type: "normal",
          arg: t.call(e, r)
        };
      } catch (t) {
        return {
          type: "throw",
          arg: t
        };
      }
    }
    e.wrap = wrap;
    var h = "suspendedStart",
      l = "suspendedYield",
      f = "executing",
      s = "completed",
      y = {};
    function Generator() {}
    function GeneratorFunction() {}
    function GeneratorFunctionPrototype() {}
    var p = {};
    define(p, a, function () {
      return this;
    });
    var d = Object.getPrototypeOf,
      v = d && d(d(values([])));
    v && v !== r && n.call(v, a) && (p = v);
    var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p);
    function defineIteratorMethods(t) {
      ["next", "throw", "return"].forEach(function (e) {
        define(t, e, function (t) {
          return this._invoke(e, t);
        });
      });
    }
    function AsyncIterator(t, e) {
      function invoke(r, o, i, a) {
        var c = tryCatch(t[r], t, o);
        if ("throw" !== c.type) {
          var u = c.arg,
            h = u.value;
          return h && "object" == typeof h && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) {
            invoke("next", t, i, a);
          }, function (t) {
            invoke("throw", t, i, a);
          }) : e.resolve(h).then(function (t) {
            u.value = t, i(u);
          }, function (t) {
            return invoke("throw", t, i, a);
          });
        }
        a(c.arg);
      }
      var r;
      o(this, "_invoke", {
        value: function (t, n) {
          function callInvokeWithMethodAndArg() {
            return new e(function (e, r) {
              invoke(t, n, e, r);
            });
          }
          return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg();
        }
      });
    }
    function makeInvokeMethod(e, r, n) {
      var o = h;
      return function (i, a) {
        if (o === f) throw new Error("Generator is already running");
        if (o === s) {
          if ("throw" === i) throw a;
          return {
            value: t,
            done: !0
          };
        }
        for (n.method = i, n.arg = a;;) {
          var c = n.delegate;
          if (c) {
            var u = maybeInvokeDelegate(c, n);
            if (u) {
              if (u === y) continue;
              return u;
            }
          }
          if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) {
            if (o === h) throw o = s, n.arg;
            n.dispatchException(n.arg);
          } else "return" === n.method && n.abrupt("return", n.arg);
          o = f;
          var p = tryCatch(e, r, n);
          if ("normal" === p.type) {
            if (o = n.done ? s : l, p.arg === y) continue;
            return {
              value: p.arg,
              done: n.done
            };
          }
          "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg);
        }
      };
    }
    function maybeInvokeDelegate(e, r) {
      var n = r.method,
        o = e.iterator[n];
      if (o === t) return r.delegate = null, "throw" === n && e.iterator.return && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y;
      var i = tryCatch(o, e.iterator, r.arg);
      if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y;
      var a = i.arg;
      return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y);
    }
    function pushTryEntry(t) {
      var e = {
        tryLoc: t[0]
      };
      1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e);
    }
    function resetTryEntry(t) {
      var e = t.completion || {};
      e.type = "normal", delete e.arg, t.completion = e;
    }
    function Context(t) {
      this.tryEntries = [{
        tryLoc: "root"
      }], t.forEach(pushTryEntry, this), this.reset(!0);
    }
    function values(e) {
      if (e || "" === e) {
        var r = e[a];
        if (r) return r.call(e);
        if ("function" == typeof e.next) return e;
        if (!isNaN(e.length)) {
          var o = -1,
            i = function next() {
              for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next;
              return next.value = t, next.done = !0, next;
            };
          return i.next = i;
        }
      }
      throw new TypeError(typeof e + " is not iterable");
    }
    return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", {
      value: GeneratorFunctionPrototype,
      configurable: !0
    }), o(GeneratorFunctionPrototype, "constructor", {
      value: GeneratorFunction,
      configurable: !0
    }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) {
      var e = "function" == typeof t && t.constructor;
      return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name));
    }, e.mark = function (t) {
      return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t;
    }, e.awrap = function (t) {
      return {
        __await: t
      };
    }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () {
      return this;
    }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) {
      void 0 === i && (i = Promise);
      var a = new AsyncIterator(wrap(t, r, n, o), i);
      return e.isGeneratorFunction(r) ? a : a.next().then(function (t) {
        return t.done ? t.value : a.next();
      });
    }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () {
      return this;
    }), define(g, "toString", function () {
      return "[object Generator]";
    }), e.keys = function (t) {
      var e = Object(t),
        r = [];
      for (var n in e) r.push(n);
      return r.reverse(), function next() {
        for (; r.length;) {
          var t = r.pop();
          if (t in e) return next.value = t, next.done = !1, next;
        }
        return next.done = !0, next;
      };
    }, e.values = values, Context.prototype = {
      constructor: Context,
      reset: function (e) {
        if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t);
      },
      stop: function () {
        this.done = !0;
        var t = this.tryEntries[0].completion;
        if ("throw" === t.type) throw t.arg;
        return this.rval;
      },
      dispatchException: function (e) {
        if (this.done) throw e;
        var r = this;
        function handle(n, o) {
          return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o;
        }
        for (var o = this.tryEntries.length - 1; o >= 0; --o) {
          var i = this.tryEntries[o],
            a = i.completion;
          if ("root" === i.tryLoc) return handle("end");
          if (i.tryLoc <= this.prev) {
            var c = n.call(i, "catchLoc"),
              u = n.call(i, "finallyLoc");
            if (c && u) {
              if (this.prev < i.catchLoc) return handle(i.catchLoc, !0);
              if (this.prev < i.finallyLoc) return handle(i.finallyLoc);
            } else if (c) {
              if (this.prev < i.catchLoc) return handle(i.catchLoc, !0);
            } else {
              if (!u) throw new Error("try statement without catch or finally");
              if (this.prev < i.finallyLoc) return handle(i.finallyLoc);
            }
          }
        }
      },
      abrupt: function (t, e) {
        for (var r = this.tryEntries.length - 1; r >= 0; --r) {
          var o = this.tryEntries[r];
          if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) {
            var i = o;
            break;
          }
        }
        i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null);
        var a = i ? i.completion : {};
        return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a);
      },
      complete: function (t, e) {
        if ("throw" === t.type) throw t.arg;
        return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y;
      },
      finish: function (t) {
        for (var e = this.tryEntries.length - 1; e >= 0; --e) {
          var r = this.tryEntries[e];
          if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y;
        }
      },
      catch: function (t) {
        for (var e = this.tryEntries.length - 1; e >= 0; --e) {
          var r = this.tryEntries[e];
          if (r.tryLoc === t) {
            var n = r.completion;
            if ("throw" === n.type) {
              var o = n.arg;
              resetTryEntry(r);
            }
            return o;
          }
        }
        throw new Error("illegal catch attempt");
      },
      delegateYield: function (e, r, n) {
        return this.delegate = {
          iterator: values(e),
          resultName: r,
          nextLoc: n
        }, "next" === this.method && (this.arg = t), y;
      }
    }, e;
  }
  function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
      var info = gen[key](arg);
      var value = info.value;
    } catch (error) {
      reject(error);
      return;
    }
    if (info.done) {
      resolve(value);
    } else {
      Promise.resolve(value).then(_next, _throw);
    }
  }
  function _asyncToGenerator(fn) {
    return function () {
      var self = this,
        args = arguments;
      return new Promise(function (resolve, reject) {
        var gen = fn.apply(self, args);
        function _next(value) {
          asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
        }
        function _throw(err) {
          asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
        }
        _next(undefined);
      });
    };
  }
  function _extends() {
    _extends = Object.assign ? Object.assign.bind() : function (target) {
      for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i];
        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }
      return target;
    };
    return _extends.apply(this, arguments);
  }
  function _inheritsLoose(subClass, superClass) {
    subClass.prototype = Object.create(superClass.prototype);
    subClass.prototype.constructor = subClass;
    _setPrototypeOf(subClass, superClass);
  }
  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };
    return _setPrototypeOf(o, p);
  }

  // This set of controls performs orbiting, dollying (zooming), and panning.
  // Unlike TrackballControls, it maintains the "up" direction object.up (+Y by default).
  //
  //    Orbit - left mouse / touch: one-finger move
  //    Zoom - middle mouse, or mousewheel / touch: two-finger spread or squish
  //    Pan - right mouse, or left mouse + ctrl/meta/shiftKey, or arrow keys / touch: two-finger move

  const _changeEvent = { type: 'change' };
  const _startEvent = { type: 'start' };
  const _endEvent = { type: 'end' };

  class OrbitControls extends THREE.EventDispatcher {

  	constructor( object, domElement ) {

  		super();

  		if ( domElement === undefined ) console.warn( 'THREE.OrbitControls: The second parameter "domElement" is now mandatory.' );
  		if ( domElement === document ) console.error( 'THREE.OrbitControls: "document" should not be used as the target "domElement". Please use "renderer.domElement" instead.' );

  		this.object = object;
  		this.domElement = domElement;

  		// Set to false to disable this control
  		this.enabled = true;

  		// "target" sets the location of focus, where the object orbits around
  		this.target = new THREE.Vector3();

  		// How far you can dolly in and out ( PerspectiveCamera only )
  		this.minDistance = 0;
  		this.maxDistance = Infinity;

  		// How far you can zoom in and out ( OrthographicCamera only )
  		this.minZoom = 0;
  		this.maxZoom = Infinity;

  		// How far you can orbit vertically, upper and lower limits.
  		// Range is 0 to Math.PI radians.
  		this.minPolarAngle = 0; // radians
  		this.maxPolarAngle = Math.PI; // radians

  		// How far you can orbit horizontally, upper and lower limits.
  		// If set, the interval [ min, max ] must be a sub-interval of [ - 2 PI, 2 PI ], with ( max - min < 2 PI )
  		this.minAzimuthAngle = - Infinity; // radians
  		this.maxAzimuthAngle = Infinity; // radians

  		// Set to true to enable damping (inertia)
  		// If damping is enabled, you must call controls.update() in your animation loop
  		this.enableDamping = false;
  		this.dampingFactor = 0.05;

  		// This option actually enables dollying in and out; left as "zoom" for backwards compatibility.
  		// Set to false to disable zooming
  		this.enableZoom = true;
  		this.zoomSpeed = 1.0;

  		// Set to false to disable rotating
  		this.enableRotate = true;
  		this.rotateSpeed = 1.0;

  		// Set to false to disable panning
  		this.enablePan = true;
  		this.panSpeed = 1.0;
  		this.screenSpacePanning = true; // if false, pan orthogonal to world-space direction camera.up
  		this.keyPanSpeed = 7.0;	// pixels moved per arrow key push

  		// Set to true to automatically rotate around the target
  		// If auto-rotate is enabled, you must call controls.update() in your animation loop
  		this.autoRotate = false;
  		this.autoRotateSpeed = 2.0; // 30 seconds per orbit when fps is 60

  		// The four arrow keys
  		this.keys = { LEFT: 'ArrowLeft', UP: 'ArrowUp', RIGHT: 'ArrowRight', BOTTOM: 'ArrowDown' };

  		// Mouse buttons
  		this.mouseButtons = { LEFT: THREE.MOUSE.ROTATE, MIDDLE: THREE.MOUSE.DOLLY, RIGHT: THREE.MOUSE.PAN };

  		// Touch fingers
  		this.touches = { ONE: THREE.TOUCH.ROTATE, TWO: THREE.TOUCH.DOLLY_PAN };

  		// for reset
  		this.target0 = this.target.clone();
  		this.position0 = this.object.position.clone();
  		this.zoom0 = this.object.zoom;

  		// the target DOM element for key events
  		this._domElementKeyEvents = null;

  		//
  		// public methods
  		//

  		this.getPolarAngle = function () {

  			return spherical.phi;

  		};

  		this.getAzimuthalAngle = function () {

  			return spherical.theta;

  		};

  		this.listenToKeyEvents = function ( domElement ) {

  			domElement.addEventListener( 'keydown', onKeyDown );
  			this._domElementKeyEvents = domElement;

  		};

  		this.saveState = function () {

  			scope.target0.copy( scope.target );
  			scope.position0.copy( scope.object.position );
  			scope.zoom0 = scope.object.zoom;

  		};

  		this.reset = function () {

  			scope.target.copy( scope.target0 );
  			scope.object.position.copy( scope.position0 );
  			scope.object.zoom = scope.zoom0;

  			scope.object.updateProjectionMatrix();
  			scope.dispatchEvent( _changeEvent );

  			scope.update();

  			state = STATE.NONE;

  		};

  		// this method is exposed, but perhaps it would be better if we can make it private...
  		this.update = function () {

  			const offset = new THREE.Vector3();

  			// so camera.up is the orbit axis
  			const quat = new THREE.Quaternion().setFromUnitVectors( object.up, new THREE.Vector3( 0, 1, 0 ) );
  			const quatInverse = quat.clone().invert();

  			const lastPosition = new THREE.Vector3();
  			const lastQuaternion = new THREE.Quaternion();

  			const twoPI = 2 * Math.PI;

  			return function update() {

  				const position = scope.object.position;

  				offset.copy( position ).sub( scope.target );

  				// rotate offset to "y-axis-is-up" space
  				offset.applyQuaternion( quat );

  				// angle from z-axis around y-axis
  				spherical.setFromVector3( offset );

  				if ( scope.autoRotate && state === STATE.NONE ) {

  					rotateLeft( getAutoRotationAngle() );

  				}

  				if ( scope.enableDamping ) {

  					spherical.theta += sphericalDelta.theta * scope.dampingFactor;
  					spherical.phi += sphericalDelta.phi * scope.dampingFactor;

  				} else {

  					spherical.theta += sphericalDelta.theta;
  					spherical.phi += sphericalDelta.phi;

  				}

  				// restrict theta to be between desired limits

  				let min = scope.minAzimuthAngle;
  				let max = scope.maxAzimuthAngle;

  				if ( isFinite( min ) && isFinite( max ) ) {

  					if ( min < - Math.PI ) min += twoPI; else if ( min > Math.PI ) min -= twoPI;

  					if ( max < - Math.PI ) max += twoPI; else if ( max > Math.PI ) max -= twoPI;

  					if ( min <= max ) {

  						spherical.theta = Math.max( min, Math.min( max, spherical.theta ) );

  					} else {

  						spherical.theta = ( spherical.theta > ( min + max ) / 2 ) ?
  							Math.max( min, spherical.theta ) :
  							Math.min( max, spherical.theta );

  					}

  				}

  				// restrict phi to be between desired limits
  				spherical.phi = Math.max( scope.minPolarAngle, Math.min( scope.maxPolarAngle, spherical.phi ) );

  				spherical.makeSafe();


  				spherical.radius *= scale;

  				// restrict radius to be between desired limits
  				spherical.radius = Math.max( scope.minDistance, Math.min( scope.maxDistance, spherical.radius ) );

  				// move target to panned location

  				if ( scope.enableDamping === true ) {

  					scope.target.addScaledVector( panOffset, scope.dampingFactor );

  				} else {

  					scope.target.add( panOffset );

  				}

  				offset.setFromSpherical( spherical );

  				// rotate offset back to "camera-up-vector-is-up" space
  				offset.applyQuaternion( quatInverse );

  				position.copy( scope.target ).add( offset );

  				scope.object.lookAt( scope.target );

  				if ( scope.enableDamping === true ) {

  					sphericalDelta.theta *= ( 1 - scope.dampingFactor );
  					sphericalDelta.phi *= ( 1 - scope.dampingFactor );

  					panOffset.multiplyScalar( 1 - scope.dampingFactor );

  				} else {

  					sphericalDelta.set( 0, 0, 0 );

  					panOffset.set( 0, 0, 0 );

  				}

  				scale = 1;

  				// update condition is:
  				// min(camera displacement, camera rotation in radians)^2 > EPS
  				// using small-angle approximation cos(x/2) = 1 - x^2 / 8

  				if ( zoomChanged ||
  					lastPosition.distanceToSquared( scope.object.position ) > EPS ||
  					8 * ( 1 - lastQuaternion.dot( scope.object.quaternion ) ) > EPS ) {

  					scope.dispatchEvent( _changeEvent );

  					lastPosition.copy( scope.object.position );
  					lastQuaternion.copy( scope.object.quaternion );
  					zoomChanged = false;

  					return true;

  				}

  				return false;

  			};

  		}();

  		this.dispose = function () {

  			scope.domElement.removeEventListener( 'contextmenu', onContextMenu );

  			scope.domElement.removeEventListener( 'pointerdown', onPointerDown );
  			scope.domElement.removeEventListener( 'wheel', onMouseWheel );

  			scope.domElement.removeEventListener( 'touchstart', onTouchStart );
  			scope.domElement.removeEventListener( 'touchend', onTouchEnd );
  			scope.domElement.removeEventListener( 'touchmove', onTouchMove );

  			scope.domElement.ownerDocument.removeEventListener( 'pointermove', onPointerMove );
  			scope.domElement.ownerDocument.removeEventListener( 'pointerup', onPointerUp );


  			if ( scope._domElementKeyEvents !== null ) {

  				scope._domElementKeyEvents.removeEventListener( 'keydown', onKeyDown );

  			}

  			//scope.dispatchEvent( { type: 'dispose' } ); // should this be added here?

  		};

  		//
  		// internals
  		//

  		const scope = this;

  		const STATE = {
  			NONE: - 1,
  			ROTATE: 0,
  			DOLLY: 1,
  			PAN: 2,
  			TOUCH_ROTATE: 3,
  			TOUCH_PAN: 4,
  			TOUCH_DOLLY_PAN: 5,
  			TOUCH_DOLLY_ROTATE: 6
  		};

  		let state = STATE.NONE;

  		const EPS = 0.000001;

  		// current position in spherical coordinates
  		const spherical = new THREE.Spherical();
  		const sphericalDelta = new THREE.Spherical();

  		let scale = 1;
  		const panOffset = new THREE.Vector3();
  		let zoomChanged = false;

  		const rotateStart = new THREE.Vector2();
  		const rotateEnd = new THREE.Vector2();
  		const rotateDelta = new THREE.Vector2();

  		const panStart = new THREE.Vector2();
  		const panEnd = new THREE.Vector2();
  		const panDelta = new THREE.Vector2();

  		const dollyStart = new THREE.Vector2();
  		const dollyEnd = new THREE.Vector2();
  		const dollyDelta = new THREE.Vector2();

  		function getAutoRotationAngle() {

  			return 2 * Math.PI / 60 / 60 * scope.autoRotateSpeed;

  		}

  		function getZoomScale() {

  			return Math.pow( 0.95, scope.zoomSpeed );

  		}

  		function rotateLeft( angle ) {

  			sphericalDelta.theta -= angle;

  		}

  		function rotateUp( angle ) {

  			sphericalDelta.phi -= angle;

  		}

  		const panLeft = function () {

  			const v = new THREE.Vector3();

  			return function panLeft( distance, objectMatrix ) {

  				v.setFromMatrixColumn( objectMatrix, 0 ); // get X column of objectMatrix
  				v.multiplyScalar( - distance );

  				panOffset.add( v );

  			};

  		}();

  		const panUp = function () {

  			const v = new THREE.Vector3();

  			return function panUp( distance, objectMatrix ) {

  				if ( scope.screenSpacePanning === true ) {

  					v.setFromMatrixColumn( objectMatrix, 1 );

  				} else {

  					v.setFromMatrixColumn( objectMatrix, 0 );
  					v.crossVectors( scope.object.up, v );

  				}

  				v.multiplyScalar( distance );

  				panOffset.add( v );

  			};

  		}();

  		// deltaX and deltaY are in pixels; right and down are positive
  		const pan = function () {

  			const offset = new THREE.Vector3();

  			return function pan( deltaX, deltaY ) {

  				const element = scope.domElement;

  				if ( scope.object.isPerspectiveCamera ) {

  					// perspective
  					const position = scope.object.position;
  					offset.copy( position ).sub( scope.target );
  					let targetDistance = offset.length();

  					// half of the fov is center to top of screen
  					targetDistance *= Math.tan( ( scope.object.fov / 2 ) * Math.PI / 180.0 );

  					// we use only clientHeight here so aspect ratio does not distort speed
  					panLeft( 2 * deltaX * targetDistance / element.clientHeight, scope.object.matrix );
  					panUp( 2 * deltaY * targetDistance / element.clientHeight, scope.object.matrix );

  				} else if ( scope.object.isOrthographicCamera ) {

  					// orthographic
  					panLeft( deltaX * ( scope.object.right - scope.object.left ) / scope.object.zoom / element.clientWidth, scope.object.matrix );
  					panUp( deltaY * ( scope.object.top - scope.object.bottom ) / scope.object.zoom / element.clientHeight, scope.object.matrix );

  				} else {

  					// camera neither orthographic nor perspective
  					console.warn( 'WARNING: OrbitControls.js encountered an unknown camera type - pan disabled.' );
  					scope.enablePan = false;

  				}

  			};

  		}();

  		function dollyOut( dollyScale ) {

  			if ( scope.object.isPerspectiveCamera ) {

  				scale /= dollyScale;

  			} else if ( scope.object.isOrthographicCamera ) {

  				scope.object.zoom = Math.max( scope.minZoom, Math.min( scope.maxZoom, scope.object.zoom * dollyScale ) );
  				scope.object.updateProjectionMatrix();
  				zoomChanged = true;

  			} else {

  				console.warn( 'WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled.' );
  				scope.enableZoom = false;

  			}

  		}

  		function dollyIn( dollyScale ) {

  			if ( scope.object.isPerspectiveCamera ) {

  				scale *= dollyScale;

  			} else if ( scope.object.isOrthographicCamera ) {

  				scope.object.zoom = Math.max( scope.minZoom, Math.min( scope.maxZoom, scope.object.zoom / dollyScale ) );
  				scope.object.updateProjectionMatrix();
  				zoomChanged = true;

  			} else {

  				console.warn( 'WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled.' );
  				scope.enableZoom = false;

  			}

  		}

  		//
  		// event callbacks - update the object state
  		//

  		function handleMouseDownRotate( event ) {

  			rotateStart.set( event.clientX, event.clientY );

  		}

  		function handleMouseDownDolly( event ) {

  			dollyStart.set( event.clientX, event.clientY );

  		}

  		function handleMouseDownPan( event ) {

  			panStart.set( event.clientX, event.clientY );

  		}

  		function handleMouseMoveRotate( event ) {

  			rotateEnd.set( event.clientX, event.clientY );

  			rotateDelta.subVectors( rotateEnd, rotateStart ).multiplyScalar( scope.rotateSpeed );

  			const element = scope.domElement;

  			rotateLeft( 2 * Math.PI * rotateDelta.x / element.clientHeight ); // yes, height

  			rotateUp( 2 * Math.PI * rotateDelta.y / element.clientHeight );

  			rotateStart.copy( rotateEnd );

  			scope.update();

  		}

  		function handleMouseMoveDolly( event ) {

  			dollyEnd.set( event.clientX, event.clientY );

  			dollyDelta.subVectors( dollyEnd, dollyStart );

  			if ( dollyDelta.y > 0 ) {

  				dollyOut( getZoomScale() );

  			} else if ( dollyDelta.y < 0 ) {

  				dollyIn( getZoomScale() );

  			}

  			dollyStart.copy( dollyEnd );

  			scope.update();

  		}

  		function handleMouseMovePan( event ) {

  			panEnd.set( event.clientX, event.clientY );

  			panDelta.subVectors( panEnd, panStart ).multiplyScalar( scope.panSpeed );

  			pan( panDelta.x, panDelta.y );

  			panStart.copy( panEnd );

  			scope.update();

  		}

  		function handleMouseWheel( event ) {

  			if ( event.deltaY < 0 ) {

  				dollyIn( getZoomScale() );

  			} else if ( event.deltaY > 0 ) {

  				dollyOut( getZoomScale() );

  			}

  			scope.update();

  		}

  		function handleKeyDown( event ) {

  			let needsUpdate = false;

  			switch ( event.code ) {

  				case scope.keys.UP:
  					pan( 0, scope.keyPanSpeed );
  					needsUpdate = true;
  					break;

  				case scope.keys.BOTTOM:
  					pan( 0, - scope.keyPanSpeed );
  					needsUpdate = true;
  					break;

  				case scope.keys.LEFT:
  					pan( scope.keyPanSpeed, 0 );
  					needsUpdate = true;
  					break;

  				case scope.keys.RIGHT:
  					pan( - scope.keyPanSpeed, 0 );
  					needsUpdate = true;
  					break;

  			}

  			if ( needsUpdate ) {

  				// prevent the browser from scrolling on cursor keys
  				event.preventDefault();

  				scope.update();

  			}


  		}

  		function handleTouchStartRotate( event ) {

  			if ( event.touches.length == 1 ) {

  				rotateStart.set( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY );

  			} else {

  				const x = 0.5 * ( event.touches[ 0 ].pageX + event.touches[ 1 ].pageX );
  				const y = 0.5 * ( event.touches[ 0 ].pageY + event.touches[ 1 ].pageY );

  				rotateStart.set( x, y );

  			}

  		}

  		function handleTouchStartPan( event ) {

  			if ( event.touches.length == 1 ) {

  				panStart.set( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY );

  			} else {

  				const x = 0.5 * ( event.touches[ 0 ].pageX + event.touches[ 1 ].pageX );
  				const y = 0.5 * ( event.touches[ 0 ].pageY + event.touches[ 1 ].pageY );

  				panStart.set( x, y );

  			}

  		}

  		function handleTouchStartDolly( event ) {

  			const dx = event.touches[ 0 ].pageX - event.touches[ 1 ].pageX;
  			const dy = event.touches[ 0 ].pageY - event.touches[ 1 ].pageY;

  			const distance = Math.sqrt( dx * dx + dy * dy );

  			dollyStart.set( 0, distance );

  		}

  		function handleTouchStartDollyPan( event ) {

  			if ( scope.enableZoom ) handleTouchStartDolly( event );

  			if ( scope.enablePan ) handleTouchStartPan( event );

  		}

  		function handleTouchStartDollyRotate( event ) {

  			if ( scope.enableZoom ) handleTouchStartDolly( event );

  			if ( scope.enableRotate ) handleTouchStartRotate( event );

  		}

  		function handleTouchMoveRotate( event ) {

  			if ( event.touches.length == 1 ) {

  				rotateEnd.set( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY );

  			} else {

  				const x = 0.5 * ( event.touches[ 0 ].pageX + event.touches[ 1 ].pageX );
  				const y = 0.5 * ( event.touches[ 0 ].pageY + event.touches[ 1 ].pageY );

  				rotateEnd.set( x, y );

  			}

  			rotateDelta.subVectors( rotateEnd, rotateStart ).multiplyScalar( scope.rotateSpeed );

  			const element = scope.domElement;

  			rotateLeft( 2 * Math.PI * rotateDelta.x / element.clientHeight ); // yes, height

  			rotateUp( 2 * Math.PI * rotateDelta.y / element.clientHeight );

  			rotateStart.copy( rotateEnd );

  		}

  		function handleTouchMovePan( event ) {

  			if ( event.touches.length == 1 ) {

  				panEnd.set( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY );

  			} else {

  				const x = 0.5 * ( event.touches[ 0 ].pageX + event.touches[ 1 ].pageX );
  				const y = 0.5 * ( event.touches[ 0 ].pageY + event.touches[ 1 ].pageY );

  				panEnd.set( x, y );

  			}

  			panDelta.subVectors( panEnd, panStart ).multiplyScalar( scope.panSpeed );

  			pan( panDelta.x, panDelta.y );

  			panStart.copy( panEnd );

  		}

  		function handleTouchMoveDolly( event ) {

  			const dx = event.touches[ 0 ].pageX - event.touches[ 1 ].pageX;
  			const dy = event.touches[ 0 ].pageY - event.touches[ 1 ].pageY;

  			const distance = Math.sqrt( dx * dx + dy * dy );

  			dollyEnd.set( 0, distance );

  			dollyDelta.set( 0, Math.pow( dollyEnd.y / dollyStart.y, scope.zoomSpeed ) );

  			dollyOut( dollyDelta.y );

  			dollyStart.copy( dollyEnd );

  		}

  		function handleTouchMoveDollyPan( event ) {

  			if ( scope.enableZoom ) handleTouchMoveDolly( event );

  			if ( scope.enablePan ) handleTouchMovePan( event );

  		}

  		function handleTouchMoveDollyRotate( event ) {

  			if ( scope.enableZoom ) handleTouchMoveDolly( event );

  			if ( scope.enableRotate ) handleTouchMoveRotate( event );

  		}

  		//
  		// event handlers - FSM: listen for events and reset state
  		//

  		function onPointerDown( event ) {

  			if ( scope.enabled === false ) return;

  			switch ( event.pointerType ) {

  				case 'mouse':
  				case 'pen':
  					onMouseDown( event );
  					break;

  				// TODO touch

  			}

  		}

  		function onPointerMove( event ) {

  			if ( scope.enabled === false ) return;

  			switch ( event.pointerType ) {

  				case 'mouse':
  				case 'pen':
  					onMouseMove( event );
  					break;

  				// TODO touch

  			}

  		}

  		function onPointerUp( event ) {

  			switch ( event.pointerType ) {

  				case 'mouse':
  				case 'pen':
  					onMouseUp();
  					break;

  				// TODO touch

  			}

  		}

  		function onMouseDown( event ) {

  			// Prevent the browser from scrolling.
  			event.preventDefault();

  			// Manually set the focus since calling preventDefault above
  			// prevents the browser from setting it automatically.

  			scope.domElement.focus ? scope.domElement.focus() : window.focus();

  			let mouseAction;

  			switch ( event.button ) {

  				case 0:

  					mouseAction = scope.mouseButtons.LEFT;
  					break;

  				case 1:

  					mouseAction = scope.mouseButtons.MIDDLE;
  					break;

  				case 2:

  					mouseAction = scope.mouseButtons.RIGHT;
  					break;

  				default:

  					mouseAction = - 1;

  			}

  			switch ( mouseAction ) {

  				case THREE.MOUSE.DOLLY:

  					if ( scope.enableZoom === false ) return;

  					handleMouseDownDolly( event );

  					state = STATE.DOLLY;

  					break;

  				case THREE.MOUSE.ROTATE:

  					if ( event.ctrlKey || event.metaKey || event.shiftKey ) {

  						if ( scope.enablePan === false ) return;

  						handleMouseDownPan( event );

  						state = STATE.PAN;

  					} else {

  						if ( scope.enableRotate === false ) return;

  						handleMouseDownRotate( event );

  						state = STATE.ROTATE;

  					}

  					break;

  				case THREE.MOUSE.PAN:

  					if ( event.ctrlKey || event.metaKey || event.shiftKey ) {

  						if ( scope.enableRotate === false ) return;

  						handleMouseDownRotate( event );

  						state = STATE.ROTATE;

  					} else {

  						if ( scope.enablePan === false ) return;

  						handleMouseDownPan( event );

  						state = STATE.PAN;

  					}

  					break;

  				default:

  					state = STATE.NONE;

  			}

  			if ( state !== STATE.NONE ) {

  				scope.domElement.ownerDocument.addEventListener( 'pointermove', onPointerMove );
  				scope.domElement.ownerDocument.addEventListener( 'pointerup', onPointerUp );

  				scope.dispatchEvent( _startEvent );

  			}

  		}

  		function onMouseMove( event ) {

  			if ( scope.enabled === false ) return;

  			event.preventDefault();

  			switch ( state ) {

  				case STATE.ROTATE:

  					if ( scope.enableRotate === false ) return;

  					handleMouseMoveRotate( event );

  					break;

  				case STATE.DOLLY:

  					if ( scope.enableZoom === false ) return;

  					handleMouseMoveDolly( event );

  					break;

  				case STATE.PAN:

  					if ( scope.enablePan === false ) return;

  					handleMouseMovePan( event );

  					break;

  			}

  		}

  		function onMouseUp( event ) {

  			scope.domElement.ownerDocument.removeEventListener( 'pointermove', onPointerMove );
  			scope.domElement.ownerDocument.removeEventListener( 'pointerup', onPointerUp );

  			if ( scope.enabled === false ) return;

  			scope.dispatchEvent( _endEvent );

  			state = STATE.NONE;

  		}

  		function onMouseWheel( event ) {

  			if ( scope.enabled === false || scope.enableZoom === false || ( state !== STATE.NONE && state !== STATE.ROTATE ) ) return;

  			event.preventDefault();

  			scope.dispatchEvent( _startEvent );

  			handleMouseWheel( event );

  			scope.dispatchEvent( _endEvent );

  		}

  		function onKeyDown( event ) {

  			if ( scope.enabled === false || scope.enablePan === false ) return;

  			handleKeyDown( event );

  		}

  		function onTouchStart( event ) {

  			if ( scope.enabled === false ) return;

  			event.preventDefault(); // prevent scrolling

  			switch ( event.touches.length ) {

  				case 1:

  					switch ( scope.touches.ONE ) {

  						case THREE.TOUCH.ROTATE:

  							if ( scope.enableRotate === false ) return;

  							handleTouchStartRotate( event );

  							state = STATE.TOUCH_ROTATE;

  							break;

  						case THREE.TOUCH.PAN:

  							if ( scope.enablePan === false ) return;

  							handleTouchStartPan( event );

  							state = STATE.TOUCH_PAN;

  							break;

  						default:

  							state = STATE.NONE;

  					}

  					break;

  				case 2:

  					switch ( scope.touches.TWO ) {

  						case THREE.TOUCH.DOLLY_PAN:

  							if ( scope.enableZoom === false && scope.enablePan === false ) return;

  							handleTouchStartDollyPan( event );

  							state = STATE.TOUCH_DOLLY_PAN;

  							break;

  						case THREE.TOUCH.DOLLY_ROTATE:

  							if ( scope.enableZoom === false && scope.enableRotate === false ) return;

  							handleTouchStartDollyRotate( event );

  							state = STATE.TOUCH_DOLLY_ROTATE;

  							break;

  						default:

  							state = STATE.NONE;

  					}

  					break;

  				default:

  					state = STATE.NONE;

  			}

  			if ( state !== STATE.NONE ) {

  				scope.dispatchEvent( _startEvent );

  			}

  		}

  		function onTouchMove( event ) {

  			if ( scope.enabled === false ) return;

  			event.preventDefault(); // prevent scrolling

  			switch ( state ) {

  				case STATE.TOUCH_ROTATE:

  					if ( scope.enableRotate === false ) return;

  					handleTouchMoveRotate( event );

  					scope.update();

  					break;

  				case STATE.TOUCH_PAN:

  					if ( scope.enablePan === false ) return;

  					handleTouchMovePan( event );

  					scope.update();

  					break;

  				case STATE.TOUCH_DOLLY_PAN:

  					if ( scope.enableZoom === false && scope.enablePan === false ) return;

  					handleTouchMoveDollyPan( event );

  					scope.update();

  					break;

  				case STATE.TOUCH_DOLLY_ROTATE:

  					if ( scope.enableZoom === false && scope.enableRotate === false ) return;

  					handleTouchMoveDollyRotate( event );

  					scope.update();

  					break;

  				default:

  					state = STATE.NONE;

  			}

  		}

  		function onTouchEnd( event ) {

  			if ( scope.enabled === false ) return;

  			scope.dispatchEvent( _endEvent );

  			state = STATE.NONE;

  		}

  		function onContextMenu( event ) {

  			if ( scope.enabled === false ) return;

  			event.preventDefault();

  		}

  		//

  		scope.domElement.addEventListener( 'contextmenu', onContextMenu );

  		scope.domElement.addEventListener( 'pointerdown', onPointerDown );
  		scope.domElement.addEventListener( 'wheel', onMouseWheel, { passive: false } );

  		scope.domElement.addEventListener( 'touchstart', onTouchStart, { passive: false } );
  		scope.domElement.addEventListener( 'touchend', onTouchEnd );
  		scope.domElement.addEventListener( 'touchmove', onTouchMove, { passive: false } );

  		// force an update at start

  		this.update();

  	}

  }

  /**
   * A simple ascii-art wrapper for error messaging in order to convey
   * just how tragic your errors are
   */
  function asciiError(msg) {
    // console.clear();
    return "\n\n   ______________________________    . \\  | / .\n  /                            / \\     \\ \\ / /\n |                            | ==========  - -\n  \\____________________________\\_/     / / \\ \\\n  ______________________________      \\  | / | \\\n /                            / \\     \\ \\ / /.   .\n|                            | ==========  - -\n \\____________________________\\_/     / / \\ \\    /\n   ______________________________   / |\\  | /  .\n  /                            / \\     \\ \\ / /\n |                            | ==========  -  - -\n  \\____________________________\\_/     / / \\ \\\n                                     .  / | \\  .\n\n  Are you trying to wreak havoc on the Universe!?!\n\n  " + msg + "\n\n  Idiot.\n\n  ";
  }

  function auToMeters(aus) {
    return 149597870700 * aus;
  }

  var count = 0;
  var simpleUuid = function simpleUuid() {
    count++;
    return 'sbn-solar-system-viewer-' + count;
  };

  var loaderDivId = 'loader-div-id-' + /*#__PURE__*/simpleUuid();
  var borderWidthPxls = 5;
  var spinSpeedMs = 2000;
  var isInit = false;
  /**
   * Simple loader div; removed by `remove-loader-div`
   * It consists of two divs; the outer 'loaderDiv' that is just a shell
   * for centering the div with the actual animation, and the 'animDiv'
   * that does the spinning, etc.
   */
  var addLoaderDiv = function addLoaderDiv(containerDiv) {
    // --->>>
    // Only add once
    if (isInit) return;
    isInit = true;
    // Create divs
    var loaderDiv = document.createElement('div');
    var animDiv = document.createElement('div');
    containerDiv.append(loaderDiv);
    loaderDiv.append(animDiv);
    // Style loaderDiv
    loaderDiv.id = loaderDivId;
    loaderDiv.style.setProperty('position', 'absolute');
    loaderDiv.style.setProperty('top', '0px');
    loaderDiv.style.setProperty('left', '0px');
    loaderDiv.style.setProperty('bottom', '0px');
    loaderDiv.style.setProperty('right', '0px');
    loaderDiv.style.setProperty('display', 'flex');
    loaderDiv.style.setProperty('align-items', 'center');
    loaderDiv.style.setProperty('justify-content', 'center');
    loaderDiv.style.setProperty('pointer-events', 'none');
    // Calc size of radius based on size of container
    var width = loaderDiv.offsetWidth;
    var height = loaderDiv.offsetHeight;
    var shorterLength = width < height ? width : height;
    // Style animation div
    animDiv.style.setProperty('width', shorterLength * 0.25 + 'px');
    animDiv.style.setProperty('height', shorterLength * 0.25 + 'px');
    animDiv.style.setProperty('border', borderWidthPxls + "px solid #f3f3f3");
    animDiv.style.setProperty('border-top', borderWidthPxls + "px solid #3498db");
    animDiv.style.setProperty('border-radius', '100px');
    animDiv.style.setProperty('animation', "sbn-solar-system-viewer-loader-spin " + spinSpeedMs + "ms linear infinite");
    return loaderDiv;
  };

  /**
   * Wrapper to console with time taken
   */
  var myprint = function myprint() {
    var _console;
    for (var _len = arguments.length, msg = new Array(_len), _key = 0; _key < _len; _key++) {
      msg[_key] = arguments[_key];
    }
    (_console = console).log.apply(_console, [' >>> ', +new Date() - +getInitDate(), ' >>> '].concat(msg));
  };

  var setLoaderDivVisibility = function setLoaderDivVisibility(isVisible, fadeOutTimeMs) {
    if (fadeOutTimeMs === void 0) {
      fadeOutTimeMs = 3000;
    }
    // --->>>
    var loaderDiv = document.getElementById(loaderDivId);
    loaderDiv == null || loaderDiv.style.setProperty('transition', "opacity " + fadeOutTimeMs + "ms ease-in-out");
    // pointer-events:none
    loaderDiv == null || loaderDiv.style.setProperty('opacity', "" + (isVisible ? 1 : 0));
    /*   setTimeout(() => {
      loaderDiv?.style.setProperty('display', isVisible ? 'block' : 'none');
    }, fadeOutTimeMs); */
  };

  // Initial Camera Params
  var ar = 2; // Aspect Ratio
  var fov = 60; // Field of View
  var near = /*#__PURE__*/auToMeters(0.00001); // Near Plane
  var far = /*#__PURE__*/auToMeters(3000); // Far Plane
  /**
   * This abstract class is to be inherited by the SceneManager instance.
   * The idea is to place all the usual/boilerplate code for setting up
   * a threeJs scene and running it here, so that the only place you
   * need to implement the specifics of your scene is in your
   * SceneManager instance.
   *
   * By convention, properties/methods that are not intended/expected to be used
   * outside this class are prefixed with '_'
   *
   */
  var AbstractSceneManager = /*#__PURE__*/function () {
    function AbstractSceneManager(_containerId) {
      var _this = this;
      // --->>
      this._containerId = _containerId;
      this._scene = new THREE.Scene();
      this._canvas = document.createElement('canvas');
      this._clock = new THREE.Clock(false);
      this._initialViewingVector = new THREE.Vector3();
      this._isSceneReady = false;
      this._isRendering = false;
      this._isHelpersShown = false;
      this._isInit = false;
      this._isLoaderVisible = true;
      this._fps = 60;
      this._camera = new THREE.PerspectiveCamera(fov, ar, near, far);
      this._sceneEntities = [];
      this._preInitHook = function () {};
      this._postInitHook = function () {};
      this._destroyHook = function () {};
      this.updateCamera = function () {};
      this.registerSceneEntities = function (sceneEntities) {
        sceneEntities.forEach(function (el) {
          return _this._sceneEntities.push(el);
        });
      };
      /**
       * This method lets you show/hide the objects within in your scene
       * designated as 'helpers'. It relies on the practice of setting the property `userData.isHelper = true`
       * on any object you want to be classified as a helper
       */
      this.setHelpersVisibility = function (isHelpersShown) {
        _this._isHelpersShown = !!isHelpersShown;
        _this._scene.traverse(function (child) {
          return child.userData.isHelper && (child.visible = _this._isHelpersShown);
        });
      };
      this.toggleHelpersVisibility = function () {
        _this._isHelpersShown = !_this._isHelpersShown;
        _this.setHelpersVisibility(_this._isHelpersShown);
      };
      this._updateCameraAspect = function () {
        // Not sure where/how, but canvas' style width/height
        // gets altered and needs to be reset to 100%
        _this._canvas.style.width = '100%';
        _this._canvas.style.height = '100%';
        var width = _this._canvas.offsetWidth || 1;
        var height = _this._canvas.offsetHeight || 1;
        _this._camera.aspect = width / height;
        _this._camera.updateProjectionMatrix();
        _this._renderer.setSize(width, height);
      };
      this.destroy = function () {
        window.removeEventListener('resize', _this._updateCameraAspect);
        _this._stopRendering();
        _this._destroyHook();
      };
      this._render = function () {
        if (!_this._isRendering) return;
        setTimeout(function () {
          _this._requestAnimationFrameId = requestAnimationFrame(_this._render);
          _this._update();
        }, 1000 / _this._fps);
      };
      this._startRendering = function () {
        myprint('Starting animation...');
        _this._isRendering = true;
        _this._clock.start();
        _this._render();
      };
      this._stopRendering = function () {
        myprint('Stopping animation...');
        _this._isRendering = false;
        _this._clock.stop();
      };
      // Get container and add fitting canvas to it
      this._container = document.getElementById(this._containerId);
      if (!this._container) {
        throw new Error('No container found with id: ' + this._containerId);
      }
      this._canvas.style.width = '100%';
      this._canvas.style.height = '100%';
      this._container.append(this._canvas);
      this._container.style.setProperty('position', 'relative');
      this._container.style.setProperty('font-family', '"Odibee Sans", cursive');
      this._container.style.setProperty('background-color', 'black');
      addLoaderDiv(this._container);
    }
    var _proto = AbstractSceneManager.prototype;
    _proto.init = /*#__PURE__*/function () {
      var _init = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2() {
        var _this2 = this;
        var DPR, initiatedSceneEntityGroups;
        return _regeneratorRuntime().wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              if (!this._isInit) {
                _context2.next = 2;
                break;
              }
              return _context2.abrupt("return");
            case 2:
              this._isInit = true;
              // Time initialization
              setInitDate(new Date());
              // Enable superclass constructor to adjust settings prior to initialization sequence
              this._preInitHook();
              // React to resize events on window
              window.addEventListener('resize', this._updateCameraAspect);
              // Build Renderer
              DPR = window.devicePixelRatio ? window.devicePixelRatio : 1;
              this._renderer = new THREE.WebGLRenderer({
                canvas: this._canvas,
                antialias: true,
                alpha: true
              });
              this._renderer.setPixelRatio(DPR);
              this._renderer.sortObjects = false; // This prevents pesky rendering-disruption effect
              this._renderer.shadowMap.enabled = true;
              this._renderer.shadowMap.type = THREE.PCFSoftShadowMap;
              this._renderer.outputEncoding = THREE.GammaEncoding;
              // Init camera position and orientation
              this._camera.position.copy(this._initialViewingVector);
              this._camera.up = new THREE.Vector3(0, 0, 1); // Vector defining up direction of camera
              this._camera.lookAt(0, 0, 0);
              // Configure orbitControls
              // ! Don't move this code to earlier position or controls will be screwy
              // ! Note sure why; treat as brute fact supervening on inscrutable metaphysical states of affair
              this._controls = new OrbitControls(this._camera, this._renderer.domElement);
              this._controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
              this._controls.dampingFactor = 0.25;
              this._controls.target = new THREE.Vector3();
              // Initiate Scene Entities
              if (this._sceneEntities.length) {
                _context2.next = 22;
                break;
              }
              throw new Error(asciiError('You have no scene entities!'));
            case 22:
              _context2.next = 24;
              return Promise.all(this._sceneEntities.map( /*#__PURE__*/function () {
                var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(sceneEntity) {
                  var initiatedSceneEntityGroup;
                  return _regeneratorRuntime().wrap(function _callee$(_context) {
                    while (1) switch (_context.prev = _context.next) {
                      case 0:
                        _context.next = 2;
                        return sceneEntity.init();
                      case 2:
                        initiatedSceneEntityGroup = _context.sent;
                        if (!(!initiatedSceneEntityGroup || !initiatedSceneEntityGroup.children.length)) {
                          _context.next = 5;
                          break;
                        }
                        throw new Error(asciiError("\n            -----------------------------------------------------------------------------\n            The scene entity \"" + sceneEntity.constructor.name + "\" has empty sceneEntityGroup\n            after initialization!!!\n            -----------------------------------------------------------------------------\n            "));
                      case 5:
                        return _context.abrupt("return", initiatedSceneEntityGroup);
                      case 6:
                      case "end":
                        return _context.stop();
                    }
                  }, _callee);
                }));
                return function (_x) {
                  return _ref.apply(this, arguments);
                };
              }())).then(function (_) {
                return new Promise(function (resolve) {
                  return setTimeout(function () {
                    return resolve(_);
                  }, 100);
                });
              }).then(function (_) {
                return _;
              });
            case 24:
              initiatedSceneEntityGroups = _context2.sent;
              initiatedSceneEntityGroups.forEach(function (group) {
                return _this2._scene.add(group);
              });
              // Run updater methods
              this.setHelpersVisibility(false);
              this._updateCameraAspect();
              // Begin Animation
              this._startRendering();
              // Enable superclass constructor to adjust settings after to initialization sequence
              this._postInitHook();
              // Remove loader div
              this.setIsLoaderDivVisible(false);
              //
              // Finish
              myprint('Finished initiating scene.');
            case 32:
            case "end":
              return _context2.stop();
          }
        }, _callee2, this);
      }));
      function init() {
        return _init.apply(this, arguments);
      }
      return init;
    }();
    _proto.setIsLoaderDivVisible = function setIsLoaderDivVisible(val, fadeInOutTimeMs) {
      if (fadeInOutTimeMs === void 0) {
        fadeInOutTimeMs = 3000;
      }
      this._isLoaderVisible = val;
      setLoaderDivVisibility(this._isLoaderVisible, fadeInOutTimeMs);
    };
    _proto.setFramesPerSecond = function setFramesPerSecond(newFps) {
      if (newFps <= 0 || newFps > 100) return;
      this._fps = newFps;
    };
    _proto._update = function _update() {
      var _this3 = this;
      // Loop through scene entities and trigger their update methods
      // If they need 'universal' time, they can access this._clock, etc.
      this._sceneEntities.forEach(function (el) {
        return el.update(_this3._camera, _this3._clock.elapsedTime);
      });
      // Update camera
      this.updateCamera();
      // Finish loop
      if (!this._camera || !this._renderer) throw new Error('Poor Logic');
      if (!!this._requestAnimationFrameId) {
        this._renderer.render(this._scene, this._camera);
      }
    };
    return AbstractSceneManager;
  }();

  // Artificial delay to simulate poor networks, etc.
  // Can also be used to buffer planet load
  var delayMs = 5;
  var getTextureFromImageUrl = function getTextureFromImageUrl(url, name) {
    return new Promise(function (resolve, reject) {
      new THREE.TextureLoader().load(url, function (texture) {
        texture.encoding = THREE.GammaEncoding;
        setTimeout(function () {
          return resolve(texture);
        }, delayMs);
      }, function (xhr) {
        return console.log(name + " " + xhr.loaded / xhr.total * 100 + "%");
      }, function () {
        console.log('Failed to load: ', url);
        reject(new Error('Failed to load: ' + url));
      });
    });
  };

  var solarSystemData = {
    SUN: {
      radiusMeters: 696342000,
      periodDays: undefined
    },
    MERCURY: {
      radiusMeters: 2439700,
      periodDays: 87.9691
    },
    VENUS: {
      radiusMeters: 6051800,
      periodDays: 224.701
    },
    EARTH: {
      radiusMeters: 6378000,
      periodDays: 365.256
    },
    MARS: {
      radiusMeters: 3389500,
      periodDays: 686.971
    },
    CERES: {
      radiusMeters: 470000,
      periodDays: 1683.14570801
    },
    JUPITER: {
      radiusMeters: 71492000,
      periodDays: 4332.59
    },
    SATURN: {
      radiusMeters: 60268000,
      periodDays: 10759.22
    },
    URANUS: {
      radiusMeters: 25362000,
      periodDays: 30688.5
    },
    NEPTUNE: {
      radiusMeters: 24764000,
      periodDays: 60182
    },
    PLUTO: {
      radiusMeters: 1188300,
      periodDays: 90560
    },
    HAUMEA: {
      radiusMeters: 620000,
      periodDays: 103410
    },
    MAKEMAKE: {
      radiusMeters: 720000,
      periodDays: 111845
    },
    ERIS: {
      radiusMeters: 1163000,
      periodDays: 204199
    },
    // Moons
    MOON: {
      radiusMeters: 350000,
      periodDays: 29.5
    }
  };

  /**
   * This module is the SSOT for global "static" settings for the app
   * that get set before the threejs scene begins. These govern e.g.
   * the default values of the "dynamic" settings that the user can set
   * and that will then persist within localStorage
   */
  var defaultOptions = {
    __sbnViewer__isPlanetsLoadedBeforeAnimationBegins: true,
    __sbnViewer__isBeltLoadedBeforeAnimationBegins: true,
    __sbnViewer__isBeltAbundanceToyModel: true,
    // Only apply if __sbnViewer__isBeltAbundanceToyModel === false
    __sbnViewer__beltAbundanceMaxObjects: 100,
    __sbnViewer__beltAbundanceHThreshold: -10
  };

  /**
   * Remove any keys that are not members of optionKeys
   * If a value does not exist for any member of optionKeys
   * then set that value to the default
   *
   */
  var cleanLocalStorage = function cleanLocalStorage() {
    // --->>
    var optionKeys = Object.keys(defaultOptions);
    // Remove key-value pairs where the key is not in optionKeys
    var items = _extends({}, localStorage);
    Object.keys(items).forEach(function (key) {
      if (!optionKeys.includes(key)) localStorage.removeItem(key);
    });
    // Make sure every key has at least a default value
    optionKeys.forEach(function (key) {
      var val = localStorage.getItem(key);
      if (!val) {
        localStorage.setItem(key, JSON.stringify(defaultOptions[key]));
      } else {
        try {
          var parsedVal = JSON.parse(val);
          if (typeof parsedVal !== typeof defaultOptions[key]) {
            localStorage.setItem(key, JSON.stringify(defaultOptions[key]));
          }
        } catch (err) {
          console.log('Local-storage mishap');
          return;
        }
      }
    });
  };

  // Make sure local-storage has no extraneous values
  cleanLocalStorage();
  /**
   * Get all options from local storage; if a value from optionKeys is not
   * represented then return the default value
   */
  var getAllOptions = function getAllOptions() {
    // --->>
    // Build up options from local storage
    var optionsFromLocalStorage = {};
    Object.keys(defaultOptions).forEach(function (key) {
      var val = localStorage.getItem(key);
      if (!val) return;
      try {
        var parsedVal = JSON.parse(val);
        optionsFromLocalStorage[key] = parsedVal;
      } catch (err) {
        return;
      }
    });
    return _extends({}, defaultOptions, optionsFromLocalStorage);
  };
  /**
   * Wrapper that just returns the booleans from stored options
   */
  var getAllOptionsBooleans = function getAllOptionsBooleans() {
    var _getAllOptions = getAllOptions(),
      __sbnViewer__isBeltAbundanceToyModel = _getAllOptions.__sbnViewer__isBeltAbundanceToyModel,
      __sbnViewer__isBeltLoadedBeforeAnimationBegins = _getAllOptions.__sbnViewer__isBeltLoadedBeforeAnimationBegins,
      __sbnViewer__isPlanetsLoadedBeforeAnimationBegins = _getAllOptions.__sbnViewer__isPlanetsLoadedBeforeAnimationBegins;
    return {
      __sbnViewer__isBeltAbundanceToyModel: __sbnViewer__isBeltAbundanceToyModel,
      __sbnViewer__isBeltLoadedBeforeAnimationBegins: __sbnViewer__isBeltLoadedBeforeAnimationBegins,
      __sbnViewer__isPlanetsLoadedBeforeAnimationBegins: __sbnViewer__isPlanetsLoadedBeforeAnimationBegins
    };
  };
  /**
   * Wrapper that just returns the booleans from stored options
   */
  var getAllOptionsNumbers = function getAllOptionsNumbers() {
    var _getAllOptions2 = getAllOptions(),
      __sbnViewer__beltAbundanceHThreshold = _getAllOptions2.__sbnViewer__beltAbundanceHThreshold,
      __sbnViewer__beltAbundanceMaxObjects = _getAllOptions2.__sbnViewer__beltAbundanceMaxObjects;
    return {
      __sbnViewer__beltAbundanceHThreshold: __sbnViewer__beltAbundanceHThreshold,
      __sbnViewer__beltAbundanceMaxObjects: __sbnViewer__beltAbundanceMaxObjects
    };
  };

  /**
   * Base class that any entity must extend in order that its threeJs group
   * might get added to the threeJs scene owned by the manager
   */
  var AbstractSceneEntity = function AbstractSceneEntity() {
    var _this = this;
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~>>>
    this._isAsyncLoad = function () {
      return AbstractSceneEntity._isAsyncLoad;
    };
    this._sceneEntityGroup = new THREE.Group();
    this.getSceneEntityGroup = function () {
      return _this._sceneEntityGroup;
    };
  };
  AbstractSceneEntity._isAsyncLoad = /*#__PURE__*/getAllOptions().__sbnViewer__isPlanetsLoadedBeforeAnimationBegins;

  /**
   * Time to finish switch from log to normal scales
   */
  var timeToCompleteTransition = 2;
  /**
   * Base class for space object that can be toggled between
   * 'real' and 'toy' scales
   */
  var AbstractToyModel = /*#__PURE__*/function (_AbstractSceneEntity) {
    _inheritsLoose(AbstractToyModel, _AbstractSceneEntity);
    function AbstractToyModel(_toyScale) {
      var _this;
      _this = _AbstractSceneEntity.call(this) || this;
      _this._toyScale = _toyScale;
      // ~~~>>>
      // Setup
      _this._toyGroup = [];
      _this._realScale = 1;
      _this._isZoomToToyScale = false;
      _this.isLogScale = false;
      _this.logTransitionClock = new THREE.Clock();
      return _this;
    }
    var _proto = AbstractToyModel.prototype;
    _proto.setIsZoomToToyScale = function setIsZoomToToyScale(value) {
      this._isZoomToToyScale = value;
    };
    _proto.setToyScale = function setToyScale(val) {
      // this._toyScale = val;
    };
    _proto.getScale = function getScale() {
      return this._isZoomToToyScale ? this._toyScale : this._realScale;
    };
    _proto._setToToyScale = function _setToToyScale() {
      var _this2 = this;
      this._isZoomToToyScale = true;
      this._toyGroup.forEach(function (child) {
        var t = _this2._toyScale; // 't' for 'target'
        child.scale.set(t, t, t);
      });
    };
    _proto.setIsLogScale = function setIsLogScale(val) {
      // Update flag
      this.isLogScale = val;
      // Restart clock
      this.logTransitionClock = new THREE.Clock(true);
      this.logTransitionClock.start();
      // Update toyScale for log
      // const nonLogToyScale = getPlanetToyScale(this.NAME);
      var logToyScale = 1000;
      this.setToyScale(this.isLogScale ? logToyScale : 3000);
    };
    _proto.toggleIsLogScale = function toggleIsLogScale() {
      this.setIsLogScale(!this.isLogScale);
    };
    _proto.getLogInterpolationParam = function getLogInterpolationParam() {
      var t = this.logTransitionClock.getElapsedTime() / timeToCompleteTransition;
      var v = t < 1 ? t : 1;
      return this.isLogScale ? v : 1 - v;
    };
    _proto._updateModelScale = function _updateModelScale() {
      var _this3 = this;
      this._toyGroup.forEach(function (child) {
        // Test if planet is already at target scale; 't' for target
        var t = _this3._isZoomToToyScale ? _this3._toyScale : _this3._realScale;
        var _child$scale = child.scale,
          sx = _child$scale.x,
          sy = _child$scale.y,
          sz = _child$scale.z;
        if (sx === t) return;
        // Update-mesh-scale logic
        var ds = _this3._toyScale / 20;
        if (sx < t) {
          // Increase deficient scale
          child.scale.set(sx + ds, sy + ds, sz + ds);
        }
        if (sx > t) {
          // Decrease excessive scale
          child.scale.set(sx - ds, sy - ds, sz - ds);
        }
        if (Math.abs(sx - t) < ds) {
          // Snap scale to target
          child.scale.set(t, t, t);
        }
      });
    };
    return AbstractToyModel;
  }(AbstractSceneEntity);

  /**
   * Constants for widget
   */
  /**
   * Properties common to all html buttons
   */
  var buttonBackgroundColor = 'rgba(255,255,255,0.2)';
  var buttonClickedBackgroundColor = 'rgba(255,255,255,0.4)';
  var buttonTextColor = 'rgba(255,255,255,0.8)';
  var buttonCursorType = 'pointer';
  var buttonFadeInSpecs = '1s ease-in-out';
  // These two properties must be coordinated together using e.g. google.fonts
  var buttonFontFamily = "'Odibee Sans', cursive";
  // export const buttonCssUrl =
  // 'https://fonts.googleapis.com/css2?family=Odibee+Sans';
  /**
   * Root url of file server with copy of /images
   */
  var assetsBaseUrl = /*#__PURE__*/getAssetsBaseUrl();
  function getAssetsBaseUrl() {
    return "https://sbn-solar-system-viewer.s3.amazonaws.com";
  }
  /**
   * Often handy to use this as a scale
   */
  var au = /*#__PURE__*/auToMeters(1);

  /**
   * When a sprite is loaded it is given a size of '1'
   * So it needs to be scaled, in this case, to the size of the Sun
   * Further, the Sun only takes up a fraction of this image, so we need this factor
   * to scale the image further
   */
  var realToToyRatio = 30;
  var imageToSunRatio = 20;
  var Sun = /*#__PURE__*/function (_AbstractToyModel) {
    _inheritsLoose(Sun, _AbstractToyModel);
    function Sun() {
      var _this;
      _this = _AbstractToyModel.call(this, realToToyRatio) || this;
      // ~~~>>>
      _this.NAME = 'SUN';
      _this.position = new THREE.Vector3(0, 0, 0);
      _this.sunRadiusMeters = solarSystemData.SUN.radiusMeters;
      _this.model = new THREE.Group();
      _this.sprite = new THREE.Sprite(new THREE.SpriteMaterial({
        blending: THREE.AdditiveBlending,
        transparent: true,
        visible: false
      }));
      _this.getRadius = function () {
        return _this.sunRadiusMeters;
      };
      _this.getPosition = function () {
        return _this.position;
      };
      // Set up sun sprite size
      _this.sprite.scale.multiplyScalar(_this.sunRadiusMeters * imageToSunRatio);
      _this.model.add(_this.sprite);
      // Set up helper
      _this.helper = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.SphereGeometry(_this.sunRadiusMeters, 32)), new THREE.LineBasicMaterial({
        color: new THREE.Color('cyan')
      }));
      _this.helper.userData.isHelper = true;
      _this.helper.rotateX(Math.PI / 2);
      _this.model.add(_this.helper);
      return _this;
    }
    var _proto = Sun.prototype;
    _proto.init = /*#__PURE__*/function () {
      var _init = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2() {
        var _this2 = this;
        return _regeneratorRuntime().wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              return _context2.abrupt("return", new Promise( /*#__PURE__*/function () {
                var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(resolve) {
                  var spriteUrl, onTextureLoad;
                  return _regeneratorRuntime().wrap(function _callee$(_context) {
                    while (1) switch (_context.prev = _context.next) {
                      case 0:
                        // --->>>
                        spriteUrl = assetsBaseUrl + "/stars/sun3-sprite-512.png";
                        onTextureLoad = function onTextureLoad(texture) {
                          _this2.sprite.material.map = texture;
                          _this2.sprite.material.needsUpdate = true;
                          _this2.sprite.material.visible = true;
                        };
                        if (!_this2._isAsyncLoad()) {
                          _context.next = 6;
                          break;
                        }
                        getTextureFromImageUrl(spriteUrl, 'SUN SPRITE IMAGE').then(onTextureLoad)["catch"](function (_) {
                          return null;
                        });
                        _context.next = 11;
                        break;
                      case 6:
                        _context.t0 = onTextureLoad;
                        _context.next = 9;
                        return getTextureFromImageUrl(spriteUrl)["catch"](function (_) {
                          return null;
                        });
                      case 9:
                        _context.t1 = _context.sent;
                        (0, _context.t0)(_context.t1);
                      case 11:
                        _this2._toyGroup.push(_this2.model);
                        _this2._sceneEntityGroup.name = _this2.NAME;
                        _this2._sceneEntityGroup.add(_this2.model);
                        myprint('RESOLVED SUN');
                        resolve(_this2._sceneEntityGroup);
                      case 16:
                      case "end":
                        return _context.stop();
                    }
                  }, _callee);
                }));
                return function (_x) {
                  return _ref.apply(this, arguments);
                };
              }()));
            case 1:
            case "end":
              return _context2.stop();
          }
        }, _callee2);
      }));
      function init() {
        return _init.apply(this, arguments);
      }
      return init;
    }();
    _proto.update = function update() {
      this._updateModelScale();
    };
    return Sun;
  }(AbstractToyModel);

  /**
   * This function is adapted from `https://github.com/jeromeetienne/threex.planets/blob/master/threex.planets.js`, based on instructions from `http://learningthreejs.com/blog/2013/09/16/how-to-make-the-earth-in-webgl/`
   * Jpegs don't have an alpha channel, so the idea is to load cloud image from jpg and remove pixels manually to create an alpha-channel effect
   */
  function createEarthCloudMesh() {
    // --->>>
    return new Promise(function (resolve, reject) {
      // --->>>
      // create destination canvas
      var canvasResult = document.createElement('canvas');
      canvasResult.width = 1024;
      canvasResult.height = 512;
      var contextResult = canvasResult.getContext('2d');
      // load earthcloudmap
      var imageMap = new Image();
      imageMap.crossOrigin = 'Anonymous';
      // const material = new THREE.MeshPhongMaterial({
      //   map: new THREE.Texture(canvasResult),
      //   side: THREE.DoubleSide,
      //   transparent: true,
      //   opacity: 0.6,
      // });
      // const mesh = new THREE.Mesh<THREE.SphereGeometry>(geometry, material);
      imageMap.onerror = function (error) {
        console.log('Error: ', error);
        reject();
      };
      imageMap.onload = function () {
        // --->>>
        // create dataMap ImageData for earthcloudmap
        var canvasMap = document.createElement('canvas');
        canvasMap.width = imageMap.width;
        canvasMap.height = imageMap.height;
        var contextMap = canvasMap.getContext('2d');
        contextMap.drawImage(imageMap, 0, 0);
        var dataMap = contextMap.getImageData(0, 0, canvasMap.width, canvasMap.height);
        // load earthcloudmaptrans
        var imageTrans = new Image();
        imageTrans.crossOrigin = 'Anonymous';
        imageTrans.addEventListener('load', function () {
          // --->>>
          // create dataTrans ImageData for earthcloudmaptrans
          var canvasTrans = document.createElement('canvas');
          canvasTrans.width = imageTrans.width;
          canvasTrans.height = imageTrans.height;
          var contextTrans = canvasTrans.getContext('2d');
          contextTrans.drawImage(imageTrans, 0, 0);
          try {
            var dataTrans = contextTrans.getImageData(0, 0, canvasTrans.width, canvasTrans.height);
            // merge dataMap + dataTrans into dataResult
            var dataResult = contextMap.createImageData(canvasMap.width, canvasMap.height);
            for (var y = 0, offset = 0; y < imageMap.height; y++) {
              for (var x = 0; x < imageMap.width; x++, offset += 4) {
                dataResult.data[offset + 0] = dataMap.data[offset + 0];
                dataResult.data[offset + 1] = dataMap.data[offset + 1];
                dataResult.data[offset + 2] = dataMap.data[offset + 2];
                dataResult.data[offset + 3] = 255 - dataTrans.data[offset + 0];
              }
            }
            // update texture with result
            contextResult.putImageData(dataResult, 0, 0);
            // if (!!material && !!material.map) material.map.needsUpdate = true;
          } catch (error) {
            console.log('Error: ', error);
            reject();
          }
          resolve(new THREE.CanvasTexture(canvasResult));
        });
        imageTrans.src = assetsBaseUrl + "/planets/earth/earth-clouds-trans-1024.png";
      };
      imageMap.src = assetsBaseUrl + "/planets/earth/earth-clouds-color-1024.png";
    });
  }

  function getPlanetRadiusMeters(name) {
    // --->>>
    return solarSystemData[name].radiusMeters;
  }

  var EOrbitalType;
  (function (EOrbitalType) {
    EOrbitalType["PLANET"] = "PLANET";
    EOrbitalType["DWARF_PLANET"] = "DWARF_PLANET";
    EOrbitalType["SUN"] = "SUN";
    EOrbitalType["ASTEROID"] = "ASTEROID";
  })(EOrbitalType || (EOrbitalType = {}));

  class GLTFLoader extends THREE.Loader {

  	constructor( manager ) {

  		super( manager );

  		this.dracoLoader = null;
  		this.ktx2Loader = null;
  		this.meshoptDecoder = null;

  		this.pluginCallbacks = [];

  		this.register( function ( parser ) {

  			return new GLTFMaterialsClearcoatExtension( parser );

  		} );

  		this.register( function ( parser ) {

  			return new GLTFTextureBasisUExtension( parser );

  		} );

  		this.register( function ( parser ) {

  			return new GLTFTextureWebPExtension( parser );

  		} );

  		this.register( function ( parser ) {

  			return new GLTFMaterialsTransmissionExtension( parser );

  		} );

  		this.register( function ( parser ) {

  			return new GLTFLightsExtension( parser );

  		} );

  		this.register( function ( parser ) {

  			return new GLTFMeshoptCompression( parser );

  		} );

  	}

  	load( url, onLoad, onProgress, onError ) {

  		const scope = this;

  		let resourcePath;

  		if ( this.resourcePath !== '' ) {

  			resourcePath = this.resourcePath;

  		} else if ( this.path !== '' ) {

  			resourcePath = this.path;

  		} else {

  			resourcePath = THREE.LoaderUtils.extractUrlBase( url );

  		}

  		// Tells the LoadingManager to track an extra item, which resolves after
  		// the model is fully loaded. This means the count of items loaded will
  		// be incorrect, but ensures manager.onLoad() does not fire early.
  		this.manager.itemStart( url );

  		const _onError = function ( e ) {

  			if ( onError ) {

  				onError( e );

  			} else {

  				console.error( e );

  			}

  			scope.manager.itemError( url );
  			scope.manager.itemEnd( url );

  		};

  		const loader = new THREE.FileLoader( this.manager );

  		loader.setPath( this.path );
  		loader.setResponseType( 'arraybuffer' );
  		loader.setRequestHeader( this.requestHeader );
  		loader.setWithCredentials( this.withCredentials );

  		loader.load( url, function ( data ) {

  			try {

  				scope.parse( data, resourcePath, function ( gltf ) {

  					onLoad( gltf );

  					scope.manager.itemEnd( url );

  				}, _onError );

  			} catch ( e ) {

  				_onError( e );

  			}

  		}, onProgress, _onError );

  	}

  	setDRACOLoader( dracoLoader ) {

  		this.dracoLoader = dracoLoader;
  		return this;

  	}

  	setDDSLoader() {

  		throw new Error(

  			'THREE.GLTFLoader: "MSFT_texture_dds" no longer supported. Please update to "KHR_texture_basisu".'

  		);

  	}

  	setKTX2Loader( ktx2Loader ) {

  		this.ktx2Loader = ktx2Loader;
  		return this;

  	}

  	setMeshoptDecoder( meshoptDecoder ) {

  		this.meshoptDecoder = meshoptDecoder;
  		return this;

  	}

  	register( callback ) {

  		if ( this.pluginCallbacks.indexOf( callback ) === - 1 ) {

  			this.pluginCallbacks.push( callback );

  		}

  		return this;

  	}

  	unregister( callback ) {

  		if ( this.pluginCallbacks.indexOf( callback ) !== - 1 ) {

  			this.pluginCallbacks.splice( this.pluginCallbacks.indexOf( callback ), 1 );

  		}

  		return this;

  	}

  	parse( data, path, onLoad, onError ) {

  		let content;
  		const extensions = {};
  		const plugins = {};

  		if ( typeof data === 'string' ) {

  			content = data;

  		} else {

  			const magic = THREE.LoaderUtils.decodeText( new Uint8Array( data, 0, 4 ) );

  			if ( magic === BINARY_EXTENSION_HEADER_MAGIC ) {

  				try {

  					extensions[ EXTENSIONS.KHR_BINARY_GLTF ] = new GLTFBinaryExtension( data );

  				} catch ( error ) {

  					if ( onError ) onError( error );
  					return;

  				}

  				content = extensions[ EXTENSIONS.KHR_BINARY_GLTF ].content;

  			} else {

  				content = THREE.LoaderUtils.decodeText( new Uint8Array( data ) );

  			}

  		}

  		const json = JSON.parse( content );

  		if ( json.asset === undefined || json.asset.version[ 0 ] < 2 ) {

  			if ( onError ) onError( new Error( 'THREE.GLTFLoader: Unsupported asset. glTF versions >=2.0 are supported.' ) );
  			return;

  		}

  		const parser = new GLTFParser( json, {

  			path: path || this.resourcePath || '',
  			crossOrigin: this.crossOrigin,
  			requestHeader: this.requestHeader,
  			manager: this.manager,
  			ktx2Loader: this.ktx2Loader,
  			meshoptDecoder: this.meshoptDecoder

  		} );

  		parser.fileLoader.setRequestHeader( this.requestHeader );

  		for ( let i = 0; i < this.pluginCallbacks.length; i ++ ) {

  			const plugin = this.pluginCallbacks[ i ]( parser );
  			plugins[ plugin.name ] = plugin;

  			// Workaround to avoid determining as unknown extension
  			// in addUnknownExtensionsToUserData().
  			// Remove this workaround if we move all the existing
  			// extension handlers to plugin system
  			extensions[ plugin.name ] = true;

  		}

  		if ( json.extensionsUsed ) {

  			for ( let i = 0; i < json.extensionsUsed.length; ++ i ) {

  				const extensionName = json.extensionsUsed[ i ];
  				const extensionsRequired = json.extensionsRequired || [];

  				switch ( extensionName ) {

  					case EXTENSIONS.KHR_MATERIALS_UNLIT:
  						extensions[ extensionName ] = new GLTFMaterialsUnlitExtension();
  						break;

  					case EXTENSIONS.KHR_MATERIALS_PBR_SPECULAR_GLOSSINESS:
  						extensions[ extensionName ] = new GLTFMaterialsPbrSpecularGlossinessExtension();
  						break;

  					case EXTENSIONS.KHR_DRACO_MESH_COMPRESSION:
  						extensions[ extensionName ] = new GLTFDracoMeshCompressionExtension( json, this.dracoLoader );
  						break;

  					case EXTENSIONS.KHR_TEXTURE_TRANSFORM:
  						extensions[ extensionName ] = new GLTFTextureTransformExtension();
  						break;

  					case EXTENSIONS.KHR_MESH_QUANTIZATION:
  						extensions[ extensionName ] = new GLTFMeshQuantizationExtension();
  						break;

  					default:

  						if ( extensionsRequired.indexOf( extensionName ) >= 0 && plugins[ extensionName ] === undefined ) {

  							console.warn( 'THREE.GLTFLoader: Unknown extension "' + extensionName + '".' );

  						}

  				}

  			}

  		}

  		parser.setExtensions( extensions );
  		parser.setPlugins( plugins );
  		parser.parse( onLoad, onError );

  	}

  }

  /* GLTFREGISTRY */

  function GLTFRegistry() {

  	let objects = {};

  	return	{

  		get: function ( key ) {

  			return objects[ key ];

  		},

  		add: function ( key, object ) {

  			objects[ key ] = object;

  		},

  		remove: function ( key ) {

  			delete objects[ key ];

  		},

  		removeAll: function () {

  			objects = {};

  		}

  	};

  }

  /*********************************/
  /********** EXTENSIONS ***********/
  /*********************************/

  const EXTENSIONS = {
  	KHR_BINARY_GLTF: 'KHR_binary_glTF',
  	KHR_DRACO_MESH_COMPRESSION: 'KHR_draco_mesh_compression',
  	KHR_LIGHTS_PUNCTUAL: 'KHR_lights_punctual',
  	KHR_MATERIALS_CLEARCOAT: 'KHR_materials_clearcoat',
  	KHR_MATERIALS_PBR_SPECULAR_GLOSSINESS: 'KHR_materials_pbrSpecularGlossiness',
  	KHR_MATERIALS_TRANSMISSION: 'KHR_materials_transmission',
  	KHR_MATERIALS_UNLIT: 'KHR_materials_unlit',
  	KHR_TEXTURE_BASISU: 'KHR_texture_basisu',
  	KHR_TEXTURE_TRANSFORM: 'KHR_texture_transform',
  	KHR_MESH_QUANTIZATION: 'KHR_mesh_quantization',
  	EXT_TEXTURE_WEBP: 'EXT_texture_webp',
  	EXT_MESHOPT_COMPRESSION: 'EXT_meshopt_compression'
  };

  /**
  	 * Punctual Lights Extension
  	 *
  	 * Specification: https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Khronos/KHR_lights_punctual
  	 */
  class GLTFLightsExtension {

  	constructor( parser ) {

  		this.parser = parser;
  		this.name = EXTENSIONS.KHR_LIGHTS_PUNCTUAL;

  		// Object3D instance caches
  		this.cache = { refs: {}, uses: {} };

  	}

  	_markDefs() {

  		const parser = this.parser;
  		const nodeDefs = this.parser.json.nodes || [];

  		for ( let nodeIndex = 0, nodeLength = nodeDefs.length; nodeIndex < nodeLength; nodeIndex ++ ) {

  			const nodeDef = nodeDefs[ nodeIndex ];

  			if ( nodeDef.extensions
  					&& nodeDef.extensions[ this.name ]
  					&& nodeDef.extensions[ this.name ].light !== undefined ) {

  				parser._addNodeRef( this.cache, nodeDef.extensions[ this.name ].light );

  			}

  		}

  	}

  	_loadLight( lightIndex ) {

  		const parser = this.parser;
  		const cacheKey = 'light:' + lightIndex;
  		let dependency = parser.cache.get( cacheKey );

  		if ( dependency ) return dependency;

  		const json = parser.json;
  		const extensions = ( json.extensions && json.extensions[ this.name ] ) || {};
  		const lightDefs = extensions.lights || [];
  		const lightDef = lightDefs[ lightIndex ];
  		let lightNode;

  		const color = new THREE.Color( 0xffffff );

  		if ( lightDef.color !== undefined ) color.fromArray( lightDef.color );

  		const range = lightDef.range !== undefined ? lightDef.range : 0;

  		switch ( lightDef.type ) {

  			case 'directional':
  				lightNode = new THREE.DirectionalLight( color );
  				lightNode.target.position.set( 0, 0, - 1 );
  				lightNode.add( lightNode.target );
  				break;

  			case 'point':
  				lightNode = new THREE.PointLight( color );
  				lightNode.distance = range;
  				break;

  			case 'spot':
  				lightNode = new THREE.SpotLight( color );
  				lightNode.distance = range;
  				// Handle spotlight properties.
  				lightDef.spot = lightDef.spot || {};
  				lightDef.spot.innerConeAngle = lightDef.spot.innerConeAngle !== undefined ? lightDef.spot.innerConeAngle : 0;
  				lightDef.spot.outerConeAngle = lightDef.spot.outerConeAngle !== undefined ? lightDef.spot.outerConeAngle : Math.PI / 4.0;
  				lightNode.angle = lightDef.spot.outerConeAngle;
  				lightNode.penumbra = 1.0 - lightDef.spot.innerConeAngle / lightDef.spot.outerConeAngle;
  				lightNode.target.position.set( 0, 0, - 1 );
  				lightNode.add( lightNode.target );
  				break;

  			default:
  				throw new Error( 'THREE.GLTFLoader: Unexpected light type: ' + lightDef.type );

  		}

  		// Some lights (e.g. spot) default to a position other than the origin. Reset the position
  		// here, because node-level parsing will only override position if explicitly specified.
  		lightNode.position.set( 0, 0, 0 );

  		lightNode.decay = 2;

  		if ( lightDef.intensity !== undefined ) lightNode.intensity = lightDef.intensity;

  		lightNode.name = parser.createUniqueName( lightDef.name || ( 'light_' + lightIndex ) );

  		dependency = Promise.resolve( lightNode );

  		parser.cache.add( cacheKey, dependency );

  		return dependency;

  	}

  	createNodeAttachment( nodeIndex ) {

  		const self = this;
  		const parser = this.parser;
  		const json = parser.json;
  		const nodeDef = json.nodes[ nodeIndex ];
  		const lightDef = ( nodeDef.extensions && nodeDef.extensions[ this.name ] ) || {};
  		const lightIndex = lightDef.light;

  		if ( lightIndex === undefined ) return null;

  		return this._loadLight( lightIndex ).then( function ( light ) {

  			return parser._getNodeRef( self.cache, lightIndex, light );

  		} );

  	}

  }

  /**
  	 * Unlit Materials Extension
  	 *
  	 * Specification: https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Khronos/KHR_materials_unlit
  	 */
  class GLTFMaterialsUnlitExtension {

  	constructor() {

  		this.name = EXTENSIONS.KHR_MATERIALS_UNLIT;

  	}

  	getMaterialType() {

  		return THREE.MeshBasicMaterial;

  	}

  	extendParams( materialParams, materialDef, parser ) {

  		const pending = [];

  		materialParams.color = new THREE.Color( 1.0, 1.0, 1.0 );
  		materialParams.opacity = 1.0;

  		const metallicRoughness = materialDef.pbrMetallicRoughness;

  		if ( metallicRoughness ) {

  			if ( Array.isArray( metallicRoughness.baseColorFactor ) ) {

  				const array = metallicRoughness.baseColorFactor;

  				materialParams.color.fromArray( array );
  				materialParams.opacity = array[ 3 ];

  			}

  			if ( metallicRoughness.baseColorTexture !== undefined ) {

  				pending.push( parser.assignTexture( materialParams, 'map', metallicRoughness.baseColorTexture ) );

  			}

  		}

  		return Promise.all( pending );

  	}

  }

  /**
  	 * Clearcoat Materials Extension
  	 *
  	 * Specification: https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Khronos/KHR_materials_clearcoat
  	 */
  class GLTFMaterialsClearcoatExtension {

  	constructor( parser ) {

  		this.parser = parser;
  		this.name = EXTENSIONS.KHR_MATERIALS_CLEARCOAT;

  	}

  	getMaterialType( materialIndex ) {

  		const parser = this.parser;
  		const materialDef = parser.json.materials[ materialIndex ];

  		if ( ! materialDef.extensions || ! materialDef.extensions[ this.name ] ) return null;

  		return THREE.MeshPhysicalMaterial;

  	}

  	extendMaterialParams( materialIndex, materialParams ) {

  		const parser = this.parser;
  		const materialDef = parser.json.materials[ materialIndex ];

  		if ( ! materialDef.extensions || ! materialDef.extensions[ this.name ] ) {

  			return Promise.resolve();

  		}

  		const pending = [];

  		const extension = materialDef.extensions[ this.name ];

  		if ( extension.clearcoatFactor !== undefined ) {

  			materialParams.clearcoat = extension.clearcoatFactor;

  		}

  		if ( extension.clearcoatTexture !== undefined ) {

  			pending.push( parser.assignTexture( materialParams, 'clearcoatMap', extension.clearcoatTexture ) );

  		}

  		if ( extension.clearcoatRoughnessFactor !== undefined ) {

  			materialParams.clearcoatRoughness = extension.clearcoatRoughnessFactor;

  		}

  		if ( extension.clearcoatRoughnessTexture !== undefined ) {

  			pending.push( parser.assignTexture( materialParams, 'clearcoatRoughnessMap', extension.clearcoatRoughnessTexture ) );

  		}

  		if ( extension.clearcoatNormalTexture !== undefined ) {

  			pending.push( parser.assignTexture( materialParams, 'clearcoatNormalMap', extension.clearcoatNormalTexture ) );

  			if ( extension.clearcoatNormalTexture.scale !== undefined ) {

  				const scale = extension.clearcoatNormalTexture.scale;

  				// https://github.com/mrdoob/three.js/issues/11438#issuecomment-507003995
  				materialParams.clearcoatNormalScale = new THREE.Vector2( scale, - scale );

  			}

  		}

  		return Promise.all( pending );

  	}

  }

  /**
  	 * Transmission Materials Extension
  	 *
  	 * Specification: https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Khronos/KHR_materials_transmission
  	 * Draft: https://github.com/KhronosGroup/glTF/pull/1698
  	 */
  class GLTFMaterialsTransmissionExtension {

  	constructor( parser ) {

  		this.parser = parser;
  		this.name = EXTENSIONS.KHR_MATERIALS_TRANSMISSION;

  	}

  	getMaterialType( materialIndex ) {

  		const parser = this.parser;
  		const materialDef = parser.json.materials[ materialIndex ];

  		if ( ! materialDef.extensions || ! materialDef.extensions[ this.name ] ) return null;

  		return THREE.MeshPhysicalMaterial;

  	}

  	extendMaterialParams( materialIndex, materialParams ) {

  		const parser = this.parser;
  		const materialDef = parser.json.materials[ materialIndex ];

  		if ( ! materialDef.extensions || ! materialDef.extensions[ this.name ] ) {

  			return Promise.resolve();

  		}

  		const pending = [];

  		const extension = materialDef.extensions[ this.name ];

  		if ( extension.transmissionFactor !== undefined ) {

  			materialParams.transmission = extension.transmissionFactor;

  		}

  		if ( extension.transmissionTexture !== undefined ) {

  			pending.push( parser.assignTexture( materialParams, 'transmissionMap', extension.transmissionTexture ) );

  		}

  		return Promise.all( pending );

  	}

  }

  /**
  	 * BasisU Texture Extension
  	 *
  	 * Specification: https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Khronos/KHR_texture_basisu
  	 */
  class GLTFTextureBasisUExtension {

  	constructor( parser ) {

  		this.parser = parser;
  		this.name = EXTENSIONS.KHR_TEXTURE_BASISU;

  	}

  	loadTexture( textureIndex ) {

  		const parser = this.parser;
  		const json = parser.json;

  		const textureDef = json.textures[ textureIndex ];

  		if ( ! textureDef.extensions || ! textureDef.extensions[ this.name ] ) {

  			return null;

  		}

  		const extension = textureDef.extensions[ this.name ];
  		const source = json.images[ extension.source ];
  		const loader = parser.options.ktx2Loader;

  		if ( ! loader ) {

  			if ( json.extensionsRequired && json.extensionsRequired.indexOf( this.name ) >= 0 ) {

  				throw new Error( 'THREE.GLTFLoader: setKTX2Loader must be called before loading KTX2 textures' );

  			} else {

  				// Assumes that the extension is optional and that a fallback texture is present
  				return null;

  			}

  		}

  		return parser.loadTextureImage( textureIndex, source, loader );

  	}

  }

  /**
  	 * WebP Texture Extension
  	 *
  	 * Specification: https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Vendor/EXT_texture_webp
  	 */
  class GLTFTextureWebPExtension {

  	constructor( parser ) {

  		this.parser = parser;
  		this.name = EXTENSIONS.EXT_TEXTURE_WEBP;
  		this.isSupported = null;

  	}

  	loadTexture( textureIndex ) {

  		const name = this.name;
  		const parser = this.parser;
  		const json = parser.json;

  		const textureDef = json.textures[ textureIndex ];

  		if ( ! textureDef.extensions || ! textureDef.extensions[ name ] ) {

  			return null;

  		}

  		const extension = textureDef.extensions[ name ];
  		const source = json.images[ extension.source ];

  		let loader = parser.textureLoader;
  		if ( source.uri ) {

  			const handler = parser.options.manager.getHandler( source.uri );
  			if ( handler !== null ) loader = handler;

  		}

  		return this.detectSupport().then( function ( isSupported ) {

  			if ( isSupported ) return parser.loadTextureImage( textureIndex, source, loader );

  			if ( json.extensionsRequired && json.extensionsRequired.indexOf( name ) >= 0 ) {

  				throw new Error( 'THREE.GLTFLoader: WebP required by asset but unsupported.' );

  			}

  			// Fall back to PNG or JPEG.
  			return parser.loadTexture( textureIndex );

  		} );

  	}

  	detectSupport() {

  		if ( ! this.isSupported ) {

  			this.isSupported = new Promise( function ( resolve ) {

  				const image = new Image();

  				// Lossy test image. Support for lossy images doesn't guarantee support for all
  				// WebP images, unfortunately.
  				image.src = 'data:image/webp;base64,UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA';

  				image.onload = image.onerror = function () {

  					resolve( image.height === 1 );

  				};

  			} );

  		}

  		return this.isSupported;

  	}

  }

  /**
  	* meshopt BufferView Compression Extension
  	*
  	* Specification: https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Vendor/EXT_meshopt_compression
  	*/
  class GLTFMeshoptCompression {

  	constructor( parser ) {

  		this.name = EXTENSIONS.EXT_MESHOPT_COMPRESSION;
  		this.parser = parser;

  	}

  	loadBufferView( index ) {

  		const json = this.parser.json;
  		const bufferView = json.bufferViews[ index ];

  		if ( bufferView.extensions && bufferView.extensions[ this.name ] ) {

  			const extensionDef = bufferView.extensions[ this.name ];

  			const buffer = this.parser.getDependency( 'buffer', extensionDef.buffer );
  			const decoder = this.parser.options.meshoptDecoder;

  			if ( ! decoder || ! decoder.supported ) {

  				if ( json.extensionsRequired && json.extensionsRequired.indexOf( this.name ) >= 0 ) {

  					throw new Error( 'THREE.GLTFLoader: setMeshoptDecoder must be called before loading compressed files' );

  				} else {

  					// Assumes that the extension is optional and that fallback buffer data is present
  					return null;

  				}

  			}

  			return Promise.all( [ buffer, decoder.ready ] ).then( function ( res ) {

  				const byteOffset = extensionDef.byteOffset || 0;
  				const byteLength = extensionDef.byteLength || 0;

  				const count = extensionDef.count;
  				const stride = extensionDef.byteStride;

  				const result = new ArrayBuffer( count * stride );
  				const source = new Uint8Array( res[ 0 ], byteOffset, byteLength );

  				decoder.decodeGltfBuffer( new Uint8Array( result ), count, stride, source, extensionDef.mode, extensionDef.filter );
  				return result;

  			} );

  		} else {

  			return null;

  		}

  	}

  }

  /* BINARY EXTENSION */
  const BINARY_EXTENSION_HEADER_MAGIC = 'glTF';
  const BINARY_EXTENSION_HEADER_LENGTH = 12;
  const BINARY_EXTENSION_CHUNK_TYPES = { JSON: 0x4E4F534A, BIN: 0x004E4942 };

  class GLTFBinaryExtension {

  	constructor( data ) {

  		this.name = EXTENSIONS.KHR_BINARY_GLTF;
  		this.content = null;
  		this.body = null;

  		const headerView = new DataView( data, 0, BINARY_EXTENSION_HEADER_LENGTH );

  		this.header = {
  			magic: THREE.LoaderUtils.decodeText( new Uint8Array( data.slice( 0, 4 ) ) ),
  			version: headerView.getUint32( 4, true ),
  			length: headerView.getUint32( 8, true )
  		};

  		if ( this.header.magic !== BINARY_EXTENSION_HEADER_MAGIC ) {

  			throw new Error( 'THREE.GLTFLoader: Unsupported glTF-Binary header.' );

  		} else if ( this.header.version < 2.0 ) {

  			throw new Error( 'THREE.GLTFLoader: Legacy binary file detected.' );

  		}

  		const chunkContentsLength = this.header.length - BINARY_EXTENSION_HEADER_LENGTH;
  		const chunkView = new DataView( data, BINARY_EXTENSION_HEADER_LENGTH );
  		let chunkIndex = 0;

  		while ( chunkIndex < chunkContentsLength ) {

  			const chunkLength = chunkView.getUint32( chunkIndex, true );
  			chunkIndex += 4;

  			const chunkType = chunkView.getUint32( chunkIndex, true );
  			chunkIndex += 4;

  			if ( chunkType === BINARY_EXTENSION_CHUNK_TYPES.JSON ) {

  				const contentArray = new Uint8Array( data, BINARY_EXTENSION_HEADER_LENGTH + chunkIndex, chunkLength );
  				this.content = THREE.LoaderUtils.decodeText( contentArray );

  			} else if ( chunkType === BINARY_EXTENSION_CHUNK_TYPES.BIN ) {

  				const byteOffset = BINARY_EXTENSION_HEADER_LENGTH + chunkIndex;
  				this.body = data.slice( byteOffset, byteOffset + chunkLength );

  			}

  			// Clients must ignore chunks with unknown types.

  			chunkIndex += chunkLength;

  		}

  		if ( this.content === null ) {

  			throw new Error( 'THREE.GLTFLoader: JSON content not found.' );

  		}

  	}

  }

  /**
  	 * DRACO Mesh Compression Extension
  	 *
  	 * Specification: https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Khronos/KHR_draco_mesh_compression
  	 */
  class GLTFDracoMeshCompressionExtension {

  	constructor( json, dracoLoader ) {

  		if ( ! dracoLoader ) {

  			throw new Error( 'THREE.GLTFLoader: No DRACOLoader instance provided.' );

  		}

  		this.name = EXTENSIONS.KHR_DRACO_MESH_COMPRESSION;
  		this.json = json;
  		this.dracoLoader = dracoLoader;
  		this.dracoLoader.preload();

  	}

  	decodePrimitive( primitive, parser ) {

  		const json = this.json;
  		const dracoLoader = this.dracoLoader;
  		const bufferViewIndex = primitive.extensions[ this.name ].bufferView;
  		const gltfAttributeMap = primitive.extensions[ this.name ].attributes;
  		const threeAttributeMap = {};
  		const attributeNormalizedMap = {};
  		const attributeTypeMap = {};

  		for ( const attributeName in gltfAttributeMap ) {

  			const threeAttributeName = ATTRIBUTES[ attributeName ] || attributeName.toLowerCase();

  			threeAttributeMap[ threeAttributeName ] = gltfAttributeMap[ attributeName ];

  		}

  		for ( const attributeName in primitive.attributes ) {

  			const threeAttributeName = ATTRIBUTES[ attributeName ] || attributeName.toLowerCase();

  			if ( gltfAttributeMap[ attributeName ] !== undefined ) {

  				const accessorDef = json.accessors[ primitive.attributes[ attributeName ] ];
  				const componentType = WEBGL_COMPONENT_TYPES[ accessorDef.componentType ];

  				attributeTypeMap[ threeAttributeName ] = componentType;
  				attributeNormalizedMap[ threeAttributeName ] = accessorDef.normalized === true;

  			}

  		}

  		return parser.getDependency( 'bufferView', bufferViewIndex ).then( function ( bufferView ) {

  			return new Promise( function ( resolve ) {

  				dracoLoader.decodeDracoFile( bufferView, function ( geometry ) {

  					for ( const attributeName in geometry.attributes ) {

  						const attribute = geometry.attributes[ attributeName ];
  						const normalized = attributeNormalizedMap[ attributeName ];

  						if ( normalized !== undefined ) attribute.normalized = normalized;

  					}

  					resolve( geometry );

  				}, threeAttributeMap, attributeTypeMap );

  			} );

  		} );

  	}

  }

  /**
  	 * Texture Transform Extension
  	 *
  	 * Specification: https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Khronos/KHR_texture_transform
  	 */
  class GLTFTextureTransformExtension {

  	constructor() {

  		this.name = EXTENSIONS.KHR_TEXTURE_TRANSFORM;

  	}

  	extendTexture( texture, transform ) {

  		texture = texture.clone();

  		if ( transform.offset !== undefined ) {

  			texture.offset.fromArray( transform.offset );

  		}

  		if ( transform.rotation !== undefined ) {

  			texture.rotation = transform.rotation;

  		}

  		if ( transform.scale !== undefined ) {

  			texture.repeat.fromArray( transform.scale );

  		}

  		if ( transform.texCoord !== undefined ) {

  			console.warn( 'THREE.GLTFLoader: Custom UV sets in "' + this.name + '" extension not yet supported.' );

  		}

  		texture.needsUpdate = true;

  		return texture;

  	}

  }

  /**
  	 * Specular-Glossiness Extension
  	 *
  	 * Specification: https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Khronos/KHR_materials_pbrSpecularGlossiness
  	 */

  /**
  	 * A sub class of StandardMaterial with some of the functionality
  	 * changed via the `onBeforeCompile` callback
  	 * @pailhead
  	 */

  class GLTFMeshStandardSGMaterial extends THREE.MeshStandardMaterial {

  	constructor( params ) {

  		super();

  		this.isGLTFSpecularGlossinessMaterial = true;

  		//various chunks that need replacing
  		const specularMapParsFragmentChunk = [
  			'#ifdef USE_SPECULARMAP',
  			'	uniform sampler2D specularMap;',
  			'#endif'
  		].join( '\n' );

  		const glossinessMapParsFragmentChunk = [
  			'#ifdef USE_GLOSSINESSMAP',
  			'	uniform sampler2D glossinessMap;',
  			'#endif'
  		].join( '\n' );

  		const specularMapFragmentChunk = [
  			'vec3 specularFactor = specular;',
  			'#ifdef USE_SPECULARMAP',
  			'	vec4 texelSpecular = texture2D( specularMap, vUv );',
  			'	texelSpecular = sRGBToLinear( texelSpecular );',
  			'	// reads channel RGB, compatible with a glTF Specular-Glossiness (RGBA) texture',
  			'	specularFactor *= texelSpecular.rgb;',
  			'#endif'
  		].join( '\n' );

  		const glossinessMapFragmentChunk = [
  			'float glossinessFactor = glossiness;',
  			'#ifdef USE_GLOSSINESSMAP',
  			'	vec4 texelGlossiness = texture2D( glossinessMap, vUv );',
  			'	// reads channel A, compatible with a glTF Specular-Glossiness (RGBA) texture',
  			'	glossinessFactor *= texelGlossiness.a;',
  			'#endif'
  		].join( '\n' );

  		const lightPhysicalFragmentChunk = [
  			'PhysicalMaterial material;',
  			'material.diffuseColor = diffuseColor.rgb * ( 1. - max( specularFactor.r, max( specularFactor.g, specularFactor.b ) ) );',
  			'vec3 dxy = max( abs( dFdx( geometryNormal ) ), abs( dFdy( geometryNormal ) ) );',
  			'float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );',
  			'material.specularRoughness = max( 1.0 - glossinessFactor, 0.0525 ); // 0.0525 corresponds to the base mip of a 256 cubemap.',
  			'material.specularRoughness += geometryRoughness;',
  			'material.specularRoughness = min( material.specularRoughness, 1.0 );',
  			'material.specularColor = specularFactor;',
  		].join( '\n' );

  		const uniforms = {
  			specular: { value: new THREE.Color().setHex( 0xffffff ) },
  			glossiness: { value: 1 },
  			specularMap: { value: null },
  			glossinessMap: { value: null }
  		};

  		this._extraUniforms = uniforms;

  		this.onBeforeCompile = function ( shader ) {

  			for ( const uniformName in uniforms ) {

  				shader.uniforms[ uniformName ] = uniforms[ uniformName ];

  			}

  			shader.fragmentShader = shader.fragmentShader
  				.replace( 'uniform float roughness;', 'uniform vec3 specular;' )
  				.replace( 'uniform float metalness;', 'uniform float glossiness;' )
  				.replace( '#include <roughnessmap_pars_fragment>', specularMapParsFragmentChunk )
  				.replace( '#include <metalnessmap_pars_fragment>', glossinessMapParsFragmentChunk )
  				.replace( '#include <roughnessmap_fragment>', specularMapFragmentChunk )
  				.replace( '#include <metalnessmap_fragment>', glossinessMapFragmentChunk )
  				.replace( '#include <lights_physical_fragment>', lightPhysicalFragmentChunk );

  		};

  		Object.defineProperties( this, {

  			specular: {
  				get: function () {

  					return uniforms.specular.value;

  				},
  				set: function ( v ) {

  					uniforms.specular.value = v;

  				}
  			},

  			specularMap: {
  				get: function () {

  					return uniforms.specularMap.value;

  				},
  				set: function ( v ) {

  					uniforms.specularMap.value = v;

  					if ( v ) {

  						this.defines.USE_SPECULARMAP = ''; // USE_UV is set by the renderer for specular maps

  					} else {

  						delete this.defines.USE_SPECULARMAP;

  					}

  				}
  			},

  			glossiness: {
  				get: function () {

  					return uniforms.glossiness.value;

  				},
  				set: function ( v ) {

  					uniforms.glossiness.value = v;

  				}
  			},

  			glossinessMap: {
  				get: function () {

  					return uniforms.glossinessMap.value;

  				},
  				set: function ( v ) {

  					uniforms.glossinessMap.value = v;

  					if ( v ) {

  						this.defines.USE_GLOSSINESSMAP = '';
  						this.defines.USE_UV = '';

  					} else {

  						delete this.defines.USE_GLOSSINESSMAP;
  						delete this.defines.USE_UV;

  					}

  				}
  			}

  		} );

  		delete this.metalness;
  		delete this.roughness;
  		delete this.metalnessMap;
  		delete this.roughnessMap;

  		this.setValues( params );

  	}

  	copy( source ) {

  		super.copy( source );

  		this.specularMap = source.specularMap;
  		this.specular.copy( source.specular );
  		this.glossinessMap = source.glossinessMap;
  		this.glossiness = source.glossiness;
  		delete this.metalness;
  		delete this.roughness;
  		delete this.metalnessMap;
  		delete this.roughnessMap;
  		return this;

  	}

  }


  class GLTFMaterialsPbrSpecularGlossinessExtension {

  	constructor() {

  		this.name = EXTENSIONS.KHR_MATERIALS_PBR_SPECULAR_GLOSSINESS;

  		this.specularGlossinessParams = [
  			'color',
  			'map',
  			'lightMap',
  			'lightMapIntensity',
  			'aoMap',
  			'aoMapIntensity',
  			'emissive',
  			'emissiveIntensity',
  			'emissiveMap',
  			'bumpMap',
  			'bumpScale',
  			'normalMap',
  			'normalMapType',
  			'displacementMap',
  			'displacementScale',
  			'displacementBias',
  			'specularMap',
  			'specular',
  			'glossinessMap',
  			'glossiness',
  			'alphaMap',
  			'envMap',
  			'envMapIntensity',
  			'refractionRatio',
  		];

  	}

  	getMaterialType() {

  		return GLTFMeshStandardSGMaterial;

  	}

  	extendParams( materialParams, materialDef, parser ) {

  		const pbrSpecularGlossiness = materialDef.extensions[ this.name ];

  		materialParams.color = new THREE.Color( 1.0, 1.0, 1.0 );
  		materialParams.opacity = 1.0;

  		const pending = [];

  		if ( Array.isArray( pbrSpecularGlossiness.diffuseFactor ) ) {

  			const array = pbrSpecularGlossiness.diffuseFactor;

  			materialParams.color.fromArray( array );
  			materialParams.opacity = array[ 3 ];

  		}

  		if ( pbrSpecularGlossiness.diffuseTexture !== undefined ) {

  			pending.push( parser.assignTexture( materialParams, 'map', pbrSpecularGlossiness.diffuseTexture ) );

  		}

  		materialParams.emissive = new THREE.Color( 0.0, 0.0, 0.0 );
  		materialParams.glossiness = pbrSpecularGlossiness.glossinessFactor !== undefined ? pbrSpecularGlossiness.glossinessFactor : 1.0;
  		materialParams.specular = new THREE.Color( 1.0, 1.0, 1.0 );

  		if ( Array.isArray( pbrSpecularGlossiness.specularFactor ) ) {

  			materialParams.specular.fromArray( pbrSpecularGlossiness.specularFactor );

  		}

  		if ( pbrSpecularGlossiness.specularGlossinessTexture !== undefined ) {

  			const specGlossMapDef = pbrSpecularGlossiness.specularGlossinessTexture;
  			pending.push( parser.assignTexture( materialParams, 'glossinessMap', specGlossMapDef ) );
  			pending.push( parser.assignTexture( materialParams, 'specularMap', specGlossMapDef ) );

  		}

  		return Promise.all( pending );

  	}

  	createMaterial( materialParams ) {

  		const material = new GLTFMeshStandardSGMaterial( materialParams );
  		material.fog = true;

  		material.color = materialParams.color;

  		material.map = materialParams.map === undefined ? null : materialParams.map;

  		material.lightMap = null;
  		material.lightMapIntensity = 1.0;

  		material.aoMap = materialParams.aoMap === undefined ? null : materialParams.aoMap;
  		material.aoMapIntensity = 1.0;

  		material.emissive = materialParams.emissive;
  		material.emissiveIntensity = 1.0;
  		material.emissiveMap = materialParams.emissiveMap === undefined ? null : materialParams.emissiveMap;

  		material.bumpMap = materialParams.bumpMap === undefined ? null : materialParams.bumpMap;
  		material.bumpScale = 1;

  		material.normalMap = materialParams.normalMap === undefined ? null : materialParams.normalMap;
  		material.normalMapType = THREE.TangentSpaceNormalMap;

  		if ( materialParams.normalScale ) material.normalScale = materialParams.normalScale;

  		material.displacementMap = null;
  		material.displacementScale = 1;
  		material.displacementBias = 0;

  		material.specularMap = materialParams.specularMap === undefined ? null : materialParams.specularMap;
  		material.specular = materialParams.specular;

  		material.glossinessMap = materialParams.glossinessMap === undefined ? null : materialParams.glossinessMap;
  		material.glossiness = materialParams.glossiness;

  		material.alphaMap = null;

  		material.envMap = materialParams.envMap === undefined ? null : materialParams.envMap;
  		material.envMapIntensity = 1.0;

  		material.refractionRatio = 0.98;

  		return material;

  	}

  }

  /**
  	 * Mesh Quantization Extension
  	 *
  	 * Specification: https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Khronos/KHR_mesh_quantization
  	 */
  class GLTFMeshQuantizationExtension {

  	constructor() {

  		this.name = EXTENSIONS.KHR_MESH_QUANTIZATION;

  	}

  }

  /*********************************/
  /********** INTERPOLATION ********/
  /*********************************/

  // Spline Interpolation
  // Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#appendix-c-spline-interpolation
  class GLTFCubicSplineInterpolant extends THREE.Interpolant {

  	constructor( parameterPositions, sampleValues, sampleSize, resultBuffer ) {

  		super( parameterPositions, sampleValues, sampleSize, resultBuffer );

  	}

  	copySampleValue_( index ) {

  		// Copies a sample value to the result buffer. See description of glTF
  		// CUBICSPLINE values layout in interpolate_() function below.

  		const result = this.resultBuffer,
  			values = this.sampleValues,
  			valueSize = this.valueSize,
  			offset = index * valueSize * 3 + valueSize;

  		for ( let i = 0; i !== valueSize; i ++ ) {

  			result[ i ] = values[ offset + i ];

  		}

  		return result;

  	}

  }

  GLTFCubicSplineInterpolant.prototype.beforeStart_ = GLTFCubicSplineInterpolant.prototype.copySampleValue_;

  GLTFCubicSplineInterpolant.prototype.afterEnd_ = GLTFCubicSplineInterpolant.prototype.copySampleValue_;

  GLTFCubicSplineInterpolant.prototype.interpolate_ = function ( i1, t0, t, t1 ) {

  	const result = this.resultBuffer;
  	const values = this.sampleValues;
  	const stride = this.valueSize;

  	const stride2 = stride * 2;
  	const stride3 = stride * 3;

  	const td = t1 - t0;

  	const p = ( t - t0 ) / td;
  	const pp = p * p;
  	const ppp = pp * p;

  	const offset1 = i1 * stride3;
  	const offset0 = offset1 - stride3;

  	const s2 = - 2 * ppp + 3 * pp;
  	const s3 = ppp - pp;
  	const s0 = 1 - s2;
  	const s1 = s3 - pp + p;

  	// Layout of keyframe output values for CUBICSPLINE animations:
  	//   [ inTangent_1, splineVertex_1, outTangent_1, inTangent_2, splineVertex_2, ... ]
  	for ( let i = 0; i !== stride; i ++ ) {

  		const p0 = values[ offset0 + i + stride ]; // splineVertex_k
  		const m0 = values[ offset0 + i + stride2 ] * td; // outTangent_k * (t_k+1 - t_k)
  		const p1 = values[ offset1 + i + stride ]; // splineVertex_k+1
  		const m1 = values[ offset1 + i ] * td; // inTangent_k+1 * (t_k+1 - t_k)

  		result[ i ] = s0 * p0 + s1 * m0 + s2 * p1 + s3 * m1;

  	}

  	return result;

  };

  /*********************************/
  /********** INTERNALS ************/
  /*********************************/

  /* CONSTANTS */

  const WEBGL_CONSTANTS = {
  	FLOAT: 5126,
  	//FLOAT_MAT2: 35674,
  	FLOAT_MAT3: 35675,
  	FLOAT_MAT4: 35676,
  	FLOAT_VEC2: 35664,
  	FLOAT_VEC3: 35665,
  	FLOAT_VEC4: 35666,
  	LINEAR: 9729,
  	REPEAT: 10497,
  	SAMPLER_2D: 35678,
  	POINTS: 0,
  	LINES: 1,
  	LINE_LOOP: 2,
  	LINE_STRIP: 3,
  	TRIANGLES: 4,
  	TRIANGLE_STRIP: 5,
  	TRIANGLE_FAN: 6,
  	UNSIGNED_BYTE: 5121,
  	UNSIGNED_SHORT: 5123
  };

  const WEBGL_COMPONENT_TYPES = {
  	5120: Int8Array,
  	5121: Uint8Array,
  	5122: Int16Array,
  	5123: Uint16Array,
  	5125: Uint32Array,
  	5126: Float32Array
  };

  const WEBGL_FILTERS = {
  	9728: THREE.NearestFilter,
  	9729: THREE.LinearFilter,
  	9984: THREE.NearestMipmapNearestFilter,
  	9985: THREE.LinearMipmapNearestFilter,
  	9986: THREE.NearestMipmapLinearFilter,
  	9987: THREE.LinearMipmapLinearFilter
  };

  const WEBGL_WRAPPINGS = {
  	33071: THREE.ClampToEdgeWrapping,
  	33648: THREE.MirroredRepeatWrapping,
  	10497: THREE.RepeatWrapping
  };

  const WEBGL_TYPE_SIZES = {
  	'SCALAR': 1,
  	'VEC2': 2,
  	'VEC3': 3,
  	'VEC4': 4,
  	'MAT2': 4,
  	'MAT3': 9,
  	'MAT4': 16
  };

  const ATTRIBUTES = {
  	POSITION: 'position',
  	NORMAL: 'normal',
  	TANGENT: 'tangent',
  	TEXCOORD_0: 'uv',
  	TEXCOORD_1: 'uv2',
  	COLOR_0: 'color',
  	WEIGHTS_0: 'skinWeight',
  	JOINTS_0: 'skinIndex',
  };

  const PATH_PROPERTIES = {
  	scale: 'scale',
  	translation: 'position',
  	rotation: 'quaternion',
  	weights: 'morphTargetInfluences'
  };

  const INTERPOLATION = {
  	CUBICSPLINE: undefined, // We use a custom interpolant (GLTFCubicSplineInterpolation) for CUBICSPLINE tracks. Each
  		                        // keyframe track will be initialized with a default interpolation type, then modified.
  	LINEAR: THREE.InterpolateLinear,
  	STEP: THREE.InterpolateDiscrete
  };

  const ALPHA_MODES = {
  	OPAQUE: 'OPAQUE',
  	MASK: 'MASK',
  	BLEND: 'BLEND'
  };

  /* UTILITY FUNCTIONS */

  function resolveURL( url, path ) {

  	// Invalid URL
  	if ( typeof url !== 'string' || url === '' ) return '';

  	// Host Relative URL
  	if ( /^https?:\/\//i.test( path ) && /^\//.test( url ) ) {

  		path = path.replace( /(^https?:\/\/[^\/]+).*/i, '$1' );

  	}

  	// Absolute URL http://,https://,//
  	if ( /^(https?:)?\/\//i.test( url ) ) return url;

  	// Data URI
  	if ( /^data:.*,.*$/i.test( url ) ) return url;

  	// Blob URL
  	if ( /^blob:.*$/i.test( url ) ) return url;

  	// Relative URL
  	return path + url;

  }

  /**
  	 * Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#default-material
  	 */
  function createDefaultMaterial( cache ) {

  	if ( cache[ 'DefaultMaterial' ] === undefined ) {

  		cache[ 'DefaultMaterial' ] = new THREE.MeshStandardMaterial( {
  			color: 0xFFFFFF,
  			emissive: 0x000000,
  			metalness: 1,
  			roughness: 1,
  			transparent: false,
  			depthTest: true,
  			side: THREE.FrontSide
  		} );

  	}

  	return cache[ 'DefaultMaterial' ];

  }

  function addUnknownExtensionsToUserData( knownExtensions, object, objectDef ) {

  	// Add unknown glTF extensions to an object's userData.

  	for ( const name in objectDef.extensions ) {

  		if ( knownExtensions[ name ] === undefined ) {

  			object.userData.gltfExtensions = object.userData.gltfExtensions || {};
  			object.userData.gltfExtensions[ name ] = objectDef.extensions[ name ];

  		}

  	}

  }

  /**
  	 * @param {Object3D|Material|BufferGeometry} object
  	 * @param {GLTF.definition} gltfDef
  	 */
  function assignExtrasToUserData( object, gltfDef ) {

  	if ( gltfDef.extras !== undefined ) {

  		if ( typeof gltfDef.extras === 'object' ) {

  			Object.assign( object.userData, gltfDef.extras );

  		} else {

  			console.warn( 'THREE.GLTFLoader: Ignoring primitive type .extras, ' + gltfDef.extras );

  		}

  	}

  }

  /**
  	 * Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#morph-targets
  	 *
  	 * @param {BufferGeometry} geometry
  	 * @param {Array<GLTF.Target>} targets
  	 * @param {GLTFParser} parser
  	 * @return {Promise<BufferGeometry>}
  	 */
  function addMorphTargets( geometry, targets, parser ) {

  	let hasMorphPosition = false;
  	let hasMorphNormal = false;

  	for ( let i = 0, il = targets.length; i < il; i ++ ) {

  		const target = targets[ i ];

  		if ( target.POSITION !== undefined ) hasMorphPosition = true;
  		if ( target.NORMAL !== undefined ) hasMorphNormal = true;

  		if ( hasMorphPosition && hasMorphNormal ) break;

  	}

  	if ( ! hasMorphPosition && ! hasMorphNormal ) return Promise.resolve( geometry );

  	const pendingPositionAccessors = [];
  	const pendingNormalAccessors = [];

  	for ( let i = 0, il = targets.length; i < il; i ++ ) {

  		const target = targets[ i ];

  		if ( hasMorphPosition ) {

  			const pendingAccessor = target.POSITION !== undefined
  				? parser.getDependency( 'accessor', target.POSITION )
  				: geometry.attributes.position;

  			pendingPositionAccessors.push( pendingAccessor );

  		}

  		if ( hasMorphNormal ) {

  			const pendingAccessor = target.NORMAL !== undefined
  				? parser.getDependency( 'accessor', target.NORMAL )
  				: geometry.attributes.normal;

  			pendingNormalAccessors.push( pendingAccessor );

  		}

  	}

  	return Promise.all( [
  		Promise.all( pendingPositionAccessors ),
  		Promise.all( pendingNormalAccessors )
  	] ).then( function ( accessors ) {

  		const morphPositions = accessors[ 0 ];
  		const morphNormals = accessors[ 1 ];

  		if ( hasMorphPosition ) geometry.morphAttributes.position = morphPositions;
  		if ( hasMorphNormal ) geometry.morphAttributes.normal = morphNormals;
  		geometry.morphTargetsRelative = true;

  		return geometry;

  	} );

  }

  /**
  	 * @param {Mesh} mesh
  	 * @param {GLTF.Mesh} meshDef
  	 */
  function updateMorphTargets( mesh, meshDef ) {

  	mesh.updateMorphTargets();

  	if ( meshDef.weights !== undefined ) {

  		for ( let i = 0, il = meshDef.weights.length; i < il; i ++ ) {

  			mesh.morphTargetInfluences[ i ] = meshDef.weights[ i ];

  		}

  	}

  	// .extras has user-defined data, so check that .extras.targetNames is an array.
  	if ( meshDef.extras && Array.isArray( meshDef.extras.targetNames ) ) {

  		const targetNames = meshDef.extras.targetNames;

  		if ( mesh.morphTargetInfluences.length === targetNames.length ) {

  			mesh.morphTargetDictionary = {};

  			for ( let i = 0, il = targetNames.length; i < il; i ++ ) {

  				mesh.morphTargetDictionary[ targetNames[ i ] ] = i;

  			}

  		} else {

  			console.warn( 'THREE.GLTFLoader: Invalid extras.targetNames length. Ignoring names.' );

  		}

  	}

  }

  function createPrimitiveKey( primitiveDef ) {

  	const dracoExtension = primitiveDef.extensions && primitiveDef.extensions[ EXTENSIONS.KHR_DRACO_MESH_COMPRESSION ];
  	let geometryKey;

  	if ( dracoExtension ) {

  		geometryKey = 'draco:' + dracoExtension.bufferView
  				+ ':' + dracoExtension.indices
  				+ ':' + createAttributesKey( dracoExtension.attributes );

  	} else {

  		geometryKey = primitiveDef.indices + ':' + createAttributesKey( primitiveDef.attributes ) + ':' + primitiveDef.mode;

  	}

  	return geometryKey;

  }

  function createAttributesKey( attributes ) {

  	let attributesKey = '';

  	const keys = Object.keys( attributes ).sort();

  	for ( let i = 0, il = keys.length; i < il; i ++ ) {

  		attributesKey += keys[ i ] + ':' + attributes[ keys[ i ] ] + ';';

  	}

  	return attributesKey;

  }

  function getNormalizedComponentScale( constructor ) {

  	// Reference:
  	// https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Khronos/KHR_mesh_quantization#encoding-quantized-data

  	switch ( constructor ) {

  		case Int8Array:
  			return 1 / 127;

  		case Uint8Array:
  			return 1 / 255;

  		case Int16Array:
  			return 1 / 32767;

  		case Uint16Array:
  			return 1 / 65535;

  		default:
  			throw new Error( 'THREE.GLTFLoader: Unsupported normalized accessor component type.' );

  	}

  }

  /* GLTF PARSER */

  class GLTFParser {

  	constructor( json = {}, options = {} ) {

  		this.json = json;
  		this.extensions = {};
  		this.plugins = {};
  		this.options = options;

  		// loader object cache
  		this.cache = new GLTFRegistry();

  		// associations between Three.js objects and glTF elements
  		this.associations = new Map();

  		// BufferGeometry caching
  		this.primitiveCache = {};

  		// Object3D instance caches
  		this.meshCache = { refs: {}, uses: {} };
  		this.cameraCache = { refs: {}, uses: {} };
  		this.lightCache = { refs: {}, uses: {} };

  		// Track node names, to ensure no duplicates
  		this.nodeNamesUsed = {};

  		// Use an ImageBitmapLoader if imageBitmaps are supported. Moves much of the
  		// expensive work of uploading a texture to the GPU off the main thread.
  		if ( typeof createImageBitmap !== 'undefined' && /Firefox/.test( navigator.userAgent ) === false ) {

  			this.textureLoader = new THREE.ImageBitmapLoader( this.options.manager );

  		} else {

  			this.textureLoader = new THREE.TextureLoader( this.options.manager );

  		}

  		this.textureLoader.setCrossOrigin( this.options.crossOrigin );
  		this.textureLoader.setRequestHeader( this.options.requestHeader );

  		this.fileLoader = new THREE.FileLoader( this.options.manager );
  		this.fileLoader.setResponseType( 'arraybuffer' );

  		if ( this.options.crossOrigin === 'use-credentials' ) {

  			this.fileLoader.setWithCredentials( true );

  		}

  	}

  	setExtensions( extensions ) {

  		this.extensions = extensions;

  	}

  	setPlugins( plugins ) {

  		this.plugins = plugins;

  	}

  	parse( onLoad, onError ) {

  		const parser = this;
  		const json = this.json;
  		const extensions = this.extensions;

  		// Clear the loader cache
  		this.cache.removeAll();

  		// Mark the special nodes/meshes in json for efficient parse
  		this._invokeAll( function ( ext ) {

  			return ext._markDefs && ext._markDefs();

  		} );

  		Promise.all( this._invokeAll( function ( ext ) {

  			return ext.beforeRoot && ext.beforeRoot();

  		} ) ).then( function () {

  			return Promise.all( [

  				parser.getDependencies( 'scene' ),
  				parser.getDependencies( 'animation' ),
  				parser.getDependencies( 'camera' ),

  			] );

  		} ).then( function ( dependencies ) {

  			const result = {
  				scene: dependencies[ 0 ][ json.scene || 0 ],
  				scenes: dependencies[ 0 ],
  				animations: dependencies[ 1 ],
  				cameras: dependencies[ 2 ],
  				asset: json.asset,
  				parser: parser,
  				userData: {}
  			};

  			addUnknownExtensionsToUserData( extensions, result, json );

  			assignExtrasToUserData( result, json );

  			Promise.all( parser._invokeAll( function ( ext ) {

  				return ext.afterRoot && ext.afterRoot( result );

  			} ) ).then( function () {

  				onLoad( result );

  			} );

  		} ).catch( onError );

  	}

  	/**
  	 * Marks the special nodes/meshes in json for efficient parse.
  	 */
  	_markDefs() {

  		const nodeDefs = this.json.nodes || [];
  		const skinDefs = this.json.skins || [];
  		const meshDefs = this.json.meshes || [];

  		// Nothing in the node definition indicates whether it is a Bone or an
  		// Object3D. Use the skins' joint references to mark bones.
  		for ( let skinIndex = 0, skinLength = skinDefs.length; skinIndex < skinLength; skinIndex ++ ) {

  			const joints = skinDefs[ skinIndex ].joints;

  			for ( let i = 0, il = joints.length; i < il; i ++ ) {

  				nodeDefs[ joints[ i ] ].isBone = true;

  			}

  		}

  		// Iterate over all nodes, marking references to shared resources,
  		// as well as skeleton joints.
  		for ( let nodeIndex = 0, nodeLength = nodeDefs.length; nodeIndex < nodeLength; nodeIndex ++ ) {

  			const nodeDef = nodeDefs[ nodeIndex ];

  			if ( nodeDef.mesh !== undefined ) {

  				this._addNodeRef( this.meshCache, nodeDef.mesh );

  				// Nothing in the mesh definition indicates whether it is
  				// a SkinnedMesh or Mesh. Use the node's mesh reference
  				// to mark SkinnedMesh if node has skin.
  				if ( nodeDef.skin !== undefined ) {

  					meshDefs[ nodeDef.mesh ].isSkinnedMesh = true;

  				}

  			}

  			if ( nodeDef.camera !== undefined ) {

  				this._addNodeRef( this.cameraCache, nodeDef.camera );

  			}

  		}

  	}

  	/**
  	 * Counts references to shared node / Object3D resources. These resources
  	 * can be reused, or "instantiated", at multiple nodes in the scene
  	 * hierarchy. Mesh, Camera, and Light instances are instantiated and must
  	 * be marked. Non-scenegraph resources (like Materials, Geometries, and
  	 * Textures) can be reused directly and are not marked here.
  	 *
  	 * Example: CesiumMilkTruck sample model reuses "Wheel" meshes.
  	 */
  	_addNodeRef( cache, index ) {

  		if ( index === undefined ) return;

  		if ( cache.refs[ index ] === undefined ) {

  			cache.refs[ index ] = cache.uses[ index ] = 0;

  		}

  		cache.refs[ index ] ++;

  	}

  	/** Returns a reference to a shared resource, cloning it if necessary. */
  	_getNodeRef( cache, index, object ) {

  		if ( cache.refs[ index ] <= 1 ) return object;

  		const ref = object.clone();

  		ref.name += '_instance_' + ( cache.uses[ index ] ++ );

  		return ref;

  	}

  	_invokeOne( func ) {

  		const extensions = Object.values( this.plugins );
  		extensions.push( this );

  		for ( let i = 0; i < extensions.length; i ++ ) {

  			const result = func( extensions[ i ] );

  			if ( result ) return result;

  		}

  		return null;

  	}

  	_invokeAll( func ) {

  		const extensions = Object.values( this.plugins );
  		extensions.unshift( this );

  		const pending = [];

  		for ( let i = 0; i < extensions.length; i ++ ) {

  			const result = func( extensions[ i ] );

  			if ( result ) pending.push( result );

  		}

  		return pending;

  	}

  	/**
  	 * Requests the specified dependency asynchronously, with caching.
  	 * @param {string} type
  	 * @param {number} index
  	 * @return {Promise<Object3D|Material|THREE.Texture|AnimationClip|ArrayBuffer|Object>}
  	 */
  	getDependency( type, index ) {

  		const cacheKey = type + ':' + index;
  		let dependency = this.cache.get( cacheKey );

  		if ( ! dependency ) {

  			switch ( type ) {

  				case 'scene':
  					dependency = this.loadScene( index );
  					break;

  				case 'node':
  					dependency = this.loadNode( index );
  					break;

  				case 'mesh':
  					dependency = this._invokeOne( function ( ext ) {

  						return ext.loadMesh && ext.loadMesh( index );

  					} );
  					break;

  				case 'accessor':
  					dependency = this.loadAccessor( index );
  					break;

  				case 'bufferView':
  					dependency = this._invokeOne( function ( ext ) {

  						return ext.loadBufferView && ext.loadBufferView( index );

  					} );
  					break;

  				case 'buffer':
  					dependency = this.loadBuffer( index );
  					break;

  				case 'material':
  					dependency = this._invokeOne( function ( ext ) {

  						return ext.loadMaterial && ext.loadMaterial( index );

  					} );
  					break;

  				case 'texture':
  					dependency = this._invokeOne( function ( ext ) {

  						return ext.loadTexture && ext.loadTexture( index );

  					} );
  					break;

  				case 'skin':
  					dependency = this.loadSkin( index );
  					break;

  				case 'animation':
  					dependency = this.loadAnimation( index );
  					break;

  				case 'camera':
  					dependency = this.loadCamera( index );
  					break;

  				default:
  					throw new Error( 'Unknown type: ' + type );

  			}

  			this.cache.add( cacheKey, dependency );

  		}

  		return dependency;

  	}

  	/**
  	 * Requests all dependencies of the specified type asynchronously, with caching.
  	 * @param {string} type
  	 * @return {Promise<Array<Object>>}
  	 */
  	getDependencies( type ) {

  		let dependencies = this.cache.get( type );

  		if ( ! dependencies ) {

  			const parser = this;
  			const defs = this.json[ type + ( type === 'mesh' ? 'es' : 's' ) ] || [];

  			dependencies = Promise.all( defs.map( function ( def, index ) {

  				return parser.getDependency( type, index );

  			} ) );

  			this.cache.add( type, dependencies );

  		}

  		return dependencies;

  	}

  	/**
  	 * Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#buffers-and-buffer-views
  	 * @param {number} bufferIndex
  	 * @return {Promise<ArrayBuffer>}
  	 */
  	loadBuffer( bufferIndex ) {

  		const bufferDef = this.json.buffers[ bufferIndex ];
  		const loader = this.fileLoader;

  		if ( bufferDef.type && bufferDef.type !== 'arraybuffer' ) {

  			throw new Error( 'THREE.GLTFLoader: ' + bufferDef.type + ' buffer type is not supported.' );

  		}

  		// If present, GLB container is required to be the first buffer.
  		if ( bufferDef.uri === undefined && bufferIndex === 0 ) {

  			return Promise.resolve( this.extensions[ EXTENSIONS.KHR_BINARY_GLTF ].body );

  		}

  		const options = this.options;

  		return new Promise( function ( resolve, reject ) {

  			loader.load( resolveURL( bufferDef.uri, options.path ), resolve, undefined, function () {

  				reject( new Error( 'THREE.GLTFLoader: Failed to load buffer "' + bufferDef.uri + '".' ) );

  			} );

  		} );

  	}

  	/**
  	 * Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#buffers-and-buffer-views
  	 * @param {number} bufferViewIndex
  	 * @return {Promise<ArrayBuffer>}
  	 */
  	loadBufferView( bufferViewIndex ) {

  		const bufferViewDef = this.json.bufferViews[ bufferViewIndex ];

  		return this.getDependency( 'buffer', bufferViewDef.buffer ).then( function ( buffer ) {

  			const byteLength = bufferViewDef.byteLength || 0;
  			const byteOffset = bufferViewDef.byteOffset || 0;
  			return buffer.slice( byteOffset, byteOffset + byteLength );

  		} );

  	}

  	/**
  	 * Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#accessors
  	 * @param {number} accessorIndex
  	 * @return {Promise<BufferAttribute|InterleavedBufferAttribute>}
  	 */
  	loadAccessor( accessorIndex ) {

  		const parser = this;
  		const json = this.json;

  		const accessorDef = this.json.accessors[ accessorIndex ];

  		if ( accessorDef.bufferView === undefined && accessorDef.sparse === undefined ) {

  			// Ignore empty accessors, which may be used to declare runtime
  			// information about attributes coming from another source (e.g. Draco
  			// compression extension).
  			return Promise.resolve( null );

  		}

  		const pendingBufferViews = [];

  		if ( accessorDef.bufferView !== undefined ) {

  			pendingBufferViews.push( this.getDependency( 'bufferView', accessorDef.bufferView ) );

  		} else {

  			pendingBufferViews.push( null );

  		}

  		if ( accessorDef.sparse !== undefined ) {

  			pendingBufferViews.push( this.getDependency( 'bufferView', accessorDef.sparse.indices.bufferView ) );
  			pendingBufferViews.push( this.getDependency( 'bufferView', accessorDef.sparse.values.bufferView ) );

  		}

  		return Promise.all( pendingBufferViews ).then( function ( bufferViews ) {

  			const bufferView = bufferViews[ 0 ];

  			const itemSize = WEBGL_TYPE_SIZES[ accessorDef.type ];
  			const TypedArray = WEBGL_COMPONENT_TYPES[ accessorDef.componentType ];

  			// For VEC3: itemSize is 3, elementBytes is 4, itemBytes is 12.
  			const elementBytes = TypedArray.BYTES_PER_ELEMENT;
  			const itemBytes = elementBytes * itemSize;
  			const byteOffset = accessorDef.byteOffset || 0;
  			const byteStride = accessorDef.bufferView !== undefined ? json.bufferViews[ accessorDef.bufferView ].byteStride : undefined;
  			const normalized = accessorDef.normalized === true;
  			let array, bufferAttribute;

  			// The buffer is not interleaved if the stride is the item size in bytes.
  			if ( byteStride && byteStride !== itemBytes ) {

  				// Each "slice" of the buffer, as defined by 'count' elements of 'byteStride' bytes, gets its own InterleavedBuffer
  				// This makes sure that IBA.count reflects accessor.count properly
  				const ibSlice = Math.floor( byteOffset / byteStride );
  				const ibCacheKey = 'InterleavedBuffer:' + accessorDef.bufferView + ':' + accessorDef.componentType + ':' + ibSlice + ':' + accessorDef.count;
  				let ib = parser.cache.get( ibCacheKey );

  				if ( ! ib ) {

  					array = new TypedArray( bufferView, ibSlice * byteStride, accessorDef.count * byteStride / elementBytes );

  					// Integer parameters to IB/IBA are in array elements, not bytes.
  					ib = new THREE.InterleavedBuffer( array, byteStride / elementBytes );

  					parser.cache.add( ibCacheKey, ib );

  				}

  				bufferAttribute = new THREE.InterleavedBufferAttribute( ib, itemSize, ( byteOffset % byteStride ) / elementBytes, normalized );

  			} else {

  				if ( bufferView === null ) {

  					array = new TypedArray( accessorDef.count * itemSize );

  				} else {

  					array = new TypedArray( bufferView, byteOffset, accessorDef.count * itemSize );

  				}

  				bufferAttribute = new THREE.BufferAttribute( array, itemSize, normalized );

  			}

  			// https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#sparse-accessors
  			if ( accessorDef.sparse !== undefined ) {

  				const itemSizeIndices = WEBGL_TYPE_SIZES.SCALAR;
  				const TypedArrayIndices = WEBGL_COMPONENT_TYPES[ accessorDef.sparse.indices.componentType ];

  				const byteOffsetIndices = accessorDef.sparse.indices.byteOffset || 0;
  				const byteOffsetValues = accessorDef.sparse.values.byteOffset || 0;

  				const sparseIndices = new TypedArrayIndices( bufferViews[ 1 ], byteOffsetIndices, accessorDef.sparse.count * itemSizeIndices );
  				const sparseValues = new TypedArray( bufferViews[ 2 ], byteOffsetValues, accessorDef.sparse.count * itemSize );

  				if ( bufferView !== null ) {

  					// Avoid modifying the original ArrayBuffer, if the bufferView wasn't initialized with zeroes.
  					bufferAttribute = new THREE.BufferAttribute( bufferAttribute.array.slice(), bufferAttribute.itemSize, bufferAttribute.normalized );

  				}

  				for ( let i = 0, il = sparseIndices.length; i < il; i ++ ) {

  					const index = sparseIndices[ i ];

  					bufferAttribute.setX( index, sparseValues[ i * itemSize ] );
  					if ( itemSize >= 2 ) bufferAttribute.setY( index, sparseValues[ i * itemSize + 1 ] );
  					if ( itemSize >= 3 ) bufferAttribute.setZ( index, sparseValues[ i * itemSize + 2 ] );
  					if ( itemSize >= 4 ) bufferAttribute.setW( index, sparseValues[ i * itemSize + 3 ] );
  					if ( itemSize >= 5 ) throw new Error( 'THREE.GLTFLoader: Unsupported itemSize in sparse BufferAttribute.' );

  				}

  			}

  			return bufferAttribute;

  		} );

  	}

  	/**
  	 * Specification: https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#textures
  	 * @param {number} textureIndex
  	 * @return {Promise<THREE.Texture>}
  	 */
  	loadTexture( textureIndex ) {

  		const json = this.json;
  		const options = this.options;
  		const textureDef = json.textures[ textureIndex ];
  		const source = json.images[ textureDef.source ];

  		let loader = this.textureLoader;

  		if ( source.uri ) {

  			const handler = options.manager.getHandler( source.uri );
  			if ( handler !== null ) loader = handler;

  		}

  		return this.loadTextureImage( textureIndex, source, loader );

  	}

  	loadTextureImage( textureIndex, source, loader ) {

  		const parser = this;
  		const json = this.json;
  		const options = this.options;

  		const textureDef = json.textures[ textureIndex ];

  		const URL = self.URL || self.webkitURL;

  		let sourceURI = source.uri;
  		let isObjectURL = false;
  		let hasAlpha = true;

  		if ( source.mimeType === 'image/jpeg' ) hasAlpha = false;

  		if ( source.bufferView !== undefined ) {

  			// Load binary image data from bufferView, if provided.

  			sourceURI = parser.getDependency( 'bufferView', source.bufferView ).then( function ( bufferView ) {

  				if ( source.mimeType === 'image/png' ) {

  					// Inspect the PNG 'IHDR' chunk to determine whether the image could have an
  					// alpha channel. This check is conservative — the image could have an alpha
  					// channel with all values == 1, and the indexed type (colorType == 3) only
  					// sometimes contains alpha.
  					//
  					// https://en.wikipedia.org/wiki/Portable_Network_Graphics#File_header
  					const colorType = new DataView( bufferView, 25, 1 ).getUint8( 0, false );
  					hasAlpha = colorType === 6 || colorType === 4 || colorType === 3;

  				}

  				isObjectURL = true;
  				const blob = new Blob( [ bufferView ], { type: source.mimeType } );
  				sourceURI = URL.createObjectURL( blob );
  				return sourceURI;

  			} );

  		} else if ( source.uri === undefined ) {

  			throw new Error( 'THREE.GLTFLoader: Image ' + textureIndex + ' is missing URI and bufferView' );

  		}

  		return Promise.resolve( sourceURI ).then( function ( sourceURI ) {

  			return new Promise( function ( resolve, reject ) {

  				let onLoad = resolve;

  				if ( loader.isImageBitmapLoader === true ) {

  					onLoad = function ( imageBitmap ) {

  						resolve( new THREE.CanvasTexture( imageBitmap ) );

  					};

  				}

  				loader.load( resolveURL( sourceURI, options.path ), onLoad, undefined, reject );

  			} );

  		} ).then( function ( texture ) {

  			// Clean up resources and configure Texture.

  			if ( isObjectURL === true ) {

  				URL.revokeObjectURL( sourceURI );

  			}

  			texture.flipY = false;

  			if ( textureDef.name ) texture.name = textureDef.name;

  			// When there is definitely no alpha channel in the texture, set RGBFormat to save space.
  			if ( ! hasAlpha ) texture.format = THREE.RGBFormat;

  			const samplers = json.samplers || {};
  			const sampler = samplers[ textureDef.sampler ] || {};

  			texture.magFilter = WEBGL_FILTERS[ sampler.magFilter ] || THREE.LinearFilter;
  			texture.minFilter = WEBGL_FILTERS[ sampler.minFilter ] || THREE.LinearMipmapLinearFilter;
  			texture.wrapS = WEBGL_WRAPPINGS[ sampler.wrapS ] || THREE.RepeatWrapping;
  			texture.wrapT = WEBGL_WRAPPINGS[ sampler.wrapT ] || THREE.RepeatWrapping;

  			parser.associations.set( texture, {
  				type: 'textures',
  				index: textureIndex
  			} );

  			return texture;

  		} );

  	}

  	/**
  	 * Asynchronously assigns a texture to the given material parameters.
  	 * @param {Object} materialParams
  	 * @param {string} mapName
  	 * @param {Object} mapDef
  	 * @return {Promise}
  	 */
  	assignTexture( materialParams, mapName, mapDef ) {

  		const parser = this;

  		return this.getDependency( 'texture', mapDef.index ).then( function ( texture ) {

  			// Materials sample aoMap from UV set 1 and other maps from UV set 0 - this can't be configured
  			// However, we will copy UV set 0 to UV set 1 on demand for aoMap
  			if ( mapDef.texCoord !== undefined && mapDef.texCoord != 0 && ! ( mapName === 'aoMap' && mapDef.texCoord == 1 ) ) {

  				console.warn( 'THREE.GLTFLoader: Custom UV set ' + mapDef.texCoord + ' for texture ' + mapName + ' not yet supported.' );

  			}

  			if ( parser.extensions[ EXTENSIONS.KHR_TEXTURE_TRANSFORM ] ) {

  				const transform = mapDef.extensions !== undefined ? mapDef.extensions[ EXTENSIONS.KHR_TEXTURE_TRANSFORM ] : undefined;

  				if ( transform ) {

  					const gltfReference = parser.associations.get( texture );
  					texture = parser.extensions[ EXTENSIONS.KHR_TEXTURE_TRANSFORM ].extendTexture( texture, transform );
  					parser.associations.set( texture, gltfReference );

  				}

  			}

  			materialParams[ mapName ] = texture;

  		} );

  	}

  	/**
  	 * Assigns final material to a Mesh, Line, or Points instance. The instance
  	 * already has a material (generated from the glTF material options alone)
  	 * but reuse of the same glTF material may require multiple threejs materials
  	 * to accommodate different primitive types, defines, etc. New materials will
  	 * be created if necessary, and reused from a cache.
  	 * @param  {Object3D} mesh Mesh, Line, or Points instance.
  	 */
  	assignFinalMaterial( mesh ) {

  		const geometry = mesh.geometry;
  		let material = mesh.material;

  		const useVertexTangents = geometry.attributes.tangent !== undefined;
  		const useVertexColors = geometry.attributes.color !== undefined;
  		const useFlatShading = geometry.attributes.normal === undefined;
  		const useSkinning = mesh.isSkinnedMesh === true;
  		const useMorphTargets = Object.keys( geometry.morphAttributes ).length > 0;
  		const useMorphNormals = useMorphTargets && geometry.morphAttributes.normal !== undefined;

  		if ( mesh.isPoints ) {

  			const cacheKey = 'PointsMaterial:' + material.uuid;

  			let pointsMaterial = this.cache.get( cacheKey );

  			if ( ! pointsMaterial ) {

  				pointsMaterial = new THREE.PointsMaterial();
  				THREE.Material.prototype.copy.call( pointsMaterial, material );
  				pointsMaterial.color.copy( material.color );
  				pointsMaterial.map = material.map;
  				pointsMaterial.sizeAttenuation = false; // glTF spec says points should be 1px

  				this.cache.add( cacheKey, pointsMaterial );

  			}

  			material = pointsMaterial;

  		} else if ( mesh.isLine ) {

  			const cacheKey = 'LineBasicMaterial:' + material.uuid;

  			let lineMaterial = this.cache.get( cacheKey );

  			if ( ! lineMaterial ) {

  				lineMaterial = new THREE.LineBasicMaterial();
  				THREE.Material.prototype.copy.call( lineMaterial, material );
  				lineMaterial.color.copy( material.color );

  				this.cache.add( cacheKey, lineMaterial );

  			}

  			material = lineMaterial;

  		}

  		// Clone the material if it will be modified
  		if ( useVertexTangents || useVertexColors || useFlatShading || useSkinning || useMorphTargets ) {

  			let cacheKey = 'ClonedMaterial:' + material.uuid + ':';

  			if ( material.isGLTFSpecularGlossinessMaterial ) cacheKey += 'specular-glossiness:';
  			if ( useSkinning ) cacheKey += 'skinning:';
  			if ( useVertexTangents ) cacheKey += 'vertex-tangents:';
  			if ( useVertexColors ) cacheKey += 'vertex-colors:';
  			if ( useFlatShading ) cacheKey += 'flat-shading:';
  			if ( useMorphTargets ) cacheKey += 'morph-targets:';
  			if ( useMorphNormals ) cacheKey += 'morph-normals:';

  			let cachedMaterial = this.cache.get( cacheKey );

  			if ( ! cachedMaterial ) {

  				cachedMaterial = material.clone();

  				if ( useSkinning ) cachedMaterial.skinning = true;
  				if ( useVertexColors ) cachedMaterial.vertexColors = true;
  				if ( useFlatShading ) cachedMaterial.flatShading = true;
  				if ( useMorphTargets ) cachedMaterial.morphTargets = true;
  				if ( useMorphNormals ) cachedMaterial.morphNormals = true;

  				if ( useVertexTangents ) {

  					cachedMaterial.vertexTangents = true;

  					// https://github.com/mrdoob/three.js/issues/11438#issuecomment-507003995
  					if ( cachedMaterial.normalScale ) cachedMaterial.normalScale.y *= - 1;
  					if ( cachedMaterial.clearcoatNormalScale ) cachedMaterial.clearcoatNormalScale.y *= - 1;

  				}

  				this.cache.add( cacheKey, cachedMaterial );

  				this.associations.set( cachedMaterial, this.associations.get( material ) );

  			}

  			material = cachedMaterial;

  		}

  		// workarounds for mesh and geometry

  		if ( material.aoMap && geometry.attributes.uv2 === undefined && geometry.attributes.uv !== undefined ) {

  			geometry.setAttribute( 'uv2', geometry.attributes.uv );

  		}

  		mesh.material = material;

  	}

  	getMaterialType( /* materialIndex */ ) {

  		return THREE.MeshStandardMaterial;

  	}

  	/**
  	 * Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#materials
  	 * @param {number} materialIndex
  	 * @return {Promise<Material>}
  	 */
  	loadMaterial( materialIndex ) {

  		const parser = this;
  		const json = this.json;
  		const extensions = this.extensions;
  		const materialDef = json.materials[ materialIndex ];

  		let materialType;
  		const materialParams = {};
  		const materialExtensions = materialDef.extensions || {};

  		const pending = [];

  		if ( materialExtensions[ EXTENSIONS.KHR_MATERIALS_PBR_SPECULAR_GLOSSINESS ] ) {

  			const sgExtension = extensions[ EXTENSIONS.KHR_MATERIALS_PBR_SPECULAR_GLOSSINESS ];
  			materialType = sgExtension.getMaterialType();
  			pending.push( sgExtension.extendParams( materialParams, materialDef, parser ) );

  		} else if ( materialExtensions[ EXTENSIONS.KHR_MATERIALS_UNLIT ] ) {

  			const kmuExtension = extensions[ EXTENSIONS.KHR_MATERIALS_UNLIT ];
  			materialType = kmuExtension.getMaterialType();
  			pending.push( kmuExtension.extendParams( materialParams, materialDef, parser ) );

  		} else {

  			// Specification:
  			// https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#metallic-roughness-material

  			const metallicRoughness = materialDef.pbrMetallicRoughness || {};

  			materialParams.color = new THREE.Color( 1.0, 1.0, 1.0 );
  			materialParams.opacity = 1.0;

  			if ( Array.isArray( metallicRoughness.baseColorFactor ) ) {

  				const array = metallicRoughness.baseColorFactor;

  				materialParams.color.fromArray( array );
  				materialParams.opacity = array[ 3 ];

  			}

  			if ( metallicRoughness.baseColorTexture !== undefined ) {

  				pending.push( parser.assignTexture( materialParams, 'map', metallicRoughness.baseColorTexture ) );

  			}

  			materialParams.metalness = metallicRoughness.metallicFactor !== undefined ? metallicRoughness.metallicFactor : 1.0;
  			materialParams.roughness = metallicRoughness.roughnessFactor !== undefined ? metallicRoughness.roughnessFactor : 1.0;

  			if ( metallicRoughness.metallicRoughnessTexture !== undefined ) {

  				pending.push( parser.assignTexture( materialParams, 'metalnessMap', metallicRoughness.metallicRoughnessTexture ) );
  				pending.push( parser.assignTexture( materialParams, 'roughnessMap', metallicRoughness.metallicRoughnessTexture ) );

  			}

  			materialType = this._invokeOne( function ( ext ) {

  				return ext.getMaterialType && ext.getMaterialType( materialIndex );

  			} );

  			pending.push( Promise.all( this._invokeAll( function ( ext ) {

  				return ext.extendMaterialParams && ext.extendMaterialParams( materialIndex, materialParams );

  			} ) ) );

  		}

  		if ( materialDef.doubleSided === true ) {

  			materialParams.side = THREE.DoubleSide;

  		}

  		const alphaMode = materialDef.alphaMode || ALPHA_MODES.OPAQUE;

  		if ( alphaMode === ALPHA_MODES.BLEND ) {

  			materialParams.transparent = true;

  			// See: https://github.com/mrdoob/three.js/issues/17706
  			materialParams.depthWrite = false;

  		} else {

  			materialParams.transparent = false;

  			if ( alphaMode === ALPHA_MODES.MASK ) {

  				materialParams.alphaTest = materialDef.alphaCutoff !== undefined ? materialDef.alphaCutoff : 0.5;

  			}

  		}

  		if ( materialDef.normalTexture !== undefined && materialType !== THREE.MeshBasicMaterial ) {

  			pending.push( parser.assignTexture( materialParams, 'normalMap', materialDef.normalTexture ) );

  			// https://github.com/mrdoob/three.js/issues/11438#issuecomment-507003995
  			materialParams.normalScale = new THREE.Vector2( 1, - 1 );

  			if ( materialDef.normalTexture.scale !== undefined ) {

  				materialParams.normalScale.set( materialDef.normalTexture.scale, - materialDef.normalTexture.scale );

  			}

  		}

  		if ( materialDef.occlusionTexture !== undefined && materialType !== THREE.MeshBasicMaterial ) {

  			pending.push( parser.assignTexture( materialParams, 'aoMap', materialDef.occlusionTexture ) );

  			if ( materialDef.occlusionTexture.strength !== undefined ) {

  				materialParams.aoMapIntensity = materialDef.occlusionTexture.strength;

  			}

  		}

  		if ( materialDef.emissiveFactor !== undefined && materialType !== THREE.MeshBasicMaterial ) {

  			materialParams.emissive = new THREE.Color().fromArray( materialDef.emissiveFactor );

  		}

  		if ( materialDef.emissiveTexture !== undefined && materialType !== THREE.MeshBasicMaterial ) {

  			pending.push( parser.assignTexture( materialParams, 'emissiveMap', materialDef.emissiveTexture ) );

  		}

  		return Promise.all( pending ).then( function () {

  			let material;

  			if ( materialType === GLTFMeshStandardSGMaterial ) {

  				material = extensions[ EXTENSIONS.KHR_MATERIALS_PBR_SPECULAR_GLOSSINESS ].createMaterial( materialParams );

  			} else {

  				material = new materialType( materialParams );

  			}

  			if ( materialDef.name ) material.name = materialDef.name;

  			// baseColorTexture, emissiveTexture, and specularGlossinessTexture use sRGB encoding.
  			if ( material.map ) material.map.encoding = THREE.sRGBEncoding;
  			if ( material.emissiveMap ) material.emissiveMap.encoding = THREE.sRGBEncoding;

  			assignExtrasToUserData( material, materialDef );

  			parser.associations.set( material, { type: 'materials', index: materialIndex } );

  			if ( materialDef.extensions ) addUnknownExtensionsToUserData( extensions, material, materialDef );

  			return material;

  		} );

  	}

  	/** When Object3D instances are targeted by animation, they need unique names. */
  	createUniqueName( originalName ) {

  		const sanitizedName = THREE.PropertyBinding.sanitizeNodeName( originalName || '' );

  		let name = sanitizedName;

  		for ( let i = 1; this.nodeNamesUsed[ name ]; ++ i ) {

  			name = sanitizedName + '_' + i;

  		}

  		this.nodeNamesUsed[ name ] = true;

  		return name;

  	}

  	/**
  	 * Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#geometry
  	 *
  	 * Creates BufferGeometries from primitives.
  	 *
  	 * @param {Array<GLTF.Primitive>} primitives
  	 * @return {Promise<Array<BufferGeometry>>}
  	 */
  	loadGeometries( primitives ) {

  		const parser = this;
  		const extensions = this.extensions;
  		const cache = this.primitiveCache;

  		function createDracoPrimitive( primitive ) {

  			return extensions[ EXTENSIONS.KHR_DRACO_MESH_COMPRESSION ]
  				.decodePrimitive( primitive, parser )
  				.then( function ( geometry ) {

  					return addPrimitiveAttributes( geometry, primitive, parser );

  				} );

  		}

  		const pending = [];

  		for ( let i = 0, il = primitives.length; i < il; i ++ ) {

  			const primitive = primitives[ i ];
  			const cacheKey = createPrimitiveKey( primitive );

  			// See if we've already created this geometry
  			const cached = cache[ cacheKey ];

  			if ( cached ) {

  				// Use the cached geometry if it exists
  				pending.push( cached.promise );

  			} else {

  				let geometryPromise;

  				if ( primitive.extensions && primitive.extensions[ EXTENSIONS.KHR_DRACO_MESH_COMPRESSION ] ) {

  					// Use DRACO geometry if available
  					geometryPromise = createDracoPrimitive( primitive );

  				} else {

  					// Otherwise create a new geometry
  					geometryPromise = addPrimitiveAttributes( new THREE.BufferGeometry(), primitive, parser );

  				}

  				// Cache this geometry
  				cache[ cacheKey ] = { primitive: primitive, promise: geometryPromise };

  				pending.push( geometryPromise );

  			}

  		}

  		return Promise.all( pending );

  	}

  	/**
  	 * Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#meshes
  	 * @param {number} meshIndex
  	 * @return {Promise<Group|Mesh|SkinnedMesh>}
  	 */
  	loadMesh( meshIndex ) {

  		const parser = this;
  		const json = this.json;
  		const extensions = this.extensions;

  		const meshDef = json.meshes[ meshIndex ];
  		const primitives = meshDef.primitives;

  		const pending = [];

  		for ( let i = 0, il = primitives.length; i < il; i ++ ) {

  			const material = primitives[ i ].material === undefined
  				? createDefaultMaterial( this.cache )
  				: this.getDependency( 'material', primitives[ i ].material );

  			pending.push( material );

  		}

  		pending.push( parser.loadGeometries( primitives ) );

  		return Promise.all( pending ).then( function ( results ) {

  			const materials = results.slice( 0, results.length - 1 );
  			const geometries = results[ results.length - 1 ];

  			const meshes = [];

  			for ( let i = 0, il = geometries.length; i < il; i ++ ) {

  				const geometry = geometries[ i ];
  				const primitive = primitives[ i ];

  				// 1. create Mesh

  				let mesh;

  				const material = materials[ i ];

  				if ( primitive.mode === WEBGL_CONSTANTS.TRIANGLES ||
  						primitive.mode === WEBGL_CONSTANTS.TRIANGLE_STRIP ||
  						primitive.mode === WEBGL_CONSTANTS.TRIANGLE_FAN ||
  						primitive.mode === undefined ) {

  					// .isSkinnedMesh isn't in glTF spec. See ._markDefs()
  					mesh = meshDef.isSkinnedMesh === true
  						? new THREE.SkinnedMesh( geometry, material )
  						: new THREE.Mesh( geometry, material );

  					if ( mesh.isSkinnedMesh === true && ! mesh.geometry.attributes.skinWeight.normalized ) {

  						// we normalize floating point skin weight array to fix malformed assets (see #15319)
  						// it's important to skip this for non-float32 data since normalizeSkinWeights assumes non-normalized inputs
  						mesh.normalizeSkinWeights();

  					}

  					if ( primitive.mode === WEBGL_CONSTANTS.TRIANGLE_STRIP ) {

  						mesh.geometry = toTrianglesDrawMode( mesh.geometry, THREE.TriangleStripDrawMode );

  					} else if ( primitive.mode === WEBGL_CONSTANTS.TRIANGLE_FAN ) {

  						mesh.geometry = toTrianglesDrawMode( mesh.geometry, THREE.TriangleFanDrawMode );

  					}

  				} else if ( primitive.mode === WEBGL_CONSTANTS.LINES ) {

  					mesh = new THREE.LineSegments( geometry, material );

  				} else if ( primitive.mode === WEBGL_CONSTANTS.LINE_STRIP ) {

  					mesh = new THREE.Line( geometry, material );

  				} else if ( primitive.mode === WEBGL_CONSTANTS.LINE_LOOP ) {

  					mesh = new THREE.LineLoop( geometry, material );

  				} else if ( primitive.mode === WEBGL_CONSTANTS.POINTS ) {

  					mesh = new THREE.Points( geometry, material );

  				} else {

  					throw new Error( 'THREE.GLTFLoader: Primitive mode unsupported: ' + primitive.mode );

  				}

  				if ( Object.keys( mesh.geometry.morphAttributes ).length > 0 ) {

  					updateMorphTargets( mesh, meshDef );

  				}

  				mesh.name = parser.createUniqueName( meshDef.name || ( 'mesh_' + meshIndex ) );

  				assignExtrasToUserData( mesh, meshDef );

  				if ( primitive.extensions ) addUnknownExtensionsToUserData( extensions, mesh, primitive );

  				parser.assignFinalMaterial( mesh );

  				meshes.push( mesh );

  			}

  			if ( meshes.length === 1 ) {

  				return meshes[ 0 ];

  			}

  			const group = new THREE.Group();

  			for ( let i = 0, il = meshes.length; i < il; i ++ ) {

  				group.add( meshes[ i ] );

  			}

  			return group;

  		} );

  	}

  	/**
  	 * Specification: https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#cameras
  	 * @param {number} cameraIndex
  	 * @return {Promise<THREE.Camera>}
  	 */
  	loadCamera( cameraIndex ) {

  		let camera;
  		const cameraDef = this.json.cameras[ cameraIndex ];
  		const params = cameraDef[ cameraDef.type ];

  		if ( ! params ) {

  			console.warn( 'THREE.GLTFLoader: Missing camera parameters.' );
  			return;

  		}

  		if ( cameraDef.type === 'perspective' ) {

  			camera = new THREE.PerspectiveCamera( THREE.MathUtils.radToDeg( params.yfov ), params.aspectRatio || 1, params.znear || 1, params.zfar || 2e6 );

  		} else if ( cameraDef.type === 'orthographic' ) {

  			camera = new THREE.OrthographicCamera( - params.xmag, params.xmag, params.ymag, - params.ymag, params.znear, params.zfar );

  		}

  		if ( cameraDef.name ) camera.name = this.createUniqueName( cameraDef.name );

  		assignExtrasToUserData( camera, cameraDef );

  		return Promise.resolve( camera );

  	}

  	/**
  	 * Specification: https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#skins
  	 * @param {number} skinIndex
  	 * @return {Promise<Object>}
  	 */
  	loadSkin( skinIndex ) {

  		const skinDef = this.json.skins[ skinIndex ];

  		const skinEntry = { joints: skinDef.joints };

  		if ( skinDef.inverseBindMatrices === undefined ) {

  			return Promise.resolve( skinEntry );

  		}

  		return this.getDependency( 'accessor', skinDef.inverseBindMatrices ).then( function ( accessor ) {

  			skinEntry.inverseBindMatrices = accessor;

  			return skinEntry;

  		} );

  	}

  	/**
  	 * Specification: https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#animations
  	 * @param {number} animationIndex
  	 * @return {Promise<AnimationClip>}
  	 */
  	loadAnimation( animationIndex ) {

  		const json = this.json;

  		const animationDef = json.animations[ animationIndex ];

  		const pendingNodes = [];
  		const pendingInputAccessors = [];
  		const pendingOutputAccessors = [];
  		const pendingSamplers = [];
  		const pendingTargets = [];

  		for ( let i = 0, il = animationDef.channels.length; i < il; i ++ ) {

  			const channel = animationDef.channels[ i ];
  			const sampler = animationDef.samplers[ channel.sampler ];
  			const target = channel.target;
  			const name = target.node !== undefined ? target.node : target.id; // NOTE: target.id is deprecated.
  			const input = animationDef.parameters !== undefined ? animationDef.parameters[ sampler.input ] : sampler.input;
  			const output = animationDef.parameters !== undefined ? animationDef.parameters[ sampler.output ] : sampler.output;

  			pendingNodes.push( this.getDependency( 'node', name ) );
  			pendingInputAccessors.push( this.getDependency( 'accessor', input ) );
  			pendingOutputAccessors.push( this.getDependency( 'accessor', output ) );
  			pendingSamplers.push( sampler );
  			pendingTargets.push( target );

  		}

  		return Promise.all( [

  			Promise.all( pendingNodes ),
  			Promise.all( pendingInputAccessors ),
  			Promise.all( pendingOutputAccessors ),
  			Promise.all( pendingSamplers ),
  			Promise.all( pendingTargets )

  		] ).then( function ( dependencies ) {

  			const nodes = dependencies[ 0 ];
  			const inputAccessors = dependencies[ 1 ];
  			const outputAccessors = dependencies[ 2 ];
  			const samplers = dependencies[ 3 ];
  			const targets = dependencies[ 4 ];

  			const tracks = [];

  			for ( let i = 0, il = nodes.length; i < il; i ++ ) {

  				const node = nodes[ i ];
  				const inputAccessor = inputAccessors[ i ];
  				const outputAccessor = outputAccessors[ i ];
  				const sampler = samplers[ i ];
  				const target = targets[ i ];

  				if ( node === undefined ) continue;

  				node.updateMatrix();
  				node.matrixAutoUpdate = true;

  				let TypedKeyframeTrack;

  				switch ( PATH_PROPERTIES[ target.path ] ) {

  					case PATH_PROPERTIES.weights:

  						TypedKeyframeTrack = THREE.NumberKeyframeTrack;
  						break;

  					case PATH_PROPERTIES.rotation:

  						TypedKeyframeTrack = THREE.QuaternionKeyframeTrack;
  						break;

  					case PATH_PROPERTIES.position:
  					case PATH_PROPERTIES.scale:
  					default:

  						TypedKeyframeTrack = THREE.VectorKeyframeTrack;
  						break;

  				}

  				const targetName = node.name ? node.name : node.uuid;

  				const interpolation = sampler.interpolation !== undefined ? INTERPOLATION[ sampler.interpolation ] : THREE.InterpolateLinear;

  				const targetNames = [];

  				if ( PATH_PROPERTIES[ target.path ] === PATH_PROPERTIES.weights ) {

  					// Node may be a Group (glTF mesh with several primitives) or a Mesh.
  					node.traverse( function ( object ) {

  						if ( object.isMesh === true && object.morphTargetInfluences ) {

  							targetNames.push( object.name ? object.name : object.uuid );

  						}

  					} );

  				} else {

  					targetNames.push( targetName );

  				}

  				let outputArray = outputAccessor.array;

  				if ( outputAccessor.normalized ) {

  					const scale = getNormalizedComponentScale( outputArray.constructor );
  					const scaled = new Float32Array( outputArray.length );

  					for ( let j = 0, jl = outputArray.length; j < jl; j ++ ) {

  						scaled[ j ] = outputArray[ j ] * scale;

  					}

  					outputArray = scaled;

  				}

  				for ( let j = 0, jl = targetNames.length; j < jl; j ++ ) {

  					const track = new TypedKeyframeTrack(
  						targetNames[ j ] + '.' + PATH_PROPERTIES[ target.path ],
  						inputAccessor.array,
  						outputArray,
  						interpolation
  					);

  					// Override interpolation with custom factory method.
  					if ( sampler.interpolation === 'CUBICSPLINE' ) {

  						track.createInterpolant = function InterpolantFactoryMethodGLTFCubicSpline( result ) {

  							// A CUBICSPLINE keyframe in glTF has three output values for each input value,
  							// representing inTangent, splineVertex, and outTangent. As a result, track.getValueSize()
  							// must be divided by three to get the interpolant's sampleSize argument.

  							return new GLTFCubicSplineInterpolant( this.times, this.values, this.getValueSize() / 3, result );

  						};

  						// Mark as CUBICSPLINE. `track.getInterpolation()` doesn't support custom interpolants.
  						track.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline = true;

  					}

  					tracks.push( track );

  				}

  			}

  			const name = animationDef.name ? animationDef.name : 'animation_' + animationIndex;

  			return new THREE.AnimationClip( name, undefined, tracks );

  		} );

  	}

  	createNodeMesh( nodeIndex ) {

  		const json = this.json;
  		const parser = this;
  		const nodeDef = json.nodes[ nodeIndex ];

  		if ( nodeDef.mesh === undefined ) return null;

  		return parser.getDependency( 'mesh', nodeDef.mesh ).then( function ( mesh ) {

  			const node = parser._getNodeRef( parser.meshCache, nodeDef.mesh, mesh );

  			// if weights are provided on the node, override weights on the mesh.
  			if ( nodeDef.weights !== undefined ) {

  				node.traverse( function ( o ) {

  					if ( ! o.isMesh ) return;

  					for ( let i = 0, il = nodeDef.weights.length; i < il; i ++ ) {

  						o.morphTargetInfluences[ i ] = nodeDef.weights[ i ];

  					}

  				} );

  			}

  			return node;

  		} );

  	}

  	/**
  	 * Specification: https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#nodes-and-hierarchy
  	 * @param {number} nodeIndex
  	 * @return {Promise<Object3D>}
  	 */
  	loadNode( nodeIndex ) {

  		const json = this.json;
  		const extensions = this.extensions;
  		const parser = this;

  		const nodeDef = json.nodes[ nodeIndex ];

  		// reserve node's name before its dependencies, so the root has the intended name.
  		const nodeName = nodeDef.name ? parser.createUniqueName( nodeDef.name ) : '';

  		return ( function () {

  			const pending = [];

  			const meshPromise = parser._invokeOne( function ( ext ) {

  				return ext.createNodeMesh && ext.createNodeMesh( nodeIndex );

  			} );

  			if ( meshPromise ) {

  				pending.push( meshPromise );

  			}

  			if ( nodeDef.camera !== undefined ) {

  				pending.push( parser.getDependency( 'camera', nodeDef.camera ).then( function ( camera ) {

  					return parser._getNodeRef( parser.cameraCache, nodeDef.camera, camera );

  				} ) );

  			}

  			parser._invokeAll( function ( ext ) {

  				return ext.createNodeAttachment && ext.createNodeAttachment( nodeIndex );

  			} ).forEach( function ( promise ) {

  				pending.push( promise );

  			} );

  			return Promise.all( pending );

  		}() ).then( function ( objects ) {

  			let node;

  			// .isBone isn't in glTF spec. See ._markDefs
  			if ( nodeDef.isBone === true ) {

  				node = new THREE.Bone();

  			} else if ( objects.length > 1 ) {

  				node = new THREE.Group();

  			} else if ( objects.length === 1 ) {

  				node = objects[ 0 ];

  			} else {

  				node = new THREE.Object3D();

  			}

  			if ( node !== objects[ 0 ] ) {

  				for ( let i = 0, il = objects.length; i < il; i ++ ) {

  					node.add( objects[ i ] );

  				}

  			}

  			if ( nodeDef.name ) {

  				node.userData.name = nodeDef.name;
  				node.name = nodeName;

  			}

  			assignExtrasToUserData( node, nodeDef );

  			if ( nodeDef.extensions ) addUnknownExtensionsToUserData( extensions, node, nodeDef );

  			if ( nodeDef.matrix !== undefined ) {

  				const matrix = new THREE.Matrix4();
  				matrix.fromArray( nodeDef.matrix );
  				node.applyMatrix4( matrix );

  			} else {

  				if ( nodeDef.translation !== undefined ) {

  					node.position.fromArray( nodeDef.translation );

  				}

  				if ( nodeDef.rotation !== undefined ) {

  					node.quaternion.fromArray( nodeDef.rotation );

  				}

  				if ( nodeDef.scale !== undefined ) {

  					node.scale.fromArray( nodeDef.scale );

  				}

  			}

  			parser.associations.set( node, { type: 'nodes', index: nodeIndex } );

  			return node;

  		} );

  	}

  	/**
  	 * Specification: https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#scenes
  	 * @param {number} sceneIndex
  	 * @return {Promise<Group>}
  	 */
  	loadScene( sceneIndex ) {

  		const json = this.json;
  		const extensions = this.extensions;
  		const sceneDef = this.json.scenes[ sceneIndex ];
  		const parser = this;

  		// Loader returns Group, not Scene.
  		// See: https://github.com/mrdoob/three.js/issues/18342#issuecomment-578981172
  		const scene = new THREE.Group();
  		if ( sceneDef.name ) scene.name = parser.createUniqueName( sceneDef.name );

  		assignExtrasToUserData( scene, sceneDef );

  		if ( sceneDef.extensions ) addUnknownExtensionsToUserData( extensions, scene, sceneDef );

  		const nodeIds = sceneDef.nodes || [];

  		const pending = [];

  		for ( let i = 0, il = nodeIds.length; i < il; i ++ ) {

  			pending.push( buildNodeHierachy( nodeIds[ i ], scene, json, parser ) );

  		}

  		return Promise.all( pending ).then( function () {

  			return scene;

  		} );

  	}

  }

  function buildNodeHierachy( nodeId, parentObject, json, parser ) {

  	const nodeDef = json.nodes[ nodeId ];

  	return parser.getDependency( 'node', nodeId ).then( function ( node ) {

  		if ( nodeDef.skin === undefined ) return node;

  		// build skeleton here as well

  		let skinEntry;

  		return parser.getDependency( 'skin', nodeDef.skin ).then( function ( skin ) {

  			skinEntry = skin;

  			const pendingJoints = [];

  			for ( let i = 0, il = skinEntry.joints.length; i < il; i ++ ) {

  				pendingJoints.push( parser.getDependency( 'node', skinEntry.joints[ i ] ) );

  			}

  			return Promise.all( pendingJoints );

  		} ).then( function ( jointNodes ) {

  			node.traverse( function ( mesh ) {

  				if ( ! mesh.isMesh ) return;

  				const bones = [];
  				const boneInverses = [];

  				for ( let j = 0, jl = jointNodes.length; j < jl; j ++ ) {

  					const jointNode = jointNodes[ j ];

  					if ( jointNode ) {

  						bones.push( jointNode );

  						const mat = new THREE.Matrix4();

  						if ( skinEntry.inverseBindMatrices !== undefined ) {

  							mat.fromArray( skinEntry.inverseBindMatrices.array, j * 16 );

  						}

  						boneInverses.push( mat );

  					} else {

  						console.warn( 'THREE.GLTFLoader: Joint "%s" could not be found.', skinEntry.joints[ j ] );

  					}

  				}

  				mesh.bind( new THREE.Skeleton( bones, boneInverses ), mesh.matrixWorld );

  			} );

  			return node;

  		} );

  	} ).then( function ( node ) {

  		// build node hierachy

  		parentObject.add( node );

  		const pending = [];

  		if ( nodeDef.children ) {

  			const children = nodeDef.children;

  			for ( let i = 0, il = children.length; i < il; i ++ ) {

  				const child = children[ i ];
  				pending.push( buildNodeHierachy( child, node, json, parser ) );

  			}

  		}

  		return Promise.all( pending );

  	} );

  }

  /**
   * @param {BufferGeometry} geometry
   * @param {GLTF.Primitive} primitiveDef
   * @param {GLTFParser} parser
   */
  function computeBounds( geometry, primitiveDef, parser ) {

  	const attributes = primitiveDef.attributes;

  	const box = new THREE.Box3();

  	if ( attributes.POSITION !== undefined ) {

  		const accessor = parser.json.accessors[ attributes.POSITION ];

  		const min = accessor.min;
  		const max = accessor.max;

  		// glTF requires 'min' and 'max', but VRM (which extends glTF) currently ignores that requirement.

  		if ( min !== undefined && max !== undefined ) {

  			box.set(
  				new THREE.Vector3( min[ 0 ], min[ 1 ], min[ 2 ] ),
  				new THREE.Vector3( max[ 0 ], max[ 1 ], max[ 2 ] )
  			);

  			if ( accessor.normalized ) {

  				const boxScale = getNormalizedComponentScale( WEBGL_COMPONENT_TYPES[ accessor.componentType ] );
  				box.min.multiplyScalar( boxScale );
  				box.max.multiplyScalar( boxScale );

  			}

  		} else {

  			console.warn( 'THREE.GLTFLoader: Missing min/max properties for accessor POSITION.' );

  			return;

  		}

  	} else {

  		return;

  	}

  	const targets = primitiveDef.targets;

  	if ( targets !== undefined ) {

  		const maxDisplacement = new THREE.Vector3();
  		const vector = new THREE.Vector3();

  		for ( let i = 0, il = targets.length; i < il; i ++ ) {

  			const target = targets[ i ];

  			if ( target.POSITION !== undefined ) {

  				const accessor = parser.json.accessors[ target.POSITION ];
  				const min = accessor.min;
  				const max = accessor.max;

  				// glTF requires 'min' and 'max', but VRM (which extends glTF) currently ignores that requirement.

  				if ( min !== undefined && max !== undefined ) {

  					// we need to get max of absolute components because target weight is [-1,1]
  					vector.setX( Math.max( Math.abs( min[ 0 ] ), Math.abs( max[ 0 ] ) ) );
  					vector.setY( Math.max( Math.abs( min[ 1 ] ), Math.abs( max[ 1 ] ) ) );
  					vector.setZ( Math.max( Math.abs( min[ 2 ] ), Math.abs( max[ 2 ] ) ) );


  					if ( accessor.normalized ) {

  						const boxScale = getNormalizedComponentScale( WEBGL_COMPONENT_TYPES[ accessor.componentType ] );
  						vector.multiplyScalar( boxScale );

  					}

  					// Note: this assumes that the sum of all weights is at most 1. This isn't quite correct - it's more conservative
  					// to assume that each target can have a max weight of 1. However, for some use cases - notably, when morph targets
  					// are used to implement key-frame animations and as such only two are active at a time - this results in very large
  					// boxes. So for now we make a box that's sometimes a touch too small but is hopefully mostly of reasonable size.
  					maxDisplacement.max( vector );

  				} else {

  					console.warn( 'THREE.GLTFLoader: Missing min/max properties for accessor POSITION.' );

  				}

  			}

  		}

  		// As per comment above this box isn't conservative, but has a reasonable size for a very large number of morph targets.
  		box.expandByVector( maxDisplacement );

  	}

  	geometry.boundingBox = box;

  	const sphere = new THREE.Sphere();

  	box.getCenter( sphere.center );
  	sphere.radius = box.min.distanceTo( box.max ) / 2;

  	geometry.boundingSphere = sphere;

  }

  /**
   * @param {BufferGeometry} geometry
   * @param {GLTF.Primitive} primitiveDef
   * @param {GLTFParser} parser
   * @return {Promise<BufferGeometry>}
   */
  function addPrimitiveAttributes( geometry, primitiveDef, parser ) {

  	const attributes = primitiveDef.attributes;

  	const pending = [];

  	function assignAttributeAccessor( accessorIndex, attributeName ) {

  		return parser.getDependency( 'accessor', accessorIndex )
  			.then( function ( accessor ) {

  				geometry.setAttribute( attributeName, accessor );

  			} );

  	}

  	for ( const gltfAttributeName in attributes ) {

  		const threeAttributeName = ATTRIBUTES[ gltfAttributeName ] || gltfAttributeName.toLowerCase();

  		// Skip attributes already provided by e.g. Draco extension.
  		if ( threeAttributeName in geometry.attributes ) continue;

  		pending.push( assignAttributeAccessor( attributes[ gltfAttributeName ], threeAttributeName ) );

  	}

  	if ( primitiveDef.indices !== undefined && ! geometry.index ) {

  		const accessor = parser.getDependency( 'accessor', primitiveDef.indices ).then( function ( accessor ) {

  			geometry.setIndex( accessor );

  		} );

  		pending.push( accessor );

  	}

  	assignExtrasToUserData( geometry, primitiveDef );

  	computeBounds( geometry, primitiveDef, parser );

  	return Promise.all( pending ).then( function () {

  		return primitiveDef.targets !== undefined
  			? addMorphTargets( geometry, primitiveDef.targets, parser )
  			: geometry;

  	} );

  }

  /**
   * @param {BufferGeometry} geometry
   * @param {Number} drawMode
   * @return {BufferGeometry}
   */
  function toTrianglesDrawMode( geometry, drawMode ) {

  	let index = geometry.getIndex();

  	// generate index if not present

  	if ( index === null ) {

  		const indices = [];

  		const position = geometry.getAttribute( 'position' );

  		if ( position !== undefined ) {

  			for ( let i = 0; i < position.count; i ++ ) {

  				indices.push( i );

  			}

  			geometry.setIndex( indices );
  			index = geometry.getIndex();

  		} else {

  			console.error( 'THREE.GLTFLoader.toTrianglesDrawMode(): Undefined position attribute. Processing not possible.' );
  			return geometry;

  		}

  	}

  	//

  	const numberOfTriangles = index.count - 2;
  	const newIndices = [];

  	if ( drawMode === THREE.TriangleFanDrawMode ) {

  		// gl.TRIANGLE_FAN

  		for ( let i = 1; i <= numberOfTriangles; i ++ ) {

  			newIndices.push( index.getX( 0 ) );
  			newIndices.push( index.getX( i ) );
  			newIndices.push( index.getX( i + 1 ) );

  		}

  	} else {

  		// gl.TRIANGLE_STRIP

  		for ( let i = 0; i < numberOfTriangles; i ++ ) {

  			if ( i % 2 === 0 ) {

  				newIndices.push( index.getX( i ) );
  				newIndices.push( index.getX( i + 1 ) );
  				newIndices.push( index.getX( i + 2 ) );


  			} else {

  				newIndices.push( index.getX( i + 2 ) );
  				newIndices.push( index.getX( i + 1 ) );
  				newIndices.push( index.getX( i ) );

  			}

  		}

  	}

  	if ( ( newIndices.length / 3 ) !== numberOfTriangles ) {

  		console.error( 'THREE.GLTFLoader.toTrianglesDrawMode(): Unable to generate correct amount of triangles.' );

  	}

  	// build final geometry

  	const newGeometry = geometry.clone();
  	newGeometry.setIndex( newIndices );

  	return newGeometry;

  }

  /**
   * Function to center object on its bounding box
   *
   * An object created in blender may not have its origin at the object's
   * physical center, and this can be annoying when, say, you want to rotate
   * that object. This function will shift the object relative to its parent
   * coordinate system so that its center is at the parent's origin; that means
   * you can then e.g. rotate the parent to get a realistic/useful rotation effect
   * on this object
   */
  function centerOnBoundingBox(object) {
    // ----------------------------------------------------->>>
    // Get center of boundingBox
    var boundingBox = new THREE.Box3().setFromObject(object);
    var _boundingBox$getCente = boundingBox.getCenter(new THREE.Vector3()).toArray(),
      x2 = _boundingBox$getCente[0],
      y2 = _boundingBox$getCente[1],
      z2 = _boundingBox$getCente[2];
    // Move object to where center was
    var _object$position$clon = object.position.clone().toArray(),
      x1 = _object$position$clon[0],
      y1 = _object$position$clon[1],
      z1 = _object$position$clon[2];
    object.position.set(x1 - x2, y1 - y2, z1 - z2);
  }

  /**
   * Simple function to ensure all children receive and cast shadows
   */
  function enshadowChildren(object) {
    object.traverse(function (child) {
      if (child.type === 'Mesh') {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }

  /**
   * Function to scale an object so that the child with the largest bounding-sphere radius
   * will end up with a bounding sphere radius equal to the supplied targetRadius
   */
  function resizeThreejsObject(object, targetRadius) {
    // --------------------------------------------------------------------------->>>
    var biggestSphereRadius = Math.pow(10, -10);
    object.traverse(function (child) {
      if (child instanceof THREE.Mesh) {
        child.geometry.computeBoundingSphere(); // Need to run this, else `child.geometry.boundingSphere.radius` will be undefined
        if (!!child.geometry && !!child.geometry.boundingSphere && child.geometry.boundingSphere.radius > biggestSphereRadius) {
          biggestSphereRadius = child.geometry.boundingSphere.radius;
        }
      }
    });
    var s = targetRadius / biggestSphereRadius;
    object.scale.set(s, s, s);
  }

  function gltfLoader(gltfUrl, targetRadius, isCenteredOnBoundingBox, isShadowShown) {
    // ----------------->>>
    return new Promise(function (resolve, reject) {
      new GLTFLoader().load(gltfUrl, function (gltf) {
        var object = gltf.scene;
        if (!!targetRadius) resizeThreejsObject(object, targetRadius);
        if (!!isCenteredOnBoundingBox) centerOnBoundingBox(object);
        if (!!isShadowShown) enshadowChildren(object);
        setTimeout(function () {
          return resolve(object);
        }, delayMs);
      }, function (xhr) {
        return !true ;
      }, function (error) {
        console.log('Loading error occurred:', error.message);
        reject();
      });
    });
  }

  /**
   * Scale a given position to be a distance logged from the center
   * adjusted to leave the position of earth unaffected
   */
  function getLoggedPosition(position) {
    // --->>
    // Get old length in aus
    var oldLengthAus = position.length() / au;
    // Take log and add 1 to keep earth untransformed and venus/mercury to not have negative length
    var newLengthAus = Math.log10(oldLengthAus) + 1;
    // Compute scale factor with which to multiply position
    // to leave Earth unchanged, etc.; au's will cancel.
    var f = newLengthAus / oldLengthAus;
    // Clone, transform and return
    var newPosition = position.clone();
    newPosition.multiplyScalar(f);
    return newPosition;
  }

  class BufferGeometryUtils {

  	static computeTangents( geometry ) {

  		geometry.computeTangents();
  		console.warn( 'THREE.BufferGeometryUtils: .computeTangents() has been removed. Use BufferGeometry.computeTangents() instead.' );

  	}

  	/**
  	 * @param  {Array<BufferGeometry>} geometries
  	 * @param  {Boolean} useGroups
  	 * @return {BufferGeometry}
  	 */
  	static mergeBufferGeometries( geometries, useGroups = false ) {

  		const isIndexed = geometries[ 0 ].index !== null;

  		const attributesUsed = new Set( Object.keys( geometries[ 0 ].attributes ) );
  		const morphAttributesUsed = new Set( Object.keys( geometries[ 0 ].morphAttributes ) );

  		const attributes = {};
  		const morphAttributes = {};

  		const morphTargetsRelative = geometries[ 0 ].morphTargetsRelative;

  		const mergedGeometry = new THREE.BufferGeometry();

  		let offset = 0;

  		for ( let i = 0; i < geometries.length; ++ i ) {

  			const geometry = geometries[ i ];
  			let attributesCount = 0;

  			// ensure that all geometries are indexed, or none

  			if ( isIndexed !== ( geometry.index !== null ) ) {

  				console.error( 'THREE.BufferGeometryUtils: .mergeBufferGeometries() failed with geometry at index ' + i + '. All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them.' );
  				return null;

  			}

  			// gather attributes, exit early if they're different

  			for ( const name in geometry.attributes ) {

  				if ( ! attributesUsed.has( name ) ) {

  					console.error( 'THREE.BufferGeometryUtils: .mergeBufferGeometries() failed with geometry at index ' + i + '. All geometries must have compatible attributes; make sure "' + name + '" attribute exists among all geometries, or in none of them.' );
  					return null;

  				}

  				if ( attributes[ name ] === undefined ) attributes[ name ] = [];

  				attributes[ name ].push( geometry.attributes[ name ] );

  				attributesCount ++;

  			}

  			// ensure geometries have the same number of attributes

  			if ( attributesCount !== attributesUsed.size ) {

  				console.error( 'THREE.BufferGeometryUtils: .mergeBufferGeometries() failed with geometry at index ' + i + '. Make sure all geometries have the same number of attributes.' );
  				return null;

  			}

  			// gather morph attributes, exit early if they're different

  			if ( morphTargetsRelative !== geometry.morphTargetsRelative ) {

  				console.error( 'THREE.BufferGeometryUtils: .mergeBufferGeometries() failed with geometry at index ' + i + '. .morphTargetsRelative must be consistent throughout all geometries.' );
  				return null;

  			}

  			for ( const name in geometry.morphAttributes ) {

  				if ( ! morphAttributesUsed.has( name ) ) {

  					console.error( 'THREE.BufferGeometryUtils: .mergeBufferGeometries() failed with geometry at index ' + i + '.  .morphAttributes must be consistent throughout all geometries.' );
  					return null;

  				}

  				if ( morphAttributes[ name ] === undefined ) morphAttributes[ name ] = [];

  				morphAttributes[ name ].push( geometry.morphAttributes[ name ] );

  			}

  			// gather .userData

  			mergedGeometry.userData.mergedUserData = mergedGeometry.userData.mergedUserData || [];
  			mergedGeometry.userData.mergedUserData.push( geometry.userData );

  			if ( useGroups ) {

  				let count;

  				if ( isIndexed ) {

  					count = geometry.index.count;

  				} else if ( geometry.attributes.position !== undefined ) {

  					count = geometry.attributes.position.count;

  				} else {

  					console.error( 'THREE.BufferGeometryUtils: .mergeBufferGeometries() failed with geometry at index ' + i + '. The geometry must have either an index or a position attribute' );
  					return null;

  				}

  				mergedGeometry.addGroup( offset, count, i );

  				offset += count;

  			}

  		}

  		// merge indices

  		if ( isIndexed ) {

  			let indexOffset = 0;
  			const mergedIndex = [];

  			for ( let i = 0; i < geometries.length; ++ i ) {

  				const index = geometries[ i ].index;

  				for ( let j = 0; j < index.count; ++ j ) {

  					mergedIndex.push( index.getX( j ) + indexOffset );

  				}

  				indexOffset += geometries[ i ].attributes.position.count;

  			}

  			mergedGeometry.setIndex( mergedIndex );

  		}

  		// merge attributes

  		for ( const name in attributes ) {

  			const mergedAttribute = this.mergeBufferAttributes( attributes[ name ] );

  			if ( ! mergedAttribute ) {

  				console.error( 'THREE.BufferGeometryUtils: .mergeBufferGeometries() failed while trying to merge the ' + name + ' attribute.' );
  				return null;

  			}

  			mergedGeometry.setAttribute( name, mergedAttribute );

  		}

  		// merge morph attributes

  		for ( const name in morphAttributes ) {

  			const numMorphTargets = morphAttributes[ name ][ 0 ].length;

  			if ( numMorphTargets === 0 ) break;

  			mergedGeometry.morphAttributes = mergedGeometry.morphAttributes || {};
  			mergedGeometry.morphAttributes[ name ] = [];

  			for ( let i = 0; i < numMorphTargets; ++ i ) {

  				const morphAttributesToMerge = [];

  				for ( let j = 0; j < morphAttributes[ name ].length; ++ j ) {

  					morphAttributesToMerge.push( morphAttributes[ name ][ j ][ i ] );

  				}

  				const mergedMorphAttribute = this.mergeBufferAttributes( morphAttributesToMerge );

  				if ( ! mergedMorphAttribute ) {

  					console.error( 'THREE.BufferGeometryUtils: .mergeBufferGeometries() failed while trying to merge the ' + name + ' morphAttribute.' );
  					return null;

  				}

  				mergedGeometry.morphAttributes[ name ].push( mergedMorphAttribute );

  			}

  		}

  		return mergedGeometry;

  	}

  	/**
  	 * @param {Array<BufferAttribute>} attributes
  	 * @return {BufferAttribute}
  	 */
  	static mergeBufferAttributes( attributes ) {

  		let TypedArray;
  		let itemSize;
  		let normalized;
  		let arrayLength = 0;

  		for ( let i = 0; i < attributes.length; ++ i ) {

  			const attribute = attributes[ i ];

  			if ( attribute.isInterleavedBufferAttribute ) {

  				console.error( 'THREE.BufferGeometryUtils: .mergeBufferAttributes() failed. InterleavedBufferAttributes are not supported.' );
  				return null;

  			}

  			if ( TypedArray === undefined ) TypedArray = attribute.array.constructor;
  			if ( TypedArray !== attribute.array.constructor ) {

  				console.error( 'THREE.BufferGeometryUtils: .mergeBufferAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes.' );
  				return null;

  			}

  			if ( itemSize === undefined ) itemSize = attribute.itemSize;
  			if ( itemSize !== attribute.itemSize ) {

  				console.error( 'THREE.BufferGeometryUtils: .mergeBufferAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes.' );
  				return null;

  			}

  			if ( normalized === undefined ) normalized = attribute.normalized;
  			if ( normalized !== attribute.normalized ) {

  				console.error( 'THREE.BufferGeometryUtils: .mergeBufferAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes.' );
  				return null;

  			}

  			arrayLength += attribute.array.length;

  		}

  		const array = new TypedArray( arrayLength );
  		let offset = 0;

  		for ( let i = 0; i < attributes.length; ++ i ) {

  			array.set( attributes[ i ].array, offset );

  			offset += attributes[ i ].array.length;

  		}

  		return new THREE.BufferAttribute( array, itemSize, normalized );

  	}

  	/**
  	 * @param {Array<BufferAttribute>} attributes
  	 * @return {Array<InterleavedBufferAttribute>}
  	 */
  	static interleaveAttributes( attributes ) {

  		// Interleaves the provided attributes into an InterleavedBuffer and returns
  		// a set of InterleavedBufferAttributes for each attribute
  		let TypedArray;
  		let arrayLength = 0;
  		let stride = 0;

  		// calculate the the length and type of the interleavedBuffer
  		for ( let i = 0, l = attributes.length; i < l; ++ i ) {

  			const attribute = attributes[ i ];

  			if ( TypedArray === undefined ) TypedArray = attribute.array.constructor;
  			if ( TypedArray !== attribute.array.constructor ) {

  				console.error( 'AttributeBuffers of different types cannot be interleaved' );
  				return null;

  			}

  			arrayLength += attribute.array.length;
  			stride += attribute.itemSize;

  		}

  		// Create the set of buffer attributes
  		const interleavedBuffer = new THREE.InterleavedBuffer( new TypedArray( arrayLength ), stride );
  		let offset = 0;
  		const res = [];
  		const getters = [ 'getX', 'getY', 'getZ', 'getW' ];
  		const setters = [ 'setX', 'setY', 'setZ', 'setW' ];

  		for ( let j = 0, l = attributes.length; j < l; j ++ ) {

  			const attribute = attributes[ j ];
  			const itemSize = attribute.itemSize;
  			const count = attribute.count;
  			const iba = new THREE.InterleavedBufferAttribute( interleavedBuffer, itemSize, offset, attribute.normalized );
  			res.push( iba );

  			offset += itemSize;

  			// Move the data for each attribute into the new interleavedBuffer
  			// at the appropriate offset
  			for ( let c = 0; c < count; c ++ ) {

  				for ( let k = 0; k < itemSize; k ++ ) {

  					iba[ setters[ k ] ]( c, attribute[ getters[ k ] ]( c ) );

  				}

  			}

  		}

  		return res;

  	}

  	/**
  	 * @param {Array<BufferGeometry>} geometry
  	 * @return {number}
  	 */
  	static estimateBytesUsed( geometry ) {

  		// Return the estimated memory used by this geometry in bytes
  		// Calculate using itemSize, count, and BYTES_PER_ELEMENT to account
  		// for InterleavedBufferAttributes.
  		let mem = 0;
  		for ( const name in geometry.attributes ) {

  			const attr = geometry.getAttribute( name );
  			mem += attr.count * attr.itemSize * attr.array.BYTES_PER_ELEMENT;

  		}

  		const indices = geometry.getIndex();
  		mem += indices ? indices.count * indices.itemSize * indices.array.BYTES_PER_ELEMENT : 0;
  		return mem;

  	}

  	/**
  	 * @param {BufferGeometry} geometry
  	 * @param {number} tolerance
  	 * @return {BufferGeometry>}
  	 */
  	static mergeVertices( geometry, tolerance = 1e-4 ) {

  		tolerance = Math.max( tolerance, Number.EPSILON );

  		// Generate an index buffer if the geometry doesn't have one, or optimize it
  		// if it's already available.
  		const hashToIndex = {};
  		const indices = geometry.getIndex();
  		const positions = geometry.getAttribute( 'position' );
  		const vertexCount = indices ? indices.count : positions.count;

  		// next value for triangle indices
  		let nextIndex = 0;

  		// attributes and new attribute arrays
  		const attributeNames = Object.keys( geometry.attributes );
  		const attrArrays = {};
  		const morphAttrsArrays = {};
  		const newIndices = [];
  		const getters = [ 'getX', 'getY', 'getZ', 'getW' ];

  		// initialize the arrays
  		for ( let i = 0, l = attributeNames.length; i < l; i ++ ) {

  			const name = attributeNames[ i ];

  			attrArrays[ name ] = [];

  			const morphAttr = geometry.morphAttributes[ name ];
  			if ( morphAttr ) {

  				morphAttrsArrays[ name ] = new Array( morphAttr.length ).fill().map( () => [] );

  			}

  		}

  		// convert the error tolerance to an amount of decimal places to truncate to
  		const decimalShift = Math.log10( 1 / tolerance );
  		const shiftMultiplier = Math.pow( 10, decimalShift );
  		for ( let i = 0; i < vertexCount; i ++ ) {

  			const index = indices ? indices.getX( i ) : i;

  			// Generate a hash for the vertex attributes at the current index 'i'
  			let hash = '';
  			for ( let j = 0, l = attributeNames.length; j < l; j ++ ) {

  				const name = attributeNames[ j ];
  				const attribute = geometry.getAttribute( name );
  				const itemSize = attribute.itemSize;

  				for ( let k = 0; k < itemSize; k ++ ) {

  					// double tilde truncates the decimal value
  					hash += `${ ~ ~ ( attribute[ getters[ k ] ]( index ) * shiftMultiplier ) },`;

  				}

  			}

  			// Add another reference to the vertex if it's already
  			// used by another index
  			if ( hash in hashToIndex ) {

  				newIndices.push( hashToIndex[ hash ] );

  			} else {

  				// copy data to the new index in the attribute arrays
  				for ( let j = 0, l = attributeNames.length; j < l; j ++ ) {

  					const name = attributeNames[ j ];
  					const attribute = geometry.getAttribute( name );
  					const morphAttr = geometry.morphAttributes[ name ];
  					const itemSize = attribute.itemSize;
  					const newarray = attrArrays[ name ];
  					const newMorphArrays = morphAttrsArrays[ name ];

  					for ( let k = 0; k < itemSize; k ++ ) {

  						const getterFunc = getters[ k ];
  						newarray.push( attribute[ getterFunc ]( index ) );

  						if ( morphAttr ) {

  							for ( let m = 0, ml = morphAttr.length; m < ml; m ++ ) {

  								newMorphArrays[ m ].push( morphAttr[ m ][ getterFunc ]( index ) );

  							}

  						}

  					}

  				}

  				hashToIndex[ hash ] = nextIndex;
  				newIndices.push( nextIndex );
  				nextIndex ++;

  			}

  		}

  		// Generate typed arrays from new attribute arrays and update
  		// the attributeBuffers
  		const result = geometry.clone();
  		for ( let i = 0, l = attributeNames.length; i < l; i ++ ) {

  			const name = attributeNames[ i ];
  			const oldAttribute = geometry.getAttribute( name );

  			const buffer = new oldAttribute.array.constructor( attrArrays[ name ] );
  			const attribute = new THREE.BufferAttribute( buffer, oldAttribute.itemSize, oldAttribute.normalized );

  			result.setAttribute( name, attribute );

  			// Update the attribute arrays
  			if ( name in morphAttrsArrays ) {

  				for ( let j = 0; j < morphAttrsArrays[ name ].length; j ++ ) {

  					const oldMorphAttribute = geometry.morphAttributes[ name ][ j ];

  					const buffer = new oldMorphAttribute.array.constructor( morphAttrsArrays[ name ][ j ] );
  					const morphAttribute = new THREE.BufferAttribute( buffer, oldMorphAttribute.itemSize, oldMorphAttribute.normalized );
  					result.morphAttributes[ name ][ j ] = morphAttribute;

  				}

  			}

  		}

  		// indices

  		result.setIndex( newIndices );

  		return result;

  	}

  	/**
  	 * @param {BufferGeometry} geometry
  	 * @param {number} drawMode
  	 * @return {BufferGeometry>}
  	 */
  	static toTrianglesDrawMode( geometry, drawMode ) {

  		if ( drawMode === THREE.TrianglesDrawMode ) {

  			console.warn( 'THREE.BufferGeometryUtils.toTrianglesDrawMode(): Geometry already defined as triangles.' );
  			return geometry;

  		}

  		if ( drawMode === THREE.TriangleFanDrawMode || drawMode === THREE.TriangleStripDrawMode ) {

  			let index = geometry.getIndex();

  			// generate index if not present

  			if ( index === null ) {

  				const indices = [];

  				const position = geometry.getAttribute( 'position' );

  				if ( position !== undefined ) {

  					for ( let i = 0; i < position.count; i ++ ) {

  						indices.push( i );

  					}

  					geometry.setIndex( indices );
  					index = geometry.getIndex();

  				} else {

  					console.error( 'THREE.BufferGeometryUtils.toTrianglesDrawMode(): Undefined position attribute. Processing not possible.' );
  					return geometry;

  				}

  			}

  			//

  			const numberOfTriangles = index.count - 2;
  			const newIndices = [];

  			if ( drawMode === THREE.TriangleFanDrawMode ) {

  				// gl.TRIANGLE_FAN

  				for ( let i = 1; i <= numberOfTriangles; i ++ ) {

  					newIndices.push( index.getX( 0 ) );
  					newIndices.push( index.getX( i ) );
  					newIndices.push( index.getX( i + 1 ) );

  				}

  			} else {

  				// gl.TRIANGLE_STRIP

  				for ( let i = 0; i < numberOfTriangles; i ++ ) {

  					if ( i % 2 === 0 ) {

  						newIndices.push( index.getX( i ) );
  						newIndices.push( index.getX( i + 1 ) );
  						newIndices.push( index.getX( i + 2 ) );

  					} else {

  						newIndices.push( index.getX( i + 2 ) );
  						newIndices.push( index.getX( i + 1 ) );
  						newIndices.push( index.getX( i ) );

  					}

  				}

  			}

  			if ( ( newIndices.length / 3 ) !== numberOfTriangles ) {

  				console.error( 'THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unable to generate correct amount of triangles.' );

  			}

  			// build final geometry

  			const newGeometry = geometry.clone();
  			newGeometry.setIndex( newIndices );
  			newGeometry.clearGroups();

  			return newGeometry;

  		} else {

  			console.error( 'THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unknown draw mode:', drawMode );
  			return geometry;

  		}

  	}

  	/**
  	 * Calculates the morphed attributes of a morphed/skinned BufferGeometry.
  	 * Helpful for Raytracing or Decals.
  	 * @param {Mesh | Line | Points} object An instance of Mesh, Line or Points.
  	 * @return {Object} An Object with original position/normal attributes and morphed ones.
  	 */
  	static computeMorphedAttributes( object ) {

  		if ( object.geometry.isBufferGeometry !== true ) {

  			console.error( 'THREE.BufferGeometryUtils: Geometry is not of type BufferGeometry.' );
  			return null;

  		}

  		const _vA = new THREE.Vector3();
  		const _vB = new THREE.Vector3();
  		const _vC = new THREE.Vector3();

  		const _tempA = new THREE.Vector3();
  		const _tempB = new THREE.Vector3();
  		const _tempC = new THREE.Vector3();

  		const _morphA = new THREE.Vector3();
  		const _morphB = new THREE.Vector3();
  		const _morphC = new THREE.Vector3();

  		function _calculateMorphedAttributeData(
  			object,
  			material,
  			attribute,
  			morphAttribute,
  			morphTargetsRelative,
  			a,
  			b,
  			c,
  			modifiedAttributeArray
  		) {

  			_vA.fromBufferAttribute( attribute, a );
  			_vB.fromBufferAttribute( attribute, b );
  			_vC.fromBufferAttribute( attribute, c );

  			const morphInfluences = object.morphTargetInfluences;

  			if ( material.morphTargets && morphAttribute && morphInfluences ) {

  				_morphA.set( 0, 0, 0 );
  				_morphB.set( 0, 0, 0 );
  				_morphC.set( 0, 0, 0 );

  				for ( let i = 0, il = morphAttribute.length; i < il; i ++ ) {

  					const influence = morphInfluences[ i ];
  					const morph = morphAttribute[ i ];

  					if ( influence === 0 ) continue;

  					_tempA.fromBufferAttribute( morph, a );
  					_tempB.fromBufferAttribute( morph, b );
  					_tempC.fromBufferAttribute( morph, c );

  					if ( morphTargetsRelative ) {

  						_morphA.addScaledVector( _tempA, influence );
  						_morphB.addScaledVector( _tempB, influence );
  						_morphC.addScaledVector( _tempC, influence );

  					} else {

  						_morphA.addScaledVector( _tempA.sub( _vA ), influence );
  						_morphB.addScaledVector( _tempB.sub( _vB ), influence );
  						_morphC.addScaledVector( _tempC.sub( _vC ), influence );

  					}

  				}

  				_vA.add( _morphA );
  				_vB.add( _morphB );
  				_vC.add( _morphC );

  			}

  			if ( object.isSkinnedMesh ) {

  				object.boneTransform( a, _vA );
  				object.boneTransform( b, _vB );
  				object.boneTransform( c, _vC );

  			}

  			modifiedAttributeArray[ a * 3 + 0 ] = _vA.x;
  			modifiedAttributeArray[ a * 3 + 1 ] = _vA.y;
  			modifiedAttributeArray[ a * 3 + 2 ] = _vA.z;
  			modifiedAttributeArray[ b * 3 + 0 ] = _vB.x;
  			modifiedAttributeArray[ b * 3 + 1 ] = _vB.y;
  			modifiedAttributeArray[ b * 3 + 2 ] = _vB.z;
  			modifiedAttributeArray[ c * 3 + 0 ] = _vC.x;
  			modifiedAttributeArray[ c * 3 + 1 ] = _vC.y;
  			modifiedAttributeArray[ c * 3 + 2 ] = _vC.z;

  		}

  		const geometry = object.geometry;
  		const material = object.material;

  		let a, b, c;
  		const index = geometry.index;
  		const positionAttribute = geometry.attributes.position;
  		const morphPosition = geometry.morphAttributes.position;
  		const morphTargetsRelative = geometry.morphTargetsRelative;
  		const normalAttribute = geometry.attributes.normal;
  		const morphNormal = geometry.morphAttributes.position;

  		const groups = geometry.groups;
  		const drawRange = geometry.drawRange;
  		let i, j, il, jl;
  		let group, groupMaterial;
  		let start, end;

  		const modifiedPosition = new Float32Array( positionAttribute.count * positionAttribute.itemSize );
  		const modifiedNormal = new Float32Array( normalAttribute.count * normalAttribute.itemSize );

  		if ( index !== null ) {

  			// indexed buffer geometry

  			if ( Array.isArray( material ) ) {

  				for ( i = 0, il = groups.length; i < il; i ++ ) {

  					group = groups[ i ];
  					groupMaterial = material[ group.materialIndex ];

  					start = Math.max( group.start, drawRange.start );
  					end = Math.min( ( group.start + group.count ), ( drawRange.start + drawRange.count ) );

  					for ( j = start, jl = end; j < jl; j += 3 ) {

  						a = index.getX( j );
  						b = index.getX( j + 1 );
  						c = index.getX( j + 2 );

  						_calculateMorphedAttributeData(
  							object,
  							groupMaterial,
  							positionAttribute,
  							morphPosition,
  							morphTargetsRelative,
  							a, b, c,
  							modifiedPosition
  						);

  						_calculateMorphedAttributeData(
  							object,
  							groupMaterial,
  							normalAttribute,
  							morphNormal,
  							morphTargetsRelative,
  							a, b, c,
  							modifiedNormal
  						);

  					}

  				}

  			} else {

  				start = Math.max( 0, drawRange.start );
  				end = Math.min( index.count, ( drawRange.start + drawRange.count ) );

  				for ( i = start, il = end; i < il; i += 3 ) {

  					a = index.getX( i );
  					b = index.getX( i + 1 );
  					c = index.getX( i + 2 );

  					_calculateMorphedAttributeData(
  						object,
  						material,
  						positionAttribute,
  						morphPosition,
  						morphTargetsRelative,
  						a, b, c,
  						modifiedPosition
  					);

  					_calculateMorphedAttributeData(
  						object,
  						material,
  						normalAttribute,
  						morphNormal,
  						morphTargetsRelative,
  						a, b, c,
  						modifiedNormal
  					);

  				}

  			}

  		} else if ( positionAttribute !== undefined ) {

  			// non-indexed buffer geometry

  			if ( Array.isArray( material ) ) {

  				for ( i = 0, il = groups.length; i < il; i ++ ) {

  					group = groups[ i ];
  					groupMaterial = material[ group.materialIndex ];

  					start = Math.max( group.start, drawRange.start );
  					end = Math.min( ( group.start + group.count ), ( drawRange.start + drawRange.count ) );

  					for ( j = start, jl = end; j < jl; j += 3 ) {

  						a = j;
  						b = j + 1;
  						c = j + 2;

  						_calculateMorphedAttributeData(
  							object,
  							groupMaterial,
  							positionAttribute,
  							morphPosition,
  							morphTargetsRelative,
  							a, b, c,
  							modifiedPosition
  						);

  						_calculateMorphedAttributeData(
  							object,
  							groupMaterial,
  							normalAttribute,
  							morphNormal,
  							morphTargetsRelative,
  							a, b, c,
  							modifiedNormal
  						);

  					}

  				}

  			} else {

  				start = Math.max( 0, drawRange.start );
  				end = Math.min( positionAttribute.count, ( drawRange.start + drawRange.count ) );

  				for ( i = start, il = end; i < il; i += 3 ) {

  					a = i;
  					b = i + 1;
  					c = i + 2;

  					_calculateMorphedAttributeData(
  						object,
  						material,
  						positionAttribute,
  						morphPosition,
  						morphTargetsRelative,
  						a, b, c,
  						modifiedPosition
  					);

  					_calculateMorphedAttributeData(
  						object,
  						material,
  						normalAttribute,
  						morphNormal,
  						morphTargetsRelative,
  						a, b, c,
  						modifiedNormal
  					);

  				}

  			}

  		}

  		const morphedPositionAttribute = new THREE.Float32BufferAttribute( modifiedPosition, 3 );
  		const morphedNormalAttribute = new THREE.Float32BufferAttribute( modifiedNormal, 3 );

  		return {

  			positionAttribute: positionAttribute,
  			normalAttribute: normalAttribute,
  			morphedPositionAttribute: morphedPositionAttribute,
  			morphedNormalAttribute: morphedNormalAttribute

  		};

  	}

  }

  var planetoidPositions = [{
    "targetName": "sun",
    "name": "Sun",
    "coords": [[25210928.558993563, -144927919.5838006, 616.4165719002485]]
  }, {
    "targetName": "mercury",
    "name": "Mercury",
    "coords": [[4158307.486552868, -211334557.7063349, -3491829.530005828]]
  }, {
    "targetName": "venus",
    "name": "Venus",
    "coords": [[-82294621.71299145, -148294440.250323, 6159836.205810949]]
  }, {
    "targetName": "earth",
    "name": "Earth",
    "coords": [[0, 0, 0]]
  }, {
    "targetName": "moon",
    "name": "Moon",
    "coords": [[-317650.2412950324, -241883.1762389348, 36555.82307692753]]
  }, {
    "targetName": "mars",
    "name": "Mars",
    "coords": [[233205983.5426107, -148070929.2977431, -5178164.826916882]]
  }, {
    "targetName": "phobos",
    "name": "Phobos",
    "coords": [[233211101.3822698, -148063549.26654398, -5180330.081629686]]
  }, {
    "targetName": "deimos",
    "name": "Deimos",
    "coords": [[233186774.50707632, -148062438.7574959, -5167707.330730483]]
  }, {
    "targetName": "jupiter",
    "name": "Jupiter",
    "coords": [[624120093.099128, 294194667.0766834, -15231894.21368285]]
  }, {
    "targetName": "io",
    "name": "Io",
    "coords": [[624164885.3477856, 293774388.4102297, -15246145.23852706]]
  }, {
    "targetName": "europa",
    "name": "Europa",
    "coords": [[623488011.4500723, 294412338.4072513, -15234937.06745064]]
  }, {
    "targetName": "ganymede",
    "name": "Ganymede",
    "coords": [[623084362.3434044, 293923020.97313803, -15253539.800429901]]
  }, {
    "targetName": "callisto",
    "name": "Callisto",
    "coords": [[624786088.0070852, 295950532.9487813, -15165777.127540601]]
  }, {
    "targetName": "saturn",
    "name": "Saturn",
    "coords": [[983917265.7323134, 837637290.875011, -55220039.89568457]]
  }, {
    "targetName": "mimas",
    "name": "Mimas",
    "coords": [[983804295.554162, 837775268.2467614, -55281673.06765947]]
  }, {
    "targetName": "enceladus",
    "name": "Enceladus",
    "coords": [[983679565.3746865, 837641881.7164687, -55199377.11102869]]
  }, {
    "targetName": "tethys",
    "name": "Tethys",
    "coords": [[983700604.5912714, 837469073.320275, -55112213.72623366]]
  }, {
    "targetName": "dione",
    "name": "Dione",
    "coords": [[983738562.4193845, 837350098.2216039, -55052252.21436214]]
  }, {
    "targetName": "rhea",
    "name": "Rhea",
    "coords": [[983496804.0029027, 837934991.242741, -55333843.04381296]]
  }, {
    "targetName": "titan",
    "name": "Titan",
    "coords": [[983140311.5462098, 838539854.7562562, -55609705.82393074]]
  }, {
    "targetName": "hyperion",
    "name": "Hyperion",
    "coords": [[984302160.0114294, 838839267.3741561, -55865294.29589018]]
  }, {
    "targetName": "iapetus",
    "name": "Iapetus",
    "coords": [[980982613.8435904, 835728072.4766542, -54179243.405296244]]
  }, {
    "targetName": "phoebe",
    "name": "Phoebe",
    "coords": [[972213960.2836474, 834830558.7102093, -53885687.66340354]]
  }, {
    "targetName": "uranus",
    "name": "Uranus",
    "coords": [[2183985628.2833414, -2199753070.769538, -35622995.26408243]]
  }, {
    "targetName": "miranda",
    "name": "Miranda",
    "coords": [[2184101946.303993, -2199757607.225512, -35471698.959801205]]
  }, {
    "targetName": "ariel",
    "name": "Ariel",
    "coords": [[2184223622.94344, -2199819140.7233667, -35723726.65271461]]
  }, {
    "targetName": "umbriel",
    "name": "Umbriel",
    "coords": [[2184075460.2902603, -2199831716.226388, -36041929.76960051]]
  }, {
    "targetName": "titania",
    "name": "Titania",
    "coords": [[2183464821.607966, -2199675659.639669, -35874478.44673729]]
  }, {
    "targetName": "oberon",
    "name": "Oberon",
    "coords": [[2184108809.161395, -2199774688.69416, -35657554.89030111]]
  }, {
    "targetName": "neptune",
    "name": "Neptune",
    "coords": [[2540064210.9294276, -3883775334.299313, 19040215.18757224]]
  }, {
    "targetName": "triton",
    "name": "Triton",
    "coords": [[2539764375.3450627, -3883795716.454041, 19228100.00823021]]
  }, {
    "targetName": "nereid",
    "name": "Nereid",
    "coords": [[2540979035.75896, -3874452071.9913187, 19721327.09596634]]
  }, {
    "targetName": "pluto",
    "name": "Pluto",
    "coords": [[-1452347411.189161, -4327388362.774305, 875270025.2620398]]
  }, {
    "targetName": "charon",
    "name": "Charon",
    "coords": [[-1452347453.345824, -4327398762.531079, 875253416.4866599]]
  }, {
    "targetName": "nix",
    "name": "Nix",
    "coords": [[-1452354210.566489, -4327369571.663404, 875312072.117779]]
  }, {
    "targetName": "hydra",
    "name": "Hydra",
    "coords": [[-1452312605.147671, -4327384745.736898, 875214226.638797]]
  }, {
    "targetName": "kerberos",
    "name": "Kerberos",
    "coords": [[-1452336967.884832, -4327411470.959048, 875215628.484605]]
  }, {
    "targetName": "styx",
    "name": "Styx",
    "coords": [[-1452316434.820314, -4327363528.824732, 875256065.2688253]]
  }, {
    "targetName": "ceres",
    "name": "Ceres",
    "coords": [[-330462529.1598387, -25133356.299232878, 69240119.8850444]]
  }, {
    "targetName": "vesta",
    "name": "Vesta",
    "coords": [[-178000989.05262348, -394670970.71612394, 32220090.03596649]]
  }, {
    "targetName": "haumea",
    "name": "Haumea",
    "coords": [[-6854796958.419188, -910784984.6918347, 3348814291.8124943]]
  }];

  var targetName = "mercury";
  var name = "Mercury";
  var startDate = "2000-01-01";
  var stopDate = "2001-01-01";
  var stepSize = 1;
  var coords = [
  	[
  		-0.14072807971083443,
  		-0.4439009580270337,
  		-0.023345559199712058
  	],
  	[
  		-0.1193643156359173,
  		-0.4503482885887847,
  		-0.025833127223537693
  	],
  	[
  		-0.09765290341661274,
  		-0.45548403543410604,
  		-0.028245460719520603
  	],
  	[
  		-0.07565723261917279,
  		-0.4592938835899954,
  		-0.030575572047160843
  	],
  	[
  		-0.053441062891903174,
  		-0.46176498998882337,
  		-0.03281655983852584
  	],
  	[
  		-0.031068684713474508,
  		-0.4628859657251651,
  		-0.03496159279443063
  	],
  	[
  		-0.008605084943394861,
  		-0.4626468815190956,
  		-0.037003894935592634
  	],
  	[
  		0.01388388309897918,
  		-0.4610392970450954,
  		-0.038936732387722314
  	],
  	[
  		0.03633132533437339,
  		-0.45805631514536355,
  		-0.04075340181199583
  	],
  	[
  		0.05866912879797229,
  		-0.4536926623247192,
  		-0.04244722063134927
  	],
  	[
  		0.08082778023294566,
  		-0.4479447973242959,
  		-0.04401151924940231
  	],
  	[
  		0.1027361821681176,
  		-0.4408110499951688,
  		-0.045439635513673624
  	],
  	[
  		0.1243214675493378,
  		-0.4322917931420156,
  		-0.04672491173937786
  	],
  	[
  		0.14550881439991561,
  		-0.42238965048031124,
  		-0.04786069468601514
  	],
  	[
  		0.1662212625137729,
  		-0.4111097443450022,
  		-0.04884033896784314
  	],
  	[
  		0.1863795348619101,
  		-0.39845998729686083,
  		-0.0496572144829765
  	],
  	[
  		0.2059018672499323,
  		-0.3844514222818043,
  		-0.05030471856611762
  	],
  	[
  		0.22470385083924863,
  		-0.36909861648755043,
  		-0.05077629370853533
  	],
  	[
  		0.2426982934806405,
  		-0.35242011447923693,
  		-0.05106545184725942
  	],
  	[
  		0.2597951074554826,
  		-0.33443895653443023,
  		-0.05116580640426836
  	],
  	[
  		0.27590123323072063,
  		-0.31518326827170945,
  		-0.051071113455207054
  	],
  	[
  		0.2909206112643705,
  		-0.2946869275830803,
  		-0.050775323623413214
  	],
  	[
  		0.30475421680135106,
  		-0.2729903144124693,
  		-0.05027264652325794
  	],
  	[
  		0.31730017601624305,
  		-0.2501411479017093,
  		-0.04955762980702399
  	],
  	[
  		0.3284539858073019,
  		-0.22619541363129192,
  		-0.04862525508532647
  	],
  	[
  		0.33810886399837203,
  		-0.20121838083468224,
  		-0.047471053167046015
  	],
  	[
  		0.3461562615641496,
  		-0.17528570521448972,
  		-0.04609124116348706
  	],
  	[
  		0.3524865735506879,
  		-0.14848460692214902,
  		-0.044482883969996785
  	],
  	[
  		0.35699009024609185,
  		-0.12091510491199581,
  		-0.04264408240429735
  	],
  	[
  		0.35955823426890315,
  		-0.09269127775739407,
  		-0.040574189749597284
  	],
  	[
  		0.36008513168765877,
  		-0.06394250667843906,
  		-0.03827405750376789
  	],
  	[
  		0.3584695647979487,
  		-0.03481463869510372,
  		-0.03574630963415749
  	],
  	[
  		0.35461734907585235,
  		-0.005470986540246732,
  		-0.03299564243050367
  	],
  	[
  		0.3484441649978694,
  		0.02390694211578603,
  		-0.030029143995374392
  	],
  	[
  		0.3398788544693475,
  		0.05311911891492118,
  		-0.026856623418994433
  	],
  	[
  		0.3288671591373985,
  		0.08194722909945287,
  		-0.023490934762975143
  	],
  	[
  		0.3153758320323926,
  		0.1101556402258193,
  		-0.01994827531476559
  	],
  	[
  		0.2993969943413786,
  		0.1374932854664364,
  		-0.01624843162872919
  	],
  	[
  		0.280952537759348,
  		0.1636966278978463,
  		-0.0124149414445679
  	],
  	[
  		0.26009829564339243,
  		0.1884938309670371,
  		-0.008475135852225686
  	],
  	[
  		0.23692763364948669,
  		0.21161018523520458,
  		-0.004460025548129585
  	],
  	[
  		0.2115740578902639,
  		0.23277473026987572,
  		-0.00040399928218540064
  	],
  	[
  		0.1842124241971181,
  		0.2517278682596713,
  		0.003655687107567767
  	],
  	[
  		0.1550583733872694,
  		0.2682296074142589,
  		0.007679635934551898
  	],
  	[
  		0.12436572578396961,
  		0.28206792343378034,
  		0.011627229859248201
  	],
  	[
  		0.09242174239577326,
  		0.2930666180838286,
  		0.015457708812895262
  	],
  	[
  		0.059540382204920965,
  		0.301092016630159,
  		0.01913133599539302
  	],
  	[
  		0.026053920721530732,
  		0.3060579019189964,
  		0.02261057023632318
  	],
  	[
  		-0.0076964996837386715,
  		0.30792823458921553,
  		0.02586115555174765
  	],
  	[
  		-0.04137068441344129,
  		0.3067174356376882,
  		0.028853045067665808
  	],
  	[
  		-0.07463883071871842,
  		0.30248826929968053,
  		0.03156109490077753
  	],
  	[
  		-0.1071899386525417,
  		0.2953476121826404,
  		0.03396549054122334
  	],
  	[
  		-0.1387386851880897,
  		0.2854405850834812,
  		0.036051898423508914
  	],
  	[
  		-0.16903046603796681,
  		0.27294362975457,
  		0.03781136313169255
  	],
  	[
  		-0.19784452535509872,
  		0.25805712850978474,
  		0.03923999175450772
  	],
  	[
  		-0.2249952805093527,
  		0.2409981037588827,
  		0.04033847910415288
  	],
  	[
  		-0.25033208484230535,
  		0.2219934230085294,
  		0.04111153085599322
  	],
  	[
  		-0.27373774822514363,
  		0.2012738012744929,
  		0.04156723781345854
  	],
  	[
  		-0.2951261583957515,
  		0.17906876180920972,
  		0.04171644592262731
  	],
  	[
  		-0.31443932796402174,
  		0.1556026042393093,
  		0.04157215586708755
  	],
  	[
  		-0.3316441476770851,
  		0.1310913447936722,
  		0.04114897511200338
  	],
  	[
  		-0.3467290698408974,
  		0.10574053748727921,
  		0.04046263550294416
  	],
  	[
  		-0.359700887314424,
  		0.07974385457994479,
  		0.03952958166208484
  	],
  	[
  		-0.3705817201250958,
  		0.053282293834713244,
  		0.03836662964424478
  	],
  	[
  		-0.3794062770976239,
  		0.026523883117257792,
  		0.0369906914628538
  	],
  	[
  		-0.38621942507522433,
  		-0.00037623559229197566,
  		0.03541855884252298
  	],
  	[
  		-0.39107407289315554,
  		-0.02727544483422755,
  		0.03366673851819098
  	],
  	[
  		-0.3940293599470981,
  		-0.05404309777349293,
  		0.0317513312193994
  	],
  	[
  		-0.3951491283779178,
  		-0.08055983990509305,
  		0.029687946848526534
  	],
  	[
  		-0.3945006519811316,
  		-0.1067168594313846,
  		0.027491649049404814
  	],
  	[
  		-0.39215359254621535,
  		-0.13241510644401672,
  		0.025176923199066212
  	],
  	[
  		-0.38817915429896677,
  		-0.15756451033592322,
  		0.022757662727105478
  	],
  	[
  		-0.3826494085837284,
  		-0.18208321627060792,
  		0.02024716950386257
  	],
  	[
  		-0.3756367632398876,
  		-0.2058968548080764,
  		0.01765816480093969
  	],
  	[
  		-0.3672135538496171,
  		-0.2289378536456652,
  		0.015002807997430161
  	],
  	[
  		-0.3574517368616471,
  		-0.2511447965937391,
  		0.01229272077833241
  	],
  	[
  		-0.34642266734007543,
  		-0.27246183211041164,
  		0.009539015051889638
  	],
  	[
  		-0.3341969466380577,
  		-0.2928381317401449,
  		0.006752323208413464
  	],
  	[
  		-0.3208443275981754,
  		-0.31222739744960815,
  		0.003942829664837146
  	],
  	[
  		-0.3064336669146549,
  		-0.33058741597736074,
  		0.0011203028975068441
  	],
  	[
  		-0.2910329160601933,
  		-0.3478796577902442,
  		-0.001705872629261854
  	],
  	[
  		-0.2747091436978218,
  		-0.36406891797416563,
  		-0.004526665070369227
  	],
  	[
  		-0.25752858378876,
  		-0.3791229963077692,
  		-0.007333364649443223
  	],
  	[
  		-0.23955670469599882,
  		-0.3930124138196745,
  		-0.0101175541615915
  	],
  	[
  		-0.2208582954959598,
  		-0.4057101632729812,
  		-0.0128710806682226
  	],
  	[
  		-0.2014975664711261,
  		-0.41719149122508115,
  		-0.01558602846965321
  	],
  	[
  		-0.1815382613868866,
  		-0.42743370955539856,
  		-0.01825469340333773
  	],
  	[
  		-0.1610437796752242,
  		-0.43641603462393824,
  		-0.020869558489963018
  	],
  	[
  		-0.14007730707275431,
  		-0.44411945250976115,
  		-0.023423270934035872
  	],
  	[
  		-0.1187019536047931,
  		-0.45052660907473996,
  		-0.02590862047819899
  	],
  	[
  		-0.09698089808179097,
  		-0.4556217239009593,
  		-0.02831851911005509
  	],
  	[
  		-0.07497753848838808,
  		-0.4593905274587491,
  		-0.03064598212585699
  	],
  	[
  		-0.05275564780505067,
  		-0.4618202211769578,
  		-0.0328841105664601
  	],
  	[
  		-0.03037953491201983,
  		-0.46289946040916724,
  		-0.0350260750571758
  	],
  	[
  		-0.0079142102873585,
  		-0.4626183606214296,
  		-0.037065101104574574
  	],
  	[
  		0.014574443774740261,
  		-0.4609685274715829,
  		-0.03899445593011169
  	],
  	[
  		0.0370194987346718,
  		-0.4579431118103826,
  		-0.040807436953124734
  	],
  	[
  		0.05935280156624313,
  		-0.4535368910137229,
  		-0.04249736207495682
  	],
  	[
  		0.08150479325391116,
  		-0.4477463784559741,
  		-0.044057561962577506
  	],
  	[
  		0.10340432480142131,
  		-0.44056996335917264,
  		-0.04548137458520918
  	],
  	[
  		0.1249784718322533,
  		-0.43200808370257493,
  		-0.04676214232242235
  	],
  	[
  		0.1461523492715295,
  		-0.4220634353512283,
  		-0.04789321203846186
  	],
  	[
  		0.166848928131522,
  		-0.4107412210572565,
  		-0.048867938606879734
  	],
  	[
  		0.18698885710491053,
  		-0.39804944349610943,
  		-0.0496796924736931
  	],
  	[
  		0.20649029253326381,
  		-0.3839992470089059,
  		-0.05032187196809919
  	],
  	[
  		0.2252687414004976,
  		-0.36860531321008083,
  		-0.05078792120898368
  	],
  	[
  		0.2432369233460396,
  		-0.35188631605461396,
  		-0.05107135461445624
  	],
  	[
  		0.2603046593495159,
  		-0.333865442293996,
  		-0.05116578920109461
  	],
  	[
  		0.276378796761838,
  		-0.314570983417498,
  		-0.05106498605894531
  	],
  	[
  		0.291363182802205,
  		-0.2940370050816607,
  		-0.05076290260506111
  	],
  	[
  		0.3051587015590867,
  		-0.27230409954864937,
  		-0.05025375744683985
  	],
  	[
  		0.3176633929665648,
  		-0.24942022561300492,
  		-0.04953210991650818
  	],
  	[
  		0.3287726761916657,
  		-0.22544163867410802,
  		-0.048592956553098574
  	],
  	[
  		0.3383797043354289,
  		-0.2004339107253253,
  		-0.04743184698249513
  	],
  	[
  		0.3463758822195002,
  		-0.174473035730483,
  		-0.04604502174173562
  	],
  	[
  		0.3526515840880136,
  		-0.1476466097279207,
  		-0.04442957455720631
  	],
  	[
  		0.35709711292437973,
  		-0.12005506657261672,
  		-0.04258364134471009
  	],
  	[
  		0.35960394715903865,
  		-0.09181293900955348,
  		-0.04050661765718701
  	],
  	[
  		0.3600663229207046,
  		-0.06305010032710781,
  		-0.03819940534400566
  	],
  	[
  		0.35838319938103014,
  		-0.0339129238925563,
  		-0.03566468766433849
  	],
  	[
  		0.3544606494603583,
  		-0.004565276490608281,
  		-0.032907229865637565
  	],
  	[
  		0.34821470608749433,
  		0.02481076276608999,
  		-0.0299341991569368
  	],
  	[
  		0.3395746729354308,
  		0.05401459152596229,
  		-0.02675549398426358
  	],
  	[
  		0.32848687569627044,
  		0.08282733852754635,
  		-0.023384067565979837
  	],
  	[
  		0.3149187836932467,
  		0.1110128579589686,
  		-0.019836224965783952
  	],
  	[
  		0.298863371573097,
  		0.13831964392430812,
  		-0.016131867037220332
  	],
  	[
  		0.28034351916911987,
  		0.16448383059284621,
  		-0.01229464918147885
  	],
  	[
  		0.25941617036218173,
  		0.18923340142952091,
  		-0.0083520192142136
  	],
  	[
  		0.2361758995856974,
  		0.2122936546915673,
  		-0.004335098237839249
  	],
  	[
  		0.21075748288007512,
  		0.2333938600582755,
  		-0.0002783728420181283
  	],
  	[
  		0.183337057431531,
  		0.2522748981795057,
  		0.003780822547136612
  	],
  	[
  		0.1541314968114458,
  		0.2686975162618217,
  		0.007803037414521216
  	],
  	[
  		0.1233957396254777,
  		0.2824506837907234,
  		0.01174763293038737
  	],
  	[
  		0.09141798529285826,
  		0.2933594250267421,
  		0.015573862748040299
  	],
  	[
  		0.05851289373860404,
  		0.30129147028809344,
  		0.01924204051895951
  	],
  	[
  		0.02501316123565567,
  		0.30616212711916874,
  		0.022714711034967458
  	],
  	[
  		-0.008739951671455597,
  		0.30793692690785085,
  		0.0259577358291031
  	],
  	[
  		-0.04240643429357128,
  		0.30663183102197705,
  		0.02894121080749785
  	],
  	[
  		-0.07565694716780877,
  		0.3023110425949013,
  		0.031640152236175736
  	],
  	[
  		-0.1081811919029515,
  		0.295082716878831,
  		0.034034914546105736
  	],
  	[
  		-0.1396947317285949,
  		0.2850930512481824,
  		0.0361113335683391
  	],
  	[
  		-0.1699439740856117,
  		0.27251933893681024,
  		0.03786061641839246
  	],
  	[
  		-0.1987092418384137,
  		0.2575625835511442,
  		0.039279020063738804
  	],
  	[
  		-0.22580604537012472,
  		0.24044020859531534,
  		0.04036737252037255
  	],
  	[
  		-0.25108480174012987,
  		0.2213792835825558,
  		0.04113049371274476
  	],
  	[
  		-0.27442932220599453,
  		0.2006105544570576,
  		0.04157656899222361
  	],
  	[
  		-0.295754411066999,
  		0.17836343540237262,
  		0.04171651962415074
  	],
  	[
  		-0.3150028996568868,
  		0.1548620080734121,
  		0.04156340372690263
  	],
  	[
  		-0.33214239443606286,
  		0.1303219907762361,
  		0.04113187020507228
  	],
  	[
  		-0.3471619612423751,
  		0.10494858515732391,
  		0.04043767850719908
  	],
  	[
  		-0.3600689093537177,
  		0.07893507812103827,
  		0.03949728923978325
  	],
  	[
  		-0.3708857858802859,
  		0.0524620664171659,
  		0.0383275249527499
  	],
  	[
  		-0.3796476466474737,
  		0.025697174696209562,
  		0.036945296614358816
  	],
  	[
  		-0.38639963522256315,
  		-0.001204850448552887,
  		0.03536738908376538
  	],
  	[
  		-0.3911948765935254,
  		-0.0281017719827216,
  		0.0336102978845182
  	],
  	[
  		-0.39409267491773864,
  		-0.05486330376337947,
  		0.03169010942223028
  	],
  	[
  		-0.3951569941133024,
  		-0.08137042933725376,
  		0.029622417172958243
  	],
  	[
  		-0.394455194281302,
  		-0.1075146508391282,
  		0.02742226706325837
  	],
  	[
  		-0.3920569946335968,
  		-0.13319720775668692,
  		0.025104126101753683
  	],
  	[
  		-0.38803363362703575,
  		-0.15832829468899262,
  		0.02268186919356725
  	],
  	[
  		-0.38245719850359045,
  		-0.1828262986898827,
  		0.02016877990382861
  	],
  	[
  		-0.37540009877184394,
  		-0.20661707011347402,
  		0.01757756169607691
  	],
  	[
  		-0.36693466089483884,
  		-0.22963323578263442,
  		0.014920356838239519
  	],
  	[
  		-0.35713282427676074,
  		-0.2518135594992306,
  		0.01220877073897803
  	],
  	[
  		-0.34606592138037284,
  		-0.2731023521477667,
  		0.009453899954685917
  	],
  	[
  		-0.3338045273507431,
  		-0.2934489316869227,
  		0.006666362500767369
  	],
  	[
  		-0.3204183668144969,
  		-0.3128071319889075,
  		0.0038563294203769944
  	],
  	[
  		-0.3059762675487622,
  		-0.331134858622387,
  		0.001033556820252251
  	],
  	[
  		-0.290546152473448,
  		-0.3483936891603742,
  		-0.001792582213217017
  	],
  	[
  		-0.2741950629307167,
  		-0.364548515336026,
  		-0.004613066244808691
  	],
  	[
  		-0.2569892074993359,
  		-0.3795672242948993,
  		-0.007419194971393491
  	],
  	[
  		-0.23899403167450642,
  		-0.39342041624774765,
  		-0.010202559761320229
  	],
  	[
  		-0.22027430465126574,
  		-0.4060811559732372,
  		-0.01295501538919209
  	],
  	[
  		-0.2008942202057357,
  		-0.4175247558257966,
  		-0.01566865305037295
  	],
  	[
  		-0.18091750929509381,
  		-0.42772858814936543,
  		-0.018335774702110882
  	],
  	[
  		-0.1604075625133452,
  		-0.4366719252686546,
  		-0.02094886875290793
  	],
  	[
  		-0.1394275609621422,
  		-0.4443358055161306,
  		-0.0235005871064332
  	],
  	[
  		-0.11804061443774261,
  		-0.4507029240493906,
  		-0.02598372355911092
  	],
  	[
  		-0.09630990610783638,
  		-0.4557575475167638,
  		-0.02839119355025909
  	],
  	[
  		-0.07429884306412536,
  		-0.45948545193775003,
  		-0.03071601526940147
  	],
  	[
  		-0.052071212294623755,
  		-0.46187388347969816,
  		-0.03295129213657771
  	],
  	[
  		-0.02969134172793026,
  		-0.46291154213446833,
  		-0.035090196687868
  	],
  	[
  		-0.007224266062309468,
  		-0.4625885886310104,
  		-0.037125955919919344
  	],
  	[
  		0.015264102894688509,
  		-0.4608966752646749,
  		-0.039051838174248434
  	],
  	[
  		0.03770680168737327,
  		-0.45782900168476187,
  		-0.04086114167495551
  	],
  	[
  		0.060035636876670725,
  		-0.45338039706141864,
  		-0.04254718487289745
  	],
  	[
  		0.08218100346457578,
  		-0.44754743045442996,
  		-0.044103298796221865
  	],
  	[
  		0.10407170085941671,
  		-0.4403285516318383,
  		-0.04552282166257601
  	],
  	[
  		0.1256347474732805,
  		-0.43172426503683026,
  		-0.04679909607357902
  	],
  	[
  		0.1467951954555906,
  		-0.42173734007607583,
  		-0.04792546918881203
  	],
  	[
  		0.1674759476034216,
  		-0.4103730613982382,
  		-0.04889529636631588
  	],
  	[
  		0.1875975791761441,
  		-0.39763952334005065,
  		-0.04970194886120459
  	],
  	[
  		0.2070781682113458,
  		-0.3835479732258687,
  		-0.05033882629534474
  	],
  	[
  		0.2258331390285247,
  		-0.3681132086935016,
  		-0.050799374750831225
  	],
  	[
  		0.2437751249606845,
  		-0.3513540346518083,
  		-0.051077111499586776
  	],
  	[
  		0.2608138580212596,
  		-0.333293785806315,
  		-0.05116565756146483
  	],
  	[
  		0.2768560952487183,
  		-0.3139609208499902,
  		-0.051058779483152204
  	],
  	[
  		0.2918055939292937,
  		-0.29338969431280243,
  		-0.05075044194732879
  	],
  	[
  		0.3055631508317116,
  		-0.2716209115670835,
  		-0.050234873050210016
  	],
  	[
  		0.3180267240368156,
  		-0.24870277142435804,
  		-0.04950664431546332
  	],
  	[
  		0.32909165992480455,
  		-0.2246917989092576,
  		-0.048560767726637144
  	],
  	[
  		0.338651052363536,
  		-0.19965386787243541,
  		-0.047392812232663756
  	],
  	[
  		0.34659626601935833,
  		-0.173665308755191,
  		-0.045999042273430935
  	],
  	[
  		0.3528176607700547,
  		-0.1468140906259053,
  		-0.044376580830793315
  	],
  	[
  		0.3572055590547752,
  		-0.11920105810192641,
  		-0.0425235992611389
  	],
  	[
  		0.3596515020350514,
  		-0.09094119246244145,
  		-0.040439535612594765
  	],
  	[
  		0.3600498427473515,
  		-0.06216485171168822,
  		-0.038125342153360046
  	],
  	[
  		0.35829972370992946,
  		-0.03301892629982977,
  		-0.03558376129709812
  	],
  	[
  		0.35430748099154263,
  		-0.003667825732688429,
  		-0.03281962685622126
  	],
  	[
  		0.3479895044330231,
  		0.02570581291235971,
  		-0.029840184445380502
  	],
  	[
  		0.3392755621260533,
  		0.054900828883301965,
  		-0.026655420806417023
  	],
  	[
  		0.32811256401340216,
  		0.0836978119374027,
  		-0.02327838685086268
  	],
  	[
  		0.3144686927918524,
  		0.1118601219620134,
  		-0.01972549352002886
  	],
  	[
  		0.2983377698508575,
  		0.1391358339851697,
  		-0.01601675362214783
  	],
  	[
  		0.2797436520544682,
  		0.1652607733069567,
  		-0.012175937447860502
  	],
  	[
  		0.2587443778906557,
  		0.18996276235928042,
  		-0.008230606394683862
  	],
  	[
  		0.23543570970950922,
  		0.2129671236043802,
  		-0.004211988555171505
  	],
  	[
  		0.2099536679315233,
  		0.23400336942062552,
  		-0.00015466481771539718
  	],
  	[
  		0.18247564159790922,
  		0.2528128661074847,
  		0.003903955278974065
  	],
  	[
  		0.15321970483012032,
  		0.2691571003620834,
  		0.007924371577651855
  	],
  	[
  		0.12244188132946841,
  		0.2828260283384891,
  		0.011865926418994921
  	],
  	[
  		0.09043127682379208,
  		0.2936458817144147,
  		0.01568788909043525
  	],
  	[
  		0.05750322336521003,
  		0.3014857731657388,
  		0.01935062467949314
  	],
  	[
  		0.023990814530397322,
  		0.30626250569573504,
  		0.02281676388942659
  	],
  	[
  		-0.009764587397673214,
  		0.3079431473764279,
  		0.026052284666433
  	],
  	[
  		-0.04342316400665465,
  		0.3065451632288214,
  		0.02902742361705024
  	],
  	[
  		-0.07665603912408521,
  		0.3021341582723273,
  		0.03171735426267413
  	],
  	[
  		-0.1091536080046009,
  		0.2948195313542738,
  		0.03410259648997951
  	],
  	[
  		-0.1406323053928227,
  		0.28474852524273214,
  		0.03616915170389651
  	],
  	[
  		-0.17083953040740651,
  		0.27209925871450624,
  		0.03790838564364159
  	],
  	[
  		-0.1995566609991951,
  		0.2570733367597424,
  		0.03931670138706426
  	],
  	[
  		-0.22660027509698488,
  		0.23988857030920432,
  		0.04039505670340584
  	],
  	[
  		-0.2518218277282161,
  		0.2207722231857841,
  		0.04114838275750848
  	],
  	[
  		-0.27510610678531905,
  		0.19995506991311082,
  		0.04158495695183714
  	],
  	[
  		-0.296368810328427,
  		0.1776664177663259,
  		0.04171577390854103
  	],
  	[
  		-0.31555356819243013,
  		0.1541301361676732,
  		0.04155394773779131
  	],
  	[
  		-0.3326286852426467,
  		0.1295616538919443,
  		0.04111416781871487
  	],
  	[
  		-0.3475838265546071,
  		0.10416583040724942,
  		0.04041222065851552
  	],
  	[
  		-0.3604268064673102,
  		0.07813557850907973,
  		0.03946458265921662
  	],
  	[
  		-0.3711805905528746,
  		0.05165110562380455,
  		0.03828808296637665
  	],
  	[
  		-0.37988057548031884,
  		0.024879644836496788,
  		0.03689963183013899
  	],
  	[
  		-0.38657217753853335,
  		-0.002024441399845576,
  		0.03531600774107242
  	],
  	[
  		-0.3913087357030272,
  		-0.028919285890713093,
  		0.033553695628774055
  	],
  	[
  		-0.39414971825852574,
  		-0.0556749534314317,
  		0.03162876827154446
  	],
  	[
  		-0.39515921151307304,
  		-0.08217275679815535,
  		0.029556803461117092
  	],
  	[
  		-0.3944046634783731,
  		-0.10830450421307909,
  		0.02735283016730307
  	],
  	[
  		-0.39195585316277093,
  		-0.1339717176972085,
  		0.02503129778861598
  	],
  	[
  		-0.3878840562052071,
  		-0.159084851151084,
  		0.02260606344616241
  	],
  	[
  		-0.38226137911034813,
  		-0.1835625285279086,
  		0.02009039311108026
  	],
  	[
  		-0.3751602366984416,
  		-0.2073308158411915,
  		0.01749697311278158
  	],
  	[
  		-0.36665295011956933,
  		-0.2303225356957405,
  		0.014837929239187699
  	],
  	[
  		-0.3568114456090133,
  		-0.2524766292636136,
  		0.012124851207368
  	],
  	[
  		-0.3457070368952541,
  		-0.27373756788698433,
  		0.009368820757814087
  	],
  	[
  		-0.3334102767088326,
  		-0.2940548145541308,
  		0.006580442016559571
  	],
  	[
  		-0.31999086512613334,
  		-0.3133823341764516,
  		0.0037698730868751464
  	],
  	[
  		-0.3055176044990701,
  		-0.33167815074245666,
  		0.0009468580870258923
  	],
  	[
  		-0.2900583924734915,
  		-0.3489039489192972,
  		-0.001879240947305098
  	],
  	[
  		-0.2736802461023194,
  		-0.3650247174204338,
  		-0.00469941271872288
  	],
  	[
  		-0.25644935133697283,
  		-0.3800084313882085,
  		-0.007504966181750094
  	],
  	[
  		-0.23843113325797738,
  		-0.3938257710987336,
  		-0.01028750112005603
  	],
  	[
  		-0.21969034330831214,
  		-0.406449874443857,
  		-0.01303887992214108
  	],
  	[
  		-0.20029116054496532,
  		-0.4178561208521139,
  		-0.015751200638257662
  	],
  	[
  		-0.1802973045471072,
  		-0.42802194455692205,
  		-0.0184167713643342
  	],
  	[
  		-0.15977215813228163,
  		-0.4369266753916242,
  		-0.021028085973799963
  	],
  	[
  		-0.1387788984514312,
  		-0.4445514055778982,
  		-0.023577801203206954
  	],
  	[
  		-0.1173806353730319,
  		-0.45087888127075726,
  		-0.02605871509067857
  	],
  	[
  		-0.09564055633719319,
  		-0.4558934179267644,
  		-0.02846374676620052
  	],
  	[
  		-0.07362207707094884,
  		-0.4595808388711012,
  		-0.03078591759873284
  	],
  	[
  		-0.05138899771246727,
  		-0.4619284367542175,
  		-0.03301833371650154
  	],
  	[
  		-0.029005663998739963,
  		-0.4629249579114584,
  		-0.03515416993337971
  	],
  	[
  		-0.00653713323051219,
  		-0.4625606099716557,
  		-0.03718665513598796
  	],
  	[
  		0.01595065526029005,
  		-0.4608270934060089,
  		-0.03910905921328057
  	],
  	[
  		0.03839070545390663,
  		-0.4577176580698007,
  		-0.04091468164340821
  	],
  	[
  		0.06071478620333908,
  		-0.45322718616971436,
  		-0.04259684189224199
  	],
  	[
  		0.08285324957382972,
  		-0.4473523034915995,
  		-0.04414887182501624
  	],
  	[
  		0.1047348467501589,
  		-0.44009152114967587,
  		-0.04556411038820648
  	],
  	[
  		0.12628654261364952,
  		-0.4314454105693565,
  		-0.046835900884333405
  	],
  	[
  		0.1474333305067058,
  		-0.4214168148913282,
  		-0.047957591239392354
  	],
  	[
  		0.1680980492432992,
  		-0.4100111004805575,
  		-0.04892253775274317
  	],
  	[
  		0.1882012051156808,
  		-0.3972364527328278,
  		-0.04972411292437064
  	],
  	[
  		0.2076608025228279,
  		-0.38310422087966955,
  		-0.05035571807627444
  	],
  	[
  		0.2263921879427664,
  		-0.36762931697841617,
  		-0.050810801625096595
  	],
  	[
  		0.2443079133330091,
  		-0.3508306747046586,
  		-0.05108288402327869
  	],
  	[
  		0.26131762672066045,
  		-0.3327317738912978,
  		-0.051165590566703986
  	],
  	[
  		0.2773279997903137,
  		-0.3133612369131209,
  		-0.05105269346725968
  	],
  	[
  		0.2922427047492711,
  		-0.2927535029029165,
  		-0.05073816480636686
  	],
  	[
  		0.30596245569779223,
  		-0.2709495852747814,
  		-0.05021624221442938
  	],
  	[
  		0.3183851331968097,
  		-0.2479979169493825,
  		-0.049481509350861284
  	],
  	[
  		0.32940601472104625,
  		-0.2239552857989108,
  		-0.048528993472738396
  	],
  	[
  		0.33891813818016653,
  		-0.19888785986939841,
  		-0.047354282550851105
  	],
  	[
  		0.3468128305781905,
  		-0.1728722975410906,
  		-0.04595366448134536
  	],
  	[
  		0.35298043894065095,
  		-0.1459969315338938,
  		-0.04432429089463164
  	],
  	[
  		0.3573113054812427,
  		-0.11836300708289141,
  		-0.042464367806610344
  	],
  	[
  		0.3596970329838086,
  		-0.09008594321094629,
  		-0.04037337479367108
  	],
  	[
  		0.3600320886146489,
  		-0.061296571377924776,
  		-0.0380523133818772
  	],
  	[
  		0.35821579355104705,
  		-0.03214228762847679,
  		-0.03550398378135058
  	],
  	[
  		0.35415474018833804,
  		-0.002788032787909015,
  		-0.032733286818461035
  	],
  	[
  		0.34776566613465354,
  		0.02658300902295053,
  		-0.029747544782916968
  	],
  	[
  		0.33897879230575434,
  		0.05576912861980417,
  		-0.026556830827320282
  	],
  	[
  		0.32774159881590714,
  		0.08455038524807945,
  		-0.023174291555809582
  	],
  	[
  		0.31402296526361906,
  		0.112689650862417,
  		-0.019616441726046423
  	],
  	[
  		0.2978175411694594,
  		0.1399345850493874,
  		-0.015903404050683072
  	],
  	[
  		0.2791501401205028,
  		0.166020704520826,
  		-0.012059061758733709
  	],
  	[
  		0.25807987386085623,
  		0.1906756670507136,
  		-0.008111088079863427
  	],
  	[
  		0.23470367112474563,
  		0.21362481136009062,
  		-0.004090816659289603
  	],
  	[
  		0.20915877604221042,
  		0.2345978800563386,
  		-0.000032921670148024535
  	],
  	[
  		0.181623810867518,
  		0.2533367081785904,
  		0.004025112726257208
  	],
  	[
  		0.1523180348564681,
  		0.26960350099209557,
  		0.008043736619759356
  	],
  	[
  		0.1214985457255287,
  		0.2831891771794998,
  		0.011982272769712261
  	],
  	[
  		0.08945534965272858,
  		0.2939211496175214,
  		0.01580000471189871
  	],
  	[
  		0.05650445071959121,
  		0.3016698864493562,
  		0.0194573470096433
  	],
  	[
  		0.0229793455666038,
  		0.3063536601185284,
  		0.02291701385360084
  	],
  	[
  		-0.010778490549542179,
  		0.30794105175293873,
  		0.02614509686770417
  	],
  	[
  		-0.044429415614831255,
  		0.3064510101124173,
  		0.02911197049013484
  	],
  	[
  		-0.07764499741059631,
  		0.30195052688554763,
  		0.03179296267901197
  	],
  	[
  		-0.1101163034354899,
  		0.2945502345459278,
  		0.03416875617648076
  	],
  	[
  		-0.14156061791760882,
  		0.2843984166260192,
  		0.03622551571557373
  	],
  	[
  		-0.17172631031551192,
  		0.27167401782794215,
  		0.0379547638607576
  	],
  	[
  		-0.20039579411470762,
  		0.2565792492622068,
  		0.03935304849518735
  	],
  	[
  		-0.2273866978162054,
  		0.2393323175078492,
  		0.04042145633193089
  	],
  	[
  		-0.2525515004935635,
  		0.2201606914435859,
  		0.04116502942883418
  	],
  	[
  		-0.2757759559810311,
  		0.1992951864965427,
  		0.04159213729502634
  	],
  	[
  		-0.2969766485678675,
  		0.1769650160805967,
  		0.041713848294235446
  	],
  	[
  		-0.3160980019710514,
  		0.1533938504405633,
  		0.04154333316353613
  	],
  	[
  		-0.33310901738939064,
  		0.1287968413285003,
  		0.04109532256548678
  	],
  	[
  		-0.3479999591880285,
  		0.1033785176004493,
  		0.040385630979449194
  	],
  	[
  		-0.3607791485042101,
  		0.07733142831561095,
  		0.0394307515620615
  	],
  	[
  		-0.3714699723748499,
  		0.05083540062536653,
  		0.03824752101146203
  	],
  	[
  		-0.3801081722011023,
  		0.02405728373861636,
  		0.03685284977777898
  	],
  	[
  		-0.3867394414379484,
  		-0.002848937666280314,
  		0.035263510835581345
  	],
  	[
  		-0.39141733777342225,
  		-0.02974176110855749,
  		0.03349597928951936
  	],
  	[
  		-0.3942014984026987,
  		-0.05649159832065252,
  		0.03156631496497962
  	],
  	[
  		-0.3951561366915011,
  		-0.08298008830154743,
  		0.02949008054368114
  	],
  	[
  		-0.3943487929842418,
  		-0.1090993432130228,
  		0.02728228851162627
  	],
  	[
  		-0.3918493101689152,
  		-0.1347511661869745,
  		0.02495737103058479
  	],
  	[
  		-0.3877290047484465,
  		-0.15984626960254522,
  		0.022529167715444533
  	],
  	[
  		-0.38206000573392973,
  		-0.1843035139739109,
  		0.02001092713113136
  	],
  	[
  		-0.37491473604666736,
  		-0.20804918101751282,
  		0.01741531857733778
  	],
  	[
  		-0.36636551385941074,
  		-0.23101628945622854,
  		0.014754451390480969
  	],
  	[
  		-0.3564842541345677,
  		-0.25314395838478004,
  		0.012039899556780892
  	],
  	[
  		-0.3453422533479361,
  		-0.2743768203079975,
  		0.009282729902593469
  	],
  	[
  		-0.333010042916839,
  		-0.29466448404874873,
  		0.006493532516793023
  	],
  	[
  		-0.3195572991298207,
  		-0.31396104642004263,
  		0.0036824523754941693
  	],
  	[
  		-0.3050527993841765,
  		-0.3322246507158879,
  		0.0008592213924207962
  	],
  	[
  		-0.2895644162818451,
  		-0.3494170895790366,
  		-0.00196680968112263
  	],
  	[
  		-0.2731591426303596,
  		-0.36550344955832625,
  		-0.004786639925349237
  	],
  	[
  		-0.2559031416667525,
  		-0.3804517946032633,
  		-0.007591587786839836
  	],
  	[
  		-0.2378618178941102,
  		-0.3942328858055504,
  		-0.010373261682522351
  	],
  	[
  		-0.2190999048183213,
  		-0.40681993484705103,
  		-0.013123531805987921
  	],
  	[
  		-0.19968156662043232,
  		-0.4181883888225295,
  		-0.0158345032177694
  	],
  	[
  		-0.17967051141954002,
  		-0.42831574435302466,
  		-0.01849849026456591
  	],
  	[
  		-0.15913011429130142,
  		-0.43718138917781685,
  		-0.02110799234780325
  	],
  	[
  		-0.1381235486241523,
  		-0.4447664697003515,
  		-0.023655671047121574
  	],
  	[
  		-0.1167139247327361,
  		-0.45105378326045964,
  		-0.02613432859767543
  	],
  	[
  		-0.09496443491684753,
  		-0.4560276942087872,
  		-0.028536887720256678
  	],
  	[
  		-0.07293850436293775,
  		-0.4596740731684952,
  		-0.03085637280934647
  	],
  	[
  		-0.050699947440238625,
  		-0.46198025918451563,
  		-0.033085892495727395
  	],
  	[
  		-0.028313129048931258,
  		-0.4629350447835335,
  		-0.035218623616990734
  	],
  	[
  		-0.0058431307355348685,
  		-0.4625286843007481,
  		-0.03724779665116642
  	],
  	[
  		0.01664407869933664,
  		-0.4607529261752271,
  		-0.03916668269603587
  	],
  	[
  		0.03908146841585762,
  		-0.4576010702774128,
  		-0.040968582109920416
  	],
  	[
  		0.0614007669825433,
  		-0.4530680517131982,
  		-0.04264681496957655
  	],
  	[
  		0.08353228062373828,
  		-0.4471505529518143,
  		-0.044194713548163345
  	],
  	[
  		0.10540470906404001,
  		-0.43984714655168783,
  		-0.04560561707221188
  	],
  	[
  		0.1269449600825062,
  		-0.4311584712104427,
  		-0.046872869082437374
  	],
  	[
  		0.148077964308912,
  		-0.4210874443413941,
  		-0.04798981780063433
  	],
  	[
  		0.1687264923391241,
  		-0.409639514875504,
  		-0.04894981999546058
  	]
  ];
  var mercuryOrbit = {
  	targetName: targetName,
  	name: name,
  	startDate: startDate,
  	stopDate: stopDate,
  	stepSize: stepSize,
  	coords: coords
  };

  var mercuryOrbit$1 = {
    __proto__: null,
    targetName: targetName,
    name: name,
    startDate: startDate,
    stopDate: stopDate,
    stepSize: stepSize,
    coords: coords,
    'default': mercuryOrbit
  };

  var targetName$1 = "venus";
  var name$1 = "Venus";
  var startDate$1 = "2000-01-01";
  var stopDate$1 = "2001-01-01";
  var stepSize$1 = 1;
  var coords$1 = [
  	[
  		-0.7186302169204941,
  		-0.02250380069428597,
  		0.0411718412863683
  	],
  	[
  		-0.7178321361912561,
  		-0.04279835004903206,
  		0.04084840104226666
  	],
  	[
  		-0.7164656239478462,
  		-0.06305901189309752,
  		0.040492613985095745
  	],
  	[
  		-0.7145320177819197,
  		-0.08326976483422485,
  		0.04010477629316494
  	],
  	[
  		-0.7120331082600946,
  		-0.10341464202877032,
  		0.03968520954508322
  	],
  	[
  		-0.7089711366293272,
  		-0.12347774417079652,
  		0.03923426040978341
  	],
  	[
  		-0.7053487921436812,
  		-0.1434432523763281,
  		0.03875230031612603
  	],
  	[
  		-0.7011692090176167,
  		-0.16329544095137072,
  		0.0382397251025343
  	],
  	[
  		-0.6964359630112895,
  		-0.1830186900325669,
  		0.03769695464712925
  	],
  	[
  		-0.6911530676536783,
  		-0.20259749808963823,
  		0.03712443247884888
  	],
  	[
  		-0.6853249701096811,
  		-0.2220164942790238,
  		0.03652262537005087
  	],
  	[
  		-0.6789565466976631,
  		-0.2412604506385344,
  		0.03589202291111183
  	],
  	[
  		-0.6720530980641932,
  		-0.2603142941130075,
  		0.03523313706754874
  	],
  	[
  		-0.6646203440230072,
  		-0.27916311840137203,
  		0.03454650172020037
  	],
  	[
  		-0.6566644180654928,
  		-0.29779219561582954,
  		0.033832672189015804
  	],
  	[
  		-0.6481918615502319,
  		-0.3161869877441817,
  		0.03309222474100866
  	],
  	[
  		-0.6392096175793704,
  		-0.3343331579066781,
  		0.03232575608294233
  	],
  	[
  		-0.6297250245697971,
  		-0.3522165813991011,
  		0.03153388283932061
  	],
  	[
  		-0.6197458095273025,
  		-0.3698233565141537,
  		0.030717241016263743
  	],
  	[
  		-0.6092800810320793,
  		-0.38713981513356444,
  		0.02987648545185564
  	],
  	[
  		-0.598336321944073,
  		-0.4041525330836681,
  		0.0290122892535527
  	],
  	[
  		-0.5869233818368568,
  		-0.42084834024758033,
  		0.0281253432232486
  	],
  	[
  		-0.5750504691688211,
  		-0.43721433042742847,
  		0.027216355270591647
  	],
  	[
  		-0.56272714320059,
  		-0.45323787095046114,
  		0.0262860498151534
  	],
  	[
  		-0.5499633056676765,
  		-0.46890661201321193,
  		0.02533516717804824
  	],
  	[
  		-0.5367691922174663,
  		-0.48420849575822944,
  		0.024364462963603943
  	],
  	[
  		-0.5231553636197174,
  		-0.4991317650782148,
  		0.02337470743168205
  	],
  	[
  		-0.5091326967597567,
  		-0.5136649721428266,
  		0.022366684861245593
  	],
  	[
  		-0.4947123754236845,
  		-0.5277969866436415,
  		0.02134119290577059
  	],
  	[
  		-0.47990588088485203,
  		-0.5415170037531771,
  		0.020299041941093773
  	],
  	[
  		-0.4647249823009263,
  		-0.5548145517941768,
  		0.01924105440628578
  	],
  	[
  		-0.4491817269308598,
  		-0.5676794996156812,
  		0.01816806413813514
  	],
  	[
  		-0.4332884301810719,
  		-0.5801020636727298,
  		0.01708091569982553
  	],
  	[
  		-0.4170576654901318,
  		-0.592072814806843,
  		0.01598046370438059
  	],
  	[
  		-0.4005022540612084,
  		-0.603582684724741,
  		0.01486757213344879
  	],
  	[
  		-0.38363525445150976,
  		-0.6146229721730427,
  		0.01374311365199326
  	],
  	[
  		-0.36646995202790794,
  		-0.6251853488069882,
  		0.012607968919445309
  	],
  	[
  		-0.3490198482978805,
  		-0.6352618647514947,
  		0.011463025897876511
  	],
  	[
  		-0.33129865012485443,
  		-0.644844953853153,
  		0.01030917915773391
  	],
  	[
  		-0.3133202588369679,
  		-0.6539274386220302,
  		0.009147329181678437
  	],
  	[
  		-0.29509875923819323,
  		-0.6625025348624267,
  		0.007978381667056446
  	],
  	[
  		-0.2766484085306886,
  		-0.670563855991999,
  		0.006803246827526277
  	],
  	[
  		-0.2579836251571734,
  		-0.6781054170489288,
  		0.005622838694349858
  	],
  	[
  		-0.2391189775719239,
  		-0.6851216383870635,
  		0.004438074417849146
  	],
  	[
  		-0.22006917294900413,
  		-0.6916073490592434,
  		0.0032498735695111274
  	],
  	[
  		-0.20084904583607333,
  		-0.6975577898892147,
  		0.002059157445216122
  	],
  	[
  		-0.18147354676201963,
  		-0.7029686162327666,
  		0.0008668483700455551
  	],
  	[
  		-0.1619577308065122,
  		-0.7078359004289223,
  		-0.0003261309948821799
  	],
  	[
  		-0.1423167461393887,
  		-0.7121561339421718,
  		-0.001518858343114569
  	],
  	[
  		-0.1225658225376508,
  		-0.7159262291968782,
  		-0.002710412410678755
  	],
  	[
  		-0.10272025988770771,
  		-0.7191435211051095,
  		-0.003899873660585629
  	],
  	[
  		-0.08279541668039443,
  		-0.721805768289285,
  		-0.005086324963610577
  	],
  	[
  		-0.06280669850618203,
  		-0.7239111540011489,
  		-0.006268852274940638
  	],
  	[
  		-0.042769546557903396,
  		-0.7254582867387002,
  		-0.0074465453062815155
  	],
  	[
  		-0.02269942614821407,
  		-0.7264462005628567,
  		-0.008618498193027973
  	],
  	[
  		-0.0026118152489127532,
  		-0.7268743551157604,
  		-0.0097838101561029
  	],
  	[
  		0.01747780694086444,
  		-0.7267426353427856,
  		-0.010941586158084101
  	],
  	[
  		0.03755397139067652,
  		-0.7260513509204647,
  		-0.01209093755324564
  	],
  	[
  		0.05760123059227043,
  		-0.7248012353926252,
  		-0.01323098273114941
  	],
  	[
  		0.07760416986390056,
  		-0.7229934450172122,
  		-0.01436084775343699
  	],
  	[
  		0.09754741859896152,
  		-0.7206295573263564,
  		-0.01547966698347749
  	],
  	[
  		0.1174156614525689,
  		-0.7177115694023399,
  		-0.01658658370854319
  	],
  	[
  		0.1371936494598494,
  		-0.7142418958722159,
  		-0.01768075075418716
  	],
  	[
  		0.1568662110798287,
  		-0.7102233666239095,
  		-0.018761331090512142
  	],
  	[
  		0.1764182631589313,
  		-0.7056592242467161,
  		-0.01982749843002596
  	],
  	[
  		0.19583482180822542,
  		-0.7005531211991612,
  		-0.020878437816784792
  	],
  	[
  		0.215101013188661,
  		-0.6949091167072651,
  		-0.02191334620653707
  	],
  	[
  		0.2342020841986599,
  		-0.6887316733963038,
  		-0.02293143303758387
  	],
  	[
  		0.25312341305852065,
  		-0.6820256536592195,
  		-0.02393192079208143
  	],
  	[
  		0.2718505197862017,
  		-0.6747963157648795,
  		-0.024914045547516743
  	],
  	[
  		0.2903690765591478,
  		-0.6670493097094394,
  		-0.025877057518090513
  	],
  	[
  		0.30866491795690915,
  		-0.6587906728141029,
  		-0.026820221585754773
  	],
  	[
  		0.3267240510794002,
  		-0.6500268250726218,
  		-0.0277428178206492
  	],
  	[
  		0.3445326655357247,
  		-0.640764564251922,
  		-0.02864414199069279
  	],
  	[
  		0.36207714329857404,
  		-0.6310110607492944,
  		-0.029523506060088682
  	],
  	[
  		0.37934406841928303,
  		-0.6207738522095928,
  		-0.0303802386765055
  	],
  	[
  		0.39632023659870774,
  		-0.6100608379059742,
  		-0.031213685646706
  	],
  	[
  		0.4129926646091486,
  		-0.5988802728877168,
  		-0.03202321040039366
  	],
  	[
  		0.4293485995626134,
  		-0.5872407618987041,
  		-0.03280819444205624
  	],
  	[
  		0.4453755280207797,
  		-0.5751512530702042,
  		-0.03356803779058738
  	],
  	[
  		0.46106118494206827,
  		-0.5626210313916106,
  		-0.03430215940647254
  	],
  	[
  		0.47639356246130565,
  		-0.5496597119628573,
  		-0.035009997606326664
  	],
  	[
  		0.49136091849749275,
  		-0.5362772330322534,
  		-0.03569101046457986
  	],
  	[
  		0.5059517851852602,
  		-0.5224838488235317,
  		-0.036344676202103236
  	],
  	[
  		0.5201549771256265,
  		-0.5082901221559555,
  		-0.03697049356157876
  	],
  	[
  		0.5339595994517282,
  		-0.49370691686136103,
  		-0.03756798216941296
  	],
  	[
  		0.5473550557052271,
  		-0.47874539000207933,
  		-0.0381366828840022
  	],
  	[
  		0.5603310555191433,
  		-0.4634169838937157,
  		-0.03867615813015817
  	],
  	[
  		0.5728776221028968,
  		-0.44773341793682947,
  		-0.03918599221950461
  	],
  	[
  		0.584985099525379,
  		-0.43170668026160774,
  		-0.03966579165666143
  	],
  	[
  		0.5966441597919203,
  		-0.41534901918970013,
  		-0.040115185431032936
  	],
  	[
  		0.6078458097110193,
  		-0.39867293451741553,
  		-0.04053382529402086
  	],
  	[
  		0.6185813975467811,
  		-0.3816911686245797,
  		-0.04092138602148501
  	],
  	[
  		0.6288426194530081,
  		-0.3644166974134032,
  		-0.04127756566127843
  	],
  	[
  		0.6386215256849264,
  		-0.3468627210817879,
  		-0.04160208576568492
  	],
  	[
  		0.6479105265845724,
  		-0.32904265473557814,
  		-0.041894691608591106
  	],
  	[
  		0.6567023983358851,
  		-0.310970118844341,
  		-0.042155152387227786
  	],
  	[
  		0.6649902884855944,
  		-0.2926589295453486,
  		-0.042383261408318704
  	],
  	[
  		0.6727677212260175,
  		-0.2741230888005184,
  		-0.04257883625847675
  	],
  	[
  		0.6800286024359191,
  		-0.255376774411169,
  		-0.04274171895869313
  	],
  	[
  		0.6867672244756265,
  		-0.23643432989553462,
  		-0.042871776102766025
  	],
  	[
  		0.6929782707326314,
  		-0.217310254234094,
  		-0.04296889897952152
  	],
  	[
  		0.6986568199139506,
  		-0.198019191487865,
  		-0.04303300367868095
  	],
  	[
  		0.7037983500815653,
  		-0.17857592029492952,
  		-0.043064031180234795
  	],
  	[
  		0.7083987424273016,
  		-0.1589953432505659,
  		-0.04306194742718641
  	],
  	[
  		0.7124542847835711,
  		-0.1392924761764808,
  		-0.04302674338153368
  	],
  	[
  		0.7159616748664512,
  		-0.1194824372847569,
  		-0.04295843506336307
  	],
  	[
  		0.7189180232476421,
  		-0.09958043624224296,
  		-0.04285706357293172
  	],
  	[
  		0.7213208560518911,
  		-0.07960176314126216,
  		-0.04272269509562378
  	],
  	[
  		0.7231681173765573,
  		-0.05956177738262573,
  		-0.04255542088966933
  	],
  	[
  		0.7244581714300784,
  		-0.039475896477075396,
  		-0.04235535725652118
  	],
  	[
  		0.7251898043861588,
  		-0.01935958477141887,
  		-0.04212264549379235
  	],
  	[
  		0.7253622259506073,
  		0.0007716578942430724,
  		-0.041857451830663465
  	],
  	[
  		0.724975070637837,
  		0.02090230759165887,
  		-0.04155996734567623
  	],
  	[
  		0.7240283987541525,
  		0.04101682776525762,
  		-0.04123040786683801
  	],
  	[
  		0.7225226970850652,
  		0.061099680741843534,
  		-0.04086901385397089
  	],
  	[
  		0.7204588792839903,
  		0.08113533928217935,
  		-0.0404760502632488
  	],
  	[
  		0.7178382859598055,
  		0.10110829816733291,
  		-0.04005180639387574
  	],
  	[
  		0.7146626844608881,
  		0.1210030858125069,
  		-0.03959659571687014
  	],
  	[
  		0.710934268353376,
  		0.14080427590091613,
  		-0.03911075568593136
  	],
  	[
  		0.7066556565915476,
  		0.1604964990301129,
  		-0.038594647530376947
  	],
  	[
  		0.7018298923783065,
  		0.18006445436298552,
  		-0.03804865603015098
  	],
  	[
  		0.6964604417140254,
  		0.1994929212756383,
  		-0.03747318927290421
  	],
  	[
  		0.6905511916317324,
  		0.21876677099384134,
  		-0.036868678393174696
  	],
  	[
  		0.6841064481174117,
  		0.2378709782102515,
  		-0.03623557729366375
  	],
  	[
  		0.6771309337138767,
  		0.2567906326739782,
  		-0.03557436234864495
  	],
  	[
  		0.6696297848069558,
  		0.2755109507441438,
  		-0.034885532089527944
  	],
  	[
  		0.6616085485931464,
  		0.2940172868990673,
  		-0.034169606872614375
  	],
  	[
  		0.653073179728114,
  		0.312295145192501,
  		-0.03342712852910803
  	],
  	[
  		0.6440300366556526,
  		0.3303301906481567,
  		-0.03265865999746985
  	],
  	[
  		0.6344858776169805,
  		0.348108260583576,
  		-0.03186478493823215
  	],
  	[
  		0.6244478563404784,
  		0.3656153758542252,
  		-0.03104610733141117
  	],
  	[
  		0.6139235174122541,
  		0.3828377520085484,
  		-0.0302032510566805
  	],
  	[
  		0.6029207913281719,
  		0.39976181034457803,
  		-0.029336859456486487
  	],
  	[
  		0.5914479892282517,
  		0.41637418885859606,
  		-0.02844759488230671
  	],
  	[
  		0.5795137973146246,
  		0.4326617530762679,
  		-0.027536138224265733
  	],
  	[
  		0.5671272709544878,
  		0.4486116067566229,
  		-0.026603188424335632
  	],
  	[
  		0.5542978284699767,
  		0.46421110245932085,
  		-0.02564946197336428
  	],
  	[
  		0.5410352446172625,
  		0.4794478519656378,
  		-0.02467569239220035
  	],
  	[
  		0.5273496437569708,
  		0.4943097365433656,
  		-0.0236826296971768
  	],
  	[
  		0.5132514927190054,
  		0.5087849170462063,
  		-0.02267103985024543
  	],
  	[
  		0.4987515933647094,
  		0.5228618438379482,
  		-0.02164170419406482
  	],
  	[
  		0.48386107484976765,
  		0.5365292665318172,
  		-0.02059541887235943
  	],
  	[
  		0.46859138559152413,
  		0.5497762435353779,
  		-0.01953299423588628
  	],
  	[
  		0.4529542849447287,
  		0.5625921513913529,
  		-0.01845525423436685
  	],
  	[
  		0.4369618345900641,
  		0.5749666939047317,
  		-0.01736303579475881
  	],
  	[
  		0.4206263896401569,
  		0.5868899110465734,
  		-0.01625718818626928
  	],
  	[
  		0.4039605894681446,
  		0.5983521876249445,
  		-0.01513857237252789
  	],
  	[
  		0.3869773482642325,
  		0.6093442617134954,
  		-0.01400806035136304
  	],
  	[
  		0.3696898453260498,
  		0.6198572328282612,
  		-0.01286653448264368
  	],
  	[
  		0.35211151508899363,
  		0.6298825698433764,
  		-0.01171488680467375
  	],
  	[
  		0.33425603690311995,
  		0.639412118636503,
  		-0.0105540183396411
  	],
  	[
  		0.3161373245635236,
  		0.6484381094549282,
  		-0.009384838388650323
  	],
  	[
  		0.2977695156015082,
  		0.6569531639934345,
  		-0.008208263816879073
  	],
  	[
  		0.2791669603441943,
  		0.6649503021752219,
  		-0.0070252183294241075
  	],
  	[
  		0.2603442107506639,
  		0.672422948627359,
  		-0.005836631738418417
  	],
  	[
  		0.24131600903297132,
  		0.67936493884244,
  		-0.0046434392220166265
  	],
  	[
  		0.22209727607079952,
  		0.685770525018357,
  		-0.003446580575867324
  	],
  	[
  		0.20270309962886232,
  		0.6916343815683413,
  		-0.002246999457703491
  	],
  	[
  		0.1831487223864859,
  		0.6969516102936857,
  		-0.001045642625701234
  	],
  	[
  		0.1634495297891401,
  		0.7017177452118255,
  		0.000156540828728671
  	],
  	[
  		0.1436210377320206,
  		0.7059287570327644,
  		0.0013586002530380581
  	],
  	[
  		0.12367888008610271,
  		0.7095810572771254,
  		0.002559584209833488
  	],
  	[
  		0.10363879607739031,
  		0.7126715020294444,
  		0.003758541256656202
  	],
  	[
  		0.08351661753038238,
  		0.7151973953206493,
  		0.004954520728532369
  	],
  	[
  		0.06332825598706429,
  		0.717156492134038,
  		0.006146573522560971
  	],
  	[
  		0.043089689713002345,
  		0.7185470010294251,
  		0.007333752883800375
  	],
  	[
  		0.022816950602385807,
  		0.7193675863805244,
  		0.008515115191699812
  	],
  	[
  		0.002526110994110669,
  		0.7196173702210252,
  		0.009689720746319
  	],
  	[
  		-0.0177667295887808,
  		0.7192959336952435,
  		0.01085663455356491
  	],
  	[
  		-0.03804545776379589,
  		0.7184033181096132,
  		0.012014927108676141
  	],
  	[
  		-0.058293959665032764,
  		0.716940025581821,
  		0.013163675177170412
  	],
  	[
  		-0.07849613435770462,
  		0.7149070192846996,
  		0.014301962572474649
  	],
  	[
  		-0.09863590727804432,
  		0.7123057232825534,
  		0.01542888092944902
  	],
  	[
  		-0.1186972436853653,
  		0.7091380219580441,
  		0.01654353047301681
  	],
  	[
  		-0.13866416211293028,
  		0.7054062590282115,
  		0.01764502078110832
  	],
  	[
  		-0.15852074780417091,
  		0.7011132361487148,
  		0.01873247154113216
  	],
  	[
  		-0.17825116612071232,
  		0.6962622111058642,
  		0.01980501329918436
  	],
  	[
  		-0.1978396759085942,
  		0.690856895596524,
  		0.02086178820121039
  	],
  	[
  		-0.21727064280903263,
  		0.6849014525964643,
  		0.02190195072534269
  	],
  	[
  		-0.2365285525000465,
  		0.6784004933182505,
  		0.02292466840463562
  	],
  	[
  		-0.2555980238552714,
  		0.6713590737602689,
  		0.023929122539432413
  	],
  	[
  		-0.2744638220063036,
  		0.6637826908490074,
  		0.02491450889860456
  	],
  	[
  		-0.2931108712949606,
  		0.655677278177221,
  		0.02588003840891265
  	],
  	[
  		-0.31152426810190836,
  		0.6470492013411375,
  		0.02682493783175128
  	],
  	[
  		-0.3296892935381984,
  		0.6379052528803684,
  		0.02774845042655016
  	],
  	[
  		-0.3475914259863637,
  		0.6282526468246475,
  		0.028649836600117513
  	],
  	[
  		-0.3652163534778674,
  		0.6180990128521777,
  		0.029528374541228752
  	],
  	[
  		-0.3825499858938278,
  		0.6074523900646752,
  		0.030383360839775723
  	],
  	[
  		-0.399578466976145,
  		0.5963212203848357,
  		0.03121411108981024
  	],
  	[
  		-0.4162881861363527,
  		0.584714341582396,
  		0.032019960475836586
  	],
  	[
  		-0.4326657900497254,
  		0.5726409799354399,
  		0.0328002643417219
  	],
  	[
  		-0.4486981940224243,
  		0.5601107425340727,
  		0.03355439874161788
  	],
  	[
  		-0.46437259311972,
  		0.5471336092340554,
  		0.034281760972307056
  	],
  	[
  		-0.4796764730436238,
  		0.5337199242684476,
  		0.03498177008640943
  	],
  	[
  		-0.49459762074855435,
  		0.5198803875257335,
  		0.03565386738590926
  	],
  	[
  		-0.5091241347839884,
  		0.5056260455033453,
  		0.036297516895485424
  	],
  	[
  		-0.5232444353533869,
  		0.4909682819458948,
  		0.0369122058151546
  	],
  	[
  		-0.5369472740790383,
  		0.4759188081778327,
  		0.03749744495176262
  	],
  	[
  		-0.5502217434628456,
  		0.4604896531406304,
  		0.03805276912888488
  	],
  	[
  		-0.5630572860334695,
  		0.4446931531449533,
  		0.038577737574726594
  	],
  	[
  		-0.5754437031706462,
  		0.4285419413486256,
  		0.0390719342876397
  	],
  	[
  		-0.587371163597878,
  		0.4120489369715012,
  		0.03953496837890064
  	],
  	[
  		-0.5988302115352431,
  		0.39522733425873063,
  		0.039966474392429
  	],
  	[
  		-0.6098117745043563,
  		0.3780905912041189,
  		0.04036611260114765
  	],
  	[
  		-0.6203071707780835,
  		0.36065241804559783,
  		0.04073356927972104
  	],
  	[
  		-0.6303081164680497,
  		0.3429267655450645,
  		0.041068556953438584
  	],
  	[
  		-0.6398067322434429,
  		0.32492781306507235,
  		0.041370814623038224
  	],
  	[
  		-0.6487955496751052,
  		0.3066699564550711,
  		0.0416401079652983
  	],
  	[
  		-0.6572675171994038,
  		0.288167795760077,
  		0.041876229509256964
  	],
  	[
  		-0.6652160056968686,
  		0.2694361227648229,
  		0.04207899878794902
  	],
  	[
  		-0.6726348136810931,
  		0.25048990838658003,
  		0.04224826246558342
  	],
  	[
  		-0.6795181720939091,
  		0.23134428992996542,
  		0.042383894440114644
  	],
  	[
  		-0.6858607487033526,
  		0.2120145582171427,
  		0.04248579592119347
  	],
  	[
  		-0.6916576521014683,
  		0.192516144606893,
  		0.04255389548351433
  	],
  	[
  		-0.6969044352995203,
  		0.17286460791608121,
  		0.042588149095605224
  	],
  	[
  		-0.7015970989187017,
  		0.15307562125705182,
  		0.04258854012413948
  	],
  	[
  		-0.7057320939749476,
  		0.1331649588044824,
  		0.04255507931387381
  	],
  	[
  		-0.7093063242569124,
  		0.11314848250517891,
  		0.04248780474334267
  	],
  	[
  		-0.7123171482967825,
  		0.09304212874423742,
  		0.04238678175647264
  	],
  	[
  		-0.7147623809339434,
  		0.0728618949809079,
  		0.04225210287029375
  	],
  	[
  		-0.7166402944720371,
  		0.05262382636741997,
  		0.042083887658954454
  	],
  	[
  		-0.7179496194303961,
  		0.032344002363904736,
  		0.04188228261426805
  	],
  	[
  		-0.7186895448912536,
  		0.01203852336244627,
  		0.04164746098304068
  	],
  	[
  		-0.7188597184445689,
  		-0.008276502666807335,
  		0.04137962258145451
  	],
  	[
  		-0.7184602457327298,
  		-0.02858497349465932,
  		0.041078993586806355
  	],
  	[
  		-0.717491689597842,
  		-0.04887080590432413,
  		0.040745826306927364
  	],
  	[
  		-0.7159550688347593,
  		-0.0691179489028005,
  		0.04038039892763694
  	],
  	[
  		-0.7138518565534582,
  		-0.08931039685979991,
  		0.03998301523860977
  	],
  	[
  		-0.7111839781547881,
  		-0.1094322025620726,
  		0.03955400433806024
  	],
  	[
  		-0.7079538089240716,
  		-0.1294674901712014,
  		0.03909372031667147
  	],
  	[
  		-0.7041641712474316,
  		-0.1494004680731971,
  		0.03860254192121716
  	],
  	[
  		-0.6998183314561239,
  		-0.1692154416085262,
  		0.03808087219834162
  	],
  	[
  		-0.6949199963045075,
  		-0.18889682567149302,
  		0.0375291381189784
  	],
  	[
  		-0.6894733090875913,
  		-0.20842915716812202,
  		0.03694779018390514
  	],
  	[
  		-0.6834828454044983,
  		-0.22779710732219483,
  		0.03633730201094038
  	],
  	[
  		-0.6769536085743931,
  		-0.2469854938191884,
  		0.03569816990430346
  	],
  	[
  		-0.6698910247117549,
  		-0.2659792927783313,
  		0.035030912406667974
  	],
  	[
  		-0.662300937468121,
  		-0.28476365054328073,
  		0.034336069834448
  	],
  	[
  		-0.6541896024476781,
  		-0.30332389528224435,
  		0.03361420379686803
  	],
  	[
  		-0.6455636813043102,
  		-0.32164554838870835,
  		0.03286589669937485
  	],
  	[
  		-0.6364302355279344,
  		-0.3397143356742746,
  		0.03209175123195748
  	],
  	[
  		-0.626796719928155,
  		-0.3575161983454511,
  		0.031292389842949894
  	],
  	[
  		-0.6166709758234554,
  		-0.3750373037565844,
  		0.030468454198895652
  	],
  	[
  		-0.6060612239443259,
  		-0.39226405593146674,
  		0.02962060463106107
  	],
  	[
  		-0.5949760570588797,
  		-0.4091831058464983,
  		0.02874951956918859
  	],
  	[
  		-0.5834244323296539,
  		-0.4257813614686377,
  		0.02785589496308401
  	],
  	[
  		-0.571415663410425,
  		-0.4420459975417207,
  		0.02694044369263824
  	],
  	[
  		-0.5589594122919734,
  		-0.4579644651150889,
  		0.02600389496688344
  	],
  	[
  		-0.5460656809058353,
  		-0.47352450080880404,
  		0.025046993712686358
  	],
  	[
  		-0.5327448024951814,
  		-0.4887141358100155,
  		0.02407049995369063
  	],
  	[
  		-0.5190074327619648,
  		-0.5035217045955591,
  		0.023075188180094748
  	],
  	[
  		-0.5048645407996326,
  		-0.5179358533759633,
  		0.02206184670988948
  	],
  	[
  		-0.4903273998206517,
  		-0.53194554825654,
  		0.021031277042142662
  	],
  	[
  		-0.4754075776881435,
  		-0.5455400831115241,
  		0.01998429320292695
  	],
  	[
  		-0.46011692726094466,
  		-0.5587090871675219,
  		0.01892172108448313
  	],
  	[
  		-0.4444675765613929,
  		-0.571442532292864,
  		0.01784439777819961
  	],
  	[
  		-0.42847191877511764,
  		-0.5837307399897748,
  		0.01675317090198046
  	],
  	[
  		-0.41214260209208825,
  		-0.5955643880865923,
  		0.01564889792256684
  	],
  	[
  		-0.39549251939813423,
  		-0.6069345171275787,
  		0.01453244547336362
  	],
  	[
  		-0.3785347978261138,
  		-0.6178325364581717,
  		0.013404688668321509
  	],
  	[
  		-0.3612827881758559,
  		-0.62825023000382,
  		0.012266510412413181
  	],
  	[
  		-0.34375005421194627,
  		-0.6381797617408479,
  		0.011118800709240739
  	],
  	[
  		-0.3259503618483664,
  		-0.6476136808580727,
  		0.009962455966302306
  	],
  	[
  		-0.3078976682289239,
  		-0.6565449266081842,
  		0.008798378298445016
  	],
  	[
  		-0.2896061107123477,
  		-0.6649668328481317,
  		0.007627474830029433
  	],
  	[
  		-0.2710899957708481,
  		-0.6728731322679636,
  		0.00645065699632628
  	],
  	[
  		-0.2523637878107852,
  		-0.6802579603079452,
  		0.005268839844646231
  	],
  	[
  		-0.23344209792407988,
  		-0.6871158587638266,
  		0.004082941335717403
  	],
  	[
  		-0.21433967257882533,
  		-0.6934417790804628,
  		0.00289388164579961
  	],
  	[
  		-0.1950713822574557,
  		-0.6992310853341496,
  		0.001702582470019064
  	],
  	[
  		-0.1756522100507223,
  		-0.7044795569042569,
  		0.0005099663274003059
  	],
  	[
  		-0.15609724021558802,
  		-0.7091833908349181,
  		-0.0006830441319468588
  	],
  	[
  		-0.1364216467050313,
  		-0.7133392038877325,
  		-0.0018755268170298788
  	],
  	[
  		-0.11664068167761782,
  		-0.7169440342866052,
  		-0.003066560883129022
  	],
  	[
  		-0.0967696639945652,
  		-0.7199953431560289,
  		-0.004255227415474772
  	],
  	[
  		-0.07682396771190171,
  		-0.7224910156542631,
  		-0.005440610109030053
  	],
  	[
  		-0.056819010575181565,
  		-0.7244293618030336,
  		-0.006621795943966384
  	],
  	[
  		-0.03677024252409071,
  		-0.7258091170155061,
  		-0.007797875856438704
  	],
  	[
  		-0.01669313421414225,
  		-0.7266294423244408,
  		-0.008967945404267902
  	],
  	[
  		0.003396834437473854,
  		-0.7268899243125593,
  		-0.010131105427152991
  	],
  	[
  		0.02348418567494691,
  		-0.7265905747472723,
  		-0.011286462701042551
  	],
  	[
  		0.043553455288990246,
  		-0.7257318299220518,
  		-0.012433130586304639
  	],
  	[
  		0.06358920395742122,
  		-0.7243145497068081,
  		-0.01357022966934318
  	],
  	[
  		0.0835760285346041,
  		-0.7223400163097754,
  		-0.014696888397318211
  	],
  	[
  		0.1034985732833404,
  		-0.719809932753473,
  		-0.01581224370563405
  	],
  	[
  		0.12334154104290691,
  		-0.7167264210674094,
  		-0.0169154416378695
  	],
  	[
  		0.1430897043270597,
  		-0.7130920202002848,
  		-0.01800563795783174
  	],
  	[
  		0.1627279163459458,
  		-0.7089096836545239,
  		-0.01908199875342338
  	],
  	[
  		0.1822411219459768,
  		-0.7041827768460389,
  		-0.02014370103201949
  	],
  	[
  		0.2016143684618364,
  		-0.6989150741922013,
  		-0.02118993330705838
  	],
  	[
  		0.22083281647489914,
  		-0.6931107559310494,
  		-0.0222198961755601
  	],
  	[
  		0.2398817504724487,
  		-0.6867744046748357,
  		-0.02323280288628804
  	],
  	[
  		0.2587465894021862,
  		-0.679911001701059,
  		-0.02422787989828148
  	],
  	[
  		0.2774128971166143,
  		-0.672525922984187,
  		-0.02520436742948823
  	],
  	[
  		0.2958663927019854,
  		-0.6646249349713182,
  		-0.02616151999523567
  	],
  	[
  		0.3140929606865886,
  		-0.6562141901050753,
  		-0.02709860693628301
  	],
  	[
  		0.33207866112323403,
  		-0.6473002220970638,
  		-0.02801491293620312
  	],
  	[
  		0.3498097395408864,
  		-0.6378899409552962,
  		-0.028909738527844522
  	],
  	[
  		0.3672726367604371,
  		-0.627990627768952,
  		-0.029782400588633712
  	],
  	[
  		0.384453998569742,
  		-0.6176099292539777,
  		-0.03063223282447628
  	],
  	[
  		0.40134068525304056,
  		-0.6067558520629899,
  		-0.03145858624202453
  	],
  	[
  		0.4179197809699681,
  		-0.5954367568630257,
  		-0.032260829609076634
  	],
  	[
  		0.4341786029794286,
  		-0.5836613521847328,
  		-0.033038349902883034
  	],
  	[
  		0.4501047107036308,
  		-0.5714386880466308,
  		-0.03379055274613497
  	],
  	[
  		0.4656859146276494,
  		-0.5587781493581421,
  		-0.03451686283041629
  	],
  	[
  		0.48091028502991606,
  		-0.5456894491051594,
  		-0.03521672432690617
  	],
  	[
  		0.4957661605391194,
  		-0.5321826213219766,
  		-0.03588960128412475
  	],
  	[
  		0.5102421565130583,
  		-0.5182680138534911,
  		-0.036534978012523055
  	],
  	[
  		0.5243271732350615,
  		-0.5039562809116317,
  		-0.03715235945572632
  	],
  	[
  		0.5380104039236765,
  		-0.4892583754300371,
  		-0.037741271548243235
  	],
  	[
  		0.551281342551397,
  		-0.474185541221034,
  		-0.0383012615594633
  	],
  	[
  		0.5641297914682939,
  		-0.45874930493899585,
  		-0.038831898423766935
  	],
  	[
  		0.5765458688264661,
  		-0.44296146785417634,
  		-0.03933277305657538
  	],
  	[
  		0.5885200158012428,
  		-0.4268340974411373,
  		-0.03980349865616394
  	],
  	[
  		0.6000430036051266,
  		-0.4103795187858915,
  		-0.0402437109910662
  	],
  	[
  		0.6111059402904553,
  		-0.3936103058159255,
  		-0.04065306867288804
  	],
  	[
  		0.621700277336758,
  		-0.37653927235732176,
  		-0.04103125341435453
  	],
  	[
  		0.6318178160187814,
  		-0.35917946302326514,
  		-0.04137797027240778
  	],
  	[
  		0.6414507135511628,
  		-0.34154414393829763,
  		-0.041692947876177104
  	],
  	[
  		0.6505914890057406,
  		-0.3236467933027914,
  		-0.04197593863964498
  	],
  	[
  		0.6592330289975141,
  		-0.30550109180221297,
  		-0.04222671895883554
  	],
  	[
  		0.6673685931352878,
  		-0.2871209128658534,
  		-0.04244508939335809
  	],
  	[
  		0.6749918192330853,
  		-0.2685203127798169,
  		-0.04263087483214161
  	],
  	[
  		0.6820967282784505,
  		-0.2497135206591505,
  		-0.04278392464320224
  	],
  	[
  		0.6886777291538136,
  		-0.2307149282841246,
  		-0.042904112807291436
  	],
  	[
  		0.6947296231071401,
  		-0.2115390798057653,
  		-0.04299133803527656
  	],
  	[
  		0.7002476079681391,
  		-0.19220066132585562,
  		-0.04304552386911133
  	],
  	[
  		0.7052272821063525,
  		-0.1727144903567246,
  		-0.043066618766257454
  	],
  	[
  		0.7096646481275104,
  		-0.1530955051662555,
  		-0.04305459616742348
  	],
  	[
  		0.7135561163046046,
  		-0.1333587540136687,
  		-0.043009454547494774
  	],
  	[
  		0.7168985077401513,
  		-0.11351938428174231,
  		-0.04293121744952743
  	],
  	[
  		0.7196890572562321,
  		-0.09359263151125352,
  		-0.042819933501690464
  	],
  	[
  		0.7219254160089358,
  		-0.07359380834355701,
  		-0.04267567641704224
  	],
  	[
  		0.7236056538238933,
  		-0.05353829337734479,
  		-0.04249854497603391
  	],
  	[
  		0.7247282612496999,
  		-0.03344151994575877,
  		-0.04228866299163909
  	],
  	[
  		0.7252921513260722,
  		-0.01331896482016475,
  		-0.04204617925701517
  	],
  	[
  		0.7252966610637018,
  		0.0068138631529646426,
  		-0.041771267475608415
  	],
  	[
  		0.7247415526328442,
  		0.02694143447546956,
  		-0.04146412617362302
  	],
  	[
  		0.7236270142577874,
  		0.047048210474494284,
  		-0.04112497859478099
  	],
  	[
  		0.7219536608144641,
  		0.06711865482617563,
  		-0.04075407257730908
  	],
  	[
  		0.7197225341285712,
  		0.08713724511900804,
  		-0.04035168041309693
  	],
  	[
  		0.7169351029717003,
  		0.10708848444971791,
  		-0.03991809868897962
  	],
  	[
  		0.7135932627531006,
  		0.12695691304433152,
  		-0.03945364811010851
  	],
  	[
  		0.7096993349048466,
  		0.14672711989697101,
  		-0.03895867330538272
  	],
  	[
  		0.7052560659583231,
  		0.1663837544187667,
  		-0.03843354261492552
  	],
  	[
  		0.7002666263101135,
  		0.18591153808914912,
  		-0.03787864785960051
  	],
  	[
  		0.6947346086755148,
  		0.2052952761015746,
  		-0.03729440409257404
  	],
  	[
  		0.6886640262281104,
  		0.2245198689956816,
  		-0.03668124933294226
  	],
  	[
  		0.6820593104239886,
  		0.24357032426767092,
  		-0.0360396442814537
  	],
  	[
  		0.6749253085094109,
  		0.2624317679505776,
  		-0.03537007201837229
  	],
  	[
  		0.6672672807109183,
  		0.2810894561559795,
  		-0.034673037683537786
  	],
  	[
  		0.6590908971070906,
  		0.2995287865685452,
  		-0.03394906813869574
  	],
  	[
  		0.6504022341813798,
  		0.3177353098846997,
  		-0.03319871161218341
  	],
  	[
  		0.6412077710556923,
  		0.33569474118656134,
  		-0.032422537326072656
  	],
  	[
  		0.6315143854046062,
  		0.3533929712421847,
  		-0.03162113510588692
  	],
  	[
  		0.6213293490503897,
  		0.37081607772303904,
  		-0.03079511497302501
  	],
  	[
  		0.6106603232392169,
  		0.387950336329542,
  		-0.02994510672004069
  	],
  	[
  		0.5995153535992704,
  		0.4047822318153741,
  		-0.02907175946894424
  	],
  	[
  		0.58790286478168,
  		0.4212984689012078,
  		-0.02817574121270862
  	],
  	[
  		0.5758316547855377,
  		0.4374859830683999,
  		-0.02725773834018197
  	],
  	[
  		0.5633108889685304,
  		0.4533319512231301,
  		-0.02631845514462408
  	],
  	[
  		0.550350093745008,
  		0.46882380222142594,
  		-0.025358613316104082
  	],
  	[
  		0.5369591499736689,
  		0.48394922724539424,
  		-0.024378951418016128
  	],
  	[
  		0.5231482860372925,
  		0.49869619002102983,
  		-0.023380224347985958
  	],
  	[
  		0.5089280706173205,
  		0.5130529368678757,
  		-0.022363202783462852
  	],
  	[
  		0.4943094051664167,
  		0.5270080065708117,
  		-0.021328672612310143
  	]
  ];
  var venusOrbit = {
  	targetName: targetName$1,
  	name: name$1,
  	startDate: startDate$1,
  	stopDate: stopDate$1,
  	stepSize: stepSize$1,
  	coords: coords$1
  };

  var venusOrbit$1 = {
    __proto__: null,
    targetName: targetName$1,
    name: name$1,
    startDate: startDate$1,
    stopDate: stopDate$1,
    stepSize: stepSize$1,
    coords: coords$1,
    'default': venusOrbit
  };

  var targetName$2 = "earth";
  var name$2 = "Earth";
  var startDate$2 = "2000-01-01";
  var stopDate$2 = "2001-01-01";
  var stepSize$2 = 1;
  var coords$2 = [
  	[
  		-0.16852464838587822,
  		0.9687833049070307,
  		-0.0000041204902784772635
  	],
  	[
  		-0.18573204063134752,
  		0.96562455445633,
  		-0.000004015775185238754
  	],
  	[
  		-0.20288259840649892,
  		0.9621641552292698,
  		-0.000003778083514021907
  	],
  	[
  		-0.2199707235741132,
  		0.9584030155107923,
  		-0.000003418806058993552
  	],
  	[
  		-0.23699081561602872,
  		0.9543421929793223,
  		-0.0000029537859902668228
  	],
  	[
  		-0.2539372809163121,
  		0.9499828969542817,
  		-0.000002402894950122547
  	],
  	[
  		-0.27080454289340933,
  		0.9453264905226629,
  		-0.000001789535529723055
  	],
  	[
  		-0.2875870532378524,
  		0.9403744919164041,
  		-0.000001140018331844202
  	],
  	[
  		-0.3042793041501021,
  		0.935128574548659,
  		-4.827913804714873e-7
  	],
  	[
  		-0.3208758412452176,
  		0.9295905653106026,
  		1.524728970990632e-7
  	],
  	[
  		-0.3373712767578406,
  		0.9237624409690549,
  		7.359129747957521e-7
  	],
  	[
  		-0.35376030282945514,
  		0.9176463226464917,
  		0.0000012386197027480038
  	],
  	[
  		-0.3700377048842075,
  		0.9112444682838089,
  		0.000001633889144429213
  	],
  	[
  		-0.38619837521192124,
  		0.9045592626304437,
  		0.0000018986188325947338
  	],
  	[
  		-0.4022373266435426,
  		0.8975932037510592,
  		0.00000201489004042728
  	],
  	[
  		-0.4181497054112849,
  		0.8903488845345946,
  		0.000001971743436349873
  	],
  	[
  		-0.43393080086893354,
  		0.8828289677129313,
  		0.0000017670451522737668
  	],
  	[
  		-0.44957604803247186,
  		0.8750361540810183,
  		0.0000014091470345466678
  	],
  	[
  		-0.4650810178713724,
  		0.8669731464154101,
  		9.178210100612486e-7
  	],
  	[
  		-0.4804413914823137,
  		0.8586426155416009,
  		3.2383667326132636e-7
  	],
  	[
  		-0.495652918783387,
  		0.850047178032418,
  		-3.332571356857574e-7
  	],
  	[
  		-0.5107113690284856,
  		0.8411893941451192,
  		-0.0000010090267198824061
  	],
  	[
  		-0.5256124853741376,
  		0.8320717885664797,
  		-0.0000016589119183805528
  	],
  	[
  		-0.5403519550056174,
  		0.8226968881263389,
  		-0.0000022426590306562006
  	],
  	[
  		-0.5549253999383498,
  		0.813067265128985,
  		-0.00000272744781381444
  	],
  	[
  		-0.5693283858331789,
  		0.8031855753939179,
  		-0.000003089354964290054
  	],
  	[
  		-0.583556441528306,
  		0.793054584949858,
  		-0.000003313404318840949
  	],
  	[
  		-0.5976050817383554,
  		0.7826771847626981,
  		-0.00000339275383970542
  	],
  	[
  		-0.6114698278093624,
  		0.7720563962680816,
  		-0.000003327556181442201
  	],
  	[
  		-0.6251462243216866,
  		0.7611953714630473,
  		-0.000003123856474298941
  	],
  	[
  		-0.6386298514639341,
  		0.7500973907872006,
  		-0.000002792699637872309
  	],
  	[
  		-0.6519163342467484,
  		0.7387658609577702,
  		-0.0000023494762718305583
  	],
  	[
  		-0.6650013500444341,
  		0.7272043138655897,
  		-0.0000018134494415881868
  	],
  	[
  		-0.6778806359459991,
  		0.7154164067733543,
  		-0.000001207360696405227
  	],
  	[
  		-0.6905499971503083,
  		0.7034059233918094,
  		-5.569985896149796e-7
  	],
  	[
  		-0.703005317229649,
  		0.6911767749258898,
  		1.093800520665876e-7
  	],
  	[
  		-0.7152425705493689,
  		0.6787329999002952,
  		7.618587849809156e-7
  	],
  	[
  		-0.7272578365323028,
  		0.666078761541238,
  		0.000001369938113579794
  	],
  	[
  		-0.7390473149145178,
  		0.6532183417328067,
  		0.000001903863614963807
  	],
  	[
  		-0.7506073407965461,
  		0.6401561310232019,
  		0.0000023361394122499228
  	],
  	[
  		-0.7619343982383359,
  		0.6268966146689219,
  		0.000002643130245817043
  	],
  	[
  		-0.7730251313282209,
  		0.6134443550768752,
  		0.000002806650501143431
  	],
  	[
  		-0.783876351883682,
  		0.5998039711197297,
  		0.000002815450381508755
  	],
  	[
  		-0.7944850429686112,
  		0.5859801147305552,
  		0.0000026665153566525
  	],
  	[
  		-0.8048483570996663,
  		0.5719774452079928,
  		0.0000023660702049548005
  	],
  	[
  		-0.8149636074964214,
  		0.5578006021668739,
  		0.000001930114142644069
  	],
  	[
  		-0.8248282504968701,
  		0.5434541793024108,
  		0.000001384233745696348
  	],
  	[
  		-0.8344398580483875,
  		0.5289427028871064,
  		7.624129236742163e-7
  	],
  	[
  		-0.8437960815259683,
  		0.5142706202598817,
  		1.046719384231873e-7
  	],
  	[
  		-0.8528946116300912,
  		0.49944230308667903,
  		-5.463388074659077e-7
  	],
  	[
  		-0.8617331420732741,
  		0.48446206699347283,
  		-0.000001149276487111271
  	],
  	[
  		-0.8703093449844816,
  		0.46933420417484983,
  		-0.000001667792189563003
  	],
  	[
  		-0.8786208626183168,
  		0.45406302137439253,
  		-0.0000020732280393576216
  	],
  	[
  		-0.8866653146822616,
  		0.4386528746755383,
  		-0.000002345945075024473
  	],
  	[
  		-0.8944403163023731,
  		0.4231081950975014,
  		-0.0000024753616382755326
  	],
  	[
  		-0.9019435002037893,
  		0.407433503134239,
  		-0.000002459102657866481
  	],
  	[
  		-0.9091725378644702,
  		0.3916334138225211,
  		-0.0000023017435075314576
  	],
  	[
  		-0.91612515675273,
  		0.3757126355863592,
  		-0.0000020135350128090505
  	],
  	[
  		-0.9227991529499571,
  		0.3596759661796272,
  		-0.0000016093313258714519
  	],
  	[
  		-0.9291923999027301,
  		0.34352828827181653,
  		-0.000001107792108389136
  	],
  	[
  		-0.9353028547581181,
  		0.32727456621817674,
  		-5.308252908666983e-7
  	],
  	[
  		-0.9411285639531267,
  		0.3109198446267323,
  		9.682661512875429e-8
  	],
  	[
  		-0.9466676696601903,
  		0.2944692485396984,
  		7.479879204444958e-7
  	],
  	[
  		-0.9519184184173066,
  		0.2779279843501214,
  		0.000001393583469927183
  	],
  	[
  		-0.9568791727714377,
  		0.2613013399700317,
  		0.00000200344036463188
  	],
  	[
  		-0.9615484259895393,
  		0.2445946823450827,
  		0.000002547454346907115
  	],
  	[
  		-0.9659248188775118,
  		0.2278134503582722,
  		0.000002997141990115109
  	],
  	[
  		-0.9700071566976812,
  		0.2109631416690717,
  		0.0000033274945194275475
  	],
  	[
  		-0.9737944234528687,
  		0.1940492931200165,
  		0.0000035189406332658877
  	],
  	[
  		-0.9772857907658441,
  		0.177077455748283,
  		0.0000035591542910183006
  	],
  	[
  		-0.9804806193260158,
  		0.1600531666705619,
  		0.000003444440800272077
  	],
  	[
  		-0.9833784521101117,
  		0.1429819207117631,
  		0.000003180500516633485
  	],
  	[
  		-0.9859789997821056,
  		0.12586914451388,
  		0.000002782468751586402
  	],
  	[
  		-0.9882821194309953,
  		0.108720175297315,
  		0.000002274216734684161
  	],
  	[
  		-0.9902877881011696,
  		0.0915402459230004,
  		0.0000016869477643545768
  	],
  	[
  		-0.9919960727628706,
  		0.07433447767573151,
  		0.00000105714950817576
  	],
  	[
  		-0.9934070988641848,
  		0.05710788208183759,
  		4.240069222468185e-7
  	],
  	[
  		-0.9945210204673063,
  		0.0398653725865426,
  		-1.735304554675646e-7
  	],
  	[
  		-0.995337995741357,
  		0.02261178562287872,
  		-6.997128735502092e-7
  	],
  	[
  		-0.9958581714903011,
  		0.005351908621792906,
  		-0.0000011245857714241341
  	],
  	[
  		-0.9960816789408723,
  		-0.01190948935583015,
  		-0.0000014258386596673871
  	],
  	[
  		-0.9960086405137636,
  		-0.02916762939873661,
  		-0.000001589688302766489
  	],
  	[
  		-0.9956391848098927,
  		-0.04641770102379295,
  		-0.000001610813615220574
  	],
  	[
  		-0.9949734656584488,
  		-0.06365484887531686,
  		-0.00000149156937146941
  	],
  	[
  		-0.9940116812007583,
  		-0.08087416742256574,
  		-0.000001240807928159118
  	],
  	[
  		-0.9927540902224332,
  		-0.09807070161173922,
  		-8.726204362435005e-7
  	],
  	[
  		-0.9912010245417924,
  		-0.1152394508428911,
  		-4.052145034535581e-7
  	],
  	[
  		-0.9893528976200074,
  		-0.1323753738810098,
  		1.399703295811099e-7
  	],
  	[
  		-0.9872102104442831,
  		-0.14947339297897,
  		7.389077562729708e-7
  	],
  	[
  		-0.984773556189869,
  		-0.16652839628054772,
  		0.000001365461301946207
  	],
  	[
  		-0.9820436253206379,
  		-0.1835352383538315,
  		0.000001991811655323385
  	],
  	[
  		-0.9790212127222774,
  		-0.20048873948066062,
  		0.000002588984777807929
  	],
  	[
  		-0.9757072281441925,
  		-0.21738368512859618,
  		0.0000031276428398156965
  	],
  	[
  		-0.9721027105257911,
  		-0.23421482780585154,
  		0.0000035792809375568127
  	],
  	[
  		-0.9682088455698677,
  		-0.2509768940138695,
  		0.000003917902047074769
  	],
  	[
  		-0.9640269842627938,
  		-0.2676645988448234,
  		0.000004122106694311665
  	],
  	[
  		-0.9595586583853891,
  		-0.2842726694985554,
  		0.000004177348714102116
  	],
  	[
  		-0.9548055882623985,
  		-0.3007958765899828,
  		0.000004077938943523049
  	],
  	[
  		-0.9497696788815801,
  		-0.31722906931500416,
  		0.000003828320886351685
  	],
  	[
  		-0.9444530031431203,
  		-0.3335672086685666,
  		0.000003443261285854463
  	],
  	[
  		-0.9388577743365275,
  		-0.3498053930479326,
  		0.000002946862760838784
  	],
  	[
  		-0.9329863124076321,
  		-0.36593887268224184,
  		0.000002370591416031948
  	],
  	[
  		-0.9268410091829541,
  		-0.38196305221701043,
  		0.000001750689695682496
  	],
  	[
  		-0.920424296679013,
  		-0.39787348304708664,
  		0.000001125367177962599
  	],
  	[
  		-0.9137386209588663,
  		-0.41366584797259026,
  		5.320781848608739e-7
  	],
  	[
  		-0.9067864226510061,
  		-0.4293359407079967,
  		5.089228666486342e-9
  	],
  	[
  		-0.8995701245456351,
  		-0.44487964238473304,
  		-4.265327210126984e-7
  	],
  	[
  		-0.8920921263933336,
  		-0.46029289697136744,
  		-7.404134019434448e-7
  	],
  	[
  		-0.8843548067250032,
  		-0.47557168758049895,
  		-9.217712451383802e-7
  	],
  	[
  		-0.8763605309401368,
  		-0.490712015678641,
  		-9.636931437938628e-7
  	],
  	[
  		-0.8681116641558758,
  		-0.5057098849363996,
  		-8.668267873948222e-7
  	],
  	[
  		-0.8596105866924667,
  		-0.5205612907245312,
  		-6.386110232655831e-7
  	],
  	[
  		-0.8508597099033388,
  		-0.5352622152446681,
  		-2.922236436579099e-7
  	],
  	[
  		-0.8418614904349916,
  		-0.5498086273212306,
  		1.545610567442658e-7
  	],
  	[
  		-0.8326184417698074,
  		-0.5641964852682719,
  		6.804456135199013e-7
  	],
  	[
  		-0.8231331427920643,
  		-0.5784217410909419,
  		0.000001261516786336842
  	],
  	[
  		-0.8134082438941009,
  		-0.5924803445171435,
  		0.000001871961237496307
  	],
  	[
  		-0.8034464716985403,
  		-0.6063682458378298,
  		0.000002484628547576468
  	],
  	[
  		-0.793250633808419,
  		-0.6200813971514371,
  		0.0000030715336990282148
  	],
  	[
  		-0.782823625129999,
  		-0.6336157523229753,
  		0.0000036044322036918046
  	],
  	[
  		-0.7721684372060444,
  		-0.6469672667992402,
  		0.000004055627672811266
  	],
  	[
  		-0.7612881715057689,
  		-0.6601318993567293,
  		0.000004399171830303059
  	],
  	[
  		-0.7501860565128924,
  		-0.6731056187230253,
  		0.000004612565422141149
  	],
  	[
  		-0.7388654665868807,
  		-0.6858844183364652,
  		0.000004678934118420824
  	],
  	[
  		-0.7273299382127866,
  		-0.6984643415611975,
  		0.000004589427359191257
  	],
  	[
  		-0.7155831774183005,
  		-0.7108415168882588,
  		0.000004345327314490419
  	],
  	[
  		-0.7036290524120443,
  		-0.7230121984482123,
  		0.000003959202904365698
  	],
  	[
  		-0.6914715689282775,
  		-0.7349728034634583,
  		0.0000034545626280535967
  	],
  	[
  		-0.6791148314000117,
  		-0.74671993763944,
  		0.0000028638805632722022
  	],
  	[
  		-0.6665629979508716,
  		-0.7582504029634696,
  		0.000002225399508619034
  	],
  	[
  		-0.6538202384745281,
  		-0.7695611881332516,
  		0.000001579455341657654
  	],
  	[
  		-0.6408907024602768,
  		-0.7806494465744893,
  		9.650568290751105e-7
  	],
  	[
  		-0.6277784989034776,
  		-0.7915124686436328,
  		4.171813905014786e-7
  	],
  	[
  		-0.6144876871302755,
  		-0.8021476534485705,
  		-3.507847494653063e-8
  	],
  	[
  		-0.6010222757935355,
  		-0.8125524834139958,
  		-3.6960347296130507e-7
  	],
  	[
  		-0.587386227337395,
  		-0.8227245027309631,
  		-5.717353481508268e-7
  	],
  	[
  		-0.5735834659868448,
  		-0.8326612997459972,
  		-6.34314518871349e-7
  	],
  	[
  		-0.5596178880635094,
  		-0.8423604930437105,
  		-5.57372063500714e-7
  	],
  	[
  		-0.5454933738315408,
  		-0.8518197210609011,
  		-3.4754607991457517e-7
  	],
  	[
  		-0.5312138001474607,
  		-0.8610366351757496,
  		-1.728329376169195e-8
  	],
  	[
  		-0.5167830531068478,
  		-0.8700088961499466,
  		4.1610363742260653e-7
  	],
  	[
  		-0.5022050398532516,
  		-0.8787341735543287,
  		9.31440213262872e-7
  	],
  	[
  		-0.4874836988650934,
  		-0.8872101474923557,
  		0.000001504671895313371
  	],
  	[
  		-0.47262300837555077,
  		-0.8954345116957749,
  		0.000002109757592404438
  	],
  	[
  		-0.45762699303389587,
  		-0.9034049770064864,
  		0.000002719443041318544
  	],
  	[
  		-0.44249972938240634,
  		-0.9111192744135052,
  		0.0000033059263194532107
  	],
  	[
  		-0.4272453511163523,
  		-0.9185751571726034,
  		0.000003841474155759066
  	],
  	[
  		-0.4118680553544314,
  		-0.9257704020804027,
  		0.0000042990907128895526
  	],
  	[
  		-0.3963721112008396,
  		-0.9327028107017832,
  		0.000004653373893820145
  	],
  	[
  		-0.3807618715908333,
  		-0.9393702122465787,
  		0.000004881706121594608
  	],
  	[
  		-0.36504178855005076,
  		-0.9457704707398014,
  		0.000004965893396306953
  	],
  	[
  		-0.34921643032134675,
  		-0.9519014997481332,
  		0.0000048942533590481705
  	],
  	[
  		-0.3332904963517954,
  		-0.9577612874640778,
  		0.000004663933098024629
  	],
  	[
  		-0.31726882366978004,
  		-0.963347932511023,
  		0.000004282939532336805
  	],
  	[
  		-0.30115637750439433,
  		-0.9686596862252328,
  		0.000003771128420507252
  	],
  	[
  		-0.28495822207294025,
  		-0.973694992059257,
  		0.000003159449198775344
  	],
  	[
  		-0.26867947431747047,
  		-0.9784525106127147,
  		0.000002487221212264433
  	],
  	[
  		-0.2523252506327087,
  		-0.9829311223635968,
  		0.000001797953148053003
  	],
  	[
  		-0.23590061946799012,
  		-0.9871299081886669,
  		0.0000011347662630422579
  	],
  	[
  		-0.21941056923024924,
  		-0.9910481152822435,
  		5.364949882608113e-7
  	],
  	[
  		-0.20285999400541832,
  		-0.9946851188390721,
  		3.5080667470448814e-8
  	],
  	[
  		-0.1862536937864393,
  		-0.9980403876618308,
  		-3.4569044885345547e-7
  	],
  	[
  		-0.1695963835331479,
  		-1.001113457537473,
  		-5.904175318375748e-7
  	],
  	[
  		-0.15289270599441482,
  		-1.003903912591118,
  		-6.916900581719622e-7
  	],
  	[
  		-0.13614724509503293,
  		-1.006411372967565,
  		-6.493933810135214e-7
  	],
  	[
  		-0.1193645384816856,
  		-1.008635486841072,
  		-4.6990823010545326e-7
  	],
  	[
  		-0.10254908897246912,
  		-1.010575925202032,
  		-1.652857357436244e-7
  	],
  	[
  		-0.0857053751460794,
  		-1.012232378522797,
  		2.475861286451745e-7
  	],
  	[
  		-0.06883786134481908,
  		-1.013604554930448,
  		7.478322680800758e-7
  	],
  	[
  		-0.05195100718888738,
  		-1.014692179787319,
  		0.000001311459872755373
  	],
  	[
  		-0.03504927650583553,
  		-1.015494996610085,
  		0.000001912236153701114
  	],
  	[
  		-0.01813714549794713,
  		-1.016012769132681,
  		0.000002522551457417425
  	],
  	[
  		-0.001219110054384655,
  		-1.016245284158807,
  		0.0000031142456311424606
  	],
  	[
  		0.01570030765494181,
  		-1.016192354772775,
  		0.0000036593917385173588
  	],
  	[
  		0.03261655286116851,
  		-1.01585382356759,
  		0.000004131060272082834
  	],
  	[
  		0.04952503142796662,
  		-1.015229565851338,
  		0.000004504122470774333
  	],
  	[
  		0.06642110176171187,
  		-1.01431949331834,
  		0.0000047561839373760055
  	],
  	[
  		0.0833000646690659,
  		-1.013123559393889,
  		0.000004868756084681383
  	],
  	[
  		0.10015715105096822,
  		-1.011641768272947,
  		0.000004828752409727795
  	],
  	[
  		0.1169875086364983,
  		-1.009874190280702,
  		0.000004630309799305059
  	],
  	[
  		0.13378619102294,
  		-1.007820985990828,
  		0.000004276754391734128
  	],
  	[
  		0.1505481546082106,
  		-1.005482439710641,
  		0.0000037822658419225407
  	],
  	[
  		0.1672682701474265,
  		-1.002858998976625,
  		0.000003172543894007039
  	],
  	[
  		0.18394135357092362,
  		-0.9999513115600291,
  		0.0000024837577869239908
  	],
  	[
  		0.20056221440561683,
  		-0.9967602482708966,
  		0.000001759463575043985
  	],
  	[
  		0.21712571203961503,
  		-0.9932869021969138,
  		0.000001045946403233345
  	],
  	[
  		0.23362680549070372,
  		-0.9895325632383458,
  		3.8714869869984277e-7
  	],
  	[
  		0.25006058503274364,
  		-0.985498676154408,
  		-1.795180576923818e-7
  	],
  	[
  		0.2664222821335208,
  		-0.9811867948123706,
  		-6.256870457763512e-7
  	],
  	[
  		0.2827072620027574,
  		-0.9765985431598694,
  		-9.328276193689003e-7
  	],
  	[
  		0.2989110065724022,
  		-0.9717355877367958,
  		-0.000001091784260769346
  	],
  	[
  		0.3150290949468447,
  		-0.9665996214000343,
  		-0.0000011016663627080729
  	],
  	[
  		0.33105718558893793,
  		-0.9611923552903564,
  		-9.685621037669826e-7
  	],
  	[
  		0.34699100182034615,
  		-0.9555155156653905,
  		-7.043398085074591e-7
  	],
  	[
  		0.36282632048383834,
  		-0.9495708429908053,
  		-3.2562509838185e-7
  	],
  	[
  		0.37855896284201473,
  		-0.9433600917476808,
  		1.470640468249655e-7
  	],
  	[
  		0.3941847866635546,
  		-0.9368850303299576,
  		6.900879947954567e-7
  	],
  	[
  		0.409699678672089,
  		-0.9301474410262243,
  		0.000001277430746788416
  	],
  	[
  		0.4250995468892955,
  		-0.9231491204002868,
  		0.0000018814709775244379
  	],
  	[
  		0.44038031274909256,
  		-0.9158918804542081,
  		0.000002473803585796253
  	],
  	[
  		0.4555379030969949,
  		-0.9083775508532512,
  		0.00000302611248209644
  	],
  	[
  		0.47056824226420124,
  		-0.9006079823158508,
  		0.000003511082141679675
  	],
  	[
  		0.4854672443200902,
  		-0.8925850511380888,
  		0.000003903337517050044
  	],
  	[
  		0.5002308054214576,
  		-0.8843106648353743,
  		0.00000418041800715849
  	],
  	[
  		0.5148547960104738,
  		-0.8757867691083496,
  		0.000004323813854040994
  	],
  	[
  		0.5293350526258214,
  		-0.867015356772051,
  		0.000004320108911555309
  	],
  	[
  		0.5436673694626537,
  		-0.8579984798283089,
  		0.0000041622633224242
  	],
  	[
  		0.5578474907051637,
  		-0.8487382662689792,
  		0.000003851010541753546
  	],
  	[
  		0.5718711060864662,
  		-0.8392369430393702,
  		0.0000033962166578846268
  	],
  	[
  		0.5857338537703924,
  		-0.829496865282332,
  		0.000002817861766757312
  	],
  	[
  		0.5994313355380613,
  		-0.8195205491130058,
  		0.000002146118460710322
  	],
  	[
  		0.6129591478906612,
  		-0.8093107012364483,
  		0.000001419967280878944
  	],
  	[
  		0.6263129279994858,
  		-0.798870235795982,
  		6.840713956972512e-7
  	],
  	[
  		0.6394884066273625,
  		-0.7882022699530089,
  		-1.5750944507801882e-8
  	],
  	[
  		0.652481455217911,
  		-0.7773100961331377,
  		-6.37455779111086e-7
  	],
  	[
  		0.6652881154040671,
  		-0.766197137689509,
  		-0.000001146855257518476
  	],
  	[
  		0.677904606200112,
  		-0.7548669003302046,
  		-0.000001519979067910081
  	],
  	[
  		0.6903273124631601,
  		-0.7433229307929535,
  		-0.000001743577131382664
  	],
  	[
  		0.7025527629321404,
  		-0.7315687887141281,
  		-0.0000018142355890855499
  	],
  	[
  		0.7145776060312535,
  		-0.719608031701205,
  		-0.0000017367957237329409
  	],
  	[
  		0.7263985886723072,
  		-0.7074442101323679,
  		-0.0000015226504383945768
  	],
  	[
  		0.7380125400276436,
  		-0.695080867438319,
  		-0.00000118824754044955
  	],
  	[
  		0.749416360002919,
  		-0.68252154245606,
  		-7.539081865471424e-7
  	],
  	[
  		0.7606070110729637,
  		-0.6697697717602398,
  		-2.4292866801680916e-7
  	],
  	[
  		0.7715815119005893,
  		-0.6568290910624137,
  		3.191320791708927e-7
  	],
  	[
  		0.7823369313587698,
  		-0.6437030356340898,
  		9.050929585373664e-7
  	],
  	[
  		0.7928703819782572,
  		-0.6303951402632465,
  		0.000001486820116899912
  	],
  	[
  		0.803179012318533,
  		-0.6169089395449552,
  		0.000002035997108552506
  	],
  	[
  		0.8132599982337265,
  		-0.6032479693710755,
  		0.00000252503018078654
  	],
  	[
  		0.8231105334057944,
  		-0.5894157703544111,
  		0.000002928084406044558
  	],
  	[
  		0.8327278197744065,
  		-0.575415893658575,
  		0.00000322221479185142
  	],
  	[
  		0.8421090585664799,
  		-0.5612519094073078,
  		0.0000033885391293077595
  	],
  	[
  		0.851251442547868,
  		-0.5469274176385578,
  		0.000003413398277663889
  	],
  	[
  		0.8601521500019205,
  		-0.5324460617375487,
  		0.000003289458389318397
  	],
  	[
  		0.8688083409599563,
  		-0.5178115444177104,
  		0.000003016713133528427
  	],
  	[
  		0.8772171565273421,
  		-0.5030276464625464,
  		0.000002603323133449139
  	],
  	[
  		0.885375722800736,
  		-0.4880982482945333,
  		0.000002066170569772773
  	],
  	[
  		0.8932811616366486,
  		-0.47302735363504694,
  		0.00000143091434178263
  	],
  	[
  		0.9009306108291089,
  		-0.4578191128436063,
  		7.312455300231646e-7
  	],
  	[
  		0.9083212552320948,
  		-0.4424778412774333,
  		7.046434077023046e-9
  	],
  	[
  		0.9154503674024819,
  		-0.4270080263517188,
  		-6.986571078224009e-7
  	],
  	[
  		0.9223153519795345,
  		-0.41141431767461417,
  		-0.000001343671451502348
  	],
  	[
  		0.9289137844804248,
  		-0.395701498743196,
  		-0.0000018908153481928778
  	],
  	[
  		0.935243435286683,
  		-0.37987444494192724,
  		-0.0000023113609773913926
  	],
  	[
  		0.941302274187839,
  		-0.3639380774767734,
  		-0.000002586996999642768
  	],
  	[
  		0.9470884575003412,
  		-0.3478973233545486,
  		-0.000002710112712604618
  	],
  	[
  		0.9526003046268864,
  		-0.3317570876745005,
  		-0.000002682747380367703
  	],
  	[
  		0.9578362718846727,
  		-0.3155222392005119,
  		-0.0000025148228859344776
  	],
  	[
  		0.9627949292909236,
  		-0.2991976063241004,
  		-0.0000022222403486773798
  	],
  	[
  		0.9674749428625706,
  		-0.2827879791389406,
  		-0.000001825210893208985
  	],
  	[
  		0.9718750624698584,
  		-0.26629811381906554,
  		-0.000001346963521832541
  	],
  	[
  		0.9759941138909802,
  		-0.24973273675150312,
  		-8.128109622422501e-7
  	],
  	[
  		0.9798309932461232,
  		-0.2330965471665795,
  		-2.494682167534117e-7
  	],
  	[
  		0.9833846620639952,
  		-0.21639421803546363,
  		3.155123454470158e-7
  	],
  	[
  		0.9866541415740342,
  		-0.1996303957432466,
  		8.543235474536443e-7
  	],
  	[
  		0.9896385052978274,
  		-0.1828096995564136,
  		0.000001339615704654359
  	],
  	[
  		0.9923368696019099,
  		-0.1659367222138205,
  		0.000001745412357000245
  	],
  	[
  		0.9947483825493931,
  		-0.1490160330461048,
  		0.0000020482492601856693
  	],
  	[
  		0.9968722120723268,
  		-0.1320521848068601,
  		0.00000222849157122406
  	],
  	[
  		0.9987075350297101,
  		-0.11504972486052621,
  		0.000002271720230545214
  	],
  	[
  		1.000253528945651,
  		-0.09801321061036472,
  		0.000002170033193800743
  	],
  	[
  		1.001509368049593,
  		-0.08094722827765509,
  		0.000001923095139887315
  	],
  	[
  		1.002474224748029,
  		-0.06385641359955925,
  		0.000001538791985159065
  	],
  	[
  		1.003147277080998,
  		-0.04674547281395577,
  		0.000001033388295335045
  	],
  	[
  		1.003527722303962,
  		-0.02961920233999549,
  		4.31122368371143e-7
  	],
  	[
  		1.003614796553801,
  		-0.01248250556748477,
  		-2.3680968165728258e-7
  	],
  	[
  		1.003407800390414,
  		0.004659595110340389,
  		-9.339236142593861e-7
  	],
  	[
  		1.002906129436183,
  		0.02180195341346089,
  		-0.000001620782578207991
  	],
  	[
  		1.002109308040448,
  		0.0389393041466317,
  		-0.0000022579127506025258
  	],
  	[
  		1.001017022047375,
  		0.05606628007317576,
  		-0.000002809038018134753
  	],
  	[
  		0.9996291452422382,
  		0.0731774405879933,
  		-0.000003244176930565041
  	],
  	[
  		0.9979457541661042,
  		0.09026730884354399,
  		-0.000003542048182784013
  	],
  	[
  		0.9959671283925845,
  		0.1073304111348409,
  		-0.0000036913373151008876
  	],
  	[
  		0.9936937372711802,
  		0.12436131160049152,
  		-0.000003690678366021013
  	],
  	[
  		0.9911262176404851,
  		0.1413546371991615,
  		-0.000003547558460971154
  	],
  	[
  		0.9882653484481431,
  		0.1583050913833406,
  		-0.000003276587267714911
  	],
  	[
  		0.985112027335172,
  		0.1752074580991222,
  		-0.000002897606278652271
  	],
  	[
  		0.9816672520542062,
  		0.19205659947690412,
  		-0.000002433988348332543
  	],
  	[
  		0.9779321073520875,
  		0.20884745073958932,
  		-0.000001911297010188415
  	],
  	[
  		0.9739077563952936,
  		0.2255750150399338,
  		-0.000001356319037141942
  	],
  	[
  		0.9695954350667226,
  		0.24223435981286,
  		-7.963841538465222e-7
  	],
  	[
  		0.9649964472968696,
  		0.2588206151864796,
  		-2.588378427220217e-7
  	],
  	[
  		0.9601121597598852,
  		0.2753289741504475,
  		2.294801774651844e-7
  	],
  	[
  		0.9549439946280064,
  		0.2917546934979176,
  		6.4289053852544e-7
  	],
  	[
  		0.9494934196260365,
  		0.30809309399673324,
  		9.57772039762891e-7
  	],
  	[
  		0.9437619354180433,
  		0.3243395578530318,
  		0.000001153758476947174
  	],
  	[
  		0.9377510614064296,
  		0.34048952147550143,
  		0.0000012152038162188489
  	],
  	[
  		0.9314623221806935,
  		0.3565384620675027,
  		0.0000011327719916609611
  	],
  	[
  		0.9248972377415244,
  		0.3724818778054344,
  		9.04895594106395e-7
  	],
  	[
  		0.9180573207410533,
  		0.3883152631259845,
  		5.387846053338424e-7
  	],
  	[
  		0.9109440829989934,
  		0.4040340823576443,
  		5.069700070652403e-8
  	],
  	[
  		0.9035590516686405,
  		0.4196337458352643,
  		-5.346856082086095e-7
  	],
  	[
  		0.8959037933666769,
  		0.43510959228813473,
  		-0.000001185750010322165
  	],
  	[
  		0.8879799431902211,
  		0.4504568799164095,
  		-0.0000018661246183501058
  	],
  	[
  		0.879789235216411,
  		0.46567078690958613,
  		-0.0000025372685960441938
  	],
  	[
  		0.8713335315507188,
  		0.4807464209264735,
  		-0.000003161212851309051
  	],
  	[
  		0.8626148476479454,
  		0.4956788364673244,
  		-0.000003703225601476188
  	],
  	[
  		0.8536353720232894,
  		0.5104630588229996,
  		-0.000004134200757919318
  	],
  	[
  		0.8443974786143219,
  		0.5250941129126353,
  		-0.000004432568981508401
  	],
  	[
  		0.8349037303508601,
  		0.5395670546120467,
  		-0.000004585536509299045
  	],
  	[
  		0.8251568733590784,
  		0.5538770013935866,
  		-0.000004589508637192918
  	],
  	[
  		0.8151598226998896,
  		0.568019158820775,
  		-0.000004449672252660916
  	],
  	[
  		0.8049156421324375,
  		0.5819888401122528,
  		-0.000004178866699268862
  	],
  	[
  		0.7944275213868452,
  		0.5957814775332221,
  		-0.000003796001781073058
  	],
  	[
  		0.7836987543815549,
  		0.6093926261970893,
  		-0.000003324331059515835
  	],
  	[
  		0.7727327208343561,
  		0.6228179622581558,
  		-0.000002789846004318315
  	],
  	[
  		0.7615328723025621,
  		0.6360532780527176,
  		-0.0000022199537112564556
  	],
  	[
  		0.7501027223894744,
  		0.64909447654411,
  		-0.0000016424850191920329
  	],
  	[
  		0.7384458399752095,
  		0.6619375667526147,
  		-0.0000010849856592656759
  	],
  	[
  		0.7265658439042892,
  		0.6745786610192681,
  		-5.741827444704514e-7
  	],
  	[
  		0.7144663974809828,
  		0.6870139741435122,
  		-1.354886553223769e-7
  	],
  	[
  		0.7021512012796808,
  		0.6992398236857894,
  		2.0760354341793968e-7
  	],
  	[
  		0.6896239831562605,
  		0.7112526300095476,
  		4.3436649531949763e-7
  	],
  	[
  		0.6768884850396634,
  		0.7230489139683824,
  		5.280187848231878e-7
  	],
  	[
  		0.6639484472254452,
  		0.7346252896924412,
  		4.772449012232577e-7
  	],
  	[
  		0.6508075924973967,
  		0.7459784500742512,
  		2.77918655152346e-7
  	],
  	[
  		0.6374696141183889,
  		0.7571051437856876,
  		-6.528714354982884e-8
  	],
  	[
  		0.6239381727000415,
  		0.7680021451903702,
  		-5.378734900990424e-7
  	],
  	[
  		0.6102169061057263,
  		0.7786662217588369,
  		-0.000001115552653950955
  	],
  	[
  		0.596309453417195,
  		0.7890941059967522,
  		-0.0000017656277665669598
  	],
  	[
  		0.5822194896234575,
  		0.7992824787667061,
  		-0.000002449611567091297
  	],
  	[
  		0.5679507642861742,
  		0.8092279678319438,
  		-0.0000031266055370674436
  	],
  	[
  		0.553507136820283,
  		0.8189271610121737,
  		-0.0000037567877091466866
  	],
  	[
  		0.5388926031842848,
  		0.8283766298665549,
  		-0.000004304449100848341
  	],
  	[
  		0.5241113120531148,
  		0.8375729586736601,
  		-0.000004740269866309625
  	],
  	[
  		0.5091675711552865,
  		0.8465127743550674,
  		-0.0000050427743354020535
  	],
  	[
  		0.49406584562175837,
  		0.8551927746496801,
  		-0.000005199049276658148
  	],
  	[
  		0.47881075020211195,
  		0.8636097532101193,
  		-0.0000052048475570909605
  	],
  	[
  		0.4634070367725186,
  		0.8717606209568235,
  		-0.000005064180904993882
  	],
  	[
  		0.4478595782665742,
  		0.8796424231624214,
  		-0.000004788484946201795
  	],
  	[
  		0.432173350202337,
  		0.8872523517522137,
  		-0.000004395444786720071
  	],
  	[
  		0.41635341121955344,
  		0.8945877525206344,
  		-0.000003907596727470552
  	],
  	[
  		0.40040488419470527,
  		0.901646127460682,
  		-0.0000033508486011538248
  	],
  	[
  		0.38433293934658674,
  		0.9084251330311099,
  		-0.000002753064423627876
  	],
  	[
  		0.36814278024793673,
  		0.9149225756926912,
  		-0.000002142829049642749
  	],
  	[
  		0.35183963296156207,
  		0.9211364062409055,
  		-0.000001548452748056139
  	],
  	[
  		0.3354287378290005,
  		0.9270647143053097,
  		-9.972110549414382e-7
  	],
  	[
  		0.31891534291296586,
  		0.9327057239548282,
  		-5.147577287575752e-7
  	],
  	[
  		0.3023046977941474,
  		0.9380577907588141,
  		-1.246067456431897e-7
  	],
  	[
  		0.285602046348653,
  		0.9431193999841426,
  		1.524447733965944e-7
  	],
  	[
  		0.26881261729268074,
  		0.9478891648814529,
  		2.990855151873077e-7
  	],
  	[
  		0.25194161175583113,
  		0.9523658232423954,
  		3.0256144114636736e-7
  	],
  	[
  		0.23499418810018038,
  		0.9565482297029982,
  		1.560938351347967e-7
  	],
  	[
  		0.21797544580029982,
  		0.9604353409637936,
  		-1.39445800662351e-7
  	],
  	[
  		0.2008904123358342,
  		0.9640261918236981,
  		-5.739013258601784e-7
  	],
  	[
  		0.1837440389691785,
  		0.9673198623651231,
  		-0.0000011267671586462658
  	],
  	[
  		0.16654121144563783,
  		0.9703154407836673,
  		-0.0000017673417066850158
  	],
  	[
  		0.1492867785090998,
  		0.9730119906441026,
  		-0.0000024565772034769646
  	],
  	[
  		0.1319855948735942,
  		0.9754085327677514,
  		-0.000003150585862291439
  	],
  	[
  		0.11464256899601591,
  		0.9775040483274081,
  		-0.000003805112570125377
  	],
  	[
  		0.09726270381929718,
  		0.97929750234243,
  		-0.00000437990477359158
  	],
  	[
  		0.07985112210473974,
  		0.9807878800493802,
  		-0.000004842045856010062
  	],
  	[
  		0.062413074423579434,
  		0.981974226324619,
  		-0.000005167831605091303
  	],
  	[
  		0.044953933228235855,
  		0.9828556805683357,
  		-0.000005343299751265165
  	],
  	[
  		0.02747917850952912,
  		0.9834315035826551,
  		-0.000005363811615460705
  	],
  	[
  		0.009994379853334102,
  		0.9837010963864261,
  		-0.000005233109894227193
  	],
  	[
  		-0.007494822135083026,
  		0.9836640125814062,
  		-0.000004962155655460382
  	],
  	[
  		-0.02498273376585564,
  		0.9833199661011017,
  		-0.0000045679032346477485
  	],
  	[
  		-0.042463625291619726,
  		0.9826688356605454,
  		-0.000004072069924548012
  	],
  	[
  		-0.059931747092352106,
  		0.9817106665939822,
  		-0.000003499912307635907
  	],
  	[
  		-0.07738134499513337,
  		0.9804456703550424,
  		-0.0000028790187716276212
  	],
  	[
  		-0.09480667448681429,
  		0.9788742218556371,
  		-0.000002238144884533291
  	],
  	[
  		-0.1122020134500662,
  		0.9769968549651875,
  		-0.000001606133303626378
  	],
  	[
  		-0.1295616731275779,
  		0.9748142567253,
  		-0.0000010109590838022159
  	],
  	[
  		-0.14688000728760572,
  		0.9723272609950261,
  		-4.789212216988737e-7
  	],
  	[
  		-0.1641514199367994,
  		0.9695368422195723,
  		-3.396737606059912e-8
  	],
  	[
  		-0.1813703722855683,
  		0.9664441097759161,
  		3.028994565370247e-7
  	]
  ];
  var earthOrbit = {
  	targetName: targetName$2,
  	name: name$2,
  	startDate: startDate$2,
  	stopDate: stopDate$2,
  	stepSize: stepSize$2,
  	coords: coords$2
  };

  var earthOrbit$1 = {
    __proto__: null,
    targetName: targetName$2,
    name: name$2,
    startDate: startDate$2,
    stopDate: stopDate$2,
    stepSize: stepSize$2,
    coords: coords$2,
    'default': earthOrbit
  };

  var targetName$3 = "mars";
  var name$3 = "Mars";
  var startDate$3 = "2000-01-01";
  var stopDate$3 = "2002-01-01";
  var stepSize$3 = 2;
  var coords$3 = [
  	[
  		1.390361066039004,
  		-0.021009722258984672,
  		-0.0346180144092705
  	],
  	[
  		1.39155129403576,
  		0.009365281178634716,
  		-0.034010945018374414
  	],
  	[
  		1.392130897432341,
  		0.039736206995986775,
  		-0.03338895139602538
  	],
  	[
  		1.392101067853835,
  		0.07008976998315918,
  		-0.03275234116231108
  	],
  	[
  		1.391463326927226,
  		0.1004127587222285,
  		-0.03210142850535813
  	],
  	[
  		1.39021952215839,
  		0.1306920452641047,
  		-0.031436533872103156
  	],
  	[
  		1.388371822487461,
  		0.1609145945844426,
  		-0.03075798366305012
  	],
  	[
  		1.385922713524187,
  		0.1910674737859915,
  		-0.03006610992664133
  	],
  	[
  		1.382874992453734,
  		0.22113786105330568,
  		-0.02936125004026129
  	],
  	[
  		1.379231762665812,
  		0.2511130543177759,
  		-0.02864374639912334
  	],
  	[
  		1.374996428101395,
  		0.2809804796397719,
  		-0.027913946101345642
  	],
  	[
  		1.370172687346227,
  		0.3107276993217019,
  		-0.02717220063572389
  	],
  	[
  		1.364764527465953,
  		0.34034241969637113,
  		-0.02641886556400248
  	],
  	[
  		1.358776217617836,
  		0.36981249861559873,
  		-0.02565430020512184
  	],
  	[
  		1.352212302471209,
  		0.3991259526197121,
  		-0.024878867330772103
  	],
  	[
  		1.345077595411906,
  		0.4282709637992035,
  		-0.02409293285003828
  	],
  	[
  		1.337377171583666,
  		0.4572358863258509,
  		-0.023296865502911983
  	],
  	[
  		1.329116360771651,
  		0.48600925264093037,
  		-0.022491036556559377
  	],
  	[
  		1.320300740154895,
  		0.5145797793463666,
  		-0.021675819507411643
  	],
  	[
  		1.310936126929066,
  		0.5429363727528622,
  		-0.020851589784548083
  	],
  	[
  		1.301028570810359,
  		0.5710681341067025,
  		-0.020018724451035932
  	],
  	[
  		1.290584346468456,
  		0.5989643644940302,
  		-0.019177601922227103
  	],
  	[
  		1.279609945851147,
  		0.6266145694329369,
  		-0.0183286016769119
  	],
  	[
  		1.26811207043073,
  		0.6540084631494111,
  		-0.01747210397261983
  	],
  	[
  		1.256097623383547,
  		0.6811359724941232,
  		-0.01660848956700382
  	],
  	[
  		1.243573701726074,
  		0.7079872405443828,
  		-0.01573813944591295
  	],
  	[
  		1.230547588432602,
  		0.7345526298581846,
  		-0.01486143456137711
  	],
  	[
  		1.217026744537946,
  		0.7608227253868771,
  		-0.01397875556803195
  	],
  	[
  		1.203018801292536,
  		0.7867883370672618,
  		-0.013090482581512
  	],
  	[
  		1.188531552349953,
  		0.812440502108659,
  		-0.01219699494158756
  	],
  	[
  		1.173572945995494,
  		0.8377704870092311,
  		-0.011298670978547549
  	],
  	[
  		1.158151077431214,
  		0.8627697892626343,
  		-0.01039588779025846
  	],
  	[
  		1.142274181118769,
  		0.8874301388033757,
  		-0.009489021024470795
  	],
  	[
  		1.125950623201438,
  		0.9117434991914415,
  		-0.00857844467445747
  	],
  	[
  		1.109188893975698,
  		0.935702068522319,
  		-0.007664530869189884
  	],
  	[
  		1.091997600462716,
  		0.9592982800829569,
  		-0.00674764967831552
  	],
  	[
  		1.074385459078987,
  		0.9825248027465272,
  		-0.005828168927994048
  	],
  	[
  		1.056361288396159,
  		1.005374541150384,
  		-0.0049064540162400356
  	],
  	[
  		1.037934002017052,
  		1.027840635618763,
  		-0.003982867740033585
  	],
  	[
  		1.019112601562547,
  		1.049916461857164,
  		-0.0030577701262747723
  	],
  	[
  		0.999906169802923,
  		1.071595630448576,
  		-0.002131518279679269
  	],
  	[
  		0.9803238638987088,
  		1.092871986131328,
  		-0.0012044662281448192
  	],
  	[
  		0.9603749087793434,
  		1.113739606885809,
  		-0.00027696477587216197
  	],
  	[
  		0.9400685906792197,
  		1.134192802815895,
  		0.0006506386268175433
  	],
  	[
  		0.9194142508051432,
  		1.154226114875118,
  		0.001578000014724718
  	],
  	[
  		0.8984212791586125,
  		1.173834313416965,
  		0.0025047790283476775
  	],
  	[
  		0.877099108499423,
  		1.193012396567169,
  		0.003430639032309355
  	],
  	[
  		0.855457208484069,
  		1.211755588465342,
  		0.0043552472178497136
  	],
  	[
  		0.833505079952142,
  		1.230059337355813,
  		0.0052782747025440216
  	],
  	[
  		0.8112522493588122,
  		1.247919313552713,
  		0.006199396630631881
  	],
  	[
  		0.7887082633890801,
  		1.265331407262707,
  		0.007118292255012574
  	],
  	[
  		0.7658826837231749,
  		1.282291726304151,
  		0.008034645018907431
  	],
  	[
  		0.742785081968626,
  		1.298796593729769,
  		0.008948142629399861
  	],
  	[
  		0.7194250347431306,
  		1.314842545323138,
  		0.009858477129584424
  	],
  	[
  		0.6958121189322375,
  		1.330426327020085,
  		0.01076534495954185
  	],
  	[
  		0.671955907115549,
  		1.345544892241926,
  		0.01166844700777867
  	],
  	[
  		0.6478659631308485,
  		1.360195399159271,
  		0.012567488669694551
  	],
  	[
  		0.6235518378185784,
  		1.374375207874063,
  		0.013462179890013191
  	],
  	[
  		0.5990230649218633,
  		1.38808187753594,
  		0.01435223520212364
  	],
  	[
  		0.5742891571489829,
  		1.401313163428737,
  		0.01523737376183936
  	],
  	[
  		0.5493596023853508,
  		1.414067013982248,
  		0.01611731937920748
  	],
  	[
  		0.5242438600635592,
  		1.426341567751783,
  		0.01699180054582653
  	],
  	[
  		0.49895135770925503,
  		1.438135150365594,
  		0.01786055044712425
  	],
  	[
  		0.47349148761391124,
  		1.449446271454797,
  		0.01872330698424007
  	],
  	[
  		0.44787360366749973,
  		1.460273621565947,
  		0.019579812786482388
  	],
  	[
  		0.422107018333249,
  		1.470616069049607,
  		0.02042981521945784
  	],
  	[
  		0.396200999754351,
  		1.480472656977774,
  		0.02127306639218527
  	],
  	[
  		0.37016476897750533,
  		1.489842600040471,
  		0.02210932316330481
  	],
  	[
  		0.34400749727923663,
  		1.498725281430023,
  		0.022938347151324052
  	],
  	[
  		0.3177383036345908,
  		1.507120249711531,
  		0.023759904728214792
  	],
  	[
  		0.2913662522915386,
  		1.515027215675437,
  		0.02457376701824156
  	],
  	[
  		0.2649003504801219,
  		1.522446049185877,
  		0.0253797098919943
  	],
  	[
  		0.23834954626814212,
  		1.52937677600389,
  		0.02617751395022795
  	],
  	[
  		0.21172272655257798,
  		1.535819574651645,
  		0.026966964505336272
  	],
  	[
  		0.1850287151836529,
  		1.541774773301281,
  		0.02774785155720259
  	],
  	[
  		0.1582762711871949,
  		1.547242846684557,
  		0.0285199697768914
  	],
  	[
  		0.1314740871206068,
  		1.552224413043225,
  		0.02928311847695832
  	],
  	[
  		0.10463078752629301,
  		1.556720231109803,
  		0.0300371015830997
  	],
  	[
  		0.07775492747256188,
  		1.560731197141013,
  		0.0307817276114726
  	],
  	[
  		0.05085499119985189,
  		1.564258341958813,
  		0.03151680963812279
  	],
  	[
  		0.023939390855510032,
  		1.567302828037987,
  		0.032242165269840015
  	],
  	[
  		-0.002983534669568999,
  		1.569865946643156,
  		0.03295761660797632
  	],
  	[
  		-0.02990552084008304,
  		1.571949114986722,
  		0.03366299022187663
  	],
  	[
  		-0.05681837847759464,
  		1.573553873433498,
  		0.03435811711457988
  	],
  	[
  		-0.08371399467169814,
  		1.574681882736189,
  		0.03504283268211948
  	],
  	[
  		-0.1105843336308666,
  		1.575334921334834,
  		0.03571697668224477
  	],
  	[
  		-0.1374214374484654,
  		1.575514882680897,
  		0.03638039319618386
  	],
  	[
  		-0.1642174268032761,
  		1.57522377259926,
  		0.037032930592679134
  	],
  	[
  		-0.1909645015747845,
  		1.574463706717831,
  		0.03767444148398433
  	],
  	[
  		-0.2176549414105093,
  		1.573236907927189,
  		0.03830478268950317
  	],
  	[
  		-0.2442811062314818,
  		1.571545703893205,
  		0.03892381519988138
  	],
  	[
  		-0.2708354366580958,
  		1.569392524604362,
  		0.03953140412959312
  	],
  	[
  		-0.2973104543967252,
  		1.566779899985985,
  		0.04012741867932831
  	],
  	[
  		-0.32369876256593244,
  		1.563710457559864,
  		0.040711732094686905
  	],
  	[
  		-0.3499930459785565,
  		1.560186920131964,
  		0.04128422162734241
  	],
  	[
  		-0.37618607136018073,
  		1.556212103553853,
  		0.04184476848976728
  	],
  	[
  		-0.4022706875273458,
  		1.551788914523929,
  		0.042393257812341
  	],
  	[
  		-0.428239825537489,
  		1.54692034844188,
  		0.042929578608880775
  	],
  	[
  		-0.4540864987730731,
  		1.541609487301064,
  		0.04345362372897967
  	],
  	[
  		-0.4798038029982382,
  		1.535859497638403,
  		0.04396528981696285
  	],
  	[
  		-0.5053849163763107,
  		1.529673628547088,
  		0.04446447727078086
  	],
  	[
  		-0.5308230994579157,
  		1.52305520970886,
  		0.044951090202527716
  	],
  	[
  		-0.5561116951273777,
  		1.516007649493229,
  		0.04542503639606234
  	],
  	[
  		-0.5812441285080551,
  		1.508534433103353,
  		0.04588622726002156
  	],
  	[
  		-0.6062139068617793,
  		1.500639120771446,
  		0.04633457779423301
  	],
  	[
  		-0.6310146194371119,
  		1.492325345996882,
  		0.04677000654509518
  	],
  	[
  		-0.6556399372919446,
  		1.483596813829405,
  		0.04719243556254925
  	],
  	[
  		-0.6800836130913095,
  		1.474457299232241,
  		0.04760179036014651
  	],
  	[
  		-0.7043394808861969,
  		1.464910645473974,
  		0.04799799987649835
  	],
  	[
  		-0.7284014558787275,
  		1.454960762586059,
  		0.04838099644003569
  	],
  	[
  		-0.7522635341606856,
  		1.444611625882923,
  		0.0487507157259371
  	],
  	[
  		-0.7759197924813775,
  		1.433867274531549,
  		0.049107096729385596
  	],
  	[
  		-0.7993643880118975,
  		1.42273181016002,
  		0.04945008173548335
  	],
  	[
  		-0.8225915581072281,
  		1.411209395474241,
  		0.0497796162857718
  	],
  	[
  		-0.8455956200649745,
  		1.399304252923672,
  		0.050095649147674025
  	],
  	[
  		-0.8683709708639384,
  		1.3870206633723,
  		0.050398132280823196
  	],
  	[
  		-0.8909120868879286,
  		1.374362964794125,
  		0.05068702080717143
  	],
  	[
  		-0.9132135235997447,
  		1.361335551020131,
  		0.050962272967784675
  	],
  	[
  		-0.9352699152148164,
  		1.347942870529605,
  		0.05122385008887502
  	],
  	[
  		-0.9570759743678798,
  		1.334189425299198,
  		0.051471716551148225
  	],
  	[
  		-0.9786264917633354,
  		1.32007976967526,
  		0.05170583975261971
  	],
  	[
  		-0.9999163358317192,
  		1.305618509313176,
  		0.0519261900772045
  	],
  	[
  		-1.020940452383334,
  		1.290810300158565,
  		0.05213274086189888
  	],
  	[
  		-1.041693864283513,
  		1.275659847449603,
  		0.05232546837351779
  	],
  	[
  		-1.062171671110769,
  		1.260171904767988,
  		0.05250435177613346
  	],
  	[
  		-1.082369048822942,
  		1.244351273118998,
  		0.05266937310085723
  	],
  	[
  		-1.102281249444214,
  		1.228202800060433,
  		0.05282051722564658
  	],
  	[
  		-1.121903600742516,
  		1.211731378840869,
  		0.052957771846756645
  	],
  	[
  		-1.141231505919311,
  		1.194941947577872,
  		0.05308112745469212
  	],
  	[
  		-1.160260443296097,
  		1.17783948848397,
  		0.053190577306763194
  	],
  	[
  		-1.178985966027552,
  		1.160429027100731,
  		0.053286117409139785
  	],
  	[
  		-1.197403701811934,
  		1.142715631572687,
  		0.05336774649465743
  	],
  	[
  		-1.21550935259866,
  		1.124704411942534,
  		0.05343546599486442
  	],
  	[
  		-1.233298694327393,
  		1.106400519491661,
  		0.05348928002534912
  	],
  	[
  		-1.250767576664995,
  		1.087809146093452,
  		0.05352919536456392
  	],
  	[
  		-1.267911922758595,
  		1.068935523584217,
  		0.05355522143555252
  	],
  	[
  		-1.284727728988602,
  		1.049784923186068,
  		0.053567370283975554
  	],
  	[
  		-1.301211064747816,
  		1.03036265493579,
  		0.05356565656300599
  	],
  	[
  		-1.317358072237,
  		1.010674067142896,
  		0.05355009752114107
  	],
  	[
  		-1.333164966251562,
  		0.9907245458636571,
  		0.05352071297867436
  	],
  	[
  		-1.348628034002689,
  		0.970519514410769,
  		0.053477525316341507
  	],
  	[
  		-1.363743634947322,
  		0.9500644328844434,
  		0.05342055946174438
  	],
  	[
  		-1.37850820063606,
  		0.9293647977009636,
  		0.053349842876540356
  	],
  	[
  		-1.392918234567405,
  		0.9084261411678064,
  		0.053265405541198824
  	],
  	[
  		-1.406970312060531,
  		0.8872540310678524,
  		0.05316727994133727
  	],
  	[
  		-1.420661080161478,
  		0.8658540702605646,
  		0.05305550106371338
  	],
  	[
  		-1.433987257539325,
  		0.844231896295558,
  		0.052930106379000544
  	],
  	[
  		-1.446945634410436,
  		0.8223931810465276,
  		0.05279113583182352
  	],
  	[
  		-1.459533072479558,
  		0.8003436303769382,
  		0.0526386318331304
  	],
  	[
  		-1.471746504895905,
  		0.7780889837922678,
  		0.05247263925133364
  	],
  	[
  		-1.483582936220472,
  		0.7556350141293776,
  		0.052293205403495684
  	],
  	[
  		-1.495039442398701,
  		0.7329875272675993,
  		0.052100380042371774
  	],
  	[
  		-1.506113170777236,
  		0.7101523618575043,
  		0.05189421535801295
  	],
  	[
  		-1.51680134012338,
  		0.687135389073488,
  		0.05167476597040146
  	],
  	[
  		-1.527101240677631,
  		0.6639425123820922,
  		0.05144208892503938
  	],
  	[
  		-1.53701023425292,
  		0.6405796673522789,
  		0.05119624369679708
  	],
  	[
  		-1.546525754374694,
  		0.6170528214425873,
  		0.050937292193346646
  	],
  	[
  		-1.555645306462415,
  		0.5933679737847727,
  		0.05066529876157273
  	],
  	[
  		-1.564366468017031,
  		0.5695311549628487,
  		0.05038033018367031
  	],
  	[
  		-1.572686888846231,
  		0.5455484267718801,
  		0.050082455684036686
  	],
  	[
  		-1.580604291285983,
  		0.521425881976496,
  		0.04977174692992442
  	],
  	[
  		-1.588116470417764,
  		0.4971696440595511,
  		0.04944827802508169
  	],
  	[
  		-1.595221294306755,
  		0.47278586701099035,
  		0.04911212551051206
  	],
  	[
  		-1.601916704254181,
  		0.44828073511710564,
  		0.048763368363483627
  	],
  	[
  		-1.608200715083219,
  		0.42366046275192465,
  		0.04840208800257706
  	],
  	[
  		-1.61407141542889,
  		0.398931294194358,
  		0.04802836828360259
  	],
  	[
  		-1.61952696807117,
  		0.3740995034436133,
  		0.04764229550448187
  	],
  	[
  		-1.624565610302823,
  		0.3491713940452093,
  		0.0472439584150896
  	],
  	[
  		-1.629185654307583,
  		0.3241532988970338,
  		0.0468334482175745
  	],
  	[
  		-1.633385487576002,
  		0.2990515800735671,
  		0.046410858573970384
  	],
  	[
  		-1.637163573343088,
  		0.27387262865160433,
  		0.045976285611918105
  	],
  	[
  		-1.640518451067759,
  		0.2486228645102082,
  		0.04552982793714942
  	],
  	[
  		-1.643448736921306,
  		0.22330873614342572,
  		0.04507158663826388
  	],
  	[
  		-1.645953124303404,
  		0.19793672046122812,
  		0.044601665292121305
  	],
  	[
  		-1.648030384404536,
  		0.17251332259542052,
  		0.04412016998049983
  	],
  	[
  		-1.649679366776148,
  		0.1470450756798016,
  		0.04362720929601175
  	],
  	[
  		-1.650898999935327,
  		0.1215385406271301,
  		0.043122894352724254
  	],
  	[
  		-1.651688291989705,
  		0.09600030591676284,
  		0.04260733879497863
  	],
  	[
  		-1.652046331304253,
  		0.07043698734602058,
  		0.04208065881254356
  	],
  	[
  		-1.651972287187703,
  		0.04485522778230303,
  		0.041542973152822606
  	],
  	[
  		-1.651465410592369,
  		0.0192616968986361,
  		0.040994403126041086
  	],
  	[
  		-1.650525034866307,
  		-0.00633690909281893,
  		0.040435072624466904
  	],
  	[
  		-1.649150576519008,
  		-0.03193386773199249,
  		0.03986510813390276
  	],
  	[
  		-1.647341536017414,
  		-0.05752243062899393,
  		0.03928463874623937
  	],
  	[
  		-1.645097498603221,
  		-0.08309582377066077,
  		0.038693796170946045
  	],
  	[
  		-1.642418135146923,
  		-0.10864724786596991,
  		0.03809271475029438
  	],
  	[
  		-1.63930320303502,
  		-0.1341698787080458,
  		0.03748153147780307
  	],
  	[
  		-1.635752547060413,
  		-0.15965686755811762,
  		0.03686038600438784
  	],
  	[
  		-1.631766100361388,
  		-0.1851013415446335,
  		0.03622942065646339
  	],
  	[
  		-1.627343885382571,
  		-0.21049640408325854,
  		0.03558878045178476
  	],
  	[
  		-1.622486014859331,
  		-0.23583513534601772,
  		0.034938613112452804
  	],
  	[
  		-1.617192692823709,
  		-0.2611105927287012,
  		0.034279069077933946
  	],
  	[
  		-1.611464215633742,
  		-0.28631581135387857,
  		0.03361030151720466
  	],
  	[
  		-1.605300973043654,
  		-0.31144380460692844,
  		0.032932466349597275
  	],
  	[
  		-1.598703449269345,
  		-0.33648756469617647,
  		0.032245722251930904
  	],
  	[
  		-1.591672224087612,
  		-0.3614400632379822,
  		0.0315502306721098
  	],
  	[
  		-1.584207973964729,
  		-0.3862942518485229,
  		0.03084615584704837
  	],
  	[
  		-1.57631147320812,
  		-0.41104306278683833,
  		0.03013366481686264
  	],
  	[
  		-1.567983595154855,
  		-0.43567940960355056,
  		0.02941292744257078
  	],
  	[
  		-1.559225313392441,
  		-0.4601961878166635,
  		0.02868411642071013
  	],
  	[
  		-1.550037703049418,
  		-0.48458627564385603,
  		0.02794740731120264
  	],
  	[
  		-1.540421942104681,
  		-0.5088425347887925,
  		0.02720297855464938
  	],
  	[
  		-1.530379312721091,
  		-0.5329578113011862,
  		0.02645101148664096
  	],
  	[
  		-1.519911202603184,
  		-0.5569249364769269,
  		0.02569169035704551
  	],
  	[
  		-1.509019106351705,
  		-0.5807367278384618,
  		0.02492520234117871
  	],
  	[
  		-1.497704626825949,
  		-0.6043859901585825,
  		0.024151737551703693
  	],
  	[
  		-1.485969476496082,
  		-0.6278655165087519,
  		0.02337148904173311
  	],
  	[
  		-1.473815478831089,
  		-0.6511680893603919,
  		0.022584652818542522
  	],
  	[
  		-1.46124456969743,
  		-0.6742864817236556,
  		0.02179142785412217
  	],
  	[
  		-1.448258798762645,
  		-0.6972134583468721,
  		0.020992016087804443
  	],
  	[
  		-1.434860330932953,
  		-0.7199417769438768,
  		0.02018662243822368
  	],
  	[
  		-1.421051447802584,
  		-0.7424641894872187,
  		0.01937545481095169
  	],
  	[
  		-1.406834549127498,
  		-0.7647734435736255,
  		0.0185587241089502
  	],
  	[
  		-1.392212154294521,
  		-0.7868622838279667,
  		0.017736644234271983
  	],
  	[
  		-1.37718690381472,
  		-0.8087234533806724,
  		0.01690943209467728
  	],
  	[
  		-1.361761560836367,
  		-0.8303496954037719,
  		0.01607730761439017
  	],
  	[
  		-1.345939012643754,
  		-0.8517337547291556,
  		0.01524049373134298
  	],
  	[
  		-1.329722272175181,
  		-0.8728683795201848,
  		0.01439921640126538
  	],
  	[
  		-1.313114479540014,
  		-0.8937463230066567,
  		0.01355370459829328
  	],
  	[
  		-1.296118903547896,
  		-0.9143603453179442,
  		0.01270419031761904
  	],
  	[
  		-1.278738943223723,
  		-0.9347032153691384,
  		0.01185090857083077
  	],
  	[
  		-1.260978129318085,
  		-0.9547677128288359,
  		0.010994097378367209
  	],
  	[
  		-1.242840125835032,
  		-0.9745466301578747,
  		0.01013399777190376
  	],
  	[
  		-1.22432873153043,
  		-0.9940327747401162,
  		0.00927085378243128
  	],
  	[
  		-1.205447881408126,
  		-1.013218971092134,
  		0.008404912430695223
  	],
  	[
  		-1.186201648200774,
  		-1.032098063133432,
  		0.007536423715507026
  	],
  	[
  		-1.166594243844817,
  		-1.050662916569264,
  		0.006665640602665659
  	],
  	[
  		-1.146630020932839,
  		-1.068906421346819,
  		0.005792819010079416
  	],
  	[
  		-1.126313474129166,
  		-1.086821494198889,
  		0.004918217782661476
  	],
  	[
  		-1.105649241587559,
  		-1.104401081271744,
  		0.004042098678666263
  	],
  	[
  		-1.084642106326636,
  		-1.121638160849116,
  		0.003164726345208514
  	],
  	[
  		-1.063296997573514,
  		-1.138525746180793,
  		0.002286368290164572
  	],
  	[
  		-1.041618992072058,
  		-1.155056888375301,
  		0.001407294853028158
  	],
  	[
  		-1.019613315356492,
  		-1.171224679408207,
  		0.0005277791734514792
  	],
  	[
  		-0.9972853429889027,
  		-1.187022255226118,
  		-0.0003519028397621683
  	],
  	[
  		-0.9746406017241798,
  		-1.20244279894165,
  		-0.0012314725551229
  	],
  	[
  		-0.9516847706436913,
  		-1.217479544124136,
  		-0.0021106486569760323
  	],
  	[
  		-0.9284236822281562,
  		-1.23212577818143,
  		-0.002989147188969072
  	],
  	[
  		-0.9048633233594761,
  		-1.246374845860058,
  		-0.003866681606619995
  	],
  	[
  		-0.8810098362575629,
  		-1.260220152809911,
  		-0.00474296283006517
  	],
  	[
  		-0.8568695193445661,
  		-1.273655169244336,
  		-0.00561769930193142
  	],
  	[
  		-0.8324488280575782,
  		-1.286673433697405,
  		-0.0064905970394216524
  	],
  	[
  		-0.8077543755690263,
  		-1.299268556859176,
  		-0.007361359700878776
  	],
  	[
  		-0.7827929334528857,
  		-1.311434225507622,
  		-0.008229688648846895
  	],
  	[
  		-0.7575714322925098,
  		-1.3231642065293,
  		-0.00909528301039289
  	],
  	[
  		-0.7320969621981904,
  		-1.334452351082511,
  		-0.009957839749604288
  	],
  	[
  		-0.7063767732319284,
  		-1.345292598863887,
  		-0.010817053742606511
  	],
  	[
  		-0.6804182757062568,
  		-1.35567898248185,
  		-0.0116726178643352
  	],
  	[
  		-0.6542290403763362,
  		-1.365605631951363,
  		-0.01252422307223739
  	],
  	[
  		-0.6278167984793581,
  		-1.375066779271479,
  		-0.013371558505071051
  	],
  	[
  		-0.6011894416346368,
  		-1.384056763093299,
  		-0.01421431158943088
  	],
  	[
  		-0.5743550216263634,
  		-1.392570033446248,
  		-0.01505216814096402
  	],
  	[
  		-0.5473217500402198,
  		-1.400601156563068,
  		-0.01588481247738431
  	],
  	[
  		-0.5200979977668245,
  		-1.408144819782247,
  		-0.01671192753310524
  	],
  	[
  		-0.4926922943481195,
  		-1.415195836506375,
  		-0.01753319498428827
  	],
  	[
  		-0.46511332719370674,
  		-1.421749151253228,
  		-0.01834829537034649
  	],
  	[
  		-0.4373699406380263,
  		-1.427799844773105,
  		-0.019156908222253792
  	],
  	[
  		-0.4094711348177569,
  		-1.433343139245009,
  		-0.019958712205638322
  	],
  	[
  		-0.3814260643999061,
  		-1.438374403519365,
  		-0.020753385258064153
  	],
  	[
  		-0.3532440371272423,
  		-1.442889158428098,
  		-0.0215406047366551
  	],
  	[
  		-0.324934512187805,
  		-1.446883082166944,
  		-0.022320047569585708
  	],
  	[
  		-0.2965070983832429,
  		-1.450352015700343,
  		-0.023091390418365953
  	],
  	[
  		-0.2679715521126367,
  		-1.453291968221834,
  		-0.02385430984215748
  	],
  	[
  		-0.2393377751694401,
  		-1.455699122646797,
  		-0.0246084824614885
  	],
  	[
  		-0.21061581230834792,
  		-1.457569841143656,
  		-0.025353585141113372
  	],
  	[
  		-0.1818158486174552,
  		-1.458900670675758,
  		-0.02608929516948079
  	],
  	[
  		-0.15294820667182102,
  		-1.459688348547027,
  		-0.0268152904450502
  	],
  	[
  		-0.1240233434715987,
  		-1.459929807981096,
  		-0.02753124966737734
  	],
  	[
  		-0.09505184714530239,
  		-1.459622183673673,
  		-0.02823685253665138
  	],
  	[
  		-0.06604443341880192,
  		-1.458762817336884,
  		-0.028931779960995774
  	],
  	[
  		-0.037011941873684145,
  		-1.457349263220663,
  		-0.02961571425702304
  	],
  	[
  		-0.007965331943564115,
  		-1.455379293609423,
  		-0.03028833936827913
  	],
  	[
  		0.02108432132458744,
  		-1.45285090427789,
  		-0.03094934108483698
  	],
  	[
  		0.0501258317521504,
  		-1.449762319872101,
  		-0.0315984072655138
  	],
  	[
  		0.07914790675446813,
  		-1.44611199925691,
  		-0.03223522806514299
  	],
  	[
  		0.10813915231757701,
  		-1.441898640778088,
  		-0.03285949616613195
  	],
  	[
  		0.13708807824247402,
  		-1.437121187434715,
  		-0.03347090702223453
  	],
  	[
  		0.16598310361541202,
  		-1.431778831956896,
  		-0.03406915909311719
  	],
  	[
  		0.19481256254584042,
  		-1.425871021775845,
  		-0.03465395409050881
  	],
  	[
  		0.2235647101626264,
  		-1.419397463885639,
  		-0.035224997230781034
  	],
  	[
  		0.2522277288585117,
  		-1.412358129541726,
  		-0.03578199748619603
  	],
  	[
  		0.2807897347881898,
  		-1.404753258830611,
  		-0.03632466784118752
  	],
  	[
  		0.3092387846100738,
  		-1.396583365078828,
  		-0.036852725547399365
  	],
  	[
  		0.33756288249993804,
  		-1.387849239069553,
  		-0.0373658923919617
  	],
  	[
  		0.36574998738589026,
  		-1.378551953066831,
  		-0.03786389495669294
  	],
  	[
  		0.3937880204159575,
  		-1.368692864620234,
  		-0.03834646487756088
  	],
  	[
  		0.42166487265835323,
  		-1.358273620166142,
  		-0.03881333911125331
  	],
  	[
  		0.4493684130003803,
  		-1.347296158371325,
  		-0.03926426019447967
  	],
  	[
  		0.47688649624946544,
  		-1.335762713246891,
  		-0.03969897650533423
  	],
  	[
  		0.5042069714138361,
  		-1.323675817042499,
  		-0.04011724251753088
  	],
  	[
  		0.5313176902066035,
  		-1.311038302882565,
  		-0.04051881906656164
  	],
  	[
  		0.5582065157453173,
  		-1.297853307148892,
  		-0.04090347361332224
  	],
  	[
  		0.5848613314399393,
  		-1.284124271567637,
  		-0.04127098050148008
  	],
  	[
  		0.61127005008749,
  		-1.269854945014325,
  		-0.04162112122428484
  	],
  	[
  		0.6374206231328062,
  		-1.255049384980649,
  		-0.041953684684239885
  	],
  	[
  		0.6633010500917359,
  		-1.239711958691369,
  		-0.04226846745296006
  	],
  	[
  		0.6888993880916544,
  		-1.223847343895827,
  		-0.04256527401871667
  	],
  	[
  		0.7142037615461152,
  		-1.207460529291821,
  		-0.04284391703565598
  	],
  	[
  		0.7392023719397144,
  		-1.190556814592926,
  		-0.043104217571197714
  	],
  	[
  		0.7638835076796057,
  		-1.173141810210886,
  		-0.043346005335868305
  	],
  	[
  		0.7882355540334964,
  		-1.155221436578312,
  		-0.043569118915484505
  	],
  	[
  		0.812247003119199,
  		-1.136801923091461,
  		-0.043773405993987206
  	],
  	[
  		0.835906463942761,
  		-1.117889806639082,
  		-0.043958723572257066
  	],
  	[
  		0.8592026724437498,
  		-1.098491929757549,
  		-0.04412493817338331
  	],
  	[
  		0.8821245015448416,
  		-1.07861543837987,
  		-0.044271926039531964
  	],
  	[
  		0.904660971206757,
  		-1.058267779186071,
  		-0.044399573330471405
  	],
  	[
  		0.926801258426301,
  		-1.037456696534761,
  		-0.04450777630034947
  	],
  	[
  		0.948534707188882,
  		-1.01619022899023,
  		-0.04459644146948732
  	],
  	[
  		0.9698508383457173,
  		-0.9944767054607548,
  		-0.0446654857858665
  	],
  	[
  		0.9907393594055551,
  		-0.9723247408996585,
  		-0.04471483677785216
  	],
  	[
  		1.01119017420723,
  		-0.9497432316138348,
  		-0.04474443269409131
  	],
  	[
  		1.031193392444037,
  		-0.926741350168501,
  		-0.04475422262454278
  	],
  	[
  		1.050739339060865,
  		-0.9033285398956523,
  		-0.044744166623173716
  	],
  	[
  		1.069818563460062,
  		-0.8795145090023321,
  		-0.04471423580896503
  	],
  	[
  		1.088421848513375,
  		-0.8553092242797441,
  		-0.04466441245401592
  	],
  	[
  		1.106540219360135,
  		-0.8307229044614135,
  		-0.04459469006045869
  	],
  	[
  		1.124164951976483,
  		-0.8057660131861223,
  		-0.044505073424257045
  	],
  	[
  		1.141287581497913,
  		-0.7804492516017966,
  		-0.04439557868859187
  	],
  	[
  		1.157899910247072,
  		-0.7547835506242059,
  		-0.04426623337162422
  	],
  	[
  		1.173994015496966,
  		-0.7287800628585919,
  		-0.04411707639237811
  	],
  	[
  		1.189562256923175,
  		-0.7024501541996919,
  		-0.04394815807963795
  	],
  	[
  		1.204597283727192,
  		-0.6758053950990477,
  		-0.04375954016193744
  	],
  	[
  		1.219092041424829,
  		-0.6488575515653161,
  		-0.04355129574652038
  	],
  	[
  		1.233039778281884,
  		-0.6216185758750377,
  		-0.04332350928227187
  	],
  	[
  		1.246434051400879,
  		-0.5941005970104145,
  		-0.04307627651582282
  	],
  	[
  		1.259268732405878,
  		-0.5663159108591749,
  		-0.0428097044212343
  	],
  	[
  		1.271538012752244,
  		-0.5382769701813511,
  		-0.04252391112176136
  	],
  	[
  		1.283236408645456,
  		-0.5099963743745248,
  		-0.04221902580171902
  	],
  	[
  		1.294358765536803,
  		-0.481486859015085,
  		-0.04189518859591331
  	],
  	[
  		1.304900262198308,
  		-0.45276128523783554,
  		-0.04155255046764766
  	],
  	[
  		1.314856414349326,
  		-0.42383262896493873,
  		-0.04119127306707867
  	],
  	[
  		1.324223077850529,
  		-0.39471396998718083,
  		-0.04081152858363933
  	],
  	[
  		1.332996451418094,
  		-0.3654184809585379,
  		-0.04041349957534026
  	],
  	[
  		1.341173078876742,
  		-0.3359594163205251,
  		-0.03999737878406373
  	],
  	[
  		1.348749850982117,
  		-0.30635010120951633,
  		-0.03956336895035177
  	],
  	[
  		1.35572400679405,
  		-0.2766039203238567,
  		-0.03911168261103102
  	],
  	[
  		1.362093134626301,
  		-0.2467343067863199,
  		-0.03864254189147949
  	],
  	[
  		1.367855172554953,
  		-0.21675473103111662,
  		-0.03815617828306359
  	],
  	[
  		1.373008408515568,
  		-0.1866786896901415,
  		-0.037652832419296296
  	],
  	[
  		1.377551479960401,
  		-0.1565196945249957,
  		-0.037132753839457064
  	],
  	[
  		1.381483373065673,
  		-0.1262912614093756,
  		-0.03659620073372166
  	],
  	[
  		1.384803421528957,
  		-0.096006899413272,
  		-0.03604343969053264
  	],
  	[
  		1.387511304933272,
  		-0.06568009998222435,
  		-0.03547474542967426
  	],
  	[
  		1.389607046700636,
  		-0.035324326228279405,
  		-0.03489040052970438
  	],
  	[
  		1.391091011625714,
  		-0.004953002393583069,
  		-0.034290695143047854
  	],
  	[
  		1.391963903025453,
  		0.02542049653535884,
  		-0.033675926709146264
  	],
  	[
  		1.39222675951439,
  		0.055782855027107774,
  		-0.03304639966692462
  	],
  	[
  		1.391880951384557,
  		0.08612082701471009,
  		-0.03240242514952858
  	],
  	[
  		1.390928176644101,
  		0.11642124567843311,
  		-0.03174432068411091
  	],
  	[
  		1.389370456708644,
  		0.1466710329927878,
  		-0.031072409886315547
  	],
  	[
  		1.387210131766877,
  		0.1768572090572594,
  		-0.030387022152329652
  	],
  	[
  		1.38444985582177,
  		0.2069669011473565,
  		-0.02968849234562542
  	],
  	[
  		1.381092591430218,
  		0.23698735250334801,
  		-0.02897716048026941
  	],
  	[
  		1.377141604180971,
  		0.2669059308409814,
  		-0.028253371414243743
  	],
  	[
  		1.372600456880216,
  		0.296710136579952,
  		-0.027517474529447493
  	],
  	[
  		1.367473003493963,
  		0.3263876107750747,
  		-0.02676982341615583
  	],
  	[
  		1.361763382858341,
  		0.3559261427213237,
  		-0.026010775560316567
  	],
  	[
  		1.355476012174341,
  		0.38531367727728694,
  		-0.02524069203115518
  	],
  	[
  		1.348615580299923,
  		0.41453832185707545,
  		-0.024459937170929813
  	],
  	[
  		1.341187040843496,
  		0.4435883530957762,
  		-0.0236688782794431
  	],
  	[
  		1.333195605118066,
  		0.47245222319176794,
  		-0.022867885314859723
  	],
  	[
  		1.324646734928755,
  		0.5011185659208354,
  		-0.02205733058921289
  	],
  	[
  		1.315546135224943,
  		0.5295762023307314,
  		-0.02123758846596762
  	],
  	[
  		1.305899746642429,
  		0.557814146074556,
  		-0.020409035066559632
  	],
  	[
  		1.295713737945791,
  		0.5858216084342032,
  		-0.019572047979622913
  	],
  	[
  		1.284994498394237,
  		0.6135880030120933,
  		-0.01872700597906281
  	]
  ];
  var marsOrbit = {
  	targetName: targetName$3,
  	name: name$3,
  	startDate: startDate$3,
  	stopDate: stopDate$3,
  	stepSize: stepSize$3,
  	coords: coords$3
  };

  var marsOrbit$1 = {
    __proto__: null,
    targetName: targetName$3,
    name: name$3,
    startDate: startDate$3,
    stopDate: stopDate$3,
    stepSize: stepSize$3,
    coords: coords$3,
    'default': marsOrbit
  };

  var targetName$4 = "jupiter";
  var name$4 = "Jupiter";
  var startDate$4 = "2000-01-01";
  var stopDate$4 = "2012-01-01";
  var stepSize$4 = 12;
  var coords$4 = [
  	[
  		4.003460488693537,
  		2.935353187887882,
  		-0.10182304439881812
  	],
  	[
  		3.948004015997195,
  		3.012199191492646,
  		-0.1008999100979982
  	],
  	[
  		3.891175570371265,
  		3.087997390837165,
  		-0.09994165699134447
  	],
  	[
  		3.832994629680107,
  		3.162720679455306,
  		-0.09894874904776257
  	],
  	[
  		3.773480110464417,
  		3.236346506231319,
  		-0.09792152015255308
  	],
  	[
  		3.712658858687239,
  		3.308852035032597,
  		-0.09686025204831877
  	],
  	[
  		3.65055285591659,
  		3.380209165336348,
  		-0.09576551514432971
  	],
  	[
  		3.587180349819947,
  		3.450395489255351,
  		-0.09463774778913689
  	],
  	[
  		3.522568248776309,
  		3.519393268360627,
  		-0.09347715723012595
  	],
  	[
  		3.456743116413219,
  		3.587175560679363,
  		-0.09228431060373098
  	],
  	[
  		3.389724626418321,
  		3.65371835966395,
  		-0.09105979066083153
  	],
  	[
  		3.321537065615346,
  		3.719006420898989,
  		-0.08980386545654363
  	],
  	[
  		3.25221014732908,
  		3.783016866170285,
  		-0.08851703668965957
  	],
  	[
  		3.181767287630002,
  		3.845725999576409,
  		-0.08719994487814649
  	],
  	[
  		3.11023130580788,
  		3.907118204053377,
  		-0.08585299040579741
  	],
  	[
  		3.03763254287911,
  		3.967174699646054,
  		-0.08447662732402167
  	],
  	[
  		2.963997254083568,
  		4.025874249696311,
  		-0.0830714769454387
  	],
  	[
  		2.889348838603055,
  		4.083200245428155,
  		-0.08163805760895708
  	],
  	[
  		2.813717149648926,
  		4.139137043066961,
  		-0.08017682423422097
  	],
  	[
  		2.737130064464766,
  		4.193666592764421,
  		-0.07868837499869305
  	],
  	[
  		2.659613573366629,
  		4.246771970679632,
  		-0.07717330406991331
  	],
  	[
  		2.581196315165204,
  		4.298439065324589,
  		-0.07563212382818074
  	],
  	[
  		2.501905768066168,
  		4.348653213601885,
  		-0.07406540728146557
  	],
  	[
  		2.42177133201423,
  		4.397400007013213,
  		-0.07247369903523422
  	],
  	[
  		2.340822159027837,
  		4.444665004716255,
  		-0.0708575997881091
  	],
  	[
  		2.259084079112815,
  		4.490434362938404,
  		-0.06921776460186782
  	],
  	[
  		2.176587221876372,
  		4.534698474718377,
  		-0.06755466380462757
  	],
  	[
  		2.09336347428194,
  		4.577444291385851,
  		-0.06586890736496546
  	],
  	[
  		2.009439356342944,
  		4.618656930185692,
  		-0.06416126746265627
  	],
  	[
  		1.924842789054614,
  		4.658330070927752,
  		-0.06243222521737021
  	],
  	[
  		1.839607174451785,
  		4.696454260548057,
  		-0.060682323776872375
  	],
  	[
  		1.75376177082287,
  		4.733014858346146,
  		-0.05891237228867618
  	],
  	[
  		1.667332164728093,
  		4.768006362157492,
  		-0.057122942968985686
  	],
  	[
  		1.580351843836853,
  		4.801423039014323,
  		-0.05531453664527461
  	],
  	[
  		1.492853146368888,
  		4.833252349866549,
  		-0.053487944974325415
  	],
  	[
  		1.404860292792497,
  		4.863487953462904,
  		-0.05164386995488344
  	],
  	[
  		1.31640534381308,
  		4.892127772064643,
  		-0.04978278105787395
  	],
  	[
  		1.227522813228219,
  		4.919163567085771,
  		-0.04790536491580211
  	],
  	[
  		1.138238058225427,
  		4.944587291005075,
  		-0.046012423519239246
  	],
  	[
  		1.048580447559677,
  		4.968398274114779,
  		-0.044104480041181886
  	],
  	[
  		0.958583583352127,
  		4.99059326742205,
  		-0.042182130832930376
  	],
  	[
  		0.8682761971522579,
  		5.011165174185773,
  		-0.040246166109026274
  	],
  	[
  		0.7776869884998533,
  		5.030112876152827,
  		-0.03829720163637342
  	],
  	[
  		0.6868466302103653,
  		5.047435364413462,
  		-0.03633585576423005
  	],
  	[
  		0.5957853260160544,
  		5.063129313625735,
  		-0.03436282903474682
  	],
  	[
  		0.5045327423138385,
  		5.077194512811453,
  		-0.03237873920067761
  	],
  	[
  		0.41311812125332265,
  		5.089629673894053,
  		-0.03038428133512404
  	],
  	[
  		0.3215708810314158,
  		5.100434765952214,
  		-0.028380121799477853
  	],
  	[
  		0.22992127148278613,
  		5.109611781141339,
  		-0.0263668550870334
  	],
  	[
  		0.13819913343580212,
  		5.117159118856047,
  		-0.02434523743828603
  	],
  	[
  		0.046431975913627445,
  		5.123079076570059,
  		-0.02231594665593061
  	],
  	[
  		-0.04535015820830702,
  		5.127376728551949,
  		-0.02027952478374604
  	],
  	[
  		-0.1371152488921608,
  		5.130051278122797,
  		-0.01823671202093519
  	],
  	[
  		-0.22883826848299482,
  		5.13110498023939,
  		-0.016188265227763038
  	],
  	[
  		-0.3204914029496966,
  		5.13054596626769,
  		-0.014134697736365609
  	],
  	[
  		-0.41204016710224195,
  		5.128377252912692,
  		-0.01207663481026422
  	],
  	[
  		-0.5034593173694536,
  		5.124599378971307,
  		-0.01001493253126021
  	],
  	[
  		-0.5947242873090082,
  		5.119221024128576,
  		-0.00795017324219285
  	],
  	[
  		-0.6858015632954819,
  		5.112250797607518,
  		-0.0058828422476003535
  	],
  	[
  		-0.7766635206889203,
  		5.103689744633313,
  		-0.003813765104443206
  	],
  	[
  		-0.8672868774858151,
  		5.093545302894871,
  		-0.001743605303818998
  	],
  	[
  		-0.9576417700484039,
  		5.081829229298451,
  		0.0003271809410081901
  	],
  	[
  		-1.047699026297032,
  		5.06854512121614,
  		0.002397845716898155
  	],
  	[
  		-1.137434856010241,
  		5.053700064319295,
  		0.0044676866503935925
  	],
  	[
  		-1.226822745679382,
  		5.037306595976304,
  		0.006536199242188172
  	],
  	[
  		-1.315833218596454,
  		5.019371659525671,
  		0.00860271968653463
  	],
  	[
  		-1.40444154447428,
  		4.999903270952811,
  		0.0106665654405794
  	],
  	[
  		-1.492623559861674,
  		4.978912972577526,
  		0.012727159832252212
  	],
  	[
  		-1.580351517851752,
  		4.956410956908194,
  		0.01478389890166767
  	],
  	[
  		-1.667600141512163,
  		4.932407869677854,
  		0.01683616850593076
  	],
  	[
  		-1.75434455072889,
  		4.906913883553024,
  		0.01888333531451867
  	],
  	[
  		-1.840559815861289,
  		4.879940053731703,
  		0.0209247550457951
  	],
  	[
  		-1.926222775399393,
  		4.851500167386876,
  		0.0229598677796457
  	],
  	[
  		-2.011306403422287,
  		4.821606411208407,
  		0.02498812610044948
  	],
  	[
  		-2.095786647374561,
  		4.790269064616227,
  		0.02700884844528012
  	],
  	[
  		-2.179643840684102,
  		4.757502147785055,
  		0.02902143177163078
  	],
  	[
  		-2.262851427896808,
  		4.723321917339748,
  		0.03102544830977413
  	],
  	[
  		-2.345384505753966,
  		4.687739050748633,
  		0.033020242029185715
  	],
  	[
  		-2.427224979731511,
  		4.650765997713458,
  		0.03500512725824054
  	],
  	[
  		-2.508349038920715,
  		4.612422222308878,
  		0.0369797342123271
  	],
  	[
  		-2.588730987686641,
  		4.572720163229023,
  		0.03894348178724135
  	],
  	[
  		-2.668352685847341,
  		4.531670868197312,
  		0.0408956456072967
  	],
  	[
  		-2.747194503706662,
  		4.489295296856477,
  		0.0428358591933214
  	],
  	[
  		-2.825230567628872,
  		4.445608814205706,
  		0.044763644034735435
  	],
  	[
  		-2.902440813986765,
  		4.400621985049181,
  		0.04667827862328409
  	],
  	[
  		-2.978809519352689,
  		4.354354240758556,
  		0.04857929144567976
  	],
  	[
  		-3.054312846934355,
  		4.306824284750789,
  		0.05046627908134847
  	],
  	[
  		-3.12892871928931,
  		4.258045401715825,
  		0.052338631293534034
  	],
  	[
  		-3.202641995196159,
  		4.20803428390388,
  		0.054195787919641455
  	],
  	[
  		-3.27543222188585,
  		4.156810556898774,
  		0.05603734085655613
  	],
  	[
  		-3.347278690079617,
  		4.10439120492324,
  		0.057862787740391726
  	],
  	[
  		-3.418164679811305,
  		4.050792603729421,
  		0.059671585018849116
  	],
  	[
  		-3.488071351371747,
  		3.996033816157158,
  		0.06146328927501554
  	],
  	[
  		-3.556981058491856,
  		3.940133219564916,
  		0.06323740395283879
  	],
  	[
  		-3.624876452583803,
  		3.883109068142533,
  		0.06499345966059739
  	],
  	[
  		-3.6917392241622,
  		3.824980526197983,
  		0.06673103167154039
  	],
  	[
  		-3.757554418948549,
  		3.765765547349654,
  		0.0684496041014146
  	],
  	[
  		-3.822305697626028,
  		3.705484878842125,
  		0.07014879233686551
  	],
  	[
  		-3.885974639712556,
  		3.644158320724995,
  		0.07182821586037387
  	],
  	[
  		-3.948547511770045,
  		3.5818018059366,
  		0.07348729536100808
  	],
  	[
  		-4.010011165713588,
  		3.518438012447449,
  		0.07512567428072578
  	],
  	[
  		-4.070347265954401,
  		3.454089260383678,
  		0.07674306995268956
  	],
  	[
  		-4.129540195892499,
  		3.388770017641543,
  		0.07833889712564401
  	],
  	[
  		-4.187580746420744,
  		3.322501877994267,
  		0.0799127343765551
  	],
  	[
  		-4.24445346309932,
  		3.255309848429258,
  		0.08146437770996241
  	],
  	[
  		-4.300140154209033,
  		3.187210457223397,
  		0.08299335968976225
  	],
  	[
  		-4.354632693347374,
  		3.118222447582285,
  		0.08449916691629589
  	],
  	[
  		-4.407919269445764,
  		3.048370915654472,
  		0.0859815604939916
  	],
  	[
  		-4.459981914416361,
  		2.977676283677467,
  		0.08744020538132358
  	],
  	[
  		-4.510811537338459,
  		2.906155950805308,
  		0.08887457733815339
  	],
  	[
  		-4.560398631407621,
  		2.833833981260242,
  		0.09028439929977211
  	],
  	[
  		-4.608727849050313,
  		2.76073371926576,
  		0.09166943149069327
  	],
  	[
  		-4.6557888159419,
  		2.686872627797067,
  		0.09302919404984694
  	],
  	[
  		-4.701573203542506,
  		2.612273339956368,
  		0.09436337245267988
  	],
  	[
  		-4.746069493066206,
  		2.536960273819594,
  		0.09567174386920824
  	],
  	[
  		-4.789266537718601,
  		2.460952872577104,
  		0.09695392006255277
  	],
  	[
  		-4.831155376871203,
  		2.384273066923386,
  		0.09820959599345772
  	],
  	[
  		-4.871727669293945,
  		2.306943463395139,
  		0.09943848745089509
  	],
  	[
  		-4.910974329472515,
  		2.228985859690403,
  		0.1006402921594231
  	],
  	[
  		-4.948886065603314,
  		2.150424009224888,
  		0.1018148056159341
  	],
  	[
  		-4.985454126607973,
  		2.071278012294363,
  		0.10296169811390671
  	],
  	[
  		-5.020672354309266,
  		1.991569295185844,
  		0.10408063665581711
  	],
  	[
  		-5.054533874691354,
  		1.911323730781252,
  		0.1051714745559995
  	],
  	[
  		-5.087027902427109,
  		1.830562003865429,
  		0.1062339488892977
  	],
  	[
  		-5.118149401795166,
  		1.749304016337803,
  		0.10726768844083441
  	],
  	[
  		-5.147894958787259,
  		1.667575676944037,
  		0.1082725346489655
  	],
  	[
  		-5.176253372515633,
  		1.585400283932692,
  		0.109248347051113
  	],
  	[
  		-5.203219511619885,
  		1.502796428894825,
  		0.11019474370783172
  	],
  	[
  		-5.228792755349104,
  		1.419788505461307,
  		0.1111115053022493
  	],
  	[
  		-5.252963409132402,
  		1.336403106389755,
  		0.11199860307413301
  	],
  	[
  		-5.275724895687186,
  		1.252658481585534,
  		0.11285568796298101
  	],
  	[
  		-5.297077951919035,
  		1.168576225147201,
  		0.11368245875489309
  	],
  	[
  		-5.31701722169842,
  		1.084185183250806,
  		0.11447894983839779
  	],
  	[
  		-5.335535175451331,
  		0.9995057072661926,
  		0.11524494383990912
  	],
  	[
  		-5.352631095790258,
  		0.9145571685943287,
  		0.1159801203904586
  	],
  	[
  		-5.368304158789727,
  		0.8293668189192476,
  		0.11668444382817732
  	],
  	[
  		-5.382548537531632,
  		0.7439573666759742,
  		0.11735778689513382
  	],
  	[
  		-5.395361743898592,
  		0.6583492690150201,
  		0.11799991498409111
  	],
  	[
  		-5.406744250693214,
  		0.5725668327417408,
  		0.11861071693936441
  	],
  	[
  		-5.416692724302306,
  		0.48663312646532647,
  		0.11919008071413939
  	],
  	[
  		-5.425205638597603,
  		0.40057074907808377,
  		0.1197378723992598
  	],
  	[
  		-5.432282939276493,
  		0.3144024486362541,
  		0.12025397888722181
  	],
  	[
  		-5.437922920193431,
  		0.22815060644062282,
  		0.1207382773754786
  	],
  	[
  		-5.442126416470899,
  		0.1418387898495923,
  		0.1211906648962329
  	],
  	[
  		-5.444892245665661,
  		0.05548994635067902,
  		0.12161107026101921
  	],
  	[
  		-5.44621936165507,
  		-0.030874702772691588,
  		0.1219993521141663
  	],
  	[
  		-5.446111769122858,
  		-0.1172321360483907,
  		0.12235538424048811
  	],
  	[
  		-5.444568465397803,
  		-0.2035568651769702,
  		0.1226792154133964
  	],
  	[
  		-5.441587420895089,
  		-0.2898281298962807,
  		0.12297075029294412
  	],
  	[
  		-5.437174586239514,
  		-0.3760261940775657,
  		0.12322976452570632
  	],
  	[
  		-5.431332373408654,
  		-0.4621234758520316,
  		0.12345636609818861
  	],
  	[
  		-5.424058141994776,
  		-0.5480970934379217,
  		0.12365058072564682
  	],
  	[
  		-5.415356124055791,
  		-0.6339302215911582,
  		0.1238121406495225
  	],
  	[
  		-5.405232821059574,
  		-0.7195963279787216,
  		0.12394110507554741
  	],
  	[
  		-5.393687725090422,
  		-0.8050701967860386,
  		0.12403760117501111
  	],
  	[
  		-5.380722655210677,
  		-0.890334726178066,
  		0.1241014524359714
  	],
  	[
  		-5.366346339748119,
  		-0.9753661420627613,
  		0.1241326460791804
  	],
  	[
  		-5.350561117421301,
  		-1.06013877690288,
  		0.1241313265950837
  	],
  	[
  		-5.333367842435409,
  		-1.144633551878,
  		0.1240974282597444
  	],
  	[
  		-5.31477560370274,
  		-1.228829538984993,
  		0.1240308728056129
  	],
  	[
  		-5.294789365029763,
  		-1.312701656146932,
  		0.12393178571955199
  	],
  	[
  		-5.27341103211003,
  		-1.396228058610153,
  		0.12380022115988001
  	],
  	[
  		-5.250648262622224,
  		-1.479389344152174,
  		0.1236361145900276
  	],
  	[
  		-5.226507664882512,
  		-1.56216257865762,
  		0.1234395403735572
  	],
  	[
  		-5.200994757449923,
  		-1.64452479541208,
  		0.1232105844485965
  	],
  	[
  		-5.174116162112763,
  		-1.726455297789511,
  		0.1229492716139873
  	],
  	[
  		-5.145877536649646,
  		-1.80793247908261,
  		0.12265567929503401
  	],
  	[
  		-5.116287353878112,
  		-1.888935657933593,
  		0.12232981727675661
  	],
  	[
  		-5.085354106692763,
  		-1.969442514419054,
  		0.12197177677360281
  	],
  	[
  		-5.053083044827186,
  		-2.049429866019712,
  		0.1215817529610394
  	],
  	[
  		-5.019482545780222,
  		-2.128879926806225,
  		0.12115972071039971
  	],
  	[
  		-4.984563794878444,
  		-2.207771007410605,
  		0.1207057570256011
  	],
  	[
  		-4.948333924358197,
  		-2.28607824173536,
  		0.120220138010668
  	],
  	[
  		-4.910799561324894,
  		-2.363784939970525,
  		0.1197028697405893
  	],
  	[
  		-4.871973820104617,
  		-2.440871213305084,
  		0.11915398473627402
  	],
  	[
  		-4.831866745433706,
  		-2.51731150152511,
  		0.11857379122161141
  	],
  	[
  		-4.790483058703456,
  		-2.593087963872617,
  		0.11796240763604021
  	],
  	[
  		-4.747836646705619,
  		-2.66818360062606,
  		0.1173198184078995
  	],
  	[
  		-4.70394128937273,
  		-2.742573972795212,
  		0.11664629146553321
  	],
  	[
  		-4.658801710611995,
  		-2.816237919556257,
  		0.1159420972423003
  	],
  	[
  		-4.612429976474347,
  		-2.889160435508558,
  		0.1152072194142066
  	],
  	[
  		-4.56484191119524,
  		-2.961320611634744,
  		0.1144418100349864
  	],
  	[
  		-4.516045701520915,
  		-3.03269483581326,
  		0.1136462153954208
  	],
  	[
  		-4.466051921178137,
  		-3.103267009751909,
  		0.11282052228998121
  	],
  	[
  		-4.414875434592111,
  		-3.173018858990159,
  		0.111964859657733
  	],
  	[
  		-4.362528380284408,
  		-3.241927790092315,
  		0.1110795432599568
  	],
  	[
  		-4.309022229212006,
  		-3.309976417331474,
  		0.1101647311710271
  	],
  	[
  		-4.254370647271282,
  		-3.377146483933581,
  		0.1092206139567224
  	],
  	[
  		-4.1985877017941,
  		-3.443417844569562,
  		0.1082474535827732
  	],
  	[
  		-4.141686437014948,
  		-3.508772863875619,
  		0.10724543539218001
  	],
  	[
  		-4.083680752321257,
  		-3.573192114569296,
  		0.10621483881319592
  	],
  	[
  		-4.024584904488775,
  		-3.636657874886562,
  		0.1051559108016241
  	],
  	[
  		-3.964414051231673,
  		-3.699153371560238,
  		0.10406884190526411
  	],
  	[
  		-3.903184166440229,
  		-3.7606579237789,
  		0.10295398133445091
  	],
  	[
  		-3.840907740902582,
  		-3.821154605392444,
  		0.10181162350339111
  	],
  	[
  		-3.777600766290497,
  		-3.880629252814581,
  		0.10064190998227329
  	],
  	[
  		-3.713283121172085,
  		-3.939061951905987,
  		0.09944515528283525
  	],
  	[
  		-3.647966702631143,
  		-3.996433398547984,
  		0.09822178685512142
  	],
  	[
  		-3.581665857993134,
  		-4.052730888827253,
  		0.09697198224217182
  	],
  	[
  		-3.514403020555593,
  		-4.107938425196931,
  		0.09569594777063582
  	],
  	[
  		-3.446192864965101,
  		-4.162034743192741,
  		0.09439418581563792
  	],
  	[
  		-3.377048550439092,
  		-4.215006100900517,
  		0.09306697858230982
  	],
  	[
  		-3.306991734881748,
  		-4.266840274383319,
  		0.09171446156090582
  	],
  	[
  		-3.236040618720634,
  		-4.317516351206653,
  		0.09033712148507198
  	],
  	[
  		-3.164208945506983,
  		-4.367019122295115,
  		0.08893532982082722
  	],
  	[
  		-3.09151639471036,
  		-4.415338019037572,
  		0.08750924662313436
  	],
  	[
  		-3.017984440589398,
  		-4.462454090927979,
  		0.08605932449748195
  	],
  	[
  		-2.94362864944127,
  		-4.508351192227465,
  		0.08458600372477468
  	],
  	[
  		-2.868466723297732,
  		-4.553018412861113,
  		0.08308953504370407
  	],
  	[
  		-2.792521578810527,
  		-4.59644049479088,
  		0.08157029273245073
  	],
  	[
  		-2.715811612055035,
  		-4.638601896857549,
  		0.08002871072626426
  	],
  	[
  		-2.63835472255983,
  		-4.679489401157016,
  		0.07846516644514974
  	],
  	[
  		-2.560172397080093,
  		-4.719090117491421,
  		0.07688003631082381
  	],
  	[
  		-2.481284502448745,
  		-4.757391190815386,
  		0.07527371240845887
  	],
  	[
  		-2.401712353415827,
  		-4.794378870870399,
  		0.07364661031701983
  	],
  	[
  		-2.321476549699199,
  		-4.830039812119129,
  		0.07199918517625531
  	],
  	[
  		-2.24059583261144,
  		-4.864362938093386,
  		0.07033184471673756
  	],
  	[
  		-2.159094218017496,
  		-4.897337217439597,
  		0.06864492945783847
  	],
  	[
  		-2.07699353058597,
  		-4.928948601893753,
  		0.06693893635987148
  	],
  	[
  		-1.994311580730368,
  		-4.959185504226032,
  		0.06521436155373293
  	],
  	[
  		-1.91107288643828,
  		-4.988040285447696,
  		0.06347149051294836
  	],
  	[
  		-1.827301622478951,
  		-5.015499106168931,
  		0.0617108418669846
  	],
  	[
  		-1.743015982054521,
  		-5.041549177690816,
  		0.059933008904248006
  	],
  	[
  		-1.658238931842823,
  		-5.066185935812696,
  		0.058138250857325664
  	],
  	[
  		-1.572997635582523,
  		-5.089397383470611,
  		0.05632704385000258
  	],
  	[
  		-1.487312413196351,
  		-5.111169294486721,
  		0.05450005714639068
  	],
  	[
  		-1.401203005079113,
  		-5.131497571435833,
  		0.05265763299394755
  	],
  	[
  		-1.314697993993752,
  		-5.150374160798291,
  		0.050800170400411064
  	],
  	[
  		-1.227821776299911,
  		-5.167785600053731,
  		0.04892833464228606
  	],
  	[
  		-1.140593053835543,
  		-5.183725325523489,
  		0.047042632534708084
  	],
  	[
  		-1.053038986664828,
  		-5.198188401735997,
  		0.045143447971501105
  	],
  	[
  		-0.9651862348794158,
  		-5.211165016472684,
  		0.04323135533761849
  	],
  	[
  		-0.877055668585129,
  		-5.222647032603178,
  		0.04130694052450136
  	],
  	[
  		-0.7886730439901226,
  		-5.232630233835097,
  		0.039370635685134936
  	],
  	[
  		-0.7000645991905272,
  		-5.241107826596976,
  		0.03742298356076609
  	],
  	[
  		-0.6112540414310585,
  		-5.248072347192093,
  		0.03546458492993383
  	],
  	[
  		-0.5222670010522065,
  		-5.253519800087457,
  		0.03349592333447538
  	],
  	[
  		-0.4331285391505757,
  		-5.257444960551332,
  		0.03151756309846276
  	],
  	[
  		-0.34386453861247634,
  		-5.259842891444146,
  		0.029530057390885982
  	],
  	[
  		-0.25450147924169403,
  		-5.260709687516383,
  		0.02753391959417157
  	],
  	[
  		-0.1650632596168701,
  		-5.260039786888877,
  		0.02552979085231409
  	],
  	[
  		-0.07557559307669787,
  		-5.257831953855093,
  		0.02351816534398132
  	],
  	[
  		0.01393282529563826,
  		-5.254083740473755,
  		0.02149954128297317
  	],
  	[
  		0.1034365591511633,
  		-5.248787925935431,
  		0.01947466929210551
  	],
  	[
  		0.1929126210936719,
  		-5.241945000942628,
  		0.01744408795616922
  	],
  	[
  		0.2823316781576399,
  		-5.23355623141326,
  		0.015408228291880759
  	],
  	[
  		0.371664341344546,
  		-5.223615261365801,
  		0.013367821252929351
  	],
  	[
  		0.46088920311005754,
  		-5.212121214824714,
  		0.0113235247655609
  	],
  	[
  		0.5499787052272044,
  		-5.19907800871097,
  		0.009275773544980414
  	],
  	[
  		0.6389007901916397,
  		-5.18448302878287,
  		0.007225205454577802
  	],
  	[
  		0.7276329761489306,
  		-5.168333930087471,
  		0.005172582760716747
  	],
  	[
  		0.8161493877531575,
  		-5.150635693855079,
  		0.003118397722939479
  	],
  	[
  		0.9044175917120241,
  		-5.131390150396372,
  		0.001063192533334618
  	],
  	[
  		0.9924127488401937,
  		-5.11059463150302,
  		-0.0009922304133355474
  	],
  	[
  		1.080110295349624,
  		-5.088254197375424,
  		-0.00304731593081755
  	],
  	[
  		1.167479704059655,
  		-5.06437450703709,
  		-0.005101580498530523
  	],
  	[
  		1.254492971957828,
  		-5.038954630933651,
  		-0.007154256409558828
  	],
  	[
  		1.341125078735641,
  		-5.011998845123349,
  		-0.009204708114657598
  	],
  	[
  		1.427348579351464,
  		-4.983513872505662,
  		-0.011252388251954971
  	],
  	[
  		1.513134379606014,
  		-4.953502999518469,
  		-0.01329662142424894
  	],
  	[
  		1.598455433520575,
  		-4.921971752204112,
  		-0.01533679132203979
  	],
  	[
  		1.683284943662001,
  		-4.888925450476024,
  		-0.01737224536060302
  	],
  	[
  		1.767595665598087,
  		-4.854370239386146,
  		-0.01940232578275559
  	],
  	[
  		1.851360219048364,
  		-4.818314839999438,
  		-0.02142647068977383
  	],
  	[
  		1.934549548363764,
  		-4.780764627233525,
  		-0.02344399432974742
  	],
  	[
  		2.017137810878902,
  		-4.741726351464119,
  		-0.025454175704195562
  	],
  	[
  		2.099099131352375,
  		-4.701211344619539,
  		-0.027456454268057442
  	],
  	[
  		2.180402286303481,
  		-4.659227589549554,
  		-0.02945020251070134
  	],
  	[
  		2.261021836946934,
  		-4.615781814893599,
  		-0.03143465037273083
  	],
  	[
  		2.340934150708467,
  		-4.570886779285704,
  		-0.03340920545593086
  	],
  	[
  		2.420107097358159,
  		-4.52455474980649,
  		-0.0353733488410525
  	],
  	[
  		2.49851404626168,
  		-4.476792098771771,
  		-0.03732626671563091
  	],
  	[
  		2.576133457088528,
  		-4.427611091966012,
  		-0.03926726127341256
  	],
  	[
  		2.65293521989228,
  		-4.377029129206464,
  		-0.04119591501581878
  	],
  	[
  		2.728890047149288,
  		-4.325054471401853,
  		-0.04311147112570871
  	],
  	[
  		2.803976073883601,
  		-4.27169781611301,
  		-0.04501314347538408
  	],
  	[
  		2.878167821369897,
  		-4.216978701746098,
  		-0.046900499267967785
  	],
  	[
  		2.951435307853205,
  		-4.160909539161982,
  		-0.048772893178541506
  	],
  	[
  		3.023754386616686,
  		-4.103501661528448,
  		-0.050629553858288386
  	],
  	[
  		3.095102322461993,
  		-4.044773484502111,
  		-0.05246993237430535
  	],
  	[
  		3.16545057499181,
  		-3.984740826856493,
  		-0.05429342586024684
  	],
  	[
  		3.234773980966516,
  		-3.923417969360532,
  		-0.05609933790514465
  	],
  	[
  		3.303050084812426,
  		-3.860822435570392,
  		-0.05788705019731668
  	],
  	[
  		3.370252318306019,
  		-3.79697222095755,
  		-0.05965597492972374
  	],
  	[
  		3.43635626187059,
  		-3.731884792069938,
  		-0.061405482439709676
  	],
  	[
  		3.50133838245225,
  		-3.665577857165278,
  		-0.06313493519144169
  	],
  	[
  		3.565174040269612,
  		-3.598070196227618,
  		-0.06484371367568004
  	],
  	[
  		3.627841232894982,
  		-3.529381949886136,
  		-0.06653120213465274
  	],
  	[
  		3.689314902965793,
  		-3.459533702620476,
  		-0.0681968434138304
  	],
  	[
  		3.749570635580994,
  		-3.388544240166819,
  		-0.06984000044584864
  	],
  	[
  		3.808589743337865,
  		-3.31643367974258,
  		-0.07145998934634466
  	],
  	[
  		3.866348741263672,
  		-3.243227332220997,
  		-0.0730563780646254
  	],
  	[
  		3.922822135968245,
  		-3.168945893358168,
  		-0.0746286032522456
  	],
  	[
  		3.977991728676598,
  		-3.093607523869146,
  		-0.07617588779375657
  	],
  	[
  		4.03183830067703,
  		-3.017239947710153,
  		-0.07769780322996696
  	],
  	[
  		4.084336876135473,
  		-2.939867578400038,
  		-0.07919389022890408
  	],
  	[
  		4.135467473398992,
  		-2.861508692220249,
  		-0.08066339249309033
  	],
  	[
  		4.185214671396746,
  		-2.782190807491079,
  		-0.08210582512171613
  	],
  	[
  		4.233555748935384,
  		-2.701941504086936,
  		-0.08352080103117565
  	],
  	[
  		4.280469338376578,
  		-2.620781199190869,
  		-0.08490765678419657
  	],
  	[
  		4.32594236338786,
  		-2.538735844349658,
  		-0.08626582227752877
  	],
  	[
  		4.369955227570683,
  		-2.455835258771268,
  		-0.08759492794034456
  	],
  	[
  		4.412486185528619,
  		-2.372103740533313,
  		-0.08889443811787874
  	],
  	[
  		4.453522084514018,
  		-2.287565626549864,
  		-0.09016372639537018
  	],
  	[
  		4.493046904617554,
  		-2.202251078367368,
  		-0.09140239265307118
  	],
  	[
  		4.531041729750297,
  		-2.116188701674921,
  		-0.09261002273543714
  	],
  	[
  		4.567491939582553,
  		-2.029403862256195,
  		-0.09378605432243678
  	],
  	[
  		4.602382920615242,
  		-1.941925773150528,
  		-0.09493005703088914
  	],
  	[
  		4.635700367911501,
  		-1.85378396343139,
  		-0.09604159681525881
  	],
  	[
  		4.667430258613924,
  		-1.765007049847292,
  		-0.09712021330587867
  	],
  	[
  		4.697557977769615,
  		-1.675625372823357,
  		-0.09816554462355542
  	],
  	[
  		4.7260716691908,
  		-1.585667025096302,
  		-0.09917710398733057
  	],
  	[
  		4.752960284068493,
  		-1.495162910359916,
  		-0.1001544948722672
  	],
  	[
  		4.778210624546077,
  		-1.404145748511618,
  		-0.1010974608481739
  	],
  	[
  		4.801811154841761,
  		-1.312642635824009,
  		-0.10200551585526921
  	],
  	[
  		4.823754377522763,
  		-1.220685048549925,
  		-0.1028782695666747
  	],
  	[
  		4.844029522982274,
  		-1.12830800238502,
  		-0.1037155324484794
  	],
  	[
  		4.862624001044101,
  		-1.035539083659046,
  		-0.10451688064121781
  	],
  	[
  		4.87953354637687,
  		-0.9424084732204037,
  		-0.10528188341834031
  	],
  	[
  		4.89475159398516,
  		-0.8489529687418943,
  		-0.10601038991004219
  	],
  	[
  		4.908264800261312,
  		-0.7552034935530253,
  		-0.1067021475916855
  	],
  	[
  		4.920069617983239,
  		-0.6611879175550549,
  		-0.10735669089743421
  	],
  	[
  		4.930164169603429,
  		-0.5669418512022957,
  		-0.10797380335038881
  	],
  	[
  		4.938537803477658,
  		-0.47250073901835804,
  		-0.1085533902529803
  	],
  	[
  		4.945185855849012,
  		-0.3778925779748049,
  		-0.10909504603392331
  	],
  	[
  		4.950108343882062,
  		-0.2831505292793974,
  		-0.10959849958821372
  	],
  	[
  		4.95329990377093,
  		-0.1883119027407534,
  		-0.11006371169663809
  	],
  	[
  		4.954756336890923,
  		-0.0934066751668486,
  		-0.11049039523580931
  	],
  	[
  		4.954478074718271,
  		0.0015327985815538302,
  		-0.1108783248323304
  	],
  	[
  		4.952464351368776,
  		0.09647013097391226,
  		-0.11122744457079331
  	],
  	[
  		4.948712812492244,
  		0.1913735995632686,
  		-0.1115375561689957
  	],
  	[
  		4.943224440472522,
  		0.2862103878089045,
  		-0.11180850941171282
  	],
  	[
  		4.936001378879024,
  		0.38094628291971655,
  		-0.1120402148656688
  	],
  	[
  		4.927044538182158,
  		0.47554833979445443,
  		-0.11223255006237301
  	],
  	[
  		4.916356401197917,
  		0.5699820193516386,
  		-0.11238548460178
  	],
  	[
  		4.903939446040266,
  		0.6642151713248663,
  		-0.1124989419257042
  	],
  	[
  		4.889798273136645,
  		0.7582161244278589,
  		-0.1125727985211902
  	],
  	[
  		4.873939467625115,
  		0.8519489998776297,
  		-0.11260708656506611
  	],
  	[
  		4.85636466427632,
  		0.9453806643231607,
  		-0.1126018405413751
  	],
  	[
  		4.837079475926946,
  		1.038481699629621,
  		-0.11255693450295322
  	],
  	[
  		4.816095331826055,
  		1.131218074376136,
  		-0.1124723494297454
  	],
  	[
  		4.793415873852001,
  		1.223553735133593,
  		-0.11234827461680319
  	],
  	[
  		4.769046528251117,
  		1.315459547125333,
  		-0.112184678578457
  	],
  	[
  		4.743001048551641,
  		1.406905121536637,
  		-0.1119814791361973
  	],
  	[
  		4.715287433008503,
  		1.497853028428075,
  		-0.11173894375360892
  	],
  	[
  		4.68591167580951,
  		1.588273353953976,
  		-0.11145714135233392
  	],
  	[
  		4.654887728565495,
  		1.678138512277244,
  		-0.11113598090985942
  	],
  	[
  		4.622228664166278,
  		1.767411597204512,
  		-0.110775750587248
  	],
  	[
  		4.587941989422077,
  		1.856061235534937,
  		-0.1103766422630407
  	],
  	[
  		4.55204072122952,
  		1.944061221577755,
  		-0.10993863889788691
  	],
  	[
  		4.514542406705851,
  		2.031377929103584,
  		-0.10946197789786741
  	],
  	[
  		4.475458126841072,
  		2.117978979502575,
  		-0.10894693886550161
  	],
  	[
  		4.434800329918927,
  		2.203837007854964,
  		-0.1083936511002972
  	],
  	[
  		4.392587531684367,
  		2.288922555797999,
  		-0.10780229362347432
  	],
  	[
  		4.348834728175062,
  		2.373204914134766,
  		-0.1071731419055608
  	],
  	[
  		4.303557116158092,
  		2.456654903113441,
  		-0.10650645475891951
  	],
  	[
  		4.256772520388888,
  		2.539244521320631,
  		-0.1058024717995113
  	],
  	[
  		4.208497446382593,
  		2.620945761805155,
  		-0.10506147813909722
  	],
  	[
  		4.158751358298082,
  		2.701730608006158,
  		-0.1042837393801932
  	],
  	[
  		4.10755272840822,
  		2.7815708861737,
  		-0.1034695790737956
  	],
  	[
  		4.054918306940614,
  		2.860439924630876,
  		-0.10261933767975451
  	],
  	[
  		4.000870353574502,
  		2.938312813823049,
  		-0.10173323708129861
  	],
  	[
  		3.945429428272716,
  		3.015160952038009,
  		-0.1008116854236899
  	],
  	[
  		3.888612701337644,
  		3.090957977959812,
  		-0.09985511883359434
  	],
  	[
  		3.830443425468649,
  		3.165682939509371,
  		-0.09886372708757919
  	],
  	[
  		3.770946123014699,
  		3.239307826704701,
  		-0.09783796411014642
  	]
  ];
  var jupiterOrbit = {
  	targetName: targetName$4,
  	name: name$4,
  	startDate: startDate$4,
  	stopDate: stopDate$4,
  	stepSize: stepSize$4,
  	coords: coords$4
  };

  var jupiterOrbit$1 = {
    __proto__: null,
    targetName: targetName$4,
    name: name$4,
    startDate: startDate$4,
    stopDate: stopDate$4,
    stepSize: stepSize$4,
    coords: coords$4,
    'default': jupiterOrbit
  };

  var targetName$5 = "saturn";
  var name$5 = "Saturn";
  var startDate$5 = "2000-01-01";
  var stopDate$5 = "2030-01-01";
  var stepSize$5 = 30;
  var coords$5 = [
  	[
  		6.408556035505925,
  		6.568042752621957,
  		-0.36912728806812173
  	],
  	[
  		6.278718471892591,
  		6.683644179854423,
  		-0.3659768285954197
  	],
  	[
  		6.146702860113559,
  		6.796925594973508,
  		-0.3626997226748459
  	],
  	[
  		6.012550233771004,
  		6.907843044538182,
  		-0.3592966784806666
  	],
  	[
  		5.876302323141279,
  		7.016352119188508,
  		-0.3557681805507874
  	],
  	[
  		5.738001687210814,
  		7.12240894914122,
  		-0.3521149427099411
  	],
  	[
  		5.59769184097503,
  		7.225970651613654,
  		-0.34833773868186646
  	],
  	[
  		5.455418160349003,
  		7.326996560609808,
  		-0.34443782070947604
  	],
  	[
  		5.311226510857955,
  		7.425447771035808,
  		-0.3404166667275306
  	],
  	[
  		5.165163992795105,
  		7.521285949181291,
  		-0.336275670609587
  	],
  	[
  		5.017278726088644,
  		7.614473854390799,
  		-0.3320163797693214
  	],
  	[
  		4.867619024896385,
  		7.704973411996642,
  		-0.3276400078204527
  	],
  	[
  		4.716235641860159,
  		7.792746433623236,
  		-0.3231476696386014
  	],
  	[
  		4.563180026310093,
  		7.877756554093113,
  		-0.31854053950189565
  	],
  	[
  		4.40850394689862,
  		7.959968126591388,
  		-0.3138196964124663
  	],
  	[
  		4.252261156536782,
  		8.0393486881126,
  		-0.3089867906758734
  	],
  	[
  		4.094504560571956,
  		8.115868425687625,
  		-0.30404361437206034
  	],
  	[
  		3.935287476519096,
  		8.189497229778148,
  		-0.2989919362993197
  	],
  	[
  		3.77466479047094,
  		8.260206506766403,
  		-0.2938338495941488
  	],
  	[
  		3.612691048653215,
  		8.327967222523005,
  		-0.2885710416719316
  	],
  	[
  		3.44942297015458,
  		8.392749447260009,
  		-0.2832051586922773
  	],
  	[
  		3.28491862604136,
  		8.454525529594914,
  		-0.2777378993830178
  	],
  	[
  		3.119235606782996,
  		8.513268647502327,
  		-0.2721706129192358
  	],
  	[
  		2.952432750990017,
  		8.568954194164398,
  		-0.26650520233291014
  	],
  	[
  		2.784568646471381,
  		8.62156068540506,
  		-0.2607437673111903
  	],
  	[
  		2.615701928099918,
  		8.671066780930104,
  		-0.25488834438030483
  	],
  	[
  		2.445892802481934,
  		8.717452297782934,
  		-0.2489414343139747
  	],
  	[
  		2.275202055628055,
  		8.760697917517076,
  		-0.2429052167552464
  	],
  	[
  		2.103691770123436,
  		8.800784429135604,
  		-0.23678175486245634
  	],
  	[
  		1.931424790346512,
  		8.837694488599778,
  		-0.230573198337912
  	],
  	[
  		1.758463450253846,
  		8.87141232376548,
  		-0.22428123938261352
  	],
  	[
  		1.584869435143255,
  		8.90192421412077,
  		-0.2179078967633631
  	],
  	[
  		1.41070365374965,
  		8.929218154097608,
  		-0.2114554857197377
  	],
  	[
  		1.236027584009025,
  		8.953282764411657,
  		-0.20492632629028562
  	],
  	[
  		1.060903450541356,
  		8.974107742954702,
  		-0.19832314614263333
  	],
  	[
  		0.8853948772416298,
  		8.991682924593235,
  		-0.1916485540855365
  	],
  	[
  		0.7095674984530396,
  		9.005999610350473,
  		-0.1849050385118823
  	],
  	[
  		0.5334866973792464,
  		9.017051322016856,
  		-0.17809503129738272
  	],
  	[
  		0.3572178058190816,
  		9.024832593659696,
  		-0.171220586747956
  	],
  	[
  		0.1808251207621136,
  		9.029340878045556,
  		-0.16428387108709352
  	],
  	[
  		0.004370665621439906,
  		9.03057509462466,
  		-0.1572872222741787
  	],
  	[
  		-0.1720824791461392,
  		9.028534390491236,
  		-0.1502332239792583
  	],
  	[
  		-0.34847092857071654,
  		9.02322013482581,
  		-0.14312479315719692
  	],
  	[
  		-0.5247310845413099,
  		9.014633824929376,
  		-0.1359647517311925
  	],
  	[
  		-0.7007969364954145,
  		9.002778109676115,
  		-0.1287559960474044
  	],
  	[
  		-0.8766035013289027,
  		8.987658389305672,
  		-0.12150119502635981
  	],
  	[
  		-1.052086760724806,
  		8.969280125344437,
  		-0.114202610947607
  	],
  	[
  		-1.22718283767357,
  		8.947650480969225,
  		-0.1068626143037927
  	],
  	[
  		-1.40183026759383,
  		8.92277832789514,
  		-0.09948352072100694
  	],
  	[
  		-1.575966859107628,
  		8.894672676264763,
  		-0.0920679801475308
  	],
  	[
  		-1.749529154456607,
  		8.86334502489209,
  		-0.08461907955768073
  	],
  	[
  		-1.922454037163468,
  		8.828808492837666,
  		-0.07713975082105984
  	],
  	[
  		-2.094677144834459,
  		8.791077589800715,
  		-0.06963309213186046
  	],
  	[
  		-2.26613502364881,
  		8.750169378974622,
  		-0.062101990717708125
  	],
  	[
  		-2.43676613501486,
  		8.706101424348406,
  		-0.05454885612107625
  	],
  	[
  		-2.606509996233842,
  		8.658891780910368,
  		-0.04697615154430695
  	],
  	[
  		-2.775307903184447,
  		8.608559372055723,
  		-0.039386191900999554
  	],
  	[
  		-2.943101187801096,
  		8.55512382033014,
  		-0.031781587187667534
  	],
  	[
  		-3.109830615532136,
  		8.498606399592067,
  		-0.02416540764276237
  	],
  	[
  		-3.275436444085347,
  		8.439030042445543,
  		-0.01654064223938555
  	],
  	[
  		-3.439858425947692,
  		8.37641988370146,
  		-0.008910452377260895
  	],
  	[
  		-3.60303763307026,
  		8.3108024855701,
  		-0.0012777760604362242
  	],
  	[
  		-3.764915937689886,
  		8.24220506425965,
  		0.006354841984997311
  	],
  	[
  		-3.925436743311882,
  		8.170655886657633,
  		0.01398490079100653
  	],
  	[
  		-4.08454547618121,
  		8.096182976360453,
  		0.02161017362750314
  	],
  	[
  		-4.242187253683088,
  		8.0188158612215,
  		0.02922812034035167
  	],
  	[
  		-4.398308082144048,
  		7.938586471046671,
  		0.03683582779220444
  	],
  	[
  		-4.552854313459719,
  		7.85552741041609,
  		0.04443041565336175
  	],
  	[
  		-4.705771924914708,
  		7.769673953697537,
  		0.05200872546152616
  	],
  	[
  		-4.857009327652318,
  		7.68106230453378,
  		0.05956790336310779
  	],
  	[
  		-5.006515539781468,
  		7.589727525276603,
  		0.06710538722114495
  	],
  	[
  		-5.15424006794214,
  		7.495705921483419,
  		0.07461862187771899
  	],
  	[
  		-5.300134501719211,
  		7.399033214485845,
  		0.08210553551706333
  	],
  	[
  		-5.444149820825833,
  		7.299745787579483,
  		0.08956375445156183
  	],
  	[
  		-5.586237679855517,
  		7.197883652989624,
  		0.09699056393941319
  	],
  	[
  		-5.726351172352201,
  		7.093487883666065,
  		0.10438336578806712
  	],
  	[
  		-5.864443453001651,
  		6.986601515651607,
  		0.11173913739087621
  	],
  	[
  		-6.000470035315972,
  		6.877269101240943,
  		0.1190551318071329
  	],
  	[
  		-6.134387811753766,
  		6.765533764815665,
  		0.1263289259774625
  	],
  	[
  		-6.266153932860099,
  		6.6514388580858,
  		0.1335579711595009
  	],
  	[
  		-6.395727214508397,
  		6.535027619785994,
  		0.1407402940313308
  	],
  	[
  		-6.52306701480997,
  		6.416343492971008,
  		0.1478738279316594
  	],
  	[
  		-6.648133557224256,
  		6.295432352608581,
  		0.15495613258084073
  	],
  	[
  		-6.770888516692878,
  		6.172341472003334,
  		0.161984914696006
  	],
  	[
  		-6.891294551376864,
  		6.047119355227632,
  		0.1689575015389933
  	],
  	[
  		-7.009315558655724,
  		5.919814908979377,
  		0.17587129951066402
  	],
  	[
  		-7.124915971607288,
  		5.790476530165384,
  		0.18272402434130142
  	],
  	[
  		-7.238061024903511,
  		5.659152850093657,
  		0.1895133224785846
  	],
  	[
  		-7.348716544887075,
  		5.525892153202594,
  		0.19623728080076372
  	],
  	[
  		-7.456849326989583,
  		5.390743975512765,
  		0.20289410137213382
  	],
  	[
  		-7.562428855522437,
  		5.2537596547072,
  		0.20948180941984132
  	],
  	[
  		-7.665425819298597,
  		5.114991124643448,
  		0.21599841369039088
  	],
  	[
  		-7.765812634831257,
  		4.97449176493887,
  		0.22244163012540283
  	],
  	[
  		-7.863563716322496,
  		4.832314165329554,
  		0.22880921232201712
  	],
  	[
  		-7.958652551738761,
  		4.688509781168397,
  		0.23509898217018269
  	],
  	[
  		-8.051053480598393,
  		4.543130731745889,
  		0.24130881877273969
  	],
  	[
  		-8.140741528860845,
  		4.396228057184206,
  		0.24743701064238863
  	],
  	[
  		-8.227691358324352,
  		4.24785385954905,
  		0.2534819327380129
  	],
  	[
  		-8.311881021345554,
  		4.098062337357264,
  		0.259442096359901
  	],
  	[
  		-8.393290394689192,
  		3.946907497059749,
  		0.2653159576806629
  	],
  	[
  		-8.471900173657932,
  		3.794444788592789,
  		0.271101578887793
  	],
  	[
  		-8.547693590701334,
  		3.640729468502182,
  		0.2767971291474318
  	],
  	[
  		-8.620653253883352,
  		3.485815263484776,
  		0.28240066497128574
  	],
  	[
  		-8.690761871658951,
  		3.329756802303584,
  		0.28791025637713463
  	],
  	[
  		-8.758003675988983,
  		3.172608124622276,
  		0.2933244557136678
  	],
  	[
  		-8.822363150050466,
  		3.014423178368974,
  		0.2986418642977625
  	],
  	[
  		-8.883827624322288,
  		2.855257152663671,
  		0.30386138192554485
  	],
  	[
  		-8.94238686776123,
  		2.695164614558404,
  		0.3089819635660356
  	],
  	[
  		-8.998031292788886,
  		2.534200145025553,
  		0.3140020884053294
  	],
  	[
  		-9.05075234229899,
  		2.372418306044479,
  		0.31892030477206035
  	],
  	[
  		-9.100540881022548,
  		2.209873075490984,
  		0.323734987925529
  	],
  	[
  		-9.147387688006052,
  		2.046618870226697,
  		0.328444461246492
  	],
  	[
  		-9.191284352525308,
  		1.882710477430846,
  		0.3330475071243512
  	],
  	[
  		-9.232223753695616,
  		1.718203128622841,
  		0.3375429970722189
  	],
  	[
  		-9.270201812696564,
  		1.553151633313316,
  		0.34193018601396075
  	],
  	[
  		-9.305216443053837,
  		1.387610308401722,
  		0.34620844547029084
  	],
  	[
  		-9.337267152961036,
  		1.221633410008484,
  		0.35037673643847983
  	],
  	[
  		-9.36635419088146,
  		1.055273850949176,
  		0.3544340057377827
  	],
  	[
  		-9.39247668759168,
  		0.8885848616411747,
  		0.358378924306024
  	],
  	[
  		-9.415634417717909,
  		0.7216200625661034,
  		0.3622101594755138
  	],
  	[
  		-9.435827390654062,
  		0.5544321477394085,
  		0.3659267375569528
  	],
  	[
  		-9.453056272001465,
  		0.38707488754959685,
  		0.3695277437567586
  	],
  	[
  		-9.467324849906456,
  		0.2196010051905332,
  		0.3730127983215624
  	],
  	[
  		-9.478637830341755,
  		0.05206164763041655,
  		0.3763816203782469
  	],
  	[
  		-9.487001153853488,
  		-0.115490896121405,
  		0.3796335861117359
  	],
  	[
  		-9.492422156280574,
  		-0.28300545932213444,
  		0.38276812547242484
  	],
  	[
  		-9.494906811035918,
  		-0.4504306935303043,
  		0.3857842108355707
  	],
  	[
  		-9.494462141778682,
  		-0.6177137015205563,
  		0.38868081897447615
  	],
  	[
  		-9.491096478545682,
  		-0.7848030361057792,
  		0.39145732251645526
  	],
  	[
  		-9.484818432377107,
  		-0.9516473075104188,
  		0.39411298790603444
  	],
  	[
  		-9.475639334248042,
  		-1.118196157592802,
  		0.3966476805664083
  	],
  	[
  		-9.463571541749081,
  		-1.284401892138404,
  		0.3990614944143355
  	],
  	[
  		-9.448627556402531,
  		-1.450216542888552,
  		0.4013541435347048
  	],
  	[
  		-9.430820816819562,
  		-1.615592389267155,
  		0.403525474839121
  	],
  	[
  		-9.410163956750198,
  		-1.780481492986141,
  		0.4055748940774428
  	],
  	[
  		-9.38666986947891,
  		-1.944834368663671,
  		0.40750164958929314
  	],
  	[
  		-9.360352789221666,
  		-2.108602019163006,
  		0.40930540754033107
  	],
  	[
  		-9.33122800557479,
  		-2.271736001691195,
  		0.41098572803664957
  	],
  	[
  		-9.299312264164849,
  		-2.434189250218237,
  		0.4125426015886025
  	],
  	[
  		-9.264623262330986,
  		-2.595916666432532,
  		0.4139763734745989
  	],
  	[
  		-9.227179758925736,
  		-2.756873617329159,
  		0.4152871606562732
  	],
  	[
  		-9.187000673430404,
  		-2.917015820475417,
  		0.4164751223487005
  	],
  	[
  		-9.144105022760563,
  		-3.076298116877402,
  		0.417540084922131
  	],
  	[
  		-9.098513054418506,
  		-3.234674956480553,
  		0.4184816956700875
  	],
  	[
  		-9.050244933461762,
  		-3.392101708292973,
  		0.41929981083728596
  	],
  	[
  		-8.99932185731195,
  		-3.548534110479069,
  		0.4199942732045858
  	],
  	[
  		-8.945765996050834,
  		-3.703930151725234,
  		0.42056526365068514
  	],
  	[
  		-8.889598486221644,
  		-3.858249156919158,
  		0.4210132051692698
  	],
  	[
  		-8.83084199036516,
  		-4.01145006643682,
  		0.42133857391793134
  	],
  	[
  		-8.769519869344055,
  		-4.163492538915949,
  		0.4215418876719979
  	],
  	[
  		-8.705655308163152,
  		-4.3143345988932,
  		0.4216232959662398
  	],
  	[
  		-8.639274131042935,
  		-4.463933633394782,
  		0.42158289692707407
  	],
  	[
  		-8.57040233565985,
  		-4.612249018089586,
  		0.4214207806863346
  	],
  	[
  		-8.499066051340943,
  		-4.75924034958376,
  		0.42113696625358554
  	],
  	[
  		-8.425292791852733,
  		-4.904869448905807,
  		0.42073186156817094
  	],
  	[
  		-8.349108514625131,
  		-5.049100382283426,
  		0.4202059430354008
  	],
  	[
  		-8.27053970451119,
  		-5.191896579636625,
  		0.41955989253941983
  	],
  	[
  		-8.189614176282861,
  		-5.333222128613191,
  		0.4187946116064981
  	],
  	[
  		-8.106359503653854,
  		-5.47304042332179,
  		0.41791056744861504
  	],
  	[
  		-8.020805223788312,
  		-5.611313745924336,
  		0.41690823547494643
  	],
  	[
  		-7.932981411899373,
  		-5.748005879664271,
  		0.41578801081938777
  	],
  	[
  		-7.842917691723961,
  		-5.883081383841229,
  		0.4145500597725983
  	],
  	[
  		-7.75064435455935,
  		-6.016505930827858,
  		0.4131949430040671
  	],
  	[
  		-7.656190881817131,
  		-6.148246684665272,
  		0.41172324514262026
  	],
  	[
  		-7.559587153772289,
  		-6.27827106538051,
  		0.41013576207704894
  	],
  	[
  		-7.460864508794248,
  		-6.406546658946184,
  		0.4084336699749315
  	],
  	[
  		-7.36005543035407,
  		-6.533040830059039,
  		0.4066178109121899
  	],
  	[
  		-7.257193951619588,
  		-6.657721558283884,
  		0.4046889855427038
  	],
  	[
  		-7.15231401204077,
  		-6.780557755299204,
  		0.40264784590771313
  	],
  	[
  		-7.04544922931658,
  		-6.901519241121528,
  		0.4004947828561549
  	],
  	[
  		-6.936632438130018,
  		-7.020577592369429,
  		0.39823045816347724
  	],
  	[
  		-6.825895143555715,
  		-7.137704200081184,
  		0.39585551918666173
  	],
  	[
  		-6.713269852963627,
  		-7.252870546450737,
  		0.39337091960211434
  	],
  	[
  		-6.598789877354396,
  		-7.366048925009943,
  		0.39077799584700423
  	],
  	[
  		-6.482490210275864,
  		-7.477210548054645,
  		0.3880778814707655
  	],
  	[
  		-6.364408304949333,
  		-7.586327937090855,
  		0.3852717661332774
  	],
  	[
  		-6.244580758720316,
  		-7.693374974251323,
  		0.3823605030862396
  	],
  	[
  		-6.123044111378161,
  		-7.798325357426195,
  		0.3793446683676017
  	],
  	[
  		-5.999834662990431,
  		-7.90115502172281,
  		0.37622511051543595
  	],
  	[
  		-5.874986677506615,
  		-8.001839937877794,
  		0.373002493492515
  	],
  	[
  		-5.748535682866823,
  		-8.10035567413355,
  		0.36967786541816633
  	],
  	[
  		-5.620518223112827,
  		-8.196679864513548,
  		0.36625274791130963
  	],
  	[
  		-5.490971304508635,
  		-8.29078976503077,
  		0.3627284463779674
  	],
  	[
  		-5.359934117445674,
  		-8.38266341500829,
  		0.3591064613987515
  	],
  	[
  		-5.227445121861156,
  		-8.47228039912925,
  		0.3553879359882374
  	],
  	[
  		-5.093541740083174,
  		-8.559619365131441,
  		0.3515735725236772
  	],
  	[
  		-4.958261508905088,
  		-8.644659840657196,
  		0.34766437399489236
  	],
  	[
  		-4.821640981389497,
  		-8.727381594771606,
  		0.3436611327806638
  	],
  	[
  		-4.683717529209415,
  		-8.807763913565518,
  		0.3395649072785061
  	],
  	[
  		-4.544530029019968,
  		-8.885788039644437,
  		0.3353773242912925
  	],
  	[
  		-4.40411838035864,
  		-8.961436339293703,
  		0.3310998830455291
  	],
  	[
  		-4.262523490710413,
  		-9.034692300271505,
  		0.3267342557085056
  	],
  	[
  		-4.119785839607164,
  		-9.105540581823318,
  		0.32228186234289774
  	],
  	[
  		-3.975945118493937,
  		-9.17396566651325,
  		0.31774362989831895
  	],
  	[
  		-3.831039777735851,
  		-9.239952187193559,
  		0.31312063076357455
  	],
  	[
  		-3.685107866302827,
  		-9.303484281373937,
  		0.308413823511184
  	],
  	[
  		-3.538188402827576,
  		-9.364546441309525,
  		0.3036243469232334
  	],
  	[
  		-3.390320553017974,
  		-9.423124453720126,
  		0.2987537893140697
  	],
  	[
  		-3.241545070868612,
  		-9.479204939734512,
  		0.29380381629794433
  	],
  	[
  		-3.091903681364489,
  		-9.532776551408324,
  		0.2887762542438225
  	],
  	[
  		-2.94143711151509,
  		-9.583828109215236,
  		0.2836726798320355
  	],
  	[
  		-2.790186740039339,
  		-9.632347826055154,
  		0.2784943275726239
  	],
  	[
  		-2.638192984967318,
  		-9.678324849859553,
  		0.27324237405648544
  	],
  	[
  		-2.485495638186315,
  		-9.721747361559864,
  		0.2679178628578384
  	],
  	[
  		-2.332136319131364,
  		-9.76260450267288,
  		0.2625221041693068
  	],
  	[
  		-2.178155749722549,
  		-9.800888010331244,
  		0.25705661120250534
  	],
  	[
  		-2.023594930799037,
  		-9.836589989835513,
  		0.2515230702109217
  	],
  	[
  		-1.868495886977523,
  		-9.869704547237628,
  		0.2459234919102626
  	],
  	[
  		-1.71289888341024,
  		-9.900226194292305,
  		0.24025954565897112
  	],
  	[
  		-1.556844857984285,
  		-9.928147474761976,
  		0.23453271551367513
  	],
  	[
  		-1.400375035668178,
  		-9.953461333633873,
  		0.2287444068699779
  	],
  	[
  		-1.243529917274673,
  		-9.976160334354446,
  		0.22289570752855
  	],
  	[
  		-1.086351874046404,
  		-9.996237479562506,
  		0.21698804615375092
  	],
  	[
  		-0.928883005263595,
  		-10.01368848720082,
  		0.21102295430578233
  	],
  	[
  		-0.7711647810442328,
  		-10.02851034941375,
  		0.20500203016097493
  	],
  	[
  		-0.6132394196933255,
  		-10.04070151245667,
  		0.1989273615230738
  	],
  	[
  		-0.4551482263405494,
  		-10.05026108870849,
  		0.19280077638622942
  	],
  	[
  		-0.296932657549922,
  		-10.0571872018887,
  		0.18662393837741792
  	],
  	[
  		-0.13863457695849898,
  		-10.06147766301606,
  		0.18039847153224853
  	],
  	[
  		0.01970437584064089,
  		-10.06313025701237,
  		0.1741256177990409
  	],
  	[
  		0.1780421595259683,
  		-10.062143846386311,
  		0.16780684747291602
  	],
  	[
  		0.33633735426788375,
  		-10.058518598156741,
  		0.16144368830842182
  	],
  	[
  		0.4945488184473951,
  		-10.052255837075581,
  		0.15503771665862262
  	],
  	[
  		0.6526357346598435,
  		-10.04335838178476,
  		0.14859096889545462
  	],
  	[
  		0.8105573710627717,
  		-10.031828514337,
  		0.1421053701747609
  	],
  	[
  		0.9682714506957599,
  		-10.01766834707835,
  		0.1355828305330411
  	],
  	[
  		1.125735642016671,
  		-10.000880274637892,
  		0.129025133206033
  	],
  	[
  		1.282907135186136,
  		-9.981466264548184,
  		0.12243367007500011
  	],
  	[
  		1.439742599569874,
  		-9.959430646131043,
  		0.1158100243289675
  	],
  	[
  		1.596200850376709,
  		-9.934779152517622,
  		0.10915565808885519
  	],
  	[
  		1.752241101406388,
  		-9.907517820815945,
  		0.1024721081477531
  	],
  	[
  		1.907823178998297,
  		-9.877654784274188,
  		0.09576139187054894
  	],
  	[
  		2.062908004757139,
  		-9.845197123564843,
  		0.08902541902961619
  	],
  	[
  		2.21745420683096,
  		-9.810151156549997,
  		0.08226630275746445
  	],
  	[
  		2.371419793944416,
  		-9.772524330940902,
  		0.07548604706029172
  	],
  	[
  		2.524762887072569,
  		-9.732323145596544,
  		0.06868613649939005
  	],
  	[
  		2.677440667642683,
  		-9.689555846434448,
  		0.061868262107395565
  	],
  	[
  		2.829412199258274,
  		-9.64423264962904,
  		0.055033890920185215
  	],
  	[
  		2.980637558739935,
  		-9.596363358666904,
  		0.048184460922925824
  	],
  	[
  		3.131076839348251,
  		-9.54595950714892,
  		0.04132196018431978
  	],
  	[
  		3.280690755463342,
  		-9.493032889425455,
  		0.03444829934390269
  	],
  	[
  		3.429438445663346,
  		-9.437594823021996,
  		0.027565667701577833
  	],
  	[
  		3.577278138460981,
  		-9.379658107387986,
  		0.0206762898194558
  	],
  	[
  		3.72416847973721,
  		-9.31923567373347,
  		0.01378179777096489
  	],
  	[
  		3.870068662777779,
  		-9.25634117577202,
  		0.006883906167266653
  	],
  	[
  		4.014939494950076,
  		-9.190989270753027,
  		-0.000015858073102463237
  	],
  	[
  		4.158742774017206,
  		-9.12319442316771,
  		-0.006916103695098965
  	],
  	[
  		4.30144084619309,
  		-9.052971514042103,
  		-0.01381496630184204
  	],
  	[
  		4.442995424346589,
  		-8.9803355958459,
  		-0.020710500090494022
  	],
  	[
  		4.583366583636543,
  		-8.90530276308909,
  		-0.027600491920768043
  	],
  	[
  		4.722513973995935,
  		-8.827890269830736,
  		-0.03448263600304179
  	],
  	[
  		4.860396622292336,
  		-8.748115891650228,
  		-0.04135506692045058
  	],
  	[
  		4.996974741714621,
  		-8.66599907844436,
  		-0.04821605558009141
  	],
  	[
  		5.132210787112664,
  		-8.581559277501588,
  		-0.0550640921587813
  	],
  	[
  		5.266067412183419,
  		-8.49481588359674,
  		-0.06189770471701414
  	],
  	[
  		5.39850877111138,
  		-8.405789379020522,
  		-0.06871518416567927
  	],
  	[
  		5.529498898098381,
  		-8.314499636461216,
  		-0.07551465507856793
  	],
  	[
  		5.658999783981709,
  		-8.220968061347994,
  		-0.08229383171632891
  	],
  	[
  		5.786974151266708,
  		-8.125217745189184,
  		-0.08905045329251957
  	],
  	[
  		5.91338400390058,
  		-8.027271211212152,
  		-0.09578250568580239
  	],
  	[
  		6.038191525327741,
  		-7.92715244282075,
  		-0.102488118167119
  	],
  	[
  		6.161361603296756,
  		-7.824885349562955,
  		-0.10916586405808251
  	],
  	[
  		6.282858572689014,
  		-7.720492950824591,
  		-0.1158142188759429
  	],
  	[
  		6.402647151147997,
  		-7.613999892637866,
  		-0.1224314998967307
  	],
  	[
  		6.520692806700547,
  		-7.505431200444685,
  		-0.1290160123756992
  	],
  	[
  		6.636959210224402,
  		-7.394813498645044,
  		-0.135565489785431
  	],
  	[
  		6.751410812599477,
  		-7.282175877135701,
  		-0.14207768309989552
  	],
  	[
  		6.864012787295966,
  		-7.16754729272531,
  		-0.1485505633794467
  	],
  	[
  		6.974730478393537,
  		-7.050956980187757,
  		-0.1549821302954486
  	],
  	[
  		7.083531318286354,
  		-6.93243374999436,
  		-0.1613709292609894
  	],
  	[
  		7.190382930470539,
  		-6.812005337595692,
  		-0.1677154640243113
  	],
  	[
  		7.295252667925464,
  		-6.689700099246775,
  		-0.1740140712265713
  	],
  	[
  		7.398108022566984,
  		-6.565547348075206,
  		-0.1802651700270677
  	],
  	[
  		7.498915962032811,
  		-6.439578297270589,
  		-0.1864666556052036
  	],
  	[
  		7.597643893457878,
  		-6.311825906604041,
  		-0.1926163565103007
  	],
  	[
  		7.694259403364497,
  		-6.182323927962083,
  		-0.19871222008788011
  	],
  	[
  		7.788730975006174,
  		-6.051106374352489,
  		-0.20475220866511942
  	],
  	[
  		7.881028168939447,
  		-5.918206122461795,
  		-0.2107348063832374
  	],
  	[
  		7.971120422352824,
  		-5.783656268323499,
  		-0.21665848992167824
  	],
  	[
  		8.05897824249516,
  		-5.647490522479193,
  		-0.2225216884102108
  	],
  	[
  		8.144572268305463,
  		-5.509742992553724,
  		-0.22832292267171292
  	],
  	[
  		8.227873398147047,
  		-5.370450462035751,
  		-0.23406025480821732
  	],
  	[
  		8.308854340139504,
  		-5.229650369226894,
  		-0.2397317213443634
  	],
  	[
  		8.387487292343058,
  		-5.0873800502968,
  		-0.24533528727596374
  	],
  	[
  		8.463744874366753,
  		-4.943677747642369,
  		-0.2508688770540748
  	],
  	[
  		8.537600581514132,
  		-4.79857964384125,
  		-0.2563309637377404
  	],
  	[
  		8.609026590757106,
  		-4.652122102852969,
  		-0.2617199673475661
  	],
  	[
  		8.677996149305251,
  		-4.504343451464912,
  		-0.267034395283731
  	],
  	[
  		8.74448334748047,
  		-4.355281957193147,
  		-0.2722729395270307
  	],
  	[
  		8.808462505043082,
  		-4.204978639564724,
  		-0.2774338201422951
  	],
  	[
  		8.86991049875331,
  		-4.053476112949988,
  		-0.2825153177484385
  	],
  	[
  		8.928804584897714,
  		-3.900816105565945,
  		-0.2875155506862484
  	],
  	[
  		8.985121980764175,
  		-3.747041154114258,
  		-0.29243240390968345
  	],
  	[
  		9.038840769211353,
  		-3.592192471980637,
  		-0.2972643392905878
  	],
  	[
  		9.08993816186133,
  		-3.436310483008359,
  		-0.3020098009074068
  	],
  	[
  		9.138391978188954,
  		-3.279437305353489,
  		-0.3066673243554215
  	],
  	[
  		9.18418129613889,
  		-3.121615474711353,
  		-0.3112357875789269
  	],
  	[
  		9.227286007621661,
  		-2.962888970758341,
  		-0.31571366734138323
  	],
  	[
  		9.267687744120098,
  		-2.803303082526048,
  		-0.32009944118526795
  	],
  	[
  		9.305368712089974,
  		-2.642903021965033,
  		-0.32439146448258244
  	],
  	[
  		9.34031103525241,
  		-2.481734297815767,
  		-0.32858773201012775
  	],
  	[
  		9.372496417794844,
  		-2.319841992061449,
  		-0.3326866232873336
  	],
  	[
  		9.401906535816172,
  		-2.157271668571119,
  		-0.3366866632295678
  	],
  	[
  		9.428524507603518,
  		-1.994069779036724,
  		-0.3405865146277933
  	],
  	[
  		9.452334516781372,
  		-1.830283334015106,
  		-0.34438513696402445
  	],
  	[
  		9.473323137881065,
  		-1.665960649055499,
  		-0.3480813374286827
  	],
  	[
  		9.491478922525285,
  		-1.501149615172207,
  		-0.35167387880942175
  	],
  	[
  		9.506790024397501,
  		-1.335898071765211,
  		-0.35516128103164246
  	],
  	[
  		9.519245242732987,
  		-1.17025441737679,
  		-0.3585418069305019
  	],
  	[
  		9.5288322295714,
  		-1.004266124991538,
  		-0.3618138605750521
  	],
  	[
  		9.535537632726454,
  		-0.8379819693991557,
  		-0.3649759550631074
  	],
  	[
  		9.539350633604695,
  		-0.6714516828614527,
  		-0.36802699550058127
  	],
  	[
  		9.540261116073884,
  		-0.504724818181069,
  		-0.37096606871979343
  	],
  	[
  		9.538260895814483,
  		-0.33785267643296824,
  		-0.37379220840527244
  	],
  	[
  		9.533344915214295,
  		-0.17088603046427142,
  		-0.3765045773542055
  	],
  	[
  		9.525507421196156,
  		-0.003875257041347746,
  		-0.3791019136577699
  	],
  	[
  		9.514743282303366,
  		0.16312779754298362,
  		-0.3815827325953061
  	],
  	[
  		9.501047674998597,
  		0.33007200102744844,
  		-0.38394565194490443
  	],
  	[
  		9.484414607116305,
  		0.49690558095358783,
  		-0.38618921338230794
  	],
  	[
  		9.464840445863437,
  		0.663575898499087,
  		-0.3883125083416428
  	],
  	[
  		9.442323190471331,
  		0.8300313555069363,
  		-0.3903148727164528
  	],
  	[
  		9.416861923553464,
  		0.9962198221726141,
  		-0.39219555053711214
  	],
  	[
  		9.388458046998917,
  		1.16208941390663,
  		-0.3939540557571735
  	],
  	[
  		9.35711282115116,
  		1.327588655870388,
  		-0.3955894766221276
  	],
  	[
  		9.322827465641227,
  		1.492664652036596,
  		-0.39710062003486724
  	],
  	[
  		9.285603543218432,
  		1.657263702543648,
  		-0.398486381962583
  	],
  	[
  		9.24544270641499,
  		1.821331350313196,
  		-0.3997454862059571
  	],
  	[
  		9.202348604171258,
  		1.984812955586848,
  		-0.40087718827301144
  	],
  	[
  		9.156326857691246,
  		2.147654375193587,
  		-0.4018810739716283
  	],
  	[
  		9.10738519965462,
  		2.30980211785398,
  		-0.4027566795833911
  	],
  	[
  		9.05553282125801,
  		2.47120397760079,
  		-0.40350381857571627
  	],
  	[
  		9.00077894894151,
  		2.631807334927799,
  		-0.4041219597016598
  	],
  	[
  		8.943133573343202,
  		2.791559059351315,
  		-0.40461033031729077
  	],
  	[
  		8.882606370282845,
  		2.950405530031702,
  		-0.40496814181043245
  	],
  	[
  		8.819207466791902,
  		3.108291345295903,
  		-0.40519439879852587
  	],
  	[
  		8.752949064253766,
  		3.265162155413939,
  		-0.40528860747772466
  	],
  	[
  		8.683844113111293,
  		3.420964478608986,
  		-0.40525055167682
  	],
  	[
  		8.611907772844681,
  		3.575644586867671,
  		-0.405080090929041
  	],
  	[
  		8.53715665952427,
  		3.729150789242329,
  		-0.4047773929949601
  	],
  	[
  		8.459607084553392,
  		3.881430476007475,
  		-0.4043422679135882
  	],
  	[
  		8.379277455524248,
  		4.032429544933019,
  		-0.40377444270920704
  	],
  	[
  		8.296186854857831,
  		4.182094522472013,
  		-0.4030735794844331
  	],
  	[
  		8.210354831252097,
  		4.330370394103908,
  		-0.4022389862168635
  	],
  	[
  		8.121803474453204,
  		4.477203260431748,
  		-0.4012704904255209
  	],
  	[
  		8.030555166516926,
  		4.622541787810395,
  		-0.40016813732442896
  	],
  	[
  		7.936633275725534,
  		4.766334652835323,
  		-0.3989320370121228
  	],
  	[
  		7.840062630522706,
  		4.908532074503505,
  		-0.39756275153436954
  	],
  	[
  		7.740867687640987,
  		5.049084100357172,
  		-0.3960605135583927
  	],
  	[
  		7.639074521905023,
  		5.187938902634289,
  		-0.3944254939052834
  	],
  	[
  		7.534710839125265,
  		5.325044718260597,
  		-0.392657910163115
  	],
  	[
  		7.427805188519027,
  		5.460349051157754,
  		-0.3907575206189851
  	],
  	[
  		7.318387895664463,
  		5.593800126181236,
  		-0.3887244203384556
  	],
  	[
  		7.206490192505491,
  		5.72534846891994,
  		-0.38655897736330846
  	],
  	[
  		7.092144213483491,
  		5.854945706975713,
  		-0.3842616096968675
  	],
  	[
  		6.975382870704929,
  		5.982544688212239,
  		-0.3818331638388175
  	],
  	[
  		6.856240014483336,
  		6.108098271605139,
  		-0.37927437326577834
  	],
  	[
  		6.734751175732268,
  		6.231558932487362,
  		-0.3765859151085406
  	],
  	[
  		6.610952820596471,
  		6.352879159083543,
  		-0.373768479584842
  	],
  	[
  		6.484883241032326,
  		6.472011214964607,
  		-0.37082242170416246
  	],
  	[
  		6.356581457620688,
  		6.588909017896291,
  		-0.36774818670548404
  	],
  	[
  		6.226085880532132,
  		6.703527837150008,
  		-0.36454636580439054
  	],
  	[
  		6.093436382935866,
  		6.815823975269421,
  		-0.3612177761397135
  	],
  	[
  		5.9586729166467,
  		6.925755141748837,
  		-0.3577635536979034
  	],
  	[
  		5.821836351508768,
  		7.033278048406221,
  		-0.35418483237468
  	],
  	[
  		5.682970933845031,
  		7.138349678634779,
  		-0.35048289541051214
  	],
  	[
  		5.542121690026122,
  		7.240927965499923,
  		-0.3466588930287782
  	]
  ];
  var saturnOrbit = {
  	targetName: targetName$5,
  	name: name$5,
  	startDate: startDate$5,
  	stopDate: stopDate$5,
  	stepSize: stepSize$5,
  	coords: coords$5
  };

  var saturnOrbit$1 = {
    __proto__: null,
    targetName: targetName$5,
    name: name$5,
    startDate: startDate$5,
    stopDate: stopDate$5,
    stepSize: stepSize$5,
    coords: coords$5,
    'default': saturnOrbit
  };

  var targetName$6 = "uranus";
  var name$6 = "Uranus";
  var startDate$6 = "2000-01-01";
  var stopDate$6 = "2084-01-01";
  var stepSize$6 = 84;
  var coords$6 = [
  	[
  		14.430517557656339,
  		-13.73565774412954,
  		-0.2381291358891927
  	],
  	[
  		14.653556409756881,
  		-13.509394955848231,
  		-0.24017830446740962
  	],
  	[
  		14.87266676533541,
  		-13.279622119292341,
  		-0.2421615774564946
  	],
  	[
  		15.0878032560488,
  		-13.0464166751925,
  		-0.2440792671820211
  	],
  	[
  		15.29892257100705,
  		-12.80984390106817,
  		-0.2459318506562553
  	],
  	[
  		15.50597624245256,
  		-12.569984561577561,
  		-0.2477180796502108
  	],
  	[
  		15.70894064334273,
  		-12.32690976166136,
  		-0.24943845831074574
  	],
  	[
  		15.90777189348087,
  		-12.08067151930166,
  		-0.25109240991296444
  	],
  	[
  		16.10242054285274,
  		-11.83134915451962,
  		-0.25267956457867674
  	],
  	[
  		16.29285900259569,
  		-11.579013486367959,
  		-0.2542010197197239
  	],
  	[
  		16.47904870394634,
  		-11.32372801016225,
  		-0.2556554737755055
  	],
  	[
  		16.66095922866884,
  		-11.065562734511769,
  		-0.2570426643766575
  	],
  	[
  		16.83855373431512,
  		-10.804571503992591,
  		-0.2583636373662061
  	],
  	[
  		17.01178373064972,
  		-10.540829713995238,
  		-0.2596175699599181
  	],
  	[
  		17.18062954150827,
  		-10.274411904285,
  		-0.2608044421843682
  	],
  	[
  		17.345058453743,
  		-10.00536773714112,
  		-0.2619242118864574
  	],
  	[
  		17.50502715495869,
  		-9.733767657725041,
  		-0.262976436519448
  	],
  	[
  		17.66050560084502,
  		-9.459677887955115,
  		-0.2639618525809025
  	],
  	[
  		17.81145351555234,
  		-9.183165907798012,
  		-0.26487995267663533
  	],
  	[
  		17.95784850406518,
  		-8.90430639185126,
  		-0.2657300548962248
  	],
  	[
  		18.09966135064611,
  		-8.623149268608037,
  		-0.2665127873514734
  	],
  	[
  		18.23684224732131,
  		-8.339764989401191,
  		-0.2672281420136656
  	],
  	[
  		18.369367975875118,
  		-8.05423310102391,
  		-0.2678756836556822
  	],
  	[
  		18.49721063623856,
  		-7.766611780304232,
  		-0.26845517528067847
  	],
  	[
  		18.62033558943536,
  		-7.476972151452641,
  		-0.2689667323240915
  	],
  	[
  		18.73871574032007,
  		-7.185377695726597,
  		-0.2694104064006166
  	],
  	[
  		18.85230662742259,
  		-6.891898034055817,
  		-0.26978593180068444
  	],
  	[
  		18.96108676790185,
  		-6.59661891491797,
  		-0.2700932692623801
  	],
  	[
  		19.0650375230693,
  		-6.299596474456721,
  		-0.2703319878739636
  	],
  	[
  		19.16411427829575,
  		-6.000899015586253,
  		-0.27050233748671987
  	],
  	[
  		19.25829165939376,
  		-5.70060807889995,
  		-0.2706046500107559
  	],
  	[
  		19.34754092942103,
  		-5.398792029083515,
  		-0.2706378217215563
  	],
  	[
  		19.43183498374623,
  		-5.095532148112865,
  		-0.2706021410720989
  	],
  	[
  		19.51115642423317,
  		-4.790894561756529,
  		-0.2704979855637518
  	],
  	[
  		19.58546155465607,
  		-4.484949021472842,
  		-0.2703245227708229
  	],
  	[
  		19.654725306079868,
  		-4.177790652122482,
  		-0.2700823111377451
  	],
  	[
  		19.718936417119718,
  		-3.869490415820955,
  		-0.2697707989969477
  	],
  	[
  		19.77806139456606,
  		-3.560122531807299,
  		-0.2693894824138723
  	],
  	[
  		19.8320795837152,
  		-3.249771244231414,
  		-0.26893966322253743
  	],
  	[
  		19.880962513618602,
  		-2.93851278947917,
  		-0.26842020307487163
  	],
  	[
  		19.92468669037495,
  		-2.6264441001931,
  		-0.2678306146188835
  	],
  	[
  		19.96324935166452,
  		-2.313644192510703,
  		-0.2671720516284597
  	],
  	[
  		19.99661908724647,
  		-2.000186680171899,
  		-0.26644364850711505
  	],
  	[
  		20.02477376949104,
  		-1.686172945010151,
  		-0.2656457703339326
  	],
  	[
  		20.047709230552968,
  		-1.371689808857038,
  		-0.26477851353970444
  	],
  	[
  		20.065409615720032,
  		-1.056826318326171,
  		-0.2638409959973471
  	],
  	[
  		20.07787261354185,
  		-0.7416728719401503,
  		-0.2628347919173905
  	],
  	[
  		20.08508380920238,
  		-0.42630897417679803,
  		-0.26175959241605573
  	],
  	[
  		20.087029784552143,
  		-0.11084093845245391,
  		-0.2606145027864548
  	],
  	[
  		20.08372700707477,
  		0.20463792963197214,
  		-0.25940108763771325
  	],
  	[
  		20.07517171725803,
  		0.5200497342968122,
  		-0.2581191799802892
  	],
  	[
  		20.06136164296052,
  		0.8352958274794656,
  		-0.2567690093325549
  	],
  	[
  		20.042306895979397,
  		1.150288555837789,
  		-0.2553514583797397
  	],
  	[
  		20.01801131274533,
  		1.464932555873185,
  		-0.2538659464169719
  	],
  	[
  		19.98849930237045,
  		1.779136203173892,
  		-0.2523139135526436
  	],
  	[
  		19.95378023901423,
  		2.092829368189785,
  		-0.2506961611253947
  	],
  	[
  		19.91385532303384,
  		2.405915714506207,
  		-0.24901196380449664
  	],
  	[
  		19.86875326945658,
  		2.718303843730299,
  		-0.24726277101456573
  	],
  	[
  		19.818491542138588,
  		3.029918892654492,
  		-0.24544928359235502
  	],
  	[
  		19.7630886789918,
  		3.340674780426403,
  		-0.2435716901800405
  	],
  	[
  		19.70256532196803,
  		3.650499441596096,
  		-0.2416311771981866
  	],
  	[
  		19.63693016865512,
  		3.959306975872887,
  		-0.2396278017662668
  	],
  	[
  		19.5662189508778,
  		4.26700854992488,
  		-0.2375623725361729
  	],
  	[
  		19.49045661051541,
  		4.573544711484144,
  		-0.2354361937525635
  	],
  	[
  		19.40965190487674,
  		4.878835786921449,
  		-0.23324933028002814
  	],
  	[
  		19.3238336188105,
  		5.182801047308566,
  		-0.23100233460879213
  	],
  	[
  		19.23302177702936,
  		5.485368328050262,
  		-0.22869617966917088
  	],
  	[
  		19.13724561490461,
  		5.786456177218095,
  		-0.2263316597688538
  	],
  	[
  		19.03653377019527,
  		6.086004758355071,
  		-0.22390933945039052
  	],
  	[
  		18.93089322839131,
  		6.383939858514703,
  		-0.22142967397531882
  	],
  	[
  		18.82035777758331,
  		6.680173477106553,
  		-0.2188934555251274
  	],
  	[
  		18.70496023633784,
  		6.974645234074975,
  		-0.21630139223987732
  	],
  	[
  		18.584717454348688,
  		7.267283439410193,
  		-0.2136544224422151
  	],
  	[
  		18.4596597210301,
  		7.55801652990244,
  		-0.21095288278166924
  	],
  	[
  		18.329803871187693,
  		7.846775162216901,
  		-0.20819688114800838
  	],
  	[
  		18.19518221583789,
  		8.133473403331951,
  		-0.2053881290140085
  	],
  	[
  		18.05583447948265,
  		8.418053008954756,
  		-0.20252710330560883
  	],
  	[
  		17.9117716863458,
  		8.70044890507606,
  		-0.19961357855214512
  	],
  	[
  		17.7630248294531,
  		8.980576338747278,
  		-0.1966490292004062
  	],
  	[
  		17.60962857400643,
  		9.25836967324411,
  		-0.1936338019073126
  	],
  	[
  		17.45160876512712,
  		9.533755257637603,
  		-0.1905685874105984
  	],
  	[
  		17.28900392379776,
  		9.806666546202395,
  		-0.187454472824687
  	],
  	[
  		17.121831504723758,
  		10.07703972303958,
  		-0.18429085835801592
  	],
  	[
  		16.95012119562262,
  		10.344785121719191,
  		-0.18107931324096602
  	],
  	[
  		16.77392175946355,
  		10.609837021092321,
  		-0.177821069703774
  	],
  	[
  		16.59325508761253,
  		10.8721329759246,
  		-0.17451528131305521
  	],
  	[
  		16.40815429040563,
  		11.1315928974914,
  		-0.17116344376128512
  	],
  	[
  		16.218654044156253,
  		11.38814844523326,
  		-0.16776627594729432
  	],
  	[
  		16.02478526792155,
  		11.64171721370915,
  		-0.1643238771165199
  	],
  	[
  		15.82659873409155,
  		11.89222878299759,
  		-0.16083781076735712
  	],
  	[
  		15.62412117097695,
  		12.139622604878799,
  		-0.1573076499387202
  	],
  	[
  		15.41738241788602,
  		12.38380824779651,
  		-0.1537342119747512
  	],
  	[
  		15.20643594280191,
  		12.62470907931607,
  		-0.15011935276651361
  	],
  	[
  		14.99131940463293,
  		12.862254568800049,
  		-0.1464624328448183
  	],
  	[
  		14.772078884571691,
  		13.09636472634226,
  		-0.1427645441424718
  	],
  	[
  		14.54875690058413,
  		13.326971182734798,
  		-0.1390268809512727
  	],
  	[
  		14.32139165359769,
  		13.55398365306929,
  		-0.1352494018672064
  	],
  	[
  		14.09004995865734,
  		13.777320394967141,
  		-0.13143392386236172
  	],
  	[
  		13.854780587019611,
  		13.99691972435968,
  		-0.1275807249168524
  	],
  	[
  		13.615628813297679,
  		14.212694686853451,
  		-0.12369005906815381
  	],
  	[
  		13.37265896717922,
  		14.424566211994549,
  		-0.11976420291902362
  	],
  	[
  		13.1259276505532,
  		14.6324567318403,
  		-0.1158035185568155
  	],
  	[
  		12.87550729783768,
  		14.836286341734171,
  		-0.1118087178330895
  	],
  	[
  		12.62146266405477,
  		15.03599611506698,
  		-0.10778143868965051
  	],
  	[
  		12.36384742059564,
  		15.231504475660309,
  		-0.10372229991163771
  	],
  	[
  		12.10274523896095,
  		15.42273074816055,
  		-0.0996330160347226
  	],
  	[
  		11.83823064705971,
  		15.6096189372866,
  		-0.09551478927191315
  	],
  	[
  		11.570373354540571,
  		15.79209852037569,
  		-0.09136803289064542
  	],
  	[
  		11.29925330237242,
  		15.97010853626272,
  		-0.08719470833598683
  	],
  	[
  		11.02493830343475,
  		16.14358382796917,
  		-0.08299643880334895
  	],
  	[
  		10.747519631096461,
  		16.3124536231212,
  		-0.07877401967808811
  	],
  	[
  		10.46708364135808,
  		16.47667789009653,
  		-0.07452863740941505
  	],
  	[
  		10.183695911242289,
  		16.63619945124879,
  		-0.07026192440316067
  	],
  	[
  		9.897445316116814,
  		16.79095494985708,
  		-0.06597551461964722
  	],
  	[
  		9.608415373254243,
  		16.94089944800105,
  		-0.06167041887500149
  	],
  	[
  		9.316690302485615,
  		17.08597850591763,
  		-0.057347903542198465
  	],
  	[
  		9.022360049601978,
  		17.226153482945218,
  		-0.0530093794999173
  	],
  	[
  		8.725492457710134,
  		17.361379523998902,
  		-0.04865637746753151
  	],
  	[
  		8.426178877370665,
  		17.491595488036772,
  		-0.044290629258648004
  	],
  	[
  		8.124515658812088,
  		17.61677131796038,
  		-0.0399126039532571
  	],
  	[
  		7.820575847394431,
  		17.736869203256582,
  		-0.03552379977533471
  	],
  	[
  		7.514448028846237,
  		17.85184401327225,
  		-0.03112651818183565
  	],
  	[
  		7.206212442556625,
  		17.96166141969947,
  		-0.0267211044673977
  	],
  	[
  		6.895956366914155,
  		18.06627297907917,
  		-0.02230903109787019
  	],
  	[
  		6.583779008746778,
  		18.16565267700279,
  		-0.01789199700681092
  	],
  	[
  		6.269749818020214,
  		18.25977414610778,
  		-0.0134706309882017
  	],
  	[
  		5.953954324979079,
  		18.348587730958442,
  		-0.009047191801832664
  	],
  	[
  		5.636490220285611,
  		18.432066597929392,
  		-0.0046224870866028115
  	],
  	[
  		5.317438207877365,
  		18.51018225333679,
  		-0.0001970058659689559
  	],
  	[
  		4.996890918691333,
  		18.58290497027177,
  		0.004226586480209796
  	],
  	[
  		4.674926347629285,
  		18.65021395094582,
  		0.008647710903761503
  	],
  	[
  		4.351627286549152,
  		18.71206577065638,
  		0.01306544585499541
  	],
  	[
  		4.027099584313307,
  		18.768438082967872,
  		0.01747777140887879
  	],
  	[
  		3.701420704880587,
  		18.81931820460593,
  		0.02188445748546445
  	],
  	[
  		3.37467344765509,
  		18.86467108622357,
  		0.02628344626291845
  	],
  	[
  		3.046951199755138,
  		18.90447592581621,
  		0.03067326704123688
  	],
  	[
  		2.718338276313168,
  		18.93870634160777,
  		0.03505415904944675
  	],
  	[
  		2.388934675330697,
  		18.96734146643529,
  		0.039423750727730494
  	],
  	[
  		2.058821302669945,
  		18.99037464494327,
  		0.04378083856716525
  	],
  	[
  		1.7280758266205,
  		19.007771419413572,
  		0.04812501402413787
  	],
  	[
  		1.39680334120782,
  		19.01950921795496,
  		0.05245433536723722
  	],
  	[
  		1.0650914368889,
  		19.02557992828615,
  		0.05676846682467002
  	],
  	[
  		0.7330282988826701,
  		19.02596037219259,
  		0.06106586747162454
  	],
  	[
  		0.40070520207311006,
  		19.02063934810616,
  		0.06534456050131364
  	],
  	[
  		0.06820605068913266,
  		19.0095916162322,
  		0.06960489143231965
  	],
  	[
  		-0.2643600442880619,
  		18.99279574835678,
  		0.07384520478157443
  	],
  	[
  		-0.5969006951289123,
  		18.97025417644826,
  		0.07806356787742448
  	],
  	[
  		-0.9293338389721342,
  		18.941943774079498,
  		0.0822596607116879
  	],
  	[
  		-1.261553303987935,
  		18.90784514333084,
  		0.08643197113447527
  	],
  	[
  		-1.593461030999714,
  		18.867949485912582,
  		0.09057944375160083
  	],
  	[
  		-1.924951451506826,
  		18.82224061355188,
  		0.09470089528389707
  	],
  	[
  		-2.255921350720778,
  		18.77072093984384,
  		0.09879433361494497
  	],
  	[
  		-2.586281079747714,
  		18.71337604102185,
  		0.1028591368065356
  	],
  	[
  		-2.915910458822265,
  		18.650187407294688,
  		0.10689419668641341
  	],
  	[
  		-3.244696592745569,
  		18.58116665528242,
  		0.1108974831992241
  	],
  	[
  		-3.572540228856227,
  		18.506310148040598,
  		0.11486763739799671
  	],
  	[
  		-3.899325733771819,
  		18.42561771085148,
  		0.11880354938436699
  	],
  	[
  		-4.224947127573016,
  		18.339094069179367,
  		0.12270384901277641
  	],
  	[
  		-4.549282109921591,
  		18.24673636326484,
  		0.1265666989443007
  	],
  	[
  		-4.872209342471198,
  		18.148571052588952,
  		0.13039063080069832
  	],
  	[
  		-5.19363204030853,
  		18.04461297205825,
  		0.13417424796684083
  	],
  	[
  		-5.513428497037824,
  		17.934865525264023,
  		0.1379159767710928
  	],
  	[
  		-5.831477865382724,
  		17.81935828623487,
  		0.14161473010738831
  	],
  	[
  		-6.147670204482944,
  		17.69811387933508,
  		0.14526840976075012
  	],
  	[
  		-6.461886276736403,
  		17.57116381367363,
  		0.1488754106486077
  	],
  	[
  		-6.774026186655462,
  		17.43854173168513,
  		0.1524352528990326
  	],
  	[
  		-7.08397264180523,
  		17.30026437387739,
  		0.15594573318248273
  	],
  	[
  		-7.391599929641109,
  		17.15638022105886,
  		0.1594053365593602
  	],
  	[
  		-7.696812918069443,
  		17.00693584771821,
  		0.1628132019840458
  	],
  	[
  		-7.999501098136338,
  		16.85196363963055,
  		0.16616726953598102
  	],
  	[
  		-8.299555020193964,
  		16.69151314314709,
  		0.16946705472381912
  	],
  	[
  		-8.596869818020291,
  		16.52562504928591,
  		0.17271104925220332
  	],
  	[
  		-8.891328867287463,
  		16.35435571691211,
  		0.1758968935970469
  	],
  	[
  		-9.182842958583407,
  		16.17776709442331,
  		0.17902479939195962
  	],
  	[
  		-9.471312748367787,
  		15.99589601500271,
  		0.18209323394212462
  	],
  	[
  		-9.75662129712933,
  		15.80880297945358,
  		0.185100232478379
  	],
  	[
  		-10.03867701538095,
  		15.616554078535469,
  		0.18804553049708211
  	],
  	[
  		-10.31738063886216,
  		15.41920608048494,
  		0.1909273152256461
  	],
  	[
  		-10.592638748936489,
  		15.21682814771138,
  		0.193745057438846
  	],
  	[
  		-10.86436159790068,
  		15.00947208184403,
  		0.1964981049164043
  	],
  	[
  		-11.13243916238861,
  		14.79720625646934,
  		0.19918396427914553
  	],
  	[
  		-11.39678918281052,
  		14.58011361810366,
  		0.20180286615095763
  	],
  	[
  		-11.65733004888526,
  		14.35825106744969,
  		0.20435422278827284
  	],
  	[
  		-11.913963438621892,
  		14.13168930431449,
  		0.2068359270361793
  	],
  	[
  		-12.166606354853108,
  		13.90050252042661,
  		0.20924799735083444
  	],
  	[
  		-12.415167722071502,
  		13.664763300607689,
  		0.2115892568206068
  	],
  	[
  		-12.65956905954287,
  		13.42455979467595,
  		0.21385888431315203
  	],
  	[
  		-12.899740729375392,
  		13.17995596419425,
  		0.21605701896081164
  	],
  	[
  		-13.13558749262321,
  		12.931024160140861,
  		0.2181816789374978
  	],
  	[
  		-13.36703410613242,
  		12.6778579395726,
  		0.2202325958645556
  	],
  	[
  		-13.59401191653102,
  		12.42053075374174,
  		0.22221006089253792
  	],
  	[
  		-13.816443321814308,
  		12.159125152649619,
  		0.2241124406930864
  	],
  	[
  		-14.034262868711508,
  		11.89371852702654,
  		0.2259395163642132
  	],
  	[
  		-14.247387851716919,
  		11.624386955657899,
  		0.2276909199694039
  	],
  	[
  		-14.455749588379769,
  		11.35123076874164,
  		0.2293658062272221
  	],
  	[
  		-14.65929594656306,
  		11.074325972577642,
  		0.2309643935634013
  	],
  	[
  		-14.857950238949421,
  		10.79374674279497,
  		0.23248583632025102
  	],
  	[
  		-15.051646521571469,
  		10.50958577703427,
  		0.23392936233527292
  	],
  	[
  		-15.24032169418198,
  		10.221923587696221,
  		0.23529517217880702
  	],
  	[
  		-15.42390945691218,
  		9.930853047624723,
  		0.23658289967140134
  	],
  	[
  		-15.60236062848598,
  		9.636456429448064,
  		0.237791889775062
  	],
  	[
  		-15.77560149899347,
  		9.33880664735526,
  		0.2389216256179653
  	],
  	[
  		-15.943563682278139,
  		9.038007789051981,
  		0.23997202149650454
  	],
  	[
  		-16.10620013210236,
  		8.734148095195007,
  		0.2409428403916763
  	],
  	[
  		-16.26344480128448,
  		8.42731046612362,
  		0.24183352907022182
  	],
  	[
  		-16.41524038661648,
  		8.11758983557533,
  		0.2426437108261227
  	],
  	[
  		-16.56152356014113,
  		7.805071177483983,
  		0.2433726902002864
  	],
  	[
  		-16.702226856136978,
  		7.489861666017381,
  		0.2440206273937749
  	],
  	[
  		-16.83730929719014,
  		7.172061445938309,
  		0.2445873740511666
  	],
  	[
  		-16.96670857542533,
  		6.851753214906084,
  		0.2450713989037479
  	],
  	[
  		-17.09035873382877,
  		6.529048894379012,
  		0.2454730302769233
  	],
  	[
  		-17.20821413973589,
  		6.204055295063219,
  		0.24579240242982714
  	],
  	[
  		-17.32021747667684,
  		5.876877792352717,
  		0.2460283338469732
  	],
  	[
  		-17.42632733593208,
  		5.54762970312495,
  		0.24618104504983052
  	],
  	[
  		-17.52649457717564,
  		5.216407335031408,
  		0.2462498363051794
  	],
  	[
  		-17.62065763674574,
  		4.883333577969723,
  		0.24623445450591863
  	],
  	[
  		-17.70878835837038,
  		4.548533234730948,
  		0.246135687433123
  	],
  	[
  		-17.79084802738353,
  		4.212109568770994,
  		0.2459519827315123
  	],
  	[
  		-17.86679223885021,
  		3.874185128375776,
  		0.24568340795075733
  	],
  	[
  		-17.93659089578572,
  		3.534878272583763,
  		0.2453309747575171
  	],
  	[
  		-18.00020364475888,
  		3.19431262179711,
  		0.2448935096474382
  	],
  	[
  		-18.05761317625606,
  		2.852620264196941,
  		0.24437150128270063
  	],
  	[
  		-18.10880114199094,
  		2.509907175374214,
  		0.24376501300533082
  	],
  	[
  		-18.15372801966562,
  		2.166299170851037,
  		0.2430734813494233
  	],
  	[
  		-18.19238272608895,
  		1.821932021146759,
  		0.2422983598536113
  	],
  	[
  		-18.22475321326737,
  		1.476923043940858,
  		0.24143897767196332
  	],
  	[
  		-18.25082645405579,
  		1.1314016021666,
  		0.2404950458791335
  	],
  	[
  		-18.27059941029312,
  		0.7854848214760571,
  		0.23946821056182072
  	],
  	[
  		-18.28405234737007,
  		0.4392980299925167,
  		0.2383579250058574
  	],
  	[
  		-18.2911904174969,
  		0.09298237154132442,
  		0.23716475247010613
  	],
  	[
  		-18.29202671932173,
  		-0.25335019331318537,
  		0.23588958354568001
  	],
  	[
  		-18.28655353043603,
  		-0.5995783670751996,
  		0.2345318410608806
  	],
  	[
  		-18.27478048910259,
  		-0.9455708143902721,
  		0.2330931525828547
  	],
  	[
  		-18.25671637200179,
  		-1.291206953470499,
  		0.23157413888015502
  	],
  	[
  		-18.23237680839686,
  		-1.636353362607844,
  		0.2299742825772392
  	],
  	[
  		-18.201790513911128,
  		-1.980896792113586,
  		0.2282952204202922
  	],
  	[
  		-18.16496170239327,
  		-2.324722383103534,
  		0.2265376297861971
  	],
  	[
  		-18.12191347394203,
  		-2.667691674990733,
  		0.2247019774521681
  	],
  	[
  		-18.07268315061793,
  		-3.009691037286379,
  		0.22278947329077814
  	],
  	[
  		-18.01729378516962,
  		-3.350604356364482,
  		0.22080031519330234
  	],
  	[
  		-17.95578105982797,
  		-3.690313420021899,
  		0.21873578759569973
  	],
  	[
  		-17.88817036342742,
  		-4.028708313168242,
  		0.2165973656009681
  	],
  	[
  		-17.81449663820912,
  		-4.365659102800216,
  		0.21438523974738102
  	],
  	[
  		-17.73481631601625,
  		-4.701057978446848,
  		0.21210037330478748
  	],
  	[
  		-17.64916021164975,
  		-5.034806583446088,
  		0.2097443248771448
  	],
  	[
  		-17.557567577273,
  		-5.366783792942912,
  		0.20731828504723043
  	],
  	[
  		-17.46009058354447,
  		-5.696885262880397,
  		0.20482291773402822
  	],
  	[
  		-17.35677342311503,
  		-6.025003815999527,
  		0.20225922524087073
  	],
  	[
  		-17.24767657827092,
  		-6.351037283526985,
  		0.1996288008544862
  	],
  	[
  		-17.132841247057,
  		-6.674898867594315,
  		0.1969326869089373
  	],
  	[
  		-17.01230997545974,
  		-6.99647469255604,
  		0.1941720876797045
  	],
  	[
  		-16.88615302121849,
  		-7.3156665298898,
  		0.19134791133421902
  	],
  	[
  		-16.75441969493071,
  		-7.632391939971168,
  		0.1884611336326436
  	],
  	[
  		-16.6171618029339,
  		-7.946552844559139,
  		0.1855138798817484
  	],
  	[
  		-16.474435033081868,
  		-8.258063629410058,
  		0.1825066774139659
  	],
  	[
  		-16.326286752548672,
  		-8.566828051246054,
  		0.17944008242061993
  	],
  	[
  		-16.17278834757735,
  		-8.872753547629591,
  		0.176316240555501
  	],
  	[
  		-16.01399247500398,
  		-9.175771267729314,
  		0.17313569239112023
  	],
  	[
  		-15.84994039481897,
  		-9.475785718312347,
  		0.1698995591645469
  	],
  	[
  		-15.68070057800987,
  		-9.772705011416875,
  		0.16660929728488283
  	],
  	[
  		-15.5063284012965,
  		-10.06645019606242,
  		0.16326494979657222
  	],
  	[
  		-15.32688477057031,
  		-10.35693178787817,
  		0.15986855827590463
  	],
  	[
  		-15.142429933008259,
  		-10.644076483549581,
  		0.1564212975776219
  	],
  	[
  		-14.953008738399049,
  		-10.927793368353381,
  		0.1529229849049857
  	],
  	[
  		-14.75869653150835,
  		-11.20798674643284,
  		0.14937569493463862
  	],
  	[
  		-14.55956095689187,
  		-11.48458837027174,
  		0.1457801597459436
  	],
  	[
  		-14.35565357384586,
  		-11.75751213648321,
  		0.1421371474486127
  	],
  	[
  		-14.14704554728105,
  		-12.02667116132143,
  		0.1384485980395054
  	],
  	[
  		-13.93380058305283,
  		-12.291983840373351,
  		0.1347142963819111
  	],
  	[
  		-13.715995107544561,
  		-12.55335885004821,
  		0.1309358855884973
  	],
  	[
  		-13.49370831983617,
  		-12.81072976342855,
  		0.12711545112994752
  	],
  	[
  		-13.26699585712893,
  		-13.064016409757919,
  		0.12325266650625599
  	],
  	[
  		-13.03594049018624,
  		-13.313124929280312,
  		0.11934927599428552
  	],
  	[
  		-12.8006276713335,
  		-13.55798684735644,
  		0.1154067284863344
  	],
  	[
  		-12.56113133721231,
  		-13.798524256389111,
  		0.1114256340155644
  	],
  	[
  		-12.31753703120921,
  		-14.03466502699838,
  		0.1074081852694126
  	],
  	[
  		-12.069917761223401,
  		-14.2663372963212,
  		0.10335470550108371
  	],
  	[
  		-11.81836411992143,
  		-14.49345335683594,
  		0.09926626740507531
  	],
  	[
  		-11.56297635967622,
  		-14.7159548309026,
  		0.09514560192595274
  	],
  	[
  		-11.303828677920368,
  		-14.933780013064819,
  		0.09099299326817065
  	],
  	[
  		-11.04101212452556,
  		-15.14685094715595,
  		0.08680951307557556
  	],
  	[
  		-10.77462209732079,
  		-15.35510733985273,
  		0.08259727083407863
  	],
  	[
  		-10.50475049084309,
  		-15.55848058152055,
  		0.07835723627297118
  	],
  	[
  		-10.23150176843366,
  		-15.75691619016617,
  		0.07409114593349776
  	],
  	[
  		-9.95495806802295,
  		-15.95036421272314,
  		0.06980020561180414
  	],
  	[
  		-9.675215844333618,
  		-16.13874998961282,
  		0.06548543984592678
  	],
  	[
  		-9.39238882927098,
  		-16.32202477173319,
  		0.06114906746957998
  	],
  	[
  		-9.106569067344287,
  		-16.500144655910468,
  		0.05679249298567677
  	],
  	[
  		-8.817858688819976,
  		-16.67305585332278,
  		0.0524166932285598
  	],
  	[
  		-8.52635686631641,
  		-16.84071708779895,
  		0.04802326435422308
  	],
  	[
  		-8.23216360870957,
  		-17.00307256726397,
  		0.04361407909555176
  	],
  	[
  		-7.935399459531252,
  		-17.16008356166057,
  		0.0391906708162661
  	],
  	[
  		-7.636159332962729,
  		-17.31172653153897,
  		0.03475419861121593
  	],
  	[
  		-7.334542084622623,
  		-17.45795136117178,
  		0.030306431355582628
  	],
  	[
  		-7.030666021316557,
  		-17.59872486434346,
  		0.025848918793133363
  	],
  	[
  		-6.724634242435387,
  		-17.73402015308512,
  		0.0213832675752707
  	],
  	[
  		-6.416561380787349,
  		-17.863808144121972,
  		0.01691142138327676
  	],
  	[
  		-6.106549991559769,
  		-17.988076609495568,
  		0.012434145433318191
  	],
  	[
  		-5.794697579173336,
  		-18.10679104335001,
  		0.007953292730917804
  	],
  	[
  		-5.481129768499494,
  		-18.21992866595889,
  		0.0034712105087916817
  	],
  	[
  		-5.165950288055377,
  		-18.32748987421742,
  		-0.0010114909533055461
  	],
  	[
  		-4.849257879066681,
  		-18.4294554835667,
  		-0.005492959302328808
  	],
  	[
  		-4.531164026920361,
  		-18.52581633848002,
  		-0.009971493710430632
  	],
  	[
  		-4.211766729758281,
  		-18.61656351990208,
  		-0.014446091023740091
  	],
  	[
  		-3.891180649583156,
  		-18.70168740570156,
  		-0.01891428853963699
  	],
  	[
  		-3.569507230444955,
  		-18.78120352483464,
  		-0.02337552067437049
  	],
  	[
  		-3.246829557408274,
  		-18.85510402136357,
  		-0.027828867456899744
  	],
  	[
  		-2.923258714442432,
  		-18.92338090505553,
  		-0.032271516096379814
  	],
  	[
  		-2.598892157315817,
  		-18.98604803026301,
  		-0.03670309921779849
  	],
  	[
  		-2.273821281147943,
  		-19.043106439798642,
  		-0.04112254261714335
  	],
  	[
  		-1.948142942002356,
  		-19.09456808235862,
  		-0.04552801479127998
  	],
  	[
  		-1.62193643441948,
  		-19.140435872336383,
  		-0.049919124451140794
  	],
  	[
  		-1.295302557550581,
  		-19.180704864179962,
  		-0.054293752823758486
  	],
  	[
  		-0.9683376290955202,
  		-19.2153991477899,
  		-0.05865116594311605
  	],
  	[
  		-0.641114066155501,
  		-19.24452606626811,
  		-0.0629914221661405
  	],
  	[
  		-0.3137242031149866,
  		-19.2680849131631,
  		-0.06731186805942282
  	],
  	[
  		0.013745607653279961,
  		-19.286088453095893,
  		-0.07161194853021567
  	],
  	[
  		0.34120745002069514,
  		-19.298538325609698,
  		-0.07589142800301231
  	],
  	[
  		0.6685676294870713,
  		-19.30545463435191,
  		-0.08014834301272876
  	],
  	[
  		0.9957566289518711,
  		-19.30684847226719,
  		-0.08438245901386109
  	],
  	[
  		1.322683379274228,
  		-19.30271315707038,
  		-0.08859235432000562
  	],
  	[
  		1.649251413394985,
  		-19.29307003968241,
  		-0.09277662650431667
  	],
  	[
  		1.97538345832155,
  		-19.27793277974751,
  		-0.0969356338125327
  	],
  	[
  		2.300990462627416,
  		-19.25731094503734,
  		-0.10106747955831381
  	],
  	[
  		2.625992528093945,
  		-19.2312206753746,
  		-0.1051708112230213
  	],
  	[
  		2.950301002958886,
  		-19.19966251743379,
  		-0.10924559039596381
  	],
  	[
  		3.273815067074882,
  		-19.16266118130027,
  		-0.11329027869069791
  	],
  	[
  		3.596462217697237,
  		-19.12024183493142,
  		-0.11730404020189851
  	],
  	[
  		3.918156465841955,
  		-19.07240687936001,
  		-0.1212859884160499
  	],
  	[
  		4.238802722449151,
  		-19.01917965648632,
  		-0.12523458836834872
  	],
  	[
  		4.55831761588033,
  		-18.96057913455413,
  		-0.12914944804828551
  	],
  	[
  		4.876605914683226,
  		-18.89662850369514,
  		-0.1330296710190357
  	],
  	[
  		5.193591239510414,
  		-18.8273589993316,
  		-0.13687373766654828
  	],
  	[
  		5.509189898696346,
  		-18.7527772714714,
  		-0.1406806696392675
  	],
  	[
  		5.823297543349047,
  		-18.67291211711857,
  		-0.14444977535686462
  	],
  	[
  		6.13583504568895,
  		-18.58780203161689,
  		-0.1481801723144457
  	],
  	[
  		6.446717739336989,
  		-18.49746686264126,
  		-0.15187041667005882
  	],
  	[
  		6.755856961305485,
  		-18.40194010197122,
  		-0.15551954959462833
  	],
  	[
  		7.063170723058326,
  		-18.30124651125853,
  		-0.1591267430658866
  	],
  	[
  		7.368557622131249,
  		-18.19541899692203,
  		-0.1626909932744635
  	],
  	[
  		7.671939531130333,
  		-18.08450795708145,
  		-0.16621155338267432
  	],
  	[
  		7.97324124539355,
  		-17.96853520653301,
  		-0.1696866575225591
  	],
  	[
  		8.272362404547989,
  		-17.84753578172598,
  		-0.1731154980587729
  	],
  	[
  		8.569220881224824,
  		-17.72155785980287,
  		-0.1764980376956717
  	],
  	[
  		8.863729462756117,
  		-17.590639129835452,
  		-0.179832193967709
  	],
  	[
  		9.15580525488193,
  		-17.454832124478802,
  		-0.18311699992623032
  	],
  	[
  		9.44537594515302,
  		-17.31417330661378,
  		-0.18635209153126941
  	],
  	[
  		9.732341508903374,
  		-17.16870394289955,
  		-0.18953592045871692
  	],
  	[
  		10.01662042547289,
  		-17.01849162020601,
  		-0.1926681531845913
  	],
  	[
  		10.29814508890829,
  		-16.86358181117132,
  		-0.19574729979891392
  	],
  	[
  		10.57682757558539,
  		-16.70402481604597,
  		-0.19877190741375672
  	],
  	[
  		10.85259299837853,
  		-16.53987996439281,
  		-0.20174250948251463
  	],
  	[
  		11.1253575380837,
  		-16.37120053063968,
  		-0.20465729449345882
  	],
  	[
  		11.39504390622367,
  		-16.19806251676568,
  		-0.2075149512386318
  	],
  	[
  		11.66159706203318,
  		-16.0205234762973,
  		-0.21031569522159133
  	],
  	[
  		11.92493407622573,
  		-15.838635813251042,
  		-0.2130578812978269
  	],
  	[
  		12.18498100388661,
  		-15.65247900463415,
  		-0.21574132069732732
  	],
  	[
  		12.44168032915206,
  		-15.46211873919443,
  		-0.21836541684135852
  	],
  	[
  		12.694964934226899,
  		-15.267624711469182,
  		-0.22092831925185813
  	],
  	[
  		12.94478218513667,
  		-15.069065958779959,
  		-0.2234308045173341
  	],
  	[
  		13.1910655492923,
  		-14.86650055985891,
  		-0.22587209054977203
  	],
  	[
  		13.433749676360891,
  		-14.660014123999341,
  		-0.2282507018699611
  	],
  	[
  		13.67279856789513,
  		-14.44967864109783,
  		-0.2305672913321402
  	],
  	[
  		13.90815669300646,
  		-14.23555092644647,
  		-0.232820779751022
  	],
  	[
  		14.1397697577255,
  		-14.017706909573938,
  		-0.23501090260086782
  	],
  	[
  		14.36759193817852,
  		-13.79621126609707,
  		-0.23713811109070942
  	]
  ];
  var uranusOrbit = {
  	targetName: targetName$6,
  	name: name$6,
  	startDate: startDate$6,
  	stopDate: stopDate$6,
  	stepSize: stepSize$6,
  	coords: coords$6
  };

  var uranusOrbit$1 = {
    __proto__: null,
    targetName: targetName$6,
    name: name$6,
    startDate: startDate$6,
    stopDate: stopDate$6,
    stepSize: stepSize$6,
    coords: coords$6,
    'default': uranusOrbit
  };

  var targetName$7 = "neptune";
  var name$7 = "Neptune";
  var startDate$7 = "2000-01-01";
  var stopDate$7 = "2165-01-01";
  var stepSize$7 = 165;
  var coords$7 = [
  	[
  		16.81075586572794,
  		-24.99265128053398,
  		0.1272718567577873
  	],
  	[
  		17.233735466278837,
  		-24.69591263766116,
  		0.11143295731316341
  	],
  	[
  		17.65141711374224,
  		-24.39213416313239,
  		0.09556442774818344
  	],
  	[
  		18.06373408373384,
  		-24.081453441829122,
  		0.07967576790443708
  	],
  	[
  		18.47066233100697,
  		-23.76395070571953,
  		0.06376686937158725
  	],
  	[
  		18.8721322989465,
  		-23.43974163494871,
  		0.04783729068550293
  	],
  	[
  		19.2681053890423,
  		-23.1088900772647,
  		0.03189649398537738
  	],
  	[
  		19.65850452120703,
  		-22.7714509020403,
  		0.01594549559270154
  	],
  	[
  		20.043285529891342,
  		-22.42748737898088,
  		-0.000016726314789744868
  	],
  	[
  		20.42234293478083,
  		-22.077038747530267,
  		-0.01598020253911112
  	],
  	[
  		20.79560396878191,
  		-21.720166762738053,
  		-0.03194292921736754
  	],
  	[
  		21.162958198403977,
  		-21.35689651530845,
  		-0.047905159782875455
  	],
  	[
  		21.524298874734292,
  		-20.98729735369409,
  		-0.06385698457590958
  	],
  	[
  		21.87951460680772,
  		-20.6113985589818,
  		-0.07979484383182076
  	],
  	[
  		22.22845918571974,
  		-20.22928255502083,
  		-0.09571817390008582
  	],
  	[
  		22.57101081109552,
  		-19.84098898649914,
  		-0.1116165511646604
  	],
  	[
  		22.90701521220758,
  		-19.4465971087539,
  		-0.12748473321418882
  	],
  	[
  		23.23633771235016,
  		-19.046194021814593,
  		-0.1433224850069481
  	],
  	[
  		23.55878657191251,
  		-18.6398666552328,
  		-0.1591182684377457
  	],
  	[
  		23.87423242556856,
  		-18.22772477025941,
  		-0.1748655901336972
  	],
  	[
  		24.18249856940914,
  		-17.80988802899184,
  		-0.1905644479674348
  	],
  	[
  		24.483423433816213,
  		-17.38652302187576,
  		-0.20620326910522133
  	],
  	[
  		24.77685177722226,
  		-16.9577613538844,
  		-0.22177478406863582
  	],
  	[
  		25.06265150834836,
  		-16.52381309355159,
  		-0.2372792674118836
  	],
  	[
  		25.3407059472921,
  		-16.08486001933894,
  		-0.2527072747744961
  	],
  	[
  		25.61090279569909,
  		-15.64112040271838,
  		-0.2680511371260063
  	],
  	[
  		25.87319141124584,
  		-15.19279005158478,
  		-0.2833122181804673
  	],
  	[
  		26.12750225843243,
  		-14.740082747606591,
  		-0.2984834350301251
  	],
  	[
  		26.37383568045369,
  		-14.28318825635401,
  		-0.3135579613951809
  	],
  	[
  		26.612154911135832,
  		-13.822275006572479,
  		-0.3285387046255108
  	],
  	[
  		26.84246983805961,
  		-13.35750968941064,
  		-0.3434194385097166
  	],
  	[
  		27.064773708883752,
  		-12.88900858413064,
  		-0.3581940401297628
  	],
  	[
  		27.279072558355328,
  		-12.416922025370889,
  		-0.37286564860513605
  	],
  	[
  		27.48534317419314,
  		-11.94133326334724,
  		-0.3874285305359755
  	],
  	[
  		27.68356668247138,
  		-11.462353576775419,
  		-0.4018758056690339
  	],
  	[
  		27.87373627231588,
  		-10.980063724107161,
  		-0.4162102141303685
  	],
  	[
  		28.0557860762784,
  		-10.494575184576169,
  		-0.4304268556530284
  	],
  	[
  		28.22969012726569,
  		-10.00595362291293,
  		-0.44451673065152203
  	],
  	[
  		28.39537842095536,
  		-9.514290102938228,
  		-0.45848192083963
  	],
  	[
  		28.55280514839717,
  		-9.019692345812409,
  		-0.47231788097905203
  	],
  	[
  		28.70187330409768,
  		-8.522238965126201,
  		-0.4860143440679077
  	],
  	[
  		28.84252545565246,
  		-8.022041874402234,
  		-0.49957225015628404
  	],
  	[
  		28.97466251927537,
  		-7.519192785555889,
  		-0.5129867348554148
  	],
  	[
  		29.09819295213274,
  		-7.013833517798711,
  		-0.5262471848723416
  	],
  	[
  		29.213023355793723,
  		-6.506067515779161,
  		-0.539352826043311
  	],
  	[
  		29.319037161946802,
  		-5.996057500249571,
  		-0.5522991689136458
  	],
  	[
  		29.41614982107991,
  		-5.483940144431844,
  		-0.5650751846627863
  	],
  	[
  		29.50424228846967,
  		-4.969907530384813,
  		-0.5776794713771786
  	],
  	[
  		29.58323558207511,
  		-4.454152152092844,
  		-0.590108408951262
  	],
  	[
  		29.65302782075529,
  		-3.936873233527535,
  		-0.6023504490287914
  	],
  	[
  		29.71358849826747,
  		-3.418308163841396,
  		-0.6144051205859389
  	],
  	[
  		29.76485147093157,
  		-2.898688569345167,
  		-0.6262703511838774
  	],
  	[
  		29.80681153433128,
  		-2.378265091289195,
  		-0.6379357365959554
  	],
  	[
  		29.83948885860599,
  		-1.857243156499322,
  		-0.6494017369611228
  	],
  	[
  		29.86291585928491,
  		-1.335879341959524,
  		-0.6606686070736498
  	],
  	[
  		29.87714248221707,
  		-0.8143556796783008,
  		-0.6717276399284793
  	],
  	[
  		29.88222497547889,
  		-0.2928684700367311,
  		-0.6825789842982388
  	],
  	[
  		29.87825430959044,
  		0.22842373365777432,
  		-0.6932252033752345
  	],
  	[
  		29.86527056863036,
  		0.7493636786635587,
  		-0.7036583907750917
  	],
  	[
  		29.84335894768494,
  		1.269823448900277,
  		-0.713877981154352
  	],
  	[
  		29.812552654428913,
  		1.789686025985491,
  		-0.7238869374364252
  	],
  	[
  		29.77291901051787,
  		2.308825856021078,
  		-0.7336773008743477
  	],
  	[
  		29.724485029435833,
  		2.827154378020311,
  		-0.7432481759575409
  	],
  	[
  		29.667281529880228,
  		3.344542756971942,
  		-0.7526018134884649
  	],
  	[
  		29.601324991292486,
  		3.860915219430617,
  		-0.7617302963396578
  	],
  	[
  		29.52663441065262,
  		4.376147349536726,
  		-0.7706315275988675
  	],
  	[
  		29.44322236353491,
  		4.890144997050384,
  		-0.7793076367299525
  	],
  	[
  		29.35105851258215,
  		5.402788462006022,
  		-0.787750237608402
  	],
  	[
  		29.25016497973012,
  		5.913981048640179,
  		-0.7959553898841538
  	],
  	[
  		29.1405077746845,
  		6.423587482907635,
  		-0.8039260502202734
  	],
  	[
  		29.022077845340068,
  		6.931472260513329,
  		-0.8116533789684246
  	],
  	[
  		28.894831897412956,
  		7.437517373035655,
  		-0.8191320303143101
  	],
  	[
  		28.75876751282327,
  		7.941546108857595,
  		-0.826364852916027
  	],
  	[
  		28.613843559493112,
  		8.443400644396634,
  		-0.8333437828286103
  	],
  	[
  		28.460045019710456,
  		8.942878311950933,
  		-0.8400630849236841
  	],
  	[
  		28.29737061763931,
  		9.43980139216689,
  		-0.8465253781754909
  	],
  	[
  		28.125818167354687,
  		9.933925632244415,
  		-0.8527246238637677
  	],
  	[
  		27.94543773893055,
  		10.425042562041169,
  		-0.8586552363887874
  	],
  	[
  		27.75626472466467,
  		10.91291013360195,
  		-0.8643210887038694
  	],
  	[
  		27.55840030353642,
  		11.39731155297175,
  		-0.8697181429041703
  	],
  	[
  		27.35193229983465,
  		11.87803823133365,
  		-0.8748418991878636
  	],
  	[
  		27.137007899760892,
  		12.35487777715138,
  		-0.8796984467068388
  	],
  	[
  		26.91373534478798,
  		12.82767113966825,
  		-0.8842850120159382
  	],
  	[
  		26.682275094318427,
  		13.296256166297491,
  		-0.8885977911714176
  	],
  	[
  		26.44276850212682,
  		13.76051496677193,
  		-0.8926433824085125
  	],
  	[
  		26.19534031585998,
  		14.2202990149641,
  		-0.8964203491416994
  	],
  	[
  		25.94012740753895,
  		14.67554078622841,
  		-0.8999242657874803
  	],
  	[
  		25.67724691093008,
  		15.1261312311014,
  		-0.9031611192001453
  	],
  	[
  		25.40682131969298,
  		15.57198914882492,
  		-0.9061307316570233
  	],
  	[
  		25.12892312838658,
  		16.013032545670388,
  		-0.9088270568603862
  	],
  	[
  		24.843673810288518,
  		16.44919150949433,
  		-0.911255288007589
  	],
  	[
  		24.55113292202502,
  		16.880391338557843,
  		-0.9134155239193267
  	],
  	[
  		24.251389170290437,
  		17.30654399859494,
  		-0.9153010430039666
  	],
  	[
  		23.94449292438891,
  		17.7275909587657,
  		-0.916915910439807
  	],
  	[
  		23.63050883774295,
  		18.143427777813372,
  		-0.9182597209995399
  	],
  	[
  		23.30948776166036,
  		18.55399362658176,
  		-0.9193256277258753
  	],
  	[
  		22.9814702343285,
  		18.959168973055668,
  		-0.9201162931147953
  	],
  	[
  		22.646496801871013,
  		19.35886551067315,
  		-0.9206317103933849
  	],
  	[
  		22.30458908006364,
  		19.75295848454159,
  		-0.9208644052784664
  	],
  	[
  		21.95581412230468,
  		20.141326109176177,
  		-0.9208166432739002
  	],
  	[
  		21.6001794463188,
  		20.523809285687218,
  		-0.9204894829161188
  	],
  	[
  		21.237750473617233,
  		20.90025015263251,
  		-0.9198746854557506
  	],
  	[
  		20.86858292992801,
  		21.27048645890785,
  		-0.9189750168433815
  	],
  	[
  		20.492777268087302,
  		21.634303684700402,
  		-0.9177932743519484
  	],
  	[
  		20.11041864768643,
  		21.99153425258718,
  		-0.9163226301591259
  	],
  	[
  		19.72164964229489,
  		22.341976617356178,
  		-0.9145661429698786
  	],
  	[
  		19.32663272310138,
  		22.68546867415388,
  		-0.9125288425391531
  	],
  	[
  		18.92552912819814,
  		23.02182530612928,
  		-0.9102063596855778
  	],
  	[
  		18.51854293465786,
  		23.350932968530863,
  		-0.9076017308976265
  	],
  	[
  		18.105849438381448,
  		23.67266024532146,
  		-0.9047219896306944
  	],
  	[
  		17.68766837757832,
  		23.986915616353247,
  		-0.901563881444395
  	],
  	[
  		17.264172306809613,
  		24.29362480922439,
  		-0.8981305599648457
  	],
  	[
  		16.83556406567849,
  		24.59271787749083,
  		-0.8944294456187415
  	],
  	[
  		16.40199713625998,
  		24.88416544771869,
  		-0.8904569890356323
  	],
  	[
  		15.96365983445837,
  		25.1679093608691,
  		-0.8862162089805841
  	],
  	[
  		15.520696928719799,
  		25.44393058627859,
  		-0.8817143171315801
  	],
  	[
  		15.07324401936955,
  		25.71218219597349,
  		-0.8769477653892269
  	],
  	[
  		14.621451270980781,
  		25.97266986657437,
  		-0.8719178015075223
  	],
  	[
  		14.16543311586622,
  		26.22533612356222,
  		-0.8666317320494473
  	],
  	[
  		13.70531312532946,
  		26.47016605633447,
  		-0.8610860202926048
  	],
  	[
  		13.24118021041544,
  		26.70713594779343,
  		-0.8552798125720241
  	],
  	[
  		12.77316404326964,
  		26.936210068615058,
  		-0.849220746765986
  	],
  	[
  		12.301326083909721,
  		27.15734568665213,
  		-0.8429052237736091
  	],
  	[
  		11.82577068908845,
  		27.37049061762459,
  		-0.8363313094262307
  	],
  	[
  		11.34656915427166,
  		27.57560718852875,
  		-0.8295059668931368
  	],
  	[
  		10.86380834650728,
  		27.77259850478877,
  		-0.8224262421643966
  	],
  	[
  		10.37756667548783,
  		27.96140333597343,
  		-0.8150900739216032
  	],
  	[
  		9.887928984835556,
  		28.141897763133137,
  		-0.807504052827761
  	],
  	[
  		9.395005797702293,
  		28.31398905222737,
  		-0.7996668016526743
  	],
  	[
  		8.898905463715984,
  		28.47754012003296,
  		-0.7915762362905223
  	],
  	[
  		8.39978905911117,
  		28.63242445650367,
  		-0.7832403397239527
  	],
  	[
  		7.897790879938485,
  		28.77850867736865,
  		-0.774659526353726
  	],
  	[
  		7.393129682452268,
  		28.915681286223013,
  		-0.7658325967201229
  	],
  	[
  		6.885999899742552,
  		29.04384413712522,
  		-0.7567698206776912
  	],
  	[
  		6.376628506597299,
  		29.16289309849833,
  		-0.7474732752682293
  	],
  	[
  		5.865232656845135,
  		29.272801400719118,
  		-0.7379425019105551
  	],
  	[
  		5.352061008859585,
  		29.37351281872596,
  		-0.7281881834660366
  	],
  	[
  		4.837336332480054,
  		29.46502636299869,
  		-0.718214428201708
  	],
  	[
  		4.321261335945203,
  		29.54733133570047,
  		-0.7080204587519422
  	],
  	[
  		3.804066512291392,
  		29.620469511784073,
  		-0.6976160633358567
  	],
  	[
  		3.285931661591662,
  		29.684449243183224,
  		-0.687006647170417
  	],
  	[
  		2.767061166197513,
  		29.739316004040873,
  		-0.6761903967408083
  	],
  	[
  		2.247604809182845,
  		29.78511716399308,
  		-0.6651761655689672
  	],
  	[
  		1.727746093220887,
  		29.82188830992239,
  		-0.6539691034103706
  	],
  	[
  		1.20762011609326,
  		29.84969227723434,
  		-0.6425670037968428
  	],
  	[
  		0.6873841525890215,
  		29.86855783425824,
  		-0.6309778388987981
  	],
  	[
  		0.1671517494047216,
  		29.87855221790252,
  		-0.6192059657240325
  	],
  	[
  		-0.35295552879612385,
  		29.87970162671932,
  		-0.6072485858070449
  	],
  	[
  		-0.8728107875923885,
  		29.872065751981502,
  		-0.5951123915648752
  	],
  	[
  		-1.392332694824465,
  		29.85564759802724,
  		-0.5828024150807724
  	],
  	[
  		-1.911414450413033,
  		29.83049427656525,
  		-0.5703147220717911
  	],
  	[
  		-2.429976644782075,
  		29.79661099962216,
  		-0.5576549749806718
  	],
  	[
  		-2.947905989287273,
  		29.75398218600299,
  		-0.5448293776256686
  	],
  	[
  		-3.465141524956161,
  		29.70259719208599,
  		-0.5318334429342481
  	],
  	[
  		-3.981553902180622,
  		29.642421948977322,
  		-0.5186725434779252
  	],
  	[
  		-4.497037611964562,
  		29.57341970657319,
  		-0.5053539581943125
  	],
  	[
  		-5.011450890488069,
  		29.49551157935685,
  		-0.49187498203029234
  	],
  	[
  		-5.524635657879241,
  		29.40867707788954,
  		-0.478241088978866
  	],
  	[
  		-6.036411930422448,
  		29.31284751425416,
  		-0.4644610634705004
  	],
  	[
  		-6.546569869881374,
  		29.20801041890227,
  		-0.4505344827889989
  	],
  	[
  		-7.054908710194297,
  		29.094138740726947,
  		-0.4364672085646717
  	],
  	[
  		-7.56118796467571,
  		28.97125333488217,
  		-0.42226997752353124
  	],
  	[
  		-8.06520892521021,
  		28.839388700789993,
  		-0.40794307249182093
  	],
  	[
  		-8.566723469888291,
  		28.698599158951147,
  		-0.3934925638717597
  	],
  	[
  		-9.06554648750712,
  		28.54895747675648,
  		-0.3789298030736219
  	],
  	[
  		-9.561469027707162,
  		28.390540163669748,
  		-0.36425478384217114
  	],
  	[
  		-10.054307655859109,
  		28.223475421185448,
  		-0.3494729934574723
  	],
  	[
  		-10.54388125641931,
  		28.047837083584646,
  		-0.3345955651000374
  	],
  	[
  		-11.03004066107662,
  		27.86375612158682,
  		-0.3196227566289243
  	],
  	[
  		-11.51264149991084,
  		27.67133906323066,
  		-0.30455785995227175
  	],
  	[
  		-11.99152538482442,
  		27.47071715640598,
  		-0.2894117371028335
  	],
  	[
  		-12.466596240346739,
  		27.261985278160388,
  		-0.2741848034628637
  	],
  	[
  		-12.93772331724428,
  		27.04527324155698,
  		-0.2588782240892366
  	],
  	[
  		-13.404821948984631,
  		26.820693582657583,
  		-0.2435025099012491
  	],
  	[
  		-13.867779956007851,
  		26.588340454899992,
  		-0.2280578210152617
  	],
  	[
  		-14.32653866073732,
  		26.34832922307897,
  		-0.2125444010476139
  	],
  	[
  		-14.78101203954836,
  		26.10073093848949,
  		-0.1969715144861458
  	],
  	[
  		-15.23114329850971,
  		25.845643037445313,
  		-0.1813394835122253
  	],
  	[
  		-15.67686176297655,
  		25.583108448440747,
  		-0.1656483116042921
  	],
  	[
  		-16.118097236788678,
  		25.313193441568988,
  		-0.1499067910440709
  	],
  	[
  		-16.55479886329055,
  		25.03590826023681,
  		-0.1341161534240607
  	],
  	[
  		-16.98685732038895,
  		24.75129544275793,
  		-0.1182757390465175
  	],
  	[
  		-17.41418354586787,
  		24.45934925777329,
  		-0.1023956647291705
  	],
  	[
  		-17.83664127805503,
  		24.16007394406666,
  		-0.08647882318128984
  	],
  	[
  		-18.254110693670892,
  		23.853498162472683,
  		-0.07052484600831203
  	],
  	[
  		-18.66639380842503,
  		23.539634582627823,
  		-0.05454556157073143
  	],
  	[
  		-19.07333187839828,
  		23.218531228584922,
  		-0.038545953104757474
  	],
  	[
  		-19.47473370771788,
  		22.890239195360543,
  		-0.0225265280937264
  	],
  	[
  		-19.870407140801,
  		22.55487459011011,
  		-0.00649880715594188
  	],
  	[
  		-20.260168369049907,
  		22.212509857778922,
  		0.009530281035211906
  	],
  	[
  		-20.64383357041519,
  		21.863291603413728,
  		0.025560024204494002
  	],
  	[
  		-21.02125149945326,
  		21.50734841020839,
  		0.04157998305782239
  	],
  	[
  		-21.392249658659857,
  		21.14483992086263,
  		0.05758266721775655
  	],
  	[
  		-21.7567107808579,
  		20.775919226117708,
  		0.0735683361096081
  	],
  	[
  		-22.114483183418653,
  		20.40074781761838,
  		0.08952710297724259
  	],
  	[
  		-22.46548174837465,
  		20.019501118852272,
  		0.10545208570174952
  	],
  	[
  		-22.809589145806658,
  		19.63234035295715,
  		0.1213444261925793
  	],
  	[
  		-23.14672362689441,
  		19.23945178567591,
  		0.1371952080260026
  	],
  	[
  		-23.47681091556579,
  		18.84097106596325,
  		0.1529980667880596
  	],
  	[
  		-23.79979249744897,
  		18.43709520978152,
  		0.16875506945042973
  	],
  	[
  		-24.11561418788815,
  		18.02796737782964,
  		0.18445922633833642
  	],
  	[
  		-24.424223495370533,
  		17.61374351884431,
  		0.20010337003391881
  	],
  	[
  		-24.72561711963165,
  		17.19455412380924,
  		0.2156905605155656
  	],
  	[
  		-25.0197417406314,
  		16.77054860891178,
  		0.2312153596386311
  	],
  	[
  		-25.30659639298817,
  		16.34183426560821,
  		0.24667004255676092
  	],
  	[
  		-25.586148008340142,
  		15.908499539673391,
  		0.2620579924595987
  	],
  	[
  		-25.85839103489418,
  		15.47064872122008,
  		0.2773743194408202
  	],
  	[
  		-26.123271241058,
  		15.02833220528035,
  		0.29261102765098407
  	],
  	[
  		-26.380749207231624,
  		14.58162766896425,
  		0.3077699546286771
  	],
  	[
  		-26.63075426290407,
  		14.130568279916249,
  		0.3228462304955895
  	],
  	[
  		-26.87319322329058,
  		13.67523071970105,
  		0.3378307225565416
  	],
  	[
  		-27.1079686943874,
  		13.21566385593189,
  		0.3527234486182602
  	],
  	[
  		-27.334933323646823,
  		12.75196953667264,
  		0.3675190552215753
  	],
  	[
  		-27.55398016563759,
  		12.28423216609541,
  		0.3822064018146881
  	],
  	[
  		-27.764957837541022,
  		11.81258156945052,
  		0.39678502957883977
  	],
  	[
  		-27.967747987826833,
  		11.33717438644003,
  		0.41124955390029466
  	],
  	[
  		-28.162202544143923,
  		10.858152953703371,
  		0.42558809327336694
  	],
  	[
  		-28.348240022306157,
  		10.375707765392079,
  		0.439800291705009
  	],
  	[
  		-28.525747660759883,
  		9.890017532613852,
  		0.45388187715705186
  	],
  	[
  		-28.694636190041592,
  		9.40129589640259,
  		0.4678214747080267
  	],
  	[
  		-28.85484711653853,
  		8.909711404334832,
  		0.48161813246518137
  	],
  	[
  		-29.006321621284272,
  		8.415499605020482,
  		0.4952700295412372
  	],
  	[
  		-29.14902942742264,
  		7.918846821990599,
  		0.5087668225892367
  	],
  	[
  		-29.2829242366706,
  		7.419960212036057,
  		0.5221074895940786
  	],
  	[
  		-29.40801878360405,
  		6.91903844023882,
  		0.5352919739994565
  	],
  	[
  		-29.52428974495242,
  		6.416278766834458,
  		0.5483108612771571
  	],
  	[
  		-29.63177319735511,
  		5.91187669638527,
  		0.5611640511498089
  	],
  	[
  		-29.73046987215924,
  		5.406000851031175,
  		0.5738522611506883
  	],
  	[
  		-29.820426082061648,
  		4.898839032646177,
  		0.5863672572832025
  	],
  	[
  		-29.901685026836418,
  		4.390526943149436,
  		0.5987092796277932
  	],
  	[
  		-29.974290145730727,
  		3.881238612704872,
  		0.610879985050313
  	],
  	[
  		-30.03829052036145,
  		3.371070895817986,
  		0.6228716134241706
  	],
  	[
  		-30.09372819257074,
  		2.860144855799483,
  		0.6346834845387949
  	],
  	[
  		-30.14066100306429,
  		2.348551387708292,
  		0.6463186823515868
  	],
  	[
  		-30.17908058102556,
  		1.836376027432546,
  		0.65776887377953
  	],
  	[
  		-30.20901999774399,
  		1.323674040529504,
  		0.6690316718922665
  	],
  	[
  		-30.230448398760167,
  		0.8105166903470871,
  		0.6801098205001562
  	],
  	[
  		-30.24334274119578,
  		0.296999863409163,
  		0.6909941807307881
  	],
  	[
  		-30.247636521991122,
  		-0.21681589836547543,
  		0.7016805922886953
  	],
  	[
  		-30.24328309801875,
  		-0.7308041319043176,
  		0.7121704191566428
  	],
  	[
  		-30.230210812226,
  		-1.244854833701292,
  		0.7224548996080667
  	],
  	[
  		-30.20834905315599,
  		-1.758802159334414,
  		0.7325283057757934
  	],
  	[
  		-30.17765226558907,
  		-2.272503159121077,
  		0.7423917462951279
  	],
  	[
  		-30.13805573270041,
  		-2.785764662346859,
  		0.7520371653626303
  	],
  	[
  		-30.089549019761883,
  		-3.298411170807895,
  		0.7614585421468956
  	],
  	[
  		-30.032087528234207,
  		-3.810236108059125,
  		0.7706582764193519
  	],
  	[
  		-29.96568286962305,
  		-4.321036756038087,
  		0.7796289030226453
  	],
  	[
  		-29.890329577250778,
  		-4.830630420957178,
  		0.7883650100874483
  	],
  	[
  		-29.80607161359508,
  		-5.338791302918297,
  		0.7968701339743662
  	],
  	[
  		-29.712921813742,
  		-5.845333115952669,
  		0.805138324655459
  	],
  	[
  		-29.610936997945792,
  		-6.350048470660797,
  		0.8131645799413388
  	],
  	[
  		-29.50019267746121,
  		-6.852767455533328,
  		0.820953407455574
  	],
  	[
  		-29.380746230366608,
  		-7.353272028775382,
  		0.8285012994469668
  	],
  	[
  		-29.25269166024821,
  		-7.851412600462766,
  		0.8358027339138465
  	],
  	[
  		-29.116113755589673,
  		-8.347013748535185,
  		0.8428629931883812
  	],
  	[
  		-28.971140694388723,
  		-8.839920172784828,
  		0.8496804232946998
  	],
  	[
  		-28.81785237830847,
  		-9.329998491603607,
  		0.8562496512843126
  	],
  	[
  		-28.65638431611559,
  		-9.817125189733071,
  		0.8625761558081255
  	],
  	[
  		-28.486828521438298,
  		-10.301208766147509,
  		0.8686587558814955
  	],
  	[
  		-28.309303052854823,
  		-10.78214835581674,
  		0.8744924550922927
  	],
  	[
  		-28.123889376245778,
  		-11.259898902731951,
  		0.8800816930786479
  	],
  	[
  		-27.93065258317348,
  		-11.73437660010274,
  		0.8854252604090439
  	],
  	[
  		-27.72965298179816,
  		-12.205556442113949,
  		0.8905170338328331
  	],
  	[
  		-27.52091513178843,
  		-12.67335867183764,
  		0.8953601661106321
  	],
  	[
  		-27.304460454610062,
  		-13.13772323753123,
  		0.8999532158979758
  	],
  	[
  		-27.080261241081928,
  		-13.59856756770573,
  		0.9042876012173324
  	],
  	[
  		-26.848344590288292,
  		-14.055791319315409,
  		0.9083656657554409
  	],
  	[
  		-26.608678093429972,
  		-14.50926394170899,
  		0.9121862336974932
  	],
  	[
  		-26.36126976470659,
  		-14.95883979755307,
  		0.915740127478383
  	],
  	[
  		-26.10611807227564,
  		-15.404390816870539,
  		0.9190289735873869
  	],
  	[
  		-25.84325579084668,
  		-15.845717496054231,
  		0.9220526039911556
  	],
  	[
  		-25.572706257394373,
  		-16.28266615000156,
  		0.9248029864179124
  	],
  	[
  		-25.2945139171228,
  		-16.71504517901552,
  		0.9272810535625123
  	],
  	[
  		-25.00875355203821,
  		-17.14269044953753,
  		0.9294885413648576
  	],
  	[
  		-24.71548186622323,
  		-17.56540068140729,
  		0.9314185967413812
  	],
  	[
  		-24.41480877735254,
  		-17.98300985646885,
  		0.933072664495803
  	],
  	[
  		-24.10681167550453,
  		-18.39533739706515,
  		0.9344539838165199
  	],
  	[
  		-23.79162646942345,
  		-18.80221373954819,
  		0.9355564299171546
  	],
  	[
  		-23.469363292366,
  		-19.20348486882808,
  		0.9363826697364059
  	],
  	[
  		-23.14017428484756,
  		-19.59897237144117,
  		0.9369371641030482
  	],
  	[
  		-22.804190798909517,
  		-19.9885587304807,
  		0.9372149879526129
  	],
  	[
  		-22.46158506817472,
  		-20.3720986897198,
  		0.9372188953604565
  	],
  	[
  		-22.11252332939766,
  		-20.74948816819787,
  		0.9369547429861846
  	],
  	[
  		-21.757154684386762,
  		-21.12060734353328,
  		0.9364185304828727
  	],
  	[
  		-21.395666958862098,
  		-21.48541095151068,
  		0.9356120321900863
  	],
  	[
  		-21.02820889704912,
  		-21.8438203616315,
  		0.9345425246657877
  	],
  	[
  		-20.65494202320927,
  		-22.195794344798937,
  		0.9332060931833216
  	],
  	[
  		-20.27597232053708,
  		-22.541315056014287,
  		0.931603142517483
  	],
  	[
  		-19.89144206732243,
  		-22.88035436158119,
  		0.9297403350454059
  	],
  	[
  		-19.50141879342513,
  		-23.21289776282709,
  		0.9276133169488872
  	],
  	[
  		-19.10598323540673,
  		-23.538900828145877,
  		0.9252210461024595
  	],
  	[
  		-18.7051838974025,
  		-23.85834223670111,
  		0.9225685197889695
  	],
  	[
  		-18.29906998701406,
  		-24.171135469915,
  		0.9196514727727646
  	],
  	[
  		-17.88769543586668,
  		-24.477228461743227,
  		0.9164674582959252
  	],
  	[
  		-17.47109433458509,
  		-24.77650044877341,
  		0.9130212631678838
  	],
  	[
  		-17.04933565640808,
  		-25.068856196555636,
  		0.9093089324633321
  	],
  	[
  		-16.62247299567817,
  		-25.35417293940434,
  		0.9053276387466248
  	],
  	[
  		-16.19061609187721,
  		-25.632318179746953,
  		0.9010836840667535
  	],
  	[
  		-15.75382449069151,
  		-25.90315973085008,
  		0.8965737895816199
  	],
  	[
  		-15.312226835704159,
  		-26.166563837496703,
  		0.8917953453927965
  	],
  	[
  		-14.86593976067404,
  		-26.422410747184777,
  		0.8867556519982023
  	],
  	[
  		-14.41510057016413,
  		-26.67053784857131,
  		0.8814535284119306
  	],
  	[
  		-13.95984379877518,
  		-26.910852159400452,
  		0.8758867393339957
  	],
  	[
  		-13.50033127855458,
  		-27.14321329143326,
  		0.8700629788729538
  	],
  	[
  		-13.03674268315123,
  		-27.36751663023766,
  		0.8639837194453088
  	],
  	[
  		-12.56923505476661,
  		-27.583644698710682,
  		0.8576468254887755
  	],
  	[
  		-12.098018477427921,
  		-27.791522080589537,
  		0.8510605575599185
  	],
  	[
  		-11.623268252823632,
  		-27.991059548476073,
  		0.8442277805949788
  	],
  	[
  		-11.14521105860414,
  		-28.182191037622268,
  		0.8371471052786353
  	],
  	[
  		-10.66403415245297,
  		-28.36488159352198,
  		0.8298274395808017
  	],
  	[
  		-10.179956744985962,
  		-28.53909026245264,
  		0.8222719432306074
  	],
  	[
  		-9.693167609652306,
  		-28.70483681438418,
  		0.8144795146316375
  	],
  	[
  		-9.203867434754182,
  		-28.86210884162049,
  		0.8064585183626365
  	],
  	[
  		-8.712221928377959,
  		-29.0109505828096,
  		0.7982126751396887
  	],
  	[
  		-8.218369624699372,
  		-29.151388849604718,
  		0.7897394605665968
  	],
  	[
  		-7.722461595359704,
  		-29.283483504072,
  		0.7810457757693028
  	],
  	[
  		-7.224582071012547,
  		-29.40723954790364,
  		0.7721354431669969
  	],
  	[
  		-6.724833310118264,
  		-29.52269138127596,
  		0.7630037659714832
  	],
  	[
  		-6.223277438883438,
  		-29.62985433643217,
  		0.753656187495214
  	],
  	[
  		-5.720012912614314,
  		-29.72869782762958,
  		0.744096453480271
  	],
  	[
  		-5.21508450793168,
  		-29.81920182937383,
  		0.7343196726063237
  	],
  	[
  		-4.708589000025399,
  		-29.901313584193797,
  		0.724330262242297
  	],
  	[
  		-4.200611765614013,
  		-29.974996636095362,
  		0.7141324060969142
  	],
  	[
  		-3.691250586882645,
  		-30.04016034294791,
  		0.7037223208286106
  	],
  	[
  		-3.180621260015939,
  		-30.09676261601345,
  		0.6931039589766228
  	],
  	[
  		-2.668836336413797,
  		-30.14471025413821,
  		0.6822830531954538
  	],
  	[
  		-2.156049895310796,
  		-30.18395230366461,
  		0.6712567081659944
  	],
  	[
  		-1.64239096252437,
  		-30.214412616902408,
  		0.6600295131359007
  	],
  	[
  		-1.128037315457368,
  		-30.23602225703673,
  		0.648608671981894
  	],
  	[
  		-0.6131296729410565,
  		-30.248730508854358,
  		0.6369917570516513
  	],
  	[
  		-0.09787780205126684,
  		-30.25248147160368,
  		0.6251843192101121
  	],
  	[
  		0.4175461529956467,
  		-30.2472376705156,
  		0.6131948627935074
  	],
  	[
  		0.932946034829411,
  		-30.23294418977681,
  		0.601022153914703
  	],
  	[
  		1.448115320861583,
  		-30.20961633776844,
  		0.5886713242416476
  	],
  	[
  		1.962836684436237,
  		-30.17721813011477,
  		0.5761522385134192
  	],
  	[
  		2.476896205404349,
  		-30.13577753685282,
  		0.5634649909981965
  	],
  	[
  		2.990099908575527,
  		-30.08532070208851,
  		0.5506136202215769
  	],
  	[
  		3.502210662603285,
  		-30.02591005868723,
  		0.5376089786639636
  	],
  	[
  		4.01305544126351,
  		-29.957603856859556,
  		0.5244516064402206
  	],
  	[
  		4.522435238410604,
  		-29.880493716878156,
  		0.5111446828497521
  	],
  	[
  		5.030211078455941,
  		-29.794687215427672,
  		0.49769797434329544
  	],
  	[
  		5.536228263692179,
  		-29.70026621781894,
  		0.48411141331535323
  	],
  	[
  		6.040382996842509,
  		-29.59734896851082,
  		0.47038711164008157
  	],
  	[
  		6.542574539564107,
  		-29.48599694282251,
  		0.45653322557030407
  	],
  	[
  		7.042727440913596,
  		-29.366303537339622,
  		0.44254912889514186
  	],
  	[
  		7.540770023654289,
  		-29.238305544046618,
  		0.42843505178295643
  	],
  	[
  		8.036610033217213,
  		-29.1020492835287,
  		0.4141991380471187
  	],
  	[
  		8.530198477304474,
  		-28.95753731703445,
  		0.3998409031357273
  	],
  	[
  		9.021429234534718,
  		-28.80479809636344,
  		0.38535953316892124
  	],
  	[
  		9.510219882652272,
  		-28.6438254325303,
  		0.3707642170025869
  	],
  	[
  		9.996447349876874,
  		-28.474594928988147,
  		0.35605557420807893
  	],
  	[
  		10.48001970826618,
  		-28.29712158481791,
  		0.3412329936992178
  	],
  	[
  		10.96078368850735,
  		-28.111384067909828,
  		0.3263058605914613
  	],
  	[
  		11.438608258080489,
  		-27.917383939360143,
  		0.31127694318423843
  	],
  	[
  		11.91334668253681,
  		-27.715096674322666,
  		0.2961464292116653
  	],
  	[
  		12.38482938656542,
  		-27.50455479519641,
  		0.2809238456348894
  	],
  	[
  		12.85289524326001,
  		-27.28574152968958,
  		0.2656139684182044
  	],
  	[
  		13.31735036092427,
  		-27.05868952553697,
  		0.2502173051152732
  	],
  	[
  		13.77802712948316,
  		-26.82341564219461,
  		0.23474419075425992
  	],
  	[
  		14.23470831007805,
  		-26.579961988282086,
  		0.219200406864343
  	],
  	[
  		14.687216326102291,
  		-26.3283922607954,
  		0.20358694564023494
  	],
  	[
  		15.13532245607561,
  		-26.06876527897784,
  		0.1879148412317424
  	],
  	[
  		15.57884794183096,
  		-25.80118026448162,
  		0.1721903819425434
  	],
  	[
  		16.01758627414797,
  		-25.525737512208902,
  		0.15641459584356182
  	],
  	[
  		16.4513461413178,
  		-25.24259507739952,
  		0.1405978384803874
  	],
  	[
  		16.87996389595148,
  		-24.95186376895348,
  		0.1247473196086178
  	]
  ];
  var neptuneOrbit = {
  	targetName: targetName$7,
  	name: name$7,
  	startDate: startDate$7,
  	stopDate: stopDate$7,
  	stepSize: stepSize$7,
  	coords: coords$7
  };

  var neptuneOrbit$1 = {
    __proto__: null,
    targetName: targetName$7,
    name: name$7,
    startDate: startDate$7,
    stopDate: stopDate$7,
    stepSize: stepSize$7,
    coords: coords$7,
    'default': neptuneOrbit
  };

  var targetName$8 = "ariel";
  var name$8 = "Ariel";
  var startDate$8 = "1995-01-01";
  var stopDate$8 = "2030-01-01";
  var stepSize$8 = 1;
  var coords$8 = [
  	[
  		8.72412791511595,
  		-17.6512125096141,
  		-0.1791904573433608
  	],
  	[
  		8.72865923066595,
  		-17.64957218876873,
  		-0.177009136479517
  	],
  	[
  		8.734366911101425,
  		-17.64861358938553,
  		-0.1778995046444503
  	],
  	[
  		8.737096025399454,
  		-17.64720205659443,
  		-0.18024854106377952
  	],
  	[
  		8.738294293082868,
  		-17.64505321355615,
  		-0.17969569903377103
  	],
  	[
  		8.742330853889216,
  		-17.64327962290876,
  		-0.1773535349822777
  	],
  	[
  		8.748181822822755,
  		-17.6422796209917,
  		-0.1777342148804738
  	],
  	[
  		8.75141637463897,
  		-17.640990242056148,
  		-0.1801824008303644
  	],
  	[
  		8.752527732035729,
  		-17.63889240374602,
  		-0.18015494672519622
  	],
  	[
  		8.756043410351944,
  		-17.63699556868009,
  		-0.1777660452064721
  	],
  	[
  		8.761925589497713,
  		-17.63592728620096,
  		-0.1776205219338327
  	],
  	[
  		8.765677469345594,
  		-17.63474697362182,
  		-0.180054174498942
  	],
  	[
  		8.766815711817976,
  		-17.63272557150465,
  		-0.18055540403737622
  	],
  	[
  		8.769808682798336,
  		-17.63072113788726,
  		-0.17823597004186043
  	],
  	[
  		8.77560982170509,
  		-17.62956100743835,
  		-0.1775719761594113
  	],
  	[
  		8.779866359093232,
  		-17.62847137983037,
  		-0.1798781137510251
  	],
  	[
  		8.781144615834762,
  		-17.62654792581655,
  		-0.18088399336842462
  	],
  	[
  		8.783639403255513,
  		-17.62445696189559,
  		-0.1787476017276347
  	],
  	[
  		8.78924979950484,
  		-17.62318536322595,
  		-0.1775974072499852
  	],
  	[
  		8.793975884280565,
  		-17.62216391865051,
  		-0.1796688707000642
  	],
  	[
  		8.795499603263503,
  		-17.62035522926505,
  		-0.1811335725879406
  	],
  	[
  		8.797544024275343,
  		-17.6182025452318,
  		-0.1792838850936176
  	],
  	[
  		8.802863350540633,
  		-17.61680526201403,
  		-0.1777039827708592
  	],
  	[
  		8.807999721680382,
  		-17.61582576556649,
  		-0.1794449614830528
  	],
  	[
  		8.809862063345243,
  		-17.61414274568329,
  		-0.1812993759988127
  	],
  	[
  		8.811525399024461,
  		-17.61195617915293,
  		-0.17982785907251073
  	],
  	[
  		8.816465074200725,
  		-17.61042424099374,
  		-0.1778940689761898
  	],
  	[
  		8.821935333748023,
  		-17.609458780148948,
  		-0.17922384963222132
  	],
  	[
  		8.82421295390436,
  		-17.60790632844391,
  		-0.18138160863422603
  	],
  	[
  		8.825583670240983,
  		-17.60571513622971,
  		-0.18035952488610282
  	],
  	[
  		8.830074825441312,
  		-17.60404642151137,
  		-0.1781659402109307
  	],
  	[
  		8.835785582088713,
  		-17.6030660383771,
  		-0.17902324632020492
  	],
  	[
  		8.838536102308645,
  		-17.60164284539403,
  		-0.1813832923760258
  	],
  	[
  		8.839716308536483,
  		-17.59947655781341,
  		-0.1808622015213091
  	],
  	[
  		8.843710320392152,
  		-17.59767506713494,
  		-0.17851507149165652
  	],
  	[
  		8.849557264996864,
  		-17.59665152222027,
  		-0.178861184537064
  	],
  	[
  		8.852814667078245,
  		-17.59534983653036,
  		-0.18131335885934863
  	],
  	[
  		8.853914778291086,
  		-17.59323621104513,
  		-0.18131877671013902
  	],
  	[
  		8.85738671225761,
  		-17.59131221975083,
  		-0.17893213744114972
  	],
  	[
  		8.863257673411072,
  		-17.59021870699421,
  		-0.1787512103429587
  	],
  	[
  		8.86703253754496,
  		-17.589025079231632,
  		-0.18118131249403222
  	],
  	[
  		8.868166947826849,
  		-17.586989343673288,
  		-0.18171412268099552
  	],
  	[
  		8.871117486667918,
  		-17.58495910627407,
  		-0.17940460278786222
  	],
  	[
  		8.87689988541252,
  		-17.58377225101086,
  		-0.1787062956229938
  	],
  	[
  		8.881178981211288,
  		-17.58266822360157,
  		-0.1810016777934908
  	],
  	[
  		8.882460154223981,
  		-17.58073174069749,
  		-0.18203783637853221
  	],
  	[
  		8.88491479863747,
  		-17.57861643505052,
  		-0.1799182661162629
  	],
  	[
  		8.89049977620484,
  		-17.5773171237254,
  		-0.17873717270032802
  	],
  	[
  		8.895244739833053,
  		-17.5762795948294,
  		-0.18079151504888413
  	],
  	[
  		8.896778019129092,
  		-17.57445872004318,
  		-0.18228202840938013
  	],
  	[
  		8.898785948415412,
  		-17.57228346205155,
  		-0.1804561173896475
  	],
  	[
  		8.904072723510176,
  		-17.57085736712516,
  		-0.1788486489140687
  	],
  	[
  		8.909224707347459,
  		-17.56986020665601,
  		-0.1805662386384213
  	],
  	[
  		8.911101469834449,
  		-17.568165417928242,
  		-0.1824417474405196
  	],
  	[
  		8.912734073441063,
  		-17.56595811835582,
  		-0.1809981547569656
  	],
  	[
  		8.917636370371287,
  		-17.56439721502774,
  		-0.1790433211097411
  	],
  	[
  		8.92311640410625,
  		-17.5634121450739,
  		-0.1803448946600043
  	],
  	[
  		8.92541358973107,
  		-17.56184819775702,
  		-0.18251755295613362
  	],
  	[
  		8.926759706355593,
  		-17.55963831509396,
  		-0.18152840525084632
  	],
  	[
  		8.931209023186595,
  		-17.55794050679888,
  		-0.1793198893747099
  	],
  	[
  		8.93692363704218,
  		-17.55693881614895,
  		-0.18014606956452783
  	],
  	[
  		8.939695572458444,
  		-17.55550359170885,
  		-0.1825141742786033
  	],
  	[
  		8.940858546800257,
  		-17.55332043761442,
  		-0.18202748232791552
  	],
  	[
  		8.944808016180223,
  		-17.55149033285621,
  		-0.1796731347553842
  	],
  	[
  		8.950651362346782,
  		-17.55044347329251,
  		-0.1799854027622522
  	],
  	[
  		8.953932065033808,
  		-17.54912915720778,
  		-0.18243829323773272
  	],
  	[
  		8.955022291409415,
  		-17.54700038876265,
  		-0.18247887380344183
  	],
  	[
  		8.958449199828037,
  		-17.54504871805525,
  		-0.1800925013970236
  	],
  	[
  		8.964309451124372,
  		-17.54393036130685,
  		-0.17987792024113972
  	],
  	[
  		8.968107186081532,
  		-17.54272302804661,
  		-0.1823016063577583
  	],
  	[
  		8.969239477196844,
  		-17.54067374732428,
  		-0.18286876952687361
  	],
  	[
  		8.972145507363132,
  		-17.538617026036547,
  		-0.1805672861721741
  	],
  	[
  		8.977909948700496,
  		-17.53740392621846,
  		-0.1798366485812455
  	],
  	[
  		8.982209414079758,
  		-17.53628468416607,
  		-0.1821186313770314
  	],
  	[
  		8.983495565158783,
  		-17.53433577365157,
  		-0.1831859041863343
  	],
  	[
  		8.985908248078069,
  		-17.53219555031096,
  		-0.18108159769475501
  	],
  	[
  		8.991468213701305,
  		-17.53086879839433,
  		-0.1798706629161938
  	],
  	[
  		8.996230712214274,
  		-17.52981456540128,
  		-0.18190527568754422
  	],
  	[
  		8.997774950304564,
  		-17.5279820503591,
  		-0.18342305197697362
  	],
  	[
  		8.999745396757138,
  		-17.52578369175709,
  		-0.1816183738649473
  	],
  	[
  		9.00500153324357,
  		-17.52432964089691,
  		-0.1799862071576522
  	],
  	[
  		9.010165583934915,
  		-17.52331382677899,
  		-0.1816785955358405
  	],
  	[
  		9.012059305234137,
  		-17.52160795871506,
  		-0.18357584416997572
  	],
  	[
  		9.013658980812592,
  		-17.51937939579669,
  		-0.18215948473500151
  	],
  	[
  		9.018525583849254,
  		-17.51779006170098,
  		-0.1801844738986324
  	],
  	[
  		9.024012263419996,
  		-17.51678464764744,
  		-0.1814571582810312
  	],
  	[
  		9.02632935912627,
  		-17.51520936283087,
  		-0.18364493969638732
  	],
  	[
  		9.027649656658465,
  		-17.51298022393143,
  		-0.18268618517915622
  	],
  	[
  		9.03205962103001,
  		-17.51125420123063,
  		-0.18046478381354503
  	],
  	[
  		9.03777412783659,
  		-17.51023021373556,
  		-0.18125859454295132
  	],
  	[
  		9.040569539879932,
  		-17.50878351830597,
  		-0.183635132421789
  	],
  	[
  		9.04171295434701,
  		-17.50658290130301,
  		-0.1831817977893782
  	],
  	[
  		9.045621428149659,
  		-17.50472511166641,
  		-0.1808209234506464
  	],
  	[
  		9.051457762763597,
  		-17.50365442256184,
  		-0.1811006206196031
  	],
  	[
  		9.05476212241462,
  		-17.502327597784777,
  		-0.18355408079393482
  	],
  	[
  		9.055840462549478,
  		-17.50018315377704,
  		-0.1836286952048909
  	],
  	[
  		9.059225056704445,
  		-17.49820457489704,
  		-0.18124341332059501
  	],
  	[
  		9.06507113475186,
  		-17.49706076012777,
  		-0.18099576268927411
  	],
  	[
  		9.068892333034423,
  		-17.495839901486228,
  		-0.1834129015377964
  	],
  	[
  		9.070019587858559,
  		-17.49377631081954,
  		-0.1840130175321522
  	],
  	[
  		9.072884894844497,
  		-17.49169401023218,
  		-0.1817196183979311
  	],
  	[
  		9.078628445596483,
  		-17.4904542990669,
  		-0.1809581349500965
  	],
  	[
  		9.082949631931827,
  		-17.48932017469658,
  		-0.18322643236811442
  	],
  	[
  		9.084237964366448,
  		-17.48735828535927,
  		-0.1843247452056759
  	],
  	[
  		9.08661205989731,
  		-17.485193916903683,
  		-0.182235392159807
  	],
  	[
  		9.092144699747179,
  		-17.48383963722905,
  		-0.18099709248891893
  	],
  	[
  		9.096925001506394,
  		-17.48276878601892,
  		-0.18301159510077702
  	],
  	[
  		9.098477537687794,
  		-17.480924103758152,
  		-0.18455647430308
  	],
  	[
  		9.100412763105325,
  		-17.478703165597,
  		-0.18277262852571272
  	],
  	[
  		9.10563574243587,
  		-17.47722087993355,
  		-0.18111712809643302
  	],
  	[
  		9.11081342452401,
  		-17.47618679713869,
  		-0.1827839889166925
  	],
  	[
  		9.1127205997586,
  		-17.47446918240469,
  		-0.1847031032955036
  	],
  	[
  		9.114290926787477,
  		-17.4722199980948,
  		-0.1833122913912096
  	],
  	[
  		9.119119751320072,
  		-17.47060230643907,
  		-0.18132027378937
  	],
  	[
  		9.124614513580601,
  		-17.46957676847644,
  		-0.1825627075526181
  	],
  	[
  		9.126950082366392,
  		-17.467990114436628,
  		-0.1847670036316854
  	],
  	[
  		9.12824606766237,
  		-17.46574203307857,
  		-0.18383783333331583
  	],
  	[
  		9.132615033522068,
  		-17.46398781279836,
  		-0.18160556910086123
  	],
  	[
  		9.138330734604706,
  		-17.46294188382372,
  		-0.18236680718639273
  	],
  	[
  		9.141146699904732,
  		-17.46148327750716,
  		-0.18475253665322552
  	],
  	[
  		9.142273104380434,
  		-17.45926561370932,
  		-0.18433078863168062
  	],
  	[
  		9.146137765447884,
  		-17.45738005051066,
  		-0.18196646782071313
  	],
  	[
  		9.151968541024083,
  		-17.45628556532159,
  		-0.1822107820521413
  	],
  	[
  		9.15529576418095,
  		-17.45494644728631,
  		-0.18466689558093502
  	],
  	[
  		9.156363754734809,
  		-17.45278648803287,
  		-0.1847734937126595
  	],
  	[
  		9.159705201909217,
  		-17.4507812802294,
  		-0.18239187379244232
  	],
  	[
  		9.165538156532799,
  		-17.44961214180125,
  		-0.18210969058918441
  	],
  	[
  		9.169382094243879,
  		-17.44837791790616,
  		-0.1845218230523317
  	],
  	[
  		9.170506654462784,
  		-17.446300475355002,
  		-0.1851537029147516
  	],
  	[
  		9.17332897146908,
  		-17.44419265863577,
  		-0.1828716500297309
  	],
  	[
  		9.179052028591052,
  		-17.44292616519378,
  		-0.18207667163585192
  	],
  	[
  		9.183394164209494,
  		-17.44177740391718,
  		-0.18433350730420472
  	],
  	[
  		9.18468597473639,
  		-17.4398026048113,
  		-0.18546049848213672
  	],
  	[
  		9.187020386009094,
  		-17.4376143737422,
  		-0.183389106127674
  	],
  	[
  		9.192525334521973,
  		-17.43623215295757,
  		-0.18212024900991253
  	],
  	[
  		9.197324017109535,
  		-17.43514512139533,
  		-0.18411611166414443
  	],
  	[
  		9.198886788474379,
  		-17.43328851290451,
  		-0.1856859763993356
  	],
  	[
  		9.200786597074625,
  		-17.43104549998726,
  		-0.18392614520278722
  	],
  	[
  		9.205976091616709,
  		-17.42953466777417,
  		-0.18224480658411213
  	],
  	[
  		9.211167562234808,
  		-17.42848265829972,
  		-0.1838875946344925
  	],
  	[
  		9.213090045681554,
  		-17.4267535758359,
  		-0.18582686760639733
  	],
  	[
  		9.214630162252822,
  		-17.42448420705336,
  		-0.18446539002247392
  	],
  	[
  		9.21942004394281,
  		-17.42283757496161,
  		-0.1824532428453618
  	],
  	[
  		9.224922854928447,
  		-17.42179225501685,
  		-0.1836672073799152
  	],
  	[
  		9.227277227437735,
  		-17.42019398798874,
  		-0.1858849838854393
  	],
  	[
  		9.228550057790907,
  		-17.41792775558467,
  		-0.18498855348191923
  	],
  	[
  		9.232876158821902,
  		-17.41614466936472,
  		-0.182742826503747
  	],
  	[
  		9.238593799666303,
  		-17.41507708466468,
  		-0.18347164291774282
  	],
  	[
  		9.241431662679751,
  		-17.41360665940323,
  		-0.18586436384808522
  	],
  	[
  		9.24254169411458,
  		-17.41137260000162,
  		-0.1854771975415266
  	],
  	[
  		9.24636205310389,
  		-17.40945890127172,
  		-0.183106871348543
  	],
  	[
  		9.252187207187317,
  		-17.40834100402379,
  		-0.18331797299168462
  	],
  	[
  		9.255536937361887,
  		-17.40698913131132,
  		-0.1857732579197753
  	],
  	[
  		9.256596459061877,
  		-17.404814671106948,
  		-0.1859154941978355
  	],
  	[
  		9.259891902468807,
  		-17.402782058856722,
  		-0.18353575038952363
  	],
  	[
  		9.265712516109561,
  		-17.40158794467336,
  		-0.18321959902051882
  	],
  	[
  		9.269578106399003,
  		-17.4003398836415,
  		-0.18562432761450742
  	],
  	[
  		9.270701175168004,
  		-17.39824915323824,
  		-0.18628943418667002
  	],
  	[
  		9.27347966420236,
  		-17.39611547904141,
  		-0.1840168740351637
  	],
  	[
  		9.279182708525544,
  		-17.39482261141782,
  		-0.1831898792926804
  	],
  	[
  		9.283544686879793,
  		-17.39365854516509,
  		-0.1854314686795584
  	],
  	[
  		9.284842359879805,
  		-17.391671797210012,
  		-0.18658959904561
  	],
  	[
  		9.287135012386232,
  		-17.38945912686792,
  		-0.1845345617451709
  	],
  	[
  		9.292614018065352,
  		-17.38804970446469,
  		-0.1832370078131873
  	],
  	[
  		9.297428233587215,
  		-17.38694570033215,
  		-0.1852122988927384
  	],
  	[
  		9.299002748390851,
  		-17.38507773345789,
  		-0.1868081310037033
  	],
  	[
  		9.300865314202412,
  		-17.38281221889809,
  		-0.18507138562751801
  	],
  	[
  		9.306022382161204,
  		-17.3812733750379,
  		-0.18336565692177711
  	],
  	[
  		9.311224913693007,
  		-17.38020265615128,
  		-0.1849822991107403
  	],
  	[
  		9.313164232731511,
  		-17.37846258191056,
  		-0.1869420009708931
  	],
  	[
  		9.314672535821087,
  		-17.37617253870316,
  		-0.18560808847965313
  	],
  	[
  		9.319425720364254,
  		-17.37449779752944,
  		-0.18357750716087373
  	],
  	[
  		9.324933547162392,
  		-17.37343193301399,
  		-0.18476153243926982
  	],
  	[
  		9.327308744934552,
  		-17.37182267226232,
  		-0.18699328635038812
  	],
  	[
  		9.328555984269311,
  		-17.36953769353565,
  		-0.18612838275436322
  	],
  	[
  		9.332841923911387,
  		-17.36772667466977,
  		-0.1838708712646795
  	],
  	[
  		9.338557783145044,
  		-17.36663679279134,
  		-0.1845677543861007
  	],
  	[
  		9.341418474434727,
  		-17.36515477691454,
  		-0.18696685601474322
  	],
  	[
  		9.342510152916004,
  		-17.36290386788967,
  		-0.18661333456142193
  	],
  	[
  		9.346288016516981,
  		-17.360962672930732,
  		-0.1842379672530231
  	],
  	[
  		9.35210484956738,
  		-17.35982086052173,
  		-0.1844156905794095
  	],
  	[
  		9.355478208340363,
  		-17.35845661634994,
  		-0.1868703302061682
  	],
  	[
  		9.356526609760506,
  		-17.35626688351579,
  		-0.18704602655342373
  	],
  	[
  		9.359780000044953,
  		-17.354207953895518,
  		-0.18466893337956092
  	],
  	[
  		9.365584476731968,
  		-17.3529883715579,
  		-0.18432046142685843
  	],
  	[
  		9.369473364013395,
  		-17.351726834127238,
  		-0.1867169744623906
  	],
  	[
  		9.370592541371904,
  		-17.34962242584995,
  		-0.1874154946389189
  	],
  	[
  		9.373329368172413,
  		-17.34746345818364,
  		-0.1851522561047042
  	],
  	[
  		9.379010060761964,
  		-17.34614406320211,
  		-0.1842950256437066
  	],
  	[
  		9.383392238405063,
  		-17.34496496304319,
  		-0.18652194687421092
  	],
  	[
  		9.384693026965092,
  		-17.34296556115537,
  		-0.18770966601882222
  	],
  	[
  		9.386947225229427,
  		-17.34072927937109,
  		-0.18567089612966511
  	],
  	[
  		9.392396798721363,
  		-17.33929221065625,
  		-0.18434612815851792
  	],
  	[
  		9.397228577634918,
  		-17.33817166285392,
  		-0.18629990269307672
  	],
  	[
  		9.398812210205337,
  		-17.33629195334321,
  		-0.1879222741878447
  	],
  	[
  		9.400640409970885,
  		-17.33400444752849,
  		-0.1862069051282488
  	],
  	[
  		9.405763218038299,
  		-17.33243768521087,
  		-0.1844795354735052
  	],
  	[
  		9.410977725758315,
  		-17.331348544994768,
  		-0.1860698335301252
  	],
  	[
  		9.41293162280083,
  		-17.32959719751932,
  		-0.18805069132958452
  	],
  	[
  		9.414410671174737,
  		-17.327287079855168,
  		-0.1867437803870432
  	],
  	[
  		9.419124465631663,
  		-17.325584042649062,
  		-0.1846968424032176
  	],
  	[
  		9.424638666157952,
  		-17.32449793157103,
  		-0.18585009986056122
  	],
  	[
  		9.427032054052237,
  		-17.32287736199519,
  		-0.1880969029476505
  	],
  	[
  		9.428256296078747,
  		-17.320574060415982,
  		-0.18726162201287622
  	],
  	[
  		9.43250008607171,
  		-17.31873508605186,
  		-0.18499448241424382
  	],
  	[
  		9.438215569450126,
  		-17.31762304123566,
  		-0.18565733484146402
  	],
  	[
  		9.441097725666763,
  		-17.31612952995602,
  		-0.1880648356527578
  	],
  	[
  		9.442173365060158,
  		-17.31386216883418,
  		-0.18774331150785573
  	],
  	[
  		9.445907565155181,
  		-17.31189374502226,
  		-0.1853658565516956
  	],
  	[
  		9.451716748044975,
  		-17.31072805972206,
  		-0.1855086196700644
  	],
  	[
  		9.455112706170768,
  		-17.30935160201745,
  		-0.1879645560518168
  	],
  	[
  		9.456151918467803,
  		-17.30714704925177,
  		-0.1881730818677445
  	],
  	[
  		9.459361011121569,
  		-17.30506175471104,
  		-0.18580105408014302
  	],
  	[
  		9.46515046563033,
  		-17.30381668781817,
  		-0.185417561483069
  	],
  	[
  		9.469061229783623,
  		-17.30254175498347,
  		-0.18780788598139692
  	],
  	[
  		9.470178452742477,
  		-17.30042385405365,
  		-0.188537265185473
  	],
  	[
  		9.472872889126982,
  		-17.29824000650529,
  		-0.18628671056753462
  	],
  	[
  		9.478531055055758,
  		-17.29689369399624,
  		-0.1853959173005001
  	],
  	[
  		9.482934280808763,
  		-17.2957000326758,
  		-0.1876094509158411
  	],
  	[
  		9.484239749102473,
  		-17.29368834763562,
  		-0.18882617562886683
  	],
  	[
  		9.486454625686848,
  		-17.29142876978012,
  		-0.1868065918443266
  	],
  	[
  		9.49187544900129,
  		-17.28996400019036,
  		-0.18545238838520361
  	],
  	[
  		9.496723996511593,
  		-17.288827099862388,
  		-0.1873865444311176
  	],
  	[
  		9.498318721105496,
  		-17.286935864054833,
  		-0.1890331533884405
  	],
  	[
  		9.500111588197479,
  		-17.2846268851502,
  		-0.18734374569494402
  	],
  	[
  		9.505198811098767,
  		-17.28303147563929,
  		-0.1855908634028889
  	],
  	[
  		9.510426149199022,
  		-17.28192432702619,
  		-0.1871557535042614
  	],
  	[
  		9.512395389514701,
  		-17.28016166970684,
  		-0.1891556108369126
  	],
  	[
  		9.51384534743959,
  		-17.27783196955072,
  		-0.1878783644881995
  	],
  	[
  		9.518519191617333,
  		-17.27610028467092,
  		-0.18581277267865792
  	],
  	[
  		9.524040152429372,
  		-17.27499421427342,
  		-0.186936094700122
  	],
  	[
  		9.526453644818437,
  		-17.2733624648463,
  		-0.1891952438439194
  	],
  	[
  		9.527655274192872,
  		-17.27104161431922,
  		-0.1883939941901056
  	],
  	[
  		9.531855432921017,
  		-17.26917408388076,
  		-0.1861146384663882
  	],
  	[
  		9.53757138720489,
  		-17.268040394100012,
  		-0.18674529388242622
  	],
  	[
  		9.540475007132091,
  		-17.26653502890913,
  		-0.18915805370504551
  	],
  	[
  		9.541535435201316,
  		-17.264251904486628,
  		-0.1888716705535526
  	],
  	[
  		9.545223685337477,
  		-17.262255531815008,
  		-0.1864900003899567
  	],
  	[
  		9.5510258295137,
  		-17.261066281899758,
  		-0.1865985410619007
  	],
  	[
  		9.554444270605497,
  		-17.25967717936926,
  		-0.18905235774455753
  	],
  	[
  		9.555475810336848,
  		-17.25745850820156,
  		-0.189295894240212
  	],
  	[
  		9.558639103495864,
  		-17.25534635952036,
  		-0.1869272667565699
  	],
  	[
  		9.56441443924566,
  		-17.25407626812676,
  		-0.1865101730792586
  	],
  	[
  		9.568346885890543,
  		-17.25278752609197,
  		-0.1888911692267397
  	],
  	[
  		9.569464053501223,
  		-17.25065698640718,
  		-0.1896541170207378
  	],
  	[
  		9.572113924119733,
  		-17.24844760570311,
  		-0.1874144887677005
  	],
  	[
  		9.577750860557838,
  		-17.24707501956813,
  		-0.18649228004043783
  	],
  	[
  		9.582172546966282,
  		-17.24586592461388,
  		-0.18868979807470132
  	],
  	[
  		9.583484897025661,
  		-17.24384260083989,
  		-0.1899362479779944
  	],
  	[
  		9.585658188199337,
  		-17.24155914914395,
  		-0.18793479640062483
  	],
  	[
  		9.591050843869313,
  		-17.24006699332903,
  		-0.1865520696640919
  	],
  	[
  		9.595914636834786,
  		-17.23891315561698,
  		-0.18846436607619982
  	],
  	[
  		9.597521775618429,
  		-17.2370108718041,
  		-0.19013612932566182
  	],
  	[
  		9.599278266981601,
  		-17.23467992094908,
  		-0.188470268819725
  	],
  	[
  		9.604331984915282,
  		-17.23305674819514,
  		-0.1866945354965549
  	],
  	[
  		9.609568738572111,
  		-17.23193067537571,
  		-0.1882323854931405
  	],
  	[
  		9.611556074326456,
  		-17.2301574204174,
  		-0.19025157859932473
  	],
  	[
  		9.612974565256238,
  		-17.22780758970195,
  		-0.1890033474082422
  	],
  	[
  		9.617610299692048,
  		-17.22604783907999,
  		-0.1869199534429029
  	],
  	[
  		9.623134832043853,
  		-17.22492115640431,
  		-0.18801323146534032
  	],
  	[
  		9.625568762158244,
  		-17.22327837813035,
  		-0.19028481412914572
  	],
  	[
  		9.626746469059817,
  		-17.22093942378943,
  		-0.18951519491982083
  	],
  	[
  		9.630905259186061,
  		-17.219044155586708,
  		-0.1872254994283056
  	],
  	[
  		9.636617891888886,
  		-17.21788793171741,
  		-0.1878230716481651
  	],
  	[
  		9.639544935474296,
  		-17.216371252405228,
  		-0.19024139878117202
  	],
  	[
  		9.640587954765131,
  		-17.214071757024,
  		-0.18998877081365872
  	],
  	[
  		9.644233940350345,
  		-17.21204836578955,
  		-0.1876033079201271
  	],
  	[
  		9.650025570928555,
  		-17.21083505959113,
  		-0.1876790956417731
  	],
  	[
  		9.653467205531145,
  		-17.20943353094605,
  		-0.1901307336106367
  	],
  	[
  		9.654488952165291,
  		-17.207200206867398,
  		-0.1904083013065596
  	],
  	[
  		9.657609290391624,
  		-17.20506195504886,
  		-0.1880435114269284
  	],
  	[
  		9.66336692033284,
  		-17.20376627698791,
  		-0.1875939307902763
  	],
  	[
  		9.66732160519349,
  		-17.20246393148861,
  		-0.18996568538612532
  	],
  	[
  		9.668435910889652,
  		-17.20032002863637,
  		-0.190760914475042
  	],
  	[
  		9.671044948895675,
  		-17.19808596587623,
  		-0.1885319508055507
  	],
  	[
  		9.676657629996484,
  		-17.19668671367786,
  		-0.1875797558432516
  	],
  	[
  		9.681099341067439,
  		-17.19546256579162,
  		-0.1897609814661458
  	],
  	[
  		9.68241575194779,
  		-17.19342706448556,
  		-0.19103722630050962
  	],
  	[
  		9.684551135473502,
  		-17.19112048527172,
  		-0.1890529360721811
  	],
  	[
  		9.689913369543657,
  		-17.18960091663043,
  		-0.1876445170941604
  	],
  	[
  		9.694792699783408,
  		-17.18843019747285,
  		-0.1895343420172078
  	],
  	[
  		9.696409778240271,
  		-17.18651646701459,
  		-0.19123176809062592
  	],
  	[
  		9.69813205454217,
  		-17.1841640090347,
  		-0.1895888400555232
  	],
  	[
  		9.703149969583519,
  		-17.182512865164178,
  		-0.1877918203818614
  	],
  	[
  		9.708397493908473,
  		-17.18136819609511,
  		-0.18930227543071163
  	],
  	[
  		9.710399431025808,
  		-17.17958370997163,
  		-0.19134120650952172
  	],
  	[
  		9.711790033165661,
  		-17.17721435960906,
  		-0.19012012864773942
  	],
  	[
  		9.716385798315963,
  		-17.17542664140505,
  		-0.1880219813697359
  	],
  	[
  		9.721915245107907,
  		-17.17427946583343,
  		-0.18908334242789093
  	],
  	[
  		9.724368415517365,
  		-17.172625706739172,
  		-0.19136901056369993
  	],
  	[
  		9.725523568929324,
  		-17.17026890652544,
  		-0.1906300809771427
  	],
  	[
  		9.729639886179179,
  		-17.16834604654984,
  		-0.18833221295194913
  	],
  	[
  		9.735350288244202,
  		-17.16716756070293,
  		-0.1888963164443115
  	],
  	[
  		9.738298115463794,
  		-17.16563921378052,
  		-0.1913212177692
  	],
  	[
  		9.73932605043208,
  		-17.16332375891921,
  		-0.1911009627666901
  	],
  	[
  		9.742927134504402,
  		-17.16127330614548,
  		-0.1887149080804237
  	],
  	[
  		9.748709674160544,
  		-17.16003594025688,
  		-0.1887550069571319
  	],
  	[
  		9.752173589008253,
  		-17.158622140024672,
  		-0.1912063800690999
  	],
  	[
  		9.753186963440816,
  		-17.15637427950471,
  		-0.19151586133788723
  	],
  	[
  		9.75626365533094,
  		-17.154210235798498,
  		-0.18915756898513403
  	],
  	[
  		9.762004646992935,
  		-17.152889038317888,
  		-0.18867362151952993
  	],
  	[
  		9.765981093384376,
  		-17.15157326207114,
  		-0.191037459199348
  	],
  	[
  		9.76709462300409,
  		-17.1494163897639,
  		-0.191863793112795
  	],
  	[
  		9.769660954967007,
  		-17.14715782029644,
  		-0.18964902577156462
  	],
  	[
  		9.775249828102217,
  		-17.1457317503877,
  		-0.188664349667259
  	],
  	[
  		9.779710888725871,
  		-17.14449279655468,
  		-0.1908314488180537
  	],
  	[
  		9.781032604871347,
  		-17.14244517060417,
  		-0.19213516481748102
  	],
  	[
  		9.783128894014236,
  		-17.140115779460142,
  		-0.19017150796653481
  	],
  	[
  		9.788460235515386,
  		-17.13856832040111,
  		-0.1887339916391367
  	],
  	[
  		9.793355719404634,
  		-17.13738115655912,
  		-0.1906028241782581
  	],
  	[
  		9.794984302413052,
  		-17.13545605315359,
  		-0.19232325012834822
  	],
  	[
  		9.796672451034318,
  		-17.13308264103087,
  		-0.19070641653908071
  	],
  	[
  		9.80165390901765,
  		-17.13140313719611,
  		-0.18888564520523832
  	],
  	[
  		9.806912726833902,
  		-17.13024026051583,
  		-0.1903699865039912
  	],
  	[
  		9.808931016988776,
  		-17.128444769681018,
  		-0.1924268079140912
  	],
  	[
  		9.810293180992003,
  		-17.12605638851403,
  		-0.19123662922461693
  	],
  	[
  		9.814847700125418,
  		-17.12424013452862,
  		-0.1891209600190149
  	],
  	[
  		9.820382264301378,
  		-17.12307290385357,
  		-0.1901525648515056
  	],
  	[
  		9.82285469965641,
  		-17.1214078080511,
  		-0.1924490295811593
  	],
  	[
  		9.823988756803296,
  		-17.11903398996682,
  		-0.19174381429723153
  	],
  	[
  		9.828060197497065,
  		-17.11708276576319,
  		-0.1894353367116828
  	],
  	[
  		9.833769232197858,
  		-17.11588232655139,
  		-0.1899661546027373
  	],
  	[
  		9.83673873366401,
  		-17.114342277087452,
  		-0.19239530396721272
  	],
  	[
  		9.837752456628401,
  		-17.11201145303037,
  		-0.1922096810327683
  	],
  	[
  		9.841308079066916,
  		-17.10993358138727,
  		-0.1898206869973645
  	],
  	[
  		9.847081512516574,
  		-17.108672551105258,
  		-0.1898273242873454
  	],
  	[
  		9.850567325035152,
  		-17.10724603116081,
  		-0.1922751569984641
  	],
  	[
  		9.85157455915178,
  		-17.10498466014139,
  		-0.19261981344800083
  	],
  	[
  		9.854604816033248,
  		-17.102794072752342,
  		-0.19026635696506472
  	],
  	[
  		9.8603300133571,
  		-17.10144776385486,
  		-0.1897489936222704
  	],
  	[
  		9.864326680047393,
  		-17.10011801861998,
  		-0.1921028185576008
  	],
  	[
  		9.865440856017148,
  		-17.09794871242422,
  		-0.1929612377420527
  	],
  	[
  		9.867963496947915,
  		-17.09566524257523,
  		-0.19075872390030713
  	],
  	[
  		9.873528898938645,
  		-17.094212727682383,
  		-0.1897430622570081
  	],
  	[
  		9.878007823209607,
  		-17.09295825909664,
  		-0.19189261189676643
  	],
  	[
  		9.87933714140886,
  		-17.09089936813236,
  		-0.193225728549128
  	],
  	[
  		9.881392637628034,
  		-17.08854662490022,
  		-0.1912808153706123
  	],
  	[
  		9.886694959560776,
  		-17.08697206576913,
  		-0.18981627612929072
  	],
  	[
  		9.891603547013903,
  		-17.0857676538323,
  		-0.1916624721005517
  	],
  	[
  		9.893245369072584,
  		-17.08383178295108,
  		-0.193406840724922
  	],
  	[
  		9.894897598633493,
  		-17.08143698152358,
  		-0.1918150966551586
  	],
  	[
  		9.899844104514546,
  		-17.07972974148732,
  		-0.18997199215183003
  	],
  	[
  		9.90511090001937,
  		-17.07854781694719,
  		-0.1914287033036235
  	],
  	[
  		9.90714683403233,
  		-17.076741701867178,
  		-0.19350339981598683
  	],
  	[
  		9.908478969718693,
  		-17.074333797692,
  		-0.19234233668691322
  	],
  	[
  		9.912994661302692,
  		-17.07248984083246,
  		-0.1902106058369452
  	],
  	[
  		9.91853101800317,
  		-17.0713017503635,
  		-0.191211170498682
  	],
  	[
  		9.921024527989086,
  		-17.06962589337778,
  		-0.19351896140390962
  	],
  	[
  		9.922135099929973,
  		-17.06723445987663,
  		-0.19284615814137873
  	],
  	[
  		9.926165079370016,
  		-17.06525592868188,
  		-0.1905285290810034
  	],
  	[
  		9.931868862113014,
  		-17.06403291678275,
  		-0.19102698382478922
  	],
  	[
  		9.934860901326195,
  		-17.06248135332914,
  		-0.1934595813395703
  	],
  	[
  		9.935858365244945,
  		-17.06013475660819,
  		-0.19330811015627303
  	],
  	[
  		9.93937057988408,
  		-17.05803010394062,
  		-0.19091673233555692
  	],
  	[
  		9.945132220937953,
  		-17.05674496789342,
  		-0.1908901675485135
  	],
  	[
  		9.948640541522497,
  		-17.0553059779361,
  		-0.19333446414430872
  	],
  	[
  		9.949638750269397,
  		-17.053030301939522,
  		-0.1937122843000352
  	],
  	[
  		9.952626671025827,
  		-17.05081426714196,
  		-0.1913642451723112
  	],
  	[
  		9.958332474839331,
  		-17.04944240980746,
  		-0.1908151776977044
  	],
  	[
  		9.962350971118875,
  		-17.04809902844118,
  		-0.19315798973282372
  	],
  	[
  		9.963463265844148,
  		-17.045916919960572,
  		-0.19404898139186222
  	],
  	[
  		9.965944609209906,
  		-17.04360914447091,
  		-0.1918583633778096
  	],
  	[
  		9.97148464162699,
  		-17.04213017621353,
  		-0.1908138017661857
  	],
  	[
  		9.975981619619501,
  		-17.04086039656077,
  		-0.1929460960303394
  	],
  	[
  		9.977315731849004,
  		-17.03878958562845,
  		-0.1943074507399476
  	],
  	[
  		9.979333397657163,
  		-17.03641424635855,
  		-0.19238115339580272
  	],
  	[
  		9.984603451943082,
  		-17.03481222057881,
  		-0.1908911909447063
  	],
  	[
  		9.989526960330117,
  		-17.03359094391875,
  		-0.1927137375348766
  	],
  	[
  		9.99117915920025,
  		-17.03164387910612,
  		-0.19448260716223612
  	],
  	[
  		9.992798297213247,
  		-17.02922818570127,
  		-0.1929141447798244
  	],
  	[
  		9.997708104488021,
  		-17.02749334823363,
  		-0.1910515596751977
  	],
  	[
  		10.00298413510106,
  		-17.02629271275357,
  		-0.19248015406733682
  	],
  	[
  		10.00503566779657,
  		-17.02447578092973,
  		-0.1945736616856993
  	],
  	[
  		10.006340128531741,
  		-17.02204889497379,
  		-0.19344095365706981
  	],
  	[
  		10.010814532370109,
  		-17.02017715608631,
  		-0.1912955369718737
  	],
  	[
  		10.016353969295011,
  		-17.01896850533538,
  		-0.1922642370225675
  	],
  	[
  		10.018866105264749,
  		-17.01728162936693,
  		-0.19458443367711373
  	],
  	[
  		10.01995538403089,
  		-17.01487293136596,
  		-0.1939421397194333
  	],
  	[
  		10.023941575228669,
  		-17.012867041095262,
  		-0.19161771177547812
  	],
  	[
  		10.02964156882868,
  		-17.01162159880057,
  		-0.19208153327496932
  	],
  	[
  		10.03265489491689,
  		-17.01005867630637,
  		-0.19451972579997162
  	],
  	[
  		10.033638325413179,
  		-17.00769663063306,
  		-0.19440023569233753
  	],
  	[
  		10.037106067535731,
  		-17.005565540968842,
  		-0.1920096661521991
  	],
  	[
  		10.042856513603372,
  		-17.00425631379952,
  		-0.19194807031898653
  	],
  	[
  		10.046386939522769,
  		-17.00280517611487,
  		-0.19439081835571762
  	],
  	[
  		10.04737797519389,
  		-17.0005156342891,
  		-0.19480105311907223
  	],
  	[
  		10.0503213902593,
  		-16.99827415214787,
  		-0.1924608988085893
  	],
  	[
  		10.056008566564309,
  		-16.99687670500992,
  		-0.19187761968380102
  	],
  	[
  		10.06004760041678,
  		-16.99551984667337,
  		-0.1942116391417935
  	],
  	[
  		10.061159812254541,
  		-16.993325084683132,
  		-0.1951324414169934
  	],
  	[
  		10.06359907768047,
  		-16.99099344472462,
  		-0.19295717809095003
  	],
  	[
  		10.069113026972321,
  		-16.98948752005718,
  		-0.19188022921520953
  	],
  	[
  		10.07362925042542,
  		-16.98820301531341,
  		-0.1939966374492075
  	],
  	[
  		10.07496969708729,
  		-16.98612062839354,
  		-0.195385304385799
  	],
  	[
  		10.07694909171631,
  		-16.98372309862584,
  		-0.19348031350344722
  	],
  	[
  		10.082187237776841,
  		-16.98209350863326,
  		-0.1919626977544116
  	],
  	[
  		10.08712518276683,
  		-16.98085563716095,
  		-0.1937633647428647
  	],
  	[
  		10.088789830424501,
  		-16.97889765864756,
  		-0.1955545354215104
  	],
  	[
  		10.090375147575429,
  		-16.97646166814603,
  		-0.1940139011407776
  	],
  	[
  		10.09524664256984,
  		-16.97469850018986,
  		-0.192128172784511
  	],
  	[
  		10.1005325757066,
  		-16.97347957717902,
  		-0.19352974409216722
  	],
  	[
  		10.10260017621225,
  		-16.97165175692351,
  		-0.195639898049359
  	],
  	[
  		10.1038774818754,
  		-16.96920649448102,
  		-0.19453823495725972
  	],
  	[
  		10.10830968959025,
  		-16.967306557550963,
  		-0.1923766997983111
  	],
  	[
  		10.113852663012619,
  		-16.96607764484511,
  		-0.1933141155420519
  	],
  	[
  		10.11638508866043,
  		-16.96437985381064,
  		-0.1956439964012047
  	],
  	[
  		10.117453972938879,
  		-16.96195476945909,
  		-0.1950363227484067
  	],
  	[
  		10.121395079842499,
  		-16.95992099136578,
  		-0.1927025123734371
  	],
  	[
  		10.127092003213,
  		-16.95865361843478,
  		-0.1931333883251455
  	],
  	[
  		10.13012649722318,
  		-16.95707899589985,
  		-0.1955741121512241
  	],
  	[
  		10.13109698033354,
  		-16.95470232038093,
  		-0.19549004515943713
  	],
  	[
  		10.134517872038572,
  		-16.95254409891038,
  		-0.19309826986442652
  	],
  	[
  		10.14025779463875,
  		-16.95121114049255,
  		-0.1930024481241635
  	],
  	[
  		10.14380955766362,
  		-16.94974733185824,
  		-0.1954403709009358
  	],
  	[
  		10.14479520155386,
  		-16.94744469389136,
  		-0.1958850422748857
  	],
  	[
  		10.147692546143489,
  		-16.94517731639321,
  		-0.1935512999730461
  	],
  	[
  		10.1533621396879,
  		-16.943754737587312,
  		-0.19293478788455462
  	],
  	[
  		10.15742130253549,
  		-16.94238395432565,
  		-0.19525674997522452
  	],
  	[
  		10.15853539282717,
  		-16.94017742295576,
  		-0.1962099736003375
  	],
  	[
  		10.160930584937208,
  		-16.937821340830588,
  		-0.1940483728978691
  	],
  	[
  		10.166420094367561,
  		-16.93628921025677,
  		-0.19294121958620103
  	],
  	[
  		10.170952607394849,
  		-16.93498906432867,
  		-0.19503918129313821
  	],
  	[
  		10.17230168431503,
  		-16.932895802567728,
  		-0.1964559440079134
  	],
  	[
  		10.174240357885349,
  		-16.9304755625832,
  		-0.19457173991304652
  	],
  	[
  		10.179447453116419,
  		-16.92881878227244,
  		-0.19302719771473542
  	],
  	[
  		10.18439806549371,
  		-16.92756374079336,
  		-0.194804021958378
  	],
  	[
  		10.18607635662329,
  		-16.9255952776529,
  		-0.19661807639982443
  	],
  	[
  		10.18762670468682,
  		-16.92313851643507,
  		-0.19510303914529992
  	],
  	[
  		10.192462117076811,
  		-16.92134791932575,
  		-0.1931965510267564
  	],
  	[
  		10.19775460544124,
  		-16.92010982490599,
  		-0.19456942445177472
  	],
  	[
  		10.199841137382538,
  		-16.91827184717576,
  		-0.1966963694726122
  	],
  	[
  		10.201088687413991,
  		-16.91580765131844,
  		-0.1956252475357802
  	],
  	[
  		10.20548078757237,
  		-16.913880179228087,
  		-0.1934484900492786
  	],
  	[
  		10.21102416981184,
  		-16.91263044503162,
  		-0.1943549483501964
  	],
  	[
  		10.21357736096345,
  		-16.91092190977709,
  		-0.19669439472162653
  	],
  	[
  		10.214624267915699,
  		-16.90847989989419,
  		-0.1961193664264357
  	],
  	[
  		10.21852239441698,
  		-16.90641901028564,
  		-0.1937778645757186
  	],
  	[
  		10.224212752215688,
  		-16.90512894794911,
  		-0.19417525368275101
  	],
  	[
  		10.227270332573239,
  		-16.90354312560611,
  		-0.196618496725657
  	],
  	[
  		10.22822552063525,
  		-16.90115117920677,
  		-0.1965683649838786
  	],
  	[
  		10.23160315304108,
  		-16.89896672639548,
  		-0.19417562578073042
  	],
  	[
  		10.237329189817071,
  		-16.89760959940693,
  		-0.1940471574564915
  	],
  	[
  		10.2409034531966,
  		-16.89613342865328,
  		-0.196480053419773
  	],
  	[
  		10.24188142659928,
  		-16.89381717713673,
  		-0.1969584869865277
  	],
  	[
  		10.2447354552688,
  		-16.89152461437127,
  		-0.19463135323645192
  	],
  	[
  		10.250384072161369,
  		-16.89007646822889,
  		-0.19398325303933672
  	],
  	[
  		10.25446401882435,
  		-16.88869199048685,
  		-0.1962932161745206
  	],
  	[
  		10.25557739755672,
  		-16.88647304930857,
  		-0.19727779328139822
  	],
  	[
  		10.25793177910477,
  		-16.884093249569748,
  		-0.1951293676547588
  	],
  	[
  		10.263393844643529,
  		-16.88253452525081,
  		-0.1939933874207367
  	],
  	[
  		10.26794446299453,
  		-16.88121916795836,
  		-0.1960725573017647
  	],
  	[
  		10.269299386643349,
  		-16.879114510354242,
  		-0.1975175358041575
  	],
  	[
  		10.27120099389808,
  		-16.87667223662556,
  		-0.19565265442454222
  	],
  	[
  		10.27637474116101,
  		-16.87498826587929,
  		-0.1940842636657987
  	],
  	[
  		10.281338568694201,
  		-16.873716142428663,
  		-0.19583646190962922
  	],
  	[
  		10.283028431599659,
  		-16.8717369537423,
  		-0.19767442053575332
  	],
  	[
  		10.28454580044843,
  		-16.869259832496112,
  		-0.1961842565941826
  	],
  	[
  		10.28934296421999,
  		-16.86744163812152,
  		-0.1942586773908656
  	],
  	[
  		10.2946433055548,
  		-16.86618468496126,
  		-0.19560251635873022
  	],
  	[
  		10.29674548268572,
  		-16.86433599104074,
  		-0.1977469007272049
  	],
  	[
  		10.29796675993629,
  		-16.86185342628227,
  		-0.1967043225836868
  	],
  	[
  		10.30231679462183,
  		-16.85989845933662,
  		-0.1945151934905441
  	],
  	[
  		10.30786184864329,
  		-16.85862792609032,
  		-0.19538831700367001
  	],
  	[
  		10.310434865766428,
  		-16.8569087956417,
  		-0.1977393661694006
  	],
  	[
  		10.311461241974229,
  		-16.8544500934223,
  		-0.19719581840294992
  	],
  	[
  		10.31531558576056,
  		-16.8523623038871,
  		-0.19484889235229072
  	],
  	[
  		10.32100028073094,
  		-16.85104972106997,
  		-0.1952120642985326
  	],
  	[
  		10.324078795798231,
  		-16.84945250240294,
  		-0.1976592847034701
  	],
  	[
  		10.32502105291218,
  		-16.8470457309137,
  		-0.19764199938461022
  	],
  	[
  		10.3283530122125,
  		-16.84483503409323,
  		-0.19525149850556772
  	],
  	[
  		10.334066318764549,
  		-16.84345362926817,
  		-0.19508724000777142
  	],
  	[
  		10.337662198791651,
  		-16.84196525039522,
  		-0.1975170923150295
  	],
  	[
  		10.33863384700193,
  		-16.83963546698871,
  		-0.198027172706281
  	],
  	[
  		10.34144401491276,
  		-16.83731804620252,
  		-0.19570935638038423
  	],
  	[
  		10.3470723934714,
  		-16.83584422380222,
  		-0.19502719993149162
  	],
  	[
  		10.35117302444708,
  		-16.83444628385082,
  		-0.1973264707314867
  	],
  	[
  		10.35228761257221,
  		-16.83221527768709,
  		-0.1983412965899465
  	],
  	[
  		10.354599937976909,
  		-16.82981207229853,
  		-0.19620975745145472
  	],
  	[
  		10.3600349044567,
  		-16.82822654963492,
  		-0.1950424239491162
  	],
  	[
  		10.36460321890271,
  		-16.82689623690867,
  		-0.19710478838512502
  	],
  	[
  		10.36596528259913,
  		-16.82478026669529,
  		-0.19857598927549772
  	],
  	[
  		10.36782872390377,
  		-16.82231631229466,
  		-0.19673424283892302
  	],
  	[
  		10.372968509383671,
  		-16.82060459048659,
  		-0.1951384306959577
  	],
  	[
  		10.377946141051112,
  		-16.819315768193192,
  		-0.1968673442420147
  	],
  	[
  		10.379648733142538,
  		-16.81732578265928,
  		-0.19872635806807
  	],
  	[
  		10.381133494102459,
  		-16.81482889514826,
  		-0.1972642996086151
  	],
  	[
  		10.385891432315491,
  		-16.81298261492556,
  		-0.1953171809089971
  	],
  	[
  		10.391200492767629,
  		-16.81170718370844,
  		-0.1966328936818944
  	],
  	[
  		10.39332004138357,
  		-16.809847952634062,
  		-0.19879281298449722
  	],
  	[
  		10.394514800916179,
  		-16.80734754829161,
  		-0.1977825761509124
  	],
  	[
  		10.39882161474613,
  		-16.8053645470209,
  		-0.1955785615582351
  	],
  	[
  		10.40436878595793,
  		-16.80407369114437,
  		-0.19642065750801682
  	],
  	[
  		10.40696153811399,
  		-16.80234350911617,
  		-0.1987797454282019
  	],
  	[
  		10.40796888587476,
  		-16.79986893788218,
  		-0.198270862365453
  	],
  	[
  		10.41177664285013,
  		-16.79775338348865,
  		-0.1959162933251897
  	],
  	[
  		10.41745672992545,
  		-16.79641859715241,
  		-0.1962454603300611
  	],
  	[
  		10.420556630351669,
  		-16.79480977857779,
  		-0.1986941050441428
  	],
  	[
  		10.42148690065998,
  		-16.79238869334651,
  		-0.1987115263120363
  	],
  	[
  		10.424772427093409,
  		-16.79015135392438,
  		-0.1963212079176145
  	],
  	[
  		10.430473335200968,
  		-16.78874609777879,
  		-0.1961233534517648
  	],
  	[
  		10.43409043263896,
  		-16.78724500007188,
  		-0.1985467774045419
  	],
  	[
  		10.43505827637822,
  		-16.78490269049469,
  		-0.1990914717642079
  	],
  	[
  		10.43782175896617,
  		-16.78255963047811,
  		-0.1967814478731655
  	],
  	[
  		10.44343109714796,
  		-16.78106062606606,
  		-0.19606655979574272
  	],
  	[
  		10.4475504795845,
  		-16.77964856838478,
  		-0.1983531486546306
  	],
  	[
  		10.448667846718731,
  		-16.77740597037817,
  		-0.19939884566506721
  	],
  	[
  		10.450936721954161,
  		-16.77497885204805,
  		-0.1972823913570359
  	],
  	[
  		10.45634500267405,
  		-16.77336687989139,
  		-0.1960852313890035
  	],
  	[
  		10.46092921189027,
  		-16.77202085002429,
  		-0.1981278282407774
  	],
  	[
  		10.46230065498035,
  		-16.76989427316629,
  		-0.19962649977054342
  	],
  	[
  		10.46412435754085,
  		-16.767408070189347,
  		-0.197805929068148
  	],
  	[
  		10.46923221029435,
  		-16.76566937839056,
  		-0.1961847955306849
  	],
  	[
  		10.47422057500353,
  		-16.764363045092942,
  		-0.1978890970321464
  	],
  	[
  		10.47593789792004,
  		-16.76236284318343,
  		-0.1997698489819889
  	],
  	[
  		10.47738819201973,
  		-16.75984567557797,
  		-0.19833477516511872
  	],
  	[
  		10.48210875721702,
  		-16.75797195600473,
  		-0.196367498454179
  	],
  	[
  		10.48742283936863,
  		-16.75667716945654,
  		-0.1976542571805513
  	],
  	[
  		10.48956081742321,
  		-16.75480764932746,
  		-0.1998294514303648
  	],
  	[
  		10.49072751024124,
  		-16.75228887390383,
  		-0.19884977577567692
  	],
  	[
  		10.49499343111173,
  		-16.750278571902438,
  		-0.19663211911278042
  	],
  	[
  		10.50053931231582,
  		-16.74896656951537,
  		-0.1974422406729237
  	],
  	[
  		10.503153360582289,
  		-16.74722581910959,
  		-0.1998099601669502
  	],
  	[
  		10.504139503113258,
  		-16.74473473547242,
  		-0.1993341177642797
  	],
  	[
  		10.507904589733661,
  		-16.74259249025475,
  		-0.19697304917379732
  	],
  	[
  		10.51357599778006,
  		-16.74123484421603,
  		-0.19726950104183022
  	],
  	[
  		10.51669815785035,
  		-16.7396145764535,
  		-0.1997188042239092
  	],
  	[
  		10.51761440164303,
  		-16.73717875384473,
  		-0.1997706345739061
  	],
  	[
  		10.52085581401689,
  		-16.7349153599484,
  		-0.1973806262297502
  	],
  	[
  		10.526541470435,
  		-16.733485789608473,
  		-0.19714987743354662
  	],
  	[
  		10.530179999273479,
  		-16.731972120389912,
  		-0.1995670779006754
  	],
  	[
  		10.53114105031235,
  		-16.72961643511012,
  		-0.20014446449345602
  	],
  	[
  		10.533862124390849,
  		-16.72724878646687,
  		-0.1978425395824154
  	],
  	[
  		10.539448815495021,
  		-16.72572411743633,
  		-0.1970966278485813
  	],
  	[
  		10.543588549825229,
  		-16.72429822833801,
  		-0.1993695077076849
  	],
  	[
  		10.54470609331027,
  		-16.722043640806422,
  		-0.20044677264083402
  	],
  	[
  		10.54693432124348,
  		-16.71959318723464,
  		-0.1983445855379611
  	],
  	[
  		10.552314215932011,
  		-16.717954802642602,
  		-0.19711999718481382
  	],
  	[
  		10.556914358517751,
  		-16.71659315050141,
  		-0.19914285473913962
  	],
  	[
  		10.55829227177342,
  		-16.71445533422725,
  		-0.20066844095307534
  	],
  	[
  		10.56007907825796,
  		-16.71194754306272,
  		-0.1988687055563596
  	],
  	[
  		10.56515198388456,
  		-16.71018155922917,
  		-0.19722407925027882
  	],
  	[
  		10.57015257866438,
  		-16.708857983626718,
  		-0.19890270225965642
  	],
  	[
  		10.57188157233285,
  		-16.70684708227201,
  		-0.20080592028521893
  	],
  	[
  		10.57330020599361,
  		-16.704310077172092,
  		-0.19939591892557793
  	],
  	[
  		10.57798185948406,
  		-16.70240906976644,
  		-0.1974113495534573
  	],
  	[
  		10.58330230337165,
  		-16.7010951888096,
  		-0.19866823129173802
  	],
  	[
  		10.58545684747803,
  		-16.69921522281592,
  		-0.20085984910848942
  	],
  	[
  		10.586597562709649,
  		-16.69667849730753,
  		-0.19990975106690723
  	],
  	[
  		10.59082062189071,
  		-16.69464093441315,
  		-0.1976811257793003
  	],
  	[
  		10.59636625801388,
  		-16.693307992346853,
  		-0.19845838634469692
  	],
  	[
  		10.598999333914861,
  		-16.69155643070584,
  		-0.2008358587384289
  	],
  	[
  		10.59996598347915,
  		-16.68904909046178,
  		-0.2003914269264011
  	],
  	[
  		10.60368598245699,
  		-16.68688008535043,
  		-0.1980264135366414
  	],
  	[
  		10.609350241923948,
  		-16.68549970144409,
  		-0.19828781749346241
  	],
  	[
  		10.61249334648519,
  		-16.6838680777364,
  		-0.2007397735226204
  	],
  	[
  		10.61339757221452,
  		-16.68141773325437,
  		-0.20082356774009813
  	],
  	[
  		10.61659390290017,
  		-16.67912865447206,
  		-0.19843723544449451
  	],
  	[
  		10.622264911621519,
  		-16.67767473477547,
  		-0.19817154448367852
  	],
  	[
  		10.62592485973253,
  		-16.67614884086812,
  		-0.20058422214949273
  	],
  	[
  		10.62688071693201,
  		-16.67378013797109,
  		-0.20119349527604122
  	],
  	[
  		10.629557322650768,
  		-16.67138793347257,
  		-0.19890230182800983
  	],
  	[
  		10.63512203588463,
  		-16.66983756176346,
  		-0.1981231491049187
  	],
  	[
  		10.63928084412846,
  		-16.66839799859278,
  		-0.20038461825371462
  	],
  	[
  		10.640400187386001,
  		-16.66613149716077,
  		-0.2014905279830103
  	],
  	[
  		10.642586777143299,
  		-16.663658139603072,
  		-0.19940639480499042
  	],
  	[
  		10.647937288456239,
  		-16.66199275151087,
  		-0.1981507694515954
  	],
  	[
  		10.65255466386044,
  		-16.6606160846172,
  		-0.20015530888193422
  	],
  	[
  		10.65394041390616,
  		-16.65846724567403,
  		-0.20170628401870738
  	],
  	[
  		10.655690105698621,
  		-16.65593829796894,
  		-0.1999299381164347
  	],
  	[
  		10.660728080445761,
  		-16.65414484925281,
  		-0.1982596100657591
  	],
  	[
  		10.665740696882759,
  		-16.652804351260638,
  		-0.1999142632180662
  	],
  	[
  		10.667483312849491,
  		-16.65078298487202,
  		-0.2018376079286436
  	],
  	[
  		10.6688698380372,
  		-16.648226785678652,
  		-0.2004571194592995
  	],
  	[
  		10.67351065922718,
  		-16.64629774168356,
  		-0.1984519456423023
  	],
  	[
  		10.678838096171031,
  		-16.644965239741488,
  		-0.19968042757642782
  	],
  	[
  		10.68100928603382,
  		-16.64307465741225,
  		-0.2018861569131316
  	],
  	[
  		10.682124894333269,
  		-16.64052065926387,
  		-0.20096823784454032
  	],
  	[
  		10.6863036408181,
  		-16.63845530279989,
  		-0.1987261641739667
  	],
  	[
  		10.69184951540512,
  		-16.6371017289712,
  		-0.1994710816774062
  	],
  	[
  		10.69450279762872,
  		-16.63533936000283,
  		-0.2018555324443085
  	],
  	[
  		10.69545130109013,
  		-16.63281665425101,
  		-0.20144590902738543
  	],
  	[
  		10.699124926767121,
  		-16.630620395633102,
  		-0.1990745050032533
  	],
  	[
  		10.70478252633237,
  		-16.62921773103951,
  		-0.19930247678157142
  	],
  	[
  		10.70794629696053,
  		-16.627574439281748,
  		-0.20175433961366174
  	],
  	[
  		10.70883990711861,
  		-16.62511045653042,
  		-0.2018733706462581
  	],
  	[
  		10.71198879296438,
  		-16.62279503590414,
  		-0.19948881428405063
  	],
  	[
  		10.71764574635337,
  		-16.621317163741487,
  		-0.19918921268213952
  	],
  	[
  		10.721325675311899,
  		-16.61977845383017,
  		-0.20159447512154438
  	],
  	[
  		10.72227836183837,
  		-16.61739752229517,
  		-0.2022372368316462
  	],
  	[
  		10.724908921201191,
  		-16.61498033706885,
  		-0.1999553179999956
  	],
  	[
  		10.730452479324919,
  		-16.61340466656827,
  		-0.19914365917732332
  	],
  	[
  		10.73462957684191,
  		-16.61195094658829,
  		-0.20139057715818579
  	],
  	[
  		10.735752553392391,
  		-16.6096733738242,
  		-0.20252743130927323
  	],
  	[
  		10.73789590206003,
  		-16.607176620980212,
  		-0.2004594523468628
  	],
  	[
  		10.74321876885762,
  		-16.60548505646023,
  		-0.19917514439640852
  	],
  	[
  		10.74785003953259,
  		-16.60409244121874,
  		-0.20115903239422292
  	],
  	[
  		10.749245975883351,
  		-16.60193333667139,
  		-0.2027362535507674
  	],
  	[
  		10.75095612097569,
  		-16.59938278057878,
  		-0.20098298922320001
  	],
  	[
  		10.755960326576862,
  		-16.59756233311277,
  		-0.1992876050135296
  	],
  	[
  		10.760982664644041,
  		-16.5962043061127,
  		-0.2009166607069897
  	],
  	[
  		10.76273987984776,
  		-16.59417286291873,
  		-0.20286048009428634
  	],
  	[
  		10.764093016452541,
  		-16.59159701450935,
  		-0.2015073241793854
  	],
  	[
  		10.76869542709571,
  		-16.58964088737578,
  		-0.19948369955895592
  	],
  	[
  		10.77402623081463,
  		-16.58828886226452,
  		-0.20068210892537552
  	],
  	[
  		10.77621678277545,
  		-16.586388390752248,
  		-0.20290198786430153
  	],
  	[
  		10.777304526037199,
  		-16.58381658233074,
  		-0.20201580369589278
  	],
  	[
  		10.78144153813434,
  		-16.58172424790438,
  		-0.1997611686703678
  	],
  	[
  		10.786984435495059,
  		-16.58034956867796,
  		-0.2004744991627463
  	],
  	[
  		10.78965840636603,
  		-16.57857657621985,
  		-0.2028655519086199
  	],
  	[
  		10.79058687166772,
  		-16.57603802761406,
  		-0.20248933578629524
  	],
  	[
  		10.794216278339439,
  		-16.57381530860205,
  		-0.20011289752593742
  	],
  	[
  		10.799863876123379,
  		-16.57238974978775,
  		-0.20030733916204402
  	],
  	[
  		10.803049852121811,
  		-16.57073519291591,
  		-0.20275862543178153
  	],
  	[
  		10.80393019769452,
  		-16.568256937590128,
  		-0.20291153257138983
  	],
  	[
  		10.80703513439846,
  		-16.56591609307512,
  		-0.20052886075613832
  	],
  	[
  		10.812674856836619,
  		-16.56441394219978,
  		-0.20019703898719554
  	],
  	[
  		10.81637607192624,
  		-16.56286277194134,
  		-0.2025944009922772
  	],
  	[
  		10.817323074834771,
  		-16.5604691510708,
  		-0.20327033228691904
  	],
  	[
  		10.81991025594651,
  		-16.55802771761032,
  		-0.20099774037446871
  	],
  	[
  		10.82542970502265,
  		-16.55642653103351,
  		-0.20015567630449782
  	],
  	[
  		10.829625623449111,
  		-16.55495888458018,
  		-0.20238787065712402
  	],
  	[
  		10.83074975735766,
  		-16.55266972447063,
  		-0.20355486926522703
  	],
  	[
  		10.832852485285871,
  		-16.55015022059394,
  		-0.20150253055314238
  	],
  	[
  		10.838144841345422,
  		-16.54843218108359,
  		-0.2001908882323277
  	],
  	[
  		10.842791810816419,
  		-16.547024091437038,
  		-0.2021536668735986
  	],
  	[
  		10.844194982814251,
  		-16.54485422220962,
  		-0.2037572046889519
  	],
  	[
  		10.845869066634211,
  		-16.54228273121411,
  		-0.2020253246384406
  	],
  	[
  		10.850837153941551,
  		-16.54043536535717,
  		-0.2003081481910746
  	],
  	[
  		10.855870084105561,
  		-16.539060013355538,
  		-0.20191066991354234
  	],
  	[
  		10.85764012074944,
  		-16.53701842094084,
  		-0.2038762485844902
  	],
  	[
  		10.8589616259907,
  		-16.53442334245338,
  		-0.20254963949932558
  	],
  	[
  		10.86352349033054,
  		-16.53244005468187,
  		-0.20050934688817634
  	],
  	[
  		10.868858962151451,
  		-16.53106889461248,
  		-0.20167738782551559
  	],
  	[
  		10.87106578343623,
  		-16.52915810532027,
  		-0.20391219542959382
  	],
  	[
  		10.87212885865008,
  		-16.52656904150691,
  		-0.2030556379851659
  	],
  	[
  		10.87622178970036,
  		-16.52444975130257,
  		-0.2007912778969773
  	],
  	[
  		10.8817628844956,
  		-16.52305398867525,
  		-0.20147026481712138
  	],
  	[
  		10.8844567896409,
  		-16.521270679570982,
  		-0.2038702904624687
  	],
  	[
  		10.8853667077951,
  		-16.51871654043713,
  		-0.20352588451455952
  	],
  	[
  		10.888951148148971,
  		-16.51646768096717,
  		-0.2011468739513992
  	],
  	[
  		10.894589486580418,
  		-16.51501938212241,
  		-0.2013066758345981
  	],
  	[
  		10.897796154971891,
  		-16.51335363575378,
  		-0.20375927211876502
  	],
  	[
  		10.89866561680854,
  		-16.5108616299331,
  		-0.2039449888259801
  	],
  	[
  		10.901724308843399,
  		-16.50849544138568,
  		-0.20156738084775794
  	],
  	[
  		10.90734745426667,
  		-16.506968855074998,
  		-0.20120011780625344
  	],
  	[
  		10.911069236942769,
  		-16.50540551437141,
  		-0.20359175180081662
  	],
  	[
  		10.91201179664515,
  		-16.50299932629487,
  		-0.20429868953011932
  	],
  	[
  		10.91455508094749,
  		-16.500534050446348,
  		-0.20203815978122253
  	],
  	[
  		10.92005050543321,
  		-16.498907103734737,
  		-0.20116275444839382
  	],
  	[
  		10.92426561022239,
  		-16.497425953838402,
  		-0.2033816438145286
  	],
  	[
  		10.92539271672381,
  		-16.49512558964001,
  		-0.2045776211611417
  	],
  	[
  		10.927454201578799,
  		-16.49258384280034,
  		-0.20254456014225164
  	],
  	[
  		10.93271606292101,
  		-16.490839116566,
  		-0.2012030084617733
  	],
  	[
  		10.93737867039998,
  		-16.4894159253892,
  		-0.2031464322708747
  	],
  	[
  		10.938790563829299,
  		-16.48723554175529,
  		-0.20477469079840863
  	],
  	[
  		10.94042757553525,
  		-16.48464357430649,
  		-0.20306812557305692
  	],
  	[
  		10.94535865900896,
  		-16.48276873506693,
  		-0.2013255470304919
  	],
  	[
  		10.95040261872313,
  		-16.48137646221325,
  		-0.2029027623723852
  	],
  	[
  		10.952186313300201,
  		-16.47932465550873,
  		-0.2048873067605908
  	],
  	[
  		10.95347685446939,
  		-16.4767110856555,
  		-0.2035905592224216
  	],
  	[
  		10.95799685054086,
  		-16.474700137123378,
  		-0.2015311192848353
  	],
  	[
  		10.963338042581421,
  		-16.47331026641022,
  		-0.2026692352604471
  	],
  	[
  		10.96556284451291,
  		-16.471389403469722,
  		-0.2049170786757757
  	],
  	[
  		10.96660134728393,
  		-16.4687837620744,
  		-0.20409398919902802
  	],
  	[
  		10.970649250984199,
  		-16.46663709302958,
  		-0.2018174213845014
  	],
  	[
  		10.976189091452271,
  		-16.46522079794309,
  		-0.20246428837789998
  	],
  	[
  		10.978902808321369,
  		-16.46342675000389,
  		-0.20486955953334599
  	],
  	[
  		10.9797957410831,
  		-16.46085798199888,
  		-0.20456058370645538
  	],
  	[
  		10.983332132233802,
  		-16.458582143525213,
  		-0.20217695543389322
  	],
  	[
  		10.98896240098912,
  		-16.45711150478164,
  		-0.20230228969010763
  	],
  	[
  		10.99218972283393,
  		-16.45543429645575,
  		-0.20475349319660113
  	],
  	[
  		10.99304937522044,
  		-16.4529291334872,
  		-0.2049738215180136
  	],
  	[
  		10.99606084064676,
  		-16.450537252562867,
  		-0.2025995071251261
  	],
  	[
  		11.001668191434039,
  		-16.44898676671259,
  		-0.2021986777455815
  	],
  	[
  		11.005410029775351,
  		-16.44741074118053,
  		-0.20458096156772843
  	],
  	[
  		11.00635088828464,
  		-16.44499307856179,
  		-0.2053217464518555
  	],
  	[
  		11.008847405719791,
  		-16.44250325029195,
  		-0.20307194681001622
  	],
  	[
  		11.01432049010503,
  		-16.44085121023744,
  		-0.20216464563848402
  	],
  	[
  		11.018552530927721,
  		-16.43935587392092,
  		-0.20436819910963272
  	],
  	[
  		11.01968431038192,
  		-16.43704484998817,
  		-0.20559372629493533
  	],
  	[
  		11.02170271001738,
  		-16.43448036714473,
  		-0.2035786098957266
  	],
  	[
  		11.02693474061253,
  		-16.43270938378808,
  		-0.2022085424517746
  	],
  	[
  		11.031610972854759,
  		-16.431270380006918,
  		-0.20413004647932703
  	],
  	[
  		11.033033741143282,
  		-16.42908012975251,
  		-0.20578367906046033
  	],
  	[
  		11.03463211880231,
  		-16.42646719059768,
  		-0.2041006799307458
  	],
  	[
  		11.03952836756079,
  		-16.42456569720068,
  		-0.20233457552775042
  	],
  	[
  		11.0445804891997,
  		-16.42315579051802,
  		-0.2038852839746538
  	],
  	[
  		11.046380081877182,
  		-16.42109440063961,
  		-0.2058892080194044
  	],
  	[
  		11.0476376092697,
  		-16.41846182020332,
  		-0.2046212225990324
  	],
  	[
  		11.052117843059719,
  		-16.41642394120569,
  		-0.20254399029657089
  	],
  	[
  		11.057461001957801,
  		-16.41501458552414,
  		-0.20365196222669302
  	],
  	[
  		11.05970481560562,
  		-16.4130838914377,
  		-0.20591237678891214
  	],
  	[
  		11.06071717209619,
  		-16.41046118578614,
  		-0.2051211542592511
  	],
  	[
  		11.06472212275669,
  		-16.40828782230774,
  		-0.20283348527786071
  	],
  	[
  		11.07025752759419,
  		-16.40685029182201,
  		-0.2034476160508438
  	],
  	[
  		11.07299253467498,
  		-16.40504598753601,
  		-0.20585868902545781
  	],
  	[
  		11.07386641878789,
  		-16.40246194150664,
  		-0.2055831619598601
  	],
  	[
  		11.07735889501901,
  		-16.40016022366673,
  		-0.20319576539036152
  	],
  	[
  		11.08297701214471,
  		-16.39866664302627,
  		-0.20328818541701732
  	],
  	[
  		11.086226181302909,
  		-16.39697821423589,
  		-0.2057372618796176
  	],
  	[
  		11.08707396386855,
  		-16.39445949521184,
  		-0.2059920327284754
  	],
  	[
  		11.09004064614259,
  		-16.39204249969863,
  		-0.2036207845021885
  	],
  	[
  		11.0956292647774,
  		-16.39046771597449,
  		-0.203187595243711
  	],
  	[
  		11.09939136705496,
  		-16.38887919767394,
  		-0.20556099121540639
  	],
  	[
  		11.10032763070852,
  		-16.38644924991877,
  		-0.20633379298472831
  	],
  	[
  		11.10278167329052,
  		-16.383935879379802,
  		-0.20409467668731904
  	],
  	[
  		11.10822877843937,
  		-16.38225826768164,
  		-0.2031572177226916
  	],
  	[
  		11.11247952267735,
  		-16.38074907744901,
  		-0.2053444416451721
  	],
  	[
  		11.113613458350951,
  		-16.37842702706269,
  		-0.2066003003151332
  	],
  	[
  		11.11559188212945,
  		-16.37584036644607,
  		-0.20460168556101743
  	],
  	[
  		11.12079246590337,
  		-16.37404322439298,
  		-0.20320580955937204
  	],
  	[
  		11.12548244756285,
  		-16.37258849387343,
  		-0.2051052302434787
  	],
  	[
  		11.126913358653262,
  		-16.37038786924663,
  		-0.2067843400132759
  	],
  	[
  		11.128475904326748,
  		-16.36775456154394,
  		-0.2051242618364429
  	],
  	[
  		11.13333458477923,
  		-16.36582618379626,
  		-0.2033367264462255
  	],
  	[
  		11.13839613284992,
  		-16.36439885424849,
  		-0.2048598740134056
  	],
  	[
  		11.1402086533272,
  		-16.36232744010465,
  		-0.2068841371857182
  	],
  	[
  		11.14143601470391,
  		-16.35967627233619,
  		-0.20564287509791834
  	],
  	[
  		11.14587518811523,
  		-16.3576116324449,
  		-0.2035505572785203
  	],
  	[
  		11.151221637116231,
  		-16.35618297087171,
  		-0.2046270035540656
  	],
  	[
  		11.1534828345333,
  		-16.3542423653597,
  		-0.2069014268540706
  	],
  	[
  		11.15447104756917,
  		-16.351602951012122,
  		-0.20614086190320122
  	],
  	[
  		11.158431718757871,
  		-16.349403078425958,
  		-0.2038449327372467
  	],
  	[
  		11.16396348792454,
  		-16.34794442244834,
  		-0.2044252827932163
  	],
  	[
  		11.16671786138928,
  		-16.34612970286046,
  		-0.2068434863760829
  	],
  	[
  		11.16757423431994,
  		-16.34353063429944,
  		-0.20660019810635802
  	],
  	[
  		11.17102058824752,
  		-16.34120300410342,
  		-0.204211683809708
  	],
  	[
  		11.176628122003049,
  		-16.33968657065221,
  		-0.20426875648763612
  	],
  	[
  		11.17989772452711,
  		-16.337986952212972,
  		-0.2067175898763538
  	],
  	[
  		11.18073555006729,
  		-16.3354548320813,
  		-0.20700424549174132
  	],
  	[
  		11.18365673671492,
  		-16.33301313285791,
  		-0.20463952054806211
  	],
  	[
  		11.18922724021984,
  		-16.33141393460089,
  		-0.20417153845231192
  	],
  	[
  		11.193009902697838,
  		-16.32981326839816,
  		-0.2065374629962886
  	],
  	[
  		11.19394297012873,
  		-16.32737133268451,
  		-0.20734155589656533
  	],
  	[
  		11.19635287836301,
  		-16.32483454389384,
  		-0.20511600187318343
  	],
  	[
  		11.20177478627097,
  		-16.32313133156108,
  		-0.2041463036373692
  	],
  	[
  		11.206043095221261,
  		-16.32160843655315,
  		-0.20631946105055593
  	],
  	[
  		11.20718073130254,
  		-16.31927539179389,
  		-0.20760276958344914
  	],
  	[
  		11.20911820864402,
  		-16.31666701957462,
  		-0.2056249073725364
  	],
  	[
  		11.214286274036409,
  		-16.31484305367481,
  		-0.2041994573698844
  	],
  	[
  		11.218991362194119,
  		-16.31337317158966,
  		-0.2060781550346431
  	],
  	[
  		11.2204315010504,
  		-16.31116222350478,
  		-0.2077807197897518
  	],
  	[
  		11.221958265689679,
  		-16.308509000215942,
  		-0.20614610680385612
  	],
  	[
  		11.226779164665949,
  		-16.30655347711041,
  		-0.204334931694619
  	],
  	[
  		11.23185032779256,
  		-16.305109070869538,
  		-0.20583206246671248
  	],
  	[
  		11.23367759242323,
  		-16.303027779199518,
  		-0.2078741874768166
  	],
  	[
  		11.23487473167488,
  		-16.300358704015203,
  		-0.20666401585784291
  	],
  	[
  		11.2392708415216,
  		-16.29826655730547,
  		-0.2045537331171231
  	],
  	[
  		11.244621447325049,
  		-16.29681911892765,
  		-0.20560044198976601
  	],
  	[
  		11.24689989530906,
  		-16.29486831178447,
  		-0.20788632655606432
  	],
  	[
  		11.247865111545469,
  		-16.292212874734858,
  		-0.2071589450866346
  	],
  	[
  		11.251779572519261,
  		-16.28998583202915,
  		-0.20485239499508193
  	],
  	[
  		11.25730837872734,
  		-16.28850636900388,
  		-0.2053995398416087
  	],
  	[
  		11.26008283193965,
  		-16.28668107488711,
  		-0.20782196206050899
  	],
  	[
  		11.260923335140468,
  		-16.28406778988043,
  		-0.2076135421171372
  	],
  	[
  		11.264322226861761,
  		-16.28171373788311,
  		-0.20522173519260634
  	],
  	[
  		11.269919701511359,
  		-16.28017487642608,
  		-0.2052450711541654
  	],
  	[
  		11.27320951799599,
  		-16.278463752713577,
  		-0.2076911070613218
  	],
  	[
  		11.274039129690909,
  		-16.2759190961961,
  		-0.2080125709951915
  	],
  	[
  		11.276912542176989,
  		-16.27345202627696,
  		-0.20565257099339804
  	],
  	[
  		11.28246565762507,
  		-16.27182885590222,
  		-0.205151237155648
  	],
  	[
  		11.286266971936861,
  		-16.27021535135592,
  		-0.20750713714401134
  	],
  	[
  		11.28719914561479,
  		-16.26776215463249,
  		-0.2083435656862855
  	],
  	[
  		11.2895632357894,
  		-16.26520145062664,
  		-0.20613008238643632
  	],
  	[
  		11.294960605241592,
  		-16.26347296361735,
  		-0.2051288787027187
  	],
  	[
  		11.29924537640971,
  		-16.26193581464699,
  		-0.20728516928821308
  	],
  	[
  		11.30038847748831,
  		-16.25959248519759,
  		-0.2085977112821741
  	],
  	[
  		11.30228377180072,
  		-16.25696189984989,
  		-0.2066383754401273
  	],
  	[
  		11.30742121393886,
  		-16.25511195747039,
  		-0.20518592076647832
  	],
  	[
  		11.31213788459185,
  		-16.253625953960473,
  		-0.207041916107677
  	],
  	[
  		11.31358983906779,
  		-16.251405428482638,
  		-0.2087686691701942
  	],
  	[
  		11.31507851223948,
  		-16.24873181495409,
  		-0.20715918589670612
  	],
  	[
  		11.31986317804011,
  		-16.24674964931986,
  		-0.20532499372456592
  	],
  	[
  		11.32494114352474,
  		-16.24528747764026,
  		-0.2067950245484037
  	],
  	[
  		11.326783943160258,
  		-16.24319657550551,
  		-0.2088551014012912
  	],
  	[
  		11.32794957213454,
  		-16.24050908561584,
  		-0.2076737992557748
  	],
  	[
  		11.33230524117086,
  		-16.23839034756737,
  		-0.20554743970178102
  	],
  	[
  		11.33765609452647,
  		-16.23692315621118,
  		-0.20656297819892153
  	],
  	[
  		11.339954268688789,
  		-16.23496277523803,
  		-0.20886034129540743
  	],
  	[
  		11.34089387052612,
  		-16.23229075237648,
  		-0.2081656034854778
  	],
  	[
  		11.344765339293621,
  		-16.23003742516148,
  		-0.20584913705305752
  	],
  	[
  		11.350287846279521,
  		-16.22853666287286,
  		-0.2063642178023941
  	],
  	[
  		11.35308283666383,
  		-16.22670091266665,
  		-0.20879035298730822
  	],
  	[
  		11.35390550517458,
  		-16.22407293676799,
  		-0.2086158357670506
  	],
  	[
  		11.357259391517049,
  		-16.22169321803564,
  		-0.20622165143162452
  	],
  	[
  		11.36284349366976,
  		-16.22013134399684,
  		-0.20621163915329
  	],
  	[
  		11.366154511207501,
  		-16.21840892697536,
  		-0.20865418417150253
  	],
  	[
  		11.36697309791245,
  		-16.21585104658501,
  		-0.20900924598539228
  	],
  	[
  		11.369802347139439,
  		-16.21335948604137,
  		-0.20665392044837821
  	],
  	[
  		11.375335084429562,
  		-16.21171201740131,
  		-0.2061209364005154
  	],
  	[
  		11.37915635915111,
  		-16.21008597049136,
  		-0.20846617198483042
  	],
  	[
  		11.380084946280611,
  		-16.20762102095106,
  		-0.2093349356403266
  	],
  	[
  		11.38240615873892,
  		-16.20503712608203,
  		-0.2071333563279575
  	],
  	[
  		11.38777650121439,
  		-16.2032832577601,
  		-0.20610309337207242
  	],
  	[
  		11.39207805220301,
  		-16.20173195952544,
  		-0.2082420389421742
  	],
  	[
  		11.39322414437749,
  		-16.19937784881592,
  		-0.20958339454603914
  	],
  	[
  		11.395079519224709,
  		-16.196725582739,
  		-0.20764207588483982
  	],
  	[
  		11.400183726104661,
  		-16.1948493948773,
  		-0.20616403130670263
  	],
  	[
  		11.40491358904634,
  		-16.19334765466763,
  		-0.20799677292914992
  	],
  	[
  		11.40637413116947,
  		-16.191116968727812,
  		-0.20974784320933304
  	],
  	[
  		11.40782813233034,
  		-16.18842357354624,
  		-0.208161651800244
  	],
  	[
  		11.412574348113129,
  		-16.18641486399085,
  		-0.2063078504713102
  	],
  	[
  		11.41766025026241,
  		-16.18493511827006,
  		-0.2077495497298094
  	],
  	[
  		11.419517043733569,
  		-16.18283458188488,
  		-0.2098290477797795
  	],
  	[
  		11.420652703399941,
  		-16.18012900472103,
  		-0.2086757095005435
  	],
  	[
  		11.42496603107749,
  		-16.177983657297588,
  		-0.20653530304253873
  	],
  	[
  		11.43031838545282,
  		-16.17649706404301,
  		-0.20751936801530171
  	],
  	[
  		11.4326333685397,
  		-16.17452669843654,
  		-0.2098290283942156
  	],
  	[
  		11.43355010122771,
  		-16.17183851667176,
  		-0.2091648014327857
  	],
  	[
  		11.43737597622923,
  		-16.16955887635856,
  		-0.20684145374019153
  	],
  	[
  		11.442893334139722,
  		-16.16803679247203,
  		-0.2073215843218431
  	],
  	[
  		11.44570821568375,
  		-16.16619090191208,
  		-0.2097538639719729
  	],
  	[
  		11.44651443705277,
  		-16.16354838211443,
  		-0.2096112152418781
  	],
  	[
  		11.44982261105445,
  		-16.1611433367705,
  		-0.20721733034325301
  	],
  	[
  		11.455394049371039,
  		-16.15955854492684,
  		-0.2071726011277693
  	],
  	[
  		11.45872535930403,
  		-16.15782503578678,
  		-0.20961362498989763
  	],
  	[
  		11.459535183785569,
  		-16.15525438867808,
  		-0.2100010744780695
  	],
  	[
  		11.462318085411521,
  		-16.15273843373976,
  		-0.20765364701355804
  	],
  	[
  		11.46783070970093,
  		-16.15106644622183,
  		-0.20708603212842341
  	],
  	[
  		11.47167133428546,
  		-16.14942817265712,
  		-0.2094228901598137
  	],
  	[
  		11.47259745737635,
  		-16.14695153099273,
  		-0.21032167504304602
  	],
  	[
  		11.47487511419953,
  		-16.14434481684005,
  		-0.2081348178968661
  	],
  	[
  		11.48021798724737,
  		-16.14256517434181,
  		-0.2070723717090564
  	],
  	[
  		11.48453701975799,
  		-16.14100023603324,
  		-0.20919554354871753
  	],
  	[
  		11.48568782848587,
  		-16.13863564449332,
  		-0.2105641582225932
  	],
  	[
  		11.487503115591839,
  		-16.13596226754884,
  		-0.20864426624691543
  	],
  	[
  		11.49257372193031,
  		-16.13405954142409,
  		-0.2071380992246164
  	],
  	[
  		11.49731700574687,
  		-16.13254247698404,
  		-0.2089491914516534
  	],
  	[
  		11.498787754485061,
  		-16.13030191923532,
  		-0.2107230756112898
  	],
  	[
  		11.500206223913409,
  		-16.12758922654237,
  		-0.2091640633726467
  	],
  	[
  		11.504912792289861,
  		-16.125553373544392,
  		-0.20728721320109722
  	],
  	[
  		11.510006886216,
  		-16.12405644675017,
  		-0.2087020072505104
  	],
  	[
  		11.51187812477753,
  		-16.12194612571363,
  		-0.2107981080253504
  	],
  	[
  		11.512984854921399,
  		-16.11922327994759,
  		-0.2096760106034998
  	],
  	[
  		11.517254090473589,
  		-16.1170507263016,
  		-0.2075190268574063
  	],
  	[
  		11.52260903277218,
  		-16.11554512803865,
  		-0.208471767479685
  	],
  	[
  		11.524942311030399,
  		-16.11356498053794,
  		-0.2107918289412655
  	],
  	[
  		11.52583672744498,
  		-16.11086138868898,
  		-0.21016167472372072
  	],
  	[
  		11.529616180780739,
  		-16.10855504194191,
  		-0.20782893146827922
  	],
  	[
  		11.53512882383559,
  		-16.10701215136786,
  		-0.2082761882913332
  	],
  	[
  		11.53796328945715,
  		-16.10515568513236,
  		-0.21071098481040382
  	],
  	[
  		11.53875487460406,
  		-16.1024996810798,
  		-0.21060403483335233
  	],
  	[
  		11.54201413553733,
  		-16.100068482068558,
  		-0.2082085857981722
  	],
  	[
  		11.547574045578738,
  		-16.09846117557327,
  		-0.20812932748715982
  	],
  	[
  		11.55092499450144,
  		-16.096716204193978,
  		-0.21056627005871792
  	],
  	[
  		11.551727314629321,
  		-16.09413342838993,
  		-0.2109878001427275
  	],
  	[
  		11.5544627685415,
  		-16.091592743170892,
  		-0.2086466617620357
  	],
  	[
  		11.55995619113666,
  		-16.08989675493341,
  		-0.2080458411187665
  	],
  	[
  		11.563815370283459,
  		-16.08824568667518,
  		-0.2103706145290513
  	],
  	[
  		11.56474180301008,
  		-16.08575845067582,
  		-0.21130208729848274
  	],
  	[
  		11.566973231678158,
  		-16.08312828512836,
  		-0.209128728207881
  	],
  	[
  		11.572290550169,
  		-16.08132360451295,
  		-0.20803554782639488
  	],
  	[
  		11.576624459081899,
  		-16.079744287228237,
  		-0.2101409148147592
  	],
  	[
  		11.577781713456401,
  		-16.07736981196343,
  		-0.2115375228155751
  	],
  	[
  		11.57955481920466,
  		-16.07467486504424,
  		-0.2096382080486893
  	],
  	[
  		11.58459275444496,
  		-16.07274608492024,
  		-0.2081051303841417
  	],
  	[
  		11.58934711513346,
  		-16.07121297779209,
  		-0.20989231034386702
  	],
  	[
  		11.59083002925783,
  		-16.068963128692012,
  		-0.2116893003347908
  	],
  	[
  		11.59221131539055,
  		-16.0662306821665,
  		-0.21015596395645303
  	],
  	[
  		11.596880455386831,
  		-16.06416849866789,
  		-0.20825763877156703
  	],
  	[
  		11.60197992011903,
  		-16.06265369755425,
  		-0.2096442129890065
  	],
  	[
  		11.60386793670887,
  		-16.0605342498684,
  		-0.2117571959114009
  	],
  	[
  		11.60494337071132,
  		-16.057793591175752,
  		-0.2106653737840084
  	],
  	[
  		11.609170891694509,
  		-16.05559464782614,
  		-0.20849316857151773
  	],
  	[
  		11.614524637781908,
  		-16.05406935511967,
  		-0.2094148354933413
  	],
  	[
  		11.61687730153482,
  		-16.05207967249681,
  		-0.21174458920311443
  	],
  	[
  		11.6177475571169,
  		-16.04936021591634,
  		-0.21114737918579318
  	],
  	[
  		11.621482409653161,
  		-16.047027797045438,
  		-0.20880617731926582
  	],
  	[
  		11.626987426314642,
  		-16.04546352590978,
  		-0.20922024356987992
  	],
  	[
  		11.629842886521871,
  		-16.04359693750522,
  		-0.21165782597778204
  	],
  	[
  		11.63061753912941,
  		-16.04092676534734,
  		-0.21158452073180212
  	],
  	[
  		11.633831902235181,
  		-16.03847048371708,
  		-0.2091881201499385
  	],
  	[
  		11.63937629212072,
  		-16.03684013306126,
  		-0.209076049876282
  	],
  	[
  		11.64274841109502,
  		-16.03508401340912,
  		-0.21150797719013573
  	],
  	[
  		11.643541025125291,
  		-16.03248874644622,
  		-0.21196371957063842
  	],
  	[
  		11.64623127631113,
  		-16.0299238670095,
  		-0.20962843692061509
  	],
  	[
  		11.65170271788704,
  		-16.02820361200735,
  		-0.2089961020763194
  	],
  	[
  		11.65558074244376,
  		-16.02653998655077,
  		-0.2113092571698721
  	],
  	[
  		11.65650472140296,
  		-16.02404143252056,
  		-0.2122718198336045
  	],
  	[
  		11.65869369983585,
  		-16.021388708187608,
  		-0.21011166163655762
  	],
  	[
  		11.66398185842117,
  		-16.019558549973063,
  		-0.208989487015827
  	],
  	[
  		11.6683325486236,
  		-16.01796523704531,
  		-0.211076003384391
  	],
  	[
  		11.66949379971189,
  		-16.015580549748062,
  		-0.2125013622124702
  	],
  	[
  		11.67122770524033,
  		-16.01286453334331,
  		-0.21062075575894001
  	],
  	[
  		11.676231254173251,
  		-16.01090983144287,
  		-0.2090636603619443
  	],
  	[
  		11.680997070678421,
  		-16.00936083192837,
  		-0.2108266219829793
  	],
  	[
  		11.68248972423463,
  		-16.00710134791355,
  		-0.21264732699033823
  	],
  	[
  		11.68383641257493,
  		-16.004349706184758,
  		-0.21113884150024478
  	],
  	[
  		11.68846551298059,
  		-16.002261040035798,
  		-0.20922130352485732
  	],
  	[
  		11.693571485704119,
  		-16.00072858265561,
  		-0.2105786591186004
  	],
  	[
  		11.69547351758439,
  		-15.99859966614489,
  		-0.2127096692044238
  	],
  	[
  		11.696520362246321,
  		-15.99584160359407,
  		-0.2116460131577204
  	],
  	[
  		11.70070468966619,
  		-15.993616393401751,
  		-0.2094610574698133
  	],
  	[
  		11.70605851497223,
  		-15.992071534975521,
  		-0.2103497938349027
  	],
  	[
  		11.708429114153368,
  		-15.99007235841693,
  		-0.21269107729635783
  	],
  	[
  		11.70927723479424,
  		-15.987337379645039,
  		-0.21212528740513342
  	],
  	[
  		11.71296647568456,
  		-15.98497918436265,
  		-0.2097786042608374
  	],
  	[
  		11.71846438592337,
  		-15.98339356138429,
  		-0.21015812260247044
  	],
  	[
  		11.721339387137759,
  		-15.98151687801906,
  		-0.21260023262239153
  	],
  	[
  		11.72209865198711,
  		-15.97883286239236,
  		-0.2125596764821625
  	],
  	[
  		11.7252660859187,
  		-15.97635152195072,
  		-0.21016496349635883
  	],
  	[
  		11.730796267354451,
  		-15.97469815268102,
  		-0.210017448004304
  	],
  	[
  		11.734188127145838,
  		-15.972930953943841,
  		-0.21244637333375122
  	],
  	[
  		11.73497281361755,
  		-15.970323334885869,
  		-0.21293370646396742
  	],
  	[
  		11.737617353247549,
  		-15.967734739037509,
  		-0.2106077712143904
  	],
  	[
  		11.74306702092283,
  		-15.965989953436651,
  		-0.20994094771261784
  	],
  	[
  		11.74696453550387,
  		-15.964314201722269,
  		-0.21224381977279272
  	],
  	[
  		11.7478872802283,
  		-15.961804624963849,
  		-0.213236870922228
  	],
  	[
  		11.750032733411919,
  		-15.959129629804421,
  		-0.21109293561978731
  	],
  	[
  		11.75529239767745,
  		-15.95727395011155,
  		-0.20993965216480504
  	],
  	[
  		11.759658975654702,
  		-15.95566684417977,
  		-0.21200944913800732
  	],
  	[
  		11.760825724696499,
  		-15.95327203087396,
  		-0.213461007346315
  	],
  	[
  		11.76251962287025,
  		-15.950535502632901,
  		-0.21160365591848393
  	],
  	[
  		11.76748753361739,
  		-15.94855417311704,
  		-0.2100186684589076
  	],
  	[
  		11.77226608531107,
  		-15.946989825313509,
  		-0.21175856543334248
  	],
  	[
  		11.77376919859157,
  		-15.94472067333745,
  		-0.21360082870285782
  	],
  	[
  		11.77508156124122,
  		-15.94195035919546,
  		-0.2121197971651314
  	],
  	[
  		11.779670123606609,
  		-15.93983489566182,
  		-0.21018081348115158
  	],
  	[
  		11.784783090817822,
  		-15.938285158322909,
  		-0.21151015380091961
  	],
  	[
  		11.78670083725736,
  		-15.93614689906719,
  		-0.21365667432216473
  	],
  	[
  		11.78771938718186,
  		-15.93337219964839,
  		-0.2126255432217902
  	],
  	[
  		11.79185864121999,
  		-15.93112006038069,
  		-0.2104252853174684
  	],
  	[
  		11.797213587743041,
  		-15.929556226296778,
  		-0.211282974107949
  	],
  	[
  		11.799601919759631,
  		-15.92754722372093,
  		-0.2136329921552135
  	],
  	[
  		11.80042905105071,
  		-15.92479744394975,
  		-0.2131013423548411
  	],
  	[
  		11.80407038492562,
  		-15.92241276293397,
  		-0.21074696896321582
  	],
  	[
  		11.80956205685982,
  		-15.920806167433529,
  		-0.21109259020674093
  	],
  	[
  		11.81245679448727,
  		-15.91891908818141,
  		-0.213536081980517
  	],
  	[
  		11.81320240717455,
  		-15.916222000310361,
  		-0.213530461912619
  	],
  	[
  		11.8163213708985,
  		-15.91371510364647,
  		-0.21113560658528552
  	],
  	[
  		11.82183815627831,
  		-15.91203920045782,
  		-0.2109541900694214
  	],
  	[
  		11.82524955905058,
  		-15.910260596190291,
  		-0.2133774367406904
  	],
  	[
  		11.82602831321194,
  		-15.9076415125302,
  		-0.21389903141348043
  	],
  	[
  		11.828624823039839,
  		-15.90502854526602,
  		-0.2115807528125142
  	],
  	[
  		11.834053859740301,
  		-15.90325982141249,
  		-0.21088128082753382
  	],
  	[
  		11.83796851465625,
  		-15.90157117472043,
  		-0.21317145611477942
  	],
  	[
  		11.838892498476561,
  		-15.899051278612271,
  		-0.21419560572186952
  	],
  	[
  		11.84099234020052,
  		-15.896353458076252,
  		-0.21206660900977933
  	],
  	[
  		11.846224206514439,
  		-15.894472592963488,
  		-0.21088295869825072
  	],
  	[
  		11.8506052805079,
  		-15.89285113732519,
  		-0.21293366293636443
  	],
  	[
  		11.851779214502912,
  		-15.89044679537746,
  		-0.21441254164489473
  	],
  	[
  		11.85343196259634,
  		-15.88768925918433,
  		-0.2125761264526556
  	],
  	[
  		11.85836633313269,
  		-15.88568219648874,
  		-0.2109658558632945
  	],
  	[
  		11.86315407162409,
  		-15.88410157366016,
  		-0.21268109534151403
  	],
  	[
  		11.86467047375356,
  		-15.88182349678161,
  		-0.2145452915218923
  	],
  	[
  		11.86594620517794,
  		-15.87903402119248,
  		-0.2130913135996358
  	],
  	[
  		11.87049606896132,
  		-15.876892316506929,
  		-0.21113148035713392
  	],
  	[
  		11.875612902971211,
  		-15.87532462616747,
  		-0.2124323899103426
  	],
  	[
  		11.877546938007619,
  		-15.873177203103278,
  		-0.21459427276719292
  	],
  	[
  		11.87853590873009,
  		-15.87038534768324,
  		-0.2135934252960976
  	],
  	[
  		11.88263265309967,
  		-15.868107140403449,
  		-0.21137952987989622
  	],
  	[
  		11.88798474141137,
  		-15.86652338485097,
  		-0.2122051355834088
  	],
  	[
  		11.890392991395851,
  		-15.86450511194821,
  		-0.2145639096591571
  	],
  	[
  		11.891196803224751,
  		-15.861739975936791,
  		-0.2140655431182159
  	],
  	[
  		11.894793879842421,
  		-15.8593297395854,
  		-0.2117039248616137
  	],
  	[
  		11.900275850302279,
  		-15.85770168257783,
  		-0.21201709834867022
  	],
  	[
  		11.90319084154356,
  		-15.8558043399926,
  		-0.2144615447849942
  	],
  	[
  		11.903920826186209,
  		-15.853093710893429,
  		-0.21449004691520002
  	],
  	[
  		11.906994095760218,
  		-15.85056200326012,
  		-0.21209550494982554
  	],
  	[
  		11.91249402943648,
  		-15.84886300392368,
  		-0.21188106532991832
  	],
  	[
  		11.915925538422181,
  		-15.847073125861819,
  		-0.21429811171424962
  	],
  	[
  		11.916695521973619,
  		-15.84444188163505,
  		-0.2148528373000378
  	],
  	[
  		11.91924776787789,
  		-15.841805407693709,
  		-0.21254193381529732
  	],
  	[
  		11.92465317276729,
  		-15.84001239605927,
  		-0.21181147218034632
  	],
  	[
  		11.92858631749705,
  		-15.83831115029355,
  		-0.21408833223552903
  	],
  	[
  		11.929508741279939,
  		-15.83578043630105,
  		-0.21514379445647971
  	],
  	[
  		11.931566394046971,
  		-15.83306053275579,
  		-0.213029055587298
  	],
  	[
  		11.936768211550671,
  		-15.8311544613285,
  		-0.21181784145612143
  	],
  	[
  		11.94116392369958,
  		-15.82951867140068,
  		-0.2138487007439236
  	],
  	[
  		11.942342561485958,
  		-15.8271043700892,
  		-0.21535506592364242
  	],
  	[
  		11.943956309566751,
  		-15.8243262921874,
  		-0.21353889089448763
  	],
  	[
  		11.94885477475826,
  		-15.82229329112491,
  		-0.2119049352544416
  	],
  	[
  		11.95365302683027,
  		-15.820696694305209,
  		-0.21359491144207532
  	],
  	[
  		11.95517929769536,
  		-15.818409087333201,
  		-0.21548141179195351
  	],
  	[
  		11.95642181834854,
  		-15.815601024596939,
  		-0.21405249932328874
  	],
  	[
  		11.96093103975505,
  		-15.81343322956102,
  		-0.21207526975700974
  	],
  	[
  		11.966052918544442,
  		-15.81184771356394,
  		-0.21334608394873833
  	],
  	[
  		11.9680019586956,
  		-15.80969117330908,
  		-0.21552499724716512
  	],
  	[
  		11.96896266225914,
  		-15.806882405396589,
  		-0.2145533700153841
  	],
  	[
  		11.97301550708386,
  		-15.804578244436971,
  		-0.21232809991458834
  	],
  	[
  		11.97836579851419,
  		-15.8029748524785,
  		-0.2131212458618791
  	],
  	[
  		11.98079125782183,
  		-15.80094694271745,
  		-0.21548968376459401
  	],
  	[
  		11.98157401946213,
  		-15.7981667950993,
  		-0.2150227110142752
  	],
  	[
  		11.985124251369522,
  		-15.795730995139522,
  		-0.21265707699818043
  	],
  	[
  		11.99059769719041,
  		-15.79408144594211,
  		-0.2129349035072123
  	],
  	[
  		11.99353227495447,
  		-15.79217410959183,
  		-0.2153825350203515
  	],
  	[
  		11.99424785854631,
  		-15.78945001492121,
  		-0.2154429368081368
  	],
  	[
  		11.99727481904042,
  		-15.7868938692664,
  		-0.21305153075412664
  	],
  	[
  		12.00275870575715,
  		-15.785171848426799,
  		-0.21280247304074562
  	],
  	[
  		12.0062098267406,
  		-15.78337094227782,
  		-0.21521504241555559
  	],
  	[
  		12.006973053216281,
  		-15.78072791864824,
  		-0.21580160173932939
  	],
  	[
  		12.00947904494555,
  		-15.77806809294859,
  		-0.213501451928146
  	],
  	[
  		12.01486099436072,
  		-15.77625059151848,
  		-0.21273735004558253
  	],
  	[
  		12.018812064427811,
  		-15.77453706218744,
  		-0.21500317848692752
  	],
  	[
  		12.01973394443296,
  		-15.77199554723049,
  		-0.21608754685925702
  	],
  	[
  		12.02174847687978,
  		-15.76925391944723,
  		-0.2139902209771449
  	],
  	[
  		12.02691959618826,
  		-15.767322178914752,
  		-0.2127481714231171
  	],
  	[
  		12.03133081303178,
  		-15.76567260633956,
  		-0.21476084840340182
  	],
  	[
  		12.032515694273771,
  		-15.763248515016539,
  		-0.2162925261202978
  	],
  	[
  		12.03409058004885,
  		-15.760450512817709,
  		-0.2144998744436947
  	],
  	[
  		12.03895245240306,
  		-15.75839121779598,
  		-0.21283976562189988
  	],
  	[
  		12.04376176263419,
  		-15.75677911137735,
  		-0.21450597031583574
  	],
  	[
  		12.045299477694329,
  		-15.754482232567671,
  		-0.21641313033467122
  	],
  	[
  		12.04650817611662,
  		-15.75165610858064,
  		-0.2150130782855798
  	],
  	[
  		12.05097529932101,
  		-15.7494616132582,
  		-0.21301533552769134
  	],
  	[
  		12.056102510270941,
  		-15.74785873124972,
  		-0.2142578925472589
  	],
  	[
  		12.058066592706261,
  		-15.7456928144354,
  		-0.2164508625339784
  	],
  	[
  		12.0590004870573,
  		-15.742868028773309,
  		-0.21551159798305483
  	],
  	[
  		12.06300716338188,
  		-15.740537214275141,
  		-0.2132724676588115
  	],
  	[
  		12.06835679548149,
  		-15.73891458777966,
  		-0.2140332051098779
  	],
  	[
  		12.07080055178493,
  		-15.73687715549347,
  		-0.21640934363026432
  	],
  	[
  		12.07156325772457,
  		-15.734082753155949,
  		-0.2159766341681124
  	],
  	[
  		12.07506584939729,
  		-15.73162102488662,
  		-0.21360457627749918
  	],
  	[
  		12.0805310559095,
  		-15.72995046702479,
  		-0.21384906142761523
  	],
  	[
  		12.08348474493855,
  		-15.72803272364572,
  		-0.2162965810795836
  	],
  	[
  		12.08418809554253,
  		-15.72529627751485,
  		-0.21639246261341494
  	],
  	[
  		12.08716561128331,
  		-15.72271491793795,
  		-0.21400252213722182
  	],
  	[
  		12.09263446953965,
  		-15.7209702949062,
  		-0.21371923210302649
  	],
  	[
  		12.09610398002628,
  		-15.7191579355258,
  		-0.21612513947340922
  	],
  	[
  		12.096861956940621,
  		-15.716503790688481,
  		-0.216744859721512
  	],
  	[
  		12.09932059384105,
  		-15.71382028830056,
  		-0.21445383534716092
  	],
  	[
  		12.10467983915728,
  		-15.71197876364238,
  		-0.21365726915870661
  	],
  	[
  		12.10864766270237,
  		-15.710252344646909,
  		-0.2159085271230477
  	],
  	[
  		12.10957168479744,
  		-15.707701071316931,
  		-0.21702406520764914
  	],
  	[
  		12.11154090058876,
  		-15.704937184468111,
  		-0.2149427487254196
  	],
  	[
  		12.116683281343299,
  		-15.70298056168558,
  		-0.21367146707690982
  	],
  	[
  		12.121107087252561,
  		-15.701316449694719,
  		-0.2156641246750577
  	],
  	[
  		12.12230002171125,
  		-15.698883225396042,
  		-0.21722199037780332
  	],
  	[
  		12.12383397788999,
  		-15.69606489020795,
  		-0.2154521778624685
  	],
  	[
  		12.12866054466093,
  		-15.69397987609485,
  		-0.2137670510069222
  	],
  	[
  		12.13347803726403,
  		-15.69235150435301,
  		-0.2154076140549672
  	],
  	[
  		12.13502895065994,
  		-15.69004587613006,
  		-0.2173354428742171
  	],
  	[
  		12.136202153167378,
  		-15.68720126613075,
  		-0.2159628233334714
  	],
  	[
  		12.14062955158224,
  		-15.68498091011778,
  		-0.2139458998811478
  	],
  	[
  		12.14575903797828,
  		-15.68335993706744,
  		-0.21515883599210142
  	],
  	[
  		12.14774039791413,
  		-15.68118530068919,
  		-0.21736608949092662
  	],
  	[
  		12.14864495085254,
  		-15.67834395189956,
  		-0.2164582631406934
  	],
  	[
  		12.15260838042699,
  		-15.67598744174532,
  		-0.2142065732949781
  	],
  	[
  		12.157953482564182,
  		-15.67434496546898,
  		-0.21493562152401782
  	],
  	[
  		12.160416624288079,
  		-15.672298248103429,
  		-0.21731847570549162
  	],
  	[
  		12.1611572273826,
  		-15.66948920727593,
  		-0.21691949954185819
  	],
  	[
  		12.16461401879836,
  		-15.6670021800167,
  		-0.21454164337739742
  	],
  	[
  		12.17006826465807,
  		-15.66531016576278,
  		-0.2147528560057991
  	],
  	[
  		12.17304216862264,
  		-15.663382373474299,
  		-0.2172001042079927
  	],
  	[
  		12.17373068030205,
  		-15.660632880899701,
  		-0.2173295652022238
  	],
  	[
  		12.176662704781268,
  		-15.65802737596476,
  		-0.21494151130033934
  	],
  	[
  		12.182112764187789,
  		-15.6562597246333,
  		-0.21462585283475344
  	],
  	[
  		12.185602292361459,
  		-15.654436236964791,
  		-0.2170238493430071
  	],
  	[
  		12.186352657722399,
  		-15.65177065851655,
  		-0.21767720817720504
  	],
  	[
  		12.188766069751049,
  		-15.64906401842894,
  		-0.2153947848650601
  	],
  	[
  		12.194100298355,
  		-15.64719839964852,
  		-0.21456784471257373
  	],
  	[
  		12.19808512001745,
  		-15.645459324036699,
  		-0.2168047783027828
  	],
  	[
  		12.199008621298411,
  		-15.64289767408384,
  		-0.2179502050271201
  	],
  	[
  		12.20093567546982,
  		-15.64011231994148,
  		-0.2158845502390066
  	],
  	[
  		12.206045927558371,
  		-15.63813046548801,
  		-0.21458578420048832
  	],
  	[
  		12.21048417486885,
  		-15.63645220751265,
  		-0.21655724641443042
  	],
  	[
  		12.211682620328379,
  		-15.63400953166149,
  		-0.21814197049014838
  	],
  	[
  		12.213178414147809,
  		-15.631171340912069,
  		-0.2163929792178196
  	],
  	[
  		12.217967903224629,
  		-15.629060787967411,
  		-0.2146858423868594
  	],
  	[
  		12.222794349362388,
  		-15.62741640755515,
  		-0.2163002868936681
  	],
  	[
  		12.224356310446648,
  		-15.62510183401873,
  		-0.2182497027024648
  	],
  	[
  		12.22549634950699,
  		-15.62223927522507,
  		-0.216903606047971
  	],
  	[
  		12.229881504982082,
  		-15.61999299461272,
  		-0.2148699165805799
  	],
  	[
  		12.235014392967209,
  		-15.618354199386939,
  		-0.2160522743957145
  	],
  	[
  		12.237010535743009,
  		-15.616170617277689,
  		-0.21827502710005942
  	],
  	[
  		12.2378881545463,
  		-15.61331309301571,
  		-0.2173965138211143
  	],
  	[
  		12.24180643775263,
  		-15.610930956900571,
  		-0.21513467342718282
  	],
  	[
  		12.247148274217869,
  		-15.60926875273614,
  		-0.21582978093059102
  	],
  	[
  		12.2496295305466,
  		-15.60721293031797,
  		-0.21822154677155048
  	],
  	[
  		12.25035006211665,
  		-15.60438957784122,
  		-0.21785431461348548
  	],
  	[
  		12.253760144799259,
  		-15.60187764797403,
  		-0.2154738574097559
  	],
  	[
  		12.259203762645981,
  		-15.60016416796505,
  		-0.2156500854475974
  	],
  	[
  		12.262197100915271,
  		-15.59822660518623,
  		-0.21809917505863718
  	],
  	[
  		12.26287235473459,
  		-15.59546446053212,
  		-0.21826141467316293
  	],
  	[
  		12.26575692851641,
  		-15.592834891973391,
  		-0.21587784457117373
  	],
  	[
  		12.27118905994093,
  		-15.59104417864309,
  		-0.21552707648083091
  	],
  	[
  		12.274697371496359,
  		-15.589209759220338,
  		-0.21791939875000121
  	],
  	[
  		12.275441778475919,
  		-15.58653289722166,
  		-0.21860369438612023
  	],
  	[
  		12.277809536541252,
  		-15.583803662955471,
  		-0.2163333674976849
  	],
  	[
  		12.28311825606708,
  		-15.58191352506141,
  		-0.21547264636390173
  	],
  	[
  		12.28712119467959,
  		-15.58016239041069,
  		-0.2176966546001976
  	],
  	[
  		12.288045334671109,
  		-15.577590695454619,
  		-0.21887136026079151
  	],
  	[
  		12.2899297216096,
  		-15.574784324276889,
  		-0.2168243068121521
  	],
  	[
  		12.295008192006549,
  		-15.572777163892699,
  		-0.2154958573087512
  	],
  	[
  		12.29946037578495,
  		-15.571085077416711,
  		-0.21744808171458851
  	],
  	[
  		12.300665989898441,
  		-15.56863317443285,
  		-0.21905749486603093
  	],
  	[
  		12.3021229832508,
  		-15.565775781804561,
  		-0.21733393640152554
  	],
  	[
  		12.30687384043718,
  		-15.56363897113001,
  		-0.2156009326395517
  	],
  	[
  		12.31171035506584,
  		-15.56197911821437,
  		-0.21719024237378828
  	],
  	[
  		12.31328383901283,
  		-15.55965557622397,
  		-0.21915917669769802
  	],
  	[
  		12.31439123326987,
  		-15.556775706911981,
  		-0.2178422836393557
  	],
  	[
  		12.31873330794988,
  		-15.554503150937691,
  		-0.21578950993264212
  	],
  	[
  		12.32387028674774,
  		-15.552846946398871,
  		-0.2169420769594353
  	],
  	[
  		12.32588283328437,
  		-15.55065458225815,
  		-0.21917784687431321
  	],
  	[
  		12.32673422571495,
  		-15.547781788009999,
  		-0.21833298082468588
  	],
  	[
  		12.3306056884528,
  		-15.54537347180962,
  		-0.2160585331038194
  	],
  	[
  		12.33594536510777,
  		-15.543692171942709,
  		-0.21672144439757043
  	],
  	[
  		12.338444582162891,
  		-15.54162695173773,
  		-0.21911918634968283
  	],
  	[
  		12.33914621614759,
  		-15.53879012791132,
  		-0.21878686899475264
  	],
  	[
  		12.34250703857521,
  		-15.53625259463489,
  		-0.2164017113649467
  	],
  	[
  		12.34794103961693,
  		-15.53451810349866,
  		-0.21654359828056033
  	],
  	[
  		12.350953453763871,
  		-15.53257037601735,
  		-0.21899126013794123
  	],
  	[
  		12.35161733620059,
  		-15.52979641355271,
  		-0.21918833001927351
  	],
  	[
  		12.35445271921571,
  		-15.52714233647442,
  		-0.21680776072468388
  	],
  	[
  		12.359868128177991,
  		-15.5253291269273,
  		-0.2164230791890021
  	],
  	[
  		12.363394958700301,
  		-15.523483443069882,
  		-0.21880680868523672
  	],
  	[
  		12.364135594672149,
  		-15.52079626037754,
  		-0.21952462337958392
  	],
  	[
  		12.366455349295,
  		-15.51804383673107,
  		-0.21726485438821622
  	],
  	[
  		12.37174024734821,
  		-15.516129950789011,
  		-0.2163723299480295
  	],
  	[
  		12.37575858850305,
  		-15.5143659436172,
  		-0.21858097757800699
  	],
  	[
  		12.37668595701193,
  		-15.511784956337571,
  		-0.2197854498874699
  	],
  	[
  		12.37852518252522,
  		-15.508957036787441,
  		-0.2177562331047601
  	],
  	[
  		12.38357276694606,
  		-15.506924968007521,
  		-0.21639870160926772
  	],
  	[
  		12.38803730228744,
  		-15.50521853632402,
  		-0.21832966307614574
  	],
  	[
  		12.38925165367709,
  		-15.50275793825545,
  		-0.2199643456996021
  	],
  	[
  		12.39066868474863,
  		-15.49988090434673,
  		-0.21826408858069782
  	],
  	[
  		12.39538322067268,
  		-15.497718779119229,
  		-0.21650760572486233
  	],
  	[
  		12.40022642594182,
  		-15.49604261918928,
  		-0.2180703630107264
  	],
  	[
  		12.40181445650989,
  		-15.493710875131569,
  		-0.22005884198892378
  	],
  	[
  		12.4028867747343,
  		-15.49081321417518,
  		-0.21877080784355282
  	],
  	[
  		12.40718782880885,
  		-15.488515012894519,
  		-0.21669953690606691
  	],
  	[
  		12.41232573645682,
  		-15.48684082082409,
  		-0.21782245252824128
  	],
  	[
  		12.414355225593741,
  		-15.4846398440683,
  		-0.2200709118647732
  	],
  	[
  		12.415179023931799,
  		-15.48175128383172,
  		-0.21925760708151543
  	],
  	[
  		12.419006036378939,
  		-15.47931760730513,
  		-0.21697207799989449
  	],
  	[
  		12.424339790404659,
  		-15.4776163910811,
  		-0.2176021666476539
  	],
  	[
  		12.42685899831737,
  		-15.475542298806959,
  		-0.2200058079600734
  	],
  	[
  		12.427539580784941,
  		-15.47269145423413,
  		-0.2197072151249096
  	],
  	[
  		12.43085494990925,
  		-15.47012925963573,
  		-0.21731754383230562
  	],
  	[
  		12.43627589833249,
  		-15.46837331909034,
  		-0.2174267506857985
  	],
  	[
  		12.4393082444664,
  		-15.46641565172048,
  		-0.2198726013239489
  	],
  	[
  		12.439958714099259,
  		-15.46362940977241,
  		-0.22010380019568512
  	],
  	[
  		12.442747844649048,
  		-15.4609515553018,
  		-0.2177262894467203
  	],
  	[
  		12.44814300383948,
  		-15.459115357465949,
  		-0.2173091345262948
  	],
  	[
  		12.451688852864379,
  		-15.45725856473453,
  		-0.2196839790404003
  	],
  	[
  		12.452423039407151,
  		-15.454560411966991,
  		-0.22043426557825174
  	],
  	[
  		12.45469850921676,
  		-15.451785610568951,
  		-0.2181844750361989
  	],
  	[
  		12.45995655390175,
  		-15.44984762062111,
  		-0.21726179961247
  	],
  	[
  		12.46399183842036,
  		-15.44807109130564,
  		-0.2194545576009551
  	],
  	[
  		12.46491969377802,
  		-15.445480331057551,
  		-0.2206890855663012
  	],
  	[
  		12.466717507692021,
  		-15.442631575458222,
  		-0.21867634059881969
  	],
  	[
  		12.471732066342021,
  		-15.440574643819328,
  		-0.2172928794016111
  	],
  	[
  		12.47620913105826,
  		-15.43885385826663,
  		-0.21920164260673
  	],
  	[
  		12.477429981558421,
  		-15.43638426035107,
  		-0.220862362343199
  	],
  	[
  		12.47880913693095,
  		-15.433487987884309,
  		-0.2191844445495447
  	],
  	[
  		12.48348523275756,
  		-15.431300414809051,
  		-0.2174063071076796
  	],
  	[
  		12.48833626578179,
  		-15.429608200502589,
  		-0.2189419608615395
  	],
  	[
  		12.48993548653931,
  		-15.427267684144091,
  		-0.22095061927103773
  	],
  	[
  		12.490976199919139,
  		-15.424352775331261,
  		-0.2196892804283723
  	],
  	[
  		12.495234554753761,
  		-15.42202909959465,
  		-0.2176028311351199
  	],
  	[
  		12.500374517359221,
  		-15.420336955593601,
  		-0.21869400313887782
  	],
  	[
  		12.50241995778704,
  		-15.41812748987124,
  		-0.2209570678005468
  	],
  	[
  		12.50321740059414,
  		-15.41522334558332,
  		-0.2201740869244997
  	],
  	[
  		12.506999169391719,
  		-15.41276454422669,
  		-0.2178798531977095
  	],
  	[
  		12.5123278513685,
  		-15.41104359782516,
  		-0.21847656938383542
  	],
  	[
  		12.51486467976713,
  		-15.408960350547789,
  		-0.2208872854794386
  	],
  	[
  		12.51552628849322,
  		-15.40609581065888,
  		-0.22062088695822868
  	],
  	[
  		12.518793881217888,
  		-15.40350898993903,
  		-0.2182300445259621
  	],
  	[
  		12.52420294254592,
  		-15.401731521822411,
  		-0.21830360233354182
  	],
  	[
  		12.52725449446263,
  		-15.399764117501551,
  		-0.2207497309148065
  	],
  	[
  		12.52789272080834,
  		-15.396965621707599,
  		-0.22101279514964134
  	],
  	[
  		12.53063520705544,
  		-15.394264385258069,
  		-0.2186412275677992
  	],
  	[
  		12.536010983252199,
  		-15.39240519138473,
  		-0.21818960160462703
  	],
  	[
  		12.539575673347569,
  		-15.390537531038092,
  		-0.22055704317723934
  	],
  	[
  		12.54030517767003,
  		-15.387828703909769,
  		-0.2213385490132704
  	],
  	[
  		12.54253485431018,
  		-15.38503177783441,
  		-0.21910234735450929
  	],
  	[
  		12.547766284466551,
  		-15.38306947492676,
  		-0.2181470447940281
  	],
  	[
  		12.55181810168282,
  		-15.38128071118402,
  		-0.2203260821140851
  	],
  	[
  		12.5527474091807,
  		-15.37868015760414,
  		-0.221588382683857
  	],
  	[
  		12.55450286654376,
  		-15.37581094211177,
  		-0.21959573088204853
  	],
  	[
  		12.559483732883749,
  		-15.373728609133519,
  		-0.2181828919863444
  	],
  	[
  		12.56397426889504,
  		-15.37199398274913,
  		-0.2200710780228898
  	],
  	[
  		12.56520284165063,
  		-15.36951536958461,
  		-0.2217551760355707
  	],
  	[
  		12.566544582461301,
  		-15.36660049535459,
  		-0.2201028588449292
  	],
  	[
  		12.57118132200609,
  		-15.3643870243104,
  		-0.21830064077931183
  	],
  	[
  		12.57604110452563,
  		-15.362679215039229,
  		-0.21981042242384252
  	],
  	[
  		12.57765301463331,
  		-15.36033010232339,
  		-0.2218375232789919
  	],
  	[
  		12.578661841425621,
  		-15.357398484163461,
  		-0.22060662539534703
  	],
  	[
  		12.582875998411101,
  		-15.35504871851607,
  		-0.21850228778654862
  	],
  	[
  		12.58801855660421,
  		-15.35333912940559,
  		-0.21956387702818972
  	],
  	[
  		12.59007973135056,
  		-15.35112077379501,
  		-0.22183835208923772
  	],
  	[
  		12.59085258291339,
  		-15.348201938473409,
  		-0.22108874882458973
  	],
  	[
  		12.59458638277069,
  		-15.34571718277464,
  		-0.21878350341776792
  	],
  	[
  		12.59991129321749,
  		-15.34397689298843,
  		-0.2193469172852054
  	],
  	[
  		12.60246642850561,
  		-15.34188443676085,
  		-0.22176257655296194
  	],
  	[
  		12.60311030467725,
  		-15.33900685377798,
  		-0.2215305210299544
  	],
  	[
  		12.60632928253155,
  		-15.33639500620323,
  		-0.2191363194627118
  	],
  	[
  		12.611726811196819,
  		-15.3345964571108,
  		-0.2191762485287169
  	],
  	[
  		12.614797093693891,
  		-15.33261887318523,
  		-0.22161956205749478
  	],
  	[
  		12.61542560255381,
  		-15.32980919798915,
  		-0.22191765997059282
  	],
  	[
  		12.618118412133171,
  		-15.327083793216541,
  		-0.2195505490581612
  	],
  	[
  		12.623475915617519,
  		-15.32520204151986,
  		-0.21906522864483682
  	],
  	[
  		12.6270578037112,
  		-15.32332298341067,
  		-0.22142340122869542
  	],
  	[
  		12.62778441208879,
  		-15.32060407026272,
  		-0.22223694765687851
  	],
  	[
  		12.62996704616465,
  		-15.31778459238246,
  		-0.22001263536048069
  	],
  	[
  		12.6351725011291,
  		-15.31579836213994,
  		-0.21902587930944112
  	],
  	[
  		12.63923932348084,
  		-15.31399667558282,
  		-0.2211880382626403
  	],
  	[
  		12.640172711308391,
  		-15.31138721332953,
  		-0.2224797626304568
  	],
  	[
  		12.64188400360556,
  		-15.30849698971603,
  		-0.22050552658230924
  	],
  	[
  		12.64683320169488,
  		-15.30639002535797,
  		-0.21906510965150622
  	],
  	[
  		12.65133416042949,
  		-15.3046407622633,
  		-0.2209312267533836
  	],
  	[
  		12.65257249922717,
  		-15.302153769201489,
  		-0.2226394831412086
  	],
  	[
  		12.653874860302661,
  		-15.299219838988641,
  		-0.22101202845424722
  	],
  	[
  		12.65847393870038,
  		-15.296981071401461,
  		-0.2191868407940385
  	],
  	[
  		12.6633390806724,
  		-15.29525682633708,
  		-0.22066950470456428
  	],
  	[
  		12.664965222924549,
  		-15.292899487598499,
  		-0.22271471621951272
  	],
  	[
  		12.66594054966652,
  		-15.28995068489661,
  		-0.22151279937854942
  	],
  	[
  		12.670112999004012,
  		-15.28757559941159,
  		-0.21939165338590613
  	],
  	[
  		12.675254836505442,
  		-15.2858477529508,
  		-0.22042250973720862
  	],
  	[
  		12.677333734052489,
  		-15.28362105496625,
  		-0.22270863981597533
  	],
  	[
  		12.678079577545931,
  		-15.28068693109779,
  		-0.22199134443103202
  	],
  	[
  		12.68176897193014,
  		-15.27817723359747,
  		-0.21967619851765272
  	],
  	[
  		12.68708612172018,
  		-15.27641695864144,
  		-0.2202074630129896
  	],
  	[
  		12.689660575771068,
  		-15.274315437206889,
  		-0.2226269360741706
  	],
  	[
  		12.6902846877856,
  		-15.27142443337233,
  		-0.2224291132005973
  	],
  	[
  		12.69345713824882,
  		-15.26878812905977,
  		-0.2200317763835444
  	],
  	[
  		12.69884044722084,
  		-15.266968058598469,
  		-0.22003857925036094
  	],
  	[
  		12.70193005959957,
  		-15.26498046214277,
  		-0.22247874300508272
  	],
  	[
  		12.70254602843086,
  		-15.26215883439023,
  		-0.22281013359224933
  	],
  	[
  		12.70519324290839,
  		-15.25941027384273,
  		-0.2204476930421782
  	],
  	[
  		12.71052887046026,
  		-15.25750552436926,
  		-0.21993059384284652
  	],
  	[
  		12.7141295243217,
  		-15.255615302790112,
  		-0.2222780868272316
  	],
  	[
  		12.7148507296229,
  		-15.25288594943309,
  		-0.2231244448046867
  	],
  	[
  		12.71698870644597,
  		-15.25004444052077,
  		-0.2209113347252504
  	],
  	[
  		12.72216632296507,
  		-15.24803429688122,
  		-0.219895511863428
  	],
  	[
  		12.72624822057908,
  		-15.24621978883699,
  		-0.2220407428884141
  	],
  	[
  		12.7271829815309,
  		-15.24360080073734,
  		-0.22336103944597593
  	],
  	[
  		12.7288529254413,
  		-15.24069023076446,
  		-0.22140481662751232
  	],
  	[
  		12.73376737104132,
  		-15.238558318882669,
  		-0.21993868603794461
  	],
  	[
  		12.7382803182693,
  		-15.23679468406671,
  		-0.2217814398252935
  	],
  	[
  		12.73952563290662,
  		-15.234298898305829,
  		-0.22351456945483328
  	],
  	[
  		12.740791275344721,
  		-15.231346311250391,
  		-0.22190988342025403
  	],
  	[
  		12.7453510276455,
  		-15.22908242018894,
  		-0.22006483293325121
  	],
  	[
  		12.75022257714147,
  		-15.227341969510999,
  		-0.2215195891970231
  	],
  	[
  		12.75186099955381,
  		-15.224976244242681,
  		-0.22358407912291833
  	],
  	[
  		12.75280491459278,
  		-15.22201068099462,
  		-0.2224100970658754
  	],
  	[
  		12.75693343311506,
  		-15.219610273775821,
  		-0.22027481788317518
  	],
  	[
  		12.76207555434832,
  		-15.21786437262103,
  		-0.22127397249249403
  	],
  	[
  		12.76416990354096,
  		-15.21562911400155,
  		-0.2235729564256117
  	],
  	[
  		12.764890654236169,
  		-15.2126799549461,
  		-0.22288592450222022
  	],
  	[
  		12.76853345310112,
  		-15.21014530692759,
  		-0.22056342471949592
  	],
  	[
  		12.773844096238708,
  		-15.20836511323112,
  		-0.2210601336192604
  	],
  	[
  		12.776436693027149,
  		-15.20625470706004,
  		-0.2234857156606033
  	],
  	[
  		12.777042906426239,
  		-15.203350479566511,
  		-0.223319704864703
  	],
  	[
  		12.780167984677679,
  		-15.200690131879071,
  		-0.22092266078292022
  	],
  	[
  		12.78553732512703,
  		-15.19884845602954,
  		-0.22089439838474179
  	],
  	[
  		12.78864608546078,
  		-15.19685123174127,
  		-0.2233335454330271
  	],
  	[
  		12.789251000849251,
  		-15.19401798784533,
  		-0.2236973700233322
  	],
  	[
  		12.791850682703721,
  		-15.19124633658004,
  		-0.2213422160380889
  	],
  	[
  		12.79716495691714,
  		-15.18931848654387,
  		-0.2207907959185561
  	],
  	[
  		12.80078325605232,
  		-15.18741731917512,
  		-0.22312997455719322
  	],
  	[
  		12.80150054691977,
  		-15.18467759440554,
  		-0.22400628828469338
  	],
  	[
  		12.80359327479866,
  		-15.18181455237899,
  		-0.2218079489655362
  	],
  	[
  		12.80874197690011,
  		-15.17977990681204,
  		-0.2207595030567136
  	],
  	[
  		12.812840393677561,
  		-15.17795324510746,
  		-0.2228893101941783
  	],
  	[
  		12.81377764281094,
  		-15.17532498846353,
  		-0.224237224887661
  	],
  	[
  		12.815406077034218,
  		-15.172394557502539,
  		-0.2223017677494552
  	],
  	[
  		12.82028571850443,
  		-15.17023752293179,
  		-0.2208077011747387
  	],
  	[
  		12.82481048363785,
  		-15.168459883991869,
  		-0.22262894491560414
  	],
  	[
  		12.82606452518187,
  		-15.165955550346698,
  		-0.22438484802703174
  	],
  	[
  		12.82729297543578,
  		-15.162984978368602,
  		-0.2228074710911554
  	],
  	[
  		12.831811466258289,
  		-15.160695185809601,
  		-0.2209389167437232
  	],
  	[
  		12.83669033823675,
  		-15.15893903726683,
  		-0.22236688437990232
  	],
  	[
  		12.83834119068414,
  		-15.156564829232519,
  		-0.22444858285422373
  	],
  	[
  		12.839254490200588,
  		-15.153583202994689,
  		-0.22330521085266664
  	],
  	[
  		12.84333774225029,
  		-15.15115700153035,
  		-0.2211533871591853
  	],
  	[
  		12.848480919015339,
  		-15.14939344195918,
  		-0.22212136018651873
  	],
  	[
  		12.85059204656788,
  		-15.147149729732071,
  		-0.2244307292459603
  	],
  	[
  		12.851288910927071,
  		-15.144186510142841,
  		-0.22377795129523143
  	],
  	[
  		12.854883503001759,
  		-15.141626382991792,
  		-0.22144568073833248
  	],
  	[
  		12.860188587780279,
  		-15.13982684686329,
  		-0.22190936907239142
  	],
  	[
  		12.86279905471671,
  		-15.13770726425831,
  		-0.2243382267389984
  	],
  	[
  		12.86338872125172,
  		-15.13479073998923,
  		-0.2242074330091112
  	],
  	[
  		12.86646371616974,
  		-15.132105644843401,
  		-0.2218087172901668
  	],
  	[
  		12.8718200329738,
  		-15.13024281888181,
  		-0.221746046718667
  	],
  	[
  		12.874946914773112,
  		-15.1282354711738,
  		-0.2241810956091957
  	],
  	[
  		12.8755428268817,
  		-15.12539147893428,
  		-0.22457922206126063
  	],
  	[
  		12.87809311813948,
  		-15.12259631964576,
  		-0.22223011009795962
  	],
  	[
  		12.88338727922171,
  		-15.12064589405864,
  		-0.22164507130619404
  	],
  	[
  		12.88702272272414,
  		-15.118733407640741,
  		-0.22397291884685144
  	],
  	[
  		12.88773827696528,
  		-15.11598428451209,
  		-0.22488164709127434
  	],
  	[
  		12.88978357322508,
  		-15.11309918653684,
  		-0.22269659779883222
  	],
  	[
  		12.89490528254188,
  		-15.11104088638531,
  		-0.22161749909458428
  	],
  	[
  		12.89901709537095,
  		-15.109201199943548,
  		-0.22372946127930404
  	],
  	[
  		12.89995939654107,
  		-15.10656447273673,
  		-0.2251056049196644
  	],
  	[
  		12.90154361042434,
  		-15.10361370643765,
  		-0.22319065842743863
  	],
  	[
  		12.90638951058672,
  		-15.10143199172586,
  		-0.2216690792171646
  	],
  	[
  		12.91092417914439,
  		-15.099639828063872,
  		-0.22346703053265704
  	],
  	[
  		12.912188285030371,
  		-15.09712742839443,
  		-0.22524601337253214
  	],
  	[
  		12.91337824050842,
  		-15.094138471235489,
  		-0.2236940373806654
  	],
  	[
  		12.917857869408591,
  		-15.09182373423583,
  		-0.22180404132467083
  	],
  	[
  		12.92274066284697,
  		-15.09005107788548,
  		-0.22320372693597623
  	],
  	[
  		12.92440699445815,
  		-15.087669172813861,
  		-0.2253024659790467
  	],
  	[
  		12.925286970995572,
  		-15.08467100497426,
  		-0.22418950704595952
  	],
  	[
  		12.92932723641589,
  		-15.082219732301748,
  		-0.2220217314847842
  	],
  	[
  		12.934468237118539,
  		-15.080438020678999,
  		-0.22295906213253552
  	],
  	[
  		12.9365967330292,
  		-15.078186053590299,
  		-0.22527830693409612
  	],
  	[
  		12.937267986988159,
  		-15.0752083101031,
  		-0.2246581740874846
  	],
  	[
  		12.94081652908238,
  		-15.07262349837307,
  		-0.2223174602894512
  	],
  	[
  		12.94611252426308,
  		-15.07080395110201,
  		-0.22274787500661103
  	],
  	[
  		12.94874272395255,
  		-15.06867568130219,
  		-0.22517959624889292
  	],
  	[
  		12.94931351290974,
  		-15.065746313198549,
  		-0.2250827846250838
  	],
  	[
  		12.95234203098455,
  		-15.063037390751798,
  		-0.2226823644476137
  	],
  	[
  		12.9576819771351,
  		-15.061153065534329,
  		-0.2225870617282474
  	],
  	[
  		12.96082815995144,
  		-15.05913591266192,
  		-0.2250174317398649
  	],
  	[
  		12.96141281154122,
  		-15.05628075403024,
  		-0.2254494628471153
  	],
  	[
  		12.963916455532761,
  		-15.05346279306939,
  		-0.22310618868380702
  	],
  	[
  		12.969187132451829,
  		-15.051489467187839,
  		-0.2224895250177065
  	],
  	[
  		12.97284020579107,
  		-15.049565865329718,
  		-0.2248057357587598
  	],
  	[
  		12.97355151715903,
  		-15.046806813394248,
  		-0.22574604634952178
  	],
  	[
  		12.975552502940959,
  		-15.0439003714905,
  		-0.22357353244970768
  	],
  	[
  		12.980644218821391,
  		-15.041818119904049,
  		-0.22246538637340782
  	],
  	[
  		12.9847711063953,
  		-15.039965844464088,
  		-0.22455896556771912
  	],
  	[
  		12.98571573636006,
  		-15.03732021867889,
  		-0.2259635834938707
  	],
  	[
  		12.987259317191,
  		-15.03434978627459,
  		-0.2240673167772155
  	],
  	[
  		12.99206925513728,
  		-15.032143509075059,
  		-0.2225215979163666
  	],
  	[
  		12.99661417954866,
  		-15.03033689195475,
  		-0.2242951959264139
  	],
  	[
  		12.997886438786399,
  		-15.02781631049967,
  		-0.2260984588627374
  	],
  	[
  		12.99903971416693,
  		-15.02480935277912,
  		-0.2245708013775413
  	],
  	[
  		13.003478420868099,
  		-15.02246962852563,
  		-0.22266132054725052
  	],
  	[
  		13.00836619668546,
  		-15.02068077274173,
  		-0.224032263858527
  	],
  	[
  		13.010044805124942,
  		-15.01829072262266,
  		-0.22614887828495
  	],
  	[
  		13.01089476968778,
  		-15.01527656532009,
  		-0.2250640527556564
  	],
  	[
  		13.014890200113939,
  		-15.01280038593425,
  		-0.22288343920034942
  	],
  	[
  		13.02003006275563,
  		-15.011000538945181,
  		-0.22378760227468822
  	],
  	[
  		13.022175124746449,
  		-15.008740588574769,
  		-0.22611895658845543
  	],
  	[
  		13.02282200920387,
  		-15.005748527228132,
  		-0.2255299570453274
  	],
  	[
  		13.02632394560411,
  		-15.00313939173503,
  		-0.2231832868973351
  	],
  	[
  		13.031611447872391,
  		-15.0012999782222,
  		-0.2235795530595695
  	],
  	[
  		13.03425944986035,
  		-14.99916296334175,
  		-0.22601578713873172
  	],
  	[
  		13.034813392600771,
  		-14.99622116115734,
  		-0.2259516609991391
  	],
  	[
  		13.03779333305634,
  		-14.993488555775041,
  		-0.22355289934969422
  	],
  	[
  		13.04311776155074,
  		-14.991582617818048,
  		-0.22342181952647971
  	],
  	[
  		13.046282531545131,
  		-14.98955593964518,
  		-0.22584968758449242
  	],
  	[
  		13.046856982594191,
  		-14.986689677790071,
  		-0.22631335513222162
  	],
  	[
  		13.049313736465308,
  		-14.983849400812371,
  		-0.22397880933330622
  	],
  	[
  		13.05456141118523,
  		-14.98185305999396,
  		-0.22332795783704232
  	],
  	[
  		13.05823227745994,
  		-14.979918712767759,
  		-0.225633974879842
  	],
  	[
  		13.05894086477567,
  		-14.977150045609191,
  		-0.22660470245098582
  	],
  	[
  		13.060896693065931,
  		-14.974222728974029,
  		-0.2244484439039811
  	],
  	[
  		13.06595846510454,
  		-14.97211633248977,
  		-0.22330879665368764
  	],
  	[
  		13.070100267629039,
  		-14.97025184007492,
  		-0.2253859654953367
  	],
  	[
  		13.07104817931797,
  		-14.96759740686911,
  		-0.22681718386849592
  	],
  	[
  		13.07255032283962,
  		-14.96460780778708,
  		-0.2249434895970877
  	],
  	[
  		13.07732349608046,
  		-14.96237643462421,
  		-0.223370052648052
  	],
  	[
  		13.081879534977482,
  		-14.960555887099972,
  		-0.2251207391374444
  	],
  	[
  		13.08316076499956,
  		-14.958027055174481,
  		-0.22694549272405423
  	],
  	[
  		13.08427810404848,
  		-14.95500284991488,
  		-0.22544542532469372
  	],
  	[
  		13.08867468683509,
  		-14.952637680514009,
  		-0.22351405912583922
  	],
  	[
  		13.093568609350179,
  		-14.95083312964552,
  		-0.22485706821346374
  	],
  	[
  		13.09526094059833,
  		-14.94843515020079,
  		-0.2269898391796028
  	],
  	[
  		13.09608091758297,
  		-14.9454056602531,
  		-0.22593690084254422
  	],
  	[
  		13.10003018004264,
  		-14.94290408518701,
  		-0.2237410293532606
  	],
  	[
  		13.10516963323095,
  		-14.94108671440944,
  		-0.2246142997589312
  	],
  	[
  		13.10733094107221,
  		-14.938818372603231,
  		-0.2269543538136951
  	],
  	[
  		13.107955278131321,
  		-14.93581296906614,
  		-0.22639971598674713
  	],
  	[
  		13.11140754359572,
  		-14.933178679841351,
  		-0.22404496665217144
  	],
  	[
  		13.11668800813321,
  		-14.931319870039111,
  		-0.2244071820423765
  	],
  	[
  		13.11935405232691,
  		-14.92917396288464,
  		-0.22684553526076512
  	],
  	[
  		13.11989245548977,
  		-14.92622038165019,
  		-0.22681585915145683
  	],
  	[
  		13.12282279953119,
  		-14.92346373687377,
  		-0.2244168494390062
  	],
  	[
  		13.12813239278719,
  		-14.9215367432261,
  		-0.2242519800744232
  	],
  	[
  		13.13131524446338,
  		-14.91950011439911,
  		-0.2266741572739807
  	],
  	[
  		13.13188230681622,
  		-14.916623879540209,
  		-0.22717231319629022
  	],
  	[
  		13.134289140410228,
  		-14.913760567367309,
  		-0.2248451953205692
  	],
  	[
  		13.13951531857441,
  		-14.91174182755075,
  		-0.2241613042219869
  	],
  	[
  		13.14320196010701,
  		-14.90979617245316,
  		-0.2264553719540353
  	],
  	[
  		13.14390979551591,
  		-14.90701849785572,
  		-0.22745694622245002
  	],
  	[
  		13.14581879701417,
  		-14.90406984757705,
  		-0.2253154202298367
  	],
  	[
  		13.15085138087115,
  		-14.90193975443547,
  		-0.2241454559300411
  	],
  	[
  		13.15500625286605,
  		-14.90006238189618,
  		-0.2262035161122984
  	],
  	[
  		13.155960009805721,
  		-14.897399937061639,
  		-0.2276622361107577
  	],
  	[
  		13.15741904241162,
  		-14.89439068040129,
  		-0.22580942136099452
  	],
  	[
  		13.16215762038694,
  		-14.89213504675665,
  		-0.2242100925105068
  	],
  	[
  		13.166721795340539,
  		-14.89029986546581,
  		-0.22593673380208382
  	],
  	[
  		13.16801430056346,
  		-14.887763454761851,
  		-0.22778342561142112
  	],
  	[
  		13.16909374265922,
  		-14.884721561645,
  		-0.22631013157601274
  	],
  	[
  		13.17345024936917,
  		-14.88233164432878,
  		-0.22435795590024543
  	],
  	[
  		13.17834665628263,
  		-14.880510620952709,
  		-0.2256725125318224
  	],
  	[
  		13.18005403975513,
  		-14.87810501149023,
  		-0.2278207786680961
  	],
  	[
  		13.18084249343462,
  		-14.875059749695001,
  		-0.22679827430002392
  	],
  	[
  		13.184747970515891,
  		-14.87253351480372,
  		-0.2245880316400145
  	],
  	[
  		13.189883688063471,
  		-14.87069787344627,
  		-0.22542962626994043
  	],
  	[
  		13.19206296392978,
  		-14.86842165066844,
  		-0.2277786562574856
  	],
  	[
  		13.19266261286759,
  		-14.86540233122007,
  		-0.2272569470120525
  	],
  	[
  		13.19606926252832,
  		-14.862743983247091,
  		-0.22489498069031022
  	],
  	[
  		13.20133863370549,
  		-14.860865181373251,
  		-0.22522465987513904
  	],
  	[
  		13.20402377896915,
  		-14.85871055468955,
  		-0.2276640493023929
  	],
  	[
  		13.20454471426276,
  		-14.855744865162709,
  		-0.22766883827711412
  	],
  	[
  		13.207427858565639,
  		-14.85296476450328,
  		-0.2252693875721218
  	],
  	[
  		13.21271983701398,
  		-14.85101631962066,
  		-0.2250716765399905
  	],
  	[
  		13.21592101408517,
  		-14.84896986314699,
  		-0.2274880235477549
  	],
  	[
  		13.21647782558123,
  		-14.84608288845749,
  		-0.2280190045824213
  	],
  	[
  		13.218839041276029,
  		-14.843197562546619,
  		-0.2256992547948361
  	],
  	[
  		13.224040144241169,
  		-14.841155989842608,
  		-0.22498425612509282
  	],
  	[
  		13.227744150139069,
  		-14.83919927079186,
  		-0.22726499147139978
  	],
  	[
  		13.228448712910259,
  		-14.83641225688512,
  		-0.2282983649611604
  	],
  	[
  		13.230313788333541,
  		-14.83344283700567,
  		-0.2261704164512867
  	],
  	[
  		13.2353155884792,
  		-14.8312891558753,
  		-0.22497283016030592
  	],
  	[
  		13.23948350830177,
  		-14.8293989452939,
  		-0.22701148252632503
  	],
  	[
  		13.24044040840291,
  		-14.82672795188341,
  		-0.22849746160588832
  	],
  	[
  		13.241859105513448,
  		-14.823699644916779,
  		-0.2266648537606336
  	],
  	[
  		13.24656034185586,
  		-14.821419530613731,
  		-0.22504173114931791
  	],
  	[
  		13.251133887010369,
  		-14.819569891341771,
  		-0.2267429867028616
  	],
  	[
  		13.252434769901129,
  		-14.81702548613124,
  		-0.22861255239074102
  	],
  	[
  		13.25347902387737,
  		-14.81396628959093,
  		-0.2271638327709094
  	],
  	[
  		13.25779410036704,
  		-14.811551855358731,
  		-0.22519397046585699
  	],
  	[
  		13.26269414324631,
  		-14.809714541660961,
  		-0.22647887359308194
  	],
  	[
  		13.26441488851276,
  		-14.807301219827009,
  		-0.22864405714629
  	],
  	[
  		13.26517374417963,
  		-14.80424053112202,
  		-0.22765072359947772
  	],
  	[
  		13.26903384461162,
  		-14.801689792404591,
  		-0.22542902432612164
  	],
  	[
  		13.27416661197075,
  		-14.799836010409411,
  		-0.2262379184078137
  	],
  	[
  		13.27636187723243,
  		-14.79755173904799,
  		-0.22859716121329351
  	],
  	[
  		13.27693833189575,
  		-14.79451869075438,
  		-0.2281066478520613
  	],
  	[
  		13.280297226201341,
  		-14.791836290267259,
  		-0.22574015024395833
  	],
  	[
  		13.28555683930121,
  		-14.78993756024002,
  		-0.22603487775098274
  	],
  	[
  		13.28825992737013,
  		-14.78777435576476,
  		-0.228477452260146
  	],
  	[
  		13.28876512388842,
  		-14.784796677473759,
  		-0.22851408601747034
  	],
  	[
  		13.291600422920089,
  		-14.78199358237902,
  		-0.22611777779437092
  	],
  	[
  		13.29687514917456,
  		-14.78002358066168,
  		-0.2258850974497204
  	],
  	[
  		13.30009493992932,
  		-14.777967717994489,
  		-0.22829744559107512
  	],
  	[
  		13.30064282746587,
  		-14.775070278577779,
  		-0.2288603716144103
  	],
  	[
  		13.30295667541421,
  		-14.77216304381442,
  		-0.2265507364174315
  	],
  	[
  		13.30813323134246,
  		-14.770098556683068,
  		-0.22580238935265792
  	],
  	[
  		13.31185358489514,
  		-14.7681309896495,
  		-0.2280721678220079
  	],
  	[
  		13.312556262511961,
  		-14.76533464386873,
  		-0.2291343901311901
  	],
  	[
  		13.31437665517951,
  		-14.76234493962987,
  		-0.22702392041171732
  	],
  	[
  		13.31934641987778,
  		-14.76016700942309,
  		-0.2257950737094847
  	],
  	[
  		13.32352903100072,
  		-14.75826465102523,
  		-0.22781585889952402
  	],
  	[
  		13.32449010631068,
  		-14.75558524076516,
  		-0.2293275605875849
  	],
  	[
  		13.325868597336541,
  		-14.75253839526373,
  		-0.22751782495710524
  	],
  	[
  		13.330532197657242,
  		-14.750233549700852,
  		-0.225868700817983
  	],
  	[
  		13.33511535520568,
  		-14.74836987241588,
  		-0.22754633507954944
  	],
  	[
  		13.336426330206761,
  		-14.745817659618039,
  		-0.22943651116173053
  	],
  	[
  		13.33743524166778,
  		-14.742741859276121,
  		-0.22801679669614272
  	],
  	[
  		13.34170670939862,
  		-14.74030210393577,
  		-0.22602599130791182
  	],
  	[
  		13.346611370485071,
  		-14.73844904417178,
  		-0.2272827009058247
  	],
  	[
  		13.34834534077411,
  		-14.736027805659779,
  		-0.22946259117982504
  	],
  	[
  		13.34907577982219,
  		-14.73295243422477,
  		-0.22850102880201728
  	],
  	[
  		13.352888668502981,
  		-14.73037658482635,
  		-0.2262654786863072
  	],
  	[
  		13.358019424875799,
  		-14.728505058261161,
  		-0.22704210335634342
  	],
  	[
  		13.360231619703189,
  		-14.726212727721219,
  		-0.2294090256369482
  	],
  	[
  		13.36078661035897,
  		-14.723166912141789,
  		-0.2289529654676216
  	],
  	[
  		13.36409618945054,
  		-14.72045993805789,
  		-0.22657969628418584
  	],
  	[
  		13.36934687049622,
  		-14.718541785824211,
  		-0.2268408706205216
  	],
  	[
  		13.3720675813225,
  		-14.716369721676099,
  		-0.2292841030118948
  	],
  	[
  		13.372558735172879,
  		-14.7133810036273,
  		-0.2293557813827173
  	],
  	[
  		13.375343555546259,
  		-14.71055422204175,
  		-0.22696081576416594
  	],
  	[
  		13.38060192012232,
  		-14.708563109851148,
  		-0.22669402142096803
  	],
  	[
  		13.38383874817839,
  		-14.70649726183751,
  		-0.229099703213902
  	],
  	[
  		13.38438006154044,
  		-14.70359020929614,
  		-0.22969601026491948
  	],
  	[
  		13.38664475447743,
  		-14.70066064488547,
  		-0.2273952959419399
  	],
  	[
  		13.391797817176789,
  		-14.69857366495453,
  		-0.22661401890105493
  	],
  	[
  		13.39553374506,
  		-14.69659481763943,
  		-0.2288699679644708
  	],
  	[
  		13.39623666372682,
  		-14.693790032568842,
  		-0.22996314111529512
  	],
  	[
  		13.39801066822316,
  		-14.69077957165158,
  		-0.22786844656812552
  	],
  	[
  		13.40295040893457,
  		-14.688578253805499,
  		-0.22661043327057012
  	],
  	[
  		13.407144303933972,
  		-14.6866628269875,
  		-0.22861115754734362
  	],
  	[
  		13.40811222379214,
  		-14.683975815615671,
  		-0.23014928899211592
  	],
  	[
  		13.409447913740959,
  		-14.68090999024749,
  		-0.2283623703242403
  	],
  	[
  		13.4140752426941,
  		-14.678580891925519,
  		-0.2266875972633912
  	],
  	[
  		13.41866563970141,
  		-14.67670258547945,
  		-0.22834017813671614
  	],
  	[
  		13.41998789713653,
  		-14.67414296961284,
  		-0.23025106701882372
  	],
  	[
  		13.42096014683037,
  		-14.67105015183902,
  		-0.2288585029910004
  	],
  	[
  		13.42519062309865,
  		-14.66858602315407,
  		-0.2268485316205502
  	],
  	[
  		13.43009626878989,
  		-14.666716338166419,
  		-0.22807555243745492
  	],
  	[
  		13.43184639865081,
  		-14.66428791185325,
  		-0.2302698774370473
  	],
  	[
  		13.432545654612248,
  		-14.661197355958839,
  		-0.22933992554914903
  	],
  	[
  		13.436314130124869,
  		-14.65859721089506,
  		-0.22709107159771041
  	],
  	[
  		13.44143957647738,
  		-14.656707470927719,
  		-0.22783637953458058
  	],
  	[
  		13.443669348947001,
  		-14.65440724710846,
  		-0.2302102694304336
  	],
  	[
  		13.44420094326691,
  		-14.65134822376829,
  		-0.22978765220482092
  	],
  	[
  		13.447463454482751,
  		-14.648617430387581,
  		-0.22740859343872782
  	],
  	[
  		13.452701880618969,
  		-14.64667927979351,
  		-0.22763641330583423
  	],
  	[
  		13.45544173012467,
  		-14.64449868986933,
  		-0.23007944128429403
  	],
  	[
  		13.45591631261409,
  		-14.64149834917799,
  		-0.2301850788695511
  	],
  	[
  		13.45865416804207,
  		-14.638648747638301,
  		-0.2277912540323008
  	],
  	[
  		13.463893069546991,
  		-14.636636228076082,
  		-0.2274922048750052
  	],
  	[
  		13.467148258781341,
  		-14.63456068763225,
  		-0.2298903434738569
  	],
  	[
  		13.46768054882398,
  		-14.63164360017463,
  		-0.23052000305133122
  	],
  	[
  		13.46989874757635,
  		-14.62869236759994,
  		-0.2282278712945509
  	],
  	[
  		13.47502545638102,
  		-14.626582734015889,
  		-0.22741611102424
  	],
  	[
  		13.47877735527553,
  		-14.624592744391261,
  		-0.2296576903044647
  	],
  	[
  		13.47947818711949,
  		-14.62177905870152,
  		-0.2307812820375142
  	],
  	[
  		13.48120828737493,
  		-14.618748408927571,
  		-0.2287016289488696
  	],
  	[
  		13.48611524947452,
  		-14.61652344709303,
  		-0.22741601262974143
  	],
  	[
  		13.490322101692168,
  		-14.61459535862448,
  		-0.2293960136064163
  	],
  	[
  		13.49129402131291,
  		-14.6119002732252,
  		-0.2309607539839568
  	],
  	[
  		13.49259027695452,
  		-14.6088160564293,
  		-0.22919463507225124
  	],
  	[
  		13.49717911779708,
  		-14.60646283925708,
  		-0.22749773685678512
  	],
  	[
  		13.50177744261603,
  		-14.60457001896819,
  		-0.22912403480026652
  	],
  	[
  		13.50310938240815,
  		-14.602002981522052,
  		-0.23105709423285492
  	],
  	[
  		13.5040465080965,
  		-14.5988934641484,
  		-0.22969059218429022
  	],
  	[
  		13.50823401059184,
  		-14.59640494935699,
  		-0.2276635334522105
  	],
  	[
  		13.51314176202747,
  		-14.594518963143399,
  		-0.2288604404082265
  	],
  	[
  		13.51490511209545,
  		-14.59208296961534,
  		-0.23107013105454663
  	],
  	[
  		13.51557617169892,
  		-14.588977700492809,
  		-0.23016946654642378
  	],
  	[
  		13.51929802692033,
  		-14.586353337766289,
  		-0.22791038261572938
  	],
  	[
  		13.52441915621527,
  		-14.584445342257998,
  		-0.2286214870980691
  	],
  	[
  		13.52666590003456,
  		-14.582137578758989,
  		-0.2310048484202313
  	],
  	[
  		13.527175323896909,
  		-14.579065495699659,
  		-0.2306137729696093
  	],
  	[
  		13.53039024843402,
  		-14.576311277974769,
  		-0.22823160851926333
  	],
  	[
  		13.535616876084779,
  		-14.57435319505894,
  		-0.2284248231556672
  	],
  	[
  		13.53837460002882,
  		-14.572164230362299,
  		-0.2308697086058544
  	],
  	[
  		13.53883462705523,
  		-14.56915268377215,
  		-0.23100806700722193
  	],
  	[
  		13.541523545755322,
  		-14.56628043180918,
  		-0.22861871815690962
  	],
  	[
  		13.54674335939269,
  		-14.56424628300691,
  		-0.2282842025441236
  	],
  	[
  		13.55001640506565,
  		-14.56216140583249,
  		-0.230677127872502
  	],
  	[
  		13.55054063985865,
  		-14.5592343291896,
  		-0.2313378507643193
  	],
  	[
  		13.55271210339195,
  		-14.55626191386078,
  		-0.22905716823596092
  	],
  	[
  		13.55781226466658,
  		-14.55412930635079,
  		-0.22821189698307054
  	],
  	[
  		13.56158076154805,
  		-14.55212867319593,
  		-0.2304406691813914
  	],
  	[
  		13.562280904240719,
  		-14.54930637650342,
  		-0.2315934724886458
  	],
  	[
  		13.563966866291961,
  		-14.546256132899169,
  		-0.229532475940953
  	],
  	[
  		13.56884071546711,
  		-14.54400725299854,
  		-0.2282167707600217
  	],
  	[
  		13.57306074575606,
  		-14.5420669403251,
  		-0.2301778064676785
  	],
  	[
  		13.57403782180143,
  		-14.53936398631323,
  		-0.23176770681809883
  	],
  	[
  		13.575293952894889,
  		-14.53626191898557,
  		-0.23002633064389053
  	],
  	[
  		13.579843205151668,
  		-14.53388399096349,
  		-0.22830370566432912
  	],
  	[
  		13.58445014952283,
  		-14.53197713774471,
  		-0.2299050385116401
  	],
  	[
  		13.585792277273669,
  		-14.529402564337941,
  		-0.231857551892869
  	],
  	[
  		13.586695310964721,
  		-14.52627717762991,
  		-0.23052039390075812
  	],
  	[
  		13.590838251050721,
  		-14.52376374192329,
  		-0.22847381477437312
  	],
  	[
  		13.59574941245738,
  		-14.52186193841138,
  		-0.2296409596504277
  	],
  	[
  		13.5975273844703,
  		-14.51941860740606,
  		-0.2318643726475132
  	],
  	[
  		13.59817063771952,
  		-14.51629937618969,
  		-0.23099673575491822
  	],
  	[
  		13.60184472818321,
  		-14.513650370932021,
  		-0.2287250549508269
  	],
  	[
  		13.60696233616598,
  		-14.51172474353222,
  		-0.22940411748355038
  	],
  	[
  		13.609225709598789,
  		-14.509409027137231,
  		-0.2317934366650612
  	],
  	[
  		13.60971484736594,
  		-14.506324942867641,
  		-0.23143750259594792
  	],
  	[
  		13.6128788555203,
  		-14.50354645342493,
  		-0.2290502672555773
  	],
  	[
  		13.618095188642801,
  		-14.501568926057791,
  		-0.22920892282462552
  	],
  	[
  		13.620870505536839,
  		-14.49937132181436,
  		-0.2316531446663198
  	],
  	[
  		13.621317368758529,
  		-14.49634924824079,
  		-0.23182588798982462
  	],
  	[
  		13.62395610327961,
  		-14.49345400083258,
  		-0.22943940252488232
  	],
  	[
  		13.62915790336255,
  		-14.491398837109251,
  		-0.22907108089579822
  	],
  	[
  		13.63244815035956,
  		-14.489304152944001,
  		-0.2314554093988046
  	],
  	[
  		13.63296731414245,
  		-14.486368251493731,
  		-0.23214988164383044
  	],
  	[
  		13.63508900523047,
  		-14.48337398491878,
  		-0.2298795654198682
  	],
  	[
  		13.64016458164184,
  		-14.481219153128599,
  		-0.22900204137607139
  	],
  	[
  		13.6439473200943,
  		-14.47920724549082,
  		-0.2312161777495196
  	],
  	[
  		13.6446487993039,
  		-14.47637696683823,
  		-0.23239855268662224
  	],
  	[
  		13.646288500967321,
  		-14.473306658065319,
  		-0.23035516123231933
  	],
  	[
  		13.65113021023413,
  		-14.471034359047861,
  		-0.2290104290250088
  	],
  	[
  		13.65536128651298,
  		-14.46908116566611,
  		-0.2309501777993302
  	],
  	[
  		13.65634589561031,
  		-14.46637103356476,
  		-0.23256553803321053
  	],
  	[
  		13.6575602138917,
  		-14.463250676849459,
  		-0.23084746369554143
  	],
  	[
  		13.66207217038774,
  		-14.460848889578111,
  		-0.22910071462306522
  	],
  	[
  		13.666684931610911,
  		-14.458927373107331,
  		-0.2306760621519131
  	],
  	[
  		13.66803971275284,
  		-14.45634594659008,
  		-0.2326481735251064
  	],
  	[
  		13.668906495414031,
  		-14.45320422942898,
  		-0.2313395796045133
  	],
  	[
  		13.673007173557199,
  		-14.45066664064339,
  		-0.2292745349296757
  	],
  	[
  		13.67791799373913,
  		-14.448748322609099,
  		-0.2304119859284502
  	],
  	[
  		13.67971180763208,
  		-14.4462979112079,
  		-0.23264820661246943
  	],
  	[
  		13.680325627377199,
  		-14.44316429979252,
  		-0.2318123403176529
  	],
  	[
  		13.68395404655442,
  		-14.440491324444672,
  		-0.22952883989152909
  	],
  	[
  		13.68906500339657,
  		-14.43854742989383,
  		-0.23017544562934253
  	],
  	[
  		13.69134654049168,
  		-14.43622423534361,
  		-0.23257092558129502
  	],
  	[
  		13.69181333265802,
  		-14.43312755981281,
  		-0.2322483704045244
  	],
  	[
  		13.694930635898801,
  		-14.43032589990393,
  		-0.22985664377797754
  	],
  	[
  		13.70013263654457,
  		-14.42832838824243,
  		-0.22998252121860951
  	],
  	[
  		13.70292684686466,
  		-14.42612238160557,
  		-0.23242498076089924
  	],
  	[
  		13.70335858402516,
  		-14.42308946708214,
  		-0.23263222976897963
  	],
  	[
  		13.70594960314127,
  		-14.42017178024463,
  		-0.2302480531320641
  	],
  	[
  		13.711130513895831,
  		-14.41809526750643,
  		-0.2298473935977818
  	],
  	[
  		13.71443811362913,
  		-14.41599092509579,
  		-0.2322232391289706
  	],
  	[
  		13.714949420134861,
  		-14.41304546519598,
  		-0.2329498777682856
  	],
  	[
  		13.7170255674813,
  		-14.41003030936762,
  		-0.23068953223064753
  	],
  	[
  		13.72207294278882,
  		-14.40785282573405,
  		-0.22978174527605943
  	],
  	[
  		13.72587159488389,
  		-14.40582992798907,
  		-0.2319799696306507
  	],
  	[
  		13.726571987903679,
  		-14.40299136426984,
  		-0.23319289715790653
  	],
  	[
  		13.72816857951926,
  		-14.39990152237613,
  		-0.23116532506002302
  	],
  	[
  		13.73297661299599,
  		-14.397605967019249,
  		-0.22979454639139832
  	],
  	[
  		13.73721875503351,
  		-14.395639925938799,
  		-0.23171255845379451
  	],
  	[
  		13.73820836443685,
  		-14.39292219813968,
  		-0.2333537304025055
  	],
  	[
  		13.7393835618718,
  		-14.38978409128997,
  		-0.2316579429404717
  	],
  	[
  		13.743855709511909,
  		-14.387358310076841,
  		-0.2298894379820772
  	],
  	[
  		13.74847524245327,
  		-14.385422255031738,
  		-0.23143755529096582
  	],
  	[
  		13.74983984901399,
  		-14.382833601974701,
  		-0.23343041905244932
  	],
  	[
  		13.750673110904119,
  		-14.379675922209449,
  		-0.2321480669381702
  	],
  	[
  		13.754730369851028,
  		-14.37711442429327,
  		-0.23006750720655764
  	],
  	[
  		13.75964196178693,
  		-14.375179704846719,
  		-0.231173682956739
  	],
  	[
  		13.7614501403592,
  		-14.37272220931079,
  		-0.23342441648302834
  	],
  	[
  		13.762036367665049,
  		-14.36957450080834,
  		-0.2326187886721492
  	],
  	[
  		13.76561814400814,
  		-14.36687785604674,
  		-0.23032651387103212
  	],
  	[
  		13.77072292819437,
  		-14.364915724343199,
  		-0.23093949591367058
  	],
  	[
  		13.7730209706657,
  		-14.36258497331604,
  		-0.2333425973489851
  	],
  	[
  		13.7734667068458,
  		-14.359475891351401,
  		-0.23305206471753734
  	],
  	[
  		13.77653538951088,
  		-14.356651116601169,
  		-0.23065861927660758
  	],
  	[
  		13.78172437423364,
  		-14.354633656872371,
  		-0.2307492575620739
  	],
  	[
  		13.784536212496889,
  		-14.352419339341791,
  		-0.23319203042879671
  	],
  	[
  		13.78495444614088,
  		-14.349375653612151,
  		-0.2334310684356729
  	],
  	[
  		13.78749737966779,
  		-14.346436043204609,
  		-0.2310528458154035
  	],
  	[
  		13.792657754262201,
  		-14.344338004125401,
  		-0.23061736142876602
  	],
  	[
  		13.79598329980345,
  		-14.342224428987931,
  		-0.2329862564776164
  	],
  	[
  		13.79648782461037,
  		-14.33926962584916,
  		-0.233744274046027
  	],
  	[
  		13.798517115803419,
  		-14.33623379148033,
  		-0.2314968476825352
  	],
  	[
  		13.80353687768336,
  		-14.334033587327092,
  		-0.2305567222899618
  	],
  	[
  		13.80735055474819,
  		-14.331999906439139,
  		-0.23274132339672804
  	],
  	[
  		13.80805110599705,
  		-14.329153026791259,
  		-0.23398196838546742
  	],
  	[
  		13.809603874907099,
  		-14.32604418601164,
  		-0.23197456219279888
  	],
  	[
  		13.81437694150254,
  		-14.32372466559655,
  		-0.2305739991959996
  	],
  	[
  		13.818631816291049,
  		-14.32174642968488,
  		-0.2324717104030062
  	],
  	[
  		13.81962717360822,
  		-14.319021087401069,
  		-0.2341367175228639
  	],
  	[
  		13.82076364294466,
  		-14.3158657703498,
  		-0.2324658637154431
  	],
  	[
  		13.82519550498344,
  		-14.31341567837032,
  		-0.2306734084422677
  	],
  	[
  		13.82982240498376,
  		-14.31146551813791,
  		-0.2321958131014856
  	],
  	[
  		13.831198390316619,
  		-14.308869745033961,
  		-0.2342070681211048
  	],
  	[
  		13.8319983312941,
  		-14.305696835819539,
  		-0.2329553004848055
  	],
  	[
  		13.83600994427997,
  		-14.303110650228291,
  		-0.23085645532406512
  	],
  	[
  		13.84092347714942,
  		-14.30116011922266,
  		-0.23193307415601172
  	],
  	[
  		13.84274567895309,
  		-14.29869522813769,
  		-0.23419590310124294
  	],
  	[
  		13.843305722342741,
  		-14.295534176737961,
  		-0.23342308533582432
  	],
  	[
  		13.84683858109801,
  		-14.29281314462508,
  		-0.231119779252684
  	],
  	[
  		13.851938320208019,
  		-14.29083318693267,
  		-0.2316996093302434
  	],
  	[
  		13.85425335642809,
  		-14.2884947098384,
  		-0.23410761942159822
  	],
  	[
  		13.85468002764614,
  		-14.285374099032,
  		-0.2338516249626491
  	],
  	[
  		13.857698467900581,
  		-14.282525675777451,
  		-0.23145449584079758
  	],
  	[
  		13.86287527984144,
  		-14.28048873820876,
  		-0.2315112487247061
  	],
  	[
  		13.865704471123701,
  		-14.278265826097769,
  		-0.23395198247269589
  	],
  	[
  		13.86611120239428,
  		-14.27521229567205,
  		-0.2342256549491324
  	],
  	[
  		13.86860348943581,
  		-14.272250068545508,
  		-0.2318517470738092
  	],
  	[
  		13.87374434569905,
  		-14.27013099815497,
  		-0.23138269736294542
  	],
  	[
  		13.87708579150345,
  		-14.26800752147744,
  		-0.2337423262020853
  	],
  	[
  		13.87758618102792,
  		-14.26504417328135,
  		-0.2345325941113884
  	],
  	[
  		13.87956668207128,
  		-14.26198716541949,
  		-0.2322968814920781
  	],
  	[
  		13.884559719041809,
  		-14.25976458584012,
  		-0.2313248088962616
  	],
  	[
  		13.88838732747618,
  		-14.25771963118131,
  		-0.23349326156415628
  	],
  	[
  		13.88909009846574,
  		-14.25486519387226,
  		-0.23476314230392142
  	],
  	[
  		13.89059767194486,
  		-14.25173687211807,
  		-0.2327738956238361
  	],
  	[
  		13.895337846106319,
  		-14.24939424780709,
  		-0.2313458186814486
  	],
  	[
  		13.89960190332115,
  		-14.247402884446721,
  		-0.2332214420946538
  	],
  	[
  		13.900605892670539,
  		-14.244670728010892,
  		-0.23491081975183792
  	],
  	[
  		13.90170119094503,
  		-14.24149775291222,
  		-0.2332648434290086
  	],
  	[
  		13.9060944441856,
  		-14.23902385499188,
  		-0.2314487711301899
  	],
  	[
  		13.910725878307272,
  		-14.23705894247657,
  		-0.2329446324410936
  	],
  	[
  		13.912114251427521,
  		-14.23445633523999,
  		-0.23497408146643084
  	],
  	[
  		13.912879566368622,
  		-14.231267741086171,
  		-0.2337509935188515
  	],
  	[
  		13.91684826016311,
  		-14.22865775981812,
  		-0.2316353489663158
  	],
  	[
  		13.92175984176173,
  		-14.22669047800682,
  		-0.2326811787714887
  	],
  	[
  		13.92359870420238,
  		-14.2242188126584,
  		-0.23495579690344892
  	],
  	[
  		13.924129986969561,
  		-14.22104390003836,
  		-0.23421547207591692
  	],
  	[
  		13.92761727178192,
  		-14.218299354813231,
  		-0.2319015308456217
  	],
  	[
  		13.93270857059224,
  		-14.21630109264936,
  		-0.2324495439195117
  	],
  	[
  		13.93504120174474,
  		-14.21395499623648,
  		-0.2348616738773525
  	],
  	[
  		13.93544686864246,
  		-14.21082243333684,
  		-0.2346396013869383
  	],
  	[
  		13.93841759550037,
  		-14.20795108022665,
  		-0.23223934132547172
  	],
  	[
  		13.94357895431792,
  		-14.205894124436732,
  		-0.2322628999580072
  	],
  	[
  		13.94642646034596,
  		-14.203662764442011,
  		-0.2347005388185556
  	],
  	[
  		13.946819010130632,
  		-14.2005987566783,
  		-0.2350078895879574
  	],
  	[
  		13.94926425537335,
  		-14.19761473902569,
  		-0.2326379231802178
  	],
  	[
  		13.954382635841181,
  		-14.195474331659458,
  		-0.2321371667610047
  	],
  	[
  		13.95774128300107,
  		-14.193341184830699,
  		-0.23448652682676274
  	],
  	[
  		13.958234887753449,
  		-14.190368833663848,
  		-0.2353093207341313
  	],
  	[
  		13.96016955383609,
  		-14.187291316314761,
  		-0.23308478438846772
  	],
  	[
  		13.965133476877309,
  		-14.18504631306325,
  		-0.23208355383487353
  	],
  	[
  		13.96897519078518,
  		-14.18299009394044,
  		-0.2342350133765701
  	],
  	[
  		13.969677870433,
  		-14.180127664344331,
  		-0.2355340115878641
  	],
  	[
  		13.97114239254945,
  		-14.17698032029187,
  		-0.2335621779988426
  	],
  	[
  		13.97584723646924,
  		-14.17461438052134,
  		-0.2321082253019272
  	],
  	[
  		13.98012189636068,
  		-14.17261018549498,
  		-0.23396095552808732
  	],
  	[
  		13.98113139242776,
  		-14.1698706627344,
  		-0.2356749942684473
  	],
  	[
  		13.982188771656949,
  		-14.166680544568319,
  		-0.23405175741320638
  	],
  	[
  		13.98654136316415,
  		-14.16418299849706,
  		-0.232215730223847
  	],
  	[
  		13.991178223430449,
  		-14.162203418816699,
  		-0.23368350495830523
  	],
  	[
  		13.99257761471101,
  		-14.1595940086309,
  		-0.23573282617061062
  	],
  	[
  		13.993309599193731,
  		-14.15638995621533,
  		-0.2345372691545755
  	],
  	[
  		13.99723370244541,
  		-14.15375623711455,
  		-0.23240712125319962
  	],
  	[
  		14.002144369039911,
  		-14.151772479479462,
  		-0.23342170959578673
  	],
  	[
  		14.00399718401662,
  		-14.14929368579136,
  		-0.23570906785442172
  	],
  	[
  		14.00450216848283,
  		-14.14610524901531,
  		-0.2349989774811015
  	],
  	[
  		14.007941481858099,
  		-14.14333722133386,
  		-0.23267760956915684
  	],
  	[
  		14.013025262967751,
  		-14.14132055963983,
  		-0.23319080310946833
  	],
  	[
  		14.015374995049271,
  		-14.138967201716518,
  		-0.2356095818985089
  	],
  	[
  		14.015760722608459,
  		-14.13582272880272,
  		-0.23541919947094062
  	],
  	[
  		14.01868323189209,
  		-14.132928851686259,
  		-0.23301869884867454
  	],
  	[
  		14.023829570041551,
  		-14.13085188772677,
  		-0.2330075635936404
  	],
  	[
  		14.02669473257597,
  		-14.12861235329755,
  		-0.23544422566333673
  	],
  	[
  		14.02707500456918,
  		-14.12553823081269,
  		-0.23578395574815822
  	],
  	[
  		14.029471311443691,
  		-14.12253259307075,
  		-0.2334212772589277
  	],
  	[
  		14.034567235898301,
  		-14.12037056973185,
  		-0.2328858417478828
  	],
  	[
  		14.03794270624978,
  		-14.11822812942267,
  		-0.23522730683707943
  	],
  	[
  		14.038430385856099,
  		-14.11524676986885,
  		-0.23608025619205272
  	],
  	[
  		14.04031872682591,
  		-14.112149169208191,
  		-0.2338698306448146
  	],
  	[
  		14.045252801323691,
  		-14.10988126800968,
  		-0.23283622064516113
  	],
  	[
  		14.04910960218835,
  		-14.107814375103851,
  		-0.2349724114189189
  	],
  	[
  		14.04981351515193,
  		-14.10494416497192,
  		-0.2362989470242316
  	],
  	[
  		14.05123514311811,
  		-14.10177844540688,
  		-0.23434796334693384
  	],
  	[
  		14.05590390369768,
  		-14.099388821710079,
  		-0.23286566967001132
  	],
  	[
  		14.06018973528672,
  		-14.09737228760382,
  		-0.23469713567174952
  	],
  	[
  		14.0612060688592,
  		-14.094625648063259,
  		-0.2364344607163872
  	],
  	[
  		14.06222495037814,
  		-14.091418939767799,
  		-0.2348378434555953
  	],
  	[
  		14.06653541030794,
  		-14.08889709346562,
  		-0.23297842542625552
  	],
  	[
  		14.07117824413082,
  		-14.086903319751569,
  		-0.2344196033113066
  	],
  	[
  		14.072588795022561,
  		-14.08428691244545,
  		-0.23648606694370403
  	],
  	[
  		14.07328880970361,
  		-14.08106829769337,
  		-0.2353212605301024
  	],
  	[
  		14.077166196502759,
  		-14.078410188366119,
  		-0.2331741591686111
  	],
  	[
  		14.082077341670269,
  		-14.076410419923091,
  		-0.2341575530261391
  	],
  	[
  		14.083945292550851,
  		-14.07392469158652,
  		-0.23645603854135588
  	],
  	[
  		14.08442485273448,
  		-14.070723552916121,
  		-0.23577960088011302
  	],
  	[
  		14.08781508995137,
  		-14.067931635294538,
  		-0.233448446296768
  	],
  	[
  		14.09289205957779,
  		-14.06589715781087,
  		-0.2339287783766474
  	],
  	[
  		14.09525841252615,
  		-14.06353612587186,
  		-0.23635082429048282
  	],
  	[
  		14.09562630132696,
  		-14.06038088383619,
  		-0.23619586759506592
  	],
  	[
  		14.09849713264802,
  		-14.057463648492181,
  		-0.23379336176821308
  	],
  	[
  		14.103629824774199,
  		-14.055367144766539,
  		-0.2337475519732217
  	],
  	[
  		14.106511779540309,
  		-14.053119087149998,
  		-0.23618090451738902
  	],
  	[
  		14.10688129743189,
  		-14.05003556047863,
  		-0.23655453198039572
  	],
  	[
  		14.10922729876557,
  		-14.047007980681808,
  		-0.23419773460180981
  	],
  	[
  		14.11430191656011,
  		-14.044824923268152,
  		-0.23362879078197463
  	],
  	[
  		14.11769329441392,
  		-14.04267267825964,
  		-0.23595893037024301
  	],
  	[
  		14.11817803939944,
  		-14.0396834748688,
  		-0.23684451040274368
  	],
  	[
  		14.12001726531739,
  		-14.03656521720793,
  		-0.2346472064916105
  	],
  	[
  		14.12492362675167,
  		-14.0342752277608,
  		-0.233582454986917
  	],
  	[
  		14.128792812688872,
  		-14.032196975309079,
  		-0.2357014988510604
  	],
  	[
  		14.12949993977292,
  		-14.02931966473343,
  		-0.2370561382866924
  	],
  	[
  		14.13087633000975,
  		-14.02613514506365,
  		-0.23512540022344522
  	],
  	[
  		14.13551019153077,
  		-14.023722392532829,
  		-0.23361566333976552
  	],
  	[
  		14.13980469445139,
  		-14.021692853670471,
  		-0.2354238183506038
  	],
  	[
  		14.14082998437183,
  		-14.01893972515176,
  		-0.23718441741743912
  	],
  	[
  		14.141808613970019,
  		-14.0157160496552,
  		-0.23561325006280512
  	],
  	[
  		14.14607928523215,
  		-14.01317075959252,
  		-0.2337317141621425
  	],
  	[
  		14.150725288842521,
  		-14.01116218175558,
  		-0.23514513347341232
  	],
  	[
  		14.15214951471091,
  		-14.008539492213059,
  		-0.23722874407297054
  	],
  	[
  		14.15281509331951,
  		-14.00530584647981,
  		-0.23609403414280372
  	],
  	[
  		14.15664836753008,
  		-14.0026242214927,
  		-0.2339310024971435
  	],
  	[
  		14.16155613096363,
  		-14.00060782697225,
  		-0.2348837047785553
  	],
  	[
  		14.16344044664482,
  		-13.99811543624784,
  		-0.23719218158762612
  	],
  	[
  		14.16389265567864,
  		-13.99490122770008,
  		-0.2365486542019867
  	],
  	[
  		14.167235660304629,
  		-13.992086062662239,
  		-0.23420831321851743
  	],
  	[
  		14.172302932109899,
  		-13.99003328313163,
  		-0.23465569198905142
  	],
  	[
  		14.17468729816929,
  		-13.98766502741012,
  		-0.2370809079515968
  	],
  	[
  		14.17503508170488,
  		-13.98449842667638,
  		-0.2369596047206554
  	],
  	[
  		14.17785827654831,
  		-13.98155891155919,
  		-0.2345553995515909
  	],
  	[
  		14.18297340335238,
  		-13.97944243208638,
  		-0.23447685894677953
  	],
  	[
  		14.18587371103079,
  		-13.97718616216707,
  		-0.23690555130514449
  	],
  	[
  		14.18623036649966,
  		-13.97409297669573,
  		-0.2373135018527823
  	],
  	[
  		14.18852828284221,
  		-13.97104397924749,
  		-0.2349618065466148
  	],
  	[
  		14.193578881336359,
  		-13.96883971542599,
  		-0.2343613176757402
  	],
  	[
  		14.196986344805168,
  		-13.96667787701416,
  		-0.2366802582486708
  	],
  	[
  		14.19746550503432,
  		-13.9636802114616,
  		-0.23759712655748932
  	],
  	[
  		14.19925924656299,
  		-13.96054215642263,
  		-0.2354123556127482
  	],
  	[
  		14.20413436661953,
  		-13.95822972907342,
  		-0.2343184458402583
  	],
  	[
  		14.2080176880864,
  		-13.95614047748272,
  		-0.236419070680832
  	],
  	[
  		14.208725711367089,
  		-13.953255828285009,
  		-0.237802694266721
  	],
  	[
  		14.210059792849961,
  		-13.950052995530008,
  		-0.2358900273031723
  	],
  	[
  		14.21465712372174,
  		-13.947617336008491,
  		-0.23435597416736964
  	],
  	[
  		14.218960549856039,
  		-13.94557492139284,
  		-0.23614025878260692
  	],
  	[
  		14.219992551682381,
  		-13.94281506886416,
  		-0.23792492122804001
  	],
  	[
  		14.220933339476229,
  		-13.939574937874191,
  		-0.2363780110096974
  	],
  	[
  		14.225161791494529,
  		-13.93700617164737,
  		-0.2344769015277214
  	],
  	[
  		14.22981182703741,
  		-13.93498297157084,
  		-0.2358614388581061
  	],
  	[
  		14.231247108971889,
  		-13.932353754445419,
  		-0.2379634965639805
  	],
  	[
  		14.231880812994051,
  		-13.92910546468113,
  		-0.23685652422030481
  	],
  	[
  		14.23566859399755,
  		-13.926400545061359,
  		-0.23468026631104522
  	],
  	[
  		14.24057408251951,
  		-13.924367640206729,
  		-0.2356002841817968
  	],
  	[
  		14.24247345091346,
  		-13.9218687298517,
  		-0.237920792213228
  	],
  	[
  		14.24290013385983,
  		-13.91864174609488,
  		-0.2373082896549729
  	],
  	[
  		14.246195213714842,
  		-13.915803774360281,
  		-0.23496194270205784
  	],
  	[
  		14.25125297018343,
  		-13.913732677672538,
  		-0.23537490657577884
  	],
  	[
  		14.25365415432026,
  		-13.911357345320761,
  		-0.2378051814953306
  	],
  	[
  		14.25398307969749,
  		-13.908179662672172,
  		-0.23771643247550678
  	],
  	[
  		14.2567569178414,
  		-13.90521802869079,
  		-0.23531331055365354
  	],
  	[
  		14.261855534371291,
  		-13.90308158819764,
  		-0.2351994061487082
  	],
  	[
  		14.26477293609173,
  		-13.90081728387347,
  		-0.2376256620041145
  	],
  	[
  		14.2651182207861,
  		-13.8977145373538,
  		-0.23806515015868232
  	],
  	[
  		14.26736791112063,
  		-13.89464474868894,
  		-0.2357221929860821
  	],
  	[
  		14.27239442219352,
  		-13.892418996956371,
  		-0.23508715814201211
  	],
  	[
  		14.27581890756938,
  		-13.89024811419656,
  		-0.23739632867074023
  	],
  	[
  		14.2762933312193,
  		-13.887242234912168,
  		-0.2383438278315779
  	],
  	[
  		14.27804092031985,
  		-13.88408480599872,
  		-0.23617461043442242
  	],
  	[
  		14.28288521580297,
  		-13.881749895976261,
  		-0.2350494865107415
  	],
  	[
  		14.28678204271364,
  		-13.879649949293999,
  		-0.23713383602927102
  	],
  	[
  		14.28749212929213,
  		-13.87675803081018,
  		-0.2385440050933322
  	],
  	[
  		14.288783430672181,
  		-13.87353756402483,
  		-0.2366539815189452
  	],
  	[
  		14.293342802477952,
  		-13.871078308072299,
  		-0.2350918093239129
  	],
  	[
  		14.29765670826177,
  		-13.86902367088146,
  		-0.2368534187721359
  	],
  	[
  		14.29869583403742,
  		-13.866257048218731,
  		-0.23866007922544374
  	],
  	[
  		14.2995994274776,
  		-13.86300111499311,
  		-0.2371400679293025
  	],
  	[
  		14.303784967812529,
  		-13.86040856390814,
  		-0.2352171797498832
  	],
  	[
  		14.308439853325321,
  		-13.85837122529675,
  		-0.23657396208413994
  	],
  	[
  		14.309887617671551,
  		-13.855735616859599,
  		-0.23869213570183342
  	],
  	[
  		14.31049002594074,
  		-13.85247354527307,
  		-0.23761718273243002
  	],
  	[
  		14.314230287374341,
  		-13.849744702078299,
  		-0.23542529313697869
  	],
  	[
  		14.31913480493703,
  		-13.84769596846529,
  		-0.2363144098088124
  	],
  	[
  		14.32104884577965,
  		-13.84519024219492,
  		-0.2386443428380397
  	],
  	[
  		14.32145145235281,
  		-13.84195132468863,
  		-0.23806564344441009
  	],
  	[
  		14.32469605627583,
  		-13.83908983755147,
  		-0.2357111551689103
  	],
  	[
  		14.32974560258084,
  		-13.837000934292229,
  		-0.23609024495175773
  	],
  	[
  		14.332163592851641,
  		-13.834618255020601,
  		-0.23852260036505613
  	],
  	[
  		14.332475761298149,
  		-13.83143037751596,
  		-0.238468491535049
  	],
  	[
  		14.3351984727762,
  		-13.82844615237762,
  		-0.23606481613019833
  	],
  	[
  		14.34028169876168,
  		-13.82629032035507,
  		-0.2359168334045577
  	],
  	[
  		14.34321594939669,
  		-13.824017730843462,
  		-0.23833818808363622
  	],
  	[
  		14.34355212973937,
  		-13.82090641076493,
  		-0.238811790723702
  	],
  	[
  		14.345751049848602,
  		-13.81781520685459,
  		-0.23647608984728552
  	],
  	[
  		14.350754955622731,
  		-13.81556866151299,
  		-0.2358081566061908
  	],
  	[
  		14.354194013840228,
  		-13.813388035952501,
  		-0.2381053844194342
  	],
  	[
  		14.354666573015539,
  		-13.81037476320307,
  		-0.2390839302116301
  	],
  	[
  		14.35636568206938,
  		-13.80719745002346,
  		-0.23692929765028092
  	],
  	[
  		14.361180127537281,
  		-13.804840458333349,
  		-0.2357733384514157
  	],
  	[
  		14.36508909252433,
  		-13.802729357623619,
  		-0.2378392965177298
  	],
  	[
  		14.365803237471479,
  		-13.79983084645193,
  		-0.23927681195688183
  	],
  	[
  		14.36705049624665,
  		-13.79659231392302,
  		-0.2374073845974195
  	],
  	[
  		14.37157417607799,
  		-13.7941104015649,
  		-0.2358193942709217
  	],
  	[
  		14.3758950911901,
  		-13.792042715498749,
  		-0.2375569615085635
  	],
  	[
  		14.376944470637929,
  		-13.7892701470207,
  		-0.2393857359404216
  	],
  	[
  		14.37780850532186,
  		-13.785998003708919,
  		-0.237892542269238
  	],
  	[
  		14.38195310857094,
  		-13.78338225978191,
  		-0.2359481841463223
  	],
  	[
  		14.38660981289237,
  		-13.78133021288944,
  		-0.23727707492064642
  	],
  	[
  		14.38807089517004,
  		-13.77868844146004,
  		-0.23941085026495892
  	],
  	[
  		14.38864074006001,
  		-13.77541216041296,
  		-0.23836600354706042
  	],
  	[
  		14.392336129616929,
  		-13.7726602571723,
  		-0.23615975859443983
  	],
  	[
  		14.39723579850913,
  		-13.770594834810051,
  		-0.237017161138097
  	],
  	[
  		14.399166852579551,
  		-13.76808286357077,
  		-0.2393561834170027
  	],
  	[
  		14.39954315285698,
  		-13.764831536436951,
  		-0.23881061371196122
  	],
  	[
  		14.40274104226165,
  		-13.761947483018,
  		-0.2364481874042179
  	],
  	[
  		14.407778981053202,
  		-13.75984034552004,
  		-0.2367950370125279
  	],
  	[
  		14.410214483933581,
  		-13.75745047351106,
  		-0.2392287724563693
  	],
  	[
  		14.41050804308916,
  		-13.75425202038442,
  		-0.2392087900580664
  	],
  	[
  		14.41318251046873,
  		-13.751245941360839,
  		-0.2368046674435941
  	],
  	[
  		14.418247013934089,
  		-13.74907023528804,
  		-0.2366237892091584
  	],
  	[
  		14.42119869391193,
  		-13.74678945036286,
  		-0.23903934898562743
  	],
  	[
  		14.42152312807404,
  		-13.74366894310334,
  		-0.23954616941398701
  	],
  	[
  		14.42367508140409,
  		-13.74055715800923,
  		-0.23721712251702903
  	],
  	[
  		14.42865344786155,
  		-13.738289509364389,
  		-0.23651812758701718
  	],
  	[
  		14.43210845369637,
  		-13.73609939449203,
  		-0.23880248363245313
  	],
  	[
  		14.43257645368988,
  		-13.733078280816231,
  		-0.2398125305275543
  	],
  	[
  		14.434230618255949,
  		-13.72988179379739,
  		-0.2376714323761897
  	],
  	[
  		14.43901314030428,
  		-13.72750277637751,
  		-0.23648777513414312
  	],
  	[
  		14.44293430041196,
  		-13.72538045890658,
  		-0.23853425177621934
  	],
  	[
  		14.44365029036674,
  		-13.72247500814938,
  		-0.23999956872719352
  	],
  	[
  		14.44485562292144,
  		-13.71921881363567,
  		-0.23814975235771021
  	],
  	[
  		14.44934152412266,
  		-13.71671411695745,
  		-0.2365377715567307
  	],
  	[
  		14.45367058030306,
  		-13.71463358694941,
  		-0.23825044059427192
  	],
  	[
  		14.45472698128164,
  		-13.71185451537726,
  		-0.24010190510053722
  	],
  	[
  		14.45555478064633,
  		-13.70856664935789,
  		-0.2386332386733312
  	],
  	[
  		14.459656768329781,
  		-13.70592793464037,
  		-0.2366711189775852
  	],
  	[
  		14.46431624732531,
  		-13.70386119663975,
  		-0.23797017697737002
  	],
  	[
  		14.46578959993081,
  		-13.70121336763114,
  		-0.2401214675994202
  	],
  	[
  		14.46632806083619,
  		-13.69792302865257,
  		-0.23910542461884182
  	],
  	[
  		14.469977553840948,
  		-13.69514826105658,
  		-0.23688730089173393
  	],
  	[
  		14.4748732419003,
  		-13.69306634558082,
  		-0.2377124654879293
  	],
  	[
  		14.47681891703499,
  		-13.69054782065388,
  		-0.24006161587392494
  	],
  	[
  		14.47717096004074,
  		-13.6872843333087,
  		-0.23954719664705548
  	],
  	[
  		14.48031989138519,
  		-13.684377762205779,
  		-0.23718016901950292
  	],
  	[
  		14.485347176093232,
  		-13.6822522702262,
  		-0.2374918118754601
  	],
  	[
  		14.48779975237306,
  		-13.679855506878301,
  		-0.239929265088377
  	],
  	[
  		14.48807568424826,
  		-13.67664644452222,
  		-0.2399410610065775
  	],
  	[
  		14.49070158967259,
  		-13.67361893835351,
  		-0.2375395145696679
  	],
  	[
  		14.49574798723349,
  		-13.67142333954152,
  		-0.23732403308153313
  	],
  	[
  		14.49871693419507,
  		-13.669134660282529,
  		-0.23973566275607683
  	],
  	[
  		14.49903137093467,
  		-13.66600524213112,
  		-0.2402743635367474
  	],
  	[
  		14.50113472062683,
  		-13.66287307636605,
  		-0.23795543502653752
  	],
  	[
  		14.506087570982169,
  		-13.660584047744479,
  		-0.23722273936577862
  	],
  	[
  		14.50955828128162,
  		-13.65838478963023,
  		-0.23949651938914598
  	],
  	[
  		14.510022548639562,
  		-13.655355769201629,
  		-0.2405356843913316
  	],
  	[
  		14.51163105876619,
  		-13.652140484653199,
  		-0.2384113964655141
  	],
  	[
  		14.51638079991842,
  		-13.64973887548363,
  		-0.2371967014354846
  	],
  	[
  		14.520315397539449,
  		-13.647605946187229,
  		-0.2392254884697239
  	],
  	[
  		14.52103446158667,
  		-13.644693612218111,
  		-0.24071644682621698
  	],
  	[
  		14.52219837746393,
  		-13.64142041578581,
  		-0.23888960567844283
  	],
  	[
  		14.5266455138386,
  		-13.63889246957519,
  		-0.23725122180832822
  	],
  	[
  		14.53098372386626,
  		-13.63679961077291,
  		-0.23894047602946944
  	],
  	[
  		14.532048530936411,
  		-13.63401421988466,
  		-0.2408131038979524
  	],
  	[
  		14.532839780466471,
  		-13.63071117287678,
  		-0.2393727623689444
  	],
  	[
  		14.53689746991035,
  		-13.628048778493959,
  		-0.23738978991977
  	],
  	[
  		14.54156040308918,
  		-13.62596784301249,
  		-0.2386608576602768
  	],
  	[
  		14.543045865399089,
  		-13.62331361887165,
  		-0.2408267933338656
  	],
  	[
  		14.54355472739222,
  		-13.62001013561266,
  		-0.2398426656531968
  	],
  	[
  		14.547155705818898,
  		-13.617211696302329,
  		-0.23761031708126681
  	],
  	[
  		14.552048987542602,
  		-13.615113714924469,
  		-0.23840316253856103
  	],
  	[
  		14.554010174426459,
  		-13.61258869670247,
  		-0.24076075061863822
  	],
  	[
  		14.55433933357564,
  		-13.60931382453376,
  		-0.24028021142791112
  	],
  	[
  		14.55743824951182,
  		-13.60638429360119,
  		-0.2379063630587382
  	],
  	[
  		14.56245554594307,
  		-13.604240940561269,
  		-0.2381846185157772
  	],
  	[
  		14.56492465845206,
  		-13.601836844831361,
  		-0.2406227194952063
  	],
  	[
  		14.565185431242991,
  		-13.59861829582316,
  		-0.24066975853793743
  	],
  	[
  		14.56775942300746,
  		-13.59556851944172,
  		-0.23826926108085691
  	],
  	[
  		14.57278898735675,
  		-13.59335343377089,
  		-0.2380193677618014
  	],
  	[
  		14.57577387942844,
  		-13.59105640617841,
  		-0.24042512913707423
  	],
  	[
  		14.57608013094557,
  		-13.587918739328211,
  		-0.24099685623805722
  	],
  	[
  		14.578133568658469,
  		-13.58476582202421,
  		-0.23868666222599902
  	],
  	[
  		14.58306192309675,
  		-13.582455862873179,
  		-0.2379211464331541
  	],
  	[
  		14.58654713355469,
  		-13.58024685378054,
  		-0.240181113942832
  	],
  	[
  		14.587010631209608,
  		-13.57721096292873,
  		-0.24125142091003282
  	],
  	[
  		14.58857123982661,
  		-13.57397633632935,
  		-0.23914276110156474
  	],
  	[
  		14.59329036750702,
  		-13.571552903699251,
  		-0.2378983791995994
  	],
  	[
  		14.59723546415848,
  		-13.56940859059266,
  		-0.23990778795678952
  	],
  	[
  		14.597959690249919,
  		-13.566490038943211,
  		-0.2414251104523833
  	],
  	[
  		14.59907995242225,
  		-13.56319939995939,
  		-0.23962079350529672
  	],
  	[
  		14.603489842584441,
  		-13.56064876216752,
  		-0.2379568400002223
  	],
  	[
  		14.60783422715947,
  		-13.55854280115792,
  		-0.23962104752430802
  	],
  	[
  		14.6089093854771,
  		-13.55575158634501,
  		-0.241514567751683
  	],
  	[
  		14.609662413053801,
  		-13.552432951423409,
  		-0.24010145429736332
  	],
  	[
  		14.613678309649,
  		-13.549747671940068,
  		-0.2380986160549282
  	],
  	[
  		14.61834167943147,
  		-13.547651816780771,
  		-0.23934048516109732
  	],
  	[
  		14.619841670135509,
  		-13.54499182540052,
  		-0.24152101722385702
  	],
  	[
  		14.62031838630977,
  		-13.54167465691839,
  		-0.24056815989805558
  	],
  	[
  		14.6238740070187,
  		-13.53885347427688,
  		-0.2383225202636765
  	],
  	[
  		14.62876092773934,
  		-13.536738797089999,
  		-0.2390840041962465
  	],
  	[
  		14.630738864036111,
  		-13.53420747185117,
  		-0.2414486781731675
  	],
  	[
  		14.63104308915746,
  		-13.53092084850944,
  		-0.2410018799813845
  	],
  	[
  		14.634093876836229,
  		-13.52796891556741,
  		-0.23862150209113692
  	],
  	[
  		14.63909850598415,
  		-13.52580726104138,
  		-0.2388666721107121
  	],
  	[
  		14.641585241152491,
  		-13.523396104920149,
  		-0.2413049283639953
  	],
  	[
  		14.64182836216591,
  		-13.52016739936934,
  		-0.2413856033935302
  	],
  	[
  		14.64435440379287,
  		-13.517096333938989,
  		-0.2389862357469097
  	],
  	[
  		14.64936346630009,
  		-13.51486134592819,
  		-0.23870399338508821
  	],
  	[
  		14.65236593403668,
  		-13.512556197166239,
  		-0.2411022156910672
  	],
  	[
  		14.65266174828416,
  		-13.50940999135047,
  		-0.24170774631659642
  	],
  	[
  		14.654667369565551,
  		-13.50623676040766,
  		-0.23940542448778773
  	],
  	[
  		14.65956900404606,
  		-13.50390581193212,
  		-0.2386094485567893
  	],
  	[
  		14.6630688600411,
  		-13.50168717351782,
  		-0.2408555078945538
  	],
  	[
  		14.663529072025101,
  		-13.49864382158503,
  		-0.24195596793080298
  	],
  	[
  		14.66504476802503,
  		-13.495390525290729,
  		-0.23986234622108793
  	],
  	[
  		14.669730041633251,
  		-13.49294493640141,
  		-0.23859025347321683
  	],
  	[
  		14.67368731895257,
  		-13.490789518190791,
  		-0.24057887528526392
  	],
  	[
  		14.674414323643541,
  		-13.48786443565449,
  		-0.2421233442825869
  	],
  	[
  		14.67549356731203,
  		-13.484556717772449,
  		-0.24033927481718861
  	],
  	[
  		14.679864544700042,
  		-13.481983570456,
  		-0.2386529579722589
  	],
  	[
  		14.68421573388379,
  		-13.47986464881794,
  		-0.24029136249817593
  	],
  	[
  		14.68529927421541,
  		-13.477067435157618,
  		-0.24220687516798192
  	],
  	[
  		14.68601615415386,
  		-13.47373360454146,
  		-0.24081977211299402
  	],
  	[
  		14.68998793134124,
  		-13.47102541103876,
  		-0.2387997693172037
  	],
  	[
  		14.69465261819778,
  		-13.46891478796904,
  		-0.2400113498870276
  	],
  	[
  		14.69616483440552,
  		-13.466248821182429,
  		-0.24220782002932922
  	],
  	[
  		14.69661159409436,
  		-13.462918242514078,
  		-0.24128393871968049
  	],
  	[
  		14.70012004882217,
  		-13.4600743930941,
  		-0.23902762355404394
  	],
  	[
  		14.70500172342475,
  		-13.4579430501097,
  		-0.2397553719091249
  	],
  	[
  		14.70699527053543,
  		-13.45540560619531,
  		-0.2421294603171809
  	],
  	[
  		14.70727629338249,
  		-13.45210741588234,
  		-0.2417141159691547
  	],
  	[
  		14.71027830075406,
  		-13.449133524015352,
  		-0.23933059974715182
  	],
  	[
  		14.71527025071186,
  		-13.446953431075961,
  		-0.23954087044171568
  	],
  	[
  		14.71777408530722,
  		-13.44453553010984,
  		-0.24198151753594874
  	],
  	[
  		14.7180007686723,
  		-13.44129692900216,
  		-0.24209487414985623
  	],
  	[
  		14.72047717382593,
  		-13.43820470636365,
  		-0.2396993799398108
  	],
  	[
  		14.725466346949009,
  		-13.43594969263465,
  		-0.2393820513740244
  	],
  	[
  		14.728485337501931,
  		-13.43363664983788,
  		-0.2417751437526926
  	],
  	[
  		14.72877206298929,
  		-13.43048194263357,
  		-0.2424116502847833
  	],
  	[
  		14.73072973045252,
  		-13.42728899335176,
  		-0.24012079301025602
  	],
  	[
  		14.735603839944408,
  		-13.42493653038831,
  		-0.2392909247794357
  	],
  	[
  		14.73911970787432,
  		-13.422708897104961,
  		-0.24152456747577544
  	],
  	[
  		14.73957737300767,
  		-13.419658292760499,
  		-0.24265453548046012
  	],
  	[
  		14.74104800130154,
  		-13.4163868284713,
  		-0.24057886612547594
  	],
  	[
  		14.74569942899813,
  		-13.413918921289401,
  		-0.23927693536849112
  	],
  	[
  		14.74966863891277,
  		-13.41175275097761,
  		-0.24124676031716571
  	],
  	[
  		14.7503997117318,
  		-13.408821277283952,
  		-0.2428163441295002
  	],
  	[
  		14.751437622251371,
  		-13.40549718188478,
  		-0.24105710120581558
  	],
  	[
  		14.75576789862788,
  		-13.40290074832599,
  		-0.23934464553683432
  	],
  	[
  		14.76012723180133,
  		-13.400769437220339,
  		-0.24095826884767063
  	],
  	[
  		14.76121929059315,
  		-13.39796612337153,
  		-0.24289380782119363
  	],
  	[
  		14.76190087646414,
  		-13.394617789540678,
  		-0.24153536594111058
  	],
  	[
  		14.76582742477899,
  		-13.391886263128281,
  		-0.23949590445594748
  	],
  	[
  		14.77049436416507,
  		-13.389761318737401,
  		-0.240677917601376
  	],
  	[
  		14.772020079212979,
  		-13.387089487349279,
  		-0.2428880929729889
  	],
  	[
  		14.77243786289442,
  		-13.383746435020221,
  		-0.24199738142124622
  	],
  	[
  		14.775897273309798,
  		-13.380879338984979,
  		-0.2397281079848801
  	],
  	[
  		14.78077498915348,
  		-13.37873198338463,
  		-0.2404237409356803
  	],
  	[
  		14.78278377891674,
  		-13.37618811512163,
  		-0.2428045628085399
  	],
  	[
  		14.783043053557382,
  		-13.37287925523851,
  		-0.24242382654258932
  	],
  	[
  		14.78599345304749,
  		-13.3698826549318,
  		-0.24003513510581242
  	],
  	[
  		14.790974045797661,
  		-13.367684638090209,
  		-0.24021102796020521
  	],
  	[
  		14.79349434250839,
  		-13.36525957362502,
  		-0.24265098958661802
  	],
  	[
  		14.79370675614768,
  		-13.362011960135408,
  		-0.24279892849151372
  	],
  	[
  		14.796131520773981,
  		-13.35889811634521,
  		-0.24040601969126998
  	],
  	[
  		14.80110220065841,
  		-13.356623667721921,
  		-0.2400545422849293
  	],
  	[
  		14.80413733144272,
  		-13.354302429262901,
  		-0.24243984160924753
  	],
  	[
  		14.804417336084331,
  		-13.35114022374714,
  		-0.24310977110751808
  	],
  	[
  		14.806324477356709,
  		-13.347926966655411,
  		-0.24082907562619524
  	],
  	[
  		14.81117300348683,
  		-13.34555381603417,
  		-0.2399670881386566
  	],
  	[
  		14.81470201408923,
  		-13.34331640333003,
  		-0.24218609555299572
  	],
  	[
  		14.81516000654893,
  		-13.340259363225819,
  		-0.2433458478792729
  	],
  	[
  		14.81658278765962,
  		-13.33696921184754,
  		-0.2412876751446553
  	],
  	[
  		14.82120145993086,
  		-13.334479415108229,
  		-0.2399561602586947
  	],
  	[
  		14.82518092545559,
  		-13.332302027407682,
  		-0.24190538588849
  	],
  	[
  		14.82591780576572,
  		-13.32936472836555,
  		-0.2435003450968894
  	],
  	[
  		14.82691302549494,
  		-13.326023855880551,
  		-0.2417641034982904
  	],
  	[
  		14.83120500867188,
  		-13.32340510074103,
  		-0.2400275937895469
  	],
  	[
  		14.83556911453676,
  		-13.32126064151099,
  		-0.2416152256052571
  	],
  	[
  		14.8366728970942,
  		-13.31845204059486,
  		-0.2435705304874647
  	],
  	[
  		14.83731664144056,
  		-13.31508879020957,
  		-0.2422407394723738
  	],
  	[
  		14.84120010522938,
  		-13.31233458640557,
  		-0.2401821279094143
  	],
  	[
  		14.84586614992448,
  		-13.310194826664869,
  		-0.2413349605211045
  	],
  	[
  		14.84740604698409,
  		-13.30751732284118,
  		-0.24355809599015543
  	],
  	[
  		14.84779338013313,
  		-13.30416137584858,
  		-0.24269882193483072
  	],
  	[
  		14.851206112312369,
  		-13.301271846804742,
  		-0.2404177464045772
  	],
  	[
  		14.856076130019089,
  		-13.29910774197722,
  		-0.24108088784679782
  	],
  	[
  		14.85810220163634,
  		-13.296557968205791,
  		-0.24346796868915402
  	],
  	[
  		14.858337581861889,
  		-13.29323797011134,
  		-0.2431208694283271
  	],
  	[
  		14.86124017832136,
  		-13.290219615838438,
  		-0.2407269641149346
  	],
  	[
  		14.866206022392369,
  		-13.28800331185427,
  		-0.24087032031548594
  	],
  	[
  		14.86874370605033,
  		-13.285571320659331,
  		-0.24330888900572578
  	],
  	[
  		14.86893987257675,
  		-13.282314331973751,
  		-0.24349099581732592
  	],
  	[
  		14.87131592980642,
  		-13.279179589230502,
  		-0.2411003748329606
  	],
  	[
  		14.87626466721167,
  		-13.27688531014433,
  		-0.2407165004132542
  	],
  	[
  		14.87931631327831,
  		-13.274555987473452,
  		-0.2430933299852613
  	],
  	[
  		14.87958704456755,
  		-13.271385732679011,
  		-0.24379585913550922
  	],
  	[
  		14.88144727826784,
  		-13.26815295313591,
  		-0.2415244438388788
  	],
  	[
  		14.88626720431596,
  		-13.26575882332369,
  		-0.2406321931704084
  	],
  	[
  		14.88981079048961,
  		-13.26351195525626,
  		-0.2428357918622231
  	],
  	[
  		14.89026643276318,
  		-13.2604480723412,
  		-0.24402580061837292
  	],
  	[
  		14.89164512573511,
  		-13.2571399310459,
  		-0.2419833959955065
  	],
  	[
  		14.89622901834803,
  		-13.25462838808452,
  		-0.24062575190898203
  	],
  	[
  		14.900218738413209,
  		-13.25243972372161,
  		-0.242553155093472
  	],
  	[
  		14.900959399328999,
  		-13.249496399436712,
  		-0.2441744702255685
  	],
  	[
  		14.901913902401269,
  		-13.24613911296547,
  		-0.242459943797514
  	],
  	[
  		14.90616566347979,
  		-13.24349800558485,
  		-0.24070143308552053
  	],
  	[
  		14.910535389785391,
  		-13.241340591224711,
  		-0.2422623521735564
  	],
  	[
  		14.91164765742798,
  		-13.23852621096991,
  		-0.2442382454411598
  	],
  	[
  		14.912256875293151,
  		-13.235148538167001,
  		-0.24293464127257944
  	],
  	[
  		14.916095755836889,
  		-13.232371929326769,
  		-0.24086043950999023
  	],
  	[
  		14.92076174771757,
  		-13.23021732893742,
  		-0.2419818104339052
  	],
  	[
  		14.922314994141011,
  		-13.227534368293,
  		-0.24422005789881132
  	],
  	[
  		14.922672962469019,
  		-13.22416565879836,
  		-0.2433906912955267
  	],
  	[
  		14.926038524932439,
  		-13.22125405167689,
  		-0.2411003731364105
  	],
  	[
  		14.930901403656481,
  		-13.219073331087401,
  		-0.2417303438070277
  	],
  	[
  		14.93294263334247,
  		-13.21651746810674,
  		-0.24412500329256714
  	],
  	[
  		14.933155917518961,
  		-13.21318659878608,
  		-0.2438098654950821
  	],
  	[
  		14.936008711945462,
  		-13.210146636717319,
  		-0.24141418074480614
  	],
  	[
  		14.940960651525359,
  		-13.207911925724868,
  		-0.2415220271584719
  	],
  	[
  		14.943515171365348,
  		-13.205473295116331,
  		-0.2439614375994097
  	],
  	[
  		14.943695972353058,
  		-13.20220689888868,
  		-0.2441753253623892
  	],
  	[
  		14.94602321877524,
  		-13.199051765669669,
  		-0.2417900558712491
  	],
  	[
  		14.9509506275792,
  		-13.19673760929873,
  		-0.24137169998113772
  	],
  	[
  		14.954018910535021,
  		-13.194400553506568,
  		-0.24374167612679498
  	],
  	[
  		14.95428179760266,
  		-13.19122248780676,
  		-0.24447551542774082
  	],
  	[
  		14.956093973881039,
  		-13.187970545046198,
  		-0.2422170263764429
  	],
  	[
  		14.960885300952329,
  		-13.185555206119052,
  		-0.24129207969117772
  	],
  	[
  		14.964443331107699,
  		-13.18329925018209,
  		-0.24348239625609522
  	],
  	[
  		14.964897313468859,
  		-13.180228477573,
  		-0.2447004724599387
  	],
  	[
  		14.96623118984429,
  		-13.176902803083339,
  		-0.24267755303557792
  	],
  	[
  		14.9707794231165,
  		-13.17436894819183,
  		-0.24129032260014172
  	],
  	[
  		14.974780666940859,
  		-13.17216962405999,
  		-0.2431976033596206
  	],
  	[
  		14.975526002687529,
  		-13.16922021804447,
  		-0.2448426933645644
  	],
  	[
  		14.9764405881266,
  		-13.165847256141701,
  		-0.24315321813453
  	],
  	[
  		14.98065093737571,
  		-13.16318331293202,
  		-0.2413703492812419
  	],
  	[
  		14.985027614623728,
  		-13.16101349748034,
  		-0.24290569262114922
  	],
  	[
  		14.98614964803213,
  		-13.158193506627189,
  		-0.24490059273329542
  	],
  	[
  		14.986724292560481,
  		-13.15480201811545,
  		-0.2436269173678546
  	],
  	[
  		14.990516874908351,
  		-13.152002365378,
  		-0.2415344864287127
  	],
  	[
  		14.995183686321,
  		-13.149833510738508,
  		-0.2426264932642578
  	],
  	[
  		14.99674987890704,
  		-13.1471446894008,
  		-0.24487679429316753
  	],
  	[
  		14.99708049880642,
  		-13.143764187153499,
  		-0.2440804170057927
  	],
  	[
  		15.00039584792119,
  		-13.14082963860798,
  		-0.2417787042390431
  	],
  	[
  		15.0052533137315,
  		-13.13863277458669,
  		-0.24237541642671154
  	],
  	[
  		15.00731021563249,
  		-13.13607078135802,
  		-0.244775752182625
  	],
  	[
  		15.0075029847097,
  		-13.13272977466858,
  		-0.24449463277020902
  	],
  	[
  		15.01030485275735,
  		-13.129667784321871,
  		-0.2420951716962826
  	],
  	[
  		15.01524361054577,
  		-13.127415175854619,
  		-0.242169286667855
  	],
  	[
  		15.01781442632227,
  		-13.12496949684318,
  		-0.24460664795721382
  	],
  	[
  		15.017982647812671,
  		-13.121694833239099,
  		-0.2448553849984476
  	],
  	[
  		15.02025781530614,
  		-13.11851851946738,
  		-0.24247417589191392
  	],
  	[
  		15.02516525265448,
  		-13.116184967953291,
  		-0.24202190877219182
  	],
  	[
  		15.028248445889329,
  		-13.113839686511419,
  		-0.2443834125172577
  	],
  	[
  		15.02850559955466,
  		-13.11065447084335,
  		-0.24514921576621151
  	],
  	[
  		15.03026821836118,
  		-13.107382946013919,
  		-0.24290223049274662
  	],
  	[
  		15.03503186519117,
  		-13.10494682104045,
  		-0.2419454238705641
  	],
  	[
  		15.038602793366811,
  		-13.10268115074361,
  		-0.24411960702448351
  	],
  	[
  		15.0390580379498,
  		-13.099604422532401,
  		-0.2453671017845568
  	],
  	[
  		15.04034521288628,
  		-13.09626071281758,
  		-0.2433622387757929
  	],
  	[
  		15.04485994437684,
  		-13.09370533139473,
  		-0.2419469261983902
  	],
  	[
  		15.04886969111308,
  		-13.09149461045627,
  		-0.24383278458878463
  	],
  	[
  		15.04962201315923,
  		-13.08853981588121,
  		-0.24550223361100781
  	],
  	[
  		15.05049458699296,
  		-13.085150762381721,
  		-0.24383733506625813
  	],
  	[
  		15.054665388382551,
  		-13.08246460903878,
  		-0.24203091616881078
  	],
  	[
  		15.05904559358296,
  		-13.08028161205316,
  		-0.2435397346551063
  	],
  	[
  		15.0601791401061,
  		-13.077456406496172,
  		-0.2455529919950719
  	],
  	[
  		15.060717649068689,
  		-13.07405070899198,
  		-0.2443081018781376
  	],
  	[
  		15.06446648667707,
  		-13.07122877380264,
  		-0.24219815572819214
  	],
  	[
  		15.069130883213651,
  		-13.069044919969219,
  		-0.24325982516003403
  	],
  	[
  		15.070712157201779,
  		-13.066350797301912,
  		-0.245522130867935
  	],
  	[
  		15.07101307227067,
  		-13.06295796929354,
  		-0.2447578880333476
  	],
  	[
  		15.07428193101747,
  		-13.060001502358629,
  		-0.2424455539640269
  	],
  	[
  		15.079129958782481,
  		-13.057787899235919,
  		-0.24301040172157098
  	],
  	[
  		15.081203686484969,
  		-13.055219921945639,
  		-0.2454149727745366
  	],
  	[
  		15.0813739979502,
  		-13.05186847875396,
  		-0.2451680947592083
  	],
  	[
  		15.08412708732296,
  		-13.04878501444838,
  		-0.24276476885553122
  	],
  	[
  		15.08905005294867,
  		-13.046514131603999,
  		-0.2428058983341196
  	],
  	[
  		15.091637772111199,
  		-13.044061537835121,
  		-0.2452405664133308
  	],
  	[
  		15.09179075393835,
  		-13.040777908605119,
  		-0.2455226679898158
  	],
  	[
  		15.094017945317491,
  		-13.03758138601426,
  		-0.2431453810655977
  	],
  	[
  		15.09890190362402,
  		-13.03522805134877,
  		-0.24266131110972744
  	],
  	[
  		15.10200157349314,
  		-13.032874724132451,
  		-0.24501254310549803
  	],
  	[
  		15.10225061099602,
  		-13.02968206368451,
  		-0.24581134750513361
  	],
  	[
  		15.10396608970064,
  		-13.026391433341061,
  		-0.24357485677120638
  	],
  	[
  		15.108700313310619,
  		-13.02393459584366,
  		-0.24258885774338063
  	],
  	[
  		15.11228414161382,
  		-13.02165924416649,
  		-0.24474652196658941
  	],
  	[
  		15.11273814109086,
  		-13.018576019469158,
  		-0.2460229029451357
  	],
  	[
  		15.11398132657632,
  		-13.01521486199799,
  		-0.24403543380003423
  	],
  	[
  		15.11845972180083,
  		-13.01263771169144,
  		-0.2425941434210905
  	],
  	[
  		15.12247935242548,
  		-13.01041576633371,
  		-0.2444570110255814
  	],
  	[
  		15.123236070941159,
  		-13.00745521911792,
  		-0.24615168739759752
  	],
  	[
  		15.124069163535289,
  		-13.004050389497559,
  		-0.24450902962635632
  	],
  	[
  		15.128198929387391,
  		-13.001342243837591,
  		-0.24268236560422352
  	],
  	[
  		15.13258355509614,
  		-12.999146199854529,
  		-0.2441635655814868
  	],
  	[
  		15.133726887279,
  		-12.99631567792849,
  		-0.24619656446995603
  	],
  	[
  		15.13423110676074,
  		-12.992896084000021,
  		-0.24497916763692362
  	],
  	[
  		15.13793429103652,
  		-12.990051943073011,
  		-0.24285464036986212
  	],
  	[
  		15.142597045965589,
  		-12.98785319736914,
  		-0.24388485485718361
  	],
  	[
  		15.14419142804339,
  		-12.98515361309523,
  		-0.24616047163369342
  	],
  	[
  		15.144464320403198,
  		-12.981748625568258,
  		-0.24542624132385293
  	],
  	[
  		15.14768470501034,
  		-12.97877026942746,
  		-0.2431059778327228
  	],
  	[
  		15.15252440743482,
  		-12.97653991940857,
  		-0.24363643783753253
  	],
  	[
  		15.15461397574356,
  		-12.97396616951416,
  		-0.24604763320837864
  	],
  	[
  		15.154763388981781,
  		-12.9706043706097,
  		-0.2458323951007687
  	],
  	[
  		15.1574671362307,
  		-12.96749990463639,
  		-0.24342881174962494
  	],
  	[
  		15.162374279579481,
  		-12.96521056090745,
  		-0.2434349260867261
  	],
  	[
  		15.164979032994498,
  		-12.962751492661491,
  		-0.24586912569380992
  	],
  	[
  		15.16511795116956,
  		-12.9594591343131,
  		-0.24618367452877
  	],
  	[
  		15.16729551912372,
  		-12.95624252230925,
  		-0.24381304564036982
  	],
  	[
  		15.172156351307532,
  		-12.953869234795409,
  		-0.2432946252024035
  	],
  	[
  		15.17527163887709,
  		-12.95150812396103,
  		-0.24563805226396412
  	],
  	[
  		15.1755138122614,
  		-12.94830800552254,
  		-0.2464669569920341
  	],
  	[
  		15.17718181227428,
  		-12.94499880959844,
  		-0.244244612183856
  	],
  	[
  		15.18188527470318,
  		-12.94252057988851,
  		-0.2432258260557204
  	],
  	[
  		15.18548376042684,
  		-12.94023626734111,
  		-0.24536857063992282
  	],
  	[
  		15.18593728252017,
  		-12.93714670030563,
  		-0.2466728730052112
  	],
  	[
  		15.18713665861532,
  		-12.933768634709299,
  		-0.2447055804148326
  	],
  	[
  		15.19157834742866,
  		-12.931169449089019,
  		-0.24323613750926182
  	],
  	[
  		15.19560806371998,
  		-12.92893670632002,
  		-0.2450779217239838
  	],
  	[
  		15.19637065879519,
  		-12.92597058209603,
  		-0.24679585461103312
  	],
  	[
  		15.1971641381654,
  		-12.92255069133829,
  		-0.2451799294008569
  	],
  	[
  		15.20125070815774,
  		-12.9198197098371,
  		-0.2433294523025806
  	],
  	[
  		15.20564098668488,
  		-12.91761116893456,
  		-0.2447841682270886
  	],
  	[
  		15.20679399903428,
  		-12.91477516560037,
  		-0.2468349504010326
  	],
  	[
  		15.207265078901631,
  		-12.91134241728881,
  		-0.2456476691092172
  	],
  	[
  		15.21092095494031,
  		-12.9084755113938,
  		-0.24350620386537042
  	],
  	[
  		15.21558319785739,
  		-12.906262312431389,
  		-0.24450541259350234
  	],
  	[
  		15.21719173173544,
  		-12.9035573235515,
  		-0.2467921554626229
  	],
  	[
  		15.217438164082619,
  		-12.90014117952297,
  		-0.246091746351908
  	],
  	[
  		15.22060824635005,
  		-12.89714036683511,
  		-0.24376135257997622
  	],
  	[
  		15.22544083698952,
  		-12.89489386000501,
  		-0.2442587908815269
  	],
  	[
  		15.22754586843841,
  		-12.892314039807069,
  		-0.2466740646188148
  	],
  	[
  		15.22767604954909,
  		-12.88894284558138,
  		-0.2464937743998883
  	],
  	[
  		15.230327515313899,
  		-12.88581661881502,
  		-0.2440880522920028
  	],
  	[
  		15.23522008212641,
  		-12.88350929873201,
  		-0.2440596479289582
  	],
  	[
  		15.2378406539681,
  		-12.881043235965882,
  		-0.24649053576381222
  	],
  	[
  		15.237967852746479,
  		-12.87774303685872,
  		-0.246839204690665
  	],
  	[
  		15.24009373749335,
  		-12.87450589510448,
  		-0.2444742257872962
  	],
  	[
  		15.24493287893353,
  		-12.87211317625414,
  		-0.2439218732691932
  	],
  	[
  		15.248063248071011,
  		-12.8697439337883,
  		-0.24625477248641242
  	],
  	[
  		15.248300953661229,
  		-12.86653734422856,
  		-0.24711605916118198
  	],
  	[
  		15.24991918183253,
  		-12.8632090618321,
  		-0.24490660586510782
  	],
  	[
  		15.254594061640441,
  		-12.86071031293334,
  		-0.24385678014467993
  	],
  	[
  		15.25820400221509,
  		-12.858416176951259,
  		-0.24598235887963452
  	],
  	[
  		15.2586598840845,
  		-12.85532109985109,
  		-0.2473150144480245
  	],
  	[
  		15.25981254512625,
  		-12.85192564790799,
  		-0.24536791120273632
  	],
  	[
  		15.26421878591914,
  		-12.84930487420568,
  		-0.24387041709841772
  	],
  	[
  		15.26825660036623,
  		-12.84706083272797,
  		-0.2456895260989294
  	],
  	[
  		15.26902657679042,
  		-12.844089619585478,
  		-0.2474307470113316
  	],
  	[
  		15.26977902324642,
  		-12.840654295757549,
  		-0.2458399796915666
  	],
  	[
  		15.27382494585174,
  		-12.837901433430709,
  		-0.24396742680776862
  	],
  	[
  		15.27821749639694,
  		-12.8356796289078,
  		-0.24539434492434384
  	],
  	[
  		15.27938343159362,
  		-12.83283894605987,
  		-0.2474624533050943
  	],
  	[
  		15.27981861322438,
  		-12.82939261207412,
  		-0.24630541790431942
  	],
  	[
  		15.283429627021242,
  		-12.82650367104927,
  		-0.2441473028500728
  	],
  	[
  		15.2880881159051,
  		-12.82427556586913,
  		-0.2451162450965439
  	],
  	[
  		15.28971153961686,
  		-12.82156536602508,
  		-0.2474132105021115
  	],
  	[
  		15.28992970205618,
  		-12.81813765370514,
  		-0.246745410907373
  	],
  	[
  		15.29305168070163,
  		-12.81511514786385,
  		-0.2444058370364231
  	],
  	[
  		15.29787367077488,
  		-12.81285187420168,
  		-0.2448702656689412
  	],
  	[
  		15.299996011350729,
  		-12.810266428411701,
  		-0.2472887993027845
  	],
  	[
  		15.30010470605214,
  		-12.806885363378012,
  		-0.2471425097982523
  	],
  	[
  		15.30270749517374,
  		-12.803738269342311,
  		-0.24473435958598622
  	],
  	[
  		15.30758225003668,
  		-12.801412680199471,
  		-0.24467338374513342
  	],
  	[
  		15.310219863635279,
  		-12.7989399099095,
  		-0.2471000041820719
  	],
  	[
  		15.310333188527181,
  		-12.795631527807041,
  		-0.2474826936888329
  	],
  	[
  		15.312410119697411,
  		-12.79237451408754,
  		-0.2451227873653019
  	],
  	[
  		15.317224323825831,
  		-12.78996211237576,
  		-0.2445388071085021
  	],
  	[
  		15.32037011851693,
  		-12.78758486405112,
  		-0.24686049628166612
  	],
  	[
  		15.320601016326709,
  		-12.78437134935081,
  		-0.24775357085713492
  	],
  	[
  		15.32217245403882,
  		-12.78102463042277,
  		-0.24555600957971882
  	],
  	[
  		15.326815849029149,
  		-12.77850511271317,
  		-0.24447694564707173
  	],
  	[
  		15.330438792110058,
  		-12.77620153262702,
  		-0.24658462794844793
  	],
  	[
  		15.33089444568027,
  		-12.773100565092118,
  		-0.2479460004079328
  	],
  	[
  		15.33200393437821,
  		-12.76968833984842,
  		-0.2460169296996802
  	],
  	[
  		15.33637266575801,
  		-12.76704616233407,
  		-0.2444950161629449
  	],
  	[
  		15.34041875875511,
  		-12.764790815674381,
  		-0.2462901376694711
  	],
  	[
  		15.34119442830388,
  		-12.761814462637311,
  		-0.248055990062644
  	],
  	[
  		15.341907515827959,
  		-12.75836401058392,
  		-0.2464889716268963
  	],
  	[
  		15.345910911550572,
  		-12.755589292187981,
  		-0.2445965390510741
  	],
  	[
  		15.35030655960211,
  		-12.75335445977034,
  		-0.24599510017228998
  	],
  	[
  		15.35148235623711,
  		-12.750508693015039,
  		-0.2480815152544396
  	],
  	[
  		15.35188479497159,
  		-12.7470492477196,
  		-0.2469521762754563
  	],
  	[
  		15.35544926870212,
  		-12.74413850076275,
  		-0.2447807565226431
  	],
  	[
  		15.36010481834719,
  		-12.7418954350716,
  		-0.2457168004801683
  	],
  	[
  		15.36174249169365,
  		-12.739180344796559,
  		-0.24802638771913302
  	],
  	[
  		15.361933461328281,
  		-12.73574118002969,
  		-0.24738934586419942
  	],
  	[
  		15.36500707330535,
  		-12.73269742776459,
  		-0.2450432621817464
  	],
  	[
  		15.36981877142654,
  		-12.7304174501353,
  		-0.24547370511720562
  	],
  	[
  		15.37195673626673,
  		-12.72782638679341,
  		-0.2478972987109799
  	],
  	[
  		15.3720456646826,
  		-12.72443575554397,
  		-0.2477835012291119
  	],
  	[
  		15.37459803310006,
  		-12.72126802991016,
  		-0.2453763965583583
  	],
  	[
  		15.379455519723791,
  		-12.71892399387083,
  		-0.24527974805505204
  	],
  	[
  		15.38210965309335,
  		-12.71644485372211,
  		-0.2477044402962299
  	],
  	[
  		15.3822098929624,
  		-12.71312826533302,
  		-0.2481187382008343
  	],
  	[
  		15.384237956355971,
  		-12.70985195488331,
  		-0.2457669358655651
  	],
  	[
  		15.389027450904699,
  		-12.707419693106281,
  		-0.24514871795518542
  	],
  	[
  		15.39218912393618,
  		-12.70503488392849,
  		-0.24746075507705992
  	],
  	[
  		15.39241435168843,
  		-12.70181466162196,
  		-0.24838440276215354
  	],
  	[
  		15.393938572054711,
  		-12.698450059604971,
  		-0.2462024146862838
  	],
  	[
  		15.398550247911771,
  		-12.695909531600009,
  		-0.2450917637607346
  	],
  	[
  		15.402186310108,
  		-12.69359693040176,
  		-0.24718347046752343
  	],
  	[
  		15.402642373061559,
  		-12.69049010868331,
  		-0.2485718251646771
  	],
  	[
  		15.40370817725633,
  		-12.687061674073782,
  		-0.24666470916408478
  	],
  	[
  		15.40803841794726,
  		-12.68439752393471,
  		-0.24511484062310213
  	],
  	[
  		15.412093935166979,
  		-12.68213146289569,
  		-0.2468874667778895
  	],
  	[
  		15.41287580559094,
  		-12.6791498458967,
  		-0.24867527544760304
  	],
  	[
  		15.4135506424034,
  		-12.67568509486325,
  		-0.24713528793454742
  	],
  	[
  		15.417510098963769,
  		-12.67288802417738,
  		-0.2452206604241264
  	],
  	[
  		15.42191032860863,
  		-12.67064071551042,
  		-0.24659152507836848
  	],
  	[
  		15.423097189345501,
  		-12.66779005554925,
  		-0.2486947467560437
  	],
  	[
  		15.42346715907815,
  		-12.6643181981864,
  		-0.24759680270425044
  	],
  	[
  		15.426983595924371,
  		-12.6613851297498,
  		-0.2454097683112833
  	],
  	[
  		15.43163720869364,
  		-12.659127758475039,
  		-0.24631508642100322
  	],
  	[
  		15.43328863564587,
  		-12.65640735855439,
  		-0.2486340828805127
  	],
  	[
  		15.433454507394739,
  		-12.6529577797364,
  		-0.2480310707416508
  	],
  	[
  		15.436476439499568,
  		-12.64989190916987,
  		-0.24567648132790174
  	],
  	[
  		15.44127968044035,
  		-12.64759575500107,
  		-0.24607286808331172
  	],
  	[
  		15.4434333404652,
  		-12.64499891985933,
  		-0.2484993262296432
  	],
  	[
  		15.44350414399936,
  		-12.64159944099563,
  		-0.2484197101833161
  	],
  	[
  		15.44600481333417,
  		-12.63841069174717,
  		-0.2460119182343474
  	],
  	[
  		15.45084603825169,
  		-12.636048800643811,
  		-0.24588132324756842
  	],
  	[
  		15.45351610822554,
  		-12.63356288294778,
  		-0.248301111795308
  	],
  	[
  		15.45360631428985,
  		-12.63023926170674,
  		-0.24874976542795402
  	],
  	[
  		15.45558226857876,
  		-12.626942925312362,
  		-0.24640500874048432
  	],
  	[
  		15.4603488117251,
  		-12.624491447088818,
  		-0.2457534796053371
  	],
  	[
  		15.46352427621289,
  		-12.62209854147573,
  		-0.24805435196279924
  	],
  	[
  		15.46374615498203,
  		-12.618872281663108,
  		-0.24900883089226664
  	],
  	[
  		15.46522120927082,
  		-12.61548932746191,
  		-0.24684119998347032
  	],
  	[
  		15.46980220760517,
  		-12.612928257039439,
  		-0.2456997759851019
  	],
  	[
  		15.47344951315645,
  		-12.61060601477038,
  		-0.247773089546296
  	],
  	[
  		15.47390881997687,
  		-12.60749416067662,
  		-0.2491889871470313
  	],
  	[
  		15.47492916391356,
  		-12.604049058288389,
  		-0.24730242502571353
  	],
  	[
  		15.479223160597272,
  		-12.60136375877635,
  		-0.24572611941473382
  	],
  	[
  		15.48328521116332,
  		-12.59908634277496,
  		-0.2474753295898164
  	],
  	[
  		15.48407582012625,
  		-12.59610016623133,
  		-0.24928529751519451
  	],
  	[
  		15.484710338424279,
  		-12.59262071391721,
  		-0.2477718322291246
  	],
  	[
  		15.488628028146909,
  		-12.58980199063052,
  		-0.24583577934450151
  	],
  	[
  		15.493029214357769,
  		-12.58754149679389,
  		-0.24717875240597464
  	],
  	[
  		15.494228673204711,
  		-12.584686248599299,
  		-0.24929772440195408
  	],
  	[
  		15.49456467090759,
  		-12.58120161080228,
  		-0.24823004422565684
  	],
  	[
  		15.498035450542469,
  		-12.57824692626166,
  		-0.24602792776911062
  	],
  	[
  		15.50268390837518,
  		-12.57597456795838,
  		-0.2469019311129438
  	],
  	[
  		15.50435090479634,
  		-12.57324935550664,
  		-0.2492302806685438
  	],
  	[
  		15.5044895992049,
  		-12.569788842625169,
  		-0.24866004305692382
  	],
  	[
  		15.50746398807809,
  		-12.566701943966809,
  		-0.24629753309047708
  	],
  	[
  		15.51225475359689,
  		-12.56438906990998,
  		-0.2466616136815646
  	],
  	[
  		15.51442529099486,
  		-12.561786626837199,
  		-0.24908954733514999
  	],
  	[
  		15.514476169694401,
  		-12.558378046371319,
  		-0.2490444093030146
  	],
  	[
  		15.51692757399806,
  		-12.555168833635479,
  		-0.2466354417897632
  	],
  	[
  		15.52174986647048,
  		-12.552788755699611,
  		-0.24647210002572031
  	],
  	[
  		15.524436109239039,
  		-12.55029613578456,
  		-0.2488865173910326
  	],
  	[
  		15.52451358820867,
  		-12.546964781930098,
  		-0.249368091987837
  	],
  	[
  		15.52644173407482,
  		-12.543649390271101,
  		-0.2470299687111096
  	],
  	[
  		15.53118182340481,
  		-12.54117830464849,
  		-0.2463472740319051
  	],
  	[
  		15.53437262733826,
  		-12.538777481505349,
  		-0.24863526276377362
  	],
  	[
  		15.53458875699453,
  		-12.53554489637618,
  		-0.2496217405231621
  	],
  	[
  		15.536017615354949,
  		-12.53214411262277,
  		-0.2474669969770628
  	],
  	[
  		15.540566476254261,
  		-12.52956266254905,
  		-0.2462977712902033
  	],
  	[
  		15.54422492993218,
  		-12.527230745786511,
  		-0.24835208729237448
  	],
  	[
  		15.54468502025006,
  		-12.5241133942509,
  		-0.24979557883278714
  	],
  	[
  		15.54566259896087,
  		-12.52065214714748,
  		-0.2479285929614727
  	],
  	[
  		15.549917901621072,
  		-12.517945553065658,
  		-0.24632819352735924
  	],
  	[
  		15.553987465418391,
  		-12.51565683983522,
  		-0.2480523812574
  	],
  	[
  		15.55478412999334,
  		-12.5126657308315,
  		-0.24988562486969912
  	],
  	[
  		15.55538092359557,
  		-12.50917186769396,
  		-0.24839623423787233
  	],
  	[
  		15.559255700817161,
  		-12.50633176285933,
  		-0.2464420823606157
  	],
  	[
  		15.563658798179741,
  		-12.5040581522466,
  		-0.24775568915790558
  	],
  	[
  		15.56486938447174,
  		-12.50119828068852,
  		-0.2498920847514027
  	],
  	[
  		15.565173147689631,
  		-12.49770109252723,
  		-0.24885316964344784
  	],
  	[
  		15.568597064453309,
  		-12.49472501886249,
  		-0.24663909153767372
  	],
  	[
  		15.57324088709204,
  		-12.49243768607162,
  		-0.2474806111305536
  	],
  	[
  		15.57492181196028,
  		-12.489707541910139,
  		-0.2498196546635621
  	],
  	[
  		15.57503459903957,
  		-12.486236180555279,
  		-0.2492804094511628
  	],
  	[
  		15.577959589794379,
  		-12.4831282871178,
  		-0.24691275032869311
  	],
  	[
  		15.58273901021183,
  		-12.480798655790919,
  		-0.247242026798985
  	],
  	[
  		15.58492547416428,
  		-12.47819076364932,
  		-0.2496736946480591
  	],
  	[
  		15.58495786466973,
  		-12.474773074066018,
  		-0.24966030359539204
  	],
  	[
  		15.58735967191491,
  		-12.471543899840341,
  		-0.2472539087368027
  	],
  	[
  		15.592163134517708,
  		-12.469145412933461,
  		-0.2470556185567049
  	],
  	[
  		15.59486616750237,
  		-12.46664654950969,
  		-0.24946658633762972
  	],
  	[
  		15.5949319714113,
  		-12.463307627788689,
  		-0.2499801935178256
  	],
  	[
  		15.59681085914367,
  		-12.4599733111914,
  		-0.24765153498057632
  	],
  	[
  		15.6015248769517,
  		-12.45748245039443,
  		-0.24693542586339132
  	],
  	[
  		15.60473029805002,
  		-12.455073943016579,
  		-0.2492129321661957
  	],
  	[
  		15.604941840851229,
  		-12.45183494549552,
  		-0.2502284972471279
  	],
  	[
  		15.606323975495592,
  		-12.448416824653961,
  		-0.2480906178131409
  	],
  	[
  		15.6108392045426,
  		-12.44581422403542,
  		-0.2468899462032491
  	],
  	[
  		15.61451079271174,
  		-12.443473352011768,
  		-0.24892687525526763
  	],
  	[
  		15.61497238070743,
  		-12.44035051665535,
  		-0.2503964609179014
  	],
  	[
  		15.61590765103922,
  		-12.43687366495249,
  		-0.24855179858579302
  	],
  	[
  		15.62012367156253,
  		-12.434145407820141,
  		-0.246925133442734
  	],
  	[
  		15.624201429749409,
  		-12.431845857002099,
  		-0.248626085654481
  	],
  	[
  		15.625005639314871,
  		-12.42884991295562,
  		-0.2504804670239147
  	],
  	[
  		15.62556484686035,
  		-12.42534234054225,
  		-0.2490195391008285
  	],
  	[
  		15.62939430719851,
  		-12.422479953852271,
  		-0.24704412578453303
  	],
  	[
  		15.633800646175839,
  		-12.42019377834569,
  		-0.24832978551457302
  	],
  	[
  		15.635022025545231,
  		-12.417328991686869,
  		-0.2504815172047594
  	],
  	[
  		15.635295034749761,
  		-12.41381999957633,
  		-0.24947393593511752
  	],
  	[
  		15.638669904777249,
  		-12.41082180936796,
  		-0.24724561639935422
  	],
  	[
  		15.64331046269067,
  		-12.40851991584135,
  		-0.24805499080184454
  	],
  	[
  		15.64500602098387,
  		-12.40578475201033,
  		-0.25040246786152653
  	],
  	[
  		15.645094987192829,
  		-12.40230349752248,
  		-0.2498972970800422
  	],
  	[
  		15.64796877392042,
  		-12.39917400961819,
  		-0.24752249548951372
  	],
  	[
  		15.65273799612659,
  		-12.396828105549831,
  		-0.24781815002255358
  	],
  	[
  		15.65494001609952,
  		-12.39421444382473,
  		-0.25025128043990125
  	],
  	[
  		15.65495588885131,
  		-12.39078857791381,
  		-0.2502727176326534
  	],
  	[
  		15.657305230313,
  		-12.38753865970017,
  		-0.2478672207050998
  	],
  	[
  		15.66209102500496,
  		-12.38512218721236,
  		-0.24763465834170584
  	],
  	[
  		15.66480913412944,
  		-12.38261644676897,
  		-0.2500397625500234
  	],
  	[
  		15.66486589213989,
  		-12.37927078335374,
  		-0.2505866304972108
  	],
  	[
  		15.66669354310288,
  		-12.37591706502883,
  		-0.24826652374178662
  	],
  	[
  		15.67138272817756,
  		-12.373406796366659,
  		-0.2475171059236781
  	],
  	[
  		15.67460199314824,
  		-12.370990163274872,
  		-0.2497815755874028
  	],
  	[
  		15.67481131170428,
  		-12.367745612829818,
  		-0.25082810115074733
  	],
  	[
  		15.676144924312808,
  		-12.36430964466895,
  		-0.2487056037487664
  	],
  	[
  		15.68062874072041,
  		-12.361686718940131,
  		-0.24747531495333291
  	],
  	[
  		15.684310002070042,
  		-12.35933593818848,
  		-0.24949283456050622
  	],
  	[
  		15.684776006477279,
  		-12.35620841881511,
  		-0.2509890477726122
  	],
  	[
  		15.685666217253631,
  		-12.352715479462798,
  		-0.24916690879444842
  	],
  	[
  		15.68984444837479,
  		-12.349965985543221,
  		-0.24751402818479612
  	],
  	[
  		15.69392796269479,
  		-12.34765498373883,
  		-0.24919052277352818
  	],
  	[
  		15.694741054750141,
  		-12.3446545672099,
  		-0.25106588890503223
  	],
  	[
  		15.69526130600396,
  		-12.34113286989836,
  		-0.24963190790288672
  	],
  	[
  		15.69904817606748,
  		-12.33824908787664,
  		-0.24763663907621122
  	],
  	[
  		15.70345413214249,
  		-12.33594946541219,
  		-0.2488930404879786
  	],
  	[
  		15.7046893908866,
  		-12.33308045360685,
  		-0.2510595453487947
  	],
  	[
  		15.70492887732476,
  		-12.32955916388719,
  		-0.2500834331968546
  	],
  	[
  		15.70825763147241,
  		-12.32653962383383,
  		-0.2478410842780376
  	],
  	[
  		15.71289156098154,
  		-12.32422268358328,
  		-0.2486194370045075
  	],
  	[
  		15.714602521528189,
  		-12.321482620145101,
  		-0.25097430728480374
  	],
  	[
  		15.71466568712024,
  		-12.317991047853049,
  		-0.2505026027216612
  	],
  	[
  		15.71749053369704,
  		-12.314840641669228,
  		-0.2481212708965492
  	],
  	[
  		15.72224625478626,
  		-12.31247790184209,
  		-0.24838376164557432
  	],
  	[
  		15.724465296601089,
  		-12.309858717654,
  		-0.2508171301571376
  	],
  	[
  		15.72446224735701,
  		-12.306424133205729,
  		-0.2508726124522199
  	],
  	[
  		15.7267625808805,
  		-12.30315425340633,
  		-0.2484675255255692
  	],
  	[
  		15.73152770035432,
  		-12.30071950720276,
  		-0.2482026815749578
  	],
  	[
  		15.73426220550022,
  		-12.29820710158004,
  		-0.2506006667262543
  	],
  	[
  		15.734307554806119,
  		-12.29485430725245,
  		-0.2511810773444019
  	],
  	[
  		15.73608657015358,
  		-12.29148174974817,
  		-0.2488688150773827
  	],
  	[
  		15.740748162274588,
  		-12.288951940980379,
  		-0.24808883408343163
  	],
  	[
  		15.743981513113741,
  		-12.286527202468129,
  		-0.25033935247683997
  	],
  	[
  		15.744186443211019,
  		-12.28327668036888,
  		-0.25141658778477133
  	],
  	[
  		15.745473830980789,
  		-12.279823327586211,
  		-0.2493085431438955
  	],
  	[
  		15.749923607413441,
  		-12.27717983420754,
  		-0.2480503812954909
  	],
  	[
  		15.75361604856112,
  		-12.27481945008455,
  		-0.2500476294173856
  	],
  	[
  		15.75408376931539,
  		-12.2716867862942,
  		-0.2515707671436773
  	],
  	[
  		15.754932128997861,
  		-12.26817823494425,
  		-0.24976885329095022
  	],
  	[
  		15.75907050889251,
  		-12.26540766045546,
  		-0.2480934974709812
  	],
  	[
  		15.76316025536505,
  		-12.263085196484461,
  		-0.2497440261824544
  	],
  	[
  		15.763980834448159,
  		-12.26008031541838,
  		-0.2516419852361506
  	],
  	[
  		15.76446341787925,
  		-12.25654467902686,
  		-0.2502335899972152
  	],
  	[
  		15.76820588044447,
  		-12.253639517737568,
  		-0.24822079453536403
  	],
  	[
  		15.772612345173,
  		-12.25132666382203,
  		-0.24944740551686762
  	],
  	[
  		15.77385871181805,
  		-12.248453059696109,
  		-0.2516297357507627
  	],
  	[
  		15.774067410939729,
  		-12.24491982301409,
  		-0.25068258326545395
  	],
  	[
  		15.77734799246302,
  		-12.24187903227974,
  		-0.2484294806033272
  	],
  	[
  		15.781976068430769,
  		-12.23954690182593,
  		-0.24917384757749872
  	],
  	[
  		15.78370196576488,
  		-12.23680229314141,
  		-0.2515387016216034
  	],
  	[
  		15.783740277764231,
  		-12.2333004134774,
  		-0.25109828460441863
  	],
  	[
  		15.786515886999839,
  		-12.23012952000259,
  		-0.2487132784952768
  	],
  	[
  		15.79125825292315,
  		-12.22774989119086,
  		-0.24894126628206542
  	],
  	[
  		15.79349327341882,
  		-12.22512536052216,
  		-0.2513770561331643
  	],
  	[
  		15.79347292172314,
  		-12.221682328576959,
  		-0.2514651788580272
  	],
  	[
  		15.79572258567171,
  		-12.218392709028109,
  		-0.2490639522026656
  	],
  	[
  		15.800467094962901,
  		-12.215939374198621,
  		-0.24876367893606044
  	],
  	[
  		15.80321766708593,
  		-12.21342067880373,
  		-0.2511569989221562
  	],
  	[
  		15.80325227885142,
  		-12.21006068567122,
  		-0.2517685485266748
  	],
  	[
  		15.804982665526591,
  		-12.206669815106942,
  		-0.2494670956637359
  	],
  	[
  		15.80961618570721,
  		-12.20412005110034,
  		-0.2486534889987068
  	],
  	[
  		15.8128644736441,
  		-12.20168773996042,
  		-0.2508917298474438
  	],
  	[
  		15.81306597284273,
  		-12.19843140566697,
  		-0.2519984295749632
  	],
  	[
  		15.81430726032885,
  		-12.194961308984531,
  		-0.2499083880014532
  	],
  	[
  		15.81872229416499,
  		-12.1922968886875,
  		-0.2486199958280965
  	],
  	[
  		15.82242638255747,
  		-12.1899273648694,
  		-0.2505987052651866
  	],
  	[
  		15.822896609204411,
  		-12.186789677893518,
  		-0.25214746903696594
  	],
  	[
  		15.823702716858211,
  		-12.18326609477149,
  		-0.25036970179280693
  	],
  	[
  		15.82779991214104,
  		-12.180473786128909,
  		-0.24866832793455923
  	],
  	[
  		15.83189681110725,
  		-12.178140380338771,
  		-0.2502942664147236
  	],
  	[
  		15.83272503251431,
  		-12.17513083992013,
  		-0.2522122153282937
  	],
  	[
  		15.833171309431432,
  		-12.17158213955485,
  		-0.25083262875557943
  	],
  	[
  		15.836867498895051,
  		-12.16865499938081,
  		-0.24879995719264492
  	],
  	[
  		15.841276001589579,
  		-12.1663294151484,
  		-0.24999699621731622
  	],
  	[
  		15.84253455398775,
  		-12.16345140177081,
  		-0.252193786230327
  	],
  	[
  		15.84271310373326,
  		-12.15990699088705,
  		-0.2512792095551632
  	],
  	[
  		15.84594414735893,
  		-12.15684448313159,
  		-0.2490131333136105
  	],
  	[
  		15.850567360653269,
  		-12.15449780313004,
  		-0.2497255507971893
  	],
  	[
  		15.852307633283129,
  		-12.1517482177089,
  		-0.2520971440309972
  	],
  	[
  		15.85232323840604,
  		-12.14823713116256,
  		-0.2516915784828108
  	],
  	[
  		15.855046024671399,
  		-12.14504485460277,
  		-0.2493010513741846
  	],
  	[
  		15.85977679678473,
  		-12.14264885303804,
  		-0.2494944045624553
  	],
  	[
  		15.86202728487422,
  		-12.14001869180601,
  		-0.2519303173430372
  	],
  	[
  		15.8619912857982,
  		-12.1365679283391,
  		-0.2520526159376666
  	],
  	[
  		15.86418875038815,
  		-12.133258183505959,
  		-0.24965381167192682
  	],
  	[
  		15.86891392915815,
  		-12.13078688625611,
  		-0.24931950558935873
  	],
  	[
  		15.8716797802803,
  		-12.12826144632073,
  		-0.25170504033942404
  	],
  	[
  		15.87170679686977,
  		-12.12489544024518,
  		-0.25235026955672807
  	],
  	[
  		15.87338532799526,
  		-12.12148559043377,
  		-0.2500588112809821
  	],
  	[
  		15.87799290701701,
  		-12.11891663695651,
  		-0.2492126080906265
  	],
  	[
  		15.881253669322192,
  		-12.11647614705305,
  		-0.251436965334494
  	],
  	[
  		15.88145401833393,
  		-12.11321467702434,
  		-0.25257330185603805
  	],
  	[
  		15.88264677530622,
  		-12.109727356706902,
  		-0.2505005086745952
  	],
  	[
  		15.88702825203371,
  		-12.107042525948899,
  		-0.24918259026834752
  	],
  	[
  		15.8907417304473,
  		-12.104663237552009,
  		-0.2511406818184783
  	],
  	[
  		15.891216994076508,
  		-12.101521234105078,
  		-0.2527150376360142
  	],
  	[
  		15.89197899443927,
  		-12.09798221727236,
  		-0.2509602910098841
  	],
  	[
  		15.89603731161118,
  		-12.09516901933448,
  		-0.24923420830673024
  	],
  	[
  		15.90013859287432,
  		-12.092824108737402,
  		-0.2508347249235881
  	],
  	[
  		15.90097705829959,
  		-12.089810622954289,
  		-0.2527725432483385
  	],
  	[
  		15.90138471931832,
  		-12.08624845161773,
  		-0.2514213113186686
  	],
  	[
  		15.9050370227209,
  		-12.083300119044939,
  		-0.24936951911773791
  	],
  	[
  		15.909443788941811,
  		-12.08096118490535,
  		-0.2505373492449086
  	],
  	[
  		15.910715856241639,
  		-12.078079026745021,
  		-0.25274723529328014
  	],
  	[
  		15.910862546391959,
  		-12.0745231038711,
  		-0.25186432360064254
  	],
  	[
  		15.91404607618946,
  		-12.07143953962267,
  		-0.2495857128041525
  	],
  	[
  		15.918661334828721,
  		-12.06907776058749,
  		-0.25026598261785843
  	],
  	[
  		15.92041748715445,
  		-12.06632366411224,
  		-0.2526441411220941
  	],
  	[
  		15.92040830175205,
  		-12.062802860942641,
  		-0.25227188099979314
  	],
  	[
  		15.9230824563729,
  		-12.05959031690047,
  		-0.2498761534411124
  	],
  	[
  		15.92779763235052,
  		-12.05717749418254,
  		-0.250036886385995
  	],
  	[
  		15.93006490123807,
  		-12.054541943701029,
  		-0.2524714662364524
  	],
  	[
  		15.93001137602551,
  		-12.051083246220859,
  		-0.2526283296689289
  	],
  	[
  		15.93215905409965,
  		-12.04775393488111,
  		-0.2502310933249814
  	],
  	[
  		15.93686210942459,
  		-12.04526444719174,
  		-0.24986448274580553
  	],
  	[
  		15.93964325310447,
  		-12.04273238233015,
  		-0.252241992799987
  	],
  	[
  		15.939659999065249,
  		-12.0393597374712,
  		-0.2529195404614528
  	],
  	[
  		15.941290771416929,
  		-12.03593184824263,
  		-0.25063734686997813
  	],
  	[
  		15.945868838633,
  		-12.033343370836612,
  		-0.2497607729146803
  	],
  	[
  		15.94914358147854,
  		-12.03089495880446,
  		-0.251969696886881
  	],
  	[
  		15.949340446003111,
  		-12.02762813831502,
  		-0.2531368070800977
  	],
  	[
  		15.95048780811003,
  		-12.024124129318402,
  		-0.2510791778261993
  	],
  	[
  		15.954834281406029,
  		-12.02141915076821,
  		-0.2497349566551348
  	],
  	[
  		15.95855701655859,
  		-12.01903010573874,
  		-0.2516717239339901
  	],
  	[
  		15.959034986329561,
  		-12.01588348354824,
  		-0.2532722362364446
  	],
  	[
  		15.95975542742602,
  		-12.012329535813691,
  		-0.2515391630746445
  	],
  	[
  		15.963772584199042,
  		-12.0094954389363,
  		-0.24979097279079882
  	],
  	[
  		15.96787886295254,
  		-12.00713908865195,
  		-0.25136463632153133
  	],
  	[
  		15.96872489890933,
  		-12.004121377104331,
  		-0.2533236371466749
  	],
  	[
  		15.96909652074931,
  		-12.0005460691441,
  		-0.25199819017359343
  	],
  	[
  		15.972703912329699,
  		-11.99757688107502,
  		-0.2499304226334084
  	],
  	[
  		15.97710981368449,
  		-11.995224668273789,
  		-0.2510672685012472
  	],
  	[
  		15.978394074874569,
  		-11.99233846345916,
  		-0.2532921996247692
  	],
  	[
  		15.978510565226529,
  		-11.9887712626534,
  		-0.2524391363441847
  	],
  	[
  		15.981645942474941,
  		-11.985667071609921,
  		-0.25015120747311614
  	],
  	[
  		15.986253384401689,
  		-11.983290167103679,
  		-0.2507980371992479
  	],
  	[
  		15.98802404205097,
  		-11.98053159165034,
  		-0.2531843348326133
  	],
  	[
  		15.98799109802648,
  		-11.97700121275095,
  		-0.25284391607749995
  	],
  	[
  		15.990614981504,
  		-11.973768556533539,
  		-0.25044583107545754
  	],
  	[
  		15.995315585604398,
  		-11.97133891323777,
  		-0.25057144949870097
  	],
  	[
  		15.99759855206694,
  		-11.96869815785784,
  		-0.2530069233904734
  	],
  	[
  		15.99752880710586,
  		-11.96523153956009,
  		-0.25319553009431667
  	],
  	[
  		15.99962664367361,
  		-11.961883293760181,
  		-0.2508036517184045
  	],
  	[
  		16.00430761968969,
  		-11.95937539426895,
  		-0.2504021970722148
  	],
  	[
  		16.007104969190028,
  		-11.95683724365187,
  		-0.2527733037978779
  	],
  	[
  		16.00711220087707,
  		-11.9534581319369,
  		-0.2534823719679996
  	],
  	[
  		16.00869422342975,
  		-11.950012516385819,
  		-0.2512124273825006
  	],
  	[
  		16.013243147075492,
  		-11.94740442881171,
  		-0.25030342251119925
  	],
  	[
  		16.01653126100474,
  		-11.94494838881742,
  		-0.2524991713166319
  	],
  	[
  		16.01672559838075,
  		-11.94167616831955,
  		-0.2536943312318145
  	],
  	[
  		16.017827089405078,
  		-11.93815608882927,
  		-0.2516562514148617
  	],
  	[
  		16.02213703354613,
  		-11.93543023622913,
  		-0.2502820469127802
  	],
  	[
  		16.02587100847196,
  		-11.93303218576733,
  		-0.25219894311127283
  	],
  	[
  		16.0263521176954,
  		-11.92988089956593,
  		-0.2538237380362622
  	],
  	[
  		16.02703170547849,
  		-11.926312666263602,
  		-0.2521150625818966
  	],
  	[
  		16.03100696759897,
  		-11.92345732688441,
  		-0.25034261921841694
  	],
  	[
  		16.03511924852754,
  		-11.92109007400818,
  		-0.2518908835480682
  	],
  	[
  		16.035974183686463,
  		-11.918068241457899,
  		-0.253868865497879
  	],
  	[
  		16.03631020970235,
  		-11.91448060097883,
  		-0.25257349372991433
  	],
  	[
  		16.03987027505875,
  		-11.91148977648636,
  		-0.25048711493899634
  	],
  	[
  		16.044276781557482,
  		-11.90912494376053,
  		-0.2515945869251957
  	],
  	[
  		16.04557273471087,
  		-11.906234388186821,
  		-0.2538322997659318
  	],
  	[
  		16.045660672895522,
  		-11.90265674142674,
  		-0.2530116825627388
  	],
  	[
  		16.04874532788011,
  		-11.89953117709619,
  		-0.2507123111914469
  	],
  	[
  		16.05334652581131,
  		-11.8971396530869,
  		-0.2513260526836389
  	],
  	[
  		16.05513198950985,
  		-11.89437643637932,
  		-0.2537180069545426
  	],
  	[
  		16.055077616874062,
  		-11.890837434961199,
  		-0.2534118179634881
  	],
  	[
  		16.05764937395787,
  		-11.887584132089039,
  		-0.25100965577192624
  	],
  	[
  		16.06233658574617,
  		-11.885138188605499,
  		-0.25110125528345745
  	],
  	[
  		16.06463493946821,
  		-11.882491980468311,
  		-0.2535354897603476
  	],
  	[
  		16.06455123349255,
  		-11.879018425717971,
  		-0.2537585794157167
  	],
  	[
  		16.066596443822682,
  		-11.87565054314584,
  		-0.25137059221405644
  	],
  	[
  		16.07125665110302,
  		-11.8731247774325,
  		-0.2509353664380614
  	],
  	[
  		16.07406805674905,
  		-11.87057989619306,
  		-0.25329800616125925
  	],
  	[
  		16.07406873704018,
  		-11.867195171949561,
  		-0.2540392707968175
  	],
  	[
  		16.075599883356798,
  		-11.863731352169939,
  		-0.2517806827037492
  	],
  	[
  		16.08012078331473,
  		-11.86110401674594,
  		-0.2508392931672008
  	],
  	[
  		16.08342121020988,
  		-11.85863992242377,
  		-0.2530196594354573
  	],
  	[
  		16.08361536562217,
  		-11.855363094754988,
  		-0.25424409337314063
  	],
  	[
  		16.08466952878462,
  		-11.85182649549991,
  		-0.25222380873319356
  	],
  	[
  		16.08894519335583,
  		-11.84908064231874,
  		-0.25082157976950953
  	],
  	[
  		16.09268687302431,
  		-11.846672702704339,
  		-0.2527170343989444
  	],
  	[
  		16.09317426842113,
  		-11.84351759333125,
  		-0.2543664265846483
  	],
  	[
  		16.09381048086193,
  		-11.839934664747629,
  		-0.2526823705374435
  	],
  	[
  		16.0977456268725,
  		-11.83705858871046,
  		-0.250885712548134
  	],
  	[
  		16.1018611044402,
  		-11.83467984741621,
  		-0.2524080121069916
  	],
  	[
  		16.10272613482242,
  		-11.83165419566283,
  		-0.2544044870297568
  	],
  	[
  		16.10302529929174,
  		-11.8280538376644,
  		-0.2531376128346352
  	],
  	[
  		16.106540837412552,
  		-11.82504225033724,
  		-0.25103371449560113
  	],
  	[
  		16.110944144090812,
  		-11.82266392717803,
  		-0.2521107883848893
  	],
  	[
  		16.11225456952559,
  		-11.8197696460973,
  		-0.25436066046644074
  	],
  	[
  		16.11231148748604,
  		-11.81618110610217,
  		-0.2535723974144155
  	],
  	[
  		16.11534885476967,
  		-11.81303503899488,
  		-0.25126167454524123
  	],
  	[
  		16.11994041770215,
  		-11.81062846237245,
  		-0.25184383469885
  	],
  	[
  		16.12174143563384,
  		-11.80786072205205,
  		-0.2542403846055226
  	],
  	[
  		16.1216637712932,
  		-11.80431275267612,
  		-0.2539681542406124
  	],
  	[
  		16.12418598137434,
  		-11.801039499007619,
  		-0.2515621233830729
  	],
  	[
  		16.128856606687428,
  		-11.798576786059549,
  		-0.25162065659854643
  	],
  	[
  		16.131171317825622,
  		-11.79592524085441,
  		-0.25405226385798735
  	],
  	[
  		16.131071183939202,
  		-11.79244420816663,
  		-0.25430914172116353
  	],
  	[
  		16.13306735416282,
  		-11.78905747636916,
  		-0.251924378346408
  	],
  	[
  		16.13770394752559,
  		-11.78651358710497,
  		-0.25145735554879595
  	],
  	[
  		16.14053074521145,
  		-11.78396217181734,
  		-0.25381017487809493
  	],
  	[
  		16.14052236315165,
  		-11.7805714478943,
  		-0.2545841922951848
  	],
  	[
  		16.14200561013789,
  		-11.777090039906879,
  		-0.25233606838816164
  	],
  	[
  		16.14649625271223,
  		-11.77444348078086,
  		-0.2513653865408363
  	],
  	[
  		16.14980908379314,
  		-11.77197126906762,
  		-0.2535291609437596
  	],
  	[
  		16.15000099693171,
  		-11.76868949034515,
  		-0.2547830628154315
  	],
  	[
  		16.15100987920593,
  		-11.765136766523401,
  		-0.25277961930421583
  	],
  	[
  		16.155249069895948,
  		-11.762370764536001,
  		-0.251351190724401
  	],
  	[
  		16.15899974443252,
  		-11.759953153263341,
  		-0.2532241519668375
  	],
  	[
  		16.15949052874,
  		-11.75679372378787,
  		-0.2548985921624747
  	],
  	[
  		16.160086482266742,
  		-11.753196525873,
  		-0.25323675860119804
  	],
  	[
  		16.16397971205651,
  		-11.75029992765529,
  		-0.2514197547873274
  	],
  	[
  		16.16809908985962,
  		-11.747909671541981,
  		-0.2529142397124318
  	],
  	[
  		16.16897313089394,
  		-11.74488029250016,
  		-0.254931072347198
  	],
  	[
  		16.1692365221271,
  		-11.74126733759983,
  		-0.2536913369314072
  	],
  	[
  		16.17270617265481,
  		-11.73823510810238,
  		-0.25157244351954333
  	],
  	[
  		16.17710714090902,
  		-11.735843474293011,
  		-0.2526185334343453
  	],
  	[
  		16.17842964474097,
  		-11.732945161053369,
  		-0.2548816278160662
  	],
  	[
  		16.17845777004395,
  		-11.72934596261326,
  		-0.25412337511452293
  	],
  	[
  		16.18144574526482,
  		-11.726179463069059,
  		-0.25180464440642497
  	],
  	[
  		16.18602842752913,
  		-11.72375764423287,
  		-0.2523521443186734
  	],
  	[
  		16.18784474185282,
  		-11.72098575030043,
  		-0.2547558625674569
  	],
  	[
  		16.18774459557924,
  		-11.71742873273202,
  		-0.2545152034608114
  	],
  	[
  		16.19021703288551,
  		-11.71413596892912,
  		-0.25210835164488393
  	],
  	[
  		16.1948712870327,
  		-11.711656385487458,
  		-0.2521322372785281
  	],
  	[
  		16.1972020108612,
  		-11.708999805525359,
  		-0.2545634263204544
  	],
  	[
  		16.19708703698033,
  		-11.705511529991881,
  		-0.25485273089134763
  	],
  	[
  		16.19903263349856,
  		-11.70210616057772,
  		-0.25247462520079894
  	],
  	[
  		16.20364544951494,
  		-11.69954378161544,
  		-0.251972890964987
  	],
  	[
  		16.2064875456537,
  		-11.69698622220139,
  		-0.2543183168429794
  	],
  	[
  		16.20647076363035,
  		-11.693589391600302,
  		-0.2551226842937477
  	],
  	[
  		16.20790586874055,
  		-11.69009083562832,
  		-0.2528880456791061
  	],
  	[
  		16.21236532061565,
  		-11.68742447230704,
  		-0.251884799461554
  	],
  	[
  		16.21569184900384,
  		-11.68494475853792,
  		-0.2540338166536488
  	],
  	[
  		16.21588250296919,
  		-11.68165810738358,
  		-0.2553155969142935
  	],
  	[
  		16.21684664067984,
  		-11.678089932262669,
  		-0.2533324184915776
  	],
  	[
  		16.22104829434324,
  		-11.67530330455673,
  		-0.251875436801535
  	],
  	[
  		16.224808910396792,
  		-11.67287653705518,
  		-0.2537275324241691
  	],
  	[
  		16.225304167813277,
  		-11.66971294285171,
  		-0.25542579196095655
  	],
  	[
  		16.22585962741928,
  		-11.66610204139938,
  		-0.2537900261987343
  	],
  	[
  		16.22970927756273,
  		-11.663184176090699,
  		-0.2519492899191532
  	],
  	[
  		16.23383344827461,
  		-11.66078289929428,
  		-0.2534174896686305
  	],
  	[
  		16.23471640009667,
  		-11.657749500044849,
  		-0.255452069376986
  	],
  	[
  		16.234945753361462,
  		-11.654124853028971,
  		-0.2542426109957776
  	],
  	[
  		16.23836709950633,
  		-11.651071221186239,
  		-0.25210638190950524
  	],
  	[
  		16.24276747143054,
  		-11.64866673945669,
  		-0.253121405760562
  	],
  	[
  		16.24410299913163,
  		-11.645764514249962,
  		-0.25539641865284
  	],
  	[
  		16.24410356327439,
  		-11.64215546987808,
  		-0.2546714284290918
  	],
  	[
  		16.24704083310984,
  		-11.63896804930285,
  		-0.25234252500974763
  	],
  	[
  		16.25161564339528,
  		-11.636531555351139,
  		-0.2528571615198728
  	],
  	[
  		16.253446682312568,
  		-11.63375505375641,
  		-0.2552649719104153
  	],
  	[
  		16.25332648007391,
  		-11.63019011665699,
  		-0.2550594992105706
  	],
  	[
  		16.25574550059439,
  		-11.62687692367897,
  		-0.25265019983742815
  	],
  	[
  		16.26038502718215,
  		-11.62438090721399,
  		-0.2526392472349778
  	],
  	[
  		16.262730779322908,
  		-11.62171889220833,
  		-0.2550679483796978
  	],
  	[
  		16.26260279324078,
  		-11.618224060626641,
  		-0.2553910213231834
  	],
  	[
  		16.26449624427748,
  		-11.614799652796231,
  		-0.2530183842289713
  	],
  	[
  		16.26908666151708,
  		-11.612219317458422,
  		-0.2524828237514727
  	],
  	[
  		16.27194311152973,
  		-11.609655080496031,
  		-0.25481773314956213
  	],
  	[
  		16.271921138320128,
  		-11.60625326792587,
  		-0.2556547374077832
  	],
  	[
  		16.273305252586148,
  		-11.60273695270118,
  		-0.2534328572383287
  	],
  	[
  		16.27773583688963,
  		-11.60005154595291,
  		-0.2523980434345585
  	],
  	[
  		16.28107335707186,
  		-11.59756361584378,
  		-0.2545306087686463
  	],
  	[
  		16.28126500143412,
  		-11.594272753346699,
  		-0.25584067038832103
  	],
  	[
  		16.28218184739583,
  		-11.59068863848959,
  		-0.2538774111112305
  	],
  	[
  		16.28634737480555,
  		-11.58788189093787,
  		-0.2523924389985414
  	],
  	[
  		16.29011534652995,
  		-11.58544526388922,
  		-0.2542218342160845
  	],
  	[
  		16.29061736329378,
  		-11.582278081784821,
  		-0.2559436088109001
  	],
  	[
  		16.2911304988139,
  		-11.57865308254367,
  		-0.2543330796890148
  	],
  	[
  		16.29493899202031,
  		-11.57571473558837,
  		-0.2524695812358013
  	],
  	[
  		16.29906521557561,
  		-11.573301821409501,
  		-0.25391049320992043
  	],
  	[
  		16.29995975448306,
  		-11.57026507590536,
  		-0.2559625598272526
  	],
  	[
  		16.3001525344817,
  		-11.566628259286,
  		-0.254783043577745
  	],
  	[
  		16.30352835905115,
  		-11.56355405448994,
  		-0.25263017942682253
  	],
  	[
  		16.3079242460621,
  		-11.56113610043584,
  		-0.25361488699599144
  	],
  	[
  		16.309274145722018,
  		-11.558230170020082,
  		-0.25590025529816474
  	],
  	[
  		16.30924516671702,
  		-11.554610922743752,
  		-0.2552081692933041
  	],
  	[
  		16.31213356249167,
  		-11.551403141058628,
  		-0.25286935145040185
  	],
  	[
  		16.31669766960815,
  		-11.54895149609747,
  		-0.2533512599893181
  	],
  	[
  		16.31854477504111,
  		-11.5461707443636,
  		-0.2557626824220957
  	],
  	[
  		16.31840229424728,
  		-11.54259732260131,
  		-0.2555909085222392
  	],
  	[
  		16.32077193152084,
  		-11.53926470916627,
  		-0.253179180296966
  	],
  	[
  		16.32539291947559,
  		-11.53675184877892,
  		-0.253135560026742
  	],
  	[
  		16.32775524521378,
  		-11.534084622756499,
  		-0.2555600190747842
  	],
  	[
  		16.32761225745514,
  		-11.530583021542089,
  		-0.2559175599235395
  	],
  	[
  		16.3294557324143,
  		-11.52714001915869,
  		-0.2535492943137697
  	],
  	[
  		16.33402116185309,
  		-11.52454158896588,
  		-0.2529821325053234
  	],
  	[
  		16.33689197886771,
  		-11.52197077291309,
  		-0.2553063041132791
  	],
  	[
  		16.33686230497517,
  		-11.518563398168311,
  		-0.2561748384393767
  	],
  	[
  		16.33819889018536,
  		-11.515030080450881,
  		-0.2539648463731466
  	],
  	[
  		16.34259720273203,
  		-11.51232531003474,
  		-0.2529006821408387
  	],
  	[
  		16.34594725852677,
  		-11.509829416025319,
  		-0.2550153043835754
  	],
  	[
  		16.34613771973397,
  		-11.50653411889442,
  		-0.2563546244575993
  	],
  	[
  		16.34701014111937,
  		-11.50293447039468,
  		-0.2544088449774919
  	],
  	[
  		16.35113803816781,
  		-11.50010784882152,
  		-0.252899214854172
  	],
  	[
  		16.35491345663984,
  		-11.497661390301941,
  		-0.2547051288337809
  	],
  	[
  		16.35542019060518,
  		-11.494490413257381,
  		-0.2564513501760999
  	],
  	[
  		16.355893230187412,
  		-11.49085170598912,
  		-0.2548645293726895
  	],
  	[
  		16.35965834850849,
  		-11.48789288952319,
  		-0.252981051104425
  	],
  	[
  		16.36378717713967,
  		-11.485468399151271,
  		-0.2543934436664747
  	],
  	[
  		16.364690846019002,
  		-11.482428072950679,
  		-0.25646441412551463
  	],
  	[
  		16.36484944891449,
  		-11.478779366292,
  		-0.25531226349409847
  	],
  	[
  		16.368178477440082,
  		-11.47568482163069,
  		-0.25314565981822973
  	],
  	[
  		16.372570783754078,
  		-11.47325341238766,
  		-0.2540979487443287
  	],
  	[
  		16.37393388849206,
  		-11.47034393186934,
  		-0.256395886773558
  	],
  	[
  		16.37387698414337,
  		-11.46671464127294,
  		-0.2557344923868354
  	],
  	[
  		16.37671611684705,
  		-11.463486988556511,
  		-0.25338910690466737
  	],
  	[
  		16.38126934937597,
  		-11.461020048309749,
  		-0.2538367348873644
  	],
  	[
  		16.383131588543208,
  		-11.45823522272672,
  		-0.2562537693623747
  	],
  	[
  		16.38296777006024,
  		-11.454653456349831,
  		-0.2561144232380748
  	],
  	[
  		16.38528657704263,
  		-11.451301615197501,
  		-0.2537031415602867
  	],
  	[
  		16.38988977491422,
  		-11.448771821736521,
  		-0.2536242333312157
  	],
  	[
  		16.392267594582982,
  		-11.44609958358128,
  		-0.256046840954197
  	],
  	[
  		16.39211077839269,
  		-11.442591180429268,
  		-0.2564359475935294
  	],
  	[
  		16.39390445143544,
  		-11.439130253625791,
  		-0.2540758006763147
  	],
  	[
  		16.39844449147988,
  		-11.4365133352387,
  		-0.253474020851626
  	],
  	[
  		16.40133090201449,
  		-11.4339365239739,
  		-0.2557889508965712
  	],
  	[
  		16.40129399323304,
  		-11.430523708421829,
  		-0.25668833373226313
  	],
  	[
  		16.40258271966427,
  		-11.42697384376363,
  		-0.254493222115677
  	],
  	[
  		16.40694887423117,
  		-11.42424957241053,
  		-0.2533977161207433
  	],
  	[
  		16.41031108895451,
  		-11.42174603440697,
  		-0.255496494799398
  	],
  	[
  		16.41050118023938,
  		-11.418446281355742,
  		-0.2568627906159113
  	],
  	[
  		16.41132896401988,
  		-11.41483179791501,
  		-0.2549390464131328
  	],
  	[
  		16.415417559859613,
  		-11.411984541145351,
  		-0.25340106021549963
  	],
  	[
  		16.41920222748618,
  		-11.40952892549993,
  		-0.25518467443839293
  	],
  	[
  		16.41971376320799,
  		-11.4063540259847,
  		-0.25695341772603764
  	],
  	[
  		16.42014765234554,
  		-11.402702302119609,
  		-0.2553929724342758
  	],
  	[
  		16.42386845656004,
  		-11.39972263037815,
  		-0.25348736961038115
  	],
  	[
  		16.42800100126417,
  		-11.397287065518679,
  		-0.25487224218305354
  	],
  	[
  		16.42891493662555,
  		-11.394243237293109,
  		-0.2569600083167985
  	],
  	[
  		16.42904014733718,
  		-11.39058350796974,
  		-0.2558394068324554
  	],
  	[
  		16.432320166709758,
  		-11.38746794769499,
  		-0.2536568283683962
  	],
  	[
  		16.43671039244278,
  		-11.385023758715839,
  		-0.25457832660149704
  	],
  	[
  		16.43808612813974,
  		-11.38211039701124,
  		-0.2568864455395184
  	],
  	[
  		16.43800295869492,
  		-11.37847193407044,
  		-0.25625856794397933
  	],
  	[
  		16.4407899969531,
  		-11.37522362843253,
  		-0.2539045883995237
  	],
  	[
  		16.44533401275445,
  		-11.372741934647179,
  		-0.25431833451568064
  	],
  	[
  		16.44721114449904,
  		-11.36995272265342,
  		-0.2567382091871001
  	],
  	[
  		16.447028370011548,
  		-11.36636352543827,
  		-0.2566332669810774
  	],
  	[
  		16.44929432637027,
  		-11.36299193772527,
  		-0.25422101925992985
  	],
  	[
  		16.45388108887339,
  		-11.360445769727601,
  		-0.25410782669578513
  	],
  	[
  		16.4562740567441,
  		-11.357768259759979,
  		-0.2565263475592257
  	],
  	[
  		16.45610585600712,
  		-11.35425404988192,
  		-0.25694948723630373
  	],
  	[
  		16.45784693216927,
  		-11.35077453290891,
  		-0.25459619582439713
  	],
  	[
  		16.46236330265968,
  		-11.34813982615821,
  		-0.2539612427220486
  	],
  	[
  		16.4652627088841,
  		-11.3455563085023,
  		-0.2562650099721157
  	],
  	[
  		16.4652217153184,
  		-11.34213889430331,
  		-0.2571954617049612
  	],
  	[
  		16.46645999310042,
  		-11.33857195045656,
  		-0.2550145934443915
  	],
  	[
  		16.470795145923468,
  		-11.335828557469249,
  		-0.2538877586739949
  	],
  	[
  		16.47416811101892,
  		-11.333316937584922,
  		-0.2559688655003535
  	],
  	[
  		16.474360027482028,
  		-11.33001339584874,
  		-0.257362603382566
  	],
  	[
  		16.47514175121144,
  		-11.32638364715087,
  		-0.2554591325420757
  	],
  	[
  		16.47919337558184,
  		-11.323516662396571,
  		-0.2538947685083286
  	],
  	[
  		16.48298382478588,
  		-11.321051095522929,
  		-0.2556549580986603
  	],
  	[
  		16.48350345206262,
  		-11.317873094491471,
  		-0.2574460697904709
  	],
  	[
  		16.4838957118867,
  		-11.31420796873469,
  		-0.25591222868404173
  	],
  	[
  		16.48757418018375,
  		-11.31120800264733,
  		-0.2539845245771531
  	],
  	[
  		16.49170743067323,
  		-11.30876084590837,
  		-0.2553420358219302
  	],
  	[
  		16.49263259428914,
  		-11.305713726460919,
  		-0.25744571432081603
  	],
  	[
  		16.49272310595876,
  		-11.302042594766919,
  		-0.25635507597692603
  	],
  	[
  		16.49595671173276,
  		-11.29890683355412,
  		-0.25415741243061213
  	],
  	[
  		16.50034102369775,
  		-11.296449062447651,
  		-0.2550475400335898
  	],
  	[
  		16.50173174918337,
  		-11.293532356907342,
  		-0.25736513972913083
  	],
  	[
  		16.50162012742171,
  		-11.2898842968608,
  		-0.2567702846642228
  	],
  	[
  		16.50435878354071,
  		-11.28661626491355,
  		-0.2544076703171369
  	],
  	[
  		16.5088901871707,
  		-11.2841194374027,
  		-0.2547893437207129
  	],
  	[
  		16.5107829738752,
  		-11.28132598656568,
  		-0.257211083744321
  	],
  	[
  		16.51057944055208,
  		-11.2777290500404,
  		-0.2571403260045786
  	],
  	[
  		16.51279538083022,
  		-11.27433842184087,
  		-0.2547268918504485
  	],
  	[
  		16.51736243036369,
  		-11.271775473202869,
  		-0.25458087433933463
  	],
  	[
  		16.51977104343588,
  		-11.26909273650914,
  		-0.2569940579252935
  	],
  	[
  		16.51958896723445,
  		-11.26557219206908,
  		-0.25745055730438454
  	],
  	[
  		16.521281136375528,
  		-11.2620748764701,
  		-0.2551032241696149
  	],
  	[
  		16.525770921545572,
  		-11.259422119493381,
  		-0.254437069115141
  	],
  	[
  		16.52868462124206,
  		-11.256832112611729,
  		-0.2567284383481229
  	],
  	[
  		16.52863691510358,
  		-11.25340971855515,
  		-0.2576906390411711
  	],
  	[
  		16.52982825038847,
  		-11.24982637104041,
  		-0.2555226254456334
  	],
  	[
  		16.53413042874769,
  		-11.247063994477951,
  		-0.25436788922576004
  	],
  	[
  		16.53751404291422,
  		-11.24454416907503,
  		-0.2564299023484575
  	],
  	[
  		16.53770579495351,
  		-11.24123659600796,
  		-0.2578518174940891
  	],
  	[
  		16.53844342869928,
  		-11.23759193269765,
  		-0.25596739346140784
  	],
  	[
  		16.54245620437289,
  		-11.23470517571409,
  		-0.2543786647911277
  	],
  	[
  		16.54625331005122,
  		-11.23222978486248,
  		-0.2561143231940644
  	],
  	[
  		16.5467779716913,
  		-11.22904820043881,
  		-0.2579285639650826
  	],
  	[
  		16.5471317278225,
  		-11.225370086156481,
  		-0.2564187789655236
  	],
  	[
  		16.55076638687417,
  		-11.222350123769049,
  		-0.25447288207369734
  	],
  	[
  		16.55490100652746,
  		-11.219891294359382,
  		-0.2558008103156734
  	],
  	[
  		16.555836558983643,
  		-11.21684106984107,
  		-0.2579225341600176
  	],
  	[
  		16.555893332593257,
  		-11.21315861178939,
  		-0.25686036257009465
  	],
  	[
  		16.55907980455383,
  		-11.210002931948571,
  		-0.2546502692020012
  	],
  	[
  		16.5634588033287,
  		-11.20753169283306,
  		-0.2555083583910744
  	],
  	[
  		16.56486242159292,
  		-11.20461141350916,
  		-0.25783659124514474
  	],
  	[
  		16.56472410713005,
  		-11.20095392893534,
  		-0.2572727257749599
  	],
  	[
  		16.567412441461208,
  		-11.19766628548109,
  		-0.2549048853926653
  	],
  	[
  		16.57193189281599,
  		-11.195154121508539,
  		-0.2552514657136749
  	],
  	[
  		16.573840088879138,
  		-11.192356776266902,
  		-0.2576774721963898
  	],
  	[
  		16.573616473475848,
  		-11.18875197761772,
  		-0.2576384628909639
  	],
  	[
  		16.57578232798672,
  		-11.18534279614696,
  		-0.2552270127339008
  	],
  	[
  		16.580330018658998,
  		-11.18276296381694,
  		-0.2550463827502481
  	],
  	[
  		16.58275439473986,
  		-11.18007536204578,
  		-0.2574561898154018
  	],
  	[
  		16.582559853918998,
  		-11.17654867177627,
  		-0.25794470895603433
  	],
  	[
  		16.58420179829697,
  		-11.17303381889533,
  		-0.2556068468253248
  	],
  	[
  		16.588664807568282,
  		-11.17036267682588,
  		-0.2549069043053465
  	],
  	[
  		16.59159282424064,
  		-11.16776656366893,
  		-0.2571881467707069
  	],
  	[
  		16.59153899227372,
  		-11.16433906249063,
  		-0.2581797661012963
  	],
  	[
  		16.59268285440739,
  		-11.16073972077525,
  		-0.2560279555850795
  	],
  	[
  		16.59695096145541,
  		-11.15795771974516,
  		-0.2548419572856404
  	],
  	[
  		16.60034675929094,
  		-11.1554303481961,
  		-0.2568867532636027
  	],
  	[
  		16.60053921210752,
  		-11.15211870818454,
  		-0.25833473134839463
  	],
  	[
  		16.60123358250523,
  		-11.14845984673032,
  		-0.25647274773564893
  	],
  	[
  		16.60520619691414,
  		-11.14555277625265,
  		-0.2548573483276344
  	],
  	[
  		16.60901135898532,
  		-11.143068134560949,
  		-0.2565699297761433
  	],
  	[
  		16.60954219988833,
  		-11.13988309630546,
  		-0.25840591867106205
  	],
  	[
  		16.60985739170233,
  		-11.13619256785994,
  		-0.2569239547682966
  	],
  	[
  		16.61344632426996,
  		-11.133151838958899,
  		-0.2549568436920067
  	],
  	[
  		16.617583323265983,
  		-11.1306818767277,
  		-0.25625701363048375
  	],
  	[
  		16.61852888335138,
  		-11.12762815448968,
  		-0.2583940418446607
  	],
  	[
  		16.6185539784856,
  		-11.123935312493959,
  		-0.2573633833065953
  	],
  	[
  		16.62169034441947,
  		-11.12075883162283,
  		-0.25513868203603673
  	],
  	[
  		16.62606598041027,
  		-11.11827458931874,
  		-0.2559645099850692
  	],
  	[
  		16.62748315829212,
  		-11.11535076062912,
  		-0.2583019806858932
  	],
  	[
  		16.627319849102832,
  		-11.111684650611291,
  		-0.25777168134522327
  	],
  	[
  		16.62995652960484,
  		-11.10837690075694,
  		-0.25539662085470843
  	],
  	[
  		16.634465025495352,
  		-11.10584991282531,
  		-0.25570972446208723
  	],
  	[
  		16.63638802822545,
  		-11.103048225289509,
  		-0.25813719363111043
  	],
  	[
  		16.63614705647987,
  		-11.099436694754381,
  		-0.2581332600243677
  	],
  	[
  		16.63825925391016,
  		-11.09600806691222,
  		-0.2557224417569392
  	],
  	[
  		16.64278907256504,
  		-11.09341174659306,
  		-0.2555071685929291
  	],
  	[
  		16.64522779626624,
  		-11.09071881332968,
  		-0.2579119291316666
  	],
  	[
  		16.64502287200096,
  		-11.08718664047448,
  		-0.2584334253208224
  	],
  	[
  		16.64661305470879,
  		-11.083653837965299,
  		-0.2561039196504591
  	],
  	[
  		16.65105051370791,
  		-11.08096473528507,
  		-0.2553707528130429
  	],
  	[
  		16.65399163109694,
  		-11.078361924270459,
  		-0.25763896578517914
  	],
  	[
  		16.65393486201788,
  		-11.074930338579222,
  		-0.2586617896931053
  	],
  	[
  		16.655028941003668,
  		-11.07131445257065,
  		-0.2565252655050041
  	],
  	[
  		16.65926527349988,
  		-11.06851355954483,
  		-0.2553090723872634
  	],
  	[
  		16.6626703305745,
  		-11.065977873084341,
  		-0.25733513172687433
  	],
  	[
  		16.66286580972123,
  		-11.062662835072949,
  		-0.2588097351518354
  	],
  	[
  		16.66351449775514,
  		-11.05898930461426,
  		-0.25696999803855053
  	],
  	[
  		16.66744861360812,
  		-11.05606244238886,
  		-0.2553284363761777
  	],
  	[
  		16.67125877721302,
  		-11.05356777232724,
  		-0.25701653811648273
  	],
  	[
  		16.67179788174474,
  		-11.05037974809145,
  		-0.2588737310693165
  	],
  	[
  		16.67207282230797,
  		-11.04667642291657,
  		-0.2574188452867358
  	],
  	[
  		16.675618566104,
  		-11.04361566152649,
  		-0.25543115811277034
  	],
  	[
  		16.67975498655261,
  		-11.04113386443176,
  		-0.2567025176255368
  	],
  	[
  		16.68071309733196,
  		-11.038077249557801,
  		-0.25885453731536573
  	],
  	[
  		16.68070395158813,
  		-11.034373506202272,
  		-0.2578550432608642
  	],
  	[
  		16.68379351048477,
  		-11.03117711943884,
  		-0.2556163109348047
  	],
  	[
  		16.68816175691339,
  		-11.02867924696827,
  		-0.25641104229916384
  	],
  	[
  		16.68959382594737,
  		-11.02575201953834,
  		-0.25875604200775254
  	],
  	[
  		16.689403458732922,
  		-11.02207696066867,
  		-0.2582595537623592
  	],
  	[
  		16.69199034177508,
  		-11.018749600664659,
  		-0.2558772370967911
  	],
  	[
  		16.69648523830049,
  		-11.016207378453839,
  		-0.2561573794152761
  	],
  	[
  		16.69842405976812,
  		-11.013401556167699,
  		-0.2585854891114631
  	],
  	[
  		16.69816334278154,
  		-11.00978268606185,
  		-0.2586153219737316
  	],
  	[
  		16.70022579901906,
  		-11.00633553265634,
  		-0.2562048988249981
  	],
  	[
  		16.7047341810771,
  		-11.00372235215265,
  		-0.2559572292566113
  	],
  	[
  		16.70718883183623,
  		-11.00102424613741,
  		-0.2583548708485714
  	],
  	[
  		16.70697138550009,
  		-10.99748636476229,
  		-0.25891040134864374
  	],
  	[
  		16.70851183559273,
  		-10.993935988558569,
  		-0.2565880707906909
  	],
  	[
  		16.71292162165351,
  		-10.99122891810055,
  		-0.2558242919405605
  	],
  	[
  		16.71587582381023,
  		-10.98861944514499,
  		-0.2580790387219387
  	],
  	[
  		16.71581374847801,
  		-10.98518325356438,
  		-0.2591323543271873
  	],
  	[
  		16.71686084529553,
  		-10.981551417054249,
  		-0.2570102864489006
  	],
  	[
  		16.721062335695322,
  		-10.978731361080381,
  		-0.2557661008322747
  	],
  	[
  		16.7244781045369,
  		-10.97618755031884,
  		-0.2577718012280018
  	],
  	[
  		16.72467440125328,
  		-10.97286884616902,
  		-0.2592739053675858
  	],
  	[
  		16.7252799034613,
  		-10.96918093981093,
  		-0.2574539028193756
  	],
  	[
  		16.72917400770616,
  		-10.966234515036351,
  		-0.25578956050386903
  	],
  	[
  		16.732989617253573,
  		-10.96372987002113,
  		-0.2574521808875841
  	],
  	[
  		16.733535222947168,
  		-10.96053873698006,
  		-0.25933182336088273
  	],
  	[
  		16.73377172841663,
  		-10.956822896521441,
  		-0.25790249985772623
  	],
  	[
  		16.73727219334469,
  		-10.95374214667652,
  		-0.2558971956901677
  	],
  	[
  		16.74140863080477,
  		-10.951248571395931,
  		-0.2571385552398689
  	],
  	[
  		16.742377200136993,
  		-10.948188893829748,
  		-0.2593069971344166
  	],
  	[
  		16.74233578024035,
  		-10.94447443588635,
  		-0.25833622761979264
  	],
  	[
  		16.745376856421338,
  		-10.94125825437984,
  		-0.2560862510310694
  	],
  	[
  		16.74973866044256,
  		-10.93874671363912,
  		-0.2568474479959162
  	],
  	[
  		16.75118464035127,
  		-10.93581629643899,
  		-0.2592023922040808
  	],
  	[
  		16.75096866267984,
  		-10.93213234885316,
  		-0.2587371592801274
  	],
  	[
  		16.75350537718906,
  		-10.92878588212356,
  		-0.25635112690003503
  	],
  	[
  		16.75798632449885,
  		-10.926228181664419,
  		-0.25659643206293054
  	],
  	[
  		16.75994071166701,
  		-10.9234185801058,
  		-0.2590274908885561
  	],
  	[
  		16.75966111464436,
  		-10.91979250794165,
  		-0.2590900041624121
  	],
  	[
  		16.76167241454088,
  		-10.91632701069244,
  		-0.2566828259484106
  	],
  	[
  		16.76615971374847,
  		-10.91369677045414,
  		-0.25640006471249893
  	],
  	[
  		16.76862944009536,
  		-10.91099375136747,
  		-0.2587931245222802
  	],
  	[
  		16.76840052775956,
  		-10.907450093014571,
  		-0.2593797757456393
  	],
  	[
  		16.769891384276868,
  		-10.903882782895451,
  		-0.25706828419685984
  	],
  	[
  		16.7742723909581,
  		-10.9011571296707,
  		-0.2562704647463687
  	],
  	[
  		16.777241311741932,
  		-10.89854166789146,
  		-0.2585132915584068
  	],
  	[
  		16.77717428166955,
  		-10.89510096363117,
  		-0.2595964386813636
  	],
  	[
  		16.778174564251508,
  		-10.89145371694957,
  		-0.2574916963443052
  	],
  	[
  		16.78234088304704,
  		-10.8886142503712,
  		-0.2562174754439464
  	],
  	[
  		16.785767392223082,
  		-10.88606270256173,
  		-0.25820478659052004
  	],
  	[
  		16.78596544142653,
  		-10.88274039252655,
  		-0.2597325278755117
  	],
  	[
  		16.78652774585659,
  		-10.87903884645571,
  		-0.25793678829876904
  	],
  	[
  		16.79037980739501,
  		-10.87607202307076,
  		-0.2562460040622676
  	],
  	[
  		16.794202450301942,
  		-10.87355800730722,
  		-0.25788415652334573
  	],
  	[
  		16.79475438657833,
  		-10.87036359603109,
  		-0.2597844229567483
  	],
  	[
  		16.79495362901984,
  		-10.86663597645738,
  		-0.2583832837886824
  	],
  	[
  		16.79840743900229,
  		-10.8635347470356,
  		-0.25635811983467044
  	],
  	[
  		16.80254509064667,
  		-10.86102986272964,
  		-0.25757007432354023
  	],
  	[
  		16.80352508210469,
  		-10.85796718919025,
  		-0.2597529926315085
  	],
  	[
  		16.80345262661737,
  		-10.85424296885578,
  		-0.2588149837522981
  	],
  	[
  		16.80644314490128,
  		-10.851006378392348,
  		-0.2565516878973541
  	],
  	[
  		16.81079997109055,
  		-10.84848181932383,
  		-0.2572807823549336
  	],
  	[
  		16.81225931661205,
  		-10.84554789636737,
  		-0.25964328821045884
  	],
  	[
  		16.81201944905892,
  		-10.84185599632276,
  		-0.2592124406943884
  	],
  	[
  		16.8145029290593,
  		-10.83848961701072,
  		-0.2568207598051309
  	],
  	[
  		16.818971545148752,
  		-10.83591697960622,
  		-0.2570315851966991
  	],
  	[
  		16.82094064039464,
  		-10.83310315396955,
  		-0.2594627529899411
  	],
  	[
  		16.82064460178761,
  		-10.82947078761048,
  		-0.2595596893318404
  	],
  	[
  		16.82260253091797,
  		-10.82598645125774,
  		-0.25715468851132645
  	],
  	[
  		16.82707030912574,
  		-10.82333972457903,
  		-0.25683748291614855
  	],
  	[
  		16.82955464605532,
  		-10.82063150303024,
  		-0.2592235809608005
  	],
  	[
  		16.82931679380417,
  		-10.81708307634726,
  		-0.2598436538068165
  	],
  	[
  		16.83075531879377,
  		-10.813498230285,
  		-0.2575419474798851
  	],
  	[
  		16.835109696747132,
  		-10.810754826829122,
  		-0.2567116454645948
  	],
  	[
  		16.8380903517002,
  		-10.808132594159881,
  		-0.25894057605411475
  	],
  	[
  		16.83802149306436,
  		-10.80468821600104,
  		-0.260053623194253
  	],
  	[
  		16.83897196077841,
  		-10.80102503117124,
  		-0.25796606313821
  	],
  	[
  		16.84310437130143,
  		-10.79816656855725,
  		-0.2566617147555334
  	],
  	[
  		16.84653987342297,
  		-10.79560683534323,
  		-0.2586290809595271
  	],
  	[
  		16.84674156550642,
  		-10.79228147418997,
  		-0.2601823920322575
  	],
  	[
  		16.84725915873398,
  		-10.788565900012099,
  		-0.25840938659285645
  	],
  	[
  		16.85107164827738,
  		-10.78557961936534,
  		-0.2566939460221822
  	],
  	[
  		16.854897963595448,
  		-10.78305551261005,
  		-0.2583066470808276
  	],
  	[
  		16.85545955971795,
  		-10.77985863097396,
  		-0.2602269880531085
  	],
  	[
  		16.85561890533451,
  		-10.77611885760805,
  		-0.2588543405309083
  	],
  	[
  		16.85902824638784,
  		-10.77299779092977,
  		-0.2568093590615836
  	],
  	[
  		16.86316398403376,
  		-10.770481159599681,
  		-0.25799257264084224
  	],
  	[
  		16.86415617825203,
  		-10.767415659111709,
  		-0.26018879130635847
  	],
  	[
  		16.86405112211632,
  		-10.76368130550222,
  		-0.2592821560570029
  	],
  	[
  		16.866993405038958,
  		-10.76042508334332,
  		-0.2570063241662803
  	],
  	[
  		16.87134154742376,
  		-10.75788683639596,
  		-0.2577032066016829
  	],
  	[
  		16.87281624990927,
  		-10.754949881422531,
  		-0.2600723838082398
  	],
  	[
  		16.872550361697648,
  		-10.75124962210994,
  		-0.2596751572708885
  	],
  	[
  		16.874984334687937,
  		-10.74786427119095,
  		-0.25727757117697275
  	],
  	[
  		16.87943728465533,
  		-10.74527640392917,
  		-0.2574559427534679
  	],
  	[
  		16.88142201143854,
  		-10.74245857598813,
  		-0.25988618338106545
  	],
  	[
  		16.88110762187586,
  		-10.73881964198697,
  		-0.2600174066932497
  	],
  	[
  		16.88301503381848,
  		-10.7353171653556,
  		-0.2576139547971315
  	],
  	[
  		16.887459940361428,
  		-10.73265365875951,
  		-0.2572643525519288
  	],
  	[
  		16.88995909152131,
  		-10.72994029190941,
  		-0.2596424211358889
  	],
  	[
  		16.88970989152822,
  		-10.726386645935271,
  		-0.2602953012978035
  	],
  	[
  		16.89109952122801,
  		-10.72278501289988,
  		-0.258002221120455
  	],
  	[
  		16.8954242935025,
  		-10.72002364204643,
  		-0.25714145682570233
  	],
  	[
  		16.89841795883484,
  		-10.717394934120541,
  		-0.2593554663440035
  	],
  	[
  		16.89834467653607,
  		-10.71394655588998,
  		-0.2604990483054728
  	],
  	[
  		16.89924902494623,
  		-10.71026811299137,
  		-0.2584266304019576
  	],
  	[
  		16.903345614153,
  		-10.707390899157222,
  		-0.2570958626313292
  	],
  	[
  		16.90678991271638,
  		-10.70482288118977,
  		-0.259041781320952
  	],
  	[
  		16.90699345306594,
  		-10.701494385269761,
  		-0.26062183615388873
  	],
  	[
  		16.90746815010798,
  		-10.697765111157631,
  		-0.25887001711152
  	],
  	[
  		16.91123932874921,
  		-10.694759445331218,
  		-0.2571321430357945
  	],
  	[
  		16.91506986399841,
  		-10.69222538839531,
  		-0.2587184886883162
  	],
  	[
  		16.91563804121657,
  		-10.68902563742432,
  		-0.2606598899360523
  	],
  	[
  		16.91576060668105,
  		-10.6852741564241,
  		-0.2593130206376311
  	],
  	[
  		16.91912414321376,
  		-10.68213361765281,
  		-0.2572519683651333
  	],
  	[
  		16.92325851435909,
  		-10.67960515491432,
  		-0.2584039569560805
  	],
  	[
  		16.92426225878279,
  		-10.67653714348424,
  		-0.2606158423860285
  	],
  	[
  		16.92412552561471,
  		-10.67279274522386,
  		-0.2597388117867475
  	],
  	[
  		16.92701936248197,
  		-10.66951735226396,
  		-0.2574531495446515
  	],
  	[
  		16.9313590809673,
  		-10.666965494418239,
  		-0.258117004910558
  	],
  	[
  		16.93284729918706,
  		-10.664025429654899,
  		-0.260494296646667
  	],
  	[
  		16.93255690318409,
  		-10.66031702163798,
  		-0.26012890831411
  	],
  	[
  		16.93493969654759,
  		-10.656912942485539,
  		-0.2577289003046862
  	],
  	[
  		16.9393774741106,
  		-10.65430966892219,
  		-0.25787183683801457
  	],
  	[
  		16.94137748372397,
  		-10.65148820750299,
  		-0.2603034929687435
  	],
  	[
  		16.94104532814255,
  		-10.647842614596339,
  		-0.260466529773091
  	],
  	[
  		16.94290239805217,
  		-10.644322601086671,
  		-0.2580678255596714
  	],
  	[
  		16.94732475847705,
  		-10.64164221161379,
  		-0.2576836745282087
  	],
  	[
  		16.94983915305047,
  		-10.63892415021602,
  		-0.2600554343364952
  	],
  	[
  		16.949579688716582,
  		-10.63536546340395,
  		-0.2607398264000231
  	],
  	[
  		16.95091963958768,
  		-10.631747495957299,
  		-0.25845901131640703
  	],
  	[
  		16.95521454866695,
  		-10.62896789481552,
  		-0.2575654289018489
  	],
  	[
  		16.95822136975929,
  		-10.626333143044072,
  		-0.2597665635643893
  	],
  	[
  		16.958144077619032,
  		-10.62288068919063,
  		-0.2609386119281962
  	],
  	[
  		16.95900179166586,
  		-10.619187509984108,
  		-0.2588850806904762
  	],
  	[
  		16.96306146005805,
  		-10.6162909490019,
  		-0.2575244822194481
  	],
  	[
  		16.96651611766075,
  		-10.613715343434711,
  		-0.25945068795573933
  	],
  	[
  		16.9667220570927,
  		-10.61038361095446,
  		-0.2610550175050259
  	],
  	[
  		16.96715498119786,
  		-10.60664146367942,
  		-0.2593277377330287
  	],
  	[
  		16.97088339207161,
  		-10.60361589994436,
  		-0.25756519959569174
  	],
  	[
  		16.97471985016493,
  		-10.60107252311546,
  		-0.2591262212915657
  	],
  	[
  		16.97529566619548,
  		-10.59787005859975,
  		-0.2610872716954158
  	],
  	[
  		16.97538162699993,
  		-10.594107533543632,
  		-0.2597698714291076
  	],
  	[
  		16.97869746547055,
  		-10.590946871731921,
  		-0.25769021994196145
  	],
  	[
  		16.98283163457018,
  		-10.58840722429032,
  		-0.2588129978823722
  	],
  	[
  		16.983846350034717,
  		-10.58533629077689,
  		-0.261037648336011
  	],
  	[
  		16.983680173719108,
  		-10.58158287516857,
  		-0.26019328529802105
  	],
  	[
  		16.98652224266311,
  		-10.57828742494644,
  		-0.257895832498767
  	],
  	[
  		16.99085565433882,
  		-10.575722497910892,
  		-0.2585264147990574
  	],
  	[
  		16.99235772890876,
  		-10.572779284494839,
  		-0.26091016719787324
  	],
  	[
  		16.99204472449415,
  		-10.56906352486175,
  		-0.2605785647120422
  	],
  	[
  		16.9943749602411,
  		-10.5656402811445,
  		-0.2581743629532056
  	],
  	[
  		16.99879864550569,
  		-10.56302216024597,
  		-0.2582834019703804
  	],
  	[
  		17.00081334655288,
  		-10.560196677878839,
  		-0.26071380303161573
  	],
  	[
  		17.000466450477948,
  		-10.556545604996842,
  		-0.26091159668363983
  	],
  	[
  		17.0022697116948,
  		-10.55300725616217,
  		-0.2585165642546227
  	],
  	[
  		17.00667111687661,
  		-10.55031048886488,
  		-0.2580982133629117
  	],
  	[
  		17.00919896638426,
  		-10.54758726206986,
  		-0.2604623020082162
  	],
  	[
  		17.008931649806527,
  		-10.54402423589103,
  		-0.2611786860052108
  	],
  	[
  		17.01022019132515,
  		-10.540389508592309,
  		-0.258909024523767
  	],
  	[
  		17.01448641121701,
  		-10.5375921079469,
  		-0.25798310440883604
  	],
  	[
  		17.01750486293669,
  		-10.534950734800809,
  		-0.2601688449318897
  	],
  	[
  		17.01742675736867,
  		-10.53149515358932,
  		-0.261370408054912
  	],
  	[
  		17.0182358965425,
  		-10.52778676281471,
  		-0.25933463281529334
  	],
  	[
  		17.02226090261474,
  		-10.52487161626747,
  		-0.2579453759848299
  	],
  	[
  		17.025722970723407,
  		-10.52228772937261,
  		-0.2598507705742999
  	],
  	[
  		17.02593387088035,
  		-10.51895347534246,
  		-0.26147975582842503
  	],
  	[
  		17.02632281194522,
  		-10.51519804925372,
  		-0.2597768292561026
  	],
  	[
  		17.03001042534428,
  		-10.51215319066899,
  		-0.2579901090498435
  	],
  	[
  		17.033849397075972,
  		-10.50959975587334,
  		-0.2595251363529276
  	],
  	[
  		17.034434771749282,
  		-10.50639496660251,
  		-0.2615048833073702
  	],
  	[
  		17.03448263756089,
  		-10.502621064088839,
  		-0.2602161588037968
  	],
  	[
  		17.03775331364757,
  		-10.49944098410074,
  		-0.2581182472306933
  	],
  	[
  		17.04188417958768,
  		-10.496889461895261,
  		-0.25921100890584164
  	],
  	[
  		17.04291212082409,
  		-10.49381615152301,
  		-0.26144808514372814
  	],
  	[
  		17.04271423053017,
  		-10.490053235358609,
  		-0.2606357739027228
  	],
  	[
  		17.0455083322687,
  		-10.48673871989415,
  		-0.2583269644569746
  	],
  	[
  		17.04983140085228,
  		-10.48416015676562,
  		-0.2589258649192185
  	],
  	[
  		17.05134860036208,
  		-10.481213928029788,
  		-0.26131434028779993
  	],
  	[
  		17.05101114049629,
  		-10.477490584874541,
  		-0.2610170780622001
  	],
  	[
  		17.05329094904056,
  		-10.474048685777719,
  		-0.2586082965477499
  	],
  	[
  		17.05769801564377,
  		-10.471415390335721,
  		-0.2586843868495627
  	],
  	[
  		17.05972799460065,
  		-10.468585980279439,
  		-0.2611125961373018
  	],
  	[
  		17.05936388321008,
  		-10.464928808185409,
  		-0.261343921341542
  	],
  	[
  		17.06111740107768,
  		-10.46137304118178,
  		-0.2589520941093933
  	],
  	[
  		17.06549445465152,
  		-10.45865955565138,
  		-0.2585018108342804
  	],
  	[
  		17.06803729645415,
  		-10.455931288203718,
  		-0.2608560561021546
  	],
  	[
  		17.06775989470885,
  		-10.45236369671009,
  		-0.2616057141452605
  	],
  	[
  		17.06899944027866,
  		-10.44871263958725,
  		-0.2593458848245459
  	],
  	[
  		17.07323535345456,
  		-10.44589757242081,
  		-0.25839055307456943
  	],
  	[
  		17.07626533555887,
  		-10.443249540850982,
  		-0.26056018523438235
  	],
  	[
  		17.076184121101882,
  		-10.439790378001451,
  		-0.261791036488355
  	],
  	[
  		17.07694727615398,
  		-10.43606729449255,
  		-0.2597721008332035
  	],
  	[
  		17.08093505271507,
  		-10.433133400040939,
  		-0.25835652184380814
  	],
  	[
  		17.08440570034663,
  		-10.43054131194452,
  		-0.26023928785817974
  	],
  	[
  		17.08461920518895,
  		-10.427204230350819,
  		-0.2618939195219558
  	],
  	[
  		17.08496656072898,
  		-10.42343576669299,
  		-0.26021278637384343
  	],
  	[
  		17.08861211854354,
  		-10.4203718856566,
  		-0.2584053605475012
  	],
  	[
  		17.09245430842031,
  		-10.41780842637952,
  		-0.2599130276919952
  	],
  	[
  		17.09304777142174,
  		-10.41460126977002,
  		-0.26191303174825664
  	],
  	[
  		17.09305914577962,
  		-10.410816191141329,
  		-0.2606514411576415
  	],
  	[
  		17.096283119432208,
  		-10.40761685524187,
  		-0.2585384475608739
  	],
  	[
  		17.100411197376012,
  		-10.405053459979701,
  		-0.2595999653834593
  	],
  	[
  		17.10145070823993,
  		-10.401977658475058,
  		-0.2618508503856202
  	],
  	[
  		17.101222565154337,
  		-10.39820531642831,
  		-0.2610684070165109
  	],
  	[
  		17.10396698090877,
  		-10.39487180095524,
  		-0.2587510470214086
  	],
  	[
  		17.108280675832198,
  		-10.392279511286631,
  		-0.2593156915713674
  	],
  	[
  		17.1098122290593,
  		-10.389330484354911,
  		-0.26171131445881934
  	],
  	[
  		17.109451585434662,
  		-10.385599507766969,
  		-0.26144563027676554
  	],
  	[
  		17.11168073396864,
  		-10.3821394690079,
  		-0.25903600626311263
  	],
  	[
  		17.11607087844572,
  		-10.37949069533334,
  		-0.2590770836297251
  	],
  	[
  		17.11811658791387,
  		-10.37665781702332,
  		-0.2615053642900507
  	],
  	[
  		17.11773613547463,
  		-10.372994654745249,
  		-0.26176926283519547
  	],
  	[
  		17.11943858111026,
  		-10.36942161583664,
  		-0.2593834617161778
  	],
  	[
  		17.1237914797719,
  		-10.366691155704839,
  		-0.2588987458455969
  	],
  	[
  		17.126348729346603,
  		-10.36395811468034,
  		-0.26124567432261564
  	],
  	[
  		17.12606227397204,
  		-10.36038583115365,
  		-0.2620256953491547
  	],
  	[
  		17.12725274748301,
  		-10.356718987847412,
  		-0.2597794062597099
  	],
  	[
  		17.13145678792807,
  		-10.35388546105402,
  		-0.2587910662975426
  	],
  	[
  		17.13450036790896,
  		-10.35123149835533,
  		-0.2609462382407922
  	],
  	[
  		17.13441649151594,
  		-10.347768769866889,
  		-0.262205422499816
  	],
  	[
  		17.13513416850666,
  		-10.344031538180081,
  		-0.2602061147523263
  	],
  	[
  		17.13908404066123,
  		-10.34107850645591,
  		-0.2587621133868697
  	],
  	[
  		17.14256384326115,
  		-10.33847865734762,
  		-0.2606241626398404
  	],
  	[
  		17.14278116593043,
  		-10.335138816745491,
  		-0.2623026388976379
  	],
  	[
  		17.14308713926948,
  		-10.331358024094591,
  		-0.2606477288983529
  	],
  	[
  		17.14668825738699,
  		-10.328274173719489,
  		-0.25881613448825613
  	],
  	[
  		17.15053522842354,
  		-10.32570123933332,
  		-0.2602975511247312
  	],
  	[
  		17.1511364511411,
  		-10.32249144879184,
  		-0.26231599729226013
  	],
  	[
  		17.15111282232392,
  		-10.318695929906042,
  		-0.2610841183072994
  	],
  	[
  		17.1542881257437,
  		-10.315476648614661,
  		-0.2589537570339786
  	],
  	[
  		17.15841489702239,
  		-10.31290180875608,
  		-0.2599843555027222
  	],
  	[
  		17.15946677196763,
  		-10.30982349067715,
  		-0.2622471854285602
  	],
  	[
  		17.15921027031607,
  		-10.30604269628548,
  		-0.26149822768031783
  	],
  	[
  		17.16190295134518,
  		-10.30268952609049,
  		-0.2591703717217647
  	],
  	[
  		17.16620873837743,
  		-10.30008405257135,
  		-0.2597018991681428
  	],
  	[
  		17.16775419685364,
  		-10.29713188929771,
  		-0.2621024641200788
  	],
  	[
  		17.16737234195136,
  		-10.29339421612458,
  		-0.261871564978346
  	],
  	[
  		17.169547680156928,
  		-10.28991517257585,
  		-0.25945934042292523
  	],
  	[
  		17.17392243019373,
  		-10.28725136489637,
  		-0.259465695255251
  	],
  	[
  		17.17598251760014,
  		-10.28441443434986,
  		-0.2618914801743265
  	],
  	[
  		17.17558835220258,
  		-10.28074612817077,
  		-0.26218942614820934
  	],
  	[
  		17.17723749075767,
  		-10.277155296156351,
  		-0.2598089021928066
  	],
  	[
  		17.18156782273324,
  		-10.274408297577871,
  		-0.2592898599484248
  	],
  	[
  		17.18413894326224,
  		-10.27167010733563,
  		-0.2616270776302758
  	],
  	[
  		17.18384602168247,
  		-10.26809405944035,
  		-0.2624395579387778
  	],
  	[
  		17.184985054952232,
  		-10.26441084982914,
  		-0.26020580518578534
  	],
  	[
  		17.18915959757321,
  		-10.26155967097129,
  		-0.2591859708127084
  	],
  	[
  		17.19221354039528,
  		-10.258898864599878,
  		-0.261324650264044
  	],
  	[
  		17.19213008069007,
  		-10.25543335684853,
  		-0.2626124113316126
  	],
  	[
  		17.19279922179559,
  		-10.2516814297636,
  		-0.2606330173982551
  	],
  	[
  		17.19671260332815,
  		-10.248709623214861,
  		-0.2591603721196269
  	],
  	[
  		17.20019951490404,
  		-10.24610145766546,
  		-0.2610003280684987
  	],
  	[
  		17.200422294606582,
  		-10.24275926662132,
  		-0.26270239010379565
  	],
  	[
  		17.20068536750763,
  		-10.238965727867031,
  		-0.2610724475390778
  	],
  	[
  		17.20424469280568,
  		-10.23586277358556,
  		-0.25921811812871354
  	],
  	[
  		17.20809308331977,
  		-10.2332795625854,
  		-0.26067217561137274
  	],
  	[
  		17.2087054223129,
  		-10.23006786156548,
  		-0.26270831812806245
  	],
  	[
  		17.20864400262765,
  		-10.22626144756741,
  		-0.2615065857300041
  	],
  	[
  		17.21177319300794,
  		-10.22302287529291,
  		-0.2593588641765439
  	],
  	[
  		17.215895403901,
  		-10.22043610660976,
  		-0.2603595151708586
  	],
  	[
  		17.216960451378448,
  		-10.217355367097941,
  		-0.26263297262474977
  	],
  	[
  		17.21667369283028,
  		-10.21356569009768,
  		-0.2619166624768966
  	],
  	[
  		17.219316831548312,
  		-10.210193524022719,
  		-0.2595788860742314
  	],
  	[
  		17.223611241569078,
  		-10.20757424779938,
  		-0.26007759497128274
  	],
  	[
  		17.22517234137235,
  		-10.20461926095554,
  		-0.2624818615870476
  	],
  	[
  		17.224767069569282,
  		-10.2008744202846,
  		-0.26228506256832984
  	],
  	[
  		17.22689212885874,
  		-10.19737717505187,
  		-0.2598697107854404
  	],
  	[
  		17.2312483454835,
  		-10.19469804482686,
  		-0.2598434782696974
  	],
  	[
  		17.23332396837097,
  		-10.19185724165683,
  		-0.2622654397697433
  	],
  	[
  		17.232914008941528,
  		-10.188183468610621,
  		-0.26259760813956723
  	],
  	[
  		17.23451248019157,
  		-10.18457540037031,
  		-0.2602214334442866
  	],
  	[
  		17.2388171148692,
  		-10.181811645743931,
  		-0.259670674482892
  	],
  	[
  		17.24140220492443,
  		-10.17906829108713,
  		-0.26199711252245683
  	],
  	[
  		17.24110061223501,
  		-10.175488054716999,
  		-0.2628416749705692
  	],
  	[
  		17.24219095400644,
  		-10.17178901896417,
  		-0.2606192291426268
  	],
  	[
  		17.24633317952868,
  		-10.1689199542814,
  		-0.2595698786905431
  	],
  	[
  		17.24939879358228,
  		-10.16625257541413,
  		-0.2616911350539219
  	],
  	[
  		17.249313261738372,
  		-10.16278391798008,
  		-0.2630079432460554
  	],
  	[
  		17.24993727892926,
  		-10.15901781549771,
  		-0.2610460249934469
  	],
  	[
  		17.253812234844762,
  		-10.15602745367995,
  		-0.2595485881619413
  	],
  	[
  		17.2573061910375,
  		-10.15341085420876,
  		-0.26136489852238637
  	],
  	[
  		17.25753293887363,
  		-10.150066296098622,
  		-0.2630920102847276
  	],
  	[
  		17.25775456526057,
  		-10.14626020460608,
  		-0.26148535625355984
  	],
  	[
  		17.26127036112794,
  		-10.14313820428352,
  		-0.2596106665619158
  	],
  	[
  		17.26512068059816,
  		-10.140544846068531,
  		-0.26103670159227044
  	],
  	[
  		17.26574120945237,
  		-10.137330850127091,
  		-0.2630916426008847
  	],
  	[
  		17.26564491038886,
  		-10.1335139027091,
  		-0.26191729000738223
  	],
  	[
  		17.26872641893877,
  		-10.130256292892179,
  		-0.2597557375496366
  	],
  	[
  		17.272844591425528,
  		-10.127657437901401,
  		-0.2607236986776935
  	],
  	[
  		17.27392231206844,
  		-10.12457462086722,
  		-0.2630103293392884
  	],
  	[
  		17.27360616042516,
  		-10.120776060146198,
  		-0.2623245358459497
  	],
  	[
  		17.27619970981445,
  		-10.117385383179041,
  		-0.2599796504184742
  	],
  	[
  		17.28048270955302,
  		-10.114752252738878,
  		-0.26044446127236703
  	],
  	[
  		17.2820580012281,
  		-10.11179448975366,
  		-0.2628543461028872
  	],
  	[
  		17.28163067124616,
  		-10.108042651672392,
  		-0.2626899762726025
  	],
  	[
  		17.28370399005665,
  		-10.10452748020575,
  		-0.2602750350864868
  	],
  	[
  		17.28804182356239,
  		-10.10183274197905,
  		-0.2602131582550444
  	],
  	[
  		17.290132629630982,
  		-10.098988429719551,
  		-0.2626337588348326
  	],
  	[
  		17.28970734122603,
  		-10.09530905006952,
  		-0.2629976412262618
  	],
  	[
  		17.29125547426664,
  		-10.09168435761943,
  		-0.2606289571806348
  	],
  	[
  		17.2955342985685,
  		-10.088903561965521,
  		-0.260043838301723
  	],
  	[
  		17.298134067866478,
  		-10.08615552863285,
  		-0.2623611425914582
  	],
  	[
  		17.29782451262752,
  		-10.08257119531734,
  		-0.2632365494568342
  	],
  	[
  		17.2988660819975,
  		-10.0788569231542,
  		-0.2610290205490166
  	],
  	[
  		17.30297539283115,
  		-10.07596964071515,
  		-0.25994793016190554
  	],
  	[
  		17.3060530170504,
  		-10.07329612267114,
  		-0.2620535932618605
  	],
  	[
  		17.30596568232776,
  		-10.069824267996522,
  		-0.2633978701449682
  	],
  	[
  		17.30654426893599,
  		-10.066044571273348,
  		-0.2614573274688274
  	],
  	[
  		17.310379559804183,
  		-10.0630350163967,
  		-0.2599316596392248
  	],
  	[
  		17.31388191037611,
  		-10.06041059672204,
  		-0.26172582662223615
  	],
  	[
  		17.31411274841323,
  		-10.05706346459317,
  		-0.2634754598843774
  	],
  	[
  		17.31429432092711,
  		-10.053245688419361,
  		-0.2618953414918243
  	],
  	[
  		17.31776489878504,
  		-10.05010408443604,
  		-0.2599981174766806
  	],
  	[
  		17.32161886656889,
  		-10.04750113997906,
  		-0.2613966255427123
  	],
  	[
  		17.32224846641604,
  		-10.04428498732705,
  		-0.2634690915975164
  	],
  	[
  		17.32211772576427,
  		-10.04045821617537,
  		-0.26232571434091423
  	],
  	[
  		17.32514985266172,
  		-10.037181014963782,
  		-0.2601481709719177
  	],
  	[
  		17.32926515114653,
  		-10.03457073195452,
  		-0.26108548741654863
  	],
  	[
  		17.33035480099639,
  		-10.03148538572358,
  		-0.2633822990176341
  	],
  	[
  		17.33001151237988,
  		-10.02767900803682,
  		-0.26273028433148354
  	],
  	[
  		17.33255188825693,
  		-10.024268905669791,
  		-0.2603764706107299
  	],
  	[
  		17.33682558061943,
  		-10.021622473892439,
  		-0.26080714416939654
  	],
  	[
  		17.33841488343488,
  		-10.01866175190709,
  		-0.2632206793086664
  	],
  	[
  		17.33796737455096,
  		-10.014903671052132,
  		-0.26309032065605814
  	],
  	[
  		17.33998739312797,
  		-10.011370146356171,
  		-0.26067426524895104
  	],
  	[
  		17.34430808155276,
  		-10.0086604022615,
  		-0.2605782080682595
  	],
  	[
  		17.34641333321752,
  		-10.00581216997897,
  		-0.2629947057219026
  	],
  	[
  		17.34597589325889,
  		-10.0021283673145,
  		-0.263392910795692
  	],
  	[
  		17.34747021518032,
  		-9.998486309289639,
  		-0.2610309151155453
  	],
  	[
  		17.35172513491026,
  		-9.995689119181687,
  		-0.2604121408335609
  	],
  	[
  		17.35433735581831,
  		-9.992935878363527,
  		-0.2627190539972865
  	],
  	[
  		17.35402239208203,
  		-9.989348148914829,
  		-0.26362538872472474
  	],
  	[
  		17.35501293128185,
  		-9.985618156194041,
  		-0.2614318886638333
  	],
  	[
  		17.35909055304203,
  		-9.982713120690118,
  		-0.26031950014783634
  	],
  	[
  		17.36217822722484,
  		-9.98003287439477,
  		-0.2624074562803302
  	],
  	[
  		17.36209208886551,
  		-9.97655864062067,
  		-0.263779419314905
  	],
  	[
  		17.36262332468517,
  		-9.972764915633196,
  		-0.2618591708043848
  	],
  	[
  		17.366421166283462,
  		-9.969736952875149,
  		-0.26030645379898115
  	],
  	[
  		17.369929046451873,
  		-9.967104124061468,
  		-0.2620777796626462
  	],
  	[
  		17.37016663910729,
  		-9.963755128764939,
  		-0.2638498897727165
  	],
  	[
  		17.37030591640052,
  		-9.959925289730286,
  		-0.2622961196890498
  	],
  	[
  		17.37373343473881,
  		-9.956764757711433,
  		-0.2603768149813805
  	],
  	[
  		17.37758740708606,
  		-9.954151581156271,
  		-0.2617479129387194
  	],
  	[
  		17.37822770769079,
  		-9.950933566708992,
  		-0.2638364701917368
  	],
  	[
  		17.37806099661681,
  		-9.947096670221457,
  		-0.2627232854004041
  	],
  	[
  		17.38104596135708,
  		-9.943800527979178,
  		-0.2605299161447416
  	],
  	[
  		17.38515523414935,
  		-9.941178209344779,
  		-0.26143618470229424
  	],
  	[
  		17.3862586163892,
  		-9.938090811870325,
  		-0.2637427786860041
  	],
  	[
  		17.38588610860241,
  		-9.934276158077735,
  		-0.26312349393367057
  	],
  	[
  		17.388377349185852,
  		-9.930847697336663,
  		-0.26076104858708443
  	],
  	[
  		17.39263768696458,
  		-9.928187485108555,
  		-0.2611595316093356
  	],
  	[
  		17.394242195995172,
  		-9.925223970915829,
  		-0.2635750264472876
  	],
  	[
  		17.39377275779638,
  		-9.921459487236097,
  		-0.2634792689095246
  	],
  	[
  		17.39574176359571,
  		-9.91790814531439,
  		-0.2610613333600125
  	],
  	[
  		17.40004266830142,
  		-9.91518315098511,
  		-0.2609325053785025
  	],
  	[
  		17.40216248692309,
  		-9.912331056393384,
  		-0.2633441095160018
  	],
  	[
  		17.40171031448108,
  		-9.908642239956121,
  		-0.2637754357882531
  	],
  	[
  		17.403154950583378,
  		-9.904983755531946,
  		-0.2614193848768243
  	],
  	[
  		17.40738246807446,
  		-9.902169860951979,
  		-0.2607692636514322
  	],
  	[
  		17.41000853420666,
  		-9.899411571069084,
  		-0.263063733784603
  	],
  	[
  		17.40968582505555,
  		-9.895820257991911,
  		-0.26400235603493843
  	],
  	[
  		17.410628213403502,
  		-9.892075065571573,
  		-0.261821126192465
  	],
  	[
  		17.41467273242468,
  		-9.88915254245951,
  		-0.26068064726481105
  	],
  	[
  		17.41777017702767,
  		-9.886465516179497,
  		-0.26274999259105003
  	],
  	[
  		17.417682947186538,
  		-9.882988578472624,
  		-0.2641499686877306
  	],
  	[
  		17.418169326025218,
  		-9.87918132653387,
  		-0.2622487596020168
  	],
  	[
  		17.42192748373056,
  		-9.876134947891773,
  		-0.260671555308285
  	],
  	[
  		17.42544152526671,
  		-9.873493718637144,
  		-0.26241818079777934
  	],
  	[
  		17.42568334932271,
  		-9.870142606009452,
  		-0.26421402307717534
  	],
  	[
  		17.42578271136695,
  		-9.866300976883018,
  		-0.2626839309063143
  	],
  	[
  		17.4291661809061,
  		-9.863121900810253,
  		-0.2607460323256509
  	],
  	[
  		17.433020810303923,
  		-9.860498516853946,
  		-0.26208799243664493
  	],
  	[
  		17.43367050088991,
  		-9.857278729209987,
  		-0.2641945223510823
  	],
  	[
  		17.43346928406542,
  		-9.853431902393739,
  		-0.26310980000094253
  	],
  	[
  		17.4364062301504,
  		-9.850117200477218,
  		-0.2609039168705314
  	],
  	[
  		17.4405096374263,
  		-9.847482814519045,
  		-0.26177785393556274
  	],
  	[
  		17.44162538610875,
  		-9.844393370231394,
  		-0.2640956487567088
  	],
  	[
  		17.441224648072232,
  		-9.840570508902973,
  		-0.2635072662590825
  	],
  	[
  		17.443665171743362,
  		-9.837123837070385,
  		-0.2611390176347052
  	],
  	[
  		17.44791300493906,
  		-9.83444978364881,
  		-0.26150277852614934
  	],
  	[
  		17.44953192046387,
  		-9.831483721285059,
  		-0.26392255097214223
  	],
  	[
  		17.44904163719882,
  		-9.827712778851975,
  		-0.2638585561508388
  	],
  	[
  		17.45095960523283,
  		-9.824144245187052,
  		-0.2614426039668306
  	],
  	[
  		17.45524050072076,
  		-9.821403739803909,
  		-0.2612787827750479
  	],
  	[
  		17.45737576995954,
  		-9.81854834144883,
  		-0.26368746350130434
  	],
  	[
  		17.45690958323056,
  		-9.814854639143284,
  		-0.2641510256407885
  	],
  	[
  		17.45830337991483,
  		-9.811179964876862,
  		-0.26180379625912853
  	],
  	[
  		17.46250368614429,
  		-9.808349194269478,
  		-0.26112013210890733
  	],
  	[
  		17.46514312111083,
  		-9.805586168781396,
  		-0.26340454783351736
  	],
  	[
  		17.46481355794125,
  		-9.801991162952485,
  		-0.2643726087780411
  	],
  	[
  		17.465707484349412,
  		-9.79823134418937,
  		-0.2622076514464892
  	],
  	[
  		17.46971714416056,
  		-9.79529053849627,
  		-0.2610354812442068
  	],
  	[
  		17.472826620452572,
  		-9.792597538117457,
  		-0.2630878535698659
  	],
  	[
  		17.47273866410406,
  		-9.789117864239046,
  		-0.26451440150225664
  	],
  	[
  		17.473180925989368,
  		-9.785297717712576,
  		-0.2626350166168216
  	],
  	[
  		17.47689849918187,
  		-9.782232522022568,
  		-0.2610312340420875
  	],
  	[
  		17.480419763924033,
  		-9.779583453206852,
  		-0.26275492804809625
  	],
  	[
  		17.4806670566314,
  		-9.776230307148712,
  		-0.2645725338809962
  	],
  	[
  		17.480726902496897,
  		-9.772377657170601,
  		-0.2630704342158359
  	],
  	[
  		17.48406368040315,
  		-9.76917912534975,
  		-0.261110911696922
  	],
  	[
  		17.48792061015472,
  		-9.766546162756056,
  		-0.2624250764080447
  	],
  	[
  		17.48857916519151,
  		-9.763324304512466,
  		-0.26454763894109534
  	],
  	[
  		17.488345177060268,
  		-9.759468360828468,
  		-0.2634939113249512
  	],
  	[
  		17.4912315593939,
  		-9.756134330263341,
  		-0.26127336472469664
  	],
  	[
  		17.495330861010462,
  		-9.753488375761426,
  		-0.2621151777565476
  	],
  	[
  		17.49645946050892,
  		-9.750396804716637,
  		-0.2644422181938451
  	],
  	[
  		17.49603289048041,
  		-9.746566748083614,
  		-0.26388764559773914
  	],
  	[
  		17.49842062633405,
  		-9.743101262151415,
  		-0.26151188376970474
  	],
  	[
  		17.502657398518153,
  		-9.740413897261277,
  		-0.26184184646144754
  	],
  	[
  		17.50429033038266,
  		-9.737445014780231,
  		-0.2642639170910468
  	],
  	[
  		17.50378143622824,
  		-9.733668597413596,
  		-0.264234652262481
  	],
  	[
  		17.50564526158167,
  		-9.730082069929665,
  		-0.26181916609867767
  	],
  	[
  		17.50990756416888,
  		-9.727326513624098,
  		-0.2616208052354194
  	],
  	[
  		17.51205648513863,
  		-9.724467207773506,
  		-0.2640244244811709
  	],
  	[
  		17.51157918735456,
  		-9.72076948270413,
  		-0.2645212461079039
  	],
  	[
  		17.51291997667988,
  		-9.717078148349886,
  		-0.2621822372669929
  	],
  	[
  		17.51709446893874,
  		-9.714230862328854,
  		-0.26146478939998435
  	],
  	[
  		17.5197465515452,
  		-9.711462726397384,
  		-0.2637369471234238
  	],
  	[
  		17.51941273325328,
  		-9.707864910159591,
  		-0.2647360925532353
  	],
  	[
  		17.52025633372928,
  		-9.70408997759524,
  		-0.2625861916867069
  	],
  	[
  		17.52423352745155,
  		-9.70113171429778,
  		-0.2613838693920462
  	],
  	[
  		17.52735160271745,
  		-9.698431823633067,
  		-0.26341744369959014
  	],
  	[
  		17.527266085302312,
  		-9.694950242733796,
  		-0.2648709113987168
  	],
  	[
  		17.52766137523616,
  		-9.691116732259578,
  		-0.2630138261727774
  	],
  	[
  		17.53133996202324,
  		-9.688033122434069,
  		-0.261383197644157
  	],
  	[
  		17.53486600719895,
  		-9.685375631612704,
  		-0.2630829654797222
  	],
  	[
  		17.535120248527182,
  		-9.682020808763436,
  		-0.2649219108860117
  	],
  	[
  		17.53513920507937,
  		-9.678156767771132,
  		-0.2634466351191314
  	],
  	[
  		17.53843210408275,
  		-9.674939631811121,
  		-0.2614665357336101
  	],
  	[
  		17.542287780839388,
  		-9.672296250994163,
  		-0.26275179755593353
  	],
  	[
  		17.54295840619642,
  		-9.66907299951165,
  		-0.2648895428293206
  	],
  	[
  		17.54268894891668,
  		-9.665207500661444,
  		-0.2638672276263245
  	],
  	[
  		17.54552781863508,
  		-9.661854888307584,
  		-0.26163191567393235
  	],
  	[
  		17.5496196441475,
  		-9.659196901910056,
  		-0.2624429105582981
  	],
  	[
  		17.55076195206225,
  		-9.656103299145679,
  		-0.26477781741321244
  	],
  	[
  		17.55030757103332,
  		-9.652265677835935,
  		-0.2642568153616923
  	],
  	[
  		17.55264480600343,
  		-9.648782009902627,
  		-0.2618737930373217
  	],
  	[
  		17.55686726677515,
  		-9.646080819742785,
  		-0.26217068633750945
  	],
  	[
  		17.55851558922125,
  		-9.64310929858824,
  		-0.2645934715930836
  	],
  	[
  		17.55798583844511,
  		-9.639326943691772,
  		-0.2645984232732561
  	],
  	[
  		17.55979893173583,
  		-9.635723162859222,
  		-0.2621826496791846
  	],
  	[
  		17.56403977551085,
  		-9.632952322381708,
  		-0.261951885508837
  	],
  	[
  		17.56620361922769,
  		-9.630089265557409,
  		-0.2643488226828747
  	],
  	[
  		17.56571296709215,
  		-9.626387202809864,
  		-0.2648794570191257
  	],
  	[
  		17.56700331493679,
  		-9.622679722741683,
  		-0.26254760176949893
  	],
  	[
  		17.57114937885588,
  		-9.619815870107985,
  		-0.2617994170095636
  	],
  	[
  		17.57381415342667,
  		-9.617042557051414,
  		-0.2640580311693149
  	],
  	[
  		17.57347410112779,
  		-9.613441597661081,
  		-0.26508825957273924
  	],
  	[
  		17.574269495134022,
  		-9.609651959449161,
  		-0.2629522889955979
  	],
  	[
  		17.578211777972882,
  		-9.606676070858889,
  		-0.2617217407067773
  	],
  	[
  		17.58133974663203,
  		-9.603969530400219,
  		-0.2637354665546428
  	],
  	[
  		17.58125415293805,
  		-9.600485645848574,
  		-0.26521625342825833
  	],
  	[
  		17.58160553528003,
  		-9.59663918884065,
  		-0.2633789064603216
  	],
  	[
  		17.58524329193419,
  		-9.59353740555364,
  		-0.2617253675359459
  	],
  	[
  		17.588774370948922,
  		-9.590871402820452,
  		-0.2633994412939804
  	],
  	[
  		17.58903442460072,
  		-9.587514988722809,
  		-0.26526145461368483
  	],
  	[
  		17.58901354816737,
  		-9.583639662453217,
  		-0.2638113946067144
  	],
  	[
  		17.5922609765897,
  		-9.580404022613887,
  		-0.2618132565642404
  	],
  	[
  		17.59611605004824,
  		-9.577750375726716,
  		-0.26306899247184673
  	],
  	[
  		17.59679621397456,
  		-9.574525427244584,
  		-0.2652230678935648
  	],
  	[
  		17.59649377840896,
  		-9.570650646680527,
  		-0.2642295093258582
  	],
  	[
  		17.59928328012229,
  		-9.56727961767823,
  		-0.2619828712217573
  	],
  	[
  		17.603368202547813,
  		-9.564609400692365,
  		-0.26276003245617535
  	],
  	[
  		17.60452397246828,
  		-9.561514165946624,
  		-0.2651054483143828
  	],
  	[
  		17.60404249735216,
  		-9.557668897367387,
  		-0.2646156182194877
  	],
  	[
  		17.6063291888794,
  		-9.554167541578522,
  		-0.2622283146718346
  	],
  	[
  		17.61053721644318,
  		-9.551452393599112,
  		-0.26249072650778466
  	],
  	[
  		17.61220019272319,
  		-9.5484784700036,
  		-0.2649164816575152
  	],
  	[
  		17.61165085973657,
  		-9.544690336208895,
  		-0.2649541279647104
  	],
  	[
  		17.613411891913138,
  		-9.541069588856757,
  		-0.262541594816517
  	],
  	[
  		17.61763106459525,
  		-9.53828308105648,
  		-0.2622753591131985
  	],
  	[
  		17.61980975676973,
  		-9.53541669307681,
  		-0.2646681496000039
  	],
  	[
  		17.61930619075369,
  		-9.531710139136367,
  		-0.2652301355300024
  	],
  	[
  		17.62054635977494,
  		-9.527987079971208,
  		-0.26290847778620774
  	],
  	[
  		17.62466327789856,
  		-9.525106165559793,
  		-0.2621264757128683
  	],
  	[
  		17.62734189889753,
  		-9.522328256334394,
  		-0.26437328751212713
  	],
  	[
  		17.62699620375784,
  		-9.518724201474646,
  		-0.2654333464148184
  	],
  	[
  		17.62774389573748,
  		-9.514920537704967,
  		-0.26331477277428433
  	],
  	[
  		17.63165023536859,
  		-9.511926580504078,
  		-0.262053782043896
  	],
  	[
  		17.63478887472397,
  		-9.509213881100917,
  		-0.2640493222180603
  	],
  	[
  		17.634703687073568,
  		-9.505727737587916,
  		-0.26555629838273437
  	],
  	[
  		17.63501107144898,
  		-9.501868942017401,
  		-0.2637425708889976
  	],
  	[
  		17.63860646849753,
  		-9.498748266977522,
  		-0.26206267902982633
  	],
  	[
  		17.64214378046809,
  		-9.496074303026898,
  		-0.2637124535044635
  	],
  	[
  		17.64240950244366,
  		-9.492716025920908,
  		-0.2655950800730333
  	],
  	[
  		17.64235051930585,
  		-9.488830323138739,
  		-0.2641733776404458
  	],
  	[
  		17.64555038358615,
  		-9.485575510514183,
  		-0.26215497853320363
  	],
  	[
  		17.64940665154582,
  		-9.482912099497737,
  		-0.2633812392737107
  	],
  	[
  		17.6500971492498,
  		-9.47968558446917,
  		-0.2655505711696916
  	],
  	[
  		17.64976265475766,
  		-9.475802300972369,
  		-0.2645892225281523
  	],
  	[
  		17.65250126775253,
  		-9.472412344407616,
  		-0.2623292298714392
  	],
  	[
  		17.65658048726323,
  		-9.469730526218479,
  		-0.2630744341338933
  	],
  	[
  		17.65774897578935,
  		-9.466633200647877,
  		-0.2654274232907658
  	],
  	[
  		17.6572428352185,
  		-9.462781403965753,
  		-0.2649722440803278
  	],
  	[
  		17.65947523930653,
  		-9.45926141878015,
  		-0.26257898548626984
  	],
  	[
  		17.66367086715995,
  		-9.456532828044685,
  		-0.2628066006622972
  	],
  	[
  		17.66534779710233,
  		-9.453556182319325,
  		-0.26523328904649424
  	],
  	[
  		17.66478082731177,
  		-9.449762995965921,
  		-0.26530499843335653
  	],
  	[
  		17.66648809956219,
  		-9.44612485419983,
  		-0.2628944706620493
  	],
  	[
  		17.67068709597935,
  		-9.443323281141677,
  		-0.26259389392758664
  	],
  	[
  		17.67287975969811,
  		-9.440453097447952,
  		-0.2649797163158755
  	],
  	[
  		17.67236657893459,
  		-9.436743216158932,
  		-0.2655754057256679
  	],
  	[
  		17.67355327456039,
  		-9.433003904524668,
  		-0.26326341188181995
  	],
  	[
  		17.67764334892754,
  		-9.430106668184377,
  		-0.2624484057922838
  	],
  	[
  		17.68033329247661,
  		-9.427323546985065,
  		-0.26468206884173
  	],
  	[
  		17.67998449666275,
  		-9.42371707131932,
  		-0.265771931299376
  	],
  	[
  		17.68068186227189,
  		-9.419898871407039,
  		-0.2636702986137086
  	],
  	[
  		17.68455367967104,
  		-9.416887335419268,
  		-0.2623792285171296
  	],
  	[
  		17.6877006650484,
  		-9.414167842849595,
  		-0.26435477599640633
  	],
  	[
  		17.68761857846743,
  		-9.410680103940116,
  		-0.2658875641551321
  	],
  	[
  		17.68788003718228,
  		-9.406808566903626,
  		-0.2640966398570501
  	],
  	[
  		17.69143540658198,
  		-9.403669782885936,
  		-0.26239141184573594
  	],
  	[
  		17.694976258444072,
  		-9.400987311914749,
  		-0.2640162697028405
  	],
  	[
  		17.69525038647929,
  		-9.397627847830522,
  		-0.2659191193207439
  	],
  	[
  		17.69515090297387,
  		-9.393731362796792,
  		-0.26452564240638793
  	],
  	[
  		17.69830567390546,
  		-9.390458120029571,
  		-0.2624874492474343
  	],
  	[
  		17.7021593895781,
  		-9.3877843503352,
  		-0.2636849080569064
  	],
  	[
  		17.7028616681318,
  		-9.38455647141889,
  		-0.2658676879907642
  	],
  	[
  		17.70249337733675,
  		-9.380664369827036,
  		-0.26493799587988826
  	],
  	[
  		17.70518303529796,
  		-9.377256062031782,
  		-0.2626647376784074
  	],
  	[
  		17.70925355418416,
  		-9.374562127550954,
  		-0.2633780083147234
  	],
  	[
  		17.71043623909034,
  		-9.371463096398811,
  		-0.2657379985122365
  	],
  	[
  		17.709903363167662,
  		-9.36760428233112,
  		-0.2653161595318667
  	],
  	[
  		17.71208558731758,
  		-9.364066719065818,
  		-0.26291700730474854
  	],
  	[
  		17.716264887996488,
  		-9.361324274483753,
  		-0.2631120510123532
  	],
  	[
  		17.7179570854526,
  		-9.358345088025514,
  		-0.2655378591152143
  	],
  	[
  		17.7173707123568,
  		-9.354546702731696,
  		-0.2656443040947986
  	],
  	[
  		17.7190264990249,
  		-9.350891653775225,
  		-0.26323465046314615
  	],
  	[
  		17.72320264686602,
  		-9.348074845361246,
  		-0.2629016892239497
  	],
  	[
  		17.72540914338462,
  		-9.345200900641922,
  		-0.2652799334590818
  	],
  	[
  		17.724883820074332,
  		-9.341487131725573,
  		-0.2659081998719132
  	],
  	[
  		17.72602091227818,
  		-9.33773241751659,
  		-0.2636048290612614
  	],
  	[
  		17.73008063737779,
  		-9.334818571017987,
  		-0.2627592244119665
  	],
  	[
  		17.73278321587324,
  		-9.332030420505616,
  		-0.2649779021112313
  	],
  	[
  		17.73242909663131,
  		-9.328421362028276,
  		-0.2660988456730176
  	],
  	[
  		17.73307916596998,
  		-9.324589112085114,
  		-0.2640118251195451
  	],
  	[
  		17.7369150965609,
  		-9.321560315087112,
  		-0.2626940854405934
  	],
  	[
  		17.74007011457842,
  		-9.318833977602829,
  		-0.2646486782336785
  	],
  	[
  		17.73998901761457,
  		-9.31534443169532,
  		-0.26620804241117824
  	],
  	[
  		17.74020689228039,
  		-9.311460583808111,
  		-0.26443829428344434
  	],
  	[
  		17.74372017166658,
  		-9.30830376799255,
  		-0.2627105150150103
  	],
  	[
  		17.74726481380671,
  		-9.305612765618454,
  		-0.2643088304154048
  	],
  	[
  		17.74754484465155,
  		-9.302251906799677,
  		-0.2662333408659214
  	],
  	[
  		17.74740723364205,
  		-9.298344913734173,
  		-0.26486531574629985
  	],
  	[
  		17.75051599961424,
  		-9.295053634288404,
  		-0.262810615572918
  	],
  	[
  		17.75436775460003,
  		-9.292369505011466,
  		-0.2639773060018727
  	],
  	[
  		17.75508064210264,
  		-9.28914043941732,
  		-0.2661756953259101
  	],
  	[
  		17.75468000923738,
  		-9.285239684568731,
  		-0.2652755829216044
  	],
  	[
  		17.75732039974705,
  		-9.281813556051269,
  		-0.26299242527972033
  	],
  	[
  		17.76138198418914,
  		-9.279107393340484,
  		-0.2636723601104499
  	],
  	[
  		17.76257776505956,
  		-9.276006773964102,
  		-0.266041014762928
  	],
  	[
  		17.76201891758697,
  		-9.27214102022737,
  		-0.2656509549348895
  	],
  	[
  		17.76414961652074,
  		-9.26858610807037,
  		-0.26324878354364334
  	],
  	[
  		17.7683132773236,
  		-9.265829741160497,
  		-0.26340875949875325
  	],
  	[
  		17.7700198266481,
  		-9.26284825744946,
  		-0.2658360269842937
  	],
  	[
  		17.76941501093744,
  		-9.259044601275614,
  		-0.2659742829055177
  	],
  	[
  		17.7710195914161,
  		-9.255373365657576,
  		-0.2635693942046091
  	],
  	[
  		17.77517257939254,
  		-9.252541021147346,
  		-0.26320150072693077
  	],
  	[
  		17.77739410777696,
  		-9.249663926566965,
  		-0.26557385694020125
  	],
  	[
  		17.776857057166048,
  		-9.245946365996565,
  		-0.2662338915506987
  	],
  	[
  		17.7779439014473,
  		-9.242176635410791,
  		-0.2639421156189025
  	],
  	[
  		17.78197340185325,
  		-9.23924604552414,
  		-0.2630639298533422
  	],
  	[
  		17.78468825382597,
  		-9.236453200133866,
  		-0.2652698179929786
  	],
  	[
  		17.784329449278932,
  		-9.23284145252524,
  		-0.2664192431325934
  	],
  	[
  		17.784931994346287,
  		-9.228995816630164,
  		-0.26435118139785313
  	],
  	[
  		17.78873025837608,
  		-9.225948987947268,
  		-0.2630032167163917
  	],
  	[
  		17.79189554734748,
  		-9.223216601080045,
  		-0.2649382936798989
  	],
  	[
  		17.79181552190599,
  		-9.219725134760846,
  		-0.2665224782649596
  	],
  	[
  		17.79199080666733,
  		-9.21582968256486,
  		-0.2647766485807933
  	],
  	[
  		17.79546099160286,
  		-9.212654441261112,
  		-0.26302428243745174
  	],
  	[
  		17.79901077672335,
  		-9.209955498853153,
  		-0.2645974256369497
  	],
  	[
  		17.79929778251051,
  		-9.206593310150934,
  		-0.2665415811849157
  	],
  	[
  		17.79912269745146,
  		-9.202676639511868,
  		-0.2652031920343396
  	],
  	[
  		17.8021828558892,
  		-9.199366521023363,
  		-0.2631295271067483
  	],
  	[
  		17.80603435922917,
  		-9.196672715273381,
  		-0.26426692480082464
  	],
  	[
  		17.806757178701208,
  		-9.193442134293923,
  		-0.2664788299450113
  	],
  	[
  		17.80632602202968,
  		-9.189533589467443,
  		-0.2656108938456976
  	],
  	[
  		17.8089142651138,
  		-9.18608884436503,
  		-0.2633158736980811
  	],
  	[
  		17.81296886188465,
  		-9.183371014267061,
  		-0.2639626810685272
  	],
  	[
  		17.81417783383797,
  		-9.18026862650008,
  		-0.266337776045023
  	],
  	[
  		17.81359561763828,
  		-9.176396920945765,
  		-0.2659817496883912
  	],
  	[
  		17.81567267080331,
  		-9.172824103057973,
  		-0.2635751218722394
  	],
  	[
  		17.81982215954887,
  		-9.17005435337266,
  		-0.26370084230229945
  	],
  	[
  		17.82154270632572,
  		-9.167070339979027,
  		-0.2661276683223881
  	],
  	[
  		17.820921912521598,
  		-9.163262420891067,
  		-0.2663003728292832
  	],
  	[
  		17.82247224659453,
  		-9.15957426272304,
  		-0.2638989777864957
  	],
  	[
  		17.82660361886814,
  		-9.156726943759374,
  		-0.26349700155976313
  	],
  	[
  		17.82883793523127,
  		-9.153846063692885,
  		-0.26586166400003813
  	],
  	[
  		17.82829237556633,
  		-9.150125587591978,
  		-0.2665539586852224
  	],
  	[
  		17.82932661045788,
  		-9.146340353548883,
  		-0.2642732434834452
  	],
  	[
  		17.83332717026585,
  		-9.143393359947394,
  		-0.2633621375713721
  	],
  	[
  		17.836053279990182,
  		-9.140595444163049,
  		-0.26555336888929587
  	],
  	[
  		17.83569237926077,
  		-9.136981804873313,
  		-0.26673221400895714
  	],
  	[
  		17.836245827236922,
  		-9.133122341262833,
  		-0.26468166631343143
  	],
  	[
  		17.84000877685608,
  		-9.130058320758232,
  		-0.2633050825907113
  	],
  	[
  		17.843180840448262,
  		-9.12731903458259,
  		-0.26521929363226404
  	],
  	[
  		17.843105243771127,
  		-9.123826495193633,
  		-0.2668283921464205
  	],
  	[
  		17.84323531879741,
  		-9.119919039221703,
  		-0.265107011202933
  	],
  	[
  		17.84666419915814,
  		-9.11672582700432,
  		-0.2633297748404441
  	],
  	[
  		17.85021635741002,
  		-9.114018397664621,
  		-0.2648774450118979
  	],
  	[
  		17.85051165989442,
  		-9.110655160482427,
  		-0.2668404660150148
  	],
  	[
  		17.8502978626147,
  		-9.106728472337828,
  		-0.2655304939190685
  	],
  	[
  		17.85331218574924,
  		-9.103400317565173,
  		-0.2634385578583689
  	],
  	[
  		17.85715973301325,
  		-9.100696010758577,
  		-0.2645458501337609
  	],
  	[
  		17.85789532845272,
  		-9.097464505092974,
  		-0.2667703348923321
  	],
  	[
  		17.85743129402708,
  		-9.093547772398535,
  		-0.2659347109406208
  	],
  	[
  		17.85997082339841,
  		-9.090085230752301,
  		-0.26362761659056744
  	],
  	[
  		17.86401503536664,
  		-9.087355317379847,
  		-0.264242966304634
  	],
  	[
  		17.865238004501162,
  		-9.08425125173599,
  		-0.2666231669352672
  	],
  	[
  		17.86463060510897,
  		-9.080373301498323,
  		-0.26630122309937293
  	],
  	[
  		17.866656559987778,
  		-9.0767832160269,
  		-0.2638900152400229
  	],
  	[
  		17.87078873130476,
  		-9.073999657886809,
  		-0.26398268647950535
  	],
  	[
  		17.872524146967457,
  		-9.071013167240944,
  		-0.2664073718591024
  	],
  	[
  		17.871885096040142,
  		-9.06720051897201,
  		-0.2666140558833732
  	],
  	[
  		17.87338467396745,
  		-9.063496166841063,
  		-0.2642152088298613
  	],
  	[
  		17.87749167336105,
  		-9.060633652574095,
  		-0.2637812398942315
  	],
  	[
  		17.879740028503438,
  		-9.05774912293197,
  		-0.2661365206013625
  	],
  	[
  		17.87918354724383,
  		-9.054025405483207,
  		-0.26686186254000843
  	],
  	[
  		17.88016811330106,
  		-9.05022523156898,
  		-0.2645909515736566
  	],
  	[
  		17.88413760709092,
  		-9.047261929817001,
  		-0.2636503268330987
  	],
  	[
  		17.88687486260179,
  		-9.044458794538993,
  		-0.26582534434074423
  	],
  	[
  		17.88650998767263,
  		-9.040843007330468,
  		-0.2670340728173811
  	],
  	[
  		17.88701622157037,
  		-9.036970055927597,
  		-0.2649998694770293
  	],
  	[
  		17.89074187105458,
  		-9.033888775728302,
  		-0.2635966842468223
  	],
  	[
  		17.89392174493931,
  		-9.031142729655711,
  		-0.2654887633707854
  	],
  	[
  		17.89384786006682,
  		-9.027648686865454,
  		-0.2671233462634124
  	],
  	[
  		17.89393564194079,
  		-9.023729584225746,
  		-0.2654237552807286
  	],
  	[
  		17.89732165519255,
  		-9.020518703188603,
  		-0.26362570831491994
  	],
  	[
  		17.900876594049492,
  		-9.017802662837664,
  		-0.2651457769244661
  	],
  	[
  		17.90117934520454,
  		-9.014438547247932,
  		-0.267129670415504
  	],
  	[
  		17.90092764780153,
  		-9.010501880302867,
  		-0.2658465409576634
  	],
  	[
  		17.90389506971255,
  		-9.00715590999826,
  		-0.26373906652546253
  	],
  	[
  		17.90773924315878,
  		-9.004441209084815,
  		-0.2648155667082461
  	],
  	[
  		17.90848549747508,
  		-9.00120854473409,
  		-0.2670537781863795
  	],
  	[
  		17.9079905086839,
  		-8.997283784309815,
  		-0.2662480559064962
  	],
  	[
  		17.91047949379547,
  		-8.993803592645863,
  		-0.26393233676808203
  	],
  	[
  		17.91451383748018,
  		-8.991061346094767,
  		-0.2645131183607623
  	],
  	[
  		17.91575075531604,
  		-8.987956009383451,
  		-0.2669009886269222
  	],
  	[
  		17.91511868515131,
  		-8.984071644816852,
  		-0.2666106235838827
  	],
  	[
  		17.91709356097138,
  		-8.980464793401364,
  		-0.2641979879044958
  	],
  	[
  		17.9212083597252,
  		-8.97766724902251,
  		-0.26425597959813424
  	],
  	[
  		17.92295859923648,
  		-8.97467863707153,
  		-0.2666807666352644
  	],
  	[
  		17.92230251034247,
  		-8.97086139278289,
  		-0.26692004821485343
  	],
  	[
  		17.92375011943836,
  		-8.967141119710679,
  		-0.2645272413199355
  	],
  	[
  		17.92783235157561,
  		-8.964262986272322,
  		-0.2640584505210805
  	],
  	[
  		17.9300949250905,
  		-8.96137523384959,
  		-0.2664067842026203
  	],
  	[
  		17.929527969460118,
  		-8.957648096878005,
  		-0.2671627964205026
  	],
  	[
  		17.93046280510043,
  		-8.95383344626962,
  		-0.26490478219178903
  	],
  	[
  		17.93440007951683,
  		-8.950853176438722,
  		-0.26393133374783345
  	],
  	[
  		17.93715006633862,
  		-8.948045477346822,
  		-0.2660920207392291
  	],
  	[
  		17.93678184671943,
  		-8.944427513895013,
  		-0.2673290765888274
  	],
  	[
  		17.937241719352272,
  		-8.940541777594897,
  		-0.2653146100409909
  	],
  	[
  		17.94092865501181,
  		-8.937442667477917,
  		-0.2638825956870433
  	],
  	[
  		17.94411764208848,
  		-8.934690411700398,
  		-0.2657541133974031
  	],
  	[
  		17.94404628488411,
  		-8.931194948987025,
  		-0.26741313777465775
  	],
  	[
  		17.94409182599182,
  		-8.927264782499224,
  		-0.26573914663087933
  	],
  	[
  		17.94743307423015,
  		-8.924035407082432,
  		-0.2639169809569287
  	],
  	[
  		17.95099200898816,
  		-8.921311280949768,
  		-0.2654109713092865
  	],
  	[
  		17.9513018588384,
  		-8.917945920826599,
  		-0.2674132852051803
  	],
  	[
  		17.95101432142913,
  		-8.914000195115541,
  		-0.2661600538007847
  	],
  	[
  		17.95393210144102,
  		-8.910635552603445,
  		-0.2640348331992202
  	],
  	[
  		17.9577749504728,
  		-8.907910922219186,
  		-0.26508028604366224
  	],
  	[
  		17.95853255030838,
  		-8.904677167598335,
  		-0.2673312519922817
  	],
  	[
  		17.95800814253857,
  		-8.90074518814316,
  		-0.266558498187056
  	],
  	[
  		17.96044503601998,
  		-8.897246792877828,
  		-0.26423222574035815
  	],
  	[
  		17.96447076633358,
  		-8.89449276309314,
  		-0.26478003221104157
  	],
  	[
  		17.96572094517611,
  		-8.891385685106874,
  		-0.2671728562979666
  	],
  	[
  		17.96506691132911,
  		-8.88749603087007,
  		-0.266917529199067
  	],
  	[
  		17.966986886607252,
  		-8.883871435195037,
  		-0.26450202546586404
  	],
  	[
  		17.97108617645312,
  		-8.881060314297628,
  		-0.2645249211256757
  	],
  	[
  		17.97285011206101,
  		-8.87806915009771,
  		-0.266948041450484
  	],
  	[
  		17.97217908129982,
  		-8.874247983415868,
  		-0.2672210534450553
  	],
  	[
  		17.973572969980978,
  		-8.870511335861128,
  		-0.264833333452959
  	],
  	[
  		17.97763197633497,
  		-8.867618067079855,
  		-0.2643303198069306
  	],
  	[
  		17.97990777597009,
  		-8.864726554456034,
  		-0.2666689386401351
  	],
  	[
  		17.979333705165118,
  		-8.860997080651792,
  		-0.2674576746293802
  	],
  	[
  		17.980215952682038,
  		-8.85716733429828,
  		-0.26521211025718244
  	],
  	[
  		17.984123455090938,
  		-8.854170806663188,
  		-0.2642066080600439
  	],
  	[
  		17.98688345597076,
  		-8.851357816349061,
  		-0.2663515139290452
  	],
  	[
  		17.98651436000306,
  		-8.847738314750726,
  		-0.2676171028944693
  	],
  	[
  		17.98692517240842,
  		-8.84383926385889,
  		-0.2656222811631355
  	],
  	[
  		17.99057499806229,
  		-8.84072278290038,
  		-0.26416168781474114
  	],
  	[
  		17.99377042050127,
  		-8.837963583122285,
  		-0.26601106359401355
  	],
  	[
  		17.99370398640357,
  		-8.834467212789855,
  		-0.2676939058920306
  	],
  	[
  		17.993705421939218,
  		-8.830525582335476,
  		-0.2660449971767243
  	],
  	[
  		17.99700436987305,
  		-8.82727842544928,
  		-0.2641994069854534
  	],
  	[
  		18.00056461557214,
  		-8.824545591835427,
  		-0.2656665214389833
  	],
  	[
  		18.0008843267826,
  		-8.82117959779883,
  		-0.2676867196432517
  	],
  	[
  		18.00055837870735,
  		-8.817224330307349,
  		-0.2664633474429812
  	],
  	[
  		18.00342944256715,
  		-8.813841796295076,
  		-0.2643207877833012
  	],
  	[
  		18.00726705895659,
  		-8.811106604820043,
  		-0.2653362239023682
  	],
  	[
  		18.00803740923573,
  		-8.807871877561213,
  		-0.26759794460475533
  	],
  	[
  		18.00748156230372,
  		-8.803932329393472,
  		-0.26685816865760803
  	],
  	[
  		18.00986814125427,
  		-8.800416197996286,
  		-0.2645212593166903
  	],
  	[
  		18.01388248167335,
  		-8.797649919816303,
  		-0.26503647598457
  	],
  	[
  		18.01514714984707,
  		-8.794541341016096,
  		-0.2674333683165596
  	],
  	[
  		18.0144689608333,
  		-8.790645847278018,
  		-0.2672118700346346
  	],
  	[
  		18.01633799302651,
  		-8.787004434825066,
  		-0.2647932458148972
  	],
  	[
  		18.02041806886572,
  		-8.784179353659436,
  		-0.2647834401745086
  	],
  	[
  		18.02219716165221,
  		-8.781185759636445,
  		-0.2672027416551623
  	],
  	[
  		18.021509307244038,
  		-8.777360494636996,
  		-0.2675104537975188
  	],
  	[
  		18.022851506324248,
  		-8.773607826688496,
  		-0.2651264318552281
  	],
  	[
  		18.02688482879157,
  		-8.77069932855289,
  		-0.264591662275715
  	],
  	[
  		18.02917362947831,
  		-8.767804032675535,
  		-0.26691997145046803
  	],
  	[
  		18.0285900628595,
  		-8.764071688546524,
  		-0.26774056913599403
  	],
  	[
  		18.02942290720501,
  		-8.760227493674835,
  		-0.2655063198449141
  	],
  	[
  		18.03329733827303,
  		-8.757214429857028,
  		-0.2644711778277212
  	],
  	[
  		18.03606861347177,
  		-8.754396297747272,
  		-0.2665985715563715
  	],
  	[
  		18.03569658929026,
  		-8.750775067935974,
  		-0.2678937671159831
  	],
  	[
  		18.036061042797712,
  		-8.74686303741592,
  		-0.2659159411241921
  	],
  	[
  		18.03967234774867,
  		-8.743729471976394,
  		-0.26443025250108093
  	],
  	[
  		18.04287407225906,
  		-8.740963277858231,
  		-0.26625648005813723
  	],
  	[
  		18.04281071532726,
  		-8.737465855638456,
  		-0.2679642076509114
  	],
  	[
  		18.04276999953932,
  		-8.733513052073311,
  		-0.26633857469705274
  	],
  	[
  		18.046024603805492,
  		-8.730248192776733,
  		-0.26447252102263563
  	],
  	[
  		18.0495863318571,
  		-8.727506620428828,
  		-0.2659114052484013
  	],
  	[
  		18.049913606041702,
  		-8.724139812197658,
  		-0.2679509965982327
  	],
  	[
  		18.04955139073433,
  		-8.720175207489994,
  		-0.2667547456975203
  	],
  	[
  		18.05237451759833,
  		-8.716775051579488,
  		-0.2645978811438796
  	],
  	[
  		18.05620753432082,
  		-8.714029251795157,
  		-0.2655810898736303
  	],
  	[
  		18.05698959749695,
  		-8.710793765670584,
  		-0.26785593281577863
  	],
  	[
  		18.05640367704342,
  		-8.706846718054491,
  		-0.2671466384281564
  	],
  	[
  		18.05873981124284,
  		-8.703313420106047,
  		-0.2648025706250427
  	],
  	[
  		18.06274219250201,
  		-8.700534659533428,
  		-0.26528356364734823
  	],
  	[
  		18.06402066460243,
  		-8.697424829769288,
  		-0.2676866030177657
  	],
  	[
  		18.06331893010417,
  		-8.693523548747269,
  		-0.2674975241787589
  	],
  	[
  		18.06513581623888,
  		-8.689865574405758,
  		-0.2650786983549727
  	],
  	[
  		18.06919705904902,
  		-8.68702637398908,
  		-0.2650336141073871
  	],
  	[
  		18.07099039001773,
  		-8.684030607826909,
  		-0.2674516176154766
  	],
  	[
  		18.07028652953824,
  		-8.680201123442782,
  		-0.2677910298088428
  	],
  	[
  		18.07157751124897,
  		-8.67643318127595,
  		-0.2654145280848007
  	],
  	[
  		18.07558436259301,
  		-8.673508979987524,
  		-0.2648450098759298
  	],
  	[
  		18.07788765199493,
  		-8.670610551343522,
  		-0.2671645643240841
  	],
  	[
  		18.077294658943252,
  		-8.666875368511468,
  		-0.268016311692284
  	],
  	[
  		18.07807810543547,
  		-8.663017243816666,
  		-0.265796297858591
  	],
  	[
  		18.081919252244802,
  		-8.659987448549755,
  		-0.2647296405505173
  	],
  	[
  		18.084701646341458,
  		-8.657164531341774,
  		-0.266841552406042
  	],
  	[
  		18.08432712332531,
  		-8.6535414895909,
  		-0.2681642290176488
  	],
  	[
  		18.08464525886519,
  		-8.64961722150255,
  		-0.26620786541982533
  	],
  	[
  		18.08821610839179,
  		-8.646465774323268,
  		-0.2646935647502568
  	],
  	[
  		18.09142613186942,
  		-8.643693294083134,
  		-0.2664977960416157
  	],
  	[
  		18.09136556701369,
  		-8.640194631336243,
  		-0.2682286322207269
  	],
  	[
  		18.09128392946726,
  		-8.63623140548579,
  		-0.2666289110339271
  	],
  	[
  		18.09449299942036,
  		-8.632948418887812,
  		-0.26474037631427033
  	],
  	[
  		18.098057571458,
  		-8.63019864145587,
  		-0.2661518939037011
  	],
  	[
  		18.09839321483888,
  		-8.626831058049858,
  		-0.2682090053295141
  	],
  	[
  		18.097995702287292,
  		-8.622858005384428,
  		-0.26704389444872184
  	],
  	[
  		18.1007685072883,
  		-8.619439546786747,
  		-0.2648707101531808
  	],
  	[
  		18.10459856219925,
  		-8.616683819020263,
  		-0.26582314537194657
  	],
  	[
  		18.10539154367855,
  		-8.613447228983656,
  		-0.268108954579208
  	],
  	[
  		18.10477736225232,
  		-8.60949359327731,
  		-0.267432968182415
  	],
  	[
  		18.10705995814867,
  		-8.605942318227452,
  		-0.2650798738134417
  	],
  	[
  		18.11105232734936,
  		-8.603151662995703,
  		-0.2655268884550177
  	],
  	[
  		18.112344111080322,
  		-8.60004025440478,
  		-0.2679335469646265
  	],
  	[
  		18.11162144161134,
  		-8.596134140416495,
  		-0.2677787232245596
  	],
  	[
  		18.11338392146632,
  		-8.592459081747798,
  		-0.2653585505047718
  	],
  	[
  		18.11742788292359,
  		-8.589606332162363,
  		-0.2652788890577793
  	],
  	[
  		18.119234992305792,
  		-8.586608153580356,
  		-0.2676936034235946
  	],
  	[
  		18.11851769701947,
  		-8.582775469078918,
  		-0.26806706414278053
  	],
  	[
  		18.1197544240151,
  		-8.578991582554131,
  		-0.2656970583951146
  	],
  	[
  		18.12373670473781,
  		-8.576052402382409,
  		-0.26509401156321694
  	],
  	[
  		18.12605175002893,
  		-8.573150151313483,
  		-0.26740314647591007
  	],
  	[
  		18.12545269872392,
  		-8.569413010020988,
  		-0.26828608708398644
  	],
  	[
  		18.12618389933427,
  		-8.565540436205923,
  		-0.26608004431141963
  	],
  	[
  		18.129993049257248,
  		-8.562494283512185,
  		-0.26498149141693184
  	],
  	[
  		18.13278513258896,
  		-8.55966620099155,
  		-0.26707639751688633
  	],
  	[
  		18.13241048380839,
  		-8.556042026715206,
  		-0.26842670184599754
  	],
  	[
  		18.132680716619088,
  		-8.552105120276714,
  		-0.2664903698452896
  	],
  	[
  		18.136213451145878,
  		-8.548936674085901,
  		-0.2649490707331532
  	],
  	[
  		18.13942833679669,
  		-8.546157177819024,
  		-0.2667304164954684
  	],
  	[
  		18.13937398588138,
  		-8.542658110092075,
  		-0.26848395421152743
  	],
  	[
  		18.139248831323872,
  		-8.53868411986875,
  		-0.266910714000709
  	],
  	[
  		18.14241427703006,
  		-8.535383535796143,
  		-0.2649994156499074
  	],
  	[
  		18.14597872626657,
  		-8.53262511442651,
  		-0.2663840120662815
  	],
  	[
  		18.14632380557623,
  		-8.529256966360562,
  		-0.2684574061490184
  	],
  	[
  		18.14588965814982,
  		-8.52527515513535,
  		-0.26732221689151964
  	],
  	[
  		18.14861460583956,
  		-8.521839153784533,
  		-0.2651332022591703
  	],
  	[
  		18.15243794887172,
  		-8.519072778985526,
  		-0.266054510073017
  	],
  	[
  		18.15324419258062,
  		-8.515835600592812,
  		-0.2683502185214922
  	],
  	[
  		18.152599627717102,
  		-8.511875025361253,
  		-0.2677072473601498
  	],
  	[
  		18.15483225809964,
  		-8.508306667428464,
  		-0.2653448275227775
  	],
  	[
  		18.15881123712669,
  		-8.505503802556943,
  		-0.265759832716596
  	],
  	[
  		18.16011710409624,
  		-8.502390965925244,
  		-0.2681688564302197
  	],
  	[
  		18.15937174403964,
  		-8.49847980162014,
  		-0.2680483650120424
  	],
  	[
  		18.161082521981232,
  		-8.494788333000125,
  		-0.2656263100561908
  	],
  	[
  		18.16510597540434,
  		-8.491921720544912,
  		-0.2655137919951661
  	],
  	[
  		18.16692721515772,
  		-8.488921143793485,
  		-0.26792362588278257
  	],
  	[
  		18.16619415690898,
  		-8.485084843612478,
  		-0.26833065864023903
  	],
  	[
  		18.167380122954192,
  		-8.481285771060415,
  		-0.26596596858780214
  	],
  	[
  		18.17133494531151,
  		-8.4783314241602,
  		-0.2653314817816067
  	],
  	[
  		18.17366287949308,
  		-8.475425546475815,
  		-0.2676286654921707
  	],
  	[
  		18.17305520238197,
  		-8.47168616229563,
  		-0.26854365465909763
  	],
  	[
  		18.17373756590414,
  		-8.467799804410474,
  		-0.2663498542118032
  	],
  	[
  		18.17751282490225,
  		-8.464737547459736,
  		-0.2652231161206406
  	],
  	[
  		18.180314251545518,
  		-8.461904142522238,
  		-0.2672992864513744
  	],
  	[
  		18.17993766971309,
  		-8.458278732462086,
  		-0.2686781836998022
  	],
  	[
  		18.180161771699538,
  		-8.45432952960674,
  		-0.26676042151032503
  	],
  	[
  		18.18365471086786,
  		-8.451144173734177,
  		-0.2651943171062786
  	],
  	[
  		18.18687499095213,
  		-8.448357752100744,
  		-0.2669514569771187
  	],
  	[
  		18.18682393590388,
  		-8.44485791858431,
  		-0.2687285799162206
  	],
  	[
  		18.186658146000802,
  		-8.440873560503292,
  		-0.26717900760993823
  	],
  	[
  		18.189778701207032,
  		-8.43755581741788,
  		-0.2652490287624124
  	],
  	[
  		18.19334331505858,
  		-8.434788625488345,
  		-0.266604236412667
  	],
  	[
  		18.19369714973775,
  		-8.431420231020349,
  		-0.26869620898168073
  	],
  	[
  		18.19322706674185,
  		-8.427429727145805,
  		-0.2675892359406218
  	],
  	[
  		18.19590375100476,
  		-8.423976629961029,
  		-0.2653872114533882
  	],
  	[
  		18.19972063899013,
  		-8.42119970362613,
  		-0.2662766214154953
  	],
  	[
  		18.20053830526573,
  		-8.417961847672254,
  		-0.268583466305746
  	],
  	[
  		18.19986479197956,
  		-8.41399449959208,
  		-0.26797141449190914
  	],
  	[
  		18.202045845265108,
  		-8.410409324501654,
  		-0.26560312732032554
  	],
  	[
  		18.20601175226859,
  		-8.40759403900534,
  		-0.26598309340705384
  	],
  	[
  		18.207331621095918,
  		-8.404480223710882,
  		-0.2683968968002842
  	],
  	[
  		18.206563916352188,
  		-8.400563870333247,
  		-0.26830822073865107
  	],
  	[
  		18.20822318515517,
  		-8.396856616861136,
  		-0.26588754877510523
  	],
  	[
  		18.21222618263301,
  		-8.393976030423458,
  		-0.2657403485613009
  	],
  	[
  		18.21406194217196,
  		-8.390973542773732,
  		-0.2681473102167236
  	],
  	[
  		18.21331415758334,
  		-8.387133796079434,
  		-0.26858659778281824
  	],
  	[
  		18.21444838802031,
  		-8.383319935932999,
  		-0.2662307508496613
  	],
  	[
  		18.21837532533403,
  		-8.380350105961508,
  		-0.2655623327970738
  	],
  	[
  		18.220716444664127,
  		-8.377441087360056,
  		-0.2678497696735913
  	],
  	[
  		18.22010049103357,
  		-8.373699344063773,
  		-0.2687945728077963
  	],
  	[
  		18.22073366445785,
  		-8.369799707048834,
  		-0.2666164005027402
  	],
  	[
  		18.22447370488796,
  		-8.366720706028147,
  		-0.2654581253648516
  	],
  	[
  		18.22728629608869,
  		-8.36388274916512,
  		-0.2675174580728965
  	],
  	[
  		18.22690829294429,
  		-8.360256044837119,
  		-0.2689229263526189
  	],
  	[
  		18.22708739092415,
  		-8.356295368978557,
  		-0.26702712135767265
  	],
  	[
  		18.23053889398872,
  		-8.353092552403368,
  		-0.2654340410681053
  	],
  	[
  		18.23376635605228,
  		-8.350299890990225,
  		-0.2671683422489712
  	],
  	[
  		18.23371952864932,
  		-8.346799436874157,
  		-0.2689678677073817
  	],
  	[
  		18.23351328448488,
  		-8.342805366849783,
  		-0.2674456856411586
  	],
  	[
  		18.23658680735678,
  		-8.339469695226665,
  		-0.2654941034824601
  	],
  	[
  		18.24015293464801,
  		-8.336694371642313,
  		-0.2668216744637028
  	],
  	[
  		18.24051497092753,
  		-8.333325354639339,
  		-0.2689296544506448
  	],
  	[
  		18.24001126808524,
  		-8.32932717533989,
  		-0.2678538776449556
  	],
  	[
  		18.24263636864745,
  		-8.325856079167979,
  		-0.26563684773038915
  	],
  	[
  		18.24644912249228,
  		-8.32306915176412,
  		-0.2664939501791063
  	],
  	[
  		18.24727869415414,
  		-8.319830674098979,
  		-0.2688108546086842
  	],
  	[
  		18.24657823703895,
  		-8.315857422852169,
  		-0.268232149708568
  	],
  	[
  		18.248706112874473,
  		-8.312254937040077,
  		-0.2658562589970544
  	],
  	[
  		18.25266027078998,
  		-8.309427807600935,
  		-0.2662025570372699
  	],
  	[
  		18.253993521367168,
  		-8.30631263058466,
  		-0.268618647179718
  	],
  	[
  		18.25320646172748,
  		-8.302392276625048,
  		-0.2685649613781374
  	],
  	[
  		18.25481046194967,
  		-8.298668353709902,
  		-0.2661445313312087
  	],
  	[
  		18.258794713025072,
  		-8.29577422491149,
  		-0.2659623683269334
  	],
  	[
  		18.26064352366567,
  		-8.292769411660721,
  		-0.2683650799615348
  	],
  	[
  		18.25988338079976,
  		-8.288926935295365,
  		-0.2688373756899786
  	],
  	[
  		18.260964145977322,
  		-8.285097889424641,
  		-0.26648954760107013
  	],
  	[
  		18.26486462586347,
  		-8.2821130160658,
  		-0.2657874321179211
  	],
  	[
  		18.26721775197529,
  		-8.279200343940996,
  		-0.2680625979156042
  	],
  	[
  		18.26659693565176,
  		-8.275457292473712,
  		-0.2690387318867996
  	],
  	[
  		18.26717862256825,
  		-8.271543883191546,
  		-0.2668755694452055
  	],
  	[
  		18.27088587201058,
  		-8.268448870310278,
  		-0.2656865378709881
  	],
  	[
  		18.27370678682653,
  		-8.265605654542147,
  		-0.26772773658460397
  	],
  	[
  		18.27332993857251,
  		-8.261978363807447,
  		-0.26916013839187863
  	],
  	[
  		18.27346152702819,
  		-8.258005770137713,
  		-0.26728635736080963
  	],
  	[
  		18.27687342479479,
  		-8.254786012374916,
  		-0.26566649224237093
  	],
  	[
  		18.28010500552369,
  		-8.251986374803344,
  		-0.2673768238165332
  	],
  	[
  		18.28006462335813,
  		-8.248485760935399,
  		-0.269197901442829
  	],
  	[
  		18.27981632286579,
  		-8.24448166692121,
  		-0.26770270745151675
  	],
  	[
  		18.282845408267022,
  		-8.241128768278712,
  		-0.2657298334862297
  	],
  	[
  		18.28641022831111,
  		-8.23834466899897,
  		-0.26702892438842557
  	],
  	[
  		18.28678311814619,
  		-8.234975620195424,
  		-0.2691523203371114
  	],
  	[
  		18.286243331866018,
  		-8.23096930842194,
  		-0.2681076584922559
  	],
  	[
  		18.28882033024443,
  		-8.227481100239354,
  		-0.2658758730423265
  	],
  	[
  		18.29262493923672,
  		-8.224683575691259,
  		-0.26670206779022154
  	],
  	[
  		18.29346783069225,
  		-8.221444590865566,
  		-0.26902696030109813
  	],
  	[
  		18.29273844659431,
  		-8.21746517664137,
  		-0.2684821894383929
  	],
  	[
  		18.29481501657885,
  		-8.213845831882297,
  		-0.2660983409750875
  	],
  	[
  		18.29875488874692,
  		-8.211006497434424,
  		-0.26641172586550244
  	],
  	[
  		18.30010244769771,
  		-8.207890093871754,
  		-0.268828943878258
  	],
  	[
  		18.29929381289219,
  		-8.20396520283149,
  		-0.2688092105141822
  	],
  	[
  		18.30084645355904,
  		-8.200225484270652,
  		-0.2663884874539289
  	],
  	[
  		18.3048085728544,
  		-8.197317500119377,
  		-0.26617379910854433
  	],
  	[
  		18.30667196069345,
  		-8.194310447380703,
  		-0.2685698040081027
  	],
  	[
  		18.30589749870098,
  		-8.190465084459058,
  		-0.26907641295810775
  	],
  	[
  		18.30692679661514,
  		-8.186621176923776,
  		-0.2667351181269992
  	],
  	[
  		18.31079887200838,
  		-8.183621320948578,
  		-0.2660021609631557
  	],
  	[
  		18.31316381582456,
  		-8.180704938759485,
  		-0.2682642668579131
  	],
  	[
  		18.31253596337136,
  		-8.176960133363622,
  		-0.2692712874625157
  	],
  	[
  		18.31306878439775,
  		-8.173033470526542,
  		-0.26712206571545033
  	],
  	[
  		18.3167404059114,
  		-8.169922253375004,
  		-0.26590469197897
  	],
  	[
  		18.31957085383232,
  		-8.167073882194257,
  		-0.26792591436171315
  	],
  	[
  		18.319193179963772,
  		-8.163445795708704,
  		-0.2693862156580824
  	],
  	[
  		18.31927961593427,
  		-8.159461516407173,
  		-0.26753174460076
  	],
  	[
  		18.32265060534563,
  		-8.156225111921966,
  		-0.2658886112384511
  	],
  	[
  		18.32588656366728,
  		-8.153418476257782,
  		-0.2675737242002124
  	],
  	[
  		18.32585114282462,
  		-8.149917656033073,
  		-0.2694177330870927
  	],
  	[
  		18.325562340765067,
  		-8.145903721833937,
  		-0.26794774572734903
  	],
  	[
  		18.32854518118106,
  		-8.142533731305948,
  		-0.26595674924804713
  	],
  	[
  		18.3321089936962,
  		-8.139740833784614,
  		-0.26722606679631594
  	],
  	[
  		18.332490927509898,
  		-8.136371650253142,
  		-0.2693663769823531
  	],
  	[
  		18.33191679018682,
  		-8.132357321947033,
  		-0.2683502991925934
  	],
  	[
  		18.33444417779507,
  		-8.12885216274398,
  		-0.2661066669077148
  	],
  	[
  		18.33824142364471,
  		-8.126043957516949,
  		-0.26689946980371343
  	],
  	[
  		18.33909688901224,
  		-8.122804726198646,
  		-0.2692348211024381
  	],
  	[
  		18.3383397682482,
  		-8.118819110835275,
  		-0.2687212115161577
  	],
  	[
  		18.3403649726451,
  		-8.115183482383005,
  		-0.2663330493866647
  	],
  	[
  		18.3442899020467,
  		-8.112331615821601,
  		-0.266611598331439
  	],
  	[
  		18.34565185471049,
  		-8.109214405635926,
  		-0.2690322793429744
  	],
  	[
  		18.3448222086103,
  		-8.105285017897726,
  		-0.2690453234648493
  	],
  	[
  		18.34632237143069,
  		-8.101529739111978,
  		-0.26662721687572394
  	],
  	[
  		18.35026247993104,
  		-8.098607640743287,
  		-0.2663773863909417
  	],
  	[
  		18.35213985497663,
  		-8.095598656093548,
  		-0.2687693087255891
  	],
  	[
  		18.35135188285637,
  		-8.091750251103928,
  		-0.2693072699583671
  	],
  	[
  		18.35233016158955,
  		-8.087892166189654,
  		-0.2669762162051892
  	],
  	[
  		18.356172470386262,
  		-8.084876632629452,
  		-0.266209031724513
  	],
  	[
  		18.35855118641695,
  		-8.081957256632633,
  		-0.26845965466702654
  	],
  	[
  		18.3579163306362,
  		-8.078210684756248,
  		-0.2694968863243912
  	],
  	[
  		18.35840082232016,
  		-8.074271340779793,
  		-0.2673643962010705
  	],
  	[
  		18.36203620665604,
  		-8.071143587269228,
  		-0.2661167633536485
  	],
  	[
  		18.36487653764268,
  		-8.068290470966057,
  		-0.2681199319757967
  	],
  	[
  		18.36449865918933,
  		-8.064661562393692,
  		-0.26960643765300973
  	],
  	[
  		18.36454029052222,
  		-8.060666354130614,
  		-0.2677757063084185
  	],
  	[
  		18.367868156108692,
  		-8.057412402647804,
  		-0.2661058266352709
  	],
  	[
  		18.37111036081312,
  		-8.054599383033102,
  		-0.2677667203599951
  	],
  	[
  		18.37107945576452,
  		-8.051098099738557,
  		-0.2696319820278838
  	],
  	[
  		18.37075169996743,
  		-8.047075084497342,
  		-0.2681897529812079
  	],
  	[
  		18.3736867263896,
  		-8.043687429225487,
  		-0.2661785023093432
  	],
  	[
  		18.377251026717968,
  		-8.04088619271896,
  		-0.2674185033742321
  	],
  	[
  		18.37764267706572,
  		-8.037516866345992,
  		-0.2695740803274732
  	],
  	[
  		18.37703573688096,
  		-8.033495456918773,
  		-0.2685903924080719
  	],
  	[
  		18.37951132461559,
  		-8.029972686693041,
  		-0.2663331037725921
  	],
  	[
  		18.38330286228231,
  		-8.027154404708204,
  		-0.26709374570683914
  	],
  	[
  		18.384170196125872,
  		-8.023914564788143,
  		-0.26943749907630127
  	],
  	[
  		18.3833873476581,
  		-8.019923681849644,
  		-0.2689581005205092
  	],
  	[
  		18.3853579830424,
  		-8.016270897880334,
  		-0.26656385178410175
  	],
  	[
  		18.389269889711,
  		-8.013407023117354,
  		-0.2668077571963079
  	],
  	[
  		18.39064518755786,
  		-8.010288501081957,
  		-0.26922934505583557
  	],
  	[
  		18.38979725404744,
  		-8.006355502204153,
  		-0.2692767008467373
  	],
  	[
  		18.3912426163229,
  		-8.002584123345263,
  		-0.26686040261244587
  	],
  	[
  		18.39516244829164,
  		-7.999648420724871,
  		-0.26657577476914673
  	],
  	[
  		18.397053296050522,
  		-7.996637189007529,
  		-0.2689615495971842
  	],
  	[
  		18.396254496598768,
  		-7.992786703340514,
  		-0.2695329866751267
  	],
  	[
  		18.39717895016937,
  		-7.988913805151901,
  		-0.2672113859639942
  	],
  	[
  		18.40099383908376,
  		-7.985883382577869,
  		-0.266411315577044
  	],
  	[
  		18.40338328473719,
  		-7.982960197938687,
  		-0.2686487517178192
  	],
  	[
  		18.402744797193307,
  		-7.979212666041849,
  		-0.2697160632890461
  	],
  	[
  		18.40317782802907,
  		-7.975260075144031,
  		-0.2676004949383009
  	],
  	[
  		18.406778415854788,
  		-7.972116135062747,
  		-0.2663221577927635
  	],
  	[
  		18.40962687441867,
  		-7.969257803882082,
  		-0.2683059861688156
  	],
  	[
  		18.40925085628676,
  		-7.965628562749282,
  		-0.2698183102092639
  	],
  	[
  		18.40924608030127,
  		-7.961622004885175,
  		-0.26801010478609844
  	],
  	[
  		18.412533347929482,
  		-7.958351362542747,
  		-0.2663149471655213
  	],
  	[
  		18.41577851414106,
  		-7.955531231803351,
  		-0.2679508670281762
  	],
  	[
  		18.41575558987484,
  		-7.952030226231291,
  		-0.269836562352924
  	],
  	[
  		18.41538621600365,
  		-7.947997738756897,
  		-0.2684227364863416
  	],
  	[
  		18.41827563698524,
  		-7.944592976059845,
  		-0.26639100333907023
  	],
  	[
  		18.42183737798791,
  		-7.94178296669853,
  		-0.26760263493855974
  	],
  	[
  		18.42223965888948,
  		-7.938413580409954,
  		-0.26977188490912435
  	],
  	[
  		18.42159830743956,
  		-7.934384706955178,
  		-0.2688195849053145
  	],
  	[
  		18.424024346746982,
  		-7.930844982314081,
  		-0.2665490336355961
  	],
  	[
  		18.42780657371702,
  		-7.928015962516853,
  		-0.2672776622941
  	],
  	[
  		18.42868773938158,
  		-7.92477586983963,
  		-0.2696285039498692
  	],
  	[
  		18.42787709682845,
  		-7.920779306783066,
  		-0.26918278835946274
  	],
  	[
  		18.42979674932,
  		-7.917110197859347,
  		-0.2667819732170029
  	],
  	[
  		18.43369240907554,
  		-7.914234024368723,
  		-0.26699343004159254
  	],
  	[
  		18.43508197333652,
  		-7.911114318839656,
  		-0.2694145533305799
  	],
  	[
  		18.43421394354765,
  		-7.907177453215286,
  		-0.2694963864319611
  	],
  	[
  		18.43560721308556,
  		-7.9033905539268,
  		-0.26708095439500007
  	],
  	[
  		18.439503558509408,
  		-7.900440983310009,
  		-0.2667638556557232
  	],
  	[
  		18.44140789292879,
  		-7.897427427520342,
  		-0.2691420198846661
  	],
  	[
  		18.44059604108027,
  		-7.893574441757853,
  		-0.26974652437270524
  	],
  	[
  		18.441469839480952,
  		-7.88968734839426,
  		-0.2674329580712236
  	],
  	[
  		18.44525440683001,
  		-7.886641821143554,
  		-0.26660215256386505
  	],
  	[
  		18.44765564399806,
  		-7.883715011961741,
  		-0.2688251198176235
  	],
  	[
  		18.44701102149954,
  		-7.879966205624672,
  		-0.26992327492003504
  	],
  	[
  		18.44739614587773,
  		-7.876000949913046,
  		-0.2678223056723928
  	],
  	[
  		18.45096013169593,
  		-7.872841097605457,
  		-0.2665171986259161
  	],
  	[
  		18.453816264656318,
  		-7.869977340619478,
  		-0.26847992598085
  	],
  	[
  		18.453440524327,
  		-7.866347735291907,
  		-0.2700193945197639
  	],
  	[
  		18.45339093416984,
  		-7.862330058221308,
  		-0.2682319351915266
  	],
  	[
  		18.45663605122692,
  		-7.859042840631595,
  		-0.2665138645862806
  	],
  	[
  		18.45988434741253,
  		-7.85621562325497,
  		-0.26812374699860325
  	],
  	[
  		18.459866450241613,
  		-7.85271453314329,
  		-0.27003097048615715
  	],
  	[
  		18.45945831225777,
  		-7.84867292051487,
  		-0.2686425905009474
  	],
  	[
  		18.46230093631139,
  		-7.845251459557697,
  		-0.2665942745626975
  	],
  	[
  		18.46586028606195,
  		-7.842432480735315,
  		-0.2677748792046943
  	],
  	[
  		18.46627265071801,
  		-7.83906339680292,
  		-0.26996033229330874
  	],
  	[
  		18.46559760060363,
  		-7.835027067991854,
  		-0.26903740765401934
  	],
  	[
  		18.46797414671893,
  		-7.831470923441485,
  		-0.26675642781787773
  	],
  	[
  		18.47174694271972,
  		-7.828631146464553,
  		-0.26745213722922684
  	],
  	[
  		18.47264031559801,
  		-7.825390787458449,
  		-0.269811606733737
  	],
  	[
  		18.47180305319739,
  		-7.821388667447478,
  		-0.26939766697365014
  	],
  	[
  		18.47367038075808,
  		-7.81770355380266,
  		-0.2669937856257883
  	],
  	[
  		18.47754985238055,
  		-7.814814815888707,
  		-0.2671698484379531
  	],
  	[
  		18.4789534631438,
  		-7.811694336743738,
  		-0.2695929215826871
  	],
  	[
  		18.47806556474985,
  		-7.807753425510072,
  		-0.2697066625683682
  	],
  	[
  		18.47940718314867,
  		-7.803951682971282,
  		-0.2672953820097063
  	],
  	[
  		18.48327999773453,
  		-7.800988059079199,
  		-0.2669436411846218
  	],
  	[
  		18.48519849046664,
  		-7.797972694299829,
  		-0.2693159960964768
  	],
  	[
  		18.484374255905248,
  		-7.794117297195257,
  		-0.2699522689960345
  	],
  	[
  		18.485196983488642,
  		-7.790216537025206,
  		-0.2676503224562033
  	],
  	[
  		18.48895064987903,
  		-7.787155590551539,
  		-0.2667865587957856
  	],
  	[
  		18.49136404837886,
  		-7.784225619325447,
  		-0.2689969935950158
  	],
  	[
  		18.49071337796537,
  		-7.780475408544242,
  		-0.2701240676180179
  	],
  	[
  		18.49105026501059,
  		-7.776498045346339,
  		-0.26804140348153255
  	],
  	[
  		18.49457627701713,
  		-7.773321638474751,
  		-0.2667062147844253
  	],
  	[
  		18.49744187005523,
  		-7.770453194669131,
  		-0.26864956314288463
  	],
  	[
  		18.49706655563182,
  		-7.766823050142706,
  		-0.270213857977989
  	],
  	[
  		18.49697354430916,
  		-7.762795132517519,
  		-0.2684504636638896
  	],
  	[
  		18.5001747307957,
  		-7.759490779214105,
  		-0.2667074245631296
  	],
  	[
  		18.50342816613514,
  		-7.756657146978784,
  		-0.26829215749285357
  	],
  	[
  		18.50341609535912,
  		-7.753156092530999,
  		-0.2702197062791039
  	],
  	[
  		18.502969521491718,
  		-7.749106036561049,
  		-0.26886038278204344
  	],
  	[
  		18.50576323688366,
  		-7.745667196802377,
  		-0.2667930998987224
  	],
  	[
  		18.50932157879983,
  		-7.74283992032725,
  		-0.2679445580713796
  	],
  	[
  		18.509743251729958,
  		-7.739470704830221,
  		-0.2701435073699798
  	],
  	[
  		18.50903685678421,
  		-7.735427964252255,
  		-0.2692529863664657
  	],
  	[
  		18.511360248815222,
  		-7.731854468057153,
  		-0.26695983521610706
  	],
  	[
  		18.51512603384306,
  		-7.729004512315665,
  		-0.26762218060516435
  	],
  	[
  		18.51603174462329,
  		-7.725763836250839,
  		-0.2699888966453476
  	],
  	[
  		18.51516998311882,
  		-7.721756987793616,
  		-0.26960858243575914
  	],
  	[
  		18.516983281714182,
  		-7.718055397160328,
  		-0.2672001209829054
  	],
  	[
  		18.52084792195645,
  		-7.715154677822669,
  		-0.26734204946838974
  	],
  	[
  		18.52226490991799,
  		-7.712033055601713,
  		-0.26976464465490685
  	],
  	[
  		18.52136031663822,
  		-7.708089292833216,
  		-0.269913110215709
  	],
  	[
  		18.522646554213267,
  		-7.704271886863515,
  		-0.2675051479811077
  	],
  	[
  		18.526497575948532,
  		-7.70129471658573,
  		-0.2671188585693791
  	],
  	[
  		18.52842833715878,
  		-7.698277093251511,
  		-0.2694843055804303
  	],
  	[
  		18.52759434245536,
  		-7.694420013811194,
  		-0.2701526587915288
  	],
  	[
  		18.5283639624062,
  		-7.690505147179683,
  		-0.2678615684513019
  	],
  	[
  		18.532088059308933,
  		-7.687429201531456,
  		-0.26696494371717494
  	],
  	[
  		18.534512077136952,
  		-7.684495548600242,
  		-0.2691606902298624
  	],
  	[
  		18.53385873460936,
  		-7.680744887245149,
  		-0.2703174168410631
  	],
  	[
  		18.53414534194728,
  		-7.676754974903417,
  		-0.2682522732458412
  	],
  	[
  		18.53763564882761,
  		-7.673562737622087,
  		-0.2668878187892889
  	],
  	[
  		18.54050779439899,
  		-7.670688968473414,
  		-0.2688109200778637
  	],
  	[
  		18.54013562725834,
  		-7.667059016885186,
  		-0.2704001950217143
  	],
  	[
  		18.53999683323859,
  		-7.663020472615895,
  		-0.2686609799674086
  	],
  	[
  		18.54315607162624,
  		-7.659699554041636,
  		-0.266893121702747
  	],
  	[
  		18.546411216835622,
  		-7.656858821850298,
  		-0.2684523402354139
  	],
  	[
  		18.54640694758149,
  		-7.653358176036829,
  		-0.27039894221882793
  	],
  	[
  		18.54592050338218,
  		-7.649299419074171,
  		-0.2690682395974358
  	],
  	[
  		18.54866773122936,
  		-7.645843841654115,
  		-0.2669819605303551
  	],
  	[
  		18.5522220772875,
  		-7.643007646919056,
  		-0.2681036772630666
  	],
  	[
  		18.55265531174986,
  		-7.639638820231722,
  		-0.2703154773158493
  	],
  	[
  		18.55191538178923,
  		-7.635589250490965,
  		-0.26945696289101984
  	],
  	[
  		18.55418942124296,
  		-7.631999364459234,
  		-0.26715174730689134
  	],
  	[
  		18.55794412130437,
  		-7.629138701327185,
  		-0.2677825336696105
  	],
  	[
  		18.5588634286162,
  		-7.625897818376893,
  		-0.2701544648610387
  	],
  	[
  		18.5579753879401,
  		-7.621886085223093,
  		-0.2698086144833721
  	],
  	[
  		18.55973669411101,
  		-7.618168486278211,
  		-0.2673948998232604
  	],
  	[
  		18.56358402006069,
  		-7.615255518098586,
  		-0.2675038650967856
  	],
  	[
  		18.5650148158059,
  		-7.61213279562109,
  		-0.26992476689915573
  	],
  	[
  		18.56409120352297,
  		-7.608185651501791,
  		-0.2701069511394386
  	],
  	[
  		18.56532601544484,
  		-7.60435345667945,
  		-0.26770152402118
  	],
  	[
  		18.56915192583574,
  		-7.601362464286719,
  		-0.2672831174077402
  	],
  	[
  		18.571096336299007,
  		-7.598342650579368,
  		-0.2696391358181937
  	],
  	[
  		18.57025045081234,
  		-7.594483742481837,
  		-0.2703410415511797
  	],
  	[
  		18.57096930157613,
  		-7.590555171413792,
  		-0.2680591674017427
  	],
  	[
  		18.57466228612218,
  		-7.587464443414611,
  		-0.2671328659894417
  	],
  	[
  		18.57709659000121,
  		-7.584527008250561,
  		-0.2693128904311147
  	],
  	[
  		18.5764384171612,
  		-7.580775546403524,
  		-0.2704993212102924
  	],
  	[
  		18.57667712236388,
  		-7.576773559721646,
  		-0.26845051886239
  	],
  	[
  		18.58012936228618,
  		-7.573565445591441,
  		-0.2670593603922375
  	],
  	[
  		18.58300888851272,
  		-7.570686362988617,
  		-0.2689601676457944
  	],
  	[
  		18.58263768524853,
  		-7.567056389902075,
  		-0.2705755064756601
  	],
  	[
  		18.58245527166125,
  		-7.563007424623654,
  		-0.2688577006664014
  	],
  	[
  		18.58557148268605,
  		-7.559670317789332,
  		-0.26706863359692573
  	],
  	[
  		18.58882873108595,
  		-7.556822459293207,
  		-0.2686007051566898
  	],
  	[
  		18.58883099565656,
  		-7.553322289913516,
  		-0.2705680703703096
  	],
  	[
  		18.58830593005284,
  		-7.549254970119008,
  		-0.2692642005849965
  	],
  	[
  		18.591005435870468,
  		-7.545782965662988,
  		-0.2671623164315193
  	],
  	[
  		18.5945559192322,
  		-7.542937806568069,
  		-0.2682529587015825
  	],
  	[
  		18.5949993236908,
  		-7.539569368526223,
  		-0.27047904760463565
  	],
  	[
  		18.59422698944237,
  		-7.535513018753802,
  		-0.26965033529051635
  	],
  	[
  		18.596450152314322,
  		-7.531906913996875,
  		-0.2673359307188165
  	],
  	[
  		18.600194491548002,
  		-7.529035448562056,
  		-0.2679325586946477
  	],
  	[
  		18.60112680211204,
  		-7.525794662461146,
  		-0.2703121166271747
  	],
  	[
  		18.600213381439158,
  		-7.521777945324204,
  		-0.2699978538450986
  	],
  	[
  		18.60192272452387,
  		-7.518044972426076,
  		-0.2675827001777659
  	],
  	[
  		18.60575207819388,
  		-7.515119422135196,
  		-0.2676566175845399
  	],
  	[
  		18.60719742305935,
  		-7.511996166283409,
  		-0.2700780702700708
  	],
  	[
  		18.60625529114146,
  		-7.508045712042714,
  		-0.27029302097699504
  	],
  	[
  		18.6074375955975,
  		-7.504198979711776,
  		-0.2678929983541243
  	],
  	[
  		18.61123836758952,
  		-7.501193915556674,
  		-0.2674400541772891
  	],
  	[
  		18.61319608876343,
  		-7.498172275968924,
  		-0.2697891820649364
  	],
  	[
  		18.61233907465364,
  		-7.494311396784554,
  		-0.2705217724989114
  	],
  	[
  		18.613007277487178,
  		-7.49036974844951,
  		-0.2682528564644967
  	],
  	[
  		18.61666732426865,
  		-7.48726342801112,
  		-0.2672933102338316
  	],
  	[
  		18.61911425102295,
  		-7.484323030989116,
  		-0.2694592600290204
  	],
  	[
  		18.61845135221484,
  		-7.480570744290254,
  		-0.2706744712033001
  	],
  	[
  		18.61864293366962,
  		-7.476557310306316,
  		-0.2686447722268026
  	],
  	[
  		18.62205610416871,
  		-7.473332898883474,
  		-0.2672249185700895
  	],
  	[
  		18.62494392620227,
  		-7.470449037541576,
  		-0.2691053043070551
  	],
  	[
  		18.62457459146587,
  		-7.466819094052915,
  		-0.2707450992692708
  	],
  	[
  		18.62434907088602,
  		-7.462760489519475,
  		-0.2690530397430597
  	],
  	[
  		18.62741963550303,
  		-7.459406234127544,
  		-0.2672394608393293
  	],
  	[
  		18.63068085076877,
  		-7.45655187597921,
  		-0.2687454579519478
  	],
  	[
  		18.63068907652011,
  		-7.453051901068628,
  		-0.27073192722420497
  	],
  	[
  		18.63012719384894,
  		-7.448976825675281,
  		-0.2694573980242634
  	],
  	[
  		18.63277671051663,
  		-7.445487662293279,
  		-0.2673377330216916
  	],
  	[
  		18.63632512806053,
  		-7.442634025550845,
  		-0.2683974846404011
  	],
  	[
  		18.63677921279979,
  		-7.439265945889551,
  		-0.27063633776716095
  	],
  	[
  		18.63597667825071,
  		-7.435203829375304,
  		-0.2698407915338971
  	],
  	[
  		18.638146720008358,
  		-7.431580853664201,
  		-0.2675155617231189
  	],
  	[
  		18.64188237967074,
  		-7.428699145280118,
  		-0.26807893284689105
  	],
  	[
  		18.642827137143808,
  		-7.425458152114951,
  		-0.2704642936667842
  	],
  	[
  		18.64189059731198,
  		-7.421437432948101,
  		-0.27018466866503615
  	],
  	[
  		18.64354466756518,
  		-7.417688209368574,
  		-0.2677664878879484
  	],
  	[
  		18.64735782906294,
  		-7.414750547267374,
  		-0.2678054494036267
  	],
  	[
  		18.64881621446721,
  		-7.41162618575465,
  		-0.2702252100680229
  	],
  	[
  		18.64785845481698,
  		-7.407673290699828,
  		-0.2704741431039513
  	],
  	[
  		18.64898590593088,
  		-7.403811512982525,
  		-0.2680790563557864
  	],
  	[
  		18.65276324383914,
  		-7.400792792420991,
  		-0.2675913725222965
  	],
  	[
  		18.6547337258473,
  		-7.397768998198128,
  		-0.2699315941911049
  	],
  	[
  		18.65386832420255,
  		-7.393907075390732,
  		-0.2706967317422753
  	],
  	[
  		18.65448351113957,
  		-7.38995180474784,
  		-0.2684400343436593
  	],
  	[
  		18.65811315283176,
  		-7.386830699198706,
  		-0.2674485346602291
  	],
  	[
  		18.660569463599032,
  		-7.383886460079102,
  		-0.2695986519903795
  	],
  	[
  		18.659905131991962,
  		-7.380134147647672,
  		-0.2708426729681865
  	],
  	[
  		18.660046459851248,
  		-7.376108739891025,
  		-0.2688326428461966
  	],
  	[
  		18.6634221221543,
  		-7.372868377887095,
  		-0.2673835566359244
  	],
  	[
  		18.66631616901114,
  		-7.36997920520541,
  		-0.2692424006640962
  	],
  	[
  		18.66595047377307,
  		-7.366349678244115,
  		-0.27090608749701
  	],
  	[
  		18.66568029496873,
  		-7.362281048388012,
  		-0.2692388299142339
  	],
  	[
  		18.66870794549714,
  		-7.358910482672212,
  		-0.2674018783508205
  	],
  	[
  		18.67196984033715,
  		-7.356048862170635,
  		-0.2688809206474551
  	],
  	[
  		18.671987481737318,
  		-7.352549776653587,
  		-0.2708854711310633
  	],
  	[
  		18.67138604202368,
  		-7.348466535805886,
  		-0.26964102271843
  	],
  	[
  		18.67398823009082,
  		-7.344960847061235,
  		-0.2675033173327516
  	],
  	[
  		18.6775313910916,
  		-7.342098287344502,
  		-0.2685334027646335
  	],
  	[
  		18.67799706036929,
  		-7.338730611128453,
  		-0.2707832883990297
  	],
  	[
  		18.67716240318665,
  		-7.334662335803596,
  		-0.2700204610459298
  	],
  	[
  		18.67928150785536,
  		-7.331023085218247,
  		-0.2676846009110541
  	],
  	[
  		18.68300511066434,
  		-7.328130564114295,
  		-0.2682152965094023
  	],
  	[
  		18.68396396755714,
  		-7.324889585381936,
  		-0.27060479245837005
  	],
  	[
  		18.68300221014301,
  		-7.320864443002575,
  		-0.2703593971392743
  	],
  	[
  		18.68460444313947,
  		-7.317099710608425,
  		-0.26793743937444414
  	],
  	[
  		18.688398447655842,
  		-7.314149701296598,
  		-0.2679437518659178
  	],
  	[
  		18.68987098841197,
  		-7.311024341637593,
  		-0.27036012124993253
  	],
  	[
  		18.68889565409945,
  		-7.30706874254066,
  		-0.27064350702549944
  	],
  	[
  		18.689970782083122,
  		-7.303192398660352,
  		-0.26825210398281624
  	],
  	[
  		18.69372175368879,
  		-7.300159880356706,
  		-0.2677325725743986
  	],
  	[
  		18.69570486544364,
  		-7.297133803674673,
  		-0.2700624135635295
  	],
  	[
  		18.69482907219438,
  		-7.29327048194796,
  		-0.2708599478291085
  	],
  	[
  		18.69539372183776,
  		-7.289302034582957,
  		-0.2686140289260762
  	],
  	[
  		18.69899029013897,
  		-7.286165960375227,
  		-0.26759269831758853
  	],
  	[
  		18.70145704305086,
  		-7.283218064795292,
  		-0.2697258329295282
  	],
  	[
  		18.70078893485914,
  		-7.279465402371494,
  		-0.27099923791817343
  	],
  	[
  		18.70088326594784,
  		-7.275428471204682,
  		-0.2690061969961157
  	],
  	[
  		18.70421965855614,
  		-7.272172443166427,
  		-0.2675319131715334
  	],
  	[
  		18.70711961923749,
  		-7.269277761941696,
  		-0.2693674309454684
  	],
  	[
  		18.70675631766822,
  		-7.265648708981263,
  		-0.27105657035273534
  	],
  	[
  		18.70644269661748,
  		-7.261570168309409,
  		-0.2694122091428152
  	],
  	[
  		18.709425891931858,
  		-7.258183417976414,
  		-0.26755439255581964
  	],
  	[
  		18.71268863019756,
  		-7.255314588493357,
  		-0.2690057220908992
  	],
  	[
  		18.71271293288878,
  		-7.251816072008781,
  		-0.2710295390246465
  	],
  	[
  		18.712074580579,
  		-7.247724952783933,
  		-0.26981220862962324
  	],
  	[
  		18.71462801310092,
  		-7.244203055262754,
  		-0.2676601382703998
  	],
  	[
  		18.71816612185098,
  		-7.241331350697727,
  		-0.2686577313739911
  	],
  	[
  		18.71864301782433,
  		-7.237964487955602,
  		-0.2709213051047176
  	],
  	[
  		18.71777690430244,
  		-7.233889989990753,
  		-0.2701888024629941
  	],
  	[
  		18.719845279053352,
  		-7.230235035654449,
  		-0.26784522951016737
  	],
  	[
  		18.72355644816058,
  		-7.227331586158964,
  		-0.26834211088348814
  	],
  	[
  		18.724528200875298,
  		-7.22409075598806,
  		-0.2707377383729052
  	],
  	[
  		18.723542241036732,
  		-7.220061282918802,
  		-0.2705247400542519
  	],
  	[
  		18.72509151313519,
  		-7.216281411600209,
  		-0.2681025590953628
  	],
  	[
  		18.72886610593856,
  		-7.213318713042493,
  		-0.2680732648487729
  	],
  	[
  		18.7303526210036,
  		-7.210192788686227,
  		-0.27048879602139925
  	],
  	[
  		18.729359871720742,
  		-7.206234284664462,
  		-0.2708040266377189
  	],
  	[
  		18.73038329721741,
  		-7.202344077210986,
  		-0.2684195119291891
  	],
  	[
  		18.73410745361026,
  		-7.199297421793964,
  		-0.2678655130137206
  	],
  	[
  		18.73610417548958,
  		-7.196269634056822,
  		-0.2701867022397618
  	],
  	[
  		18.73521829886728,
  		-7.19240492817382,
  		-0.27101535842989904
  	],
  	[
  		18.73573274773155,
  		-7.188423984231715,
  		-0.2687837076415822
  	],
  	[
  		18.73929531575198,
  		-7.185272574333269,
  		-0.2677305032785092
  	],
  	[
  		18.741773097018278,
  		-7.182321503739643,
  		-0.2698483777624666
  	],
  	[
  		18.74110115310048,
  		-7.178568403192566,
  		-0.27114974379565554
  	],
  	[
  		18.74114843886766,
  		-7.174520585611082,
  		-0.2691775014519011
  	],
  	[
  		18.744444104924952,
  		-7.171248237056182,
  		-0.26767474782194844
  	],
  	[
  		18.74735155575068,
  		-7.168348711759376,
  		-0.26948842929584943
  	],
  	[
  		18.74699041016289,
  		-7.1647198748017,
  		-0.2712006646559894
  	],
  	[
  		18.746635077567937,
  		-7.160632359980493,
  		-0.26958235927483737
  	],
  	[
  		18.74957189942073,
  		-7.157228849300533,
  		-0.26770170262251874
  	],
  	[
  		18.75283747751114,
  		-7.154353405891134,
  		-0.2691256326767117
  	],
  	[
  		18.7528690507881,
  		-7.150855569804612,
  		-0.2711676882184691
  	],
  	[
  		18.75219442867279,
  		-7.146757309374569,
  		-0.2699809274741387
  	],
  	[
  		18.75469727336838,
  		-7.143218648012087,
  		-0.2678125219540025
  	],
  	[
  		18.758231681576028,
  		-7.140338471276501,
  		-0.26877949788337313
  	],
  	[
  		18.75871888151966,
  		-7.136971962650232,
  		-0.27105402477559964
  	],
  	[
  		18.75782373719273,
  		-7.13289233850465,
  		-0.2703550667363293
  	],
  	[
  		18.75983759099109,
  		-7.129220751887175,
  		-0.2680021876972709
  	],
  	[
  		18.76353871387185,
  		-7.12630695781513,
  		-0.2684648131478491
  	],
  	[
  		18.76452299579458,
  		-7.12306608481804,
  		-0.27086486832474044
  	],
  	[
  		18.76351496699439,
  		-7.119033073007054,
  		-0.27068573979346094
  	],
  	[
  		18.76500949351629,
  		-7.115237619849833,
  		-0.2682620595179826
  	],
  	[
  		18.7687661718884,
  		-7.112262847652971,
  		-0.2681983174406629
  	],
  	[
  		18.77026584782213,
  		-7.109135964389361,
  		-0.27061052318340945
  	],
  	[
  		18.76925899452458,
  		-7.105175746282773,
  		-0.27096006894585484
  	],
  	[
  		18.77022707561306,
  		-7.101270935643791,
  		-0.2685819249692372
  	],
  	[
  		18.77392647846182,
  		-7.098210789624276,
  		-0.2679939071552263
  	],
  	[
  		18.77593451931825,
  		-7.095180785667543,
  		-0.270305444001733
  	],
  	[
  		18.77504135092196,
  		-7.091315427352093,
  		-0.271165158692017
  	],
  	[
  		18.775503086662738,
  		-7.087321497891368,
  		-0.2689472559294161
  	],
  	[
  		18.77903307157408,
  		-7.084155207657886,
  		-0.26786222131469745
  	],
  	[
  		18.78151991959814,
  		-7.081200423408784,
  		-0.269963045329586
  	],
  	[
  		18.78084732239435,
  		-7.077447700000704,
  		-0.2712922586422404
  	],
  	[
  		18.780845563570608,
  		-7.073388596645722,
  		-0.26934009617024063
  	],
  	[
  		18.78410270544044,
  		-7.070100663941822,
  		-0.2678096835373409
  	],
  	[
  		18.787014879937548,
  		-7.06719576849545,
  		-0.26960106209582724
  	],
  	[
  		18.78665870631511,
  		-7.063567863886335,
  		-0.2713361055497863
  	],
  	[
  		18.78625930900052,
  		-7.059471022820929,
  		-0.26974400621550093
  	],
  	[
  		18.789151912265368,
  		-7.05605138847758,
  		-0.2678406438041549
  	],
  	[
  		18.79241674142309,
  		-7.053168752582677,
  		-0.2692376134369802
  	],
  	[
  		18.79245731966811,
  		-7.049671872802826,
  		-0.27129610626474737
  	],
  	[
  		18.79174495765483,
  		-7.045566239082715,
  		-0.27013949870241855
  	],
  	[
  		18.79419928188809,
  		-7.0420113865059,
  		-0.26795455214172365
  	],
  	[
  		18.79772699673456,
  		-7.039122205929239,
  		-0.268890726181791
  	],
  	[
  		18.79822629773186,
  		-7.03575648951583,
  		-0.27117545028979284
  	],
  	[
  		18.797300127652928,
  		-7.031671336978524,
  		-0.27050919386765065
  	],
  	[
  		18.799263412521,
  		-7.027984133366457,
  		-0.2681470093741269
  	],
  	[
  		18.80295049216042,
  		-7.025059567522852,
  		-0.2685775376755065
  	],
  	[
  		18.80394850246631,
  		-7.021818791137653,
  		-0.2709800318859129
  	],
  	[
  		18.80291677492813,
  		-7.017782157187907,
  		-0.2708356289256749
  	],
  	[
  		18.804358707663592,
  		-7.013971603591627,
  		-0.26840941640439053
  	],
  	[
  		18.80809493846877,
  		-7.010984581799791,
  		-0.2683128679211612
  	],
  	[
  		18.80960775943881,
  		-7.007856740855715,
  		-0.2707206520694203
  	],
  	[
  		18.80858440958751,
  		-7.003894304528775,
  		-0.2711035042550405
  	],
  	[
  		18.80950110254981,
  		-6.999975765063166,
  		-0.2687306607710634
  	],
  	[
  		18.81317233947989,
  		-6.996901877339178,
  		-0.26811109770876523
  	],
  	[
  		18.81519290508932,
  		-6.993869751418265,
  		-0.27041062319275583
  	],
  	[
  		18.814290227550032,
  		-6.990003621377799,
  		-0.2713028824520871
  	],
  	[
  		18.81470203920109,
  		-6.985997191880061,
  		-0.2690966755599664
  	],
  	[
  		18.818198122909358,
  		-6.982816363782026,
  		-0.2679832532206721
  	],
  	[
  		18.82069353700474,
  		-6.979857753151491,
  		-0.27006585012639783
  	],
  	[
  		18.82001818681032,
  		-6.976105186097473,
  		-0.2714234685819048
  	],
  	[
  		18.81996967439773,
  		-6.97203524881065,
  		-0.2694898555063228
  	],
  	[
  		18.82318630353949,
  		-6.968731839019906,
  		-0.26793455584231735
  	],
  	[
  		18.826103455872868,
  		-6.965821501512829,
  		-0.26970155638112303
  	],
  	[
  		18.82574990275725,
  		-6.962194361261014,
  		-0.2714607434206841
  	],
  	[
  		18.82530859029396,
  		-6.958088427573733,
  		-0.2698919652048568
  	],
  	[
  		18.82815616827601,
  		-6.954653150395679,
  		-0.2679694991567345
  	],
  	[
  		18.83142055542169,
  		-6.951763278756034,
  		-0.2693375480848073
  	],
  	[
  		18.8314689881519,
  		-6.948267545097276,
  		-0.2714145246036184
  	],
  	[
  		18.83072004689359,
  		-6.94415468124267,
  		-0.2702861034421204
  	],
  	[
  		18.83312535307937,
  		-6.940584169467819,
  		-0.2680880966450845
  	],
  	[
  		18.83664612893003,
  		-6.937685897670672,
  		-0.26899208252625323
  	],
  	[
  		18.83715643563473,
  		-6.934321093300631,
  		-0.27128847789968974
  	],
  	[
  		18.83619991954206,
  		-6.93023046126546,
  		-0.27065307013684553
  	],
  	[
  		18.83811133003157,
  		-6.926527905501723,
  		-0.2682844288233429
  	],
  	[
  		18.84178489977375,
  		-6.923592488637368,
  		-0.268680313385303
  	],
  	[
  		18.84279599664295,
  		-6.920352140825837,
  		-0.2710875760056131
  	],
  	[
  		18.841741269814282,
  		-6.916311785924612,
  		-0.2709749803188868
  	],
  	[
  		18.84313088587334,
  		-6.912486887331109,
  		-0.26855016172309953
  	],
  	[
  		18.84684607447432,
  		-6.909487327488931,
  		-0.2684185719735938
  	],
  	[
  		18.84837320182777,
  		-6.906359199654641,
  		-0.2708239022540294
  	],
  	[
  		18.84733370809278,
  		-6.902394649841939,
  		-0.2712392240904637
  	],
  	[
  		18.84819815442113,
  		-6.898462736359558,
  		-0.2688745689959338
  	],
  	[
  		18.851841196932618,
  		-6.895374950933989,
  		-0.2682213427648263
  	],
  	[
  		18.85387407778405,
  		-6.892341115753315,
  		-0.2705111818680904
  	],
  	[
  		18.8529625012456,
  		-6.888474105425234,
  		-0.2714332566920426
  	],
  	[
  		18.85332428755921,
  		-6.884455839731831,
  		-0.26924273969658724
  	],
  	[
  		18.856784453459422,
  		-6.881259678169131,
  		-0.2680973959200929
  	],
  	[
  		18.85929096362798,
  		-6.878298145307951,
  		-0.27016336809903313
  	],
  	[
  		18.858612888660108,
  		-6.874545682094599,
  		-0.27154805174215524
  	],
  	[
  		18.8585186222728,
  		-6.870465637262843,
  		-0.2696357708133248
  	],
  	[
  		18.861693531618087,
  		-6.867146336637742,
  		-0.26805360766533404
  	],
  	[
  		18.86461709869822,
  		-6.864231227041015,
  		-0.26979792211074993
  	],
  	[
  		18.86426715803825,
  		-6.860604945403668,
  		-0.2715795076021013
  	],
  	[
  		18.86378458970946,
  		-6.856490760235443,
  		-0.270038260741826
  	],
  	[
  		18.86658428577416,
  		-6.853038935965122,
  		-0.26809383832277434
  	],
  	[
  		18.86985018409042,
  		-6.850142539893659,
  		-0.269434199608067
  	],
  	[
  		18.869905783136062,
  		-6.846647669874146,
  		-0.2715278894742876
  	],
  	[
  		18.869122235493762,
  		-6.842528456458826,
  		-0.27043013365119684
  	],
  	[
  		18.87147565277799,
  		-6.838941487383813,
  		-0.26821706903664133
  	],
  	[
  		18.87499161940825,
  		-6.83603470517605,
  		-0.2690889227203434
  	],
  	[
  		18.8755132047589,
  		-6.832670753414864,
  		-0.2713953623788769
  	],
  	[
  		18.87452903491486,
  		-6.828575706040447,
  		-0.2707934981881253
  	],
  	[
  		18.876386269966098,
  		-6.824857203976256,
  		-0.26841701406667384
  	],
  	[
  		18.88004805635737,
  		-6.821911505875927,
  		-0.26877891175038154
  	],
  	[
  		18.88107183222379,
  		-6.81867137236093,
  		-0.2711892913758412
  	],
  	[
  		18.87999660227799,
  		-6.814628329693328,
  		-0.2711113163454817
  	],
  	[
  		18.88133061287818,
  		-6.810788279590446,
  		-0.26868656113430134
  	],
  	[
  		18.885026426630468,
  		-6.807776676035391,
  		-0.26852016626118613
  	],
  	[
  		18.88656597671257,
  		-6.804647693485975,
  		-0.2709212144865493
  	],
  	[
  		18.88551350536304,
  		-6.800681925850141,
  		-0.2713697745747922
  	],
  	[
  		18.88632339098271,
  		-6.796736188705157,
  		-0.2690130327223924
  	],
  	[
  		18.88993978053205,
  		-6.793634856169866,
  		-0.268325564536279
  	],
  	[
  		18.89198430550977,
  		-6.790599010463943,
  		-0.27060391564268593
  	],
  	[
  		18.89106663951829,
  		-6.786732017900804,
  		-0.27155717617738334
  	],
  	[
  		18.89137653289379,
  		-6.782701473116377,
  		-0.2693814178468157
  	],
  	[
  		18.89480332707561,
  		-6.779490800415315,
  		-0.26820541046182383
  	],
  	[
  		18.89731756752348,
  		-6.776525483041093,
  		-0.2702531938661432
  	],
  	[
  		18.8966401503927,
  		-6.77277397254868,
  		-0.2716650579665958
  	],
  	[
  		18.89649724630248,
  		-6.768683387568514,
  		-0.2697748624199325
  	],
  	[
  		18.89963213581355,
  		-6.765348578229017,
  		-0.26816525356885274
  	],
  	[
  		18.90255970397662,
  		-6.762428157720988,
  		-0.2698861650939257
  	],
  	[
  		18.9022149747835,
  		-6.758803074686297,
  		-0.2716894198801053
  	],
  	[
  		18.90168983463861,
  		-6.75468032834774,
  		-0.2701748738979748
  	],
  	[
  		18.9044445325418,
  		-6.751212774241703,
  		-0.2682091978354318
  	],
  	[
  		18.90770852167952,
  		-6.748309071084583,
  		-0.2695210059047451
  	],
  	[
  		18.90777457513201,
  		-6.744815714513587,
  		-0.27163027431407233
  	],
  	[
  		18.90695388187795,
  		-6.740689781769339,
  		-0.2705638690513314
  	],
  	[
  		18.90925857243485,
  		-6.737087080310813,
  		-0.2683353501357462
  	],
  	[
  		18.912766428944508,
  		-6.734171357530443,
  		-0.2691765759516001
  	],
  	[
  		18.91330023151771,
  		-6.730808312272954,
  		-0.27149133969669265
  	],
  	[
  		18.91228649234541,
  		-6.726708534495135,
  		-0.2709231370611151
  	],
  	[
  		18.914091862880348,
  		-6.722974664753333,
  		-0.26853870782119243
  	],
  	[
  		18.91773872746456,
  		-6.720018219782131,
  		-0.2688676134182472
  	],
  	[
  		18.918776463562523,
  		-6.716778396639352,
  		-0.2712791741092596
  	],
  	[
  		18.91767869256542,
  		-6.712732271446749,
  		-0.2712355723751994
  	],
  	[
  		18.91896045242465,
  		-6.708877750671474,
  		-0.2688098838521176
  	],
  	[
  		18.92263423061216,
  		-6.705853917534614,
  		-0.2686109474179324
  	],
  	[
  		18.924187434553012,
  		-6.702724160648852,
  		-0.2710057402300326
  	],
  	[
  		18.92311991323903,
  		-6.698756917271123,
  		-0.27148836302823914
  	],
  	[
  		18.92387777153487,
  		-6.694797799795957,
  		-0.2691381289166278
  	],
  	[
  		18.92746509467404,
  		-6.691682934285729,
  		-0.2684197359528716
  	],
  	[
  		18.92952110985522,
  		-6.688644896857812,
  		-0.27068493147494127
  	],
  	[
  		18.9285956007705,
  		-6.684777654378478,
  		-0.2716696319651128
  	],
  	[
  		18.92885551695263,
  		-6.680735149595732,
  		-0.2695073209254964
  	],
  	[
  		18.93224672054387,
  		-6.677509852598916,
  		-0.26830272994248444
  	],
  	[
  		18.93476974908229,
  		-6.674540894587208,
  		-0.2703310694534365
  	],
  	[
  		18.93409069475937,
  		-6.670789985790107,
  		-0.2717706274189002
  	],
  	[
  		18.93390204800863,
  		-6.666689189017092,
  		-0.2698997223959605
  	],
  	[
  		18.93699532409725,
  		-6.663339172596626,
  		-0.2682667586042458
  	],
  	[
  		18.93992690588964,
  		-6.660413248720314,
  		-0.2699622377292568
  	],
  	[
  		18.9395865461837,
  		-6.656789513001844,
  		-0.2717889940191666
  	],
  	[
  		18.93901962799238,
  		-6.652658206105081,
  		-0.270299325586465
  	],
  	[
  		18.94172799296167,
  		-6.649175086359669,
  		-0.2683150935297777
  	],
  	[
  		18.944990424090168,
  		-6.646264140572731,
  		-0.2695976406420446
  	],
  	[
  		18.9450646634209,
  		-6.642772048910137,
  		-0.2717237036542312
  	],
  	[
  		18.94420901798492,
  		-6.638639573331588,
  		-0.2706858768569119
  	],
  	[
  		18.94646334293236,
  		-6.635021355716525,
  		-0.26844546410449033
  	],
  	[
  		18.94996341167649,
  		-6.632096426862374,
  		-0.26925302781875055
  	],
  	[
  		18.950509402908978,
  		-6.628734727887324,
  		-0.27157877094312644
  	],
  	[
  		18.94946656605097,
  		-6.624630043961112,
  		-0.27104164062856323
  	],
  	[
  		18.95122028975781,
  		-6.620881354683354,
  		-0.26865231709316534
  	],
  	[
  		18.954851818399522,
  		-6.617913952734752,
  		-0.268946790966156
  	],
  	[
  		18.95590307527161,
  		-6.614674735052461,
  		-0.2713618104011432
  	],
  	[
  		18.95478367741633,
  		-6.610625579973782,
  		-0.271350953957481
  	],
  	[
  		18.95601219609263,
  		-6.606756938915767,
  		-0.26892788387272887
  	],
  	[
  		18.95966342227052,
  		-6.603720432637015,
  		-0.2686934804092985
  	],
  	[
  		18.961230431604562,
  		-6.600590364020692,
  		-0.2710845978685086
  	],
  	[
  		18.96014806033764,
  		-6.59662141785487,
  		-0.2715987769117431
  	],
  	[
  		18.96085440321356,
  		-6.592649529211474,
  		-0.26925813075006333
  	],
  	[
  		18.96441170433058,
  		-6.589520570523725,
  		-0.26850577866982434
  	],
  	[
  		18.96648064870849,
  		-6.586480971898792,
  		-0.27075961165905904
  	],
  	[
  		18.9655475216294,
  		-6.582613424001681,
  		-0.2717744740209405
  	],
  	[
  		18.96575836103355,
  		-6.578559685534508,
  		-0.269628946253426
  	],
  	[
  		18.96911262721779,
  		-6.575319252135989,
  		-0.2683937503200548
  	],
  	[
  		18.97164551319169,
  		-6.572347167957174,
  		-0.27040422710194834
  	],
  	[
  		18.970964995462978,
  		-6.56859683150558,
  		-0.2718705036615876
  	],
  	[
  		18.970730833719468,
  		-6.564486458713676,
  		-0.2700226765020586
  	],
  	[
  		18.97378079213507,
  		-6.561120467378355,
  		-0.268363087054335
  	],
  	[
  		18.97671785573688,
  		-6.558189613080784,
  		-0.2700345424551183
  	],
  	[
  		18.97638140995588,
  		-6.554566870826817,
  		-0.2718825089840229
  	],
  	[
  		18.97577482324579,
  		-6.550427941899313,
  		-0.2704207332332849
  	],
  	[
  		18.97843455766624,
  		-6.546928526871454,
  		-0.26841590798431214
  	],
  	[
  		18.98169750772918,
  		-6.5440108297443,
  		-0.26966906526926543
  	],
  	[
  		18.98178044446453,
  		-6.540520067565638,
  		-0.2718111495088948
  	],
  	[
  		18.98089105720528,
  		-6.536381818287991,
  		-0.2708051401551304
  	],
  	[
  		18.98309337611938,
  		-6.53274753260072,
  		-0.2685510438859226
  	],
  	[
  		18.98658705587158,
  		-6.529813991359227,
  		-0.26932663013429065
  	],
  	[
  		18.98714432078456,
  		-6.526453138809841,
  		-0.2716607689925811
  	],
  	[
  		18.98607507990921,
  		-6.522344657708727,
  		-0.2711580625908605
  	],
  	[
  		18.98777329986957,
  		-6.518580162714485,
  		-0.2687624013438321
  	],
  	[
  		18.99139178149326,
  		-6.515602289790106,
  		-0.26902191878481013
  	],
  	[
  		18.99245569184656,
  		-6.512363307297526,
  		-0.2714386668433273
  	],
  	[
  		18.99131688848641,
  		-6.508311828439563,
  		-0.27146174200652634
  	],
  	[
  		18.99249033944304,
  		-6.504428589854649,
  		-0.2690402974040903
  	],
  	[
  		18.9961206972311,
  		-6.501379954778952,
  		-0.26877124787431733
  	],
  	[
  		18.99770058262258,
  		-6.498249086791801,
  		-0.2711562007536898
  	],
  	[
  		18.99660678071228,
  		-6.494279542151482,
  		-0.2717040885026604
  	],
  	[
  		18.99725829098138,
  		-6.490294190600855,
  		-0.2693728047254979
  	],
  	[
  		19.000787992955498,
  		-6.487151816024192,
  		-0.2685870627421178
  	],
  	[
  		19.00286732024753,
  		-6.484110018026309,
  		-0.2708284648315284
  	],
  	[
  		19.0019293478164,
  		-6.480242808176254,
  		-0.2718732976408998
  	],
  	[
  		19.002088328246142,
  		-6.476177279562687,
  		-0.26974442317553243
  	],
  	[
  		19.00540727314009,
  		-6.472922139255432,
  		-0.26847862374185655
  	],
  	[
  		19.00794767283228,
  		-6.469946276891724,
  		-0.27046971642116563
  	],
  	[
  		19.00726853098358,
  		-6.466197106516333,
  		-0.2719620134135529
  	],
  	[
  		19.00698688711884,
  		-6.462076736803641,
  		-0.27013678399001
  	],
  	[
  		19.00999584342091,
  		-6.458695454414199,
  		-0.2684512669053411
  	],
  	[
  		19.01293580362877,
  		-6.455759127836222,
  		-0.27009829933971113
  	],
  	[
  		19.01260612979248,
  		-6.452137992348715,
  		-0.2719668371000223
  	],
  	[
  		19.01195741876454,
  		-6.447991014285014,
  		-0.2705331587136444
  	],
  	[
  		19.01457104005457,
  		-6.44447596685975,
  		-0.2685079209930223
  	],
  	[
  		19.01783082211741,
  		-6.441550933473729,
  		-0.269732679937531
  	],
  	[
  		19.01792400992236,
  		-6.438061617117435,
  		-0.271888555292793
  	],
  	[
  		19.016999150737192,
  		-6.433917280878674,
  		-0.2709141919814069
  	],
  	[
  		19.01915127461016,
  		-6.430267377232705,
  		-0.268646141109125
  	],
  	[
  		19.02263570879526,
  		-6.427324726268434,
  		-0.26939001384556
  	],
  	[
  		19.02320568146531,
  		-6.423964990478005,
  		-0.271731564317917
  	],
  	[
  		19.022108014473872,
  		-6.41985221793744,
  		-0.2712622173474237
  	],
  	[
  		19.02375470966902,
  		-6.416072855382622,
  		-0.2688600178990304
  	],
  	[
  		19.02735633243075,
  		-6.413084111221139,
  		-0.2690870271766903
  	],
  	[
  		19.028434173229428,
  		-6.409845443689677,
  		-0.2715033392388103
  	],
  	[
  		19.02727433671012,
  		-6.405791518169705,
  		-0.27156129276409463
  	],
  	[
  		19.02839481435096,
  		-6.401894048372298,
  		-0.2691400808925959
  	],
  	[
  		19.03200180103012,
  		-6.39883314286067,
  		-0.2688385920792549
  	],
  	[
  		19.03359422158206,
  		-6.395701374611457,
  		-0.2712164035270436
  	],
  	[
  		19.0324866387656,
  		-6.391730700846235,
  		-0.27179708399578945
  	],
  	[
  		19.03308690878336,
  		-6.387732593558157,
  		-0.26947381931570213
  	],
  	[
  		19.03658562079976,
  		-6.384576525219754,
  		-0.2686572687053011
  	],
  	[
  		19.03867637769499,
  		-6.381532579430932,
  		-0.2708841330076596
  	],
  	[
  		19.037731455253418,
  		-6.377665551806176,
  		-0.2719602929393906
  	],
  	[
  		19.0378414436317,
  		-6.373588620630312,
  		-0.26984551846242233
  	],
  	[
  		19.04112380562649,
  		-6.370319105962348,
  		-0.2685527033281219
  	],
  	[
  		19.04367115164415,
  		-6.367339299550093,
  		-0.27052322990819644
  	],
  	[
  		19.04299147116986,
  		-6.363591126210469,
  		-0.2720424641842486
  	],
  	[
  		19.04266443028583,
  		-6.359461076089545,
  		-0.27023794156035963
  	],
  	[
  		19.04563054660092,
  		-6.356064629493511,
  		-0.26852944789662614
  	],
  	[
  		19.048573217546302,
  		-6.353122669287028,
  		-0.2701502719159279
  	],
  	[
  		19.04824794396779,
  		-6.349502958126051,
  		-0.2720408808179451
  	],
  	[
  		19.04755921117275,
  		-6.345348109261132,
  		-0.2706323356246125
  	],
  	[
  		19.05012590029445,
  		-6.341817845609258,
  		-0.2685900694933899
  	],
  	[
  		19.05338274078036,
  		-6.338885363757996,
  		-0.269784302109004
  	],
  	[
  		19.05348509101618,
  		-6.335397708621717,
  		-0.27195629440569
  	],
  	[
  		19.05252594094875,
  		-6.331247354990531,
  		-0.2710112400148981
  	],
  	[
  		19.054627844762578,
  		-6.327582445547854,
  		-0.26873272799625353
  	],
  	[
  		19.0581023464831,
  		-6.324630464176291,
  		-0.26944340005776823
  	],
  	[
  		19.05868413619201,
  		-6.321272023803022,
  		-0.2717940917752034
  	],
  	[
  		19.05755847201526,
  		-6.31715496243836,
  		-0.27135645722679
  	],
  	[
  		19.0591525499938,
  		-6.313361027755823,
  		-0.2689505831337805
  	],
  	[
  		19.06273757189446,
  		-6.310361264801382,
  		-0.26914260342777874
  	],
  	[
  		19.06382853650823,
  		-6.307123204119891,
  		-0.2715608942815357
  	],
  	[
  		19.06264819871001,
  		-6.303066670990053,
  		-0.2716507156521487
  	],
  	[
  		19.06371625910149,
  		-6.29915577881548,
  		-0.26923368079112747
  	],
  	[
  		19.06729910740508,
  		-6.296082223626633,
  		-0.2688972074231513
  	],
  	[
  		19.06890549234689,
  		-6.292950241633219,
  		-0.2712696065773597
  	],
  	[
  		19.06778413228389,
  		-6.288978468244178,
  		-0.2718822937144629
  	],
  	[
  		19.06833281429277,
  		-6.284968073658003,
  		-0.26956996632000324
  	],
  	[
  		19.07180033254817,
  		-6.281798146851802,
  		-0.2687207281250458
  	],
  	[
  		19.07390237050071,
  		-6.278752443079133,
  		-0.2709351455618643
  	],
  	[
  		19.07295075779342,
  		-6.274885454723153,
  		-0.2720402103752361
  	],
  	[
  		19.07301171983667,
  		-6.27079783991693,
  		-0.26994379027212173
  	],
  	[
  		19.07625539198972,
  		-6.267513157495136,
  		-0.2686205576813075
  	],
  	[
  		19.07881211808545,
  		-6.26453025973384,
  		-0.2705718860920263
  	],
  	[
  		19.078131584978692,
  		-6.260782927807689,
  		-0.2721164705449597
  	],
  	[
  		19.07776035272218,
  		-6.256643970624244,
  		-0.27033537692006865
  	],
  	[
  		19.08068229483782,
  		-6.253231940465245,
  		-0.26860201745639134
  	],
  	[
  		19.08362932111358,
  		-6.250285007313972,
  		-0.2701978675121482
  	],
  	[
  		19.08330923195072,
  		-6.246666776397471,
  		-0.2721087748343343
  	],
  	[
  		19.08258128042402,
  		-6.242504921462335,
  		-0.2707294071852541
  	],
  	[
  		19.0850982157544,
  		-6.238958644693423,
  		-0.26866786937328907
  	],
  	[
  		19.088354002233302,
  		-6.236019434852165,
  		-0.269832871937509
  	],
  	[
  		19.088464652429778,
  		-6.232533119944095,
  		-0.2720190899648313
  	],
  	[
  		19.08747311752989,
  		-6.228377648203222,
  		-0.27110592515948123
  	],
  	[
  		19.08952158406991,
  		-6.224696909891846,
  		-0.2688151741848472
  	],
  	[
  		19.09298839753863,
  		-6.221736222202932,
  		-0.2694926821323052
  	],
  	[
  		19.09358186292405,
  		-6.218378906763463,
  		-0.27185058088712694
  	],
  	[
  		19.09243099772317,
  		-6.214258584802052,
  		-0.2714467612468313
  	],
  	[
  		19.09397004749065,
  		-6.210449521643211,
  		-0.2690360958548796
  	],
  	[
  		19.0975401646882,
  		-6.207439310456086,
  		-0.26919364655285055
  	],
  	[
  		19.09864382279218,
  		-6.204201665573948,
  		-0.2716122678341825
  	],
  	[
  		19.09744558372531,
  		-6.200143566954726,
  		-0.2717364719088573
  	],
  	[
  		19.09845792026914,
  		-6.196218508133463,
  		-0.26932255671093025
  	],
  	[
  		19.10201834726582,
  		-6.19313289358999,
  		-0.268951722543368
  	],
  	[
  		19.103636319876628,
  		-6.190000097329222,
  		-0.2713171808538768
  	],
  	[
  		19.10250456997894,
  		-6.186028133269528,
  		-0.2719621547939673
  	],
  	[
  		19.10299904402859,
  		-6.182004984403108,
  		-0.2696606149799191
  	],
  	[
  		19.10643675383823,
  		-6.178821531888723,
  		-0.2687779666829995
  	],
  	[
  		19.10854904878052,
  		-6.175773774376795,
  		-0.2709784518880585
  	],
  	[
  		19.107593494609468,
  		-6.171907643783787,
  		-0.2721130417449869
  	],
  	[
  		19.107603732968663,
  		-6.167808951145396,
  		-0.2700338669714966
  	],
  	[
  		19.11081111099196,
  		-6.164509929570901,
  		-0.268681471559899
  	],
  	[
  		19.11337373785112,
  		-6.161523163057119,
  		-0.27061251553072324
  	],
  	[
  		19.11269582414217,
  		-6.157777543952204,
  		-0.2721822841994639
  	],
  	[
  		19.11227768488676,
  		-6.153629335962969,
  		-0.2704254560833366
  	],
  	[
  		19.11515719272152,
  		-6.150202153873045,
  		-0.2686666276515488
  	],
  	[
  		19.11810581353635,
  		-6.147249780713557,
  		-0.270237511722311
  	],
  	[
  		19.11779225986616,
  		-6.143633312010241,
  		-0.2721676193221139
  	],
  	[
  		19.11702387868372,
  		-6.139464205659289,
  		-0.2708165689719194
  	],
  	[
  		19.11949373619069,
  		-6.135902680734851,
  		-0.2687360666987084
  	],
  	[
  		19.12274487224669,
  		-6.132956014573023,
  		-0.2698712792300845
  	],
  	[
  		19.12286662949462,
  		-6.12947161848694,
  		-0.2720704673986551
  	],
  	[
  		19.12184049402768,
  		-6.125310732771855,
  		-0.2711895376452827
  	],
  	[
  		19.12383889527856,
  		-6.121614972495752,
  		-0.2688860437390876
  	],
  	[
  		19.12729462998597,
  		-6.118645228682985,
  		-0.26953223389424535
  	],
  	[
  		19.1279005590576,
  		-6.115289128074485,
  		-0.27189573286374
  	],
  	[
  		19.12672272650622,
  		-6.111165348441617,
  		-0.271526071506318
  	],
  	[
  		19.1282092055268,
  		-6.107341774569033,
  		-0.2691101679364114
  	],
  	[
  		19.131761322095173,
  		-6.104320777123622,
  		-0.2692347035094939
  	],
  	[
  		19.1328783739746,
  		-6.10108356537935,
  		-0.2716516692182798
  	],
  	[
  		19.131660152562098,
  		-6.097023552481309,
  		-0.2718099948644063
  	],
  	[
  		19.13262009847452,
  		-6.093085032330839,
  		-0.2693979945562853
  	],
  	[
  		19.13615544904238,
  		-6.089987219315701,
  		-0.26899498536094074
  	],
  	[
  		19.13778612061868,
  		-6.086853714657342,
  		-0.2713514993635162
  	],
  	[
  		19.13664167316807,
  		-6.082881333182071,
  		-0.2720297568982191
  	],
  	[
  		19.13708479754672,
  		-6.078845975569331,
  		-0.2697373894891346
  	],
  	[
  		19.14049066949229,
  		-6.075649202927513,
  		-0.2688250093615546
  	],
  	[
  		19.14261285863562,
  		-6.072599189071753,
  		-0.2710096646555797
  	],
  	[
  		19.14165165685905,
  		-6.068733783430678,
  		-0.2721745043582273
  	],
  	[
  		19.141612823857,
  		-6.06462432745251,
  		-0.2701112015872648
  	],
  	[
  		19.14478211134528,
  		-6.06131101819087,
  		-0.2687318199943411
  	],
  	[
  		19.14735135799063,
  		-6.058320478638969,
  		-0.2706411040247229
  	],
  	[
  		19.14667352830959,
  		-6.054576252175107,
  		-0.27223674243806323
  	],
  	[
  		19.14621113469938,
  		-6.050419116667597,
  		-0.27050128337879953
  	],
  	[
  		19.14904686512504,
  		-6.046977213843403,
  		-0.2687211861292773
  	],
  	[
  		19.15199713469443,
  		-6.044019221667786,
  		-0.2702646919197783
  	],
  	[
  		19.151689497805272,
  		-6.040404812592288,
  		-0.2722161272501155
  	],
  	[
  		19.15088115231,
  		-6.036228452119411,
  		-0.2708916213508503
  	],
  	[
  		19.153303134790548,
  		-6.032652047822641,
  		-0.2687950492182029
  	],
  	[
  		19.15654983827532,
  		-6.029698007741112,
  		-0.26989968578510803
  	],
  	[
  		19.156680847018592,
  		-6.026215430647495,
  		-0.2721130573641151
  	],
  	[
  		19.15562165103778,
  		-6.022049269178401,
  		-0.2712619154718914
  	],
  	[
  		19.15756839912519,
  		-6.018338766806253,
  		-0.2689491892436387
  	],
  	[
  		19.16101326027933,
  		-6.015359722886352,
  		-0.26956094707929185
  	],
  	[
  		19.16163178607213,
  		-6.012005349899711,
  		-0.2719325522442233
  	],
  	[
  		19.16042714699921,
  		-6.007877926967093,
  		-0.2715944626279864
  	],
  	[
  		19.161861287931362,
  		-6.004040471285881,
  		-0.2691765152840482
  	],
  	[
  		19.165395019882283,
  		-6.00100851382027,
  		-0.2692663896303213
  	],
  	[
  		19.16652568876204,
  		-5.997772224769861,
  		-0.2716839174276342
  	],
  	[
  		19.16528827060018,
  		-5.993710411382715,
  		-0.2718749794635406
  	],
  	[
  		19.16619490790021,
  		-5.989758844890559,
  		-0.2694683979965996
  	],
  	[
  		19.16970450972585,
  		-5.986648445436069,
  		-0.2690305233506622
  	],
  	[
  		19.171348288134553,
  		-5.983514783194477,
  		-0.27138049343479115
  	],
  	[
  		19.17019133875784,
  		-5.979541834767855,
  		-0.2720897098002026
  	],
  	[
  		19.17058320090715,
  		-5.975494842597044,
  		-0.2698096367708562
  	],
  	[
  		19.17395586045059,
  		-5.972284118783807,
  		-0.2688642455487619
  	],
  	[
  		19.17608977504446,
  		-5.969232633554087,
  		-0.2710349610365845
  	],
  	[
  		19.175123174222698,
  		-5.965367919497614,
  		-0.2722285277085234
  	],
  	[
  		19.175036428252092,
  		-5.961248527580775,
  		-0.2701844035409002
  	],
  	[
  		19.1781658728414,
  		-5.957920377616089,
  		-0.26877598765635724
  	],
  	[
  		19.18074336317196,
  		-5.954926740455085,
  		-0.2706649997142541
  	],
  	[
  		19.18006614038613,
  		-5.951184018290045,
  		-0.27228565122608833
  	],
  	[
  		19.17955982810404,
  		-5.947018651690676,
  		-0.270575290015488
  	],
  	[
  		19.182349680834342,
  		-5.943561235458514,
  		-0.26877075925221544
  	],
  	[
  		19.1853031215134,
  		-5.940598271359186,
  		-0.2702883999312446
  	],
  	[
  		19.18500079548587,
  		-5.936985580935862,
  		-0.2722588829462471
  	],
  	[
  		19.184154879601948,
  		-5.9328029963154,
  		-0.2709638527727877
  	],
  	[
  		19.18652597262335,
  		-5.929210868828746,
  		-0.2688491801641086
  	],
  	[
  		19.18977059795344,
  		-5.926250006248172,
  		-0.26992280510810235
  	],
  	[
  		19.18991128875663,
  		-5.922769353392487,
  		-0.272149724857317
  	],
  	[
  		19.1888208760545,
  		-5.918598804538712,
  		-0.27133120144924733
  	],
  	[
  		19.19071424741376,
  		-5.914873045930682,
  		-0.2690075953947066
  	],
  	[
  		19.19414973877639,
  		-5.911885310668246,
  		-0.26958629090917724
  	],
  	[
  		19.19478007525158,
  		-5.90853226565225,
  		-0.2719636944731565
  	],
  	[
  		19.19355163034199,
  		-5.904402395413364,
  		-0.2716604337008539
  	],
  	[
  		19.19492950736815,
  		-5.900550120939889,
  		-0.2692392362647378
  	],
  	[
  		19.19844695296353,
  		-5.8975076587042,
  		-0.2692937963368005
  	],
  	[
  		19.19959000810729,
  		-5.89427191222723,
  		-0.27171045877248184
  	],
  	[
  		19.19833578083442,
  		-5.890209029614525,
  		-0.2719351579933804
  	],
  	[
  		19.19918725372743,
  		-5.886244000513081,
  		-0.2695332981482637
  	],
  	[
  		19.202672808600482,
  		-5.883121511550326,
  		-0.2690608436610487
  	],
  	[
  		19.20432871723596,
  		-5.879987231782821,
  		-0.27140190184483765
  	],
  	[
  		19.20316277638273,
  		-5.87601481465323,
  		-0.27214387363224113
  	],
  	[
  		19.20350059463684,
  		-5.871955647032013,
  		-0.2698759544568266
  	],
  	[
  		19.20684260072604,
  		-5.868731689322859,
  		-0.2688980724503574
  	],
  	[
  		19.20898559748546,
  		-5.86567807548599,
  		-0.2710536857507979
  	],
  	[
  		19.20801631360083,
  		-5.861814730430259,
  		-0.27227599517947493
  	],
  	[
  		19.20787888930007,
  		-5.857684910227589,
  		-0.2702512314715615
  	],
  	[
  		19.210970292498757,
  		-5.854342390280111,
  		-0.2688137003854281
  	],
  	[
  		19.21355335461642,
  		-5.851344971312688,
  		-0.2706811350094094
  	],
  	[
  		19.21287927742111,
  		-5.847604260998679,
  		-0.2723258663099752
  	],
  	[
  		19.2123272359275,
  		-5.843430328820529,
  		-0.2706404093932267
  	],
  	[
  		19.215073717465508,
  		-5.83995809221816,
  		-0.2688118508361311
  	],
  	[
  		19.218027796631382,
  		-5.836989605780157,
  		-0.2703030431796488
  	],
  	[
  		19.21773366546769,
  		-5.833379239001409,
  		-0.27229178424302203
  	],
  	[
  		19.21684766980092,
  		-5.829190007417736,
  		-0.2710264979494683
  	],
  	[
  		19.21917095546753,
  		-5.825582938902873,
  		-0.2688938475574597
  	],
  	[
  		19.22240969050891,
  		-5.822614688075691,
  		-0.2699377766492843
  	],
  	[
  		19.22256158331836,
  		-5.819136044447614,
  		-0.27217582705462423
  	],
  	[
  		19.22143800279113,
  		-5.814960825843523,
  		-0.27139031286006093
  	],
  	[
  		19.22327975430799,
  		-5.811220227267774,
  		-0.2690553964797306
  	],
  	[
  		19.22670326687325,
  		-5.808223408212297,
  		-0.2696016687487215
  	],
  	[
  		19.227346590859838,
  		-5.804871860233828,
  		-0.2719835749296056
  	],
  	[
  		19.22609227717307,
  		-5.800739055145169,
  		-0.27171421710901295
  	],
  	[
  		19.2274178103453,
  		-5.796872840571007,
  		-0.26928926237405254
  	],
  	[
  		19.23091549161486,
  		-5.793819565821598,
  		-0.26931112283466757
  	],
  	[
  		19.23207236222637,
  		-5.790584418443376,
  		-0.2717243876705628
  	],
  	[
  		19.23079965830978,
  		-5.786520365719086,
  		-0.2719839564162677
  	],
  	[
  		19.23159791139209,
  		-5.78254216251287,
  		-0.26958516376716485
  	],
  	[
  		19.235057235441133,
  		-5.779407575433994,
  		-0.26908084639671154
  	],
  	[
  		19.23672485510205,
  		-5.776272551143853,
  		-0.2714120147488118
  	],
  	[
  		19.235547777823122,
  		-5.772300206116766,
  		-0.2721861135962398
  	],
  	[
  		19.23583451185527,
  		-5.768229411786139,
  		-0.26992895583412174
  	],
  	[
  		19.23914280578186,
  		-5.764992008478527,
  		-0.26892119066562004
  	],
  	[
  		19.2412958873032,
  		-5.7619363160416,
  		-0.2710597355176517
  	],
  	[
  		19.240322074192918,
  		-5.758074194041471,
  		-0.27231192264419474
  	],
  	[
  		19.24013656069269,
  		-5.753934216870994,
  		-0.2703036880451343
  	],
  	[
  		19.24318873459661,
  		-5.750577666808141,
  		-0.26884066380205013
  	],
  	[
  		19.2457770407037,
  		-5.74757633554494,
  		-0.2706853180783928
  	],
  	[
  		19.24510453995653,
  		-5.743837559420101,
  		-0.2723552954715769
  	],
  	[
  		19.24450850288497,
  		-5.739655256915693,
  		-0.2706926774006335
  	],
  	[
  		19.24720986947581,
  		-5.736168352927198,
  		-0.2688432059683538
  	],
  	[
  		19.25016439493912,
  		-5.733194211268139,
  		-0.2703065032592019
  	],
  	[
  		19.2498763852991,
  		-5.729586037186611,
  		-0.2723150487206849
  	],
  	[
  		19.24895223262695,
  		-5.725390286995278,
  		-0.2710766209874222
  	],
  	[
  		19.25122663889297,
  		-5.721768583964218,
  		-0.2689291253219359
  	],
  	[
  		19.25445985845134,
  		-5.718792825242737,
  		-0.2699410811967493
  	],
  	[
  		19.25462208063582,
  		-5.715316453810569,
  		-0.272192741442093
  	],
  	[
  		19.2534664926779,
  		-5.711136548999439,
  		-0.2714374658580787
  	],
  	[
  		19.25525682677646,
  		-5.707381762293924,
  		-0.2690948145135024
  	],
  	[
  		19.25866742977514,
  		-5.704375537890366,
  		-0.2696069895253567
  	],
  	[
  		19.2593233407406,
  		-5.701025804708771,
  		-0.2719955166502627
  	],
  	[
  		19.25804348527713,
  		-5.696890039659904,
  		-0.2717585305818176
  	],
  	[
  		19.2593157761852,
  		-5.693010206044993,
  		-0.26933272208087283
  	],
  	[
  		19.26279372145806,
  		-5.689945895242867,
  		-0.2693193892703259
  	],
  	[
  		19.26396368917833,
  		-5.686711663057103,
  		-0.27173186946594713
  	],
  	[
  		19.262673002117282,
  		-5.682646240424453,
  		-0.2720232264259806
  	],
  	[
  		19.2634188450186,
  		-5.678655692196266,
  		-0.2696313514801338
  	],
  	[
  		19.266850781771502,
  		-5.67550846297593,
  		-0.26909222745511235
  	],
  	[
  		19.268531904249112,
  		-5.672373419185594,
  		-0.2714151083455552
  	],
  	[
  		19.26734342326835,
  		-5.66840110464188,
  		-0.27222060613618143
  	],
  	[
  		19.26757945350897,
  		-5.664319274665083,
  		-0.2699770178869534
  	],
  	[
  		19.2708535313119,
  		-5.66106819017047,
  		-0.26893763374557417
  	],
  	[
  		19.27301682847774,
  		-5.658010823939411,
  		-0.2710610382041247
  	],
  	[
  		19.2720385925024,
  		-5.654149795503408,
  		-0.2723411653513523
  	],
  	[
  		19.27180532336423,
  		-5.650000450292286,
  		-0.27035378522300363
  	],
  	[
  		19.27481609776151,
  		-5.646629052954837,
  		-0.26886197013387697
  	],
  	[
  		19.27741189430225,
  		-5.643624558239373,
  		-0.27068492894371915
  	],
  	[
  		19.27674038214388,
  		-5.639887480693027,
  		-0.2723785648785097
  	],
  	[
  		19.2761018972999,
  		-5.635697616278034,
  		-0.2707413642626386
  	],
  	[
  		19.27875674675065,
  		-5.632195591703859,
  		-0.2688691225165135
  	],
  	[
  		19.28171340249153,
  		-5.629216364931692,
  		-0.27030521237851163
  	],
  	[
  		19.2814320722699,
  		-5.62561039368755,
  		-0.272331968309329
  	],
  	[
  		19.280470965319928,
  		-5.621409026454265,
  		-0.2711242253995556
  	],
  	[
  		19.28269400239337,
  		-5.617772008528047,
  		-0.268960121316506
  	],
  	[
  		19.28592353574557,
  		-5.614789417143723,
  		-0.2699413303569878
  	],
  	[
  		19.28609517626972,
  		-5.61131496547719,
  		-0.27220471437731625
  	],
  	[
  		19.2849095664358,
  		-5.607131301820087,
  		-0.2714824892190619
  	],
  	[
  		19.28664520717217,
  		-5.603361484861559,
  		-0.2691304349141695
  	],
  	[
  		19.29004517235975,
  		-5.60034646596724,
  		-0.26960856464908395
  	],
  	[
  		19.29071301976258,
  		-5.596998202324569,
  		-0.27200147837288313
  	],
  	[
  		19.289410492804592,
  		-5.592860441434976,
  		-0.2717985475719977
  	],
  	[
  		19.29062712825567,
  		-5.588966449989785,
  		-0.26937105175249004
  	],
  	[
  		19.29408713774675,
  		-5.585891655665939,
  		-0.2693228942672208
  	],
  	[
  		19.295269717370832,
  		-5.582658102983713,
  		-0.2717328616114568
  	],
  	[
  		19.29396377171726,
  		-5.578592316691014,
  		-0.2720582319844464
  	],
  	[
  		19.29465402704997,
  		-5.57458872727583,
  		-0.26967250880414084
  	],
  	[
  		19.29806068698952,
  		-5.571429563595304,
  		-0.2690995602430769
  	],
  	[
  		19.29975253199057,
  		-5.568293809902703,
  		-0.27141275692425043
  	],
  	[
  		19.298556233592443,
  		-5.564322399069735,
  		-0.2722495238845077
  	],
  	[
  		19.29873855366381,
  		-5.560229001694822,
  		-0.27001964234904563
  	],
  	[
  		19.301979869109,
  		-5.556964560327361,
  		-0.26894786599521575
  	],
  	[
  		19.30415199780929,
  		-5.553905168701957,
  		-0.2710549415774013
  	],
  	[
  		19.30317190771277,
  		-5.550045881777424,
  		-0.272362832699426
  	],
  	[
  		19.30288923070472,
  		-5.545886768578113,
  		-0.27039522715850933
  	],
  	[
  		19.30586100248887,
  		-5.542501335951664,
  		-0.26887586516015144
  	],
  	[
  		19.30846095032082,
  		-5.539492977848689,
  		-0.27067649680916783
  	],
  	[
  		19.30779398003177,
  		-5.535758399393456,
  		-0.2723931222022942
  	],
  	[
  		19.30711042511626,
  		-5.531560640922942,
  		-0.2707822409207697
  	],
  	[
  		19.30972063645473,
  		-5.528043947584353,
  		-0.2688866540190729
  	],
  	[
  		19.312676557366572,
  		-5.525059236803187,
  		-0.270296300825733
  	],
  	[
  		19.31240307655681,
  		-5.521455626812682,
  		-0.2723396744225816
  	],
  	[
  		19.31140373450854,
  		-5.517248367982607,
  		-0.27116176467985753
  	],
  	[
  		19.31357776658741,
  		-5.513596690675202,
  		-0.26898115136414064
  	],
  	[
  		19.31680003709164,
  		-5.510606596603852,
  		-0.269931527848065
  	],
  	[
  		19.31698341645024,
  		-5.507134499106253,
  		-0.2722051954439564
  	],
  	[
  		19.31576582511851,
  		-5.502946763244416,
  		-0.27151591929119673
  	],
  	[
  		19.31745022741821,
  		-5.499162722134088,
  		-0.2691539003864947
  	],
  	[
  		19.3208362792138,
  		-5.496138616480017,
  		-0.2696001387755027
  	],
  	[
  		19.32151684227708,
  		-5.49279191162498,
  		-0.27199590552654745
  	],
  	[
  		19.320190006480992,
  		-5.488651979674379,
  		-0.27182738412765567
  	],
  	[
  		19.32135357469371,
  		-5.484744414192138,
  		-0.26939736349739757
  	],
  	[
  		19.32479255285968,
  		-5.481658864257485,
  		-0.2693163728487579
  	],
  	[
  		19.32598794931105,
  		-5.478425905785154,
  		-0.2717219258587463
  	],
  	[
  		19.32466467025193,
  		-5.474359398179654,
  		-0.27208100230518467
  	],
  	[
  		19.32530262988347,
  		-5.470343424271333,
  		-0.2696999824005156
  	],
  	[
  		19.32868124815552,
  		-5.467172157230328,
  		-0.2690954014759511
  	],
  	[
  		19.33038478227996,
  		-5.464035791332789,
  		-0.2713971071098858
  	],
  	[
  		19.32917823775461,
  		-5.460065030281126,
  		-0.27226613906758834
  	],
  	[
  		19.3293101508579,
  		-5.455960644448878,
  		-0.2700479050476652
  	],
  	[
  		19.33251693674279,
  		-5.45268314395226,
  		-0.26894770033355664
  	],
  	[
  		19.33469731712395,
  		-5.449621459013079,
  		-0.2710364325272911
  	],
  	[
  		19.33371379351231,
  		-5.445763871762284,
  		-0.2723732568615037
  	],
  	[
  		19.33338326685923,
  		-5.441595244671517,
  		-0.2704237589651239
  	],
  	[
  		19.33631457956374,
  		-5.438195922399154,
  		-0.2688791849576365
  	],
  	[
  		19.33891887362742,
  		-5.435183677204424,
  		-0.270655978845268
  	],
  	[
  		19.33825371344396,
  		-5.431451278847637,
  		-0.2723965688737294
  	],
  	[
  		19.33752770335152,
  		-5.427245924299469,
  		-0.27080896049756464
  	],
  	[
  		19.34009222478921,
  		-5.42371505800271,
  		-0.2688942226806577
  	],
  	[
  		19.34304731353049,
  		-5.420724612637558,
  		-0.27027471595766894
  	],
  	[
  		19.34278118145793,
  		-5.417123734385998,
  		-0.2723371322989933
  	],
  	[
  		19.3417440062722,
  		-5.412910557876711,
  		-0.2711871648566433
  	],
  	[
  		19.343868926662,
  		-5.409244753395606,
  		-0.26899298660451254
  	],
  	[
  		19.34708380800604,
  		-5.406247157456201,
  		-0.2699116543505469
  	],
  	[
  		19.34727734883758,
  		-5.402777396282977,
  		-0.27219691421185205
  	],
  	[
  		19.346028843118358,
  		-5.398585675207156,
  		-0.2715384546258151
  	],
  	[
  		19.34766069931652,
  		-5.394787754754771,
  		-0.2691699405288759
  	],
  	[
  		19.35103276971466,
  		-5.391754279875999,
  		-0.2695812558564304
  	],
  	[
  		19.35172611587545,
  		-5.388409625132628,
  		-0.2719822578174509
  	],
  	[
  		19.35037493869476,
  		-5.384267307640205,
  		-0.2718455799488179
  	],
  	[
  		19.351485859794938,
  		-5.380346865294594,
  		-0.2694163323749991
  	],
  	[
  		19.35490349063365,
  		-5.377250386600592,
  		-0.269300657765185
  	],
  	[
  		19.356112338784822,
  		-5.374018585361961,
  		-0.2717038008716736
  	],
  	[
  		19.35477231133126,
  		-5.369951455174897,
  		-0.2720953171850115
  	],
  	[
  		19.35535732132812,
  		-5.365923585192219,
  		-0.26972250243190293
  	],
  	[
  		19.3587071712175,
  		-5.362739878218301,
  		-0.2690839275916292
  	],
  	[
  		19.36042291846193,
  		-5.35960344976582,
  		-0.2713762375419662
  	],
  	[
  		19.35920618383077,
  		-5.355633203069494,
  		-0.272275430355234
  	],
  	[
  		19.35928747534049,
  		-5.351518388934125,
  		-0.27007221595453024
  	],
  	[
  		19.362458147076712,
  		-5.348227170704632,
  		-0.2689402869673953
  	],
  	[
  		19.36464881096177,
  		-5.345164036248899,
  		-0.2710125413136421
  	],
  	[
  		19.36366195267632,
  		-5.341308045878193,
  		-0.27237639329656277
  	],
  	[
  		19.36328495663976,
  		-5.337130801079845,
  		-0.2704483185737444
  	],
  	[
  		19.36617381944361,
  		-5.333717016009706,
  		-0.2688765514925808
  	],
  	[
  		19.36878455438443,
  		-5.330701649398819,
  		-0.27063075021212024
  	],
  	[
  		19.3681218651356,
  		-5.326971577445861,
  		-0.2723943479709012
  	],
  	[
  		19.36735377862117,
  		-5.322759338913906,
  		-0.2708336405036108
  	],
  	[
  		19.369870249812028,
  		-5.319213528457683,
  		-0.2688969869623669
  	],
  	[
  		19.372826124226098,
  		-5.316218059843008,
  		-0.2702499919102099
  	],
  	[
  		19.37256657230229,
  		-5.312619542546465,
  		-0.27232906916020333
  	],
  	[
  		19.37149408037469,
  		-5.308401516671015,
  		-0.2712099130093202
  	],
  	[
  		19.37356623533276,
  		-5.304720657982724,
  		-0.2690003865762413
  	],
  	[
  		19.37677634469681,
  		-5.30171616908012,
  		-0.2698867515169479
  	],
  	[
  		19.37698029867493,
  		-5.29824881507613,
  		-0.2721828517934231
  	],
  	[
  		19.37570312128137,
  		-5.294054023233219,
  		-0.2715574470689519
  	],
  	[
  		19.37728057003922,
  		-5.290241727991521,
  		-0.26918099380981364
  	],
  	[
  		19.38064024517129,
  		-5.287199497408491,
  		-0.26955851016019194
  	],
  	[
  		19.38134569519384,
  		-5.283856560460992,
  		-0.271962606921837
  	],
  	[
  		19.37997337742761,
  		-5.279713079324662,
  		-0.2718607501231196
  	],
  	[
  		19.38102771246615,
  		-5.275778881582609,
  		-0.2694313760707716
  	],
  	[
  		19.38442588476225,
  		-5.272671919330095,
  		-0.2692804906390642
  	],
  	[
  		19.38564662578822,
  		-5.269440894227009,
  		-0.271680162357063
  	],
  	[
  		19.38429245378166,
  		-5.265373888706599,
  		-0.2721046434451957
  	],
  	[
  		19.38482257379412,
  		-5.261333729006786,
  		-0.2697395079015684
  	],
  	[
  		19.38814521824348,
  		-5.258138010683084,
  		-0.2690668351649234
  	],
  	[
  		19.38987201819836,
  		-5.255001074905715,
  		-0.2713476473831906
  	],
  	[
  		19.38864865772351,
  		-5.251032392737396,
  		-0.27227822271085195
  	],
  	[
  		19.38867703462788,
  		-5.246906711908102,
  		-0.2700897393310907
  	],
  	[
  		19.39181406630575,
  		-5.243602481408296,
  		-0.2689265597738948
  	],
  	[
  		19.39401226269595,
  		-5.240537251448966,
  		-0.2709813098623458
  	],
  	[
  		19.39302483915305,
  		-5.236683582877208,
  		-0.2723723354198475
  	],
  	[
  		19.39259877022155,
  		-5.232497300657657,
  		-0.2704660297989223
  	],
  	[
  		19.39544709753546,
  		-5.229069550109031,
  		-0.26886692118091843
  	],
  	[
  		19.39806121214896,
  		-5.226050370791071,
  		-0.2705976879688727
  	],
  	[
  		19.39740327900265,
  		-5.222323061235308,
  		-0.2723831311744496
  	],
  	[
  		19.39659158224491,
  		-5.218103697955837,
  		-0.2708492768752409
  	],
  	[
  		19.399062547686,
  		-5.214543595076658,
  		-0.26889068319036363
  	],
  	[
  		19.40201654057151,
  		-5.211542528491385,
  		-0.2702155768319907
  	],
  	[
  		19.40176626317233,
  		-5.207946939019562,
  		-0.2723104619253892
  	],
  	[
  		19.40065609527341,
  		-5.203723674680942,
  		-0.2712223133488068
  	],
  	[
  		19.40267904580232,
  		-5.200028630618521,
  		-0.2689973727867609
  	],
  	[
  		19.40588041885938,
  		-5.197016699643473,
  		-0.26985305276238153
  	],
  	[
  		19.40609623102589,
  		-5.193551829852807,
  		-0.27215757752739583
  	],
  	[
  		19.40478848179041,
  		-5.189353778212547,
  		-0.27156615861575
  	],
  	[
  		19.40631332715115,
  		-5.185527508522689,
  		-0.2691810954642402
  	],
  	[
  		19.40965818380142,
  		-5.182476223065191,
  		-0.2695257885264598
  	],
  	[
  		19.41037653677612,
  		-5.179135068625776,
  		-0.27193149103867004
  	],
  	[
  		19.4089810138103,
  		-5.174989962730562,
  		-0.2718636939415462
  	],
  	[
  		19.4099825980913,
  		-5.171042833402491,
  		-0.2694333864433635
  	],
  	[
  		19.4133581129432,
  		-5.167925143231075,
  		-0.2692498896420866
  	],
  	[
  		19.41459217829889,
  		-5.164694913411919,
  		-0.27164327793451143
  	],
  	[
  		19.413222079756242,
  		-5.160627948676979,
  		-0.2721022632872435
  	],
  	[
  		19.41369923621821,
  		-5.156575770279896,
  		-0.2697430434145245
  	],
  	[
  		19.41699292156531,
  		-5.153368177774217,
  		-0.2690393517871688
  	],
  	[
  		19.418730355729462,
  		-5.150230581576169,
  		-0.271307519828523
  	],
  	[
  		19.417498379201582,
  		-5.146263095540341,
  		-0.2722692967764038
  	],
  	[
  		19.4174762394289,
  		-5.142126983522535,
  		-0.2700942372339641
  	],
  	[
  		19.42057703593581,
  		-5.138809630508552,
  		-0.2689024237200963
  	],
  	[
  		19.42278365864645,
  		-5.13574231264773,
  		-0.2709376113797318
  	],
  	[
  		19.421793895152252,
  		-5.131890813946571,
  		-0.272356852748366
  	],
  	[
  		19.42132093313901,
  		-5.127695660644341,
  		-0.27046941948245073
  	],
  	[
  		19.42412765326972,
  		-5.12425430598439,
  		-0.2688466002017142
  	],
  	[
  		19.4267451468147,
  		-5.121231208227233,
  		-0.2705524603808345
  	],
  	[
  		19.426090741560348,
  		-5.117506689063365,
  		-0.2723612311869995
  	],
  	[
  		19.4252366869942,
  		-5.1132802831182,
  		-0.2708521885240238
  	],
  	[
  		19.427660646186432,
  		-5.109706116585342,
  		-0.2688750032566103
  	],
  	[
  		19.4306126637361,
  		-5.106699339373233,
  		-0.2701704207224148
  	],
  	[
  		19.430370091508273,
  		-5.103106638341742,
  		-0.2722826347033535
  	],
  	[
  		19.42922367378441,
  		-5.098878177995208,
  		-0.2712228819917764
  	],
  	[
  		19.43119608667631,
  		-5.095169163964623,
  		-0.26898551675745214
  	],
  	[
  		19.43438924364373,
  		-5.092149660321243,
  		-0.26980803927989955
  	],
  	[
  		19.43461634215473,
  		-5.088687586646254,
  		-0.2721234708173237
  	],
  	[
  		19.43327890148607,
  		-5.084486150266942,
  		-0.2715630543585721
  	],
  	[
  		19.43475137831189,
  		-5.080646563191008,
  		-0.2691730800368771
  	],
  	[
  		19.43808038868245,
  		-5.077585827905203,
  		-0.2694830375537647
  	],
  	[
  		19.4388119929777,
  		-5.074246944532241,
  		-0.2718926540774516
  	],
  	[
  		19.437393474322192,
  		-5.070100180947033,
  		-0.2718576605667229
  	],
  	[
  		19.43834144452525,
  		-5.066140425835063,
  		-0.269429322028167
  	],
  	[
  		19.441694118234828,
  		-5.063011717587384,
  		-0.2692107422145225
  	],
  	[
  		19.44294110227792,
  		-5.059782654203936,
  		-0.2716005151578716
  	],
  	[
  		19.44155557159615,
  		-5.055715520675873,
  		-0.2720910109153581
  	],
  	[
  		19.441980455329492,
  		-5.051652080889274,
  		-0.2697414128728881
  	],
  	[
  		19.44524350902831,
  		-5.048431882051317,
  		-0.2690034073458508
  	],
  	[
  		19.44699378368941,
  		-5.045294415890826,
  		-0.2712605207518424
  	],
  	[
  		19.44575287106497,
  		-5.041328053825143,
  		-0.27225280366769333
  	],
  	[
  		19.445681049332478,
  		-5.037182154046134,
  		-0.2700938400316941
  	],
  	[
  		19.448744679742582,
  		-5.03385131653418,
  		-0.268871631450661
  	],
  	[
  		19.45096034920156,
  		-5.030782385469553,
  		-0.27088910292639284
  	],
  	[
  		19.44996851301863,
  		-5.026932995206053,
  		-0.2723350426846665
  	],
  	[
  		19.44944929718735,
  		-5.022729792258931,
  		-0.2704707714433076
  	],
  	[
  		19.452211960863902,
  		-5.019273930246598,
  		-0.26882098987044517
  	],
  	[
  		19.45483494490698,
  		-5.016247587774303,
  		-0.27050290521063103
  	],
  	[
  		19.45418332404924,
  		-5.01252557339431,
  		-0.2723334992772344
  	],
  	[
  		19.45328877463745,
  		-5.008292955900018,
  		-0.2708517349171372
  	],
  	[
  		19.45566392208347,
  		-5.004704133189452,
  		-0.26885397024424373
  	],
  	[
  		19.45861574723564,
  		-5.001692149116526,
  		-0.270120190011017
  	],
  	[
  		19.45838125366899,
  		-4.998102313477118,
  		-0.27224841361598073
  	],
  	[
  		19.45720040258453,
  		-4.993869622245427,
  		-0.2712206061108782
  	],
  	[
  		19.459119947545428,
  		-4.990145993712209,
  		-0.2689693052064283
  	],
  	[
  		19.46230670745507,
  		-4.987119521779589,
  		-0.26975964529872315
  	],
  	[
  		19.46254424187667,
  		-4.98365989816298,
  		-0.2720842915130486
  	],
  	[
  		19.46117935146561,
  		-4.979456046519916,
  		-0.2715578385186864
  	],
  	[
  		19.46259612022024,
  		-4.975602265864985,
  		-0.2691613875381888
  	],
  	[
  		19.46591147107368,
  		-4.972532627320178,
  		-0.2694365885616359
  	],
  	[
  		19.46665511877464,
  		-4.969195513039911,
  		-0.2718479020815747
  	],
  	[
  		19.46521657755964,
  		-4.965047991210594,
  		-0.2718470328929446
  	],
  	[
  		19.46610851987007,
  		-4.961075081259065,
  		-0.2694201579018252
  	],
  	[
  		19.46944022692352,
  		-4.957935835067639,
  		-0.2691664870636
  	],
  	[
  		19.47069959788585,
  		-4.954707652842123,
  		-0.27155092080102233
  	],
  	[
  		19.46930143387346,
  		-4.950641295823114,
  		-0.27207487709240924
  	],
  	[
  		19.46967121010078,
  		-4.946565973760839,
  		-0.2697343977375735
  	],
  	[
  		19.47290611916018,
  		-4.943333938162755,
  		-0.2689631787719001
  	],
  	[
  		19.47466617610775,
  		-4.940195808152609,
  		-0.27120782676410266
  	],
  	[
  		19.47341989167629,
  		-4.936231373474214,
  		-0.272230311523368
  	],
  	[
  		19.47329517867987,
  		-4.932075129562203,
  		-0.2700879874911504
  	],
  	[
  		19.47632322764272,
  		-4.928731119514104,
  		-0.2688345799425993
  	],
  	[
  		19.47854621033779,
  		-4.925660132884881,
  		-0.27083333968481543
  	],
  	[
  		19.4775545136329,
  		-4.921813308720227,
  		-0.2723052885309556
  	],
  	[
  		19.47698740046949,
  		-4.917601646551978,
  		-0.2704632874861416
  	],
  	[
  		19.47970856443213,
  		-4.91413207395221,
  		-0.2687876889201114
  	],
  	[
  		19.48233385185087,
  		-4.911101796742654,
  		-0.2704451482855701
  	],
  	[
  		19.481688569038592,
  		-4.907382990755419,
  		-0.2722964907897922
  	],
  	[
  		19.48075087672846,
  		-4.903143795662386,
  		-0.2708429747764178
  	],
  	[
  		19.48307943232927,
  		-4.899540819719068,
  		-0.2688241494404041
  	],
  	[
  		19.486028115207368,
  		-4.896523241697656,
  		-0.2700624307671829
  	],
  	[
  		19.48580271977546,
  		-4.89293630260287,
  		-0.2722046685117102
  	],
  	[
  		19.48458582969152,
  		-4.888699029810883,
  		-0.271208185356816
  	],
  	[
  		19.4864546881113,
  		-4.884961354081842,
  		-0.26894295879917113
  	],
  	[
  		19.48963159948736,
  		-4.881927308107634,
  		-0.2697015552446199
  	],
  	[
  		19.48988147063063,
  		-4.87847040007851,
  		-0.2720336764993178
  	],
  	[
  		19.48848718419177,
  		-4.874263759429231,
  		-0.2715408810411452
  	],
  	[
  		19.48985167777786,
  		-4.870396531916798,
  		-0.2691372505065741
  	],
  	[
  		19.4931503088732,
  		-4.867317745128763,
  		-0.2693800921487339
  	],
  	[
  		19.49390688709957,
  		-4.863982457704341,
  		-0.2717914004884545
  	],
  	[
  		19.49244665460465,
  		-4.859833976282962,
  		-0.27182510506564167
  	],
  	[
  		19.49328512688384,
  		-4.855848399852802,
  		-0.26939845619625824
  	],
  	[
  		19.4965928676108,
  		-4.852698421140342,
  		-0.2691123220859639
  	],
  	[
  		19.49786443012422,
  		-4.849470928077506,
  		-0.2714895792804862
  	],
  	[
  		19.49645165261247,
  		-4.845404992151733,
  		-0.27204676401471384
  	],
  	[
  		19.49676920317501,
  		-4.841318294178148,
  		-0.26971374277304444
  	],
  	[
  		19.49997323043293,
  		-4.838074241345467,
  		-0.2689115844107168
  	],
  	[
  		19.50174389387124,
  		-4.834935528430957,
  		-0.27114224198413733
  	],
  	[
  		19.50048988214057,
  		-4.830972738692837,
  		-0.27219577967687497
  	],
  	[
  		19.50031566553026,
  		-4.826806648626369,
  		-0.2700675197261556
  	],
  	[
  		19.50330648920141,
  		-4.823449788340664,
  		-0.2687870488941237
  	],
  	[
  		19.50553607745458,
  		-4.82037643279625,
  		-0.27076511077443594
  	],
  	[
  		19.50454319072928,
  		-4.816532204644038,
  		-0.2722645144110975
  	],
  	[
  		19.50392953269896,
  		-4.812312226906652,
  		-0.27044281662198627
  	],
  	[
  		19.50660787250503,
  		-4.808829113187297,
  		-0.2687438683464081
  	],
  	[
  		19.50923526136503,
  		-4.805794814396997,
  		-0.27037566858377443
  	],
  	[
  		19.50859353495589,
  		-4.802078895528251,
  		-0.2722489231951272
  	],
  	[
  		19.50761526573843,
  		-4.797833375287542,
  		-0.2708204963868249
  	],
  	[
  		19.50989618920661,
  		-4.794216697945593,
  		-0.2687846018443552
  	],
  	[
  		19.51284152182706,
  		-4.791193219997003,
  		-0.26999212076136103
  	],
  	[
  		19.51262480434545,
  		-4.787609583700146,
  		-0.27215102671372293
  	],
  	[
  		19.51137235657638,
  		-4.783367662360364,
  		-0.2711836545875754
  	],
  	[
  		19.51319083548097,
  		-4.779616546035824,
  		-0.26890742372158155
  	],
  	[
  		19.51635738918504,
  		-4.776574814712676,
  		-0.26963327899439443
  	],
  	[
  		19.51661821257825,
  		-4.773120679654027,
  		-0.27197449572631094
  	],
  	[
  		19.51519534757567,
  		-4.768911292861855,
  		-0.2715133636143198
  	],
  	[
  		19.51650653602171,
  		-4.765031017770863,
  		-0.26910602856575044
  	],
  	[
  		19.51978804681935,
  		-4.761942736176298,
  		-0.26931359027942403
  	],
  	[
  		19.52055747216763,
  		-4.758609736631178,
  		-0.2717273408020535
  	],
  	[
  		19.51907539743122,
  		-4.754460044151401,
  		-0.2717929959120538
  	],
  	[
  		19.519861071309418,
  		-4.750462555772202,
  		-0.26936989019255103
  	],
  	[
  		19.52314438309131,
  		-4.747301591491568,
  		-0.26904910071106614
  	],
  	[
  		19.52442905096147,
  		-4.744075388377026,
  		-0.2714210279844756
  	],
  	[
  		19.52300188416146,
  		-4.740009895588221,
  		-0.27201017782946063
  	],
  	[
  		19.52326714891606,
  		-4.735912444868351,
  		-0.2696881060020744
  	],
  	[
  		19.52643935154201,
  		-4.732656036568689,
  		-0.2688529356196924
  	],
  	[
  		19.52822121068807,
  		-4.729517266291107,
  		-0.2710713932397304
  	],
  	[
  		19.526959219075152,
  		-4.725555975784657,
  		-0.27215424517614134
  	],
  	[
  		19.52673533390082,
  		-4.72138065516146,
  		-0.2700436571510731
  	],
  	[
  		19.52968726818239,
  		-4.718010297212806,
  		-0.26873294571191914
  	],
  	[
  		19.53192543602606,
  		-4.71493538498715,
  		-0.2706919681502448
  	],
  	[
  		19.5309310827238,
  		-4.711093549484901,
  		-0.2722166985399052
  	],
  	[
  		19.53027252178828,
  		-4.70686621457783,
  		-0.2704185301950019
  	],
  	[
  		19.53290593127258,
  		-4.703369000528227,
  		-0.2686943998686228
  	],
  	[
  		19.53553769869513,
  		-4.700331429376495,
  		-0.2703012556556263
  	],
  	[
  		19.53490006416946,
  		-4.696618534289555,
  		-0.272195464272065
  	],
  	[
  		19.53388168819507,
  		-4.692367422398634,
  		-0.2707956040429207
  	],
  	[
  		19.536112692747,
  		-4.688736391258296,
  		-0.2687404475088833
  	],
  	[
  		19.539056245405252,
  		-4.685707745747536,
  		-0.2699189286919335
  	],
  	[
  		19.538847241480962,
  		-4.682127008571759,
  		-0.2720920212297535
  	],
  	[
  		19.53756168859417,
  		-4.677881529550987,
  		-0.27115670305211353
  	],
  	[
  		19.53932584370608,
  		-4.674116050235277,
  		-0.2688679743935107
  	],
  	[
  		19.54248472655039,
  		-4.671067280493658,
  		-0.26956045055119765
  	],
  	[
  		19.542756422838423,
  		-4.667615899556414,
  		-0.271909670786856
  	],
  	[
  		19.54130729462914,
  		-4.66340465530229,
  		-0.2714819197713103
  	],
  	[
  		19.542563211562268,
  		-4.659510876260627,
  		-0.2690696576235582
  	],
  	[
  		19.545829223795337,
  		-4.656413737092433,
  		-0.2692429362234907
  	],
  	[
  		19.54661076348359,
  		-4.653082714574363,
  		-0.2716569747075339
  	],
  	[
  		19.545110150596848,
  		-4.648933044105301,
  		-0.2717572273746992
  	],
  	[
  		19.54583910598949,
  		-4.644922849044346,
  		-0.26933709300573894
  	],
  	[
  		19.549099880423398,
  		-4.641751434900689,
  		-0.2689815007459259
  	],
  	[
  		19.55039567789145,
  		-4.638526123057599,
  		-0.2713472768889281
  	],
  	[
  		19.54895693425721,
  		-4.634461850005598,
  		-0.2719685152619429
  	],
  	[
  		19.54916761574608,
  		-4.630353229789232,
  		-0.2696569921025204
  	],
  	[
  		19.55230948092463,
  		-4.627084895055699,
  		-0.26878853200210767
  	],
  	[
  		19.55410100632721,
  		-4.623945634861268,
  		-0.2709930350061183
  	],
  	[
  		19.552834562277038,
  		-4.619986815727893,
  		-0.27210560071853573
  	],
  	[
  		19.55255891434328,
  		-4.615801894360478,
  		-0.2700122766689706
  	],
  	[
  		19.55547423496627,
  		-4.612418741608613,
  		-0.26867177725230523
  	],
  	[
  		19.55771816725595,
  		-4.609341719136561,
  		-0.27061115333524743
  	],
  	[
  		19.55672521526143,
  		-4.605503038051273,
  		-0.2721611218071666
  	],
  	[
  		19.556019278468572,
  		-4.601268011036047,
  		-0.2703869069630315
  	],
  	[
  		19.55860973195662,
  		-4.597757247910933,
  		-0.2686373999349916
  	],
  	[
  		19.56124248792701,
  		-4.594715802118105,
  		-0.2702192664537595
  	],
  	[
  		19.5606109541214,
  		-4.591006298836183,
  		-0.2721328357687345
  	],
  	[
  		19.55955112974433,
  		-4.586749445671167,
  		-0.2707614876425981
  	],
  	[
  		19.56173447759268,
  		-4.583104649815197,
  		-0.26868666742904285
  	],
  	[
  		19.5646734494321,
  		-4.5800703212853,
  		-0.2698357387130089
  	],
  	[
  		19.56447440387441,
  		-4.576492994397833,
  		-0.2720220754781936
  	],
  	[
  		19.56315368882077,
  		-4.572243639795397,
  		-0.2711186502205881
  	],
  	[
  		19.56486727566785,
  		-4.568464742950567,
  		-0.2688172085490445
  	],
  	[
  		19.568014455547107,
  		-4.565408478335097,
  		-0.26947829375531723
  	],
  	[
  		19.568298278131312,
  		-4.561959958982395,
  		-0.2718332124173649
  	],
  	[
  		19.5668212213034,
  		-4.557746805227256,
  		-0.2714399692223599
  	],
  	[
  		19.56802376317397,
  		-4.553839963045673,
  		-0.269021827082125
  	],
  	[
  		19.57127189452964,
  		-4.550733787893909,
  		-0.2691621805872707
  	],
  	[
  		19.5720658353778,
  		-4.547404756412687,
  		-0.27157503167099034
  	],
  	[
  		19.57054456680399,
  		-4.543254695651342,
  		-0.2717091096291448
  	],
  	[
  		19.571220615320073,
  		-4.53923263938876,
  		-0.2692908747719272
  	],
  	[
  		19.57445567240917,
  		-4.536050589730976,
  		-0.2689030262436222
  	],
  	[
  		19.57576384596361,
  		-4.53282620485631,
  		-0.2712598133416789
  	],
  	[
  		19.5743115639495,
  		-4.528763107421308,
  		-0.2719147906282675
  	],
  	[
  		19.57446991686293,
  		-4.524643702737055,
  		-0.2696118787823716
  	],
  	[
  		19.57758002212836,
  		-4.521363759140151,
  		-0.2687135250207739
  	],
  	[
  		19.57938066260576,
  		-4.518223860930537,
  		-0.2709027265797314
  	],
  	[
  		19.57810779264299,
  		-4.514267283314037,
  		-0.2720453329443877
  	],
  	[
  		19.57778254278951,
  		-4.510073196462906,
  		-0.2699678460891068
  	],
  	[
  		19.58065912925299,
  		-4.506677327708516,
  		-0.2686003115475752
  	],
  	[
  		19.5829093163285,
  		-4.503598149589997,
  		-0.2705177822791598
  	],
  	[
  		19.58191580448926,
  		-4.499762511840029,
  		-0.2720941496596368
  	],
  	[
  		19.58116442910882,
  		-4.495519966728836,
  		-0.2703409342748877
  	],
  	[
  		19.58371108004584,
  		-4.491996141988953,
  		-0.2685697506989561
  	],
  	[
  		19.58634489967227,
  		-4.488950740140008,
  		-0.2701247439200636
  	],
  	[
  		19.58571843569699,
  		-4.485244813120858,
  		-0.2720595050204888
  	],
  	[
  		19.58461806697676,
  		-4.480982293232316,
  		-0.270714632904707
  	],
  	[
  		19.58675287659129,
  		-4.477324194467029,
  		-0.2686237173317703
  	],
  	[
  		19.5896869888174,
  		-4.474284088394234,
  		-0.26974196508018794
  	],
  	[
  		19.58949678085789,
  		-4.470710287699972,
  		-0.2719430083265783
  	],
  	[
  		19.58814169625402,
  		-4.466457082381297,
  		-0.27106925976725144
  	],
  	[
  		19.58980343174547,
  		-4.462665048828877,
  		-0.2687580072810388
  	],
  	[
  		19.59293935476782,
  		-4.459601194982311,
  		-0.26938513308089135
  	],
  	[
  		19.59323488252265,
  		-4.456155929461346,
  		-0.27174810017303414
  	],
  	[
  		19.59173041833665,
  		-4.451940726516555,
  		-0.2713863751648155
  	],
  	[
  		19.59287991095146,
  		-4.448021581364614,
  		-0.2689661858066004
  	],
  	[
  		19.59610913252627,
  		-4.444906021635739,
  		-0.26907156242710445
  	],
  	[
  		19.59691647445172,
  		-4.441579658797361,
  		-0.27148539563426544
  	],
  	[
  		19.5953746509428,
  		-4.437429256958507,
  		-0.27165234951874184
  	],
  	[
  		19.59599697098912,
  		-4.433395710620054,
  		-0.2692388717948589
  	],
  	[
  		19.59920604165504,
  		-4.430202808914101,
  		-0.26881649642816424
  	],
  	[
  		19.60052646054631,
  		-4.426979825322242,
  		-0.2711668001093826
  	],
  	[
  		19.59906110256177,
  		-4.422917773704992,
  		-0.27185270344550044
  	],
  	[
  		19.599167439357178,
  		-4.418788321345648,
  		-0.2695621283323784
  	],
  	[
  		19.60224371233882,
  		-4.415495985973572,
  		-0.2686304025065762
  	],
  	[
  		19.60405602677551,
  		-4.412356383596894,
  		-0.27080590939329124
  	],
  	[
  		19.6027764835952,
  		-4.408402023800242,
  		-0.2719776606703393
  	],
  	[
  		19.60240265781794,
  		-4.404199514411276,
  		-0.2699186893719256
  	],
  	[
  		19.60523919704714,
  		-4.40079053256551,
  		-0.268522281941235
  	],
  	[
  		19.60749686218863,
  		-4.397709859743996,
  		-0.2704196418738143
  	],
  	[
  		19.60650336667493,
  		-4.393877345547243,
  		-0.2720210055010996
  	],
  	[
  		19.6057073505473,
  		-4.389628180812688,
  		-0.2702929924699645
  	],
  	[
  		19.60820736031146,
  		-4.386090383398582,
  		-0.26849703671889313
  	],
  	[
  		19.61084439497226,
  		-4.38304177268691,
  		-0.2700261719220063
  	],
  	[
  		19.61022220269772,
  		-4.379339181929449,
  		-0.2719806381174447
  	],
  	[
  		19.60908338150183,
  		-4.375071921932564,
  		-0.27066466561005603
  	],
  	[
  		19.61116711347629,
  		-4.371399811390057,
  		-0.2685556145709474
  	],
  	[
  		19.61409848168941,
  		-4.368354518694941,
  		-0.26964304496958985
  	],
  	[
  		19.61391736694726,
  		-4.364784266840882,
  		-0.2718576290441792
  	],
  	[
  		19.61253040774024,
  		-4.36052830866843,
  		-0.2710166445221203
  	],
  	[
  		19.61413787318397,
  		-4.356722550939804,
  		-0.26869428315618
  	],
  	[
  		19.61726444374474,
  		-4.353651727592413,
  		-0.2692880686734966
  	],
  	[
  		19.617571060869402,
  		-4.350209504950002,
  		-0.27165767664481283
  	],
  	[
  		19.6160417334661,
  		-4.345993323008822,
  		-0.27133036431014185
  	],
  	[
  		19.61713474834847,
  		-4.342061046855891,
  		-0.26890674620441984
  	],
  	[
  		19.6203471040532,
  		-4.338936638946761,
  		-0.2689769970509096
  	],
  	[
  		19.62116626023698,
  		-4.335612443983299,
  		-0.2713899347258518
  	],
  	[
  		19.61960705393873,
  		-4.331462632007372,
  		-0.27159072576580495
  	],
  	[
  		19.62017323874401,
  		-4.327417151847836,
  		-0.2691818419839085
  	],
  	[
  		19.623358143254578,
  		-4.324213822010198,
  		-0.2687243801765081
  	],
  	[
  		19.62469032680895,
  		-4.32099201064907,
  		-0.27106659172340153
  	],
  	[
  		19.62321479977747,
  		-4.316931961490928,
  		-0.2717850575198168
  	],
  	[
  		19.6232668172104,
  		-4.312791994651881,
  		-0.2695063687949155
  	],
  	[
  		19.62631192835277,
  		-4.309488092993396,
  		-0.26854230307509813
  	],
  	[
  		19.628132779072388,
  		-4.30634799194616,
  		-0.27070266899968604
  	],
  	[
  		19.62685009018043,
  		-4.302396687333101,
  		-0.27190339619115533
  	],
  	[
  		19.62642457359969,
  		-4.298185288460583,
  		-0.26986380782370495
  	],
  	[
  		19.62922277633879,
  		-4.294763542058268,
  		-0.2684376538838069
  	],
  	[
  		19.631485915093762,
  		-4.291680908305462,
  		-0.2703140588316029
  	],
  	[
  		19.6304943720348,
  		-4.287851907374273,
  		-0.2719395609311394
  	],
  	[
  		19.62965221884555,
  		-4.283595797935004,
  		-0.27023611675903053
  	],
  	[
  		19.63210840287968,
  		-4.280044851104537,
  		-0.26841622924883274
  	],
  	[
  		19.63474552887781,
  		-4.276992345828037,
  		-0.2699188669944185
  	],
  	[
  		19.634131162300157,
  		-4.273293774964027,
  		-0.27189176082003924
  	],
  	[
  		19.63295129968067,
  		-4.269021439034426,
  		-0.27060572198053673
  	],
  	[
  		19.63498673228846,
  		-4.265335943135808,
  		-0.2684780263407733
  	],
  	[
  		19.63791231700033,
  		-4.262285092412085,
  		-0.2695361388520071
  	],
  	[
  		19.63774132282315,
  		-4.258718404611062,
  		-0.271762132210534
  	],
  	[
  		19.63632064149963,
  		-4.254459365741602,
  		-0.27095383845063753
  	],
  	[
  		19.63787605615003,
  		-4.250640432032642,
  		-0.2686201917790787
  	],
  	[
  		19.64099008071517,
  		-4.247562147801387,
  		-0.2691815168153257
  	],
  	[
  		19.64130937449883,
  		-4.244123112268255,
  		-0.27155567969706074
  	],
  	[
  		19.6397532832007,
  		-4.239905599880492,
  		-0.27126261628586473
  	],
  	[
  		19.64079320500066,
  		-4.235960885550376,
  		-0.2688346160131823
  	],
  	[
  		19.64398600572144,
  		-4.232827471623491,
  		-0.26887224088264444
  	],
  	[
  		19.64481806509625,
  		-4.229505487821567,
  		-0.271282231781418
  	],
  	[
  		19.64323974686297,
  		-4.225356076137148,
  		-0.27151759543549153
  	],
  	[
  		19.64375228152405,
  		-4.221299075575327,
  		-0.269111756629956
  	],
  	[
  		19.64691041080901,
  		-4.218085272261149,
  		-0.268622401518115
  	],
  	[
  		19.64825402338793,
  		-4.214864390469396,
  		-0.270954651386438
  	],
  	[
  		19.64676661499611,
  		-4.210806064066636,
  		-0.27170572271329513
  	],
  	[
  		19.64676657689641,
  		-4.206655933781915,
  		-0.2694372786808863
  	],
  	[
  		19.64977814269617,
  		-4.203340342296221,
  		-0.2684431454095886
  	],
  	[
  		19.65160835562896,
  		-4.200199825516379,
  		-0.27058700599102753
  	],
  	[
  		19.65032040002771,
  		-4.196251291021684,
  		-0.2718173566605389
  	],
  	[
  		19.64984634535369,
  		-4.192031376592083,
  		-0.26979425984252503
  	],
  	[
  		19.65260474129947,
  		-4.188597208727497,
  		-0.26834256109664373
  	],
  	[
  		19.65487284059181,
  		-4.185512316908258,
  		-0.27019602465980064
  	],
  	[
  		19.653882331573428,
  		-4.181686942793758,
  		-0.2718472907779639
  	],
  	[
  		19.65299506378112,
  		-4.177423908293701,
  		-0.27016632386947653
  	],
  	[
  		19.65540619323943,
  		-4.173859988277438,
  		-0.2683251080841103
  	],
  	[
  		19.658043263358692,
  		-4.17080353140051,
  		-0.2698004102674802
  	],
  	[
  		19.6574342321581,
  		-4.167108696287468,
  		-0.27179296287750854
  	],
  	[
  		19.656215728347092,
  		-4.162831467220252,
  		-0.2705337372854117
  	],
  	[
  		19.6582016495013,
  		-4.159132931428542,
  		-0.2683911671359562
  	],
  	[
  		19.66112137774154,
  		-4.156076198169741,
  		-0.2694170674371633
  	],
  	[
  		19.66096035142014,
  		-4.152513509335432,
  		-0.2716571989362263
  	],
  	[
  		19.65950645564531,
  		-4.148251233502832,
  		-0.2708789963219196
  	],
  	[
  		19.66101031777916,
  		-4.144419736560273,
  		-0.268537036486297
  	],
  	[
  		19.664111123092958,
  		-4.141333773975994,
  		-0.269064714117539
  	],
  	[
  		19.664442208195062,
  		-4.137898105602547,
  		-0.271445473074609
  	],
  	[
  		19.66286006372106,
  		-4.133679245344309,
  		-0.271184719552499
  	],
  	[
  		19.66384612122121,
  		-4.129722507769165,
  		-0.26875584874337954
  	],
  	[
  		19.6670187252813,
  		-4.126579648076795,
  		-0.2687579874992052
  	],
  	[
  		19.667863732684182,
  		-4.123260336902549,
  		-0.27116763063386434
  	],
  	[
  		19.66626619006439,
  		-4.119111032301389,
  		-0.2714349173966446
  	],
  	[
  		19.66672596480191,
  		-4.115043251975726,
  		-0.2690353423663971
  	],
  	[
  		19.66985653426218,
  		-4.111818543413552,
  		-0.26851149253671924
  	],
  	[
  		19.67121287305077,
  		-4.108599215670711,
  		-0.2708355680403341
  	],
  	[
  		19.66971353237546,
  		-4.104542524130938,
  		-0.2716179737430933
  	],
  	[
  		19.66966217827826,
  		-4.100382958003562,
  		-0.26936311366846
  	],
  	[
  		19.6726389438229,
  		-4.097055244817955,
  		-0.2683370465466579
  	],
  	[
  		19.67447939212747,
  		-4.09391481625354,
  		-0.27046598109226483
  	],
  	[
  		19.67318582957518,
  		-4.089968906117837,
  		-0.2717247240726381
  	],
  	[
  		19.67266342805917,
  		-4.085741128176322,
  		-0.2697217915261268
  	],
  	[
  		19.6753803351499,
  		-4.082293845795497,
  		-0.26824146576949154
  	],
  	[
  		19.67765521644725,
  		-4.079207387748057,
  		-0.27007342118776795
  	],
  	[
  		19.67666516872281,
  		-4.075385317530672,
  		-0.27174830913243203
  	],
  	[
  		19.67573484868106,
  		-4.071116330851125,
  		-0.27009285936622074
  	],
  	[
  		19.67809877653151,
  		-4.067538826549396,
  		-0.2682285685309104
  	],
  	[
  		19.68073808418747,
  		-4.064479030501358,
  		-0.2696766416870982
  	],
  	[
  		19.68013476419403,
  		-4.060788006791158,
  		-0.2716880982185259
  	],
  	[
  		19.678878471802882,
  		-4.056506620227039,
  		-0.2704589582347343
  	],
  	[
  		19.6808129592558,
  		-4.052794478615769,
  		-0.2682997654425609
  	],
  	[
  		19.683728372345538,
  		-4.049732525611282,
  		-0.269295121963262
  	],
  	[
  		19.683576255023002,
  		-4.046173362123402,
  		-0.2715469512113418
  	],
  	[
  		19.68209173034709,
  		-4.041908939985658,
  		-0.2708019666979836
  	],
  	[
  		19.68354010929151,
  		-4.038063929746502,
  		-0.2684503729656113
  	],
  	[
  		19.68663035816131,
  		-4.034970874061151,
  		-0.26894375077751115
  	],
  	[
  		19.68697271445848,
  		-4.0315383592659,
  		-0.2713297018576084
  	],
  	[
  		19.68536689738009,
  		-4.027318944391082,
  		-0.2711025907264624
  	],
  	[
  		19.6862971672141,
  		-4.023349713561457,
  		-0.26867186092765893
  	],
  	[
  		19.68945134249385,
  		-4.020198004051597,
  		-0.2686393695088482
  	],
  	[
  		19.69030844820371,
  		-4.016880967041202,
  		-0.2710464618250193
  	],
  	[
  		19.6886951110556,
  		-4.012732923445416,
  		-0.27134796592779653
  	],
  	[
  		19.68909842079254,
  		-4.008653608541809,
  		-0.2689544367623181
  	],
  	[
  		19.69220365425232,
  		-4.005418599018334,
  		-0.2683963004498756
  	],
  	[
  		19.693570402049648,
  		-4.002200310118678,
  		-0.2707114688322158
  	],
  	[
  		19.69206212652733,
  		-3.99814596588867,
  		-0.2715249921583872
  	],
  	[
  		19.691956785284688,
  		-3.993976444983522,
  		-0.2692835756013988
  	],
  	[
  		19.6949003712268,
  		-3.990637008524104,
  		-0.2682252437016139
  	],
  	[
  		19.69674913401891,
  		-3.987496141440372,
  		-0.2703378187841779
  	],
  	[
  		19.69545330544345,
  		-3.98355361300511,
  		-0.2716245044359532
  	],
  	[
  		19.69488056056908,
  		-3.979317575220326,
  		-0.26964139364922063
  	],
  	[
  		19.697558193458022,
  		-3.975857814571599,
  		-0.2681328871827802
  	],
  	[
  		19.69983722344956,
  		-3.972769278562493,
  		-0.2699431171873054
  	],
  	[
  		19.69885058780295,
  		-3.968951176317525,
  		-0.2716410966396107
  	],
  	[
  		19.69787480566662,
  		-3.964675868840024,
  		-0.2700116418376994
  	],
  	[
  		19.7001936862811,
  		-3.961085322721444,
  		-0.2681241062439523
  	],
  	[
  		19.70283174033908,
  		-3.958021625778819,
  		-0.2695457208803828
  	],
  	[
  		19.7022359441389,
  		-3.954334609674842,
  		-0.2715739308709749
  	],
  	[
  		19.70094050118401,
  		-3.950048861866728,
  		-0.2703748393460809
  	],
  	[
  		19.70282545284497,
  		-3.946323550211131,
  		-0.26819845139267534
  	],
  	[
  		19.70573377902983,
  		-3.943255878243123,
  		-0.2691633171051513
  	],
  	[
  		19.70559235463262,
  		-3.939700578547098,
  		-0.27142573424116273
  	],
  	[
  		19.7040753392394,
  		-3.935433623695648,
  		-0.2707133527299665
  	],
  	[
  		19.70547206006347,
  		-3.93157600106993,
  		-0.2683518246929512
  	],
  	[
  		19.70854786301949,
  		-3.928475430303477,
  		-0.2688132557388324
  	],
  	[
  		19.70890268854366,
  		-3.925046123430961,
  		-0.2712021279684251
  	],
  	[
  		19.70727172530396,
  		-3.920826100889015,
  		-0.2710097919716768
  	],
  	[
  		19.70814816391194,
  		-3.916844740465221,
  		-0.2685759180458073
  	],
  	[
  		19.71128152896687,
  		-3.913684025805852,
  		-0.26851064350708803
  	],
  	[
  		19.712150581466823,
  		-3.910369152428395,
  		-0.2709138064540037
  	],
  	[
  		19.71051930260215,
  		-3.906221908307983,
  		-0.27124872724507515
  	],
  	[
  		19.71086986442369,
  		-3.90213180287374,
  		-0.2688598765553215
  	],
  	[
  		19.71394648881684,
  		-3.898886250659968,
  		-0.2682700396405098
  	],
  	[
  		19.71532466947455,
  		-3.895668976086211,
  		-0.27057365995607213
  	],
  	[
  		19.71380542460391,
  		-3.89161687811167,
  		-0.2714199036278363
  	],
  	[
  		19.71364872801604,
  		-3.887437783291905,
  		-0.2691896180994362
  	],
  	[
  		19.716557926477908,
  		-3.884086981667369,
  		-0.26810264138369
  	],
  	[
  		19.71841428972937,
  		-3.88094544506113,
  		-0.2701974215099284
  	],
  	[
  		19.71711431865537,
  		-3.877006122421509,
  		-0.2715128342186656
  	],
  	[
  		19.7164932715885,
  		-3.872762158120993,
  		-0.26954778616441527
  	],
  	[
  		19.71912987763207,
  		-3.869290070192011,
  		-0.2680140259725383
  	],
  	[
  		19.72141294349965,
  		-3.866199246897956,
  		-0.26980026538397583
  	],
  	[
  		19.7204275762202,
  		-3.862384966249682,
  		-0.2715227235323096
  	],
  	[
  		19.71940821269641,
  		-3.858103461221207,
  		-0.26991621586258535
  	],
  	[
  		19.721681413495492,
  		-3.854500373425111,
  		-0.268009083628503
  	],
  	[
  		19.72431815944111,
  		-3.851432598312692,
  		-0.2694020579893295
  	],
  	[
  		19.72372890636011,
  		-3.847749810541639,
  		-0.2714492011378402
  	],
  	[
  		19.72239513416246,
  		-3.843459716294316,
  		-0.27027797348876054
  	],
  	[
  		19.72423038437367,
  		-3.839721837846279,
  		-0.26808800449747433
  	],
  	[
  		19.72713093255739,
  		-3.836648232610936,
  		-0.26902090097434683
  	],
  	[
  		19.72699934969349,
  		-3.833096959168355,
  		-0.27129541661734563
  	],
  	[
  		19.7254501765469,
  		-3.828827427461392,
  		-0.2706137770932971
  	],
  	[
  		19.726794188407098,
  		-3.824957498116619,
  		-0.268245145584819
  	],
  	[
  		19.72985570776048,
  		-3.821849246310574,
  		-0.2686721000133324
  	],
  	[
  		19.73022247386939,
  		-3.818423494494408,
  		-0.2710661901040557
  	],
  	[
  		19.72856662350645,
  		-3.814202653125681,
  		-0.2709056371843026
  	],
  	[
  		19.72938978161511,
  		-3.810209975490325,
  		-0.2684725504605418
  	],
  	[
  		19.7325012988711,
  		-3.807039874794819,
  		-0.2683722787947122
  	],
  	[
  		19.73338366104545,
  		-3.80372787895495,
  		-0.270773431357517
  	],
  	[
  		19.73173433887023,
  		-3.79958145295833,
  		-0.2711409835349046
  	],
  	[
  		19.73203155871744,
  		-3.79548097120056,
  		-0.2687596591300416
  	],
  	[
  		19.73507924462945,
  		-3.792224684855566,
  		-0.2681361403310152
  	],
  	[
  		19.73646882291805,
  		-3.78900887866516,
  		-0.270430437426796
  	],
  	[
  		19.734938839730567,
  		-3.784958872299521,
  		-0.27130680450986283
  	],
  	[
  		19.7347308460095,
  		-3.780770911369578,
  		-0.26909157423151847
  	],
  	[
  		19.737603329857848,
  		-3.777407919833624,
  		-0.26797254483636207
  	],
  	[
  		19.73946996137878,
  		-3.774266663253422,
  		-0.27005105130396395
  	],
  	[
  		19.738165447940702,
  		-3.7703304451157,
  		-0.27139396178563263
  	],
  	[
  		19.73749726710658,
  		-3.766079336545952,
  		-0.26944968264442587
  	],
  	[
  		19.74009128160936,
  		-3.762594483224779,
  		-0.2678888646963644
  	],
  	[
  		19.742380065015052,
  		-3.759502113388379,
  		-0.2696526863628467
  	],
  	[
  		19.74139660596937,
  		-3.755691743996462,
  		-0.271398129598349
  	],
  	[
  		19.74033448957121,
  		-3.751404935364406,
  		-0.26981861901971543
  	],
  	[
  		19.7425588982377,
  		-3.747788414355372,
  		-0.2678892671136331
  	],
  	[
  		19.74519648212004,
  		-3.744717334832123,
  		-0.2692547060870299
  	],
  	[
  		19.74461285276691,
  		-3.741038509657459,
  		-0.2713191969602904
  	],
  	[
  		19.743242842657832,
  		-3.736745007491034,
  		-0.27017823361410825
  	],
  	[
  		19.74502516148464,
  		-3.732993749814911,
  		-0.267972854420428
  	],
  	[
  		19.74792031370367,
  		-3.729914863060585,
  		-0.2688736650777213
  	],
  	[
  		19.7477985697444,
  		-3.726367586087536,
  		-0.2711589973901087
  	],
  	[
  		19.74622010164252,
  		-3.722096590833041,
  		-0.2705105639316016
  	],
  	[
  		19.7475088166031,
  		-3.71821378837314,
  		-0.2681337916605644
  	],
  	[
  		19.75055796197638,
  		-3.715098464320003,
  		-0.268526634679652
  	],
  	[
  		19.75093619435571,
  		-3.711676127863788,
  		-0.2709246482879085
  	],
  	[
  		19.749258117260638,
  		-3.707455557471175,
  		-0.2707985398401935
  	],
  	[
  		19.75002446631961,
  		-3.703450774201055,
  		-0.26836511945616087
  	],
  	[
  		19.75311597089578,
  		-3.700271822429045,
  		-0.2682298401102443
  	],
  	[
  		19.75400964866888,
  		-3.696962194929902,
  		-0.2706274853951917
  	],
  	[
  		19.75234562908123,
  		-3.692817526073122,
  		-0.2710281942221706
  	],
  	[
  		19.75258697126445,
  		-3.688706256372643,
  		-0.2686544614983468
  	],
  	[
  		19.75560730582271,
  		-3.685439581412761,
  		-0.26799630737898694
  	],
  	[
  		19.75700764069737,
  		-3.682225041380749,
  		-0.27027990203430213
  	],
  	[
  		19.7554698561103,
  		-3.678178050716852,
  		-0.2711875039794514
  	],
  	[
  		19.75520862947353,
  		-3.673980847101943,
  		-0.26898672077542124
  	],
  	[
  		19.75804697472626,
  		-3.670606485940654,
  		-0.2678365739601397
  	],
  	[
  		19.75992059037018,
  		-3.667464738707075,
  		-0.2698975357478911
  	],
  	[
  		19.75861505926623,
  		-3.66353250483618,
  		-0.2712678317772824
  	],
  	[
  		19.75789678906154,
  		-3.659273880959742,
  		-0.2693453838238694
  	],
  	[
  		19.76044989863188,
  		-3.655776628621589,
  		-0.2677565762481514
  	],
  	[
  		19.762742011873392,
  		-3.652682252369964,
  		-0.2694975503869351
  	],
  	[
  		19.76176211315084,
  		-3.648876135164135,
  		-0.27126495251052674
  	],
  	[
  		19.760655938369368,
  		-3.644583797257578,
  		-0.2697119618008585
  	],
  	[
  		19.762834373617398,
  		-3.640954633033163,
  		-0.2677607414734661
  	],
  	[
  		19.76546951154222,
  		-3.637879565081477,
  		-0.2690980218523056
  	],
  	[
  		19.7648947786699,
  		-3.634205344972734,
  		-0.27117846577607174
  	],
  	[
  		19.76348613972494,
  		-3.629908168271634,
  		-0.2700687212903869
  	],
  	[
  		19.76521867366789,
  		-3.626144250575492,
  		-0.2678472564443081
  	],
  	[
  		19.768105200360772,
  		-3.62305973238644,
  		-0.26871767855302825
  	],
  	[
  		19.76799423329644,
  		-3.619516495514279,
  		-0.27101177930597903
  	],
  	[
  		19.76638459797823,
  		-3.615243813149509,
  		-0.2703970079936538
  	],
  	[
  		19.76762026023069,
  		-3.61134869124639,
  		-0.2680116491150928
  	],
  	[
  		19.77065398444379,
  		-3.608225924196642,
  		-0.2683716294284028
  	],
  	[
  		19.77104478363391,
  		-3.604807052354654,
  		-0.27077129714165843
  	],
  	[
  		19.76934261744202,
  		-3.600586467140046,
  		-0.2706796214316292
  	],
  	[
  		19.770055387254757,
  		-3.596570240062211,
  		-0.2682446575571524
  	],
  	[
  		19.77312440752336,
  		-3.593382351026766,
  		-0.2680767594560686
  	],
  	[
  		19.77403050485847,
  		-3.590075141472662,
  		-0.2704686023395187
  	],
  	[
  		19.7723498579086,
  		-3.585932075520773,
  		-0.2709035211550708
  	],
  	[
  		19.77253779202947,
  		-3.581810442494036,
  		-0.2685356626063322
  	],
  	[
  		19.775528562763782,
  		-3.578533514528845,
  		-0.26784645797621137
  	],
  	[
  		19.77693921452061,
  		-3.57531998942362,
  		-0.2701173175296933
  	],
  	[
  		19.77539206420527,
  		-3.571275860530999,
  		-0.271056624566869
  	],
  	[
  		19.77507928524782,
  		-3.567069694460418,
  		-0.26886878787225454
  	],
  	[
  		19.77788151052174,
  		-3.563683963842,
  		-0.2676897653314756
  	],
  	[
  		19.77976283748899,
  		-3.560541812770087,
  		-0.2697317341623424
  	],
  	[
  		19.77845417328878,
  		-3.556613307105336,
  		-0.27113001919495133
  	],
  	[
  		19.77768851705395,
  		-3.552347462325089,
  		-0.2692263872338821
  	],
  	[
  		19.78019939814569,
  		-3.548838229394488,
  		-0.267613824961465
  	],
  	[
  		19.78249454515493,
  		-3.545741595889873,
  		-0.26932969509947186
  	],
  	[
  		19.781517628779458,
  		-3.541939989001861,
  		-0.27112095170442874
  	],
  	[
  		19.780367898561092,
  		-3.537642070737327,
  		-0.2695924562237799
  	],
  	[
  		19.78249931725497,
  		-3.534000546127091,
  		-0.2676221898471683
  	],
  	[
  		19.78513197674128,
  		-3.530921502236096,
  		-0.268930547858712
  	],
  	[
  		19.78456411337574,
  		-3.52725173862171,
  		-0.2710281924200861
  	],
  	[
  		19.78311868472,
  		-3.522951013765283,
  		-0.2699467966260178
  	],
  	[
  		19.78480002068387,
  		-3.519174751902365,
  		-0.26771288351934813
  	],
  	[
  		19.78767792855513,
  		-3.516084310326391,
  		-0.26854990232684267
  	],
  	[
  		19.78757789660726,
  		-3.512545633350724,
  		-0.27085540041565753
  	],
  	[
  		19.78593728813774,
  		-3.508271050360183,
  		-0.2702715535118276
  	],
  	[
  		19.78712035041012,
  		-3.504364253363125,
  		-0.2678806715100926
  	],
  	[
  		19.79013790944093,
  		-3.501233804434805,
  		-0.268206354162953
  	],
  	[
  		19.79054110971551,
  		-3.497818792187478,
  		-0.2706099239875097
  	],
  	[
  		19.78881537477872,
  		-3.493598195818105,
  		-0.2705509882847239
  	],
  	[
  		19.78947385458159,
  		-3.489570978939592,
  		-0.2681179915519855
  	],
  	[
  		19.79251951998629,
  		-3.486373701340969,
  		-0.267914715325623
  	],
  	[
  		19.79343838308242,
  		-3.483069460526251,
  		-0.2703033290132924
  	],
  	[
  		19.79174103537368,
  		-3.47892776139148,
  		-0.2707699627988829
  	],
  	[
  		19.79187622558176,
  		-3.474796459613108,
  		-0.268411052062189
  	],
  	[
  		19.79483619111851,
  		-3.47150871611926,
  		-0.267687818648485
  	],
  	[
  		19.79625885940638,
  		-3.468296945496544,
  		-0.2699477512957767
  	],
  	[
  		19.79470219162905,
  		-3.464255593461803,
  		-0.27091749023637524
  	],
  	[
  		19.79433905942216,
  		-3.460041292531787,
  		-0.2687457828585964
  	],
  	[
  		19.79710345668275,
  		-3.456643684300583,
  		-0.2675360494926169
  	],
  	[
  		19.79899382949624,
  		-3.453501738130909,
  		-0.26956048024928114
  	],
  	[
  		19.7976818954647,
  		-3.449576942628974,
  		-0.2709859595540498
  	],
  	[
  		19.79686929615444,
  		-3.445304602746825,
  		-0.2691048115480601
  	],
  	[
  		19.79933601019643,
  		-3.441782656244968,
  		-0.2674654120977404
  	],
  	[
  		19.80163590505395,
  		-3.438684443819532,
  		-0.2691575529853396
  	],
  	[
  		19.80066119783665,
  		-3.434887007761943,
  		-0.2709705777652432
  	],
  	[
  		19.79947033131643,
  		-3.430584555579625,
  		-0.2694694613723239
  	],
  	[
  		19.8015521759969,
  		-3.426929972048443,
  		-0.2674783146292692
  	],
  	[
  		19.80418470673429,
  		-3.423847528774159,
  		-0.26875740002381904
  	],
  	[
  		19.80362395111888,
  		-3.420182324219108,
  		-0.2708717888262585
  	],
  	[
  		19.80214318172838,
  		-3.415878895618096,
  		-0.2698217525643452
  	],
  	[
  		19.80377153801496,
  		-3.412089797977693,
  		-0.26757386415757883
  	],
  	[
  		19.8066424002814,
  		-3.408994083688749,
  		-0.26837891837478983
  	],
  	[
  		19.80655223698672,
  		-3.40545953753135,
  		-0.2706936194032526
  	],
  	[
  		19.80488356457941,
  		-3.401184236214188,
  		-0.2701438939140526
  	],
  	[
  		19.806010078503313,
  		-3.397264843263827,
  		-0.26774632292036943
  	],
  	[
  		19.80901399120931,
  		-3.39412726134762,
  		-0.26803694490462066
  	],
  	[
  		19.80942858879228,
  		-3.390715800197655,
  		-0.2704430332696876
  	],
  	[
  		19.8076817597993,
  		-3.386495966407124,
  		-0.27041782788301244
  	],
  	[
  		19.80828405345753,
  		-3.382457342101764,
  		-0.2679860838083961
  	],
  	[
  		19.81130822410234,
  		-3.37925124910309,
  		-0.2677479166767656
  	],
  	[
  		19.81223891018903,
  		-3.375949572681213,
  		-0.2701311759445186
  	],
  	[
  		19.81052837505997,
  		-3.371810364352537,
  		-0.2706314514292947
  	],
  	[
  		19.81060757582635,
  		-3.367668788046481,
  		-0.26828158272831704
  	],
  	[
  		19.81353926379317,
  		-3.364370921840645,
  		-0.2675246510880267
  	],
  	[
  		19.81497142668269,
  		-3.361160341308625,
  		-0.2697728870796259
  	],
  	[
  		19.81340821771036,
  		-3.357122454672831,
  		-0.2707727120686682
  	],
  	[
  		19.81299190664706,
  		-3.352899514550024,
  		-0.268617330326235
  	],
  	[
  		19.81572029728672,
  		-3.349490472260319,
  		-0.2673765486935156
  	],
  	[
  		19.81761741422541,
  		-3.346348150339056,
  		-0.26938223731657
  	],
  	[
  		19.81630518306619,
  		-3.342427658593627,
  		-0.27083389443200384
  	],
  	[
  		19.81544374913063,
  		-3.338148474253632,
  		-0.2689750797558976
  	],
  	[
  		19.81786862998029,
  		-3.334614467568454,
  		-0.2673092347626305
  	],
  	[
  		19.820170841517537,
  		-3.331514211851375,
  		-0.26897748801651644
  	],
  	[
  		19.819201315742163,
  		-3.327721560046455,
  		-0.27081140270841353
  	],
  	[
  		19.81796689151616,
  		-3.323414201918089,
  		-0.2693381791886438
  	],
  	[
  		19.82000176441546,
  		-3.319747207798394,
  		-0.2673260765909906
  	],
  	[
  		19.82263060183312,
  		-3.316660857663995,
  		-0.268577217816002
  	],
  	[
  		19.8220786193639,
  		-3.313000302212969,
  		-0.27070572894718004
  	],
  	[
  		19.82056088519235,
  		-3.308693933245451,
  		-0.2696872528838083
  	],
  	[
  		19.822137991530113,
  		-3.304892383396154,
  		-0.2674247669556325
  	],
  	[
  		19.82499917973755,
  		-3.301790985281062,
  		-0.2681983863203301
  	],
  	[
  		19.824920302336032,
  		-3.298260779357765,
  		-0.27052089654512324
  	],
  	[
  		19.82322168382263,
  		-3.293984330761896,
  		-0.2700044747680452
  	],
  	[
  		19.82429551909513,
  		-3.290053219018919,
  		-0.2675997555787952
  	],
  	[
  		19.82728218283625,
  		-3.286908177859843,
  		-0.2678579896166478
  	],
  	[
  		19.82770944930833,
  		-3.283500296977382,
  		-0.27026409972643334
  	],
  	[
  		19.82594012098265,
  		-3.279281188706814,
  		-0.2702738440233739
  	],
  	[
  		19.82648815498741,
  		-3.275231452980337,
  		-0.26784172268313794
  	],
  	[
  		19.82948860302117,
  		-3.272016492941072,
  		-0.26757111513943854
  	],
  	[
  		19.83043062734399,
  		-3.268717194123567,
  		-0.26994769073454494
  	],
  	[
  		19.82870484195057,
  		-3.264580036647679,
  		-0.2704809075112
  	],
  	[
  		19.82873136802803,
  		-3.260428793620565,
  		-0.2681384684323813
  	],
  	[
  		19.83163162165163,
  		-3.257120591786968,
  		-0.2673505509579228
  	],
  	[
  		19.833074123232638,
  		-3.25391116515709,
  		-0.2695847258569307
  	],
  	[
  		19.83150250805427,
  		-3.249876644837331,
  		-0.2706160581983204
  	],
  	[
  		19.83103571606036,
  		-3.245645389694005,
  		-0.2684742774389426
  	],
  	[
  		19.833727033968,
  		-3.242225300711993,
  		-0.2672061607386668
  	],
  	[
  		19.83563015543119,
  		-3.23908236196951,
  		-0.2691917183843061
  	],
  	[
  		19.834316024403,
  		-3.235166086625092,
  		-0.2706706192229964
  	],
  	[
  		19.83340760567085,
  		-3.230880290661637,
  		-0.2688320514814237
  	],
  	[
  		19.83578911312036,
  		-3.227334424770795,
  		-0.26714281892157643
  	],
  	[
  		19.83809312117138,
  		-3.224231861377291,
  		-0.2687852496202293
  	],
  	[
  		19.83712666380974,
  		-3.220443863713327,
  		-0.2706415858844701
  	],
  	[
  		19.83585054454483,
  		-3.216131701737709,
  		-0.2691931730126562
  	],
  	[
  		19.83783778117681,
  		-3.212452743876317,
  		-0.2671635219338515
  	],
  	[
  		19.84046286707762,
  		-3.209362282343229,
  		-0.2683844308909944
  	],
  	[
  		19.839918758617642,
  		-3.205706642318164,
  		-0.2705295205786705
  	],
  	[
  		19.83836501517667,
  		-3.201397316448323,
  		-0.26954006228120503
  	],
  	[
  		19.8398911786435,
  		-3.197584005393557,
  		-0.267266560892254
  	],
  	[
  		19.84274163063517,
  		-3.194476603872301,
  		-0.2680071724871442
  	],
  	[
  		19.842673446258942,
  		-3.190950982858547,
  		-0.27033926857994944
  	],
  	[
  		19.84094503991357,
  		-3.186673317988556,
  		-0.2698544621032146
  	],
  	[
  		19.84196540993818,
  		-3.182730838523464,
  		-0.2674454042764718
  	],
  	[
  		19.84493470915147,
  		-3.179578111011732,
  		-0.2676687890235407
  	],
  	[
  		19.84537401832517,
  		-3.176174146359183,
  		-0.2700773707069412
  	],
  	[
  		19.84358234776754,
  		-3.171955510113822,
  		-0.27011899642769194
  	],
  	[
  		19.84407700066544,
  		-3.167895542269157,
  		-0.2676904436430936
  	],
  	[
  		19.847052534823952,
  		-3.164671250062593,
  		-0.26738486640939624
  	],
  	[
  		19.848007593442063,
  		-3.161375080933546,
  		-0.2697564948687887
  	],
  	[
  		19.84626619008716,
  		-3.157239932488821,
  		-0.27032190963996394
  	],
  	[
  		19.84624005067434,
  		-3.1530795604411,
  		-0.2679897164127116
  	],
  	[
  		19.84910836871505,
  		-3.149760823648225,
  		-0.2671690776356576
  	],
  	[
  		19.85056130384663,
  		-3.146552989432323,
  		-0.26939115019228044
  	],
  	[
  		19.84898119300912,
  		-3.142521654873914,
  		-0.2704517600617566
  	],
  	[
  		19.84846413551693,
  		-3.138282848386357,
  		-0.26832767444009403
  	],
  	[
  		19.85111599118645,
  		-3.134850901769223,
  		-0.26702902136738177
  	],
  	[
  		19.85302773311314,
  		-3.131708244472589,
  		-0.26899571159035623
  	],
  	[
  		19.85171101538554,
  		-3.127795993749212,
  		-0.2705004519783109
  	],
  	[
  		19.85075705491252,
  		-3.123504418097098,
  		-0.2686847602544397
  	],
  	[
  		19.85309358034733,
  		-3.11994626359314,
  		-0.2669704550810336
  	],
  	[
  		19.85540130392146,
  		-3.116842116277064,
  		-0.26858813836768974
  	],
  	[
  		19.85443842376785,
  		-3.113058832655852,
  		-0.2704653971381704
  	],
  	[
  		19.8531215953387,
  		-3.108742768687482,
  		-0.26904563222208544
  	],
  	[
  		19.85505823567966,
  		-3.105051081944027,
  		-0.26699645237196573
  	],
  	[
  		19.85768162832834,
  		-3.10195726739182,
  		-0.2681882336421499
  	],
  	[
  		19.857144385820952,
  		-3.098306249696157,
  		-0.27034823039716904
  	],
  	[
  		19.85555663051193,
  		-3.093994906589259,
  		-0.2693903072251974
  	],
  	[
  		19.85702838688175,
  		-3.090169013532668,
  		-0.267104222179001
  	],
  	[
  		19.85987062911482,
  		-3.08705629643272,
  		-0.2678116875935918
  	],
  	[
  		19.85981280036441,
  		-3.083535119137781,
  		-0.27015175000860714
  	],
  	[
  		19.85805759234245,
  		-3.079257311908614,
  		-0.2697004801010528
  	],
  	[
  		19.85902187818463,
  		-3.075302937981863,
  		-0.2672863174283818
  	],
  	[
  		19.86197575082667,
  		-3.07214313074194,
  		-0.2674750817944447
  	],
  	[
  		19.8624266604835,
  		-3.068742951076687,
  		-0.26988476026561703
  	],
  	[
  		19.86061539365706,
  		-3.064525868899344,
  		-0.2699606505154482
  	],
  	[
  		19.86105317669677,
  		-3.060454940539906,
  		-0.2675348386882734
  	],
  	[
  		19.8640057149102,
  		-3.057221936859892,
  		-0.26719467870604413
  	],
  	[
  		19.86497138619901,
  		-3.053928345974099,
  		-0.2695601182108641
  	],
  	[
  		19.86321793646255,
  		-3.049796148395137,
  		-0.2701578086147099
  	],
  	[
  		19.86313630946769,
  		-3.045626212376323,
  		-0.2678361174787485
  	],
  	[
  		19.86597420155489,
  		-3.04229726063369,
  		-0.2669816371992593
  	],
  	[
  		19.86743662921235,
  		-3.039090809295118,
  		-0.2691905165266959
  	],
  	[
  		19.86585096072816,
  		-3.035063494854365,
  		-0.270280732815026
  	],
  	[
  		19.8652818744072,
  		-3.030816796005337,
  		-0.2681736097940948
  	],
  	[
  		19.86789671953091,
  		-3.027373792640384,
  		-0.2668452978510077
  	],
  	[
  		19.86981374605081,
  		-3.024230718015985,
  		-0.2687923058510926
  	],
  	[
  		19.86849806519213,
  		-3.020323372204817,
  		-0.27032247532364323
  	],
  	[
  		19.86749581281364,
  		-3.016025723974985,
  		-0.26853083354454194
  	],
  	[
  		19.86978904734212,
  		-3.012455663859024,
  		-0.26679050570815604
  	],
  	[
  		19.87209784393113,
  		-3.009349540466684,
  		-0.2683837493271744
  	],
  	[
  		19.87113997135431,
  		-3.00557123457066,
  		-0.2702805313686577
  	],
  	[
  		19.86978130308846,
  		-3.001251103903339,
  		-0.2688889510451209
  	],
  	[
  		19.8716699019797,
  		-2.997547381650363,
  		-0.26682015861465824
  	],
  	[
  		19.874288232813452,
  		-2.994449576614855,
  		-0.2679824931120076
  	],
  	[
  		19.873760660339357,
  		-2.990803723701394,
  		-0.2701558481117056
  	],
  	[
  		19.872136897617,
  		-2.986490155494389,
  		-0.2692300432600076
  	],
  	[
  		19.87355752970122,
  		-2.982652437286357,
  		-0.26693058482878634
  	],
  	[
  		19.87638828693041,
  		-2.979534109796116,
  		-0.2676068948577294
  	],
  	[
  		19.87634162296012,
  		-2.976017441687874,
  		-0.2699530584004713
  	],
  	[
  		19.8745579633197,
  		-2.971739368866635,
  		-0.269535966843736
  	],
  	[
  		19.87546851396364,
  		-2.967773661506974,
  		-0.2671159439670581
  	],
  	[
  		19.87840399197042,
  		-2.964606505739509,
  		-0.26727175373476414
  	],
  	[
  		19.878867053572268,
  		-2.961210069950769,
  		-0.269680283956503
  	],
  	[
  		19.8770343828895,
  		-2.956994289655897,
  		-0.2697903791204146
  	],
  	[
  		19.87741846989284,
  		-2.952913050345677,
  		-0.26736587604329304
  	],
  	[
  		19.88034553844224,
  		-2.949671259895543,
  		-0.26699338906561415
  	],
  	[
  		19.881322810818467,
  		-2.946380300600591,
  		-0.2693503540351144
  	],
  	[
  		19.87955518533864,
  		-2.942250902457626,
  		-0.2699814931801516
  	],
  	[
  		19.87942087799583,
  		-2.93807190199522,
  		-0.2676683544360783
  	],
  	[
  		19.88222647518645,
  		-2.934733025439446,
  		-0.2667839562602771
  	],
  	[
  		19.88369779245735,
  		-2.931527675361452,
  		-0.2689774344600329
  	],
  	[
  		19.882105080838418,
  		-2.927504341469405,
  		-0.2700982028229003
  	],
  	[
  		19.88148542230229,
  		-2.923250007782323,
  		-0.2680064751726449
  	],
  	[
  		19.88406171619097,
  		-2.919796090800681,
  		-0.2666508286296572
  	],
  	[
  		19.88598442482159,
  		-2.916652617571599,
  		-0.2685765034495466
  	],
  	[
  		19.88466747255774,
  		-2.912749934379127,
  		-0.2701328696921182
  	],
  	[
  		19.88361937050609,
  		-2.908446472895653,
  		-0.2683621557583574
  	],
  	[
  		19.88586826850527,
  		-2.904865034255253,
  		-0.2666001200997347
  	],
  	[
  		19.888177845852212,
  		-2.901756664386902,
  		-0.26816627094055423
  	],
  	[
  		19.88722461788027,
  		-2.897983718048201,
  		-0.2700847769776062
  	],
  	[
  		19.88582427731525,
  		-2.893659440041524,
  		-0.2687194038351418
  	],
  	[
  		19.887664385759408,
  		-2.889944160452409,
  		-0.2666340242797564
  	],
  	[
  		19.89027749082737,
  		-2.886842373560094,
  		-0.2677660669670647
  	],
  	[
  		19.88975800936248,
  		-2.883201671042633,
  		-0.2699540273289097
  	],
  	[
  		19.88809941955924,
  		-2.878885949846833,
  		-0.26905785269176324
  	],
  	[
  		19.889467648882512,
  		-2.875036775445126,
  		-0.2667485588116704
  	],
  	[
  		19.89228680790593,
  		-2.871912550126193,
  		-0.2673906516380684
  	],
  	[
  		19.8922516303965,
  		-2.868400953470317,
  		-0.2697453208965897
  	],
  	[
  		19.89043935285034,
  		-2.864122370729949,
  		-0.26935974942155977
  	],
  	[
  		19.8912966573859,
  		-2.860146034155438,
  		-0.2669370421241467
  	],
  	[
  		19.89421302977308,
  		-2.856971310907025,
  		-0.2670582813723778
  	],
  	[
  		19.89468873449335,
  		-2.853579181612438,
  		-0.2694678037377857
  	],
  	[
  		19.89283500629505,
  		-2.849364749606254,
  		-0.2696107260216198
  	],
  	[
  		19.893164778697642,
  		-2.845273702181442,
  		-0.2671909928208151
  	],
  	[
  		19.896065417875498,
  		-2.842022726041773,
  		-0.2667836690678307
  	],
  	[
  		19.897054913285398,
  		-2.838735013673399,
  		-0.26913447635584514
  	],
  	[
  		19.8952730473265,
  		-2.834608254336283,
  		-0.2697968309397338
  	],
  	[
  		19.89508625851716,
  		-2.830420821193679,
  		-0.2674953492563072
  	],
  	[
  		19.89785796477386,
  		-2.827071383014478,
  		-0.2665778162147067
  	],
  	[
  		19.89934022652399,
  		-2.82386799519709,
  		-0.26875773227423755
  	],
  	[
  		19.89774033564179,
  		-2.819848571600657,
  		-0.26990759021654454
  	],
  	[
  		19.897071502855358,
  		-2.815587507824493,
  		-0.26783443863950035
  	],
  	[
  		19.89960713895584,
  		-2.812122114124124,
  		-0.2664495980710588
  	],
  	[
  		19.901537441298448,
  		-2.808979000889175,
  		-0.2683552862426177
  	],
  	[
  		19.90021944109974,
  		-2.805081099402859,
  		-0.26993720720992703
  	],
  	[
  		19.899126016937828,
  		-2.800772597262768,
  		-0.2681910496920053
  	],
  	[
  		19.90132824326966,
  		-2.797179006471769,
  		-0.2664043069918702
  	],
  	[
  		19.90364039993584,
  		-2.794069133798656,
  		-0.2679448135042661
  	],
  	[
  		19.9026909613092,
  		-2.790301227294028,
  		-0.26988297150084833
  	],
  	[
  		19.9012515891491,
  		-2.785973919866628,
  		-0.2685466171958552
  	],
  	[
  		19.903039883267958,
  		-2.782246248590049,
  		-0.2664428059784973
  	],
  	[
  		19.90565038922472,
  		-2.779141106957052,
  		-0.2675438881087218
  	],
  	[
  		19.90513918623881,
  		-2.775505702728755,
  		-0.269746165404197
  	],
  	[
  		19.90344783716632,
  		-2.771188783836474,
  		-0.26888222090442804
  	],
  	[
  		19.90476172666121,
  		-2.767327683709632,
  		-0.2665617386398094
  	],
  	[
  		19.90757099672716,
  		-2.764198223714045,
  		-0.2671707009887451
  	],
  	[
  		19.90754643117427,
  		-2.760691386791962,
  		-0.269532007845056
  	],
  	[
  		19.90570876629238,
  		-2.756413558157387,
  		-0.26918101557241897
  	],
  	[
  		19.90650877979125,
  		-2.752425712437665,
  		-0.26675468491316934
  	],
  	[
  		19.909408340246138,
  		-2.749243926703741,
  		-0.2668404268135804
  	],
  	[
  		19.90989537772277,
  		-2.74585579879254,
  		-0.2692498776996892
  	],
  	[
  		19.9080232336639,
  		-2.741643509399165,
  		-0.2694263053405431
  	],
  	[
  		19.9082967400751,
  		-2.737542292081683,
  		-0.2670109184497111
  	],
  	[
  		19.911172761714433,
  		-2.734282641066072,
  		-0.26656869383445997
  	],
  	[
  		19.91217354298889,
  		-2.73099781947634,
  		-0.2689114058235149
  	],
  	[
  		19.910381051829262,
  		-2.726874812801663,
  		-0.2696065039814608
  	],
  	[
  		19.91013910949805,
  		-2.722678502894061,
  		-0.2673168634061425
  	],
  	[
  		19.91287953913303,
  		-2.719319224518492,
  		-0.266366450496402
  	],
  	[
  		19.914370204543552,
  		-2.716117237066461,
  		-0.2685319665521663
  	],
  	[
  		19.91276606396041,
  		-2.712102443214369,
  		-0.26971074207808216
  	],
  	[
  		19.912045288758232,
  		-2.707834212969838,
  		-0.2676566265717653
  	],
  	[
  		19.91454223258799,
  		-2.704357823206915,
  		-0.2662421860287127
  	],
  	[
  		19.91647750006356,
  		-2.701214457266108,
  		-0.2681268900674224
  	],
  	[
  		19.91516109561744,
  		-2.697321838142866,
  		-0.2697331168306337
  	],
  	[
  		19.91402066576953,
  		-2.693008040298004,
  		-0.2680116264904377
  	],
  	[
  		19.91617874197739,
  		-2.689402965187809,
  		-0.2662003069902637
  	],
  	[
  		19.91849111904336,
  		-2.686291122320488,
  		-0.2677148321747322
  	],
  	[
  		19.91754842168297,
  		-2.682528848585831,
  		-0.2696716087960788
  	],
  	[
  		19.9160676400924,
  		-2.678198158690149,
  		-0.26836481332168843
  	],
  	[
  		19.91780734052193,
  		-2.674458875462243,
  		-0.26624244288293547
  	],
  	[
  		19.92041156813537,
  		-2.671349888705706,
  		-0.26731419114052474
  	],
  	[
  		19.919910235502382,
  		-2.667719830109616,
  		-0.26952797183790017
  	],
  	[
  		19.91818431129438,
  		-2.663401507013831,
  		-0.2686969892456539
  	],
  	[
  		19.91944560251076,
  		-2.659528845225212,
  		-0.2663645591516721
  	],
  	[
  		19.922242576815098,
  		-2.656393837352987,
  		-0.2669413078696957
  	],
  	[
  		19.92222971774857,
  		-2.65289185181954,
  		-0.26930755410355384
  	],
  	[
  		19.92036476938841,
  		-2.648614356076951,
  		-0.2689904577921158
  	],
  	[
  		19.92111136803879,
  		-2.644615831529022,
  		-0.2665597671102629
  	],
  	[
  		19.92399090565834,
  		-2.641426756802498,
  		-0.2666128523360158
  	],
  	[
  		19.92449064033707,
  		-2.638042616743282,
  		-0.26901935310266134
  	],
  	[
  		19.92259865755874,
  		-2.633832448465462,
  		-0.26923074792263385
  	],
  	[
  		19.92281775337356,
  		-2.629721289636473,
  		-0.26681782074323673
  	],
  	[
  		19.92566730556307,
  		-2.626453050997988,
  		-0.26634366711364293
  	],
  	[
  		19.92667874894281,
  		-2.6231708840098,
  		-0.26867692534842375
  	],
  	[
  		19.92487375878718,
  		-2.619051251927904,
  		-0.269404357183691
  	],
  	[
  		19.92457938382915,
  		-2.614846518341468,
  		-0.2671249286960475
  	],
  	[
  		19.92728577730754,
  		-2.611477262518724,
  		-0.2661444159679835
  	],
  	[
  		19.92878558559926,
  		-2.608276619351207,
  		-0.2682933330053405
  	],
  	[
  		19.92717559180549,
  		-2.604266356340321,
  		-0.269502207263882
  	],
  	[
  		19.92640532272351,
  		-2.599991168403019,
  		-0.2674641640928319
  	],
  	[
  		19.9288626573538,
  		-2.596504177933389,
  		-0.26602384682832014
  	],
  	[
  		19.93080238007778,
  		-2.593360342816043,
  		-0.2678861747732271
  	],
  	[
  		19.92948633288013,
  		-2.58947299639091,
  		-0.26951796787526733
  	],
  	[
  		19.92830039068133,
  		-2.585154001157869,
  		-0.2678188845270198
  	],
  	[
  		19.93041291359025,
  		-2.581537662841542,
  		-0.265986204485762
  	],
  	[
  		19.93272497541095,
  		-2.578423604748952,
  		-0.2674732032648628
  	],
  	[
  		19.93178723873809,
  		-2.574666875986269,
  		-0.2694501546887283
  	],
  	[
  		19.93026672033288,
  		-2.570332844478135,
  		-0.2681699562045687
  	],
  	[
  		19.931956921179378,
  		-2.566582273676751,
  		-0.2660321924315043
  	],
  	[
  		19.93455499844405,
  		-2.563469233311932,
  		-0.2670722619644985
  	],
  	[
  		19.9340628803955,
  		-2.559844815896938,
  		-0.2693001070184514
  	],
  	[
  		19.93230333502973,
  		-2.555524973686339,
  		-0.2684991218260868
  	],
  	[
  		19.93351254743113,
  		-2.551641452590531,
  		-0.2661583648829728
  	],
  	[
  		19.93629596249019,
  		-2.548500471055667,
  		-0.2667011842695221
  	],
  	[
  		19.93629473845582,
  		-2.545003699419384,
  		-0.2690744913054939
  	],
  	[
  		19.93440256862014,
  		-2.540726418377701,
  		-0.2687897131683225
  	],
  	[
  		19.93509513724728,
  		-2.536717561767604,
  		-0.26635749037290485
  	],
  	[
  		19.93795432510321,
  		-2.53352088429054,
  		-0.2663755090398564
  	],
  	[
  		19.93846626738867,
  		-2.53014107792806,
  		-0.2687817163188636
  	],
  	[
  		19.93655462296504,
  		-2.525932729387289,
  		-0.2690249704018837
  	],
  	[
  		19.93672040970792,
  		-2.521812494261835,
  		-0.2666183352881661
  	],
  	[
  		19.93954195105546,
  		-2.518535025460722,
  		-0.26610936037602845
  	],
  	[
  		19.94056614536031,
  		-2.515256283562244,
  		-0.2684347934889733
  	],
  	[
  		19.93874807310575,
  		-2.511139891386862,
  		-0.2691938444522169
  	],
  	[
  		19.93840198226734,
  		-2.506927355402779,
  		-0.2669272870632036
  	],
  	[
  		19.94107352744896,
  		-2.503547822458325,
  		-0.2659150918933808
  	],
  	[
  		19.94258288045381,
  		-2.500348951784353,
  		-0.2680492084170326
  	],
  	[
  		19.94096681423552,
  		-2.496343025891659,
  		-0.2692864445012274
  	],
  	[
  		19.940147645644398,
  		-2.492061680053868,
  		-0.2672686011391729
  	],
  	[
  		19.94256293576077,
  		-2.488563234632378,
  		-0.26579936233084517
  	],
  	[
  		19.94450955991602,
  		-2.485419697506819,
  		-0.2676403100965199
  	],
  	[
  		19.943192954698382,
  		-2.481537329791505,
  		-0.2692962828920765
  	],
  	[
  		19.94196332293808,
  		-2.477213976755982,
  		-0.2676220764806982
  	],
  	[
  		19.94402865626305,
  		-2.47358588816576,
  		-0.26576638065420427
  	],
  	[
  		19.94634235926186,
  		-2.470470210719696,
  		-0.2672263589125272
  	],
  	[
  		19.94540985748586,
  		-2.466719006964894,
  		-0.2692221853663152
  	],
  	[
  		19.94385100857228,
  		-2.462382535802377,
  		-0.2679721562679181
  	],
  	[
  		19.945489120816433,
  		-2.458620007205913,
  		-0.26581752590005475
  	],
  	[
  		19.9480830068585,
  		-2.455503576942968,
  		-0.2668269036996212
  	],
  	[
  		19.94759905047133,
  		-2.451884451415807,
  		-0.26906721272664064
  	],
  	[
  		19.94580798179298,
  		-2.447564024964881,
  		-0.2682989563436927
  	],
  	[
  		19.94696168812159,
  		-2.443668795513066,
  		-0.2659484490911425
  	],
  	[
  		19.94973406795685,
  		-2.440522471842301,
  		-0.2664571982813326
  	],
  	[
  		19.94974364385681,
  		-2.437030569478591,
  		-0.268835663826843
  	],
  	[
  		19.94782732187822,
  		-2.432754477675254,
  		-0.2685846876869956
  	],
  	[
  		19.94846333348588,
  		-2.428734764913857,
  		-0.2661504493799629
  	],
  	[
  		19.95130417767934,
  		-2.425531026431635,
  		-0.26613344693409474
  	],
  	[
  		19.95182781107556,
  		-2.422155341822244,
  		-0.2685379138178203
  	],
  	[
  		19.94989932283634,
  		-2.417949811477345,
  		-0.26881510478555903
  	],
  	[
  		19.95000853981216,
  		-2.413819810818389,
  		-0.2664142651582937
  	],
  	[
  		19.95280434330845,
  		-2.410533806720597,
  		-0.2658712175436727
  	],
  	[
  		19.95383848219618,
  		-2.407257818291833,
  		-0.2681877051303113
  	],
  	[
  		19.9520110601844,
  		-2.403145534961296,
  		-0.2689780771757909
  	],
  	[
  		19.95161013461018,
  		-2.398924682058238,
  		-0.26672494758083193
  	],
  	[
  		19.95424842002399,
  		-2.395535151870397,
  		-0.2656799152210491
  	],
  	[
  		19.95576600567901,
  		-2.392337745619586,
  		-0.26779839014757284
  	],
  	[
  		19.9541465970883,
  		-2.388336780640591,
  		-0.26906351899316633
  	],
  	[
  		19.95327684016019,
  		-2.384048900064757,
  		-0.2670651702632422
  	],
  	[
  		19.95565251717134,
  		-2.380539742330559,
  		-0.26556787822563027
  	],
  	[
  		19.95760284541215,
  		-2.377395843464949,
  		-0.2673870636969035
  	],
  	[
  		19.95628934242109,
  		-2.373519221289275,
  		-0.2690663143982525
  	],
  	[
  		19.95501339251705,
  		-2.369191200348618,
  		-0.2674182328098205
  	],
  	[
  		19.95703334970644,
  		-2.365551731071596,
  		-0.2655386533513528
  	],
  	[
  		19.95934596768033,
  		-2.362434078316887,
  		-0.26697267412589
  	],
  	[
  		19.95841996873382,
  		-2.358688506147259,
  		-0.2689854651147369
  	],
  	[
  		19.95682157918166,
  		-2.354349364297039,
  		-0.26776515816096963
  	],
  	[
  		19.95840981448411,
  		-2.350575418363583,
  		-0.26559337235912034
  	],
  	[
  		19.96099616896867,
  		-2.347454985378657,
  		-0.26657222556083343
  	],
  	[
  		19.96052267296238,
  		-2.343841501732906,
  		-0.2688232095179913
  	],
  	[
  		19.9586983153749,
  		-2.33952022360619,
  		-0.26808781661838305
  	],
  	[
  		19.95979978300626,
  		-2.33561398633262,
  		-0.26572672844491374
  	],
  	[
  		19.96255800065225,
  		-2.332462054452585,
  		-0.2662037135211374
  	],
  	[
  		19.96257916872181,
  		-2.328975045706288,
  		-0.26858553630441173
  	],
  	[
  		19.96063719514877,
  		-2.324700011199168,
  		-0.2683690197892054
  	],
  	[
  		19.9612190455526,
  		-2.320669919695352,
  		-0.2659316472077983
  	],
  	[
  		19.96403861531111,
  		-2.317458891656814,
  		-0.26588184293670214
  	],
  	[
  		19.96457399123871,
  		-2.314087144406821,
  		-0.2682823902645814
  	],
  	[
  		19.96262688604612,
  		-2.309884138909141,
  		-0.2685933915642202
  	],
  	[
  		19.9626825453448,
  		-2.305744913205969,
  		-0.2661966652404426
  	],
  	[
  		19.96545001648116,
  		-2.302450231169144,
  		-0.2656217994204
  	],
  	[
  		19.9664948879728,
  		-2.299176997588451,
  		-0.2679272827210387
  	],
  	[
  		19.96465587710063,
  		-2.29506860502114,
  		-0.26875009478070727
  	],
  	[
  		19.96420325954705,
  		-2.290839918042656,
  		-0.26650803824367003
  	],
  	[
  		19.96680665531483,
  		-2.287440730824,
  		-0.2654343374912398
  	],
  	[
  		19.96833165070797,
  		-2.284244416508459,
  		-0.26753490681275094
  	],
  	[
  		19.96670756827258,
  		-2.280248430272569,
  		-0.2688292684437776
  	],
  	[
  		19.96578854076067,
  		-2.275954176821628,
  		-0.2668485830726537
  	],
  	[
  		19.96812338161209,
  		-2.272434505247568,
  		-0.2653256804537352
  	],
  	[
  		19.97007726143477,
  		-2.269290112676678,
  		-0.2671214490088346
  	],
  	[
  		19.96876433745641,
  		-2.265418955968486,
  		-0.2688249985734374
  	],
  	[
  		19.96744441606188,
  		-2.261086464441376,
  		-0.26719979510849695
  	],
  	[
  		19.96941817708028,
  		-2.257436158743946,
  		-0.2653005907295736
  	],
  	[
  		19.97172921991853,
  		-2.25431615803789,
  		-0.26670574632916144
  	],
  	[
  		19.97080939826576,
  		-2.250576628063383,
  		-0.2687380023878956
  	],
  	[
  		19.96917158009553,
  		-2.246234690493647,
  		-0.26754534309799877
  	],
  	[
  		19.97071014863592,
  		-2.242449933440973,
  		-0.2653594458171071
  	],
  	[
  		19.97328843500899,
  		-2.239325394515994,
  		-0.2663068347057641
  	],
  	[
  		19.972824059610662,
  		-2.235717590070307,
  		-0.2685698487395997
  	],
  	[
  		19.97096711868042,
  		-2.231395456778544,
  		-0.2678651408152168
  	],
  	[
  		19.97201537004168,
  		-2.22747862227234,
  		-0.2654969286235986
  	],
  	[
  		19.97475895670756,
  		-2.22432071739622,
  		-0.2659391695439206
  	],
  	[
  		19.97479190053592,
  		-2.220839110958511,
  		-0.2683266556664925
  	],
  	[
  		19.97282386064381,
  		-2.216564830768816,
  		-0.2681419807085768
  	],
  	[
  		19.97335221834481,
  		-2.212525110036011,
  		-0.2657047474087675
  	],
  	[
  		19.976149799134838,
  		-2.209306539583955,
  		-0.26562031549647414
  	],
  	[
  		19.97669776015764,
  		-2.205939340537483,
  		-0.2680189011297989
  	],
  	[
  		19.97473212871632,
  		-2.201738867659229,
  		-0.26836249141245433
  	],
  	[
  		19.97473391017792,
  		-2.197590979093011,
  		-0.2659733101408055
  	],
  	[
  		19.977471986797532,
  		-2.194287245928578,
  		-0.2653644468418241
  	],
  	[
  		19.97852829180755,
  		-2.191017352727749,
  		-0.267660879265735
  	],
  	[
  		19.97667741503781,
  		-2.186912684151338,
  		-0.2685141777075179
  	],
  	[
  		19.97617300747514,
  		-2.182676760425967,
  		-0.2662864937743473
  	],
  	[
  		19.97873966121778,
  		-2.179267235863914,
  		-0.2651809369662451
  	],
  	[
  		19.980274236518667,
  		-2.176072900617131,
  		-0.2672653755088807
  	],
  	[
  		19.97864512386382,
  		-2.172081741426095,
  		-0.2685872059407237
  	],
  	[
  		19.97767839307612,
  		-2.167782067251082,
  		-0.2666273670972629
  	],
  	[
  		19.97997002912058,
  		-2.164251290620557,
  		-0.2650770980464313
  	],
  	[
  		19.98192977980227,
  		-2.161107229542615,
  		-0.26685051157239503
  	],
  	[
  		19.98061778122511,
  		-2.15724169292635,
  		-0.2685776666939241
  	],
  	[
  		19.97925437673596,
  		-2.152905494280581,
  		-0.2669788415640355
  	],
  	[
  		19.98117933398406,
  		-2.149243598786467,
  		-0.2650574387195531
  	],
  	[
  		19.98349061198235,
  		-2.146122030317648,
  		-0.266435257331705
  	],
  	[
  		19.98257596501803,
  		-2.142388201523693,
  		-0.2684848202657305
  	],
  	[
  		19.98090132728467,
  		-2.138044595486125,
  		-0.26732256357596235
  	],
  	[
  		19.98238621189069,
  		-2.134248106610193,
  		-0.2651209853444236
  	],
  	[
  		19.984959256091052,
  		-2.131120139804992,
  		-0.2660360885157375
  	],
  	[
  		19.98450401229339,
  		-2.127518135788468,
  		-0.2683107149533588
  	],
  	[
  		19.9826168515822,
  		-2.123196125144347,
  		-0.2676387556275012
  	],
  	[
  		19.98360971296855,
  		-2.119268235053763,
  		-0.2652622798170409
  	],
  	[
  		19.98634043604089,
  		-2.116105031677238,
  		-0.2656706050017301
  	],
  	[
  		19.98638440984984,
  		-2.112628595661734,
  		-0.26806199887049453
  	],
  	[
  		19.98439363478669,
  		-2.108356358691421,
  		-0.2679119608932705
  	],
  	[
  		19.98486433595851,
  		-2.104306184484127,
  		-0.2654742300710535
  	],
  	[
  		19.98764193638992,
  		-2.10108056987726,
  		-0.2653543612899598
  	],
  	[
  		19.98820083904615,
  		-2.097717627843228,
  		-0.2677502450906848
  	],
  	[
  		19.98621946345388,
  		-2.093520509859587,
  		-0.2681267518696813
  	],
  	[
  		19.98616516946135,
  		-2.089363617081888,
  		-0.2657448968323992
  	],
  	[
  		19.988875476119222,
  		-2.086051290047536,
  		-0.2651015598841728
  	],
  	[
  		19.98994208602436,
  		-2.08278442428239,
  		-0.2673872807637788
  	],
  	[
  		19.98808299815359,
  		-2.07868457124968,
  		-0.26827200194588563
  	],
  	[
  		19.98752448940311,
  		-2.07444108181634,
  		-0.2660587666943213
  	],
  	[
  		19.99005684229579,
  		-2.071021936309671,
  		-0.26492149320343283
  	],
  	[
  		19.99159836472741,
  		-2.067829064730088,
  		-0.2669890784146201
  	],
  	[
  		19.98996714657259,
  		-2.063843519629266,
  		-0.2683383067389051
  	],
  	[
  		19.98895002417562,
  		-2.059538085945106,
  		-0.2663999552097443
  	],
  	[
  		19.99120039144049,
  		-2.055996718366169,
  		-0.26482181904516583
  	],
  	[
  		19.9931629855786,
  		-2.052852409067289,
  		-0.2665723569169403
  	],
  	[
  		19.99185421905463,
  		-2.048992945353704,
  		-0.2683216382806463
  	],
  	[
  		19.99044588948759,
  		-2.044652921976533,
  		-0.2667494920044131
  	],
  	[
  		19.9923244717277,
  		-2.04098007499162,
  		-0.2648055428771142
  	],
  	[
  		19.99463349856048,
  		-2.037856495684848,
  		-0.26615564746257364
  	],
  	[
  		19.99372670055924,
  		-2.03412895036577,
  		-0.2682214128564266
  	],
  	[
  		19.99201303771376,
  		-2.029783408194036,
  		-0.2670900066162699
  	],
  	[
  		19.99344782253491,
  		-2.025976076141059,
  		-0.26487240123986194
  	],
  	[
  		19.99601175172168,
  		-2.022844240462872,
  		-0.26575706832329093
  	],
  	[
  		19.99556705241456,
  		-2.019248116219776,
  		-0.2680405623666141
  	],
  	[
  		19.993647899414032,
  		-2.014926160776212,
  		-0.2674025761434047
  	],
  	[
  		19.99458708804502,
  		-2.010987607571531,
  		-0.2650168692421743
  	],
  	[
  		19.997302658183248,
  		-2.007818922575117,
  		-0.2653924886594186
  	],
  	[
  		19.99735828014651,
  		-2.004347693282075,
  		-0.2677859827471294
  	],
  	[
  		19.99534287371408,
  		-2.00007716116831,
  		-0.267670044774944
  	],
  	[
  		19.99575967221833,
  		-1.996017359206021,
  		-0.265230775255296
  	],
  	[
  		19.99851430368133,
  		-1.99278457870941,
  		-0.2650782336589766
  	],
  	[
  		19.99908543075958,
  		-1.989425893683069,
  		-0.2674682934106558
  	],
  	[
  		19.9970867239264,
  		-1.985232171006253,
  		-0.2678794294261553
  	],
  	[
  		19.99697822074495,
  		-1.981066552339362,
  		-0.2655028892426735
  	],
  	[
  		19.999659236241342,
  		-1.977745904854767,
  		-0.2648283829473857
  	],
  	[
  		20.00073545845819,
  		-1.974481863110576,
  		-0.2671018998038449
  	],
  	[
  		19.99886635616686,
  		-1.970386589614563,
  		-0.26801808920191733
  	],
  	[
  		19.998255929660992,
  		-1.96613594754513,
  		-0.2658177599796871
  	],
  	[
  		20.00075166520665,
  		-1.962707214227586,
  		-0.26465158249515935
  	],
  	[
  		20.00230067824434,
  		-1.95951576625669,
  		-0.2667000514124967
  	],
  	[
  		20.0006657895687,
  		-1.9555357978899,
  		-0.2680777742745748
  	],
  	[
  		19.999600281770572,
  		-1.951224770976103,
  		-0.26615786114345247
  	],
  	[
  		20.0018085867117,
  		-1.947673303401126,
  		-0.2645555795273589
  	],
  	[
  		20.00377375033667,
  		-1.944528608363842,
  		-0.2662815581807489
  	],
  	[
  		20.002467271124708,
  		-1.940675379121912,
  		-0.2680545296027522
  	],
  	[
  		20.00101497265964,
  		-1.936331576489545,
  		-0.2665067955167357
  	],
  	[
  		20.002846037394182,
  		-1.932648160064975,
  		-0.2645437797207104
  	],
  	[
  		20.00515231141268,
  		-1.929522414831228,
  		-0.26586474040098124
  	],
  	[
  		20.00425207553058,
  		-1.925801232510167,
  		-0.267948223827797
  	],
  	[
  		20.00250049202581,
  		-1.921453780139134,
  		-0.26684502551173084
  	],
  	[
  		20.00388405706587,
  		-1.917635927222828,
  		-0.26461440648855283
  	],
  	[
  		20.00643912202895,
  		-1.914500091442327,
  		-0.2654661891539472
  	],
  	[
  		20.00600461681724,
  		-1.910910260131517,
  		-0.2677610159625681
  	],
  	[
  		20.00405406009136,
  		-1.906588207195021,
  		-0.2671538763230525
  	],
  	[
  		20.004940108841367,
  		-1.90263976983781,
  		-0.2647626353193579
  	],
  	[
  		20.00763915677738,
  		-1.899465191546716,
  		-0.2651036564768326
  	],
  	[
  		20.007707083413663,
  		-1.895999767698996,
  		-0.2675014818818212
  	],
  	[
  		20.00566693340093,
  		-1.891730889465073,
  		-0.2674183746228816
  	],
  	[
  		20.00602920571529,
  		-1.88766186486238,
  		-0.2649803927996227
  	],
  	[
  		20.008760387943568,
  		-1.884421642169122,
  		-0.2647928653584064
  	],
  	[
  		20.00934355807169,
  		-1.881067686576562,
  		-0.2671797575676033
  	],
  	[
  		20.00732772576207,
  		-1.876877144290877,
  		-0.2676225597749629
  	],
  	[
  		20.00716590703867,
  		-1.872703653920211,
  		-0.2652550012339503
  	],
  	[
  		20.00981566264877,
  		-1.869373961627671,
  		-0.2645461261309997
  	],
  	[
  		20.0109039759216,
  		-1.866113646770121,
  		-0.26680900774422434
  	],
  	[
  		20.00902424200829,
  		-1.862022871541783,
  		-0.2677559774604063
  	],
  	[
  		20.008362987548818,
  		-1.857765815131209,
  		-0.2655710798849921
  	],
  	[
  		20.01082086947259,
  		-1.854327149269982,
  		-0.26437439596407647
  	],
  	[
  		20.01237827392464,
  		-1.851137704332286,
  		-0.266405478338199
  	],
  	[
  		20.010739664284372,
  		-1.847163265504167,
  		-0.2678103674158429
  	],
  	[
  		20.00962666283489,
  		-1.842847558296102,
  		-0.2659130025017347
  	],
  	[
  		20.01179022152313,
  		-1.839285135525658,
  		-0.2642835756754294
  	],
  	[
  		20.01376030107791,
  		-1.836140834188578,
  		-0.2659858925936924
  	],
  	[
  		20.0124550915408,
  		-1.832293581366246,
  		-0.2677812369439169
  	],
  	[
  		20.01096097050208,
  		-1.827946940413663,
  		-0.26626027042176953
  	],
  	[
  		20.01274247980102,
  		-1.824252401631018,
  		-0.26427637544469945
  	],
  	[
  		20.01504807410592,
  		-1.821125096832191,
  		-0.26556827419560775
  	],
  	[
  		20.01415448481724,
  		-1.817410302163699,
  		-0.2676684841757124
  	],
  	[
  		20.01236705263075,
  		-1.813061983591207,
  		-0.26659673936407974
  	],
  	[
  		20.0136969535632,
  		-1.809233051701564,
  		-0.2643519240504761
  	],
  	[
  		20.016245120879418,
  		-1.806093881667434,
  		-0.2651715247807793
  	],
  	[
  		20.01581982779337,
  		-1.802510087229475,
  		-0.2674763658731474
  	],
  	[
  		20.01384030979899,
  		-1.798188995496236,
  		-0.2669028900285828
  	],
  	[
  		20.01466981013385,
  		-1.794229881019603,
  		-0.264504802192472
  	],
  	[
  		20.01735476812708,
  		-1.791050043464264,
  		-0.2648109859258086
  	],
  	[
  		20.01743365230443,
  		-1.787590010706792,
  		-0.26721130378113517
  	],
  	[
  		20.015371969834842,
  		-1.783323764388992,
  		-0.26716208732240737
  	],
  	[
  		20.01567730055802,
  		-1.77924509282105,
  		-0.2647252254436142
  	],
  	[
  		20.01838705318566,
  		-1.775997948649265,
  		-0.2645023523876861
  	],
  	[
  		20.018981749043057,
  		-1.772648549868727,
  		-0.2668847131601448
  	],
  	[
  		20.01695169307152,
  		-1.768462183910307,
  		-0.2673609243344764
  	],
  	[
  		20.016733812445707,
  		-1.764280310608356,
  		-0.26500213115541243
  	],
  	[
  		20.019354930519746,
  		-1.760942389038949,
  		-0.2642597593410465
  	],
  	[
  		20.02045232756744,
  		-1.757685112088044,
  		-0.2665109090962821
  	],
  	[
  		20.01856569945545,
  		-1.753599700218778,
  		-0.2674881835394543
  	],
  	[
  		20.01785046391155,
  		-1.749335775890174,
  		-0.2653196160964346
  	],
  	[
  		20.02027224813461,
  		-1.745887517383838,
  		-0.26409128504779134
  	],
  	[
  		20.02183641284654,
  		-1.742699736630048,
  		-0.2661042963187232
  	],
  	[
  		20.0201964646889,
  		-1.738731319088189,
  		-0.2675353765725778
  	],
  	[
  		20.01903441177214,
  		-1.734410616343833,
  		-0.2656599897910454
  	],
  	[
  		20.021155856777312,
  		-1.730838034152874,
  		-0.2640042461880581
  	],
  	[
  		20.02312785656251,
  		-1.727693538126128,
  		-0.26568263594072844
  	],
  	[
  		20.02182758624552,
  		-1.723852983032018,
  		-0.2674990501055778
  	],
  	[
  		20.02028912708219,
  		-1.719503231445221,
  		-0.2660061357207457
  	],
  	[
  		20.02202335963986,
  		-1.715798069967847,
  		-0.2640006448761372
  	],
  	[
  		20.02432551930143,
  		-1.71266891762872,
  		-0.26526504537732437
  	],
  	[
  		20.023439767411762,
  		-1.708960542214082,
  		-0.2673796316344749
  	],
  	[
  		20.02161499934019,
  		-1.704611098480446,
  		-0.2663391138223791
  	],
  	[
  		20.02289339313455,
  		-1.700771606025328,
  		-0.2640797362706811
  	],
  	[
  		20.025431491883417,
  		-1.697628600371342,
  		-0.2648678705289322
  	],
  	[
  		20.02501732904001,
  		-1.694051058200751,
  		-0.2671805842366927
  	],
  	[
  		20.023007145452812,
  		-1.689730643708831,
  		-0.2666407146477416
  	],
  	[
  		20.02378340199649,
  		-1.685761541515189,
  		-0.2642348537746809
  	],
  	[
  		20.02645149314159,
  		-1.682576284642314,
  		-0.2645087770929664
  	],
  	[
  		20.02654227831625,
  		-1.679121662823596,
  		-0.2669095697441876
  	],
  	[
  		20.024457639810798,
  		-1.674857938128651,
  		-0.2668949994062894
  	],
  	[
  		20.02470845837837,
  		-1.670770039562799,
  		-0.2644577556650815
  	],
  	[
  		20.02739411258294,
  		-1.667515881640889,
  		-0.2642024291474512
  	],
  	[
  		20.028000029006932,
  		-1.664170763710536,
  		-0.2665780723626538
  	],
  	[
  		20.025954150871122,
  		-1.65998831755023,
  		-0.26708764948658564
  	],
  	[
  		20.02568281529851,
  		-1.655798471203276,
  		-0.2647357584433098
  	],
  	[
  		20.02827285976788,
  		-1.652452206370218,
  		-0.26396223929757684
  	],
  	[
  		20.02938001402354,
  		-1.64919796706221,
  		-0.2661998934864445
  	],
  	[
  		20.027484424166403,
  		-1.64511769515593,
  		-0.2672084042095344
  	],
  	[
  		20.026718446806512,
  		-1.640847327716854,
  		-0.2650533921167996
  	],
  	[
  		20.029102755648502,
  		-1.637389864741031,
  		-0.2637976987163038
  	],
  	[
  		20.03067281772185,
  		-1.634203356077084,
  		-0.26579045200423373
  	],
  	[
  		20.02903057833072,
  		-1.630241067564895,
  		-0.26724926939257554
  	],
  	[
  		20.02782063489612,
  		-1.625915436549824,
  		-0.26539377001469705
  	],
  	[
  		20.02989897329109,
  		-1.622332928322623,
  		-0.2637142343499988
  	],
  	[
  		20.03187242422424,
  		-1.619188057607521,
  		-0.26536737991184717
  	],
  	[
  		20.03057461601925,
  		-1.615353928592805,
  		-0.2672060550495191
  	],
  	[
  		20.028994167883113,
  		-1.611001228339971,
  		-0.2657378864173826
  	],
  	[
  		20.030680334665178,
  		-1.60728593456856,
  		-0.2637148268368507
  	],
  	[
  		20.03297857374082,
  		-1.604154527420866,
  		-0.2649487706332467
  	],
  	[
  		20.032100467152212,
  		-1.600453013195601,
  		-0.2670804560270124
  	],
  	[
  		20.030238699836943,
  		-1.596102296168449,
  		-0.26606878706712844
  	],
  	[
  		20.03146624565343,
  		-1.592252908078163,
  		-0.2637978276736608
  	],
  	[
  		20.03399347093665,
  		-1.589105858398861,
  		-0.2645534429137073
  	],
  	[
  		20.03358938246084,
  		-1.585534679762381,
  		-0.2668757037401735
  	],
  	[
  		20.03154909912999,
  		-1.581214890249283,
  		-0.2663673715268053
  	],
  	[
  		20.03227150294766,
  		-1.577236253682628,
  		-0.26395715784425133
  	],
  	[
  		20.03492196412023,
  		-1.574045132123799,
  		-0.2641959618090112
  	],
  	[
  		20.03502477120195,
  		-1.570596399102713,
  		-0.2665996672499623
  	],
  	[
  		20.03291674757879,
  		-1.566334846859996,
  		-0.2666170736900244
  	],
  	[
  		20.0331140600343,
  		-1.562238513074668,
  		-0.2641827415763369
  	],
  	[
  		20.03577480951475,
  		-1.558976987101808,
  		-0.26389279461269083
  	],
  	[
  		20.03639315508301,
  		-1.555636790584459,
  		-0.2662635830048365
  	],
  	[
  		20.03433130526773,
  		-1.551458180060555,
  		-0.26680529602850495
  	],
  	[
  		20.03400692124579,
  		-1.547261035332364,
  		-0.2644636604322708
  	],
  	[
  		20.0365646616506,
  		-1.543906024459993,
  		-0.2636571223250345
  	],
  	[
  		20.037682428150568,
  		-1.540655358583275,
  		-0.2658829101470449
  	],
  	[
  		20.0357773560231,
  		-1.536580022834519,
  		-0.26692110819029197
  	],
  	[
  		20.034960726256,
  		-1.532303833212356,
  		-0.2647830931508986
  	],
  	[
  		20.03730568601716,
  		-1.52883647171442,
  		-0.2634970459754992
  	],
  	[
  		20.038883823837793,
  		-1.52565205510008,
  		-0.26547110055814355
  	],
  	[
  		20.03723864172577,
  		-1.521695617618343,
  		-0.2669557325457482
  	],
  	[
  		20.035982749083182,
  		-1.517366038632094,
  		-0.2651231875317163
  	],
  	[
  		20.03801562037232,
  		-1.513773005181515,
  		-0.26341829701579894
  	],
  	[
  		20.039993072325267,
  		-1.510628521100725,
  		-0.265046711424514
  	],
  	[
  		20.03869804447401,
  		-1.50680092904291,
  		-0.266906965543338
  	],
  	[
  		20.03707625045806,
  		-1.502446011598507,
  		-0.2654668355862083
  	],
  	[
  		20.038711967529448,
  		-1.498719928400653,
  		-0.263424243293353
  	],
  	[
  		20.04100805137451,
  		-1.495587000022259,
  		-0.2646292640455529
  	],
  	[
  		20.040136496917768,
  		-1.491891939233706,
  		-0.2667758238824433
  	],
  	[
  		20.03824028419466,
  		-1.487541037213056,
  		-0.26579582943531854
  	],
  	[
  		20.03941282232267,
  		-1.483680811824342,
  		-0.2635120555108947
  	],
  	[
  		20.04193211359361,
  		-1.480530379597159,
  		-0.264234296461243
  	],
  	[
  		20.04153787329426,
  		-1.476965547605109,
  		-0.266565319278307
  	],
  	[
  		20.03946997799747,
  		-1.472647287085519,
  		-0.2660901108346458
  	],
  	[
  		20.04013635499982,
  		-1.468658653761727,
  		-0.2636746340423498
  	],
  	[
  		20.042771068980862,
  		-1.465462315009349,
  		-0.26387902526175083
  	],
  	[
  		20.04288517992017,
  		-1.462019198273851,
  		-0.26628379139161973
  	],
  	[
  		20.040757200794022,
  		-1.457761052830805,
  		-0.266335657530341
  	],
  	[
  		20.04089694787647,
  		-1.453655495649954,
  		-0.2639039440620659
  	],
  	[
  		20.043534849118856,
  		-1.450387130846964,
  		-0.26357896167555583
  	],
  	[
  		20.044163649572518,
  		-1.447051487690763,
  		-0.2659443456820058
  	],
  	[
  		20.0420888361774,
  		-1.442877504810673,
  		-0.2665181637684298
  	],
  	[
  		20.04170888045655,
  		-1.438672643893791,
  		-0.2641867607342132
  	],
  	[
  		20.0442359581429,
  		-1.435309288566444,
  		-0.2633465311251943
  	],
  	[
  		20.045362911938657,
  		-1.43206183310341,
  		-0.26555910660003307
  	],
  	[
  		20.04345204648624,
  		-1.427992388419581,
  		-0.2666270893681215
  	],
  	[
  		20.042582666345613,
  		-1.423710054441537,
  		-0.2645060799819954
  	],
  	[
  		20.04489056336315,
  		-1.420233436697148,
  		-0.26318974965459424
  	],
  	[
  		20.046474158610188,
  		-1.417050625373406,
  		-0.2651447656615871
  	],
  	[
  		20.04482907953772,
  		-1.413100792057485,
  		-0.26665489810986054
  	],
  	[
  		20.04352471296095,
  		-1.408766949054627,
  		-0.2648460607764
  	],
  	[
  		20.045514085281127,
  		-1.405163876243687,
  		-0.2631152666507081
  	],
  	[
  		20.04749228634795,
  		-1.402019233842658,
  		-0.26471922452236435
  	],
  	[
  		20.046202107292302,
  		-1.398198495668882,
  		-0.2665991540093943
  	],
  	[
  		20.04453778177556,
  		-1.393841279096981,
  		-0.26518740846986144
  	],
  	[
  		20.046125148590832,
  		-1.39010488947066,
  		-0.2631245211178526
  	],
  	[
  		20.048416557924188,
  		-1.386969998206542,
  		-0.2643004828727829
  	],
  	[
  		20.047553810058737,
  		-1.383281840454026,
  		-0.26646069277453244
  	],
  	[
  		20.04562131291921,
  		-1.378930490130716,
  		-0.265512451059332
  	],
  	[
  		20.04674255037379,
  		-1.375060295962664,
  		-0.2632153513350706
  	],
  	[
  		20.04925002057421,
  		-1.371906057820244,
  		-0.2639063824117418
  	],
  	[
  		20.0488668790272,
  		-1.368347617826518,
  		-0.26624360344753034
  	],
  	[
  		20.04676989849026,
  		-1.364030883789942,
  		-0.2658029049400795
  	],
  	[
  		20.04738201433273,
  		-1.360032601806777,
  		-0.263380951882064
  	],
  	[
  		20.04999876866135,
  		-1.356830905856848,
  		-0.263552478081563
  	],
  	[
  		20.05012431913238,
  		-1.353393327501209,
  		-0.2659565882022878
  	],
  	[
  		20.0479745367482,
  		-1.34913823564073,
  		-0.2660423425582059
  	],
  	[
  		20.04806040622909,
  		-1.345024209328407,
  		-0.2636119236540833
  	],
  	[
  		20.050672488454858,
  		-1.34174885560181,
  		-0.263254561506308
  	],
  	[
  		20.051312838874964,
  		-1.33841770771704,
  		-0.2656114367316542
  	],
  	[
  		20.0492233283275,
  		-1.334248349687653,
  		-0.2662191266519833
  	],
  	[
  		20.04879000386228,
  		-1.330036081765663,
  		-0.26389574718051095
  	],
  	[
  		20.05128517592599,
  		-1.326664741868381,
  		-0.263025420874921
  	],
  	[
  		20.052420527788847,
  		-1.323420236602192,
  		-0.2652231559071106
  	],
  	[
  		20.05050210608629,
  		-1.319356509676491,
  		-0.26632147417425023
  	],
  	[
  		20.049581948464514,
  		-1.315068369352779,
  		-0.264215806237827
  	],
  	[
  		20.05185094587974,
  		-1.311582638714445,
  		-0.2628721249295766
  	],
  	[
  		20.05344013201848,
  		-1.30840126692463,
  		-0.2648056743356237
  	],
  	[
  		20.05179343773762,
  		-1.304457968624241,
  		-0.2663425060047596
  	],
  	[
  		20.05044234066621,
  		-1.300119952193689,
  		-0.26455426075485333
  	],
  	[
  		20.05238765311649,
  		-1.296507378968086,
  		-0.262801323641533
  	],
  	[
  		20.05436635103746,
  		-1.293362378558302,
  		-0.26437872565095033
  	],
  	[
  		20.053080240647102,
  		-1.289548731722592,
  		-0.26628024626360103
  	],
  	[
  		20.051373972378,
  		-1.28518917409334,
  		-0.2648946107603912
  	],
  	[
  		20.052912496879532,
  		-1.281443028136614,
  		-0.2628151346948021
  	],
  	[
  		20.055198525533207,
  		-1.278305962932844,
  		-0.2639605681185093
  	],
  	[
  		20.054343743941374,
  		-1.274624873190872,
  		-0.2661358883465503
  	],
  	[
  		20.052375421043212,
  		-1.270273016716138,
  		-0.2652171941954164
  	],
  	[
  		20.053444344253577,
  		-1.266393179266381,
  		-0.2629096560540312
  	],
  	[
  		20.055940142440857,
  		-1.263234971311397,
  		-0.2635669716378418
  	],
  	[
  		20.05556787293884,
  		-1.259683334659499,
  		-0.26591265059008345
  	],
  	[
  		20.05344196263152,
  		-1.255367888162537,
  		-0.2655033954303097
  	],
  	[
  		20.05400044086164,
  		-1.251360769686129,
  		-0.2630787633295059
  	],
  	[
  		20.056597837227187,
  		-1.248153283795864,
  		-0.263215420662603
  	],
  	[
  		20.05673609520152,
  		-1.244721953785289,
  		-0.2656209217740677
  	],
  	[
  		20.05456420923911,
  		-1.24046987735608,
  		-0.265739660302184
  	],
  	[
  		20.05459561107978,
  		-1.236347791362473,
  		-0.2633133270600878
  	],
  	[
  		20.05718134069734,
  		-1.233065193605198,
  		-0.2629214886073869
  	],
  	[
  		20.057833321331252,
  		-1.22973904432515,
  		-0.26527227523970803
  	],
  	[
  		20.0557292626239,
  		-1.225574126177392,
  		-0.26591113600804184
  	],
  	[
  		20.055243016890493,
  		-1.221355212846919,
  		-0.26359945215064123
  	],
  	[
  		20.057703950523397,
  		-1.217975066477456,
  		-0.2626956621222692
  	],
  	[
  		20.05885045612861,
  		-1.21473447556561,
  		-0.2648800666016944
  	],
  	[
  		20.056923882206902,
  		-1.210676379077206,
  		-0.2660078901998849
  	],
  	[
  		20.05595413363412,
  		-1.206383202702051,
  		-0.2639201200532084
  	],
  	[
  		20.05818258322104,
  		-1.202887922515044,
  		-0.2625474143636574
  	],
  	[
  		20.05977884337323,
  		-1.199708697955062,
  		-0.26446115154130073
  	],
  	[
  		20.058130756263203,
  		-1.19577198035265,
  		-0.266023510833169
  	],
  	[
  		20.056733907404293,
  		-1.191430722799249,
  		-0.26425990048661563
  	],
  	[
  		20.05863205641117,
  		-1.187807732364309,
  		-0.2624819588850397
  	],
  	[
  		20.06061361963738,
  		-1.184663174455805,
  		-0.2640337230772361
  	],
  	[
  		20.05933053187738,
  		-1.180856371187017,
  		-0.26595553847928105
  	],
  	[
  		20.0575845837729,
  		-1.176495447477724,
  		-0.26459834117892606
  	],
  	[
  		20.0590714099506,
  		-1.172738817127112,
  		-0.2625003919480769
  	],
  	[
  		20.06135440874523,
  		-1.16960022060249,
  		-0.26361509133723365
  	],
  	[
  		20.0605075436259,
  		-1.165926234372241,
  		-0.2658047136312962
  	],
  	[
  		20.058506065265277,
  		-1.161574998097672,
  		-0.2649183530267168
  	],
  	[
  		20.05952002831809,
  		-1.157684964836671,
  		-0.2625994329905947
  	],
  	[
  		20.06200618084722,
  		-1.15452342976736,
  		-0.2632233485723572
  	],
  	[
  		20.061644037576333,
  		-1.150978454202215,
  		-0.26557649699195574
  	],
  	[
  		20.05949190517189,
  		-1.146665415058953,
  		-0.26520140022425615
  	],
  	[
  		20.05999316655641,
  		-1.142648672407823,
  		-0.26277294397759554
  	],
  	[
  		20.062573409060942,
  		-1.139435978339092,
  		-0.26287433931365933
  	],
  	[
  		20.06272264202164,
  		-1.13601046390571,
  		-0.26527974256514203
  	],
  	[
  		20.060532002854046,
  		-1.131762376609045,
  		-0.2654321398054935
  	],
  	[
  		20.060506448885743,
  		-1.127631856288834,
  		-0.26301004681483947
  	],
  	[
  		20.063067661887327,
  		-1.12434243830503,
  		-0.2625828138173703
  	],
  	[
  		20.063730786011938,
  		-1.121021164974614,
  		-0.2649263314458956
  	],
  	[
  		20.061615138985502,
  		-1.116861664593281,
  		-0.26559774173898154
  	],
  	[
  		20.061073727930857,
  		-1.112635734628711,
  		-0.2632975944873571
  	],
  	[
  		20.063503119816527,
  		-1.109247622089578,
  		-0.262361120352949
  	],
  	[
  		20.06465769517954,
  		-1.10601025904229,
  		-0.26453110220468423
  	],
  	[
  		20.06272661764188,
  		-1.10195867039575,
  		-0.2656880437438283
  	],
  	[
  		20.06170419935891,
  		-1.09766008016142,
  		-0.2636193368118349
  	],
  	[
  		20.06389387935553,
  		-1.094155609125585,
  		-0.26221641535993273
  	],
  	[
  		20.06549523931401,
  		-1.090978157227084,
  		-0.2641098073669496
  	],
  	[
  		20.06384776851368,
  		-1.087048424214997,
  		-0.26569653594793513
  	],
  	[
  		20.062403747948608,
  		-1.082703692374072,
  		-0.26395721344477735
  	],
  	[
  		20.06425754923692,
  		-1.079071102340997,
  		-0.26215482310568355
  	],
  	[
  		20.06623899644346,
  		-1.07592640410928,
  		-0.2636805756787057
  	],
  	[
  		20.06496247587375,
  		-1.072127126683609,
  		-0.2656211698640751
  	],
  	[
  		20.06317443243619,
  		-1.067764607220336,
  		-0.2642937097866449
  	],
  	[
  		20.0646123810712,
  		-1.063998125737628,
  		-0.2621765570186495
  	],
  	[
  		20.06688945058893,
  		-1.060857724856957,
  		-0.2632623092100492
  	],
  	[
  		20.06605158711465,
  		-1.057190846208315,
  		-0.2654637335265267
  	],
  	[
  		20.06401519534628,
  		-1.052839997032038,
  		-0.2646099809297442
  	],
  	[
  		20.06497639237172,
  		-1.048940286139142,
  		-0.2622791511551892
  	],
  	[
  		20.06744989157014,
  		-1.045775034689895,
  		-0.2628708350162651
  	],
  	[
  		20.067099344380523,
  		-1.042236805562786,
  		-0.2652289758177898
  	],
  	[
  		20.064919288332753,
  		-1.037925919741861,
  		-0.2648880975880981
  	],
  	[
  		20.06536659274278,
  		-1.033900214318422,
  		-0.26245468218479384
  	],
  	[
  		20.067927262705673,
  		-1.030682254923985,
  		-0.2625234894615816
  	],
  	[
  		20.068088492958964,
  		-1.027262555806325,
  		-0.26492641997948374
  	],
  	[
  		20.065877575460963,
  		-1.023018367995727,
  		-0.2651134702344336
  	],
  	[
  		20.06579743889244,
  		-1.01887978643621,
  		-0.2626938140489065
  	],
  	[
  		20.06833185202801,
  		-1.015583626934896,
  		-0.26223464977229755
  	],
  	[
  		20.06900555721522,
  		-1.012266897281321,
  		-0.2645686445530386
  	],
  	[
  		20.06687690190077,
  		-1.00811264207556,
  		-0.2652728386090873
  	],
  	[
  		20.06628229924006,
  		-1.003879977461931,
  		-0.2629824140702355
  	],
  	[
  		20.06867805721107,
  		-1.000483869679747,
  		-0.2620156410605627
  	],
  	[
  		20.06984126414703,
  		-0.9972497400680193,
  		-0.2641696097833938
  	],
  	[
  		20.06790378542521,
  		-0.9932044482000739,
  		-0.265356391691546
  	],
  	[
  		20.066831666325058,
  		-0.9889007726551677,
  		-0.26330370048573787
  	],
  	[
  		20.068981387823648,
  		-0.9853875470223041,
  		-0.261874883188139
  	],
  	[
  		20.07058711483603,
  		-0.9822115078901819,
  		-0.2637457492608582
  	],
  	[
  		20.06893967933025,
  		-0.9782889678036701,
  		-0.2653585296363963
  	],
  	[
  		20.06744925276772,
  		-0.9739407236793467,
  		-0.26364128390369185
  	],
  	[
  		20.06925779420294,
  		-0.9702988011932325,
  		-0.2618170968788753
  	],
  	[
  		20.07123864256441,
  		-0.9671538332402028,
  		-0.2633159147170917
  	],
  	[
  		20.0699664883378,
  		-0.963361875212406,
  		-0.26527653492485753
  	],
  	[
  		20.068138449827877,
  		-0.9589978750072641,
  		-0.26397559316001223
  	],
  	[
  		20.069526515589708,
  		-0.9552219514662605,
  		-0.2618430448120571
  	],
  	[
  		20.071797286096192,
  		-0.9520793619004145,
  		-0.26289690397064164
  	],
  	[
  		20.07096847677809,
  		-0.94842008490483,
  		-0.2651128879402148
  	],
  	[
  		20.068897498745272,
  		-0.9440694162190326,
  		-0.2642890065445395
  	],
  	[
  		20.06980670564086,
  		-0.9401607117302598,
  		-0.2619492473177452
  	],
  	[
  		20.072266578549687,
  		-0.9369914694907577,
  		-0.26250749317897987
  	],
  	[
  		20.07192705968078,
  		-0.9334602459079253,
  		-0.264872671467731
  	],
  	[
  		20.0697194916929,
  		-0.9291514269811263,
  		-0.26456401143446373
  	],
  	[
  		20.07011241290003,
  		-0.9251172425024383,
  		-0.2621290559714244
  	],
  	[
  		20.07265247814783,
  		-0.9218935194661193,
  		-0.2621625431390972
  	],
  	[
  		20.072825955618093,
  		-0.9184801497153192,
  		-0.2645655975021501
  	],
  	[
  		20.07059438349075,
  		-0.9142395119951916,
  		-0.2647846391108749
  	],
  	[
  		20.07046080363283,
  		-0.910093661803059,
  		-0.26237059689741404
  	],
  	[
  		20.072967289753333,
  		-0.9067902697051807,
  		-0.2618769586574926
  	],
  	[
  		20.073653153686642,
  		-0.9034787830200053,
  		-0.2642032598949999
  	],
  	[
  		20.07151109359254,
  		-0.8993296141012573,
  		-0.2649389735204133
  	],
  	[
  		20.070864434267662,
  		-0.8950910055787342,
  		-0.26266142168987144
  	],
  	[
  		20.0732249808984,
  		-0.891686435749209,
  		-0.261662693650972
  	],
  	[
  		20.074397942031197,
  		-0.888456085474778,
  		-0.2638020761467723
  	],
  	[
  		20.072453447387982,
  		-0.8844169159153115,
  		-0.2650176503753238
  	],
  	[
  		20.071332048192772,
  		-0.8801088344894318,
  		-0.2629844455697909
  	],
  	[
  		20.073439900096403,
  		-0.8765861514497477,
  		-0.26152688736698687
  	],
  	[
  		20.07505201028835,
  		-0.8734122595572228,
  		-0.263376590005632
  	],
  	[
  		20.07340367824794,
  		-0.8694965511847612,
  		-0.2650134968852205
  	],
  	[
  		20.07186921635894,
  		-0.8651458200880526,
  		-0.2633211920942538
  	],
  	[
  		20.07363011276517,
  		-0.8614939492132481,
  		-0.26147372856483203
  	],
  	[
  		20.0756129046151,
  		-0.8583493625500735,
  		-0.2629455150986543
  	],
  	[
  		20.0743452397491,
  		-0.8545647974296993,
  		-0.2649256860731091
  	],
  	[
  		20.07247823998227,
  		-0.8502000749542522,
  		-0.2636543002917168
  	],
  	[
  		20.073814418543343,
  		-0.8464141753434191,
  		-0.26150486336330453
  	],
  	[
  		20.076080567818998,
  		-0.8432700731218049,
  		-0.26252826715264954
  	],
  	[
  		20.0752596026004,
  		-0.8396179541901685,
  		-0.2647566880016259
  	],
  	[
  		20.073156727219338,
  		-0.8352685792437262,
  		-0.263965651326209
  	],
  	[
  		20.074009885832773,
  		-0.8313499657718761,
  		-0.26161594889381673
  	],
  	[
  		20.076459001668006,
  		-0.8281773502617407,
  		-0.2621398798902041
  	],
  	[
  		20.07612983242689,
  		-0.8246529514114856,
  		-0.26451101924910353
  	],
  	[
  		20.073897310424563,
  		-0.8203470348789239,
  		-0.26423574804205735
  	],
  	[
  		20.074233802255833,
  		-0.8163039427371068,
  		-0.2617985824172611
  	],
  	[
  		20.076755248129107,
  		-0.8130750761415046,
  		-0.26179728385165
  	],
  	[
  		20.07694010753605,
  		-0.8096676999017165,
  		-0.2641985659629766
  	],
  	[
  		20.074691367225302,
  		-0.8054317801534939,
  		-0.26445170785630284
  	],
  	[
  		20.07450060598871,
  		-0.8012779692706163,
  		-0.2620433757872598
  	],
  	[
  		20.07698149869267,
  		-0.7979679587600239,
  		-0.2615152131123593
  	],
  	[
  		20.07767721876837,
  		-0.7946612610224077,
  		-0.2638333463469311
  	],
  	[
  		20.075524894866188,
  		-0.790517930159631,
  		-0.2646002408457664
  	],
  	[
  		20.074823377447938,
  		-0.7862729097667368,
  		-0.2623358172935221
  	],
  	[
  		20.07715049324167,
  		-0.782860279249344,
  		-0.2613044244375848
  	],
  	[
  		20.07833138528658,
  		-0.7796332712617795,
  		-0.2634281460546006
  	],
  	[
  		20.07638334630441,
  		-0.7756009886992562,
  		-0.2646717696536257
  	],
  	[
  		20.075210705265476,
  		-0.7712881886326937,
  		-0.2626581143200184
  	],
  	[
  		20.077278900473303,
  		-0.7677566488832741,
  		-0.2611718874704728
  	],
  	[
  		20.0788949512863,
  		-0.7645844800384375,
  		-0.2630004398438346
  	],
  	[
  		20.07724881183318,
  		-0.7606762813184578,
  		-0.2646607393639517
  	],
  	[
  		20.07566788506404,
  		-0.7563227493693316,
  		-0.2629941908115978
  	],
  	[
  		20.077383277893063,
  		-0.7526614394893936,
  		-0.26112298289337643
  	],
  	[
  		20.07936468697819,
  		-0.7495167592528076,
  		-0.2625688161060435
  	],
  	[
  		20.0781034115033,
  		-0.7457397638512984,
  		-0.264566077241489
  	],
  	[
  		20.07619624646692,
  		-0.7413742100305386,
  		-0.2633246174059141
  	],
  	[
  		20.077482263638423,
  		-0.7375786878190365,
  		-0.2611573636599741
  	],
  	[
  		20.079741322328427,
  		-0.7344326761573807,
  		-0.26215060481922653
  	],
  	[
  		20.078930004245137,
  		-0.7307880094707122,
  		-0.2643900180787087
  	],
  	[
  		20.07679357404331,
  		-0.7264396181772111,
  		-0.2636314646210154
  	],
  	[
  		20.07759438135468,
  		-0.7225119260381487,
  		-0.26127122613378767
  	],
  	[
  		20.0800290447529,
  		-0.7193355814205566,
  		-0.2617633749267283
  	],
  	[
  		20.07971144020923,
  		-0.7158180225993909,
  		-0.2641379403789789
  	],
  	[
  		20.077452719257312,
  		-0.7115150339765122,
  		-0.2638974618246051
  	],
  	[
  		20.07773454845582,
  		-0.7074633172771925,
  		-0.2614565705873794
  	],
  	[
  		20.08023522509292,
  		-0.7042292256904207,
  		-0.26142253665748777
  	],
  	[
  		20.08043119187754,
  		-0.7008276618611933,
  		-0.263820412736939
  	],
  	[
  		20.07816346983633,
  		-0.6965960863822386,
  		-0.264107045256674
  	],
  	[
  		20.07791901568252,
  		-0.6924349614529379,
  		-0.261702792923987
  	],
  	[
  		20.08037128323081,
  		-0.6891181500741161,
  		-0.2611427910140923
  	],
  	[
  		20.08107770922725,
  		-0.6858161371637155,
  		-0.263449878517228
  	],
  	[
  		20.07891336212616,
  		-0.6816786010422394,
  		-0.26424962078679093
  	],
  	[
  		20.078159485642047,
  		-0.6774274762836656,
  		-0.2619957791886116
  	],
  	[
  		20.08045214998942,
  		-0.6740071975341859,
  		-0.26093550051679293
  	],
  	[
  		20.081640057781073,
  		-0.6707832194379362,
  		-0.2630419108280437
  	],
  	[
  		20.07968687590642,
  		-0.6667577237553357,
  		-0.2643145414592123
  	],
  	[
  		20.0784648312063,
  		-0.6624404555554845,
  		-0.262318477296247
  	],
  	[
  		20.080491918805514,
  		-0.6589002859486552,
  		-0.2608066426300572
  	],
  	[
  		20.082111463331998,
  		-0.6557295343185459,
  		-0.2626116568282842
  	],
  	[
  		20.08046563985785,
  		-0.6518287501813426,
  		-0.2642967258903164
  	],
  	[
  		20.07883991909491,
  		-0.6474724681985955,
  		-0.26265275217415834
  	],
  	[
  		20.08050942870711,
  		-0.6438022676910489,
  		-0.2607614543951514
  	],
  	[
  		20.08248907781407,
  		-0.6406572172570026,
  		-0.262178984255989
  	],
  	[
  		20.081233428120832,
  		-0.6368880677955638,
  		-0.2641955964938121
  	],
  	[
  		20.07928665063169,
  		-0.6325216038192116,
  		-0.2629816621924562
  	],
  	[
  		20.080522734745458,
  		-0.6287171567555071,
  		-0.2608003145450164
  	],
  	[
  		20.08277361212325,
  		-0.6255689213412825,
  		-0.26176186166264265
  	],
  	[
  		20.08197137040137,
  		-0.6219319306530917,
  		-0.2640137898421863
  	],
  	[
  		20.079801440709566,
  		-0.6175844160408511,
  		-0.2632858593748059
  	],
  	[
  		20.080549174707237,
  		-0.6136480118574918,
  		-0.2609178698091708
  	],
  	[
  		20.0829692310875,
  		-0.6104677058543251,
  		-0.26137576415795544
  	],
  	[
  		20.08266283625669,
  		-0.6069573615566535,
  		-0.2637559848243644
  	],
  	[
  		20.0803778047352,
  		-0.6026570006227572,
  		-0.2635472503359899
  	],
  	[
  		20.08060586013167,
  		-0.5985975373577416,
  		-0.26110652117566907
  	],
  	[
  		20.0830843408243,
  		-0.5953577566878817,
  		-0.261037579939551
  	],
  	[
  		20.08329303914731,
  		-0.5919627627782841,
  		-0.2634338809610499
  	],
  	[
  		20.081005830124532,
  		-0.5877354743717227,
  		-0.26375329592773744
  	],
  	[
  		20.080707415335183,
  		-0.5835675111966542,
  		-0.2613558909877322
  	],
  	[
  		20.083130468366612,
  		-0.5802436727697059,
  		-0.260762234794305
  	],
  	[
  		20.083847804333452,
  		-0.5769468325812852,
  		-0.2630603626671206
  	],
  	[
  		20.08167133849156,
  		-0.5728148940313734,
  		-0.2638905336685275
  	],
  	[
  		20.080865362070348,
  		-0.5685584077618406,
  		-0.26165108830020334
  	],
  	[
  		20.08312100479596,
  		-0.5651296286606561,
  		-0.2605586687176085
  	],
  	[
  		20.084318770339998,
  		-0.5619096526551933,
  		-0.2626491451414869
  	],
  	[
  		20.08235968832103,
  		-0.5578907942551709,
  		-0.2639497097554791
  	],
  	[
  		20.081089577607738,
  		-0.5535698719956791,
  		-0.2619738188663958
  	],
  	[
  		20.08307368871828,
  		-0.5500206073087672,
  		-0.26043476934140253
  	],
  	[
  		20.084698673036677,
  		-0.5468520565603454,
  		-0.2622176299843042
  	],
  	[
  		20.083053502282084,
  		-0.5429587657683638,
  		-0.26392627556232634
  	],
  	[
  		20.08138397926098,
  		-0.5386006566611605,
  		-0.26230874258384457
  	],
  	[
  		20.08300428838625,
  		-0.5349206855785064,
  		-0.2603949877703943
  	],
  	[
  		20.08498452211215,
  		-0.5317760778951767,
  		-0.26178514337128583
  	],
  	[
  		20.08373341833503,
  		-0.5280145245768286,
  		-0.263819734774344
  	],
  	[
  		20.081749201780006,
  		-0.5236481218830641,
  		-0.26263564599737194
  	],
  	[
  		20.08293182318237,
  		-0.5198339261680086,
  		-0.2604385481485873
  	],
  	[
  		20.08517713343684,
  		-0.5166841705741655,
  		-0.2613680728042556
  	],
  	[
  		20.08438374036139,
  		-0.5130548564886429,
  		-0.2636315881713069
  	],
  	[
  		20.08218330169054,
  		-0.5087093607984109,
  		-0.26293650923812
  	],
  	[
  		20.082875121575107,
  		-0.504763711290717,
  		-0.2605600913081611
  	],
  	[
  		20.0852826394541,
  		-0.5015800844670895,
  		-0.2609837828751927
  	],
  	[
  		20.084986942808637,
  		-0.4980768980707395,
  		-0.2633687349472301
  	],
  	[
  		20.082678397877963,
  		-0.4937803040824227,
  		-0.2631942515063805
  	],
  	[
  		20.082848956268016,
  		-0.4897123398435608,
  		-0.2607527888055556
  	],
  	[
  		20.08530723387507,
  		-0.4864674529629516,
  		-0.2606486762127465
  	],
  	[
  		20.08552658891393,
  		-0.4830785980091,
  		-0.26304224696030704
  	],
  	[
  		20.083223402301947,
  		-0.4788565835085127,
  		-0.26339471910483353
  	],
  	[
  		20.08286830828628,
  		-0.4746814270637443,
  		-0.2610045665635597
  	],
  	[
  		20.08526376642575,
  		-0.4713509161080782,
  		-0.26037593188773095
  	],
  	[
  		20.08599142074425,
  		-0.4680591714636851,
  		-0.26266415962304074
  	],
  	[
  		20.083805876784343,
  		-0.4639337901831427,
  		-0.2635255979302074
  	],
  	[
  		20.08294585316644,
  		-0.4596716603451652,
  		-0.26130027550583673
  	],
  	[
  		20.085167058373862,
  		-0.45623521294656566,
  		-0.2601763327212301
  	],
  	[
  		20.08637152687411,
  		-0.45301859977583697,
  		-0.2622499479895453
  	],
  	[
  		20.08441019352302,
  		-0.44900730184071574,
  		-0.26357807857560095
  	],
  	[
  		20.08308907538417,
  		-0.4446824500453455,
  		-0.2616237295838845
  	],
  	[
  		20.08503189105808,
  		-0.44112445980878423,
  		-0.2600561953257681
  	],
  	[
  		20.086660003273362,
  		-0.4379577646942508,
  		-0.2618167967026281
  	],
  	[
  		20.0850171848534,
  		-0.43407232548815816,
  		-0.26354767915007765
  	],
  	[
  		20.08330264830689,
  		-0.4297122763737716,
  		-0.2619564360486231
  	],
  	[
  		20.08487650600994,
  		-0.42602331113664155,
  		-0.2600202516955966
  	],
  	[
  		20.086854251314186,
  		-0.4228785949669644,
  		-0.2613826870327361
  	],
  	[
  		20.08561092109478,
  		-0.4191252825715209,
  		-0.2634336121537694
  	],
  	[
  		20.08358713150965,
  		-0.414758807587833,
  		-0.26228055849415405
  	],
  	[
  		20.08471942319209,
  		-0.41093558772127753,
  		-0.26006679411582734
  	],
  	[
  		20.086956098335502,
  		-0.4077840698814413,
  		-0.26096620901104267
  	],
  	[
  		20.08617249168003,
  		-0.4041624754741925,
  		-0.26323895089088295
  	],
  	[
  		20.08393981022627,
  		-0.3998188872032453,
  		-0.26257747088421074
  	],
  	[
  		20.08457792097559,
  		-0.39586453132322585,
  		-0.2601918610917086
  	],
  	[
  		20.08697002610528,
  		-0.39267732234327374,
  		-0.26058284861481623
  	],
  	[
  		20.08668595903898,
  		-0.38918130175529053,
  		-0.2629699551208302
  	],
  	[
  		20.08435228576304,
  		-0.3848883087905947,
  		-0.2628299036558101
  	],
  	[
  		20.08446847838625,
  		-0.38081249505365683,
  		-0.2603863230705821
  	],
  	[
  		20.086904343780397,
  		-0.3775625224321935,
  		-0.26024954311876164
  	],
  	[
  		20.087135355652734,
  		-0.37417982850593623,
  		-0.2626378060285399
  	],
  	[
  		20.084814471165082,
  		-0.3699630436729267,
  		-0.26302458085239827
  	],
  	[
  		20.08440514200412,
  		-0.3657811105957787,
  		-0.2606396933164477
  	],
  	[
  		20.086771070614763,
  		-0.36244418799657013,
  		-0.25997990217019135
  	],
  	[
  		20.087508350443997,
  		-0.35915721662586314,
  		-0.2622558487540465
  	],
  	[
  		20.08531241244171,
  		-0.3550383562274934,
  		-0.26314921942290564
  	],
  	[
  		20.08439981290973,
  		-0.3507708290751995,
  		-0.2609363464815005
  	],
  	[
  		20.086584903287772,
  		-0.3473268311337647,
  		-0.2597832571830871
  	],
  	[
  		20.087796499779703,
  		-0.3441136052753203,
  		-0.26183836184508674
  	],
  	[
  		20.085831030474452,
  		-0.3401097105137537,
  		-0.26319475192730807
  	],
  	[
  		20.084461441215563,
  		-0.3357811991019939,
  		-0.2612587555109687
  	],
  	[
  		20.08636196481648,
  		-0.33221502173548484,
  		-0.25966707277335205
  	],
  	[
  		20.087992642244814,
  		-0.32904987604404856,
  		-0.26140294171442874
  	],
  	[
  		20.08635192579847,
  		-0.32517266014112445,
  		-0.26315800477396895
  	],
  	[
  		20.084592613896838,
  		-0.32081057833513826,
  		-0.2615908757181602
  	],
  	[
  		20.08611934144854,
  		-0.3171130278305143,
  		-0.2596351544235486
  	],
  	[
  		20.088094197909353,
  		-0.3139681616499104,
  		-0.2609690441859697
  	],
  	[
  		20.08685692904919,
  		-0.31022304715922183,
  		-0.26303756119574484
  	],
  	[
  		20.08479506418885,
  		-0.30585658090914253,
  		-0.2619126240838299
  	],
  	[
  		20.08587589572031,
  		-0.30202475546447904,
  		-0.25968585291584334
  	],
  	[
  		20.088103651961056,
  		-0.29887116057544677,
  		-0.26055217570632533
  	],
  	[
  		20.08733023512915,
  		-0.29525788555665644,
  		-0.26283671473883474
  	],
  	[
  		20.085065274458998,
  		-0.2909159633415903,
  		-0.2622060123005712
  	],
  	[
  		20.08565040705328,
  		-0.28695363707547694,
  		-0.2598142312079568
  	],
  	[
  		20.0880260741677,
  		-0.2837625869457778,
  		-0.26017111118419795
  	],
  	[
  		20.08775380055265,
  		-0.2802742221052274,
  		-0.26256254262432005
  	],
  	[
  		20.085395185590823,
  		-0.2759847897406916,
  		-0.2624552126243666
  	],
  	[
  		20.08545661660166,
  		-0.2719016695734036,
  		-0.2600129197820537
  	],
  	[
  		20.087868889274702,
  		-0.2686461559562755,
  		-0.25984091285655325
  	],
  	[
  		20.08811213305448,
  		-0.26527024891199574,
  		-0.26222638354236
  	],
  	[
  		20.085773259716962,
  		-0.2610584466959323,
  		-0.26264501871128715
  	],
  	[
  		20.08531053019908,
  		-0.25687049311131693,
  		-0.2602684139031386
  	],
  	[
  		20.08764545487713,
  		-0.2535265941058253,
  		-0.25957458486316914
  	],
  	[
  		20.08839434165916,
  		-0.2502452288540849,
  		-0.2618400514094024
  	],
  	[
  		20.08618755240292,
  		-0.24613276734434422,
  		-0.2627640863322697
  	],
  	[
  		20.085223893416742,
  		-0.2418607439844004,
  		-0.26056665567376863
  	],
  	[
  		20.08737086610699,
  		-0.23840868634589862,
  		-0.259382798353659
  	],
  	[
  		20.08859119483352,
  		-0.2351995292819535,
  		-0.2614207051888393
  	],
  	[
  		20.086621202060503,
  		-0.2312030181012574,
  		-0.2628047271661575
  	],
  	[
  		20.08520380602458,
  		-0.22687162725740723,
  		-0.26089057173185853
  	],
  	[
  		20.08705991380264,
  		-0.22329655539029114,
  		-0.2592718937107205
  	],
  	[
  		20.08869511451342,
  		-0.22013371895828643,
  		-0.2609843597627413
  	],
  	[
  		20.08705543712513,
  		-0.21626438532177472,
  		-0.26276172045307783
  	],
  	[
  		20.085254083647463,
  		-0.21190139473594793,
  		-0.26122141500010654
  	],
  	[
  		20.08673090234296,
  		-0.20819457955785012,
  		-0.2592445623490817
  	],
  	[
  		20.08870549895214,
  		-0.20505020719514683,
  		-0.2605493420852351
  	],
  	[
  		20.08747427893837,
  		-0.2013134169012885,
  		-0.26263529315392414
  	],
  	[
  		20.08537602199597,
  		-0.1969478531120751,
  		-0.2615412024672593
  	],
  	[
  		20.08640351684566,
  		-0.19310698572400672,
  		-0.2593001877676728
  	],
  	[
  		20.08862408796675,
  		-0.18995200102404,
  		-0.2601345968439484
  	],
  	[
  		20.08785965656491,
  		-0.1863466822579266,
  		-0.2624291369939156
  	],
  	[
  		20.08556550898859,
  		-0.18200765967502752,
  		-0.2618321941891689
  	],
  	[
  		20.08609367649528,
  		-0.17803651604970902,
  		-0.2594333917714204
  	],
  	[
  		20.08845562795247,
  		-0.1748422225033597,
  		-0.25975515507085184
  	],
  	[
  		20.08819402753786,
  		-0.17136127373764842,
  		-0.2621498975220876
  	],
  	[
  		20.08581316816558,
  		-0.16707623777021963,
  		-0.2620760550323531
  	],
  	[
  		20.08581792587927,
  		-0.16298547323581822,
  		-0.25963464210106124
  	],
  	[
  		20.0882086236849,
  		-0.1597250163835714,
  		-0.2594275419268086
  	],
  	[
  		20.0884631767067,
  		-0.15635559218119452,
  		-0.2618084766360887
  	],
  	[
  		20.086109886449748,
  		-0.1521499200426675,
  		-0.2622606522196304
  	],
  	[
  		20.085590645083343,
  		-0.147955455682493,
  		-0.2598927487635647
  	],
  	[
  		20.087897162261143,
  		-0.1446052905977452,
  		-0.25916496082652823
  	],
  	[
  		20.0886552144293,
  		-0.14132906561034692,
  		-0.2614194746383603
  	],
  	[
  		20.08644071439964,
  		-0.1372237513258704,
  		-0.2623737033423932
  	],
  	[
  		20.08542320167367,
  		-0.1329468185155718,
  		-0.2601922444014882
  	],
  	[
  		20.08753405869722,
  		-0.1294871705044939,
  		-0.2589769393924035
  	],
  	[
  		20.08876093956922,
  		-0.1262816058297678,
  		-0.2609967648542783
  	],
  	[
  		20.08678952455083,
  		-0.1222930942141502,
  		-0.2624071189333192
  	],
  	[
  		20.08532258086797,
  		-0.1179585867961313,
  		-0.2605149988688355
  	],
  	[
  		20.08713662634534,
  		-0.1143752610747177,
  		-0.2588693992015987
  	],
  	[
  		20.088774142381787,
  		-0.1112143735604489,
  		-0.2605585257907691
  	],
  	[
  		20.087138608420737,
  		-0.10735355958474652,
  		-0.26235711075553414
  	],
  	[
  		20.085292898589124,
  		-0.1029893752985664,
  		-0.2608444493237811
  	],
  	[
  		20.08672249765524,
  		-0.09927394698179459,
  		-0.25884614493834185
  	],
  	[
  		20.08869347605284,
  		-0.09612966271063922,
  		-0.26012345015217553
  	],
  	[
  		20.087470117493467,
  		-0.09240128260310501,
  		-0.26222388165587673
  	],
  	[
  		20.08533404126275,
  		-0.08803649029382378,
  		-0.26116122649634754
  	],
  	[
  		20.08630986848203,
  		-0.08418691167107353,
  		-0.25890500312688863
  	],
  	[
  		20.08852095240782,
  		-0.0810302358327849,
  		-0.2597082802026646
  	],
  	[
  		20.08776696957858,
  		-0.07743303658721028,
  		-0.26201104291022
  	],
  	[
  		20.08544198994395,
  		-0.0730965693373972,
  		-0.2614473078577131
  	],
  	[
  		20.08591697098371,
  		-0.06911742722837066,
  		-0.259040773234176
  	],
  	[
  		20.08826191058695,
  		-0.06591965305431112,
  		-0.2593302974724491
  	],
  	[
  		20.08801230196489,
  		-0.062446103918667346,
  		-0.2617255498272699
  	],
  	[
  		20.08560810362905,
  		-0.05816551689240641,
  		-0.2616866843196887
  	],
  	[
  		20.085557976344468,
  		-0.05406733082151925,
  		-0.2592443130372086
  	],
  	[
  		20.087925244816162,
  		-0.05080197786769486,
  		-0.259004805950351
  	],
  	[
  		20.08819053635306,
  		-0.047438763528644644,
  		-0.26137954943765773
  	],
  	[
  		20.08582116018541,
  		-0.0432388704592477,
  		-0.26186476786839574
  	],
  	[
  		20.08524847704976,
  		-0.039038392980763045,
  		-0.2595037192246386
  	],
  	[
  		20.087523785847917,
  		-0.03568181823253638,
  		-0.258744794571368
  	],
  	[
  		20.08829168391955,
  		-0.03241060092630284,
  		-0.2609857622958202
  	],
  	[
  		20.086067952989758,
  		-0.02831238095539193,
  		-0.26197162723864714
  	],
  	[
  		20.08499914505051,
  		-0.02403078106791781,
  		-0.25980327728553737
  	],
  	[
  		20.08707311671602,
  		-0.02056397909131511,
  		-0.2585603481636542
  	],
  	[
  		20.08830567866299,
  		-0.01736168033529879,
  		-0.26056053567122567
  	],
  	[
  		20.08633162467314,
  		-0.01338114369011498,
  		-0.26199839358620775
  	],
  	[
  		20.08481680269171,
  		-0.00904365324098237,
  		-0.26012606565261404
  	],
  	[
  		20.0865876338062,
  		-0.005452334315973291,
  		-0.25845668713443265
  	],
  	[
  		20.088226671018372,
  		-0.0022930214794853,
  		-0.2601204476002774
  	],
  	[
  		20.08659350279727,
  		0.001559373146626455,
  		-0.26194175216696464
  	],
  	[
  		20.08470511770527,
  		0.005924742330260828,
  		-0.2604535688424338
  	],
  	[
  		20.08608708493218,
  		0.00964832648632519,
  		-0.2584372031553112
  	],
  	[
  		20.08805415301696,
  		0.01279283388533002,
  		-0.2596846410922638
  	],
  	[
  		20.0868380019026,
  		0.01651251550346278,
  		-0.26180207545081824
  	],
  	[
  		20.084664902205553,
  		0.02087665877454695,
  		-0.2607681244639279
  	],
  	[
  		20.08558977801078,
  		0.024734206136846088,
  		-0.258500341423286
  	],
  	[
  		20.08779000750739,
  		0.027893009549717438,
  		-0.259270878942037
  	],
  	[
  		20.08704622180561,
  		0.03148181144142936,
  		-0.2615836552187169
  	],
  	[
  		20.08469037921557,
  		0.035815884530277224,
  		-0.2610514123490456
  	],
  	[
  		20.085111775948768,
  		0.03980265174965629,
  		-0.2586398697015549
  	],
  	[
  		20.087439289031952,
  		0.04300424081801142,
  		-0.2588947545934827
  	],
  	[
  		20.08720127794707,
  		0.04647005162372168,
  		-0.2612929603680295
  	],
  	[
  		20.08477360396315,
  		0.050746563189895955,
  		-0.2612859604039082
  	],
  	[
  		20.084669859488493,
  		0.054851267094965454,
  		-0.2588465296496023
  	],
  	[
  		20.08701214966798,
  		0.058122107848362935,
  		-0.2585721325230259
  	],
  	[
  		20.0872901873929,
  		0.06147834721416818,
  		-0.2609423993233636
  	],
  	[
  		20.08490405432277,
  		0.06567261284037117,
  		-0.2614599806955292
  	],
  	[
  		20.08427836451778,
  		0.06987854781597168,
  		-0.2591084632536984
  	],
  	[
  		20.086521725000857,
  		0.07324181708103969,
  		-0.2583168411420628
  	],
  	[
  		20.087299868939617,
  		0.07650759805283096,
  		-0.2605460682706277
  	],
  	[
  		20.08506653912109,
  		0.08059898901092798,
  		-0.2615615589802769
  	],
  	[
  		20.08394695569308,
  		0.08488450935936454,
  		-0.2594102092106648
  	],
  	[
  		20.08598143635036,
  		0.08835935074931961,
  		-0.258136674583122
  	],
  	[
  		20.08722250826633,
  		0.09155751654035338,
  		-0.26011833972469195
  	],
  	[
  		20.08524482806446,
  		0.09553036020234697,
  		-0.2615825170573172
  	],
  	[
  		20.08368382341924,
  		0.09987001936162869,
  		-0.2597324724873687
  	],
  	[
  		20.08540960837584,
  		0.1034698328649027,
  		-0.2580378609029635
  	],
  	[
  		20.087052380948293,
  		0.106626867876859,
  		-0.2596771207746839
  	],
  	[
  		20.08542186584802,
  		0.1104708404339227,
  		-0.2615199722953204
  	],
  	[
  		20.08349198845889,
  		0.11483653245156711,
  		-0.26005986937276665
  	],
  	[
  		20.084823273573413,
  		0.118569068208363,
  		-0.25802374477092294
  	],
  	[
  		20.08678867044852,
  		0.1217130856983879,
  		-0.2592421827275701
  	],
  	[
  		20.08557864398864,
  		0.1254243938519636,
  		-0.2613752023720565
  	],
  	[
  		20.08337058838081,
  		0.12978698974108852,
  		-0.26037239636295373
  	],
  	[
  		20.08424085027983,
  		0.1336533837798465,
  		-0.258091699589192
  	],
  	[
  		20.08643300396628,
  		0.13681364703358231,
  		-0.2588291455660481
  	],
  	[
  		20.08569893192933,
  		0.140394222996892,
  		-0.2611506562937232
  	],
  	[
  		20.08331535891568,
  		0.1447248626182429,
  		-0.2606516426600266
  	],
  	[
  		20.083680375456133,
  		0.1487198063225986,
  		-0.25823469316466835
  	],
  	[
  		20.085992609316232,
  		0.1519246386133482,
  		-0.25845485660160133
  	],
  	[
  		20.085765784401527,
  		0.155382834003603,
  		-0.2608549338706082
  	],
  	[
  		20.083317486219528,
  		0.1596542186356635,
  		-0.2608820530141336
  	],
  	[
  		20.083156489743633,
  		0.16376619826121352,
  		-0.258444975142633
  	],
  	[
  		20.08547589170255,
  		0.1670419335741505,
  		-0.2581358242321809
  	],
  	[
  		20.08576424504788,
  		0.17039174290161752,
  		-0.26050066127912047
  	],
  	[
  		20.0833650684338,
  		0.17457946651791081,
  		-0.2610504884957365
  	],
  	[
  		20.082683368633802,
  		0.1787913040468897,
  		-0.2587091655191006
  	],
  	[
  		20.084896382340972,
  		0.18216100652149902,
  		-0.2578833383245384
  	],
  	[
  		20.08568392988839,
  		0.18542151007687202,
  		-0.2601001340626604
  	],
  	[
  		20.08344408244037,
  		0.189505272410661,
  		-0.26114530244638495
  	],
  	[
  		20.08227192704986,
  		0.193795033384494,
  		-0.25901060921345864
  	],
  	[
  		20.08426939526279,
  		0.19727718081227372,
  		-0.2577069832645354
  	],
  	[
  		20.08551582361829,
  		0.20047185445442128,
  		-0.25966960850243603
  	],
  	[
  		20.08353825142573,
  		0.20443616216235433,
  		-0.2611594404191399
  	],
  	[
  		20.081928324379618,
  		0.2087782612654293,
  		-0.259333184075044
  	],
  	[
  		20.0836106956641,
  		0.21238626969760782,
  		-0.2576120590615512
  	],
  	[
  		20.085254703303427,
  		0.21554136710374572,
  		-0.25922744672171233
  	],
  	[
  		20.083628323299113,
  		0.2193767118398272,
  		-0.261090139823339
  	],
  	[
  		20.08165594011905,
  		0.2237428422922236,
  		-0.2596580369427701
  	],
  	[
  		20.08293896203865,
  		0.2274837441840487,
  		-0.2576017138268004
  	],
  	[
  		20.084899596039293,
  		0.23062783745798662,
  		-0.258791106731139
  	],
  	[
  		20.0836984504476,
  		0.2343303081564431,
  		-0.26093788007339475
  	],
  	[
  		20.08145372642931,
  		0.2386915044438403,
  		-0.2599670216065422
  	],
  	[
  		20.08227255678646,
  		0.24256607888434434,
  		-0.257672369725967
  	],
  	[
  		20.084453539006702,
  		0.2457280657971583,
  		-0.2583788785383979
  	],
  	[
  		20.08372998127644,
  		0.2493004183869244,
  		-0.2607070081397073
  	],
  	[
  		20.08131719511216,
  		0.253627709807757,
  		-0.26024212549847153
  	],
  	[
  		20.08162806828683,
  		0.25763037007733475,
  		-0.25781873155210405
  	],
  	[
  		20.08392223364345,
  		0.2608386813916542,
  		-0.2580060538153563
  	],
  	[
  		20.083706966237436,
  		0.26428940800001083,
  		-0.2604055266590101
  	],
  	[
  		20.081236554505438,
  		0.26855586089477684,
  		-0.26046687241463545
  	],
  	[
  		20.081021317930738,
  		0.27267456785881844,
  		-0.25803052610875493
  	],
  	[
  		20.08331559227909,
  		0.2759552511676966,
  		-0.2576889438876684
  	],
  	[
  		20.083615106753832,
  		0.27929867773582984,
  		-0.2600458284649401
  	],
  	[
  		20.08120097820666,
  		0.2834799796095997,
  		-0.26062920548806734
  	],
  	[
  		20.08046602643073,
  		0.28769731056244,
  		-0.25829583276802554
  	],
  	[
  		20.08264702232111,
  		0.2910731236160697,
  		-0.25743993136945037
  	],
  	[
  		20.083443118601913,
  		0.2943287609588245,
  		-0.2596418150119439
  	],
  	[
  		20.08119550965974,
  		0.29840489029384554,
  		-0.260717788635201
  	],
  	[
  		20.079972033850968,
  		0.3026987380577971,
  		-0.2585980167138237
  	],
  	[
  		20.08193122062849,
  		0.3061880101158788,
  		-0.257266740588863
  	],
  	[
  		20.083183067020038,
  		0.3093793031798494,
  		-0.2592085222551584
  	],
  	[
  		20.08120353644781,
  		0.3133352862404966,
  		-0.260724844858903
  	],
  	[
  		20.07954691875891,
  		0.31767966849465434,
  		-0.25891907393193264
  	],
  	[
  		20.081185134583,
  		0.3212953020661762,
  		-0.257175813598246
  	],
  	[
  		20.08282974165082,
  		0.3244488693852554,
  		-0.2587644607159366
  	],
  	[
  		20.08120739726044,
  		0.32827516860754113,
  		-0.26064924391433925
  	],
  	[
  		20.079192376892728,
  		0.3326419325218846,
  		-0.2592429961943861
  	],
  	[
  		20.08042703387025,
  		0.33639066214747254,
  		-0.2571695764111432
  	],
  	[
  		20.08238233415902,
  		0.3395349460487436,
  		-0.25832902472687824
  	],
  	[
  		20.081188774417843,
  		0.3432285530198643,
  		-0.26049082048910494
  	],
  	[
  		20.078908187563293,
  		0.347588381822496,
  		-0.2595494155474747
  	],
  	[
  		20.079674607707553,
  		0.35147072384823685,
  		-0.2572443306474646
  	],
  	[
  		20.0818439652536,
  		0.354634807851109,
  		-0.25791690972143
  	],
  	[
  		20.081131439421558,
  		0.3581983696790419,
  		-0.2602539400827486
  	],
  	[
  		20.0786889482894,
  		0.3625226492876507,
  		-0.2598205055556505
  	],
  	[
  		20.07894641085423,
  		0.36653229305124563,
  		-0.25739376997521685
  	],
  	[
  		20.08122145976525,
  		0.36974438444504243,
  		-0.2575466826783923
  	],
  	[
  		20.08101850930339,
  		0.37318705399187924,
  		-0.259947574115646
  	],
  	[
  		20.078525885029567,
  		0.3774486353003376,
  		-0.2600418093745026
  	],
  	[
  		20.07825606415224,
  		0.381573529587631,
  		-0.2576095621807906
  	],
  	[
  		20.080523945719293,
  		0.3848596070184088,
  		-0.2572332513382824
  	],
  	[
  		20.080835438033052,
  		0.38819602240638607,
  		-0.25958437363116843
  	],
  	[
  		20.07840602165389,
  		0.3923711153528192,
  		-0.2601992022363009
  	],
  	[
  		20.077618097919657,
  		0.39659330567076534,
  		-0.25787681934863377
  	],
  	[
  		20.07976525802398,
  		0.3999759029552079,
  		-0.2569877401286603
  	],
  	[
  		20.08057214460144,
  		0.4032257914213691,
  		-0.25917645848974863
  	],
  	[
  		20.07831625102732,
  		0.4072944389628633,
  		-0.2602818497247303
  	],
  	[
  		20.0770430458704,
  		0.4115914532175066,
  		-0.25818000560003534
  	],
  	[
  		20.07896150150174,
  		0.4150884557849902,
  		-0.2568194434010415
  	],
  	[
  		20.08022089964662,
  		0.41827558438884344,
  		-0.2587415540089042
  	],
  	[
  		20.078239318054962,
  		0.4222231632441606,
  		-0.2602839401444029
  	],
  	[
  		20.0765366585751,
  		0.4265690473298701,
  		-0.2585021309276063
  	],
  	[
  		20.07812815179375,
  		0.4301930923593261,
  		-0.2567339566046269
  	],
  	[
  		20.07977535710079,
  		0.4333443440165099,
  		-0.2582972311290188
  	],
  	[
  		20.07815591130228,
  		0.43716194018358734,
  		-0.2602022437925145
  	],
  	[
  		20.07610106340892,
  		0.4415281936803053,
  		-0.2588245052016994
  	],
  	[
  		20.07728372525056,
  		0.44528560679299867,
  		-0.2567323645872132
  	],
  	[
  		20.079236510025538,
  		0.4484294255899764,
  		-0.2578609706705617
  	],
  	[
  		20.07805043089911,
  		0.45211401984772603,
  		-0.2600378229942483
  	],
  	[
  		20.07573617351694,
  		0.4564715152136848,
  		-0.25912819939432713
  	],
  	[
  		20.076448022260053,
  		0.4603620767923374,
  		-0.2568116420212747
  	],
  	[
  		20.078607574095102,
  		0.4635275818603529,
  		-0.2574510945488514
  	],
  	[
  		20.077905041548682,
  		0.46708260752719033,
  		-0.25979559594870877
  	],
  	[
  		20.075436195102952,
  		0.4714025861067974,
  		-0.2593964293281306
  	],
  	[
  		20.075636067070878,
  		0.475420049208073,
  		-0.25696570593129564
  	],
  	[
  		20.077894391698372,
  		0.4786353929519269,
  		-0.2570830210778337
  	],
  	[
  		20.07770229763903,
  		0.48207024852944724,
  		-0.2594846390576717
  	],
  	[
  		20.07519024915084,
  		0.4863261218571082,
  		-0.25961219541579367
  	],
  	[
  		20.074863772686808,
  		0.49045750994805487,
  		-0.2571839036364381
  	],
  	[
  		20.077107080103662,
  		0.4937484723539166,
  		-0.25677244278870054
  	],
  	[
  		20.07742958279607,
  		0.49707812456821077,
  		-0.25911631412067504
  	],
  	[
  		20.074988478321842,
  		0.5012458849397613,
  		-0.2597638276276679
  	],
  	[
  		20.07414498577464,
  		0.5054732646048552,
  		-0.2574529466180875
  	],
  	[
  		20.076260859188242,
  		0.5088619238650008,
  		-0.2565306703714809
  	],
  	[
  		20.07707604876286,
  		0.5121065071072639,
  		-0.2587057301476685
  	],
  	[
  		20.074814899649297,
  		0.5161668961032193,
  		-0.259840186485152
  	],
  	[
  		20.07348917954136,
  		0.5204674192663145,
  		-0.25775701069045137
  	],
  	[
  		20.075368919924223,
  		0.5239716483866137,
  		-0.25636642615116323
  	],
  	[
  		20.07663326731997,
  		0.5271551134622241,
  		-0.2582681923620093
  	],
  	[
  		20.07465228753176,
  		0.5310937643507179,
  		-0.2598350907895243
  	],
  	[
  		20.07290201917748,
  		0.5354412759398911,
  		-0.2580776563197223
  	],
  	[
  		20.074449216029578,
  		0.5390730652203496,
  		-0.2562844114369582
  	],
  	[
  		20.07609681498805,
  		0.5422223409183247,
  		-0.2578222196117221
  	],
  	[
  		20.07448320253593,
  		0.5460306128802357,
  		-0.25974622120977003
  	],
  	[
  		20.07238627430826,
  		0.5503965836073728,
  		-0.2583977952867299
  	],
  	[
  		20.0735201889994,
  		0.5541618678209904,
  		-0.25628657134599603
  	],
  	[
  		20.07546691621429,
  		0.5573055848372066,
  		-0.257386249716131
  	],
  	[
  		20.07428992799995,
  		0.5609811064949758,
  		-0.25957500281572304
  	],
  	[
  		20.07194033005247,
  		0.5653363392543108,
  		-0.2586982254397785
  	],
  	[
  		20.072599255447948,
  		0.5692347636972631,
  		-0.2563691204117718
  	],
  	[
  		20.07474680232066,
  		0.5724018703454307,
  		-0.2569766127959556
  	],
  	[
  		20.07405525277283,
  		0.5759482928405012,
  		-0.2593265169312015
  	],
  	[
  		20.07155832510742,
  		0.5802642700182523,
  		-0.2589611698716837
  	],
  	[
  		20.07170436446394,
  		0.5842887239857224,
  		-0.256525517615509
  	],
  	[
  		20.073943025778853,
  		0.5875074124919886,
  		-0.2566102645020266
  	],
  	[
  		20.07376306299514,
  		0.5909344854581429,
  		-0.2590094271035076
  	],
  	[
  		20.07123041344036,
  		0.5951845427244775,
  		-0.2591719837066203
  	],
  	[
  		20.07084900072344,
  		0.5993222045312422,
  		-0.2567455697109092
  	],
  	[
  		20.07306622628665,
  		0.6026178121446489,
  		-0.2563021646186671
  	],
  	[
  		20.07339890410632,
  		0.6059409948245085,
  		-0.2586370587114046
  	],
  	[
  		20.07094451925072,
  		0.6101016702808372,
  		-0.2593170525222063
  	],
  	[
  		20.070047906827632,
  		0.6143338320714609,
  		-0.2570158347162038
  	],
  	[
  		20.07213005957854,
  		0.6177285575247436,
  		-0.2560632868225951
  	],
  	[
  		20.07295400330897,
  		0.6209679484514247,
  		-0.258222266372709
  	],
  	[
  		20.07068624610956,
  		0.6250200836457352,
  		-0.2593869883639263
  	],
  	[
  		20.069310280855788,
  		0.6293239209640522,
  		-0.2573194222866319
  	],
  	[
  		20.07115068693733,
  		0.6328348658112464,
  		-0.25590262150433574
  	],
  	[
  		20.07241926582019,
  		0.6360149161546065,
  		-0.25778248348905314
  	],
  	[
  		20.07043798301406,
  		0.6399445316373622,
  		-0.2593752209127662
  	],
  	[
  		20.06864134349263,
  		0.6442936149472229,
  		-0.2576397446974407
  	],
  	[
  		20.07014321959799,
  		0.6479327971254476,
  		-0.25582472315710303
  	],
  	[
  		20.071790314080392,
  		0.6510803943080022,
  		-0.25733545029097343
  	],
  	[
  		20.070181054217,
  		0.654879335692834,
  		-0.2592799497158378
  	],
  	[
  		20.06804344894942,
  		0.6592450155314631,
  		-0.2579578268872145
  	],
  	[
  		20.06912792293938,
  		0.6630177667251669,
  		-0.2558306785465854
  	],
  	[
  		20.07106845040457,
  		0.6661616162218654,
  		-0.2568990641700282
  	],
  	[
  		20.069900102419908,
  		0.6698276861417369,
  		-0.25910230252900923
  	],
  	[
  		20.06751591666388,
  		0.6741808057690708,
  		-0.2582552486409779
  	],
  	[
  		20.06812278203609,
  		0.678086282854918,
  		-0.2559172267225939
  	],
  	[
  		20.070256745760624,
  		0.681255448840548,
  		-0.2564910577619172
  	],
  	[
  		20.06957642223285,
  		0.684792807992026,
  		-0.2588484408892876
  	],
  	[
  		20.06705124129086,
  		0.6891049255169761,
  		-0.25851531578862763
  	],
  	[
  		20.067143151206103,
  		0.693135943042706,
  		-0.2560774353070897
  	],
  	[
  		20.069361489523317,
  		0.6963583125379852,
  		-0.2561273381490156
  	],
  	[
  		20.06919338931928,
  		0.6997771760830784,
  		-0.25852669713667253
  	],
  	[
  		20.066640034850632,
  		0.7040217529501351,
  		-0.2587211366439239
  	],
  	[
  		20.066205091398437,
  		0.7081647414741121,
  		-0.25630036160803343
  	],
  	[
  		20.06839434687281,
  		0.711465672784481,
  		-0.25582221151454093
  	],
  	[
  		20.06873957253692,
  		0.7147815228905265,
  		-0.25814976692615604
  	],
  	[
  		20.06627106517044,
  		0.718935275026498,
  		-0.2588615522136902
  	],
  	[
  		20.06532240392692,
  		0.7231715234572171,
  		-0.25657247011395795
  	],
  	[
  		20.06736976281287,
  		0.7265726239227566,
  		-0.25558824900493765
  	],
  	[
  		20.06820315189913,
  		0.7298063260251645,
  		-0.2577328045164737
  	],
  	[
  		20.06592829810781,
  		0.7338504080777982,
  		-0.25892626004948255
  	],
  	[
  		20.064502964395132,
  		0.7381567106560962,
  		-0.2568781873014525
  	],
  	[
  		20.06630137476656,
  		0.7416752175625181,
  		-0.25543239721028804
  	],
  	[
  		20.06757684435017,
  		0.7448510342085184,
  		-0.2572912424749172
  	],
  	[
  		20.06559407174477,
  		0.7487719159735379,
  		-0.2589086515485603
  	],
  	[
  		20.063753160884307,
  		0.7531216699224079,
  		-0.2571974603644459
  	],
  	[
  		20.06520787565785,
  		0.7567687274288826,
  		-0.25535922760548424
  	],
  	[
  		20.06685672087016,
  		0.7599139952448896,
  		-0.256843177466184
  	],
  	[
  		20.06525186126096,
  		0.7637036111640061,
  		-0.2588071978125815
  	],
  	[
  		20.06307520399147,
  		0.768068067227151,
  		-0.2575146704724447
  	],
  	[
  		20.06410758366038,
  		0.7718489081460453,
  		-0.2553704258378169
  	],
  	[
  		20.066044019539827,
  		0.7749922154034737,
  		-0.25640822558548465
  	],
  	[
  		20.06488318950848,
  		0.7786491357762229,
  		-0.2586246601670935
  	],
  	[
  		20.06246661109499,
  		0.7829991782672696,
  		-0.2578099502315623
  	],
  	[
  		20.06301788193543,
  		0.7869125210421504,
  		-0.2554618524782521
  	],
  	[
  		20.065141027135,
  		0.7900830758973254,
  		-0.2560016473994697
  	],
  	[
  		20.06447097778944,
  		0.793611670540726,
  		-0.2583649764702008
  	],
  	[
  		20.06192078916948,
  		0.7979189191381093,
  		-0.2580653506228912
  	],
  	[
  		20.06195597216207,
  		0.8019569618922819,
  		-0.2556251321920293
  	],
  	[
  		20.06415619241573,
  		0.8051824535132527,
  		-0.2556398849636387
  	],
  	[
  		20.063999483839503,
  		0.8085932470765137,
  		-0.2580382868607409
  	],
  	[
  		20.06142831242932,
  		0.8128313231452309,
  		-0.2582665443821001
  	],
  	[
  		20.06093655931987,
  		0.8169802646542769,
  		-0.255851187989998
  	],
  	[
  		20.06310025945924,
  		0.8202858037103872,
  		-0.25533878317622477
  	],
  	[
  		20.063455282062954,
  		0.8235949184549567,
  		-0.2576581508280804
  	],
  	[
  		20.06097649673434,
  		0.8277408481190914,
  		-0.2584012799029443
  	],
  	[
  		20.059972621606228,
  		0.8319816196057568,
  		-0.2561253147305775
  	],
  	[
  		20.06198690315763,
  		0.8353888109887985,
  		-0.2551078918588106
  	],
  	[
  		20.06282856441324,
  		0.8386170284078189,
  		-0.25723752584646314
  	],
  	[
  		20.060549498478323,
  		0.842652409798645,
  		-0.25845898967991804
  	],
  	[
  		20.05907314545237,
  		0.8469614664528362,
  		-0.2564300864717691
  	],
  	[
  		20.060832046296923,
  		0.8504868038328797,
  		-0.2549558119599964
  	],
  	[
  		20.062111426043103,
  		0.8536589397840738,
  		-0.256793501324474
  	],
  	[
  		20.060130933624627,
  		0.8575703046135978,
  		-0.2584344660191786
  	],
  	[
  		20.0582432013015,
  		0.861920954586687,
  		-0.2567491380301024
  	],
  	[
  		20.05965254580419,
  		0.8655755374800379,
  		-0.25488655799656923
  	],
  	[
  		20.06130062047955,
  		0.868718724514862,
  		-0.2563450883863586
  	],
  	[
  		20.05970154812963,
  		0.8724989063580427,
  		-0.2583264252612827
  	],
  	[
  		20.05748478907007,
  		0.8768622664109691,
  		-0.2570634422608054
  	],
  	[
  		20.0584671926242,
  		0.8806507120409421,
  		-0.254901456875325
  	],
  	[
  		20.06039653559615,
  		0.8837939629356214,
  		-0.25590911332413707
  	],
  	[
  		20.059245530877398,
  		0.8874414182890844,
  		-0.25813662374452523
  	],
  	[
  		20.056795104716947,
  		0.891788546659997,
  		-0.2573546230553414
  	],
  	[
  		20.057293931376222,
  		0.8957091112245043,
  		-0.2549953681091714
  	],
  	[
  		20.05940339255089,
  		0.898881234731828,
  		-0.25550360210120104
  	],
  	[
  		20.058744463636707,
  		0.9024010630613928,
  		-0.2578708189014715
  	],
  	[
  		20.05616801587437,
  		0.9067034870601118,
  		-0.257605623215298
  	],
  	[
  		20.0561487498547,
  		0.9107481451877553,
  		-0.2551616946509281
  	],
  	[
  		20.05832821144825,
  		0.9139768962445132,
  		-0.25514375326113903
  	],
  	[
  		20.05818283397722,
  		0.9173798687376534,
  		-0.2575387800286093
  	],
  	[
  		20.055592506882142,
  		0.9216116340026521,
  		-0.25780087822612374
  	],
  	[
  		20.05504674938372,
  		0.9257660768778693,
  		-0.2553890578403874
  	],
  	[
  		20.05718262205743,
  		0.9290763015246809,
  		-0.2548447174275607
  	],
  	[
  		20.057548109055258,
  		0.9323787505348524,
  		-0.2571536277296749
  	],
  	[
  		20.05505713349867,
  		0.9365170119457327,
  		-0.2579292961493307
  	],
  	[
  		20.05400110444285,
  		0.940761900631939,
  		-0.2556638332081013
  	],
  	[
  		20.055980939538717,
  		0.9441747848107215,
  		-0.2546175501342269
  	],
  	[
  		20.05682988418808,
  		0.9473979760601374,
  		-0.2567298003376066
  	],
  	[
  		20.0545456325999,
  		0.9514245669079632,
  		-0.2579807343550449
  	],
  	[
  		20.05301941990708,
  		0.955736294201143,
  		-0.2559690445368039
  	],
  	[
  		20.05473792919254,
  		0.9592682073232531,
  		-0.2544688032710012
  	],
  	[
  		20.05602081332329,
  		0.9624368909455587,
  		-0.2562835886023003
  	],
  	[
  		20.054040406429067,
  		0.9663389722443967,
  		-0.2579491369576296
  	],
  	[
  		20.05210802564053,
  		0.9706904085526118,
  		-0.2562862749225148
  	],
  	[
  		20.05347150716361,
  		0.9743519316728344,
  		-0.2544036119683233
  	],
  	[
  		20.05511804129295,
  		0.9774935256385575,
  		-0.25583365648367445
  	],
  	[
  		20.0535247135317,
  		0.9812638252082357,
  		-0.257834844797508
  	],
  	[
  		20.051267773952407,
  		0.9856263055327091,
  		-0.2565991816858205
  	],
  	[
  		20.05220080425471,
  		0.9894216879227582,
  		-0.25442255733318947
  	],
  	[
  		20.05412220568045,
  		0.9925650946008976,
  		-0.25539907959891134
  	],
  	[
  		20.05298002679551,
  		0.9962029989938558,
  		-0.257639056361313
  	],
  	[
  		20.050496199825282,
  		1.000547304306627,
  		-0.2568875734591289
  	],
  	[
  		20.05094200941068,
  		1.004474628766613,
  		-0.254520572347244
  	],
  	[
  		20.053037027073607,
  		1.00764877449514,
  		-0.25499433039944913
  	],
  	[
  		20.052389634432227,
  		1.011159323973895,
  		-0.25736763727452133
  	],
  	[
  		20.04978624274689,
  		1.015457316205629,
  		-0.2571342467663544
  	],
  	[
  		20.049713525517753,
  		1.019507809211855,
  		-0.2546898056450179
  	],
  	[
  		20.051871210770358,
  		1.022740168346533,
  		-0.254637374698073
  	],
  	[
  		20.05173833133217,
  		1.026134683838335,
  		-0.2570309028647277
  	],
  	[
  		20.04912854187884,
  		1.030360238642754,
  		-0.25732569823551493
  	],
  	[
  		20.04852888085601,
  		1.034519573386642,
  		-0.2549207433009567
  	],
  	[
  		20.050635619178408,
  		1.037834916238241,
  		-0.2543424878707543
  	],
  	[
  		20.05101255349674,
  		1.04113011180554,
  		-0.2566427215907245
  	],
  	[
  		20.048508883612893,
  		1.045260928467779,
  		-0.2574491732941309
  	],
  	[
  		20.047400807733162,
  		1.049509339833481,
  		-0.2551973952124632
  	],
  	[
  		20.049344195856822,
  		1.052928641687566,
  		-0.2541192115915673
  	],
  	[
  		20.05020281439817,
  		1.056145927148773,
  		-0.2562157088676563
  	],
  	[
  		20.04791267818861,
  		1.06016396542312,
  		-0.2574945251504898
  	],
  	[
  		20.0463384285772,
  		1.064477413511987,
  		-0.25550304953908837
  	],
  	[
  		20.04801392246707,
  		1.068016545121584,
  		-0.2539753448080562
  	],
  	[
  		20.04930290820316,
  		1.071180955518917,
  		-0.2557680640366047
  	],
  	[
  		20.04732271441915,
  		1.075073641652355,
  		-0.257457794574161
  	],
  	[
  		20.04534634174329,
  		1.079425120253611,
  		-0.2558207285009583
  	],
  	[
  		20.04666123910575,
  		1.083094358457283,
  		-0.25391564804288763
  	],
  	[
  		20.04830827882598,
  		1.086233579828719,
  		-0.2553185758599436
  	],
  	[
  		20.04671955444887,
  		1.089994366721515,
  		-0.2573376990506927
  	],
  	[
  		20.04442517518774,
  		1.094354862036359,
  		-0.2561319663998655
  	],
  	[
  		20.04530459900372,
  		1.098158143682099,
  		-0.2539393643360643
  	],
  	[
  		20.04722111222282,
  		1.101301034505739,
  		-0.25488370625620077
  	],
  	[
  		20.0460876072553,
  		1.104929283644114,
  		-0.2571360548076923
  	],
  	[
  		20.04357287367093,
  		1.1092698138784,
  		-0.2564169486016528
  	],
  	[
  		20.043963303521952,
  		1.113204376308835,
  		-0.254041381347164
  	],
  	[
  		20.04604583926895,
  		1.116379885553036,
  		-0.25448120581456907
  	],
  	[
  		20.04540921296281,
  		1.119881356236207,
  		-0.25685924462326065
  	],
  	[
  		20.042782352181252,
  		1.12417364552022,
  		-0.25666023975868074
  	],
  	[
  		20.04265190579124,
  		1.128230801259636,
  		-0.2542149237937327
  	],
  	[
  		20.0447899713674,
  		1.1314662856392,
  		-0.2541269374053587
  	],
  	[
  		20.04466790308889,
  		1.134852609807252,
  		-0.2565185472197647
  	],
  	[
  		20.04204161672604,
  		1.139071132028587,
  		-0.2568461551466881
  	],
  	[
  		20.041385683892333,
  		1.143235706908741,
  		-0.2544481417402628
  	],
  	[
  		20.04346498417449,
  		1.146555750191299,
  		-0.25383513842701294
  	],
  	[
  		20.043852303496557,
  		1.149843928878397,
  		-0.256125494242397
  	],
  	[
  		20.041339669921967,
  		1.15396623752167,
  		-0.2569633593448574
  	],
  	[
  		20.04017728779402,
  		1.158218441311394,
  		-0.2547257127830994
  	],
  	[
  		20.04208663340384,
  		1.161643498632048,
  		-0.2536154401513823
  	],
  	[
  		20.04295246114831,
  		1.164855305806011,
  		-0.2556958017705596
  	],
  	[
  		20.04065951567477,
  		1.168863999006105,
  		-0.25700220171936644
  	],
  	[
  		20.0390345341491,
  		1.173179465387255,
  		-0.255031871461143
  	],
  	[
  		20.04066896919221,
  		1.176725342667118,
  		-0.2534758522501306
  	],
  	[
  		20.04196113557187,
  		1.179885983190997,
  		-0.2552463221963135
  	],
  	[
  		20.03998348511264,
  		1.183768852628803,
  		-0.2569584389456507
  	],
  	[
  		20.03796183794126,
  		1.1881204039881,
  		-0.2553478054101162
  	],
  	[
  		20.03923044399801,
  		1.191796788329104,
  		-0.2534196455675546
  	],
  	[
  		20.04087576125476,
  		1.194933983211933,
  		-0.25479533437738894
  	],
  	[
  		20.039294297265542,
  		1.198684703400805,
  		-0.25683106478678147
  	],
  	[
  		20.03696050816341,
  		1.203043390068732,
  		-0.2556559525903234
  	],
  	[
  		20.03778989991535,
  		1.206853716608181,
  		-0.2534467736750419
  	],
  	[
  		20.039697850695994,
  		1.209996457311406,
  		-0.2543610014699552
  	],
  	[
  		20.038574424862993,
  		1.213615011396522,
  		-0.2566226846849504
  	],
  	[
  		20.036027225613967,
  		1.217951745269603,
  		-0.2559374566821098
  	],
  	[
  		20.036363901081682,
  		1.221893211483705,
  		-0.253552076384366
  	],
  	[
  		20.03843188285769,
  		1.225070195039558,
  		-0.25395937915283423
  	],
  	[
  		20.0378065142295,
  		1.228562622112483,
  		-0.25634005316627523
  	],
  	[
  		20.03515452336562,
  		1.232849467176774,
  		-0.2561751087196805
  	],
  	[
  		20.03497001807625,
  		1.236912508028747,
  		-0.2537276864557557
  	],
  	[
  		20.03708576090495,
  		1.24015116832223,
  		-0.2536070268125943
  	],
  	[
  		20.03697568807096,
  		1.243529368172586,
  		-0.2559933382826548
  	],
  	[
  		20.03433158778687,
  		1.247740743535775,
  		-0.2563556261134643
  	],
  	[
  		20.03362120908054,
  		1.251910323539798,
  		-0.2539623429693577
  	],
  	[
  		20.035671857445728,
  		1.255234712162614,
  		-0.2533180811824096
  	],
  	[
  		20.036068651321706,
  		1.258516185457922,
  		-0.25559673182164805
  	],
  	[
  		20.0335455008654,
  		1.2626301493386,
  		-0.2564662713037671
  	],
  	[
  		20.032330809080538,
  		1.266885813203962,
  		-0.2542410030657428
  	],
  	[
  		20.034204135065238,
  		1.270316509989791,
  		-0.2531016122466746
  	],
  	[
  		20.03507740632033,
  		1.27352299097371,
  		-0.2551633762316898
  	],
  	[
  		20.032780344058022,
  		1.277522329558671,
  		-0.2564985005285603
  	],
  	[
  		20.03110649286667,
  		1.28183970837073,
  		-0.2545461586650793
  	],
  	[
  		20.03269941500658,
  		1.285391771924529,
  		-0.2529656066087491
  	],
  	[
  		20.03399424352773,
  		1.288548876797033,
  		-0.2547119517075913
  	],
  	[
  		20.032018516873087,
  		1.292421705573115,
  		-0.2564480787299008
  	],
  	[
  		20.029952293688396,
  		1.296773382421772,
  		-0.25486142265393114
  	],
  	[
  		20.03117389475845,
  		1.300456438684564,
  		-0.2529137521104666
  	],
  	[
  		20.03281658603119,
  		1.303591871114853,
  		-0.2542607250930407
  	],
  	[
  		20.031241407476248,
  		1.307332399168443,
  		-0.2563145338929514
  	],
  	[
  		20.02886900684114,
  		1.311689335618307,
  		-0.2551673929988794
  	],
  	[
  		20.02964752960244,
  		1.315506338628315,
  		-0.25294463257313077
  	],
  	[
  		20.03154689102251,
  		1.318649124422431,
  		-0.2538263605549462
  	],
  	[
  		20.03043342241793,
  		1.322257541552426,
  		-0.25609978943201833
  	],
  	[
  		20.02785409203273,
  		1.326590718940492,
  		-0.25544520082696404
  	],
  	[
  		20.028137889406523,
  		1.330538254170192,
  		-0.2530536582574003
  	],
  	[
  		20.030189635611762,
  		1.333717190995787,
  		-0.2534266218287685
  	],
  	[
  		20.029576478626183,
  		1.337199939145993,
  		-0.2558120354659868
  	],
  	[
  		20.02689896251065,
  		1.341481466382623,
  		-0.2556798892642736
  	],
  	[
  		20.02666005591092,
  		1.345549958117253,
  		-0.253233044388699
  	],
  	[
  		20.02875271683694,
  		1.348792109467024,
  		-0.25307761870264417
  	],
  	[
  		20.0286546665084,
  		1.352161683690954,
  		-0.2554612301081765
  	],
  	[
  		20.025992693330743,
  		1.356366191963048,
  		-0.2558552797501458
  	],
  	[
  		20.025228977521618,
  		1.360539901171289,
  		-0.2534703043308746
  	],
  	[
  		20.02724874724834,
  		1.36386940430271,
  		-0.252791733387296
  	],
  	[
  		20.027657736802162,
  		1.36714322943737,
  		-0.2550602142753953
  	],
  	[
  		20.0251232036275,
  		1.371248995388212,
  		-0.2559607437179159
  	],
  	[
  		20.023857545509813,
  		1.375507364843752,
  		-0.2537501899294115
  	],
  	[
  		20.02569335975771,
  		1.378944085277545,
  		-0.2525802734415005
  	],
  	[
  		20.02657523473211,
  		1.382144630847355,
  		-0.2546250390751656
  	],
  	[
  		20.02427372230089,
  		1.386134709817068,
  		-0.2559877373896939
  	],
  	[
  		20.02255212610685,
  		1.39045308126554,
  		-0.2540572615745432
  	],
  	[
  		20.024100644044253,
  		1.394012203780912,
  		-0.2524494621693799
  	],
  	[
  		20.025400694470072,
  		1.397164967325002,
  		-0.2541725056585549
  	],
  	[
  		20.02342562802145,
  		1.401028049565182,
  		-0.2559315179251969
  	],
  	[
  		20.021317220746184,
  		1.405378886384392,
  		-0.2543710546449045
  	],
  	[
  		20.02248955501093,
  		1.409069199509948,
  		-0.2524022611239904
  	],
  	[
  		20.02413197918035,
  		1.412202239239784,
  		-0.25372039556664083
  	],
  	[
  		20.02256290339957,
  		1.41593257072295,
  		-0.25579161649445814
  	],
  	[
  		20.02015417948597,
  		1.420286716653413,
  		-0.25467536554531794
  	],
  	[
  		20.020879272512204,
  		1.424110941429212,
  		-0.25243817623876813
  	],
  	[
  		20.02277213329446,
  		1.42725313025538,
  		-0.2532878051199536
  	],
  	[
  		20.02166753214624,
  		1.430851642066261,
  		-0.2555720397651776
  	],
  	[
  		20.019058636851618,
  		1.435180201381774,
  		-0.25495074042495924
  	],
  	[
  		20.01928607250835,
  		1.439134579766682,
  		-0.25255200052640964
  	],
  	[
  		20.02132420735045,
  		1.442314835000033,
  		-0.25289012778479497
  	],
  	[
  		20.02072179466083,
  		1.445788289231021,
  		-0.2552788487783127
  	],
  	[
  		20.018022133055368,
  		1.450063515970335,
  		-0.2551803006153338
  	],
  	[
  		20.01772638626768,
  		1.454137835323849,
  		-0.252734224542934
  	],
  	[
  		20.01979807321907,
  		1.457382991839323,
  		-0.25254328165882395
  	],
  	[
  		20.019711555433627,
  		1.46074405410862,
  		-0.25492318876810083
  	],
  	[
  		20.017034632917003,
  		1.464940713126813,
  		-0.2553505482908562
  	],
  	[
  		20.01621490641225,
  		1.469118998202483,
  		-0.2529739517610006
  	],
  	[
  		20.01820645703564,
  		1.472452822697998,
  		-0.25226167864153004
  	],
  	[
  		20.018624705889117,
  		1.475719622694909,
  		-0.2545191999035164
  	],
  	[
  		20.016082598954277,
  		1.479816317773276,
  		-0.2554501053503156
  	],
  	[
  		20.01476287188417,
  		1.484077771737345,
  		-0.25325552610389973
  	],
  	[
  		20.01656300926045,
  		1.487520194935279,
  		-0.2520535958956687
  	],
  	[
  		20.017451966277058,
  		1.490715066826757,
  		-0.2540809791125493
  	],
  	[
  		20.01514848357917,
  		1.494695393781936,
  		-0.2554700333878
  	],
  	[
  		20.01337766833164,
  		1.499014994640825,
  		-0.25356118052301924
  	],
  	[
  		20.01488441457404,
  		1.502580410367649,
  		-0.25192663669809023
  	],
  	[
  		20.01618687729148,
  		1.505729335080781,
  		-0.25362633887074904
  	],
  	[
  		20.01421617771804,
  		1.509581956305814,
  		-0.25540674132520874
  	],
  	[
  		20.0120632045998,
  		1.513932141934121,
  		-0.25387405182015893
  	],
  	[
  		20.01318854760212,
  		1.517629228994785,
  		-0.2518832004477179
  	],
  	[
  		20.01482812867517,
  		1.520760072829908,
  		-0.2531743420108315
  	],
  	[
  		20.01326645881293,
  		1.524480185369406,
  		-0.25526032243117014
  	],
  	[
  		20.010820059350717,
  		1.528831710598118,
  		-0.2541751143513629
  	],
  	[
  		20.01149381687975,
  		1.532662691675024,
  		-0.251922778832758
  	],
  	[
  		20.01337729950113,
  		1.535804674200731,
  		-0.2527412991165547
  	],
  	[
  		20.0122834526381,
  		1.539393121579665,
  		-0.25503382520920675
  	],
  	[
  		20.00964355852821,
  		1.543717256192224,
  		-0.2544459913603802
  	],
  	[
  		20.009817786566447,
  		1.547677849987962,
  		-0.25203891538876444
  	],
  	[
  		20.011839824525502,
  		1.550859492379173,
  		-0.25234497301426945
  	],
  	[
  		20.01124911276807,
  		1.55432367580091,
  		-0.2547346923347233
  	],
  	[
  		20.00852613612566,
  		1.558592629113402,
  		-0.25467076885940604
  	],
  	[
  		20.00817584284238,
  		1.5626724272813,
  		-0.2522237287600948
  	],
  	[
  		20.010224244125034,
  		1.565920574225341,
  		-0.252000430303125
  	],
  	[
  		20.01014881020135,
  		1.569273487140709,
  		-0.2543741426902957
  	],
  	[
  		20.00745575526546,
  		1.573462460630581,
  		-0.2548349168621754
  	],
  	[
  		20.00658234577084,
  		1.577645016510646,
  		-0.2524646618798247
  	],
  	[
  		20.00854360170186,
  		1.580983205043669,
  		-0.2517211154701001
  	],
  	[
  		20.008971599443708,
  		1.584243071051902,
  		-0.2539657035717616
  	],
  	[
  		20.006420173077252,
  		1.588330869297714,
  		-0.2549279488589408
  	],
  	[
  		20.00504945502024,
  		1.592595070570938,
  		-0.2527463995991384
  	],
  	[
  		20.00681284167041,
  		1.596042751890884,
  		-0.2515168739635266
  	],
  	[
  		20.00770784842317,
  		1.599232429124636,
  		-0.2535245369633567
  	],
  	[
  		20.00540183011838,
  		1.603202835672453,
  		-0.254941545277533
  	],
  	[
  		20.00358275990142,
  		1.607523688238253,
  		-0.25305214010573834
  	],
  	[
  		20.00504710271219,
  		1.61109511627454,
  		-0.25139341188755193
  	],
  	[
  		20.00635124895636,
  		1.614240484020629,
  		-0.2530683889817007
  	],
  	[
  		20.00438277038993,
  		1.618082882293216,
  		-0.2548713452193392
  	],
  	[
  		20.00218735909122,
  		1.622432356439975,
  		-0.2533630220234146
  	],
  	[
  		20.003265189519,
  		1.626135712846914,
  		-0.25135412288770514
  	],
  	[
  		20.00490117836062,
  		1.629264879756704,
  		-0.2526152213756307
  	],
  	[
  		20.00334696373011,
  		1.632974315975883,
  		-0.25471869479436193
  	],
  	[
  		20.00086307212613,
  		1.637323459605486,
  		-0.253662031546512
  	],
  	[
  		20.00148649586329,
  		1.641160499496694,
  		-0.25139755261174085
  	],
  	[
  		20.003359517251763,
  		1.644302594608848,
  		-0.2521838790299182
  	],
  	[
  		20.00227570905052,
  		1.647880829131606,
  		-0.2544864009755732
  	],
  	[
  		19.99960514484674,
  		1.652200689296036,
  		-0.2539299344467844
  	],
  	[
  		19.99972595251723,
  		1.65616701695872,
  		-0.25151785296570484
  	],
  	[
  		20.001730802040314,
  		1.659350602296638,
  		-0.2517890491143235
  	],
  	[
  		20.00115213486168,
  		1.662805039668629,
  		-0.2541821534320906
  	],
  	[
  		19.9984051624515,
  		1.667068165901184,
  		-0.25415019402531874
  	],
  	[
  		19.9980016322411,
  		1.671152641927852,
  		-0.2517054079291052
  	],
  	[
  		20.00002560824267,
  		1.674404252176581,
  		-0.251447612367079
  	],
  	[
  		19.9999627826837,
  		1.677748356489432,
  		-0.2538169748030486
  	],
  	[
  		19.99725309321792,
  		1.68192984053909,
  		-0.25431001358306954
  	],
  	[
  		19.99632685183655,
  		1.686115964917707,
  		-0.2519492935320372
  	],
  	[
  		19.99825630551766,
  		1.68945900408368,
  		-0.2511727993921513
  	],
  	[
  		19.99869519911571,
  		1.692711412729307,
  		-0.2534059004365275
  	],
  	[
  		19.99613370645324,
  		1.696790584550322,
  		-0.25439817087649214
  	],
  	[
  		19.99471232750307,
  		1.701056935606205,
  		-0.2522328956338385
  	],
  	[
  		19.99643690324823,
  		1.704510634106735,
  		-0.2509729761024357
  	],
  	[
  		19.99734034777312,
  		1.707694324750568,
  		-0.2529623314979044
  	],
  	[
  		19.99503080821465,
  		1.711655180801301,
  		-0.2544056178960949
  	],
  	[
  		19.993165700240322,
  		1.715976321989947,
  		-0.2525385352983086
  	],
  	[
  		19.994585046234018,
  		1.719554424201918,
  		-0.25085434438126103
  	],
  	[
  		19.99589368556914,
  		1.722695504398405,
  		-0.2525048700431388
  	],
  	[
  		19.99392755918871,
  		1.726527620753185,
  		-0.2543300199134147
  	],
  	[
  		19.99169051368335,
  		1.730875698532665,
  		-0.2528491418348017
  	],
  	[
  		19.99271838796528,
  		1.734586009387164,
  		-0.2508204858377023
  	],
  	[
  		19.99435272866531,
  		1.737712810346741,
  		-0.25205285175047754
  	],
  	[
  		19.99280477795686,
  		1.741412014359869,
  		-0.25417188121676965
  	],
  	[
  		19.99028602551004,
  		1.745757743991781,
  		-0.253146440679665
  	],
  	[
  		19.99085479556253,
  		1.749601830206814,
  		-0.2508688541024069
  	],
  	[
  		19.99272049411998,
  		1.752743412980733,
  		-0.2516219088023147
  	],
  	[
  		19.99164636799632,
  		1.75631148769224,
  		-0.2539339592583855
  	],
  	[
  		19.988947735724242,
  		1.760626216103376,
  		-0.2534102892032614
  	],
  	[
  		19.989012795057818,
  		1.764598773294121,
  		-0.2509926215269505
  	],
  	[
  		19.99100254388238,
  		1.767783691864495,
  		-0.25122938086602
  	],
  	[
  		19.99043521391318,
  		1.771228653108465,
  		-0.2536243470875987
  	],
  	[
  		19.98766774567867,
  		1.775484774996832,
  		-0.25362663779012057
  	],
  	[
  		19.98720683263377,
  		1.779574737260053,
  		-0.2511840960070235
  	],
  	[
  		19.98920856358645,
  		1.78282932604384,
  		-0.2508911436072651
  	],
  	[
  		19.98915636103267,
  		1.786164992490048,
  		-0.253255873273202
  	],
  	[
  		19.98643316940469,
  		1.790338229108762,
  		-0.2537809806163533
  	],
  	[
  		19.98545138116229,
  		1.794528367442429,
  		-0.25143013115914653
  	],
  	[
  		19.987350774488032,
  		1.797875914338817,
  		-0.2506196592081941
  	],
  	[
  		19.98779921974614,
  		1.801121181681082,
  		-0.2528403483972539
  	],
  	[
  		19.98523142436795,
  		1.805190828327861,
  		-0.2538624345202254
  	],
  	[
  		19.98375730395197,
  		1.809459619734083,
  		-0.2517138532317014
  	],
  	[
  		19.98544531932342,
  		1.812918775051035,
  		-0.2504232599411319
  	],
  	[
  		19.98635476837981,
  		1.816096906949364,
  		-0.2523942569771161
  	],
  	[
  		19.9840448585385,
  		1.820047490733735,
  		-0.2538632749423607
  	],
  	[
  		19.982131152417338,
  		1.824369224817546,
  		-0.252019576319809
  	],
  	[
  		19.98350742194422,
  		1.827953593249532,
  		-0.2503090417053851
  	],
  	[
  		19.98481743979065,
  		1.831090872098304,
  		-0.251935721575743
  	],
  	[
  		19.98285573260765,
  		1.834912449365581,
  		-0.253780851738231
  	],
  	[
  		19.98057601988345,
  		1.839259144666609,
  		-0.2523281502328854
  	],
  	[
  		19.98155582713122,
  		1.842976038346428,
  		-0.25027864392049287
  	],
  	[
  		19.9831862952121,
  		1.846100831717355,
  		-0.25148239358552454
  	],
  	[
  		19.98164682638751,
  		1.849789412499259,
  		-0.2536154948813211
  	],
  	[
  		19.9790916079751,
  		1.854131923865177,
  		-0.25262159211841023
  	],
  	[
  		19.979609320990438,
  		1.8579822684066,
  		-0.25033012071894073
  	],
  	[
  		19.98146400775433,
  		1.86112371415925,
  		-0.251052231190917
  	],
  	[
  		19.980400781370278,
  		1.864681639565239,
  		-0.25337100947208324
  	],
  	[
  		19.97767282361077,
  		1.868991173643903,
  		-0.2528817724696548
  	],
  	[
  		19.977683718592807,
  		1.872969706283166,
  		-0.2504570644135725
  	],
  	[
  		19.97965635806539,
  		1.876156052810873,
  		-0.25066109873807
  	],
  	[
  		19.97910035097011,
  		1.879591699224914,
  		-0.2530559913416936
  	],
  	[
  		19.9763108334549,
  		1.883841096982385,
  		-0.25309216415747643
  	],
  	[
  		19.97579605453436,
  		1.887935880565935,
  		-0.25065033839754797
  	],
  	[
  		19.97777282192243,
  		1.891193560213273,
  		-0.2503249473007325
  	],
  	[
  		19.97773219951614,
  		1.894520932386026,
  		-0.2526817256885247
  	],
  	[
  		19.97499405030522,
  		1.898685872522457,
  		-0.2532407714252647
  	],
  	[
  		19.97395883280457,
  		1.902879790019674,
  		-0.2508973664460578
  	],
  	[
  		19.97582713552488,
  		1.906231448887965,
  		-0.250056645533304
  	],
  	[
  		19.9762841312372,
  		1.909469947324868,
  		-0.2522630351845216
  	],
  	[
  		19.97370851857979,
  		1.913530185730363,
  		-0.2533157003928964
  	],
  	[
  		19.97218342336715,
  		1.917801178597716,
  		-0.2511819583864841
  	],
  	[
  		19.97383333449361,
  		1.921265597299043,
  		-0.24986374319487248
  	],
  	[
  		19.97474859367467,
  		1.924438461096118,
  		-0.2518138059847305
  	],
  	[
  		19.972436873652192,
  		1.928378806743263,
  		-0.2533097875215835
  	],
  	[
  		19.97047612362885,
  		1.932701127521663,
  		-0.25148625600001184
  	],
  	[
  		19.97180905533238,
  		1.936291187131777,
  		-0.2497531421312107
  	],
  	[
  		19.97311990053916,
  		1.939424989307301,
  		-0.2513536813473935
  	],
  	[
  		19.97116210930273,
  		1.943235751868476,
  		-0.25322077485525013
  	],
  	[
  		19.96884002838084,
  		1.947581226074345,
  		-0.25179378114547013
  	],
  	[
  		19.96977167207065,
  		1.951304082701772,
  		-0.24972721106171802
  	],
  	[
  		19.97139714103868,
  		1.954427207213926,
  		-0.2509008309297354
  	],
  	[
  		19.96986560396912,
  		1.958104969710466,
  		-0.2530494433076138
  	],
  	[
  		19.96727405646093,
  		1.962444413969294,
  		-0.2520849104619821
  	],
  	[
  		19.9677399903221,
  		1.966300659394407,
  		-0.24978238907009498
  	],
  	[
  		19.969583507804202,
  		1.969442211613104,
  		-0.2504711395554176
  	],
  	[
  		19.96853115684171,
  		1.972989573745787,
  		-0.25279879837759095
  	],
  	[
  		19.96577369483741,
  		1.977294258980448,
  		-0.2523408734262513
  	],
  	[
  		19.96573136540145,
  		1.9812779180436,
  		-0.2499128415950092
  	],
  	[
  		19.96768514653467,
  		1.984466209807248,
  		-0.25008223099275434
  	],
  	[
  		19.96714198360889,
  		1.987891819772677,
  		-0.2524789395758018
  	],
  	[
  		19.96432973798855,
  		1.992134629127526,
  		-0.2525481455922571
  	],
  	[
  		19.96376075914316,
  		1.996233803532781,
  		-0.2501097033631812
  	],
  	[
  		19.9657117697179,
  		1.999494868587747,
  		-0.24975000894856422
  	],
  	[
  		19.965682999046,
  		2.002813434076185,
  		-0.2521011363229644
  	],
  	[
  		19.96292973584483,
  		2.006970330753044,
  		-0.25269154394285115
  	],
  	[
  		19.96184169405861,
  		2.011167260915299,
  		-0.2503591521258664
  	],
  	[
  		19.96367635353452,
  		2.014523888117949,
  		-0.24948499474809813
  	],
  	[
  		19.96414481965998,
  		2.01775464594498,
  		-0.2516784754143847
  	],
  	[
  		19.96156047673021,
  		2.021805637699831,
  		-0.2527609541926268
  	],
  	[
  		19.95998575604834,
  		2.026078064231659,
  		-0.25064442614949434
  	],
  	[
  		19.96159564050418,
  		2.029548221996333,
  		-0.2492971334711594
  	],
  	[
  		19.96251841473378,
  		2.032715091925686,
  		-0.2512277542016462
  	],
  	[
  		19.9602047723405,
  		2.036645205456566,
  		-0.25274975107617814
  	],
  	[
  		19.95819811843621,
  		2.040967184574239,
  		-0.2509502158388965
  	],
  	[
  		19.95948440134065,
  		2.044563865321698,
  		-0.2491919484979539
  	],
  	[
  		19.96079862411672,
  		2.047693369694842,
  		-0.250767162516149
  	],
  	[
  		19.958843483926827,
  		2.051493590610618,
  		-0.2526551150978894
  	],
  	[
  		19.95648143155307,
  		2.055836862198581,
  		-0.2512560294134245
  	],
  	[
  		19.95736179861232,
  		2.059566444054246,
  		-0.2491707011001629
  	],
  	[
  		19.95898483451349,
  		2.062687241034096,
  		-0.2503137724518944
  	],
  	[
  		19.957460895401738,
  		2.06635416237643,
  		-0.2524774293178302
  	],
  	[
  		19.954835817671942,
  		2.070689427710708,
  		-0.2515447319731524
  	],
  	[
  		19.95524713148009,
  		2.074552118945089,
  		-0.2492305759624804
  	],
  	[
  		19.95708159859725,
  		2.077693154207168,
  		-0.2498859728006139
  	],
  	[
  		19.95603926189274,
  		2.081230055424366,
  		-0.2522219317344441
  	],
  	[
  		19.95325510074618,
  		2.085528765971723,
  		-0.25179785005288363
  	],
  	[
  		19.95315583768907,
  		2.089518324123976,
  		-0.24936560344047098
  	],
  	[
  		19.95509308817537,
  		2.092707978688536,
  		-0.24949969442829092
  	],
  	[
  		19.95456091332138,
  		2.096123940285174,
  		-0.2518971283508213
  	],
  	[
  		19.95172941711861,
  		2.100359178519539,
  		-0.2519997660520767
  	],
  	[
  		19.95110366141138,
  		2.104463074890201,
  		-0.2495651860643421
  	],
  	[
  		19.953030723379378,
  		2.107727143162641,
  		-0.2491698806364418
  	],
  	[
  		19.95301332438887,
  		2.111036940433362,
  		-0.2515145993372347
  	],
  	[
  		19.950247897814258,
  		2.115184821775544,
  		-0.2521375094159004
  	],
  	[
  		19.94910482371802,
  		2.119385058109609,
  		-0.2498162688985326
  	],
  	[
  		19.95090847529082,
  		2.122745838978807,
  		-0.2489091622655408
  	],
  	[
  		19.95138540641076,
  		2.125969442892498,
  		-0.2510889997507037
  	],
  	[
  		19.94879603373393,
  		2.130010288023298,
  		-0.2522007166333237
  	],
  	[
  		19.94716863936667,
  		2.134284436754955,
  		-0.2501028799264927
  	],
  	[
  		19.94874025572978,
  		2.137759987936072,
  		-0.2487249750889046
  	],
  	[
  		19.94966862663299,
  		2.140921143571807,
  		-0.250635923104374
  	],
  	[
  		19.94735509486435,
  		2.144840608105076,
  		-0.2521825125926669
  	],
  	[
  		19.94530119272654,
  		2.149162374628769,
  		-0.25040691765283013
  	],
  	[
  		19.94654354383946,
  		2.152764874998282,
  		-0.2486237455033291
  	],
  	[
  		19.94785832408303,
  		2.155890546960499,
  		-0.2501735078351593
  	],
  	[
  		19.94590930627973,
  		2.159679538694555,
  		-0.25208060684187344
  	],
  	[
  		19.94350504941191,
  		2.164020709270355,
  		-0.2507109857866243
  	],
  	[
  		19.94433691076462,
  		2.167756369366197,
  		-0.2486059580761192
  	],
  	[
  		19.94595476487098,
  		2.17087499044133,
  		-0.24972052593230898
  	],
  	[
  		19.94443953321031,
  		2.174531054301531,
  		-0.25189641544061414
  	],
  	[
  		19.94177928388781,
  		2.178862250356731,
  		-0.2509961528805507
  	],
  	[
  		19.942138092145022,
  		2.182730876179179,
  		-0.24866950603863391
  	],
  	[
  		19.94396071082319,
  		2.185871648426617,
  		-0.2492929758516092
  	],
  	[
  		19.94292971605365,
  		2.189398033801664,
  		-0.25163440804834203
  	],
  	[
  		19.94011738125685,
  		2.193690897296932,
  		-0.25124442262600394
  	],
  	[
  		19.93996428696898,
  		2.197685696240647,
  		-0.2488066684243338
  	],
  	[
  		19.94188286992564,
  		2.200876634760332,
  		-0.24890829622299712
  	],
  	[
  		19.9413626185387,
  		2.204282960542391,
  		-0.2513037987655371
  	],
  	[
  		19.93851056521093,
  		2.208510594211298,
  		-0.25144108048951874
  	],
  	[
  		19.93783029864203,
  		2.212618844369561,
  		-0.24900834873309613
  	],
  	[
  		19.93973148344044,
  		2.215885676040384,
  		-0.24858115684437232
  	],
  	[
  		19.93972466148702,
  		2.219187094034847,
  		-0.2509168656228785
  	],
  	[
  		19.93694597080401,
  		2.223326003476826,
  		-0.2515726561301803
  	],
  	[
  		19.93574957155055,
  		2.227529303079235,
  		-0.24926059849729781
  	],
  	[
  		19.93752047081054,
  		2.230894133466488,
  		-0.24832304298992602
  	],
  	[
  		19.93800615119507,
  		2.234110630347125,
  		-0.2504874366369435
  	],
  	[
  		19.93541009709925,
  		2.23814144721916,
  		-0.2516291452986013
  	],
  	[
  		19.93373282831195,
  		2.242417011376083,
  		-0.2495468236592541
  	],
  	[
  		19.93526532335667,
  		2.245897396735184,
  		-0.24814273796174333
  	],
  	[
  		19.936198336129912,
  		2.249053234477489,
  		-0.2500316792628552
  	],
  	[
  		19.9338846873298,
  		2.252961731849006,
  		-0.2516045569800498
  	],
  	[
  		19.93178406945318,
  		2.25728335924666,
  		-0.24985060034645792
  	],
  	[
  		19.9329819634623,
  		2.260891294557699,
  		-0.2480452120473412
  	],
  	[
  		19.93429648711882,
  		2.264013314651409,
  		-0.24956854250762972
  	],
  	[
  		19.932351708222107,
  		2.267791190795537,
  		-0.2514959968255863
  	],
  	[
  		19.92990705949902,
  		2.272130194038861,
  		-0.25015255124970864
  	],
  	[
  		19.930689674803478,
  		2.275871443198431,
  		-0.24803162666771242
  	],
  	[
  		19.932301694936328,
  		2.278988310683462,
  		-0.24911473582291152
  	],
  	[
  		19.93079544200977,
  		2.28263295283721,
  		-0.25130558391824004
  	],
  	[
  		19.928100182873962,
  		2.286960311566537,
  		-0.2504349344271428
  	],
  	[
  		19.92840756776717,
  		2.290834106439744,
  		-0.2480987429649622
  	],
  	[
  		19.93021709966132,
  		2.293974923554478,
  		-0.2486890957056506
  	],
  	[
  		19.92919721707408,
  		2.297490440090816,
  		-0.25103800768044343
  	],
  	[
  		19.92635686244872,
  		2.301777579016019,
  		-0.2506801059322356
  	],
  	[
  		19.92614986266459,
  		2.305777059482858,
  		-0.2482401214407117
  	],
  	[
  		19.928048404363178,
  		2.308969816185794,
  		-0.24830669394996252
  	],
  	[
  		19.92754055463279,
  		2.312365926585949,
  		-0.2507028062726581
  	],
  	[
  		19.92466735278084,
  		2.316586324545709,
  		-0.2508721145846675
  	],
  	[
