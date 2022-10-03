import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Like } from "./like.entity";
import { Review } from "./review.entity";

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
    
    @Column({nullable: true})
    sweet: boolean;
    
    @Column({nullable: true})
    bitter: boolean;
    
    @Column({nullable: true})
    refreshing: boolean;
    
    @Column({nullable: true})
    clean: boolean;
    
    @Column({nullable: true})
    cool: boolean;
    @Column({nullable: true})
    sour: boolean;
    
    @Column({nullable: true})
    description: string;
    
    // 별점은 소수점 있어야 함. 별점들의 평균이므로
    @Column('numeric', {default: 0, nullable: true})
    star: number;

    @Column('numeric', {nullable: true})
    AlcoholByVolume: number;

    @Column({nullable: true})
    alcoholImage: string;

    @Column({default: 0, nullable: true})
    likeCount: number;

    // 찜하기
    @OneToMany(type =>Like, like => like.alcohol, {eager: false})
    like: Like[];

    // 리뷰
    // eager: true로 하면 개별 술 조회 시 리뷰도 같이 딸려 나옴
    @OneToMany(type => Review, review => review.alcohol, {eager: false}) // 1:N relationship
    reviews: Review[] // 유저에 리뷰라는 컬럼 넣음. 여러개 넣을 수 있으니까 배열로
}