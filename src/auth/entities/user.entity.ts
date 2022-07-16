import { Column, Entity, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity('User')
@Unique(['email'])
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email: string;

    @Column({nullable: true})
    profileImg: string;
}
