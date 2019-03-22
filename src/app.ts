//import * as express from "express";
import * as express from 'express';
import * as bodyParser from "body-parser";
import { mainRoutes } from "./routes/MainRoutes";
import "reflect-metadata";
import { createConnection } from "typeorm";
import * as dbconnect from "./DBConnection";
import { TeacherService } from "./services/teacherService";

const PORT = 4201;

class App {
    public app: express.Application;
    public teacherService: TeacherService = new TeacherService();
    constructor() {
        this.app = express();
        this.config();
        this.connectDB();
               

        this.app.use("/api", mainRoutes);

        this.app.listen(PORT, () => {
            console.log(`Server listening on port: ${PORT}`);
        });
    }

    private config(): void {
        // support application/json type post data
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: false }));
    }

    private connectDB(): void {
        createConnection(dbconnect.dbConnection).then(async connection => {
            console.log("Connected to DB");
            //Load teacher data of 3 records while running app for the first time
            await this.teacherService.loadTeacherDataOnFirstTime(); 
        }).catch(error => console.log("TypeORM connection error: ", error));
    }
}

export default new App().app;