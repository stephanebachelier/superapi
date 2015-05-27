import Api from './superapi/api';
import Configuration from './superapi/configuration';
import Service from './superapi/service';
import urlize from './superapi/urlize';

function superapi(config) {
  return new Api(config);
}

superapi.Api = Api;
superapi.Configuration = Configuration;
superapi.Service = Service;
superapi.urlize = urlize;

// export API
export default superapi;
