import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("Selection")
export class Selection extends BaseEntity {
    @PrimaryGeneratedColumn() 
    seelction_id: number;

    @Column()
    selectionContent: string;
}