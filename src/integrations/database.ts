import { DataSource } from "typeorm";
import path from "path";

const entitiesPath = path.join(
  __dirname,
  "..",
  "modules",
  "**",
  "entities",
  "*.entity{.ts,.js}"
);

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: process.env.DB_PORT as unknown as number,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: true,
  logging: false,
  entities: [entitiesPath],
  migrations: [],
  subscribers: [],
});
