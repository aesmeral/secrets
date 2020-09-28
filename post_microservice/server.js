const http = require("http");
const app = require("./app");
const mongodb = require("./util/queries");

const port = 3102;
const server = http.createServer(app);

server.listen(port, () => {
  console.log(` --- secrets server has been initiated. ---`);
});

mongodb._connect_to_server();
