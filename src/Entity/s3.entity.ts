import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity("upload_file")
export class S3 {
    @PrimaryGeneratedColumn("uuid")
    id:string;

    @Column()
    originalName: string;

    @Column({ comment: "s3 업로드된 localtion url" , nullable: true})
    url: string;

    @CreateDateColumn() 
    createdAt: Date;

    @UpdateDateColumn() 
    updatedAt: Date; 
}