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
  });
});
