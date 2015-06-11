define([
  "superapi"
], function (superapi) {
  "use strict";

  var api = superapi.default;

  describe("configuration initialization", function () {
    describe("with no parameters", function () {
      var configuration;

      before(function () {
        configuration = new api.Configuration();
      });

      after(function () {
        configuration = null;
      });

      it("should have a default config if none provided", function () {
        configuration.should.have.ownProperty("config");
        // jshint -W030
        configuration.config.should.be.empty;
        // jshint +W030
      });

      it("should have a default `api` name property", function () {
        var configuration = new api.Configuration();

        configuration.should.have.ownProperty("name", "api");
      });

      it("should have an empty `api` map by default", function () {
        var configuration = new api.Configuration();

        // jshint -W030
        configuration.api.should.be.empty;
        // jshint +W030
      });

      it("should have an empty `headers` map by default", function () {
        // jshint -W030
        configuration.headers.should.be.empty;
        // jshint +W030
      });
    });

    describe("`config` object only signature", function () {
      var configuration;
      var config = {foo: "bar"};

      before(function () {
        configuration = new api.Configuration(config);
      });

      after(function () {
        configuration = null;
      });

      it("should have a default `api` name property", function () {
        configuration.should.have.ownProperty("name", "api");
      });

      it("should set `config` property", function () {
        configuration.config.should.eql(config);
      });
    });

    describe("`config` string only signature", function () {
      var configuration;

      before(function () {
        configuration = new api.Configuration("rest");
      });

      after(function () {
        configuration = null;
      });

      it("should have a default `api` name property", function () {
        configuration.should.have.ownProperty("name", "api");
      });

      it("should have an emtpy `config` property", function () {
        // jshint -W030
        configuration.config.should.be.empty;
        // jshint +W030
      });
    });

    describe("name + configuration only signature", function () {
      describe("(string, object)", function () {
        var configuration;
        var config = {foo: "bar"};

        before(function () {
          configuration = new api.Configuration("rest", config);
        });

        after(function () {
          configuration = null;
        });

        it("should set `name` property", function () {
          configuration.should.have.ownProperty("name", "rest");
        });

        it("should set `config` property", function () {
          configuration.config.should.eql(config);
        });
      });

      describe("(string, !== object)", function () {
        var configuration;

        before(function () {
          // testing with something different than an object for 2nd parameter
          configuration = new api.Configuration("rest", "foo");
        });

        after(function () {
          configuration = null;
        });

        it("should set `name` property", function () {
          configuration.should.have.ownProperty("name", "rest");
        });

        it("should set `config` property", function () {
          // jshint -W030
          expect(configuration.config.foo).to.be.empty;
          // jshint +W030
        });
      });
    });
  });

  describe("configuration service", function () {
    var configuration;
    var config = {
      baseUrl: "http://foo.domain.tld/api",
      services: {
        foo: "bar",
        bar: {
          method: "post",
          path: "bar"
        }
      }
    };

    before(function () {
      configuration = new api.Configuration(config);
    });

    after(function () {
      configuration = null;
    });

    it("should fill configuration services map", function () {
      configuration.should.not.have.ownProperty("services");

      configuration.service("foo");

      configuration.should.have.ownProperty("services");
    });

    it("should have a service `foo` in configuration services map", function () {
      configuration.service("foo");
      configuration.services.should.have.ownProperty("foo");
      configuration.services.foo.should.be.instanceof(api.Service);
    });

    it("should return a service instance", function () {
      var service = configuration.service("foo");
      service.should.be.instanceof(api.Service);
    });

    it("should set config baseUrl for requested service", function () {
      var service = configuration.service("foo");
      service.should.have.ownProperty("baseUrl", config.baseUrl);
    });
  });

  describe("configuration headers map", function () {
    var configuration;

    before(function () {
      configuration = new api.Configuration();
    });

    after(function () {
      configuration = null;
    });

    it("should be empty by default", function () {
      // jshint -W030
      configuration.headers.should.be.empty;
      // jshint +W030
    });

    it("should be possible to add a header", function () {
      configuration.addHeader("csrf", "my-awesome-csrf-token");
      configuration.headers.should.have.ownProperty("csrf", "my-awesome-csrf-token");
    });

    it("should be possible to remove an existing header", function () {
      configuration.addHeader("csrf", "my-awesome-csrf-token");

      configuration.removeHeader("csrf");

      // jshint -W030
      configuration.headers.should.be.empty;
      // jshint +W030
    });

    it("should be a noop to remove a non-existing header", function () {
      configuration.addHeader("csrf", "my-awesome-csrf-token");

      configuration.removeHeader();

      configuration.headers.should.have.ownProperty("csrf", "my-awesome-csrf-token");
    });
  });

  describe("configuration bind", function () {
    var configuration;
    var config = {
      baseUrl: "http://foo.domain.tld/api",
      services: {
        foo: "bar",
        bar: {
          method: "post",
          path: "bar"
        }
      }
    };

    before(function () {
      configuration = new api.Configuration(config);
    });

    after(function () {
      configuration = null;
    });

    it("should be empty by default", function () {
      // configuration.bind must be called before

      // jshint -W030
      configuration.api.should.be.empty;
      // jshint +W030
    });

    it("should create methods", function () {
      // bind service handler
      configuration.bind(function () {
        return function () {};
      });

      configuration.api.should.respondTo("foo");
      configuration.api.should.respondTo("bar");
    });

    it("should pass service name to handler closure", function () {
      var handler = sinon.spy(function () {
        return function () {};
      });

      // bind service handler
      configuration.bind(handler);

      configuration.api.should.respondTo("foo");

      handler.should.have.been.calledWith("foo");
    });

    it("should called handler closure", function () {
      var serviceClosure = sinon.spy();
      var handler = function () {
        return serviceClosure;
      };

      // bind service handler
      configuration.bind(handler);

      configuration.api.should.respondTo("foo");

      // jshint -W030
      serviceClosure.should.not.have.been.called;
      // jshint +W030

      configuration.api.foo();

      // jshint -W030
      serviceClosure.should.have.been.calledOnce;
      // jshint +W030
    });

    it("should pass args to service handler", function () {
      var serviceClosure = sinon.spy();
      var handler = function () {
        return serviceClosure;
      };

      // bind service handler
      configuration.bind(handler);

      configuration.api.should.respondTo("foo");

      // jshint -W030
      serviceClosure.should.not.have.been.called;
      // jshint +W030

      configuration.api.foo("awesome-service-name", 1, {foo: "bar"});

      serviceClosure.should.have.been.calledWith("awesome-service-name", 1, {foo: "bar"});
    });
  });

});
