package main

import (
	"errors"
	"flag"
	"fmt"
	"strings"

	"github.com/wz2cool/tsbatis-generator/models"

	"github.com/alecthomas/log4go"
	"github.com/wz2cool/go-utils/io"
	"github.com/wz2cool/tsbatis-generator/constants"
)

func main() {
	fmt.Println("hello world")
}

func readCommandArgs() (*models.InitArgs, error) {
	methodName := "readCommandArgs"
	log4go.Info("%s start", methodName)
	dbType := flag.String(constants.DbTypeFlag, "mysql", "the type of database")
	file := flag.String(constants.FileFlag, "", "the file path of creating sql.")
	outDir := flag.String(constants.OutDirFlag, "", "the output directory of entity files")
	flag.Parse()

	log4go.Info("dbType: %s", dbType)
	log4go.Info("file: %s", file)
	log4go.Info("outDir: %s", outDir)

	if len(strings.TrimSpace(*file)) == 0 {
		err := errors.New("file can not be empty")
		return nil, err
	}

	if len(strings.TrimSpace(*outDir)) == 0 {
		err := errors.New("outDir can not be empty")
		return nil, err
	}

	if !io.FileOrDirExists(*file) {
		err := errors.New("file can not be found")
		return nil, err
	}

	err := io.CreateDirIfNotExists(*outDir)
	if err != nil {
		return nil, err
	}

	result := &models.InitArgs{}
	result.DbType = *dbType
	result.File = *file
	result.OutDir = *outDir
	log4go.Info("%s end", methodName)
	return result, nil
}
