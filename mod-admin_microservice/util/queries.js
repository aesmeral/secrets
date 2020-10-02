const { MongoClient, ObjectID } = require("mongodb");
const Config = require("../config.json");

const {
  MongoIdmURI,
  MongoSecretsURI,
  users_collection,
  public_collection,
  pending_collection,
} = Config;

// conn1 accesses the idm database
const conn1 = new MongoClient(MongoIdmURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// conn2 accesses the secrets database
const conn2 = new MongoClient(MongoSecretsURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

module.exports = {
  _connect_to_server: async function () {
    console.log(`establishing a connection to idm and secrets databases`);
    try {
      await conn1.connect();
      await conn2.connect();
    } catch (e) {
      console.log(e);
    }
  },
  _get_user_privilege: async function (email) {
    return await conn1
      .db()
      .collection(users_collection)
      .findOne({ email: email }, { user_level: 1 })
      .then((response) => {
        return response.user_level;
      })
      .catch(() => {
        return null;
      });
  },
  _delete_secret: async function (secret_id) {
    return await conn2
      .db()
      .collection(pending_collection)
      .deleteOne({ _id: ObjectID(secret_id) })
      .then((r) => {
        return r.deletedCount;
      });
  },
  _add_secret: async function (payload) {
    await conn2.db().collection(public_collection).insertOne(payload);
  },

  _get_count: async function (value) {
    let collection = "";
    let db = conn2;
    switch (value) {
      case 0:
        collection = users_collection;
        db = conn1;
        break;
      case 1:
        collection = public_collection;
        break;
      case 2:
        collection = pending_collection;
        break;
    }
    return await db
      .db()
      .collection(collection)
      .countDocuments()
      .then((count) => {
        return count;
      });
  },
};
