define([
  'superapi'
], function (superapi) {
  'use strict';

  describe('request url', function () {
    it('should append the service url to the baseUrl', function () {
      var api = superapi.default({
        baseUrl: 'http://foo.domain.tld/api',
        services: {
          foo: {
            path: '/foo'
          }
        }
      });

      api.url('foo').should.eql('http://foo.domain.tld/api/foo');
    });

    it('should add a slash in front of route path if missing', function () {
      var api = superapi.default({
        baseUrl: 'http://foo.domain.tld/api',
        services: {
          foo: {
            path: 'foo'
          }
        }
      });

      api.url('foo').should.eql('http://foo.domain.tld/api/foo');
    });

    it('should support route as a string', function () {
      var api = superapi.default({
        baseUrl: 'http://foo.domain.tld/api',
        services: {
          foo: 'bar'
        }
      });

      api.url('foo').should.eql('http://foo.domain.tld/api/bar');
    });

    it('should throw error if path is missing', function () {
      var api = superapi.default({
        baseUrl: 'http://foo.domain.tld/api',
        services: {
          foo: {}
        }
      });

      api.url.bind(null, 'foo').should.throw();
    });
  });

  describe('request method', function () {
    it('should default to get', function () {
      var api = superapi.default({
        baseUrl: 'http://foo.domain.tld/api',
        services: {
          foo: 'bar'
        }
      });

      api.request('foo').method.should.eql('GET');
    });

    it('should support POST', function () {
      var api = superapi.default({
        baseUrl: 'http://foo.domain.tld/api',
        services: {
          foo: {
            path: 'bar',
            method: 'POST'
          }
        }
      });

      api.request('foo').method.should.eql('POST');
    });

    it('should support PUT', function () {
      var api = superapi.default({
        baseUrl: 'http://foo.domain.tld/api',
        services: {
          foo: {
            path: 'bar',
            method: 'PUT'
          }
        }
      });

      api.request('foo').method.should.eql('PUT');
    });

    it('should support DELETE', function () {
      var api = superapi.default({
        baseUrl: 'http://foo.domain.tld/api',
        services: {
          foo: {
            path: 'bar',
            method: 'DELETE'
          }
        }
      });

      api.request('foo').method.should.eql('DELETE');
    });

    it('should support HEAD', function () {
      var api = superapi.default({
        baseUrl: 'http://foo.domain.tld/api',
        services: {
          foo: {
            path: 'bar',
            method: 'HEAD'
          }
        }
      });

      api.request('foo').method.should.eql('HEAD');
    });

    it('should support PATCH', function () {
      var api = superapi.default({
        baseUrl: 'http://foo.domain.tld/api',
        services: {
          foo: {
            path: 'bar',
            method: 'PATCH'
          }
        }
      });

      api.request('foo').method.should.eql('PATCH');
    });
  });

  describe.skip('request headers', function () {
  });
});
