import { Component, Input } from '@angular/core';
import { StarsComponent } from '../../../../shared/components/stars/stars.component';
import { Movie } from '../../../../shared/models/movie.model';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-home-movie-rating',
    standalone: true,
    imports: [StarsComponent, RouterLink],
    templateUrl: './home-movie-rating.component.html'
})
export class HomeMovieRatingComponent {
    @Input() rating: any;

    constructor() {}

    protected readonly Movie = Movie;
}
