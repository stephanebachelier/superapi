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

    describe("serviceHandler", function () {
      var agent;
      var server;
      var serviceDesc;

      beforeEach(function () {
        agent = new Superagent(superagent);

        serviceDesc = {
          method: "get",
          url: "http://domain.tld/foo"
        };

        // add sinon to fake the XHR call
        server = sinon.fakeServer.create();
      });

      afterEach(function () {
        server.restore();
        server = null;
        agent = null;
        serviceDesc = null;
      });

      describe("callback option", function () {
        it("should use provided callback on request end", function (done) {
          server.respondWith("GET", "http://domain.tld/foo", [200, {}, "ok"]);
          var spy = sinon.spy(function (res) {
            // at least we are sure that this function has been called
            // spy.args[0] is res
            // test that res is not an error
            res.should.have.ownProperty("req");
            res.status.should.eql(200);
            done();
          });
          agent.serviceHandler(serviceDesc, {
            callback: spy
          });

          server.respond();
        });

        it("should use provided callback on request error", function (done) {
          server.respondWith("GET", "http://domain.tld/foo", [400, {}, "ko"]);

          var callback = sinon.spy(function (res) {
            // at least we are sure that this function has been called
            // spy.args[0] is res
            // test that res is not an error
            res.should.have.ownProperty("error");
            res.error.should.be.an.instanceof(Error);
            res.status.should.eql(400);
            done();
          });

          agent.serviceHandler(serviceDesc, {
            callback: callback
          });

          server.respond();
        });

        it("should use provided callback on abort", function (done) {
          var callback = sinon.spy(function (err) {
            err.should.be.an.instanceof(Error);
            done();
          });

          var req = agent.serviceHandler(serviceDesc, {
            callback: callback
          });

          req.abort();
        });

        describe("if not null", function () {
          it("should prevent resolve handler to be called on request success", function (done) {
            server.respondWith("GET", "http://domain.tld/foo", [200, {}, "ok"]);

            var resolveSpy = sinon.spy(function () {});

            var spy = sinon.spy(function (res) {
              // at least we are sure that this function has been called
              // spy.args[0] is res
              // test that res is not an error and resolveSpy not called
              res.should.have.ownProperty("req");
              res.status.should.eql(200);

              resolveSpy.callCount.should.eql(0);
              done();
            });

            agent.serviceHandler(serviceDesc, {
              callback: spy,
              resolve: resolveSpy
            });

            server.respond();
          });

          it("should prevent reject handler to be called on request error", function (done) {
            server.respondWith("GET", "http://domain.tld/foo", [400, {}, "ko"]);

            var rejectSpy = sinon.spy(function () {});

            var spy = sinon.spy(function (res) {
              // at least we are sure that this function has been called
              // spy.args[0] is res
              // test that res is an error and that reject has been called
              res.should.have.ownProperty("error");
              res.status.should.eql(400);

              rejectSpy.callCount.should.eql(0);
              done();
            });

            agent.serviceHandler(serviceDesc, {
              callback: spy,
              reject: rejectSpy
            });

            server.respond();
          });
        });
      });

      describe("edit function option", function () {
        it("should define a null callback by default", function (done) {
          server.respondWith("GET", "http://domain.tld/foo", [200, {}, "ok"]);

          var editSpy = sinon.spy(function () {});

          var spy = sinon.spy(function () {
            editSpy.callCount.should.eql(1);
            var editArgs = editSpy.args[0];
            editArgs.should.have.lengthOf(1);
            editArgs[0].should.eql(req);

            done();
          });

          var req = agent.serviceHandler(serviceDesc, {
            callback: spy,
            edit: editSpy
          });

          server.respond();
        });

        it("should not throw if not a function", function (done) {
          server.respondWith("GET", "http://domain.tld/foo", [200, {}, "ok"]);

          should.not.Throw(function () {
            agent.serviceHandler(serviceDesc, {
              callback: function () {
                done();
              },
              edit: "this.should.be.a.function"
            });
          });

          server.respond();
        });

        it("should be called if provided", function (done) {
          server.respondWith("GET", "http://domain.tld/foo", [200, {}, "ok"]);

          var editSpy = sinon.spy(function () {});

          var spy = sinon.spy(function () {
            editSpy.callCount.should.eql(1);
            done();
          });

          agent.serviceHandler(serviceDesc, {
            callback: spy,
            edit: editSpy
          });

          server.respond();
        });

        it("should call it prior to launching request", function (done) {
          server.respondWith("GET", "http://domain.tld/foo", [200, {}, "ok"]);

          var editSpy = sinon.spy(function () {});

          var spy = sinon.spy(function () {
            editSpy.callCount.should.eql(1);
            done();
          });

          agent.serviceHandler(serviceDesc, {
            callback: spy,
            edit: editSpy
          });

          server.respond();
        });
      });

      it("should call resolve on response success", function (done) {
        server.respondWith("GET", "http://domain.tld/foo", [200, {}, "ok"]);

        var spy = sinon.spy(function (res) {
          res.should.have.ownProperty("req");
          res.status.should.eql(200);

          done();
        });

        agent.serviceHandler(serviceDesc, {
          resolve: spy,
        });

        server.respond();
      });

      it("should call reject on response error", function (done) {
        server.respondWith("GET", "http://domain.tld/foo", [404, {}, "ko"]);

        var spy = sinon.spy(function (res) {
          res.should.have.ownProperty("req");
          res.status.should.eql(404);

          done();
        });

        agent.serviceHandler(serviceDesc, {
          reject: spy,
        });

        server.respond();
      });

      it("should not call resolve on response error", function (done) {
        server.respondWith("GET", "http://domain.tld/foo", [404, {}, "ko"]);

        var resolveSpy = sinon.spy(function () {});

        var rejectSpy = sinon.spy(function (res) {
          res.status.should.eql(404);
          // jshint -W030
          resolveSpy.called.should.be.false;
          // jshint +W030
          done();
        });

        agent.serviceHandler(serviceDesc, {
          resolve: resolveSpy,
          reject: rejectSpy,
        });

        server.respond();
      });

      it("should not call reject on response success", function (done) {
        server.respondWith("GET", "http://domain.tld/foo", [200, {}, "ok"]);

        var resolveSpy = sinon.spy(function (res) {
          res.status.should.eql(200);
          // jshint -W030
          rejectSpy.called.should.be.false;
          // jshint +W030
          done();
        });

        var rejectSpy = sinon.spy(function () {});

        agent.serviceHandler(serviceDesc, {
          resolve: resolveSpy,
          reject: rejectSpy,
        });

        server.respond();
      });

      it("should call reject but not resolve on request abort", function (done) {
        var resolveSpy = sinon.spy(function () {});

        var rejectSpy = sinon.spy(function (err) {
          err.should.be.instanceof(Error);
          // jshint -W030
          resolveSpy.called.should.be.false;
          // jshint +W030
          done();
        });

        var req = agent.serviceHandler(serviceDesc, {
          resolve: resolveSpy,
          reject: rejectSpy,
        });

        req.abort();
      });
    });
  });
});
