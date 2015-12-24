import Api from './superapi/api';
import serviceHandler from './superapi/service-handler';

function superapi(config) {
  return new Api(config);
}

Api.serviceHandler = serviceHandler;
superapi.prototype.Api = Api;

// export API
export default superapi;
