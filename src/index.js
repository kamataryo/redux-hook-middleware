// hooking Middleware

export const hooks = {}

/**
 * register dispatch hook
 * @param  {'pre'|'post'} position define pre or post hook
 * @param  {string}       type     action type
 * @param  {function}     hook     hook
 * @return {false|symbol}          return hook id or false when failed
 */
export const registerHook = (position, type, hook) => {
  if (typeof hook !== 'function') {
    return false
  }
  if (typeof type !== 'string') {
    return false
  }
  if (typeof position !== 'string') {
    return false
  }

  if (!hooks[type]) {
    hooks[type] = []
  }

  const id = Symbol(type)
  hooks[type].push({ position, id, hook })

  return id
}

/**
 * curried hooking function
 * @param  {string}   type action type
 * @param  {function} hook hook
 * @return {function}      curried register function
 */
export const registerPrehook = (type, hook) => {
  return registerHook('pre', type, hook)
}

/**
* curried hooking function
 * @param  {string}   type action type
 * @param  {function} hook hook
 * @return {function}      curried register function
 */
export const registerPosthook = (type, hook) => {
  return registerHook('post', type, hook)
}

/**
 * unregister dispatch hook
 * @param  {symbol} id given hook
 * @return {void}
 */
export const unregisterHook = id => {
  Object.keys(hooks).forEach(type => {
    hooks[type] = hooks[type].filter(x => x.id !== id)
  })
}

/**
 * clear all hooks
 * @return {void}
 */
export const clearHooks = () => {
  Object.keys(hooks).forEach(type => {
    delete hooks[type]
  })
}

/**
 * Redux Middleware to chain api call
 * @param  {Store}      store  Redux store
 * @param  {Middleware} next   next middlwware
 * @param  {Action}     action dispatched action
 * @return {void}
 */
export default store => next => action => {
  /**
   * [getTheHooksAt description]
   * @param  {'pre'|'post'}     position determine pre or post
   * @return {array<function>}           hooks
   */
  const getTheHooksAt = position => action && hooks[action.type] ? (
    hooks[action.type]
      .filter(x => x.position === position)
      .map(x => x.hook)
  ) : []
  const prehooks  = getTheHooksAt('pre')
  const posthooks =  getTheHooksAt('post')

  prehooks.forEach(hook => hook(store, action))
  next(action)
  posthooks.forEach(hook => hook(store, action))
}
