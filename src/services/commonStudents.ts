import { getConnection } from "typeorm";
import { TeacherService } from "./teacherService";
import { StudentService } from "./studentService";
import { Teacher } from "../entity/teacher";

export class CommonStudents {

    public teacherService: TeacherService = new TeacherService();
    public studentService: StudentService = new StudentService();

    //API to get the common students of given teacher email(s) by get method
    //params:   "teacher":"<comma separated teacher email(s)>"
    async getCommonStudents(_teacherEmails :string) {
        try {
            if(!_teacherEmails)
            {
                return { code: 400, message: "Invalid request parameters"}
            }
            let objTeachers = await this.teacherService.getTeachersbyEmails(_teacherEmails);
            let studentRepository = getConnection().getRepository(Teacher);
            let teacherEmailsArr = _teacherEmails.split(",");
            console.log("objTeachers : "+ objTeachers.length + " :: "+JSON.stringify(objTeachers) + " :: teacherEmailArr length : "+teacherEmailsArr.length);
            if(!objTeachers || (objTeachers.length != teacherEmailsArr.length))
            {
                return { code: 400, message: "Invalid request parameters"}
            }
            else
            {
                let allStudentEmails:string[][] = [] ;
                for(let i=0;i< teacherEmailsArr.length;i++)    
                {
                    let stuEmails = await this.studentService.getActiveStudentEmailsByTeacherID(teacherEmailsArr[i]);
                    if (stuEmails && stuEmails.length) {
            
                        let studentIDs:string[] = [];
                        for(let i=0; i < stuEmails.length ;i++)
                        {
                            studentIDs[i] = stuEmails[i].email;
                        }
                        allStudentEmails[allStudentEmails.length] = studentIDs;
                        
                    }
                }
                if(Array.isArray(allStudentEmails) && allStudentEmails.length>0)
                {
                    
                    const result = allStudentEmails.shift().filter(function(v) {
                        return allStudentEmails.every(function(a) {
                            return a.indexOf(v) !== -1;
                        });
                    });
                    let resObject = { "students" :  result };
                    //console.log(" common students : "+ JSON.stringify(resObject));
                    return { code: 200, message: resObject}
                }
                return{ code: 400, message: "invalid parameters or Bad request"}
            }
            
        } catch (e) {
            console.log(e);
            return { code: 500, message: "There may be some in DB connecton/server" }
        }

    }
    
}