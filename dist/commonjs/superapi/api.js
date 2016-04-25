"use strict";
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

    if (this._agent) {
      this._agent.config = config;
    }

    for (var name in config.services) {
      if (!Object.prototype.hasOwnProperty(this, name)) {
        // syntatic sugar: install a service handler available on
        // the api instance with service name
        this.api[name] = Api.defaults.serviceHandler(name).bind(this);
      }
    }
  },

  agent: function() {
    if (!this._agent) {
      throw new Error("no agent configured");
    }
    return this._agent;
  },

  withAgent: function (agent) {
    if (!agent) {
      throw new Error("missing agent");
    }
    this._agent = new Api.defaults.agent(agent);

    if (this.config) {
      this._agent.config = this.config;
    }

    return this;
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

    return this.agent().buildRequest(method, this.buildUrl(id, params, query), data, options);
  },

  get: function(url, options, data) {
    return this._http('get', url, options, data);
  },

  post: function(url, options, data) {
    return this._http('post', url, options, data);
  },

  put: function(url, options, data) {
    return this._http('put', url, options, data);
  },

  del: function(url, options, data) {
    return this._http('del', url, options, data);
  },

  patch: function(url, options, data) {
    return this._http('patch', url, options, data);
  },

  head: function(url, options, data) {
    return this._http('head', url, options, data);
  },

  _http: function(method, url, options, data) {
    options = options || {};
    options.data = data;
    options.method = method;

    return Api.defaults.serviceHandler(url).call(this, options);
  },

  addHeader: function(name, value) {
    this.agent().addHeader(name, value);
  },

  removeHeader: function(name) {
    this.agent().removeHeader(name);
  },

  middleware: function (name) {
    if (!this.middlewares) {
      return null;
    }
    var found = this.middlewares.filter(function (middleware) {
      return middleware.name === name;
    });

    return found.length > 0 ? found[0] : null;
  },

  status: function (name, handler) {
    if (!this.middleware("status")) {
      this.register("status", Api.defaults.middlewares.status());
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

  _serviceMiddlewares: function (req, service) {
    if (!this.middlewares) {
      return [];
    }

    // Call all the active middlewares for this request and keep a record
    // if it's returning something.
    // Explicitly ignore any middleware returning undefined as it throws with
    // TypeError: Cannot read property 'Symbol(Symbol.iterator)' of undefined
    return this.middlewares.filter(function (middleware) {
      if (!service || !service.use) {
        return true;
      }
      return service.use && service.use[middleware.name] !== false;
    });
  },

  _applyMiddlewares: function (req, sid, stack) {
    var service = this.service(sid);
    var middlewares = this._serviceMiddlewares(req, service);

    // this is the middleware stack that will be called by each active middleware
    // for this request.
    var agent = this.agent();
    var next = function (index, response) {
      return new Promise(function (resolve, reject) {
        stack.push([resolve, reject]);

        if (index === middlewares.length - 1) {
          resolve(agent.handleResponse(req));
        }
      });
    };

    var iterator = Promise.resolve(middlewares.map(function (m, i) {
      return function () {
        return m.fn ? m.fn(req, next.bind(this, i), service) : null;
      }
    }));

    return iterator.reduce(function (response, f) {
      return response ? response : f();
    }, null);
  }
};

exports["default"] = Api;