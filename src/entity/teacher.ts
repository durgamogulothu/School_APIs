import { Entity, PrimaryGeneratedColumn, Column,ManyToMany, JoinTable, Unique} from "typeorm";
import {Student} from "./student";

@Entity()
@Unique(["email"])
export class Teacher {

    @PrimaryGeneratedColumn()
    id: number;


    @Column()
    email: string;

    
    @ManyToMany(type => Student,student => student.teachers)
    students: Student[];
}

