define([
  'superapi',
  'superagent'
], function (superapi, superagent) {
  'use strict';

  describe('middlewares', function () {
    describe('request', function () {
      var api;
      var server;

      beforeEach(function () {
        api = superapi.default({
          baseUrl: 'http://example.tld',
          services: {
            foo: {
              path:'foo'
            }
          },
          options: {
            timeout: 100
          }
        });
        api.agent = superagent;

        // add sinon to fake the XHR call
        server = sinon.fakeServer.create();
      });

      afterEach(function () {
        server.restore();
        server = null;
        api = null;
      });

      it('should execute middleware', function (done) {
        // configure response
        server.respondWith('GET',
          'http://example.tld/foo',
          [200, {'Content-Type': 'application/json'}, '{"result": "ok"}']
        );

        var middlewareFn = sinon.spy(function (req) {});

        api.register('bar', middlewareFn);

        api.api.foo().then(function (res) {
          res.req.url.should.eql('http://example.tld/foo');

          middlewareFn.should.have.been.called;
          done();
        });

        server.respond();
      });

      it('should be able to modify request', function (done) {
        // configure response
        server.respondWith('GET',
          'http://example.tld/i-ve-been-hijacked',
          [200, {'Content-Type': 'application/json'}, '{"result": "ok"}']
        );

        var middlewareFn = sinon.spy(function (req) {
          req.url = 'http://example.tld/i-ve-been-hijacked';
        });

        api.register('bar', middlewareFn);

        api.api.foo().then(function (res) {
          res.req.url.should.eql('http://example.tld/i-ve-been-hijacked');

          middlewareFn.should.have.been.called;
          done();
        });

        server.respond();
      });

      it('should access response on success', function (done) {
        // configure response
        server.respondWith('GET',
          'http://example.tld/foo',
          [200, {'Content-Type': 'application/json'}, '{"result": "ok"}']
        );

        var responseHandler = sinon.spy(function (res) {
          res.req.url.should.eql('http://example.tld/foo');
        });

        var middlewareFn = sinon.spy(function (response) {
          responseHandler.should.have.been.called;

          response.status.should.eql(200);
          response.body.should.eql({result: 'ok'});

          done();
        });

        api.register('bar', function (req, next) {
          next().then(middlewareFn);
        });

        api.api.foo().then(responseHandler);

        server.respond();
      });

      it('should access response error', function (done) {
        // configure response
        // server.respondWith('GET',
        //   'http://example.tld/foo',
        //   [200, {'Content-Type': 'application/json'}, '{"result": "ok"}']
        // );
        var errorHandler = sinon.spy(function (error) {
          error.status.should.eql(404);
        });

        var middlewareFn = function (error) {
          errorHandler.should.have.been.called;

          done();
        };

        api.register('bar', function (req, next) {
          next().catch(middlewareFn);
        });

        api.api.foo().catch(errorHandler);

        server.respond();
      });

      it('should access abort error', function (done) {
        // configure response
        // server.respondWith('GET',
        //   'http://example.tld/foo',
        //   [200, {'Content-Type': 'application/json'}, '{"result": "ok"}']
        // );
        var errorHandler = sinon.spy(function (error) {
          error.should.have.property('aborted', true);
        });

        var middlewareFn = function (error) {
          errorHandler.should.have.been.called;
          error.should.have.property('aborted', true);

          done();
        };

        var request; // to memorize request

        api.register('bar', function (req, next) {
          request = req;

          next().catch(middlewareFn);
        });

        api.api.foo().catch(errorHandler);

        request.abort();
      });

      it('should access error on timeout', function (done) {
        // configure response
        // server.respondWith('GET',
        //   'http://example.tld/foo',
        //   [200, {'Content-Type': 'application/json'}, '{"result": "ok"}']
        // );
        var errorHandler = sinon.spy(function (error) {
          error.message.match(/timeout/);
        });

        var middlewareFn = function (error) {
          errorHandler.should.have.been.called;
          error.message.match(/timeout/);

          done();
        };

        api.register('bar', function (req, next) {
          next().catch(middlewareFn);
        });

        api.api.foo().catch(errorHandler);
      });
    });

    describe('configuration', function () {
      var api;
      var server;

      beforeEach(function () {
        api = superapi.default({
          baseUrl: 'http://example.tld',
          services: {
            foo: {
              path: 'foo'
            },
            bar: {
              path: 'bar',
              use: {
                tracker: false
              }
            }
          }
        });
        api.agent = superagent;

        // custom tracker header middleware
        api.register('tracker', function (req) {
          req.set('X-TRACKER-ID', 1234);
        });

        // add sinon to fake the XHR call
        server = sinon.fakeServer.create();
      });

      afterEach(function () {
        server.restore();
        server = null;
        api = null;
      });

      it('should execute tracker middleware', function (done) {
        // configure response
        server.respondWith('GET',
          'http://example.tld/foo',
          [200, {'Content-Type': 'application/json'}, '{"result": "ok"}']
        );
        var spyMiddleware = sinon.spy(function (req) {
          req.header.should.have.property('X-TRACKER-ID', 1234);
        });

        api.register('spy', spyMiddleware);

        api.api.foo().then(function (res) {
          spyMiddleware.should.have.been.called;
          done();
        });

        server.respond();
      });

      it('should disable tracker middleware by setting `use: false`', function (done) {
        // configure response
        server.respondWith('GET',
          'http://example.tld/bar',
          [200, {'Content-Type': 'application/json'}, '{"result": "ok"}']
        );
        var spyMiddleware = sinon.spy(function (req) {
          req.header.should.not.have.property('X-TRACKER-ID');
        });

        api.register('spy', spyMiddleware);

        api.api.bar().then(function (res) {
          spyMiddleware.should.have.been.called;
          done();
        });

        server.respond();
      });

      it('should not break everything if a middleware breaks', function (done) {
        // configure response
        server.respondWith('GET',
          'http://example.tld/bar',
          [200, {'Content-Type': 'application/json'}, '{"result": "ok"}']
        );
        var spyMiddleware = sinon.spy(function (req) {
          throw new Error('boo!');
        });

        var thenSpy = sinon.spy(function () {});

        api.register('spy', spyMiddleware);

        api.api.foo()
          .then(thenSpy)
          .catch(function (err, res) {
            err.message.should.eql('boo!');
            
            thenSpy.should.not.have.been.called;
            spyMiddleware.should.been.called;
            done();
          });

        server.respond();
      });
    });

    describe('multiple middlewares', function () {
      var api;
      var server;

      beforeEach(function () {
        api = superapi.default({
          baseUrl: 'http://example.tld',
          services: {
            foo: {
              path: 'foo'
            },
            bar: {
              path: 'bar',
              use: {
                tracker: false
              }
            }
          }
        });
        api.agent = superagent;

        // custom middlewares
        api.register('foo', function (req) {
          req.set('foo', 'foo');
        });

        api.register('bar', function (req) {
          req.set('bar', 'bar');
        });

        // add sinon to fake the XHR call
        server = sinon.fakeServer.create();
      });

      afterEach(function () {
        server.restore();
        server = null;
        api = null;
      });

      it('should all be executed', function (done) {
        // configure response
        server.respondWith('GET',
          'http://example.tld/foo',
          [200, {'Content-Type': 'application/json'}, '{"result": "ok"}']
        );
        var spyMiddleware = sinon.spy(function (req) {
          req.header.should.have.property('foo', 'foo');
          req.header.should.have.property('bar', 'bar');
        });

        api.register('spy', spyMiddleware);

        api.api.foo().then(function (res) {
          spyMiddleware.should.have.been.called;
          done();
        });

        server.respond();
      });
    });
  });
});
