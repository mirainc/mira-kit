(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("MiraKit", [], factory);
	else if(typeof exports === 'object')
		exports["MiraKit"] = factory();
	else
		root["MiraKit"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.Internal = exports.MiraFileResource = exports.MiraWebResource = exports.MiraResourceResponse = undefined;

	var _mira_resource_response = __webpack_require__(1);

	var _mira_resource_response2 = _interopRequireDefault(_mira_resource_response);

	var _mira_web_resource = __webpack_require__(2);

	var _mira_web_resource2 = _interopRequireDefault(_mira_web_resource);

	var _mira_file_resource = __webpack_require__(6);

	var _mira_file_resource2 = _interopRequireDefault(_mira_file_resource);

	var _message_courier = __webpack_require__(5);

	var _message_courier2 = _interopRequireDefault(_message_courier);

	var _url = __webpack_require__(7);

	var _url2 = _interopRequireDefault(_url);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// MARK: Constants


	// internal
	var Internal = {
	  MessageCourier: _message_courier2.default,
	  URL: _url2.default
	};

	// MARK: Exports
	// MARK: Imports
	exports.MiraResourceResponse = _mira_resource_response2.default;
	exports.MiraWebResource = _mira_web_resource2.default;
	exports.MiraFileResource = _mira_file_resource2.default;
	exports.Internal = Internal;

/***/ },
/* 1 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var MiraResourceResponse = function () {

	  // MARK: Constructors
	  function MiraResourceResponse(headers, didRedirect, statusCode, url, raw) {
	    _classCallCheck(this, MiraResourceResponse);

	    this.headers = headers;
	    this.didRedirect = didRedirect;
	    this.statusCode = statusCode;
	    this.url = url;
	    this.raw = raw;
	  }

	  // MARK: Accessors

	  // MARK: Properties


	  _createClass(MiraResourceResponse, [{
	    key: "text",
	    value: function text() {
	      return String.fromCharCode.apply(null, new Uint8Array(this.raw));
	    }
	  }, {
	    key: "json",
	    value: function json() {
	      return JSON.parse(this.text());
	    }
	  }, {
	    key: "blob",
	    value: function blob() {
	      return new Blob([this.raw], { type: this.headers["content-type"] });
	    }
	  }]);

	  return MiraResourceResponse;
	}();

	// MARK: Exports


	exports.default = MiraResourceResponse;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _mira_resource = __webpack_require__(3);

	var _mira_resource2 = _interopRequireDefault(_mira_resource);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // MARK: Imports


	var MiraWebResource = function (_MiraResource) {
	  _inherits(MiraWebResource, _MiraResource);

	  function MiraWebResource() {
	    var _Object$getPrototypeO;

	    var _temp, _this, _ret;

	    _classCallCheck(this, MiraWebResource);

	    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	      args[_key] = arguments[_key];
	    }

	    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_Object$getPrototypeO = Object.getPrototypeOf(MiraWebResource)).call.apply(_Object$getPrototypeO, [this].concat(args))), _this), _this.get = _this.request('GET'), _this.post = _this.request('POST'), _this.put = _this.request('PUT'), _this.delete = _this.request('DELETE'), _this.head = _this.request('HEAD'), _temp), _possibleConstructorReturn(_this, _ret);
	  }
	  // MARK: Fetch Handlers


	  return MiraWebResource;
	}(_mira_resource2.default);

	// MARK: Exports


	exports.default = MiraWebResource;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); // MARK: Imports


	var _uuid = __webpack_require__(4);

	var _uuid2 = _interopRequireDefault(_uuid);

	var _mira_resource_response = __webpack_require__(1);

	var _mira_resource_response2 = _interopRequireDefault(_mira_resource_response);

	var _message_courier = __webpack_require__(5);

	var _message_courier2 = _interopRequireDefault(_message_courier);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	// MARK: Types
	var MiraResource = function () {

	  // MARK: Constructors

	  // MARK: Properties
	  function MiraResource(url) {
	    _classCallCheck(this, MiraResource);

	    this.url = url;
	    this.resourceId = _uuid2.default.v4();

	    // bind responders
	    this.onResponse = this.onResponse.bind(this);
	  }

	  // MARK: Request Handlers


	  _createClass(MiraResource, [{
	    key: 'request',
	    value: function request(method) {
	      var _this = this;

	      return function (queryParams, bodyPayload, headers, timeout, allowRedirects) {
	        return _message_courier2.default.defaultCourier().sendMessage('fetch', {
	          resourceId: _this.resourceId,
	          method: method,
	          url: _this.url,
	          queryParams: queryParams || {},
	          bodyPayload: bodyPayload || {},
	          headers: headers || {},
	          timeout: timeout || 0,
	          allowRedirects: allowRedirects || false
	        }).then(_this.onResponse);
	      };
	    }

	    // MARK: Response Handlers

	  }, {
	    key: 'onResponse',
	    value: function onResponse(value) {
	      return new _mira_resource_response2.default(value.headers, value.didRedirect, value.statusCode, value.url, value.raw);
	    }
	  }]);

	  return MiraResource;
	}();

	// MARK: Exports


	exports.default = MiraResource;

/***/ },
/* 4 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var uuid = function () {
	  function uuid() {
	    _classCallCheck(this, uuid);
	  }

	  _createClass(uuid, null, [{
	    key: 'v4',

	    // MARK: Generators
	    value: function v4() {
	      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
	        var r = Math.random() * 16 | 0,
	            v = c == 'x' ? r : r & 0x3 | 0x8;
	        return v.toString(16);
	      });
	    }
	  }]);

	  return uuid;
	}();

	// MARK: Exports


	exports.default = uuid;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); // MARK: Imports


	var _uuid = __webpack_require__(4);

	var _uuid2 = _interopRequireDefault(_uuid);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	// MARK: Types
	var MessageCourier = function () {

	  // MARK: Constructors
	  function MessageCourier(localWindow, remoteWindow) {
	    _classCallCheck(this, MessageCourier);

	    this.pendingResponses = {};
	    this.subscribers = {};

	    this.localWindow = localWindow;
	    this.remoteWindow = remoteWindow;

	    // bind & attach responders
	    this.onWindowMessage = this.onWindowMessage.bind(this);
	    this.localWindow.addEventListener('message', this.onWindowMessage, false);
	  }
	  // MARK: Properties


	  _createClass(MessageCourier, [{
	    key: 'subscribeToMessage',


	    // MARK: Message Handlers
	    value: function subscribeToMessage(messageName, responder) {
	      this.subscribers[messageName] = this.subscribers[messageName] || [];
	      this.subscribers[messageName].push(responder);
	    }
	  }, {
	    key: 'sendMessage',
	    value: function sendMessage(messageName, payload) {
	      var _this = this;

	      var requestId = _uuid2.default.v4();
	      return new Promise(function (resolve, reject) {
	        _this.pendingResponses[requestId] = [resolve, reject];
	        _this.remoteWindow.postMessage({
	          requestId: requestId,
	          messageName: messageName,
	          payload: payload
	        }, '*');
	      });
	    }

	    // MARK: Responders

	  }, {
	    key: 'onWindowMessage',
	    value: function onWindowMessage(event) {
	      var _this2 = this;

	      if (event.data.responseId !== undefined) {
	        if (this.pendingResponses[event.data.responseId] === undefined) {
	          return;
	        }

	        var resolve = this.pendingResponses[event.data.responseId][0];
	        var reject = this.pendingResponses[event.data.responseId][1];
	        this.pendingResponses[event.data.responseId] = undefined;

	        if (event.data.error !== undefined) {
	          reject(event.data.error);
	          return;
	        }

	        resolve(event.data.payload);
	        return;
	      } else if (event.data.messageName !== undefined) {
	        var subscribers = this.subscribers[event.data.messageName];
	        if (subscribers === undefined) {
	          return;
	        }

	        subscribers.forEach(function (responder) {
	          var promise = responder(event.data.payload);
	          if (promise === undefined) {
	            _this2.remoteWindow.postMessage({
	              responseId: event.data.requestId,
	              payload: {}
	            }, '*');
	            return;
	          }

	          promise.then(function (payload) {
	            _this2.remoteWindow.postMessage({
	              responseId: event.data.requestId,
	              payload: payload
	            }, '*');
	          });
	        });

	        return;
	      }
	    }
	  }], [{
	    key: 'defaultCourier',
	    value: function defaultCourier() {
	      if (MessageCourier.__defaultCourier === undefined) {
	        MessageCourier.__defaultCourier = new MessageCourier(window, window.parent);
	      }

	      return MessageCourier.__defaultCourier;
	    }
	  }]);

	  return MessageCourier;
	}();

	// MARK: Exports


	exports.default = MessageCourier;

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _mira_resource = __webpack_require__(3);

	var _mira_resource2 = _interopRequireDefault(_mira_resource);

	var _message_courier = __webpack_require__(5);

	var _message_courier2 = _interopRequireDefault(_message_courier);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // MARK: Imports


	var MiraFileResource = function (_MiraResource) {
	  _inherits(MiraFileResource, _MiraResource);

	  // MARK: Constructors
	  function MiraFileResource(propertyName) {
	    _classCallCheck(this, MiraFileResource);

	    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(MiraFileResource).call(this, ''));

	    _this.propertyName = propertyName;
	    return _this;
	  }

	  // MARK: Fetch Handlers


	  _createClass(MiraFileResource, [{
	    key: 'get',
	    value: function get() {
	      return _message_courier2.default.defaultCourier().sendMessage('fetch-file', {
	        resourceId: this.resourceId,
	        method: 'GET',
	        propertyName: this.propertyName
	      }).then(this.onResponse);
	    }
	  }]);

	  return MiraFileResource;
	}(_mira_resource2.default);

	// MARK: Exports


	exports.default = MiraFileResource;

/***/ },
/* 7 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var URL =

	// MARK: Constructors

	// MARK: Properties
	function URL(url) {
	  _classCallCheck(this, URL);

	  this._urlString = url;
	  var domElement = document.createElement('a');

	  this.protocol = domElement.protocol;
	  this.hostname = domElement.hostname;
	  this.port = domElement.port;
	  this.pathname = domElement.pathname;
	  this.query = domElement.search;
	  this.hash = domElement.hash;
	  this.host = domElement.host;
	};

	// MARK: Exports


	exports.default = URL;

/***/ }
/******/ ])
});
;