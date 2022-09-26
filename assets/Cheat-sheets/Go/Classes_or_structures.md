## Structures
```go
type MyType struct {
    Id   int    `json:"id"`
    Name string `json:"name"`
}
```

## Method
```go
type Vertex struct {
	X, Y float64
}

// Access to data
func (v Vertex) Abs() float64 {
	return math.Sqrt(v.X*v.X + v.Y*v.Y)
}

// Modify data
func (v *Vertex) Scale(f float64) {
	v.X = v.X * f
	v.Y = v.Y * f
}
```