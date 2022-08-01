//import { Review } from "src/review/entities/review.entity";
import { ApiProperty } from "@nestjs/swagger";
import { User } from "src/auth/entities/user.entity";
import { BaseEntity, Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Review } from "./review.entity";

@Entity("Alcohol")
export class Alcohol extends BaseEntity {

    @ApiProperty({description: "술 pk 아이디 값"})
    @PrimaryGeneratedColumn() 
    id: number;
    
    @ApiProperty({description: "술 이름"})
    @Column({nullable: true})
    AlcoholName: string;
    
    @ApiProperty({description: "술 해당 카테고리"})
    @Column({nullable: true})
    category: number;
    
    @ApiProperty({description: "술 제조한 양조장"})
    @Column({nullable: true})
    brewery: string;
    
    @ApiProperty({description: "술 가격"})
    @Column({nullable: true})
    price: number;
    
    // https://it-timehacker.tistory.com/167
    @ApiProperty({description: "술 도수 정도"})
    @Column("decimal", {nullable: true})
    AlcoholByVolume: number;
    
    @ApiProperty({description: "술 달달함의 여부"})
    @Column({nullable: true})
    sweet: boolean;
    
    @ApiProperty({description: "술 씁쓸함의 여부"})
    @Column({nullable: true})
    bitter: boolean;
    
    @ApiProperty({description: "술 상큼함의 여부"})
    @Column({nullable: true})
    refreshing: boolean;
    
    @ApiProperty({description: "술 깔끔함의 여부"})
    @Column({nullable: true})
    clean: boolean;
    
    @ApiProperty({description: "술 청량함의 여부"})
    @Column({nullable: true})
    cool: boolean;
    
    @ApiProperty({description: "술 새콤달콤함의 여부"})
    @Column({nullable: true})
    sour: boolean;
    
    @ApiProperty({description: "해당 술에 대한 설명"})
    @Column({nullable: true})
    description: string;
    
    // 별점
    @ApiProperty({description: "해당 술에 대한 별점"})
    @Column("decimal", {nullable: true})
    star: number;
    
    @ApiProperty({description: "해당 술 이미지 url"})
    @Column({nullable: true})
    alcoholImage: string;
    
    @OneToMany(type => Review, review => review.alcohol, {eager: true}) // 1:N relationship
    reviews: Review[] // 유저에 보드라는 컬럼 넣음. 여러개 넣을 수 있으니까 배열로

    @ManyToMany(() => User, (user) => user.alcohols)
    user: User[];
}