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
