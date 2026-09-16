import { useState } from 'react'
import './App.css'

function App() {
  const [displayValue, setDisplayValue] = useState('0')
  const [previousValue, setPreviousValue] = useState<string | null>(null)
  const [operator, setOperator] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [waitingForNewValue, setWaitingForNewValue] = useState(false)

  const clear = () => {
    setDisplayValue('0')
    setPreviousValue(null)
    setOperator(null)
    setError(null)
    setWaitingForNewValue(false)
  }

  const inputDigit = (digit: string) => {
    setError(null)
    if (waitingForNewValue) {
      setDisplayValue(digit)
      setWaitingForNewValue(false)
    } else {
      setDisplayValue(displayValue === '0' ? digit : displayValue + digit)
    }
  }

  const inputDot = () => {
    setError(null)
    if (waitingForNewValue) {
      setDisplayValue('0.')
      setWaitingForNewValue(false)
      return
    }
    if (!displayValue.includes('.')) {
      setDisplayValue(displayValue + '.')
    }
  }

  const performOperation = async (nextOperator: string) => {
    setError(null)
    
    // Unary operations
    if (nextOperator === 'sqrt') {
      try {
        const response = await fetch('/api/calculate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            operation: 'sqrt',
            a: parseFloat(displayValue),
            b: 0
          })
        })
        const data = await response.json()
        if (!response.ok) throw new Error(data.error || 'Calculation failed')
        setDisplayValue(String(data.result))
        setWaitingForNewValue(true)
      } catch (err: any) {
        setError(err.message)
      }
      return
    }

    // Binary operations
    if (operator && previousValue != null && !waitingForNewValue) {
      // Calculate intermediate result
      try {
        const response = await fetch('/api/calculate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            operation: operator,
            a: parseFloat(previousValue),
            b: parseFloat(displayValue)
          })
        })
        const data = await response.json()
        if (!response.ok) throw new Error(data.error || 'Calculation failed')
        
        setDisplayValue(String(data.result))
        setPreviousValue(String(data.result))
      } catch (err: any) {
        setError(err.message)
        return
      }
    } else {
      setPreviousValue(displayValue)
    }

    setOperator(nextOperator !== '=' ? nextOperator : null)
    setWaitingForNewValue(true)
  }

  return (
    <div className="calculator">
      <div className="display">{displayValue}</div>
      <div className="error-message">{error || ''}</div>
      
      <div className="keypad">
        <button className="clear" onClick={clear}>C</button>
        <button className={`operator ${operator === 'power' ? 'active' : ''}`} onClick={() => performOperation('power')}>^</button>
        <button className="operator" onClick={() => performOperation('sqrt')}>√</button>
        <button className={`operator ${operator === 'divide' ? 'active' : ''}`} onClick={() => performOperation('divide')}>/</button>
        
        <button onClick={() => inputDigit('7')}>7</button>
        <button onClick={() => inputDigit('8')}>8</button>
        <button onClick={() => inputDigit('9')}>9</button>
        <button className={`operator ${operator === 'multiply' ? 'active' : ''}`} onClick={() => performOperation('multiply')}>*</button>
        
        <button onClick={() => inputDigit('4')}>4</button>
        <button onClick={() => inputDigit('5')}>5</button>
        <button onClick={() => inputDigit('6')}>6</button>
        <button className={`operator ${operator === 'subtract' ? 'active' : ''}`} onClick={() => performOperation('subtract')}>-</button>
        
        <button onClick={() => inputDigit('1')}>1</button>
        <button onClick={() => inputDigit('2')}>2</button>
        <button onClick={() => inputDigit('3')}>3</button>
        <button className={`operator ${operator === 'add' ? 'active' : ''}`} onClick={() => performOperation('add')}>+</button>
        
        <button className="zero" onClick={() => inputDigit('0')}>0</button>
        <button onClick={inputDot}>.</button>
        <button className="equals" onClick={() => performOperation('=')}>=</button>
      </div>
    </div>
  )
}

export default App
