# Concurrency

## Goroutines
Call function with go prefix to start it in a thread.
```go
func f() {
    // Do things
}

go f()
```

## Channels
```go
func main() {
	c := make(chan string)

	for i := 0; i < 12; i++ {
		go sender(c)
	}
	
	go receiver(c)

	for {

	}
}

func sender(c chan string) {
	c <- "ping"
}

func receiver(c chan string) {
	for {
		msg := <-c
		fmt.Println(msg)
		time.Sleep(50 * time.Millisecond)
	}
}
```