import superagent from 'superagent';

function Api(config) {
  this.config = config;
}

Api.prototype = {
  service: function (id) {
    return this.config.services[id];
  },

  url: function (id) {
    var url = this.config.baseUrl;
    var resource = this.service(id);

    // from time being it's a simple map
    if (resource) {
      var path;

      if (typeof resource === 'string') {
        path = resource;
      }

      if (typeof resource === 'object' && resource.path !== undefined) {
        path = resource.path;
      }

      if (!path) {
        throw new Error('path is not defined for route $' + id)
      }

      url += path[0] === '/' ? path : '/' + path;
    }

    return url;
  },

  request: function (id, data) {
    var service = this.service(id);
    var method = (typeof service === 'string' ? 'get' : service.method || 'get').toLowerCase();
    // fix for delete being a reserved word
    if (method === 'delete') {
      method = 'del';
    }
    var request = superagent[method];
    if (!request) {
      throw new Error('Invalid method [' + service.method + ']');
    }

    var _req = request(this.url(id), data);

    // add global headers
    for (var header in this.config.headers) {
      _req.set(header, this.config.headers[header]);
    }

    // add service options to request headers
    for (var opts in service.options) {
      _req[opts](service.options[opts]);
    }

    // add service headers
    for (var header in service.headers) {
      _req.set(header, service.headers[header]);
    }

    return _req;
  }
};

export default Api;
