## Array
```go
// Array (fixed size)
var myArray [4]float64 = [4]float64{1.0, 1.5, 2.0, 2.5}

// Slice (variable size)
var mySlice []int = []int{} // Set empty

// Map (key value)
var myMap map[string]string = map[string]string{"cat": "meow"}
```

## Sort a slice
```go
sort.Slice(data, func(i, j int) bool {
	return data[i].Elem > data[j].Elem
})
```