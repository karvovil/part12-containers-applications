import React from 'react'
import Todo from './Todo'

const TodoList = ({ todos, deleteTodo, completeTodo }) => {


  return (
    <>
      {todos.map(todo =>
        <Todo todo={todo} deleteTodo={deleteTodo} completeTodo={completeTodo} key={todo.id}/>
      ).reduce((acc, cur) => [...acc, <hr />, cur], [])}
    </>
  )
}

export default TodoList
