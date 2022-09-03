import { Alcohol } from "src/Entity/Alcohol/alcohol.entity";
import { User } from "src/auth/entities/user.entity";
import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

export enum reviewStatus {
    SAVED = 'SAVED', // 저장
    TEMPORARY = 'TEMPORARY' // 임시 저장
}

@Entity("Review")
export class Review extends BaseEntity {
    @PrimaryGeneratedColumn() 
    id: number;

    // 리뷰 제목
    @Column({nullable: true})
    title: string;

    // 리뷰 내용
    @Column({nullable: true})
    content: string;

    // 별점. (리뷰 별점은 정수)
    @Column({nullable: true})
    star: number;

    // 리뷰 사진 url
    @Column("text", {array: true, nullable: true})
    reviewImgUrl: string[];

    // 작성 시간
    @CreateDateColumn() 
    date: Date;

    // 추천 수
    @Column({nullable: true})
    like: number;

    // 자동으로 만들어 지는데 직접 추가하면 find 시 userId도 나옴.
    @Column({nullable: true})
    userId: number;

    // 술 id
    @Column({nullable: true})
    alcoholId: number;

    // 상태 저장 플래그 --> 이거 dto에서 enum으로 바꿔야 함. 나중에 우선 하고 수정하기
    @Column({default: reviewStatus.SAVED, nullable: true})
    reviewStatus: reviewStatus;

    // 조회 수
    @Column({default: 0})
    viewCount: number;

    @ManyToOne(type => Alcohol, alcohol => alcohol.reviews, {eager: false}) // N:1 relationship
    alcohol: Alcohol; // 술 컬럼

    @ManyToOne(type => User, user => user.reviews, {eager: false}) // N:1 relationship
    user: User; // 유저 컬럼
}

