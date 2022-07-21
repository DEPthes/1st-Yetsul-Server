import { Review } from "src/review/entities/review.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity('User')
@Unique(['email'])
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email: string;

    @Column({nullable: true})
    profileImg: string;

    @OneToMany(type => Review, review => review.user, {eager: true}) // 1:N relationship
    reviews: Review[] // 유저에 보드라는 컬럼 넣음. 여러개 넣을 수 있으니까 배열로
}
