define([
  "superapi",
], function (superapi) {
  "use strict";

  var urlize = superapi.default.urlize;

  describe("urlize", function () {
    describe("url()", function () {
      it("should support `baseUrl` only", function () {
        var url = urlize.url("http://example.tld");
        url.should.eql("http://example.tld");
      });

      it("should return support no `baseUrl`", function () {
        var url = urlize.url();
        url.should.eql("");
      });

      it("should support `resource` as a string", function () {
        var url = urlize.url("http://example.tld", "foo");
        url.should.eql("http://example.tld/foo");
      });

      it("should support `resource` as an url with HTTP", function () {
        var url = urlize.url("http://example.tld", "http://foo.tld");
        url.should.eql("http://foo.tld");
      });

      it("should support `resource` as an url with HTTPS", function () {
        var url = urlize.url("http://example.tld", "https://foo.tld");
        url.should.eql("https://foo.tld");
      });

      it("should support `resource` as an object with `path` property", function () {
        var url = urlize.url("http://example.tld", {
          path: "foo"
        });
        url.should.eql("http://example.tld/foo");
      });

      it("should throw for `resource` as an object without `path` property", function () {
        should.Throw(function () {
          urlize.url("http://example.tld", {
            ppath: "foo"
          });
        });
      });

      it("should remove handling slash for `path` property", function () {
        var url = urlize.url("http://example.tld", {
          path: "/foo"
        });
        url.should.eql("http://example.tld/foo");
      });
    });

    describe("replaceUrl()", function () {
      it("should return false if no url provided", function () {
        // jshint -W030
        urlize.replaceUrl().should.be.false;
        // jshint +W030
      });

      it("should return false if no match method found on url", function () {
        // jshint -W030
        urlize.replaceUrl(1).should.be.false;
        urlize.replaceUrl({}).should.be.false;
        urlize.replaceUrl([]).should.be.false;
        // jshint +W030
      });

      it("should return url if no parameters found", function () {
        urlize.replaceUrl("foo").should.eql("foo");

        urlize.replaceUrl("http://example.tld/foo")
          .should.eql("http://example.tld/foo");
      });

      it("should replace parameters found", function () {
        var url = urlize.replaceUrl("http://example.tld/:foo/:baz", {
          foo: "bar",
          baz: "foo"
        });

        url.should.eql("http://example.tld/bar/foo");
      });

      it("should be able to replace multiple occurrence of a parameter", function () {
        var url = urlize.replaceUrl("/:bar/:foo.:bar.json", {
          bar: "doe",
          foo: "john"
        });
        url.should.eql("/doe/john.doe.json");
      });

      it("should leave missing parameters", function () {
        var url = urlize.replaceUrl("http://example.tld/:foo/:baz", {
          foo: "bar"
        });

        url.should.eql("http://example.tld/bar/:baz");
      });

      it("should support different parameters pattern", function () {
        var url = urlize.replaceUrl("http://example.tld/-foo", {
          foo: "bar"
        }, /-(\w+)/g);

        url.should.eql("http://example.tld/bar");
      });
    });

    describe("buildUrlQuery()", function () {
      it("should return empty string if no `query`", function () {
        urlize.buildUrlQuery().should.eql("");
        urlize.buildUrlQuery(null).should.eql("");
        urlize.buildUrlQuery("").should.eql("");
      });

      it("should return query if it's a string", function () {
        urlize.buildUrlQuery("foobar")
          .should.eql("?foobar");

        // query with args
        urlize.buildUrlQuery("foo=bar&baz=foo")
          .should.eql("?foo=bar&baz=foo");
      });

      it("should remove question mark if query is a string", function () {
        urlize.buildUrlQuery("?foo=bar&baz=foo")
          .should.eql("?foo=bar&baz=foo");
      });

      it("should build query string for query object", function () {
        urlize.buildUrlQuery({
          foo: "bar",
          baz: "foo"
        }).should.eql("?foo=bar&baz=foo");
      });

      it("should build empty query string for empty query object", function () {
        urlize.buildUrlQuery({}).should.eql("");
      });
    });

    describe("urlize()", function () {
      it("should throw if no parameters", function () {
        should.Throw(function () {
          urlize.urlize();
        });
      });

      // only test that `baseUrl` is passed to `urlize.url`
      // others tests are check for `urlize.url` method
      it("should support `baseUrl` property", function () {
        var url = urlize.urlize({
          baseUrl: "http://example.tld"
        });

        url.should.eql("http://example.tld");
      });

      // only test that `resource` is passed to `urlize.url`
      // others tests are check for `urlize.url` method
      it("should support `resource` property", function () {
        var url = urlize.urlize({
          baseUrl: "http://example.tld",
          resource: "foo"
        });

        url.should.eql("http://example.tld/foo");
      });

      // only test that `params` is passed to `urlize.replaceUrl`
      // others tests are check for `urlize.replaceUrl` method
      it("should support `params` property", function () {
        var url = urlize.urlize({
          baseUrl: "http://example.tld",
          resource: ":foo/:bar",
          params: {
            foo: "bar"
          }
        });

        url.should.eql("http://example.tld/bar/:bar");
      });

      // only test that `paramsPattern` is passed to `urlize.replaceUrl`
      // others tests are check for `urlize.replaceUrl` method
      it("should support `paramsPattern` property", function () {
        var url = urlize.urlize({
          baseUrl: "http://example.tld",
          resource: "=foo/:bar",
          params: {
            foo: "bar"
          },
          paramsPattern: /=(\w+)/g
        });

        url.should.eql("http://example.tld/bar/:bar");
      });

      // only test that `query` is passed to `urlize.buildUrlQuery`
      // others tests are check for `urlize.buildUrlQuery` method
      it("should support `query` property", function () {
        var url = urlize.urlize({
          baseUrl: "http://example.tld",
          resource: "foo/bar",
          query: {
            hello: "world"
          }
        });

        url.should.eql("http://example.tld/foo/bar?hello=world");
      });
    });

  });
});
