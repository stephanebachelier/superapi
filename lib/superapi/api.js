import "superagent";

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
      var path = resource.path || '';

      url += path[0] === '/' ? path : '/' + path;
    }

    return url;
  },

  request: function (id, data) {
    var service = this.service(id);
    var request = superagent[service.method || 'get'];
    if (!request) {
      throw new Error('Invalid method [' + service.method + ']');
    }

    var _req = request(this.url(id), data);

 		// add some options to request
    for (var opts in service.options) {
      _req[opts](service.options[opts]);
    }

    // add some headers
    for (var header in service.headers) {
      _req.set(header, service.headers[header]);
    }

    return _req;
  }
};

export default Api;
