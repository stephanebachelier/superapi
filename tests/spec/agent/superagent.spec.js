define([
  "superapi",
  "superagent"
],
function (superapi, superagent) {
  "use strict";

  var Superagent = superapi.default.agentWrapper.superagent;

  describe("superagent wrapper", function () {
    it("should throw if no agent defined", function () {
      var agent;
      should.Throw(function () {
        agent = new Superagent();
      }, "missing agent");
    });

    describe("request", function () {

    });

    describe("_setHeaders", function () {
      it("should not throw on null headers on request", function () {
        var agent = new Superagent(superagent);
        var req = superagent.get("http://domain.tld");

        should.not.Throw(function () {
          agent._setHeaders(req, null);
        });
      });

      it("should not throw on undefined headers on request", function () {
        var agent = new Superagent(superagent);
        var req = superagent.get("http://domain.tld");

        should.not.Throw(function () {
          agent._setHeaders(req);
        });
      });

      it("should not throw on empty headers on request", function () {
        var agent = new Superagent(superagent);
        var req = superagent.get("http://domain.tld");

        should.not.Throw(function () {
          agent._setHeaders(req, {});
        });
      });

      it("should not throw on undefined request", function () {
        var agent = new Superagent(superagent);

        should.not.Throw(function () {
          // testing possible case where request is not defined
          // because using a wrong method
          agent._setHeaders(undefined, {
            "X-Requested-With": "XMLHttpRequest"
          });
        });
      });

      it("should apply headers on request", function () {
        var agent = new Superagent(superagent);
        var req = superagent.get("http://domain.tld");
        agent._setHeaders(req, {
          "X-Requested-With": "XMLHttpRequest",
          "X-API-Key": "foobar"
        });

        req.header.should.have.ownProperty("X-Requested-With", "XMLHttpRequest");
        req.header.should.have.ownProperty("X-API-Key", "foobar");
      });
    });

    describe("_setOptions", function () {
      it("should not throw on null headers on request", function () {
        var agent = new Superagent(superagent);
        var req = superagent.get("http://domain.tld");

        should.not.Throw(function () {
          agent._setOptions(req, null);
        });
      });

      it("should not throw on undefined headers on request", function () {
        var agent = new Superagent(superagent);
        var req = superagent.get("http://domain.tld");

        should.not.Throw(function () {
          agent._setOptions(req);
        });
      });

      it("should not throw on empty headers on request", function () {
        var agent = new Superagent(superagent);
        var req = superagent.get("http://domain.tld");

        should.not.Throw(function () {
          agent._setOptions(req, {});
        });
      });

      it("should not throw on undefined request", function () {
        var agent = new Superagent(superagent);

        should.not.Throw(function () {
          // testing possible case where request is not defined
          // because using a wrong method
          agent._setOptions(undefined, {
            type: "xml"
          });
        });
      });

      it("should throw on unsupported option", function () {
        var agent = new Superagent(superagent);
        var req = superagent.get("http://domain.tld");

        should.Throw(function () {
          agent._setOptions(req, {
            foo: "bar"
          });
        });
      });

      it("should apply headers on request", function () {
        var agent = new Superagent(superagent);
        var req = superagent.get("http://domain.tld");
        agent._setOptions(req, {
          type: "json",
          accept: "json"
        });

        req.header.should.have.ownProperty("Content-Type", "application/json");
        req.header.should.have.ownProperty("Accept", "foobar");
      });
    });

    describe("_request", function () {
      it("should not throw if null serviceDesc", function () {
        var agent = new Superagent(superagent);
        var stub = sinon.stub(agent, "request");

        should.Throw(function () {
          agent._request(null);
        }, "invalid serviceDesc");

        stub.restore();
      });

      it("should not throw if undefined serviceDesc", function () {
        var agent = new Superagent(superagent);
        var stub = sinon.stub(agent, "request");

        should.Throw(function () {
          agent._request();
        }, "invalid serviceDesc");

        stub.restore();
      });

      it("should call request with correct args from serviceDesc", function () {
        var agent = new Superagent(superagent);
        var stub = sinon.stub(agent, "request");

        var serviceDesc = {
          method: "get",
          url: "http://domain.tld/foo",
          data: {
            foo: "bar"
          },
          headers: {
            "X-API-Key": "1234567890"
          },
          options: {
            type: "json"
          }
        };

        agent._request(serviceDesc);

        stub.callCount.should.eql(1);
        var args = stub.args[0];
        // method
        args[0].should.eql("get");

        // url
        args[1].should.eql("http://domain.tld/foo");

        // data
        args[2].should.eql({
          foo: "bar"
        });

        // options
        args[3].should.eql({
          headers: {
            "X-API-Key": "1234567890"
          },
          options: {
            type: "json"
          }
        });

        stub.restore();
      });
    });

  });
});
