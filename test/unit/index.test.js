/**
 * testing library
 */
import { expect } from 'chai'
import sinon      from 'sinon'

/**
 * test target
 */
import hookMiddleware, {
  hooks,
  registerHook,
  unregisterHook,
  clearHooks,
  registerPrehook,
  registerPosthook,
} from '../../src/index'

describe('registration functions', () => {

  it(' should register, unregister and clear a hook / hooks', () => {
    const id = registerHook('pre', 'have lunch', () => 'wash hands')
    expect(hooks['have lunch'][0].position).to.equal('pre')
    expect(hooks['have lunch'][0].hook()).to.equal('wash hands')
    unregisterHook(id)
    expect(hooks).to.deep.equal({ 'have lunch': [] })
    clearHooks()
    expect(hooks).to.deep.equal({})
  })

  it('should be a register prehook alias', () => {
    registerPrehook('have lunch', () => 'wash hands')
    expect(hooks['have lunch'][0].position).to.equal('pre')
    expect(hooks['have lunch'][0].hook()).to.equal('wash hands')
    clearHooks()
  })

  it('should be a register pposthook alias', () => {
    registerPosthook('have dinner', () => 'have digestif')
    expect(hooks['have dinner'][0].position).to.equal('post')
    expect(hooks['have dinner'][0].hook()).to.equal('have digestif')
    clearHooks()
  })

  it('should fail with invalid arguments', () => {
    expect(registerHook(undefined)).to.be.false
    expect(registerHook('pre', undefined)).to.be.false
    expect(registerHook('pre', 'type', undefined)).to.be.false
  })
})

describe('middleware', () => {
  it('should be a redux middleware', () => {
    const store = {}
    // eslint-disable-next-line require-jsdoc
    const next = () => {}
    const action = { type: 'type' }

    expect(hookMiddleware).is.a('function')
    expect(hookMiddleware(store)).is.a('function')
    expect(hookMiddleware(store)(next)).is.a('function')
    expect(hookMiddleware(store)(next)(action)).is.not.a('function')
  })

  it('execute each hooks in order of [pre], next, [post]', () => {
    const store = {}
    // eslint-disable-next-line require-jsdoc
    const next = sinon.spy()
    const action = { type: 'type' }

    const pre1 = sinon.spy()
    const pre2 = sinon.spy()
    const post1 = sinon.spy()
    const post2 = sinon.spy()
    registerPrehook('type', pre1)
    registerPrehook('type', pre2)
    registerPosthook('type', post1)
    registerPosthook('type', post2)

    const result = hookMiddleware(store)(next)(action)

    result.then(() => {
      expect(pre1.calledBefore(next)).to.be.true
      expect(pre2.calledBefore(next)).to.be.true
      expect(post1.calledAfter(next)).to.be.true
      expect(post2.calledAfter(next)).to.be.true
    })

  })
  it('execute each hooks in order of [pre], next, [post] for action that returns promise', done => {
    const store = {}
    const promiseSpy = sinon.spy()

    // eslint-disable-next-line require-jsdoc
    const next = sinon.stub().callsFake(() => (
      Promise.resolve().then(promiseSpy)
    ))

    const action = { type: 'PROMISE' }

    const pre1 = sinon.spy()
    const pre2 = sinon.spy()
    const post1 = sinon.spy()
    const post2 = sinon.spy()
    registerPrehook('PROMISE', pre1)
    registerPrehook('PROMISE', pre2)
    registerPosthook('PROMISE', post1)
    registerPosthook('PROMISE', post2)

    const result = hookMiddleware(store)(next)(action)

    result.then(() => {
      expect(pre1.calledBefore(next)).to.be.true
      expect(pre2.calledBefore(next)).to.be.true
      expect(promiseSpy.calledAfter(pre1)).to.be.true
      expect(promiseSpy.calledAfter(pre2)).to.be.true
      expect(promiseSpy.calledBefore(post1)).to.be.true
      expect(promiseSpy.calledBefore(post2)).to.be.true
      expect(post1.calledAfter(next)).to.be.true
      expect(post2.calledAfter(next)).to.be.true
      done()
    })

  })
})
