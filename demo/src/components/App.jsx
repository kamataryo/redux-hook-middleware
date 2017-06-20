import React from 'react'
import { createStore, applyMiddleware } from 'redux'
import hookMiddleware, {
  registerPrehook,
  registerPosthook,
} from '../../../src'
import update from 'immutability-helper'

import switz from 'switz'

// redux setup
const initialTodos = [
  { content: 'Buy 12 eggs' },
  { content: 'Fix car audio' },
  { content: 'Feed my cat', immortal: true },
]
const initialState = { todos: initialTodos, message: '' }

const reducer = (state = initialState, action) => {
  const { type, payload } = action
  return switz(type, s => (
    s
    .case('ADD_TODO', () => {
      return update(state, { todos : { $push : [ payload.todo ] } })
    })
    .case('DELETE_TODO', () => {
      console.log('delete reducer')
      return update(state, { todos : { $splice : [[payload.index, 1]] } })
    })
    .case('UPDATE_MESSAGE', () => {
      return update(state, { message : { $set : payload.message } })
    })
    .default(() => state)
  ))
}
const middlewares = [hookMiddleware]
const store = createStore(reducer, initialState, applyMiddleware(...middlewares))

registerPrehook('DELETE_TODO', (store, action, cancel) => {
  store.dispatch({ type: 'UPDATE_MESSAGE', payload: { message: `Deleting TODO No.${action.payload.index}...` } })
  // cancel(window.confirm('Are you sure to delete this TODO?'))
})

registerPosthook('DELETE_TODO', (store, action) => {
  store.dispatch({ type: 'UPDATE_MESSAGE', payload: { message: `TODO No.${action.payload.index} has been deleted!` } })
})

registerPosthook('ADD_TODO', (store, action) => {
  store.dispatch({ type: 'UPDATE_MESSAGE', payload: { message: 'New TODO has been added!' } })
})

export default class App extends React.PureComponent {

  constructor(prop) {
    super(prop)
    this.state = { test: '' }
  }

  render() {
    console.log(store)
    const { todos, newTodo, message } = store.getState()
    const { dispatch } = store

    return (
      <main>
        <h1>hooked todos{ this.state.test }</h1>
        <ul>
          {
            todos.map((todo, index) => (
              <li key={ `todo-${todo.content.split(' ').join('-')}` }>
                <span>{ todo.content }</span>
                <button onClick={ () => dispatch({ type: 'DELETE_TODO', payload: { index } }) }>{ 'delete' }</button>
              </li>
            ))
          }
        </ul>
        <p>
          <button onClick={ () => dispatch({ type: 'ADD_TODO', payload: { todo: { content: 'aaa' } } }) }>Add</button>
          <button onClick={ () => this.setState({ test: 'aaa' }) }></button>
        </p>
      <section>
        {
          message !== '' ? (
            <dl>
              <dt>message</dt>
              <dd>{ message }</dd>
            </dl>
          ) : null
        }
      </section>
    </main>
    )
  }
}
