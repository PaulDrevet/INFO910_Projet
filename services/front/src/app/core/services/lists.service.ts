import { Injectable } from '@angular/core';
import { AxiosService } from './axios.service';
import { Response } from '../../shared/models/response.model';
import { IList } from '../../shared/models/list.model';

@Injectable({
    providedIn: 'root'
})
export class ListsService {
    constructor(private axiosService: AxiosService) {}

    /**
     * Get all users
     * @param isPublic {boolean} - Whether to get public or private lists
     * @returns {Promise<Response<IUser[]>>} - The users
     */
    public async getAll(isPublic?: boolean): Promise<Response<IList[]>> {
        return await this.axiosService.get('/lists/', {
            params: { isPublic }
        });
    }

    /**
     * Get a list by their id
     * @param id {number} - The list's id
     */
    public async get(id: number): Promise<Response<IList>> {
        return this.axiosService.get(`/lists/${id}`);
    }

    /**
     * Get all lists by a user's username
     * @param username {string} - The user's username
     * @param isPublic
     */
    public async getUserLists(username: string, isPublic?: boolean): Promise<Response<IList[]>> {
        return this.axiosService.get(`/list/user/${username}`, {
            params: { isPublic }
        });
    }

    /**
     * Create a new list
     * @param data {IList} - The list's information
     */
    public async create(data: { name: string; description: string; isPublic: boolean; username: string }): Promise<Response<IList>> {
        return this.axiosService.post('/lists/', data);
    }

    /**
     * Delete a list
     * @param id {number} - The list's id
     * @returns {Promise<Response<IList>>} - The deleted list
     */
    public async delete(id: number): Promise<Response<IList>> {
        return this.axiosService.delete(`/lists/${id}`);
    }

    /**
     * Add a movie to a list
     * @param listId {number} - The list's id
     * @param movieId {number} - The movie's id
     * @returns {Promise<Response<IList>>} - The updated list
     */
    public async addMovie(listId: number, movieId: number): Promise<Response<IList>> {
        return this.axiosService.post(`/lists/${listId}/movies/${movieId}`);
    }

    /**
     * Remove a movie from a list
     * @param listId {number} - The list's id
     * @param movieId {number} - The movie's id
     * @returns {Promise<Response<IList>>} - The updated list
     */
    public async removeMovie(listId: number, movieId: number): Promise<Response<IList>> {
        return this.axiosService.delete(`/lists/${listId}/movies/${movieId}`);
    }
}
