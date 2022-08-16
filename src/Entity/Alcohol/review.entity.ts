import { Alcohol } from "src/Entity/Alcohol/alcohol.entity";
import { User } from "src/auth/entities/user.entity";
import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity("Review")
export class Review extends BaseEntity {
    @PrimaryGeneratedColumn() 
    id: number;

    @Column({nullable: true})
    title: string;

    @Column({nullable: true})
    content: string;

    // 별점. (리뷰 별점은 정수)
    @Column({nullable: true})
    star: number;

    @Column({ nullable: true })
    reviewImgUrl: string;

    // 작성 시간
    @CreateDateColumn() 
    date: Date;

    // 추천 수
    @Column({nullable: true})
    like: number;

    // 자동으로 만들어 지는데 직접 추가하면 find 시 userId도 나옴.
    @Column({nullable: true})
    userId: number;

    @ManyToOne(type => Alcohol, alcohol => alcohol.reviews, {eager: false}) // N:1 relationship
    alcohol: Alcohol; // 술 컬럼

    @ManyToOne(type => User, user => user.reviews, {eager: false}) // N:1 relationship
    user: User; // 유저 컬럼
}