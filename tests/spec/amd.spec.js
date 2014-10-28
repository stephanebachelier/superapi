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
    it('replaceUrl - should replace tokens in a given url', function () {
      var api = superapi.default({});
      var url = api.replaceUrl('/:bar/:foo.:baz.json', {
        bar: 'user',
        foo: 'john',
        baz: 'doe'
      });
      url.should.eql('/user/john.doe.json');
    });

    it('buildUrl - should build the url of a service id and replace any tokens', function  () {
      var api = superapi.default({
        baseUrl: 'http://example.tld',
        services: {
          foo: {
            path:'/:bar/:foo.:baz.json'
          }
        }
      });
      var url = api.buildUrl('foo', {
        bar: 'user',
        foo: 'john',
        baz: 'doe'
      });
      url.should.eql('http://example.tld/user/john.doe.json')
    })
  });

  describe('url query', function () {
    it('buildUrlQuery - should create the query for an url', function () {
      var api = superapi.default({});
      var queryString = api.buildUrlQuery({
        bar: 'user',
        foo: 'john',
        baz: 'doe'
      });
      queryString.should.eql('?bar=user&foo=john&baz=doe');
    });

    it('buildUrlQuery - should support empty', function () {
      var api = superapi.default({});
      var queryString = api.buildUrlQuery({});
      queryString.should.eql('');
    });

    it('buildUrl - should build the correct url with any tokens or query args', function () {
      var api = superapi.default({
        baseUrl: 'http://example.tld',
        services: {
          foo: {
            path:'/user/:foo.:bar.json'
          }
        }
      });

      var queryString = api.buildUrl('foo', {
        foo: 'john',
        bar: 'doe'
      }, {
        content: 'post',
        since: '19700101'
      });
      queryString.should.eql('http://example.tld/user/john.doe.json?content=post&since=19700101');
    });

    it('request - should build the correct url with any tokens or query args', function () {
      var api = superapi.default({
        baseUrl: 'http://example.tld',
        services: {
          foo: {
            path:'/user/:foo.:bar.json'
          }
        }
      });
      api.agent = superagent;

      var req = api.request('foo', undefined, {
        foo: 'john',
        bar: 'doe'
      }, {
        content: 'post',
        since: '19700101'
      });
      req.url.should.eql('http://example.tld/user/john.doe.json?content=post&since=19700101');
    });

    // this test is disabled for now as Sinon does not works well with AMD loaded
    // sinon 1.11.1 version does not play well with Karma RequireJS.
    it.skip('api sugar should build the correct url with any tokens or query args', function () {
      var api = superapi.default({
        baseUrl: 'http://example.tld',
        services: {
          foo: {
            path:'/user/:foo.:bar.json'
          }
        }
      });
      api.agent = superagent;

      // add sinon to fake the XHR call
      var server = sinon.fakeServer.create();

      var req = api.api.foo(undefined, {
        foo: 'john',
        bar: 'doe'
      }, {
        content: 'post',
        since: '19700101'
      });
      req.url.should.eql('http://example.tld/user/john.doe.json?content=post&since=19700101');

      server.restore();
    });
  });

  describe('uploading', function() {

    it('can be done with a multipart/form-data request', function() {
      var api = superapi.default({
        baseUrl: 'api',
        services: {
          upload: {
            path: 'upload',
            method: 'POST',
            headers: {
              'X-Requested-With': 'XMLHttpRequest'
            }
          }
        }
      });

      var fileData = {
        file: new Image()
      };
      //black pixel
      fileData.file.src = 'data:image/png;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs='

      api.agent = superagent;



      var attachFile = function(request) {
        delete(request.header['Content-Type']);
        request.attach('image', fileData, 'stuff.jpg');
      };
      var onResponse = function(response) {
        var request = response.req;
        request.hasOwnProperty('_formData');
        // We should test that
        // request.header['Content-type'] matches
        // Content-Type:multipart/form-data; boundary=----WebKitFormBoundary...
        // But it is not set back as it is a navigator behavior.
        // A recieving server should check that.
      };


      api.api.upload({}, undefined, onResponse, attachFile);

    });
  });
});
