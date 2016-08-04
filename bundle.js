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

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	// MARK: Types
	var MiraResource = function () {

	  // MARK: Constructors
	  function MiraResource(url) {
	    _classCallCheck(this, MiraResource);

	    this.get = this.fetch('GET');
	    this.post = this.fetch('POST');
	    this.put = this.fetch('PUT');
	    this.delete = this.fetch('DELETE');
	    this.head = this.fetch('HEAD');

	    this.url = url;
	    this.resourceId = _uuid2.default.v4();

	    // bind & setup responders
	    this.onWindowMessage = this.onWindowMessage.bind(this);
	    window.addEventListener('message', this.onWindowMessage, false);
	  }

	  // MARK: Fetch Handlers

	  // MARK: Properties


	  _createClass(MiraResource, [{
	    key: 'fetch',
	    value: function fetch(method) {
	      var _this = this;

	      return function (query_params, body_payload, headers, auth, timeout, allow_redirects) {
	        return new Promise(function (resolve, reject) {
	          _this.pendingCallbacks = [resolve, reject];

	          window.postMessage({
	            eventName: 'fetch',
	            payload: {
	              resourceId: _this.resourceId,
	              method: method,
	              url: _this.url,
	              query_params: query_params || {},
	              body_payload: body_payload || {},
	              headers: headers || {},
	              auth: auth || null,
	              timeout: timeout || 0,
	              allow_redirects: allow_redirects || false
	            }
	          }, '*');
	        });
	      };
	    }

	    // MARK: Responders

	  }, {
	    key: 'onWindowMessage',
	    value: function onWindowMessage(event) {
	      if (event.data.eventName === 'fetch-response') {
	        console.log("IN RESOURCE: ", event.data.payload);
	        window.removeEventListener('message', this.onWindowMessage);
	      }
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

/***/ }
/******/ ])
});
;