import React from 'react'
import { createStore, applyMiddleware } from 'redux'
import hookMiddleware, {
  registerPrehook,
  registerPosthook,
} from '../../../src'
import update from 'immutability-helper'

// redux setup
const initialTodos = [
  { content: 'Buy 12 eggs' },
  { content: 'Fix car audio' },
  { content: 'Feed my cat' },
]
const initialState = {
  todos: initialTodos,
  newTodoContent: '',
  message: '',
}

const reducer = (state = initialState, action) => {
  const { type, payload } = action
  const updateState = updator => update(state, updator)

  switch (type) {
    case 'ADD_TODO':
      return updateState({
        todos : { $push : [ payload.todo ] },
        newTodoContent: { $set : '' },
      })
    case 'DELETE_TODO':
      console.log('aaa')
      return updateState( { todos : { $splice : [[payload.index, 1]] } })
    case 'UPDATE_MESSAGE':
      return updateState( { message : { $set : payload.message } })
    case 'UPDATE_NEW_TODO':
      return updateState({ newTodoContent: {$set: payload.newTodoContent } })
    case 'STORE_TO_TRASHBOX':
      return updateState({ trashBox: { $set: payload.todo } })
    default:
      return state
  }
}

const middlewares = [hookMiddleware]
const store = createStore(reducer, initialState, applyMiddleware(...middlewares))

registerPrehook('DELETE_TODO', (store, action) => {
  const todo = store.getState().todos[action.payload.index]
  const content = todo.content
  store.dispatch({ type: 'STORE_TO_TRASHBOX', payload: { todo: action } })
  store.dispatch({ type: 'UPDATE_MESSAGE', payload: { message: `Deleting a TODO - "${content}"...` } })
})

registerPosthook('DELETE_TODO', (store, action) => {
  const content = store.getState().todos[action.payload.index].content
  store.dispatch({ type: 'UPDATE_MESSAGE', payload: { message: `TODO  - "${content}" has been deleted!` } })
})

registerPosthook('ADD_TODO', (store, action) => {
  const content = action.payload.todo.content
  store.dispatch({ type: 'UPDATE_MESSAGE', payload: { message: `New TODO - "${content}" has been added!` } })
})

export default class App extends React.PureComponent {

  constructor(prop) {
    super(prop)
    this.state = null
  }

  render() {
    const { todos, newTodoContent, message } = store.getState()
    const dispatch = action => {
      store.dispatch(action)
      .then(() => {
        // force render for convinience
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
            value={ newTodoContent }
            type={ 'text' }
            placeholder={ '(input new todo...)' }
            onChange={ e => dispatch({ type: 'UPDATE_NEW_TODO', payload: { newTodoContent: e.target.value }  }) }
          />
          <button onClick={ () => {
            if (newTodoContent !== '') {
              dispatch({ type: 'ADD_TODO', payload: { todo: { content: newTodoContent } } })
            }
          } }>Add</button>
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
