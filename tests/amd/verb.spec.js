define([
  'superapi',
  'superagent'
], function (superapi, superagent) {
  'use strict';

  describe('_httpVerb method', function () {

    describe('call', function () {
      var api;
      var server;

      beforeEach(function () {
        api = superapi.default({
          baseUrl: 'http://example.tld'
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

      it('should send GET request to a path', function (done) {
        // configure response
        server.respondWith('GET',
          'http://example.tld/foo',
          [200, {'Content-Type': 'application/json'}, '{"result": "ok"}']
        );

        api._httpVerb('get', 'http://example.tld/foo').then(function (res) {
          res.req.url.should.eql('http://example.tld/foo');
          done();
        });

        server.respond();
      });

      it('should send GET request to an absolute url', function (done) {
        // configure response
        server.respondWith('GET',
          'http://example.tld/foo',
          [200, {'Content-Type': 'application/json'}, '{"result": "ok"}']
        );

        api._httpVerb('get', '/foo').then(function (res) {
          res.req.url.should.eql('http://example.tld/foo');
          done();
        });

        server.respond();
      });
    });

    describe('request', function () {
      var api;
      var server;

      beforeEach(function () {
        api = superapi.default({
          baseUrl: 'http://example.tld'
        });
        api.agent = superagent;

        // add sinon to fake the XHR call
        server = sinon.fakeServer.create();

        server.respondWith('GET',
          'http://example.tld/foo',
          [200, {'Content-Type': 'application/json'}, '{"result": "ok"}']
        );
      });

      afterEach(function () {
        server.restore();
        server = null;
        api = null;
      });

      it('should obey global headers', function (done) {
        api.config.headers = {
          foo: 1234
        }

        var editFn = function (req) {
          req.header.should.have.property('foo', 1234);
        };

        api._httpVerb('get', '/foo', { edit: editFn }).then(function () {
          done();
        });

        server.respond();
      });

      it('should obey runtime headers', function (done) {
        api.addHeader('xyz', 'abc');

        var editFn = function (req) {
          req.header.should.have.property('xyz', 'abc');
        };

        api._httpVerb('get', '/foo', { edit: editFn }).then(function () {
          done();
        });

        server.respond();
      });

      it('should obey global options', function (done) {
        api.config.options = {
          accept: 'json'
        }

        var editFn = function (req) {
          req.header.should.have.property('content-type', 'json');
        };

        api._httpVerb('get', '/foo').then(function () {
          done();
        });

        server.respond();
      });

      it('should obey global timeout configuration', function (done) {
        api.config.options = {
          timeout: 100
        };

        api._httpVerb('get', '/foo').catch(function (error) {
          error.message.should.match(/timeout/);
          done();
        });
      });
    });

    describe('helpers', function () {
      var api;
      var server;

      beforeEach(function () {
        api = superapi.default({
          baseUrl: 'http://example.tld'
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

      it('should send a GET request', function (done) {
        server.respondWith('GET',
          'http://example.tld/foo',
          [200, {'Content-Type': 'application/json'}, '{"result": "ok"}']
        );

        api.get('http://example.tld/foo').then(function (resp) {
          resp.req.url.should.eq('http://example.tld/foo');
          done();
        });

        server.respond();
      });

      it('should send a POST request', function (done) {
        server.respondWith('POST',
          'http://example.tld/foo',
          [200, {'Content-Type': 'application/json'}, '{"result": "ok"}']
        );

        api.post('http://example.tld/foo').then(function (resp) {
          resp.req.url.should.eq('http://example.tld/foo');
          done();
        });

        server.respond();
      });

      it('should send a PUT request', function (done) {
        server.respondWith('PUT',
          'http://example.tld/foo',
          [200, {'Content-Type': 'application/json'}, '{"result": "ok"}']
        );

        api.put('http://example.tld/foo').then(function (resp) {
          resp.req.url.should.eq('http://example.tld/foo');
          done();
        });

        server.respond();
      });

      it('should send a DELETE request', function (done) {
        server.respondWith('DELETE',
          'http://example.tld/foo',
          [200, {'Content-Type': 'application/json'}, '{"result": "ok"}']
        );

        api.del('http://example.tld/foo').then(function (resp) {
          resp.req.url.should.eq('http://example.tld/foo');
          done();
        });

        server.respond();
      });

      it('should send a PATCH request', function (done) {
        server.respondWith('PATCH',
          'http://example.tld/foo',
          [200, {'Content-Type': 'application/json'}, '{"result": "ok"}']
        );

        api.patch('http://example.tld/foo').then(function (resp) {
          resp.req.url.should.eq('http://example.tld/foo');
          done();
        });

        server.respond();
      });

      it('should send a HEAD request', function (done) {
        server.respondWith('HEAD',
          'http://example.tld/foo',
          [200, {'Content-Type': 'application/json'}, '{"result": "ok"}']
        );

        api.head('http://example.tld/foo').then(function (resp) {
          resp.req.url.should.eq('http://example.tld/foo');
          done();
        });

        server.respond();
      });
    })
  });
});
