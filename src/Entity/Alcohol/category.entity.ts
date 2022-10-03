import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("Category")
export class Category extends BaseEntity {

    @PrimaryGeneratedColumn()
    categoryID: number;

    @Column()
    categoryName: string;
}