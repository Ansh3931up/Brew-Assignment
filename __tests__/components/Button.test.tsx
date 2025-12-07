import { describe, it, expect } from '@jest/globals'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

// Simple button component for testing
const Button = ({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) => {
  return (
    <button onClick={onClick} data-testid="test-button">
      {children}
    </button>
  )
}

describe('Button Component', () => {
  it('should render button with text', () => {
    render(<Button>Click me</Button>)
    const button = screen.getByTestId('test-button')
    expect(button).toBeInTheDocument()
    expect(button).toHaveTextContent('Click me')
  })

  it('should call onClick when clicked', () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Click me</Button>)
    const button = screen.getByTestId('test-button')
    button.click()
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})

