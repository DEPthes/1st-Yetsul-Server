import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("Question")
export class Question extends BaseEntity {
    @Column() 
    question_id: number;

    @PrimaryGeneratedColumn('uuid') 
    uuid_id: string;

    @Column()
    questionContent: string;
}