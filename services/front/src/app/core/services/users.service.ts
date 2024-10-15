import { Injectable } from '@angular/core';
import { AxiosService } from './axios.service';
import { IUser } from '../../shared/models/user.model';
import { Response } from '../../shared/models/response.model';

@Injectable({
    providedIn: 'root'
})
export class UsersService {
    constructor(private axiosService: AxiosService) {}

    /**
     * Get all users
     * @returns {Promise<Response<IUser[]>>} - The users
     */
    public async getAll(): Promise<Response<IUser[]>> {
        return await this.axiosService.get('/users');
    }

    /**
     * Get a user by their username
     * @param username {string} - The user's username
     * @returns {Promise<Response<IUser>>} - The user
     */
    public async get(username: string): Promise<Response<IUser>> {
        return this.axiosService.get(`/users/${username}`);
    }

    /**
     * Update a user's profile
     * @param username {string} - The user's username
     * @param data {Partial<IUser>} - The user's updated profile information
     * @returns {Promise<Response<IUser>>} - The updated user
     */
    public async update(username: string, data: Partial<IUser>): Promise<Response<IUser>> {
        return this.axiosService.put(`/users/${username}`, data);
    }

    public getProfilePicture(user: IUser): string {
        if (!user.profilePicture || user.profilePicture === '') {
            return 'https://www.w3schools.com/howto/img_avatar.png';
        }
        return `${user.profilePicture}`;
    }

    public async getReviews(user: IUser): Promise<Response<any>> {
        return this.axiosService.get(`/reviews/user/${user.username}`);
    }
}
