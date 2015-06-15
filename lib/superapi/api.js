import Configuration from "./configuration";
import wrapper from "./agent/wrapper";

function Api(config) {
  // add a default configuration
  this.configurations = {};

  if (config) {
    // use default API if it exists
    this.configure(config);
  }
}

Api.prototype = {
  configure: function (name, config) {
    var conf = new Configuration(name, config);

    conf.bind(this.serviceHandler.bind(this));

    // copy api
    this.configurations[conf.name] = conf;

    // syntatic sugar
    this[conf.name] = conf.api;
  },

  /*
  retrieve service object given a name which should optionally be namespaced with
  configuration.
  */
  service: function (name) {
    if (!name) {
      return null;
    }

    var tokens = name.split(":");
    var namespace = tokens.length > 1 ? tokens[0] : "api";
    var service = tokens.length > 1 ? tokens[1] : tokens[0];

    // assert that user search the default configuration (api) if no namespace
    var configuration = this.configurations[namespace];

    if (!configuration) {
      return null;
    }

    return configuration.service(service);
  },

  serviceHandler: function (service) {
    var self = this;

    return function (options) {
      options = options || {};
      var data = options.data || {};
      var params = options.params || {};
      var query = options.query || {};

      var serviceDesc = this.request(service, data, params, query);

      return new Promise(function (resolve, reject) {
        if (!self.agentWrapper) {
          reject("missing agent");
        }

        self.agentWrapper.serviceHandler.call(self.agentWrapper, serviceDesc, {
          edit: options.edit || null,
          callback: options.callback || null,
          resolve: resolve,
          reject: reject
        });
      });
    };
  },

  withSuperagent: function (agent) {
    this.agentWrapper = new wrapper.superagent(agent);
    return this;
  },

  request: function (method, url, data, options) {
    if (!this.agentWrapper) {
      throw new Error("missing agent");
    }

    return this.agentWrapper.request(method, url, data, options);
  },

  get: function (url, data, options) {
    return this.request("get", url, data, options);
  },

  post: function (url, data, options) {
    return this.request("post", url, data, options);
  },

  put: function (url, data, options) {
    return this.request("put", url, data, options);
  },

  del: function (url, data, options) {
    return this.request("del", url, data, options);
  },

  patch: function (url, data, options) {
    return this.request("patch", url, data, options);
  },

  head: function (url, data, options) {
    return this.request("head", url, data, options);
  }
};

export default Api;
