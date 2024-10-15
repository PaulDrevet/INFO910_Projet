import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { StarsComponent } from '../../../../shared/components/stars/stars.component';
import { TablerIconsModule } from 'angular-tabler-icons';
import { RatingsGraphComponent } from '../../../../shared/components/ratings-graph/ratings-graph.component';
import { IMovie } from '../../../../shared/models/movie.model';
import { UserService } from '../../../../core/services/user.service';
import { IList } from '../../../../shared/models/list.model';
import { notyf } from '../../../../core/utils/notyf.utils';
import { ListsService } from '../../../../core/services/lists.service';
import { StarsHoverableComponent } from '../../../../shared/components/stars-hoverable/stars-hoverable.component';
import { SharedReviewService } from '../../../../core/services/shared-review.service';

@Component({
    selector: 'app-movie-details-interactions',
    standalone: true,
    imports: [StarsComponent, TablerIconsModule, RatingsGraphComponent, StarsHoverableComponent],
    templateUrl: './movie-details-interactions.component.html'
})
export class MovieDetailsInteractionsComponent implements OnInit, OnChanges {
    @Input() public reviews: any[] = [];
    @Input() public movie: IMovie = {} as IMovie;

    protected watchlist: number[] = [];
    protected userLists: IList[] = [];
    protected note: number = 0.1;
    protected userReview: any;

    constructor(
        protected userService: UserService,
        private listsService: ListsService,
        private reviewService: SharedReviewService
    ) {}

    public async ngOnInit(): Promise<void> {
        if(this.userService.isLoggedIn()){
            this.watchlist = this.userService.get().watchlist;
            this.userLists = (await this.userService.getLists()).data;
        }
        this.reviewService.selectedRating.subscribe((rating) => {
            this.note = rating;
        });
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['reviews']) {
            this.userReview = this.reviews.find((review) => review.user.username === this.userService.getUsername());
        }
    }

    protected changeRating(rating: number): void {
        this.reviewService.selectedRating.next(rating);
        if (this.userReview) {
            this.reviewService.updateReview().then((r) => {
                notyf.success('Note mise à jour avec succès');
            });
        } else {
            this.reviewService.postReview(this.movie.id).then((r) => {
                notyf.success('Note ajoutée avec succès');
            });
        }
    }

    protected isWatchlisted(movieId: number): boolean {
        return this.watchlist?.includes(movieId);
    }

    /**
     * Add a movie to the watchlist if it's not already there, remove it if it is
     * @param movie {IMovie} - The movie id
     */
    protected async toggleWatchlist(movie: IMovie): Promise<void> {
        if (this.isWatchlisted(movie?.id)) {
            this.watchlist = this.watchlist.filter((id) => id !== movie?.id);
            await this.userService.removeWatchlist(movie);
        } else {
            this.watchlist = [...this.watchlist, movie?.id];
            await this.userService.addWatchlist(movie);
        }
    }

    /**
     * Update the lists of a movie
     * @param movie {IMovie} The movie to update
     * @protected updateList
     */
    protected async updateList(movie: IMovie): Promise<void> {
        const checkboxes: NodeListOf<HTMLInputElement> = document.querySelectorAll(`[id^="lists-movie-${movie.id}"]`);
        checkboxes.forEach((checkbox) => {
            const listId: string = checkbox.id.split('-')[checkbox.id.split('-').length - 1];
            const isChecked: boolean = checkbox.checked;
            if (isChecked) {
                this.listsService.addMovie(Number(listId), movie.id).then(() => {
                    notyf.success(`Listes modifiées avec succès !`);
                });
            } else {
                this.listsService.removeMovie(Number(listId), movie.id).then(() => {
                    notyf.success(`Listes modifiées avec succès !`);
                });
            }
        });
    }
}
