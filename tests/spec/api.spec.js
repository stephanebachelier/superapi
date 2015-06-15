define([
  "superapi"
], function (superapi) {
  "use strict";

  describe("api", function () {
    describe("configuration", function () {
      it("should support no configuration at initialization", function () {
        should.not.Throw(function () {
          var api = superapi.default();
          // jshint -W030
          expect(api.configurations).to.be.empty;
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
        api.configurations.should.have.ownProperty("api");
      });

      it("should have a default `api` configuration", function () {
        var api = superapi.default();
        api.configure({
          baseUrl: "http://foo.domain.tld/api",
          services: {
            foo: "bar"
          }
        });

        // jshint -W030
        expect(api.configurations).to.not.be.empty;
        // jshint +W030
      });

      it("should support named configuration", function () {
        var api = superapi.default();
        api.configure("foo", {
          baseUrl: "http://foo.domain.tld/api",
          services: {
            foo: "bar"
          }
        });

        api.configurations.should.have.ownProperty("foo");
      });
    });

    describe("service", function () {
      it("should return null if no existing configuration", function () {
        var api = superapi.default();

        // jshint -W030
        expect(api.service("foo")).to.be.null;
        // jshint +W030
      });

      it("should return default api configuration if no given namespace", function () {
        var api = superapi.default();
        api.configure({
          baseUrl: "http://foo.domain.tld/api",
          services: {
            foo: "bar"
          }
        });

        // jshint -W030
        api.service("api:foo").should.not.be.null;
        api.service("foo").should.not.be.null;
        api.service("foo").should.eql(api.service("api:foo"));
        // jshint +W030
      });

      it("should return correct service for a named configuration", function () {
        var api = superapi.default();
        api.configure("bar", {
          baseUrl: "http://foo.domain.tld/api",
          services: {
            foo: "bar"
          }
        });

        // jshint -W030
        api.service("bar:foo").should.not.be.null;
        api.service("bar:foo").should.be.an.instanceof(superapi.default.Service);
        // jshint +W030
      });

      it("should return correct service for a multiple named configuration", function () {
        var api = superapi.default();
        api.configure("bar", {
          baseUrl: "http://foo.domain.tld/api",
          services: {
            foo: {
              path: "foo",
              method: "get"
            }
          }
        });

        api.configure("foo", {
          baseUrl: "http://foo.domain.tld/api",
          services: {
            bar: "bar",
            method: "post"
          }
        });

        var service = api.service("bar:foo");

        // jshint -W030
        service.should.not.be.null;
        service.should.have.ownProperty("id", "foo");
        service.config.should.have.ownProperty("path", "foo");
        service.config.should.have.ownProperty("method", "get");
        service.method().should.eql("get");
        // jshint +W030
      });
    });
  });
});
