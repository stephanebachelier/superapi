export default function (config) {
  config = config || {};
  var log = config.log || null;

  var timer = (window.performance || {
    now: Date.now
  });

  return function (req, next) {
    if (!log) {
      return;
    }

    var start = timer.now();
    next()
      .then(function (res) {
        log(timer.now() - start);
      })
      .catch(function (error) {
        log(timer.now() - start);
      });
  };
};
