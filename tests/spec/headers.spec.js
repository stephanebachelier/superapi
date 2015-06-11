define([
  "superapi",
  "superagent"
], function (superapi, superagent) {
  "use strict";

  describe.skip("global request headers", function () {
    it("should add service headers", function () {
      var api = superapi.default({
        baseUrl: "http://foo.domain.tld/api",
        services: {
          foo: {
            path: "bar",
          }
        },
        headers: {
          "Content-type": "json",
          "X-Requested-With": "XMLHttpRequest"
        }
      });
      api.agent = superagent;
      api.request("foo")._header.should.have.ownProperty("content-type");
      api.request("foo")._header["content-type"].should.eql("json");

      api.request("foo")._header.should.have.ownProperty("x-requested-with");
      api.request("foo")._header["x-requested-with"].should.eql("XMLHttpRequest");
    });
  });

  describe.skip("global request options", function () {
    it("should add global headers", function () {
      var api = superapi.default({
        baseUrl: "http://foo.domain.tld/api",
        services: {
          foo: {
            path: "bar",
          }
        },
        headers: {
          "X-Requested-With": "XMLHttpRequest"
        },
        options: {
          type: "json",
          accept: "json"
        }
      });
      api.agent = superagent;
      api.request("foo")._header.should.have.ownProperty("content-type");
      api.request("foo")._header["content-type"].should.eql("application/json");

      api.request("foo")._header.should.have.ownProperty("accept");
      api.request("foo")._header.accept.should.eql("application/json");

      api.request("foo")._header.should.have.ownProperty("x-requested-with");
      api.request("foo")._header["x-requested-with"].should.eql("XMLHttpRequest");
    });
  });

  describe.skip("global options", function () {
    it("should not override service option", function () {
      var api = superapi.default({
        baseUrl: "http://foo.domain.tld/api",
        services: {
          foo: {
            path: "bar",
            options: {
              type: "form"
            }
          }
        },
        options: {
          type: "json",
        }
      });
      api.agent = superagent;
      api.request("foo")._header.should.have.ownProperty("content-type");
      api.request("foo")._header["content-type"].should.eql("application/x-www-form-urlencoded");
    });

    it("should not override service header", function () {
      var api = superapi.default({
        baseUrl: "http://foo.domain.tld/api",
        services: {
          foo: {
            path: "bar",
            headers: {
              "Content-type": "application/x-www-form-urlencoded"
            }
          }
        },
        options: {
          type: "json"
        }
      });
      api.agent = superagent;
      api.request("foo")._header.should.have.ownProperty("content-type");
      api.request("foo")._header["content-type"].should.eql("application/x-www-form-urlencoded");
    });
  });

  describe.skip("global headers", function () {
    it("should not override service option", function () {
      var api = superapi.default({
        baseUrl: "http://foo.domain.tld/api",
        services: {
          foo: {
            path: "bar",
            options: {
              type: "form"
            }
          }
        },
        headers: {
          "Content-type": "application/json",
        }
      });
      api.agent = superagent;
      api.request("foo")._header.should.have.ownProperty("content-type");
      api.request("foo")._header["content-type"].should.eql("application/x-www-form-urlencoded");
    });

    it("should not override service header", function () {
      var api = superapi.default({
        baseUrl: "http://foo.domain.tld/api",
        services: {
          foo: {
            path: "bar",
            headers: {
              "Content-type": "application/x-www-form-urlencoded"
            }
          }
        },
        headers: {
          "Content-type": "application/json",
        }
      });
      api.agent = superagent;
      api.request("foo")._header.should.have.ownProperty("content-type");
      api.request("foo")._header["content-type"].should.eql("application/x-www-form-urlencoded");
    });
  });

  describe.skip("runtime headers", function () {
    it("should add header", function () {
      var api = superapi.default({
        baseUrl: "http://foo.domain.tld/api",
        services: {
          foo: {
            path: "bar",
            headers: {
              "Content-type": "application/x-www-form-urlencoded"
            }
          }
        }
      });
      api.agent = superagent;
      api.addHeader("csrf", "my-awesome-csrf-token");
      api.request("foo")._header.should.have.ownProperty("csrf");
      api.request("foo")._header.csrf.should.eql("my-awesome-csrf-token");
    });
  });
});
