"use strict";
// closure
var serviceHandler = function(service) {
  /*
   * Below are the supported options for the serviceHandler:
   *
   * - data (object): request data payload
   * - params (object): use to replace the tokens in the url
   * - query (object): use to build the query string appended to the url
   * - callback (function): callback to use, with a default which emits 'success' or 'error'
   *   event depending on res.ok value
   * - edit (function): callback to use, to tweak req if needed.
   * - timeout (number): milli seconds before a timeout error is thrown
   */
  return function(options) {
    options = options || {};
    var data = options.data || {};
    var params = options.params || {};
    var query = options.query || {};
    var callback = options.callback || null;
    var edit = options.edit || null;
    var timeout = options.timeout || 20000;

    var self = this;
    var req = this.request(service, data, params, query);

    // edit request if function defined
    if (edit && "function" === typeof edit) {
      edit(req);
    }

    var resolver = {};

    var p = new Promise(function (resolve, reject) {
      resolver = {
        resolve: resolve,
        reject: reject
      };
    });

    req.end(callback ? callback : function(res) {
      resolver[!res.error ? "resolve" : "reject"](res);
    });

    if (timeout) {
      req.xhr.timeout = timeout;
      req.xhr.ontimeout = function () {
        req.aborted = true;
        var response = new self.agent.Response(req);
        response.timeout = true;
        response.error = true;
        req.emit('abort', response);
      }
    }

    req.on('abort', function (res) {
      resolver.reject(res);
    });

    return p;
  };
};

function Api(config) {
  this.config = config;

  // create a hash-liked object where all the services handlers are registered
  this.api = Object.create(null);

  for (var name in config.services) {
    if (!Object.prototype.hasOwnProperty(this, name)) {
      // syntatic sugar: install a service handler available on
      // the api instance with service name
      this.api[name] = serviceHandler(name).bind(this);
    }
  }
}

Api.prototype = {
  paramsPattern: /:(\w+)/g,

  service: function(id) {
    return this.config.services[id];
  },

  url: function(id) {
    var url = this.config.baseUrl;
    var resource = this.service(id);

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
        throw new Error("path is not defined for route $" + id);
      }

      if (path.match(/^https?:\/\//)) {
        url = path;
      }
      else {
        url += path[0] === "/" ? path : "/" + path;
      }
    }

    return url;
  },

  replaceUrl: function(url, params) {
    var tokens = url.match(this.paramsPattern);

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

  buildUrlQuery: function(query) {
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
    return queryString ? "?" + queryString : "";
  },

  buildUrl: function(id, params, query) {
    var url = this.url(id);

    if (params) {
      url = this.replaceUrl(url, params);
    }

    if (query) {
      url += this.buildUrlQuery(query);
    }

    return url;
  },

  request: function(id, data, params, query) {
    var service = this.service(id);
    var method = (typeof service === "string" ? "get" : service.method ||
      "get").toLowerCase();
    // fix for delete being a reserved word
    if (method === "delete") {
      method = "del";
    }

    if (!this.agent) {
      throw new Error("missing superagent or any api compatible agent.");
    }

    var request = this.agent[method];
    if (!request) {
      throw new Error("Invalid method [" + service.method + "]");
    }

    var _req = request(this.buildUrl(id, params, query), data);

    // add global headers
    this._setHeaders(_req, this.config.headers);

    // add global options to request headers
    this._setOptions(_req, this.config.options);

    // add service options to request headers
    this._setOptions(_req, service.options);

    // add service headers
    this._setHeaders(_req, service.headers);

    // add runtime headers
    this._setHeaders(_req, this.headers);

    // set credentials
    if (this.config.withCredentials) {
      _req.withCredentials();
    }

    return _req;
  },

  addHeader: function(name, value) {
    this.headers = this.headers || {};
    this.headers[name] = value;
  },

  removeHeader: function(name) {
    if (this.headers && this.headers[name]) {
      delete this.headers[name];
    }
  },

  _setHeaders: function(req, headers) {
    for (var header in headers) {
      req.set(header, headers[header]);
    }
  },

  _setOptions: function(req, options) {
    for (var option in options) {
      req[option](options[option]);
    }
  }
};

exports["default"] = Api;