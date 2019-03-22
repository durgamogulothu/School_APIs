import { getConnection } from "typeorm";
import { TeacherService } from "./teacherService";
import { StudentService } from "./studentService";
import { Student } from "../entity/student";

export class SuspendStudent {

    public teacherService: TeacherService = new TeacherService();
    public studentService: StudentService = new StudentService();
    
    //API to suspend a student by student email using post method
    //params:   {"student":"<student email>"}
    async suspend(_studentEmail :string) {
        try {
                let saveFlag : any;
                const studentRepository = getConnection().getRepository(Student);
                let resExists = await this.studentService.getStudentbyEmail(_studentEmail);
                if(resExists.length)
                {
                    let student = new Student();
                    student.id = resExists[0].id;
                    student.status = "Suspended";
                    saveFlag = await studentRepository.manager.save(student);
                }
           
             if(saveFlag && saveFlag.id)   {
             return { code: 200, message: "Student Suspended successfully" };
            } else {
                return { code: 400, message: "Student not found with email : " + _studentEmail };
            }
         } catch (e) {
            console.log(e);
            return { code: 500, message: "There may be some issue in DB connection/server" };
        }
    }
}