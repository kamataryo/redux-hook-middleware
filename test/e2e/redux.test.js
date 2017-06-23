import { createStore, applyMiddleware } from 'redux'
import sinon from 'sinon'
import { expect } from 'chai'
import hookMiddleware, {
  registerPrehook,
  registerPosthook,
} from '../../src/index'

/**
 * reducer function
 * @param  {State} [state={ case: '' }] state
 * @param  {Action} action    Action
 * @return {[type]}            [description]
 */
const reducer = (state = { case: '' }, action) => {
  if (action.type === 'typeA') {
    return { case: 'A' }
  } else {
    return state
  }
}

/**
 * spying middleware
 * @param  {function} preSpy  spy before next called
 * @param  {function} postSpy spy after next called
 * @return {Middleware}       a middleware
 */
const createSpyMiddleware = (preSpy, postSpy) => store => next => action => {
  preSpy(store.getState())
  const result = next(action)
  postSpy(store.getState())
  return result
}

const prevPreSpy = sinon.spy()
const prevPostSpy = sinon.spy()
const nextPreSpy = sinon.spy()
const nextPostSpy = sinon.spy()

const middlewares = [
  createSpyMiddleware(prevPreSpy, prevPostSpy),
  hookMiddleware,
  createSpyMiddleware(nextPreSpy, nextPostSpy),
]

const store = createStore(
  reducer,
  { case: '' }, // preloadState
  applyMiddleware(...middlewares) // enhancer
)

describe('e2e test with redux API', () => {

  it('should hook synchronous', () => {

    // onion struture
    // prevPreSpy↓                             prevPostSpy
    //         preSpy↓                     postSpy↑
    //             nextPreSpy  →  nextPostSpy↑

    const preSpy  = sinon.spy()
    const postSpy = sinon.spy()
    registerPrehook('typeA', preSpy)
    registerPosthook('typeA', postSpy)
    store.dispatch({ type: 'typeA' })
    expect(prevPreSpy.calledBefore(preSpy)).to.be.true
    expect(preSpy.calledBefore(nextPreSpy)).to.be.true
    expect(nextPreSpy.calledBefore(nextPostSpy)).to.be.true
    expect(nextPostSpy.calledBefore(postSpy)).to.be.true
    expect(postSpy.calledBefore(prevPostSpy)).to.be.true
  })
})
