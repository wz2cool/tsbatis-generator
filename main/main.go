package main

import (
	"fmt"

	"github.com/alecthomas/log4go"
)

func main() {
	fmt.Println("hello world")
}

func readCommandArgs() {
	methodName := "readCommandArgs"
	log4go.Info("%s start", methodName)
}
