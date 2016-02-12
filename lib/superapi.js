import Api from './superapi/api';
import Agent from './superapi/agent';
import serviceHandler from './superapi/service-handler';
import status from './superapi/middlewares/status';

function superapi(config) {
  return new Api(config);
}

Api.defaults = {
  agent: Agent,
  serviceHandler: serviceHandler,
  middlewares: {
    status: status
  }
};

superapi.prototype.Api = Api;

// export API
export default superapi;
