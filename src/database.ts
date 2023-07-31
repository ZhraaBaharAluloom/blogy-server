import { DataSource } from "typeorm";

import Blog from "./entities/blogs";
import BlogUser from "./entities/user";
import config from "./config";

const postgresDataSource = new DataSource({
  host: "localhost",
  type: "postgres",
  database: "postgres",
  port: 5432,
  username: config.keys.username,
  password: config.keys.password,
  entities: [Blog, BlogUser],
  synchronize: true,
});

export default postgresDataSource;
