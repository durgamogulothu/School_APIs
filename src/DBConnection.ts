
import "reflect-metadata";
import { ConnectionOptions } from "typeorm";
import { Student } from "./entity/student";
import { Teacher } from "./entity/teacher";

export let dbConnection: ConnectionOptions = {
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "",
    database: "schoolinfo",
    entities: [
        Student,
        Teacher
    ],
    synchronize: true,
}