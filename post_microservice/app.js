const express = require("express");
const bodyParser = require("body-parser");
const queryUtil = require("./util/queries");
const resultCodes = require("./util/resultCodes.json");
const validUtility = require("./util/validation");

const cors = require("cors");
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const {
  success_post,
  success_save,
  success_getSecret,
  success_getSavedSecrets,
  secrets_keywords_unsat,
  secrets_not_found,
  email_undefined,
  fail_post,
  secret_id_undefined,
} = resultCodes;
// anyone can post a secret, this should not return an error i dont think.
app.post("/postSecret", (req, res) => {
  let email = req.header.email;
  let secret = req.body.secret;
  let keywords = req.body.keywords;
  let data = {
    secret: secret,
    keywords: keywords,
  };
  if (email === undefined) {
    data.user = "Anonymous";
  } else data.user = email;
  if (secret === undefined || secret.trim() === "") {
    console.info(` --- ${data.user}'s secret was undefined or empty --- `);
    res.status(200).send(fail_post);
  } else {
    queryUtil._post_secret(data);
    console.info(`--- ${data.user} has posted a secret ---`);
    res.status(200).send(success_post);
  }
});

// only users can save a secret, if there is no email in the req.body or req.header then do not process request
// else it's okay.
app.post("/saveSecret", (req, res) => {
  let email = req.body.email;
  let secret_id = req.body.id;
  validUtility._fetch_email(email).then((response) => {
    if (response === null) res.status(200).send(email_undefined);
    else if (secret__id === undefined)
      res.status(200).send(secret_id_undefined);
    else {
      queryUtil._save_secret(email, secret_id).then(() => {
        console.info(
          ` --- ${secret_id} was successfully saved for ${email} --`
        );
        res.status(200).send(success_save);
      });
    }
  });
});

// everyone has the ability to view secrets, however.. if there are no secrets with those keywords. then return no secrets
app.get("/getSecrets", (req, res) => {
  let keywords = req.query.keywords;
  let email = req.headers.email !== undefined ? req.headers.email : "Anonymous";
  console.info(`--- ${email} requested secrets ---`);
  keywords = keywords !== undefined ? keywords.split(",") : undefined;
  queryUtil._get_secret(keywords).then((response) => {
    if (response.length < 1) {
      res.status(200).send(secrets_keywords_unsat);
    } else {
      response.forEach((element) => {
        delete element.posted_by;
        delete element.approved_by;
      });
      let temp_respond = success_getSecret;
      temp_respond.secrets = response;
      res.status(200).send(temp_respond);
    }
  });
});

// only for users. check if email exists in headers.
app.get("/getSavedSecrets", (req, res) => {
  let email = req.headers.email;
  validUtility._fetch_email(email).then((response) => {
    if (response === null) {
      console.log(` -- ${email} was not found --`);
      res.status(200).send(email_undefined);
    } else {
      queryUtil._get_saved_secret(email).then((r) => {
        if (r === undefined) {
          console.log(` -- secrets was not found in the database -- `);
          res.status(200).send(secrets_not_found);
        } else {
          let temp_respond = success_getSavedSecrets;
          r.forEach((e) => {
            delete e.user;
          });
          temp_respond.secrets = r;
          console.log(` -- sending ${email} saved secrets -- `);
          res.status(200).send(temp_respond);
        }
      });
    }
  });
});

module.exports = app;
