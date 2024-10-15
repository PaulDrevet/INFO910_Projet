import { Component, Input, OnInit } from '@angular/core';
import { PosterComponent } from '../../../../shared/components/poster/poster.component';
import { StarsComponent } from '../../../../shared/components/stars/stars.component';
import { UserService } from '../../../../core/services/user.service';
import { TmdbService } from '../../../../core/services/tmdb.service';
import { NgForOf, NgIf } from '@angular/common';
import { UsersService } from '../../../../core/services/users.service';
import { Movie } from '../../../../shared/models/movie.model';
import { RouterLink } from '@angular/router';
import { User } from '../../../../shared/models/user.model';

@Component({
    selector: 'app-profile-classic',
    standalone: true,
    imports: [PosterComponent, StarsComponent, NgIf, NgForOf, RouterLink],
    templateUrl: './profile-classic.component.html'
})
export class ProfileClassicComponent implements OnInit {
    protected follows: any[] = [];
    @Input() reviews: any[] = [];

    constructor(
        private userService: UserService,
        private tmdbService: TmdbService,
        protected usersService: UsersService
    ) {}

    public async ngOnInit(): Promise<void> {
        this.follows = (await this.userService.getFollowingDetails()).data;

        this.reviews.map(async (review: any) => {
            review.movie = (await this.tmdbService.getMovieDetails(review.movieId)).data;
        });
    }

    protected readonly Movie = Movie;
    protected readonly User = User;
}
