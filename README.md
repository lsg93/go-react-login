# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

npm install everything in the root directory for the frontend, I think you may have to run go get in /api to install the packages for the backend too, but I'm unsure.

Set all your environment variables in /api/.env - this is stuff for your local mySQL DB and your email host (probably best to use your personal email) - use temp-mail.org to handle temporary email addresses for testing.

Run the backend first with npm start-api , then run the frontend with npm start.

Hopefully it works (?)

TODO (?) :

remove inline styles + clean up stylesheet + do mobile responsiveness.
better/more validation on frontend and backend
better error handling on backend in general
add a logout function to clear the cookie rather than doing it via browser.
add some more data to the session cookie.
restructure the project (particularly how handlers are set up) to make it more readable.

