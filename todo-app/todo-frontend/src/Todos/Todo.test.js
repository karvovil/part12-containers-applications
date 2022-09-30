import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import Todo from './Todo'

test('renders content', () => {
  const todo = {
    text: "Increase the number of tools in my toolbelt",
    done: true
    }

  render(<Todo todo={todo} />)

  const element = screen.getByText('Increase the number of tools in my toolbelt')
  expect(element).toBeDefined()
})