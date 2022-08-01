import { EntityRepository, Repository } from "typeorm";
import { Movie } from "../Entity/movie.entity";

@EntityRepository(Movie)
export class MovieRepository extends Repository<Movie> {
    
}