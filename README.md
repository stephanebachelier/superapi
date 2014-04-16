# superapi

## description

Superapi is a (super) wrapper around the excellent superagent library to help configuring any service call to an API or any  HTTP request.

The idea is to remove any setup while calling an API. Just provide a service id, some options and callbacks and your set up.

## Notice

This library is built using es6 with [grunt-es-module-transpiler](https://github.com/joefiorini/grunt-es6-module-transpiler), with superagent as it's only dependency.

As a side effect of using es6 notation a module must provide a `default` property which any es5 library does not. So for now, you must use a tiny wrapper around `superagent` which roles is only to export `superagent` in an object with a default property.

## configuration

Configuration is made by providing a JSON file in the format of:

```json
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

```json
{
  "X-Requested-With": "XMLHttpRequest"
}
```

#### default options: (object)

Example:
```json
{
  type: 'json'
}
```

### service configuration

```json
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

### Configuration

`Options`, which are __in fine__ HTTP headers are set before `headers`.

## Usage

### build library

```
$ grunt build
```
This task build the distribution version either AMD or CommonJS.
Browser version should be added. (TODO)

### contribute

```
$ grunt dev
```

This task will start karma test runner and watch repository for code change.
