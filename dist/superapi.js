(function(globals) {
var define, requireModule;

(function() {
  var registry = {}, seen = {};

  define = function(name, deps, callback) {
    registry[name] = { deps: deps, callback: callback };
  };

  requireModule = function(name) {
    if (seen[name]) { return seen[name]; }
    seen[name] = {};

    var mod = registry[name];
    if (!mod) {
      throw new Error("Module '" + name + "' not found.");
    }

    var deps = mod.deps,
        callback = mod.callback,
        reified = [],
        exports;

    for (var i=0, l=deps.length; i<l; i++) {
      if (deps[i] === 'exports') {
        reified.push(exports = {});
      } else {
        reified.push(requireModule(deps[i]));
      }
    }

    var value = callback.apply(this, reified);
    return seen[name] = exports || value;
  };
})();

define("superapi/api",
  ["superagent-es6","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var superagent = __dependency1__["default"];

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

        if (!tokens.length) {
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
        var request = superagent[method];
        if (!request) {
          throw new Error("Invalid method [" + service.method + "]");
        }

        var url = this.url(id);

        if (params) {
          url = this.buildUrl(url, params);
        }

        var _req = request(url, data);
        var header, opts;

        // add global headers
        for (header in this.config.headers) {
          _req.set(header, this.config.headers[header]);
        }

        // add global options to request headers
        for (opts in this.config.options) {
          _req[opts](this.config.options[opts]);
        }

        // add service options to request headers
        for (opts in service.options) {
          _req[opts](service.options[opts]);
        }

        // add service headers
        for (header in service.headers) {
          _req.set(header, service.headers[header]);
        }

        // set credentials
        if (this.config.withCredentials) {
          _req.withCredentials();
        }

        return _req;
      }
    };

    __exports__["default"] = Api;
  });
define("superapi",
  ["./superapi/api","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Api = __dependency1__["default"];

    function superapi(config) {
      return new Api(config);
    }

    superapi.prototype.Api = Api;

    // export API
    __exports__["default"] = superapi;
  });
window.superapi = requireModule("superapi");
})(window);