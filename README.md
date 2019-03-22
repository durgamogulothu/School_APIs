1) Pre-requisites
	Node
	MySQL
	SqlAdmin tool
	Postman client for chrome
	Visual studio code 
2) Copy the school.zip and extract to school folder 

D:\> CD school

3) npm install

4) Open the SQLAdmin tool and create a database called 'schoolinfo' 

5) Open school folder in Visual studio code editor and edit the DBConnection.ts 
   and update database name and the root and password of mysql server

6) To run the application, goto command prompt..
   D:\school>npm run dev

Note: App will load the 3 teachers records for the first time loading..
1) teacher1@school.com 2)teacher2@school.com 3)teacher3@school.com


API codes used:
200 -> successful process of API purpose
400 -> Invalid request/not found records situation



API End points
==============
NOTE: change the request parameter values as needed, for all POST methods, content-type is 'applicaton/json'

1) Register students to a teacher
http://localhost:4201/api/register
method: POST
ex: request body:
{
	"teacher" : "teacher4@school.com",
	"students": ["student1@school.com","student5@school.com"]
}

2) Get common students
NOTE: request parameter structure changed as per technical feasibiliy, teacher email(s) should be given as comma separated
ex: request
http://localhost:4201/api/commonstudents?teacher=teacher2@school.com,teacher3@school.com
method: GET

3) Suspend a student
http://localhost:4201/api/suspend 
method: POST
ex: request body:
{
	"student" : "student6@school.com"
}

4) Get Recipients of notification
http://localhost:4201/api/retrievefornotifications
method: POST
ex: 
request body:
{
	
	"teacher": "teacher5@school.com",
	
	"notification" : "hello everybody @student6@school.com @student7@school.com"

}

==================
Run Test cases
d:\school>npm run test

