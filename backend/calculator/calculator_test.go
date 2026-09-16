package calculator

import (
	"testing"
)

func TestCalculate(t *testing.T) {
	tests := []struct {
		name        string
		operation   string
		a           float64
		b           float64
		expected    float64
		expectError bool
	}{
		{"Addition", "add", 2, 3, 5, false},
		{"Subtraction", "subtract", 5, 2, 3, false},
		{"Multiplication", "multiply", 4, 3, 12, false},
		{"Division", "divide", 10, 2, 5, false},
		{"Division by Zero", "divide", 10, 0, 0, true},
		{"Power", "power", 2, 3, 8, false},
		{"Square Root", "sqrt", 9, 0, 3, false},
		{"Square Root Negative", "sqrt", -1, 0, 0, true},
		{"Unknown Operation", "unknown", 1, 1, 0, true},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result, err := Calculate(tt.operation, tt.a, tt.b)
			if (err != nil) != tt.expectError {
				t.Errorf("expected error: %v, got: %v", tt.expectError, err)
			}
			if !tt.expectError && result != tt.expected {
				t.Errorf("expected result: %v, got: %v", tt.expected, result)
			}
		})
	}
}
