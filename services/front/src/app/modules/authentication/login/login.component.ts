import { Component } from '@angular/core';
import { SignupInformationComponent } from '../signup/signup-information/signup-information.component';
import { SignupPreferencesComponent } from '../signup/signup-preferences/signup-preferences.component';
import { NgOptimizedImage } from '@angular/common';
import { LogoMoviePosterComponent } from '../../../shared/components/logo-movie-poster/logo-movie-poster.component';
import { Router, RouterLink } from '@angular/router';
import { PosterComponent } from '../../../shared/components/poster/poster.component';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthenticationService } from '../../../core/services/authentication.service';
import { GoogleSigninButtonModule, SocialAuthService } from '@abacritt/angularx-social-login';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [SignupInformationComponent, SignupPreferencesComponent, NgOptimizedImage, LogoMoviePosterComponent, RouterLink, PosterComponent, FormsModule, ReactiveFormsModule, GoogleSigninButtonModule],
    templateUrl: './login.component.html'
})
export class LoginComponent {
    loginForm = new FormGroup({
        emailOrUsername: new FormControl('', [Validators.required]),
        password: new FormControl('', [Validators.required, Validators.minLength(5)])
    });

    constructor(
        private authentication: AuthenticationService,
        private router: Router,
        private socialAuthService: SocialAuthService,
        private authService: AuthenticationService
    ) {}

    ngOnInit(): void {
        this.socialAuthService.authState.subscribe((user) => {
            this.authService.checkUser(user.email).then((r) => {
                if (!r) {
                    this.authService
                        .register({
                            username: this.generateRidiculousName(),
                            password: user.id,
                            email: user.email,
                            firstname: user.firstName,
                            lastname: user.lastName
                        })
                        .then((r) => {});
                } else {
                    this.authService
                        .login({
                            email: user.email,
                            password: user.id
                        })
                        .then((r) => {});
                }
            });
        });
    }

    async login(): Promise<void> {
        await this.authentication.login(this.loginForm.value);
        await this.router.navigateByUrl('/');
    }

    private generateRidiculousName(): string {
        // Étendre les listes à 20 éléments
        const names = ['Griffon', 'Panda', 'Licorn', 'Dragon', 'Hibou', 'Troll', 'Elfe', 'Sorcier', 'Nain', 'Vampire', 'Zombie', 'Fantôme', 'Loup', 'Gobelin', 'Sirène', 'Centaur', 'Minotaure', 'Cyclope', 'Phénix', 'Fée', 'Farfadet', 'Mr.'];

        const adjectives = ['Volant', 'Dansant', 'Rieur', 'Étourdi', 'Majestueux', 'Invisible', 'Flamboyant', 'Géant', 'Miniature', 'Ancien', 'Mystique', 'Éclatant', 'Terrifiant', 'Glorieux', 'Furtif', 'Ailé', 'Aquatique', 'Cristallin', 'Lumineux', 'Sombre', 'Ping', 'Malicieux'];

        const randomName = names[Math.floor(Math.random() * names.length)];
        const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
        const randomNumber = Math.floor(Math.random() * 100); // Nombre entre 0 et 99

        // Construction du nouveau nom
        return `${randomName}${randomAdjective}${randomNumber}`;
    }
}
