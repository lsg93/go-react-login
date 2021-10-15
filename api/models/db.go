package models

import (
	"database/sql"
	"fmt"
	"os"

	_ "github.com/go-sql-driver/mysql"
)

var db *sql.DB

func InitDB() error {

	var err error

	// database details

	username := os.Getenv("DB_USERNAME")
	password := os.Getenv("DB_PASSWORD")
	hostname := os.Getenv("DB_HOSTNAME")
	dbname := os.Getenv("DB_NAME")

	dsn := fmt.Sprintf("%s:%s@tcp(%s)/%s", username, password, hostname, dbname)

	db, err = sql.Open("mysql", dsn)

	q := `CREATE TABLE IF NOT EXISTS` + "`testUsers`" + `(
	` + "`id`" + `int NOT NULL AUTO_INCREMENT,` + "`firstName`" +
		`varchar(255) NOT NULL,` + "`lastName`" + `varchar(255) NOT NULL,` +
		"`email`" + `varchar(255) NOT NULL,` + "`password`" + `varchar(255) NOT NULL,` +
		"`verified`" + `tinyint(1) NOT NULL DEFAULT '0',` + "`confirmationCode`" + `varchar(255) NOT NULL,` +
		"`createdOn`" + `datetime NOT NULL,
		PRIMARY KEY (` + "`id`" + `)
	  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
	`
	db.Query(q)

	if err != nil {
		return err
	}

	return db.Ping()

}
