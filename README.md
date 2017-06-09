# redux-hook-middleware

[![Build Status](https://travis-ci.org/kamataryo/redux-hook-middleware.svg?branch=master)](https://travis-ci.org/kamataryo/redux-hook-middleware)
[![Build status](https://ci.appveyor.com/api/projects/status/eocea8d71kqcmrim?svg=true)](https://ci.appveyor.com/project/KamataRyo55333/redux-hook-middleware)
[![codecov](https://codecov.io/gh/kamataryo/redux-hook-middleware/branch/master/graph/badge.svg)](https://codecov.io/gh/kamataryo/redux-hook-middleware)

[![npm (scoped)](https://img.shields.io/npm/v/redux-hook-middleware.svg)](https://www.npmjs.com/package/kamataryo/redux-hook-middleware)
[![downloads](https://img.shields.io/npm/dt/redux-hook-middleware.svg)](https://www.npmjs.com/package/redux-hook-middleware)

[![Dependency Status](https://img.shields.io/david/kamataryo/redux-hook-middleware.svg?style=flat)](https://david-dm.org/kamataryo/redux-hook-middleware)
[![devDependency Status](https://img.shields.io/david/dev/kamataryo/redux-hook-middleware.svg?style=flat)](https://david-dm.org/kamataryo/redux-hook-middleware#info=devDependencies)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Middleware to hook store dispatch

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

// redux logics
registerPrehook('log', (store, action) => {
  console.log('prehooked!')
})
store.dispatch({ type: 'log' }) // 'prehooked!'
```

## API

### `registerPrehook(type<string>, hook<function>)<symbol>`

register a hook for former middleware chain.
returns uniq id for the hook.

### `registerPosthook(type: string, hook: function)<symbol>`

register a hook for later middleware chain.
returns uniq id for the hook.

### `unregisterHook(id:<symbol>)`

unregister the hook.

### `clearHooks()`

unregister all the hooks registered.

## TODOs

- This middleware is a singleton. Instance generator should be needed.
