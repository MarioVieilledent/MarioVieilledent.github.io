## HTTP Request
```go
const url string = "https://google.com"

resp, err := http.Get(url)
if err != nil {
    fmt.Printf("Error get request : %s", err)
}

body, err := ioutil.ReadAll(resp.Body)
if err != nil {
    fmt.Printf("Error reading body : %s", err)
}

str := string(body)
```

## Serve static files
```go
port := "3000"
fs := http.FileServer(http.Dir("./static"))
http.Handle("/", fs)
fmt.Println("Listening on", port)
err := http.ListenAndServe(":"+port, nil)
if err != nil {
	fmt.Println("Error serving static files")
}
```

## Gin Quick Start
```go
package src

import (
	"fmt"
	"net/http"
	"os"

	"github.com/gin-contrib/cors"
	"github.com/gin-contrib/static"
	"github.com/gin-gonic/gin"
)

var url string = "0.0.0.0"

// Setup du port dans env pour Heroku
var port string = getPort()

func LaunchAPI() {

	gin.SetMode(gin.ReleaseMode)

	router := gin.New()

	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"},
		AllowMethods:     []string{"*"},
		AllowHeaders:     []string{"Origin"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
	}))

	router.Use(static.Serve("/", static.LocalFile("static", false)))
	router.GET("/api", getDictionary)

	fmt.Println("API on " + url + ":" + port)
	router.Run(url + ":" + port)
}

// All words
func getDictionary(c *gin.Context) {
	c.IndentedJSON(http.StatusOK, `{"foo": "bar"}`)
}

// Get either port of env else 3000
func getPort() (port string) {
	port = os.Getenv("PORT")
	if port == "" {
		port = "3000"
	}
	return
}
```