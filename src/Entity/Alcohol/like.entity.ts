import { ApiProperty } from "@nestjs/swagger";
import { BaseEntity, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Alcohol } from "src/Entity/Alcohol/alcohol.entity";
import { User } from "src/auth/entities/user.entity";

@Entity("Like")
export class Like extends BaseEntity {

    @ApiProperty({description: "리뷰 pk 값"})
    @PrimaryGeneratedColumn() 
    readonly id: number;

    @ManyToOne(type => Alcohol, {eager: false}) // N:1 relationship
    alcohol: Alcohol;

    @ManyToOne(type => User, (user) => user.like, {nullable: true, eager: true})// N:1 relationship
    user: User; // 유저 컬럼
}