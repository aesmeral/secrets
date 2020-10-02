const Axios = require("axios");
const Config = require("../config.json");

const { idmURL, idmEPs } = Config;
const { getUser } = idmEPs;

module.exports = {
  _fetch_email: async function (email) {
    if (email === undefined || email == "") return null;
    let header = {
      email: email,
    };
    let url = idmURL + getUser;
    console.log(url);
    return await Axios.get(url, { headers: header }).then((response) => {
      if (response.data.resultCode === 13) return null;
      else return response.data;
    });
  },
};
