import { Injectable } from '@angular/core';
import { UserService } from './user.service';
import { Response } from '../../shared/models/response.model';
import { BehaviorSubject } from 'rxjs';
import { AxiosService } from './axios.service';
import { Notyf } from 'notyf';

@Injectable({
    providedIn: 'root'
})
export class SharedReviewService {
    constructor(
        protected userService: UserService,
        private axiosService: AxiosService
    ) {}

    private notyf = new Notyf();

    selectedRating = new BehaviorSubject(0);
    selectedRating$ = this.selectedRating.asObservable();

    public reviews: any[] = [];
    comment: string = '';
    spoiler: boolean = false;
    reviewId: number = 0;
    answer: string = '';

    /**
     * Post a review
     * @param filmId {number} - The movie id
     * @returns {Promise<any>} - The response from the server
     */
    public async postReview(filmId: number): Promise<Response<any>> {
        return this.axiosService.post(`/users/${this.userService.getUsername()}/reviews`, {
            comment: this.comment,
            movieId: filmId,
            rating: this.selectedRating.getValue(),
            spoiler: this.spoiler
        });
    }

    /**
     * Update a review
     * @returns {Promise<any>} - The response from the server
     */

    public async updateReview(): Promise<Response<any>> {
        return this.axiosService.put(`/reviews/${this.reviewId}`, {
            comment: this.comment,
            rating: this.selectedRating.getValue(),
            spoiler: this.spoiler
        });
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
     * Get all reviews
     * @param filmId {number} - The movie id
     * @returns {Promise<any>} - The response from the server
     */
    public async getReviews(filmId: number): Promise<Response<any>> {
        return this.axiosService.get(`/movies/${filmId}/reviews`);
    }

    /**
     * Add a like
     * @param reviewId {number} - The review id
     * @param username {string} - The username
     * @returns {Promise<any>} - The response from the server
     */
    public async addLikeToReview(reviewId: number, username: String | null): Promise<Response<any>> {
        return this.axiosService.put(`/reviews/${username}/like/${reviewId}`);
    }
}
