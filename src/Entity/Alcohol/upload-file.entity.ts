import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity("upload_file")
export class UploadFile {
    @PrimaryGeneratedColumn("uuid")
    id:string;

    @Column({nullable: true})
    originalName: string;

    @Column({nullable: true})
    encoding: string;

    @Column({nullable: true})
    mimeType: string;

    @Column("decimal", { precision: 10, scale: 2, nullable: true })
    size: number;

    @Column({ comment: "s3 업로드된 localtion url" , nullable: true})
    url: string;

    @CreateDateColumn() 
    createdAt: Date;

    @UpdateDateColumn() 
    updatedAt: Date;
}