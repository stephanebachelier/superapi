define([
  'superapi',
  'superagent'
], function (superapi, superagent) {
  'use strict';

  describe('configuration', function () {
    it('should return the service string configuration', function () {
      var api = superapi.default({
        baseUrl: 'http://foo.domain.tld/api',
        services: {
          foo: 'bar'
        }
      });

      api.service('foo').should.eql('bar');
    });

    it('should return the service object configuration', function () {
      var api = superapi.default({
        baseUrl: 'http://foo.domain.tld/api',
        services: {
          foo: {
            path: '/foo'
          }
        }
      });

      api.service('foo').should.eql({path: '/foo'});
    });
  });

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

      // fail in PhantomJS as bind not available
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
      api.agent = superagent;
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
      api.agent = superagent;
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
      api.agent = superagent;
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
      api.agent = superagent;
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
      api.agent = superagent;
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
      api.agent = superagent;
      api.request('foo').method.should.eql('PATCH');
    });
  });

  describe.skip('request headers', function () {
  });

  describe('service request headers', function () {
    it('should add service headers', function () {
      var api = superapi.default({
        baseUrl: 'http://foo.domain.tld/api',
        services: {
          foo: {
            path: 'bar',
            headers: {
              'Content-type': 'json'
            }
          }
        }
      });
      api.agent = superagent;
      api.request('foo')._header.should.haveOwnProperty('content-type');
      api.request('foo')._header['content-type'].should.eql('json');
    });
  });

  describe('service request options', function () {
    it('should add headers options', function () {
      var api = superapi.default({
        baseUrl: 'http://foo.domain.tld/api',
        services: {
          foo: {
            path: 'bar',
            options: {
              type: 'json',
              accept: 'png'
            }
          }
        }
      });
      api.agent = superagent;
      api.request('foo')._header.should.haveOwnProperty('content-type');
      api.request('foo')._header['content-type'].should.eql('application/json');

      api.request('foo')._header.should.haveOwnProperty('accept');
      api.request('foo')._header.accept.should.eql('png');
    });
  });

  describe('global request headers', function () {
    it('should add service headers', function () {
      var api = superapi.default({
        baseUrl: 'http://foo.domain.tld/api',
        services: {
          foo: {
            path: 'bar',
          }
        },
        headers: {
          'Content-type': 'json',
          'X-Requested-With': 'XMLHttpRequest'
        }
      });
      api.agent = superagent;
      api.request('foo')._header.should.haveOwnProperty('content-type');
      api.request('foo')._header['content-type'].should.eql('json');

      api.request('foo')._header.should.haveOwnProperty('x-requested-with');
      api.request('foo')._header['x-requested-with'].should.eql('XMLHttpRequest');
    });
  });

  describe('global request options', function () {
    it('should add global headers', function () {
      var api = superapi.default({
        baseUrl: 'http://foo.domain.tld/api',
        services: {
          foo: {
            path: 'bar',
          }
        },
        headers: {
          'X-Requested-With': 'XMLHttpRequest'
        },
        options: {
          type: 'json',
          accept: 'json'
        }
      });
      api.agent = superagent;
      api.request('foo')._header.should.haveOwnProperty('content-type');
      api.request('foo')._header['content-type'].should.eql('application/json');

      api.request('foo')._header.should.haveOwnProperty('accept');
      api.request('foo')._header.accept.should.eql('application/json');

      api.request('foo')._header.should.haveOwnProperty('x-requested-with');
      api.request('foo')._header['x-requested-with'].should.eql('XMLHttpRequest');
    });
  });

  describe('global options', function () {
    it('should not override service option', function () {
      var api = superapi.default({
        baseUrl: 'http://foo.domain.tld/api',
        services: {
          foo: {
            path: 'bar',
            options: {
              type: 'form'
            }
          }
        },
        options: {
          type: 'json',
        }
      });
      api.agent = superagent;
      api.request('foo')._header.should.haveOwnProperty('content-type');
      api.request('foo')._header['content-type'].should.eql('application/x-www-form-urlencoded');
    });

    it('should not override service header', function () {
      var api = superapi.default({
        baseUrl: 'http://foo.domain.tld/api',
        services: {
          foo: {
            path: 'bar',
            headers: {
              'Content-type': 'application/x-www-form-urlencoded'
            }
          }
        },
        options: {
          type: 'json'
        }
      });
      api.agent = superagent;
      api.request('foo')._header.should.haveOwnProperty('content-type');
      api.request('foo')._header['content-type'].should.eql('application/x-www-form-urlencoded');
    });
  });

  describe('global headers', function () {
    it('should not override service option', function () {
      var api = superapi.default({
        baseUrl: 'http://foo.domain.tld/api',
        services: {
          foo: {
            path: 'bar',
            options: {
              type: 'form'
            }
          }
        },
        headers: {
          'Content-type': 'application/json',
        }
      });
      api.agent = superagent;
      api.request('foo')._header.should.haveOwnProperty('content-type');
      api.request('foo')._header['content-type'].should.eql('application/x-www-form-urlencoded');
    });

    it('should not override service header', function () {
      var api = superapi.default({
        baseUrl: 'http://foo.domain.tld/api',
        services: {
          foo: {
            path: 'bar',
            headers: {
              'Content-type': 'application/x-www-form-urlencoded'
            }
          }
        },
        headers: {
          'Content-type': 'application/json',
        }
      });
      api.agent = superagent;
      api.request('foo')._header.should.haveOwnProperty('content-type');
      api.request('foo')._header['content-type'].should.eql('application/x-www-form-urlencoded');
    });
  });

  describe('runtime headers', function () {
    it('should add header', function () {
      var api = superapi.default({
        baseUrl: 'http://foo.domain.tld/api',
        services: {
          foo: {
            path: 'bar',
            headers: {
              'Content-type': 'application/x-www-form-urlencoded'
            }
          }
        }
      });
      api.agent = superagent;
      api.addHeader('csrf', 'my-awesome-csrf-token');
      api.request('foo')._header.should.haveOwnProperty('csrf');
      api.request('foo')._header.csrf.should.eql('my-awesome-csrf-token');
    });
  });


  describe('url tokenization', function () {
    it('should replace tokens in url', function () {
      var api = superapi.default({});
      var url = api.buildUrl('/:bar/:foo.:baz.json', {
        bar: 'user',
        foo: 'john',
        baz: 'doe'
      });
      url.should.eql('/user/john.doe.json');
    });
  });

});
