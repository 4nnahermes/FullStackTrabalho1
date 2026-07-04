import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "331331",
    database: "crud-vet",
    entities: ["src/entity/*.ts"],
    logging: true,
    synchronize: true,
})