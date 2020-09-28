const bcrypt = require("bcrypt");
const Config = require("../config.json");

const { salt_rounds } = Config;

module.exports = {
  _generateSalt: function () {
    return bcrypt.genSaltSync(salt_rounds);
  },
  _hashPassword: function (password, salt) {
    return bcrypt.hashSync(password, salt);
  },
  _compare_password: function (inputPassword, hashedPassword, salt) {
    return this._hashPassword(inputPassword, salt) === hashedPassword;
  },
};
