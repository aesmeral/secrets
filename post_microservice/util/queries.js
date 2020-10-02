const { MongoClient, ObjectID } = require("mongodb");
const Config = require("../config.json");

const {
  MongoSecretsUri,
  pending_collection,
  public_collection,
  saved_collection,
} = Config;

const client = new MongoClient(MongoSecretsUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

module.exports = {
  _connect_to_server: async function () {
    console.log(`establishing a connection to the secrets database`);
    try {
      await client.connect();
    } catch (e) {
      console.log(e);
    }
  },

  _post_secret: async function (data) {
    await client.db().collection(pending_collection).insertOne(data); // insert a new secret into the collection.
  },

  _get_secret: async function (keywords) {
    let pipeline;
    if (keywords !== undefined) {
      // if keywords exists, retrieve 10 random documents with those keywords
      pipeline = [
        { $sample: { size: 10 } },
        { $match: { keywords: { $all: keywords } } },
      ];
    } else pipeline = [{ $sample: { size: 10 } }]; // else just retrieve 10 random documents.

    return await client
      .db()
      .collection(public_collection)
      .aggregate(pipeline)
      .toArray();
  },

  _save_secret: async function (email, secret_data_id) {
    await client
      .db()
      .collection(saved_collection)
      .findOne({ email: email })
      .then(async (response) => {
        if (response === null) {
          let saved_secret = [new ObjectID(secret_data_id)];
          let data = {
            email: email,
            saved_secret: saved_secret,
          };
          await client.db().collection(saved_collection).insertOne(data);
        } else {
          await client
            .db()
            .collection(saved_collection)
            .updateOne(
              { email: email },
              { $addToSet: { saved_secret: new ObjectID(secret_data_id) } }
            );
        }
      });
  },

  _get_saved_secret: async function (email) {
    return await client
      .db()
      .collection(saved_collection)
      .findOne({ email: email })
      .then(async (response) => {
        // find email in our saved collections
        if (response === null) {
          // if none, then email doesnt exists in the collection
          return undefined;
        } else {
          let saved_secrets = response.saved_secret; // else get saved_secret (which is an arry of objects)
          return await client
            .db()
            .collection(pending_collection) // find all object_id within the array in public_collection
            .find({ _id: { $in: saved_secrets } }) // returns all secrets found that has the object_id(s) we're looking for.
            .toArray();
        }
      });
  },
};
