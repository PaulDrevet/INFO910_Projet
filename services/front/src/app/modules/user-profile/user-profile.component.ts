import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UsersService } from '../../core/services/users.service';
import { IUser } from '../../shared/models/user.model';
import { NgIf } from '@angular/common';
import { ProfileClassicComponent } from '../profile/components/profile-classic/profile-classic.component';
import { ProfileFriendsComponent } from '../profile/components/profile-friends/profile-friends.component';
import { ProfileListsComponent } from '../profile/components/profile-lists/profile-lists.component';
import { ProfileWatchlistComponent } from '../profile/components/profile-watchlist/profile-watchlist.component';
import { ProfilesFilmsComponent } from '../profile/components/profiles-films/profiles-films.component';
import { TabComponent } from '../../shared/components/tabs/components/tab/tab.component';
import { TabsComponent } from '../../shared/components/tabs/tabs.component';
import { IMovie } from '../../shared/models/movie.model';
import { TmdbService } from '../../core/services/tmdb.service';
import { SearchListReviewsComponent } from '../../shared/components/search-list-reviews/search-list-reviews.component';
import { TablerIconsModule } from 'angular-tabler-icons';
import { UserService } from '../../core/services/user.service';
import { Notyf } from 'notyf';

@Component({
    selector: 'app-user-profile',
    standalone: true,
    imports: [NgIf, ProfileClassicComponent, ProfileFriendsComponent, ProfileListsComponent, ProfileWatchlistComponent, ProfilesFilmsComponent, TabComponent, TabsComponent, SearchListReviewsComponent, TablerIconsModule],
    templateUrl: './user-profile.component.html'
})
export class UserProfileComponent implements OnInit {
    private notyf: Notyf = new Notyf();

    protected username?: string | null;
    protected reviews: any[] = [];
    protected movie?: IMovie;
    protected user?: IUser;

    constructor(
        private activatedRoute: ActivatedRoute,
        protected usersService: UsersService,
        protected tmdbService: TmdbService,
        protected userService: UserService
    ) {}

    public async ngOnInit(): Promise<void> {
        this.username = this.activatedRoute.snapshot.paramMap.get('username');
        if (!this.username) return;
        this.user = (await this.usersService.get(this.username)).data;
        this.reviews = (await this.usersService.getReviews(this.user)).data;
        for (let review of this.reviews) {
            try {
                review.movie = (await this.tmdbService.getMovieDetails(review.movieId)).data;
            } catch (e) {}
        }
        if (this.reviews.length > 0) {
            this.movie = this.reviews[0].movie;
        } else {
            this.movie = (await this.tmdbService.getTopMovies())[0];
        }
    }

    protected addFollow(username: string): void {
        this.userService
            .addFollow(username)
            .then((r) => {
                this.notyf.success('Followed successfully');
            })
            .catch((e) => {
                console.error(e);
                this.notyf.error(e.response.data.message);
            });
    }
}
