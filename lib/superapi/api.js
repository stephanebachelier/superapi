import Configuration from "./configuration";
import Wrapper from "./agent/wrapper";

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
    this.agentWrapper = new Wrapper.superagent(agent);
  },

  request: function (method, url, data, options) {
    if (!this.agentWrapper) {
      throw new Error("missing agent.");
    }

    return this.agentWrapper.request(method, url, data, options);
  }
};

export default Api;
