module.exports = {
  _validateEmail: function (email) {
    let emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailPattern.test(email);
  },
  _invalid_input: function (email, password) {
    return (
      email === undefined ||
      password === undefined ||
      !this._validateEmail(email)
    );
  },
  _valid_email: function (data) {
    if (data === null) return false;
    else return true;
  },
};
