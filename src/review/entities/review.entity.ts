import { Alcohol } from "src/admin/alcohol/entities/alcohol.entity";
import { User } from "src/auth/entities/user.entity";
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
    @Column("decimal", {nullable: true})
    star: number;

    @Column({ nullable: true })
    reviewImgUrl: string;

    @ManyToOne(type => Alcohol, alcohol => alcohol.reviews, {eager: false}) // N:1 relationship
    alcohol: Alcohol; // 술 컬럼

    @ManyToOne(type => User, user => user.reviews, {eager: false}) // N:1 relationship
    user: User; // 유저 컬럼
}
