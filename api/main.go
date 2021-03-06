package main

import (
	"api/models"
	envvars "api/utils"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"

	"github.com/gorilla/sessions"
)

var store = sessions.NewCookieStore([]byte("secret-key")) // this might need to be an env variable?

func reg(w http.ResponseWriter, req *http.Request) {

	rd, err := ioutil.ReadAll(req.Body)

	if err != nil {
		fmt.Println("error reading request body")
	}

	var u models.User

	if err := json.Unmarshal(rd, &u); err != nil {
		panic("?")
	}

	_, err = models.RegisterUser(u)

	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
	}

	w.WriteHeader(http.StatusCreated)

}

func verifyReg(w http.ResponseWriter, req *http.Request) {

	var u models.User

	rd, err := ioutil.ReadAll(req.Body)

	fmt.Println(string(rd))

	if err != nil {
		fmt.Println("error reading request body")
	}

	if err := json.Unmarshal(rd, &u); err != nil {
		panic("?")
	}

	msg, _ := models.VerifyUser(u)

	if msg == "success" {
		w.WriteHeader(http.StatusOK)
	} else {
		w.WriteHeader(http.StatusBadRequest)
	}

	w.Write([]byte(msg))

}

func login(w http.ResponseWriter, req *http.Request) {

	var u models.User

	rd, err := ioutil.ReadAll(req.Body)

	if err != nil {
		fmt.Println("error reading request body")
	}

	if err := json.Unmarshal(rd, &u); err != nil {
		panic("?")
	}

	res := models.Login(u)

	if res == "success" {

		// create cookie

		session, _ := store.Get(req, "u")
		session.Values["loggedIn"] = true

		// need to get name value here..

		session.Options.MaxAge = 1800

		err := session.Save(req, w)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

	}

	w.WriteHeader(http.StatusOK)
	w.Write([]byte(res))

}

func auth(w http.ResponseWriter, req *http.Request) {

	// check cookie for authentication here?
	// return users name perhaps?

	session, _ := store.Get(req, "u")

	if session.Values["loggedIn"] == true {
		w.WriteHeader(http.StatusOK)
	} else {
		w.WriteHeader(http.StatusForbidden)
	}

}

func main() {

	loadedEnvVars := envvars.Initialize()

	if loadedEnvVars != nil {
		fmt.Println(loadedEnvVars.Error())
	}

	err := models.InitDB()

	if err != nil {
		fmt.Println("error opening db connection?")
	}

	http.HandleFunc("/auth", auth)
	http.HandleFunc("/verifySignup", verifyReg)
	http.HandleFunc("/register", reg)
	http.HandleFunc("/login", login)

	http.ListenAndServe(":8000", nil)
}
