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

    describe("serviceHandler", function () {
      var api = superapi.default();

      // helper to call serviceHandler with the right (configuration) context
      var callServiceHelper = function (options) {
        var handler = api.serviceHandler("foo");
        var configuration = api.configurations.bar;

        // need to bind handler to configuration context
        return handler.call(configuration, options);
      };

      before(function () {
        api.configure("bar", {
          baseUrl: "http://foo.domain.tld/api",
          services: {
            foo: "foo/:arg1/:arg2"
          }
        });
      });

      after(function () {
        api = null;
      });

      it("should return a curried function", function () {
        var handler = api.serviceHandler("foo");

        // jshint -W030
        handler.should.not.be.null;
        handler.should.be.a.function;
        // jshint +W030
      });

      describe("curried function without agent", function () {
        it("should failed", function () {
          callServiceHelper().catch(function (error) {
            error.should.eql("missing agent");
          });
        });
      });

      describe("curried function with agent", function () {
        var mock;

        before(function () {
          // mock agentWrapper call
          api.agentWrapper = {
            serviceHandler: function () {}
          };

          // setup mock here to ease test maintenance
          mock = sinon.mock(api.agentWrapper);
        });

        after(function () {
          delete api.agentWrapper;
          mock.restore();
        });

        it("should retrieve service request description", function () {
          var spy = sinon.spy(api.configurations.bar, "request");

          var params = {
            arg1: 10,
            arg2: 20
          };

          var query = {
            foo: "bar"
          };

          callServiceHelper({
            data: "my-awesome-data",
            params: params,
            query: query
          });

          spy.callCount.should.be.eql(1);

          var args = spy.args[0];
          args[0].should.be.eql("foo");
          args[1].should.be.eql("my-awesome-data");
          args[2].should.be.eql(params);
          args[3].should.be.eql(query);

          spy.restore();
        });

        it("should return a promise", function () {
          var promise = callServiceHelper();

          // jshint -W030
          promise.then.should.be.a.function;
          promise.catch.should.be.a.function;
          // jshint +W030
        });

        it("should call agent handler", function () {
          mock.expects("serviceHandler").once();

          callServiceHelper();

          mock.verify();
        });
      });
    });

    describe("agent", function () {
      // test withSuperagent
      describe("with superagent", function () {
        var api = superapi.default();

        // jshint -W030
        expect(api.agentWrapper).to.be.undefined;
        // jshint +W030

        var ret = api.withSuperagent();

        // check that chaining is possible
        ret.should.eql(api);

        // check that agent wrapper is superagent wrapper
        api.agentWrapper.should.be.instanceof(superapi.default.agentWrapper.superagent);
      });
    });
  });
});
