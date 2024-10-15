import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { PosterComponent } from '../../../../../shared/components/poster/poster.component';
import { NgClass } from '@angular/common';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
    selector: 'app-home-carousel-posters',
    standalone: true,
    imports: [PosterComponent, NgClass],
    templateUrl: './home-carousel-posters.component.html',
    styles: ``
})
export class HomeCarouselPostersComponent implements OnInit, OnChanges {
    @Input() movies: any[] = [];
    @Input() currentMovie: any = null;
    @Input() indexMovie: number = 0;

    @Output() selectMovie: any = new EventEmitter<any>();

    currentPosition: number = 0;

    posterWidth: number = 130; // La largeur réelle de vos posters
    spaceBetweenPosters: number = 48; // Espace entre les posters (space-x-12 correspond à 3rem soit environ 48px)

    constructor(private responsive: BreakpointObserver) {}

    ngOnInit(): void {
        this.observeBreakpoints();
    }

    public goToMovie(index?: number): void {
        if (index) this.selectMovie.emit(this.movies[index]);
        this.currentPosition = (this.posterWidth + this.spaceBetweenPosters) * this.indexMovie;
    }

    observeBreakpoints(): void {
        this.responsive.observe([Breakpoints.XSmall, Breakpoints.Small, Breakpoints.Medium, Breakpoints.Large, Breakpoints.XLarge]).subscribe((result) => {
            if (result.matches) {
                if (result.breakpoints[Breakpoints.XSmall]) {
                    this.updateCarouselSize(60, 16); // Exemple pour xs
                } else if (result.breakpoints[Breakpoints.Small]) {
                    this.updateCarouselSize(75, 24); // Exemple pour sm
                } else if (result.breakpoints[Breakpoints.Medium]) {
                    this.updateCarouselSize(110, 32); // Exemple pour md
                } else if (result.breakpoints[Breakpoints.Large]) {
                    this.updateCarouselSize(120, 40); // Exemple pour lg
                } else if (result.breakpoints[Breakpoints.XLarge]) {
                    this.updateCarouselSize(130, 48); // Exemple pour xl
                }
            }
        });
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['currentMovie']) this.goToMovie();
    }

    private updateCarouselSize(width: number, spacing: number): void {
        this.posterWidth = width;
        this.spaceBetweenPosters = spacing;
        this.currentPosition = (this.posterWidth + this.spaceBetweenPosters) * this.indexMovie;
    }
}
