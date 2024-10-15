import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TmdbService } from '../../core/services/tmdb.service';
import { NgIf, NgOptimizedImage } from '@angular/common';
import { SearchListMoviesComponent } from '../../shared/components/search-list-movies/search-list-movies.component';
import { Genre, IGenre } from '../../shared/models/genre.model';
import { BackdropComponent } from '../../shared/components/backdrop/backdrop.component';
import { PageComponent } from '../../shared/components/page/page.component';
import { PageBackdropComponent } from '../../shared/components/page-backdrop/page-backdrop.component';

@Component({
    selector: 'app-movies-search',
    standalone: true,
    imports: [NgOptimizedImage, SearchListMoviesComponent, NgIf, BackdropComponent, PageComponent, PageBackdropComponent],
    templateUrl: './movies-search.component.html'
})
export class MoviesSearchComponent {
    protected genre: IGenre | undefined;
    protected movies: any[] = [];

    constructor(
        private route: ActivatedRoute,
        private tmdbService: TmdbService
    ) {}

    async ngOnInit(): Promise<void> {
        const queryGenre: string | undefined = this.route.snapshot.paramMap.get('genre') || undefined;
        if (!queryGenre) return;
        this.genre = Genre.fromSlug(queryGenre);
        if (!this.genre) return;
        this.movies = await this.tmdbService.getMoviesByGenre(this.genre.id);
    }
}
