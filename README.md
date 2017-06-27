# redux-hook-middleware

[![Build Status](https://travis-ci.org/kamataryo/redux-hook-middleware.svg?branch=master)](https://travis-ci.org/kamataryo/redux-hook-middleware)
[![Build status](https://ci.appveyor.com/api/projects/status/eocea8d71kqcmrim/branch/master?svg=true)](https://ci.appveyor.com/project/KamataRyo55333/redux-hook-middleware)
[![codecov](https://codecov.io/gh/kamataryo/redux-hook-middleware/branch/master/graph/badge.svg)](https://codecov.io/gh/kamataryo/redux-hook-middleware)
[![runkit](https://img.shields.io/badge/RunKit-Try%20Now%20%E2%96%B6%EF%B8%8F-green.svg)](https://runkit.com/593b1972dbdedb001293ebfe/593b1972dbdedb001293ebff)

[![npm (scoped)](https://img.shields.io/npm/v/redux-hook-middleware.svg)](https://www.npmjs.com/package/redux-hook-middleware)
[![downloads](https://img.shields.io/npm/dt/redux-hook-middleware.svg)](https://www.npmjs.com/package/redux-hook-middleware)
[![Dependency Status](https://img.shields.io/david/kamataryo/redux-hook-middleware.svg?style=flat)](https://david-dm.org/kamataryo/redux-hook-middleware)
[![devDependency Status](https://img.shields.io/david/dev/kamataryo/redux-hook-middleware.svg?style=flat)](https://david-dm.org/kamataryo/redux-hook-middleware#info=devDependencies)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A Redux middleware to provide easy hooks on pre/post dispatch.

## install

```shell
$ npm i redux-hook-middleware -S
```

## usage

```javascript
import { createStore, applyMiddleware } from 'redux'
import hookMiddleware, { registerPrehook } from 'redux-hook-middleware'

// redux setup
const initialState = { /* initial state */ }
const reducer = (state = initialState, action) => { /* reducer function logics */ return state }
const middlewares = [hookMiddleware]
const store = createStore(reducer, initialState, applyMiddleware(...middlewares))

// middleware logic
registerPrehook('HOOKING_ACTION_TYPE', (store, action) => {
  console.log('prehooked!')
  // do anything inside callback
  // you can also dispatch other actions
  store.dispatch({ type: 'SOME_ACTION_TYPE' })
})

// how does it works
store.dispatch({ type: 'HOOKING_ACTION_TYPE' }) // 'prehooked!'
```

## APIs

### `registerPrehook(type<string>, hook<function>)<symbol>`

Register a hook for former middleware chain and return uniq id for the hook.

### `registerPosthook(type<string>, hook<function>)<symbol>`

Register a hook for later middleware chain and return uniq id for the hook.

### `registerPrehooks(hookObject<object>)<object>`

Register hooks for former middleware chain and return uniq id for the hook.
Pass an action type as key and a callback or an array of callbacks as value.

### `registerPosthooks(hookObject<object>)<onject>`

Register hooks for later middleware chain and return uniq id for the hook.
Pass an action type as key and a callback or an array of callbacks as value.

### `unregisterHook(id<symbol>)<void>`

Unregister the hook with hook id.

### `clearHooks()<void>`

Unregister all the hooks registered.

## development

```shell
$ git clone https://github.com/kamataryo/redux-hook-middleware.git
$ cd redux-hook-middleware
$ npm test
```
