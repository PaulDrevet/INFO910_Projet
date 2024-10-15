import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TmdbService } from '../../core/services/tmdb.service';
import { BackdropComponent } from '../../shared/components/backdrop/backdrop.component';
import { TablerIconsModule } from 'angular-tabler-icons';
import { PosterComponent } from '../../shared/components/poster/poster.component';
import { FormsModule } from '@angular/forms';
import { SearchListMoviesComponent } from '../../shared/components/search-list-movies/search-list-movies.component';
import { NgIf, NgOptimizedImage } from '@angular/common';
import { ListsService } from '../../core/services/lists.service';
import { IList } from '../../shared/models/list.model';
import { IMovie } from '../../shared/models/movie.model';
import { UsersService } from '../../core/services/users.service';

@Component({
    selector: 'app-movie-list-card',
    standalone: true,
    imports: [BackdropComponent, TablerIconsModule, PosterComponent, FormsModule, SearchListMoviesComponent, NgIf, NgOptimizedImage],
    templateUrl: './movie-list.component.html'
})
export class MovieListComponent implements OnInit {
    protected list?: IList;
    protected movies: IMovie[] = [];
    protected moviesCopy: IMovie[] = [];
    protected searchTerm: string = '';

    private isSortingByLikes: boolean = false;
    private isSortingByDate: boolean = false;

    constructor(
        private tmdbService: TmdbService,
        private activatedRoute: ActivatedRoute,
        private listsService: ListsService,
        protected usersService: UsersService
    ) {}

    async ngOnInit(): Promise<void> {
        const listID: string | null = this.activatedRoute.snapshot.paramMap.get('id');
        if (!listID) return;
        this.list = (await this.listsService.get(parseInt(listID))).data;
        this.list.movies.map(async (movieID: number) => {
            this.movies.push((await this.tmdbService.getMovieDetails(movieID)).data);
        });
        this.moviesCopy = this.movies;
    }
}
