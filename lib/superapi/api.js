// closure
var serviceHandler = function (service) {
  return function (data, params, fn) {
    /*
     * - data (object): request data payload
     * - params (object): use to replace the tokens in the url
     * - fn (function): callback to used, with a default which emits 'success' or 'error'
     *   event depending on res.ok value
     *
     * support these different format calls:
     *
     *  - function (data, fn)
     *  - function (data, params, fn)
     */
    // function (data, fn) used
    if ('function' === typeof params && !fn) {
      params = undefined;
      fn = params;
    }
    var req = this.request(service, data, params).end(fn ? fn : function (res) {
      req.emit(res.ok ? "success" : "error", res, data, params);
    });
    return req;
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
  paramsPattern: /:([^/]+)/g,

  service: function (id) {
    return this.config.services[id];
  },

  url: function (id) {
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

      url += path[0] === "/" ? path : "/" + path;
    }

    return url;
  },

  buildUrl: function (url, params) {
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

  request: function (id, data, params) {
    var service = this.service(id);
    var method = (typeof service === "string" ? "get" : service.method || "get").toLowerCase();
    // fix for delete being a reserved word
    if (method === "delete") {
      method = "del";
    }

    if (!this.agent) {
      throw new Error('missing superagent or any api compatible agent.')
    }

    var request = this.agent[method];
    if (!request) {
      throw new Error("Invalid method [" + service.method + "]");
    }

    var url = this.url(id);

    if (params) {
      url = this.buildUrl(url, params);
    }

    var _req = request(url, data);

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

  addHeader: function (name, value) {
    this.headers = this.headers || {};
    this.headers[name] = value;
  },

  _setHeaders: function (req, headers) {
    for (var header in headers) {
      req.set(header, headers[header]);
    }
  },

  _setOptions: function (req, options) {
    for (var option in options) {
      req[option](options[option]);
    }
  }
};

export default Api;
