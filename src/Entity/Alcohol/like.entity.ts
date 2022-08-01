import { ApiProperty } from "@nestjs/swagger";
import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Alcohol } from "src/Entity/Alcohol/alcohol.entity";
import { User } from "src/auth/entities/user.entity";

@Entity("Like")
export class Like extends BaseEntity {

    @ApiProperty({description: "리뷰 pk 값"})
    @PrimaryGeneratedColumn() 
    readonly id: number;
    
    @Column({nullable: true})
    liked: boolean;

    @ManyToOne(type => Alcohol, alcohol => alcohol.reviews, {eager: false}) // N:1 relationship
    alcohol: Alcohol; // 술 컬럼

    @ManyToOne(type => User, user => user.reviews, {eager: false}) // N:1 relationship
    user: User; // 유저 컬럼
}

