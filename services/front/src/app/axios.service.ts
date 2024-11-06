import { Injectable } from '@angular/core';
import axios, { Axios, AxiosInstance } from 'axios';

@Injectable({
  providedIn: 'root'
})
export class AxiosService {

  private api: AxiosInstance;

  constructor() {

    this.api = axios.create({
      baseURL: 'http://restapi-service:3000',
      timeout: 1000
    });
  }

  public async register(options: { firstname: string, lastname: string, email: string, password: string }) {
    const route = (await this.api.post('/user/register', options));
    if(route.status === 201){
      localStorage.setItem('token', route.data.token);
    } else {
      console.error('Error registering user');
    }
  }

  public async login(options: { email: string, password: string }) {
    const route = (await this.api.post('/user/login', options));
    if(route.status === 200){
      localStorage.setItem('token', route.data.token);
    } else {
      console.error('Error logging in user');
    }
  }

  public isLoggedIn(){
    return localStorage.getItem('token') !== null;
  }
}
