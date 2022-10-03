import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Alcohol } from "src/Entity/Alcohol/alcohol.entity";
import { User } from "src/auth/entities/user.entity";

@Entity("Like")
export class Like extends BaseEntity {

    @PrimaryGeneratedColumn() 
    readonly id: number;

    @Column({nullable: true})
    alcoholId: number;

    @Column({nullable: true})
    userId: number;

    @ManyToOne(type => Alcohol, {eager: false}) // N:1 relationship
    alcohol: Alcohol;

    @ManyToOne(type => User, (user) => user.like, {nullable: true, eager: true})// N:1 relationship
    user: User; // 유저 컬럼
}