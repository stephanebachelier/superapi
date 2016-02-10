"use strict";
function Agent (agent) {
  if (!agent) {
    throw new Error("missing superagent or any api compatible agent.");
  }
  this.agent = agent;
}

Agent.prototype = {
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

  handleResponse: function (request, response) {
    return new Promise(function (resolve, reject) {
      if (response) {
        return resolve(response);
      }

      request.on("error", reject);
      request.on("abort", function () {
        var error = new Error("Request has been aborted");
        error.aborted = true;

        reject(error);
      });

      request.end(function (err, res) {
        var error = err || res.error;
        if (error) {
          return reject(error);
        }

        resolve(res);
      });
    });
  }
}

exports["default"] = Agent;