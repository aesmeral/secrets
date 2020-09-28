const http = require("http");
const app = require("./app");
const mongodb = require("./util/queries");

const port = 3101;
const server = http.createServer(app);

// starting server
server.listen(port, () => {
  console.log(` --- idm server has been initiated. ---`);
});

// connecting to mongodb
mongodb._connect_to_server();
