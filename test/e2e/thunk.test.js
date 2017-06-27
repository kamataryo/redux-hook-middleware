import { createStore, applyMiddleware } from 'redux'
import thunkMiddleWare from 'redux-thunk'
import hookMiddleware from '../../src/index'
import { expect } from 'chai'

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

const middlewares = [
  thunkMiddleWare,
  hookMiddleware,
]

const store = createStore(
  reducer,
  { case: '' }, // preloadState
  applyMiddleware(...middlewares) // enhancer
)

describe('e2e test with redux-thunk API', () => {

  it('should be thenable', () => {

    expect(typeof store.dispatch({ type: 'typeA' }).then).to.equal('function')

  })
})
