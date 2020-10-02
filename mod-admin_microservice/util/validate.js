const queries = require("../util/queries");

module.exports = {
  has_privilege: async function (email, power) {
    return queries._get_user_privilege(email).then((r) => {
      if (r === null) return false;
      else if (r > power) return false;
      else return true;
    });
  },
};
