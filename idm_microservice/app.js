const express = require("express");
const bodyParser = require("body-parser");
const validUtil = require("./util/validation");
const queryUtil = require("./util/queries");
const securityUtil = require("./util/security");
const resultCode = require("./util/resultCodes.json");
const cors = require("cors");

const {
  success_login,
  success_creation,
  success_update,
  invalid_username_password,
  user_exists,
  user_DNE,
} = resultCode;

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/register", (req, res) => {
  let email = req.body.email;
  let password = req.body.password;
  if (validUtil._invalid_input(email, password)) {
    console.error(`--- Error invalid input email or password. ---`);
    res.status(200).send(invalid_username_password);
  } else {
    queryUtil._existing_user(email).then((result) => {
      if (validUtil._valid_email(result)) {
        console.error(` --- User already exists --- `);
        res.status(200).send(user_exists);
      } else {
        let salt = securityUtil._generateSalt();
        let hashedPassword = securityUtil._hashPassword(password, salt);
        queryUtil._new_user(email, hashedPassword, salt);
        console.error(`creation of ${email} was a success...`);
        res.status(200).send(success_creation);
      }
    });
  }
});

app.post("/login", (req, res) => {
  let email = req.body.email;
  let password = req.body.password;
  if (validUtil._invalid_input(email, password)) {
    console.error(`--- Error invalid input email or password. ---`);
    res.status(200).send(invalid_username_password);
  } else {
    queryUtil._existing_user(email).then((result) => {
      if (!validUtil._valid_email(result)) {
        console.error("--- user doesnt exists ---");
        res.status(200).send(user_DNE);
      } else {
        if (
          securityUtil._compare_password(password, result.password, result.salt)
        ) {
          // we want to create a sessionid
          console.log(result);
          console.error(`${email} has succesfully logged on.`);
          res.status(200).setHeader("email", email);
          let return_data = success_login;
          return_data["user_level"] = result["user_level"];
          res.send(return_data);
        } else {
          console.error(`--- Error invalid input email or password. ---`);
          res.status(200).send(invalid_username_password);
        }
      }
    });
  }
});

app.get("/getUser/:email", (req, res) => {
  let response = user_DNE;
  console.log("incoming request for " + req.params.email);
  queryUtil._existing_user(req.params.email).then((result) => {
    if (result !== null) {
      delete result.password;
      delete result.salt;
      response = user_exists;
      user_exists.data = result;
    }
    res.status(200).send(response);
  });
});

module.exports = app;
