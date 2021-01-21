import React, { useState } from 'react'
import { fireEvent, render, screen, cleanup, act, getByLabelText } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import App from './App'

afterEach(cleanup)

describe('rendering', () => {
  it('should match snapshot', () => {
    const { asFragment } = render(<App />)
    expect(asFragment()).toMatchSnapshot()
  })

  it('play Tic Tac Toe and player X won!', async () => {
    const { getAllByLabelText, container } = render(
      <App />
    )
    const trigger = getAllByLabelText('board-cell')
    const msg = container.firstChild.querySelector('.message')
    await act(async () => {
      fireEvent.click(trigger[0])
      fireEvent.click(trigger[4])
      fireEvent.click(trigger[1])
      fireEvent.click(trigger[5])
      fireEvent.click(trigger[2])
    })
    expect(msg.textContent).toBe('Player X WON!!')
  })
  it('reset play Tic Tac Toe', async () => {
    const { getAllByLabelText, container } = render(
      <App />
    )
    const reset = getAllByLabelText('reset')
    const msg = container.firstChild.querySelector('.message')
    await act(async () => {
      fireEvent.click(reset[0])
    })
    expect(msg.textContent).toBe('')
  })
})