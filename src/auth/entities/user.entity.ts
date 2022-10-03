import { Like } from "src/Entity/Alcohol/like.entity";
import { Review } from "src/Entity/Alcohol/review.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity('User')
@Unique(['email'])
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email: string;

    @Column({ nullable: true })
    nickname: string;

    @Column({ nullable: true })
    profileImg: string;

    // 리뷰
    // eager: true로 하면 유저 정보에 유저가 쓴 리뷰도 같이 딸려 나옴
    @OneToMany(type => Review, review => review.user, { eager: false })
    reviews: Review[];

    // 찜하기
    @OneToMany(type => Like, like => like.user, { eager: false })
    like: Like[];

}
