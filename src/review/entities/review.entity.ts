import { Alcohol } from "src/admin/alcohol/entities/alcohol.entity";
import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity("Review")
export class Review extends BaseEntity {
    @PrimaryGeneratedColumn() 
    id: number;

    @Column({nullable: true})
    title: string;

    @Column({nullable: true})
    content: string;

    // 별점
    @Column("float", {nullable: true})
    star;

    @ManyToOne(type => Alcohol, alcohol => alcohol.reviews, {eager: false}) // N:1 relationship
    alcohol: Alcohol; // 유저 컬럼
}
