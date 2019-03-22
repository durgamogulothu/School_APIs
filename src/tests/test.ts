//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');

let should = chai.should();


var expect = require('chai').expect;
let assert = chai.assert;

let app = '../app';
var Student = '../entity/student';
var Teacher = '../entity/teacher';

chai.use(chaiHttp);

describe("Students Api's", () => {
    let apiUrl = 'http://localhost:4201/api';
    describe("POST /", () => {
        
        // Register API start
        //Test to register the students to a teacher
        describe("Register student(s)", () => {
        
            it('should return if the given students registered to a teacher with 200',  function() {  
                let req = {
                    'teacher': 'teacher3@school',
                    'students': ['student5@school.com', 'student6@school.com']
                }
                
                    const res = chai.request(apiUrl).post('/register')
                        .set({ 'content-Type': 'application/json; charset=utf-8' })
                        .send(req)
                        .end(function(err,res) {
                            expect(req).to.have.property('teacher')
                            expect(req).to.have.property('students')
                            expect(res).to.be.json
                            expect(res).to.have.status(200)
                            expect(res.body).to.be.equal('Students registered successfully to the given teacher')
                        })
                
            });
            it('should return on invalid parameters/bad request/data not found with 400', function() { 
                const req = {
                    'teacher': 'teacher@test.com',
                    'students': ['fakestudent@test.com', 'student@test.com']
                }
                
                try{    
                    const res =  chai.request(apiUrl).post('/register')
                        .set({ 'content-Type': 'application/json; charset=utf-8' })
                        .send(req)
                        .end(function(err,res) {
                            expect(res).to.be.json
                            expect(res).to.have.status(400)
                        })
                }catch(err){

                }
                
            });
        });   
        // Register API ends

        // Suspend API starts
        // Test to suspend a student record
        describe("Suspend a student", () => {
            
            it('should return success message on suspend a student with 200', function() {
                const req = {
                    'student': 'fakestudent@test.com'
                }
                try{
                    const res =  chai.request(apiUrl).post( '/suspend')
                        .set({ 'content-Type': 'application/json; charset=utf-8' })
                        .send(req)
                        .end((err,res) => {
                            expect(res).to.be.json
                            expect(res).to.have.status(200)
                        })
                }catch(err){

                }
            });
            it('should return on invalid parameters/bad request with status 400', function() {
                const req = {
                    'student': 'fakestudent@test.com'
                }
                try{
                    const res = chai.request(apiUrl).post('/suspend')
                        .set({ 'content-Type': 'application/json; charset=utf-8' })
                        .send(req)
                        .end((err,res) => {
                            expect(res).to.be.json
                            expect(res).to.have.status(400)
                            expect(res.body).to.be.equal('Student not found with email : fakestudent@test.com')
                        })
                    }catch(err){

                    }
            });
        });
        //Suspend API ends

        //Retrieve list for notifications API starts
        //Test the student list for a notification
        describe("Retrieve list for notification API", () => {
            
            it('should return list of student emails on success with status 200', function()  {
                const req = {
                    'teacher': 'fakesteacher@test.com',
                    'notification': 'hello students'
                }
                try{
                
                    const res = chai.request(apiUrl).post('/retrievefornotifications')
                    .set({ 'content-Type': 'application/json; charset=utf-8' })
                    .send(req)
                    .end((err,res) => {
                        expect(res).to.be.json
                        expect(res).to.have.status(200)
                        expect(res.body).to.be.json
                    })
                }catch(err){

                }

            });
            it('should return on invalid parameters/bad request with status 400', function()  {
                const req = {
                    'teacher': 'fakestudent@test.com',
                    'notification': 'hello students'
                }
                try{                
                    const res = chai.request(apiUrl).post('/retrievefornotifications')
                    .set({ 'content-Type': 'application/json; charset=utf-8' })
                    .send(req)
                    .end(function(err,res) {
                    
                        expect(res).to.be.json;
                        expect(res).to.have.status(400);
                    })
                }catch(err){

                }
                
            });
        });
    });
        
    describe("GET /", () => {
        
        //Common student API starts
        //Test the common students API
        describe("Common Students API", () => {
            it('Valid request should succeed with 200', function() {   
                try{
                    chai.request(apiUrl).get('/commonstudents?teacher=teacher1@school.com,teacher3@school.com')
                    .end(function(err, res) {
                    expect(res).to.have.status(200); 
                    });
                }catch(err){

                }    
            });

            it('Bad request expected to fail with 400', function() {   // <= No done callback
                try{
                    chai.request(apiUrl).get('/commonstudents')
                    .end(function(err, res) {
                    expect(res).to.have.status(400); 
                   });
                }catch(err){

                }
              });
        });
    });
});

