import { ApiProperty } from "@nestjs/swagger";
import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Alcohol } from "src/Entity/Alcohol/alcohol.entity";
import { User } from "src/auth/entities/user.entity";

@Entity("Like")
export class Like extends BaseEntity {

    @ApiProperty({description: "리뷰 pk 값"})
    @PrimaryGeneratedColumn() 
    readonly id: number;
    
    @Column({nullable: true})
    liked: boolean;

    @ManyToOne(type => Alcohol) // N:1 relationship
    @JoinColumn({name : "alcohol_id", referencedColumnName: "id" })
    alcohol_id: Alcohol;

    @ManyToOne(type => User) // N:1 relationship
    @JoinColumn({name : "user_id", referencedColumnName: "id" })
    userId: User; // 유저 컬럼
}

