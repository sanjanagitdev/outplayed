import mongoose from "mongoose";
export const mongoConnect = async () => {
  try {
    mongoose.set("useCreateIndex", true);
    await mongoose.connect(process.env.MONGO_CONNECT_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });
    console.log("Connected to Mongo database");
  } catch (e) {
    console.log(`Error connecting to mongo database ${e}`);
  }
};

// db.createUser({
//   user: "luiscsgo",
//   pwd: "545657775jjkk",
//   roles: ["readWrite", "dbAdmin"],
// });
