import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("Selection")
export class Selection extends BaseEntity {
    @PrimaryGeneratedColumn() 
    selection_id: number;

    @Column()
    selectionContent: string;
}