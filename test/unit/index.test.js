/**
 * testing library
 */
import { expect } from 'chai'

/**
 * test target
 */
import hookMiddleware from '../../src/index'

describe('middleware', () => {

  it('is a redux middleware', () => {
    const store = {}
    const next = () => {}
    const action = { type: 'type' }

    expect(hookMiddleware).is.a('function')
    expect(hookMiddleware(store)).is.a('function')
    expect(hookMiddleware(store)(next)).is.a('function')
    expect(hookMiddleware(store)(next)(action)).is.not.a('function')

  })
})
