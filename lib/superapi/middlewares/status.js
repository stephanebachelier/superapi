/*
# status handlers middleware
{
  304: fn,
  401: fn,
  403: fn,
};

*/

export default function () {
  var handlers = {};

  var middleware = function (req, next) {
    next()
      .then(function (res) {
        if (!res) {
          return;
        }

        var handler = handlers[res.status];
        if (!handler) {
          return;
        }

        return handler(req, res);
      })
      .catch(function (error) {
        var handler = handlers[error.status || error.reason];
        if (!handler) {
          return;
        }

        return handler(req, error.response ? error.response : error);
      });
  };

  middleware.set = function (code, handler) {
    handlers[code] = handler;
  };

  middleware.get = function (code) {
    return handlers[code];
  };

  return middleware;
};
