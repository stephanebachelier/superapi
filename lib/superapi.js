import Api from './superapi/api';
import serviceHandler from './superapi/service-handler';
import status from './superapi/middlewares/status';

function superapi(config) {
  return new Api(config);
}

Api.serviceHandler = serviceHandler;

Api.middlewares = {
  status: status
};

superapi.prototype.Api = Api;

// export API
export default superapi;
