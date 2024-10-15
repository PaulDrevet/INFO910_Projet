import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgClass, NgForOf, NgIf, NgOptimizedImage } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';
import { Router, RouterLink } from '@angular/router';
import { TmdbService } from '../../../../core/services/tmdb.service';
import { SearchService } from '../../../../core/services/search.service';
import { PosterComponent } from '../../../../shared/components/poster/poster.component';
import { StarsComponent } from '../../../../shared/components/stars/stars.component';
import { IMovie } from '../../../../shared/models/movie.model';

@Component({
    selector: 'app-header-search',
    standalone: true,
    imports: [NgForOf, NgIf, ReactiveFormsModule, RouterLink, FormsModule, PosterComponent, NgClass, NgOptimizedImage, StarsComponent],
    templateUrl: './header-search.component.html'
})
export class HeaderSearchComponent implements OnInit, OnDestroy {
    searchQuery: string = '';
    movies: IMovie[] = [];

    private destroy$: Subject<void> = new Subject();
    @ViewChild('dropdownList') dropdownList!: ElementRef;

    constructor(
        private router: Router,
        private tmdbService: TmdbService,
        private searchService: SearchService
    ) {}

    ngOnInit(): void {
        this.searchService.searchResults$.pipe(takeUntil(this.destroy$)).subscribe((results) => {
            this.movies = results.results;
        });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    searchMovies(): void {
        this.tmdbService
            .searchMovies(this.searchQuery)
            .pipe(takeUntil(this.destroy$), debounceTime(300), distinctUntilChanged())
            .subscribe(
                (data) => {
                    if (this.searchQuery === '') {
                        this.movies = [];
                        return;
                    }
                    this.movies = data.results.slice(0, 5);
                    for (let i = 0; i < this.movies.length; i++) {
                        this.movies[i].release_date = this.movies[i].release_date.slice(0, 4);
                    }
                },
                (error) => {
                    console.error('Error:', error);
                }
            );
    }

    public onPosterError(event: any): void {
        event.target.src = 'https://dummyimage.com/40x60/eee/aaa.png&text=No+Image';
    }

    redirectToMovieDetails(movieId: number): void {
        this.searchQuery = '';
        this.searchService.setSearchQuery(this.searchQuery);
        this.router.navigate(['/film', movieId]);
    }

    getPosterUrl(posterPath: string): string {
        return `https://image.tmdb.org/t/p/w220_and_h330_face${posterPath}`;
    }
}
