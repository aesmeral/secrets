const express = require("express");
const bodyParser = require("body-parser");
const queries = require("../util/queries");
const validate = require("../util/validate");
const { ObjectID } = require("mongodb");
let router = express.Router();

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.post("/approveSecret/", (req, res) => {
  let email = req.headers.email;
  validate.has_privilege(email, 2).then((r) => {
    if (!r) res.send("We do not have the power");
    else {
      let _id = req.body._id;
      let approval = req.body.approval;
      queries._delete_secret(_id).then((exists) => {
        if (!exists) res.send("Something went wrong");
        else if (exists && approval) {
          let payload = {
            _id: ObjectID(_id),
            secret: req.body.secret,
            keywords: req.body.keywords,
            posted_by: req.body.user,
            approved_by: email,
          };
          queries._add_secret(payload);
          res.send("approved or dissaproved a secret");
        }
      });
    }
  });
});

// 0 - connects to users collection
// 1 - connects to public post collection
// 2 - connects to pending post collection

router.get("/numberOf/:id", (req, res) => {
  let types = ["users", "posts", "pending"];
  let email = req.headers.email;
  let collection_number = parseInt(req.params.id);
  console.log(collection_number);
  if (collection_number > 2 || collection_number < 0)
    res.send("some sort of error");
  else {
    validate.has_privilege(email, 2).then((r) => {
      if (!r) res.send("We do not have the power");
      else {
        queries._get_count(collection_number).then((count) => {
          console.log(count);
          res.send(`numbers of ${types[collection_number]}: ${count}`);
        });
      }
    });
  }
});

module.exports = router;
