define([
  "superapi"
], function (superapi) {
  "use strict";

  describe("configuration", function () {
    it("should support no configuration at initialization", function () {
      should.not.Throw(function () {
        var api = superapi.default();
        // jshint -W030
        expect(api.config).to.be.empty;
        expect(api.api).to.be.empty;
        // jshint +W030
      });
    });

    it("should support configuration at runtime", function () {
      var api = superapi.default();
      api.configure({
        baseUrl: "http://foo.domain.tld/api",
        services: {
          foo: "bar"
        }
      });
      api.config.should.haveOwnProperty("baseUrl");
      api.service("foo").should.eql("bar");
      api.api.foo.should.be.an.instanceof(Function);
    });

    it("should return the service string configuration", function () {
      var api = superapi.default({
        baseUrl: "http://foo.domain.tld/api",
        services: {
          foo: "bar"
        }
      });

      api.service("foo").should.eql("bar");
    });

    it("should return the service object configuration", function () {
      var api = superapi.default({
        baseUrl: "http://foo.domain.tld/api",
        services: {
          foo: {
            path: "/foo"
          }
        }
      });

      api.service("foo").should.eql({path: "/foo"});
    });
  });

});
