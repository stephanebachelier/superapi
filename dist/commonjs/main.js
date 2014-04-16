"use strict";
var Api = require("./superapi/api")["default"];

function superapi(config) {
  return new Api(config);
}

superapi.prototype.Api = Api;

// export API
exports["default"] = superapi;