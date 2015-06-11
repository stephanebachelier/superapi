define([
  "superapi",
  "superagent"
], function (superapi, superagent) {
  "use strict";

  describe.skip("request", function () {
    var api;
    var server;

    beforeEach(function () {
      api = superapi.default({
        baseUrl: "http://example.tld",
        services: {
          foo: {
            path:"/user/:foo.:bar.json"
          }
        }
      });
      api.agent = superagent;

      // add sinon to fake the XHR call
      server = sinon.fakeServer.create();
    });

    afterEach(function () {
      server.restore();
      server = null;
      api = null;
    });

    it("api sugar should build the correct url with any tokens or query args", function (done) {
      // configure response
      server.respondWith("GET",
        "http://example.tld/user/john.doe.json?content=post&since=19700101",
        [200, {"Content-Type": "application/json"}, JSON.stringify({result: "ok"})]
      );

      api.api.foo({
        params: {
          foo: "john",
          bar: "doe"
        },
        query: {
          content: "post",
          since: "19700101"
        }
      }).then(function (res) {
        res.req.url.should.eql("http://example.tld/user/john.doe.json?content=post&since=19700101");
        done();
      });

      server.respond();
    });

    it("should be possible to modify request in edit handler", function (done) {
      var fakeUrl = "http://example.tld/user/johnny.depp.json?content=post&since=19700101";

      server.respondWith("GET", fakeUrl,
        [200, {"Content-Type": "application/json"}, JSON.stringify({result: "ok"})]
      );

      var editFn = sinon.spy(function (req) {
        // change url
        req.url = fakeUrl;
      });

      api.api.foo({
        params: {
          foo: "john",
          bar: "doe"
        },
        query: {
          content: "post",
          since: "19700101"
        },
        edit: editFn
      }).then(function () {
        // jshint -W030
        editFn.should.have.been.called;
        // jshint +W030
        done();
      });

      server.respond();
    });
  });

  describe.skip("send request", function () {
    var api;

    beforeEach(function () {
      api = superapi.default();
    });

    afterEach(function () {
      api = null;
    });

    it("should throw if no agent defined", function () {
      should.Throw(function () {
        api.sendRequest();
      }, "missing superagent");
    });

    it("should throw if no method defined", function () {
      api.agent = superagent;
      should.Throw(function () {
        api.sendRequest();
      }, "Unsupported method");
    });
  });

  describe.skip("uploading", function () {

    it.skip("can be done with a multipart/form-data request", function () {
      var api = superapi.default({
        baseUrl: "api",
        services: {
          upload: {
            path: "upload",
            method: "POST",
            headers: {
              "X-Requested-With": "XMLHttpRequest"
            }
          }
        }
      });

      var fileData = {
        file: new Image()
      };
      // black pixel
      fileData.file.src = "data:image/png;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=";

      api.agent = superagent;

      var attachFile = function (request) {
        delete(request.header["Content-Type"]);
        request.attach("image", fileData, "stuff.jpg");
      };
      var onResponse = function (response) {
        var request = response.req;
        request.hasOwnProperty("_formData");
        // We should test that
        // request.header["Content-type"] matches
        // Content-Type:multipart/form-data; boundary=----WebKitFormBoundary...
        // But it is not set back as it is a navigator behavior.
        // A recieving server should check that.
      };

      api.api.upload({}, undefined, undefined, onResponse, attachFile);
    });
  });
});
