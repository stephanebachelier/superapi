// closure
var serviceHandler = function(sid) {
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
  return function(options) {
    options = options || {};
    var data = options.data || {};
    var params = options.params || {};
    var query = options.query || {};
    var callback = options.callback || null;
    var edit = options.edit || null;

    var req = this.request(sid, data, params, query, options.method);

    // edit request if function defined
    if (edit && "function" === typeof edit) {
      edit(req);
    }

    // middleware response handler
    var applyMiddlewares = this._applyMiddlewares(req, this.service(sid));

    return new Promise(function (resolve, reject) {
      var failure = function (err) {
        reject(err);
        applyMiddlewares(err);
      };

      var success = function (res) {
        resolve(res);
        applyMiddlewares(null, res);
      };

      req.on('error', failure);
      req.on('abort', function () {
        var error = new Error('Request has been aborted');
        error.aborted = true;

        failure(error);
      });

      req.end(callback ? callback : function (err, res) {
        var error = err || res.error;
        if (error) {
          return failure(error);
        }

        success(res);
      });
    });
  };
};

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
        this.api[name] = serviceHandler(name).bind(this);
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
