import { Injectable } from '@angular/core';
import { AxiosService } from './axios.service';
import { Response } from '../../shared/models/response.model';

@Injectable({
    providedIn: 'root'
})
export class AuthenticationService {
    constructor(private axiosService: AxiosService) {}

    /**
     * Set the authentication token in local storage
     * @param token {string} - The authentication token
     * If no token is provided, remove the token from local storage
     */
    private setAuthToken(token?: string): void {
        if (token) {
            localStorage.setItem('token', token);
        } else {
            localStorage.removeItem('token');
        }
    }

    /**
     * Set the username in local storage
     * @param username {string} - The username
     * If no username is provided, remove the username from local storage
     */
    private setUsername(username?: string): void {
        if (username) {
            localStorage.setItem('username', username);
        } else {
            localStorage.removeItem('username');
        }
    }

    private setUser(user: any): void {
        sessionStorage.setItem('user', JSON.stringify(user));
    }

    /**
     * Send a request to the server to log in a user
     * If the request is successful, set the user's authentication token and username
     * @param values {any} - The user's registration information
     */
    public async login(values: any): Promise<any> {
        localStorage.clear();
        const response: Response<{ token: string; user: any }> = await this.axiosService.post('/auth/login', values);
        this.setAuthToken(response.data.token);
        this.setUser(response.data.user);
    }

    /**
     * Send a request to the server to log out a user
     * If the request is successful, remove the user's authentication token and username
     */
    public async logout(): Promise<any> {
        localStorage.clear();
        sessionStorage.clear();
    }

    /**
     * Send a request to the server to register a new user
     * If the request is successful, set the user's authentication token and username (log the user in)
     * @param values {any} - The user's registration information
     */
    public async register(values: any): Promise<any> {
        localStorage.clear();
        const response: Response<{ token: string; user: any }> = await this.axiosService.post('/auth/register', values);
        this.setAuthToken(response.data.token);
        this.setUser(response.data.user);
    }

    /**
     * Check if the user exist
     * @param email {string} - The user's email
     * @returns {boolean} - True if the user exist, false otherwise
     */

    public async checkUser(email: string): Promise<boolean> {
        const response: Response<boolean> = await this.axiosService.get(`/auth/exist/${email}`);
        return response.data;
    }
}
