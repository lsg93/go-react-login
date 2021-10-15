package envvars

import (
	"os"
	"path"

	"github.com/joho/godotenv"
)

func Initialize() error {

	dirname, err := os.Getwd()
	if err != nil {
		panic(err)
	}

	dir := path.Join(dirname, ".env")

	if err != nil {
		panic(err)
	}

	err = godotenv.Load(dir)
	return err
}
