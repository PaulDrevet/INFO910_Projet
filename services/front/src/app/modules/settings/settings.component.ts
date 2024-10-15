import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { UserService } from '../../core/services/user.service';
import { Response } from '../../shared/models/response.model';
import { IUser } from '../../shared/models/user.model';
import { StarsHoverableComponent } from '../../shared/components/stars-hoverable/stars-hoverable.component';
import { NgIf } from '@angular/common';
import { IMovie } from '../../shared/models/movie.model';
import { TmdbService } from '../../core/services/tmdb.service';

@Component({
    selector: 'app-settings',
    standalone: true,
    imports: [ReactiveFormsModule, StarsHoverableComponent, NgIf],
    templateUrl: './settings.component.html'
})
export class SettingsComponent {
    public static test = 'ok';
    public test: string = '';
    public user: any;
    protected movie?: IMovie;

    protected profileForm = new FormGroup({
        firstname: new FormControl('John', [Validators.required]),
        lastname: new FormControl('Doe', [Validators.required]),
        email: new FormControl({ value: 'john.doe@gmail.com', disabled: true }, [Validators.required, Validators.email]),
        username: new FormControl('JohnnyDowy', [Validators.required])
    });

    protected photo: SafeUrl = 'https://www.w3schools.com/howto/img_avatar.png';
    protected selectedFile: File | null = null;

    constructor(
        private sanitizer: DomSanitizer,
        protected userService: UserService,
        protected tmdbService: TmdbService
    ) {}

    public async ngOnInit(): Promise<void> {
        this.user = this.userService.get();
        this.profileForm.patchValue(this.user);
        this.photo = this.userService.getProfileImage();
        if (this.user.watchlist.length > 0) {
            this.movie = (await this.tmdbService.getMovieDetails(this.user.watchlist[0])).data;
        } else {
            const randomMovies: IMovie[] = await this.tmdbService.getTopMovies();
            this.movie = randomMovies[Math.floor(Math.random() * randomMovies.length)];
        }
    }

    public async save(): Promise<void> {
        if (!this.selectedFile) return;
        const responseProfile: Response<IUser> = await this.userService.updateProfilePicture(this.selectedFile);
        this.userService.set(responseProfile.data);
    }

    public onFileSelected(event: any): void {
        if (!event.target.files || !event.target.files[0]) return;
        this.selectedFile = event.target.files[0];
        const reader: FileReader = new FileReader();
        reader.onload = (e: any) => (this.photo = this.sanitizer.bypassSecurityTrustUrl(e.target.result));
        reader.readAsDataURL(this.selectedFile!);
    }
}
