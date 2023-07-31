import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 3000;

const config = {
  server: {
    port: PORT,
  },
  keys: {
    api_key: process.env.API_KEY,
    username: process.env.USERNAME,
    password: process.env.PASSWORD,
  },
};

export default config;
