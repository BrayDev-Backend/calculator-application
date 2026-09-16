import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import App from './App'

// Mock fetch globally
global.fetch = vi.fn()

describe('Calculator App', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('renders correctly', () => {
    render(<App />)
    expect(screen.getByText('C')).toBeInTheDocument()
    expect(screen.getByText('=')).toBeInTheDocument()
    // Check for display initial value
    const display = document.querySelector('.display')
    expect(display?.textContent).toBe('0')
  })

  it('updates display on digit click', () => {
    render(<App />)
    fireEvent.click(screen.getByText('7'))
    fireEvent.click(screen.getByText('5'))
    const display = document.querySelector('.display')
    expect(display?.textContent).toBe('75')
  })

  it('clears display on C click', () => {
    render(<App />)
    fireEvent.click(screen.getByText('9'))
    fireEvent.click(screen.getByText('C'))
    const display = document.querySelector('.display')
    expect(display?.textContent).toBe('0')
  })

  it('performs calculation via API on equals', async () => {
    // Mock the API response
    ;(global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ result: 15 })
    })

    render(<App />)
    
    // Type 7 + 8 =
    fireEvent.click(screen.getByText('7'))
    fireEvent.click(screen.getByText('+'))
    fireEvent.click(screen.getByText('8'))
    fireEvent.click(screen.getByText('='))

    // Wait for the mock to be called
    await vi.waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('http://localhost:8080/api/calculate', expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ operation: 'add', a: 7, b: 8 })
      }))
    })

    // Check if display updated to 15
    await vi.waitFor(() => {
      const display = document.querySelector('.display')
      expect(display?.textContent).toBe('15')
    })
  })

  it('displays error message from API', async () => {
    // Mock the API response
    ;(global.fetch as any).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'division by zero' })
    })

    render(<App />)
    
    // Type 5 / 0 =
    fireEvent.click(screen.getByText('5'))
    fireEvent.click(screen.getByText('/'))
    fireEvent.click(screen.getByText('0'))
    fireEvent.click(screen.getByText('='))

    // Check if error message is displayed
    await vi.waitFor(() => {
      const errorMsg = document.querySelector('.error-message')
      expect(errorMsg?.textContent).toBe('division by zero')
    })
  })
})
