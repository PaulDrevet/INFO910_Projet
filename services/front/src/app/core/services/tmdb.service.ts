import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { genres } from '../../configs/genres.config';
import axios from 'axios';
import { IMovie, Movie } from '../../shared/models/movie.model';
import { AxiosService } from './axios.service';
import { Response } from '../../shared/models/response.model';

@Injectable({
    providedIn: 'root'
})
export class TmdbService {
    private apiKey: string = 'efc1fdea36e98dc437d419f495a37666';
    private baseUrl: string = 'https://api.themoviedb.org/3';

    constructor(
        private http: HttpClient,
        private axiosService: AxiosService
    ) {}

    public async getTopMovies(): Promise<IMovie[]> {
        return (await axios.get(`${this.baseUrl}/movie/popular?api_key=${this.apiKey}&language=fr`)).data.results;
    }

    searchMovies(term: string): Observable<any> {
        if (!term.trim()) {
            return of([]);
        }

        const url = `${this.baseUrl}/search/movie?api_key=${this.apiKey}&include_adult=true&language=fr-FR&page=1&query=${term}`;

        return this.http.get(url).pipe(
            tap((data) => {
                if (data) {
                } else {
                }
            }),
            catchError(this.handleError('searchMovies', []))
        );
    }

    async getMovieDetails(movieId: number): Promise<Response<IMovie>> {
        return await axios.get(`${this.baseUrl}/movie/${movieId}?api_key=${this.apiKey}&language=fr`);
    }

    private handleError<T>(operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {
            console.error(`${operation} failed: ${error.message}`);
            return of(result as T);
        };
    }

    getUpcomingMovies() {
        // Check all movie in discover/movie endpoints with query params release_date.gte to today's date
        const url = `${this.baseUrl}/discover/movie?api_key=${this.apiKey}&include_adult=false&language=fr&primary_release_date.gte=${new Date().toISOString().split('T')[0]}`;
        return this.http.get(url);
    }

    getGenres(ids: number[]) {
        return genres.filter((genre) => ids.includes(genre.id));
    }

    getGenre(id: number) {
        return genres.find((genre) => genre.id === id);
    }

    getMovieCredits(movieId: number) {
        return axios.get(`${this.baseUrl}/movie/${movieId}/credits?api_key=${this.apiKey}&language=fr`);
    }

    public async getMoviesByGenre(genreId: number): Promise<Movie[]> {
        return (await axios.get(`${this.baseUrl}/discover/movie?api_key=${this.apiKey}&language=fr&with_genres=${genreId}`)).data.results;
    }

    public async getReviews(movieId: number): Promise<any> {
        return this.axiosService.get(`/reviews/${movieId}`);
    }

    public async getActorById(actorId: number) {
        return (await axios.get(`${this.baseUrl}/person/${actorId}?api_key=${this.apiKey}&language=fr`)).data;
    }

    public async getActorMovies(actorId: number) {
        return (await axios.get(`${this.baseUrl}/person/${actorId}/movie_credits?api_key=${this.apiKey}&language=fr`)).data;
    }
}
