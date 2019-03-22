import { getManager,  getRepository, getConnection } from "typeorm";
import { TeacherService } from "./teacherService";
import { StudentService } from "./studentService";


export class RetrieveList {

    public teacherService: TeacherService = new TeacherService();
    public studentService: StudentService = new StudentService();
    
    
    //get recipients of a notification
    //API to get recipients of a notification using post method
    //params:   {"teacher":"<teacher email>","notification" : "text may have new student email(s)"}
    async getRecipients(_teacherEmail:string, notification :string) {
        try {
            

            let objTeachers = await this.teacherService.getTeachersbyEmails(_teacherEmail);
            
            console.log("objTeachers : "+ objTeachers.length + " :: "+JSON.stringify(objTeachers)) ;
            if(!objTeachers || (objTeachers.length != 1))
            {
                return { code: 400, message: "Invalid request parameters"}
            }
            else
            {
                
                let stuEmails = await this.studentService.getActiveStudentEmailsByTeacherID(_teacherEmail,1);
                
                if (stuEmails && stuEmails.length) {
                    let studentIDs = [];
                    for(let i=0; i < stuEmails.length ;i++)
                    {
                        studentIDs[i] = stuEmails[i].email;
                    }
                
                    let tArr = notification.split(" ");
                    if(tArr.length > 0)
                    {
                        for (let i = 0; i < tArr.length; i++) {
                            if(tArr[i][0] == '@')//checking if any email is added in notification text
                            {
                                const emailInNotification = tArr[i].toString().substring(1);
                                if(studentIDs.indexOf(emailInNotification) == -1)
                                {
                                    let supspendedStudentExists = await this.studentService.checkStudentbyEmailSuspended(emailInNotification);
                                    if (supspendedStudentExists.count === "0" ) {
                                        studentIDs[studentIDs.length] = emailInNotification;
                                    }
                                }            
                            }
                        }
                        
                    }
                    let result = { "recipients" : studentIDs };
                    //console.log("student emails : "  + studentIDs);
                    return { code : 200 , message : result};
        
                }
                else
                {
                    return { code: 400 , message : "Invalid Parameters"}
                }
            }
        } catch (e) {
            console.log(e);
            return { code: 500, message: "There may be some issue with DB connection/server" }
        }
    }
}