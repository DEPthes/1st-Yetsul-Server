import { ApiProperty } from "@nestjs/swagger";
import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "src/auth/entities/user.entity";
import { Review } from "./review.entity";

// 리뷰 좋아요 엔티티
@Entity("ReviewLike")
export class ReviewLike extends BaseEntity {

    @ApiProperty({description: "리뷰 pk 값"})
    @PrimaryGeneratedColumn() 
    readonly id: number;

    @Column({nullable: true})
    reviewId: number;

    @Column({nullable: true})
    userId: number;

    @ManyToOne(type => Review, {eager: false}) // N:1 relationship
    review: Review;

    @ManyToOne(type => User, (user) => user.like, {nullable: true, eager: true})// N:1 relationship
    user: User; // 유저 컬럼
}