import Axios from "axios";
import Config from "../Config.json";

const { baseUrl } = Config;

const localStorage = require("local-storage");

const HTTPMethod = Object.freeze({
  GET: "GET",
  POST: "POST",
});

const config = {
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
  },
};

function initSocket() {
  const { common } = Axios.defaults.headers;
  // thinking about making a session id.
  // common["session_id"] = localStorage.get("session_id");
  Axios.defaults.baseURL = baseUrl;
}

async function sendHTTP(method, path, data) {
  let response;
  switch (method) {
    case HTTPMethod.GET:
      response = await Axios.get(path, config);
      break;
    case HTTPMethod.POST:
      response = await Axios.post(path, data, config);
      break;
  }
  return await response;
}

async function GET(path) {
  return await sendHTTP(HTTPMethod.GET, path);
}

async function POST(path, data) {
  return await sendHTTP(HTTPMethod.POST, path, data);
}

export default {
  initSocket,
  GET,
  POST,
};
