import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity("upload_file")
export class S3 {
    @PrimaryGeneratedColumn("uuid")
    id:string;

    @Column()
    originalName: string;

    @CreateDateColumn() 
    createdAt: Date;

    @UpdateDateColumn() 
    updatedAt: Date; 
}