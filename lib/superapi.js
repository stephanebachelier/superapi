import Api from './superapi/api';

function superapi(config) {
  return new Api(config);
}

superapi.prototype.Api = Api;

// export API
export default superapi;
