import Api from "./superapi/api";
import Configuration from "./superapi/configuration";
import Service from "./superapi/service";
import urlize from "./superapi/urlize";
import wrapper from "./superapi/agent/wrapper";

function superapi(config) {
  return new Api(config);
}

superapi.Api = Api;
superapi.Configuration = Configuration;
superapi.Service = Service;
superapi.urlize = urlize;
superapi.agentWrapper = wrapper;

// export API
export default superapi;
