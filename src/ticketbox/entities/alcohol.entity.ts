import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("Alcohol")
export class Alcohol extends BaseEntity {

    @PrimaryGeneratedColumn() 
    id: number;
    
    @Column()
    AlcoholName: string;

    @Column()
    category: string;

    // 도수
    @Column()
    AlcoholByVolume: number;

    // 달달함
    @Column()
    sweet: boolean;

    // 씁쓸함
    @Column()
    bitter: boolean;

    // 상큼함
    @Column()
    refreshing: boolean;

    // 깔끔함
    @Column()
    clean: boolean;

    // 청량함
    @Column()
    cool: boolean;

    // 새콤달콤함
    @Column()
    sour: boolean;

    @Column()
    description: string;
}