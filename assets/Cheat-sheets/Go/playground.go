package main

import "fmt"

func main() {
	myMap := map[string]string{
		"france":  "FR",
		"germany": "DE",
		"spain":   "ES",
	}
	for k, v := range myMap {
		fmt.Printf("%s has code %s\n", k, v)
	}
}
