import { Genre, IGenre } from './genre.model';
import { slugify } from '../../core/utils/utilities.utils';

export class Movie {
    /**
     * Get the details page URL
     * @returns {string}
     */
    public static getDetailsPageUrl(movie: IMovie): string {
        return `/film/${movie.id}`;
    }

    /**
     * Slugify the movie title
     * @returns {string}
     */
    public static slug(movie: IMovie): string {
        return slugify(movie.title);
    }

    /**
     * Get the poster URL
     * @returns {string}
     */
    public static getPosterUrl(movie: IMovie): string {
        return `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
    }

    /**
     * Get the backdrop URL
     * @returns {string}
     */
    public static getBackdropUrl(movie: IMovie): string {
        return `https://image.tmdb.org/t/p/w500${movie.backdrop_path}`;
    }

    /**
     * Get the release year
     * @returns {number}
     */
    public static getReleaseYear(movie: IMovie): number {
        return new Date(movie.release_date).getFullYear();
    }

    /**
     *  Get the genres
     *  @returns {IGenre[]}
     */
    public static getGenres(movie: IMovie): IGenre[] {
        return movie.genre_ids.map((id) => Genre.fromId(id) as IGenre);
    }
}

export interface IMovie {
    adult: boolean;
    backdrop_path: string;
    genre_ids: number[];
    id: number;
    original_language: string;
    original_title: string;
    overview: string;
    popularity: number;
    poster_path: string;
    release_date: string;
    title: string;
    video: boolean;
    vote_average: number;
    vote_count: number;
}
