import { EntityRepository, Repository } from "typeorm";
import { Movie } from "../Entity/box_office/movie.entity";

@EntityRepository(Movie)
export class MovieRepository extends Repository<Movie> {
    
}