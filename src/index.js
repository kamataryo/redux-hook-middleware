// hooking Middleware
// refer to http://qiita.com/kuy/items/57c6007f3b8a9b267a8e

const prehooks = {}

const posthooks = {
  ['hooking action names']: (store, action) => {
    // doAnything
  }
}

/**
 * Redux Middleware to chain api call
 * @param  {Store}      store  Redux store
 * @param  {Middleware} next   next middlwware
 * @param  {Action}     action dispatched action
 * @return {void}
 */
export default store => next => action => {
  const prehook = prehooks[action.type]
  const posthook = posthooks[action.type]

  prehook && prehook(store, action)
  next(action)
  posthook && posthook(store, action)
}
