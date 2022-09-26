## Is statement
```go
if (1 + 2 >= 4 && true) || false {

} else {

}
```
## If with a short statement
```go
if v := math.Pow(x, n); v < lim {
    return v
}

```
## For statement
```go
for i := 0; i < 10; i++ {

}

```
## While in Go
```go
sum := 1
for sum < 1000 {
    sum += sum
}

```
## Infinite loop
```go
for {
}

```
## Switch
```go
switch os := runtime.GOOS; os {
case "darwin":
    fmt.Println("OS X.")
case "linux":
    fmt.Println("Linux.")
default:
    fmt.Printf("%s.\n", os)
}
```