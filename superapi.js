"use strict";
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _configuration = require("./configuration");

var _configuration2 = _interopRequireDefault(_configuration);

function Api(config) {
  // add a default configuration
  this.configurations = {};

  if (config) {
    this.configure(config);
  }
}

Api.prototype = {
  configure: function configure(name, config) {
    var conf = new _configuration2["default"](name, config);

    conf.bind(this.serviceHandler.bind(this));

    // copy api
    this.configurations[conf.name] = conf;

    this[conf.name] = conf.api;
  },

  request: function request(method, url, data, options) {
    var opts = options || {};

    if (!this.agent) {
      throw new Error("missing superagent or any api compatible agent.");
    }

    // fix for delete being a reserved word
    if (method === "delete") {
      method = "del";
    }

    // reset data for delete operation
    // kind of hack as request.del signature is different from others being `function(url, fn)`
    // instead of `function(url, data, fn)`
    if (method === "del") {
      data = undefined;
    }

    var request = this.agent[method];
    if (!request) {
      throw new Error("Unsupported method [" + method + "]");
    }

    var _req = request(url, data);

    if (opts.config) {
      // add configuration headers
      this._setHeaders(_req, opts.config.headers);

      // add configuration options to request headers
      this._setOptions(_req, opts.config.options);
    }

    if (opts.service) {
      // add service options to request headers
      this._setOptions(_req, opts.service.options);

      // add service headers
      this._setHeaders(_req, opts.service.headers);
    }

    if (opts.headers) {
      // add runtime headers
      this._setHeaders(_req, opts.headers);
    }

    // set credentials
    if (opts.withCredentials) {
      _req.withCredentials();
    }

    return _req;
  },

  _setHeaders: function _setHeaders(req, headers) {
    for (var header in headers) {
      req.set(header, headers[header]);
    }
  },

  _setOptions: function _setOptions(req, options) {
    for (var option in options) {
      req[option](options[option]);
    }
  },

  _request: function _request(serviceDesc) {
    var method = serviceDesc.method;
    var url = serviceDesc.url;
    var data = serviceDesc.data;
    var options = serviceDesc;

    delete options.method;
    delete options.url;
    delete options.data;

    return this.request(method, url, data, options);
  },

  serviceHandler: function serviceHandler(service) {
    var apiContext = this;
    /*
     * Below are the supported options for the serviceHandler:
     *
     * - data (object): request data payload
     * - params (object): use to replace the tokens in the url
     * - query (object): use to build the query string appended to the url
     * - callback (function): callback to use, with a default which emits 'success' or 'error'
     *   event depending on res.ok value
     * - edit (function): callback to use, to tweak req if needed.
     */
    return function (options) {
      options = options || {};
      var data = options.data || {};
      var params = options.params || {};
      var query = options.query || {};
      var callback = options.callback || null;
      var edit = options.edit || null;

      var configContext = this;

      return new Promise(function (resolve, reject) {
        // retrieve service descriptor
        var serviceDesc = configContext.request(service, data, params, query);

        // create request
        var req = apiContext._request(serviceDesc);

        // edit  request if function defined
        if (edit && "function" === typeof edit) {
          edit(req);
        }

        req.on("error", reject);

        req.end(callback ? callback : function (err, res) {
          if (err) {
            reject(err);
          } else {
            (!res.error ? resolve : reject)(res);
          }
        });

        req.on("abort", reject);
      });
    };
  }
};

exports["default"] = Api;
module.exports = exports["default"];
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _service = require("./service");

var _service2 = _interopRequireDefault(_service);

function isObject(obj) {
  return obj === Object(obj);
}

function Configuration(name, config) {
  if (isObject(name)) {
    config = name;
    name = "api";
  }

  this.name = name || "api";
  this.config = config || {};

  this.api = {};
  this.headers = {};
}

Configuration.prototype.bind = function (handler) {
  this.api = {};

  if (!this.config.services) {
    return;
  }

  for (var name in this.config.services) {
    if (!Object.prototype.hasOwnProperty(this, name)) {
      // syntatic sugar: install a service handler available on
      // the api instance with service name
      this.api[name] = handler(name).bind(this);
    }
  }
};

Configuration.prototype.service = function (id) {
  this.services = this.services || {};

  if (!this.services[id]) {
    var service = new _service2["default"](id, this.config.services[id]);
    service.baseUrl = this.config.baseUrl;

    this.services[id] = service;
  }

  return this.services[id];
};

Configuration.prototype.request = function (id, data, params, query) {
  var service = this.service(id);

  var descriptor = service.request(data, params, query);

  // config headers and options
  descriptor.config = {
    headers: this.config.headers || {},
    options: this.config.options || {}
  };

  // service headers and options
  descriptor.service = service.options();

  // runtime headers
  descriptor.headers = this.headers || {};

  descriptor.withCredentials = this.config.withCredentials || false;

  return descriptor;
};

Configuration.prototype.addHeader = function (name, value) {
  this.headers = this.headers || {};
  this.headers[name] = value;
};

Configuration.prototype.removeHeader = function (name) {
  if (this.headers && this.headers[name]) {
    delete this.headers[name];
  }
};

exports["default"] = Configuration;
module.exports = exports["default"];
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _urlize = require("./urlize");

var _urlize2 = _interopRequireDefault(_urlize);

function Service(id, config) {
  this.id = id;
  this.config = config;
}

Service.prototype.url = function (params, query) {
  return _urlize2["default"].urlize({
    baseUrl: this.baseUrl,
    resource: this.config,
    params: params,
    query: query
  });
};

Service.prototype.method = function () {
  return typeof this.config === "string" ? "get" : (this.config.method || "get").toLowerCase();
};

Service.prototype.options = function () {
  return {
    options: this.config.options || {},
    headers: this.config.headers || {}
  };
};

Service.prototype.request = function (data, params, query) {
  return {
    method: this.method(),
    url: this.url(params, query),
    data: data
  };
};

exports["default"] = Service;
module.exports = exports["default"];
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var urlize = {
  paramsPattern: /:(\w+)/g,

  url: function url(baseUrl, resource) {
    var url = baseUrl;

    // from time being it"s a simple map
    if (resource) {
      var path;

      if (typeof resource === "string") {
        path = resource;
      }

      if (typeof resource === "object" && resource.path !== undefined) {
        path = resource.path;
      }

      if (!path) {
        throw new Error("path is not defined");
      }

      if (path.match(/^https?:\/\//)) {
        url = path;
      } else {
        url += path[0] === "/" ? path : "/" + path;
      }
    }

    return url;
  },

  replaceUrl: function replaceUrl(url, params, pattern) {
    if (!url || !(url.match && typeof url.match === "function")) {
      return false;
    }
    var tokens = url.match(pattern || this.paramsPattern);

    if (!tokens || !tokens.length) {
      return url;
    }

    for (var i = 0, len = tokens.length; i < len; i += 1) {
      var token = tokens[i];
      var name = token.substring(1);
      if (params[name]) {
        url = url.replace(token, params[name]);
      }
    }
    return url;
  },

  buildUrlQuery: function buildUrlQuery(query) {
    if (!query) {
      return "";
    }

    var queryString;

    if (typeof query === "string") {
      queryString = query;
    } else {
      var queryArgs = [];
      for (var queryArg in query) {
        queryArgs.push(queryArg + "=" + query[queryArg]);
      }
      queryString = queryArgs.join("&");
    }

    if (!queryString.length) {
      return "";
    }

    return queryString.charAt(0) === "?" ? queryString : "?" + queryString;
  },

  urlize: function urlize(opts) {
    if (!opts) {
      throw new Error("Invalid url parameters.");
    }

    var url = this.url(opts.baseUrl, opts.resource);

    if (opts.params) {
      var pattern = opts.paramsPattern || false;
      url = this.replaceUrl(url, opts.params, pattern);
    }

    if (opts.query) {
      url += this.buildUrlQuery(opts.query);
    }

    return url;
  }
};

exports["default"] = urlize;
module.exports = exports["default"];
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _superapiApi = require('./superapi/api');

var _superapiApi2 = _interopRequireDefault(_superapiApi);

var _superapiConfiguration = require('./superapi/configuration');

var _superapiConfiguration2 = _interopRequireDefault(_superapiConfiguration);

var _superapiService = require('./superapi/service');

var _superapiService2 = _interopRequireDefault(_superapiService);

var _superapiUrlize = require('./superapi/urlize');

var _superapiUrlize2 = _interopRequireDefault(_superapiUrlize);

function superapi(config) {
  return new _superapiApi2['default'](config);
}

superapi.Api = _superapiApi2['default'];
superapi.Configuration = _superapiConfiguration2['default'];
superapi.Service = _superapiService2['default'];
superapi.urlize = _superapiUrlize2['default'];

// export API
exports['default'] = superapi;
module.exports = exports['default'];
