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
  });
});
