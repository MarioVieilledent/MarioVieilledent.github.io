# JSON

## Data in struct with \`json: "name"\`
```go
type MyType struct {
	Id   int    `json:"id"`
	Name string `json:"name"`
}
```

## Parse JSON
```go
var data []MyType = []MyType{}
str := "[{\"id\": 1, \"name\": \"bar\"}, {\"id\": 2, \"name\": \"foo\"}]"
err := json.Unmarshal([]byte(str), &data)
if err != nil {
	fmt.Println("Error parsing JSON :", err)
}
fmt.Println(data)
```

## Stringify JSON
```go
result, err := json.Marshal(data)
if err != nil {
	fmt.Println("Error stringifying JSON :", err)
}
fmt.Println(string(result))
```