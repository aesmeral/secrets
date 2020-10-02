const Axios = require("axios");
const Config = require("../config.json");

const { idmURL, idmEPs } = Config;
const { getUser } = idmEPs;

module.exports = {
  _fetch_email: async function (email) {
    if (email === undefined || email == "") return null;
    let url = idmURL + getUser + "/" + email;
    console.log(url);
    return await Axios.get(url).then((response) => {
      if (response.data.resultCode === 13) return null;
      else return response.data;
    });
  },
};
