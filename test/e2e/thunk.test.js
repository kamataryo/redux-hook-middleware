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
  // hookMiddleware,
  thunkMiddleWare,
]

const store = createStore(
  reducer,
  { case: '' }, // preloadState
  applyMiddleware(...middlewares) // enhancer
)

describe('e2e test with redux-thunk API', () => {

  it.only('should be thenable', () => {

    const mockAPIAccess = new Promise(resolve => {
      setTimeout(resolve, 100)
    })

    // eslint-disable-next-line require-jsdoc
    const createThunkAction = () => {

      return dispatch => {
        // Reducers may handle this to set a flag like isFetching
        dispatch({ type: 'GET_USER_REQUEST' })

        // Perform the actual API call
        return mockAPIAccess().then(
          response => {
            // Reducers may handle this to show the data and reset isFetching
            dispatch({ type: 'GET_USER_SUCCESS',  response })
          },
          error => {
            // Reducers may handle this to reset isFetching
            dispatch({ type: 'GET_USER_FAILURE',  error })
            // Rethrow so returned Promise is rejected
            throw error
          }
        )
      }
    }

    expect(typeof store.dispatch(createThunkAction).then).to.equal('function')

  })
})
