//import { Review } from "src/review/entities/review.entity";
import { Review } from "src/review/entities/review.entity";
import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity("Alcohol")
export class Alcohol extends BaseEntity {

    @PrimaryGeneratedColumn() 
    id: number;
    
    @Column({nullable: true})
    AlcoholName: string;

    @Column({nullable: true})
    category: number;

    @Column({nullable: true})
    brewery: string;

    @Column({nullable: true})
    price: number;

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

    @Column({nullable: true})
    alcoholImage: string;

    @OneToMany(type => Review, review => review.alcohol, {eager: true}) // 1:N relationship
    reviews: Review[] // 유저에 보드라는 컬럼 넣음. 여러개 넣을 수 있으니까 배열로
}