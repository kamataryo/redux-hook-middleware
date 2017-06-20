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
  { content: 'Feed my cat' },
]
const initialState = { todos: initialTodos, newTodo: '', message: '' }

const reducer = (state = initialState, action) => {
  const { type, payload } = action
  const updateState = updator => update(state, updator)
  return switz(type, s => (
    s
    .case('ADD_TODO', () => {
      return updateState({
        todos : { $push : [ payload.todo ] },
        newTodo: { $set : '' },
      })
    })
    .case('DELETE_TODO', () => {
      console.log('delete reducer')
      return updateState( { todos : { $splice : [[payload.index, 1]] } })
    })
    .case('UPDATE_MESSAGE', () => {
      return updateState( { message : { $set : payload.message } })
    })
    .case('UPDATE_NEW_TODO', () => {
      return updateState({ newTodo: {$set: payload.newTodo } })
    })
    .default(() => state)
  ))
}
const middlewares = [hookMiddleware]
const store = createStore(reducer, initialState, applyMiddleware(...middlewares))

registerPrehook('DELETE_TODO', (store, action) => {
  store.dispatch({ type: 'UPDATE_MESSAGE', payload: { message: `Deleting TODO No.${action.payload.index}...` } })
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
    this.state = null
  }

  render() {
    const { todos, newTodo, message } = store.getState()
    const dispatch = action => {
      store.dispatch(action)
      .then(() => {
        // force render
        this.setState({ time: Date.now() })
      })
    }

    return (
      <main>
        <h1>hooked todos</h1>
        <ul>
          {
            todos.map((todo, index) => (
              <li key={ `todo-${todo.content.split(' ').join('-')}-${index}` }>
                <span>{ todo.content }</span>
                <button onClick={ () => dispatch({ type: 'DELETE_TODO', payload: { index } }) }>{ 'delete' }</button>
              </li>
            ))
          }
        </ul>
        <p>
          <input
            value={ newTodo }
            type={ 'text' }
            placeholder={ '(input new todo...)' }
            onChange={ e => dispatch({ type: 'UPDATE_NEW_TODO', payload: { newTodo: e.target.value }  }) }
          />
          <button onClick={ () => dispatch({ type: 'ADD_TODO', payload: { todo: { content: newTodo } } }) }>Add</button>
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
