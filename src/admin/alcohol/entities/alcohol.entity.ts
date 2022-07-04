import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("Alcohol")
export class Alcohol extends BaseEntity {

    @PrimaryGeneratedColumn() 
    id: number;
    
    @Column({nullable: true})
    AlcoholName: string;

    @Column({nullable: true})
    category: number;

    // 도수
    @Column("float", {nullable: true})
    AlcoholByVolume;

    // 달달함
    @Column({nullable: true})
    sweet: boolean;

    // 씁쓸함
    @Column({nullable: true})
    bitter: boolean;

    // 상큼함
    @Column({nullable: true})
    refreshing: boolean;

    // 깔끔함
    @Column({nullable: true})
    clean: boolean;

    // 청량함
    @Column({nullable: true})
    cool: boolean;

    // 새콤달콤함
    @Column({nullable: true})
    sour: boolean;

    @Column({nullable: true})
    description: string;

    // 별점
    @Column("float", {nullable: true})
    star;
}