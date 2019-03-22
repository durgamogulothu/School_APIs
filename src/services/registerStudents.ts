import { getConnection } from "typeorm";
import { TeacherService } from "./teacherService";
import { StudentService } from "./studentService";
import { Student } from "../entity/student";
import { Teacher } from "../entity/teacher";

export class RegisterStudents {

    public teacherService: TeacherService = new TeacherService();
    public studentService: StudentService = new StudentService();
    
    //API to register the given students to a teacher 
    //params:   { "teacher":"<teacher email>","students":[<students email IDs>]}
    async saveStudent(_teacherEmail :string,_students :[string]) {
        try {

            let studentData = new Student;
            let teacherData = new Teacher(); 
            
            let studentEmails = _students;
            let saveFlag : any;
            for(let i=0; i< studentEmails.length ; i++)
            {
                studentData = new Student();
                const teacherObj = await this.teacherService.getTeacherID(_teacherEmail);
                if(teacherObj && teacherObj.id)
                {
                    teacherData.id  = teacherObj.id;                    
                }    
                else
                {
                    teacherData.email = _teacherEmail;
                }
                

                //Need to check this student already exists
                const studentRepository = getConnection().getRepository(Student);
                let resExists = await this.studentService.getStudentbyEmail(studentEmails[i]);
                if(resExists.length)
                {

                    studentData.id = resExists[0].id;
                    const existingStudent = await studentRepository.findOne(resExists[0].id,{ relations: ["teachers"] });
                    existingStudent.teachers.push(teacherData);
                    saveFlag = await studentRepository.save(existingStudent);
                    console.log(" existing student : " + JSON.stringify(resExists));
                }
                else
                {
                    studentData.email = studentEmails[i];
                    studentData.status = "Active";       
                    studentData.teachers = [teacherData];

                    saveFlag = await studentRepository.manager.save(studentData);           
                    
                }
                
            }  

            if(!saveFlag && !saveFlag.id)
            {
                return { code: 400, message: "Invalid request parameters"}
            }
            return { code: 200, message: "Student registered successfully"}

              

        } catch (e) {
            console.log(e);
            return { code: 500, message: "There may be some issue with DB connection/server" }
        }
    }
}