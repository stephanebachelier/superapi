var Superagent = function (agent) {
  this.agent = agent;
};

Superagent.prototype = {
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

  _setHeaders: function (req, headers) {
    if (!req) {
      return;
    }

    for (var header in headers) {
      req.set(header, headers[header]);
    }
  },

  _setOptions: function (req, options) {
    if (!req) {
      return;
    }

    for (var option in options) {
      var method = req[option];

      if (!method) {
        throw new Error("unsupported option `" + option + "``");
      }

      method.call(req, options[option]);
    }
  },

  _request: function (serviceDesc) {
    if (!serviceDesc) {
      throw new Error("invalid serviceDesc");
    }

    var method = serviceDesc.method;
    var url = serviceDesc.url;
    var data = serviceDesc.data;
    var options = serviceDesc;

    // FIXME go the immutability way
    delete options.method;
    delete options.url;
    delete options.data;

    return this.request(method, url, data, options);
  },

  serviceHandler: function (serviceDesc, options) {
    var callback = options.callback || null;
    var edit = options.edit || null;
    var resolve = options.resolve;
    var reject = options.reject;

    // create request
    var req = this._request(serviceDesc);

    // edit  request if function defined
    if (edit && "function" === typeof edit) {
      edit(req);
    }

    req.on("error", reject);

    req.end(callback ? callback : function (err, res) {
      if (err) {
        reject(err);
      }
      else {
        (!res.error ? resolve : reject)(res);
      }
    });

    req.on("abort", reject);

    return req;
  }
};

export default Superagent;
