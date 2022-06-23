import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("Question")
export class Question extends BaseEntity {
    @PrimaryGeneratedColumn() 
    question_id: number;

    @Column()
    questionContent: string;
}