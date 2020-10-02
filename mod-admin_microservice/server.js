const http = require("http");
const app = require("./app");
const config = require("./config.json");
const mongodb = require("./util/queries");

const port = config.PORT;
const server = http.createServer(app);

server.listen(port, () => {
  console.log(
    ` --- admin/mod microservice has been initiated on port: ${port} ---`
  );
});

mongodb._connect_to_server();
