export default function serviceHandler (sid) {
  /*
   * Below are the supported options for the serviceHandler:
   *
   * - data (object): request data payload
   * - params (object): use to replace the tokens in the url
   * - query (object): use to build the query string appended to the url
   * - callback (function): callback to use, with a default which emits 'success' or 'error'
   *   event depending on res.ok value
   * - edit (function): callback to use, to tweak req if needed.
   */
  return function(options) {
    return new Promise(function (resolve, reject) {
      options = options || {};
      var data = options.data || {};
      var params = options.params || {};
      var query = options.query || {};
      var callback = options.callback || null;
      var edit = options.edit || null;

      var req = this.request(sid, data, params, query, options.method);

      // edit request if function defined
      if (edit && "function" === typeof edit) {
        edit(req);
      }

      var result = function (resolver, middlewares) {
        return function (error, response) {
          if (middlewares) {
            middlewares.reverse().forEach(function (middleware) {
              if (error) {
                middleware[1](error);
              }
              middleware[0](response);
            });
          }

          resolver(error, response);

          if (callback) {
            callback(error, response);
          }
        }
      }

      var stack = [];
      var failure = result(function (err, res) { reject(err); }, stack);
      var success = result(function (err, res) { resolve(res); }, stack);
      var agent = this.agent();

      return this._applyMiddlewares(req, sid, stack)
        .then(function (response) {
          return agent.handleResponse(req, response);
        })
        .then(function (res) {
          return success(null, res);
        })
        .catch(function (err) {
          return failure(err);
        });
    }.bind(this));
  };
};
