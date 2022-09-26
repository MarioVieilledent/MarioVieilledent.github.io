# Iterating

## Array or slice
```go
myList := []int{4, 2, 6, 0, 2, 9, 5}
for i, v := range myList {
    fmt.Printf("[%d] = %d\n", i, v)
}
```

## Map
```go
myMap := map[string]string{
    "france":  "FR",
    "germany": "DE",
    "spain":   "ES",
}
for k, v := range myMap {
    fmt.Printf("%s has code %s\n", k, v)
}
```