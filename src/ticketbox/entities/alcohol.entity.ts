import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("Alcohol")
export class Alcohol extends BaseEntity {

    @PrimaryGeneratedColumn() 
    id: number;
    
    @Column('character varying', {nullable: true})
    //@Column()
    AlcoholName: string;

    @Column({nullable: true})
    //@Column()
    category: string;

    @Column({nullable: true})
    AlcoholByVolume: number;

    @Column({nullable: true})
    sweet: boolean;

    @Column({nullable: true})
    bitter: boolean;

    @Column({nullable: true})
    refreshing: boolean;

    @Column({nullable: true})
    clean: boolean;

    @Column({nullable: true})
    fresh: boolean;

    @Column({nullable: true})
    sour: boolean;

    @Column({nullable: true})
    description: string;
}