import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { BackdropComponent } from '../../../../../shared/components/backdrop/backdrop.component';
import { StarsComponent } from '../../../../../shared/components/stars/stars.component';
import { IMovie, Movie } from '../../../../../shared/models/movie.model';
import { Genre, IGenre } from '../../../../../shared/models/genre.model';
import { RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';

@Component({
    selector: 'app-home-carousel-backdrop',
    standalone: true,
    imports: [BackdropComponent, StarsComponent, RouterLink, NgIf],
    templateUrl: './home-carousel-backdrop.component.html',
    styles: ``
})
export class HomeCarouselBackdropComponent implements OnChanges {
    @Input() movie: IMovie | undefined;

    protected genres: IGenre[] = [];

    constructor() {}

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes['movie']) this.genres = Genre.fromIds(this.movie?.genre_ids || []);
    }

    protected readonly Movie = Movie;

    protected getGenreUrl(genre: IGenre): string {
        return `/films/${Genre.slug(genre)}`;
    }
}
