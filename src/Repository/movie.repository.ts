import { EntityRepository, Repository } from "typeorm";
import { Movie } from "../Entity/box_office/movie.entity";

@EntityRepository(Movie)
export class MovieRepository extends Repository<Movie> {
    // 영화 사진 저장
    async putAlcoholImage(movie_id: number, url) {
        console.log('url is ', url[0]);
        this.update(movie_id, {
            image : url[0]
        })
    }
}