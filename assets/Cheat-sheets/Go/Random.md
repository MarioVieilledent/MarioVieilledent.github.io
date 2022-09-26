# Random

## Int
Random integer between [min and max[
```go
rand.Intn(max-min)+min
```

## Float
```go
min + rand.Float64() * (max - min)
```