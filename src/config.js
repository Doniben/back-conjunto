import { config } from "dotenv";
config();

export default {
  MONGODB_URI: process.env.MONGODB_URI || "mongodb+srv://smilebang:smilebang@cluster0.eauza.mongodb.net/books-api?retryWrites=true&w=majority",
  PORT: process.env.PORT || 4000,
  SECRET: 'books-api'
};
