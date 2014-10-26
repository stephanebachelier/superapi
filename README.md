# superapi

## description

Superapi is a (super) wrapper around the excellent superagent library to help configuring any service call to an API or any  HTTP request.

The idea is to remove any setup while calling an API. Just provide a service id, some options and callbacks and your set up.

## Notice

This library is built using es6 with [grunt-es-module-transpiler](https://github.com/joefiorini/grunt-es6-module-transpiler), with superagent as it's only dependency.

The library, thus, does not require `superagent`, but you should give a reference to the superagent `agent` like this.
```
// node
var myApi = superapi.default({
  /* configuration*/
});

myApi.agent = require('superagent'); // node

// AMD
define(['superapi', 'superagent'], function (superapi, superagent) {
  var api = superapi.default({ /* configuration */ });
  api.agent = superagent;
  return api;
});
```

## configuration

Configuration is made by providing a JSON file in the format of:

```
{
  baseUrl: "http://foo.domain.tld",
  headers: {
    // default headers
  },
  services: [
    { /* service description */ }
  ]
}
```

### general options

Below are the supported options in the configuration.

#### baseUrl: (string)

This is the base url that will be prefixed to any service path. For a base url like `http://foo.domain.tld/api` and a service path of `/my/service` the generated url will be, without any surprise `http://foo.domain.tld/api/my/service`.

#### default headers: (object)

The idea of this object is to provide some generic headers. As an example superagent does not set the header `X-Requested-With` which is often needed to be set with the value of `XMLHttpRequest`.

This the default headers can be:

```
{
  "X-Requested-With": "XMLHttpRequest"
}
```

#### default options: (object)

Example:
```
{
  type: 'json'
}
```

### service configuration

```
myservice: {
  path: '/something' // mandatory
  method: 'GET|POST|PUT|DELETE|PATCH' default to 'GET'
  headers: {
    // key - value for any specific headers not handle by superagent
  },
  options: {
    // see superagent options
    type: String,
    accept: 'json'
  }
}
```

### with credentials

If you want any cookie to be added back when making an XHR request, you must set the `withCredentials` option onthe XHR. Superapi configuration support the `withCredential` option by adding the special property `withCredentials: true` at the top level:

```
{
  baseUrl: "http://foo.domain.tld",
  headers: {
    // default headers
  },
  services: [
    { /* service description */ }
  ],
  withCredentials: true
}
```

The reason while this flag can be set on a service, is that I don't see any use case for this. Feel free to make a PR with a use case.

### Setting headers at runtime.

There may be some use cases where you need to set a header which is not know before running. One example could be some specific header that an API send you that you must return.

An example for this is the CSRF token which in a Single Page Application (SPA) context, are sent by HTTP headers. The use case that I know well is about a login request that sent you back a CSRF token that you will have to send each time you make a request.

The solution is to use the new `addHeader(name, value)` which will record some runtime headers that will be added on each request fired.

An example to illustrate is better than words:

```
// api configuration
var myApi = superapi.default({
  baseUrl: 'http://foo.domain.tld/api',
  services: {
    foo: {
      path: 'bar'
    }
  }
});

// add a header at runtime
api.addHeader('csrf', 'my-awesome-csrf-token');

// will call http://foo.domain.tld/api/bar with the header `csrf` set to my-awesome-csrf-token'.
myApi.api.foo();
```

Another example:
```
// on login successful the response contains a csrf value which must be added
// back on subsequent requests
superapi.api.login(/* */)
  .on('success', function (res) {
    // add runtime header
    superapi.api.addHeader('csrf', res.body.csrf);
  });

superapi.api.profile(/* */)
// you can check that the given header 'csrf' is in the request headers
```

### Tokenized url

You often need to parameterize API path where parameters will only be known at runtime. The solution is simple just use `:token`, eg:

```
// configuration
superapi.default({
  services: {
    editMovie: {
      path: '/movies/:id',
      method: 'post'
    }
  }
});
```

You will need to pass a parameters object that will be replaced.

```
superapi.api.editMovie(data, {id: 12345});
```

Voila! easy.

### Query string

Superapi also support query arguments. You just need to pass and object to any of the following methods:

* `buildUrl(id, params, query)`
* `request: function (id, data, params, query)`

Query arguments are not added to configuration for now. I did not found any use cases, except for validation, so I choose to let it opened. So if you need to add query args, just provide an object as the `query` args and it will be used to create the query string.

As an example, if you want to request a route `http://example.tld/user/john.doe.json?content=post&since=19700101`, you can use the following configuration :

```
var api = superapi.default({
  baseUrl: 'http://example.tld',
  services: {
    foo: {
      path:'/user/:foo.:bar.json'
    }
  }
});
api.agent = superagent;
```

And then you just need to make this function call to request the parameterized url :

```
var req = api.request('foo', undefined, {
  foo: 'john',
  bar: 'doe'
}, {
  content: 'post',
  since: '19700101'
});

// url will be http://example.tld/user/john.doe.json?content=post&since=19700101
```

In the previous example second parameter is set to undefined as we are not using data field.

### Configuration

`Options`, which are __in fine__ HTTP headers are set before `headers`.

## Usage

### build library

```
$ grunt build
```
This task build the distribution for browser, AMD or CommonJS:
 * browser: dist/superapi.js
 * AMD: dist/amd/superapi.amd.js
 * CommonJS: dist/commonjs/main.js

### test

Tests are written using `mocha` and run with `karma` test runner.

You can use either use the following `grunt` command or simply run the `karma start` command. The first is provided only to ease development.

```
$ grunt dev
```

This task will start karma test runner and watch repository for code change.


## CHANGELOG

See [CHANGELOG.md](https://github.com/stephanebachelier/superapi/blob/master/CHANGELOG.md)
