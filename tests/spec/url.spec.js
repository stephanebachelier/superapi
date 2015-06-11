define([
  "superapi",
  "superagent"
], function (superapi, superagent) {
  "use strict";

  var urlize = superapi.default.urlize;

  describe.skip("url tokenization", function () {
    // it("replaceUrl - should replace tokens in a given url", function () {
    //   var url = urlize.replaceUrl("/:bar/:foo.:baz.json", {
    //     bar: "user",
    //     foo: "john",
    //     baz: "doe"
    //   });
    //   url.should.eql("/user/john.doe.json");
    // });

    it("buildUrl - should build the url of a service id and replace any tokens", function  () {
      var api = superapi.default({
        baseUrl: "http://example.tld",
        services: {
          foo: {
            path:"/:bar/:foo.:baz.json"
          }
        }
      });
      var url = api.buildUrl("foo", {
        bar: "user",
        foo: "john",
        baz: "doe"
      });
      url.should.eql("http://example.tld/user/john.doe.json");
    });
  });

  describe.skip("url query", function () {
    // it("buildUrlQuery - should create the query for an url", function () {
    //   var api = superapi.default({});
    //   var queryString = api.buildUrlQuery({
    //     bar: "user",
    //     foo: "john",
    //     baz: "doe"
    //   });
    //   queryString.should.eql("?bar=user&foo=john&baz=doe");
    // });

    // it("buildUrlQuery - should support empty", function () {
    //   var api = superapi.default({});
    //   var queryString = api.buildUrlQuery({});
    //   queryString.should.eql("");
    // });

    it("buildUrl - should build the correct url with any tokens or query args", function () {
      var api = superapi.default({
        baseUrl: "http://example.tld",
        services: {
          foo: {
            path:"/user/:foo.:bar.json"
          }
        }
      });

      var queryString = api.buildUrl("foo", {
        foo: "john",
        bar: "doe"
      }, {
        content: "post",
        since: "19700101"
      });
      queryString.should.eql("http://example.tld/user/john.doe.json?content=post&since=19700101");
    });

    it("request - should build the correct url with any tokens or query args", function () {
      var api = superapi.default({
        baseUrl: "http://example.tld",
        services: {
          foo: {
            path:"/user/:foo.:bar.json"
          }
        }
      });
      api.agent = superagent;

      var req = api.request("foo", undefined, {
        foo: "john",
        bar: "doe"
      }, {
        content: "post",
        since: "19700101"
      });
      req.url.should.eql("http://example.tld/user/john.doe.json?content=post&since=19700101");
    });
  });
});
