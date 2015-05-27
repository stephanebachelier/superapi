import urlize from "./urlize";

function Service(id, config) {
  this.id = id;
  this.config = config;
}

Service.prototype.url = function (params, query) {
  return urlize.urlize({
    baseUrl: this.baseUrl,
    resource: this.config,
    params: params,
    query: query
  });
};

Service.prototype.method = function () {
  return typeof this.config === "string" ? "get" : (this.config.method || "get").toLowerCase();
};

Service.prototype.options = function () {
  return {
    options: this.config.options || {},
    headers: this.config.headers || {}
  };
};

Service.prototype.data = function (data) {
  var obj = this.config.data || {};

  for (var name in data) {
    obj[name] = data[name];
  }

  return obj;
};

Service.prototype.request = function (data, params, query) {
  return {
    method: this.method(),
    url: this.url(params, query),
    data: this.data(data)
  };
};

export default Service;
