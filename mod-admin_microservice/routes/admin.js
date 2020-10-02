const express = require("express");
const bodyParser = require("body-parser");

let router = express.Router();

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.get("/:id", (req, res) => {
  res.send("Hello, your admin ID is " + req.params.id);
});

module.exports = router;
