function Api(config) {
  // create a hash-liked object where all the services handlers are registered
  this.api = Object.create(null);

  // support undefined configuration in constructor
  this.configure(config);
}

Api.prototype = {
  paramsPattern: /:(\w+)/g,

  configure: function (config) {
    this.config = config || {};

    if (!config) {
      return;
    }

    for (var name in config.services) {
      if (!Object.prototype.hasOwnProperty(this, name)) {
        // syntatic sugar: install a service handler available on
        // the api instance with service name
        this.api[name] = Api.serviceHandler(name).bind(this);
      }
    }
  },

  service: function(id) {
    return this.config.services ? this.config.services[id] : null;
  },

  url: function(id) {
    var url = this.config.baseUrl;
    var resource = this.service(id) || id;

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

  request: function(id, data, params, query, method) {
    var service = this.service(id);
    method = method || (service && service.method ? service.method : "get");

    var options = service ? {
      options: service.options,
      headers: service.headers
    } : {}

    return this.buildRequest(method, this.buildUrl(id, params, query), data, options);
  },

  get: function(url, options, data) {
    return this._httpVerb('get', url, options, data);
  },

  post: function(url, options, data) {
    return this._httpVerb('post', url, options, data);
  },

  put: function(url, options, data) {
    return this._httpVerb('put', url, options, data);
  },

  del: function(url, options, data) {
    return this._httpVerb('del', url, options, data);
  },

  patch: function(url, options, data) {
    return this._httpVerb('patch', url, options, data);
  },

  head: function(url, options, data) {
    return this._httpVerb('head', url, options, data);
  },

  _httpVerb: function(method, url, options, data) {
    options = options || {};
    options.data = data;
    options.method = method;

    return Api.serviceHandler(url).call(this, options);
  },

  buildRequest: function (method, url, data, opts) {
    method = method.toLowerCase();
    opts = opts || {};

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

    // add global headers
    this._setHeaders(_req, this.config.headers);

    // add global options to request headers
    this._setOptions(_req, this.config.options);

    // add service options to request headers
    this._setOptions(_req, opts.options);

    // add service headers
    this._setHeaders(_req, opts.headers);

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
  },

  middleware: function (name) {
    const found = this.middlewares.filter(function (middleware) {
      return middleware.name === name;
    });

    return found.length > 0 ? found[0] : null;
  },

  status: function (name, handler) {
    if (!this.middlewares) {
      this.register('status', Api.middlewares.status());
    }

    var status = this.middleware("status");

    status.fn.set(name, handler);

    return status;
  },

  register: function (name, fn) {
    if (!this.middlewares) {
      this.middlewares = [];
    }

    this.middlewares.push({
      name: name,
      fn: fn
    });
  },

  _applyMiddlewares: function (req, service) {
    if (!this.middlewares) {
      return function () {};
    }

    var stack = [];

    var next = function () {
      return new Promise(function (resolve, reject) {
        stack.push([resolve, reject]);
      });
    };

    this.middlewares
      .filter(function (middleware) {
        if (!service) {
          return true;
        }
        return !service.use || (service.use && service.use[middleware.name] !== false);
      })
      .forEach(function (middleware, index) {
        middleware.fn(req, next, service);
      }, this);

    return function (err, response) {
      stack.reverse().forEach(function (promise) {
        if (err) {
          return promise[1](err);
        }
        return promise[0](response);
      });
    };
  }
};

export default Api;
