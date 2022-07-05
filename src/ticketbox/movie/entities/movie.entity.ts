import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("Movie")
export class Movie extends BaseEntity {
    @PrimaryGeneratedColumn() 
    id: number;

    @Column()
    title: string;

    @Column()
    description: string;

    @Column()
    image: string;

    @Column({nullable: true})
    alcohol: number;
}