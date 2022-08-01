import { ApiProperty } from "@nestjs/swagger";
import { Alcohol } from "src/Entity/alcohol.entity";
import { Review } from "src/Entity/review.entity";
import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity('User')
@Unique(['email'])
export class User {
    @PrimaryGeneratedColumn()
    @ApiProperty({ description: "유저 id" })
    id: number;

    @ApiProperty({ description: "이메일" })
    @Column()
    email: string;

    @ApiProperty({ description: "닉네임" })
    @Column({ nullable: true })
    nickname: string;

    @ApiProperty({ description: "프로필 이미지" })
    @Column({ nullable: true })
    profileImg: string;

    @OneToMany(type => Review, review => review.user, { eager: true }) // 1:N relationship
    reviews: Review[]; // 유저에 보드라는 컬럼 넣음. 여러개 넣을 수 있으니까 배열로

    @ManyToMany(() => Alcohol, (alcohols) => alcohols.user)
    @JoinTable({
        joinColumn: {
            referencedColumnName: 'id'
        }
    })
    alcohols: Alcohol[];
}
