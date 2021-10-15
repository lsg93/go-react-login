package models

import (
	"database/sql"
	"fmt"
	"log"
	"os"
	"strconv"
	"time"

	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
	gomail "gopkg.in/mail.v2"
)

type User struct {
	ID               string
	Firstname        string
	Lastname         string
	Email            string
	Password         string
	ConfirmationCode string
	CreatedOn        string
}

func RegisterUser(u User) (bool, error) {

	// email info here

	emailHost := os.Getenv("EMAIL_HOST")
	emailPort, _ := strconv.Atoi(os.Getenv("EMAIL_PORT"))
	emailUsername := os.Getenv("EMAIL_USERNAME")
	emailPw := os.Getenv("EMAIL_PASSWORD")

	// hash password

	hash, err := bcrypt.GenerateFromPassword([]byte(u.Password), bcrypt.MinCost)
	if err != nil {
		log.Println(err)
	}

	// generate uuid which will be used as confirmation code (cc) in email mesage
	cc := uuid.New()

	// save user to db
	stmt, err := db.Prepare("INSERT INTO testUsers (Firstname, Lastname, Email, Password, ConfirmationCode, createdOn) values (?, ?, ?, ?, ?, NOW())")

	if err != nil {
		fmt.Println(err)
		return false, err
	}

	r, err := stmt.Exec(u.Firstname, u.Lastname, u.Email, hash, cc)

	if err != nil {
		fmt.Println(err.Error())
		return false, err
	}

	uid, err := r.LastInsertId()

	if err != nil {
		fmt.Println(err.Error())
		return false, err
	}

	msg := gomail.NewMessage()

	msg.SetHeaders(map[string][]string{
		"From":    {msg.FormatAddress(emailUsername, "Test")},
		"To":      {u.Email},
		"Subject": {"Register your account!"},
	})

	mb := fmt.Sprintf("<h2>Register your account by clicking on the link below :</h2><br><br><a href=\"http://localhost:3000/verifySignup/%d/%s\">Register Here</a>", uid, cc)

	msg.SetBody("text/html; charset=UTF-8", mb)

	d := gomail.NewDialer(emailHost, emailPort, emailUsername, emailPw)

	if err := d.DialAndSend(msg); err != nil {
		return false, err
	}

	return true, nil

}

func VerifyUser(u User) (string, error) {

	// simulate delay
	time.Sleep(3 * time.Second)

	layout := "2006-01-02 15:04:05"
	var ts string
	var verified bool

	row := db.QueryRow("SELECT verified, createdOn FROM testUsers WHERE id = ? AND confirmationCode = ?", u.ID, u.ConfirmationCode)
	err := row.Scan(&verified, &ts)

	if err != nil {
		fmt.Println(err.Error())
		return "notFound", nil
	}

	var now = time.Now().Unix()

	t, _ := time.Parse(layout, ts)
	co := t.Unix()

	td := now - co

	fmt.Println(td)

	if td < 1800 {

		if !verified {

			stmt, _ := db.Prepare("UPDATE testUsers SET verified = ? WHERE id = ?")
			_, err := stmt.Exec("1", u.ID)

			if err != nil {
				fmt.Println(err.Error())
			}

			return "success", nil

		} else {

			return "alreadyVerified", nil

		}

	} else {

		stmt, _ := db.Prepare("DELETE FROM testUsers WHERE id = ?")
		_, err := stmt.Exec(u.ID)

		if err != nil {
			fmt.Println(err.Error())
		}

		return "linkExpired", nil

	}

}

func Login(u User) string {

	// simulate delay
	time.Sleep(3 * time.Second)

	var hpw []byte
	var verified bool

	row := db.QueryRow("SELECT password, verified FROM testUsers WHERE email = ?", u.Email)
	err := row.Scan(&hpw, &verified)

	switch {
	case err == sql.ErrNoRows:
		return "notFound"
	case err != nil:
		// ?
	default:
		break
	}

	if verified {

		err = bcrypt.CompareHashAndPassword(hpw, []byte(u.Password))

		if err != nil {
			return "incorrectPassword"
		}

		return "success"

	} else {

		return "notVerified"

	}

}
