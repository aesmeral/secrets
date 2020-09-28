const { MongoClient } = require("mongodb");
const Config = require("../config.json");
const { MongoIdmUri, idm_collection } = Config;

const client = new MongoClient(MongoIdmUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

module.exports = {
  _connect_to_server: async function () {
    console.log(`establishing a connection to the idm database ...`);
    try {
      await client.connect();
    } catch (e) {
      console.error(e);
    }
  },

  // new members will have an email, password, salt in the database. their members status will be flagged false.
  // user level 3 - 1 (3 being basic user, 2 being a mod, and 1 being an admin)
  _new_user: async function (email, password, salt) {
    let data = {
      email: email,
      password: password,
      salt: salt,
      user_level: 3,
      member: false,
    };
    await client.db().collection(idm_collection).insertOne(data);
  },

  _existing_user: async function (email) {
    let data = {
      email: email,
    };
    return await client.db().collection(idm_collection).findOne(data);
  },

  _update_user: async function (email, new_data) {
    return await client
      .db()
      .collection(idm_collection)
      .updateOne({ email: email }, { $set: new_data });
  },
};
