import { Component, HostListener, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { HomeCarouselBackdropComponent } from './home-carousel-backdrop/home-carousel-backdrop.component';
import { HomeCarouselPostersComponent } from './home-carousel-posters/home-carousel-posters.component';
import { NgIf } from '@angular/common';
import { Movie } from '../../../../shared/models/movie.model';

@Component({
    selector: 'app-home-carousel',
    standalone: true,
    imports: [HomeCarouselBackdropComponent, HomeCarouselPostersComponent, NgIf],
    templateUrl: './home-carousel.component.html'
})
export class HomeCarouselComponent implements OnChanges, OnDestroy {
    @Input() movies: Movie[] = [];

    public movieSelected: any = null;
    public indexMovie: number = 1;

    private carousel: number = 0;
    private skipTime: number = 8000;
    private isAnimating: boolean = false;

    constructor() {}

    /**
     * Start the carousel, setting the first movie and starting the automatic navigation
     */
    private startCarousel(): void {
        this.movieSelected = this.movies[0];
        this.movies = [this.movies[this.movies.length - 1], ...this.movies];
        this.carousel = setInterval(() => this.navigateToMovie(this.indexMovie + 1), this.skipTime);
    }

    /**
     * Reset the carousel, clearing the interval and starting it again
     */
    private resetCarousel(): void {
        clearInterval(this.carousel);
        this.carousel = setInterval(() => this.navigateToMovie(this.indexMovie + 1), this.skipTime);
    }

    private navigateToMovie(index: number): void {
        this.indexMovie = index;
        this.movieSelected = this.movies[index];
        // Remove first element of movies and add it to the end
    }

    /**
     * Navigate to the next or previous movie
     * This function is triggered by the keyboard event on the posters
     * It resets the carousel to avoid the automatic navigation
     * @param direction {string} - The direction to navigate (prev or next)
     * @private
     */
    private navigate(direction: 'prev' | 'next'): void {
        if (this.isAnimating) return;
        this.isAnimating = true;
        setTimeout(() => (this.isAnimating = false), 300);
        this.navigateToMovie(direction === 'next' ? this.indexMovie + 1 : this.indexMovie - 1);
        this.resetCarousel();
    }

    /**
     * Select a movie from the carousel and navigate to its details
     * This function is triggered by the click event on the posters
     * @param movie {any} - The movie to select
     */
    public onSelectMovie(movie: any): void {
        this.navigateToMovie(this.movies.indexOf(movie));
        this.resetCarousel();
    }

    @HostListener('window:keydown', ['$event'])
    public handleKeyboardEvent(event: KeyboardEvent): void {
        if (event.key === 'ArrowRight') this.navigate('next');
        else if (event.key === 'ArrowLeft') this.navigate('prev');
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes['movies'] && this.movies.length > 0) {
            this.startCarousel();
        }
    }

    public ngOnDestroy(): void {
        clearInterval(this.carousel);
    }
}
