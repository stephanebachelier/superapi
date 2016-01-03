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

      // middleware response handler
      var applyMiddlewares = this._applyMiddlewares(req, this.service(sid));

      var result = function (resolver) {
        return function (error, response) {
          resolver(error, response);
          applyMiddlewares(error, response);
        }
      }

      var failure = result(function (err, res) { reject(err); });
      var success = result(function (err, res) { resolve(res); });

      req.on('error', failure);
      req.on('abort', function () {
        var error = new Error('Request has been aborted');
        error.aborted = true;

        failure(error);
      });

      req.end(callback ? callback : function (err, res) {
        var error = err || res.error;
        if (error) {
          return failure(error, res);
        }

        success(null, res);
      });
    }.bind(this));
  };
};
