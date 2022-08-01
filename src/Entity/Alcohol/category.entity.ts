import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Alcohol } from "./alcohol.entity";

@Entity("Category")
export class Category extends BaseEntity {

    @PrimaryGeneratedColumn()
    categoryID: number;

    @Column()
    categoryName: string;




}
