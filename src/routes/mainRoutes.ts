import { Request, Response, Router } from "express";
import { TeacherService } from "../services/teacherService";
import { StudentService } from "../services/studentService";
import { RegisterStudents } from "../services/registerStudents";
import { CommonStudents } from "../services/commonStudents";
import { SuspendStudent } from "../services/suspendStudent";
import { RetrieveList } from "../services/retrieveList";

import { Teacher } from "../entity/teacher";
import { Student } from "../entity/student";


class MainRoutes {

    public router: Router = Router();
    public teacherService: TeacherService = new TeacherService();
    public studentService: StudentService = new StudentService();
    public registerStudents: RegisterStudents = new RegisterStudents();
    public commonStudents: CommonStudents = new CommonStudents();
    public suspendStudent: SuspendStudent = new SuspendStudent();
    public retrieveList: RetrieveList = new RetrieveList();
    

    constructor() {
        this.routes();
    }

    private routes(): void {
        this.router.get("/", async (req: Request, res: Response) => {
            let teachers = await this.teacherService.getAllTeachers();
            if(!teachers.length)
            {
                res.status(400).send("Teachers data not found")
            }
            else
            {
                res.status(200).send(teachers)
            }
        });

        //API to register the given students to a teacher 
        this.router.post("/register", async (req: Request, res: Response) => {
            if(!req.body.teacher || !req.body.students)
                res.status(400).send({ "message": "Bad request/Invalid parameters" });
            
            
            if(req.body.students)
            {
                let registerRes = await this.registerStudents.saveStudent(req.body.teacher,req.body.students);
                
                res.status(registerRes.code).send({ "message": registerRes.message });
            }
        });

        //API to suspend a student by student email ID
        this.router.post("/suspend", async (req: Request, res: Response) => {
            if(!req.body.student)
                res.status(400).send({ "message": "Bad request/Invalid parameters" });
            let suspendStudent = await this.suspendStudent.suspend(req.body.student);

            res.status(suspendStudent.code).send({ "message": suspendStudent.message });
        });

        
        //API to get common students by Teacher email ID(s)
        this.router.get("/commonstudents", async (req: Request, res: Response) => {
            if(!req.query || !req.query.teacher)
                res.status(400).send({ "message": "Bad request/Invalid parameters" }); 
            let commonStudents = await this.commonStudents.getCommonStudents(req.query.teacher);
            res.status(commonStudents.code).send({ "message": commonStudents.message });
            
        });

        
        //API to get recipients of a notification 
        //method: post
        //params:   { "teacher":"<Teacher email ID>", "Notification":"Notification may also contain <@student email ID>"}
        this.router.post("/retrievefornotifications", async (req: Request, res: Response) => {
            if(!req.body || !req.body.teacher || !req.body.notification)
                res.status(400).send({ "message": "Bad request/Invalid parameters" });
            let recipients = await this.retrieveList.getRecipients(req.body.teacher,req.body.notification);
            res.status(recipients.code).send({ "message": recipients.message });
        });
    }
}

export const mainRoutes = new MainRoutes().router;