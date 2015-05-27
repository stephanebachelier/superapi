import Configuration from "./configuration";

function Api(config) {
  // add a default configuration
  this.configurations = {};

  if (config) {
    this.configure(config);
  }
}

Api.prototype = {
  configure: function (name, config) {
    var conf = new Configuration(name, config);

    conf.bind(this.serviceHandler.bind(this));

    // copy api
    this.configurations[conf.name] = conf;
  },

  request: function (method, url, data, options) {
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

  _request: function (serviceDesc) {
    var method = serviceDesc.method;
    var url = serviceDesc.url;
    var data = serviceDesc.data;
    var options = serviceDesc;

    delete options.method;
    delete options.url;
    delete options.data;

    return this.request(method, url, data, options);
  },

  serviceHandler: function(service) {
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
    return function(options) {
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

        req.end(callback ? callback : function(err, res) {
          if(err) {
            reject(err);
          }
          else {
            (!res.error ? resolve : reject)(res);
          }
        });

        req.on("abort", reject);
      });
    };
  }
};

export default Api;
