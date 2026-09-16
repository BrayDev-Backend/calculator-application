package calculator

import (
	"errors"
	"math"
)

var ErrDivisionByZero = errors.New("division by zero")
var ErrInvalidSquareRoot = errors.New("square root of negative number")

func Calculate(operation string, a, b float64) (float64, error) {
	switch operation {
	case "add":
		return a + b, nil
	case "subtract":
		return a - b, nil
	case "multiply":
		return a * b, nil
	case "divide":
		if b == 0 {
			return 0, ErrDivisionByZero
		}
		return a / b, nil
	case "power":
		return math.Pow(a, b), nil
	case "sqrt":
		if a < 0 {
			return 0, ErrInvalidSquareRoot
		}
		return math.Sqrt(a), nil
	default:
		return 0, errors.New("unknown operation")
	}
}
