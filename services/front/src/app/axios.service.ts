import { Injectable } from '@angular/core';
import axios, { Axios, AxiosInstance } from 'axios';

@Injectable({
  providedIn: 'root'
})
export class AxiosService {

  private api: AxiosInstance;

  constructor() {
    // Définir les URLs principales et de secours
    const primaryBaseUrl: string = 'http://127.0.0.1:3000';
    const fallbackBaseUrl: string = 'http://185.229.202.135:30080';

    // Créer une instance Axios avec l'URL principale
    this.api = axios.create({
      baseURL: primaryBaseUrl,
      timeout: 5000
    });

    // Tester la connexion à l'URL principale et changer si elle est inaccessible
    this.testApiConnection(primaryBaseUrl, fallbackBaseUrl);
  }

  // Méthode pour tester la connexion à l'API
  private async testApiConnection(primaryUrl: string, fallbackUrl: string) {
    try {
      // Faire une requête GET pour tester l'URL principale
      await axios.get(`${primaryUrl}/healthcheck/`, { timeout: 2000 }); // Remplacer '/healthcheck' par un endpoint valide
    } catch (error) {
      console.warn(`Primary API URL ${primaryUrl} is unavailable, switching to fallback URL ${fallbackUrl}`);
      // Si la requête échoue, utiliser l'URL de secours
      this.api = axios.create({
        baseURL: fallbackUrl,
        timeout: 5000
      });
    }
  }

  // Méthode pour enregistrer un utilisateur
  public async register(options: { firstname: string, lastname: string, email: string, password: string }) {
    try {
      const route = await this.api.post('/user/register', options);
      if (route.status === 201) {
        localStorage.setItem('token', route.data.token);
      } else {
        console.error('Error registering user');
      }
    } catch (error) {
      console.error('Registration error:', error);
    }
  }

  // Méthode pour connecter un utilisateur
  public async login(options: { email: string, password: string }) {
    try {
      const route = await this.api.post('/user/login', options);
      if (route.status === 200) {
        localStorage.setItem('token', route.data.token);
      } else {
        console.error('Error logging in user');
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  }

  // Vérifier si l'utilisateur est connecté
  public isLoggedIn() {
    return localStorage.getItem('token') !== null;
  }
}
