<a name="0.6.5"></a>
### 0.6.5 (2014-09-18)


#### Features

* **api:** add buildUrl() ([824c6b1e](https://github.com/stephanebachelier/superapi/commit/824c6b1ecad40f1beb414a8c3dc3802a3c9b925e))


<a name="0.6.4"></a>
### 0.6.4 (2014-09-16)


#### Bug Fixes

* **params.regexp:** use a generic pattern. ([27fa264c](https://github.com/stephanebachelier/superapi/commit/27fa264c3d2e88ec734679be9c49a83b4da67e2a))


<a name="0.6.3"></a>
### 0.6.3 (2014-09-14)


#### Features

* **remove.header:** add removeHeader API call ([8d3cdbe7](https://github.com/stephanebachelier/superapi/commit/8d3cdbe7dc4de16b698c36b2943d2ec05c9a87a9))


<a name="0.6.2"></a>
### 0.6.2 (2014-08-14)



#### Bug Fixes

* **buildUrl:** guard against undefined tokens ([f6454d4f](https://github.com/stephanebachelier/superapi/commit/f6454d4f34e25f8e19a50ed0a63a3c28b0854294))


<a name="0.6.1"></a>
### 0.6.1 (2014-08-14)


<a name="0.6.0"></a>
### 0.6.0 (2014-08-14)


#### Features

* **superagent:** set superagent as an external dependencies ([ca5a12d4](https://github.com/stephanebachelier/superapi/commit/ca5a12d48cc5bfffb9b3d64619ffe5bd968d96cd))


#### Breaking Changes

* remove superagent-e6 dependency
 ([ca5a12d4](https://github.com/stephanebachelier/superapi/commit/ca5a12d48cc5bfffb9b3d64619ffe5bd968d96cd))


<a name="0.5.0"></a>
### 0.5.0 (2014-08-14)


#### Features

* **headers:** add runtime headers ([5c51a62a](https://github.com/stephanebachelier/superapi/commit/5c51a62ae05317b0ca189c06affdd515cf05fc49))


<a name="0.4.1"></a>
### 0.4.1 (2014-07-31)


#### Bug Fixes

* **serviceHandler:** bind closure to the api context ([b7986d53](https://github.com/stephanebachelier/superapi/commit/b7986d5313ae10c33d33d47e3a2d654efa8d89e9))


<a name="0.4.0"></a>
### 0.4.0 (2014-07-30)

#### Breaking Changes

* Services syntactic sugar methods are now placed in the **api** property instead of directly added to the
superapi instance. Will prevent any possible collision.

#### Bug Fixes

* **url:** do not replace a token if not a given parameter ([40fdadc2](https://github.com/stephanebachelier/superapi/commit/40fdadc28b4e976f50b546919fc52f4210cde882))


#### Features

* **credentials:** add support for withCredentials ([f2c5806d](https://github.com/stephanebachelier/superapi/commit/f2c5806d5c543dbc821dcded1da69b5575863834))
* **handlers:** pass data and params back to response handlers ([1dcad34e](https://github.com/stephanebachelier/superapi/commit/1dcad34ea1f0f120e15f6d83d376700c9680e4ae))
* **superagent:** add an es6 version for cjs and amd ([a51ec32a](https://github.com/stephanebachelier/superapi/commit/a51ec32ade27c16151f7299cb38ba96800b28333))


<a name="0.3.0"></a>
### 0.3.0 (2014-07-19)


#### Bug Fixes

* **api:** service handlers are now set in a closure ([fc2ab98c](https://github.com/stephanebachelier/superapi/commit/fc2ab98cd2678c5b725733f6294acefeaa0c4cc8))
* **callback:** fix issue about wrong context ([5b5814cb](https://github.com/stephanebachelier/superapi/commit/5b5814cbc64823f309091fb7efbe5528ac8d6f01))


#### Features

* **parameters:** add support for parameterized url ([4221cc48](https://github.com/stephanebachelier/superapi/commit/4221cc48f17d4b7901b884b0e2f014c7642452e4))


<a name="0.2.0"></a>
### 0.2.0 (2014-05-12)


#### Bug Fixes

* **superagent:** add a wrapper around superagent not es6 friendly ([e7d9460a](https://github.com/stephanebachelier/superapi/commit/e7d9460a3ac2bdb9db1359f2ff375e62d36db570))
* **typo:** and jshint warnings ([dafa9a0f](https://github.com/stephanebachelier/superapi/commit/dafa9a0f73c3bbce09c1b917395bc0e4d02a2bd4))


#### Features

* **service:** service are available as method on the api instance ([8fb7d402](https://github.com/stephanebachelier/superapi/commit/8fb7d40285e8df5a04a0280c735f95acdf4960c5))
