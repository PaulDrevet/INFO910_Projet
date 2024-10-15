import { Component } from '@angular/core';
import { NgClass, NgIf, NgOptimizedImage } from '@angular/common';
import { SignupInformationComponent } from './signup-information/signup-information.component';
import { SignupPreferencesComponent } from './signup-preferences/signup-preferences.component';
import { LogoMoviePosterComponent } from '../../../shared/components/logo-movie-poster/logo-movie-poster.component';
import { SignupProgressionComponent } from './signup-progression/signup-progression.component';
import { SignupPasswordComponent } from './signup-password/signup-password.component';
import { Router, RouterLink } from '@angular/router';
import { SignupConfirmationComponent } from './signup-confirmation/signup-confirmation.component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PelliculumLogoTitleComponent } from '../../../shared/components/pelliculum-logo-title/pelliculum-logo-title.component';
import { AuthenticationService } from '../../../core/services/authentication.service';

@Component({
    selector: 'app-signup',
    standalone: true,
    imports: [
        NgClass,
        SignupInformationComponent,
        SignupPreferencesComponent,
        LogoMoviePosterComponent,
        NgOptimizedImage,
        SignupProgressionComponent,
        SignupPasswordComponent,
        RouterLink,
        SignupConfirmationComponent,
        SignupConfirmationComponent,
        ReactiveFormsModule,
        NgIf,
        PelliculumLogoTitleComponent
    ],
    templateUrl: './signup.component.html'
})
export class SignupComponent {
    step: number = 1;

    constructor(
        protected authenticationService: AuthenticationService,
        private router: Router
    ) {}

    registerForm = new FormGroup({
        accountDetails: new FormGroup({
            email: new FormControl('', [Validators.required, Validators.email]),
            firstname: new FormControl('', [Validators.required]),
            lastname: new FormControl('', [Validators.required])
        }),
        passwordDetails: new FormGroup({
            password: new FormControl('', [Validators.required]),
            confirmPassword: new FormControl('', [Validators.required])
        }),
        preferencesDetails: new FormGroup({
            discoverPossibilities: new FormControl('', [Validators.required])
        }),
        userDetails: new FormGroup({
            username: new FormControl('', [Validators.required])
        })
    });

    public async submit(): Promise<void> {
        const accountDetails = this.registerForm.get('accountDetails')?.value;
        const passwordDetails = this.registerForm.get('passwordDetails')?.value;
        const preferencesDetails = this.registerForm.get('preferencesDetails')?.value;
        const userDetails = this.registerForm.get('userDetails')?.value;
        await this.authenticationService.register({
            ...accountDetails,
            ...passwordDetails,
            ...preferencesDetails,
            ...userDetails
        });
        await this.router.navigateByUrl('/');
    }

    public incrementStep() {
        this.step += 1;
    }

    public get currentGroup(): FormGroup {
        return this.getGroupAt(this.step - 1);
    }

    private getGroupAt(index: number): FormGroup {
        const groups = Object.keys(this.registerForm.controls).map((groupName) => this.registerForm.get(groupName)) as FormGroup[];

        return groups[index];
    }
}
