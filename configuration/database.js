import mongoose from "mongoose";
import config from "./env.config.js";
const connectDB = async () => {
  try {
    const dbconnection = await mongoose.connect(config.mongodb_url);
    console.log(`Application Connected: ${dbconnection.connection.host}`);
  } catch (error) {
    console.log(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
