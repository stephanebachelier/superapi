<a name="0.8.6"></a>
### 0.8.6 (2015-02-10)

#### Bug fixes

* **request:**: don't pass data to delete ([1b306ca2](https://github.com/stephanebachelier/superapi/commit/1b306ca2a3339da3ea759702baccdfdbc4fb20a7))


<a name="0.8.5"></a>
### 0.8.5 (2015-01-31)

#### Features

* **timeout:** trick superagent logic to return a timeout error ([03c636c4](https://github.com/stephanebachelier/superapi/commit/03c636c4870f43ecccec97b269f50b8b6df10932))


<a name="0.8.4"></a>
### 0.8.4 (2015-01-31)

#### Features

* **timeout:** add support for timeout ([c0a5d3be](https://github.com/stephanebachelier/superapi/commit/c0a5d3be0cdaeede4d4f1591d1ff5ae6e8f7ed77))


<a name="0.8.3"></a>
### 0.8.3 (2015-01-16)


#### Features

* **buildUrl:** do not prepend baseUrl if path is already an url ([fbaa0418](https://github.com/stephanebachelier/superapi/commit/fbaa04189cb977f455da65cfaee4b1bf87b9dcc8))


<a name="0.8.2"></a>
### 0.8.2 (2015-12-16)


#### Bug Fixes

* **end.response:** resolve response as first argument ([60d8702c](https://github.com/stephanebachelier/superapi/commit/60d8702c89b564d026d23fbde7e7e37fb397c25b))


<a name="0.8.1"></a>
### 0.8.1 (2014-12-10)


#### Bug Fixes

* **result:** change condition to not return an error on 3xx ([9b50aae0](https://github.com/stephanebachelier/superapi/commit/9b50aae0c5e50fd973f9beaee9a5aca7a4dc3737))

<a name="0.8.0"></a>
## 0.8.0 (2014-12-08)


#### Features

* **serviceHandler:**
  * switch to promise ([6973fb8c](https://github.com/stephanebachelier/superapi/commit/6973fb8c561334e5c18f97aa96256ce32972b4d9))
  * change signature to use object ([82ae9dbc](https://github.com/stephanebachelier/superapi/commit/82ae9dbcc6c78bb9203fd59f6aa47bae091b9be4))
* **servicehandler:** set default to null to avoid truthy test ([c5a83b24](https://github.com/stephanebachelier/superapi/commit/c5a83b24ec2259c51f9bd36f95c5eaed71c9a34d))


<a name="0.7.0"></a>
## 0.7.0 (2014-10-29)


#### Bug Fixes

* **serviceHandler:** add query args to service handler sugar ([b859ce9b](https://github.com/stephanebachelier/superapi/commit/b859ce9b7d42e16fa8aec2cad4e9e93e0d3128d9))
* **tests:** change request calling as api changed ([213e044b](https://github.com/stephanebachelier/superapi/commit/213e044ba43e4931a24652c7cc4e2a3a718df5af))


#### Features

* **before:** add before clb to do stuff before .end ([e7f3b49a](https://github.com/stephanebachelier/superapi/commit/e7f3b49aa9c52ffce41fc6c7d7f3d565c90c88f5))


<a name="0.6.6"></a>
## 0.6.6 (2014-10-26)


#### Features

* **query:** support to add query args to url ([cdcaced3](https://github.com/stephanebachelier/superapi/commit/cdcaced37ffc0b8f78bfab3872b5a5b7dc36dabc))
* **request:** add support for query string ([ab720d6f](https://github.com/stephanebachelier/superapi/commit/ab720d6f01f2419485f6eda8dee1f2b2a6263102))


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
