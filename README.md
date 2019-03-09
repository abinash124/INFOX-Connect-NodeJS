
# Infox Connect (Social Network for Infox IT)

A social network web application for InfoxIT
## Getting started

To run the Node application locally in your machine: 


- After you call run this command to install node dependencies locally.
``npm install``

- To install react dependencies locally.
``npm run client-install``



- In /config/keys.js, replace the `<MongoDB_URI>` with your MongoDB URI. Also replace the `<Secret or Key>` with a random string.

- Run the client & server with concurrently
``npm run server``

- Run the React client only
``npm run client``

- Server runs on http://localhost:5000 and client on http://localhost:3000


## Dependencies

- [expressjs](https://github.com/expressjs/express) - The server for handling and routing HTTP requests
- [express-jwt](https://github.com/auth0/express-jwt) - Middleware for validating JWTs for authentication
- [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) - For generating JWTs used by authentication
- [mongoose](https://github.com/Automattic/mongoose) - For modeling and mapping MongoDB data to javascript 
- [mongoose-unique-validator](https://github.com/blakehaswell/mongoose-unique-validator) - For handling unique validation errors in Mongoose.
- [passport](https://github.com/jaredhanson/passport) - For handling user authentication
- [stripe](https://stripe.com/docs/stripe-js/) - For handling credit card transaction securely.
- [csurf](https://github.com/expressjs/csurf) - Middleware for validating user session and securely by creating a CSRF token.
- [nodemon](https://github.com/remy/nodemon) - Dependency to check changes in the code and update the effect automatically on the server. 
- [gravatar](https://github.com/emerleite/node-gravatar) - A library to generate Gravatar URLs in Node.js Based on gravatar specs.


## Application skeleton

- `server.js` - The index entry point of the application. This file defines our express server and connects it to MongoDB using mongoose. It also requires the routes and models we'll be using in the application.
- `config/` - This folder contains configuration for passport and login authentications.
- `routes/` - This folder contains definition of route functions for different HTTP requests.
- `models/` - These folder contains schema definition for mongodb database.
- `client/`  - This folder contains all Javascript,CSS and React code for front end.
- `validation/` - This folder contains validator for input validations.



<br />

