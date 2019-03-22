import { getManager, getConnection,In } from "typeorm";
import { Teacher } from "../entity/teacher";

export class TeacherService {
    
    async saveTeacher(_teacher :Teacher){
        await getConnection().manager.save(_teacher);
    }
    async getAllTeachers() {
        return await getManager().getRepository(Teacher).find();
    }

    async getTeacherID(_email :string) {
        return await getManager()
            .createQueryBuilder(Teacher, "teacher")
            .select("teacher.id")
            .where({ email: _email })
            .getOne();
    }

    
    async getTeachersbyEmails(_emails :string) {
        if(_emails)
        {
            let teacherEmails = _emails.split(",");
            //console.log("getTeachers : "+JSON.stringify(teacherEmails.toString()));
            return await getConnection().getRepository(Teacher).find({email: In([teacherEmails])});
        }
        return null;
    }


    async loadTeacherDataOnFirstTime()
    {
        let teachers = await this.getAllTeachers();
        if(!teachers.length)
        {
            let teacherEmails = ["teacher1@school.com","teacher2@school.com","teacher3@school.com"];
            for(let i=0; i< teacherEmails.length ; i++)
            {
                const teacherData = new Teacher();
                teacherData.email = teacherEmails[i];

                await this.saveTeacher(teacherData);
            }  
        }
    }
}
