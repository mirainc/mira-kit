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
	exports.MiraWebResource = undefined;

	var _mira_web_resource = __webpack_require__(1);

	var _mira_web_resource2 = _interopRequireDefault(_mira_web_resource);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// MARK: Exports
	exports.MiraWebResource = _mira_web_resource2.default; // MARK: Imports

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _mira_resource = __webpack_require__(2);

	var _mira_resource2 = _interopRequireDefault(_mira_resource);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // MARK: Imports


	var MiraWebResource = function (_MiraResource) {
	  _inherits(MiraWebResource, _MiraResource);

	  function MiraWebResource() {
	    _classCallCheck(this, MiraWebResource);

	    return _possibleConstructorReturn(this, Object.getPrototypeOf(MiraWebResource).apply(this, arguments));
	  }

	  return MiraWebResource;
	}(_mira_resource2.default);

	// MARK: Exports


	exports.default = MiraWebResource;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); // MARK: Imports


	var _uuid = __webpack_require__(3);

	var _uuid2 = _interopRequireDefault(_uuid);

	var _mira_resource_response = __webpack_require__(4);

	var _mira_resource_response2 = _interopRequireDefault(_mira_resource_response);

	var _message_courier = __webpack_require__(5);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	// MARK: Types
	var MiraResource = function () {

	  // MARK: Constructors

	  // MARK: Properties
	  function MiraResource(url) {
	    _classCallCheck(this, MiraResource);

	    this.get = this.fetch('GET');
	    this.post = this.fetch('POST');
	    this.put = this.fetch('PUT');
	    this.delete = this.fetch('DELETE');
	    this.head = this.fetch('HEAD');

	    this.url = url;
	    this.resourceId = _uuid2.default.v4();
	  }

	  // MARK: Fetch Handlers


	  _createClass(MiraResource, [{
	    key: 'fetch',
	    value: function fetch(method) {
	      var _this = this;

	      return function (queryParams, bodyPayload, headers, timeout, allowRedirects) {
	        var messageResponse = _message_courier.defaultCourier.sendMessage('fetch', {
	          resourceId: _this.resourceId,
	          method: method,
	          url: _this.url,
	          queryParams: queryParams || {},
	          bodyPayload: bodyPayload || {},
	          headers: headers || {},
	          timeout: timeout || 0,
	          allowRedirects: allowRedirects || false
	        });

	        return messageResponse.then(function (value) {
	          return new _mira_resource_response2.default(value.headers, value.didRedirect, value.statusCode, value.url, value.raw);
	        });
	      };
	    }
	  }]);

	  return MiraResource;
	}();

	// MARK: Exports


	exports.default = MiraResource;

/***/ },
/* 3 */
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
/* 4 */
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
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.defaultCourier = undefined;

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); // MARK: Imports


	var _uuid = __webpack_require__(3);

	var _uuid2 = _interopRequireDefault(_uuid);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var MessageCourier = function () {

	  // MARK: Constructor
	  function MessageCourier(window) {
	    _classCallCheck(this, MessageCourier);

	    this.pendingResponses = {};
	    this.subscribers = {};

	    this.window = window;

	    // bind & attach responders
	    this.onWindowMessage = this.onWindowMessage.bind(this);
	    this.window.addEventListener('message', this.onWindowMessage, false);
	  }

	  // MARK: Message Handlers

	  // MARK: Properties


	  _createClass(MessageCourier, [{
	    key: 'subscribeToMessage',
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
	        console.log(messageName);
	        _this.window.postMessage({
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
	        var resolve = this.pendingResponses[event.data.responseId][0];
	        var reject = this.pendingResponses[event.data.responseId][1];

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
	          responder(event.data.payload).then(function (value) {
	            _this2.window.postMessage({
	              responseId: event.data.requestId,
	              payload: value
	            }, '*');
	          });
	        });

	        return;
	      }
	    }
	  }]);

	  return MessageCourier;
	}();

	// MARK: Constants


	var defaultCourier = new MessageCourier(window);

	// MARK: Exports
	exports.default = MessageCourier;
	exports.defaultCourier = defaultCourier;

/***/ }
/******/ ])
});
;