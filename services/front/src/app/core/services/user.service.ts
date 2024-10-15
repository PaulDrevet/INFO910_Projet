import { Injectable } from '@angular/core';
import { AxiosService } from './axios.service';
import { Router } from '@angular/router';
import { Response } from '../../shared/models/response.model';
import { AuthenticationService } from './authentication.service';
import { IUser } from '../../shared/models/user.model';
import { TmdbService } from './tmdb.service';
import { IMovie } from '../../shared/models/movie.model';
import { notyf, success_watchlist } from '../utils/notyf.utils';
import { ListsService } from './lists.service';
import { IList } from '../../shared/models/list.model';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    constructor(
        private router: Router,
        private axiosService: AxiosService,
        private authenticationService: AuthenticationService,
        private tmdbService: TmdbService,
        private listService: ListsService
    ) {}

    /**
     * Get the authentication token from local storage
     * If the token is not found, return null
     * @returns {string | null} - The authentication token
     */
    public getAuthToken(): string | null {
        return localStorage.getItem('token');
    }

    /**
     * Get the username from local storage
     * If the username is not found, return null
     * @returns {string | null} - The username
     */
    public getUsername(): string | null {
        return this.get()?.username;
    }

    /**
     * Get the email from local storage
     * If the email is not found, return null
     */
    public getEmail(): string | null {
        return this.get().email;
    }

    /**
     * Check if the user is logged in
     * If the authentication token is found, the user is logged in, else the user is not logged in
     * @returns {boolean} - True if the user is logged in, false otherwise
     */
    public isLoggedIn(): boolean {
        return !!this.getAuthToken() && !!this.get();
    }

    public async getLists(): Promise<Response<IList[]>> {
        return await this.listService.getUserLists(this.getUsername()!);
    }

    /**
     * Retrieve the user's profile image url
     * @returns {string} - The user's profile image url
     */
    public getProfileImage(): string {
        if (!this.get()?.profilePicture || this.get()?.profilePicture === '') {
            return 'https://www.w3schools.com/howto/img_avatar.png';
        }
        return `${this.get().profilePicture}`;
    }

    /**
     * Get the user's profile information
     * @returns {Promise<IUser>} - The user's profile information
     * If the user's profile information is not found in local storage, retrieve it from the server
     * and store it in local storage
     */
    public get(): IUser {
        let user: string | null = sessionStorage.getItem('user');
        return JSON.parse(user!);
    }

    /**
     * Set the user's profile information in local storage
     * @param user {IUser} - The user's profile information
     */
    public set(user: IUser): void {
        sessionStorage.setItem('user', JSON.stringify(user));
    }

    /**
     * Update the user's profile information
     * @param data {any} - The user's updated profile information
     * @returns {Promise<any>} - The user's updated profile information
     */
    public async update(data: any): Promise<Response<IUser>> {
        return this.axiosService.put<IUser>(`/user/${this.getUsername()}`, data).then((response: Response<IUser>) => {
            sessionStorage.setItem('user', JSON.stringify(response.data));
            notyf.success('Profil mis à jour');
            return response;
        });
    }

    /**
     * Upload the user's profile picture
     * @param file {File} - The user's profile picture
     * @returns {Promise<any>} - The response from the server
     */
    public async updateProfilePicture(file: File): Promise<Response<IUser>> {
        const formData: FormData = new FormData();
        formData.append('file', file);
        return this.axiosService.post(`/user/${this.getUsername()}/profilePicture`, formData);
    }

    /**
     * Log the user out
     * Remove the authentication token and username from local storage
     * Redirect the user to the home page
     */
    public async logout(): Promise<void> {
        await this.authenticationService.logout();
        await this.router.navigateByUrl('/');
    }

    /**
     * Get the user's follows
     * @returns {Promise<any>} - The user's friends
     */
    public async getFollows(): Promise<Response<any>> {
        return this.axiosService.get(`/user/${this.getUsername()}/follows`);
    }

    /**
     * Get the user's follows details
     * @returns {Promise<any>} - The user's follows details
     */
    public async getFollowingDetails(): Promise<any> {
        return (await this.axiosService.get(`/user/${this.getUsername()}/following`)).data;
    }

    public async getUserDetails(): Promise<any> {
        return (await this.axiosService.get(`/user/${this.getUsername()}/details`)).data;
    }

    /**
     * Get the user's followers
     * @returns {Promise<any>} - The user's followers
     */
    public async getFollowers(): Promise<Response<any>> {
        return this.axiosService.get(`/user/${this.getUsername()}/followers`);
    }

    /**
     * Get the user's followers details
     * @returns {Promise<any>} - The user's followers details
     */
    public async getFollowersDetails(): Promise<any> {
        return (await this.axiosService.get(`/user/${this.getUsername()}/followers`)).data;
    }

    /**
     * Post a review
     * @param comment {string} - The review comment
     * @param movieId {number} - The movie id
     * @param rating {number} - The review rating
     * @param spoiler {boolean} - Is it a spoiler
     * @returns {Promise<any>} - The response from the server
     */
    public async postReview(comment: string, movieId: number, rating: number, spoiler: boolean): Promise<Response<any>> {
        return this.axiosService.post(`/users/${this.getUsername()}/reviews`, { comment, movieId, rating, spoiler });
    }

    public async getReviews(): Promise<any> {
        return (await this.axiosService.get(`/user/${this.getUsername()}/reviews`)).data;
    }

    /**
     * Update a review
     * @param reviewId {number} - The review id
     * @param comment {string} - The review comment
     * @param rating {number} - The review rating
     * @param spoiler {boolean} - Is it a spoiler
     * @returns {Promise<any>} - The response from the server
     */

    public async updateReview(reviewId: number, comment: string, rating: number, spoiler: boolean): Promise<Response<any>> {
        return this.axiosService.put(`/reviews/${reviewId}`, { comment, rating, spoiler });
    }

    /**
     * Delete a review
     * @param reviewId {number} - The review id
     * @returns {Promise<any>} - The response from the server
     */

    public async deleteReview(reviewId: number): Promise<Response<any>> {
        return this.axiosService.delete(`/reviews/${reviewId}`);
    }
    /**
     * Add a follow
     * @param username {string} - The follows username
     * @returns {Promise<any>} - The response from the server
     */
    public async addFollow(username: string): Promise<Response<IUser>> {
        return this.axiosService.post<IUser>(`/users/${this.getUsername()}/follows/${username}`).then((response: Response<IUser>) => {
            return response;
        });
    }

    /**
     * Remove a follow
     * @param username {string} - The follows username
     * @returns {Promise<any>} - The response from the server
     */
    public async removeFollow(username: string): Promise<Response<IUser>> {
        return this.axiosService.delete<IUser>(`/users/${this.getUsername()}/unfollows/${username}`).then((response: Response<IUser>) => {
            return response;
        });
    }

    /**
     * Get the user's watchlist
     * @returns {Promise<any>} - The user's watchlist
     */
    public async getWatchlistDetails(): Promise<IMovie[]> {
        const movieIds: number[] = (await this.axiosService.get<number[]>(`/user/${this.getUsername()}/watchlist`)).data;
        return await Promise.all(
            movieIds.map(async (movieId: number) => {
                return (await this.tmdbService.getMovieDetails(movieId)).data;
            })
        );
    }

    /**
     * Check if a movie is watchlisted by the user
     * @param movieId {number} - The movie id
     * @returns {Promise<boolean>} - True if the movie is watchlisted, false otherwise
     */
    public async isWatchlisted(movieId: number): Promise<boolean> {
        const movieIds: number[] = (await this.get()).watchlist;
        return movieIds.includes(movieId);
    }

    /**
     * Add a movie to the user's watchlist
     * @param movie {IMovie} - The movie id
     * @returns {Promise<any>} - The response from the server
     */
    public async addWatchlist(movie: IMovie): Promise<any> {
        const watchlist = await  this.axiosService.post<IUser>(`/user/${this.getUsername()}/watchlist/${movie?.id}`);
        this.setWatchlist(watchlist.data.watchlist);
        success_watchlist("Film ajouté à la watchlist !", movie);
    }

    /**
     * Remove a movie from the user's watchlist
     * @param movie {IMovie} - The movie id
     * @returns {Promise<any>} - The response from the server
     */
    public async removeWatchlist(movie: IMovie): Promise<any> {
        const watchlist = await this.axiosService.delete<IUser>(`/user/${this.getUsername()}/watchlist/${movie?.id}`);
        this.setWatchlist(watchlist.data.watchlist);
        success_watchlist("Film retiré de la watchlist !", movie);
    }

    private setWatchlist(watchlist: number[]): void {
        const user: IUser = this.get();
        user.watchlist = watchlist;
        this.set(user);
    }
}
