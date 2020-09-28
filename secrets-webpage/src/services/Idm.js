import Socket from "../util/Socket";
import { idmEP } from "../Config.json";

const { loginEP, registerEP } = idmEP;

async function login(email, password) {
  const payLoad = {
    email: email,
    password: password,
  };
  return await Socket.POST(loginEP, payLoad);
}

async function register(email, password) {
  const payLoad = {
    email: email,
    password: password,
  };
  return await Socket.POST(registerEP, payLoad);
}

export default {
  login,
  register,
};
