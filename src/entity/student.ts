import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable,Unique} from "typeorm";
import {Teacher} from "./teacher";

@Entity()
@Unique(["email"])
export class Student {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email: string;

    @ManyToMany(type => Teacher,teacher => teacher.students)
    @JoinTable()
    teachers: Teacher[];

    @Column()
    status: string;
}
