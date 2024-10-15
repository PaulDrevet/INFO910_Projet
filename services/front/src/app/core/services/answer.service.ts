import { Injectable } from '@angular/core';
import { UserService } from './user.service';
import { Response } from '../../shared/models/response.model';
import { AxiosService } from './axios.service';
import { Notyf } from 'notyf';

@Injectable({
    providedIn: 'root'
})
export class AnswerService {
    constructor(
        protected userService: UserService,
        private axiosService: AxiosService
    ) {}

    private notyf = new Notyf();

    public answers: any[] = [];
    comment: string = '';
    spoiler: boolean = false;
    answerId: number = 0;

    /**
     * Post an answer
     * @param reviewId {number} - The review id
     * @returns {Promise<any>} - The response from the server
     */
    public async postAnswer(reviewId: number): Promise<Response<any>> {
        return this.axiosService.post(`/reviews/${this.userService.getUsername()}/answer/${reviewId}`, {
            comment: this.comment,
            reviewId: reviewId,
            spoiler: this.spoiler
        });
    }

    /**
     * Update an answer
     * @returns {Promise<any>} - The response from the server
     */

    public async updateAnswer(): Promise<Response<any>> {
        return this.axiosService.put(`/answers/${this.answerId}`, {
            comment: this.comment,
            spoiler: this.spoiler
        });
    }

    /**
     * Delete an answer
     * @param answerId {number} - The answer id
     * @returns {Promise<any>} - The response from the server
     */

    public async deleteAnswer(answerId: number): Promise<Response<any>> {
        return this.axiosService.delete(`/answers/${answerId}`);
    }

    /**
     * Get all answers
     * @param reviewId {number} - The review id
     * @returns {Promise<any>} - The response from the server
     */
    public async getAnswers(reviewId: number): Promise<any> {
        return this.axiosService.get(`/answers/${reviewId}`);
    }

    /**
     * Add a like to answer
     * @param answerId {number} - The answer id
     * @param username {string} - The username
     * @returns {Promise<any>} - The response from the server
     */
    public async addLikeToAnswers(answerId: number, username: String | null): Promise<Response<any>> {
        return this.axiosService.put(`/answers/${username}/like/${answerId}`);
    }
}
