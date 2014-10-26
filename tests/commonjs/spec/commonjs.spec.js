var superapi = require('superapi').default;

describe('configuration', function () {
  it('should return the service string configuration', function () {
    var api = superapi({
      baseUrl: 'http://foo.domain.tld/api',
      services: {
        foo: 'bar'
      }
    });

    api.service('foo').should.eql('bar');
  });
});
