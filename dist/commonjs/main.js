"use strict";
var Api = require("./superapi/api")["default"];
var serviceHandler = require("./superapi/service-handler")["default"];

function superapi(config) {
  return new Api(config);
}

Api.serviceHandler = serviceHandler;
superapi.prototype.Api = Api;

// export API
exports["default"] = superapi;