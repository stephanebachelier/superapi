# superapi

[![Build Status](https://travis-ci.org/stephanebachelier/superapi.svg)](https://travis-ci.org/stephanebachelier/superapi)

Any service call should be as easy as calling a simple function!!!!

Really.

Calling the api login service should be as easy as `api.login(params)`.

## Description

Superapi is a (super) wrapper around the excellent superagent library to help configuring any service call to an API or any  HTTP request.

The idea is to remove any setup while calling an API. Just provide a service id, some options and callbacks and your set up.

Briefly `superapi` is a small library to never configure XHR calls in your code. Why ? Because :
- it makes reading harder,
- you will possibly introduce bugs as you will duplicate code to configure all XHR
- difficult to override your code for different environments
- hardcoded url or paths in your code, which implies that for any changes in URL, paths or whatever, let's say send in url form encoded format instead of JSON, you will have to dig into your code base to make changes.

So superapi is XHR built on steroid using `superagent`, JSON configuration and middlewares to give you simple `Promise-based functions` to use to call any service API you need.

And if you don't want to use a configuration you can still you all HTTP verb helpers using `api.get()`, `api.post()`, ...

You should not have to parameterize the api calls when you only need to use it!


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

## Basic usage

### Define services

```
var myApi = superapi.default({
  baseUrl: "http://foo.domain.tld",
  headers: {
    // default headers
  },
  options: {
    // superagent options
    accept: 'json'
  },   
  services: {
    createItem: {
      path: '/users',
      method: 'POST',
      options: {
        type: 'json'
      }
    },
    getIem: {
      path: 'items/:id'
    }
  }
}
```

### Get request

```
var req = myApi.api.getItem({
  params: {
    id: 3
  }
});

req.then(function(response) {}, function(error) {});
```

or

```
myApi.api.getItem({
  params: {
    id: 3
  },
  callback: function(error, response) {
  }
});
```

### Post request

```
myApi.api.createItem({
  data: {
    id: 3
    title: 'hi there'
  }
})
.then(function(response) {}, function(error) {});
```

## Configuration

Configuration is made by providing a Javascript object:

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

### General options

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

### Service configuration

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

If you want any cookie to be added back when making an XHR request, you must set the `withCredentials` option on the XHR. Superapi configuration support the `withCredential` option by adding the special property `withCredentials: true` at the top level:

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

The reason while this flag can't be set on a service, is that I don't see any use case for this. Feel free to make a PR with a use case.

### Setting headers at runtime.

There may be some use cases where you need to set a header at runtime after the global configuration step. One example could be some specific header that an API sent you and that you must send back with each request afterwards.

An example for this is the CSRF token which in a Single Page Application (SPA) context, are sent by HTTP headers. The use case that I know well is about a login request that sent you back a CSRF token. That CSRF token must now be send as header each time a new request is made.

One solution is to use the new `addHeader(name, value)` function which will record a runtime header that will be added on each request fired.

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

You often need to parameterize API path with values only known at runtime. In this case, you can write the service's path with placeholder with the following syntax `:token`.

Service definition:  

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

Then when you call the api, You will need to pass a "parameters" object containing replacement values for the defined placeholders:

```
superapi.api.editMovie({
    data: data,
    params: {
      id: 12345
    }
  });
```

Voila! easy.

### Query string

Superapi also support query arguments. You just need to pass an object to any of the following methods:

* `buildUrl(id, params, query)`
* `request: function (id, data, params, query)`

Query arguments are not added to configuration for now. I did not found any use cases, except for validation, so I choose to let it opened. If you need to add query args, just provide an object as the `query` args and it will be used to create the query string.

As an example, if you want to construct a query for the route `http://example.tld/user/john.doe.json?content=post&since=19700101`, you can use the following configuration :

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

Another way to write the same request with the defined "foo" service would be :
```
var req = api.api.foo({
  params: {
    foo: 'john',
    bar: 'doe'
  },
  query: {
    content: 'post',
    since: '19700101'
  }
});
```


### Configuration

`Options`, which are __in fine__ HTTP headers are set before `headers`.

## Middlewares

Since `superapi@0.11` the concept of middlewares have been added. The middleware is simply a function that will receive
two arguments `req` and `next`. To access the response you need to call `next` which in return return you a promise.

So basically a middleware is :

```js
function (req, next) {
  // do something!
}
```

If you want to manipulate the request like adding headers, changing the url or whatever you need just access the request!

Changing the url of the request is thus easy:
```js
function (req, next) {
  req.url = 'http://google.fr';
}
```

But wait! How we apply a middleware ? Easy ! You only need to `register` your middleware.

```js
api.register('mitm', function (req, next) {
  req.url = 'http://google.fr'
});
```

Be careful that order matters.

```js
api.register('foo', function (req, next) {
  req.url = 'https://google.com'
});

api.register('bar', function (req, next) {
  req.url = 'https://twitter.com'
});
```
Will result in a request to `https://twitter.com`, while the example below will result in a request to `https://google.com`.

```js
api.register('bar', function (req, next) {
  req.url = 'https://twitter.com'
});
api.register('foo', function (req, next) {
  req.url = 'https://google.com'
});
```

The use of the name is useless for now, but it is only here to prepare for the next coming version.


## Development

### build library

```
$ grunt build
```
This task build the distribution for browser, AMD or CommonJS:
 * browser: dist/superapi.js
 * AMD: dist/amd/superapi.amd.js
 * CommonJS: dist/commonjs/main.js

## Tests

Just to note that you should not test in PhantomJS as the code use the `bind` function unless you provide
a polyfill.

You will also need to provide a polyfill for Promise if your environment does not provide a native implementation
like `bluebird`, this one being recommended as being really fast. Just simply require `bluebird`.

### AMD

Tests are written using `mocha` and run with `karma` test runner.

You can use either use the following `grunt` command or simply run the `karma start` command. The first is provided only to ease development.

```
$ grunt dev
```

This task will start karma test runner and watch repository for code change.

### Browser testing

To test the build browser you will need to start first the simple express API running

```
node tests/api.js
```

And then open the `tests/browser/index.html` file in your browser and watch the console.


### Node testing

You should test the commonjs specs which will just run a few tests, the same as browser testing.

First start the small express API
```
node tests/api.js
```

And then launch the small test suite:
```
./node_modules/.bin/mocha --opts tests/commonjs/mocha.opts tests/commonjs/specs/*.js
```

## CHANGELOG

See [CHANGELOG.md](https://github.com/stephanebachelier/superapi/blob/master/CHANGELOG.md)

## Contributors

 * [Adrien Delorme](https://github.com/azr)
 * [Tuomas Peippo](https://github.com/tume)
 * [Jonathan Dray](https://github.com/spiroid)

See [details](https://github.com/stephanebachelier/superapi/graphs/contributors)
