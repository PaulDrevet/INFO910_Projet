import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PosterComponent } from '../poster/poster.component';
import { TablerIconsModule } from 'angular-tabler-icons';
import { TmdbService } from '../../../core/services/tmdb.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AsyncPipe, NgClass, NgIf } from '@angular/common';
import { genres } from '../../../configs/genres.config';
import { StarsComponent } from '../stars/stars.component';
import { UserService } from '../../../core/services/user.service';
import { IGenre } from '../../models/genre.model';
import { IMovie, Movie } from '../../models/movie.model';
import { ListsService } from '../../../core/services/lists.service';
import { notyf } from '../../../core/utils/notyf.utils';
import { IList } from '../../models/list.model';
import { StarsHoverableComponent } from '../stars-hoverable/stars-hoverable.component';

@Component({
    selector: 'app-search-list-reviews',
    standalone: true,
    imports: [FormsModule, PosterComponent, TablerIconsModule, NgClass, StarsComponent, RouterLink, AsyncPipe, StarsHoverableComponent, NgIf],
    templateUrl: './search-list-reviews.component.html'
})
export class SearchListReviewsComponent {
    @Input() public style?: string;
    @Input() public reviews: { rating: number; movie: IMovie }[] = [];
    @Input() public genreSelected?: { id: number; name: string; text: string } = undefined;

    public userLists: IList[] = [];

    public reviewsCopy: any[] = [];
    public searchTerm: string = '';

    /**
     * The user's watchlist, a copy from the session storage, used to check if a movie is in the watchlist
     */
    protected watchlist: number[] = [];

    protected isSortingByLikes: boolean = false;
    protected isSortingByDate: boolean = false;
    protected isSortingByGenre: boolean = false;
    protected isViewGrid: boolean = true;

    protected readonly genres: IGenre[] = genres;
    private sortingGenres: number[] = [];

    constructor(
        private tmdbService: TmdbService,
        private activatedRoute: ActivatedRoute,
        protected userService: UserService,
        protected listsService: ListsService
    ) {}

    async ngOnInit(): Promise<void> {
        this.userLists = (await this.userService.getLists()).data;
        this.watchlist = this.userService.get().watchlist;
        this.reviewsCopy = [...this.reviews];
    }

    protected preventRouterLink(event: MouseEvent): void {
        event.preventDefault();
        event.stopPropagation();
    }

    /**
     * Add a movie to the watchlist if it's not already there, remove it if it is
     * @param movie {IMovie} - The movie id
     * @param event {MouseEvent} - The click event
     */
    protected async toggleWatchlist(movie: IMovie, event: MouseEvent): Promise<void> {
        event.preventDefault();
        if (this.isWatchlisted(movie?.id)) {
            this.watchlist = this.watchlist.filter((id) => id !== movie?.id);
            await this.userService.removeWatchlist(movie);
        } else {
            this.watchlist = [...this.watchlist, movie?.id];
            await this.userService.addWatchlist(movie);
        }
    }

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

    protected isWatchlisted(movieId: number): boolean {
        return this.watchlist.includes(movieId);
    }

    protected isGenreSelected(genre: any): boolean {
        return this.genreSelected?.id === genre.id;
    }

    protected changeView(view: 'grid' | 'list'): void {
        this.isViewGrid = view === 'grid';
    }

    protected sortAndFilterMovies(): void {
        let reviews = [...this.reviewsCopy];
        if (this.isSortingByDate) reviews = this.sortByDate(reviews);
        if (this.isSortingByLikes) reviews = this.sortByLikes(reviews);
        if (this.isSortingByGenre) reviews = this.sortByGenre(reviews);
        if (this.searchTerm) reviews = this.searchMovies(reviews);
        this.reviews = reviews;
    }

    protected searchMovies(movies: any[]): any[] {
        return movies.filter((movie) => movie.title.toLowerCase().includes(this.searchTerm.toLowerCase()));
    }

    protected toggleSortByGenre(genre: number): void {
        this.sortingGenres = this.sortingGenres.includes(genre) ? this.sortingGenres.filter((g) => g !== genre) : [...this.sortingGenres, genre];
        this.isSortingByGenre = this.sortingGenres.length > 0;
        this.sortAndFilterMovies();
    }

    protected toggleSortByLikes(): void {
        this.isSortingByLikes = !this.isSortingByLikes;
        this.isSortingByDate = this.isSortingByLikes ? false : this.isSortingByDate;
        this.sortAndFilterMovies();
    }

    protected toggleSortByDate(): void {
        this.isSortingByDate = !this.isSortingByDate;
        this.isSortingByLikes = this.isSortingByDate ? false : this.isSortingByLikes;
        this.sortAndFilterMovies();
    }

    private sortByDate(reviews: { rating: number; movie: IMovie }[]): any[] {
        return reviews.sort((a, b) => new Date(b.movie.release_date).getTime() - new Date(a.movie.release_date).getTime());
    }

    private sortByLikes(reviews: { rating: number; movie: IMovie }[]): any[] {
        return reviews.sort((a, b) => b.rating - a.rating);
    }

    private sortByGenre(reviews: { rating: number; movie: IMovie }[]): any[] {
        return reviews.filter((review) => this.sortingGenres.includes(review.movie.genre_ids[0]));
    }

    protected readonly Number = Number;
    protected readonly Movie = Movie;
}
