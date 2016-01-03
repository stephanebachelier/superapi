"use strict";
var Api = require("./superapi/api")["default"];
var serviceHandler = require("./superapi/service-handler")["default"];
var status = require("./superapi/middlewares/status")["default"];

function superapi(config) {
  return new Api(config);
}

Api.serviceHandler = serviceHandler;

Api.middlewares = {
  status: status
};

superapi.prototype.Api = Api;

// export API
exports["default"] = superapi;