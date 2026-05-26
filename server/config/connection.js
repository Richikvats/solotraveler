const mongoose = require("mongoose");

mongoose.set("strictQuery", true);

const LOCAL_URI = "mongodb://127.0.0.1:27017/solotraveler";
const MONGODB_URI = process.env.MONGODB_URI || LOCAL_URI;

const connectionOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 10000,
};

mongoose.connect(MONGODB_URI, connectionOptions).catch(async (err) => {
  console.error("MongoDB initial connection failed:", err.message || err);

  if (MONGODB_URI !== LOCAL_URI) {
    console.warn("Falling back to local MongoDB at", LOCAL_URI);
    try {
      await mongoose.connect(LOCAL_URI, connectionOptions);
      console.log("Connected to local MongoDB.");
    } catch (localErr) {
      console.error("Local MongoDB fallback also failed:", localErr.message || localErr);
      process.exit(1);
    }
  } else {
    process.exit(1);
  }
});

mongoose.connection.on("connected", () => {
  console.log(
    `MongoDB connected to ${mongoose.connection.host}:${mongoose.connection.port}/${mongoose.connection.name}`
  );
});

mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err.message || err);
});

module.exports = mongoose.connection;