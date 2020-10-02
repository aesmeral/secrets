const express = require("express");
const cors = require("cors");
const app = express();
const modRoute = require("./routes/mod");
const adminRoute = require("./routes/admin");

app.use(cors());

app.use("/admin", adminRoute);
app.use("/mod", modRoute);

module.exports = app;
