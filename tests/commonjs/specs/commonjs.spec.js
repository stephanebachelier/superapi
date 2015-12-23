describe('superapi browser simple test suite', function () {
  var api;

  before(function () {
    api = superapi({
      baseUrl: 'http://localhost:4000',
      services: {
        ping: {
          path: 'ping'
        },
        foo: {
          path: 'foo/:plop',
          method: 'POST'
        }
      }
    });
    api.agent = superagent;
  });

  it('should be able to call a get resource', function (done) {
    api.api.ping()
      .then(function (res) {
        res.text.should.eq('pong');
        done();
      })
      .catch(function () {
        done();
      });

  });

  it('should be able to call a post resource with a parameterized URL', function (done) {
    api.api.foo({
      params: {
        plop: 'bar'
      }
    }).then(function (res) {
        res.text.should.eq('bar');
        done();
      })
      .catch(function () {
        done();
      });

  });

  it('should be able to call a post resource with a parameterized URL', function (done) {
    api.api.foo({
      params: {
        plop: 'baz'
      }
    }).then(function (res) {
        res.text.should.eq('baz');
        done();
      })
      .catch(function () {
        done();
      });

  });
});
