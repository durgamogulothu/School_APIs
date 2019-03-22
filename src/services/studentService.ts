import { getManager,  getRepository, getConnection } from "typeorm";
import { TeacherService } from "./teacherService";
import { Student } from "../entity/student";

export class StudentService {

    public teacherService: TeacherService = new TeacherService();

    
    //get student by Email
    async getStudentbyEmail(_email :string) {
        return await getRepository(Student).find({where: {email : _email}});
    }

    //Check student count by Email and suspended
    async checkStudentbyEmailSuspended(_email:string) {
        return await getManager()
            .createQueryBuilder(Student, "student")
            .select("count(*) as count")
            .where("student.email = :email", { email: _email })
            .andWhere("status = 'Suspended'")
            .getRawOne();
    }

    //get Active students email by a teacher Email
    async getActiveStudentEmailsByTeacherID(_teacherEmail: string,_activeFlag=0) {
        if(_activeFlag == 1)
        {
            return await getConnection().getRepository(Student)
                        .createQueryBuilder("student")
                        .select("student.email")
                        .innerJoin("student.teachers", "teacher","teacher.email = :tEmail",{tEmail: _teacherEmail})
                        .where("student.status = 'Active'")
                        .getMany();
        }
        return await getConnection().getRepository(Student)
                        .createQueryBuilder("student")
                        .select("student.email")
                        .innerJoin("student.teachers", "teacher","teacher.email = :tEmail",{tEmail: _teacherEmail})
                        .getMany();
    }
}