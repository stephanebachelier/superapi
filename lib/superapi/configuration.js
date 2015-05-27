import Service from "./service";

function isObject(obj) {
  return obj === Object(obj);
}

function Configuration(name, config) {
  if (isObject(name)) {
    config = name;
    name = "api";
  }

  this.name = name || "api";
  this.config = config || {};

  this.api = {};
  this.headers = {};
}

Configuration.prototype.bind = function (handler) {
  this.api = {};

  if (!this.config.services) {
    return;
  }

  for (var name in this.config.services) {
    if (!Object.prototype.hasOwnProperty(this, name)) {
      // syntatic sugar: install a service handler available on
      // the api instance with service name
      this.api[name] = handler(name).bind(this);
    }
  }
};

Configuration.prototype.service = function(id) {
  this.services = this.services || {};

  if (!this.services[id]) {
    var service = new Service(id, this.config.services[id]);
    service.baseUrl = this.config.baseUrl;

    this.services[id] = service;
  }

  return this.services[id];
};

Configuration.prototype.request = function(id, data, params, query) {
  var service = this.service(id);

  var descriptor = service.request(data, params, query);

  // config headers and options
  descriptor.config = {
    headers: this.config.headers || {},
    options: this.config.options || {}
  };

  // service headers and options
  descriptor.service = service.options();

  // runtime headers
  descriptor.headers = this.headers || {};

  descriptor.withCredentials = this.config.withCredentials || false;

  return descriptor;
};

Configuration.prototype.addHeader = function(name, value) {
  this.headers = this.headers || {};
  this.headers[name] = value;
};

Configuration.prototype.removeHeader = function(name) {
  if (this.headers && this.headers[name]) {
    delete this.headers[name];
  }
};

export default Configuration;
