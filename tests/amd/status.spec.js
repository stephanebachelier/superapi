define([
  'superapi',
  'superagent'
], function (superapi, superagent) {
  'use strict';

  describe('status middleware', function () {
    describe('handler', function () {
      var api;
      var server;

      beforeEach(function () {
        api = superapi.default({
          baseUrl: 'http://example.tld',
          services: {
            foo: '/foo'
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

      it('should be able to add a callback for a 200 response', function (done) {
        // configure response
        server.respondWith('GET',
          'http://example.tld/foo',
          [200, {'Content-Type': 'application/json'}, '{"result": "ok"}']
        );

        var middlewareFn = sinon.spy(function (req, res) {
          req.should.be.an.instanceOf(superagent.Request);
          res.should.be.an.instanceOf(superagent.Response);
          res.status.should.eq(200);

          done();
        });

        api.status(200, middlewareFn);

        api.api.foo().then(function (res) {
          res.req.url.should.eql('http://example.tld/foo');
        });

        server.respond();
      });

      it('should be able to add a callback for a 304 response', function (done) {
        // configure response
        server.respondWith('GET',
          'http://example.tld/foo',
          [304, {'Content-Type': 'application/json'}, '{"result": "ok"}']
        );

        var middlewareFn = sinon.spy(function (req, res) {
          req.should.be.an.instanceOf(superagent.Request);
          res.should.be.an.instanceOf(superagent.Response);
          res.status.should.eq(304);

          done();
        });

        api.status(304, middlewareFn);

        api.api.foo().catch(function (error) {
          error.status.should.eql(304);
        });

        server.respond();
      });

      it('should be able to add a callback for a 401 response', function (done) {
        // configure response
        server.respondWith('GET',
          'http://example.tld/foo',
          [401, {'Content-Type': 'application/json'}, '{"result": "ok"}']
        );

        var middlewareFn = sinon.spy(function (req, res) {
          req.should.be.an.instanceOf(superagent.Request);
          res.should.be.an.instanceOf(superagent.Response);
          res.status.should.eq(401);

          done();
        });

        api.status(401, middlewareFn);

        api.api.foo().catch(function (error) {
          error.status.should.eql(401);
        });

        server.respond();
      });

      it('should be able to add a callback for a 500 response', function (done) {
        // configure response
        server.respondWith('GET',
          'http://example.tld/foo',
          [500, {'Content-Type': 'text'}, 'The server made a boo']
        );

        var middlewareFn = sinon.spy(function (req, res) {
          req.should.be.an.instanceOf(superagent.Request);
          res.should.be.an.instanceOf(superagent.Response);
          res.status.should.eq(500);

          done();
        });

        api.status(500, middlewareFn);

        api.api.foo().catch(function (error) {
          error.status.should.eql(500);
          error.message.should.eql('Internal Server Error');
        });

        server.respond();
      });
    });

    describe('multiple handlers', function () {
      var api;
      var server;
      var status200Fn;
      var status400Fn;

      function statusSpyHandler (status) {
        return sinon.spy(function (req, res) {
          req.should.be.an.instanceOf(superagent.Request);
          res.should.be.an.instanceOf(superagent.Response);
          res.status.should.eq(status);
        });
      }

      function wrapHandler(fn, testFn) {
        return function (req, res) {
          fn(req, res);

          testFn();
        }
      }

      function registerHandlers(handlers, testFn) {
        handlers.forEach(function (handler) {
          api.status(handler[0], wrapHandler(handler[1], testFn));
        });
      }

      beforeEach(function () {
        api = superapi.default({
          baseUrl: 'http://example.tld',
          services: {
            foo: '/foo'
          }
        });
        api.agent = superagent;

        // add sinon to fake the XHR call
        server = sinon.fakeServer.create();

        status200Fn = statusSpyHandler(200);
        status400Fn = statusSpyHandler(400)
      });

      afterEach(function () {
        server.restore();
        server = null;
        api = null;

        status200Fn = null;
        status400Fn = null;
      });

      it('should be able to trigger successful handler', function (done) {
        // configure response
        server.respondWith('GET',
          'http://example.tld/foo',
          [200, {'Content-Type': 'application/json'}, '{"result": "ok"}']
        );

        registerHandlers([
          [200, status200Fn],
          [400, status400Fn]
        ], function () {
          status200Fn.should.have.been.called;
          status400Fn.should.not.have.been.called;

          done();
        });

        api.api.foo().then(function (res) {
          res.req.url.should.eql('http://example.tld/foo');
        });

        server.respond();
      });

      it('should be able to trigger error handler', function (done) {
        // configure response
        server.respondWith('GET',
          'http://example.tld/foo',
          [400, {}, 'Bad Request']
        );

        registerHandlers([
          [200, status200Fn],
          [400, status400Fn]
        ], function () {
          status200Fn.should.not.have.been.called;
          status400Fn.should.have.been.called;

          done();
        });

        api.api.foo().catch(function (error) {
          error.status.should.eq(400);
        });

        server.respond();
      });
    });
  });
});
