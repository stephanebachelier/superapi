define([
  "superapi"
], function (superapi) {
  "use strict";

  var api = superapi.default;

  describe("service", function () {
    describe("configuration", function () {
      it("should have default properties form constructor", function () {
        var service = new api.Service("foo", "http://domain.tld/api", {
          path: "bar"
        });

        service.should.have.ownProperty("id", "foo");
        service.should.have.ownProperty("baseUrl", "http://domain.tld/api");
        service.should.have.ownProperty("config");
        service.config.should.eql({
          path: "bar"
        });
      });

      it("should have default empty baseUrl and config", function () {
        var service = new api.Service("foo");

        service.should.have.ownProperty("baseUrl", "");
        service.should.have.ownProperty("config");
        // jshint -W030
        service.config.should.be.empty;
        // jshint +W030
      });

      it("should support id + config constructor form", function () {
        var service = new api.Service("foo", {
          path: "bar"
        });

        service.should.have.ownProperty("id", "foo");
        service.should.have.ownProperty("baseUrl", "");
        service.should.have.ownProperty("config");
        service.config.should.eql({
          path: "bar"
        });
      });
    });

    describe("url", function () {
      it("should build the service url", function () {
        var service = new api.Service("foo", "http://domain.tld/api", {
          path: "bar"
        });

        service.url().should.eql("http://domain.tld/api/bar");
      });

      it("should support relative url specifying null baseUrl", function () {
        var service = new api.Service("foo", null, {
          path: "bar"
        });

        service.url().should.eql("/bar");
      });

      it("should support relative url using default baseUrl", function () {
        var service = new api.Service("foo", {
          path: "bar"
        });

        service.url().should.eql("/bar");
      });

      it("should build the service url with params", function () {
        var service = new api.Service("foo", "http://domain.tld/api", {
          path: "bar/:arg1/:arg2"
        });
        var url = service.url({
          arg1: "john",
          arg2: "doe"
        });

        url.should.eql("http://domain.tld/api/bar/john/doe");
      });

      it("should build the service url with query only", function () {
        var service = new api.Service("foo", "http://domain.tld/api", {
          path: "bar"
        });
        var url = service.url(null, {
          foo: "bar"
        });

        url.should.eql("http://domain.tld/api/bar?foo=bar");
      });

      it("should build the service url with params and query", function () {
        var service = new api.Service("foo", "http://domain.tld/api", {
          path: "bar/:arg1/:arg2"
        });
        var url = service.url({
          arg1: "john",
          arg2: "doe"
        }, {
          foo: "bar"
        });

        url.should.eql("http://domain.tld/api/bar/john/doe?foo=bar");
      });

    });

    describe("method", function () {
      it("should return get by default", function () {
        var service = new api.Service("foo", null, {
          path: "bar/:arg1/:arg2"
        });

        service.method().should.eql("get");
      });

      it("should return get for an empty method", function () {
        var service = new api.Service("foo", null, {
          path: "bar/:arg1/:arg2",
          method: ""
        });

        service.method().should.eql("get");
      });

      it("should return method in lowercase", function () {
        var service = new api.Service("foo", null, {
          path: "bar/:arg1/:arg2",
          method: "POST"
        });

        service.method().should.eql("post");
      });
    });

    describe("options", function () {
      it("should set default empty options and headers if none defined", function () {
        var service = new api.Service("foo");

        var options = service.options();

        options.should.have.ownProperty("options");
        options.should.have.ownProperty("headers");

        // jshint -W030
        options.options.should.be.empty;
        options.headers.should.be.empty;
        // jshint +W030
      });

      it("should return any headers or options configured for a service", function () {
        var service = new api.Service("foo", {
          path: "bar/:arg1/:arg2",
          method: "POST",
          headers: {
            "X-Wings": 1
          },
          options: {
            type: "json"
          }
        });

        var options = service.options();

        options.should.have.ownProperty("options");
        options.should.have.ownProperty("headers");

        options.headers.should.have.ownProperty("X-Wings", 1);
        options.options.should.have.ownProperty("type", "json");
      });
    });

    describe("data", function () {
      it("should return empty data object if no data arg given", function () {
        var service = new api.Service("foo");
        // jshint -W030
        service.data().should.be.empty;
        // jshint +W030
      });

      it("should return data object if no data defined in config", function () {
        var service = new api.Service("foo");
        var data = service.data({
          foo: "bar"
        });
        data.should.have.ownProperty("foo", "bar");
      });

      it("should merge given data with data from configuration", function () {
        var service = new api.Service("foo", null, {
          data: {
            key: "01234567890"
          }
        });

        var data = service.data({
          foo: "bar"
        });
        data.should.have.ownProperty("key", "01234567890");
        data.should.have.ownProperty("foo", "bar");
      });
    });
  });
});
