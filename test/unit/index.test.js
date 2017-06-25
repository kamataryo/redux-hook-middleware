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
  registerPrehooks,
  registerPosthooks,
} from '../../src/index'

describe('single registration functions', () => {

  it(' should register, unregister and clear a hook', () => {
    const id = registerHook('pre', 'HAVE_LUNCH', () => 'WASH_HANDS')
    expect(hooks['HAVE_LUNCH'][0].position).to.equal('pre')
    expect(hooks['HAVE_LUNCH'][0].hook()).to.equal('WASH_HANDS')
    unregisterHook(id)
    expect(hooks).to.deep.equal({ 'HAVE_LUNCH': [] })
    clearHooks()
    expect(hooks).to.deep.equal({})
  })

  it('should be a register prehook alias', () => {
    registerPrehook('HAVE_LUNCH', () => 'WASH_HANDS')
    expect(hooks['HAVE_LUNCH'][0].position).to.equal('pre')
    expect(hooks['HAVE_LUNCH'][0].hook()).to.equal('WASH_HANDS')
    clearHooks()
  })

  it('should be a register posthook alias', () => {
    registerPosthook('HAVE_DINNER', () => 'HAVE_DRINK')
    expect(hooks['HAVE_DINNER'][0].position).to.equal('post')
    expect(hooks['HAVE_DINNER'][0].hook()).to.equal('HAVE_DRINK')
    clearHooks()
  })

  it('should fail with invalid arguments', () => {
    expect(registerHook(undefined)).to.be.false
    expect(registerHook('pre', undefined)).to.be.false
    expect(registerHook('pre', 'type', undefined)).to.be.false
  })
})

describe('multiple reistration function', () => {

  it(' should register, unregister and clear prehooks', () => {
    const ids = registerPrehooks({
      HAVE_LUNCH : [
        () => 'CHOP_VEGE',
        () => 'BOIL_WATER',
      ],
      HAVE_DINNER : () => 'PREPARE_DRINK',
    })
    expect(hooks['HAVE_LUNCH'][0].position).to.equal('pre')
    expect(hooks['HAVE_LUNCH'][1].position).to.equal('pre')
    expect(hooks['HAVE_DINNER'][0].position).to.equal('pre')

    expect(ids.HAVE_LUNCH).to.have.length(2)
    expect(ids.HAVE_DINNER).to.have.length(1)
    clearHooks()
    expect(hooks).to.deep.equal({})
  })

  it(' should register, unregister and clear posthooks', () => {
    const ids = registerPosthooks({
      HAVE_LUNCH : [
        () => 'CHOP_VEGE',
        () => 'BOIL_WATER',
      ],
      HAVE_DINNER : () => 'PREPARE_DRINK',
    })
    expect(hooks['HAVE_LUNCH'][0].position).to.equal('post')
    expect(hooks['HAVE_LUNCH'][1].position).to.equal('post')
    expect(hooks['HAVE_DINNER'][0].position).to.equal('post')

    expect(ids.HAVE_LUNCH).to.have.length(2)
    expect(ids.HAVE_DINNER).to.have.length(1)
    clearHooks()
    expect(hooks).to.deep.equal({})
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
    const action = { type: 'type' }
    const next = sinon.stub().returns(action)

    const pre1 = sinon.spy()
    const pre2 = sinon.spy()
    const post1 = sinon.spy()
    const post2 = sinon.spy()
    registerPrehook('type', pre1)
    registerPrehook('type', pre2)
    registerPosthook('type', post1)
    registerPosthook('type', post2)

    const result = hookMiddleware(store)(next)(action)

    expect(result).to.equal(action)
    expect(pre1.calledBefore(next)).to.be.true
    expect(pre2.calledBefore(next)).to.be.true
    expect(post1.calledAfter(next)).to.be.true
    expect(post2.calledAfter(next)).to.be.true
  })
})
